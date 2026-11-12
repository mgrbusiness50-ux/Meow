import { state } from '../../state.ts';
import { PetStatus, PrivacySetting } from '../../types.ts';

let activeModalType: 'settings' | 'blocked' | 'contact' | 'notifications' | 'privacy' | 'terms' | null = null;
let notificationsEnabled = true;

export function renderProfileView(): string {
  const user = state.getUser();
  const pets = state.getUserPets();

  return `
    <div class="w-full max-w-md mx-auto px-4 pt-2 pb-24 flex-1">
      <div class="flex flex-col gap-4">

        <!-- 1. Profile Header Card matching Stitch aesthetic & Screenshot -->
        <div class="bg-white/90 dark:bg-[#27201B] border border-brand-peachBorder/70 dark:border-warm-darkBorder rounded-3xl p-5 shadow-card relative overflow-hidden flex flex-col items-center text-center">
          
          <!-- Avatar with Camera Button -->
          <div class="relative mb-3">
            <div class="w-28 h-28 rounded-full p-1 bg-gradient-to-tr from-brand-orange to-brand-peachBorder shadow-soft overflow-hidden">
              <img
                src="${user.avatar}"
                alt="${user.name}"
                class="w-full h-full rounded-full object-cover"
              />
            </div>
            <button
              id="change-avatar-btn"
              aria-label="تعديل الصورة"
              class="absolute bottom-0 right-1 w-8 h-8 rounded-full bg-brand-orange text-white border-2 border-white dark:border-[#27201B] flex items-center justify-center shadow-sm transition-transform cursor-pointer active:scale-90"
              type="button"
            >
              <i class="fa-solid fa-camera text-xs"></i>
            </button>
          </div>

          <!-- Name & Location -->
          <div class="flex items-center gap-1.5 mb-1">
            <h2 class="text-2xl font-black font-baloo text-brand-dark dark:text-white">${user.name}</h2>
            <button id="edit-user-info-btn" class="text-brand-orange hover:text-brand-orange/80 text-sm px-1.5 cursor-pointer active:scale-90" title="تعديل البيانات">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
          <p class="text-xs sm:text-sm font-bold text-brand-subtleGray dark:text-[#A89F91] flex items-center gap-1.5 mb-4">
            <i class="fa-solid fa-location-dot text-brand-orange text-xs"></i>
            <span>${user.city} • ${user.phone}</span>
          </p>

          <!-- Total Pets Badge (0 الحيوانات المدرجة) -->
          <div class="bg-brand-cream/60 dark:bg-[#342A24] border border-brand-peachBorder/60 dark:border-warm-darkBorder py-3 px-6 rounded-2xl flex flex-col items-center w-full max-w-xs shadow-2xs">
            <span class="text-3xl font-black font-baloo text-brand-orange">${pets.length}</span>
            <span class="text-xs sm:text-sm font-bold text-brand-dark/80 dark:text-[#D1C7BD]">الحيوانات المدرجة</span>
          </div>
        </div>

        <!-- 2. Pet Management Section -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-2">
              <span class="text-lg font-black font-baloo text-brand-dark dark:text-white">حيواناتي</span>
              <span class="px-2.5 py-0.5 rounded-full bg-brand-peachBorder/60 dark:bg-[#342A24] text-brand-dark dark:text-white text-xs font-black">${pets.length}</span>
            </div>
            <button
              id="open-add-pet-modal-btn"
              type="button"
              class="h-10 px-4 rounded-xl bg-brand-orange/15 hover:bg-brand-orange text-brand-orange hover:text-white text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer font-baloo active:scale-95"
            >
              <i class="fa-solid fa-plus text-xs"></i>
              <span>إضافة أليف +</span>
            </button>
          </div>

          <!-- Pet Cards List -->
          <div class="flex flex-col gap-3.5">
            ${
              pets.length === 0
                ? `
                <div class="bg-white/60 dark:bg-[#27201B]/80 border border-brand-peachBorder dark:border-warm-darkBorder rounded-3xl p-8 text-center text-sm font-bold text-brand-subtleGray dark:text-[#A89F91] space-y-2">
                  <span class="text-3xl block">🐾</span>
                  <p>لا توجد حيوانات مسجلة حالياً.</p>
                  <p class="text-xs text-brand-subtleGray">اضغط على زر «إضافة أليف +» لإدراج قطك أو كلبك بسهولة!</p>
                </div>
                `
                : pets
                    .map((pet) => {
                      return `
                      <div class="bg-white/95 dark:bg-[#27201B] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder rounded-3xl p-4 shadow-card flex flex-col gap-3 relative transition-all hover:shadow-soft group">
                        
                        <!-- Top Row: Clickable Area to Open Full Screen Detail Modal -->
                        <div class="flex items-center justify-between gap-3.5">
                          <div class="flex items-center gap-3.5 min-w-0 flex-1 cursor-pointer view-own-pet-detail-btn" data-pet-detail-id="${pet.id}">
                            <div class="w-20 h-20 rounded-2xl overflow-hidden bg-brand-cream dark:bg-[#342A24] flex-shrink-0 border-2 border-brand-peachBorder dark:border-warm-darkBorder shadow-sm relative group-hover:border-brand-orange transition-colors">
                              <img src="${pet.photos[0]}" alt="${pet.name}" class="w-full h-full object-cover" />
                              <span class="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.2 rounded-md font-bold">
                                ${pet.photos.length} 📸
                              </span>
                            </div>
                            <div class="flex flex-col min-w-0 gap-1 text-right">
                              <div class="flex items-center gap-2">
                                <span class="text-lg sm:text-xl font-black font-baloo text-brand-dark dark:text-white truncate hover:text-brand-orange transition">
                                  ${pet.name}
                                </span>
                                <span class="text-xs text-brand-orange">❯</span>
                              </div>
                              <span class="text-xs sm:text-sm font-bold text-brand-subtleGray dark:text-[#A89F91] truncate">
                                ${pet.breed} • ${pet.ageYears > 0 ? `${pet.ageYears} سنة` : `${pet.ageMonths} شهر`} • ${pet.color || 'أبيض'}
                              </span>
                              <div class="flex items-center gap-1.5 mt-0.5">
                                <span class="inline-block text-xs font-black px-2.5 py-0.5 rounded-lg font-baloo ${
                                  pet.status === 'mating'
                                    ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40'
                                    : pet.status === 'adoption'
                                    ? 'text-amber-800 bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40'
                                    : 'text-brand-subtleGray bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                                }">
                                  ${
                                    pet.status === 'mating'
                                      ? 'متاح للتزاوج ❤️'
                                      : pet.status === 'adoption'
                                      ? 'متاح للتبني 🏠'
                                      : 'غير معروض ⏸️'
                                  }
                                </span>
                              </div>
                            </div>
                          </div>

                          <!-- Action buttons (Edit & Delete) -->
                          <div class="flex flex-col gap-1.5 flex-shrink-0">
                            <button
                              data-edit-pet-id="${pet.id}"
                              class="edit-pet-btn h-9 px-3 rounded-xl bg-brand-orange/15 hover:bg-brand-orange text-brand-orange hover:text-white flex items-center justify-center gap-1.5 text-xs font-black transition cursor-pointer active:scale-95 font-baloo border border-brand-orange/30 shadow-2xs"
                              title="تعديل بيانات الأليف"
                              type="button"
                            >
                              <i class="fa-solid fa-pen text-[11px]"></i>
                              <span>تعديل</span>
                            </button>
                            <button
                              data-delete-pet-id="${pet.id}"
                              class="delete-pet-btn h-8 px-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1 text-xs font-bold hover:bg-rose-100 transition cursor-pointer active:scale-95"
                              title="حذف الأليف"
                              type="button"
                            >
                              <i class="fa-solid fa-trash text-[11px]"></i>
                            </button>
                          </div>
                        </div>

                        <!-- Status Switcher for Pet -->
                        <div class="grid grid-cols-3 gap-2 pt-2 border-t border-brand-peachBorder/40 dark:border-warm-darkBorder text-xs font-black font-baloo">
                          <button
                            data-pet-id="${pet.id}"
                            data-target-status="mating"
                            class="pet-status-toggle-btn py-1.5 px-2 rounded-xl transition cursor-pointer text-center ${
                              pet.status === 'mating'
                                ? 'bg-brand-orange text-white shadow-soft'
                                : 'bg-white dark:bg-[#342A24] border border-brand-peachBorder dark:border-warm-darkBorder text-brand-dark/80 dark:text-[#D1C7BD] hover:bg-brand-peachBorder/20'
                            }"
                            type="button"
                          >
                            للتزاوج ❤️
                          </button>
                          <button
                            data-pet-id="${pet.id}"
                            data-target-status="adoption"
                            class="pet-status-toggle-btn py-1.5 px-2 rounded-xl transition cursor-pointer text-center ${
                              pet.status === 'adoption'
                                ? 'bg-emerald-600 text-white shadow-soft'
                                : 'bg-white dark:bg-[#342A24] border border-brand-peachBorder dark:border-warm-darkBorder text-brand-dark/80 dark:text-[#D1C7BD] hover:bg-brand-peachBorder/20'
                            }"
                            type="button"
                          >
                            للتبني 🏠
                          </button>
                          <button
                            data-pet-id="${pet.id}"
                            data-target-status="not_available"
                            class="pet-status-toggle-btn py-1.5 px-2 rounded-xl transition cursor-pointer text-center ${
                              pet.status === 'not_available'
                                ? 'bg-brand-dark text-white'
                                : 'bg-white dark:bg-[#342A24] border border-brand-peachBorder dark:border-warm-darkBorder text-brand-dark/80 dark:text-[#D1C7BD] hover:bg-brand-peachBorder/20'
                            }"
                            type="button"
                          >
                            خاص ⏸️
                          </button>
                        </div>

                      </div>
                    `;
                    })
                    .join('')
            }
          </div>
        </div>

      </div>

      <!-- 3-Dots Smooth Sliding Side Drawer (البند 5: قائمة جانبية أنيقة تفتح بسلاسة من جانب الشاشة) -->
      ${renderProfileSideDrawer(user)}

      <!-- Sub-modals for Drawer Items -->
      ${renderActiveDrawerModal(user)}
    </div>
  `;
}

