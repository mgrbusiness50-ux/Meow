import type { RealtimeChannel } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient.ts';
import { resolveConversationMediaUrls } from './supabaseChatService.ts';
import {
  CustomStickerModel,
  DbBlockedUserRow,
  DbContactRequestRow,
  DbConversationRow,
  DbConversationUserStateRow,
  DbGroupAdoptionMemberRow,
  DbHealthRecordRow,
  DbMessageRow,
  DbNotificationRow,
  DbPetRow,
  DbProfileRow,
  DbReportRow,
  DbSavedPetRow,
  DbUserCustomStickerRow,
  MappedContactRequest,
  formatArabicClock,
  isConversationVisibleToUser,
  mapContactFormToSupportInsert,
  mapContactRequestToDbInsert,
  mapCustomStickerToDbInsert,
  mapDbBlockedUserToModel,
  mapDbContactRequestToModel,
  mapDbConversationToModel,
  mapDbCustomStickerToModel,
  mapDbHealthRecordToModel,
  mapDbNotificationToModel,
  mapDbPetToModel,
  mapDbReportToModel,
  mapGroupMemberToDbInsert,
  mapHealthRecordToDbPayload,
  mapPetToDbPayload,
} from './supabaseMappers.ts';
import type {
  AppNotification,
  BlockedUser,
  ChatMessage,
  Conversation,
  GroupAdoptionMember,
  HealthRecordItem,
  Pet,
  ReportRecord,
} from '../types.ts';
import { generateUuid, isValidUuid } from '../utils/uuid.ts';

export interface SupabaseActionResult<T = void> {
  success: boolean;
  data?: T;
  errorMessage?: string;
}

export interface HydratedSupabaseWorkspace {
  userPets: Pet[];
  userGroupAdoptionListing: Pet | null;
  matingPets: Pet[];
  adoptionPets: Pet[];
  savedPetIds: string[];
  contactRequests: MappedContactRequest[];
  conversations: Conversation[];
  notifications: AppNotification[];
  healthRecords: HealthRecordItem[];
  blockedUsers: BlockedUser[];
  reports: ReportRecord[];
  customStickers: CustomStickerModel[];
}

function getDbErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === 'object' && err !== null) {
    const code = String((err as { code?: unknown }).code || '').trim();
    const message = String((err as { message?: unknown }).message || '').trim();
    const lower = message.toLowerCase();

    if (code === '42501' || lower.includes('row-level security')) {
      return 'لا تمتلك صلاحية لتنفيذ هذه العملية.';
    }
    if (code === '23505' || lower.includes('duplicate key')) {
      return 'يوجد طلب أو سجل مطابق قيد الانتظار بالفعل.';
    }
    if (lower.includes('mating request requires sender_pet_id') || lower.includes('sender pet must be eligible')) {
      return 'يجب أن يكون لديك أليف معروض للتزاوج قبل إرسال طلب تزاوج.';
    }
    if (lower.includes('blocked')) {
      return 'تعذر تنفيذ العملية لأن أحد الطرفين محظور.';
    }
    if (lower.includes('failed to fetch') || lower.includes('network')) {
      return 'تعذر الاتصال بالخادم. تحقق من اتصال الإنترنت وحاول مرة أخرى.';
    }
  }
  return fallback;
}

function resolveCurrentUserIdSync(explicitId?: string | null): string | null {
  if (explicitId && isValidUuid(explicitId)) return explicitId;
  return null;
}

async function fetchProfilesMap(userIds: string[]): Promise<Map<string, Partial<DbProfileRow>>> {
  const map = new Map<string, Partial<DbProfileRow>>();
  const client = getSupabaseClient();
  if (!client || userIds.length === 0) return map;

  const uniqueIds = Array.from(new Set(userIds.filter((id) => isValidUuid(id))));
  if (uniqueIds.length === 0) return map;

  const { data } = await client
    .from('profiles')
    .select('id, name, avatar_url, show_phone_in_profile, privacy_mode, city, governorate')
    .in('id', uniqueIds)
    .is('deleted_at', null);

  if (Array.isArray(data)) {
    for (const row of data as unknown as Partial<DbProfileRow>[]) {
      if (row.id) {
        map.set(row.id, row);
      }
    }
  }
  return map;
}

async function fetchAllowedPhonesMap(
  profilesMap: Map<string, Partial<DbProfileRow>>
): Promise<Map<string, string>> {
  const phoneMap = new Map<string, string>();
  const client = getSupabaseClient();
  if (!client) return phoneMap;

  const allowedUserIds = Array.from(profilesMap.values())
    .filter((p) => p.id && p.show_phone_in_profile)
    .map((p) => p.id as string);

  if (allowedUserIds.length === 0) return phoneMap;

  await Promise.all(
    allowedUserIds.map(async (uid) => {
      try {
        const { data } = await client.rpc('get_owner_phone_if_allowed', {
          target_user_id: uid,
        });
        if (typeof data === 'string' && data.trim()) {
          phoneMap.set(uid, data.trim());
        }
      } catch {
        // Ignore single phone fetch failure
      }
    })
  );
  return phoneMap;
}

