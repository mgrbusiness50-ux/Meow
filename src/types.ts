export type PetSpecies = 'cat' | 'dog' | 'bird';
export type PetGender = 'male' | 'female';
export type VaccinationStatus = 'fully_vaccinated' | 'partially_vaccinated' | 'not_vaccinated';
export type PetStatus = 'mating' | 'adoption' | 'not_available';
export type AdoptionType = 'individual' | 'group';
export type PrivacySetting = 'public' | 'limited_until_approved' | 'private';

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
  distanceKm: number;
  healthStatus: 'ممتازة' | 'جيدة جدًا' | 'تحت المتابعة';
  vaccinationStatus: VaccinationStatus;
  personality: string[];
  healthNotes: string;
  status: PetStatus;
  
  // Adoption specific
  adoptionType?: AdoptionType;
  groupCount?: number;
  mustAdoptTogether?: boolean;
  adoptionReason?: string;

  // Owner reference & privacy
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  ownerPhone?: string;
  ownerPrivacy: PrivacySetting;
  
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
  city: string;
  privacyMode: PrivacySetting;
  showPhoneOnlyAfterApproval: boolean;
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
  senderPhone?: string;
  receiverPetId: string;
  receiverPetName: string;
  message: string;
  type: 'mating' | 'adoption';
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
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
  petId: string;
  petName: string;
  petPhoto: string;
  petType: 'mating' | 'adoption';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  ownerPrivacy: PrivacySetting;
  messages: ChatMessage[];
}

export type MainTab = 'mating' | 'adoption' | 'chat' | 'clinic' | 'store' | 'profile';

export interface FilterState {
  species?: PetSpecies | 'all';
  gender?: PetGender | 'all';
  breed?: string;
  hybridBreed?: string;
  minAgeYears?: number;
  maxAgeYears?: number;
  ageMonths?: number;
  color?: string;
  vaccinationStatus?: VaccinationStatus | 'all';
  healthStatus?: string;
  city?: string;
  area?: string;
  maxDistanceKm?: number;
  adoptionType?: 'all' | 'individual' | 'group';
  smartMatchingEnabled: boolean;
  sortBy: 'distance' | 'newest';
}