// Side Drawer: الإعدادات (Settings & Drawer opening from the right side)
function renderProfileSideDrawer(user: ReturnType<typeof state.getUser>): string {
  if (!state.isSettingsOpen()) return '';

  return `
    <div id="profile-drawer-backdrop" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-start animate-fade-in" dir="rtl">
      
      <!-- Drawer Panel sliding from right with smooth transition -->
      <div 
        id="profile-drawer-panel" 
        class="fixed top-0 bottom-0 right-0 w-80 max-w-[85vw] h-full bg-[#FFF9E9] text-[#2d221b] shadow-2xl p-5 flex flex-col justify-between overflow-y-auto border-l-2 border-brand-peachBorder transform transition-transform duration-300 translate-x-0 text-right z-50"
      >
        
        <div>
          <!-- Drawer Header: 'الإعدادات' with Gear Icon -->
          <div class="flex items-center justify-between pb-4 border-b border-brand-peachBorder/60 mb-4">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-brand-orange text-2xl">settings</span>
              <h2 class="text-xl font-black font-baloo text-brand-dark m-0">الإعدادات</h2>
            </div>
            
            <button 
              id="close-profile-drawer-btn" 
              class="w-9 h-9 rounded-full bg-brand-peachBorder/40 text-brand-dark flex items-center justify-center hover:bg-brand-orange hover:text-white transition cursor-pointer"
              aria-label="إغلاق الإعدادات"
            >
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          <!-- Drawer Items List -->
          <div class="space-y-1.5">
            
            <!-- 1. المحفوظات (Bookmarks / Saved Pets - 4 Sections: Mating, Adoption, Clinics, Store) -->
            <button 
              id="drawer-saved-pets-btn" 
              class="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-brand-peachBorder/30 transition-all cursor-pointer group text-right"
              type="button"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-red-500/15 text-red-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-heart text-base"></i>
                </div>
                <div>
                  <span class="text-sm font-black font-baloo text-brand-dark block">المحفوظات</span>
                  <span class="text-[10px] text-brand-subtleGray">الحيوانات والخدمات المحفوظة</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-500 text-xs font-black font-baloo">
                  ${state.getSavedPets().length}
                </span>
                <i class="fa-solid fa-chevron-left text-xs text-brand-subtleGray group-hover:text-brand-orange transition"></i>
              </div>
            </button>

            <!-- 2. الحسابات المحظورة -->
            <button 
              data-drawer-action="blocked" 
              class="drawer-item-btn w-full flex items-center justify-between p-3 rounded-2xl hover:bg-brand-peachBorder/30 transition-all cursor-pointer group text-right"
              type="button"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span class="material-symbols-outlined text-xl">block</span>
                </div>
                <div>
                  <span class="text-sm font-black font-baloo text-brand-dark block">الحسابات المحظورة</span>
                  <span class="text-[10px] text-brand-subtleGray">إدارة الحسابات وقائمة الحظر</span>
                </div>
              </div>
              <i class="fa-solid fa-chevron-left text-xs text-brand-subtleGray group-hover:text-brand-orange transition"></i>
            </button>

            <!-- 3. اتصل بنا (Standalone View Trigger) -->
            <button 
              id="drawer-contact-us-btn" 
              class="w-full flex items-center justify-between p-3 rounded-2xl hover:bg-brand-peachBorder/30 transition-all cursor-pointer group text-right"
              type="button"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span class="material-symbols-outlined text-xl">call</span>
                </div>
                <div>
                  <span class="text-sm font-black font-baloo text-brand-dark block">اتصل بنا</span>
                  <span class="text-[10px] text-brand-subtleGray">الدعم الفني واستفسارات المستخدمين</span>
                </div>
              </div>
              <i class="fa-solid fa-chevron-left text-xs text-brand-subtleGray group-hover:text-brand-orange transition"></i>
            </button>

            <!-- 4. الإشعارات -->
            <div class="p-3 rounded-2xl bg-white/70 border border-brand-peachBorder/60 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-xl">notifications</span>
                </div>
                <div>
                  <span class="text-sm font-black font-baloo text-brand-dark block">الإشعارات</span>
                  <span class="text-[10px] text-brand-subtleGray" id="notifications-status-text">
                    ${notificationsEnabled ? 'الإشعارات مفعلة' : 'الإشعارات متوقفة'}
                  </span>
                </div>
              </div>
              <!-- Notification Toggle Switch -->
              <button 
                id="drawer-notifications-toggle" 
                type="button" 
                class="w-12 h-6 rounded-full p-0.5 transition-colors duration-200 relative ${notificationsEnabled ? 'bg-emerald-500' : 'bg-gray-300'}"
              >
                <div class="w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${notificationsEnabled ? 'translate-x-0' : '-translate-x-6'}"></div>
              </button>
            </div>

            <!-- 5. سياسة الخصوصية -->
            <button 
              data-drawer-action="privacy" 
              class="drawer-item-btn w-full flex items-center justify-between p-3 rounded-2xl hover:bg-brand-peachBorder/30 transition-all cursor-pointer group text-right"
              type="button"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span class="material-symbols-outlined text-xl">shield</span>
                </div>
                <div>
                  <span class="text-sm font-black font-baloo text-brand-dark block">سياسة الخصوصية</span>
                  <span class="text-[10px] text-brand-subtleGray">حماية وأمان بياناتك وبيانات أليفك</span>
                </div>
              </div>
              <i class="fa-solid fa-chevron-left text-xs text-brand-subtleGray group-hover:text-brand-orange transition"></i>
            </button>

            <!-- 6. الشروط والأحكام -->
            <button 
              data-drawer-action="terms" 
              class="drawer-item-btn w-full flex items-center justify-between p-3 rounded-2xl hover:bg-brand-peachBorder/30 transition-all cursor-pointer group text-right"
              type="button"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <span class="material-symbols-outlined text-xl">description</span>
                </div>
                <div>
                  <span class="text-sm font-black font-baloo text-brand-dark block">الشروط والأحكام</span>
                  <span class="text-[10px] text-brand-subtleGray">ضوابط التزاوج والتبني والتعامل</span>
                </div>
              </div>
              <i class="fa-solid fa-chevron-left text-xs text-brand-subtleGray group-hover:text-brand-orange transition"></i>
            </button>

          </div>
        </div>

        <!-- Footer inside drawer as explicitly requested -->
        <div class="pt-4 border-t border-brand-peachBorder/40 text-center space-y-0.5">
          <p class="text-xs font-black text-brand-dark m-0 font-baloo">
            @Meow 2026
          </p>
          <span class="text-[11px] font-mono font-bold text-brand-orange block">
            الإصدار 1.2.0
          </span>
        </div>

      </div>
    </div>
  `;
}