export async function hydrateSupabaseWorkspace(
  currentUserId: string
): Promise<SupabaseActionResult<HydratedSupabaseWorkspace>> {
  if (!isSupabaseConfigured()) {
    return { success: false, errorMessage: 'Supabase غير مُعد.' };
  }
  const client = getSupabaseClient();
  if (!client || !isValidUuid(currentUserId)) {
    return { success: false, errorMessage: 'جلسة المستخدم غير صالحة.' };
  }

  try {
    const [
      petsRes,
      savedRes,
      requestsRes,
      convRes,
      convStateRes,
      notifRes,
      healthRes,
      blockedRes,
      reportsRes,
      stickersRes,
    ] = await Promise.all([
      client
        .from('pets')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(300),
      client.from('saved_pets').select('user_id, pet_id, created_at').eq('user_id', currentUserId),
      client
        .from('contact_requests')
        .select('*')
        .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false })
        .limit(200),
      client
        .from('conversations')
        .select('*')
        .or(`user_a_id.eq.${currentUserId},user_b_id.eq.${currentUserId}`)
        .order('last_message_at', { ascending: false })
        .limit(150),
      client
        .from('conversation_user_state')
        .select('*')
        .eq('user_id', currentUserId),
      client
        .from('notifications')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('dismissed', false)
        .order('created_at', { ascending: false })
        .limit(100),
      client
        .from('health_records')
        .select('*')
        .eq('owner_id', currentUserId)
        .is('deleted_at', null)
        .order('record_date', { ascending: false })
        .limit(150),
      client
        .from('blocked_users')
        .select('*')
        .eq('blocker_id', currentUserId)
        .order('created_at', { ascending: false }),
      client
        .from('reports')
        .select('*')
        .eq('reporter_id', currentUserId)
        .order('created_at', { ascending: false }),
      client
        .from('user_custom_stickers')
        .select('*')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false }),
    ]);

    const petRows = (petsRes.data as unknown as DbPetRow[]) || [];
    const requestRows = (requestsRes.data as unknown as DbContactRequestRow[]) || [];
    const convRows = (convRes.data as unknown as DbConversationRow[]) || [];
    const convStateRows = (convStateRes.data as unknown as DbConversationUserStateRow[]) || [];
    const notifRows = (notifRes.data as unknown as DbNotificationRow[]) || [];
    const savedRows = (savedRes.data as unknown as DbSavedPetRow[]) || [];
    const healthRows = (healthRes.data as unknown as DbHealthRecordRow[]) || [];
    const blockedRows = (blockedRes.data as unknown as DbBlockedUserRow[]) || [];
    const reportRows = (reportsRes.data as unknown as DbReportRow[]) || [];
    const stickerRows = (stickersRes.data as unknown as DbUserCustomStickerRow[]) || [];

    const groupPetIds = petRows
      .filter((p) => p.status === 'adoption' && p.adoption_type === 'group')
      .map((p) => p.id);

    let groupMemberRows: DbGroupAdoptionMemberRow[] = [];
    if (groupPetIds.length > 0) {
      const gmRes = await client
        .from('group_adoption_members')
        .select('*')
        .in('group_pet_id', groupPetIds)
        .is('deleted_at', null)
        .order('sort_order', { ascending: true });
      groupMemberRows = (gmRes.data as unknown as DbGroupAdoptionMemberRow[]) || [];
    }

    const groupMembersByPetId = new Map<string, DbGroupAdoptionMemberRow[]>();
    for (const gm of groupMemberRows) {
      const list = groupMembersByPetId.get(gm.group_pet_id) || [];
      list.push(gm);
      groupMembersByPetId.set(gm.group_pet_id, list);
    }

    const userIdsToFetch = new Set<string>([currentUserId]);
    petRows.forEach((p) => userIdsToFetch.add(p.owner_id));
    requestRows.forEach((r) => {
      userIdsToFetch.add(r.sender_id);
      userIdsToFetch.add(r.receiver_id);
    });
    convRows.forEach((c) => {
      userIdsToFetch.add(c.user_a_id);
      userIdsToFetch.add(c.user_b_id);
    });

    const profilesMap = await fetchProfilesMap(Array.from(userIdsToFetch));
    const phonesMap = await fetchAllowedPhonesMap(profilesMap);

    const allPetsMap = new Map<string, Pet>();
    const userPets: Pet[] = [];
    let userGroupAdoptionListing: Pet | null = null;
    const matingPets: Pet[] = [];
    const adoptionPets: Pet[] = [];

    for (const row of petRows) {
      const mapped = mapDbPetToModel(row, {
        ownerProfile: profilesMap.get(row.owner_id) || null,
        ownerPhone: phonesMap.get(row.owner_id) || null,
        groupMembers: groupMembersByPetId.get(row.id) || [],
      });
      allPetsMap.set(mapped.id, mapped);

      if (row.owner_id === currentUserId) {
        if (row.status === 'adoption' && row.adoption_type === 'group') {
          if (!userGroupAdoptionListing) {
            userGroupAdoptionListing = mapped;
          }
        } else {
          userPets.push(mapped);
        }
      } else if (row.status === 'mating') {
        matingPets.push(mapped);
      } else if (row.status === 'adoption') {
        adoptionPets.push(mapped);
      }
    }

    // Fetch messages for visible conversations
    const convStateMap = new Map<string, DbConversationUserStateRow>();
    convStateRows.forEach((s) => convStateMap.set(s.conversation_id, s));

    const visibleConvRows = convRows.filter((c) =>
      isConversationVisibleToUser(convStateMap.get(c.id))
    );

    const messagesByConvId = new Map<string, DbMessageRow[]>();
    if (visibleConvRows.length > 0) {
      const msgRes = await client
        .from('messages')
        .select('*')
        .in(
          'conversation_id',
          visibleConvRows.map((c) => c.id)
        )
        .order('created_at', { ascending: true })
        .limit(1200);
      const msgRows = (msgRes.data as unknown as DbMessageRow[]) || [];
      for (const m of msgRows) {
        const arr = messagesByConvId.get(m.conversation_id) || [];
        arr.push(m);
        messagesByConvId.set(m.conversation_id, arr);
      }
    }

    const conversations: Conversation[] = visibleConvRows.map((row) => {
      const otherId = row.user_a_id === currentUserId ? row.user_b_id : row.user_a_id;
      const mappedConv = mapDbConversationToModel(row, currentUserId, {
        userState: convStateMap.get(row.id) || null,
        otherUserProfile: profilesMap.get(otherId) || null,
        otherUserPhone: phonesMap.get(otherId) || null,
        pet: row.pet_id ? allPetsMap.get(row.pet_id) || null : null,
        messages: messagesByConvId.get(row.id) || [],
      });
      // Populate senderName for non-system messages nicely
      const otherName = mappedConv.otherUserName;
      mappedConv.messages = mappedConv.messages.map((m) =>
        m.senderId === 'system'
          ? m
          : {
              ...m,
              senderName: m.isFromUser
                ? profilesMap.get(currentUserId)?.name || 'أنت'
                : otherName,
            }
      );
      return mappedConv;
    });

    await Promise.all(
      conversations.map((conv) => resolveConversationMediaUrls(conv.messages))
    );

    const contactRequests: MappedContactRequest[] = requestRows.map((row) =>
      mapDbContactRequestToModel(row, {
        senderProfile: profilesMap.get(row.sender_id) || null,
        senderPhone: phonesMap.get(row.sender_id) || null,
        senderPet: row.sender_pet_id ? allPetsMap.get(row.sender_pet_id) : undefined,
        receiverPet: allPetsMap.get(row.receiver_pet_id),
      })
    );

    return {
      success: true,
      data: {
        userPets,
        userGroupAdoptionListing,
        matingPets,
        adoptionPets,
        savedPetIds: savedRows.map((s) => s.pet_id),
        contactRequests,
        conversations,
        notifications: notifRows.map(mapDbNotificationToModel),
        healthRecords: healthRows.map(mapDbHealthRecordToModel),
        blockedUsers: blockedRows.map(mapDbBlockedUserToModel),
        reports: reportRows.map(mapDbReportToModel),
        customStickers: stickerRows.map(mapDbCustomStickerToModel),
      },
    };
  } catch (err) {
    return {
      success: false,
      errorMessage: getDbErrorMessage(err, 'تعذر تحميل بيانات الحساب من الخادم.'),
    };
  }
}

