import {
  AdoptionType,
  AppNotification,
  AppNotificationType,
  BlockedUser,
  ChatMessage,
  ContactRequest,
  Conversation,
  GroupAdoptionMember,
  GroupPhotoItem,
  HealthRecordItem,
  MainTab,
  Pet,
  PetGender,
  PetSpecies,
  PetStatus,
  PrivacySetting,
  ReportReason,
  ReportRecord,
  ReportStatus,
  UserProfile,
  VaccinationStatus,
} from '../types.ts';

// ============================================================================
// DATABASE ROW TYPES (14 Core Tables + user_custom_stickers)
// ============================================================================

export type ProfileRole = 'user' | 'admin' | 'moderator' | 'vet' | 'vendor' | 'rescuer';
export type DbContactRequestStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn';
export type DbReportStatus = 'pending_review' | 'under_review' | 'resolved' | 'dismissed';
export type SupportMessageStatus = 'new' | 'in_progress' | 'replied' | 'closed';
export type SupportMessagePriority = 'low' | 'normal' | 'high' | 'urgent';

export interface DbProfileRow {
  id: string;
  role: ProfileRole;
  name: string;
  avatar_url: string;
  gender: 'male' | 'female' | null;
  city: string;
  governorate: string | null;
  markaz: string | null;
  village: string | null;
  location_id: string | null;
  governorate_id: string | null;
  markaz_id: string | null;
  city_id: string | null;
  village_id: string | null;
  lat: number | null;
  lng: number | null;
  show_phone_in_profile: boolean;
  privacy_mode: PrivacySetting;
  show_phone_only_after_approval: boolean;
  notifications_enabled: boolean;
  advice_dismissed: boolean;
  onboarding_done: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbUserPrivateDetailsRow {
  user_id: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface DbPetRow {
  id: string;
  legacy_id: string | null;
  owner_id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  hybrid_breed: string | null;
  age_years: number;
  age_months: number;
  color: string;
  gender: PetGender;
  photos: string[];
  area: string;
  city: string;
  governorate: string | null;
  markaz: string | null;
  village: string | null;
  location_id: string | null;
  governorate_id: string | null;
  markaz_id: string | null;
  city_id: string | null;
  village_id: string | null;
  lat: number | null;
  lng: number | null;
  health_status: Pet['healthStatus'];
  vaccination_status: VaccinationStatus;
  personality: string[];
  health_notes: string;
  status: PetStatus;
  adoption_type: AdoptionType | null;
  also_listed_individually: boolean;
  group_count: number | null;
  must_adopt_together: boolean;
  adoption_reason: string | null;
  shared_group_photos: string[];
  photo_entries: GroupPhotoItem[];
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbGroupAdoptionMemberRow {
  id: string;
  group_pet_id: string;
  owner_id: string;
  linked_pet_id: string | null;
  name: string;
  species: PetSpecies;
  breed: string;
  hybrid_breed: string | null;
  age_years: number;
  age_months: number;
  color: string;
  gender: PetGender;
  vaccination_status: VaccinationStatus;
  personality: string[];
  health_notes: string;
  individual_photos: string[];
  sort_order: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbHealthRecordRow {
  id: string;
  legacy_id: string | null;
  pet_id: string;
  owner_id: string;
  title: string;
  type: HealthRecordItem['type'];
  record_date: string;
  next_due_date: string | null;
  clinic_name: string | null;
  notes: string | null;
  completed: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbSavedPetRow {
  user_id: string;
  pet_id: string;
  created_at: string;
}

export interface DbContactRequestRow {
  id: string;
  legacy_id: string | null;
  sender_id: string;
  receiver_id: string;
  sender_pet_id: string | null;
  receiver_pet_id: string;
  type: 'mating' | 'adoption';
  message: string;
  status: DbContactRequestStatus;
  celebrated: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbConversationRow {
  id: string;
  legacy_id: string | null;
  request_id: string;
  user_a_id: string;
  user_b_id: string;
  pet_id: string | null;
  pet_type: 'mating' | 'adoption';
  last_message: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
}

export interface DbConversationUserStateRow {
  conversation_id: string;
  user_id: string;
  unread_count: number;
  is_pinned: boolean;
  is_muted?: boolean;
  pinned_at: string | null;
  is_hidden: boolean;
  hidden_at: string | null;
  last_read_at: string | null;
  updated_at: string;
}

export interface DbMessageRow {
  id: string;
  legacy_id: string | null;
  conversation_id: string;
  sender_id: string | null;
  is_system: boolean;
  type: NonNullable<ChatMessage['type']>;
  text: string | null;
  file_url: string | null;
  file_name: string | null;
  file_size: string | null;
  audio_duration: number | null;
  sticker_url: string | null;
  sticker_emoji: string | null;
  sticker_title: string | null;
  reply_to_id?: string | null;
  reply_to_sender_name?: string | null;
  reply_to_text?: string | null;
  reply_to_type?: NonNullable<ChatMessage['type']> | null;
  deleted_at?: string | null;
  status: NonNullable<ChatMessage['status']>;
  created_at: string;
}

export interface DbNotificationRow {
  id: string;
  legacy_id: string | null;
  user_id: string;
  dedupe_key: string | null;
  type: AppNotificationType;
  title: string;
  body: string;
  read: boolean;
  dismissed: boolean;
  celebrated: boolean;
  target_tab: MainTab;
  target_sub_tab: 'chats' | 'requests' | null;
  target_request_id: string | null;
  target_conversation_id: string | null;
  target_pet_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface DbBlockedUserRow {
  blocker_id: string;
  blocked_id: string;
  blocked_user_name: string | null;
  blocked_user_avatar: string | null;
  pet_name: string | null;
  created_at: string;
}

export interface DbReportRow {
  id: string;
  reporter_id: string;
  target_user_id: string;
  target_user_name: string;
  target_type: ReportRecord['targetType'];
  pet_id: string | null;
  pet_name: string | null;
  conversation_id: string | null;
  reason: ReportReason;
  reason_label: string;
  details: string;
  status: DbReportStatus;
  reviewed_by: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbSupportMessageRow {
  id: string;
  user_id: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  subject: string;
  message: string;
  status: SupportMessageStatus;
  priority: SupportMessagePriority;
  assigned_admin_id: string | null;
  admin_reply: string | null;
  replied_at: string | null;
  email_notified: boolean;
  email_notified_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface SupportMessageModel {
  id: string;
  userId: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  subject: string;
  message: string;
  status: SupportMessageStatus;
  priority: SupportMessagePriority;
  adminReply?: string;
  repliedAt?: string;
  createdAt: string;
}

export interface DbUserCustomStickerRow {
  id: string;
  legacy_id: string | null;
  user_id: string;
  image_url: string;
  title: string;
  created_at: string;
}

export interface CustomStickerModel {
  id: string;
  imageUrl: string;
  title: string;
  createdAt: string;
}

export interface MappedContactRequest extends ContactRequest {
  dbStatus: DbContactRequestStatus;
  isWithdrawn: boolean;
}

export interface MappedReportRecord extends ReportRecord {
  dbStatus: DbReportStatus;
  reviewedBy?: string;
  adminNotes?: string;
  updatedAt: string;
}

// ============================================================================
// FORMATTING & PRIVACY HELPERS
// ============================================================================

export function formatRelativeArabicTime(isoDate: string): string {
  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) return 'الآن';
  const diffMs = Math.max(0, Date.now() - parsed);
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'الآن';
  if (diffMins < 60) return `منذ ${diffMins} د`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `منذ ${diffHours} س`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'أمس';
  if (diffDays < 7) return `منذ ${diffDays} أيام`;
  return new Date(parsed).toLocaleDateString('ar-EG');
}

export function formatArabicClock(isoDate: string): string {
  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) return 'الآن';
  return new Date(parsed).toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function resolveShowPhoneFlag(profile?: Partial<DbProfileRow> | null): boolean {
  return Boolean(profile?.show_phone_in_profile);
}

// ============================================================================
// 1. PROFILE MAPPERS
// ============================================================================

export function mapDbProfileToUserProfile(
  profile: DbProfileRow,
  privateDetails?: DbUserPrivateDetailsRow | null
): UserProfile {
  const showPhone = resolveShowPhoneFlag(profile);
  return {
    id: profile.id,
    name: profile.name,
    avatar: profile.avatar_url,
    email: privateDetails?.email || '',
    phone: privateDetails?.phone || '',
    gender: profile.gender || undefined,
    city: profile.city,
    governorate: profile.governorate || undefined,
    markaz: profile.markaz || undefined,
    village: profile.village || undefined,
    locationId: profile.location_id || undefined,
    governorateId: profile.governorate_id || undefined,
    markazId: profile.markaz_id || undefined,
    cityId: profile.city_id || undefined,
    villageId: profile.village_id || undefined,
    lat: profile.lat ?? undefined,
    lng: profile.lng ?? undefined,
    privacyMode: showPhone ? 'public' : 'private',
    showPhoneOnlyAfterApproval: showPhone,
    showPhoneInProfile: showPhone,
    notificationsEnabled: profile.notifications_enabled,
  };
}

export function mapUserProfileToDbUpsert(
  user: UserProfile,
  extra?: { adviceDismissed?: boolean; onboardingDone?: boolean }
): {
  profile: Omit<DbProfileRow, 'role' | 'deleted_at' | 'created_at' | 'updated_at'>;
  privateDetails: Omit<DbUserPrivateDetailsRow, 'created_at' | 'updated_at'>;
} {
  const showPhone = Boolean(user.showPhoneInProfile);
  return {
    profile: {
      id: user.id,
      name: user.name,
      avatar_url: user.avatar || '',
      gender: user.gender || null,
      city: user.city || '',
      governorate: user.governorate || null,
      markaz: user.markaz || null,
      village: user.village || null,
      location_id: user.locationId || null,
      governorate_id: user.governorateId || null,
      markaz_id: user.markazId || null,
      city_id: user.cityId || null,
      village_id: user.villageId || null,
      lat: typeof user.lat === 'number' ? user.lat : null,
      lng: typeof user.lng === 'number' ? user.lng : null,
      show_phone_in_profile: showPhone,
      privacy_mode: showPhone ? 'public' : 'private',
      show_phone_only_after_approval: showPhone,
      notifications_enabled: user.notificationsEnabled !== false,
      advice_dismissed: Boolean(extra?.adviceDismissed),
      onboarding_done: extra?.onboardingDone ?? true,
    },
    privateDetails: {
      user_id: user.id,
      email: user.email || '',
      phone: user.phone || '',
    },
  };
}

// ============================================================================
// 2. PETS & GROUP ADOPTION MEMBERS MAPPERS
// ============================================================================

export function mapDbGroupMemberToModel(row: DbGroupAdoptionMemberRow): GroupAdoptionMember {
  return {
    petId: row.linked_pet_id || row.id,
    name: row.name,
    species: row.species,
    breed: row.breed,
    hybridBreed: row.hybrid_breed || undefined,
    ageYears: row.age_years,
    ageMonths: row.age_months,
    color: row.color,
    gender: row.gender,
    vaccinationStatus: row.vaccination_status,
    personality: Array.isArray(row.personality) ? row.personality : [],
    healthNotes: row.health_notes || '',
    individualPhotos: Array.isArray(row.individual_photos) ? row.individual_photos : [],
  };
}

export function mapGroupMemberToDbInsert(
  member: GroupAdoptionMember,
  groupPetId: string,
  ownerId: string,
  sortOrder: number,
  linkedPetUuid?: string | null
): Omit<DbGroupAdoptionMemberRow, 'id' | 'deleted_at' | 'created_at' | 'updated_at'> {
  return {
    group_pet_id: groupPetId,
    owner_id: ownerId,
    linked_pet_id: linkedPetUuid ?? null,
    name: member.name,
    species: member.species,
    breed: member.breed,
    hybrid_breed: member.hybridBreed || null,
    age_years: member.ageYears,
    age_months: member.ageMonths,
    color: member.color,
    gender: member.gender,
    vaccination_status: member.vaccinationStatus,
    personality: [...member.personality],
    health_notes: member.healthNotes || '',
    individual_photos: [...member.individualPhotos],
    sort_order: sortOrder,
  };
}

export function mapDbPetToModel(
  row: DbPetRow,
  options?: {
    ownerProfile?: Partial<DbProfileRow> | null;
    ownerPhone?: string | null;
    groupMembers?: DbGroupAdoptionMemberRow[];
    distanceKm?: number;
  }
): Pet {
  const ownerShowPhone = resolveShowPhoneFlag(options?.ownerProfile);
  const mappedMembers = (options?.groupMembers || [])
    .filter((m) => !m.deleted_at)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(mapDbGroupMemberToModel);

  return {
    id: row.id,
    name: row.name,
    species: row.species,
    breed: row.breed,
    hybridBreed: row.hybrid_breed || undefined,
    ageYears: row.age_years,
    ageMonths: row.age_months,
    color: row.color,
    gender: row.gender,
    photos: Array.isArray(row.photos) ? row.photos : [],
    area: row.area,
    city: row.city,
    governorate: row.governorate || undefined,
    markaz: row.markaz || undefined,
    village: row.village || undefined,
    locationId: row.location_id || undefined,
    governorateId: row.governorate_id || undefined,
    markazId: row.markaz_id || undefined,
    cityId: row.city_id || undefined,
    villageId: row.village_id || undefined,
    lat: row.lat ?? undefined,
    lng: row.lng ?? undefined,
    distanceKm: options?.distanceKm ?? 0,
    healthStatus: row.health_status,
    vaccinationStatus: row.vaccination_status,
    personality: Array.isArray(row.personality) ? row.personality : [],
    healthNotes: row.health_notes || '',
    status: row.status,
    adoptionType: row.adoption_type || undefined,
    alsoListedIndividually: row.also_listed_individually || undefined,
    groupCount: row.group_count ?? undefined,
    mustAdoptTogether: row.must_adopt_together || undefined,
    adoptionReason: row.adoption_reason || undefined,
    groupPetIds:
      mappedMembers.length > 0 ? mappedMembers.map((m) => m.petId) : undefined,
    groupMembers: mappedMembers.length > 0 ? mappedMembers : undefined,
    sharedGroupPhotos:
      Array.isArray(row.shared_group_photos) && row.shared_group_photos.length > 0
        ? row.shared_group_photos
        : undefined,
    photoEntries:
      Array.isArray(row.photo_entries) && row.photo_entries.length > 0
        ? row.photo_entries
        : undefined,
    ownerId: row.owner_id,
    ownerName: options?.ownerProfile?.name || 'مستخدم Meow',
    ownerAvatar: options?.ownerProfile?.avatar_url || '',
    ownerPhone: ownerShowPhone && options?.ownerPhone ? options.ownerPhone : undefined,
    ownerPrivacy: ownerShowPhone ? 'public' : 'private',
    ownerShowPhone,
    createdAt: row.created_at.split('T')[0],
  };
}

export function mapPetToDbPayload(
  pet: Pet,
  ownerId: string,
  legacyId?: string
): Omit<DbPetRow, 'id' | 'deleted_at' | 'created_at' | 'updated_at'> {
  const isAdoption = pet.status === 'adoption';
  return {
    legacy_id: legacyId || null,
    owner_id: ownerId,
    name: pet.name,
    species: pet.species,
    breed: pet.breed || '',
    hybrid_breed: pet.hybridBreed || null,
    age_years: pet.ageYears,
    age_months: pet.ageMonths,
    color: pet.color || '',
    gender: pet.gender,
    photos: Array.isArray(pet.photos) ? [...pet.photos] : [],
    area: pet.area || '',
    city: pet.city || '',
    governorate: pet.governorate || null,
    markaz: pet.markaz || null,
    village: pet.village || null,
    location_id: pet.locationId || null,
    governorate_id: pet.governorateId || null,
    markaz_id: pet.markazId || null,
    city_id: pet.cityId || null,
    village_id: pet.villageId || null,
    lat: typeof pet.lat === 'number' ? pet.lat : null,
    lng: typeof pet.lng === 'number' ? pet.lng : null,
    health_status: pet.healthStatus,
    vaccination_status: pet.vaccinationStatus,
    personality: Array.isArray(pet.personality) ? [...pet.personality] : [],
    health_notes: pet.healthNotes || '',
    status: pet.status,
    adoption_type: isAdoption ? pet.adoptionType || 'individual' : null,
    also_listed_individually: Boolean(pet.alsoListedIndividually),
    group_count: isAdoption && pet.adoptionType === 'group' ? pet.groupCount ?? pet.groupMembers?.length ?? null : null,
    must_adopt_together: Boolean(isAdoption && pet.adoptionType === 'group' && pet.mustAdoptTogether),
    adoption_reason: pet.adoptionReason || null,
    shared_group_photos: Array.isArray(pet.sharedGroupPhotos) ? [...pet.sharedGroupPhotos] : [],
    photo_entries: Array.isArray(pet.photoEntries) ? [...pet.photoEntries] : [],
  };
}

// ============================================================================
// 3. HEALTH RECORDS MAPPERS
// ============================================================================

export function mapDbHealthRecordToModel(row: DbHealthRecordRow): HealthRecordItem {
  return {
    id: row.id,
    petId: row.pet_id,
    title: row.title,
    type: row.type,
    date: row.record_date,
    nextDueDate: row.next_due_date || undefined,
    clinicName: row.clinic_name || undefined,
    notes: row.notes || undefined,
    completed: row.completed,
  };
}

export function mapHealthRecordToDbPayload(
  record: Omit<HealthRecordItem, 'id'>,
  ownerId: string,
  legacyId?: string
): Omit<DbHealthRecordRow, 'id' | 'deleted_at' | 'created_at' | 'updated_at'> {
  return {
    legacy_id: legacyId || null,
    pet_id: record.petId,
    owner_id: ownerId,
    title: record.title,
    type: record.type,
    record_date: record.date,
    next_due_date: record.nextDueDate || null,
    clinic_name: record.clinicName || null,
    notes: record.notes || null,
    completed: record.completed,
  };
}

// ============================================================================
// 4. CONTACT REQUESTS MAPPERS
// ============================================================================

export function getContactRequestStatusLabelAr(status: DbContactRequestStatus): string {
  switch (status) {
    case 'accepted':
      return 'تمت الموافقة';
    case 'rejected':
      return 'مرفوض';
    case 'withdrawn':
      return 'تم السحب';
    default:
      return 'قيد الانتظار';
  }
}

export function mapDbContactRequestToModel(
  row: DbContactRequestRow,
  options?: {
    senderProfile?: Partial<DbProfileRow> | null;
    senderPhone?: string | null;
    senderPet?: Pet;
    receiverPet?: Pet;
  }
): MappedContactRequest {
  const senderShowPhone = resolveShowPhoneFlag(options?.senderProfile);
  // Keep ContactRequest.status compatible with src/types.ts while preserving exact dbStatus & isWithdrawn
  const legacyStatus: ContactRequest['status'] =
    row.status === 'withdrawn' ? 'rejected' : row.status;

  return {
    id: row.id,
    senderId: row.sender_id,
    senderName: options?.senderProfile?.name || 'مستخدم Meow',
    senderAvatar: options?.senderProfile?.avatar_url || '',
    senderPetId: row.sender_pet_id || undefined,
    senderPetName: options?.senderPet?.name,
    senderPet: options?.senderPet,
    senderPhone: senderShowPhone && options?.senderPhone ? options.senderPhone : undefined,
    senderShowPhone,
    receiverOwnerId: row.receiver_id,
    receiverPetId: row.receiver_pet_id,
    receiverPetName: options?.receiverPet?.name || 'أليف',
    receiverPet: options?.receiverPet,
    message: row.message,
    type: row.type,
    status: legacyStatus,
    dbStatus: row.status,
    isWithdrawn: row.status === 'withdrawn',
    timestamp: formatRelativeArabicTime(row.created_at),
    celebrated: row.celebrated,
  };
}

export function mapContactRequestToDbInsert(input: {
  senderId: string;
  receiverId: string;
  senderPetId?: string | null;
  receiverPetId: string;
  type: 'mating' | 'adoption';
  message: string;
}): Omit<DbContactRequestRow, 'id' | 'legacy_id' | 'status' | 'celebrated' | 'created_at' | 'updated_at'> {
  return {
    sender_id: input.senderId,
    receiver_id: input.receiverId,
    sender_pet_id: input.senderPetId || null,
    receiver_pet_id: input.receiverPetId,
    type: input.type,
    message: input.message.trim(),
  };
}

// ============================================================================
// 5. CONVERSATIONS & MESSAGES MAPPERS (with hidden_at cutoff support)
// ============================================================================

export function mapDbMessageToModel(
  row: DbMessageRow,
  currentUserId: string
): ChatMessage {
  const isDeleted = Boolean(row.deleted_at);
  const rawFileUrl = row.file_url || undefined;
  const storagePath =
    rawFileUrl && rawFileUrl.startsWith('sb-storage://chat-media/')
      ? rawFileUrl.slice('sb-storage://chat-media/'.length)
      : undefined;
  const parsedCreatedAt = Date.parse(row.created_at);

  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.is_system ? 'system' : row.sender_id || 'system',
    senderName: row.is_system ? 'Meow' : '',
    text: isDeleted ? 'اتمسحت الرسالة دي' : row.text || undefined,
    type: isDeleted ? 'text' : row.type,
    fileUrl: isDeleted || storagePath ? undefined : rawFileUrl,
    storagePath: isDeleted ? undefined : storagePath,
    fileName: isDeleted ? undefined : row.file_name || undefined,
    fileSize: isDeleted ? undefined : row.file_size || undefined,
    audioDuration: isDeleted ? undefined : row.audio_duration ?? undefined,
    stickerUrl: isDeleted ? undefined : row.sticker_url || undefined,
    stickerEmoji: isDeleted ? undefined : row.sticker_emoji || undefined,
    stickerTitle: isDeleted ? undefined : row.sticker_title || undefined,
    replyTo:
      !isDeleted && row.reply_to_id
        ? {
            messageId: row.reply_to_id,
            senderName: row.reply_to_sender_name || 'مستخدم',
            text: row.reply_to_text || '',
            type: row.reply_to_type || 'text',
          }
        : undefined,
    deletedAt: row.deleted_at || undefined,
    timestamp: formatArabicClock(row.created_at),
    createdAtMs: Number.isNaN(parsedCreatedAt) ? Date.now() : parsedCreatedAt,
    isFromUser: !row.is_system && row.sender_id === currentUserId,
    status: row.status,
    localStatus: 'sent',
  };
}

export function filterVisibleMessagesForUserState(
  rows: DbMessageRow[],
  userState?: DbConversationUserStateRow | null
): DbMessageRow[] {
  if (!userState?.hidden_at) return rows;
  const cutoff = Date.parse(userState.hidden_at);
  if (Number.isNaN(cutoff)) return rows;
  return rows.filter((m) => Date.parse(m.created_at) > cutoff);
}

export function isConversationVisibleToUser(
  userState?: DbConversationUserStateRow | null
): boolean {
  return !userState?.is_hidden;
}

export function formatDbMessagePreview(row: DbMessageRow): string {
  if (row.deleted_at) {
    return 'تم مسح الرسالة';
  }
  switch (row.type) {
    case 'sticker':
      return `🎭 ملصق: ${row.sticker_title || row.sticker_emoji || 'مياو'}`;
    case 'image':
      return '📷 صورة';
    case 'audio':
      return '🎤 رسالة صوتية';
    case 'file':
      return `📎 ${row.file_name || 'ملف مرفق'}`;
    default:
      return row.text || '';
  }
}

export function mapDbConversationToModel(
  row: DbConversationRow,
  currentUserId: string,
  options?: {
    userState?: DbConversationUserStateRow | null;
    otherUserProfile?: Partial<DbProfileRow> | null;
    otherUserPhone?: string | null;
    pet?: Pet | null;
    messages?: DbMessageRow[];
  }
): Conversation {
  const otherUserId = row.user_a_id === currentUserId ? row.user_b_id : row.user_a_id;
  const otherShowPhone = resolveShowPhoneFlag(options?.otherUserProfile);
  const visibleMessageRows = filterVisibleMessagesForUserState(
    options?.messages || [],
    options?.userState
  );
  const hasHideCutoff = Boolean(options?.userState?.hidden_at);
  const hiddenCutoffMs = options?.userState?.hidden_at
    ? Date.parse(options.userState.hidden_at)
    : Number.NaN;
  const rowLastMessageMs = Date.parse(row.last_message_at);
  const isRowPreviewBeforeHide =
    hasHideCutoff &&
    !Number.isNaN(hiddenCutoffMs) &&
    !Number.isNaN(rowLastMessageMs) &&
    rowLastMessageMs <= hiddenCutoffMs;
  const lastVisibleRow =
    visibleMessageRows.length > 0 ? visibleMessageRows[visibleMessageRows.length - 1] : null;
  const resolvedLastMessage =
    options?.messages !== undefined && hasHideCutoff
      ? lastVisibleRow
        ? formatDbMessagePreview(lastVisibleRow)
        : ''
      : isRowPreviewBeforeHide
        ? ''
        : row.last_message;
  const resolvedLastMessageAt =
    options?.messages !== undefined && hasHideCutoff && lastVisibleRow
      ? lastVisibleRow.created_at
      : row.last_message_at;

  const pet = options?.pet;
  const petPhoto =
    pet?.groupMembers?.[0]?.individualPhotos?.[0] ||
    pet?.photos?.[0] ||
    '';

  const petLocation = pet
    ? Array.from(
        new Set(
          [pet.area, pet.city, pet.governorate]
            .map((part) => (part || '').trim())
            .filter(Boolean)
        )
      ).join('، ')
    : undefined;

  return {
    id: row.id,
    requestId: row.request_id,
    otherUserId,
    otherUserName: options?.otherUserProfile?.name || 'مستخدم Meow',
    otherUserAvatar: options?.otherUserProfile?.avatar_url || '',
    otherUserPhone: otherShowPhone && options?.otherUserPhone ? options.otherUserPhone : undefined,
    otherUserShowPhone: otherShowPhone,
    petId: row.pet_id || pet?.id || '',
    petName: pet?.name || 'أليف',
    petPhoto,
    petType: row.pet_type,
    lastMessage: resolvedLastMessage,
    lastMessageTime: formatRelativeArabicTime(resolvedLastMessageAt),
    unreadCount: options?.userState?.unread_count ?? 0,
    ownerPrivacy: otherShowPhone ? 'public' : 'private',
    messages: visibleMessageRows.map((m) => mapDbMessageToModel(m, currentUserId)),
    isPinned: options?.userState?.is_pinned ?? false,
    isMuted: options?.userState?.is_muted ?? false,
    pinnedAt: options?.userState?.pinned_at ? Date.parse(options.userState.pinned_at) : undefined,
    updatedAt: Date.parse(row.last_message_at) || Date.parse(row.updated_at),
    adoptionType: pet?.adoptionType,
    groupCount: pet?.groupCount,
    mustAdoptTogether: pet?.mustAdoptTogether,
    adoptionReason: pet?.adoptionReason,
    petLocation: petLocation || undefined,
    groupMembers: pet?.groupMembers,
    sharedGroupPhotos: pet?.sharedGroupPhotos,
    photoEntries: pet?.photoEntries,
  };
}

// ============================================================================
// 6. NOTIFICATIONS, BLOCKS, REPORTS & SUPPORT MAPPERS
// ============================================================================

export function mapDbNotificationToModel(row: DbNotificationRow): AppNotification {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    body: row.body,
    read: row.read,
    celebrated: row.celebrated,
    targetTab: row.target_tab,
    targetSubTab: row.target_sub_tab || undefined,
    targetRequestId: row.target_request_id || undefined,
    targetConversationId: row.target_conversation_id || undefined,
    targetPetId: row.target_pet_id || undefined,
    createdAt: row.created_at,
    timestampLabel: formatRelativeArabicTime(row.created_at),
  };
}

export function mapDbBlockedUserToModel(row: DbBlockedUserRow): BlockedUser {
  return {
    userId: row.blocked_id,
    userName: row.blocked_user_name || 'مستخدم',
    userAvatar: row.blocked_user_avatar || undefined,
    petName: row.pet_name || undefined,
    blockedAt: row.created_at.split('T')[0],
  };
}

export function mapDbReportToModel(row: DbReportRow): MappedReportRecord {
  const legacyStatus: ReportStatus = 'pending_review';
  return {
    id: row.id,
    targetUserId: row.target_user_id,
    targetUserName: row.target_user_name,
    targetType: row.target_type,
    petId: row.pet_id || undefined,
    petName: row.pet_name || undefined,
    conversationId: row.conversation_id || undefined,
    reason: row.reason,
    reasonLabel: row.reason_label,
    details: row.details,
    status: legacyStatus,
    dbStatus: row.status,
    reviewedBy: row.reviewed_by || undefined,
    adminNotes: row.admin_notes || undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapDbSupportMessageToModel(row: DbSupportMessageRow): SupportMessageModel {
  return {
    id: row.id,
    userId: row.user_id,
    senderName: row.sender_name,
    senderEmail: row.sender_email,
    senderPhone: row.sender_phone,
    subject: row.subject,
    message: row.message,
    status: row.status,
    priority: row.priority,
    adminReply: row.admin_reply || undefined,
    repliedAt: row.replied_at || undefined,
    createdAt: row.created_at,
  };
}

export function mapContactFormToSupportInsert(input: {
  userId: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  subject: string;
  message: string;
}): {
  user_id: string;
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  subject: string;
  message: string;
} {
  return {
    user_id: input.userId,
    sender_name: input.senderName.trim(),
    sender_email: input.senderEmail.trim(),
    sender_phone: input.senderPhone.trim(),
    subject: input.subject.trim(),
    message: input.message.trim(),
  };
}

export function mapDbCustomStickerToModel(row: DbUserCustomStickerRow): CustomStickerModel {
  return {
    id: row.id,
    imageUrl: row.image_url,
    title: row.title,
    createdAt: row.created_at,
  };
}

export function mapCustomStickerToDbInsert(input: {
  userId: string;
  imageUrl: string;
  title?: string;
  legacyId?: string;
}): Omit<DbUserCustomStickerRow, 'id' | 'created_at'> {
  return {
    legacy_id: input.legacyId || null,
    user_id: input.userId,
    image_url: input.imageUrl,
    title: (input.title || 'استيكر مخصص').trim() || 'استيكر مخصص',
  };
}