// Sub-modals rendered when drawer items are clicked
function renderActiveDrawerModal(user: ReturnType<typeof state.getUser>): string {
  if (!activeModalType) return '';

  return `
    <div id="drawer-submodal-backdrop" class="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in" dir="rtl">
      <div class="bg-white dark:bg-[#27201B] w-full max-w-sm rounded-[32px] p-6 shadow-2xl border-2 border-brand-peachBorder dark:border-warm-darkBorder text-right space-y-4 animate-scale-up">
        
        <div class="flex items-center justify-between pb-3 border-b border-brand-peachBorder/40 dark:border-warm-darkBorder">
          <h3 class="text-lg font-black font-baloo text-brand-dark dark:text-white m-0">
            ${
              activeModalType === 'settings'
                ? 'إعدادات الحساب'
                : activeModalType === 'blocked'
                ? 'الحسابات المحظورة'
                : activeModalType === 'contact'
                ? 'اتصل بنا والدعم'
                : activeModalType === 'privacy'
                ? 'سياسة الخصوصية'
                : 'الشروط والأحكام'
            }
          </h3>
          <button id="close-drawer-submodal-btn" class="w-8 h-8 rounded-full bg-brand-peachBorder/40 dark:bg-[#342A24] flex items-center justify-center text-brand-dark dark:text-white text-xs cursor-pointer">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="text-xs font-semibold text-brand-dark/90 dark:text-[#D1C7BD] leading-relaxed space-y-2.5">
          ${
            activeModalType === 'settings'
              ? `
              <div class="space-y-2">
                <p><strong>اسم المالك:</strong> ${user.name}</p>
                <p><strong>رقم الهاتف:</strong> ${user.phone}</p>
                <p><strong>المحافظة / المدينة:</strong> ${user.city}</p>
                <p><strong>وضع الخصوصية:</strong> إخفاء الرقم حتى الموافقة المتبادلة</p>
              </div>
              `
              : activeModalType === 'blocked'
              ? `
              <div class="text-center py-4 space-y-2">
                <span class="text-3xl block">🛡️</span>
                <p class="font-bold">لا توجد حسابات محظورة حالياً.</p>
                <p class="text-[11px] text-brand-subtleGray">يمكنك حظر أي مستخدم مباشرة من المحادثة إذا لزم الأمر.</p>
              </div>
              `
              : activeModalType === 'contact'
              ? `
              <div class="space-y-2">
                <p>يسعدنا تواصلكم دائماً لمساعدتكم وتقديم أفضل تجربة لأليفك:</p>
                <div class="p-3 rounded-2xl bg-brand-cream/60 dark:bg-[#342A24] space-y-1 font-mono text-xs" dir="ltr">
                  <p><strong>Email:</strong> support@meow-app.com</p>
                  <p><strong>Phone:</strong> +20 10 1234 5678</p>
                  <p><strong>WhatsApp:</strong> +20 10 9876 5432</p>
                </div>
              </div>
              `
              : activeModalType === 'privacy'
              ? `
              <div class="space-y-1.5 max-h-56 overflow-y-auto pl-1">
                <p><strong>1. سرية بيانات التواصل:</strong> لا يتم كشف رقم هاتفك أو وسيلة الاتصال الشخصية إلا بعد موافقة الطرفين على طلب التزاوج أو التبني.</p>
                <p><strong>2. صور الحيوانات:</strong> كافة الصور المرفوعة ملك لأصحابها وتستخدم حصراً داخل التطبيق.</p>
                <p><strong>3. الأمان والمصداقية:</strong> يلتزم كل مستخدم بصحة بيانات أليفه وحالته التطعيمية.</p>
              </div>
              `
              : `
              <div class="space-y-1.5 max-h-56 overflow-y-auto pl-1">
                <p><strong>1. التبني الخيري:</strong> التبني على منصة Meow لوجه الله ودون أي مقابل مالي.</p>
                <p><strong>2. رعاية الحيوان:</strong> التعهد بتوفير العناية الصحية والبيئة الآمنة للحيوان.</p>
                <p><strong>3. الاحترام المتبادل:</strong> الالتزام بالآداب والأخلاق في المحادثات والتواصل.</p>
              </div>
              `
          }
        </div>

        <button 
          id="confirm-drawer-submodal-btn" 
          type="button" 
          class="w-full h-11 rounded-xl bg-brand-orange text-white font-black text-xs shadow-soft cursor-pointer font-baloo"
        >
          حسناً
        </button>

      </div>
    </div>
  `;
}