export async function upsertPetInSupabase(
  pet: Pet,
  ownerId: string,
  opts?: { legacyId?: string }
): Promise<SupabaseActionResult<Pet>> {
  const client = getSupabaseClient();
  const uid = resolveCurrentUserIdSync(ownerId);
  if (!client || !uid) {
    return { success: false, errorMessage: 'يجب تسجيل الدخول لحفظ الأليف.' };
  }

  try {
    const petId = isValidUuid(pet.id) ? pet.id : generateUuid();
    const payload = {
      id: petId,
      ...mapPetToDbPayload(pet, uid, opts?.legacyId),
    };

    const { data, error } = await client
      .from('pets')
      .upsert(payload, { onConflict: 'id' })
      .select('*')
      .single();

    if (error || !data) {
      return {
        success: false,
        errorMessage: getDbErrorMessage(error, 'تعذر حفظ بيانات الأليف في قاعدة البيانات.'),
      };
    }

    const row = data as unknown as DbPetRow;
    return {
      success: true,
      data: {
        ...pet,
        id: row.id,
        ownerId: row.owner_id,
      },
    };
  } catch (err) {
    return {
      success: false,
      errorMessage: getDbErrorMessage(err, 'حدث خطأ أثناء حفظ بيانات الأليف.'),
    };
  }
}

