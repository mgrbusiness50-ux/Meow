export type PetSpecies = 'cat' | 'dog';
export type PetGender = 'male' | 'female';
export type VaccinationStatus = 'fully_vaccinated' | 'partially_vaccinated' | 'not_vaccinated';
export type PetStatus = 'mating' | 'adoption' | 'not_available';
export type AdoptionType = 'individual' | 'group';
export type AdoptionPublishMode = 'group_only' | 'separate' | 'both';
export type PrivacySetting = 'public' | 'private';

export interface GroupAdoptionMember {
  petId: string;
  name: string;
  species: PetSpecies;
  breed: string;
  hybridBreed?: string;
  ageYears: number;
  ageMonths: number;
  color: string;
  gender: PetGender;
  vaccinationStatus: VaccinationStatus;
  personality: string[];
  healthNotes: string;
  individualPhotos: string[];
}

export interface GroupPhotoItem {
  url: string;
  kind: 'individual' | 'collective';
  petId?: string;
  petName?: string;
  label: string;
}

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  hybridBreed?: string;
  ageYears: number;
  ageMonths: number;
  color: string;
  gender: PetGender;
  photos: string[];
  area: string;
  city: string;
  governorate?: string;
  markaz?: string;
  village?: string;
  locationId?: string;
  governorateId?: string;
  markazId?: string;
  cityId?: string;
  villageId?: string;
  lat?: number;
  lng?: number;
  distanceKm: number;
  healthStatus: 'ممتازة' | 'جيدة جدًا' | 'تحت المتابعة';
  vaccinationStatus: VaccinationStatus;
  personality: string[];
  healthNotes: string;
  status: PetStatus;
  
  // Adoption specific
  adoptionType?: AdoptionType;
  alsoListedIndividually?: boolean;
  groupCount?: number;
  mustAdoptTogether?: boolean;
  adoptionReason?: string;
  groupPetIds?: string[];
  groupMembers?: GroupAdoptionMember[];
  sharedGroupPhotos?: string[];
  photoEntries?: GroupPhotoItem[];

  // Owner reference & privacy
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerPhone?: string;
  ownerPrivacy: PrivacySetting;
  ownerShowPhone?: boolean;
  
  createdAt: string;
  compatibilityScore?: number;
  compatibilityReasons?: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  gender?: 'male' | 'female';
  city: string;
  governorate?: string;
  markaz?: string;
  village?: string;
  locationId?: string;
  governorateId?: string;
  markazId?: string;
  cityId?: string;
  villageId?: string;
  lat?: number;
  lng?: number;
  privacyMode: PrivacySetting;
  showPhoneOnlyAfterApproval: boolean;
  showPhoneInProfile: boolean;
  notificationsEnabled?: boolean;
}

export interface HealthRecordItem {
  id: string;
  petId: string;
  title: string;
  type: 'vaccine' | 'checkup' | 'treatment' | 'deworming';
  date: string;
  nextDueDate?: string;
  clinicName?: string;
  notes?: string;
  completed: boolean;
}

export interface ContactRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderPetId?: string;
  senderPetName?: string;
  senderPet?: Pet;
  senderPhone?: string;
  senderShowPhone?: boolean;
  receiverOwnerId?: string;
  receiverPetId: string;
  receiverPetName: string;
  receiverPet?: Pet;
  message: string;
  type: 'mating' | 'adoption';
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
  celebrated?: boolean;
}

export type AppNotificationType =
  | 'contact_request'
  | 'mating_approved'
  | 'adoption_approved'
  | 'new_message'
  | 'system';

export interface AppNotification {
  id: string;
  type: AppNotificationType;
  title: string;
  body: string;
  read: boolean;
  celebrated?: boolean;
  targetTab: MainTab;
  targetSubTab?: 'chats' | 'requests';
  targetRequestId?: string;
  targetConversationId?: string;
  targetPetId?: string;
  createdAt: string;
  timestampLabel: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  text?: string;
  type?: 'text' | 'image' | 'file' | 'audio' | 'sticker';
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  audioDuration?: number;
  audioBlobUrl?: string;
  stickerUrl?: string;
  stickerEmoji?: string;
  stickerTitle?: string;
  timestamp: string;
  isFromUser: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  requestId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserAvatar: string;
  otherUserPhone?: string;
  otherUserShowPhone?: boolean;
  petId: string;
  petName: string;
  petPhoto: string;
  petType: 'mating' | 'adoption';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  ownerPrivacy: PrivacySetting;
  messages: ChatMessage[];
  isPinned?: boolean;
  pinnedAt?: number;
  updatedAt?: number;
  adoptionType?: AdoptionType;
  groupCount?: number;
  mustAdoptTogether?: boolean;
  adoptionReason?: string;
  petLocation?: string;
  groupMembers?: GroupAdoptionMember[];
  sharedGroupPhotos?: string[];
  photoEntries?: GroupPhotoItem[];
}

export type MainTab = 'mating' | 'adoption' | 'chat' | 'clinic' | 'store' | 'profile';

export interface BlockedUser {
  userId: string;
  userName: string;
  userAvatar?: string;
  petName?: string;
  blockedAt: string;
}

export interface PendingBlockTarget {
  userId: string;
  userName: string;
  userAvatar?: string;
  petName?: string;
}

export type ReportReason =
  | 'inappropriate_content'
  | 'fraud_or_misleading'
  | 'unsafe_animal_care'
  | 'spam_or_harassment'
  | 'other';

export type ReportStatus = 'pending_review';

export interface ReportRecord {
  id: string;
  targetUserId: string;
  targetUserName: string;
  targetType: 'pet' | 'chat' | 'request';
  petId?: string;
  petName?: string;
  conversationId?: string;
  reason: ReportReason;
  reasonLabel: string;
  details: string;
  status: ReportStatus;
  createdAt: string;
}

export interface PendingReportTarget {
  targetUserId: string;
  targetUserName: string;
  targetUserAvatar?: string;
  targetType: 'pet' | 'chat' | 'request';
  petId?: string;
  petName?: string;
  conversationId?: string;
}

export interface FilterState {
  species?: PetSpecies | 'all';
  gender?: PetGender | 'all';
  breed?: string;
  hybridBreed?: string;
  ageYears?: number;
  minAgeYears?: number;
  maxAgeYears?: number;
  ageMonths?: number;
  color?: string;
  vaccinationStatus?: VaccinationStatus | 'all';
  healthStatus?: string;
  governorate?: string;
  markaz?: string;
  city?: string;
  area?: string;
  village?: string;
  locationId?: string;
  governorateId?: string;
  markazId?: string;
  cityId?: string;
  villageId?: string;
  maxDistanceKm?: number;
  adoptionType?: 'all' | 'individual' | 'group';
  smartMatchingEnabled: boolean;
  recommendedMatchEnabled?: boolean;
  recommendedForPetId?: string;
  sortBy: 'distance' | 'newest' | 'recommended';
}
