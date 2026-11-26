import {
  Pet,
  UserProfile,
  HealthRecordItem,
  ContactRequest,
  Conversation,
  ChatMessage,
  FilterState,
  MainTab,
  PrivacySetting,
  PetStatus,
  AdoptionPublishMode,
  BlockedUser,
  PendingBlockTarget,
  GroupAdoptionMember,
  GroupPhotoItem,
  ReportReason,
  ReportRecord,
  PendingReportTarget,
  AppNotification,
} from './types.ts';
import {
  addCustomStickerInSupabase,
  addHealthRecordInSupabase,
  createContactRequestInSupabase,
  createReportInSupabase,
  deleteCustomStickerInSupabase,
  dismissNotificationInSupabase,
  hideConversationInSupabase,
  hydrateSupabaseWorkspace,
  markContactRequestCelebratedInSupabase,
  markConversationReadInSupabase,
  markNotificationsReadInSupabase,
  removeGroupAdoptionInSupabase,
  respondContactRequestInSupabase,
  saveGroupAdoptionInSupabase,
  sendMessageInSupabase,
  setConversationPinnedInSupabase,
  softDeletePetInSupabase,
  submitSupportMessageToSupabase,
  subscribeToSupabaseWorkspaceRealtime,
  syncBlockInSupabase,
  toggleSavedPetInSupabase,
  upsertPetInSupabase,
  withdrawContactRequestInSupabase,
} from './services/supabaseDataService.ts';
import type { CustomStickerModel } from './services/supabaseMappers.ts';
import { generateUuid, isValidUuid } from './utils/uuid.ts';
import {
  normalizeArabic,
  findGovernorateByCity,
  resolveLocationLineage,
  resolveLocationCoordinates,
  calculateDistanceKm,
  getGeoNodeById,
  CAT_BREEDS,
  DOG_BREEDS,
} from './data/egyptLocations.ts';
import type { GoogleAuthAccount } from './services/authService.ts';
import {
  testFirestoreConnection,
  subscribeToAuthSession,
  subscribeUserNotifications,
  syncUserProfileToFirestore,
  loadUserPreferencesFromFirestore,
  syncPetToFirestore,
  deletePetFromFirestore,
  syncNotificationToFirestore,
  deleteNotificationFromFirestore,
  syncContactRequestToFirestore,
  markMatingCelebratedInFirestore,
  syncConversationToFirestore,
  syncChatMessageToFirestore,
  syncBlockedUserToFirestore,
  syncReportToFirestore,
} from './services/firestoreService.ts';
import {
  initNotificationService,
  requestBrowserNotificationPermission,
  showSystemNotification,
} from './services/notificationService.ts';
import type { Session } from '@supabase/supabase-js';
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';
import { isSupabaseConfigured } from './services/supabaseClient.ts';
import { isSafeDeepLink } from './utils/sanitize.ts';
import { APP_VERSION_INFO } from './config/appVersion.ts';
import {
  OtaManifest,
  applyOtaUpdate,
  checkForUpdates,
  reloadAppToApplyStagedUpdate,
  UpdateCheckResult,
} from './services/updateService.ts';
import {
  SupabaseAccountBundleResult,
  SupabaseBasicResult,
  SupabaseUserAccountBundle,
  clearSupabasePasswordRecoveryState,
  closeExternalAuthBrowserIfOpen,
  fetchSupabaseUserAccountBundle,
  getCurrentSupabaseSession,
  handleSupabaseAuthCallbackUrl,
  isSupabaseAuthCallbackUrl,
  isSupabasePasswordRecoveryActive,
  saveSupabaseUserAccountBundle,
  signOutFromSupabase,
  subscribeToSupabaseAuthChanges,
  updateSupabaseAccountPreferences,
} from './services/supabaseAuthService.ts';
import {
  isNetworkOrOfflineError,
  sanitizeOAuthDisplayName,
} from './utils/authHelpers.ts';

const SPLASH_MIN_DURATION_MS = 2000;
const SPLASH_MAX_WAIT_MS = 15000;
const OTA_DISMISSED_VERSION_STORAGE_KEY = 'meow_dismissed_ota_version';
const OFFLINE_CACHE_KEY_PREFIX = 'meow_offline_cache_v1:';
const OFFLINE_LAST_USER_ID_KEY = 'meow_last_user_id_v1';
const CLINIC_NOTIFY_STORAGE_KEY = 'meow_clinic_notify_v1';
const STORE_NOTIFY_STORAGE_KEY = 'meow_store_notify_v1';
export const MAIN_TAB_ORDER: MainTab[] = [
  'mating',
  'adoption',
  'chat',
  'clinic',
  'store',
  'profile',
];

interface OfflineAccountCacheSnapshot {
  version: 1;
  savedAt: number;
  userId: string;
  bundle: SupabaseUserAccountBundle;
  user: UserProfile;
  userPets: Pet[];
  userGroupAdoptionListing: Pet | null;
  matingPets: Pet[];
  adoptionPets: Pet[];
  savedPetIds: string[];
  contactRequests: ContactRequest[];
  conversations: Conversation[];
  notifications: AppNotification[];
  healthRecords: HealthRecordItem[];
  blockedUsers: BlockedUser[];
  customStickers: CustomStickerModel[];
}

function readStoredBooleanFlag(key: string): boolean {
  try {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

function writeStoredBooleanFlag(key: string, value: boolean): void {
  try {
    if (typeof localStorage === 'undefined') return;
    if (value) {
      localStorage.setItem(key, 'true');
    } else {
      localStorage.removeItem(key);
    }
  } catch {
    // Ignore storage errors
  }
}

function readStoredDismissedOtaVersion(): string | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const val = localStorage.getItem(OTA_DISMISSED_VERSION_STORAGE_KEY);
    return val && val.trim() ? val.trim() : null;
  } catch {
    return null;
  }
}

function writeStoredDismissedOtaVersion(key: string | null): void {
  try {
    if (typeof localStorage === 'undefined') return;
    if (key) {
      localStorage.setItem(OTA_DISMISSED_VERSION_STORAGE_KEY, key);
    } else {
      localStorage.removeItem(OTA_DISMISSED_VERSION_STORAGE_KEY);
    }
  } catch {
    // Ignore storage quota / privacy mode errors
  }
}

const DEFAULT_USER_AVATAR_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'%3E%3Ccircle cx='60' cy='60' r='60' fill='%23F7E1C3'/%3E%3Ccircle cx='42' cy='46' r='8' fill='%23E67E22'/%3E%3Ccircle cx='60' cy='38' r='8' fill='%23E67E22'/%3E%3Ccircle cx='78' cy='46' r='8' fill='%23E67E22'/%3E%3Cpath d='M60 54c-13 0-23 9-23 20 0 9 9 15 23 15s23-6 23-15c0-11-10-20-23-20z' fill='%23E67E22'/%3E%3C/svg%3E";

function createUnauthenticatedUserProfile(notificationsEnabled = true): UserProfile {
  return {
    id: '',
    name: '',
    avatar: '',
    email: '',
    phone: '',
    city: '',
    privacyMode: 'private',
    showPhoneOnlyAfterApproval: false,
    showPhoneInProfile: false,
    notificationsEnabled,
  };
}

type Listener = () => void;

export type OnboardingStep =
  | 'splash'
  | 'welcome'
  | 'auth_method'
  | 'owner_details'
  | 'has_pet'
  | 'pet_details'
  | 'completed';

class AppStateManager {
  private user: UserProfile = createUnauthenticatedUserProfile(true);
  private userPets: Pet[] = [];
  private userGroupAdoptionListing: Pet | null = null;
  private pendingGroupChoicePetId: string | null = null;
  private isGroupAdoptionEditorOpen: boolean = false;
  private groupEditorPreselectIds: string[] = [];
  private groupEditorPublishMode: 'group_only' | 'both' = 'group_only';
  private pendingDeletePetId: string | null = null;
  private pendingStatusChange: { petId: string; targetStatus: PetStatus } | null = null;
  private pendingAdoptionActionConfirm: {
    kind: 'stop_group' | 'dissolve_group' | 'stop_individual' | 'enable_individual';
    petId?: string;
  } | null = null;
  private matingPets: Pet[] = [];
  private adoptionPets: Pet[] = [];
  private contactRequests: ContactRequest[] = [];
  private conversations: Conversation[] = [];
  private healthRecords: HealthRecordItem[] = [];
  private customStickers: CustomStickerModel[] = [];

  private currentTab: MainTab = 'mating';
  private lastTabTransitionDirection: 'next' | 'prev' | 'none' = 'none';
  private chatSubTab: 'chats' | 'requests' = 'chats';
  private clinicNotifyRequested: boolean = readStoredBooleanFlag(CLINIC_NOTIFY_STORAGE_KEY);
  private storeNotifyRequested: boolean = readStoredBooleanFlag(STORE_NOTIFY_STORAGE_KEY);
  private isOfflineState: boolean =
    typeof navigator !== 'undefined' ? navigator.onLine === false : false;
  private isUsingOfflineCacheState: boolean = false;
  private offlineCacheSavedAt: number | null = null;
  private selectedPetForDetail: Pet | null = null;
  private selectedGroupMemberFocusId: string | null = null;
  private selectedPetForRequest: Pet | null = null;
  private activeConversationId: string | null = null;
  private isAddPetModalOpen: boolean = false;
  private editingPet: Pet | null = null;
  private isFilterModalOpen: boolean = false;
  private isAdviceDismissed: boolean =
    typeof window !== 'undefined'
      ? localStorage.getItem('meow_advice_dismissed') === 'true'
      : false;

  // 2. SETTINGS DRAWER / SIDEBAR & OWNER EDIT STATE
  private isSettingsDrawerOpen: boolean = false;
  private isEditOwnerModalOpen: boolean = false;

  // 2.1 NOTIFICATIONS & ONE-TIME MATING CELEBRATION STATE
  private notificationsEnabled: boolean =
    typeof window !== 'undefined' && typeof localStorage !== 'undefined'
      ? localStorage.getItem('meow_notifications_enabled') !== 'false'
      : true;
  private isNotificationsModalOpen: boolean = false;
  private notifications: AppNotification[] = [];
  private readNotificationIds: Set<string> = new Set(
    typeof window !== 'undefined' && typeof localStorage !== 'undefined'
      ? (() => {
          try {
            const parsed = JSON.parse(localStorage.getItem('meow_read_notification_ids_v1') || '[]');
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : []
  );
  private dismissedNotificationIds: Set<string> = new Set(
    typeof window !== 'undefined' && typeof localStorage !== 'undefined'
      ? (() => {
          try {
            const parsed = JSON.parse(localStorage.getItem('meow_dismissed_notification_ids_v1') || '[]');
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : []
  );
  private processedRequestStatuses: Record<string, 'accepted' | 'rejected'> =
    typeof window !== 'undefined' && typeof localStorage !== 'undefined'
      ? (() => {
          try {
            const parsed = JSON.parse(localStorage.getItem('meow_request_statuses_v1') || '{}');
            return parsed && typeof parsed === 'object' ? parsed : {};
          } catch {
            return {};
          }
        })()
      : {};
  private celebratedApprovals: Set<string> = new Set(
    typeof window !== 'undefined' && typeof localStorage !== 'undefined'
      ? (() => {
          try {
            return JSON.parse(localStorage.getItem('meow_celebrated_approvals_v1') || '[]');
          } catch {
            return [];
          }
        })()
      : []
  );
  private activeConfettiBurstKey: string | null = null;
  private firestoreNotificationsUnsub: (() => void) | null = null;
  private workspaceRealtimeUnsub: (() => void) | null = null;
  private isWorkspaceHydrating: boolean = false;
  private activeWorkspaceHydratePromise: Promise<void> | null = null;

  // 3. SAVED PETS STATE (Heart Save Button)
  private savedPetIds: Set<string> = new Set();
  private isSavedPetsOpen: boolean = false;
  private savedPetsSubTab: 'mating' | 'adoption' | 'clinics' | 'store' = 'mating';

  // 3.1 CONTACT VIEW STATE
  private isContactViewOpen: boolean = false;

  // 3.2 BLOCKED USERS & REPORT STATE
  private blockedUsers: BlockedUser[] = [];
  private pendingBlockTarget: PendingBlockTarget | null = null;
  private pendingDeleteConversationId: string | null = null;
  private reports: ReportRecord[] = [];
  private pendingReportTarget: PendingReportTarget | null = null;
  private lastSubmittedReportNotice: { targetUserName: string; reasonLabel: string } | null = null;

  // 4. ONBOARDING SEQUENCE STATE ("وخطوات التسجيل انت تجاهلتها انار رافعلك الصفحات بالترتيب")
  private isOnboardingPreviewSession: boolean = (() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    const preview = params.get('preview');
    const step = params.get('step');
    const validSteps: OnboardingStep[] = [
      'splash',
      'welcome',
      'auth_method',
      'owner_details',
      'has_pet',
      'pet_details',
    ];
    return preview === 'onboarding' || (step !== null && validSteps.includes(step as OnboardingStep));
  })();

  private onboardingStep: OnboardingStep = (() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const step = params.get('step') as OnboardingStep | null;
      const validSteps: OnboardingStep[] = [
        'splash',
        'welcome',
        'auth_method',
        'owner_details',
        'has_pet',
        'pet_details',
        'completed',
      ];
      if (step && validSteps.includes(step)) {
        return step;
      }
      if (params.get('preview') === 'onboarding') {
        return 'splash';
      }
      if (
        !isSupabaseConfigured() &&
        typeof localStorage !== 'undefined' &&
        localStorage.getItem('meow_onboarding_done') === 'true'
      ) {
        return 'completed';
      }
    }
    return 'splash';
  })();

  private authenticatedGoogleAccount: GoogleAuthAccount | null = null;
  private termsAcceptedInOnboarding: boolean = false;
  private ownerDetailsCompleted: boolean = false;

  // 4.1 SUPABASE AUTH & ACCOUNT SESSION STATE
  private supabaseSession: Session | null = null;
  private supabaseAuthUserId: string | null = null;
  private isSupabaseAuthReady: boolean = !isSupabaseConfigured();
  private isSupabaseProfileLoading: boolean = false;
  private supabaseAccountBundle: SupabaseUserAccountBundle | null = null;
  private supabaseAuthError: string | null = null;
  private isSupabasePasswordRecoveryState: boolean = false;
  private rawSupabaseAvatarUrl: string = '';
  private supabaseAuthUnsub: (() => void) | null = null;
  private activeSupabaseAuthVersion: number = 0;
  private inFlightSupabaseProfileFetch: {
    userId: string;
    version: number;
    promise: Promise<SupabaseAccountBundleResult>;
  } | null = null;
  private loadedSupabaseUserId: string | null = null;
  private pendingSplashAdvance: boolean = false;
  private splashStartedAt: number = Date.now();
  private splashViewMounted: boolean = false;
  private splashTransitionLocked: boolean = false;
  private splashLoadingDelayed: boolean = false;
  private deferredSplashTargetStep: OnboardingStep | null = null;
  private splashMinTimer: ReturnType<typeof setTimeout> | null = null;
  private splashMaxTimer: ReturnType<typeof setTimeout> | null = null;
  private isSigningOutSupabase: boolean = false;
  private supabaseAccountWriteQueue: Promise<unknown> = Promise.resolve();
  private activeDeepLinkAuthPromise: Promise<boolean> | null = null;
  private activeDeepLinkUrl: string | null = null;
  private deepLinkInitChecked: boolean = false;
  private handledDeepLinkUrls: Set<string> = new Set();

  // 4.2 OTA & RELEASE APK UPDATE STATE
  private updateCheckResult: UpdateCheckResult = {
    configured: false,
    status: 'up_to_date',
    currentNativeVersion: APP_VERSION_INFO.appVersion,
    currentBuildNumber: APP_VERSION_INFO.buildNumber,
    currentBundleVersion: APP_VERSION_INFO.appVersion,
    otaUpdate: null,
    apkUpdate: null,
  };
  private isCheckingUpdates: boolean = false;
  private isApplyingOtaUpdate: boolean = false;
  private isApkUpdateModalOpen: boolean = false;
  private apkUpdateDismissedVersion: string | null = null;
  private isOtaNoticeVisible: boolean = false;
  private otaUpdateDismissedVersion: string | null = readStoredDismissedOtaVersion();
  private isOtaStagedForRestart: boolean = false;
  private stagedOtaVersion: string | null = null;
  private updateActionFeedback: {
    kind: 'success' | 'error' | 'info';
    message: string;
  } | null = null;

  // Calm filtering/search loading state
  private isFilteringLoading: boolean = false;
  private filteringLoadingLabel: string = '';
  private filteringLoadingTimer: ReturnType<typeof setTimeout> | null = null;

  // Filters (Default sortBy to 'newest' as requested)
  private matingFilters: FilterState = {
    species: 'all',
    gender: 'all',
    breed: '',
    hybridBreed: '',
    ageYears: undefined,
    ageMonths: undefined,
    color: '',
    vaccinationStatus: 'all',
    healthStatus: '',
    governorate: '',
    markaz: '',
    city: '',
    village: '',
    governorateId: '',
    markazId: '',
    cityId: '',
    villageId: '',
    locationId: '',
    smartMatchingEnabled: true,
    recommendedMatchEnabled: false,
    recommendedForPetId: undefined,
    sortBy: 'newest',
  };

  private adoptionFilters: FilterState = {
    species: 'all',
    gender: 'all',
    breed: '',
    hybridBreed: '',
    ageYears: undefined,
    ageMonths: undefined,
    color: '',
    vaccinationStatus: 'all',
    healthStatus: '',
    governorate: '',
    markaz: '',
    city: '',
    village: '',
    governorateId: '',
    markazId: '',
    cityId: '',
    villageId: '',
    locationId: '',
    adoptionType: 'all',
    smartMatchingEnabled: true,
    sortBy: 'newest',
  };

  private listeners: Set<Listener> = new Set();

  constructor() {
    const useSupabaseAuthSession = isSupabaseConfigured() && !this.isOnboardingPreviewSession;
    if (this.isOnboardingPreviewSession) {
      this.isSupabaseAuthReady = true;
    }

    if (useSupabaseAuthSession) {
      this.user = createUnauthenticatedUserProfile(this.notificationsEnabled);
      this.onboardingStep = 'splash';
      this.isSupabaseAuthReady = false;
    }

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      if (!useSupabaseAuthSession) {
        this.loadPersistedOwnerProfile();
        const storedShowPhone = localStorage.getItem('meow_show_phone_in_profile') === 'true';
        this.user.showPhoneInProfile = storedShowPhone;
        this.user.privacyMode = storedShowPhone ? 'public' : 'private';
        this.user.showPhoneOnlyAfterApproval = storedShowPhone;
        this.user.notificationsEnabled = this.notificationsEnabled;
        try {
          const savedRaw = JSON.parse(localStorage.getItem('meow_saved_pets') || '[]');
          if (Array.isArray(savedRaw)) this.savedPetIds = new Set(savedRaw);
        } catch {
          // ignore
        }
        try {
          const blockedRaw = JSON.parse(localStorage.getItem('meow_blocked_users') || '[]');
          if (Array.isArray(blockedRaw)) this.blockedUsers = blockedRaw;
        } catch {
          // ignore
        }
        try {
          const reportsRaw = JSON.parse(localStorage.getItem('meow_reports_v1') || '[]');
          if (Array.isArray(reportsRaw)) this.reports = reportsRaw;
        } catch {
          // ignore
        }
        try {
          const stickersRaw = JSON.parse(localStorage.getItem('meow_custom_stickers_v1') || '[]');
          if (Array.isArray(stickersRaw)) {
            this.customStickers = stickersRaw
              .filter((s) => s && typeof s.imageUrl === 'string')
              .map((s) => ({
                id: String(s.id || generateUuid()),
                imageUrl: String(s.imageUrl),
                title: String(s.title || 'ملصق مخصص'),
                createdAt: String(s.createdAt || new Date().toISOString()),
              }));
          }
        } catch {
          // ignore
        }
        this.userPets.forEach((p) => {
          p.ownerShowPhone = storedShowPhone;
          p.ownerPrivacy = this.user.privacyMode;
        });
        this.restoreProcessedRequestStatuses();
        this.loadPersistedNotifications();
        this.reconcileNotificationsWithState(true);
      }
    }
    this.recalculateAllCompatibilities();
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('meow_dark_mode');
      }
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('offline', () => {
        this.isOfflineState = true;
        this.notify();
      });
      window.addEventListener('online', () => {
        this.isOfflineState = false;
        void this.syncAfterNetworkReconnect();
      });
    }
    this.initRealtimeSync();
    if (this.onboardingStep === 'splash' && !this.isOnboardingPreviewSession) {
      this.scheduleSplashAutoTransition();
    }
  }

  private loadPersistedOwnerProfile(): void {
    try {
      const raw = localStorage.getItem('meow_owner_profile_v1');
      if (!raw) return;
      const saved = JSON.parse(raw) as Partial<UserProfile>;
      if (!saved || typeof saved !== 'object') return;
      const lineage = resolveLocationLineage({
        governorateId: saved.governorateId,
        markazId: saved.markazId,
        cityId: saved.cityId,
        villageId: saved.villageId,
        governorate: saved.governorate,
        markaz: saved.markaz,
        city: saved.city,
        village: saved.village,
      });
      if (saved.name) this.user.name = saved.name;
      if (saved.phone) this.user.phone = saved.phone;
      if (saved.gender === 'male' || saved.gender === 'female') this.user.gender = saved.gender;
      if (lineage.governorate || saved.governorate) {
        this.user.governorate = lineage.governorate?.name || saved.governorate;
        this.user.governorateId = lineage.governorate?.id || saved.governorateId;
      }
      if (lineage.markaz || saved.markaz) {
        this.user.markaz = lineage.markaz?.name || saved.markaz;
        this.user.markazId = lineage.markaz?.id || saved.markazId;
      } else if (saved.governorateId) {
        this.user.markaz = undefined;
        this.user.markazId = undefined;
      }
      if (lineage.city || saved.city) {
        this.user.city = lineage.city?.name || saved.city || this.user.city;
        this.user.cityId = lineage.city?.id || saved.cityId;
      }
      if (lineage.village || saved.village) {
        this.user.village = lineage.village?.name || saved.village;
        this.user.villageId = lineage.village?.id || saved.villageId;
      } else if (saved.cityId) {
        this.user.village = undefined;
        this.user.villageId = undefined;
      }
      this.user.locationId = lineage.deepest?.id || saved.locationId || this.user.locationId;
      const coords = lineage.deepest
        ? { lat: lineage.deepest.lat, lng: lineage.deepest.lng }
        : saved.lat && saved.lng
        ? { lat: saved.lat, lng: saved.lng }
        : resolveLocationCoordinates({ governorate: this.user.governorate, city: this.user.city });
      if (coords) {
        this.user.lat = coords.lat;
        this.user.lng = coords.lng;
      }

      this.userPets.forEach((p) => {
        p.ownerName = this.user.name;
        p.ownerPhone = this.user.phone;
      });
      if (this.userGroupAdoptionListing) {
        this.userGroupAdoptionListing.ownerName = this.user.name;
        this.userGroupAdoptionListing.ownerPhone = this.user.phone;
      }
    } catch {
      // Ignore owner profile restore error
    }
  }

  private persistOwnerProfileToLocalStorage(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    try {
      const profileSnapshot: Partial<UserProfile> = {
        name: this.user.name,
        phone: this.user.phone,
        gender: this.user.gender,
        city: this.user.city,
        governorate: this.user.governorate,
        markaz: this.user.markaz,
        village: this.user.village,
        governorateId: this.user.governorateId,
        markazId: this.user.markazId,
        cityId: this.user.cityId,
        villageId: this.user.villageId,
        locationId: this.user.locationId,
        lat: this.user.lat,
        lng: this.user.lng,
        showPhoneInProfile: Boolean(this.user.showPhoneInProfile),
        email: this.authenticatedGoogleAccount?.email || this.user.email,
      };
      localStorage.setItem('meow_owner_profile_v1', JSON.stringify(profileSnapshot));

      const raw = localStorage.getItem('meow_accounts_v1');
      const accounts = raw ? (JSON.parse(raw) as Record<string, Partial<UserProfile>>) : {};
      if (this.authenticatedGoogleAccount?.uid) {
        accounts[this.authenticatedGoogleAccount.uid] = profileSnapshot;
      }
      if (this.user.email) {
        accounts[this.user.email] = profileSnapshot;
      }
      localStorage.setItem('meow_accounts_v1', JSON.stringify(accounts));
    } catch {
      // Ignore storage write error
    }
  }

  private restoreProcessedRequestStatuses(): void {
    this.contactRequests.forEach((req) => {
      const savedStatus = this.processedRequestStatuses[req.id];
      if (savedStatus === 'accepted' || savedStatus === 'rejected') {
        req.status = savedStatus;
      }
    });
  }

