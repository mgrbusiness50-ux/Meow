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
} from './types.ts';
import {
  CURRENT_USER,
  INITIAL_USER_PETS,
  INITIAL_MATING_PETS,
  INITIAL_ADOPTION_PETS,
  INITIAL_HEALTH_RECORDS,
} from './mockData.ts';

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
  private user: UserProfile = { ...CURRENT_USER };
  private userPets: Pet[] = [...INITIAL_USER_PETS];
  private matingPets: Pet[] = [...INITIAL_MATING_PETS];
  private adoptionPets: Pet[] = [...INITIAL_ADOPTION_PETS];
  private contactRequests: ContactRequest[] = [];
  // 1. CHAT EMPTY BY DEFAULT AS REQUESTED ("والشات سيبه فاضي زي ما شفته في استيتش")
  private conversations: Conversation[] = [];
  private healthRecords: HealthRecordItem[] = [...INITIAL_HEALTH_RECORDS];

  private currentTab: MainTab = 'mating';
  private selectedPetForDetail: Pet | null = null;
  private selectedPetForRequest: Pet | null = null;
  private activeConversationId: string | null = null;
  private isAddPetModalOpen: boolean = false;
  private editingPet: Pet | null = null;
  private isFilterModalOpen: boolean = false;
  private isAdviceDismissed: boolean =
    typeof window !== 'undefined'
      ? localStorage.getItem('meow_advice_dismissed') === 'true'
      : false;

  // 2. SETTINGS DRAWER / SIDEBAR STATE
  private isSettingsDrawerOpen: boolean = false;

  // 3. SAVED PETS STATE (Heart Save Button)
  private savedPetIds: Set<string> = new Set(
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('meow_saved_pets') || '[]')
      : []
  );
  private isSavedPetsOpen: boolean = false;
  private savedPetsSubTab: 'mating' | 'adoption' | 'clinics' | 'store' = 'mating';

  // 3.1 CONTACT VIEW STATE
  private isContactViewOpen: boolean = false;

  // 4. ONBOARDING SEQUENCE STATE ("وخطوات التسجيل انت تجاهلتها انار رافعلك الصفحات بالترتيب")
  private onboardingStep: OnboardingStep =
    typeof window !== 'undefined' && localStorage.getItem('meow_onboarding_done') === 'true'
      ? 'completed'
      : 'splash';

  // Filters (Default sortBy to 'newest' as requested)
  private matingFilters: FilterState = {
    species: 'all',
    gender: 'all',
    breed: '',
    hybridBreed: '',
    minAgeYears: 0,
    maxAgeYears: 10,
    color: '',
    vaccinationStatus: 'all',
    healthStatus: '',
    city: '',
    maxDistanceKm: 100,
    smartMatchingEnabled: true,
    sortBy: 'newest',
  };

  private adoptionFilters: FilterState = {
    species: 'all',
    gender: 'all',
    breed: '',
    hybridBreed: '',
    minAgeYears: 0,
    maxAgeYears: 10,
    color: '',
    vaccinationStatus: 'all',
    healthStatus: '',
    city: '',
    maxDistanceKm: 150,
    adoptionType: 'all',
    smartMatchingEnabled: true,
    sortBy: 'newest',
  };

  private listeners: Set<Listener> = new Set();

  constructor() {
    this.recalculateAllCompatibilities();
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark');
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('meow_dark_mode');
      }
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

  // Settings Drawer / Sidebar Visibility
  public isSettingsOpen(): boolean {
    return this.isSettingsDrawerOpen;
  }

  public setSettingsOpen(open: boolean): void {
    this.isSettingsDrawerOpen = open;
    this.notify();
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
  public getOnboardingStep(): OnboardingStep {
    return this.onboardingStep;
  }

  public setOnboardingStep(step: OnboardingStep): void {
    this.onboardingStep = step;
    if (step === 'completed' && typeof localStorage !== 'undefined') {
      localStorage.setItem('meow_onboarding_done', 'true');
    }
    this.notify();
  }

  public restartOnboarding(): void {
    this.onboardingStep = 'splash';
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('meow_onboarding_done');
    }
    this.notify();
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

  public setCurrentTab(tab: MainTab): void {
    this.currentTab = tab;
    this.notify();
  }

  public getUser(): UserProfile {
    return this.user;
  }

  public getUserPets(): Pet[] {
    return this.userPets;
  }

  public getPrimaryUserMatingPet(): Pet | undefined {
    return this.userPets.find((p) => p.status === 'mating');
  }

  public getMatingFilters(): FilterState {
    return this.matingFilters;
  }

  public setMatingFilters(filters: Partial<FilterState>): void {
    this.matingFilters = { ...this.matingFilters, ...filters };
    this.notify();
  }

  public getAdoptionFilters(): FilterState {
    return this.adoptionFilters;
  }

  public setAdoptionFilters(filters: Partial<FilterState>): void {
    this.adoptionFilters = { ...this.adoptionFilters, ...filters };
    this.notify();
  }

  public getSelectedPetForDetail(): Pet | null {
    return this.selectedPetForDetail;
  }

  public setSelectedPetForDetail(pet: Pet | null): void {
    this.selectedPetForDetail = pet;
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
    return this.contactRequests;
  }

  public getPendingRequestsCount(): number {
    return this.contactRequests.filter((r) => r.status === 'pending').length;
  }

  public getConversations(): Conversation[] {
    return this.conversations;
  }

  public getActiveConversation(): Conversation | null {
    if (!this.activeConversationId) return null;
    return this.conversations.find((c) => c.id === this.activeConversationId) || null;
  }

  public setActiveConversationId(id: string | null): void {
    this.activeConversationId = id;
    if (id) {
      const conv = this.conversations.find((c) => c.id === id);
      if (conv) conv.unreadCount = 0;
    }
    this.notify();
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

  // Smart Compatibility Algorithm
  public calculateCompatibility(targetPet: Pet, userPet?: Pet): { score: number; reasons: string[] } {
    if (!userPet) {
      return { score: 75, reasons: ['تقييم عام بناءً على المعايير الصحية والموقع الجغرافي'] };
    }

    let score = 30; // base score
    const reasons: string[] = [];

    // 1. Gender check (Mating needs opposite gender)
    if (targetPet.status === 'mating') {
      if (targetPet.gender !== userPet.gender) {
        score += 35;
        reasons.push(`توافق جنسي مثالي (${userPet.gender === 'male' ? 'ذكر مع أنثى' : 'أنثى مع ذكر'})`);
      } else {
        score -= 20;
        reasons.push(`تنبيه: كلاهما من نفس الجنس (${userPet.gender === 'male' ? 'ذكر' : 'أنثى'})`);
      }
    } else {
      score += 20;
    }

    // 2. Species check
    if (targetPet.species === userPet.species) {
      score += 15;
    }

    // 3. Breed affinity
    const breed1 = userPet.breed.toLowerCase();
    const breed2 = targetPet.breed.toLowerCase();
    if (breed1.includes('شيرازي') && breed2.includes('شيرازي')) {
      score += 20;
      reasons.push('تطابق سلالة الشيرازي الأصيلة');
    } else if (breed1.includes('بريطاني') && breed2.includes('بريطاني')) {
      score += 20;
      reasons.push('تطابق سلالة البريطاني قصير الشعر');
    } else if (breed1.includes('هيمالايا') && (breed2.includes('شيرازي') || breed2.includes('هيمالايا'))) {
      score += 18;
      reasons.push('توافق جينات ونقاء فصائل الهيمالايا والشيرازي');
    } else {
      score += 10;
      reasons.push('سلالات متقاربة الحجم والبنية الجسدية');
    }

    // 4. Age compatibility (ideally 1.5 - 4 years)
    const ageDiff = Math.abs(targetPet.ageYears - userPet.ageYears);
    if (ageDiff <= 1) {
      score += 10;
      reasons.push('عمر متقارب ومثالي للتزاوج');
    } else if (ageDiff <= 2) {
      score += 5;
    }

    // 5. Health & Vaccination
    if (targetPet.vaccinationStatus === 'fully_vaccinated' && userPet.vaccinationStatus === 'fully_vaccinated') {
      score += 10;
      reasons.push('تطعيمات مكتملة وسجلات صحية خالية من الأمراض');
    }

    // 6. Geographic proximity
    if (targetPet.distanceKm <= 10) {
      score += 10;
      reasons.push(`قرب جغرافي ممتاز (${targetPet.distanceKm} كم)`);
    } else if (targetPet.distanceKm <= 30) {
      score += 5;
      reasons.push(`مسافة ملائمة في نفس المدينة (${targetPet.distanceKm} كم)`);
    }

    // Clamp score 15 - 99
    score = Math.max(15, Math.min(99, score));
    return { score, reasons };
  }

  private recalculateAllCompatibilities(): void {
    const primaryPet = this.getPrimaryUserMatingPet() || this.userPets[0];

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

  // Filtered Lists
  public getFilteredMatingPets(): Pet[] {
    const all = [...this.matingPets];
    
    this.userPets.forEach((up) => {
      if (up.status === 'mating' && !all.some((p) => p.id === up.id)) {
        all.push(up);
      }
    });

    let results = all.filter((pet) => {
      if (pet.status !== 'mating') return false;
      const f = this.matingFilters;

      // Species
      if (f.species && f.species !== 'all' && pet.species !== f.species) return false;

      // Gender
      if (f.gender && f.gender !== 'all' && pet.gender !== f.gender) return false;

      // Breed query
      if (f.breed && f.breed.trim() !== '') {
        if (!pet.breed.toLowerCase().includes(f.breed.toLowerCase().trim())) return false;
      }

      // Color query
      if (f.color && f.color.trim() !== '') {
        if (!pet.color.toLowerCase().includes(f.color.toLowerCase().trim())) return false;
      }

      // City
      if (f.city && f.city.trim() !== '') {
        if (!pet.city.includes(f.city.trim()) && !pet.area.includes(f.city.trim())) return false;
      }

      // Health
      if (f.healthStatus && f.healthStatus !== '' && pet.healthStatus !== f.healthStatus) return false;

      // Distance
      if (f.maxDistanceKm && pet.distanceKm > f.maxDistanceKm) return false;

      // Age
      if (f.minAgeYears !== undefined && pet.ageYears < f.minAgeYears) return false;
      if (f.maxAgeYears !== undefined && pet.ageYears > f.maxAgeYears) return false;

      return true;
    });

    // Sort results (default newest)
    if (this.matingFilters.sortBy === 'distance') {
      results.sort((a, b) => a.distanceKm - b.distanceKm);
    } else {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return results;
  }

  public getFilteredAdoptionPets(): Pet[] {
    const all = [...this.adoptionPets];
    
    this.userPets.forEach((up) => {
      if (up.status === 'adoption' && !all.some((p) => p.id === up.id)) {
        all.push(up);
      }
    });

    let results = all.filter((pet) => {
      if (pet.status !== 'adoption') return false;
      const f = this.adoptionFilters;

      // Adoption type (individual vs group)
      if (f.adoptionType && f.adoptionType !== 'all') {
        if (pet.adoptionType !== f.adoptionType) return false;
      }

      // Species
      if (f.species && f.species !== 'all' && pet.species !== f.species) return false;

      // Gender
      if (f.gender && f.gender !== 'all' && pet.gender !== f.gender) return false;

      // Breed
      if (f.breed && f.breed.trim() !== '') {
        if (!pet.breed.toLowerCase().includes(f.breed.toLowerCase().trim())) return false;
      }

      // City
      if (f.city && f.city.trim() !== '') {
        if (!pet.city.includes(f.city.trim()) && !pet.area.includes(f.city.trim())) return false;
      }

      // Max Distance
      if (f.maxDistanceKm && pet.distanceKm > f.maxDistanceKm) return false;

      return true;
    });

    if (this.adoptionFilters.sortBy === 'distance') {
      results.sort((a, b) => a.distanceKm - b.distanceKm);
    } else {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return results;
  }

  // Actions
  public savePet(petData: Partial<Pet>): Pet {
    if (this.editingPet) {
      const index = this.userPets.findIndex((p) => p.id === this.editingPet!.id);
      if (index !== -1) {
        this.userPets[index] = { ...this.userPets[index], ...petData } as Pet;
      }
      this.editingPet = null;
    } else {
      const newPet: Pet = {
        id: `user_pet_${Date.now()}`,
        name: petData.name || 'أليف جديد',
        species: petData.species || 'cat',
        breed: petData.breed || 'سلالة مختلطة',
        ageYears: petData.ageYears || 1,
        ageMonths: petData.ageMonths || 0,
        color: petData.color || 'أبيض',
        gender: petData.gender || 'male',
        photos: petData.photos && petData.photos.length > 0 ? petData.photos : [
          'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=800&q=80',
        ],
        area: petData.area || 'الرياض',
        city: petData.city || 'الرياض',
        distanceKm: 0,
        healthStatus: petData.healthStatus || 'ممتازة',
        vaccinationStatus: petData.vaccinationStatus || 'fully_vaccinated',
        personality: petData.personality || ['أليف', 'هادئ'],
        healthNotes: petData.healthNotes || 'تم الفحص الدوري ودفتر التطعيمات متوفر.',
        status: petData.status || 'mating',
        ownerId: this.user.id,
        ownerName: this.user.name,
        ownerAvatar: this.user.avatar,
        ownerPhone: this.user.phone,
        ownerPrivacy: this.user.privacyMode,
        createdAt: new Date().toISOString().split('T')[0],
      };
      this.userPets.push(newPet);
    }

    this.recalculateAllCompatibilities();
    this.isAddPetModalOpen = false;
    this.notify();
    return this.userPets[this.userPets.length - 1];
  }

  public deletePet(petId: string): void {
    this.userPets = this.userPets.filter((p) => p.id !== petId);
    this.recalculateAllCompatibilities();
    this.notify();
  }

  public setPetStatus(petId: string, status: PetStatus): void {
    const pet = this.userPets.find((p) => p.id === petId);
    if (pet) {
      pet.status = status;
      this.recalculateAllCompatibilities();
      this.notify();
    }
  }

  public updatePrivacyMode(mode: PrivacySetting): void {
    this.user.privacyMode = mode;
    this.userPets.forEach((p) => {
      p.ownerPrivacy = mode;
    });
    this.notify();
  }

  public updateUserInfo(name: string, city: string, phone: string, gender?: 'male' | 'female'): void {
    this.user.name = name;
    this.user.city = city;
    this.user.phone = phone;
    this.notify();
  }

  // Communication & Requests
  public sendContactRequest(targetPet: Pet, message: string, selectedUserPetId?: string): ContactRequest {
    const userPet = this.userPets.find((p) => p.id === selectedUserPetId) || this.userPets[0];

    const newRequest: ContactRequest = {
      id: `req_${Date.now()}`,
      senderId: this.user.id,
      senderName: this.user.name,
      senderAvatar: this.user.avatar,
      senderPetId: userPet?.id,
      senderPetName: userPet?.name,
      senderPhone: this.user.phone,
      receiverPetId: targetPet.id,
      receiverPetName: targetPet.name,
      message,
      type: targetPet.status === 'adoption' ? 'adoption' : 'mating',
      status: 'pending',
      timestamp: 'الآن',
    };

    this.contactRequests.unshift(newRequest);
    this.selectedPetForRequest = null;
    this.notify();
    return newRequest;
  }

  public approveContactRequest(requestId: string): void {
    const req = this.contactRequests.find((r) => r.id === requestId);
    if (!req) return;

    req.status = 'accepted';

    let conv = this.conversations.find((c) => c.requestId === requestId || c.otherUserId === req.senderId);
    if (!conv) {
      conv = {
        id: `conv_${Date.now()}`,
        requestId: req.id,
        otherUserId: req.senderId,
        otherUserName: req.senderName,
        otherUserAvatar: req.senderAvatar,
        otherUserPhone: req.senderPhone || '+20 10 1234 5678',
        petId: req.receiverPetId,
        petName: req.receiverPetName,
        petPhoto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
        petType: req.type,
        lastMessage: 'تمت الموافقة على طلب التواصل! يمكنكما التحدث الآن.',
        lastMessageTime: 'الآن',
        unreadCount: 0,
        ownerPrivacy: 'limited_until_approved',
        messages: [
          {
            id: `msg_sys_${Date.now()}`,
            conversationId: `conv_${Date.now()}`,
            senderId: 'system',
            senderName: 'Meow',
            text: 'تمت الموافقة على طلب التواصل بنجاح 🐾. أصبحت بيانات التواصل المباشر وإعدادات الخصوصية متاحة الآن وفق إعدادات كل طرف.',
            timestamp: 'الآن',
            isFromUser: false,
          },
          {
            id: `msg_init_${Date.now()}`,
            conversationId: `conv_${Date.now()}`,
            senderId: req.senderId,
            senderName: req.senderName,
            text: req.message,
            timestamp: req.timestamp,
            isFromUser: false,
          },
        ],
      };
      this.conversations.unshift(conv);
    }

    this.currentTab = 'chat';
    this.activeConversationId = conv.id;
    this.notify();
  }

  public rejectContactRequest(requestId: string): void {
    const req = this.contactRequests.find((r) => r.id === requestId);
    if (req) {
      req.status = 'rejected';
      this.notify();
    }
  }

  // SAVED PETS METHODS (Heart save button)
  public isPetSaved(petId: string): boolean {
    return this.savedPetIds.has(petId);
  }

  public toggleSavePet(petId: string): boolean {
    const isSaved = this.savedPetIds.has(petId);
    if (isSaved) {
      this.savedPetIds.delete(petId);
    } else {
      this.savedPetIds.add(petId);
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('meow_saved_pets', JSON.stringify(Array.from(this.savedPetIds)));
    }
    this.notify();
    return !isSaved;
  }

  public getSavedPetIds(): string[] {
    return Array.from(this.savedPetIds);
  }

  public getAllPets(): Pet[] {
    return [...this.matingPets, ...this.adoptionPets, ...this.userPets];
  }

  public getSavedPets(): Pet[] {
    return this.getAllPets().filter((p) => this.savedPetIds.has(p.id));
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

  public setSavedPetsSubTab(tab: 'mating' | 'adoption' | 'clinics' | 'store'): void {
    this.savedPetsSubTab = tab;
    this.notify();
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
    if (!conv) return;

    let newMsg: ChatMessage;

    if (typeof payload === 'string') {
      if (!payload.trim()) return;
      newMsg = {
        id: `msg_${Date.now()}`,
        conversationId: conv.id,
        senderId: this.user.id,
        senderName: this.user.name,
        text: payload.trim(),
        type: 'text',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isFromUser: true,
        status: 'delivered',
      };
    } else {
      newMsg = {
        id: `msg_${Date.now()}`,
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
        status: 'delivered',
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
    this.notify();

    // Auto reply simulation
    setTimeout(() => {
      if (this.conversations.some((c) => c.id === conv.id)) {
        const replyText =
          newMsg.type === 'sticker'
            ? 'ملصق لطيف ومميز جداً! 😻 محادثة ممتعة ومبشرة بالخير.'
            : newMsg.type === 'audio'
            ? 'سمعت رسالتك الصوتية! صوتك واضح وشاكر لاهتمامك ومحبتك للمياو 🐾.'
            : newMsg.type === 'image'
            ? 'ما شاء الله! الصورة جميلة جداً، أليف مميز ورائع 💛.'
            : 'أهلاً بك! شاكر لاهتمامك وتواصلك الراقي، أنا جاهز لأي استفسار أو لترتيب موعد المقابلة المناسبة.';

        const replyMsg: ChatMessage = {
          id: `msg_rep_${Date.now()}`,
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
        this.notify();
      }
    }, 1200);
  }

  public addHealthRecord(record: Omit<HealthRecordItem, 'id'>): void {
    const newRecord: HealthRecordItem = {
      ...record,
      id: `rec_${Date.now()}`,
    };
    this.healthRecords.unshift(newRecord);
    this.notify();
  }
}

export const state = new AppStateManager();