export async function softDeletePetInSupabase(
  petId: string,
  ownerId: string
): Promise<SupabaseActionResult> {
  const client = getSupabaseClient();
  const uid = resolveCurrentUserIdSync(ownerId);
  if (!client || !uid || !isValidUuid(petId)) {
    return { success: false, errorMessage: 'معرف الأليف غير صالح.' };
  }

  try {
    const { error } = await client
      .from('pets')
      .update({
        deleted_at: new Date().toISOString(),
        status: 'not_available',
        adoption_type: null,
        also_listed_individually: false,
      })
      .eq('id', petId)
      .eq('owner_id', uid);

    if (error) {
      return {
        success: false,
        errorMessage: getDbErrorMessage(error, 'تعذر حذف الأليف من قاعدة البيانات.'),
      };
    }
    return { success: true };
  } catch (err) {
    return {
      success: false,
      errorMessage: getDbErrorMessage(err, 'تعذر حذف الأليف.'),
    };
  }
}

export async function saveGroupAdoptionInSupabase(params: {
  groupPet: Pet;
  members: GroupAdoptionMember[];
  updatedMemberPets: Pet[];
  revertedMemberPets: Pet[];
  ownerId: string;
}): Promise<SupabaseActionResult<Pet>> {
  const client = getSupabaseClient();
  const uid = resolveCurrentUserIdSync(params.ownerId);
  if (!client || !uid) {
    return { success: false, errorMessage: 'يجب تسجيل الدخول لحفظ التبني الجماعي.' };
  }

  try {
    const groupId = isValidUuid(params.groupPet.id) ? params.groupPet.id : generateUuid();
    const groupPayload = {
      id: groupId,
      ...mapPetToDbPayload({ ...params.groupPet, status: 'adoption', adoptionType: 'group' }, uid),
    };

    // 1. Upsert parent group pet listing first (required by validate_group_adoption_member trigger)
    const { error: groupErr } = await client
      .from('pets')
      .upsert(groupPayload, { onConflict: 'id' });
    if (groupErr) {
      return {
        success: false,
        errorMessage: getDbErrorMessage(groupErr, 'تعذر حفظ إعلان التبني الجماعي.'),
      };
    }

    // 2. Sync updated and reverted member pets in public.pets
    for (const memberPet of [...params.updatedMemberPets, ...params.revertedMemberPets]) {
      if (!isValidUuid(memberPet.id)) continue;
      const pPayload = mapPetToDbPayload(memberPet, uid);
      await client
        .from('pets')
        .update(pPayload)
        .eq('id', memberPet.id)
        .eq('owner_id', uid);
    }

    // 3. Soft-delete existing active group_adoption_members rows for this group
    await client
      .from('group_adoption_members')
      .update({ deleted_at: new Date().toISOString() })
      .eq('group_pet_id', groupId)
      .eq('owner_id', uid)
      .is('deleted_at', null);

    // 4. Insert fresh active group_adoption_members rows
    const memberInserts = params.members.map((m, idx) =>
      mapGroupMemberToDbInsert(
        m,
        groupId,
        uid,
        idx,
        isValidUuid(m.petId) ? m.petId : null
      )
    );
    const { error: membersErr } = await client
      .from('group_adoption_members')
      .insert(memberInserts);
    if (membersErr) {
      return {
        success: false,
        errorMessage: getDbErrorMessage(membersErr, 'تعذر حفظ حيوانات المجموعة.'),
      };
    }

    return {
      success: true,
      data: {
        ...params.groupPet,
        id: groupId,
        ownerId: uid,
      },
    };
  } catch (err) {
    return {
      success: false,
      errorMessage: getDbErrorMessage(err, 'حدث خطأ أثناء حفظ إعلان التبني الجماعي.'),
    };
  }
}

export async function removeGroupAdoptionInSupabase(params: {
  groupPetId: string;
  ownerId: string;
  updatedPets: Pet[];
}): Promise<SupabaseActionResult> {
  const client = getSupabaseClient();
  const uid = resolveCurrentUserIdSync(params.ownerId);
  if (!client || !uid || !isValidUuid(params.groupPetId)) {
    return { success: false };
  }

  try {
    const nowIso = new Date().toISOString();
    // 1. Soft-delete group_adoption_members first
    await client
      .from('group_adoption_members')
      .update({ deleted_at: nowIso })
      .eq('group_pet_id', params.groupPetId)
      .eq('owner_id', uid)
      .is('deleted_at', null);

    // 2. Soft-delete group parent listing
    await client
      .from('pets')
      .update({ deleted_at: nowIso, status: 'not_available', adoption_type: null })
      .eq('id', params.groupPetId)
      .eq('owner_id', uid);

    // 3. Update affected individual pets
    for (const pet of params.updatedPets) {
      if (!isValidUuid(pet.id)) continue;
      await client
        .from('pets')
        .update(mapPetToDbPayload(pet, uid))
        .eq('id', pet.id)
        .eq('owner_id', uid);
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      errorMessage: getDbErrorMessage(err, 'تعذر تحديث إعلان التبني الجماعي.'),
    };
  }
}