export function attachProfileEvents(): void {
  // Add Pet Button
  const openAddPetBtn = document.getElementById('open-add-pet-modal-btn');
  if (openAddPetBtn) {
    openAddPetBtn.addEventListener('click', () => {
      state.setAddPetModalVisible(true, null);
    });
  }

  // Edit Pet Buttons
  const editPetBtns = document.querySelectorAll<HTMLButtonElement>('.edit-pet-btn');
  editPetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const petId = btn.getAttribute('data-edit-pet-id');
      const pet = state.getUserPets().find((p) => p.id === petId);
      if (pet) {
        state.setAddPetModalVisible(true, pet);
      }
    });
  });

  // Delete Pet Buttons
  const deletePetBtns = document.querySelectorAll<HTMLButtonElement>('.delete-pet-btn');
  deletePetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const petId = btn.getAttribute('data-delete-pet-id');
      if (petId) {
        state.deletePet(petId);
      }
    });
  });

  // Pet Status Toggle
  const statusToggleBtns = document.querySelectorAll<HTMLButtonElement>('.pet-status-toggle-btn');
  statusToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const petId = btn.getAttribute('data-pet-id');
      const targetStatus = btn.getAttribute('data-target-status') as PetStatus;
      if (petId && targetStatus) {
        state.setPetStatus(petId, targetStatus);
      }
    });
  });

  // View Own Pet Detail
  const viewOwnDetailBtns = document.querySelectorAll<HTMLElement>('.view-own-pet-detail-btn');
  viewOwnDetailBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const petId = btn.getAttribute('data-pet-detail-id');
      const pet = state.getUserPets().find((p) => p.id === petId);
      if (pet) {
        state.setSelectedPetForDetail(pet);
      }
    });
  });

  // Settings Drawer Opening/Closing
  const profileMenuBtn = document.getElementById('profile-menu-dots-btn');
  const closeDrawerBtn = document.getElementById('close-profile-drawer-btn');
  const drawerBackdrop = document.getElementById('profile-drawer-backdrop');

  if (profileMenuBtn) {
    profileMenuBtn.addEventListener('click', () => {
      state.setSettingsOpen(true);
    });
  }

  const closeDrawer = () => {
    state.setSettingsOpen(false);
  };

  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) closeDrawer();
    });
  }

  // Notifications Toggle in Drawer
  const notificationsToggle = document.getElementById('drawer-notifications-toggle');
  if (notificationsToggle) {
    notificationsToggle.addEventListener('click', () => {
      notificationsEnabled = !notificationsEnabled;
      const statusText = document.getElementById('notifications-status-text');
      if (statusText) {
        statusText.innerText = notificationsEnabled ? 'الإشعارات مفعلة' : 'الإشعارات متوقفة';
      }
      notificationsToggle.className = `w-12 h-6 rounded-full p-0.5 transition-colors duration-200 relative ${
        notificationsEnabled ? 'bg-emerald-500' : 'bg-gray-300'
      }`;
      const knob = notificationsToggle.querySelector('div');
      if (knob) {
        knob.className = `w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${
          notificationsEnabled ? 'translate-x-0' : '-translate-x-6'
        }`;
      }
    });
  }

  // Saved Pets Button in Drawer
  const savedPetsBtn = document.getElementById('drawer-saved-pets-btn');
  if (savedPetsBtn) {
    savedPetsBtn.addEventListener('click', () => {
      state.setSettingsOpen(false);
      state.openSavedPetsView();
    });
  }

  // Contact Us Button in Drawer (Opens Standalone View matching اتصل بنا.jpeg)
  const contactUsBtn = document.getElementById('drawer-contact-us-btn');
  if (contactUsBtn) {
    contactUsBtn.addEventListener('click', () => {
      state.setSettingsOpen(false);
      state.openContactView();
    });
  }

  // Drawer Action Items (Blocked, Privacy, Terms)
  const drawerActionBtns = document.querySelectorAll<HTMLButtonElement>('[data-drawer-action]');
  drawerActionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-drawer-action') as any;
      if (action) {
        activeModalType = action;
        state.setCurrentTab('profile');
      }
    });
  });

  // Close Sub-modal
  const closeSubmodalBtn = document.getElementById('close-drawer-submodal-btn');
  const confirmSubmodalBtn = document.getElementById('confirm-drawer-submodal-btn');
  const submodalBackdrop = document.getElementById('drawer-submodal-backdrop');

  const closeSubmodal = () => {
    activeModalType = null;
    state.setCurrentTab('profile');
  };

  if (closeSubmodalBtn) closeSubmodalBtn.addEventListener('click', closeSubmodal);
  if (confirmSubmodalBtn) confirmSubmodalBtn.addEventListener('click', closeSubmodal);
  if (submodalBackdrop) {
    submodalBackdrop.addEventListener('click', (e) => {
      if (e.target === submodalBackdrop) closeSubmodal();
    });
  }

  // Edit User Info Quick Trigger
  const editUserBtn = document.getElementById('edit-user-info-btn');
  if (editUserBtn) {
    editUserBtn.addEventListener('click', () => {
      const current = state.getUser();
      const newName = current.name === 'Mohamed Gamil' ? 'Mohamed Gamil (مربي معتمد)' : 'Mohamed Gamil';
      state.updateUserInfo(newName, current.city, current.phone);
    });
  }
}