  private persistProcessedRequestStatuses(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(
        'meow_request_statuses_v1',
        JSON.stringify(this.processedRequestStatuses)
      );
    } catch {
      // Ignore storage write error
    }
  }

  private persistReadNotificationIds(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(
        'meow_read_notification_ids_v1',
        JSON.stringify(Array.from(this.readNotificationIds).slice(-200))
      );
    } catch {
      // Ignore storage write error
    }
  }

  private persistDismissedNotificationIds(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(
        'meow_dismissed_notification_ids_v1',
        JSON.stringify(Array.from(this.dismissedNotificationIds).slice(-300))
      );
    } catch {
      // Ignore storage write error
    }
  }

  private isRequestAlreadyHandled(requestId?: string): boolean {
    if (!requestId) return false;
    const saved = this.processedRequestStatuses[requestId];
    if (saved === 'accepted' || saved === 'rejected') return true;
    const req = this.contactRequests.find((r) => r.id === requestId);
    return Boolean(req && req.status !== 'pending');
  }

  private isNotificationResolvedRead(notif: AppNotification): boolean {
    if (notif.read || this.readNotificationIds.has(notif.id)) return true;
    if (notif.targetRequestId && this.isRequestAlreadyHandled(notif.targetRequestId)) {
      return true;
    }
    if (
      notif.targetConversationId &&
      this.activeConversationId === notif.targetConversationId &&
      this.currentTab === 'chat'
    ) {
      return true;
    }
    return false;
  }

  private reconcileNotificationsWithState(silent = false): boolean {
    let changed = false;
    let readIdsChanged = false;
    this.notifications.forEach((n) => {
      const shouldBeRead = this.isNotificationResolvedRead(n);
      if (shouldBeRead) {
        if (!this.readNotificationIds.has(n.id)) {
          this.readNotificationIds.add(n.id);
          readIdsChanged = true;
        }
        if (!n.read) {
          n.read = true;
          changed = true;
          void syncNotificationToFirestore(n).catch((err) =>
            console.warn('Firestore notification reconcile sync skipped:', err)
          );
        }
      }
    });
    if (readIdsChanged) {
      this.persistReadNotificationIds();
    }
    if (changed) {
      this.persistNotifications();
      if (!silent) this.notify();
    }
    return changed;
  }

  private loadPersistedNotifications(): void {
    try {
      const raw = localStorage.getItem('meow_notifications_v1');
      if (raw) {
        const parsed = JSON.parse(raw) as AppNotification[];
        if (Array.isArray(parsed)) {
          this.notifications = parsed
            .filter((n) => n && n.id && !this.dismissedNotificationIds.has(n.id))
            .map((n) => {
              const read = Boolean(
                n.read || this.readNotificationIds.has(n.id) || this.isRequestAlreadyHandled(n.targetRequestId)
              );
              if (read) this.readNotificationIds.add(n.id);
              return { ...n, read };
            });
          this.persistReadNotificationIds();
          return;
        }
      }
    } catch {
      // Ignore parse error
    }
    this.notifications = [];
  }

  private persistNotifications(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('meow_notifications_v1', JSON.stringify(this.notifications.slice(0, 60)));
      } catch {
        // Ignore storage write error
      }
    }
  }

  private initRealtimeSync(): void {
    if (typeof window === 'undefined') return;

    void initNotificationService((payload) => {
      if (payload.notificationId) {
        this.openNotification(payload.notificationId);
      } else if (payload.targetTab === 'chat') {
        this.currentTab = 'chat';
        if (payload.targetConversationId) {
          this.setActiveConversationId(payload.targetConversationId);
        } else {
          this.chatSubTab = 'requests';
          this.notify();
        }
      }
    });

    window.addEventListener('meow:open-notification', ((event: CustomEvent<{ notificationId?: string }>) => {
      if (event.detail?.notificationId) {
        this.openNotification(event.detail.notificationId);
      }
    }) as EventListener);

    if (isSupabaseConfigured()) {
      this.initSupabaseAuthSync();
      return;
    }

    void testFirestoreConnection();
    subscribeToAuthSession(
      () => {
        void loadUserPreferencesFromFirestore()
          .then((prefs) => {
            if (!prefs) {
              return syncUserProfileToFirestore(this.user);
            }
            let changed = false;
            if (typeof prefs.showPhoneInProfile === 'boolean') {
              this.user.showPhoneInProfile = prefs.showPhoneInProfile;
              this.user.privacyMode = prefs.showPhoneInProfile ? 'public' : 'private';
              this.user.showPhoneOnlyAfterApproval = prefs.showPhoneInProfile;
              this.userPets.forEach((p) => {
                p.ownerShowPhone = prefs.showPhoneInProfile;
                p.ownerPrivacy = this.user.privacyMode;
              });
              if (typeof localStorage !== 'undefined') {
                localStorage.setItem('meow_show_phone_in_profile', prefs.showPhoneInProfile ? 'true' : 'false');
              }
              changed = true;
            }
            if (typeof prefs.notificationsEnabled === 'boolean') {
              this.notificationsEnabled = prefs.notificationsEnabled;
              this.user.notificationsEnabled = prefs.notificationsEnabled;
              if (typeof localStorage !== 'undefined') {
                localStorage.setItem('meow_notifications_enabled', prefs.notificationsEnabled ? 'true' : 'false');
              }
              changed = true;
            }
            if (changed) this.notify();
            return undefined;
          })
          .catch((err) => console.warn('Firestore preferences sync skipped:', err));

        if (this.firestoreNotificationsUnsub) {
          this.firestoreNotificationsUnsub();
        }
        this.firestoreNotificationsUnsub = subscribeUserNotifications((remoteItems) => {
          if (remoteItems.length === 0) return;
          const byId = new Map<string, AppNotification>();
          this.notifications.forEach((n) => {
            if (!this.dismissedNotificationIds.has(n.id)) {
              byId.set(n.id, n);
            }
          });
          remoteItems.forEach((remote) => {
            if (this.dismissedNotificationIds.has(remote.id)) return;
            const existing = byId.get(remote.id);
            const resolvedRead = Boolean(
              remote.read ||
                existing?.read ||
                this.readNotificationIds.has(remote.id) ||
                this.isRequestAlreadyHandled(remote.targetRequestId)
            );
            if (resolvedRead) {
              this.readNotificationIds.add(remote.id);
            }
            const merged: AppNotification = existing
              ? {
                  ...remote,
                  timestampLabel: existing.timestampLabel || remote.timestampLabel,
                  read: resolvedRead,
                  celebrated: existing.celebrated || remote.celebrated,
                }
              : {
                  ...remote,
                  read: resolvedRead,
                };
            byId.set(remote.id, merged);
            if (resolvedRead && !remote.read) {
              void syncNotificationToFirestore(merged).catch((err) =>
                console.warn('Firestore notification read repair sync skipped:', err)
              );
            }
          });
          this.notifications = Array.from(byId.values()).slice(0, 60);
          this.persistReadNotificationIds();
          this.persistNotifications();
          this.notify();
        });
      },
      () => {
        if (this.firestoreNotificationsUnsub) {
          this.firestoreNotificationsUnsub();
          this.firestoreNotificationsUnsub = null;
        }
      }
    );
  }

  private initSupabaseAuthSync(): void {
    if (this.supabaseAuthUnsub) {
      this.supabaseAuthUnsub();
      this.supabaseAuthUnsub = null;
    }

    this.supabaseAuthUnsub = subscribeToSupabaseAuthChanges((payload) => {
      void this.handleSupabaseAuthUpdate({
        event: payload.event,
        session: payload.session,
        isPasswordRecovery: payload.isPasswordRecovery,
        source: 'auth_change',
      });
    });

    void this.verifyInitialSupabaseSession();
  }

  private async verifyInitialSupabaseSession(): Promise<void> {
    if (!this.deepLinkInitChecked) {
      let launchUrl: string | undefined;
      try {
        if (Capacitor.isNativePlatform()) {
          const launch = await CapApp.getLaunchUrl();
          launchUrl = launch?.url;
        }
      } catch (err) {
        console.warn('Capacitor getLaunchUrl auth check skipped:', err);
      } finally {
        this.deepLinkInitChecked = true;
      }

      if (launchUrl && isSupabaseAuthCallbackUrl(launchUrl)) {
        const handled = await this.handleAuthDeepLinkUrl(launchUrl);
        if (handled || this.supabaseAuthError) {
          return;
        }
      }
    }

    if (this.activeDeepLinkAuthPromise) {
      const handled = await this.activeDeepLinkAuthPromise.catch(() => false);
      if (handled || this.supabaseAuthError) {
        return;
      }
    }

    const result = await getCurrentSupabaseSession();
    if (!result.configured) {
      this.isSupabaseAuthReady = true;
      this.isSupabaseProfileLoading = false;
      this.tryFinalizeSplashTransition();
      this.notify();
      return;
    }

    if (this.activeDeepLinkAuthPromise) {
      const handled = await this.activeDeepLinkAuthPromise.catch(() => false);
      if (handled || this.supabaseAuthError) {
        return;
      }
    }

    if (result.errorMessage && !result.session) {
      if (isNetworkOrOfflineError(result.errorMessage) && this.tryRestoreLastCompletedOfflineSession()) {
        this.tryFinalizeSplashTransition();
        this.notify();
        return;
      }
      this.activeSupabaseAuthVersion += 1;
      this.clearLocalSupabaseSessionState({
        errorMessage: result.errorMessage,
        markReady: true,
        preserveOnboardingSubstep: true,
      });
      this.tryFinalizeSplashTransition();
      this.notify();
      return;
    }

    if (!result.session && isNetworkOrOfflineError() && this.tryRestoreLastCompletedOfflineSession()) {
      this.tryFinalizeSplashTransition();
      this.notify();
      return;
    }

    await this.handleSupabaseAuthUpdate({
      event: result.session ? 'INITIAL_SESSION' : 'SIGNED_OUT',
      session: result.session,
      isPasswordRecovery: result.isPasswordRecovery,
      source: 'initial_check',
    });
  }

  private async handleSupabaseAuthUpdate(params: {
    event: string;
    session: Session | null;
    isPasswordRecovery: boolean;
    source: 'initial_check' | 'auth_change';
  }): Promise<void> {
    const { event, session, isPasswordRecovery } = params;

    if (!session || !session.user?.id) {
      // Avoid flashing signed-out or marking ready while native cold-start deep link / active callback is running
      if (
        this.activeDeepLinkAuthPromise ||
        (params.source === 'auth_change' &&
          event === 'INITIAL_SESSION' &&
          !this.deepLinkInitChecked &&
          Capacitor.isNativePlatform())
      ) {
        return;
      }
      if (
        event !== 'SIGNED_OUT' &&
        !this.isSigningOutSupabase &&
        isNetworkOrOfflineError() &&
        ((this.loadedSupabaseUserId && this.supabaseAccountBundle?.onboardingDone) ||
          this.tryRestoreLastCompletedOfflineSession())
      ) {
        this.isOfflineState = true;
        this.isUsingOfflineCacheState = true;
        this.isSupabaseAuthReady = true;
        this.isSupabaseProfileLoading = false;
        this.tryFinalizeSplashTransition();
        this.notify();
        return;
      }
      this.activeSupabaseAuthVersion += 1;
      this.inFlightSupabaseProfileFetch = null;
      this.clearLocalSupabaseSessionState({
        errorMessage: null,
        markReady: true,
        preserveOnboardingSubstep: event !== 'SIGNED_OUT' && !this.isSigningOutSupabase,
      });
      if (!this.isOnboardingPreviewSession && this.isSigningOutSupabase) {
        this.clearSplashTimers();
        this.splashTransitionLocked = true;
        this.onboardingStep = 'auth_method';
      } else if (!this.isOnboardingPreviewSession && this.onboardingStep === 'splash') {
        this.deferredSplashTargetStep = 'welcome';
        this.pendingSplashAdvance = false;
        this.tryFinalizeSplashTransition();
      }
      this.notify();
      return;
    }

    const userId = session.user.id;
    this.supabaseSession = session;
    this.supabaseAuthUserId = userId;
    this.isSupabasePasswordRecoveryState = Boolean(isPasswordRecovery || isSupabasePasswordRecoveryActive());

    if (
      event === 'TOKEN_REFRESHED' &&
      this.loadedSupabaseUserId === userId &&
      this.supabaseAccountBundle?.exists
    ) {
      this.isSupabaseAuthReady = true;
      this.isSupabaseProfileLoading = false;
      this.tryFinalizeSplashTransition();
      this.notify();
      return;
    }

    if (
      (event === 'INITIAL_SESSION' || params.source === 'initial_check') &&
      this.loadedSupabaseUserId === userId &&
      this.supabaseAccountBundle?.exists &&
      !this.supabaseAuthError
    ) {
      this.isSupabaseAuthReady = true;
      this.isSupabaseProfileLoading = false;
      this.tryFinalizeSplashTransition();
      this.notify();
      return;
    }

    await this.loadSupabaseAccountForUser(userId, {
      session,
      isPasswordRecovery: this.isSupabasePasswordRecoveryState,
      forceReload: event === 'USER_UPDATED' || event === 'SIGNED_IN',
    });
  }

  private async loadSupabaseAccountForUser(
    userId: string,
    opts?: {
      session?: Session | null;
      isPasswordRecovery?: boolean;
      forceReload?: boolean;
    }
  ): Promise<SupabaseAccountBundleResult> {
    if (
      !opts?.forceReload &&
      this.inFlightSupabaseProfileFetch &&
      this.inFlightSupabaseProfileFetch.userId === userId
    ) {
      return this.inFlightSupabaseProfileFetch.promise;
    }

    const version = ++this.activeSupabaseAuthVersion;
    this.isSupabaseProfileLoading = true;
    this.supabaseAuthError = null;
    this.notify();

    const fetchPromise = (async (): Promise<SupabaseAccountBundleResult> => {
      const res = await fetchSupabaseUserAccountBundle(userId);
      if (version !== this.activeSupabaseAuthVersion) {
        return res;
      }

      this.isSupabaseProfileLoading = false;
      this.isSupabaseAuthReady = true;

      if (!res.success || !res.bundle) {
        if (isNetworkOrOfflineError(res.errorMessage)) {
          if (this.loadedSupabaseUserId === userId && this.supabaseAccountBundle?.onboardingDone) {
            this.isUsingOfflineCacheState = true;
            this.supabaseAuthError = null;
            this.deferOrSetOnboardingStep('completed');
            this.tryFinalizeSplashTransition();
            this.notify();
            return { success: true, bundle: this.supabaseAccountBundle };
          }
          if (this.tryRestoreOfflineSnapshotForUser(userId)) {
            this.tryFinalizeSplashTransition();
            this.notify();
            return { success: true, bundle: this.supabaseAccountBundle };
          }
        }
        this.loadedSupabaseUserId = null;
        this.supabaseAccountBundle = res.bundle ?? null;
        this.supabaseAuthError =
          res.errorMessage || 'تعذر تحميل بيانات الحساب من قاعدة البيانات.';
        const sessionUser = opts?.session?.user ?? this.supabaseSession?.user ?? null;
        const resolvedName = sanitizeOAuthDisplayName(
          (sessionUser?.user_metadata?.full_name as string | undefined) ||
            (sessionUser?.user_metadata?.name as string | undefined),
          sessionUser?.email,
          sessionUser
        );
        this.user = {
          ...createUnauthenticatedUserProfile(this.notificationsEnabled),
          id: userId,
          email: sessionUser?.email || '',
          name: resolvedName,
        };
        const inRecovery = Boolean(opts?.isPasswordRecovery || this.isSupabasePasswordRecoveryState);
        if (!this.isOnboardingPreviewSession) {
          if (inRecovery || this.onboardingStep === 'splash') {
            this.deferOrSetOnboardingStep('auth_method');
          } else {
            this.tryFinalizeSplashTransition();
          }
        }
        this.notify();
        return res;
      }

      if (!res.bundle.exists || !res.bundle.profile) {
        // Brand-new Auth user whose profiles row hasn't been created yet: let them complete owner_details (upsert creates the row)
        const sessionUser = opts?.session?.user ?? this.supabaseSession?.user ?? null;
        const metaAvatar = this.extractGoogleAvatarFromSessionUser(sessionUser);
        const resolvedName = sanitizeOAuthDisplayName(
          (sessionUser?.user_metadata?.full_name as string | undefined) ||
            (sessionUser?.user_metadata?.name as string | undefined),
          sessionUser?.email,
          sessionUser
        );
        this.rawSupabaseAvatarUrl = metaAvatar;
        this.loadedSupabaseUserId = userId;
        this.supabaseAccountBundle = res.bundle;
        this.supabaseAuthError = null;
        this.isUsingOfflineCacheState = false;
        this.termsAcceptedInOnboarding = true;
        this.ownerDetailsCompleted = false;
        this.user = {
          ...createUnauthenticatedUserProfile(this.notificationsEnabled),
          id: userId,
          email: sessionUser?.email || '',
          name: resolvedName,
          avatar: metaAvatar || DEFAULT_USER_AVATAR_FALLBACK,
        };
        const inRecovery = Boolean(opts?.isPasswordRecovery || this.isSupabasePasswordRecoveryState);
        if (!this.isOnboardingPreviewSession) {
          this.pendingSplashAdvance = false;
          if (inRecovery) {
            this.deferOrSetOnboardingStep('auth_method');
          } else if (
            this.onboardingStep === 'splash' ||
            this.onboardingStep === 'welcome' ||
            this.onboardingStep === 'auth_method' ||
            this.onboardingStep === 'completed'
          ) {
            this.deferOrSetOnboardingStep('owner_details');
          }
        }
        void this.hydrateSupabaseWorkspaceForUser(userId);
        this.ensureWorkspaceRealtime(userId);
        this.notify();
        return res;
      }

      this.loadedSupabaseUserId = userId;
      this.supabaseAccountBundle = res.bundle;
      this.supabaseAuthError = null;
      this.isUsingOfflineCacheState = false;
      this.applySupabaseAccountBundle(res.bundle, {
        isPasswordRecovery: Boolean(opts?.isPasswordRecovery),
        sessionUser: opts?.session?.user ?? this.supabaseSession?.user ?? null,
      });
      this.persistOfflineSnapshotForCurrentUser();
      void this.hydrateSupabaseWorkspaceForUser(userId);
      this.ensureWorkspaceRealtime(userId);
      this.cleanupWebAuthCallbackParams();
      this.notify();
      return res;
    })();

    this.inFlightSupabaseProfileFetch = { userId, version, promise: fetchPromise };
    try {
      return await fetchPromise;
    } finally {
      if (this.inFlightSupabaseProfileFetch?.version === version) {
        this.inFlightSupabaseProfileFetch = null;
      }
    }
  }

  private extractGoogleAvatarFromSessionUser(sessionUser?: Session['user'] | null): string {
    if (!sessionUser) return '';
    const meta = (sessionUser.user_metadata || {}) as Record<string, unknown>;
    const candidates: unknown[] = [
      meta.avatar_url,
      meta.picture,
      meta.avatar,
      meta.photo_url,
      meta.profilePictureUri,
    ];
    if (Array.isArray(sessionUser.identities)) {
      for (const identity of sessionUser.identities) {
        const idData = (identity?.identity_data || {}) as Record<string, unknown>;
        candidates.push(idData.avatar_url, idData.picture, idData.avatar, idData.photo_url);
      }
    }
    for (const cand of candidates) {
      if (typeof cand === 'string') {
        const trimmed = cand.trim();
        if (trimmed && /^https?:\/\//i.test(trimmed)) {
          return trimmed;
        }
      }
    }
    return '';
  }

  private applySupabaseAccountBundle(
    bundle: SupabaseUserAccountBundle,
    opts?: { isPasswordRecovery?: boolean; sessionUser?: Session['user'] | null }
  ): void {
    const profile = bundle.profile;
    if (!profile) return;

    const sessionUser = opts?.sessionUser ?? this.supabaseSession?.user ?? null;
    const existingRawAvatar = (bundle.rawProfile?.avatar_url || profile.avatar || '').trim();
    const sessionGoogleAvatar = this.extractGoogleAvatarFromSessionUser(sessionUser);
    const resolvedRawAvatar = existingRawAvatar || sessionGoogleAvatar;
    this.rawSupabaseAvatarUrl = resolvedRawAvatar;
    const runtimeAvatar = resolvedRawAvatar || DEFAULT_USER_AVATAR_FALLBACK;
    const showPhone = Boolean(profile.showPhoneInProfile);
    const notifEnabled = profile.notificationsEnabled !== false;
    const resolvedProfileName = bundle.onboardingDone
      ? (profile.name || '').trim()
      : sanitizeOAuthDisplayName(profile.name, profile.email || sessionUser?.email, sessionUser);

    this.user = {
      ...profile,
      name: resolvedProfileName,
      avatar: runtimeAvatar,
      showPhoneInProfile: showPhone,
      privacyMode: showPhone ? 'public' : 'private',
      showPhoneOnlyAfterApproval: showPhone,
      notificationsEnabled: notifEnabled,
    };

    if (!existingRawAvatar && sessionGoogleAvatar && !this.isOnboardingPreviewSession) {
      void this.persistSupabaseAccountBundle({
        adviceDismissed: Boolean(bundle.adviceDismissed),
        onboardingDone: Boolean(bundle.onboardingDone),
      });
    }

    this.notificationsEnabled = notifEnabled;
    this.isAdviceDismissed = Boolean(bundle.adviceDismissed);
    this.termsAcceptedInOnboarding = true;

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('meow_show_phone_in_profile', showPhone ? 'true' : 'false');
      localStorage.setItem('meow_notifications_enabled', notifEnabled ? 'true' : 'false');
      if (this.isAdviceDismissed) {
        localStorage.setItem('meow_advice_dismissed', 'true');
      } else {
        localStorage.removeItem('meow_advice_dismissed');
      }
    }

    this.syncOwnedPetsMetadataWithUser(this.user.id);

    const hasCompletedOwnerFields = Boolean(
      (this.user.name || '').trim() &&
        (this.user.city || '').trim() &&
        (this.user.phone || '').trim() &&
        (this.user.gender === 'male' || this.user.gender === 'female')
    );

    if (!this.isOnboardingPreviewSession) {
      this.pendingSplashAdvance = false;
      const inRecovery = Boolean(opts?.isPasswordRecovery || this.isSupabasePasswordRecoveryState);
      if (inRecovery) {
        this.ownerDetailsCompleted = Boolean(bundle.onboardingDone || hasCompletedOwnerFields);
        this.deferOrSetOnboardingStep('auth_method');
      } else if (bundle.onboardingDone) {
        this.ownerDetailsCompleted = true;
        this.deferOrSetOnboardingStep('completed');
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('meow_onboarding_done', 'true');
        }
      } else {
        this.ownerDetailsCompleted = hasCompletedOwnerFields;
        if (
          this.onboardingStep === 'splash' ||
          this.onboardingStep === 'welcome' ||
          this.onboardingStep === 'auth_method' ||
          this.onboardingStep === 'completed'
        ) {
          this.deferOrSetOnboardingStep(hasCompletedOwnerFields ? 'has_pet' : 'owner_details');
        }
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('meow_onboarding_done');
        }
      }
    }

    this.recalculateAllCompatibilities();
  }

  private syncOwnedPetsMetadataWithUser(ownerId: string): void {
    const resolvedOwnerId = ownerId || 'user_me';
    const showPhone = Boolean(this.user.showPhoneInProfile);
    const privacyMode: PrivacySetting = showPhone ? 'public' : 'private';

    this.userPets = this.userPets.map((pet) => ({
      ...pet,
      ownerId: resolvedOwnerId,
      ownerName: this.user.name || pet.ownerName,
      ownerAvatar: this.user.avatar || pet.ownerAvatar,
      ownerPhone: this.user.phone,
      ownerPrivacy: privacyMode,
      ownerShowPhone: showPhone,
    }));

    if (this.userGroupAdoptionListing) {
      this.userGroupAdoptionListing = {
        ...this.userGroupAdoptionListing,
        ownerId: resolvedOwnerId,
        ownerName: this.user.name || this.userGroupAdoptionListing.ownerName,
        ownerAvatar: this.user.avatar || this.userGroupAdoptionListing.ownerAvatar,
        ownerPhone: this.user.phone,
        ownerPrivacy: privacyMode,
        ownerShowPhone: showPhone,
      };
    }

    if (this.selectedPetForDetail && this.userPets.some((p) => p.id === this.selectedPetForDetail?.id)) {
      this.selectedPetForDetail = {
        ...this.selectedPetForDetail,
        ownerId: resolvedOwnerId,
        ownerName: this.user.name || this.selectedPetForDetail.ownerName,
        ownerAvatar: this.user.avatar || this.selectedPetForDetail.ownerAvatar,
        ownerPhone: this.user.phone,
        ownerPrivacy: privacyMode,
        ownerShowPhone: showPhone,
      };
    }
  }

  private async hydrateSupabaseWorkspaceForUser(userId: string): Promise<void> {
    if (
      !isSupabaseConfigured() ||
      this.isOnboardingPreviewSession ||
      !isValidUuid(userId) ||
      this.supabaseAuthUserId !== userId
    ) {
      return;
    }
    if (this.activeWorkspaceHydratePromise) {
      return this.activeWorkspaceHydratePromise;
    }
    this.isWorkspaceHydrating = true;
    let run: Promise<void> | null = null;
    run = (async () => {
      try {
        const res = await hydrateSupabaseWorkspace(userId);
        if (!res.success || !res.data || this.supabaseAuthUserId !== userId) return;
        const w = res.data;
        this.userPets = w.userPets;
        this.userGroupAdoptionListing = w.userGroupAdoptionListing;
        this.matingPets = w.matingPets;
        this.adoptionPets = w.adoptionPets;
        this.savedPetIds = new Set(w.savedPetIds);
        this.contactRequests = w.contactRequests;
        this.conversations = w.conversations;
        this.notifications = w.notifications;
        this.healthRecords = w.healthRecords;
        this.blockedUsers = w.blockedUsers;
        this.reports = w.reports;
        this.customStickers = w.customStickers;
        this.syncOwnedPetsMetadataWithUser(userId);
        this.recalculateAllCompatibilities();
        this.reconcileNotificationsWithState(true);
        this.isUsingOfflineCacheState = false;
        this.persistOfflineSnapshotForCurrentUser();
        this.notify();
      } catch (err) {
        console.warn('Workspace hydration skipped:', err);
      } finally {
        this.isWorkspaceHydrating = false;
        if (this.activeWorkspaceHydratePromise === run) {
          this.activeWorkspaceHydratePromise = null;
        }
      }
    })();
    this.activeWorkspaceHydratePromise = run;
    return run;
  }

  private ensureWorkspaceRealtime(userId: string): void {
    if (!isSupabaseConfigured() || this.isOnboardingPreviewSession || !isValidUuid(userId)) {
      return;
    }
    if (this.workspaceRealtimeUnsub) {
      this.workspaceRealtimeUnsub();
      this.workspaceRealtimeUnsub = null;
    }
    try {
      this.workspaceRealtimeUnsub = subscribeToSupabaseWorkspaceRealtime(userId, () => {
        if (this.supabaseAuthUserId === userId) {
          void this.hydrateSupabaseWorkspaceForUser(userId);
        }
      });
    } catch {
      this.workspaceRealtimeUnsub = null;
    }
  }

  private clearLocalSupabaseSessionState(opts?: {
    errorMessage?: string | null;
    markReady?: boolean;
    preserveOnboardingSubstep?: boolean;
  }): void {
    if (this.workspaceRealtimeUnsub) {
      this.workspaceRealtimeUnsub();
      this.workspaceRealtimeUnsub = null;
    }
    this.activeWorkspaceHydratePromise = null;
    this.isWorkspaceHydrating = false;

    this.supabaseSession = null;
    this.supabaseAuthUserId = null;
    this.supabaseAccountBundle = null;
    this.loadedSupabaseUserId = null;
    this.isSupabaseProfileLoading = false;
    this.isSupabasePasswordRecoveryState = false;
    this.rawSupabaseAvatarUrl = '';
    this.supabaseAuthError = opts?.errorMessage ?? null;
    if (opts?.markReady) {
      this.isSupabaseAuthReady = true;
    }

    this.authenticatedGoogleAccount = null;
    this.ownerDetailsCompleted = false;
    this.termsAcceptedInOnboarding = false;

    if (!this.isOnboardingPreviewSession) {
      this.user = createUnauthenticatedUserProfile(this.notificationsEnabled);
      this.userPets = [];
      this.userGroupAdoptionListing = null;
      this.matingPets = [];
      this.adoptionPets = [];
      this.contactRequests = [];
      this.conversations = [];
      this.notifications = [];
      this.healthRecords = [];
      this.blockedUsers = [];
      this.reports = [];
      this.savedPetIds = new Set();
      this.customStickers = [];
      this.activeConversationId = null;
      this.selectedPetForDetail = null;
      this.selectedPetForRequest = null;
      this.isUsingOfflineCacheState = false;
      this.offlineCacheSavedAt = null;
      this.syncOwnedPetsMetadataWithUser('');

      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('meow_onboarding_done');
        localStorage.removeItem('meow_owner_profile_v1');
      }

      const preAuthSteps: OnboardingStep[] = ['splash', 'welcome', 'auth_method'];
      if (!opts?.preserveOnboardingSubstep || !preAuthSteps.includes(this.onboardingStep)) {
        this.onboardingStep = 'splash';
      }
    }
  }

  private clearStoredOfflineCache(userId?: string | null): void {
    if (typeof localStorage === 'undefined') return;
    try {
      if (userId) {
        localStorage.removeItem(`${OFFLINE_CACHE_KEY_PREFIX}${userId}`);
      }
      localStorage.removeItem(OFFLINE_LAST_USER_ID_KEY);
    } catch {
      // Ignore storage cleanup errors
    }
  }

  private persistOfflineSnapshotForCurrentUser(): void {
    if (
      this.isOnboardingPreviewSession ||
      typeof localStorage === 'undefined' ||
      !this.supabaseAuthUserId ||
      !this.supabaseAccountBundle?.onboardingDone
    ) {
      return;
    }
    try {
      const userId = this.supabaseAuthUserId;
      const savedAt = Date.now();
      const snapshot: OfflineAccountCacheSnapshot = {
        version: 1,
        savedAt,
        userId,
        bundle: this.supabaseAccountBundle,
        user: this.user,
        userPets: this.userPets,
        userGroupAdoptionListing: this.userGroupAdoptionListing,
        matingPets: this.matingPets,
        adoptionPets: this.adoptionPets,
        savedPetIds: Array.from(this.savedPetIds),
        contactRequests: this.contactRequests,
        conversations: this.conversations,
        notifications: this.notifications,
        healthRecords: this.healthRecords,
        blockedUsers: this.blockedUsers,
        customStickers: this.customStickers,
      };
      localStorage.setItem(`${OFFLINE_CACHE_KEY_PREFIX}${userId}`, JSON.stringify(snapshot));
      localStorage.setItem(OFFLINE_LAST_USER_ID_KEY, userId);
      this.offlineCacheSavedAt = savedAt;
    } catch {
      // Ignore quota / serialization errors
    }
  }

  private readOfflineSnapshot(userId: string): OfflineAccountCacheSnapshot | null {
    if (!userId || typeof localStorage === 'undefined') return null;
    try {
      const raw = localStorage.getItem(`${OFFLINE_CACHE_KEY_PREFIX}${userId}`);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as OfflineAccountCacheSnapshot;
      if (
        !parsed ||
        parsed.version !== 1 ||
        parsed.userId !== userId ||
        !parsed.bundle?.onboardingDone ||
        !parsed.user?.id
      ) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  }

  private tryRestoreOfflineSnapshotForUser(userId: string): boolean {
    const snapshot = this.readOfflineSnapshot(userId);
    if (!snapshot) return false;
    this.loadedSupabaseUserId = userId;
    this.supabaseAuthUserId = userId;
    this.supabaseAccountBundle = snapshot.bundle;
    this.user = { ...snapshot.user };
    this.userPets = Array.isArray(snapshot.userPets) ? snapshot.userPets : [];
    this.userGroupAdoptionListing = snapshot.userGroupAdoptionListing ?? null;
    this.matingPets = Array.isArray(snapshot.matingPets) ? snapshot.matingPets : [];
    this.adoptionPets = Array.isArray(snapshot.adoptionPets) ? snapshot.adoptionPets : [];
    this.savedPetIds = new Set(Array.isArray(snapshot.savedPetIds) ? snapshot.savedPetIds : []);
    this.contactRequests = Array.isArray(snapshot.contactRequests) ? snapshot.contactRequests : [];
    this.conversations = Array.isArray(snapshot.conversations) ? snapshot.conversations : [];
    this.notifications = Array.isArray(snapshot.notifications) ? snapshot.notifications : [];
    this.healthRecords = Array.isArray(snapshot.healthRecords) ? snapshot.healthRecords : [];
    this.blockedUsers = Array.isArray(snapshot.blockedUsers) ? snapshot.blockedUsers : [];
    this.customStickers = Array.isArray(snapshot.customStickers) ? snapshot.customStickers : [];
    this.ownerDetailsCompleted = true;
    this.termsAcceptedInOnboarding = true;
    this.isSupabaseAuthReady = true;
    this.isSupabaseProfileLoading = false;
    this.supabaseAuthError = null;
    this.isUsingOfflineCacheState = true;
    this.offlineCacheSavedAt = snapshot.savedAt || null;
    this.recalculateAllCompatibilities();
    this.reconcileNotificationsWithState(true);
    this.deferOrSetOnboardingStep('completed');
    return true;
  }

  private tryRestoreLastCompletedOfflineSession(): boolean {
    if (this.isOnboardingPreviewSession || typeof localStorage === 'undefined') return false;
    try {
      const lastUserId = localStorage.getItem(OFFLINE_LAST_USER_ID_KEY);
      if (!lastUserId) return false;
      return this.tryRestoreOfflineSnapshotForUser(lastUserId);
    } catch {
      return false;
    }
  }

  public getOfflineStatus(): {
    isOffline: boolean;
    isUsingCache: boolean;
    lastSyncedAt: number | null;
  } {
    return {
      isOffline: this.isOfflineState,
      isUsingCache: this.isUsingOfflineCacheState,
      lastSyncedAt: this.offlineCacheSavedAt,
    };
  }

  public async syncAfterNetworkReconnect(): Promise<void> {
    if (this.isOnboardingPreviewSession) return;
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      this.isOfflineState = true;
      this.notify();
      return;
    }
    this.isOfflineState = false;
    if (!isSupabaseConfigured()) {
      this.notify();
      return;
    }
    const targetUserId = this.supabaseAuthUserId || this.loadedSupabaseUserId;
    if (targetUserId && isValidUuid(targetUserId)) {
      await this.loadSupabaseAccountForUser(targetUserId, {
        session: this.supabaseSession,
        isPasswordRecovery: this.isSupabasePasswordRecoveryState,
        forceReload: true,
      });
    } else if (this.onboardingStep === 'completed' || this.onboardingStep === 'auth_method') {
      await this.retrySupabaseAccountLoad();
    }
    this.notify();
  }

  public resumeFromBackground(): void {
    const offlineNow = typeof navigator !== 'undefined' ? navigator.onLine === false : false;
    const prevOffline = this.isOfflineState;
    this.isOfflineState = offlineNow;
    if (!offlineNow && (prevOffline || this.isUsingOfflineCacheState)) {
      void this.syncAfterNetworkReconnect();
    } else if (!offlineNow && this.onboardingStep === 'completed' && this.supabaseAuthUserId) {
      void this.hydrateSupabaseWorkspaceForUser(this.supabaseAuthUserId);
    } else if (prevOffline !== offlineNow) {
      this.notify();
    }
  }

  private getPersistableSupabaseUserProfile(): UserProfile {
    return {
      ...this.user,
      id: this.supabaseAuthUserId || this.user.id,
      avatar:
        this.user.avatar === DEFAULT_USER_AVATAR_FALLBACK
          ? this.rawSupabaseAvatarUrl || ''
          : this.user.avatar || this.rawSupabaseAvatarUrl || '',
    };
  }

  private enqueueSupabaseAccountWrite(
    task: (expectedVersion: number) => Promise<SupabaseAccountBundleResult | null>
  ): Promise<SupabaseAccountBundleResult | null> {
    const versionAtSchedule = this.activeSupabaseAuthVersion;
    const run = async (): Promise<SupabaseAccountBundleResult | null> => {
      if (
        versionAtSchedule !== this.activeSupabaseAuthVersion ||
        !isSupabaseConfigured() ||
        !this.isSupabaseAuthenticated() ||
        this.isOnboardingPreviewSession
      ) {
        return null;
      }
      return task(versionAtSchedule);
    };
    const next = this.supabaseAccountWriteQueue.then(run, run);
    this.supabaseAccountWriteQueue = next.catch(() => null);
    return next;
  }

  private async persistSupabaseAccountBundle(extra?: {
    adviceDismissed?: boolean;
    onboardingDone?: boolean;
  }): Promise<SupabaseAccountBundleResult | null> {
    if (!isSupabaseConfigured() || !this.isSupabaseAuthenticated() || this.isOnboardingPreviewSession) {
      return null;
    }
    const profileSnapshot = this.getPersistableSupabaseUserProfile();
    return this.enqueueSupabaseAccountWrite(async (expectedVersion) => {
      const res = await saveSupabaseUserAccountBundle(profileSnapshot, extra);
      if (expectedVersion !== this.activeSupabaseAuthVersion) return res;
      if (res.success && res.bundle) {
        this.supabaseAccountBundle = res.bundle;
        this.supabaseAuthError = null;
      } else if (!res.success && res.errorMessage) {
        this.supabaseAuthError = res.errorMessage;
        this.notify();
      }
      return res;
    });
  }

  private async persistSupabasePreferences(prefs: {
    showPhoneInProfile?: boolean;
    notificationsEnabled?: boolean;
    adviceDismissed?: boolean;
    onboardingDone?: boolean;
  }): Promise<SupabaseAccountBundleResult | null> {
    if (!isSupabaseConfigured() || !this.isSupabaseAuthenticated() || this.isOnboardingPreviewSession) {
      return null;
    }
    return this.enqueueSupabaseAccountWrite(async (expectedVersion) => {
      const res = await updateSupabaseAccountPreferences(prefs);
      if (expectedVersion !== this.activeSupabaseAuthVersion) return res;
      if (res.success && res.bundle) {
        this.supabaseAccountBundle = res.bundle;
        this.supabaseAuthError = null;
      } else if (!res.success && res.errorMessage) {
        this.supabaseAuthError = res.errorMessage;
        this.notify();
      }
      return res;
    });
  }

  // Public Supabase Auth & Account State Getters & Actions
  public getSupabaseSession(): Session | null {
    return this.supabaseSession;
  }

  public getSupabaseUserId(): string | null {
    return this.supabaseAuthUserId;
  }

  public getIsSupabaseAuthReady(): boolean {
    return this.isSupabaseAuthReady;
  }

  public getIsSupabaseProfileLoading(): boolean {
    return this.isSupabaseProfileLoading;
  }

  public getSupabaseAccountBundle(): SupabaseUserAccountBundle | null {
    return this.supabaseAccountBundle;
  }

  public getSupabaseAuthError(): string | null {
    return this.supabaseAuthError;
  }

  public isSupabasePasswordRecovery(): boolean {
    return this.isSupabasePasswordRecoveryState;
  }

  public isSupabaseAuthenticated(): boolean {
    return Boolean(this.supabaseSession && this.supabaseAuthUserId);
  }

  public async retrySupabaseAccountLoad(): Promise<boolean> {
    if (!isSupabaseConfigured()) return false;
    const sessionRes = await getCurrentSupabaseSession();
    if (!sessionRes.session || !sessionRes.user?.id) {
      if (isNetworkOrOfflineError(sessionRes.errorMessage) && this.tryRestoreLastCompletedOfflineSession()) {
        this.notify();
        return true;
      }
      this.clearLocalSupabaseSessionState({
        errorMessage: sessionRes.errorMessage ?? null,
        markReady: true,
        preserveOnboardingSubstep: true,
      });
      this.notify();
      return false;
    }
    this.supabaseSession = sessionRes.session;
    this.supabaseAuthUserId = sessionRes.user.id;
    this.isSupabasePasswordRecoveryState = Boolean(
      sessionRes.isPasswordRecovery || isSupabasePasswordRecoveryActive()
    );
    const bundleRes = await this.loadSupabaseAccountForUser(sessionRes.user.id, {
      session: sessionRes.session,
      isPasswordRecovery: this.isSupabasePasswordRecoveryState,
      forceReload: true,
    });
    return Boolean(bundleRes.success && bundleRes.bundle);
  }

  public async refreshSupabaseAccount(): Promise<SupabaseAccountBundleResult> {
    if (!this.supabaseAuthUserId) {
      return {
        success: false,
        bundle: null,
        errorMessage: 'لا توجد جلسة مصادقة نشطة حاليًا.',
      };
    }
    return this.loadSupabaseAccountForUser(this.supabaseAuthUserId, {
      session: this.supabaseSession,
      isPasswordRecovery: this.isSupabasePasswordRecoveryState,
      forceReload: true,
    });
  }

  public async handleDirectSupabaseAuthSuccess(
    session: Session,
    opts?: { isPasswordRecovery?: boolean }
  ): Promise<SupabaseAccountBundleResult> {
    if (!session?.user?.id) {
      return {
        success: false,
        bundle: null,
        errorMessage: 'لم يتم استلام جلسة مستخدم صالحة من Supabase.',
      };
    }

    const userId = session.user.id;
    const recovery =
      opts?.isPasswordRecovery !== undefined
        ? Boolean(opts.isPasswordRecovery)
        : isSupabasePasswordRecoveryActive();
    if (!recovery) {
      clearSupabasePasswordRecoveryState();
    }

    this.supabaseSession = session;
    this.supabaseAuthUserId = userId;
    this.isSupabasePasswordRecoveryState = recovery;
    this.isSupabaseAuthReady = true;
    this.supabaseAuthError = null;
    this.termsAcceptedInOnboarding = true;

    if (
      this.loadedSupabaseUserId === userId &&
      this.supabaseAccountBundle &&
      !this.supabaseAuthError
    ) {
      if (this.supabaseAccountBundle.exists && this.supabaseAccountBundle.profile) {
        this.applySupabaseAccountBundle(this.supabaseAccountBundle, {
          isPasswordRecovery: recovery,
        });
      } else if (!this.isOnboardingPreviewSession) {
        this.deferOrSetOnboardingStep(recovery ? 'auth_method' : 'owner_details');
      }
      this.notify();
      return {
        success: true,
        bundle: this.supabaseAccountBundle,
      };
    }

    const res = await this.loadSupabaseAccountForUser(userId, {
      session,
      isPasswordRecovery: recovery,
    });
    if (
      res.success &&
      res.bundle &&
      !recovery &&
      !this.isOnboardingPreviewSession &&
      this.onboardingStep === 'auth_method'
    ) {
      const targetStep: OnboardingStep = res.bundle.onboardingDone
        ? 'completed'
        : this.ownerDetailsCompleted
        ? 'has_pet'
        : 'owner_details';
      this.clearSplashTimers();
      this.splashTransitionLocked = true;
      this.splashLoadingDelayed = false;
      this.pendingSplashAdvance = false;
      this.onboardingStep = targetStep;
      if (targetStep === 'completed' && typeof localStorage !== 'undefined') {
        localStorage.setItem('meow_onboarding_done', 'true');
      }
      this.notify();
    }
    return res;
  }

  public async continueAuthenticatedFromAuthMethod(): Promise<{
    success: boolean;
    errorMessage?: string;
  }> {
    if (this.isSupabasePasswordRecoveryState || isSupabasePasswordRecoveryActive()) {
      return {
        success: false,
        errorMessage: 'يرجى استكمال تعيين كلمة المرور الجديدة أولًا للمتابعة.',
      };
    }

    let session = this.supabaseSession;
    let userId = this.supabaseAuthUserId;
    if (!session || !userId) {
      const sessionRes = await getCurrentSupabaseSession();
      if (!sessionRes.session || !sessionRes.user?.id) {
        return {
          success: false,
          errorMessage:
            sessionRes.errorMessage || 'يرجى تسجيل الدخول بحساب مؤكد أولًا للمتابعة.',
        };
      }
      session = sessionRes.session;
      userId = sessionRes.user.id;
      this.supabaseSession = session;
      this.supabaseAuthUserId = userId;
    }

    this.termsAcceptedInOnboarding = true;
    this.supabaseAuthError = null;

    if (!this.supabaseAccountBundle || this.loadedSupabaseUserId !== userId) {
      const loadRes = await this.loadSupabaseAccountForUser(userId, {
        session,
        isPasswordRecovery: false,
        forceReload: true,
      });
      if (!loadRes.success || !loadRes.bundle) {
        return {
          success: false,
          errorMessage:
            loadRes.errorMessage ||
            this.supabaseAuthError ||
            'تعذر تحميل بيانات الحساب من قاعدة البيانات. يرجى المحاولة مرة أخرى.',
        };
      }
    }

    const targetStep: OnboardingStep = this.supabaseAccountBundle?.onboardingDone
      ? 'completed'
      : this.ownerDetailsCompleted
      ? 'has_pet'
      : 'owner_details';

    if (!this.isOnboardingPreviewSession) {
      this.clearSplashTimers();
      this.splashTransitionLocked = true;
      this.splashLoadingDelayed = false;
      this.pendingSplashAdvance = false;
    }
    this.onboardingStep = targetStep;
    if (
      targetStep === 'completed' &&
      !this.isOnboardingPreviewSession &&
      typeof localStorage !== 'undefined'
    ) {
      localStorage.setItem('meow_onboarding_done', 'true');
    }
    this.notify();
    return { success: true };
  }

  public isProcessingAuthDeepLink(): boolean {
    return Boolean(this.activeDeepLinkAuthPromise);
  }

  private cleanupWebAuthCallbackParams(): void {
    if (typeof window === 'undefined' || Capacitor.isNativePlatform()) return;
    try {
      const url = new URL(window.location.href);
      const authParams = ['code', 'state', 'type', 'token_hash', 'error', 'error_code', 'error_description'];
      let modified = false;
      for (const key of authParams) {
        if (url.searchParams.has(key)) {
          url.searchParams.delete(key);
          modified = true;
        }
      }
      if (url.hash && (url.hash.includes('access_token=') || url.hash.includes('error='))) {
        url.hash = '';
        modified = true;
      }
      if (modified) {
        window.history.replaceState({}, document.title, `${url.pathname}${url.search}${url.hash}`);
      }
    } catch {
      // ignore URL cleanup errors
    }
  }

  public async handleAuthDeepLinkUrl(url: string): Promise<boolean> {
    const trimmedUrl = (url || '').trim();
    if (
      !trimmedUrl ||
      this.isOnboardingPreviewSession ||
      !isSupabaseConfigured() ||
      !isSafeDeepLink(trimmedUrl) ||
      !isSupabaseAuthCallbackUrl(trimmedUrl)
    ) {
      return false;
    }

    // Close external Chrome Custom Tab smoothly as soon as callback deep link opens the app
    void closeExternalAuthBrowserIfOpen();

    if (this.activeDeepLinkAuthPromise) {
      if (this.activeDeepLinkUrl === trimmedUrl) {
        return this.activeDeepLinkAuthPromise;
      }
      await this.activeDeepLinkAuthPromise.catch(() => false);
    }

    if (this.handledDeepLinkUrls.has(trimmedUrl)) {
      return true;
    }

    const runPromise = (async (): Promise<boolean> => {
      const cbRes = await handleSupabaseAuthCallbackUrl(trimmedUrl);
      if (!cbRes.handled) {
        return false;
      }

      if (!cbRes.success || !cbRes.session) {
        this.isSupabaseAuthReady = true;
        this.isSupabaseProfileLoading = false;
        this.pendingSplashAdvance = false;
        this.supabaseAuthError =
          cbRes.errorMessage || 'تعذر التحقق من رابط المصادقة. يرجى طلب رابط جديد.';
        if (!this.isOnboardingPreviewSession && !this.isSupabaseAuthenticated()) {
          this.clearSplashTimers();
          this.splashTransitionLocked = true;
          this.splashLoadingDelayed = false;
          this.onboardingStep = 'auth_method';
        }
        this.notify();
        return false;
      }

      this.handledDeepLinkUrls.add(trimmedUrl);
      this.supabaseAuthError = null;
      const accountRes = await this.handleDirectSupabaseAuthSuccess(cbRes.session, {
        isPasswordRecovery: cbRes.isPasswordRecovery,
      });
      return Boolean(accountRes.success);
    })();

    this.activeDeepLinkUrl = trimmedUrl;
    this.activeDeepLinkAuthPromise = runPromise;
    try {
      return await runPromise;
    } finally {
      if (this.activeDeepLinkAuthPromise === runPromise) {
        this.activeDeepLinkAuthPromise = null;
        this.activeDeepLinkUrl = null;
      }
    }
  }

  public async completePasswordRecoveryFlow(sessionOverride?: Session | null): Promise<void> {
    this.activeSupabaseAuthVersion += 1;
    this.inFlightSupabaseProfileFetch = null;
    this.isSupabasePasswordRecoveryState = false;
    clearSupabasePasswordRecoveryState();

    if (sessionOverride?.user?.id) {
      this.supabaseSession = sessionOverride;
      this.supabaseAuthUserId = sessionOverride.user.id;
    } else if (!this.supabaseSession || !this.supabaseAuthUserId) {
      const sessionRes = await getCurrentSupabaseSession();
      if (sessionRes.session?.user?.id) {
        this.supabaseSession = sessionRes.session;
        this.supabaseAuthUserId = sessionRes.session.user.id;
      }
    }

    if (!this.supabaseAuthUserId) {
      this.onboardingStep = 'auth_method';
      this.notify();
      return;
    }

    if (this.supabaseAccountBundle?.exists && this.supabaseAccountBundle.profile) {
      this.applySupabaseAccountBundle(this.supabaseAccountBundle, {
        isPasswordRecovery: false,
      });
      this.notify();
      return;
    }

    await this.loadSupabaseAccountForUser(this.supabaseAuthUserId, {
      session: this.supabaseSession,
      isPasswordRecovery: false,
      forceReload: true,
    });
  }

  public async signOutSupabaseAccount(): Promise<SupabaseBasicResult> {
    if (this.isOnboardingPreviewSession) {
      this.isSettingsDrawerOpen = false;
      this.isEditOwnerModalOpen = false;
      this.onboardingStep = 'auth_method';
      this.notify();
      return {
        success: true,
        message: 'تم تسجيل الخروج من وضع المعاينة.',
      };
    }

    if (!isSupabaseConfigured()) {
      this.clearLocalSupabaseSessionState({
        errorMessage: null,
        markReady: true,
        preserveOnboardingSubstep: false,
      });
      this.onboardingStep = 'auth_method';
      this.isSettingsDrawerOpen = false;
      this.isEditOwnerModalOpen = false;
      this.notify();
      return {
        success: true,
        message: 'تم تسجيل الخروج بنجاح.',
      };
    }

    this.isSigningOutSupabase = true;
    try {
      const result = await signOutFromSupabase();
      if (!result.success) {
        this.supabaseAuthError = result.errorMessage ?? 'تعذر تسجيل الخروج حاليًا.';
        this.notify();
        return result;
      }

      const signedOutUserId = this.supabaseAuthUserId || this.loadedSupabaseUserId;
      this.activeSupabaseAuthVersion += 1;
      this.inFlightSupabaseProfileFetch = null;
      this.handledDeepLinkUrls.clear();
      this.clearStoredOfflineCache(signedOutUserId);
      this.clearLocalSupabaseSessionState({
        errorMessage: null,
        markReady: true,
        preserveOnboardingSubstep: false,
      });
      this.onboardingStep = 'auth_method';
      this.isSettingsDrawerOpen = false;
      this.isEditOwnerModalOpen = false;
      this.notify();
      return result;
    } finally {
      this.isSigningOutSupabase = false;
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener());
  }

  // Settings Drawer / Sidebar & Edit Owner View Visibility
  public isSettingsOpen(): boolean {
    return this.isSettingsDrawerOpen;
  }

  public setSettingsOpen(open: boolean): void {
    this.isSettingsDrawerOpen = open;
    this.notify();
  }

  public isEditOwnerModalVisible(): boolean {
    return this.isEditOwnerModalOpen;
  }

  public setEditOwnerModalVisible(open: boolean): void {
    this.isEditOwnerModalOpen = open;
    this.notify();
  }

  // Notifications Center & Preferences
  public isNotificationsOpen(): boolean {
    return this.isNotificationsModalOpen;
  }

  public setNotificationsOpen(open: boolean): void {
    this.isNotificationsModalOpen = open;
    this.notify();
  }

  public getNotificationsEnabled(): boolean {
    return this.notificationsEnabled;
  }

  public setNotificationsEnabled(enabled: boolean): void {
    const next = Boolean(enabled);
    this.notificationsEnabled = next;
    this.user.notificationsEnabled = next;
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('meow_notifications_enabled', next ? 'true' : 'false');
    }
    if (next) {
      void requestBrowserNotificationPermission();
    }
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void this.persistSupabasePreferences({ notificationsEnabled: next });
    } else if (!isSupabaseConfigured()) {
      void syncUserProfileToFirestore(this.user).catch((err) =>
        console.warn('Firestore profile notification pref sync skipped:', err)
      );
    }
    this.notify();
  }

  public getNotifications(): AppNotification[] {
    return [...this.notifications];
  }

  public getUnreadNotificationsCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  public addNotification(
    input: Omit<AppNotification, 'id' | 'createdAt' | 'timestampLabel' | 'read'> & {
      id?: string;
      read?: boolean;
      timestampLabel?: string;
    }
  ): AppNotification {
    const notifId = input.id || `notif_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const isRead = Boolean(
      input.read ||
        this.readNotificationIds.has(notifId) ||
        (input.targetRequestId && this.isRequestAlreadyHandled(input.targetRequestId) && input.type === 'contact_request')
    );
    if (isRead) {
      this.readNotificationIds.add(notifId);
      this.persistReadNotificationIds();
    }
    const notif: AppNotification = {
      id: notifId,
      type: input.type,
      title: input.title,
      body: input.body,
      read: isRead,
      celebrated: input.celebrated,
      targetTab: input.targetTab,
      targetSubTab: input.targetSubTab,
      targetRequestId: input.targetRequestId,
      targetConversationId: input.targetConversationId,
      targetPetId: input.targetPetId,
      createdAt: new Date().toISOString(),
      timestampLabel: input.timestampLabel || 'الآن',
    };
    this.notifications = [notif, ...this.notifications.filter((n) => n.id !== notif.id)].slice(0, 60);
    this.persistNotifications();
    if (!isSupabaseConfigured()) {
      void syncNotificationToFirestore(notif).catch((err) =>
        console.warn('Firestore notification sync skipped:', err)
      );
    }
    if (this.notificationsEnabled && !notif.read) {
      void showSystemNotification(notif);
    }
    this.notify();
    return notif;
  }

  private markNotificationsReadWhere(
    predicate: (n: AppNotification) => boolean,
    silent = false
  ): boolean {
    let changed = false;
    let readIdsAdded = false;
    const supabaseMarkedIds: string[] = [];
    this.notifications.forEach((n) => {
      if (!predicate(n)) return;
      if (!this.readNotificationIds.has(n.id)) {
        this.readNotificationIds.add(n.id);
        readIdsAdded = true;
      }
      if (!n.read) {
        n.read = true;
        changed = true;
        supabaseMarkedIds.push(n.id);
        if (!isSupabaseConfigured()) {
          void syncNotificationToFirestore(n).catch((err) =>
            console.warn('Firestore notification read sync skipped:', err)
          );
        }
      }
    });
    if (readIdsAdded) {
      this.persistReadNotificationIds();
    }
    if (
      supabaseMarkedIds.length > 0 &&
      this.isSupabaseAuthenticated() &&
      !this.isOnboardingPreviewSession
    ) {
      void markNotificationsReadInSupabase(this.user.id, supabaseMarkedIds);
    }
    if (changed) {
      this.persistNotifications();
      if (!silent) {
        this.notify();
      }
    }
    return changed;
  }

  public markRequestNotificationsRead(requestId: string): void {
    if (!requestId) return;
    this.markNotificationsReadWhere((n) => n.targetRequestId === requestId);
  }

  public markNotificationRead(notificationId: string): void {
    this.markNotificationsReadWhere((n) => n.id === notificationId);
  }

  public markAllNotificationsRead(): void {
    this.markNotificationsReadWhere(() => true);
  }

  public dismissNotification(notificationId: string): void {
    if (!notificationId) return;
    this.dismissedNotificationIds.add(notificationId);
    this.persistDismissedNotificationIds();
    this.readNotificationIds.add(notificationId);
    this.persistReadNotificationIds();
    this.notifications = this.notifications.filter((n) => n.id !== notificationId);
    this.persistNotifications();
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void dismissNotificationInSupabase(this.user.id, notificationId);
    } else if (!isSupabaseConfigured()) {
      void deleteNotificationFromFirestore(notificationId).catch((err) =>
        console.warn('Firestore notification delete skipped:', err)
      );
    }
    this.notify();
  }

  public async refreshFeed(sourceTab?: 'mating' | 'adoption' | 'chat'): Promise<void> {
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession && this.supabaseAuthUserId) {
      await this.hydrateSupabaseWorkspaceForUser(this.supabaseAuthUserId);
    }
    if (sourceTab === 'mating' || sourceTab === 'adoption' || !sourceTab) {
      this.recalculateAllCompatibilities();
    }
    this.reconcileNotificationsWithState(true);
    this.notify();
  }

  public openNotification(notificationId: string): void {
    const notif = this.notifications.find((n) => n.id === notificationId);
    if (!notif) return;
    this.markNotificationsReadWhere(
      (n) =>
        n.id === notificationId ||
        Boolean(notif.targetRequestId && n.targetRequestId === notif.targetRequestId) ||
        Boolean(notif.targetConversationId && n.targetConversationId === notif.targetConversationId),
      true
    );
    this.isNotificationsModalOpen = false;
    this.isSettingsDrawerOpen = false;
    this.currentTab = notif.targetTab || 'chat';

    if (notif.targetTab === 'chat') {
      if (notif.targetConversationId) {
        const conv = this.conversations.find((c) => c.id === notif.targetConversationId);
        if (conv) {
          this.chatSubTab = 'chats';
          this.setActiveConversationId(conv.id);
          return;
        }
      }
      if (notif.targetRequestId) {
        const matchedConv = this.conversations.find((c) => c.requestId === notif.targetRequestId);
        if (matchedConv && notif.type !== 'contact_request') {
          this.chatSubTab = 'chats';
          this.setActiveConversationId(matchedConv.id);
          return;
        }
        this.chatSubTab = notif.targetSubTab || 'requests';
        this.activeConversationId = null;
      } else if (notif.targetSubTab) {
        this.chatSubTab = notif.targetSubTab;
        this.activeConversationId = null;
      }
    }
    this.notify();
  }

  public getChatSubTab(): 'chats' | 'requests' {
    return this.chatSubTab;
  }

  public setChatSubTab(subTab: 'chats' | 'requests', opts?: { silent?: boolean }): void {
    this.chatSubTab = subTab;
    if (subTab === 'requests') {
      this.markNotificationsReadWhere(
        (n) => n.type === 'contact_request' || n.targetSubTab === 'requests',
        true
      );
    }
    if (!opts?.silent) {
      this.notify();
    }
  }

  public getUnreadChatMessagesCount(): number {
    return this.getConversations().reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }

  // Dark Mode removed - safe no-ops
  public isDark(): boolean {
    return false;
  }

  public toggleDarkMode(): void {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
    }
  }

  // Onboarding
  public isPreviewOnboardingMode(): boolean {
    return this.isOnboardingPreviewSession;
  }

  public getNewTabPreviewUrl(step: OnboardingStep = 'splash'): string {
    if (typeof window === 'undefined') return '/?preview=onboarding';
    const url = new URL(window.location.href);
    url.search = step === 'splash' ? '?preview=onboarding' : `?preview=onboarding&step=${step}`;
    url.hash = '';
    return url.toString();
  }

  public getOnboardingStep(): OnboardingStep {
    return this.onboardingStep;
  }

  public isTermsAccepted(): boolean {
    return this.termsAcceptedInOnboarding;
  }

  public setTermsAccepted(accepted: boolean, silent = false): void {
    this.termsAcceptedInOnboarding = Boolean(accepted);
    if (!silent) {
      this.notify();
    }
  }

  public getAuthenticatedGoogleAccount(): GoogleAuthAccount | null {
    return this.authenticatedGoogleAccount;
  }

  public isOwnerDetailsCompleted(): boolean {
    return this.ownerDetailsCompleted;
  }

  public completeGoogleAuthentication(
    account: GoogleAuthAccount,
    mode: 'signup' | 'login'
  ): boolean {
    if (!this.termsAcceptedInOnboarding || !account?.uid) {
      return false;
    }

    this.authenticatedGoogleAccount = account;
    if (account.email) {
      this.user.email = account.email;
    }
    if (account.photoURL) {
      this.user.avatar = account.photoURL;
    }

    if (mode === 'login') {
      if (typeof localStorage !== 'undefined') {
        try {
          const raw = localStorage.getItem('meow_accounts_v1');
          const accounts = raw ? (JSON.parse(raw) as Record<string, Partial<UserProfile>>) : {};
          const existing = accounts[account.uid] || (account.email ? accounts[account.email] : undefined);
          if (existing) {
            if (existing.name) this.user.name = existing.name;
            if (existing.city) this.user.city = existing.city;
            if (existing.governorate) this.user.governorate = existing.governorate;
            if (existing.markaz) this.user.markaz = existing.markaz;
            if (existing.village) this.user.village = existing.village;
            if (existing.governorateId) this.user.governorateId = existing.governorateId;
            if (existing.markazId) this.user.markazId = existing.markazId;
            if (existing.cityId) this.user.cityId = existing.cityId;
            if (existing.villageId) this.user.villageId = existing.villageId;
            if (existing.locationId) this.user.locationId = existing.locationId;
            if (existing.phone) this.user.phone = existing.phone;
            if (existing.gender === 'male' || existing.gender === 'female') {
              this.user.gender = existing.gender;
            }
            const restoredShowPhone = Boolean(existing.showPhoneInProfile);
            this.user.showPhoneInProfile = restoredShowPhone;
            this.user.privacyMode = restoredShowPhone ? 'public' : 'private';
            this.user.showPhoneOnlyAfterApproval = restoredShowPhone;
            localStorage.setItem('meow_show_phone_in_profile', restoredShowPhone ? 'true' : 'false');
          }
        } catch {
          // Ignore storage parse error
        }
      }
      this.persistOwnerProfileToLocalStorage();
      this.ownerDetailsCompleted = true;
      this.onboardingStep = 'completed';
      if (!this.isOnboardingPreviewSession && typeof localStorage !== 'undefined') {
        localStorage.setItem('meow_onboarding_done', 'true');
      }
      void syncUserProfileToFirestore(this.user).catch((err) =>
        console.warn('Firestore profile sync skipped:', err)
      );
      this.notify();
      return true;
    }

    this.onboardingStep = 'owner_details';
    void syncUserProfileToFirestore(this.user).catch((err) =>
      console.warn('Firestore profile sync skipped:', err)
    );
    this.notify();
    return true;
  }

  private buildResolvedOwnerSnapshot(
    baseProfile: UserProfile,
    name: string,
    cityOrLoc: string,
    phone: string,
    gender?: 'male' | 'female',
    governorate?: string,
    extraLoc?: {
      governorateId?: string;
      markazId?: string;
      cityId?: string;
      villageId?: string;
      markaz?: string;
      village?: string;
    }
  ): {
    profile: UserProfile;
    resolvedGov: string;
    resolvedMarkaz: string;
    resolvedCity: string;
    resolvedVillage: string;
  } {
    const lineage = resolveLocationLineage({
      governorateId: extraLoc?.governorateId,
      markazId: extraLoc?.markazId,
      cityId: extraLoc?.cityId,
      villageId: extraLoc?.villageId,
      governorate: governorate ?? baseProfile.governorate,
      markaz: extraLoc?.markaz,
      city: cityOrLoc,
      village: extraLoc?.village,
    });
    const resolvedGov = lineage.governorate?.name || governorate || baseProfile.governorate || '';
    const resolvedMarkaz = lineage.markaz?.name || extraLoc?.markaz || '';
    const resolvedCity = lineage.city?.name || cityOrLoc;
    const resolvedVillage = lineage.village?.name || extraLoc?.village || '';
    const resolvedCoords = lineage.deepest
      ? { lat: lineage.deepest.lat, lng: lineage.deepest.lng }
      : resolveLocationCoordinates({ governorate: resolvedGov, city: resolvedCity });

    const nextProfile: UserProfile = {
      ...baseProfile,
      name,
      city: resolvedCity,
      ...(resolvedGov ? { governorate: resolvedGov } : {}),
      markaz: resolvedMarkaz || undefined,
      village: resolvedVillage || undefined,
      governorateId: lineage.governorate?.id || extraLoc?.governorateId || baseProfile.governorateId,
      markazId: lineage.markaz?.id || extraLoc?.markazId,
      cityId: lineage.city?.id || extraLoc?.cityId,
      villageId: lineage.village?.id || extraLoc?.villageId,
      locationId: lineage.deepest?.id || baseProfile.locationId,
      lat: resolvedCoords ? resolvedCoords.lat : baseProfile.lat,
      lng: resolvedCoords ? resolvedCoords.lng : baseProfile.lng,
      phone,
      ...(gender === 'male' || gender === 'female' ? { gender } : {}),
    };

    return {
      profile: nextProfile,
      resolvedGov,
      resolvedMarkaz,
      resolvedCity,
      resolvedVillage,
    };
  }

  public setOwnerDetailsCompleted(
    name: string,
    cityOrLoc: string,
    phone: string,
    gender: 'male' | 'female',
    governorate: string,
    extraLoc?: {
      governorateId?: string;
      markazId?: string;
      cityId?: string;
      villageId?: string;
      markaz?: string;
      village?: string;
    }
  ): void {
    const resolved = this.buildResolvedOwnerSnapshot(
      this.user,
      name,
      cityOrLoc,
      phone,
      gender,
      governorate,
      extraLoc
    );
    this.user = resolved.profile;
    this.ownerDetailsCompleted = true;
    this.persistOwnerProfileToLocalStorage();

    // Update user's existing owned pets contact & geo metadata
    this.userPets.forEach((p) => {
      p.ownerName = name;
      p.ownerPhone = phone;
      if (gender) {
        p.area = resolved.resolvedVillage || resolved.resolvedCity;
        p.city = resolved.resolvedCity;
        p.governorate = resolved.resolvedGov;
        p.markaz = resolved.resolvedMarkaz || undefined;
        p.village = resolved.resolvedVillage || undefined;
        p.governorateId = this.user.governorateId;
        p.markazId = this.user.markazId;
        p.cityId = this.user.cityId;
        p.villageId = this.user.villageId;
        p.locationId = this.user.locationId;
        p.lat = this.user.lat;
        p.lng = this.user.lng;
      }
    });

    this.recalculateAllCompatibilities();
    this.onboardingStep = 'has_pet';
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void this.persistSupabaseAccountBundle({
        adviceDismissed: this.isAdviceDismissed,
        onboardingDone: false,
      });
    } else if (!isSupabaseConfigured()) {
      void syncUserProfileToFirestore(this.user).catch((err) =>
        console.warn('Firestore profile sync skipped:', err)
      );
    }
    this.notify();
  }

  public async saveOwnerDetailsAndAdvance(
    name: string,
    cityOrLoc: string,
    phone: string,
    gender: 'male' | 'female',
    governorate: string,
    extraLoc?: {
      governorateId?: string;
      markazId?: string;
      cityId?: string;
      villageId?: string;
      markaz?: string;
      village?: string;
    }
  ): Promise<{ success: boolean; errorMessage?: string }> {
    if (this.isOnboardingPreviewSession || !isSupabaseConfigured()) {
      this.setOwnerDetailsCompleted(name, cityOrLoc, phone, gender, governorate, extraLoc);
      return { success: true };
    }

    if (!this.isSupabaseAuthenticated() || !this.supabaseAuthUserId) {
      return {
        success: false,
        errorMessage: 'يرجى تسجيل الدخول بحساب مؤكد أولاً قبل حفظ بيانات المالك.',
      };
    }

    const baseSnapshot = this.getPersistableSupabaseUserProfile();
    const resolved = this.buildResolvedOwnerSnapshot(
      baseSnapshot,
      name,
      cityOrLoc,
      phone,
      gender,
      governorate,
      extraLoc
    );

    const writeRes = await this.enqueueSupabaseAccountWrite(async (expectedVersion) => {
      const res = await saveSupabaseUserAccountBundle(resolved.profile, {
        adviceDismissed: this.isAdviceDismissed,
        onboardingDone: false,
      });
      if (expectedVersion !== this.activeSupabaseAuthVersion) return res;
      if (res.success && res.bundle) {
        this.supabaseAccountBundle = res.bundle;
        this.supabaseAuthError = null;
      } else if (!res.success && res.errorMessage) {
        this.supabaseAuthError = res.errorMessage;
      }
      return res;
    });

    if (!writeRes || !writeRes.success) {
      this.notify();
      return {
        success: false,
        errorMessage:
          writeRes?.errorMessage ||
          'تعذر حفظ بيانات المالك في قاعدة البيانات. يرجى المحاولة مرة أخرى.',
      };
    }

    const hydratedProfile = writeRes.bundle?.profile;
    this.user = {
      ...(hydratedProfile || resolved.profile),
      avatar:
        this.rawSupabaseAvatarUrl ||
        hydratedProfile?.avatar ||
        this.user.avatar ||
        DEFAULT_USER_AVATAR_FALLBACK,
    };
    this.ownerDetailsCompleted = true;
    this.persistOwnerProfileToLocalStorage();
    this.syncOwnedPetsMetadataWithUser(this.user.id);
    this.userPets.forEach((p) => {
      p.area = resolved.resolvedVillage || resolved.resolvedCity;
      p.city = resolved.resolvedCity;
      p.governorate = resolved.resolvedGov;
      p.markaz = resolved.resolvedMarkaz || undefined;
      p.village = resolved.resolvedVillage || undefined;
      p.governorateId = this.user.governorateId;
      p.markazId = this.user.markazId;
      p.cityId = this.user.cityId;
      p.villageId = this.user.villageId;
      p.locationId = this.user.locationId;
      p.lat = this.user.lat;
      p.lng = this.user.lng;
    });
    this.recalculateAllCompatibilities();
    this.onboardingStep = 'has_pet';
    this.notify();
    return { success: true };
  }

  public async completeOnboardingWithSupabase(): Promise<{
    success: boolean;
    errorMessage?: string;
  }> {
    if (this.isOnboardingPreviewSession || !isSupabaseConfigured()) {
      this.setOnboardingStep('completed');
      return { success: true };
    }

    if (!this.isSupabaseAuthenticated() || !this.supabaseAuthUserId) {
      return {
        success: false,
        errorMessage: 'يرجى تسجيل الدخول أولاً قبل إتمام التسجيل.',
      };
    }

    if (!this.ownerDetailsCompleted) {
      return {
        success: false,
        errorMessage: 'يرجى استكمال وحفظ بيانات المالك أولاً قبل المتابعة.',
      };
    }

    const res = await this.persistSupabasePreferences({ onboardingDone: true });
    if (!res || !res.success) {
      return {
        success: false,
        errorMessage:
          res?.errorMessage ||
          'تعذر تأكيد إتمام التسجيل في قاعدة البيانات. يرجى المحاولة مرة أخرى.',
      };
    }

    this.onboardingStep = 'completed';
    if (this.supabaseAccountBundle) {
      this.supabaseAccountBundle = {
        ...this.supabaseAccountBundle,
        onboardingDone: true,
      };
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('meow_onboarding_done', 'true');
    }
    this.persistOfflineSnapshotForCurrentUser();
    if (this.supabaseAuthUserId) {
      void this.hydrateSupabaseWorkspaceForUser(this.supabaseAuthUserId);
      this.ensureWorkspaceRealtime(this.supabaseAuthUserId);
    }
    this.notify();
    return { success: true };
  }

  private clearSplashTimers(): void {
    if (this.splashMinTimer) {
      clearTimeout(this.splashMinTimer);
      this.splashMinTimer = null;
    }
    if (this.splashMaxTimer) {
      clearTimeout(this.splashMaxTimer);
      this.splashMaxTimer = null;
    }
  }

  public resetSplashState(): void {
    this.clearSplashTimers();
    this.onboardingStep = 'splash';
    this.splashStartedAt = Date.now();
    this.splashViewMounted = false;
    this.splashTransitionLocked = false;
    this.splashLoadingDelayed = false;
    this.deferredSplashTargetStep = null;
    if (!this.isOnboardingPreviewSession) {
      this.scheduleSplashAutoTransition();
    }
  }

  public markSplashViewMounted(): void {
    if (
      this.splashViewMounted ||
      this.isOnboardingPreviewSession ||
      this.onboardingStep !== 'splash' ||
      this.splashTransitionLocked
    ) {
      return;
    }
    this.splashViewMounted = true;
    this.splashStartedAt = Date.now();
    this.clearSplashTimers();
    this.scheduleSplashAutoTransition();
  }

  private computeDefaultSplashTarget(): OnboardingStep {
    if (this.isSupabasePasswordRecoveryState) return 'auth_method';
    if (this.deferredSplashTargetStep && this.deferredSplashTargetStep !== 'splash') {
      return this.deferredSplashTargetStep;
    }
    if (this.isSupabaseAuthenticated()) {
      return this.ownerDetailsCompleted ? 'completed' : 'owner_details';
    }
    if (
      !isSupabaseConfigured() &&
      typeof localStorage !== 'undefined' &&
      localStorage.getItem('meow_onboarding_done') === 'true'
    ) {
      return 'completed';
    }
    return 'welcome';
  }

  private deferOrSetOnboardingStep(target: OnboardingStep): void {
    if (this.onboardingStep === 'splash' && !this.isOnboardingPreviewSession) {
      this.deferredSplashTargetStep = target;
      this.tryFinalizeSplashTransition();
      return;
    }
    this.onboardingStep = target;
  }

  private completeSplashTransition(): void {
    if (
      this.splashTransitionLocked ||
      this.onboardingStep !== 'splash' ||
      this.isOnboardingPreviewSession
    ) {
      return;
    }
    this.splashTransitionLocked = true;
    this.clearSplashTimers();
    this.splashLoadingDelayed = false;
    this.pendingSplashAdvance = false;
    this.onboardingStep = this.computeDefaultSplashTarget();
    this.notify();
  }

  private tryFinalizeSplashTransition(): void {
    if (
      this.splashTransitionLocked ||
      this.onboardingStep !== 'splash' ||
      this.isOnboardingPreviewSession
    ) {
      return;
    }
    const elapsed = Date.now() - this.splashStartedAt;
    const authReady = this.isSupabaseAuthReady && !this.isSupabaseProfileLoading;
    if (elapsed >= SPLASH_MIN_DURATION_MS && authReady) {
      this.completeSplashTransition();
    }
  }

  public isSplashLoadingDelayed(): boolean {
    return this.splashLoadingDelayed && this.onboardingStep === 'splash';
  }

  public getSplashMinDurationMs(): number {
    return SPLASH_MIN_DURATION_MS;
  }

  public scheduleSplashAutoTransition(): void {
    if (
      this.isOnboardingPreviewSession ||
      this.onboardingStep !== 'splash' ||
      this.splashTransitionLocked ||
      this.splashMinTimer !== null
    ) {
      return;
    }

    const elapsed = Date.now() - this.splashStartedAt;
    const minRemaining = Math.max(0, SPLASH_MIN_DURATION_MS - elapsed);
    const maxRemaining = Math.max(minRemaining + 500, SPLASH_MAX_WAIT_MS - elapsed);

    this.splashMinTimer = setTimeout(() => {
      this.splashMinTimer = null;
      if (
        this.splashTransitionLocked ||
        this.onboardingStep !== 'splash' ||
        this.isOnboardingPreviewSession
      ) {
        return;
      }
      if (this.isSupabaseAuthReady && !this.isSupabaseProfileLoading) {
        this.completeSplashTransition();
      } else {
        this.splashLoadingDelayed = true;
        this.notify();
      }
    }, minRemaining);

    this.splashMaxTimer = setTimeout(() => {
      this.splashMaxTimer = null;
      if (
        this.splashTransitionLocked ||
        this.onboardingStep !== 'splash' ||
        this.isOnboardingPreviewSession
      ) {
        return;
      }
      this.isSupabaseAuthReady = true;
      this.isSupabaseProfileLoading = false;
      this.completeSplashTransition();
    }, maxRemaining);
  }

  public setOnboardingStep(step: OnboardingStep): void {
    if (
      step !== 'splash' &&
      this.onboardingStep === 'splash' &&
      !this.isOnboardingPreviewSession
    ) {
      const elapsed = Date.now() - this.splashStartedAt;
      if (
        elapsed < SPLASH_MIN_DURATION_MS ||
        (isSupabaseConfigured() && (!this.isSupabaseAuthReady || this.isSupabaseProfileLoading))
      ) {
        this.deferredSplashTargetStep = step;
        this.pendingSplashAdvance = true;
        this.scheduleSplashAutoTransition();
        return;
      }
    }

    if (
      this.isSupabasePasswordRecoveryState &&
      !this.isOnboardingPreviewSession &&
      step !== 'auth_method' &&
      step !== 'welcome' &&
      step !== 'splash'
    ) {
      return;
    }

    const order: OnboardingStep[] = [
      'splash',
      'welcome',
      'auth_method',
      'owner_details',
      'has_pet',
      'pet_details',
      'completed',
    ];
    const currentIdx = order.indexOf(this.onboardingStep);
    const targetIdx = order.indexOf(step);
    const hasAuthIdentity = Boolean(
      this.authenticatedGoogleAccount || this.supabaseAuthUserId
    );

    // Enforce forward prerequisites so required onboarding steps cannot be skipped
    if (targetIdx > currentIdx) {
      if (step === 'owner_details') {
        if (!this.termsAcceptedInOnboarding || !hasAuthIdentity) {
          return;
        }
      } else if (step === 'has_pet' || step === 'pet_details') {
        if (!this.ownerDetailsCompleted) {
          return;
        }
      } else if (step === 'completed') {
        const hasValidAuth = Boolean(this.termsAcceptedInOnboarding && hasAuthIdentity);
        if (!hasValidAuth || !this.ownerDetailsCompleted) {
          return;
        }
      }
    }

    if ((step === 'splash' || step === 'auth_method') && this.onboardingStep !== step) {
      this.termsAcceptedInOnboarding = false;
    }
    this.onboardingStep = step;
    if (step !== 'splash') {
      this.clearSplashTimers();
      this.splashTransitionLocked = true;
      this.splashLoadingDelayed = false;
    }
    if (step === 'completed' && !this.isOnboardingPreviewSession) {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('meow_onboarding_done', 'true');
      }
      if (this.isSupabaseAuthenticated()) {
        void this.persistSupabasePreferences({ onboardingDone: true });
      }
    }
    this.notify();
  }

  public restartOnboarding(): void {
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void this.signOutSupabaseAccount();
      return;
    }
    this.authenticatedGoogleAccount = null;
    this.termsAcceptedInOnboarding = false;
    this.ownerDetailsCompleted = false;
    if (!this.isOnboardingPreviewSession && typeof localStorage !== 'undefined') {
      localStorage.removeItem('meow_onboarding_done');
    }
    this.resetSplashState();
    this.notify();
  }

  // OTA & APK Release Update Actions
  public getUpdateState(): {
    result: UpdateCheckResult;
    isChecking: boolean;
    isApplyingOta: boolean;
    isApkModalOpen: boolean;
    isOtaNoticeVisible: boolean;
    isOtaStagedForRestart: boolean;
    stagedOtaVersion: string | null;
    feedback: { kind: 'success' | 'error' | 'info'; message: string } | null;
  } {
    return {
      result: this.updateCheckResult,
      isChecking: this.isCheckingUpdates,
      isApplyingOta: this.isApplyingOtaUpdate,
      isApkModalOpen: this.isApkUpdateModalOpen,
      isOtaNoticeVisible: this.isOtaNoticeVisible,
      isOtaStagedForRestart: this.isOtaStagedForRestart,
      stagedOtaVersion: this.stagedOtaVersion,
      feedback: this.updateActionFeedback,
    };
  }

  private buildOtaDismissKey(ota: OtaManifest): string {
    const channel = ota.channel || APP_VERSION_INFO.channel;
    return `${channel}:${ota.version}`;
  }

  public clearUpdateFeedback(): void {
    this.updateActionFeedback = null;
    this.notify();
  }

  public dismissApkUpdateModal(): void {
    const apk = this.updateCheckResult.apkUpdate;
    if (apk?.isMandatory) return;
    if (apk?.latestVersion) {
      this.apkUpdateDismissedVersion = apk.latestVersion;
    }
    this.isApkUpdateModalOpen = false;
    this.notify();
  }

  public dismissOtaNotice(): void {
    const ota = this.updateCheckResult.otaUpdate;
    if (ota && !ota.mandatory) {
      const key = this.buildOtaDismissKey(ota);
      this.otaUpdateDismissedVersion = key;
      writeStoredDismissedOtaVersion(key);
    }
    this.isOtaNoticeVisible = false;
    this.notify();
  }

  public async checkForAppUpdates(interactive = false): Promise<UpdateCheckResult> {
    if (this.isCheckingUpdates) return this.updateCheckResult;
    this.isCheckingUpdates = true;
    if (interactive) {
      this.updateActionFeedback = null;
      this.notify();
    }

    try {
      const result = await checkForUpdates();
      this.updateCheckResult = result;
      this.otaUpdateDismissedVersion = readStoredDismissedOtaVersion();

      if (
        result.apkUpdate &&
        (interactive ||
          result.apkUpdate.isMandatory ||
          this.apkUpdateDismissedVersion !== result.apkUpdate.latestVersion)
      ) {
        this.isApkUpdateModalOpen = true;
        this.isOtaNoticeVisible = false;
      } else if (result.otaUpdate && !this.isApkUpdateModalOpen) {
        const dismissKey = this.buildOtaDismissKey(result.otaUpdate);
        const alreadyDismissed = this.otaUpdateDismissedVersion === dismissKey;
        const alreadyStaged =
          this.isOtaStagedForRestart && this.stagedOtaVersion === result.otaUpdate.version;

        if (alreadyStaged) {
          this.isOtaNoticeVisible = !alreadyDismissed && !this.isSettingsOpen();
        } else if (interactive) {
          this.isOtaNoticeVisible = !this.isSettingsOpen();
        } else {
          this.isOtaNoticeVisible = Boolean(result.otaUpdate.mandatory) || !alreadyDismissed;
        }
      } else if (!this.isOtaStagedForRestart) {
        this.isOtaNoticeVisible = false;
      }

      if (interactive) {
        if (!result.configured) {
          this.updateActionFeedback = {
            kind: 'info',
            message: 'أنت تستخدم أحدث إصدار مضمّن حالياً.',
          };
        } else if (result.status === 'up_to_date') {
          this.updateActionFeedback = {
            kind: 'success',
            message: `التطبيق محدّث لأحدث إصدار (${result.currentBundleVersion}).`,
          };
        } else if (result.status === 'ota_available' && result.otaUpdate) {
          this.updateActionFeedback = {
            kind: 'info',
            message: `يتوفر تحديث متوافق جديد (${result.otaUpdate.version}) بدون الحاجة لتنزيل APK.`,
          };
        } else if (result.status === 'apk_required' && result.apkUpdate) {
          this.updateActionFeedback = {
            kind: 'info',
            message: `يتوفر تحديث APK جديد (${result.apkUpdate.latestVersion}).`,
          };
        } else if (result.status === 'error') {
          this.updateActionFeedback = {
            kind: 'error',
            message: result.errorMessage || 'تعذر التحقق من التحديثات حالياً.',
          };
        }
      }
      return result;
    } finally {
      this.isCheckingUpdates = false;
      this.notify();
    }
  }

  public async applyOtaUpdateNow(): Promise<void> {
    const ota = this.updateCheckResult.otaUpdate;
    if (!ota || this.isApplyingOtaUpdate) return;
    this.isApplyingOtaUpdate = true;
    this.updateActionFeedback = null;
    this.notify();

    try {
      const res = await applyOtaUpdate(ota);
      if (res.success) {
        const targetVer = res.version || ota.version;
        this.isOtaStagedForRestart = true;
        this.stagedOtaVersion = targetVer;
        const key = this.buildOtaDismissKey(ota);
        this.otaUpdateDismissedVersion = key;
        writeStoredDismissedOtaVersion(key);
        this.updateActionFeedback = {
          kind: 'success',
          message: `تم تنزيل وتجهيز التحديث (${targetVer}) بنجاح. سيُفعّل تلقائيًا عند وضع التطبيق في الخلفية أو إعادة فتحه، أو يمكنك إعادة التشغيل الآن.`,
        };
      } else {
        this.updateActionFeedback = {
          kind: 'error',
          message: res.errorMessage || 'تعذر تنزيل التحديث الهوائي. تأكد من الاتصال وحاول لاحقًا.',
        };
      }
    } finally {
      this.isApplyingOtaUpdate = false;
      this.notify();
    }
  }

  public async restartForStagedOtaUpdate(): Promise<void> {
    if (!this.isOtaStagedForRestart) return;
    const res = await reloadAppToApplyStagedUpdate();
    if (!res.success) {
      this.updateActionFeedback = {
        kind: 'error',
        message: res.errorMessage || 'تعذر إعادة تشغيل التطبيق لتفعيل التحديث.',
      };
      this.notify();
    }
  }

  // Meow Advice Dismissal
  public getIsAdviceDismissed(): boolean {
    return this.isAdviceDismissed;
  }

  public dismissAdvice(): void {
    this.isAdviceDismissed = true;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('meow_advice_dismissed', 'true');
    }
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void this.persistSupabasePreferences({ adviceDismissed: true });
    }
    this.notify();
  }

  // Modern Filter Modal
  public getIsFilterModalOpen(): boolean {
    return this.isFilterModalOpen;
  }

  public setFilterModalOpen(open: boolean): void {
    this.isFilterModalOpen = open;
    this.notify();
  }

  // Getters
  public getCurrentTab(): MainTab {
    return this.currentTab;
  }

  public getLastTabTransitionDirection(): 'next' | 'prev' | 'none' {
    return this.lastTabTransitionDirection;
  }

  public consumeTabTransitionDirection(): 'next' | 'prev' | 'none' {
    const dir = this.lastTabTransitionDirection;
    this.lastTabTransitionDirection = 'none';
    return dir;
  }

  public isClinicNotifyRequested(): boolean {
    return this.clinicNotifyRequested;
  }

  public requestClinicNotify(): void {
    this.clinicNotifyRequested = true;
    writeStoredBooleanFlag(CLINIC_NOTIFY_STORAGE_KEY, true);
  }

  public isStoreNotifyRequested(): boolean {
    return this.storeNotifyRequested;
  }

  public requestStoreNotify(): void {
    this.storeNotifyRequested = true;
    writeStoredBooleanFlag(STORE_NOTIFY_STORAGE_KEY, true);
  }

  public setCurrentTab(tab: MainTab): void {
    const prevIdx = MAIN_TAB_ORDER.indexOf(this.currentTab);
    const nextIdx = MAIN_TAB_ORDER.indexOf(tab);
    if (prevIdx !== -1 && nextIdx !== -1 && prevIdx !== nextIdx) {
      this.lastTabTransitionDirection = nextIdx > prevIdx ? 'next' : 'prev';
    } else {
      this.lastTabTransitionDirection = 'none';
    }
    this.currentTab = tab;
    if (tab === 'chat' && this.chatSubTab === 'requests') {
      this.markNotificationsReadWhere(
        (n) => n.type === 'contact_request' || n.targetSubTab === 'requests',
        true
      );
    }
    this.notify();
  }

  public getUser(): UserProfile {
    return this.user;
  }

  public getUserPets(): Pet[] {
    return this.userPets;
  }

  public getUserMatingPets(): Pet[] {
    return this.userPets.filter((p) => p.status === 'mating');
  }

  public getPrimaryUserMatingPet(): Pet | undefined {
    return this.userPets.find((p) => p.status === 'mating');
  }

  public getFilteringLoadingState(): { active: boolean; label: string } {
    return {
      active: this.isFilteringLoading,
      label: this.filteringLoadingLabel,
    };
  }

  public runWithFilteringLoading(label: string, applyFn: () => void, durationMs = 240): void {
    if (this.filteringLoadingTimer) {
      clearTimeout(this.filteringLoadingTimer);
      this.filteringLoadingTimer = null;
    }
    this.isFilteringLoading = true;
    this.filteringLoadingLabel = label;
    applyFn();
    this.notify();

    this.filteringLoadingTimer = setTimeout(() => {
      this.isFilteringLoading = false;
      this.filteringLoadingLabel = '';
      this.filteringLoadingTimer = null;
      this.notify();
    }, durationMs);
  }

  public getRecommendedReferencePet(): Pet | undefined {
    const requestedId = this.matingFilters.recommendedForPetId;
    if (requestedId) {
      const found = this.userPets.find((p) => p.id === requestedId);
      if (found) return found;
    }
    return this.getPrimaryUserMatingPet() || this.userPets[0];
  }

  /**
   * Computes suggested filter controls for a user's pet WITHOUT mutating active filters.
   * Used inside FilterModal when user taps «الترشيح المناسب» so fields populate cleanly
   * and remain editable until «تطبيق الفلترة» is pressed.
   */
  public getRecommendedFilterPreset(petId?: string): {
    refPet?: Pet;
    species: 'all' | 'cat' | 'dog';
    gender: 'all' | 'male' | 'female';
    breed: string;
    hybridBreed: string;
    color: string;
    ageYears?: number;
    ageMonths?: number;
    vaccinationStatus: 'all' | 'fully_vaccinated' | 'not_vaccinated';
    governorateId: string;
    governorate: string;
    markazId: string;
    markaz: string;
    cityId: string;
    city: string;
    villageId: string;
    village: string;
    locationId: string;
  } | null {
    const refPet = petId
      ? this.userPets.find((p) => p.id === petId)
      : this.getRecommendedReferencePet();
    if (!refPet) return null;

    const petHasAnyLoc = Boolean(
      refPet.governorateId ||
        refPet.markazId ||
        refPet.cityId ||
        refPet.villageId ||
        refPet.locationId ||
        refPet.governorate ||
        refPet.markaz ||
        refPet.city ||
        refPet.village ||
        refPet.area
    );
    const lineage = resolveLocationLineage(petHasAnyLoc ? refPet : this.user);
    const species: 'cat' | 'dog' = refPet.species === 'dog' ? 'dog' : 'cat';
    const oppositeGender: 'male' | 'female' = refPet.gender === 'male' ? 'female' : 'male';
    const breedPool = species === 'dog' ? DOG_BREEDS : CAT_BREEDS;

    const matchBreedPool = (rawValue?: string): string => {
      const cleaned = (rawValue || '').trim();
      if (!cleaned) return '';
      const normVal = normalizeArabic(cleaned);
      const matched = breedPool.find((opt) => {
        const cleanOpt = normalizeArabic(opt.replace(/\([^)]*\)/g, ''));
        return (
          cleanOpt &&
          (normVal.includes(cleanOpt) ||
            cleanOpt.includes(normVal) ||
            normVal.split(/\s+/).some((tok) => tok.length >= 3 && cleanOpt.includes(tok)))
        );
      });
      return matched || cleaned;
    };

    const matchedBreed = matchBreedPool(refPet.breed);
    const rawHybrid = (refPet.hybridBreed || '').trim();
    const matchedHybrid =
      !rawHybrid || rawHybrid === 'بدون هجين' ? 'none' : matchBreedPool(rawHybrid);

    const govId = lineage.governorate?.id || (petHasAnyLoc ? refPet.governorateId : this.user.governorateId) || '';
    const govName = lineage.governorate?.name || (petHasAnyLoc ? refPet.governorate : this.user.governorate) || '';
    const markazId = govId
      ? lineage.markaz?.id || (petHasAnyLoc ? refPet.markazId : this.user.markazId) || ''
      : '';
    const markazName = govId
      ? lineage.markaz?.name || (petHasAnyLoc ? refPet.markaz : this.user.markaz) || ''
      : '';
    const cityId = markazId
      ? lineage.city?.id || (petHasAnyLoc ? refPet.cityId : this.user.cityId) || ''
      : '';
    const cityName = markazId
      ? lineage.city?.name || (petHasAnyLoc ? refPet.city : this.user.city) || ''
      : '';
    const villageId = cityId
      ? lineage.village?.id || (petHasAnyLoc ? refPet.villageId : this.user.villageId) || ''
      : '';
    const villageName = cityId
      ? lineage.village?.name || (petHasAnyLoc ? refPet.village : this.user.village) || ''
      : '';

    return {
      refPet,
      species,
      gender: oppositeGender,
      breed: matchedBreed,
      hybridBreed: matchedHybrid,
      color: (refPet.color || '').trim(),
      ageYears:
        typeof refPet.ageYears === 'number' && !Number.isNaN(refPet.ageYears)
          ? refPet.ageYears
          : undefined,
      ageMonths:
        typeof refPet.ageMonths === 'number' && !Number.isNaN(refPet.ageMonths)
          ? refPet.ageMonths
          : undefined,
      vaccinationStatus:
        refPet.vaccinationStatus === 'fully_vaccinated' ||
        refPet.vaccinationStatus === 'partially_vaccinated'
          ? 'fully_vaccinated'
          : 'all',
      governorateId: govId,
      governorate: govName,
      markazId,
      markaz: markazName,
      cityId,
      city: cityName,
      villageId,
      village: villageName,
      locationId: villageId || cityId || markazId || govId || '',
    };
  }

  public setMatingRecommendedMode(enabled: boolean, petId?: string): void {
    if (!enabled) {
      this.matingFilters = {
        ...this.matingFilters,
        species: 'all',
        gender: 'all',
        breed: '',
        hybridBreed: '',
        ageYears: undefined,
        ageMonths: undefined,
        color: '',
        vaccinationStatus: 'all',
        governorate: '',
        markaz: '',
        city: '',
        village: '',
        governorateId: '',
        markazId: '',
        cityId: '',
        villageId: '',
        locationId: '',
        recommendedMatchEnabled: false,
        recommendedForPetId: undefined,
        sortBy: 'newest',
      };
      this.recalculateAllCompatibilities();
      this.notify();
      return;
    }

    const preset = this.getRecommendedFilterPreset(petId);
    const refPet = preset?.refPet;

    this.matingFilters = {
      ...this.matingFilters,
      species: preset?.species ?? 'all',
      gender: preset?.gender ?? 'all',
      breed: preset?.breed ?? '',
      hybridBreed: preset?.hybridBreed ?? '',
      color: preset?.color ?? '',
      ageYears: preset?.ageYears,
      ageMonths: preset?.ageMonths,
      vaccinationStatus: preset?.vaccinationStatus ?? 'all',
      governorateId: preset?.governorateId ?? '',
      governorate: preset?.governorate ?? '',
      markazId: preset?.markazId ?? '',
      markaz: preset?.markaz ?? '',
      cityId: preset?.cityId ?? '',
      city: preset?.city ?? '',
      villageId: preset?.villageId ?? '',
      village: preset?.village ?? '',
      locationId: preset?.locationId ?? '',
      recommendedMatchEnabled: true,
      recommendedForPetId: refPet?.id ?? petId,
      sortBy: 'recommended',
    };
    this.recalculateAllCompatibilities();
    this.notify();
  }

  public getMatingFilters(): FilterState {
    return this.matingFilters;
  }

  public setMatingFilters(filters: Partial<FilterState>): void {
    this.matingFilters = { ...this.matingFilters, ...filters };
    if (filters.recommendedMatchEnabled !== undefined) {
      this.recalculateAllCompatibilities();
    }
    this.notify();
  }

  public applyMatingFiltersWithLoading(filters: Partial<FilterState>, label?: string): void {
    const msg =
      label ||
      (filters.recommendedMatchEnabled
        ? 'جاري تحليل التوافق وترتيب أنسب الأليفات...'
        : 'جاري تطبيق الفلترة والبحث...');
    this.runWithFilteringLoading(msg, () => {
      this.matingFilters = { ...this.matingFilters, ...filters };
      if (filters.recommendedMatchEnabled !== undefined) {
        this.recalculateAllCompatibilities();
      }
    });
  }

  public getAdoptionFilters(): FilterState {
    return this.adoptionFilters;
  }

  public setAdoptionFilters(filters: Partial<FilterState>): void {
    this.adoptionFilters = { ...this.adoptionFilters, ...filters };
    this.notify();
  }

  public applyAdoptionFiltersWithLoading(filters: Partial<FilterState>, label?: string): void {
    const msg = label || 'جاري البحث وتصفية حالات التبني...';
    this.runWithFilteringLoading(msg, () => {
      this.adoptionFilters = { ...this.adoptionFilters, ...filters };
    });
  }

  public getSelectedPetForDetail(): Pet | null {
    return this.selectedPetForDetail;
  }

  public getSelectedGroupMemberFocusId(): string | null {
    return this.selectedGroupMemberFocusId;
  }

  public setSelectedGroupMemberFocusId(memberPetId: string | null): void {
    this.selectedGroupMemberFocusId = memberPetId;
  }

  public setSelectedPetForDetail(pet: Pet | null, focusMemberId: string | null = null): void {
    this.selectedPetForDetail = pet;
    this.selectedGroupMemberFocusId = pet ? focusMemberId : null;
    this.notify();
  }

  public getSelectedPetForRequest(): Pet | null {
    return this.selectedPetForRequest;
  }

  public setSelectedPetForRequest(pet: Pet | null): void {
    this.selectedPetForRequest = pet;
    this.notify();
  }

  public getContactRequests(): ContactRequest[] {
    return this.contactRequests.filter(
      (r) =>
        !this.isUserBlocked(r.senderId) &&
        !(r.receiverOwnerId && this.isUserBlocked(r.receiverOwnerId)) &&
        !(r.receiverPet?.ownerId && this.isUserBlocked(r.receiverPet.ownerId))
    );
  }

  public getIncomingContactRequests(): ContactRequest[] {
    return this.getContactRequests().filter((r) => r.senderId !== this.user.id);
  }

  public getOutgoingContactRequests(): ContactRequest[] {
    return this.getContactRequests().filter((r) => r.senderId === this.user.id);
  }

  public getPendingRequestsCount(): number {
    return this.getContactRequests().filter(
      (r) => r.senderId !== this.user.id && !r.isWithdrawn && r.status === 'pending'
    ).length;
  }

  public getConversations(): Conversation[] {
    return this.conversations
      .filter((c) => !this.isUserBlocked(c.otherUserId))
      .slice()
      .sort((a, b) => {
        const aPinned = Boolean(a.isPinned);
        const bPinned = Boolean(b.isPinned);
        if (aPinned !== bPinned) {
          return aPinned ? -1 : 1;
        }
        if (aPinned && bPinned) {
          const pinDiff = (b.pinnedAt ?? 0) - (a.pinnedAt ?? 0);
          if (pinDiff !== 0) return pinDiff;
        }
        return (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
      });
  }

  public getActiveConversation(): Conversation | null {
    if (!this.activeConversationId) return null;
    const conv = this.conversations.find((c) => c.id === this.activeConversationId) || null;
    if (conv && this.isUserBlocked(conv.otherUserId)) return null;
    return conv;
  }

  public getCelebrationKeyForConversation(conv: Conversation): string {
    return conv.requestId || conv.id;
  }

  public isMatingConversationApproved(conv: Conversation): boolean {
    if (conv.petType !== 'mating') return false;
    if (conv.requestId) {
      const req = this.contactRequests.find((r) => r.id === conv.requestId);
      if (req) return req.status === 'accepted';
    }
    return true;
  }

  public hasCelebratedApproval(key: string): boolean {
    return this.celebratedApprovals.has(key);
  }

  public getActiveConfettiBurstKey(): string | null {
    return this.activeConfettiBurstKey;
  }

  public consumeActiveConfettiBurstKey(): void {
    this.activeConfettiBurstKey = null;
  }

  private persistCelebratedApprovals(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(
          'meow_celebrated_approvals_v1',
          JSON.stringify(Array.from(this.celebratedApprovals))
        );
      } catch {
        // Ignore storage write error
      }
    }
  }

  public triggerMatingCelebrationIfNeeded(conv: Conversation): boolean {
    if (!this.isMatingConversationApproved(conv)) return false;
    const key = this.getCelebrationKeyForConversation(conv);
    if (this.celebratedApprovals.has(key)) {
      return false;
    }
    this.celebratedApprovals.add(key);
    this.activeConfettiBurstKey = key;
    this.persistCelebratedApprovals();
    if (conv.requestId) {
      if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
        void markContactRequestCelebratedInSupabase(conv.requestId, this.user.id);
      } else {
        void markMatingCelebratedInFirestore(conv.requestId).catch((err) =>
          console.warn('Firestore mating celebration sync skipped:', err)
        );
      }
    }
    return true;
  }

  public getRequestsPrivacySummary(requests: ContactRequest[]): {
    hasHiddenPhoneRequests: boolean;
    hasPublicPhoneRequests: boolean;
  } {
    if (requests.length === 0) {
      return {
        hasHiddenPhoneRequests: !this.user.showPhoneInProfile,
        hasPublicPhoneRequests: Boolean(this.user.showPhoneInProfile),
      };
    }

    const allPets = this.getAllPets();
    let hasHidden = false;
    let hasPublic = false;

    for (const req of requests) {
      const senderPet =
        req.senderPet || (req.senderPetId ? allPets.find((p) => p.id === req.senderPetId) : undefined);
      const receiverPet =
        req.receiverPet || (req.receiverPetId ? allPets.find((p) => p.id === req.receiverPetId) : undefined);
      const isOutgoing = req.senderId === this.user.id;

      const userPublic = Boolean(this.user.showPhoneInProfile);
      const otherPublic = isOutgoing
        ? Boolean(receiverPet?.ownerShowPhone === true && receiverPet?.ownerPrivacy === 'public')
        : Boolean(
            req.senderShowPhone === true ||
              (senderPet?.ownerShowPhone === true && senderPet?.ownerPrivacy === 'public')
          );

      if (otherPublic || userPublic) {
        hasPublic = true;
      }
      if (!otherPublic || !userPublic) {
        hasHidden = true;
      }
    }

    return {
      hasHiddenPhoneRequests: hasHidden,
      hasPublicPhoneRequests: hasPublic,
    };
  }

  public setActiveConversationId(id: string | null): void {
    this.activeConversationId = id;
    if (id) {
      const conv = this.conversations.find((c) => c.id === id);
      if (conv) {
        conv.unreadCount = 0;
        this.markNotificationsReadWhere(
          (n) =>
            n.targetConversationId === conv.id ||
            Boolean(conv.requestId && n.targetRequestId === conv.requestId),
          true
        );
        this.triggerMatingCelebrationIfNeeded(conv);
        if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
          void markConversationReadInSupabase(conv.id);
        }
      }
    }
    this.notify();
  }

  public pinConversation(id: string): void {
    const conv = this.conversations.find((c) => c.id === id);
    if (!conv) return;
    conv.isPinned = true;
    conv.pinnedAt = Date.now();
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void setConversationPinnedInSupabase(id, this.user.id, true);
    }
    this.notify();
  }

  public unpinConversation(id: string): void {
    const conv = this.conversations.find((c) => c.id === id);
    if (!conv) return;
    conv.isPinned = false;
    conv.pinnedAt = undefined;
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void setConversationPinnedInSupabase(id, this.user.id, false);
    }
    this.notify();
  }

  public togglePinConversation(id: string): void {
    const conv = this.conversations.find((c) => c.id === id);
    if (!conv) return;
    if (conv.isPinned) {
      this.unpinConversation(id);
    } else {
      this.pinConversation(id);
    }
  }

  public getPendingDeleteConversation(): Conversation | null {
    if (!this.pendingDeleteConversationId) return null;
    return this.conversations.find((c) => c.id === this.pendingDeleteConversationId) || null;
  }

  public setPendingDeleteConversationId(id: string | null): void {
    this.pendingDeleteConversationId = id;
    this.notify();
  }

  public confirmDeleteConversation(): void {
    if (!this.pendingDeleteConversationId) return;
    const id = this.pendingDeleteConversationId;
    this.pendingDeleteConversationId = null;
    this.deleteConversation(id);
  }

  public deleteConversation(id: string): void {
    this.conversations = this.conversations.filter((c) => c.id !== id);
    if (this.activeConversationId === id) {
      this.activeConversationId = null;
    }
    if (this.pendingDeleteConversationId === id) {
      this.pendingDeleteConversationId = null;
    }
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void hideConversationInSupabase(id);
    }
    this.notify();
  }

  public getPetForRequestPreview(req: ContactRequest): Pet | null {
    const allPets = this.getAllPets();
    const senderPet =
      req.senderPet || (req.senderPetId ? allPets.find((p) => p.id === req.senderPetId) : undefined);
    const receiverPet =
      req.receiverPet || (req.receiverPetId ? allPets.find((p) => p.id === req.receiverPetId) : undefined);

    if (req.senderId !== this.user.id) {
      return senderPet || receiverPet || null;
    }
    return receiverPet || senderPet || null;
  }

  public getPetForConversation(conv: Conversation): Pet | null {
    const found = this.getAllPets().find((p) => p.id === conv.petId);
    if (found) return found;

    const orderedEntries: GroupPhotoItem[] = [];
    if (conv.photoEntries && conv.photoEntries.length > 0) {
      orderedEntries.push(
        ...conv.photoEntries.filter((e) => e.kind === 'individual'),
        ...conv.photoEntries.filter((e) => e.kind === 'collective')
      );
    } else if (conv.groupMembers && conv.groupMembers.length > 0) {
      conv.groupMembers.forEach((m) => {
        if (m.individualPhotos[0]) {
          orderedEntries.push({
            url: m.individualPhotos[0],
            kind: 'individual',
            petId: m.petId,
            petName: m.name,
            label: `صورة منفصلة: ${m.name}`,
          });
        }
      });
      conv.groupMembers.forEach((m) => {
        m.individualPhotos.slice(1).forEach((url) => {
          orderedEntries.push({
            url,
            kind: 'individual',
            petId: m.petId,
            petName: m.name,
            label: `صورة منفصلة: ${m.name}`,
          });
        });
      });
      (conv.sharedGroupPhotos || []).forEach((url) => {
        orderedEntries.push({
          url,
          kind: 'collective',
          label: 'صورة جماعية للمجموعة',
        });
      });
    }

    const photoUrls =
      orderedEntries.length > 0
        ? orderedEntries.map((e) => e.url)
        : conv.sharedGroupPhotos && conv.sharedGroupPhotos.length > 0
        ? [conv.petPhoto, ...conv.sharedGroupPhotos]
        : [conv.petPhoto];

    return {
      id: conv.petId,
      name: conv.petName,
      species: conv.groupMembers?.[0]?.species || 'cat',
      breed: conv.groupMembers?.[0]?.breed || 'قط منزلي',
      ageYears: conv.groupMembers?.[0]?.ageYears ?? 1,
      ageMonths: conv.groupMembers?.[0]?.ageMonths ?? 0,
      color: conv.groupMembers?.map((m) => m.color).filter(Boolean).join(' / ') || '',
      gender: conv.groupMembers?.[0]?.gender || 'female',
      photos: photoUrls,
      area: conv.petLocation || 'القاهرة',
      city: conv.petLocation || 'القاهرة',
      distanceKm: 0,
      healthStatus: 'ممتازة',
      vaccinationStatus: conv.groupMembers?.[0]?.vaccinationStatus || 'fully_vaccinated',
      personality: [],
      healthNotes: '',
      status: conv.petType,
      adoptionType: conv.adoptionType,
      groupCount: conv.groupCount,
      mustAdoptTogether: conv.mustAdoptTogether,
      adoptionReason: conv.adoptionReason,
      groupMembers: conv.groupMembers,
      sharedGroupPhotos: conv.sharedGroupPhotos,
      photoEntries: orderedEntries.length > 0 ? orderedEntries : conv.photoEntries,
      ownerId: conv.otherUserId,
      ownerName: conv.otherUserName,
      ownerAvatar: conv.otherUserAvatar,
      ownerPhone: conv.otherUserPhone,
      ownerPrivacy: conv.ownerPrivacy,
      ownerShowPhone: Boolean(conv.otherUserShowPhone),
      createdAt: new Date().toISOString().split('T')[0],
    };
  }

  public getHealthRecords(petId?: string): HealthRecordItem[] {
    if (!petId) return this.healthRecords;
    return this.healthRecords.filter((r) => r.petId === petId);
  }

  public isAddPetModalVisible(): boolean {
    return this.isAddPetModalOpen;
  }

  public setAddPetModalVisible(open: boolean, petToEdit: Pet | null = null): void {
    this.isAddPetModalOpen = open;
    this.editingPet = petToEdit;
    this.notify();
  }

  public getEditingPet(): Pet | null {
    return this.editingPet;
  }

  private getColorFamilies(colorText: string): string[] {
    const norm = normalizeArabic(colorText || '');
    if (!norm) return [];
    const families: { key: string; keywords: string[] }[] = [
      { key: 'white', keywords: ['ابيض', 'ناصع', 'كريمي', 'بيج', 'سيلفر', 'اوف', 'white', 'cream'] },
      { key: 'grey', keywords: ['رمادي', 'رصاصي', 'دخاني', 'فضي', 'بلو', 'ازرق', 'grey', 'gray', 'blue', 'silver'] },
      { key: 'orange', keywords: ['مشمشي', 'برتقالي', 'ذهبي', 'اصفر', 'احمر', 'كاليكو', 'توربي', 'orange', 'golden', 'ginger'] },
      { key: 'brown', keywords: ['بني', 'شيكولاته', 'كاكاو', 'قهوه', 'سيل', 'عسلي', 'تايغر', 'brown', 'chocolate', 'seal'] },
      { key: 'black', keywords: ['اسود', 'غامق', 'فحمي', 'توكسيدو', 'black'] },
      { key: 'pattern', keywords: ['مخطط', 'تابي', 'ملون', 'ثلاثي', 'بوينت', 'point', 'tabby'] },
    ];
    const matched = families.filter((fam) => fam.keywords.some((kw) => norm.includes(kw))).map((f) => f.key);
    return matched;
  }

  private computeColorAffinity(colorA: string, colorB: string): { points: number; reason?: string } {
    const aNorm = normalizeArabic(colorA || '');
    const bNorm = normalizeArabic(colorB || '');
    if (!aNorm || !bNorm) return { points: 2 };

    const wordsA = aNorm.split(/[\s،,()]+/).filter((w) => w.length >= 2);
    const wordsB = bNorm.split(/[\s،,()]+/).filter((w) => w.length >= 2);
    if (wordsA.some((w) => wordsB.includes(w))) {
      return { points: 12, reason: 'لون متطابق ومتقارب' };
    }

    const famA = this.getColorFamilies(aNorm);
    const famB = this.getColorFamilies(bNorm);
    if (famA.some((f) => famB.includes(f))) {
      return { points: 10, reason: 'ألوان متقاربة ومناسبة وراثياً' };
    }

    const harmoniousPairs = new Set(['white:grey', 'grey:white', 'white:brown', 'brown:white', 'white:orange', 'orange:white']);
    for (const f1 of famA) {
      for (const f2 of famB) {
        if (harmoniousPairs.has(`${f1}:${f2}`)) {
          return { points: 6, reason: 'تناسق لوني جيد' };
        }
      }
    }

    return { points: 2 };
  }

  public getEffectiveDistanceKm(targetPet: Pet, refPet?: Pet): number | null {
    const targetCoords = resolveLocationCoordinates(targetPet);
    const refCoords = resolveLocationCoordinates(refPet || this.user);
    if (targetCoords && refCoords) {
      return calculateDistanceKm(refCoords, targetCoords);
    }
    return null;
  }

  private computeLocationAffinity(targetPet: Pet, userPet: Pet): { points: number; reason?: string } {
    const linA = resolveLocationLineage(userPet);
    const linB = resolveLocationLineage(targetPet);
    const distKm = this.getEffectiveDistanceKm(targetPet, userPet);

    if (linA.village && linB.village && linA.village.id === linB.village.id) {
      return {
        points: 35,
        reason: `نفس النطاق السكني (${linB.village.name})`,
      };
    }

    if (linA.city && linB.city && linA.city.id === linB.city.id) {
      return {
        points: 32,
        reason: `نفس المدينة / الحي (${linB.city.name})`,
      };
    }

    if (linA.markaz && linB.markaz && linA.markaz.id === linB.markaz.id) {
      return {
        points: 29,
        reason: `نفس المركز / القسم (${linB.markaz.name})`,
      };
    }

    if (linA.governorate && linB.governorate && linA.governorate.id === linB.governorate.id) {
      const pts =
        distKm === null ? 22 : distKm <= 8 ? 28 : distKm <= 20 ? 25 : distKm <= 45 ? 22 : 19;
      return {
        points: pts,
        reason:
          distKm !== null
            ? `نفس المحافظة (${linB.governorate.name} • ${distKm} كم)`
            : `نفس المحافظة (${linB.governorate.name})`,
      };
    }

    if (distKm !== null) {
      if (distKm <= 6) {
        return { points: 30, reason: `قريب جداً (${distKm} كم)` };
      }
      if (distKm <= 15) {
        return { points: 25, reason: `مسافة قريبة (${distKm} كم)` };
      }
      if (distKm <= 30) {
        return { points: 19, reason: `مسافة مناسبة (${distKm} كم)` };
      }
      if (distKm <= 80) {
        return { points: 11, reason: `يبعد حوالي ${distKm} كم` };
      }
      if (distKm <= 160) {
        return { points: 6 };
      }
    }
    return { points: 2 };
  }

  private computeBreedAffinity(targetPet: Pet, userPet: Pet): { points: number; reason?: string } {
    if (targetPet.species !== userPet.species) {
      return { points: -45 };
    }

    const b1 = normalizeArabic(userPet.breed || '');
    const b2 = normalizeArabic(targetPet.breed || '');
    const h1 = normalizeArabic(userPet.hybridBreed || '');
    const h2 = normalizeArabic(targetPet.hybridBreed || '');

    const coreGroups = [
      ['شيرازي', 'فارسي', 'مون فيس', 'بيكي'],
      ['بريطاني', 'british', 'سكوتش'],
      ['هيمالايا', 'شيرازي', 'بلو بوينت'],
      ['سيامي', 'تونكينيز', 'شرقي'],
      ['راغدول', 'بيرمان'],
      ['بلدي', 'ماو'],
      ['غولدن', 'لابرادور'],
      ['جيرمن', 'مالينوا'],
      ['هاسكي', 'سامويد'],
    ];

    if (b1 && b2 && (b1 === b2 || b1.includes(b2) || b2.includes(b1))) {
      return { points: 22, reason: `تطابق السلالة (${targetPet.breed})` };
    }

    for (const group of coreGroups) {
      const m1 = group.some((token) => b1.includes(token) || (h1 && h1.includes(token)));
      const m2 = group.some((token) => b2.includes(token) || (h2 && h2.includes(token)));
      if (m1 && m2) {
        return { points: 17, reason: `توافق عالٍ بين السلالات (${targetPet.breed})` };
      }
    }

    if ((h1 && b2.includes(h1)) || (h2 && b1.includes(h2))) {
      return { points: 15, reason: 'توافق عبر السلالة الهجينة' };
    }

    return { points: 9, reason: `نفس النوع (${targetPet.species === 'cat' ? 'قطط' : 'كلاب'})` };
  }

  // Real 6-Factor Smart Compatibility Algorithm (Gender, Location, Color, Species/Breed, Age, Health)
  public calculateCompatibility(targetPet: Pet, userPet?: Pet): { score: number; reasons: string[] } {
    if (!userPet) {
      return { score: 70, reasons: ['تقييم عام بناءً على الحالة الصحية والموقع الجغرافي'] };
    }

    let score = 0;
    const reasons: string[] = [];

    // 1. Gender (Fundamental)
    if (targetPet.status === 'mating') {
      if (targetPet.gender !== userPet.gender) {
        score += 4;
        reasons.push(`جنس مناسب (${targetPet.gender === 'female' ? 'أنثى' : 'ذكر'} مقابل ${userPet.gender === 'male' ? 'ذكر' : 'أنثى'})`);
      } else {
        score -= 40;
      }
    } else {
      score += 4;
    }

    // 2. Geographic Proximity (0 - 35)
    const loc = this.computeLocationAffinity(targetPet, userPet);
    score += loc.points;
    if (loc.reason) reasons.push(loc.reason);

    // 3. Species & Breed (8 - 22, or -45 cross-species)
    const breedMatch = this.computeBreedAffinity(targetPet, userPet);
    score += breedMatch.points;
    if (breedMatch.reason) reasons.push(breedMatch.reason);

    // 4. Color Proximity (2 - 12)
    const colorMatch = this.computeColorAffinity(userPet.color, targetPet.color);
    score += colorMatch.points;
    if (colorMatch.reason) reasons.push(colorMatch.reason);

    // 5. Age Compatibility (0 - 12, maturity penalty if too young)
    const months1 = (userPet.ageYears || 0) * 12 + (userPet.ageMonths || 0);
    const months2 = (targetPet.ageYears || 0) * 12 + (targetPet.ageMonths || 0);
    const diffMonths = Math.abs(months1 - months2);
    if (months2 > 0 && months2 < 8) {
      score -= 10;
    } else if (diffMonths <= 8) {
      score += 12;
      reasons.push('تقارب ممتاز في العمر');
    } else if (diffMonths <= 18) {
      score += 9;
      reasons.push('عمر مناسب ومتقارب');
    } else if (diffMonths <= 30) {
      score += 5;
    } else {
      score += 1;
    }

    // 6. Health & Vaccination Status (0 - 15)
    if (targetPet.vaccinationStatus === 'fully_vaccinated' && userPet.vaccinationStatus === 'fully_vaccinated') {
      score += 10;
      reasons.push('كلاهما مُطعّم بالكامل وبحالة صحية متوافقة');
    } else if (targetPet.vaccinationStatus === 'fully_vaccinated') {
      score += 7;
      reasons.push('مُطعّم بالكامل');
    } else if (targetPet.vaccinationStatus === 'partially_vaccinated') {
      score += 4;
    }

    if (targetPet.healthStatus === 'ممتازة') {
      score += 5;
    } else if (targetPet.healthStatus === 'جيدة جدًا') {
      score += 3;
    }

    score = Math.max(10, Math.min(99, score));
    return { score, reasons };
  }

  private recalculateAllCompatibilities(): void {
    const primaryPet = this.getRecommendedReferencePet() || this.getPrimaryUserMatingPet() || this.userPets[0];

    this.matingPets.forEach((pet) => {
      const { score, reasons } = this.calculateCompatibility(pet, primaryPet);
      pet.compatibilityScore = score;
      pet.compatibilityReasons = reasons;
    });

    this.adoptionPets.forEach((pet) => {
      const { score, reasons } = this.calculateCompatibility(pet, primaryPet);
      pet.compatibilityScore = score;
      pet.compatibilityReasons = reasons;
    });
  }

  private hasAnyActiveCriteria(f: FilterState): boolean {
    return Boolean(
      (f.species && f.species !== 'all') ||
        (f.gender && f.gender !== 'all') ||
        (f.breed && f.breed.trim() !== '') ||
        (f.hybridBreed && f.hybridBreed.trim() !== '' && f.hybridBreed !== 'all') ||
        (f.color && f.color.trim() !== '') ||
        (f.ageYears !== undefined && !Number.isNaN(f.ageYears)) ||
        (f.ageMonths !== undefined && !Number.isNaN(f.ageMonths)) ||
        (f.vaccinationStatus && f.vaccinationStatus !== 'all') ||
        (f.governorateId && f.governorateId.trim() !== '') ||
        (f.governorate && f.governorate.trim() !== '') ||
        (f.markazId && f.markazId.trim() !== '') ||
        (f.markaz && f.markaz.trim() !== '') ||
        (f.cityId && f.cityId.trim() !== '') ||
        (f.city && f.city.trim() !== '') ||
        (f.villageId && f.villageId.trim() !== '') ||
        (f.village && f.village.trim() !== '')
    );
  }

  private areBreedsRelated(breedA: string, breedB: string): boolean {
    const b1 = normalizeArabic(breedA || '');
    const b2 = normalizeArabic(breedB || '');
    if (!b1 || !b2) return false;
    const coreGroups = [
      ['شيرازي', 'فارسي', 'مون فيس', 'بيكي', 'هيمالايا'],
      ['بريطاني', 'british', 'سكوتش'],
      ['سيامي', 'تونكينيز', 'شرقي'],
      ['راغدول', 'بيرمان'],
      ['بلدي', 'ماو'],
      ['غولدن', 'لابرادور'],
      ['جيرمن', 'مالينوا'],
      ['هاسكي', 'سامويد'],
    ];
    return coreGroups.some(
      (group) => group.some((tok) => b1.includes(tok)) && group.some((tok) => b2.includes(tok))
    );
  }

  private evaluatePetAgainstFilters(
    pet: Pet,
    f: FilterState,
    mode: 'mating' | 'adoption'
  ): {
    score: number;
    matchedCount: number;
    activeCount: number;
    isExactMatch: boolean;
    realDistanceKm: number | null;
  } {
    let score = 0;
    let matchedCount = 0;
    let activeCount = 0;
    let exactMatch = true;

    const members =
      pet.adoptionType === 'group' && pet.groupMembers && pet.groupMembers.length > 0
        ? pet.groupMembers
        : null;

    // 1. Species
    if (f.species && f.species !== 'all') {
      activeCount++;
      const matchesSpecies =
        pet.species === f.species ||
        Boolean(members && members.some((m) => m.species === f.species));
      if (matchesSpecies) {
        score += 40;
        matchedCount++;
      } else {
        score -= mode === 'adoption' ? 35 : 50;
        exactMatch = false;
      }
    }

    // 2. Gender
    if (f.gender && f.gender !== 'all') {
      activeCount++;
      const matchesGender =
        pet.gender === f.gender ||
        Boolean(members && members.some((m) => m.gender === f.gender));
      if (matchesGender) {
        score += 24;
        matchedCount++;
      } else {
        exactMatch = false;
      }
    }

    // 3. Breed & Text Search (includes group members & real location names)
    if (f.breed && f.breed.trim() !== '') {
      activeCount++;
      const rawBreed = f.breed.trim();
      const qFull = normalizeArabic(rawBreed);
      const qStripped = normalizeArabic(rawBreed.replace(/\([^)]*\)/g, ''));

      const breedCandidates = [
        pet.breed || '',
        pet.hybridBreed || '',
        ...(members ? members.map((m) => `${m.breed || ''} ${m.hybridBreed || ''}`) : []),
      ];
      const petLineageForText = resolveLocationLineage(pet);
      const extraTextCandidates = [
        pet.name || '',
        pet.color || '',
        petLineageForText.governorate?.name || pet.governorate || '',
        petLineageForText.markaz?.name || pet.markaz || '',
        petLineageForText.city?.name || pet.city || '',
        petLineageForText.village?.name || pet.village || '',
        pet.area || '',
        ...(members ? members.map((m) => `${m.name || ''} ${m.color || ''}`) : []),
      ];

      const exactOrSubBreed = breedCandidates.some((cand) => {
        const bNorm = normalizeArabic(cand);
        return (
          bNorm &&
          (bNorm.includes(qFull) ||
            (qStripped.length >= 2 && bNorm.includes(qStripped)) ||
            (bNorm.length >= 2 && qFull.includes(bNorm)))
        );
      });

      const exactTextFallback = extraTextCandidates.some((cand) => {
        const cNorm = normalizeArabic(cand);
        return cNorm && (cNorm.includes(qFull) || (qStripped.length >= 2 && cNorm.includes(qStripped)));
      });

      const relatedBreed =
        !exactOrSubBreed &&
        breedCandidates.some((cand) => this.areBreedsRelated(rawBreed, cand));

      if (exactOrSubBreed) {
        score += 32;
        matchedCount++;
      } else if (exactTextFallback) {
        score += 26;
        matchedCount++;
      } else if (relatedBreed) {
        score += 18;
        exactMatch = false;
      } else {
        exactMatch = false;
      }
    }

    // 4. Hybrid Breed
    if (f.hybridBreed && f.hybridBreed.trim() !== '' && f.hybridBreed !== 'all') {
      activeCount++;
      if (f.hybridBreed === 'none') {
        const isNonHybrid =
          (!pet.hybridBreed || pet.hybridBreed.trim() === '' || pet.hybridBreed === 'بدون هجين') &&
          !pet.breed.includes('هجين');
        if (isNonHybrid) {
          score += 12;
          matchedCount++;
        } else {
          exactMatch = false;
        }
      } else {
        const qHyb = normalizeArabic(f.hybridBreed.replace(/\([^)]*\)/g, ''));
        const hybridTexts = [
          pet.hybridBreed || '',
          pet.breed || '',
          ...(members ? members.map((m) => `${m.hybridBreed || ''} ${m.breed || ''}`) : []),
        ];
        if (hybridTexts.some((t) => normalizeArabic(t).includes(qHyb))) {
          score += 16;
          matchedCount++;
        } else if (hybridTexts.some((t) => this.areBreedsRelated(f.hybridBreed!, t))) {
          score += 8;
          exactMatch = false;
        } else {
          exactMatch = false;
        }
      }
    }

    // 5. Color
    if (f.color && f.color.trim() !== '') {
      activeCount++;
      const colorCandidates = [
        pet.color || '',
        ...(members ? members.map((m) => m.color || '') : []),
      ].filter(Boolean);

      let bestColorPoints = 0;
      for (const c of colorCandidates) {
        const res = this.computeColorAffinity(f.color, c);
        if (res.points > bestColorPoints) bestColorPoints = res.points;
      }

      if (bestColorPoints >= 12) {
        score += 20;
        matchedCount++;
      } else if (bestColorPoints >= 10) {
        score += 14;
        exactMatch = false;
      } else if (bestColorPoints >= 6) {
        score += 7;
        exactMatch = false;
      } else {
        exactMatch = false;
      }
    }

    // 6. Age
    const hasYearsFilter = f.ageYears !== undefined && !Number.isNaN(f.ageYears);
    const hasMonthsFilter = f.ageMonths !== undefined && !Number.isNaN(f.ageMonths);
    if (hasYearsFilter || hasMonthsFilter) {
      activeCount++;
      const targetMonths = (hasYearsFilter ? f.ageYears! : 0) * 12 + (hasMonthsFilter ? f.ageMonths! : 0);
      const agePool = members
        ? members.map((m) => (m.ageYears || 0) * 12 + (m.ageMonths || 0))
        : [(pet.ageYears || 0) * 12 + (pet.ageMonths || 0)];
      const minDiff = Math.min(...agePool.map((m) => Math.abs(m - targetMonths)));

      if (minDiff === 0) {
        score += 18;
        matchedCount++;
      } else if (minDiff <= 6) {
        score += 14;
        exactMatch = false;
      } else if (minDiff <= 12) {
        score += 10;
        exactMatch = false;
      } else if (minDiff <= 24) {
        score += 5;
        exactMatch = false;
      } else {
        exactMatch = false;
      }
    }

    // 7. Vaccination Status
    if (f.vaccinationStatus && f.vaccinationStatus !== 'all') {
      activeCount++;
      const vaxPool = members ? members.map((m) => m.vaccinationStatus) : [pet.vaccinationStatus];
      if (vaxPool.some((v) => v === f.vaccinationStatus)) {
        score += 16;
        matchedCount++;
      } else if (
        f.vaccinationStatus === 'fully_vaccinated' &&
        vaxPool.some((v) => v === 'partially_vaccinated')
      ) {
        score += 8;
        exactMatch = false;
      } else {
        exactMatch = false;
      }
    }

    // 8. Real Geographic Location Hierarchy & Genuine Coordinates Distance
    const hasLocFilter = Boolean(
      (f.governorateId && f.governorateId.trim() !== '') ||
        (f.governorate && f.governorate.trim() !== '') ||
        (f.markazId && f.markazId.trim() !== '') ||
        (f.markaz && f.markaz.trim() !== '') ||
        (f.cityId && f.cityId.trim() !== '') ||
        (f.city && f.city.trim() !== '') ||
        (f.villageId && f.villageId.trim() !== '') ||
        (f.village && f.village.trim() !== '')
    );

    const petLineage = resolveLocationLineage(pet);
    const petCoords = resolveLocationCoordinates(pet);
    const filterLocInput = {
      governorateId: f.governorateId,
      markazId: f.markazId,
      cityId: f.cityId,
      villageId: f.villageId,
      locationId: f.locationId,
      governorate: f.governorate,
      markaz: f.markaz,
      city: f.city,
      village: f.village,
    };
    const filterLineage = hasLocFilter ? resolveLocationLineage(filterLocInput) : null;
    const refCoords = hasLocFilter
      ? resolveLocationCoordinates(filterLocInput)
      : resolveLocationCoordinates(this.user);

    const realDistanceKm =
      petCoords && refCoords ? calculateDistanceKm(refCoords, petCoords) : null;

    if (hasLocFilter) {
      activeCount++;
      const targetGovId = f.governorateId?.trim() || filterLineage?.governorate?.id || '';
      const targetGovName = normalizeArabic(
        (targetGovId ? getGeoNodeById(targetGovId)?.name : undefined) || f.governorate || ''
      );
      const petGovId = petLineage.governorate?.id || pet.governorateId || '';
      const petGovName = normalizeArabic(
        petLineage.governorate?.name ||
          pet.governorate ||
          findGovernorateByCity(pet.city || '') ||
          findGovernorateByCity(pet.area || '') ||
          ''
      );
      const govMatched =
        (Boolean(targetGovId) && petGovId === targetGovId) ||
        (Boolean(targetGovName) && petGovName === targetGovName);

      const hasMarkazFilter = Boolean((f.markazId && f.markazId.trim() !== '') || (f.markaz && f.markaz.trim() !== ''));
      const targetMkzId = f.markazId?.trim() || filterLineage?.markaz?.id || '';
      const targetMkzName = normalizeArabic(
        (targetMkzId ? getGeoNodeById(targetMkzId)?.name : undefined) || f.markaz || ''
      );
      const petMkzId = petLineage.markaz?.id || pet.markazId || '';
      const petMkzName = normalizeArabic(petLineage.markaz?.name || pet.markaz || '');
      const markazMatched =
        hasMarkazFilter &&
        ((Boolean(targetMkzId) && petMkzId === targetMkzId) ||
          (Boolean(targetMkzName) && petMkzName === targetMkzName));

      const hasCityFilter = Boolean((f.cityId && f.cityId.trim() !== '') || (f.city && f.city.trim() !== ''));
      const targetCityId = f.cityId?.trim() || filterLineage?.city?.id || '';
      const targetCityName = normalizeArabic(
        (targetCityId ? getGeoNodeById(targetCityId)?.name : undefined) || f.city || ''
      );
      const petCityId = petLineage.city?.id || pet.cityId || '';
      const petCityName = normalizeArabic(petLineage.city?.name || pet.city || '');
      const petAreaName = normalizeArabic(pet.area || '');
      const cityMatched =
        hasCityFilter &&
        ((Boolean(targetCityId) && petCityId === targetCityId) ||
          (Boolean(targetCityName) &&
            (petCityName.includes(targetCityName) || petAreaName.includes(targetCityName))));

      const hasVillageFilter = Boolean((f.villageId && f.villageId.trim() !== '') || (f.village && f.village.trim() !== ''));
      const targetVilId = f.villageId?.trim() || filterLineage?.village?.id || '';
      const targetVilName = normalizeArabic(
        (targetVilId ? getGeoNodeById(targetVilId)?.name : undefined) || f.village || ''
      );
      const petVilId = petLineage.village?.id || pet.villageId || '';
      const petVilName = normalizeArabic(petLineage.village?.name || pet.village || '');
      const villageMatched =
        hasVillageFilter &&
        ((Boolean(targetVilId) && petVilId === targetVilId) ||
          (Boolean(targetVilName) &&
            (petVilName.includes(targetVilName) || petAreaName.includes(targetVilName))));

      const deepestMatched = hasVillageFilter
        ? villageMatched
        : hasCityFilter
        ? cityMatched
        : hasMarkazFilter
        ? markazMatched
        : govMatched;

      if (villageMatched) {
        score += 48;
      } else if (cityMatched) {
        score += 40;
      } else if (markazMatched) {
        score += 34;
      } else if (govMatched) {
        score += 26;
      }

      if (deepestMatched) {
        matchedCount++;
      } else {
        exactMatch = false;
      }
    }

    // Real geographic distance bonus when genuine coordinates exist on both target & reference
    if (realDistanceKm !== null) {
      if (realDistanceKm <= 5) score += 18;
      else if (realDistanceKm <= 12) score += 14;
      else if (realDistanceKm <= 25) score += 10;
      else if (realDistanceKm <= 50) score += 6;
      else if (realDistanceKm <= 100) score += 3;
    }

    return {
      score,
      matchedCount,
      activeCount,
      isExactMatch: activeCount > 0 ? exactMatch : true,
      realDistanceKm,
    };
  }

  private getOwnedPetIdSet(): Set<string> {
    const ids = new Set<string>(this.userPets.map((p) => p.id));
    if (this.userGroupAdoptionListing) {
      ids.add(this.userGroupAdoptionListing.id);
    }
    return ids;
  }

  public getMatingMatchSummary(): {
    hasFilters: boolean;
    hasExactMatch: boolean;
    exactCount: number;
    totalCount: number;
  } {
    const pets = this.getFilteredMatingPets();
    const f = this.matingFilters;
    const hasFilters = this.hasAnyActiveCriteria(f) || Boolean(f.recommendedMatchEnabled);
    if (!hasFilters) {
      return {
        hasFilters: false,
        hasExactMatch: true,
        exactCount: pets.length,
        totalCount: pets.length,
      };
    }
    const exactCount = pets.filter((p) => this.evaluatePetAgainstFilters(p, f, 'mating').isExactMatch).length;
    return {
      hasFilters: true,
      hasExactMatch: exactCount > 0,
      exactCount,
      totalCount: pets.length,
    };
  }

  public getAdoptionMatchSummary(): {
    hasFilters: boolean;
    hasExactMatch: boolean;
    exactCount: number;
    totalCount: number;
  } {
    const pets = this.getFilteredAdoptionPets();
    const f = this.adoptionFilters;
    const hasFilters = this.hasAnyActiveCriteria(f);
    if (!hasFilters) {
      return {
        hasFilters: false,
        hasExactMatch: true,
        exactCount: pets.length,
        totalCount: pets.length,
      };
    }
    const exactCount = pets.filter((p) => this.evaluatePetAgainstFilters(p, f, 'adoption').isExactMatch).length;
    return {
      hasFilters: true,
      hasExactMatch: exactCount > 0,
      exactCount,
      totalCount: pets.length,
    };
  }

  // Filtered Lists — Ranked from highest compatibility/match to lowest without dropping valid candidates
  public getFilteredMatingPets(): Pet[] {
    const ownedIds = this.getOwnedPetIdSet();
    const currentUserId = this.user.id;
    const f = this.matingFilters;
    const isRecommended = Boolean(f.recommendedMatchEnabled);
    const refPet = isRecommended ? this.getRecommendedReferencePet() : undefined;

    // Hard exclusions ONLY for invalid / impossible mating candidates:
    // - Not listed for mating
    // - Own pet / blocked user
    // - Cross-species mismatch (biological impossibility when species or reference pet is fixed)
    // - Same-gender mismatch (biological impossibility when target gender or reference pet is fixed)
    const eligible = this.matingPets.filter((pet) => {
      if (pet.status !== 'mating') return false;
      if (pet.ownerId === currentUserId || ownedIds.has(pet.id)) return false;
      if (this.isUserBlocked(pet.ownerId)) return false;

      if (f.species && f.species !== 'all' && pet.species !== f.species) return false;
      if (f.gender && f.gender !== 'all' && pet.gender !== f.gender) return false;

      if (isRecommended && refPet) {
        if (pet.id === refPet.id) return false;
        if (pet.species !== refPet.species) return false;
        if (pet.gender === refPet.gender) return false;
      }

      return true;
    });

    const hasFilters = this.hasAnyActiveCriteria(f);

    const ranked = eligible.map((pet) => {
      const filterEval = this.evaluatePetAgainstFilters(pet, f, 'mating');
      let compatScore = pet.compatibilityScore ?? 70;
      if (isRecommended && refPet) {
        const compat = this.calculateCompatibility(pet, refPet);
        compatScore = compat.score;
        pet.compatibilityScore = compat.score;
        pet.compatibilityReasons = compat.reasons;
      }
      const refDistKm =
        isRecommended && refPet
          ? this.getEffectiveDistanceKm(pet, refPet)
          : filterEval.realDistanceKm;

      return {
        pet,
        filterEval,
        compatScore,
        refDistKm,
      };
    });

    if (isRecommended && refPet) {
      ranked.sort((a, b) => {
        const combinedA = a.filterEval.score * 1.2 + a.compatScore;
        const combinedB = b.filterEval.score * 1.2 + b.compatScore;
        if (Math.abs(combinedB - combinedA) > 0.01) return combinedB - combinedA;

        const distA = a.refDistKm ?? Number.POSITIVE_INFINITY;
        const distB = b.refDistKm ?? Number.POSITIVE_INFINITY;
        if (distA !== distB) return distA - distB;

        return new Date(b.pet.createdAt).getTime() - new Date(a.pet.createdAt).getTime();
      });
    } else if (hasFilters) {
      ranked.sort((a, b) => {
        if (b.filterEval.matchedCount !== a.filterEval.matchedCount) {
          return b.filterEval.matchedCount - a.filterEval.matchedCount;
        }
        if (b.filterEval.score !== a.filterEval.score) {
          return b.filterEval.score - a.filterEval.score;
        }
        const distA = a.filterEval.realDistanceKm ?? Number.POSITIVE_INFINITY;
        const distB = b.filterEval.realDistanceKm ?? Number.POSITIVE_INFINITY;
        if (distA !== distB) return distA - distB;
        return new Date(b.pet.createdAt).getTime() - new Date(a.pet.createdAt).getTime();
      });
    } else if (f.sortBy === 'distance') {
      ranked.sort((a, b) => {
        const distA = a.filterEval.realDistanceKm ?? Number.POSITIVE_INFINITY;
        const distB = b.filterEval.realDistanceKm ?? Number.POSITIVE_INFINITY;
        if (distA !== distB) return distA - distB;
        return new Date(b.pet.createdAt).getTime() - new Date(a.pet.createdAt).getTime();
      });
    } else {
      ranked.sort(
        (a, b) => new Date(b.pet.createdAt).getTime() - new Date(a.pet.createdAt).getTime()
      );
    }

    return ranked.map((r) => r.pet);
  }

  public getFilteredAdoptionPets(): Pet[] {
    const ownedIds = this.getOwnedPetIdSet();
    const currentUserId = this.user.id;
    const dedupedMap = new Map<string, Pet>();

    // 1. Public adoption listings from other users
    this.adoptionPets.forEach((pet) => {
      if (pet.status !== 'adoption') return;
      if (pet.ownerId === currentUserId || ownedIds.has(pet.id)) return;
      if (this.isUserBlocked(pet.ownerId)) return;
      dedupedMap.set(pet.id, pet);
    });

    // 2. Current user's active group adoption listing (once, never duplicated)
    if (this.userGroupAdoptionListing && this.userGroupAdoptionListing.status === 'adoption') {
      dedupedMap.set(this.userGroupAdoptionListing.id, {
        ...this.userGroupAdoptionListing,
        adoptionType: 'group',
      });
    }

    // 3. Current user's independent individual adoption listings (including pets in "الاثنان معاً" mode)
    const activeGroupIdSet = new Set(this.userGroupAdoptionListing?.groupPetIds || []);
    this.userPets.forEach((pet) => {
      if (pet.status !== 'adoption') return;
      const isMemberOfActiveGroup =
        pet.adoptionType === 'group' && activeGroupIdSet.has(pet.id);
      const shouldShowIndividual = !isMemberOfActiveGroup || Boolean(pet.alsoListedIndividually);
      if (!shouldShowIndividual) return;

      // Always emit as an independent 'individual' listing keyed by pet.id (never duplicates the group ad)
      dedupedMap.set(pet.id, {
        ...pet,
        adoptionType: 'individual',
        alsoListedIndividually: undefined,
        groupCount: undefined,
        mustAdoptTogether: undefined,
        groupPetIds: undefined,
        groupMembers: undefined,
        sharedGroupPhotos: undefined,
        photoEntries: undefined,
      });
    });

    const f = this.adoptionFilters;
    // Hard exclusions for Adoption: status (already filtered above), blocked owners (filtered above),
    // and explicit adoptionType tab separation (individual vs group) when selected.
    const eligible = Array.from(dedupedMap.values()).filter((pet) => {
      if (f.adoptionType && f.adoptionType !== 'all') {
        if (pet.adoptionType !== f.adoptionType) return false;
      }
      return true;
    });

    const hasFilters = this.hasAnyActiveCriteria(f);
    const ranked = eligible.map((pet) => ({
      pet,
      filterEval: this.evaluatePetAgainstFilters(pet, f, 'adoption'),
    }));

    if (hasFilters) {
      ranked.sort((a, b) => {
        if (b.filterEval.matchedCount !== a.filterEval.matchedCount) {
          return b.filterEval.matchedCount - a.filterEval.matchedCount;
        }
        if (b.filterEval.score !== a.filterEval.score) {
          return b.filterEval.score - a.filterEval.score;
        }
        const distA = a.filterEval.realDistanceKm ?? Number.POSITIVE_INFINITY;
        const distB = b.filterEval.realDistanceKm ?? Number.POSITIVE_INFINITY;
        if (distA !== distB) return distA - distB;
        return new Date(b.pet.createdAt).getTime() - new Date(a.pet.createdAt).getTime();
      });
    } else if (f.sortBy === 'distance') {
      ranked.sort((a, b) => {
        const distA = a.filterEval.realDistanceKm ?? Number.POSITIVE_INFINITY;
        const distB = b.filterEval.realDistanceKm ?? Number.POSITIVE_INFINITY;
        if (distA !== distB) return distA - distB;
        return new Date(b.pet.createdAt).getTime() - new Date(a.pet.createdAt).getTime();
      });
    } else {
      ranked.sort(
        (a, b) => new Date(b.pet.createdAt).getTime() - new Date(a.pet.createdAt).getTime()
      );
    }

    return ranked.map((r) => r.pet);
  }

  // Group Adoption State & Management (Strictly scoped to Adoption, never mixed with Mating)
  public getUserAdoptionPets(): Pet[] {
    return this.userPets.filter((p) => p.status === 'adoption');
  }

  public getUserGroupAdoptionListing(): Pet | null {
    return this.userGroupAdoptionListing;
  }

  public getGroupEditorPublishMode(): 'group_only' | 'both' {
    return this.groupEditorPublishMode;
  }

  public setGroupEditorPublishMode(mode: 'group_only' | 'both'): void {
    this.groupEditorPublishMode = mode;
    this.notify();
  }

  public getPendingGroupChoicePet(): Pet | null {
    if (!this.pendingGroupChoicePetId) return null;
    return this.userPets.find((p) => p.id === this.pendingGroupChoicePetId) || null;
  }

  public cancelPendingGroupChoice(): void {
    this.pendingGroupChoicePetId = null;
    this.notify();
  }

  public getIsGroupAdoptionEditorOpen(): boolean {
    return this.isGroupAdoptionEditorOpen;
  }

  public getGroupEditorPreselectIds(): string[] {
    return [...this.groupEditorPreselectIds];
  }

  public openGroupAdoptionEditor(
    preselectIds?: string[],
    publishMode?: 'group_only' | 'both'
  ): void {
    if (preselectIds && preselectIds.length > 0) {
      this.groupEditorPreselectIds = [...preselectIds];
    } else if (this.userGroupAdoptionListing?.groupPetIds?.length) {
      this.groupEditorPreselectIds = [...this.userGroupAdoptionListing.groupPetIds];
    } else {
      this.groupEditorPreselectIds = this.getUserAdoptionPets().map((p) => p.id);
    }

    if (publishMode) {
      this.groupEditorPublishMode = publishMode;
    } else if (
      this.userGroupAdoptionListing?.groupPetIds?.some((id) => {
        const p = this.userPets.find((pet) => pet.id === id);
        return Boolean(p?.alsoListedIndividually);
      })
    ) {
      this.groupEditorPublishMode = 'both';
    } else {
      this.groupEditorPublishMode = 'group_only';
    }

    this.isGroupAdoptionEditorOpen = true;
    this.notify();
  }

  public closeGroupAdoptionEditor(): void {
    this.isGroupAdoptionEditorOpen = false;
    this.groupEditorPreselectIds = [];
    this.notify();
  }

  public handleProfileAdoptionToggle(petId: string): void {
    const targetPet = this.userPets.find((p) => p.id === petId);
    if (!targetPet) return;
    if (targetPet.status === 'adoption') return;

    const otherAdoptionPets = this.userPets.filter((p) => p.status === 'adoption' && p.id !== petId);
    if (otherAdoptionPets.length === 0 && !this.userGroupAdoptionListing) {
      targetPet.status = 'adoption';
      targetPet.adoptionType = 'individual';
      targetPet.alsoListedIndividually = false;
      this.recalculateAllCompatibilities();
      if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
        void upsertPetInSupabase(targetPet, this.user.id);
      }
      this.notify();
      return;
    }

    // User already has another pet listed for adoption -> Ask Group vs Separate vs Both
    this.pendingGroupChoicePetId = petId;
    this.notify();
  }

  public promptGroupChoiceIfNeeded(petId: string): void {
    const otherAdoptionPets = this.userPets.filter((p) => p.status === 'adoption' && p.id !== petId);
    if (otherAdoptionPets.length > 0 || this.userGroupAdoptionListing) {
      this.pendingGroupChoicePetId = petId;
      this.notify();
    } else {
      const pet = this.userPets.find((p) => p.id === petId);
      if (pet && pet.status === 'adoption') {
        pet.adoptionType = 'individual';
        pet.alsoListedIndividually = false;
        if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
          void upsertPetInSupabase(pet, this.user.id);
        }
        this.notify();
      }
    }
  }

  public applyAdoptionChoiceMode(petId: string, mode: AdoptionPublishMode): void {
    if (mode === 'separate') {
      this.chooseIndependentAdoption(petId);
    } else if (mode === 'both') {
      this.chooseBothAdoption(petId);
    } else {
      this.chooseGroupAdoption(petId);
    }
  }

  public chooseIndependentAdoption(petId: string): void {
    const targetPet = this.userPets.find((p) => p.id === petId);
    if (targetPet) {
      targetPet.status = 'adoption';
      targetPet.adoptionType = 'individual';
      targetPet.alsoListedIndividually = false;
    }
    const previousGroupId = this.userGroupAdoptionListing?.id;
    // Separate mode: dissolve any group listing so every adoption pet is displayed independently
    if (this.userGroupAdoptionListing) {
      const groupId = this.userGroupAdoptionListing.id;
      (this.userGroupAdoptionListing.groupPetIds || []).forEach((id) => {
        const p = this.userPets.find((up) => up.id === id);
        if (p && p.status === 'adoption') {
          p.adoptionType = 'individual';
          p.alsoListedIndividually = false;
        }
      });
      if (this.selectedPetForDetail?.id === groupId) {
        this.selectedPetForDetail = null;
      }
      this.userGroupAdoptionListing = null;
    }
    this.userPets.forEach((p) => {
      if (p.status === 'adoption') {
        p.adoptionType = 'individual';
        p.alsoListedIndividually = false;
      }
    });
    this.pendingGroupChoicePetId = null;
    this.recalculateAllCompatibilities();
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      if (previousGroupId) {
        void removeGroupAdoptionInSupabase({
          groupPetId: previousGroupId,
          ownerId: this.user.id,
          updatedPets: this.userPets.filter((p) => p.status === 'adoption'),
        });
      } else if (targetPet) {
        void upsertPetInSupabase(targetPet, this.user.id);
      }
    }
    this.notify();
  }

  public chooseGroupAdoption(petId: string): void {
    const existingIds = this.userGroupAdoptionListing?.groupPetIds?.length
      ? [...this.userGroupAdoptionListing.groupPetIds]
      : this.userPets.filter((p) => p.status === 'adoption').map((p) => p.id);

    const merged = Array.from(new Set([...existingIds, petId]));
    this.pendingGroupChoicePetId = null;
    this.groupEditorPublishMode = 'group_only';
    this.groupEditorPreselectIds = merged;
    this.isGroupAdoptionEditorOpen = true;
    this.notify();
  }

  public chooseBothAdoption(petId: string): void {
    const existingIds = this.userGroupAdoptionListing?.groupPetIds?.length
      ? [...this.userGroupAdoptionListing.groupPetIds]
      : this.userPets.filter((p) => p.status === 'adoption').map((p) => p.id);

    const merged = Array.from(new Set([...existingIds, petId]));
    this.pendingGroupChoicePetId = null;
    this.groupEditorPublishMode = 'both';
    this.groupEditorPreselectIds = merged;
    this.isGroupAdoptionEditorOpen = true;
    this.notify();
  }

  public saveGroupAdoptionListing(config: {
    orderedPetIds: string[];
    memberPhotosByPetId: Record<string, string[]>;
    sharedGroupPhotos: string[];
    mustAdoptTogether: boolean;
    adoptionReason: string;
    publishMode?: 'group_only' | 'both';
  }): boolean {
    const publishMode = config.publishMode ?? this.groupEditorPublishMode;
    const uniqueOrderedIds = Array.from(new Set(config.orderedPetIds));
    const selectedPets = uniqueOrderedIds
      .map((id) => this.userPets.find((p) => p.id === id))
      .filter((p): p is Pet => Boolean(p));

    if (selectedPets.length < 2) return false;

    const members: GroupAdoptionMember[] = selectedPets.map((p) => {
      const rawIndividual = (config.memberPhotosByPetId[p.id] || p.photos || []).filter(Boolean);
      return {
        petId: p.id,
        name: p.name,
        species: p.species,
        breed: p.breed,
        hybridBreed: p.hybridBreed,
        ageYears: p.ageYears,
        ageMonths: p.ageMonths,
        color: p.color,
        gender: p.gender,
        vaccinationStatus: p.vaccinationStatus,
        personality: [...(p.personality || [])],
        healthNotes: p.healthNotes || '',
        individualPhotos: rawIndividual,
      };
    });

    if (members.some((m) => m.individualPhotos.length === 0)) {
      return false;
    }

    const sharedPhotos = config.sharedGroupPhotos.filter(Boolean);
    const totalCount =
      members.reduce((acc, m) => acc + m.individualPhotos.length, 0) + sharedPhotos.length;

    if (totalCount < 3 || totalCount > 10) {
      return false;
    }

    // Build ordered photo entries:
    // Pass 1: Primary photo of each pet first so every pet's identity is immediately clear
    // Pass 2: Remaining separate photos of each pet
    // Pass 3: Optional shared collective photos at the end
    const photoEntries: GroupPhotoItem[] = [];
    members.forEach((m) => {
      if (m.individualPhotos[0] && photoEntries.length < 10) {
        photoEntries.push({
          url: m.individualPhotos[0],
          kind: 'individual',
          petId: m.petId,
          petName: m.name,
          label: `صورة منفصلة: ${m.name}`,
        });
      }
    });
    members.forEach((m) => {
      m.individualPhotos.slice(1).forEach((url) => {
        if (photoEntries.length < 10) {
          photoEntries.push({
            url,
            kind: 'individual',
            petId: m.petId,
            petName: m.name,
            label: `صورة منفصلة: ${m.name}`,
          });
        }
      });
    });
    sharedPhotos.forEach((url) => {
      if (photoEntries.length < 10) {
        photoEntries.push({
          url,
          kind: 'collective',
          label: 'صورة جماعية مشتركة',
        });
      }
    });

    const revertedPets: Pet[] = [];
    const selectedSet = new Set(selectedPets.map((p) => p.id));
    // Any pet previously in group that was unselected reverts to individual adoption if still adoption
    if (this.userGroupAdoptionListing?.groupPetIds) {
      this.userGroupAdoptionListing.groupPetIds.forEach((prevId) => {
        if (!selectedSet.has(prevId)) {
          const prevPet = this.userPets.find((p) => p.id === prevId);
          if (prevPet && prevPet.status === 'adoption') {
            prevPet.adoptionType = 'individual';
            prevPet.alsoListedIndividually = false;
            revertedPets.push(prevPet);
          }
        }
      });
    }

    selectedPets.forEach((p, idx) => {
      p.status = 'adoption';
      p.adoptionType = 'group';
      p.alsoListedIndividually = publishMode === 'both';
      p.photos = members[idx].individualPhotos.slice(0, 3);
    });
    this.groupEditorPublishMode = publishMode;

    const primary = selectedPets[0];
    const uniqueBreeds = Array.from(new Set(members.map((m) => m.breed).filter(Boolean)));
    const uniqueColors = Array.from(new Set(members.map((m) => m.color).filter(Boolean)));
    const combinedPersonality = Array.from(
      new Set(members.flatMap((m) => m.personality).filter(Boolean))
    );

    const existingId = this.userGroupAdoptionListing?.id;
    const groupId = existingId && isValidUuid(existingId) ? existingId : generateUuid();
    this.userGroupAdoptionListing = {
      id: groupId,
      name: members.map((m) => m.name).join(' و '),
      species: primary.species,
      breed: uniqueBreeds.join(' • '),
      ageYears: primary.ageYears,
      ageMonths: primary.ageMonths,
      color: uniqueColors.join(' / '),
      gender: primary.gender,
      photos: photoEntries.map((e) => e.url),
      area: primary.area || this.user.city || 'القاهرة',
      city: primary.city || this.user.governorate || 'القاهرة',
      governorate: primary.governorate || this.user.governorate || 'القاهرة',
      markaz: primary.markaz || this.user.markaz,
      village: primary.village || this.user.village,
      governorateId: primary.governorateId || this.user.governorateId,
      markazId: primary.markazId || this.user.markazId,
      cityId: primary.cityId || this.user.cityId,
      villageId: primary.villageId || this.user.villageId,
      locationId: primary.locationId || this.user.locationId,
      lat: primary.lat ?? this.user.lat,
      lng: primary.lng ?? this.user.lng,
      distanceKm: 0,
      healthStatus: primary.healthStatus,
      vaccinationStatus: members.every((m) => m.vaccinationStatus === 'fully_vaccinated')
        ? 'fully_vaccinated'
        : members.some((m) => m.vaccinationStatus !== 'not_vaccinated')
        ? 'partially_vaccinated'
        : 'not_vaccinated',
      personality: combinedPersonality,
      healthNotes: members
        .map((m) => (m.healthNotes ? `${m.name}: ${m.healthNotes}` : ''))
        .filter(Boolean)
        .join(' | '),
      status: 'adoption',
      adoptionType: 'group',
      groupCount: members.length,
      mustAdoptTogether: config.mustAdoptTogether,
      adoptionReason: config.adoptionReason.trim() || undefined,
      groupPetIds: members.map((m) => m.petId),
      groupMembers: members,
      sharedGroupPhotos: sharedPhotos,
      photoEntries,
      ownerId: this.user.id,
      ownerName: this.user.name,
      ownerAvatar: this.user.avatar,
      ownerPhone: this.user.phone,
      ownerPrivacy: this.user.showPhoneInProfile ? 'public' : 'private',
      ownerShowPhone: Boolean(this.user.showPhoneInProfile),
      createdAt: new Date().toISOString().split('T')[0],
    };

    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void saveGroupAdoptionInSupabase({
        groupPet: this.userGroupAdoptionListing,
        members,
        updatedMemberPets: selectedPets,
        revertedMemberPets: revertedPets,
        ownerId: this.user.id,
      });
    }

    this.isGroupAdoptionEditorOpen = false;
    this.groupEditorPreselectIds = [];
    this.recalculateAllCompatibilities();
    this.notify();
    return true;
  }

  public dissolveGroupAdoptionToIndependent(): void {
    if (!this.userGroupAdoptionListing) return;
    const groupIds = this.userGroupAdoptionListing.groupPetIds || [];
    const groupId = this.userGroupAdoptionListing.id;
    const updatedPets: Pet[] = [];

    groupIds.forEach((id) => {
      const pet = this.userPets.find((p) => p.id === id);
      if (pet) {
        pet.status = 'adoption';
        pet.adoptionType = 'individual';
        pet.alsoListedIndividually = false;
        updatedPets.push(pet);
      }
    });

    if (this.savedPetIds.has(groupId)) {
      this.savedPetIds.delete(groupId);
      if (typeof window !== 'undefined' && !this.isSupabaseAuthenticated()) {
        localStorage.setItem('meow_saved_pets', JSON.stringify(Array.from(this.savedPetIds)));
      }
    }
    if (this.selectedPetForDetail?.id === groupId) {
      this.selectedPetForDetail = null;
    }

    this.userGroupAdoptionListing = null;
    this.isGroupAdoptionEditorOpen = false;
    this.groupEditorPreselectIds = [];
    this.groupEditorPublishMode = 'group_only';
    this.recalculateAllCompatibilities();
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void removeGroupAdoptionInSupabase({
        groupPetId: groupId,
        ownerId: this.user.id,
        updatedPets,
      });
    }
    this.notify();
  }

  public stopGroupListingOnly(): void {
    if (!this.userGroupAdoptionListing) return;
    const groupIds = this.userGroupAdoptionListing.groupPetIds || [];
    const groupId = this.userGroupAdoptionListing.id;
    const updatedPets: Pet[] = [];

    groupIds.forEach((id) => {
      const pet = this.userPets.find((p) => p.id === id);
      if (!pet) return;
      if (pet.alsoListedIndividually && pet.status === 'adoption') {
        pet.adoptionType = 'individual';
        pet.alsoListedIndividually = false;
      } else {
        pet.status = 'not_available';
        pet.adoptionType = undefined;
        pet.alsoListedIndividually = false;
      }
      updatedPets.push(pet);
    });

    if (this.savedPetIds.has(groupId)) {
      this.savedPetIds.delete(groupId);
      if (typeof window !== 'undefined' && !this.isSupabaseAuthenticated()) {
        localStorage.setItem('meow_saved_pets', JSON.stringify(Array.from(this.savedPetIds)));
      }
    }
    if (this.selectedPetForDetail?.id === groupId) {
      this.selectedPetForDetail = null;
    }

    this.userGroupAdoptionListing = null;
    this.isGroupAdoptionEditorOpen = false;
    this.groupEditorPreselectIds = [];
    this.groupEditorPublishMode = 'group_only';
    this.recalculateAllCompatibilities();
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void removeGroupAdoptionInSupabase({
        groupPetId: groupId,
        ownerId: this.user.id,
        updatedPets,
      });
    }
    this.notify();
  }

  public setPetIndividualDualListing(petId: string, enabled: boolean): void {
    const pet = this.userPets.find((p) => p.id === petId);
    if (!pet) return;
    const isInGroup = Boolean(
      this.userGroupAdoptionListing?.groupPetIds?.includes(petId) && pet.status === 'adoption'
    );
    if (isInGroup) {
      pet.alsoListedIndividually = enabled;
    } else if (!enabled) {
      pet.status = 'not_available';
      pet.adoptionType = undefined;
      pet.alsoListedIndividually = false;
    } else {
      pet.status = 'adoption';
      pet.adoptionType = 'individual';
      pet.alsoListedIndividually = false;
    }
    this.recalculateAllCompatibilities();
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void upsertPetInSupabase(pet, this.user.id);
    }
    this.notify();
  }

  private removePetFromGroupListing(petId: string): void {
    if (!this.userGroupAdoptionListing?.groupPetIds?.includes(petId)) return;
    const oldGroupId = this.userGroupAdoptionListing.id;
    const hadDual = this.userGroupAdoptionListing.groupPetIds.some((id) => {
      const p = this.userPets.find((pet) => pet.id === id);
      return Boolean(p?.alsoListedIndividually);
    });
    const remainingIds = this.userGroupAdoptionListing.groupPetIds.filter((id) => id !== petId);
    const remainingPets = remainingIds
      .map((id) => this.userPets.find((p) => p.id === id))
      .filter((p): p is Pet => Boolean(p && p.status === 'adoption'));

    if (remainingPets.length < 2) {
      // Dissolve group when < 2 members remain
      remainingPets.forEach((p) => {
        p.adoptionType = 'individual';
        p.alsoListedIndividually = false;
      });
      this.userGroupAdoptionListing = null;
      if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
        void removeGroupAdoptionInSupabase({
          groupPetId: oldGroupId,
          ownerId: this.user.id,
          updatedPets: remainingPets,
        });
      }
      return;
    }

    const remainingMembers = (this.userGroupAdoptionListing.groupMembers || []).filter(
      (m) => m.petId !== petId && remainingPets.some((p) => p.id === m.petId)
    );
    const sharedPhotos = this.userGroupAdoptionListing.sharedGroupPhotos || [];
    const memberPhotosMap: Record<string, string[]> = {};
    remainingMembers.forEach((m) => {
      memberPhotosMap[m.petId] = m.individualPhotos;
    });

    // Rebuild if total stays >= 3, otherwise dissolve cleanly
    const total =
      remainingMembers.reduce((sum, m) => sum + m.individualPhotos.length, 0) + sharedPhotos.length;
    if (total < 3) {
      remainingPets.forEach((p) => {
        p.adoptionType = 'individual';
        p.alsoListedIndividually = false;
      });
      this.userGroupAdoptionListing = null;
      if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
        void removeGroupAdoptionInSupabase({
          groupPetId: oldGroupId,
          ownerId: this.user.id,
          updatedPets: remainingPets,
        });
      }
    } else {
      this.saveGroupAdoptionListing({
        orderedPetIds: remainingMembers.map((m) => m.petId),
        memberPhotosByPetId: memberPhotosMap,
        sharedGroupPhotos: sharedPhotos,
        mustAdoptTogether: Boolean(this.userGroupAdoptionListing.mustAdoptTogether),
        adoptionReason: this.userGroupAdoptionListing.adoptionReason || '',
        publishMode: hadDual ? 'both' : 'group_only',
      });
    }
  }

  // Actions
  private buildPetCandidate(petData: Partial<Pet>): {
    candidate: Pet;
    isEdit: boolean;
  } {
    const existing = this.editingPet
      ? this.userPets.find((p) => p.id === this.editingPet!.id) || this.editingPet
      : null;

    const geoInput = {
      governorateId: petData.governorateId ?? existing?.governorateId ?? this.user.governorateId,
      markazId: petData.markazId ?? existing?.markazId ?? this.user.markazId,
      cityId: petData.cityId ?? existing?.cityId ?? this.user.cityId,
      villageId: petData.villageId ?? existing?.villageId ?? this.user.villageId,
      locationId: petData.locationId ?? existing?.locationId,
      governorate: petData.governorate ?? existing?.governorate ?? this.user.governorate,
      markaz: petData.markaz ?? existing?.markaz ?? this.user.markaz,
      city: petData.city ?? existing?.city ?? this.user.city,
      village: petData.village ?? existing?.village ?? this.user.village,
      area: petData.area ?? existing?.area,
    };

    const resolvedLineage = resolveLocationLineage(geoInput);
    const coords = resolvedLineage.deepest
      ? { lat: resolvedLineage.deepest.lat, lng: resolvedLineage.deepest.lng }
      : resolveLocationCoordinates(geoInput);

    const enrichedGeo: Partial<Pet> = {
      governorateId: geoInput.governorateId || resolvedLineage.governorate?.id,
      markazId: geoInput.markazId || resolvedLineage.markaz?.id,
      cityId: geoInput.cityId || resolvedLineage.city?.id,
      villageId: geoInput.villageId || resolvedLineage.village?.id,
      locationId: geoInput.locationId || resolvedLineage.deepest?.id,
      governorate:
        geoInput.governorate || resolvedLineage.governorate?.name || this.user.governorate || 'القاهرة',
      markaz: geoInput.markaz || resolvedLineage.markaz?.name,
      city: geoInput.city || resolvedLineage.city?.name || this.user.city || 'القاهرة',
      village: geoInput.village || resolvedLineage.village?.name,
      area:
        geoInput.area ||
        geoInput.village ||
        resolvedLineage.village?.name ||
        resolvedLineage.city?.name ||
        this.user.city ||
        'القاهرة',
      lat: petData.lat ?? existing?.lat ?? coords?.lat,
      lng: petData.lng ?? existing?.lng ?? coords?.lng,
    };

    if (this.editingPet && existing) {
      const preservedPhotos =
        petData.photos && petData.photos.length > 0 ? [...petData.photos] : [...(existing.photos || [])];
      const preservedStatus = petData.status ?? existing.status;

      const updatedPet: Pet = {
        ...existing,
        ...petData,
        ...enrichedGeo,
        id: existing.id,
        photos: preservedPhotos,
        status: preservedStatus,
        healthStatus: petData.healthStatus ?? existing.healthStatus,
        personality: petData.personality ? [...petData.personality] : [...(existing.personality || [])],
        adoptionType:
          preservedStatus === 'adoption'
            ? petData.adoptionType ?? existing.adoptionType ?? 'individual'
            : undefined,
        alsoListedIndividually:
          preservedStatus === 'adoption'
            ? petData.alsoListedIndividually ?? existing.alsoListedIndividually
            : false,
      };
      return { candidate: updatedPet, isEdit: true };
    }

    const newPet: Pet = {
      id: generateUuid(),
      name: petData.name ?? '',
      species: petData.species ?? 'cat',
      breed: petData.breed ?? '',
      hybridBreed: petData.hybridBreed?.trim() || undefined,
      ageYears: petData.ageYears ?? 0,
      ageMonths: petData.ageMonths ?? 0,
      color: petData.color ?? '',
      gender: petData.gender ?? 'male',
      photos: petData.photos && petData.photos.length > 0 ? [...petData.photos] : [],
      area: enrichedGeo.area || 'القاهرة',
      city: enrichedGeo.city || 'القاهرة',
      governorate: enrichedGeo.governorate || 'القاهرة',
      markaz: enrichedGeo.markaz,
      village: enrichedGeo.village,
      governorateId: enrichedGeo.governorateId,
      markazId: enrichedGeo.markazId,
      cityId: enrichedGeo.cityId,
      villageId: enrichedGeo.villageId,
      locationId: enrichedGeo.locationId,
      lat: enrichedGeo.lat,
      lng: enrichedGeo.lng,
      distanceKm: 0,
      healthStatus: petData.healthStatus ?? 'ممتازة',
      vaccinationStatus: petData.vaccinationStatus ?? 'not_vaccinated',
      personality: petData.personality ? [...petData.personality] : [],
      healthNotes: petData.healthNotes?.trim() ?? '',
      status: petData.status ?? 'mating',
      adoptionType: petData.status === 'adoption' ? 'individual' : undefined,
      alsoListedIndividually: false,
      ownerId: this.user.id,
      ownerName: this.user.name,
      ownerAvatar: this.user.avatar,
      ownerPhone: this.user.phone,
      ownerPrivacy: this.user.showPhoneInProfile ? 'public' : 'private',
      ownerShowPhone: Boolean(this.user.showPhoneInProfile),
      createdAt: new Date().toISOString().split('T')[0],
    };
    return { candidate: newPet, isEdit: false };
  }

  private commitPetLocally(pet: Pet, isEdit: boolean): Pet {
    if (isEdit) {
      const index = this.userPets.findIndex((p) => p.id === pet.id);
      if (index !== -1) {
        this.userPets[index] = pet;
      } else {
        this.userPets.push(pet);
      }
      this.editingPet = null;

      if (pet.status !== 'adoption') {
        this.removePetFromGroupListing(pet.id);
      } else if (
        this.userGroupAdoptionListing &&
        this.userGroupAdoptionListing.groupPetIds?.includes(pet.id)
      ) {
        const memberPhotosMap: Record<string, string[]> = {};
        (this.userGroupAdoptionListing.groupMembers || []).forEach((m) => {
          memberPhotosMap[m.petId] =
            m.petId === pet.id ? pet.photos.slice(0, 3) : m.individualPhotos;
        });
        const hadDual = this.userGroupAdoptionListing.groupPetIds.some((id) => {
          const p = this.userPets.find((up) => up.id === id);
          return Boolean(p?.alsoListedIndividually);
        });
        this.saveGroupAdoptionListing({
          orderedPetIds: [...(this.userGroupAdoptionListing.groupPetIds || [])],
          memberPhotosByPetId: memberPhotosMap,
          sharedGroupPhotos: this.userGroupAdoptionListing.sharedGroupPhotos || [],
          mustAdoptTogether: Boolean(this.userGroupAdoptionListing.mustAdoptTogether),
          adoptionReason: this.userGroupAdoptionListing.adoptionReason || '',
          publishMode: hadDual ? 'both' : 'group_only',
        });
      }
    } else {
      this.userPets.push(pet);
    }

    this.recalculateAllCompatibilities();
    this.isAddPetModalOpen = false;
    return pet;
  }

  public savePet(petData: Partial<Pet>): Pet {
    const { candidate, isEdit } = this.buildPetCandidate(petData);
    this.commitPetLocally(candidate, isEdit);

    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void upsertPetInSupabase(candidate, this.user.id);
    } else if (!isSupabaseConfigured()) {
      void syncPetToFirestore(candidate).catch((err) =>
        console.warn('Firestore pet sync skipped:', err)
      );
    }

    this.notify();
    return candidate;
  }

  public async savePetAsync(
    petData: Partial<Pet>
  ): Promise<{ success: boolean; pet?: Pet; errorMessage?: string }> {
    const { candidate, isEdit } = this.buildPetCandidate(petData);

    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      const res = await upsertPetInSupabase(candidate, this.user.id);
      if (!res.success) {
        // Keep AddPetModal open & draft untouched so user never loses entered fields/photos
        return {
          success: false,
          errorMessage: res.errorMessage || 'تعذر حفظ بيانات الأليف في قاعدة البيانات.',
        };
      }
      const finalPet = res.data ? { ...candidate, ...res.data } : candidate;
      this.commitPetLocally(finalPet, isEdit);
      this.notify();
      return { success: true, pet: finalPet };
    }

    this.commitPetLocally(candidate, isEdit);
    if (!isSupabaseConfigured()) {
      void syncPetToFirestore(candidate).catch((err) =>
        console.warn('Firestore pet sync skipped:', err)
      );
    }
    this.notify();
    return { success: true, pet: candidate };
  }

  public getPendingDeletePet(): Pet | null {
    if (!this.pendingDeletePetId) return null;
    return this.userPets.find((p) => p.id === this.pendingDeletePetId) || null;
  }

  public requestDeletePet(petId: string): void {
    const pet = this.userPets.find((p) => p.id === petId);
    if (!pet) return;
    this.pendingDeletePetId = petId;
    this.notify();
  }

  public cancelDeletePet(): void {
    this.pendingDeletePetId = null;
    this.notify();
  }

  public confirmDeletePet(): void {
    if (!this.pendingDeletePetId) return;
    const id = this.pendingDeletePetId;
    this.pendingDeletePetId = null;
    this.deletePet(id);
  }

  public deletePet(petId: string): void {
    this.userPets = this.userPets.filter((p) => p.id !== petId);
    if (this.pendingDeletePetId === petId) this.pendingDeletePetId = null;
    if (this.pendingStatusChange?.petId === petId) this.pendingStatusChange = null;
    this.removePetFromGroupListing(petId);
    this.recalculateAllCompatibilities();
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void softDeletePetInSupabase(petId, this.user.id);
    } else if (!isSupabaseConfigured()) {
      void deletePetFromFirestore(petId).catch((err) =>
        console.warn('Firestore pet delete sync skipped:', err)
      );
    }
    this.notify();
  }

  public getPendingStatusChange(): { pet: Pet; targetStatus: PetStatus } | null {
    if (!this.pendingStatusChange) return null;
    const pet = this.userPets.find((p) => p.id === this.pendingStatusChange!.petId);
    if (!pet) return null;
    return { pet, targetStatus: this.pendingStatusChange.targetStatus };
  }

  public requestPetStatusChange(petId: string, targetStatus: PetStatus): void {
    const pet = this.userPets.find((p) => p.id === petId);
    if (!pet || pet.status === targetStatus) return;
    this.pendingStatusChange = { petId, targetStatus };
    this.notify();
  }

  public cancelPetStatusChange(): void {
    this.pendingStatusChange = null;
    this.notify();
  }

  public confirmPetStatusChange(): void {
    if (!this.pendingStatusChange) return;
    const { petId, targetStatus } = this.pendingStatusChange;
    this.pendingStatusChange = null;
    if (targetStatus === 'adoption') {
      this.handleProfileAdoptionToggle(petId);
    } else {
      this.setPetStatus(petId, targetStatus);
    }
  }

  public getPendingAdoptionActionConfirm(): {
    kind: 'stop_group' | 'dissolve_group' | 'stop_individual' | 'enable_individual';
    pet?: Pet;
  } | null {
    if (!this.pendingAdoptionActionConfirm) return null;
    const pet = this.pendingAdoptionActionConfirm.petId
      ? this.userPets.find((p) => p.id === this.pendingAdoptionActionConfirm!.petId)
      : undefined;
    return { kind: this.pendingAdoptionActionConfirm.kind, pet };
  }

  public requestAdoptionActionConfirm(
    kind: 'stop_group' | 'dissolve_group' | 'stop_individual' | 'enable_individual',
    petId?: string
  ): void {
    this.pendingAdoptionActionConfirm = { kind, petId };
    this.notify();
  }

  public cancelAdoptionActionConfirm(): void {
    this.pendingAdoptionActionConfirm = null;
    this.notify();
  }

  public confirmAdoptionAction(): void {
    const action = this.pendingAdoptionActionConfirm;
    if (!action) return;
    this.pendingAdoptionActionConfirm = null;
    if (action.kind === 'stop_group') {
      this.stopGroupListingOnly();
    } else if (action.kind === 'dissolve_group') {
      this.dissolveGroupAdoptionToIndependent();
    } else if (action.kind === 'stop_individual' && action.petId) {
      this.setPetIndividualDualListing(action.petId, false);
    } else if (action.kind === 'enable_individual' && action.petId) {
      this.setPetIndividualDualListing(action.petId, true);
    }
  }

  public setPetStatus(petId: string, status: PetStatus): void {
    const pet = this.userPets.find((p) => p.id === petId);
    if (pet) {
      pet.status = status;
      if (status !== 'adoption') {
        pet.adoptionType = undefined;
        pet.alsoListedIndividually = false;
        this.removePetFromGroupListing(petId);
      } else if (!pet.adoptionType) {
        pet.adoptionType = 'individual';
        pet.alsoListedIndividually = false;
      }
      this.recalculateAllCompatibilities();
      if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
        void upsertPetInSupabase(pet, this.user.id);
      }
      this.notify();
    }
  }

  public getShowPhoneInProfile(): boolean {
    return Boolean(this.user.showPhoneInProfile);
  }

  public setShowPhoneInProfile(show: boolean): void {
    const next = Boolean(show);
    this.user.showPhoneInProfile = next;
    this.user.privacyMode = next ? 'public' : 'private';
    this.user.showPhoneOnlyAfterApproval = next;

    this.userPets.forEach((p) => {
      p.ownerPrivacy = this.user.privacyMode;
      p.ownerShowPhone = next;
    });
    if (this.userGroupAdoptionListing) {
      this.userGroupAdoptionListing.ownerPrivacy = this.user.privacyMode;
      this.userGroupAdoptionListing.ownerShowPhone = next;
    }
    if (this.selectedPetForDetail && this.selectedPetForDetail.ownerId === this.user.id) {
      this.selectedPetForDetail = {
        ...this.selectedPetForDetail,
        ownerPrivacy: this.user.privacyMode,
        ownerShowPhone: next,
      };
    }

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('meow_show_phone_in_profile', next ? 'true' : 'false');
      if (this.authenticatedGoogleAccount?.uid) {
        try {
          const raw = localStorage.getItem('meow_accounts_v1');
          const accounts = raw ? (JSON.parse(raw) as Record<string, Partial<UserProfile>>) : {};
          if (accounts[this.authenticatedGoogleAccount.uid]) {
            accounts[this.authenticatedGoogleAccount.uid].showPhoneInProfile = next;
            localStorage.setItem('meow_accounts_v1', JSON.stringify(accounts));
          }
        } catch {
          // Ignore storage error
        }
      }
    }

    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void this.persistSupabasePreferences({ showPhoneInProfile: next });
    } else if (!isSupabaseConfigured()) {
      void syncUserProfileToFirestore(this.user).catch((err) =>
        console.warn('Firestore privacy sync skipped:', err)
      );
      this.userPets.forEach((p) => {
        void syncPetToFirestore(p).catch((err) =>
          console.warn('Firestore pet privacy sync skipped:', err)
        );
      });
    }

    this.notify();
  }

  public canRevealPetPhone(pet: Pet): boolean {
    if (!pet.ownerPhone || !pet.ownerPhone.trim()) return false;
    if (pet.ownerId === this.user.id) {
      return Boolean(this.user.showPhoneInProfile);
    }
    return Boolean(pet.ownerShowPhone === true && pet.ownerPrivacy === 'public');
  }

  public canRevealConversationPhone(conv: Conversation): boolean {
    if (!conv.otherUserPhone || !conv.otherUserPhone.trim()) return false;
    return Boolean(conv.otherUserShowPhone === true && conv.ownerPrivacy === 'public');
  }

  public updatePrivacyMode(mode: PrivacySetting): void {
    this.user.privacyMode = mode;
    const show = mode === 'public';
    this.user.showPhoneInProfile = show;
    this.user.showPhoneOnlyAfterApproval = show;
    this.userPets.forEach((p) => {
      p.ownerPrivacy = mode;
      p.ownerShowPhone = show;
    });
    if (this.userGroupAdoptionListing) {
      this.userGroupAdoptionListing.ownerPrivacy = mode;
      this.userGroupAdoptionListing.ownerShowPhone = show;
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('meow_show_phone_in_profile', show ? 'true' : 'false');
    }
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void this.persistSupabasePreferences({ showPhoneInProfile: show });
    }
    this.notify();
  }

  public updateUserInfo(
    name: string,
    city: string,
    phone: string,
    gender?: 'male' | 'female',
    governorate?: string,
    extraLoc?: {
      governorateId?: string;
      markazId?: string;
      cityId?: string;
      villageId?: string;
      markaz?: string;
      village?: string;
    }
  ): void {
    const lineage = resolveLocationLineage({
      governorateId: extraLoc?.governorateId,
      markazId: extraLoc?.markazId,
      cityId: extraLoc?.cityId,
      villageId: extraLoc?.villageId,
      governorate: governorate ?? this.user.governorate,
      markaz: extraLoc?.markaz,
      city,
      village: extraLoc?.village,
    });
    const resolvedGov = lineage.governorate?.name || governorate || this.user.governorate || '';
    const resolvedMarkaz = lineage.markaz?.name || extraLoc?.markaz || '';
    const resolvedCity = lineage.city?.name || city;
    const resolvedVillage = lineage.village?.name || extraLoc?.village || '';
    const resolvedCoords = lineage.deepest
      ? { lat: lineage.deepest.lat, lng: lineage.deepest.lng }
      : resolveLocationCoordinates({ governorate: resolvedGov, city: resolvedCity });

    this.user.name = name;
    this.user.city = resolvedCity;
    if (resolvedGov) {
      this.user.governorate = resolvedGov;
    }
    this.user.markaz = resolvedMarkaz || undefined;
    this.user.village = resolvedVillage || undefined;
    this.user.governorateId = lineage.governorate?.id || extraLoc?.governorateId || this.user.governorateId;
    this.user.markazId = lineage.markaz?.id || extraLoc?.markazId;
    this.user.cityId = lineage.city?.id || extraLoc?.cityId;
    this.user.villageId = lineage.village?.id || extraLoc?.villageId;
    this.user.locationId = lineage.deepest?.id || this.user.locationId;
    if (resolvedCoords) {
      this.user.lat = resolvedCoords.lat;
      this.user.lng = resolvedCoords.lng;
    }
    this.user.phone = phone;
    if (gender === 'male' || gender === 'female') {
      this.user.gender = gender;
    }

    this.userPets.forEach((p) => {
      p.ownerName = name;
      p.ownerPhone = phone;
      if (extraLoc) {
        p.area = resolvedVillage || resolvedCity;
        p.city = resolvedCity;
        p.governorate = resolvedGov || p.governorate;
        p.markaz = resolvedMarkaz || undefined;
        p.village = resolvedVillage || undefined;
        p.governorateId = this.user.governorateId;
        p.markazId = this.user.markazId;
        p.cityId = this.user.cityId;
        p.villageId = this.user.villageId;
        p.locationId = this.user.locationId;
        p.lat = this.user.lat;
        p.lng = this.user.lng;
      }
    });
    if (this.userGroupAdoptionListing) {
      this.userGroupAdoptionListing.ownerName = name;
      this.userGroupAdoptionListing.ownerPhone = phone;
      if (extraLoc) {
        this.userGroupAdoptionListing.area = resolvedVillage || resolvedCity;
        this.userGroupAdoptionListing.city = resolvedCity;
        this.userGroupAdoptionListing.governorate = resolvedGov || this.userGroupAdoptionListing.governorate;
        this.userGroupAdoptionListing.markaz = resolvedMarkaz || undefined;
        this.userGroupAdoptionListing.village = resolvedVillage || undefined;
        this.userGroupAdoptionListing.governorateId = this.user.governorateId;
        this.userGroupAdoptionListing.markazId = this.user.markazId;
        this.userGroupAdoptionListing.cityId = this.user.cityId;
        this.userGroupAdoptionListing.villageId = this.user.villageId;
        this.userGroupAdoptionListing.locationId = this.user.locationId;
        this.userGroupAdoptionListing.lat = this.user.lat;
        this.userGroupAdoptionListing.lng = this.user.lng;
      }
    }

    this.persistOwnerProfileToLocalStorage();
    this.recalculateAllCompatibilities();
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void this.persistSupabaseAccountBundle({
        adviceDismissed: this.isAdviceDismissed,
        onboardingDone: this.onboardingStep === 'completed',
      });
    } else if (!isSupabaseConfigured()) {
      void syncUserProfileToFirestore(this.user).catch((err) =>
        console.warn('Firestore profile sync skipped:', err)
      );
    }
    this.notify();
  }

  public async saveOwnerEditWithSupabase(
    name: string,
    city: string,
    phone: string,
    gender?: 'male' | 'female',
    governorate?: string,
    extraLoc?: {
      governorateId?: string;
      markazId?: string;
      cityId?: string;
      villageId?: string;
      markaz?: string;
      village?: string;
    }
  ): Promise<{ success: boolean; errorMessage?: string }> {
    if (this.isOnboardingPreviewSession || !isSupabaseConfigured() || !this.isSupabaseAuthenticated()) {
      this.updateUserInfo(name, city, phone, gender, governorate, extraLoc);
      return { success: true };
    }

    const baseSnapshot = this.getPersistableSupabaseUserProfile();
    const resolved = this.buildResolvedOwnerSnapshot(
      baseSnapshot,
      name,
      city,
      phone,
      gender,
      governorate,
      extraLoc
    );

    const writeRes = await this.enqueueSupabaseAccountWrite(async (expectedVersion) => {
      const res = await saveSupabaseUserAccountBundle(resolved.profile, {
        adviceDismissed: this.isAdviceDismissed,
        onboardingDone: this.onboardingStep === 'completed',
      });
      if (expectedVersion !== this.activeSupabaseAuthVersion) return res;
      if (res.success && res.bundle) {
        this.supabaseAccountBundle = res.bundle;
        this.supabaseAuthError = null;
      } else if (!res.success && res.errorMessage) {
        this.supabaseAuthError = res.errorMessage;
      }
      return res;
    });

    if (!writeRes || !writeRes.success) {
      return {
        success: false,
        errorMessage:
          writeRes?.errorMessage ||
          'تعذر حفظ تعديلات بيانات المالك في قاعدة البيانات. يرجى المحاولة مرة أخرى.',
      };
    }

    const hydratedProfile = writeRes.bundle?.profile;
    this.user = {
      ...(hydratedProfile || resolved.profile),
      avatar:
        this.rawSupabaseAvatarUrl ||
        hydratedProfile?.avatar ||
        this.user.avatar ||
        DEFAULT_USER_AVATAR_FALLBACK,
    };

    this.userPets.forEach((p) => {
      p.ownerName = name;
      p.ownerPhone = phone;
      if (extraLoc) {
        p.area = resolved.resolvedVillage || resolved.resolvedCity;
        p.city = resolved.resolvedCity;
        p.governorate = resolved.resolvedGov || p.governorate;
        p.markaz = resolved.resolvedMarkaz || undefined;
        p.village = resolved.resolvedVillage || undefined;
        p.governorateId = this.user.governorateId;
        p.markazId = this.user.markazId;
        p.cityId = this.user.cityId;
        p.villageId = this.user.villageId;
        p.locationId = this.user.locationId;
        p.lat = this.user.lat;
        p.lng = this.user.lng;
      }
    });
    if (this.userGroupAdoptionListing) {
      this.userGroupAdoptionListing.ownerName = name;
      this.userGroupAdoptionListing.ownerPhone = phone;
      if (extraLoc) {
        this.userGroupAdoptionListing.area = resolved.resolvedVillage || resolved.resolvedCity;
        this.userGroupAdoptionListing.city = resolved.resolvedCity;
        this.userGroupAdoptionListing.governorate =
          resolved.resolvedGov || this.userGroupAdoptionListing.governorate;
        this.userGroupAdoptionListing.markaz = resolved.resolvedMarkaz || undefined;
        this.userGroupAdoptionListing.village = resolved.resolvedVillage || undefined;
        this.userGroupAdoptionListing.governorateId = this.user.governorateId;
        this.userGroupAdoptionListing.markazId = this.user.markazId;
        this.userGroupAdoptionListing.cityId = this.user.cityId;
        this.userGroupAdoptionListing.villageId = this.user.villageId;
        this.userGroupAdoptionListing.locationId = this.user.locationId;
        this.userGroupAdoptionListing.lat = this.user.lat;
        this.userGroupAdoptionListing.lng = this.user.lng;
      }
    }

    this.persistOwnerProfileToLocalStorage();
    this.recalculateAllCompatibilities();
    this.notify();
    return { success: true };
  }

  // Communication & Requests
  public sendContactRequest(targetPet: Pet, message: string, selectedUserPetId?: string): ContactRequest {
    const isMating = targetPet.status !== 'adoption';
    const userPet = isMating
      ? this.userPets.find((p) => p.id === selectedUserPetId && p.status === 'mating') ||
        this.getPrimaryUserMatingPet()
      : this.userPets.find((p) => p.id === selectedUserPetId) || this.userPets[0];

    const newRequest: ContactRequest = {
      id: generateUuid(),
      senderId: this.user.id,
      senderName: this.user.name,
      senderAvatar: this.user.avatar,
      senderPetId: userPet?.id,
      senderPetName: userPet?.name,
      senderPet: userPet,
      senderPhone: this.user.showPhoneInProfile ? this.user.phone : undefined,
      senderShowPhone: Boolean(this.user.showPhoneInProfile),
      receiverOwnerId: targetPet.ownerId,
      receiverPetId: targetPet.id,
      receiverPetName: targetPet.name,
      receiverPet: targetPet,
      message,
      type: targetPet.status === 'adoption' ? 'adoption' : 'mating',
      status: 'pending',
      isWithdrawn: false,
      timestamp: 'الآن',
    };

    if (this.isUserBlocked(targetPet.ownerId)) {
      return newRequest;
    }

    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      if (isMating && !userPet?.id) {
        return newRequest;
      }
      this.contactRequests.unshift(newRequest);
      this.selectedPetForRequest = null;
      void createContactRequestInSupabase({
        id: newRequest.id,
        senderId: this.user.id,
        receiverId: targetPet.ownerId,
        senderPetId: userPet?.id || null,
        receiverPetId: targetPet.id,
        type: newRequest.type,
        message,
      }).then((res) => {
        if (!res.success) {
          this.contactRequests = this.contactRequests.filter((r) => r.id !== newRequest.id);
          this.notify();
        }
      });
      this.notify();
      return newRequest;
    }

    this.contactRequests.unshift(newRequest);
    this.selectedPetForRequest = null;
    if (!isSupabaseConfigured()) {
      void syncContactRequestToFirestore(newRequest).catch((err) =>
        console.warn('Firestore contact request sync skipped:', err)
      );
    }
    this.notify();
    return newRequest;
  }

  public async sendContactRequestAsync(
    targetPet: Pet,
    message: string,
    selectedUserPetId?: string
  ): Promise<{ success: boolean; request?: ContactRequest; errorMessage?: string }> {
    if (this.isUserBlocked(targetPet.ownerId)) {
      return { success: false, errorMessage: 'تعذر إرسال الطلب لأن هذا الحساب محظور.' };
    }
    const isMating = targetPet.status !== 'adoption';
    const userPet = isMating
      ? this.userPets.find((p) => p.id === selectedUserPetId && p.status === 'mating') ||
        this.getPrimaryUserMatingPet()
      : this.userPets.find((p) => p.id === selectedUserPetId) || this.userPets[0];

    if (isMating && !userPet) {
      return {
        success: false,
        errorMessage: 'يجب إضافة أو تفعيل أليف «للتزاوج» أولاً قبل إرسال طلب تزاوج.',
      };
    }

    const reqId = generateUuid();
    const newRequest: ContactRequest = {
      id: reqId,
      senderId: this.user.id,
      senderName: this.user.name,
      senderAvatar: this.user.avatar,
      senderPetId: userPet?.id,
      senderPetName: userPet?.name,
      senderPet: userPet,
      senderPhone: this.user.showPhoneInProfile ? this.user.phone : undefined,
      senderShowPhone: Boolean(this.user.showPhoneInProfile),
      receiverOwnerId: targetPet.ownerId,
      receiverPetId: targetPet.id,
      receiverPetName: targetPet.name,
      receiverPet: targetPet,
      message,
      type: isMating ? 'mating' : 'adoption',
      status: 'pending',
      isWithdrawn: false,
      timestamp: 'الآن',
    };

    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      const res = await createContactRequestInSupabase({
        id: reqId,
        senderId: this.user.id,
        receiverId: targetPet.ownerId,
        senderPetId: userPet?.id || null,
        receiverPetId: targetPet.id,
        type: newRequest.type,
        message,
      });
      if (!res.success) {
        return {
          success: false,
          errorMessage: res.errorMessage || 'تعذر إرسال طلب التواصل. حاول مرة أخرى.',
        };
      }
      this.contactRequests.unshift(newRequest);
      this.selectedPetForRequest = null;
      this.notify();
      return { success: true, request: newRequest };
    }

    this.contactRequests.unshift(newRequest);
    this.selectedPetForRequest = null;
    if (!isSupabaseConfigured()) {
      void syncContactRequestToFirestore(newRequest).catch((err) =>
        console.warn('Firestore contact request sync skipped:', err)
      );
    }
    this.notify();
    return { success: true, request: newRequest };
  }

  public approveContactRequest(requestId: string): void {
    const req = this.contactRequests.find((r) => r.id === requestId);
    if (!req) return;
    if (req.senderId === this.user.id) return;

    const isOutgoing = req.senderId === this.user.id;
    const allPets = this.getAllPets();
    const receiverPet =
      req.receiverPet || allPets.find((p) => p.id === req.receiverPetId);
    const senderPet =
      req.senderPet || (req.senderPetId ? allPets.find((p) => p.id === req.senderPetId) : undefined);

    const otherUserId = isOutgoing
      ? receiverPet?.ownerId || `owner_${req.receiverPetId}`
      : req.senderId;

    if (this.isUserBlocked(otherUserId)) return;

    const otherUserName = isOutgoing
      ? receiverPet?.ownerName || 'صاحب الأليف'
      : req.senderName;
    const otherUserAvatar = isOutgoing
      ? receiverPet?.ownerAvatar || req.senderAvatar
      : req.senderAvatar;
    const otherUserPhone = isOutgoing
      ? receiverPet?.ownerPhone
      : req.senderPhone || senderPet?.ownerPhone;
    const otherUserShowPhone = isOutgoing
      ? Boolean(receiverPet?.ownerShowPhone === true && receiverPet?.ownerPrivacy === 'public')
      : Boolean(req.senderShowPhone === true || (senderPet?.ownerShowPhone === true && senderPet?.ownerPrivacy === 'public'));

    const subjectPet = receiverPet || senderPet;
    const petPhoto =
      subjectPet?.groupMembers?.[0]?.individualPhotos?.[0] ||
      subjectPet?.photos?.[0] ||
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80';
    const petLocationParts = Array.from(
      new Set(
        [subjectPet?.area, subjectPet?.city, subjectPet?.governorate]
          .map((s) => (s || '').trim())
          .filter(Boolean)
      )
    );
    const petLocation = petLocationParts.join('، ');
    const isGroupSubject =
      subjectPet?.status === 'adoption' && subjectPet?.adoptionType === 'group';
    const groupNamesSummary = isGroupSubject
      ? (subjectPet.groupMembers || []).map((m) => m.name).filter(Boolean).join('، ')
      : '';
    const groupRuleText = isGroupSubject
      ? subjectPet.mustAdoptTogether
        ? 'يُشترط تبني المجموعة كاملة معاً'
        : 'متاح التبني معاً أو بشكل منفرد'
      : '';

    req.status = 'accepted';
    this.processedRequestStatuses[req.id] = 'accepted';
    this.persistProcessedRequestStatuses();

    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      this.markNotificationsReadWhere((n) => n.targetRequestId === req.id, true);
      void respondContactRequestInSupabase(req.id, this.user.id, 'accepted').then(async (res) => {
        await this.hydrateSupabaseWorkspaceForUser(this.user.id);
        const conv =
          (res.data?.conversationId
            ? this.conversations.find((c) => c.id === res.data?.conversationId)
            : undefined) || this.conversations.find((c) => c.requestId === req.id);
        if (conv) {
          this.currentTab = 'chat';
          this.chatSubTab = 'chats';
          this.setActiveConversationId(conv.id);
        } else {
          this.notify();
        }
      });
      this.notify();
      return;
    }

    let conv = this.conversations.find(
      (c) => c.requestId === requestId || c.otherUserId === otherUserId
    );
    if (!conv) {
      const now = Date.now();
      const convId = generateUuid();
      const sysText = isGroupSubject
        ? `تمت الموافقة على طلب التواصل بخصوص التبني الجماعي «${subjectPet?.name || req.receiverPetName}» (${subjectPet?.groupCount || subjectPet?.groupMembers?.length || 2} حيوانات: ${groupNamesSummary}) • ${groupRuleText}. يمكنك مراجعة تفاصيل كل حيوان من اللوحة بالأعلى.`
        : 'تمت الموافقة على طلب التواصل بنجاح 🐾. يمكنك التحدث مباشرة داخل التطبيق بأمان، ولا يظهر رقم الهاتف إلا عند تفعيله من إعدادات الخصوصية.';
      conv = {
        id: convId,
        requestId: req.id,
        otherUserId,
        otherUserName,
        otherUserAvatar,
        otherUserPhone,
        otherUserShowPhone,
        petId: subjectPet?.id || req.receiverPetId,
        petName: subjectPet?.name || req.receiverPetName,
        petPhoto,
        petType: req.type,
        lastMessage: 'تمت الموافقة على طلب التواصل! يمكنكما التحدث الآن.',
        lastMessageTime: 'الآن',
        unreadCount: 0,
        ownerPrivacy: otherUserShowPhone ? 'public' : 'private',
        isPinned: false,
        updatedAt: now,
        adoptionType: subjectPet?.adoptionType,
        groupCount: subjectPet?.groupCount,
        mustAdoptTogether: subjectPet?.mustAdoptTogether,
        adoptionReason: subjectPet?.adoptionReason,
        petLocation: petLocation || undefined,
        groupMembers: subjectPet?.groupMembers ? subjectPet.groupMembers.map((m) => ({ ...m, individualPhotos: [...m.individualPhotos], personality: [...m.personality] })) : undefined,
        sharedGroupPhotos: subjectPet?.sharedGroupPhotos ? [...subjectPet.sharedGroupPhotos] : undefined,
        photoEntries: subjectPet?.photoEntries ? subjectPet.photoEntries.map((e) => ({ ...e })) : undefined,
        messages: [
          {
            id: generateUuid(),
            conversationId: convId,
            senderId: 'system',
            senderName: 'Meow',
            text: sysText,
            timestamp: 'الآن',
            isFromUser: false,
          },
          {
            id: generateUuid(),
            conversationId: convId,
            senderId: req.senderId,
            senderName: req.senderName,
            text: req.message,
            timestamp: req.timestamp,
            isFromUser: isOutgoing,
          },
        ],
      };
      this.conversations.unshift(conv);
    }

    this.currentTab = 'chat';
    this.chatSubTab = 'chats';
    this.activeConversationId = conv.id;
    conv.unreadCount = 0;
    this.markNotificationsReadWhere(
      (n) =>
        n.targetRequestId === req.id ||
        n.targetConversationId === conv!.id,
      true
    );
    const celebrated = this.triggerMatingCelebrationIfNeeded(conv);

    if (!isSupabaseConfigured()) {
      void syncContactRequestToFirestore(req).catch((err) =>
        console.warn('Firestore approve request sync skipped:', err)
      );
      void syncConversationToFirestore(conv).catch((err) =>
        console.warn('Firestore conversation sync skipped:', err)
      );
    }

    this.addNotification({
      id: `notif_approve_${req.id}`,
      type: req.type === 'mating' ? 'mating_approved' : 'adoption_approved',
      title:
        req.type === 'mating'
          ? 'تمت الموافقة على التزاوج 🎉'
          : 'تمت الموافقة على طلب التبني 🏠',
      body:
        req.type === 'mating'
          ? `مبارك! تمت الموافقة على طلب التزاوج مع ${otherUserName} بخصوص «${conv.petName}».`
          : `تمت الموافقة على طلب التبني مع ${otherUserName} بخصوص «${conv.petName}».`,
      read: true,
      celebrated,
      targetTab: 'chat',
      targetSubTab: 'chats',
      targetRequestId: req.id,
      targetConversationId: conv.id,
      targetPetId: conv.petId,
    });
  }

  public rejectContactRequest(requestId: string): void {
    const req = this.contactRequests.find((r) => r.id === requestId);
    if (!req || req.senderId === this.user.id) return;
    req.status = 'rejected';
    this.processedRequestStatuses[req.id] = 'rejected';
    this.persistProcessedRequestStatuses();
    this.markNotificationsReadWhere((n) => n.targetRequestId === req.id, true);
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void respondContactRequestInSupabase(req.id, this.user.id, 'rejected');
    } else if (!isSupabaseConfigured()) {
      void syncContactRequestToFirestore(req).catch((err) =>
        console.warn('Firestore reject request sync skipped:', err)
      );
    }
    this.notify();
  }

  public withdrawContactRequest(requestId: string): void {
    const req = this.contactRequests.find((r) => r.id === requestId);
    if (!req || req.senderId !== this.user.id || req.status !== 'pending' || req.isWithdrawn) {
      return;
    }
    req.isWithdrawn = true;
    req.status = 'rejected';
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void withdrawContactRequestInSupabase(req.id, this.user.id);
    }
    this.notify();
  }

  // SAVED PETS METHODS (Heart save button)
  public isPetSaved(petId: string): boolean {
    return this.savedPetIds.has(petId);
  }

  public toggleSavePet(petId: string): boolean {
    const isSaved = this.savedPetIds.has(petId);
    const shouldSave = !isSaved;
    if (isSaved) {
      this.savedPetIds.delete(petId);
    } else {
      this.savedPetIds.add(petId);
    }
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void toggleSavedPetInSupabase(this.user.id, petId, shouldSave);
    } else if (typeof window !== 'undefined') {
      localStorage.setItem('meow_saved_pets', JSON.stringify(Array.from(this.savedPetIds)));
    }
    this.notify();
    return shouldSave;
  }

  public getSavedPetIds(): string[] {
    return Array.from(this.savedPetIds);
  }

  public getAllPets(): Pet[] {
    return [
      ...this.matingPets,
      ...this.adoptionPets,
      ...this.userPets,
      ...(this.userGroupAdoptionListing ? [this.userGroupAdoptionListing] : []),
    ];
  }

  public getSavedPets(): Pet[] {
    return this.getAllPets()
      .filter((p) => this.savedPetIds.has(p.id) && !this.isUserBlocked(p.ownerId))
      .map((p) => {
        if (
          p.ownerId === this.user.id &&
          p.status === 'adoption' &&
          p.alsoListedIndividually &&
          p.id !== this.userGroupAdoptionListing?.id
        ) {
          return {
            ...p,
            adoptionType: 'individual' as const,
            alsoListedIndividually: undefined,
            groupCount: undefined,
            mustAdoptTogether: undefined,
            groupPetIds: undefined,
            groupMembers: undefined,
            sharedGroupPhotos: undefined,
            photoEntries: undefined,
          };
        }
        return p;
      });
  }

  public getSavedPetsByStatus(status: 'mating' | 'adoption'): Pet[] {
    return this.getSavedPets().filter((p) => p.status === status);
  }

  public isSavedPetsVisible(): boolean {
    return this.isSavedPetsOpen;
  }

  public openSavedPetsView(subTab?: 'mating' | 'adoption' | 'clinics' | 'store'): void {
    this.isSavedPetsOpen = true;
    if (subTab) this.savedPetsSubTab = subTab;
    this.notify();
  }

  public closeSavedPetsView(): void {
    this.isSavedPetsOpen = false;
    this.notify();
  }

  public getSavedPetsSubTab(): 'mating' | 'adoption' | 'clinics' | 'store' {
    return this.savedPetsSubTab;
  }

  public setSavedPetsSubTab(
    tab: 'mating' | 'adoption' | 'clinics' | 'store',
    opts?: { silent?: boolean }
  ): void {
    this.savedPetsSubTab = tab;
    if (!opts?.silent) {
      this.notify();
    }
  }

  // Contact View
  public isContactOpen(): boolean {
    return this.isContactViewOpen;
  }

  public openContactView(): void {
    this.isContactViewOpen = true;
    this.notify();
  }

  public closeContactView(): void {
    this.isContactViewOpen = false;
    this.notify();
  }

  public sendMessage(payload: string | Partial<ChatMessage>): void {
    if (!this.activeConversationId) return;
    const conv = this.conversations.find((c) => c.id === this.activeConversationId);
    if (!conv || this.isUserBlocked(conv.otherUserId)) return;

    const msgId = generateUuid();
    let newMsg: ChatMessage;

    if (typeof payload === 'string') {
      if (!payload.trim()) return;
      newMsg = {
        id: msgId,
        conversationId: conv.id,
        senderId: this.user.id,
        senderName: this.user.name,
        text: payload.trim(),
        type: 'text',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isFromUser: true,
        status: 'sent',
      };
    } else {
      newMsg = {
        id: msgId,
        conversationId: conv.id,
        senderId: this.user.id,
        senderName: this.user.name,
        text: payload.text || '',
        type: payload.type || 'text',
        fileUrl: payload.fileUrl,
        fileName: payload.fileName,
        fileSize: payload.fileSize,
        audioDuration: payload.audioDuration,
        audioBlobUrl: payload.audioBlobUrl,
        stickerUrl: payload.stickerUrl,
        stickerEmoji: payload.stickerEmoji,
        stickerTitle: payload.stickerTitle,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isFromUser: true,
        status: 'sent',
      };
    }

    conv.messages.push(newMsg);
    conv.lastMessage =
      newMsg.type === 'sticker'
        ? `🎭 ملصق: ${newMsg.stickerTitle || newMsg.stickerEmoji || 'مياو'}`
        : newMsg.type === 'image'
        ? '📷 صورة'
        : newMsg.type === 'audio'
        ? '🎤 رسالة صوتية'
        : newMsg.type === 'file'
        ? `📎 ${newMsg.fileName || 'ملف مرفق'}`
        : newMsg.text || '';
    conv.lastMessageTime = 'الآن';
    conv.updatedAt = Date.now();

    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void sendMessageInSupabase({
        id: newMsg.id,
        conversationId: conv.id,
        senderId: this.user.id,
        message: newMsg,
      }).then((res) => {
        if (res.success && res.data) {
          const targetMsg = conv.messages.find((m) => m.id === newMsg.id);
          if (targetMsg) {
            targetMsg.status = res.data.status || 'sent';
            targetMsg.timestamp = res.data.timestamp || targetMsg.timestamp;
            this.notify();
          }
        }
      });
    } else if (!isSupabaseConfigured()) {
      void syncChatMessageToFirestore(conv.id, newMsg).catch((err) =>
        console.warn('Firestore message sync skipped:', err)
      );
    }
    this.notify();

    // Auto reply simulation strictly limited to local unauthenticated DEV sandbox mode
    if (import.meta.env.DEV && !this.isSupabaseAuthenticated()) {
      setTimeout(() => {
        if (
          !this.isUserBlocked(conv.otherUserId) &&
          this.conversations.some((c) => c.id === conv.id)
        ) {
          const replyText =
            newMsg.type === 'sticker'
              ? 'ملصق لطيف ومميز جداً! 😻 محادثة ممتعة ومبشرة بالخير.'
              : newMsg.type === 'audio'
              ? 'سمعت رسالتك الصوتية! صوتك واضح وشاكر لاهتمامك ومحبتك للمياو 🐾.'
              : newMsg.type === 'image'
              ? 'ما شاء الله! الصورة جميلة جداً، أليف مميز ورائع 💛.'
              : 'أهلاً بك! شاكر لاهتمامك وتواصلك الراقي، أنا جاهز لأي استفسار أو لترتيب موعد المقابلة المناسبة.';

          const replyMsg: ChatMessage = {
            id: generateUuid(),
            conversationId: conv.id,
            senderId: conv.otherUserId,
            senderName: conv.otherUserName,
            text: replyText,
            type: 'text',
            timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
            isFromUser: false,
            status: 'read',
          };
          conv.messages.push(replyMsg);
          conv.lastMessage = replyMsg.text || '';
          conv.lastMessageTime = 'الآن';
          conv.updatedAt = Date.now();
          const isViewingConv =
            this.currentTab === 'chat' && this.activeConversationId === conv.id;
          if (!isViewingConv) {
            conv.unreadCount = (conv.unreadCount || 0) + 1;
          }
          this.addNotification({
            id: `notif_msg_${replyMsg.id}`,
            type: 'new_message',
            title: `رسالة جديدة من ${conv.otherUserName}`,
            body: replyText,
            read: isViewingConv,
            targetTab: 'chat',
            targetSubTab: 'chats',
            targetConversationId: conv.id,
            targetPetId: conv.petId,
          });
        }
      }, 1200);
    }
  }

  public addHealthRecord(record: Omit<HealthRecordItem, 'id'>): void {
    const newRecord: HealthRecordItem = {
      ...record,
      id: generateUuid(),
    };
    this.healthRecords.unshift(newRecord);
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void addHealthRecordInSupabase(record, this.user.id).then((res) => {
        if (res.success && res.data) {
          const idx = this.healthRecords.findIndex((r) => r.id === newRecord.id);
          if (idx !== -1) {
            this.healthRecords[idx] = res.data;
            this.notify();
          }
        }
      });
    }
    this.notify();
  }

  // CUSTOM STICKERS METHODS
  public getCustomStickers(): CustomStickerModel[] {
    return [...this.customStickers];
  }

  public async addCustomSticker(
    imageUrl: string,
    title?: string
  ): Promise<{ success: boolean; sticker?: CustomStickerModel; errorMessage?: string }> {
    const cleanUrl = (imageUrl || '').trim();
    if (!cleanUrl) {
      return { success: false, errorMessage: 'صورة الملصق غير صالحة.' };
    }
    const cleanTitle = (title || 'ملصق مخصص').trim() || 'ملصق مخصص';

    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      const res = await addCustomStickerInSupabase({
        userId: this.user.id,
        imageUrl: cleanUrl,
        title: cleanTitle,
      });
      if (!res.success || !res.data) {
        return {
          success: false,
          errorMessage: res.errorMessage || 'تعذر حفظ الملصق المخصص.',
        };
      }
      this.customStickers = [res.data, ...this.customStickers.filter((s) => s.id !== res.data!.id)];
      this.notify();
      return { success: true, sticker: res.data };
    }

    const localSticker: CustomStickerModel = {
      id: generateUuid(),
      imageUrl: cleanUrl,
      title: cleanTitle,
      createdAt: new Date().toISOString(),
    };
    this.customStickers = [localSticker, ...this.customStickers];
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('meow_custom_stickers_v1', JSON.stringify(this.customStickers));
      } catch {
        // Ignore storage error
      }
    }
    this.notify();
    return { success: true, sticker: localSticker };
  }

  public async removeCustomSticker(stickerId: string): Promise<void> {
    this.customStickers = this.customStickers.filter((s) => s.id !== stickerId);
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      await deleteCustomStickerInSupabase(this.user.id, stickerId);
    } else if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('meow_custom_stickers_v1', JSON.stringify(this.customStickers));
      } catch {
        // Ignore storage error
      }
    }
    this.notify();
  }

  // SUPPORT MESSAGES (Contact Us -> Supabase)
  public async submitSupportMessage(
    subject: string,
    message: string
  ): Promise<{ success: boolean; errorMessage?: string }> {
    const cleanSubject = (subject || '').trim();
    const cleanMessage = (message || '').trim();
    if (!cleanSubject || !cleanMessage) {
      return { success: false, errorMessage: 'يرجى كتابة الموضوع وتفاصيل الرسالة أولاً.' };
    }

    if (isSupabaseConfigured() && !this.isOnboardingPreviewSession) {
      if (!this.isSupabaseAuthenticated() || !this.supabaseAuthUserId) {
        return {
          success: false,
          errorMessage: 'يرجى تسجيل الدخول أولاً لإرسال رسالة إلى فريق الدعم.',
        };
      }
      const res = await submitSupportMessageToSupabase({
        userId: this.supabaseAuthUserId,
        senderName: this.user.name || 'مستخدم Meow',
        senderEmail: this.user.email || '',
        senderPhone: this.user.phone || '',
        subject: cleanSubject,
        message: cleanMessage,
      });
      if (!res.success) {
        return {
          success: false,
          errorMessage: res.errorMessage || 'تعذر إرسال رسالتك إلى فريق الدعم. حاول مرة أخرى.',
        };
      }
      return { success: true };
    }

    return { success: true };
  }

  // BLOCKED USERS METHODS
  private persistBlockedUsers(): void {
    if (typeof window !== 'undefined' && !this.isSupabaseAuthenticated()) {
      localStorage.setItem('meow_blocked_users', JSON.stringify(this.blockedUsers));
    }
  }

  public getBlockedUsers(): BlockedUser[] {
    return [...this.blockedUsers];
  }

  public isUserBlocked(userId: string): boolean {
    if (!userId) return false;
    return this.blockedUsers.some((u) => u.userId === userId);
  }

  public getPendingBlockTarget(): PendingBlockTarget | null {
    return this.pendingBlockTarget;
  }

  public setPendingBlockTarget(target: PendingBlockTarget | null): void {
    this.pendingBlockTarget = target;
    this.notify();
  }

  public blockUser(target: PendingBlockTarget): void {
    if (!target.userId || target.userId === this.user.id) return;
    if (!this.isUserBlocked(target.userId)) {
      const blockedEntry: BlockedUser = {
        userId: target.userId,
        userName: target.userName || 'مستخدم',
        userAvatar: target.userAvatar,
        petName: target.petName,
        blockedAt: new Date().toISOString().split('T')[0],
      };
      this.blockedUsers.unshift(blockedEntry);
      this.persistBlockedUsers();
      if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
        void syncBlockInSupabase(this.user.id, blockedEntry, false);
      } else if (!isSupabaseConfigured()) {
        void syncBlockedUserToFirestore(blockedEntry, false).catch((err) =>
          console.warn('Firestore block sync skipped:', err)
        );
      }
    }

    if (this.selectedPetForDetail && this.selectedPetForDetail.ownerId === target.userId) {
      this.selectedPetForDetail = null;
    }
    if (this.selectedPetForRequest && this.selectedPetForRequest.ownerId === target.userId) {
      this.selectedPetForRequest = null;
    }
    if (this.activeConversationId) {
      const activeConv = this.conversations.find((c) => c.id === this.activeConversationId);
      if (activeConv && activeConv.otherUserId === target.userId) {
        this.activeConversationId = null;
      }
    }

    this.pendingBlockTarget = null;
    this.notify();
  }

  public confirmPendingBlock(): void {
    if (!this.pendingBlockTarget) return;
    this.blockUser(this.pendingBlockTarget);
  }

  public unblockUser(userId: string): void {
    const existing = this.blockedUsers.find((u) => u.userId === userId);
    this.blockedUsers = this.blockedUsers.filter((u) => u.userId !== userId);
    this.persistBlockedUsers();
    if (existing) {
      if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
        void syncBlockInSupabase(this.user.id, existing, true);
      } else if (!isSupabaseConfigured()) {
        void syncBlockedUserToFirestore(existing, true).catch((err) =>
          console.warn('Firestore unblock sync skipped:', err)
        );
      }
    }
    this.notify();
  }

  // REPORTS METHODS (Honest storage with pending_review status)
  private persistReports(): void {
    if (typeof window !== 'undefined' && !this.isSupabaseAuthenticated()) {
      try {
        localStorage.setItem('meow_reports_v1', JSON.stringify(this.reports));
      } catch {
        // Ignore storage write error
      }
    }
  }

  public getReports(): ReportRecord[] {
    return [...this.reports];
  }

  public getPendingReportTarget(): PendingReportTarget | null {
    return this.pendingReportTarget;
  }

  public setPendingReportTarget(target: PendingReportTarget | null): void {
    this.pendingReportTarget = target;
    this.notify();
  }

  public submitReport(
    reason: ReportReason,
    reasonLabel: string,
    details: string
  ): ReportRecord | null {
    if (!this.pendingReportTarget) return null;
    const target = this.pendingReportTarget;
    const record: ReportRecord = {
      id: generateUuid(),
      targetUserId: target.targetUserId,
      targetUserName: target.targetUserName,
      targetType: target.targetType,
      petId: target.petId,
      petName: target.petName,
      conversationId: target.conversationId,
      reason,
      reasonLabel,
      details: details.trim(),
      status: 'pending_review',
      createdAt: new Date().toISOString(),
    };
    this.reports.unshift(record);
    this.persistReports();
    if (this.isSupabaseAuthenticated() && !this.isOnboardingPreviewSession) {
      void createReportInSupabase(this.user.id, record);
    } else if (!isSupabaseConfigured()) {
      void syncReportToFirestore(record).catch((err) =>
        console.warn('Firestore report sync skipped:', err)
      );
    }
    this.pendingReportTarget = null;
    this.lastSubmittedReportNotice = {
      targetUserName: target.targetUserName,
      reasonLabel,
    };
    this.notify();
    return record;
  }

  public getLastSubmittedReportNotice(): { targetUserName: string; reasonLabel: string } | null {
    return this.lastSubmittedReportNotice;
  }

  public dismissReportNotice(): void {
    this.lastSubmittedReportNotice = null;
    this.notify();
  }

  public handleHardwareBack(): boolean {
    if (this.isApkUpdateModalOpen) {
      if (!this.updateCheckResult.apkUpdate?.isMandatory) {
        this.dismissApkUpdateModal();
      }
      return true;
    }
    if (this.isNotificationsModalOpen) {
      this.setNotificationsOpen(false);
      return true;
    }
    if (this.pendingBlockTarget) {
      this.setPendingBlockTarget(null);
      return true;
    }
    if (this.pendingReportTarget) {
      this.setPendingReportTarget(null);
      return true;
    }
    if (this.pendingDeleteConversationId) {
      this.pendingDeleteConversationId = null;
      this.notify();
      return true;
    }
    if (this.pendingDeletePetId) {
      this.cancelDeletePet();
      return true;
    }
    if (this.pendingStatusChange) {
      this.cancelPetStatusChange();
      return true;
    }
    if (this.pendingAdoptionActionConfirm) {
      this.cancelAdoptionActionConfirm();
      return true;
    }
    if (this.pendingGroupChoicePetId) {
      this.pendingGroupChoicePetId = null;
      this.notify();
      return true;
    }
    if (this.isGroupAdoptionEditorOpen) {
      this.isGroupAdoptionEditorOpen = false;
      this.notify();
      return true;
    }
    if (this.selectedPetForRequest) {
      this.setSelectedPetForRequest(null);
      return true;
    }
    if (this.selectedPetForDetail) {
      this.setSelectedPetForDetail(null);
      return true;
    }
    if (this.isAddPetModalOpen) {
      this.setAddPetModalVisible(false);
      return true;
    }
    if (this.isFilterModalOpen) {
      this.setFilterModalOpen(false);
      return true;
    }
    if (this.isSavedPetsOpen) {
      this.closeSavedPetsView();
      return true;
    }
    if (this.isContactViewOpen) {
      this.closeContactView();
      return true;
    }
    if (this.isEditOwnerModalOpen) {
      this.setEditOwnerModalVisible(false);
      return true;
    }
    if (this.isSettingsDrawerOpen) {
      this.setSettingsOpen(false);
      return true;
    }
    if (this.currentTab === 'chat' && this.activeConversationId) {
      this.activeConversationId = null;
      this.notify();
      return true;
    }
    if (this.currentTab !== 'mating') {
      this.setCurrentTab('mating');
      return true;
    }
    return false;
  }
}

export const state = new AppStateManager();