export async function toggleSavedPetInSupabase(
  userId: string,
  petId: string,
  shouldSave: boolean
): Promise<SupabaseActionResult> {
  const client = getSupabaseClient();
  if (!client || !isValidUuid(userId) || !isValidUuid(petId)) {
    return { success: false };
  }

  try {
    if (shouldSave) {
      const { error } = await client
        .from('saved_pets')
        .upsert({ user_id: userId, pet_id: petId }, { onConflict: 'user_id,pet_id' });
      if (error) {
        return { success: false, errorMessage: getDbErrorMessage(error, 'تعذر حفظ الأليف.') };
      }
    } else {
      const { error } = await client
        .from('saved_pets')
        .delete()
        .eq('user_id', userId)
        .eq('pet_id', petId);
      if (error) {
        return { success: false, errorMessage: getDbErrorMessage(error, 'تعذر إزالة الأليف.') };
      }
    }
    return { success: true };
  } catch (err) {
    return { success: false, errorMessage: getDbErrorMessage(err, 'تعذر تحديث المحفوظات.') };
  }
}

export async function createContactRequestInSupabase(input: {
  id?: string;
  senderId: string;
  receiverId: string;
  senderPetId?: string | null;
  receiverPetId: string;
  type: 'mating' | 'adoption';
  message: string;
}): Promise<SupabaseActionResult<DbContactRequestRow>> {
  const client = getSupabaseClient();
  if (!client || !isValidUuid(input.senderId) || !isValidUuid(input.receiverId) || !isValidUuid(input.receiverPetId)) {
    return { success: false, errorMessage: 'بيانات الطلب غير مكتملة.' };
  }

  try {
    const reqId = input.id && isValidUuid(input.id) ? input.id : generateUuid();
    const payload = {
      id: reqId,
      ...mapContactRequestToDbInsert({
        senderId: input.senderId,
        receiverId: input.receiverId,
        senderPetId:
          input.senderPetId && isValidUuid(input.senderPetId) ? input.senderPetId : null,
        receiverPetId: input.receiverPetId,
        type: input.type,
        message: input.message,
      }),
    };

    const { data, error } = await client
      .from('contact_requests')
      .insert(payload)
      .select('*')
      .single();

    if (error || !data) {
      return {
        success: false,
        errorMessage: getDbErrorMessage(error, 'تعذر إرسال طلب التواصل. حاول مرة أخرى.'),
      };
    }

    return { success: true, data: data as unknown as DbContactRequestRow };
  } catch (err) {
    return {
      success: false,
      errorMessage: getDbErrorMessage(err, 'تعذر إرسال طلب التواصل.'),
    };
  }
}

export async function respondContactRequestInSupabase(
  requestId: string,
  receiverId: string,
  nextStatus: 'accepted' | 'rejected'
): Promise<SupabaseActionResult<{ conversationId?: string }>> {
  const client = getSupabaseClient();
  if (!client || !isValidUuid(requestId) || !isValidUuid(receiverId)) {
    return { success: false, errorMessage: 'بيانات الطلب غير صالحة.' };
  }

  try {
    const { error } = await client
      .from('contact_requests')
      .update({ status: nextStatus })
      .eq('id', requestId)
      .eq('receiver_id', receiverId)
      .eq('status', 'pending');

    if (error) {
      return {
        success: false,
        errorMessage: getDbErrorMessage(error, 'تعذر تحديث حالة الطلب.'),
      };
    }

    if (nextStatus === 'accepted') {
      const { data: convRow } = await client
        .from('conversations')
        .select('id')
        .eq('request_id', requestId)
        .maybeSingle();
      return {
        success: true,
        data: { conversationId: (convRow as { id?: string } | null)?.id },
      };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      errorMessage: getDbErrorMessage(err, 'تعذر تحديث حالة الطلب.'),
    };
  }
}

export async function withdrawContactRequestInSupabase(
  requestId: string,
  senderId: string
): Promise<SupabaseActionResult> {
  const client = getSupabaseClient();
  if (!client || !isValidUuid(requestId) || !isValidUuid(senderId)) {
    return { success: false };
  }

  try {
    const { error } = await client
      .from('contact_requests')
      .update({ status: 'withdrawn' })
      .eq('id', requestId)
      .eq('sender_id', senderId)
      .eq('status', 'pending');
    if (error) {
      return { success: false, errorMessage: getDbErrorMessage(error, 'تعذر سحب الطلب.') };
    }
    return { success: true };
  } catch (err) {
    return { success: false, errorMessage: getDbErrorMessage(err, 'تعذر سحب الطلب.') };
  }
}

export async function markContactRequestCelebratedInSupabase(
  requestId: string,
  senderId: string
): Promise<void> {
  const client = getSupabaseClient();
  if (!client || !isValidUuid(requestId) || !isValidUuid(senderId)) return;
  try {
    await client
      .from('contact_requests')
      .update({ celebrated: true })
      .eq('id', requestId)
      .eq('sender_id', senderId)
      .eq('status', 'accepted');
  } catch {
    // Non-critical celebration flag
  }
}

