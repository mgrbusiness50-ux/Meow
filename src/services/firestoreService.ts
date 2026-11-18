import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, Auth, User } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Firestore,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  AppNotification,
  BlockedUser,
  ChatMessage,
  ContactRequest,
  Conversation,
  Pet,
  ReportRecord,
  UserProfile,
} from '../types.ts';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;
let connectionTested = false;

export function isFirestoreConfigured(): boolean {
  return Boolean(
    firebaseConfig &&
      firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.projectId !== 'remixed-project-id' &&
      firebaseConfig.firestoreDatabaseId
  );
}

function getFirebaseInstances(): { app: FirebaseApp; auth: Auth; db: Firestore } | null {
  if (!isFirestoreConfigured()) return null;
  if (!cachedApp) {
    cachedApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
  }
  if (!cachedAuth) {
    cachedAuth = getAuth(cachedApp);
  }
  if (!cachedDb) {
    // CRITICAL: Pass firestoreDatabaseId to connect to the provisioned Meow database
    cachedDb = getFirestore(cachedApp, firebaseConfig.firestoreDatabaseId);
  }
  return { app: cachedApp, auth: cachedAuth, db: cachedDb };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const instances = getFirebaseInstances();
  const currentUser = instances?.auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo:
        currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testFirestoreConnection(): Promise<void> {
  if (connectionTested) return;
  connectionTested = true;
  const instances = getFirebaseInstances();
  if (!instances) return;
  try {
    await getDocFromServer(doc(instances.db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

function sanitizeId(raw: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  return cleaned || `id_${Date.now()}`;
}

function clampStr(raw: string | undefined, maxLen: number): string {
  return (raw || '').trim().slice(0, maxLen);
}

function getVerifiedCurrentUser(): { db: Firestore; user: User } | null {
  const instances = getFirebaseInstances();
  if (!instances) return null;
  const user = instances.auth.currentUser;
  if (!user || !user.uid || !user.emailVerified) return null;
  return { db: instances.db, user };
}

export function subscribeToAuthSession(
  onAuthenticated: (uid: string) => void,
  onSignedOut?: () => void
): Unsubscribe {
  const instances = getFirebaseInstances();
  if (!instances) return () => {};
  return onAuthStateChanged(instances.auth, (user) => {
    if (user && user.uid && user.emailVerified) {
      onAuthenticated(user.uid);
    } else if (onSignedOut) {
      onSignedOut();
    }
  });
}

export async function syncUserProfileToFirestore(profile: UserProfile): Promise<void> {
  const ctx = getVerifiedCurrentUser();
  if (!ctx) return;
  const uid = sanitizeId(ctx.user.uid);
  const publicPath = `users/${uid}`;
  const privatePath = `users/${uid}/private/info`;

  try {
    const publicRef = doc(ctx.db, 'users', uid);
    const snap = await getDoc(publicRef);
    const publicPayload = {
      uid,
      name: clampStr(profile.name, 100) || 'مستخدم Meow',
      avatar: clampStr(profile.avatar, 1000),
      city: clampStr(profile.city, 100),
      governorate: clampStr(profile.governorate, 100),
      showPhoneInProfile: Boolean(profile.showPhoneInProfile),
      notificationsEnabled: profile.notificationsEnabled !== false,
      updatedAt: serverTimestamp(),
      ...(snap.exists() ? {} : { createdAt: serverTimestamp() }),
    };

    if (snap.exists()) {
      await updateDoc(publicRef, {
        name: publicPayload.name,
        avatar: publicPayload.avatar,
        city: publicPayload.city,
        governorate: publicPayload.governorate,
        showPhoneInProfile: publicPayload.showPhoneInProfile,
        notificationsEnabled: publicPayload.notificationsEnabled,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(publicRef, publicPayload);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, publicPath);
  }

  try {
    const privateRef = doc(ctx.db, 'users', uid, 'private', 'info');
    await setDoc(privateRef, {
      uid,
      email: clampStr(profile.email || ctx.user.email || '', 254),
      phone: clampStr(profile.phone, 32),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, privatePath);
  }
}

export async function loadUserPreferencesFromFirestore(): Promise<{
  showPhoneInProfile?: boolean;
  notificationsEnabled?: boolean;
  name?: string;
  city?: string;
  governorate?: string;
  phone?: string;
} | null> {
  const ctx = getVerifiedCurrentUser();
  if (!ctx) return null;
  const uid = sanitizeId(ctx.user.uid);
  const publicPath = `users/${uid}`;
  try {
    const publicSnap = await getDoc(doc(ctx.db, 'users', uid));
    const privateSnap = await getDoc(doc(ctx.db, 'users', uid, 'private', 'info'));
    if (!publicSnap.exists() && !privateSnap.exists()) return null;
    const pub = publicSnap.data() || {};
    const priv = privateSnap.data() || {};
    return {
      showPhoneInProfile: typeof pub.showPhoneInProfile === 'boolean' ? pub.showPhoneInProfile : undefined,
      notificationsEnabled:
        typeof pub.notificationsEnabled === 'boolean' ? pub.notificationsEnabled : undefined,
      name: typeof pub.name === 'string' ? pub.name : undefined,
      city: typeof pub.city === 'string' ? pub.city : undefined,
      governorate: typeof pub.governorate === 'string' ? pub.governorate : undefined,
      phone: typeof priv.phone === 'string' ? priv.phone : undefined,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, publicPath);
  }
}

export async function syncPetToFirestore(pet: Pet): Promise<void> {
  const ctx = getVerifiedCurrentUser();
  if (!ctx) return;
  const uid = sanitizeId(ctx.user.uid);
  const petId = sanitizeId(pet.id);
  const path = `pets/${petId}`;
  try {
    const petRef = doc(ctx.db, 'pets', petId);
    const snap = await getDoc(petRef);
    const payload = {
      id: petId,
      ownerId: uid,
      ownerName: clampStr(pet.ownerName, 100) || 'مستخدم Meow',
      ownerShowPhone: Boolean(pet.ownerShowPhone),
      ownerPrivacy: pet.ownerPrivacy || (pet.ownerShowPhone ? 'public' : 'private'),
      name: clampStr(pet.name, 80) || 'أليف',
      species: pet.species,
      breed: clampStr(pet.breed, 100),
      hybridBreed: clampStr(pet.hybridBreed, 100),
      color: clampStr(pet.color, 60),
      gender: pet.gender,
      ageYears: Math.min(40, Math.max(0, Number(pet.ageYears) || 0)),
      ageMonths: Math.min(11, Math.max(0, Number(pet.ageMonths) || 0)),
      status: pet.status,
      vaccinationStatus: pet.vaccinationStatus || 'not_vaccinated',
      healthStatus: clampStr(pet.healthStatus, 40),
      healthNotes: clampStr(pet.healthNotes, 600),
      city: clampStr(pet.city, 100),
      governorate: clampStr(pet.governorate, 100),
      photosCount: Math.min(10, Math.max(0, pet.photos?.length || 0)),
      updatedAt: serverTimestamp(),
      ...(snap.exists() ? {} : { createdAt: serverTimestamp() }),
    };

    if (snap.exists()) {
      const { id: _id, ownerId: _ownerId, createdAt: _createdAt, ...updatable } = payload;
      await updateDoc(petRef, updatable);
    } else {
      await setDoc(petRef, payload);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deletePetFromFirestore(petId: string): Promise<void> {
  const ctx = getVerifiedCurrentUser();
  if (!ctx) return;
  const safeId = sanitizeId(petId);
  const path = `pets/${safeId}`;
  try {
    await deleteDoc(doc(ctx.db, 'pets', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function syncNotificationToFirestore(notification: AppNotification): Promise<void> {
  const ctx = getVerifiedCurrentUser();
  if (!ctx) return;
  const uid = sanitizeId(ctx.user.uid);
  const notifId = sanitizeId(notification.id);
  const path = `users/${uid}/notifications/${notifId}`;
  try {
    const notifRef = doc(ctx.db, 'users', uid, 'notifications', notifId);
    const snap = await getDoc(notifRef);
    if (snap.exists()) {
      const existingData = snap.data();
      const updates: Record<string, unknown> = {
        read: Boolean(notification.read),
        updatedAt: serverTimestamp(),
      };
      if (notification.celebrated && existingData?.celebrated === false) {
        updates.celebrated = true;
      }
      await updateDoc(notifRef, updates);
    } else {
      const docData: Record<string, unknown> = {
        id: notifId,
        userId: uid,
        type: notification.type,
        title: clampStr(notification.title, 140) || 'إشعار Meow',
        body: clampStr(notification.body, 500) || 'لديك تحديث جديد في Meow.',
        read: Boolean(notification.read),
        celebrated: Boolean(notification.celebrated),
        targetTab: notification.targetTab === 'clinic' || notification.targetTab === 'store' ? 'chat' : notification.targetTab,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (notification.targetRequestId) {
        docData.targetRequestId = sanitizeId(notification.targetRequestId);
      }
      if (notification.targetConversationId) {
        docData.targetConversationId = sanitizeId(notification.targetConversationId);
      }
      if (notification.targetPetId) {
        docData.targetPetId = sanitizeId(notification.targetPetId);
      }
      await setDoc(notifRef, docData);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeUserNotifications(
  onNotifications: (items: AppNotification[]) => void
): Unsubscribe {
  const ctx = getVerifiedCurrentUser();
  if (!ctx) return () => {};
  const uid = sanitizeId(ctx.user.uid);
  const path = `users/${uid}/notifications`;
  const q = query(
    collection(ctx.db, 'users', uid, 'notifications'),
    where('userId', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(40)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const list: AppNotification[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: String(data.id || d.id),
          type: (data.type || 'system') as AppNotification['type'],
          title: String(data.title || 'إشعار Meow'),
          body: String(data.body || ''),
          read: Boolean(data.read),
          celebrated: Boolean(data.celebrated),
          targetTab: (data.targetTab || 'chat') as AppNotification['targetTab'],
          targetSubTab: data.type === 'contact_request' ? 'requests' : 'chats',
          targetRequestId: typeof data.targetRequestId === 'string' ? data.targetRequestId : undefined,
          targetConversationId:
            typeof data.targetConversationId === 'string' ? data.targetConversationId : undefined,
          targetPetId: typeof data.targetPetId === 'string' ? data.targetPetId : undefined,
          createdAt: new Date().toISOString(),
          timestampLabel: 'الآن',
        };
      });
      onNotifications(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
}

export async function syncContactRequestToFirestore(req: ContactRequest): Promise<void> {
  const ctx = getVerifiedCurrentUser();
  if (!ctx) return;
  const uid = sanitizeId(ctx.user.uid);
  const reqId = sanitizeId(req.id);
  const receiverPetId = sanitizeId(req.receiverPetId);
  const path = `contactRequests/${reqId}`;

  try {
    // Only sync requests whose receiver pet exists in Firestore or belongs to a real user flow
    const petSnap = await getDoc(doc(ctx.db, 'pets', receiverPetId));
    if (!petSnap.exists()) return;

    const reqRef = doc(ctx.db, 'contactRequests', reqId);
    const snap = await getDoc(reqRef);
    const receiverOwnerId = sanitizeId(String(petSnap.data()?.ownerId || req.receiverOwnerId || uid));

    if (!snap.exists()) {
      if (sanitizeId(req.senderId) !== uid && req.senderId !== 'user_me_100') return;
      const docData: Record<string, unknown> = {
        id: reqId,
        senderId: uid,
        senderName: clampStr(req.senderName, 100) || 'مستخدم Meow',
        receiverOwnerId,
        receiverPetId,
        receiverPetName: clampStr(req.receiverPetName, 100) || 'أليف',
        message: clampStr(req.message, 1000) || 'طلب تواصل',
        type: req.type,
        status: 'pending',
        celebratedBySender: false,
        celebratedByReceiver: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      if (req.senderPetId) docData.senderPetId = sanitizeId(req.senderPetId);
      if (req.senderPetName) docData.senderPetName = clampStr(req.senderPetName, 100);
      await setDoc(reqRef, docData);
    } else {
      const existingData = snap.data();
      if (
        existingData?.status === 'pending' &&
        existingData?.receiverOwnerId === uid &&
        (req.status === 'accepted' || req.status === 'rejected')
      ) {
        await updateDoc(reqRef, {
          status: req.status,
          updatedAt: serverTimestamp(),
        });
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function markMatingCelebratedInFirestore(requestId: string): Promise<void> {
  const ctx = getVerifiedCurrentUser();
  if (!ctx) return;
  const uid = sanitizeId(ctx.user.uid);
  const reqId = sanitizeId(requestId);
  const path = `contactRequests/${reqId}`;
  try {
    const reqRef = doc(ctx.db, 'contactRequests', reqId);
    const snap = await getDoc(reqRef);
    if (!snap.exists()) return;
    const data = snap.data();
    if (data?.status !== 'accepted') return;
    if (data.senderId === uid && data.celebratedBySender === false) {
      await updateDoc(reqRef, { celebratedBySender: true, updatedAt: serverTimestamp() });
    } else if (data.receiverOwnerId === uid && data.celebratedByReceiver === false) {
      await updateDoc(reqRef, { celebratedByReceiver: true, updatedAt: serverTimestamp() });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function syncConversationToFirestore(conv: Conversation): Promise<void> {
  const ctx = getVerifiedCurrentUser();
  if (!ctx) return;
  const uid = sanitizeId(ctx.user.uid);
  const convId = sanitizeId(conv.id);
  const reqId = sanitizeId(conv.requestId);
  const otherUid = sanitizeId(conv.otherUserId || `owner_${conv.petId}`);
  if (otherUid === uid) return;
  const path = `conversations/${convId}`;
  try {
    const reqSnap = await getDoc(doc(ctx.db, 'contactRequests', reqId));
    if (!reqSnap.exists()) return;

    const convRef = doc(ctx.db, 'conversations', convId);
    const snap = await getDoc(convRef);
    if (!snap.exists()) {
      await setDoc(convRef, {
        id: convId,
        requestId: reqId,
        participantA: uid,
        participantB: otherUid,
        petId: sanitizeId(conv.petId),
        petName: clampStr(conv.petName, 100) || 'أليف',
        petType: conv.petType,
        lastMessage: clampStr(conv.lastMessage, 1000),
        isPinnedByA: Boolean(conv.isPinned),
        isPinnedByB: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(convRef, {
        lastMessage: clampStr(conv.lastMessage, 1000),
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function syncChatMessageToFirestore(
  conversationId: string,
  message: ChatMessage
): Promise<void> {
  const ctx = getVerifiedCurrentUser();
  if (!ctx) return;
  const uid = sanitizeId(ctx.user.uid);
  const convId = sanitizeId(conversationId);
  const msgId = sanitizeId(message.id);
  const path = `conversations/${convId}/messages/${msgId}`;
  try {
    const convSnap = await getDoc(doc(ctx.db, 'conversations', convId));
    if (!convSnap.exists()) return;
    await setDoc(doc(ctx.db, 'conversations', convId, 'messages', msgId), {
      id: msgId,
      conversationId: convId,
      senderId: uid,
      senderName: clampStr(message.senderName, 100) || 'مستخدم Meow',
      type: message.type || 'text',
      text: clampStr(message.text, 2000),
      createdAt: serverTimestamp(),
    });
    await updateDoc(doc(ctx.db, 'conversations', convId), {
      lastMessage: clampStr(message.text || `[${message.type || 'text'}]`, 1000),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function syncBlockedUserToFirestore(blocked: BlockedUser, remove = false): Promise<void> {
  const ctx = getVerifiedCurrentUser();
  if (!ctx) return;
  const uid = sanitizeId(ctx.user.uid);
  const blockedId = sanitizeId(blocked.userId);
  if (blockedId === uid) return;
  const path = `users/${uid}/blockedUsers/${blockedId}`;
  try {
    const ref = doc(ctx.db, 'users', uid, 'blockedUsers', blockedId);
    if (remove) {
      await deleteDoc(ref);
    } else {
      await setDoc(ref, {
        userId: blockedId,
        userName: clampStr(blocked.userName, 100) || 'مستخدم',
        ...(blocked.petName ? { petName: clampStr(blocked.petName, 80) } : {}),
        createdAt: serverTimestamp(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function syncReportToFirestore(report: ReportRecord): Promise<void> {
  const ctx = getVerifiedCurrentUser();
  if (!ctx) return;
  const uid = sanitizeId(ctx.user.uid);
  const reportId = sanitizeId(report.id);
  const path = `reports/${reportId}`;
  try {
    await setDoc(doc(ctx.db, 'reports', reportId), {
      id: reportId,
      reporterId: uid,
      targetUserId: sanitizeId(report.targetUserId),
      targetUserName: clampStr(report.targetUserName, 100) || 'مستخدم',
      targetType: report.targetType,
      reason: report.reason,
      reasonLabel: clampStr(report.reasonLabel, 120) || 'بلاغ',
      details: clampStr(report.details, 1000),
      status: 'pending_review',
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