export async function sendMessageInSupabase(params: {
  id?: string;
  conversationId: string;
  senderId: string;
  message: ChatMessage;
}): Promise<SupabaseActionResult<ChatMessage>> {
  const client = getSupabaseClient();
  if (
    !client ||
    !isValidUuid(params.conversationId) ||
    !isValidUuid(params.senderId)
  ) {
    return { success: false, errorMessage: 'بيانات المحادثة غير صالحة.' };
  }

  try {
    const msgId = params.id && isValidUuid(params.id) ? params.id : generateUuid();
    const { data, error } = await client
      .from('messages')
      .insert({
        id: msgId,
        conversation_id: params.conversationId,
        sender_id: params.senderId,
        is_system: false,
        type: params.message.type || 'text',
        text: params.message.text ?? null,
        file_url: params.message.fileUrl ?? null,
        file_name: params.message.fileName ?? null,
        file_size: params.message.fileSize ?? null,
        audio_duration:
          typeof params.message.audioDuration === 'number'
            ? Math.max(0, Math.round(params.message.audioDuration))
            : null,
        sticker_url: params.message.stickerUrl ?? null,
        sticker_emoji: params.message.stickerEmoji ?? null,
        sticker_title: params.message.stickerTitle ?? null,
        status: 'sent',
      })
      .select('*')
      .single();

    if (error || !data) {
      return {
        success: false,
        errorMessage: getDbErrorMessage(error, 'تعذر إرسال الرسالة.'),
      };
    }

    const row = data as unknown as DbMessageRow;
    return {
      success: true,
      data: {
        ...params.message,
        id: row.id,
        timestamp: formatArabicClock(row.created_at),
        status: row.status,
      },
    };
  } catch (err) {
    return {
      success: false,
      errorMessage: getDbErrorMessage(err, 'تعذر إرسال الرسالة.'),
    };
  }
}

export async function markConversationReadInSupabase(conversationId: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client || !isValidUuid(conversationId)) return;
  try {
    await client.rpc('mark_conversation_read', { p_conversation_id: conversationId });
  } catch {
    // Ignore RPC error when offline
  }
}

export async function hideConversationInSupabase(conversationId: string): Promise<void> {
  const client = getSupabaseClient();
  if (!client || !isValidUuid(conversationId)) return;
  try {
    await client.rpc('hide_conversation_for_me', { p_conversation_id: conversationId });
  } catch {
    // Ignore RPC error
  }
}

export async function setConversationPinnedInSupabase(
  conversationId: string,
  userId: string,
  pinned: boolean
): Promise<void> {
  const client = getSupabaseClient();
  if (!client || !isValidUuid(conversationId) || !isValidUuid(userId)) return;
  try {
    await client
      .from('conversation_user_state')
      .update({
        is_pinned: pinned,
        pinned_at: pinned ? new Date().toISOString() : null,
      })
      .eq('conversation_id', conversationId)
      .eq('user_id', userId);
  } catch {
    // Ignore pin update error
  }
}

export async function markNotificationsReadInSupabase(
  userId: string,
  notificationIds: string[]
): Promise<void> {
  const client = getSupabaseClient();
  const validIds = notificationIds.filter((id) => isValidUuid(id));
  if (!client || !isValidUuid(userId) || validIds.length === 0) return;
  try {
    await client
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .in('id', validIds);
  } catch {
    // Ignore notification sync error
  }
}

export async function dismissNotificationInSupabase(
  userId: string,
  notificationId: string
): Promise<void> {
  const client = getSupabaseClient();
  if (!client || !isValidUuid(userId) || !isValidUuid(notificationId)) return;
  try {
    await client
      .from('notifications')
      .update({ dismissed: true, read: true })
      .eq('user_id', userId)
      .eq('id', notificationId);
  } catch {
    // Ignore dismiss sync error
  }
}

export async function addHealthRecordInSupabase(
  record: Omit<HealthRecordItem, 'id'>,
  ownerId: string
): Promise<SupabaseActionResult<HealthRecordItem>> {
  const client = getSupabaseClient();
  if (!client || !isValidUuid(ownerId) || !isValidUuid(record.petId)) {
    return { success: false, errorMessage: 'بيانات السجل الصحي غير صالحة.' };
  }
  try {
    const id = generateUuid();
    const { data, error } = await client
      .from('health_records')
      .insert({ id, ...mapHealthRecordToDbPayload(record, ownerId) })
      .select('*')
      .single();
    if (error || !data) {
      return {
        success: false,
        errorMessage: getDbErrorMessage(error, 'تعذر حفظ السجل الصحي.'),
      };
    }
    return {
      success: true,
      data: mapDbHealthRecordToModel(data as unknown as DbHealthRecordRow),
    };
  } catch (err) {
    return {
      success: false,
      errorMessage: getDbErrorMessage(err, 'تعذر حفظ السجل الصحي.'),
    };
  }
}

export async function syncBlockInSupabase(
  blockerId: string,
  entry: BlockedUser,
  unblock: boolean
): Promise<void> {
  const client = getSupabaseClient();
  if (!client || !isValidUuid(blockerId) || !isValidUuid(entry.userId)) return;
  try {
    if (unblock) {
      await client
        .from('blocked_users')
        .delete()
        .eq('blocker_id', blockerId)
        .eq('blocked_id', entry.userId);
    } else {
      await client.from('blocked_users').upsert(
        {
          blocker_id: blockerId,
          blocked_id: entry.userId,
          blocked_user_name: entry.userName || null,
          blocked_user_avatar: entry.userAvatar || null,
          pet_name: entry.petName || null,
        },
        { onConflict: 'blocker_id,blocked_id' }
      );
    }
  } catch {
    // Ignore sync error
  }
}

export async function createReportInSupabase(
  reporterId: string,
  report: ReportRecord
): Promise<SupabaseActionResult<ReportRecord>> {
  const client = getSupabaseClient();
  if (!client || !isValidUuid(reporterId) || !isValidUuid(report.targetUserId)) {
    return { success: false, errorMessage: 'بيانات البلاغ غير مكتملة.' };
  }
  try {
    const reportId = isValidUuid(report.id) ? report.id : generateUuid();
    const { data, error } = await client
      .from('reports')
      .insert({
        id: reportId,
        reporter_id: reporterId,
        target_user_id: report.targetUserId,
        target_user_name: report.targetUserName,
        target_type: report.targetType,
        pet_id: report.petId && isValidUuid(report.petId) ? report.petId : null,
        pet_name: report.petName || null,
        conversation_id:
          report.conversationId && isValidUuid(report.conversationId)
            ? report.conversationId
            : null,
        reason: report.reason,
        reason_label: report.reasonLabel,
        details: report.details || '',
        status: 'pending_review',
        reviewed_by: null,
        admin_notes: null,
      })
      .select('*')
      .single();

    if (error || !data) {
      return {
        success: false,
        errorMessage: getDbErrorMessage(error, 'تعذر إرسال البلاغ.'),
      };
    }
    return {
      success: true,
      data: mapDbReportToModel(data as unknown as DbReportRow),
    };
  } catch (err) {
    return {
      success: false,
      errorMessage: getDbErrorMessage(err, 'تعذر إرسال البلاغ.'),
    };
  }
}

export async function submitSupportMessageToSupabase(input: {
  userId: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  subject: string;
  message: string;
}): Promise<SupabaseActionResult<{ id: string }>> {
  if (!isSupabaseConfigured()) {
    return { success: false, errorMessage: 'خدمة التواصل غير متصلة بقاعدة البيانات حالياً.' };
  }
  const client = getSupabaseClient();
  if (!client || !isValidUuid(input.userId)) {
    return { success: false, errorMessage: 'يرجى تسجيل الدخول أولاً لإرسال رسالة إلى الدعم.' };
  }

  try {
    const payload = mapContactFormToSupportInsert(input);
    const { data, error } = await client
      .from('support_messages')
      .insert(payload)
      .select('id')
      .single();

    if (error || !data) {
      return {
        success: false,
        errorMessage: getDbErrorMessage(error, 'تعذر إرسال رسالتك إلى فريق الدعم. يرجى المحاولة لاحقاً.'),
      };
    }
    return { success: true, data: { id: String((data as { id: string }).id) } };
  } catch (err) {
    return {
      success: false,
      errorMessage: getDbErrorMessage(err, 'حدث خطأ أثناء إرسال الرسالة.'),
    };
  }
}

export async function addCustomStickerInSupabase(params: {
  userId: string;
  imageUrl: string;
  title?: string;
}): Promise<SupabaseActionResult<CustomStickerModel>> {
  const client = getSupabaseClient();
  if (!client || !isValidUuid(params.userId)) {
    return { success: false, errorMessage: 'يجب تسجيل الدخول لحفظ الملصقات.' };
  }
  try {
    const id = generateUuid();
    const { data, error } = await client
      .from('user_custom_stickers')
      .insert({
        id,
        ...mapCustomStickerToDbInsert({
          userId: params.userId,
          imageUrl: params.imageUrl,
          title: params.title,
        }),
      })
      .select('*')
      .single();

    if (error || !data) {
      return {
        success: false,
        errorMessage: getDbErrorMessage(error, 'تعذر حفظ الملصق المخصص.'),
      };
    }

    return {
      success: true,
      data: mapDbCustomStickerToModel(data as unknown as DbUserCustomStickerRow),
    };
  } catch (err) {
    return {
      success: false,
      errorMessage: getDbErrorMessage(err, 'تعذر حفظ الملصق المخصص.'),
    };
  }
}

export async function deleteCustomStickerInSupabase(
  userId: string,
  stickerId: string
): Promise<SupabaseActionResult> {
  const client = getSupabaseClient();
  if (!client || !isValidUuid(userId) || !isValidUuid(stickerId)) {
    return { success: false };
  }
  try {
    const { error } = await client
      .from('user_custom_stickers')
      .delete()
      .eq('id', stickerId)
      .eq('user_id', userId);
    if (error) {
      return { success: false, errorMessage: getDbErrorMessage(error, 'تعذر حذف الملصق.') };
    }
    return { success: true };
  } catch (err) {
    return { success: false, errorMessage: getDbErrorMessage(err, 'تعذر حذف الملصق.') };
  }
}

export interface SupabaseRealtimeHandlers {
  onMessageEvent?: (eventType: 'INSERT' | 'UPDATE', row: DbMessageRow) => void;
  onConversationEvent?: (eventType: string) => void;
  onConversationUserStateEvent?: (row: DbConversationUserStateRow) => void;
  onContactRequestEvent?: () => void;
  onNotificationEvent?: () => void;
  onReconnectCatchup?: () => void;
}

export function subscribeToSupabaseWorkspaceRealtime(
  userId: string,
  onWorkspaceChange: () => void,
  handlers?: SupabaseRealtimeHandlers
): () => void {
  const client = getSupabaseClient();
  if (!client || !isValidUuid(userId) || typeof client.channel !== 'function') {
    return () => {};
  }

  let disposed = false;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let retryAttempt = 0;
  let hasSubscribedOnce = false;
  let channel: RealtimeChannel | null = null;

  const triggerRefresh = () => {
    if (disposed) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      debounceTimer = null;
      if (!disposed) onWorkspaceChange();
    }, 300);
  };

  const cleanupChannel = () => {
    if (channel && typeof client.removeChannel === 'function') {
      void client.removeChannel(channel);
    }
    channel = null;
  };

  const scheduleReconnect = () => {
    if (disposed || reconnectTimer) return;
    const delays = [1000, 2000, 5000, 10000, 30000];
    const delay = delays[Math.min(retryAttempt, delays.length - 1)];
    retryAttempt += 1;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      if (!disposed) {
        connect();
      }
    }, delay);
  };

  const connect = () => {
    if (disposed) return;
    cleanupChannel();

    try {
      const nextChannel = client
        .channel(`meow_workspace_${userId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'contact_requests', filter: `receiver_id=eq.${userId}` },
          () => {
            if (handlers?.onContactRequestEvent) {
              handlers.onContactRequestEvent();
            } else {
              triggerRefresh();
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'contact_requests', filter: `sender_id=eq.${userId}` },
          () => {
            if (handlers?.onContactRequestEvent) {
              handlers.onContactRequestEvent();
            } else {
              triggerRefresh();
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
          () => {
            if (handlers?.onNotificationEvent) {
              handlers.onNotificationEvent();
            } else {
              triggerRefresh();
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages' },
          (payload) => {
            const row = (payload as unknown as { new?: DbMessageRow }).new;
            if (row && handlers?.onMessageEvent) {
              handlers.onMessageEvent('INSERT', row);
            } else {
              triggerRefresh();
            }
          }
        )
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'messages' },
          (payload) => {
            const row = (payload as unknown as { new?: DbMessageRow }).new;
            if (row && handlers?.onMessageEvent) {
              handlers.onMessageEvent('UPDATE', row);
            } else {
              triggerRefresh();
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'conversation_user_state', filter: `user_id=eq.${userId}` },
          (payload) => {
            const row = (payload as unknown as { new?: DbConversationUserStateRow }).new;
            if (row && handlers?.onConversationUserStateEvent) {
              handlers.onConversationUserStateEvent(row);
            } else {
              triggerRefresh();
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'conversations', filter: `user_a_id=eq.${userId}` },
          (payload) => {
            if (handlers?.onConversationEvent) {
              handlers.onConversationEvent((payload as { eventType?: string }).eventType || '*');
            } else {
              triggerRefresh();
            }
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'conversations', filter: `user_b_id=eq.${userId}` },
          (payload) => {
            if (handlers?.onConversationEvent) {
              handlers.onConversationEvent((payload as { eventType?: string }).eventType || '*');
            } else {
              triggerRefresh();
            }
          }
        );

      channel = nextChannel.subscribe((status) => {
        if (disposed) return;
        if (status === 'SUBSCRIBED') {
          const isReconnect = hasSubscribedOnce || retryAttempt > 0;
          hasSubscribedOnce = true;
          retryAttempt = 0;
          if (isReconnect) {
            if (handlers?.onReconnectCatchup) {
              handlers.onReconnectCatchup();
            } else {
              triggerRefresh();
            }
          }
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          scheduleReconnect();
        }
      });
    } catch {
      scheduleReconnect();
    }
  };

  connect();

  return () => {
    disposed = true;
    if (debounceTimer) clearTimeout(debounceTimer);
    if (reconnectTimer) clearTimeout(reconnectTimer);
    cleanupChannel();
  };
}
