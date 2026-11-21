import { state } from '../../state.ts';
import { PetStatus, PrivacySetting } from '../../types.ts';
import { attachSheetDragToDismiss, attachSwipeToCloseDrawer } from '../../utils/touchGestures.ts';

let activeModalType: 'settings' | 'blocked' | 'contact' | 'notifications' | 'privacy' | 'terms' | null = null;
let isSignOutConfirmOpen = false;
let isSigningOut = false;
let signOutErrorMessage = '';

export function renderProfileView(): string {
  const user = state.getUser();
  const pets = state.getUserPets();
  const groupListing = state.getUserGroupAdoptionListing();
  const adoptionPets = state.getUserAdoptionPets();

  return `
    <div class="w-full max-w-md mx-auto px-3.5 sm:px-4 pt-2 pb-6 flex-1 min-w-0">
      <div class="flex flex-col gap-4">

        <!-- 1. Profile Header Card -->
        <div class="bg-white/95 dark:bg-[#27201B] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder rounded-[34px] p-6 shadow-card relative overflow-hidden flex flex-col items-center text-center">
          
          <!-- Fixed Account Avatar (from email/Google, no camera upload button) -->
          <div class="relative mb-3.5">
            <div class="w-28 h-28 rounded-full p-1.5 bg-gradient-to-tr from-brand-orange to-brand-peachBorder shadow-soft overflow-hidden">
              <img
                src="${user.avatar}"
                alt="${user.name}"
                class="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>

          <!-- Name & Location -->
          <div class="flex items-center gap-2 mb-1">
            <h2 class="text-2xl font-black font-baloo text-brand-dark dark:text-white">${user.name}</h2>
            <button id="edit-user-info-btn" type="button" class="w-10 h-10 rounded-full bg-brand-orange/10 text-brand-orange hover:bg-brand-orange hover:text-white flex items-center justify-center text-sm transition cursor-pointer active:scale-90 shrink-0" title="تعديل البيانات" aria-label="تعديل بيانات المالك">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
          </div>
          <p class="text-xs sm:text-sm font-bold text-brand-subtleGray dark:text-[#A89F91] flex items-center gap-1.5 mb-4">
            <i class="fa-solid fa-location-dot text-brand-orange text-xs"></i>
            <span>${user.city} • ${user.showPhoneInProfile && user.phone ? user.phone : 'رقم الهاتف مخفي عن الآخرين'}</span>
          </p>

          <!-- Total Pets Badge -->
          <div class="bg-brand-cream/70 dark:bg-[#342A24] border-2 border-brand-peachBorder/70 dark:border-warm-darkBorder py-3.5 px-7 rounded-[28px] flex flex-col items-center w-full max-w-xs shadow-sm">
            <span class="text-3xl font-black font-baloo text-brand-orange">${pets.length}</span>
            <span class="text-xs sm:text-sm font-bold text-brand-dark/80 dark:text-[#D1C7BD]">حيواناتي</span>
          </div>
        </div>

        <!-- 2. Pet Management Section -->
        <div class="flex flex-col gap-3.5">
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-2">
              <span class="text-xl font-black font-baloo text-brand-dark dark:text-white">حيواناتي</span>
              <span class="px-3.5 py-1 rounded-full bg-brand-peachBorder/70 dark:bg-[#342A24] text-brand-dark dark:text-white text-xs sm:text-sm font-black shadow-sm">${pets.length}</span>
            </div>
            <button
              id="open-add-pet-modal-btn"
              type="button"
              class="h-11 px-5 rounded-full bg-brand-orange hover:bg-brand-orangeHover text-white text-xs sm:text-sm font-black flex items-center gap-2 shadow-soft transition-all cursor-pointer font-baloo active:scale-95"
            >
              <i class="fa-solid fa-plus text-xs"></i>
              <span>إضافة أليف +</span>
            </button>
          </div>

          <!-- Group / Independent Adoption Management Bar (Bubble Style & Balanced Orange/Emerald) -->
          ${
            groupListing || adoptionPets.length >= 2
              ? (() => {
                  if (groupListing) {
                    const indivCount = (groupListing.photoEntries || []).filter(
                      (e) => e.kind === 'individual'
                    ).length;
                    const sharedCount = groupListing.sharedGroupPhotos?.length || 0;
                    const dualCount = pets.filter(
                      (p) =>
                        p.status === 'adoption' &&
                        groupListing.groupPetIds?.includes(p.id) &&
                        p.alsoListedIndividually
                    ).length;
                    return `
                      <div class="bg-gradient-to-br from-[#FFF9E9] via-[#fff5ea] to-white border-2 border-brand-orange/40 rounded-[34px] p-5 sm:p-6 shadow-card space-y-3.5 text-right">
                        <div class="flex items-start justify-between gap-3">
                          <div class="min-w-0 flex-1">
                            <div class="flex flex-wrap items-center gap-2">
                              <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-600 text-white text-xs font-black font-baloo shadow-sm">
                                <i class="fa-solid fa-people-roof text-[11px]"></i>
                                <span>إعلان تبنٍ جماعي نشط</span>
                              </span>
                              ${
                                dualCount > 0
                                  ? `
                                    <span class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-orange/15 border border-brand-orange/35 text-brand-orange text-xs font-black font-baloo">
                                      <i class="fa-solid fa-layer-group text-[11px]"></i>
                                      <span>+ ${dualCount} إعلانات فردية</span>
                                    </span>
                                  `
                                  : ''
                              }
                            </div>
                            <h3 class="text-base sm:text-lg font-black text-[#1a1612] mt-2 m-0 font-baloo truncate">
                              ${groupListing.name}
                            </h3>
                            <p class="text-xs font-bold text-[#786555] m-0 mt-0.5 leading-relaxed">
                              ${indivCount} صور منفصلة${sharedCount > 0 ? ` + ${sharedCount} جماعية` : ' (بدون صور جماعية)'} • ${
                                groupListing.mustAdoptTogether ? 'يُشترط التبني معاً' : 'يمكن التبني منفرداً أو معاً'
                              }
                            </p>
                          </div>
                          <button
                            id="preview-group-listing-btn"
                            type="button"
                            class="h-10 px-4 rounded-full bg-white border-2 border-brand-orange/45 text-brand-orange hover:bg-brand-orange hover:text-white text-xs sm:text-sm font-black transition cursor-pointer shrink-0 font-baloo shadow-sm active:scale-95"
                          >
                            عرض الإعلان
                          </button>
                        </div>

                        <div class="grid grid-cols-2 gap-2.5 pt-1">
                          <button
                            id="open-group-adoption-editor-btn"
                            type="button"
                            class="h-12 px-3 sm:px-4 rounded-full bg-brand-orange hover:bg-brand-orangeHover text-white text-xs sm:text-sm font-black shadow-soft transition cursor-pointer font-baloo active:scale-95 flex items-center justify-center text-center leading-tight"
                          >
                            تعديل المجموعة والصور
                          </button>
                          <button
                            id="dissolve-group-adoption-btn-profile"
                            type="button"
                            class="h-12 px-3 sm:px-4 rounded-full bg-white border-2 border-brand-peachBorder text-brand-dark hover:bg-[#fff5ea] hover:border-brand-orange text-xs sm:text-sm font-black transition cursor-pointer font-baloo active:scale-95 flex items-center justify-center shadow-sm text-center leading-tight"
                          >
                            فصل لإعلانات مستقلة
                          </button>
                        </div>
                      </div>
                    `;
                  }
                  return `
                    <div class="bg-[#fff5ea] border-2 border-brand-orange/35 rounded-[34px] p-4 sm:p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-right">
                      <div class="min-w-0">
                        <h3 class="text-sm sm:text-base font-black text-[#1a1612] m-0 font-baloo">
                          لديك ${adoptionPets.length} حيوانات معروضة للتبني بشكل مستقل
                        </h3>
                        <p class="text-xs font-bold text-[#786555] m-0 mt-1">
                          يمكنك دمجهم في إعلان تبنٍ جماعي واحد أو نشر الاثنان معاً.
                        </p>
                      </div>
                      <button
                        id="open-group-adoption-editor-btn"
                        type="button"
                        class="h-11 px-5 rounded-full bg-brand-orange hover:bg-brand-orangeHover text-white text-xs sm:text-sm font-black shrink-0 cursor-pointer transition font-baloo shadow-soft active:scale-95 self-start sm:self-auto"
                      >
                        إعداد التبني الجماعي
                      </button>
                    </div>
                  `;
                })()
              : ''
          }

          <!-- Pet Cards List (Bubble Style) -->
          <div class="flex flex-col gap-4">
            ${
              pets.length === 0
                ? `
                <div class="bg-white/75 dark:bg-[#27201B]/80 border-2 border-brand-peachBorder dark:border-warm-darkBorder rounded-[34px] p-9 text-center text-sm font-bold text-brand-subtleGray dark:text-[#A89F91] space-y-2.5 shadow-card">
                  <span class="text-4xl block">🐾</span>
                  <p class="text-base font-black text-brand-dark dark:text-white">لا توجد حيوانات مسجلة حالياً.</p>
                  <p class="text-xs sm:text-sm text-brand-subtleGray">اضغط على زر «إضافة أليف +» لإدراج قطك أو كلبك بسهولة!</p>
                </div>
                `
                : pets
                    .map((pet) => {
                      return `
                      <div class="bg-white/95 dark:bg-[#27201B] border-2 border-brand-peachBorder/80 dark:border-warm-darkBorder rounded-[34px] p-5 sm:p-6 shadow-card flex flex-col gap-4 relative transition-all hover:shadow-soft group">
                        
                        <!-- Top Row: Clickable Area to Open Full Screen Detail Modal -->
                        <div class="flex items-center justify-between gap-2.5 sm:gap-3.5">
                          <div class="flex items-center gap-3 sm:gap-3.5 min-w-0 flex-1 cursor-pointer view-own-pet-detail-btn" data-pet-detail-id="${pet.id}">
                            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-[26px] overflow-hidden bg-brand-cream dark:bg-[#342A24] flex-shrink-0 border-2 border-brand-peachBorder dark:border-warm-darkBorder shadow-sm relative group-hover:border-brand-orange transition-colors">
                              <img src="${pet.photos[0]}" alt="${pet.name}" class="w-full h-full object-cover" />
                              <span class="absolute bottom-1.5 right-1.5 bg-black/65 backdrop-blur-sm text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                                ${pet.photos.length} 📸
                              </span>
                            </div>
                            <div class="flex flex-col min-w-0 gap-1.5 text-right">
                              <div class="flex items-center gap-1.5 sm:gap-2 min-w-0">
                                <span class="text-base sm:text-xl font-black font-baloo text-brand-dark dark:text-white truncate hover:text-brand-orange transition">
                                  ${pet.name}
                                </span>
                                <button
                                  type="button"
                                  data-edit-pet-id="${pet.id}"
                                  class="edit-pet-btn w-9 h-9 rounded-full bg-brand-orange/15 hover:bg-brand-orange text-brand-orange hover:text-white flex items-center justify-center text-xs transition cursor-pointer shrink-0 border border-brand-orange/35 shadow-sm active:scale-90"
                                  title="تعديل بيانات ${pet.name}"
                                  aria-label="تعديل بيانات ${pet.name}"
                                >
                                  <i class="fa-solid fa-pen"></i>
                                </button>
                                <span class="text-xs text-brand-orange shrink-0">❯</span>
                              </div>
                              <span class="text-xs sm:text-sm font-bold text-brand-subtleGray dark:text-[#A89F91] truncate">
                                ${pet.breed} • ${pet.ageYears > 0 ? `${pet.ageYears} سنة` : `${pet.ageMonths} شهر`} • ${pet.color || 'أبيض'}
                              </span>
                              <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5">
                                <span class="inline-flex items-center text-[11px] sm:text-xs font-black px-3 sm:px-3.5 py-1 rounded-full font-baloo shadow-sm ${
                                  pet.status === 'mating'
                                    ? 'text-brand-orange bg-[#fff5ea] dark:bg-orange-950/30 border border-brand-orange/35'
                                    : pet.status === 'adoption'
                                    ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/40'
                                    : 'text-brand-subtleGray bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                                }">
                                  ${
                                    pet.status === 'mating'
                                      ? 'متاح للتزاوج ❤️'
                                      : pet.status === 'adoption'
                                      ? pet.adoptionType === 'group' && groupListing?.groupPetIds?.includes(pet.id)
                                        ? 'ضمن تبنٍ جماعي 👥'
                                        : 'متاح للتبني (ملف مستقل) 🏠'
                                      : 'غير معروض ⏸️'
                                  }
                                </span>
                                ${
                                  pet.status === 'adoption' &&
                                  pet.adoptionType === 'group' &&
                                  groupListing?.groupPetIds?.includes(pet.id) &&
                                  pet.alsoListedIndividually
                                    ? `<span class="inline-flex items-center text-[11px] font-black px-3 py-1 rounded-full font-baloo bg-[#fff5ea] text-brand-orange border border-brand-orange/35">+ إعلان فردي مستقل 🏠</span>`
                                    : ''
                                }
                              </div>
                            </div>
                          </div>

                          <!-- Action buttons (Edit & Delete - Fuller Bubble Style) -->
                          <div class="flex flex-col gap-2 flex-shrink-0">
                            <button
                              data-edit-pet-id="${pet.id}"
                              class="edit-pet-btn h-11 px-3 sm:px-4 rounded-full bg-brand-orange/15 hover:bg-brand-orange text-brand-orange hover:text-white flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-black transition cursor-pointer active:scale-95 font-baloo border-2 border-brand-orange/35 shadow-sm"
                              title="تعديل بيانات الأليف"
                              type="button"
                            >
                              <i class="fa-solid fa-pen text-xs"></i>
                              <span>تعديل</span>
                            </button>
                            <button
                              data-delete-pet-id="${pet.id}"
                              class="delete-pet-btn h-11 px-3 sm:px-4 rounded-full bg-brand-cream/90 dark:bg-[#342A24] border-2 border-brand-peachBorder text-brand-subtleGray dark:text-[#D1C7BD] flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black hover:bg-brand-peachBorder/50 hover:text-brand-dark transition cursor-pointer active:scale-95 shadow-sm"
                              title="حذف الأليف"
                              type="button"
                            >
                              <i class="fa-solid fa-trash text-xs"></i>
                              <span>حذف</span>
                            </button>
                          </div>
                        </div>

                        ${
                          pet.status === 'adoption' &&
                          pet.adoptionType === 'group' &&
                          groupListing?.groupPetIds?.includes(pet.id)
                            ? `
                              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-3 rounded-[24px] bg-brand-cream/70 border border-brand-peachBorder/80 text-xs font-bold">
                                <span class="text-[#786555] leading-snug">
                                  ${
                                    pet.alsoListedIndividually
                                      ? 'يظهر هذا الأليف في إعلان فردي مستقل بالإضافة للمجموعة.'
                                      : 'يظهر هذا الأليف ضمن الإعلان الجماعي فقط حالياً.'
                                  }
                                </span>
                                <button
                                  type="button"
                                  data-toggle-individual-pet-id="${pet.id}"
                                  data-individual-action="${pet.alsoListedIndividually ? 'stop_individual' : 'enable_individual'}"
                                  class="toggle-individual-dual-btn h-10 px-4 rounded-full bg-white border-2 border-brand-peachBorder text-[#2d221b] hover:bg-[#fff5ea] hover:border-brand-orange text-xs font-black shrink-0 cursor-pointer transition font-baloo active:scale-95 shadow-sm self-start sm:self-auto"
                                >
                                  ${pet.alsoListedIndividually ? 'إيقاف الإعلان الفردي' : 'تفعيل إعلان فردي أيضاً'}
                                </button>
                              </div>
                            `
                            : ''
                        }

                        <!-- Status Switcher for Pet (Bubble Pills) -->
                        <div class="grid grid-cols-3 gap-1.5 sm:gap-2.5 pt-3 border-t border-brand-peachBorder/50 dark:border-warm-darkBorder text-xs sm:text-sm font-black font-baloo">
                          <button
                            data-pet-id="${pet.id}"
                            data-target-status="mating"
                            class="pet-status-toggle-btn min-w-0 h-11 py-2.5 px-1.5 sm:px-3 rounded-full transition cursor-pointer text-center flex items-center justify-center truncate ${
                              pet.status === 'mating'
                                ? 'bg-brand-orange text-white shadow-soft'
                                : 'bg-white dark:bg-[#342A24] border-2 border-brand-peachBorder dark:border-warm-darkBorder text-brand-dark/85 dark:text-[#D1C7BD] hover:border-brand-orange/60 hover:bg-[#fff5ea]'
                            }"
                            type="button"
                          >
                            للتزاوج ❤️
                          </button>
                          <button
                            data-pet-id="${pet.id}"
                            data-target-status="adoption"
                            class="pet-status-toggle-btn min-w-0 h-11 py-2.5 px-1.5 sm:px-3 rounded-full transition cursor-pointer text-center flex items-center justify-center truncate ${
                              pet.status === 'adoption'
                                ? 'bg-emerald-600 text-white shadow-soft'
                                : 'bg-white dark:bg-[#342A24] border-2 border-brand-peachBorder dark:border-warm-darkBorder text-brand-dark/85 dark:text-[#D1C7BD] hover:border-emerald-500/60 hover:bg-emerald-50/40'
                            }"
                            type="button"
                          >
                            للتبني 🏠
                          </button>
                          <button
                            data-pet-id="${pet.id}"
                            data-target-status="not_available"
                            class="pet-status-toggle-btn min-w-0 h-11 py-2.5 px-1.5 sm:px-3 rounded-full transition cursor-pointer text-center flex items-center justify-center truncate ${
                              pet.status === 'not_available'
                                ? 'bg-brand-dark text-white shadow-sm'
                                : 'bg-white dark:bg-[#342A24] border-2 border-brand-peachBorder dark:border-warm-darkBorder text-brand-dark/85 dark:text-[#D1C7BD] hover:bg-brand-peachBorder/25'
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

      <!-- Confirmation Modals (Delete Pet / Status Change / Adoption Management / Sign Out) -->
      ${renderDeletePetConfirmModal()}
      ${renderStatusChangeConfirmModal()}
      ${renderAdoptionActionConfirmModal()}
      ${renderSignOutConfirmModal(user)}
    </div>
  `;
}

// Side Drawer: الإعدادات (Bubble Style strictly contained inside drawer frame)
function renderProfileSideDrawer(user: ReturnType<typeof state.getUser>): string {
  if (!state.isSettingsOpen()) return '';
  const notificationsEnabled = state.getNotificationsEnabled();
  const showPhone = state.getShowPhoneInProfile();

  return `
    <div id="profile-drawer-backdrop" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in" dir="rtl">
      <div class="w-full max-w-md mx-auto h-full relative flex justify-start pointer-events-none">
        <!-- Drawer Panel clipped cleanly to rounded bounds (no protruding bar) -->
        <div 
          id="profile-drawer-panel" 
          class="pointer-events-auto relative w-[84%] max-w-[330px] h-full max-h-[100dvh] bg-[#FFF9E9] text-[#2d221b] shadow-2xl border-l-2 border-brand-peachBorder/90 rounded-l-[32px] overflow-hidden flex flex-col transform transition-transform duration-300 translate-x-0 text-right z-50"
        >
          <!-- Subtle Edge Grip Bar inside RTL left border for Swipe-to-Close -->
          <div class="w-1 h-12 rounded-full bg-brand-peachBorder/70 absolute left-1.5 top-1/2 -translate-y-1/2 pointer-events-none z-20"></div>
          <!-- Drawer Header -->
          <div class="shrink-0 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3">
            <div class="flex items-center justify-between p-3.5 rounded-[28px] bg-white/95 border-2 border-brand-peachBorder/80 shadow-sm">
              <div class="flex items-center gap-2.5">
                <div class="w-10 h-10 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-2xl">settings</span>
                </div>
                <h2 class="text-xl font-black font-baloo text-brand-dark m-0">الإعدادات</h2>
              </div>
              
              <button 
                id="close-profile-drawer-btn" 
                class="w-10 h-10 rounded-full bg-brand-cream border-2 border-brand-peachBorder text-brand-dark flex items-center justify-center hover:bg-brand-orange hover:text-white hover:border-brand-orange transition cursor-pointer active:scale-90 shadow-sm"
                aria-label="إغلاق الإعدادات"
                type="button"
              >
                <i class="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
          </div>

          <!-- Inner Scrollable Drawer Items List (no-scrollbar avoids rectangular track protruding past corners) -->
          <div class="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar px-4 py-1 space-y-3">
            
            <!-- 1. المحفوظات -->
            <button 
              id="drawer-saved-pets-btn" 
              class="w-full flex items-center justify-between px-4 py-3.5 rounded-[28px] bg-white/95 border-2 border-brand-peachBorder/80 hover:border-brand-orange/70 hover:shadow-soft transition-all cursor-pointer group text-right shadow-sm active:scale-[0.98]"
              type="button"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-11 h-11 rounded-full bg-red-500/15 text-red-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-red-200/70">
                  <i class="fa-solid fa-heart text-base"></i>
                </div>
                <div class="min-w-0">
                  <span class="text-sm font-black font-baloo text-brand-dark block">المحفوظات</span>
                  <span class="text-[11px] font-bold text-brand-subtleGray block truncate">الحيوانات والخدمات المحفوظة</span>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <span class="px-3 py-1 rounded-full bg-red-500/15 text-red-500 text-xs font-black font-baloo">
                  ${state.getSavedPets().length}
                </span>
                <i class="fa-solid fa-chevron-left text-xs text-brand-subtleGray group-hover:text-brand-orange transition"></i>
              </div>
            </button>

            <!-- 2. الحسابات المحظورة -->
            <button 
              data-drawer-action="blocked" 
              class="drawer-item-btn w-full flex items-center justify-between px-4 py-3.5 rounded-[28px] bg-white/95 border-2 border-brand-peachBorder/80 hover:border-brand-orange/70 hover:shadow-soft transition-all cursor-pointer group text-right shadow-sm active:scale-[0.98]"
              type="button"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-11 h-11 rounded-full bg-red-500/15 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-red-200/70">
                  <span class="material-symbols-outlined text-xl">block</span>
                </div>
                <div class="min-w-0">
                  <span class="text-sm font-black font-baloo text-brand-dark block">الحسابات المحظورة</span>
                  <span class="text-[11px] font-bold text-brand-subtleGray block truncate">إدارة الحسابات وقائمة الحظر</span>
                </div>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                ${
                  state.getBlockedUsers().length > 0
                    ? `<span class="px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-black font-baloo">${state.getBlockedUsers().length}</span>`
                    : ''
                }
                <i class="fa-solid fa-chevron-left text-xs text-brand-subtleGray group-hover:text-brand-orange transition"></i>
              </div>
            </button>

            <!-- 3. اتصل بنا -->
            <button 
              id="drawer-contact-us-btn" 
              class="w-full flex items-center justify-between px-4 py-3.5 rounded-[28px] bg-white/95 border-2 border-brand-peachBorder/80 hover:border-brand-orange/70 hover:shadow-soft transition-all cursor-pointer group text-right shadow-sm active:scale-[0.98]"
              type="button"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-11 h-11 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-brand-peachBorder/80">
                  <span class="material-symbols-outlined text-xl">call</span>
                </div>
                <div class="min-w-0">
                  <span class="text-sm font-black font-baloo text-brand-dark block">اتصل بنا</span>
                  <span class="text-[11px] font-bold text-brand-subtleGray block truncate">الدعم الفني واستفسارات المستخدمين</span>
                </div>
              </div>
              <i class="fa-solid fa-chevron-left text-xs text-brand-subtleGray group-hover:text-brand-orange transition"></i>
            </button>

            <!-- 4. الإشعارات -->
            <div class="px-4 py-3.5 rounded-[28px] bg-white/95 border-2 border-brand-peachBorder/80 shadow-sm flex items-center justify-between gap-2.5">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-11 h-11 rounded-full ${notificationsEnabled ? 'bg-emerald-500/15 text-emerald-600 border-emerald-200' : 'bg-brand-orange/15 text-brand-orange border-brand-peachBorder/80'} border flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-xl">notifications</span>
                </div>
                <div class="min-w-0">
                  <span class="text-sm font-black font-baloo text-brand-dark block">الإشعارات</span>
                  <span class="text-[11px] font-bold text-brand-subtleGray block truncate" id="notifications-status-text">
                    ${notificationsEnabled ? 'الإشعارات مفعلة' : 'الإشعارات متوقفة'}
                  </span>
                </div>
              </div>
              <!-- Notification Bubble Toggle Switch -->
              <button 
                id="drawer-notifications-toggle" 
                type="button"
                role="switch"
                aria-checked="${notificationsEnabled ? 'true' : 'false'}"
                aria-label="تبديل الإشعارات"
                class="w-14 h-8 rounded-full p-1 transition-colors duration-200 relative shrink-0 cursor-pointer shadow-inner overflow-hidden ${notificationsEnabled ? 'bg-emerald-500' : 'bg-gray-300'}"
              >
                <div class="w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ${notificationsEnabled ? 'translate-x-0' : '-translate-x-6'}"></div>
              </button>
            </div>

            <!-- 4.1 الخصوصية: إظهار رقم الهاتف في الملف الشخصي (مغلق افتراضياً) -->
            <div class="pt-1.5 pb-1 space-y-2.5">
              <span class="inline-flex items-center px-3 py-1 rounded-full bg-white/90 border border-brand-peachBorder text-xs font-black text-brand-subtleGray font-baloo">
                الخصوصية
              </span>
              <div class="px-4 py-3.5 rounded-[28px] bg-white/95 border-2 border-brand-peachBorder/85 flex items-center justify-between gap-2.5 shadow-sm">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-11 h-11 rounded-full ${showPhone ? 'bg-emerald-500/15 text-emerald-600 border border-emerald-200' : 'bg-brand-orange/15 text-brand-orange border border-brand-peachBorder/80'} flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-xl">${showPhone ? 'visibility' : 'visibility_off'}</span>
                  </div>
                  <div class="min-w-0">
                    <span class="text-xs sm:text-sm font-black font-baloo text-brand-dark block leading-snug">
                      إظهار رقم الهاتف في الملف الشخصي
                    </span>
                    <span class="text-[11px] font-bold text-brand-subtleGray block leading-snug mt-0.5" id="show-phone-privacy-status-text">
                      ${
                        showPhone
                          ? 'مفعل • رقم الهاتف ظاهر في ملفات حيواناتك والمحادثات'
                          : 'مغلق افتراضياً • رقم الهاتف مخفي عن الآخرين'
                      }
                    </span>
                  </div>
                </div>
                <button
                  id="drawer-show-phone-toggle"
                  type="button"
                  role="switch"
                  aria-checked="${showPhone ? 'true' : 'false'}"
                  aria-label="إظهار رقم الهاتف في الملف الشخصي"
                  class="w-14 h-8 rounded-full p-1 transition-colors duration-200 relative shrink-0 cursor-pointer shadow-inner overflow-hidden ${
                    showPhone ? 'bg-emerald-500' : 'bg-gray-300'
                  }"
                >
                  <div class="w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-200 ${
                    showPhone ? 'translate-x-0' : '-translate-x-6'
                  }"></div>
                </button>
              </div>
            </div>

            <!-- 5. سياسة الخصوصية -->
            <button 
              data-drawer-action="privacy" 
              class="drawer-item-btn w-full flex items-center justify-between px-4 py-3.5 rounded-[28px] bg-white/95 border-2 border-brand-peachBorder/80 hover:border-brand-orange/70 hover:shadow-soft transition-all cursor-pointer group text-right shadow-sm active:scale-[0.98]"
              type="button"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-11 h-11 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-brand-peachBorder/80">
                  <span class="material-symbols-outlined text-xl">shield</span>
                </div>
                <div class="min-w-0">
                  <span class="text-sm font-black font-baloo text-brand-dark block">سياسة الخصوصية</span>
                  <span class="text-[11px] font-bold text-brand-subtleGray block truncate">حماية وأمان بياناتك وبيانات أليفك</span>
                </div>
              </div>
              <i class="fa-solid fa-chevron-left text-xs text-brand-subtleGray group-hover:text-brand-orange transition"></i>
            </button>

            <!-- 6. الشروط والأحكام -->
            <button 
              data-drawer-action="terms" 
              class="drawer-item-btn w-full flex items-center justify-between px-4 py-3.5 rounded-[28px] bg-white/95 border-2 border-brand-peachBorder/80 hover:border-brand-orange/70 hover:shadow-soft transition-all cursor-pointer group text-right shadow-sm active:scale-[0.98]"
              type="button"
            >
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-11 h-11 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-brand-peachBorder/80">
                  <span class="material-symbols-outlined text-xl">description</span>
                </div>
                <div class="min-w-0">
                  <span class="text-sm font-black font-baloo text-brand-dark block">الشروط والأحكام</span>
                  <span class="text-[11px] font-bold text-brand-subtleGray block truncate">ضوابط التزاوج والتبني والتعامل</span>
                </div>
              </div>
              <i class="fa-solid fa-chevron-left text-xs text-brand-subtleGray group-hover:text-brand-orange transition"></i>
            </button>

            <!-- Independent Section: الإنقاذ والتبرعات -->
            <div class="pt-3 pb-2 border-t-2 border-brand-peachBorder/50 space-y-2.5">
              <span class="inline-flex items-center px-3 py-1 rounded-full bg-white/90 border border-brand-peachBorder text-xs font-black text-brand-subtleGray font-baloo">
                أقسام إضافية
              </span>
              <button
                id="drawer-rescue-donations-btn"
                type="button"
                disabled
                aria-disabled="true"
                class="w-full flex items-center justify-between px-4 py-3.5 rounded-[28px] bg-white/75 border-2 border-brand-peachBorder/75 opacity-85 cursor-not-allowed text-right select-none shadow-sm"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-11 h-11 rounded-full bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0 border border-amber-200/70">
                    <i class="fa-solid fa-hand-holding-heart text-base"></i>
                  </div>
                  <div class="min-w-0">
                    <span class="text-sm font-black font-baloo text-brand-dark block truncate">الإنقاذ والتبرعات</span>
                    <span class="text-[11px] font-bold text-brand-subtleGray block truncate">مقفول حالياً • متاح قريباً</span>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <span class="px-3 py-1 rounded-full bg-brand-cream border border-brand-peachBorder text-[11px] font-black text-brand-orange font-baloo shadow-sm">
                    قريباً
                  </span>
                  <span class="text-xs text-amber-500 font-bold" aria-hidden="true">🔒</span>
                </div>
              </button>
            </div>

            <!-- 7. تسجيل الخروج -->
            <div class="pt-3 pb-2 border-t-2 border-brand-peachBorder/50">
              <button
                id="drawer-sign-out-btn"
                type="button"
                class="w-full flex items-center justify-between px-4 py-3.5 rounded-[28px] bg-white/95 border-2 border-rose-200 hover:border-rose-400 hover:bg-rose-50/50 hover:shadow-soft transition-all cursor-pointer group text-right shadow-sm active:scale-[0.98]"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-11 h-11 rounded-full bg-rose-500/15 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform border border-rose-200/80">
                    <i class="fa-solid fa-right-from-bracket text-base"></i>
                  </div>
                  <div class="min-w-0">
                    <span class="text-sm font-black font-baloo text-rose-700 block">تسجيل الخروج</span>
                    <span class="text-[11px] font-bold text-brand-subtleGray block truncate">
                      ${user.email ? user.email : 'الخروج من حسابك الحالي'}
                    </span>
                  </div>
                </div>
                <i class="fa-solid fa-chevron-left text-xs text-rose-400 group-hover:text-rose-600 transition"></i>
              </button>
            </div>
          </div>

          <!-- Footer cleanly fitted inside drawer edges -->
          <div class="shrink-0 px-4 pt-2.5 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <div class="w-full py-3 px-4 rounded-[24px] bg-white/95 border-2 border-brand-peachBorder/80 text-center flex items-center justify-between shadow-sm">
              <p class="text-xs font-black text-brand-dark m-0 font-baloo" dir="ltr">
                @Meow2026
              </p>
              <span class="text-[11px] font-mono font-bold text-brand-orange block">
                الإصدار 1.2.0
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  `;
}

// Sub-modals rendered when drawer items are clicked (Bubble Style)
function renderActiveDrawerModal(user: ReturnType<typeof state.getUser>): string {
  if (!activeModalType) return '';

  return `
    <div id="drawer-submodal-backdrop" class="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" dir="rtl">
      <div id="drawer-submodal-sheet" class="bg-[#FFF9E9] dark:bg-[#27201B] w-full max-w-sm rounded-t-[32px] rounded-b-none sm:rounded-[36px] px-5 sm:px-6 pt-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:py-6 shadow-2xl border-2 border-b-0 sm:border-b-2 border-brand-peachBorder dark:border-warm-darkBorder text-right space-y-4 animate-slide-up max-h-[88dvh] overflow-y-auto overscroll-contain">
        <div id="drawer-submodal-drag-handle" class="sm:hidden flex justify-center pb-1 touch-none cursor-grab">
          <div class="w-11 h-1.5 rounded-full bg-brand-peachBorder"></div>
        </div>
        
        <div class="flex items-center justify-between pb-3 border-b border-brand-peachBorder/50 dark:border-warm-darkBorder">
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
          <button id="close-drawer-submodal-btn" class="w-10 h-10 rounded-full bg-white border-2 border-brand-peachBorder/80 dark:bg-[#342A24] flex items-center justify-center text-brand-dark dark:text-white text-sm cursor-pointer hover:border-brand-orange hover:text-brand-orange transition active:scale-90">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="text-xs sm:text-sm font-semibold text-brand-dark/90 dark:text-[#D1C7BD] leading-relaxed space-y-3">
          ${
            activeModalType === 'settings'
              ? `
              <div class="p-4 rounded-[28px] bg-white border-2 border-brand-peachBorder/70 space-y-2 shadow-sm">
                <p><strong>اسم المالك:</strong> ${user.name}</p>
                <p><strong>رقم الهاتف:</strong> ${user.showPhoneInProfile ? user.phone : `${user.phone} (مخفي عن الآخرين)`}</p>
                <p><strong>المحافظة / المدينة:</strong> ${user.city}</p>
                <p><strong>إظهار رقم الهاتف في الملف الشخصي:</strong> ${user.showPhoneInProfile ? 'مفعل (ظاهر)' : 'مغلق افتراضياً (مخفي)'}</p>
              </div>
              `
              : activeModalType === 'blocked'
              ? (() => {
                  const blockedList = state.getBlockedUsers();
                  if (blockedList.length === 0) {
                    return `
                      <div class="text-center py-5 px-4 rounded-[28px] bg-white border-2 border-brand-peachBorder/70 space-y-2 shadow-sm">
                        <span class="text-3xl block">🛡️</span>
                        <p class="font-black text-brand-dark font-baloo">لا توجد حسابات محظورة حالياً.</p>
                        <p class="text-xs text-brand-subtleGray">يمكنك حظر أي مستخدم مباشرة من قائمة الثلاث نقاط في ملفات الحيوانات أو المحادثة.</p>
                      </div>
                    `;
                  }
                  return `
                    <div class="space-y-2.5 max-h-64 overflow-y-auto pl-1 overscroll-contain">
                      ${blockedList
                        .map(
                          (b) => `
                        <div class="flex items-center justify-between gap-2.5 p-3.5 rounded-[26px] bg-white border-2 border-brand-peachBorder/80 shadow-sm">
                          <div class="flex items-center gap-2.5 min-w-0">
                            ${
                              b.userAvatar
                                ? `<img src="${b.userAvatar}" alt="${b.userName}" class="w-11 h-11 rounded-full object-cover border-2 border-brand-peachBorder shrink-0" />`
                                : `<div class="w-11 h-11 rounded-full bg-red-500/15 text-red-600 flex items-center justify-center shrink-0"><i class="fa-solid fa-user-slash text-sm"></i></div>`
                            }
                            <div class="min-w-0 text-right">
                              <p class="text-sm font-black text-brand-dark truncate m-0 font-baloo">${b.userName}</p>
                              <span class="text-[11px] text-brand-subtleGray font-bold block">${b.petName ? `بخصوص: ${b.petName}` : `تاريخ الحظر: ${b.blockedAt}`}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            data-unblock-user-id="${b.userId}"
                            class="unblock-user-btn h-10 px-4 rounded-full bg-[#fff5ea] border-2 border-brand-orange/40 text-xs font-black text-brand-orange hover:bg-brand-orange hover:text-white transition cursor-pointer shrink-0 font-baloo active:scale-95"
                          >
                            إلغاء الحظر
                          </button>
                        </div>
                      `
                        )
                        .join('')}
                    </div>
                  `;
                })()
              : activeModalType === 'contact'
              ? `
              <div class="space-y-2.5">
                <p>يسعدنا تواصلكم دائماً لمساعدتكم وتقديم أفضل تجربة لأليفك:</p>
                <div class="p-4 rounded-[28px] bg-white border-2 border-brand-peachBorder/70 space-y-1.5 font-mono text-xs shadow-sm" dir="ltr">
                  <p><strong>Email:</strong> support@meow-app.com</p>
                  <p><strong>Phone:</strong> +20 10 1234 5678</p>
                  <p><strong>WhatsApp:</strong> +20 10 9876 5432</p>
                </div>
              </div>
              `
              : activeModalType === 'privacy'
              ? `
              <div class="p-4 rounded-[28px] bg-white border-2 border-brand-peachBorder/70 space-y-2 max-h-56 overflow-y-auto pl-1 shadow-sm">
                <p><strong>1. سرية بيانات التواصل:</strong> لا يتم كشف رقم هاتفك أو وسيلة الاتصال الشخصية إلا عند تفعيله بنفسك من إعدادات الخصوصية.</p>
                <p><strong>2. صور الحيوانات:</strong> كافة الصور المرفوعة ملك لأصحابها وتستخدم حصراً داخل التطبيق.</p>
                <p><strong>3. الأمان والمصداقية:</strong> يلتزم كل مستخدم بصحة بيانات أليفه وحالته التطعيمية.</p>
              </div>
              `
              : `
              <div class="p-4 rounded-[28px] bg-white border-2 border-brand-peachBorder/70 space-y-2 max-h-56 overflow-y-auto pl-1 shadow-sm">
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
          class="w-full h-12 rounded-full bg-brand-orange hover:bg-brand-orangeHover text-white font-black text-sm shadow-soft cursor-pointer font-baloo transition active:scale-95"
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

  // Edit Pet Buttons (supports both pencil beside pet name & Edit button)
  const editPetBtns = document.querySelectorAll<HTMLButtonElement>('.edit-pet-btn');
  editPetBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const petId = btn.getAttribute('data-edit-pet-id');
      const pet = state.getUserPets().find((p) => p.id === petId);
      if (pet) {
        state.setAddPetModalVisible(true, pet);
      }
    });
  });

  // Delete Pet Buttons (Opens confirmation modal before deleting)
  const deletePetBtns = document.querySelectorAll<HTMLButtonElement>('.delete-pet-btn');
  deletePetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const petId = btn.getAttribute('data-delete-pet-id');
      if (petId) {
        state.requestDeletePet(petId);
      }
    });
  });

  // Delete Pet Confirmation Modal Events
  const confirmDeletePetBtn = document.getElementById('confirm-delete-pet-btn');
  const cancelDeletePetBtn = document.getElementById('cancel-delete-pet-btn');
  const deletePetBackdrop = document.getElementById('delete-pet-confirm-backdrop');
  if (confirmDeletePetBtn) {
    confirmDeletePetBtn.addEventListener('click', () => state.confirmDeletePet());
  }
  if (cancelDeletePetBtn) {
    cancelDeletePetBtn.addEventListener('click', () => state.cancelDeletePet());
  }
  if (deletePetBackdrop) {
    deletePetBackdrop.addEventListener('click', (e) => {
      if (e.target === deletePetBackdrop) state.cancelDeletePet();
    });
  }

  // Pet Status Toggle (Always shows confirmation modal before applying transition)
  const statusToggleBtns = document.querySelectorAll<HTMLButtonElement>('.pet-status-toggle-btn');
  statusToggleBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const petId = btn.getAttribute('data-pet-id');
      const targetStatus = btn.getAttribute('data-target-status') as PetStatus;
      if (petId && targetStatus) {
        state.requestPetStatusChange(petId, targetStatus);
      }
    });
  });

  // Status Change Confirmation Modal Events
  const confirmStatusChangeBtn = document.getElementById('confirm-status-change-btn');
  const cancelStatusChangeBtn = document.getElementById('cancel-status-change-btn');
  const statusChangeBackdrop = document.getElementById('status-change-confirm-backdrop');
  if (confirmStatusChangeBtn) {
    confirmStatusChangeBtn.addEventListener('click', () => state.confirmPetStatusChange());
  }
  if (cancelStatusChangeBtn) {
    cancelStatusChangeBtn.addEventListener('click', () => state.cancelPetStatusChange());
  }
  if (statusChangeBackdrop) {
    statusChangeBackdrop.addEventListener('click', (e) => {
      if (e.target === statusChangeBackdrop) state.cancelPetStatusChange();
    });
  }

  // Group / Dual Adoption Management Actions inside Profile
  const openGroupEditorBtn = document.getElementById('open-group-adoption-editor-btn');
  if (openGroupEditorBtn) {
    openGroupEditorBtn.addEventListener('click', () => {
      state.openGroupAdoptionEditor();
    });
  }
  const dissolveGroupBtn = document.getElementById('dissolve-group-adoption-btn-profile');
  if (dissolveGroupBtn) {
    dissolveGroupBtn.addEventListener('click', () => {
      state.requestAdoptionActionConfirm('dissolve_group');
    });
  }
  document.querySelectorAll<HTMLButtonElement>('.toggle-individual-dual-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const petId = btn.getAttribute('data-toggle-individual-pet-id');
      const action = btn.getAttribute('data-individual-action') as
        | 'stop_individual'
        | 'enable_individual'
        | null;
      if (petId && action) {
        state.requestAdoptionActionConfirm(action, petId);
      }
    });
  });

  const confirmAdoptionActionBtn = document.getElementById('confirm-adoption-action-btn');
  const cancelAdoptionActionBtn = document.getElementById('cancel-adoption-action-btn');
  const adoptionActionBackdrop = document.getElementById('adoption-action-confirm-backdrop');
  if (confirmAdoptionActionBtn) {
    confirmAdoptionActionBtn.addEventListener('click', () => state.confirmAdoptionAction());
  }
  if (cancelAdoptionActionBtn) {
    cancelAdoptionActionBtn.addEventListener('click', () => state.cancelAdoptionActionConfirm());
  }
  if (adoptionActionBackdrop) {
    adoptionActionBackdrop.addEventListener('click', (e) => {
      if (e.target === adoptionActionBackdrop) state.cancelAdoptionActionConfirm();
    });
  }

  const previewGroupBtn = document.getElementById('preview-group-listing-btn');
  if (previewGroupBtn) {
    previewGroupBtn.addEventListener('click', () => {
      const group = state.getUserGroupAdoptionListing();
      if (group) state.setSelectedPetForDetail(group);
    });
  }

  // View Own Pet Detail (always preview individual card clearly)
  const viewOwnDetailBtns = document.querySelectorAll<HTMLElement>('.view-own-pet-detail-btn');
  viewOwnDetailBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const petId = btn.getAttribute('data-pet-detail-id');
      const pet = state.getUserPets().find((p) => p.id === petId);
      if (pet) {
        state.setSelectedPetForDetail(
          pet.status === 'adoption'
            ? {
                ...pet,
                adoptionType: 'individual',
                alsoListedIndividually: undefined,
                groupCount: undefined,
                mustAdoptTogether: undefined,
                groupPetIds: undefined,
                groupMembers: undefined,
                sharedGroupPhotos: undefined,
                photoEntries: undefined,
              }
            : pet
        );
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

  const drawerPanel = document.getElementById('profile-drawer-panel');
  if (drawerPanel) {
    attachSwipeToCloseDrawer(drawerPanel, drawerBackdrop, closeDrawer, 'right');
  }

  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      const target = e.target as HTMLElement | null;
      if (e.target === drawerBackdrop || !target?.closest('#profile-drawer-panel')) {
        closeDrawer();
      }
    });
  }

  // Notifications Toggle in Drawer (Synced to state, localStorage, browser permissions & Firestore)
  const notificationsToggle = document.getElementById('drawer-notifications-toggle');
  if (notificationsToggle) {
    notificationsToggle.addEventListener('click', () => {
      state.setNotificationsEnabled(!state.getNotificationsEnabled());
    });
  }

  // Phone Visibility Toggle in Drawer Privacy Section
  const showPhoneToggle = document.getElementById('drawer-show-phone-toggle');
  if (showPhoneToggle) {
    showPhoneToggle.addEventListener('click', () => {
      state.setShowPhoneInProfile(!state.getShowPhoneInProfile());
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
  const submodalSheet = document.getElementById('drawer-submodal-sheet');
  if (submodalSheet) {
    attachSheetDragToDismiss(submodalSheet, {
      backdropEl: submodalBackdrop,
      handleSelector: '#drawer-submodal-drag-handle',
      scrollContainerSelector: '#drawer-submodal-sheet',
      onClose: closeSubmodal,
    });
  }

  // Unblock user buttons inside Blocked Accounts modal
  const unblockBtns = document.querySelectorAll<HTMLButtonElement>('.unblock-user-btn');
  unblockBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const uid = btn.getAttribute('data-unblock-user-id');
      if (uid) {
        state.unblockUser(uid);
      }
    });
  });

  // Sign Out Button in Drawer (Opens confirmation modal before signing out)
  const signOutBtn = document.getElementById('drawer-sign-out-btn');
  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      isSignOutConfirmOpen = true;
      isSigningOut = false;
      signOutErrorMessage = '';
      state.setCurrentTab('profile');
    });
  }

  const confirmSignOutBtn = document.getElementById('confirm-sign-out-btn') as HTMLButtonElement | null;
  const cancelSignOutBtn = document.getElementById('cancel-sign-out-btn') as HTMLButtonElement | null;
  const signOutBackdrop = document.getElementById('sign-out-confirm-backdrop');

  const closeSignOutModal = () => {
    if (isSigningOut) return;
    isSignOutConfirmOpen = false;
    signOutErrorMessage = '';
    state.setCurrentTab('profile');
  };

  if (cancelSignOutBtn) {
    cancelSignOutBtn.addEventListener('click', closeSignOutModal);
  }
  if (signOutBackdrop) {
    signOutBackdrop.addEventListener('click', (e) => {
      if (e.target === signOutBackdrop) closeSignOutModal();
    });
  }
  if (confirmSignOutBtn) {
    confirmSignOutBtn.addEventListener('click', async () => {
      if (isSigningOut) return;
      isSigningOut = true;
      signOutErrorMessage = '';
      state.setCurrentTab('profile');

      const result = await state.signOutSupabaseAccount();
      isSigningOut = false;
      if (result.success) {
        isSignOutConfirmOpen = false;
        activeModalType = null;
        signOutErrorMessage = '';
      } else {
        signOutErrorMessage =
          result.errorMessage || 'تعذر تسجيل الخروج حاليًا. يرجى المحاولة مرة أخرى.';
        state.setCurrentTab('profile');
      }
    });
  }

  // Edit Owner Details Button (Opens full original Owner Details edit page)
  const editUserBtn = document.getElementById('edit-user-info-btn');
  if (editUserBtn) {
    editUserBtn.addEventListener('click', () => {
      state.setEditOwnerModalVisible(true);
    });
  }
}

function renderSignOutConfirmModal(user: ReturnType<typeof state.getUser>): string {
  if (!isSignOutConfirmOpen) return '';

  return `
    <div id="sign-out-confirm-backdrop" class="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" dir="rtl">
      <div class="bg-[#FFF9E9] w-full max-w-sm rounded-t-[32px] rounded-b-none sm:rounded-[32px] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6 border-2 border-b-0 sm:border-b-2 border-[#d6c7b2] shadow-2xl space-y-4 text-right animate-slide-up font-baloo text-[#2d221b]">
        <div class="flex items-center gap-3 pb-3 border-b border-[#d6c7b2]/60">
          <div class="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-600 flex items-center justify-center text-xl shrink-0 border border-rose-200">
            <i class="fa-solid fa-right-from-bracket"></i>
          </div>
          <div class="min-w-0">
            <h3 class="text-lg font-black text-[#1a1612] m-0">تأكيد تسجيل الخروج</h3>
            <p class="text-xs font-bold text-[#786555] m-0 truncate">
              ${user.email || user.name || 'حسابك الحالي'}
            </p>
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-[#fffefc] border border-[#d6c7b2] space-y-1.5">
          <p class="text-sm font-black text-[#1a1612] m-0">
            هل أنت متأكد من رغبتك في تسجيل الخروج؟
          </p>
          <p class="text-xs font-bold text-[#786555] leading-relaxed m-0">
            سيتم إنهاء جلستك الحالية وإعادتك إلى شاشة المصادقة لتسجيل الدخول بحسابك أو بحساب آخر.
          </p>
        </div>

        ${
          signOutErrorMessage
            ? `<div id="sign-out-error-msg" class="rounded-2xl border border-rose-300 bg-rose-50 px-3.5 py-2.5 text-xs font-bold text-rose-700 leading-relaxed" role="alert">${signOutErrorMessage}</div>`
            : ''
        }

        <div class="grid grid-cols-2 gap-2.5 pt-1">
          <button
            id="confirm-sign-out-btn"
            type="button"
            ${isSigningOut ? 'disabled' : ''}
            class="h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm shadow-sm transition active:scale-95 font-baloo ${
              isSigningOut ? 'opacity-70 cursor-wait' : 'cursor-pointer'
            }"
          >
            ${isSigningOut ? 'جاري الخروج...' : 'تأكيد الخروج'}
          </button>
          <button
            id="cancel-sign-out-btn"
            type="button"
            ${isSigningOut ? 'disabled' : ''}
            class="h-12 rounded-2xl bg-[#fffefc] hover:bg-[#faf6ed] border-2 border-[#d6c7b2] text-[#2d221b] font-black text-sm transition cursor-pointer active:scale-95 font-baloo"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderDeletePetConfirmModal(): string {
  const pet = state.getPendingDeletePet();
  if (!pet) return '';

  const groupListing = state.getUserGroupAdoptionListing();
  const isInGroup = Boolean(groupListing?.groupPetIds?.includes(pet.id));

  return `
    <div id="delete-pet-confirm-backdrop" class="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" dir="rtl">
      <div class="bg-[#FFF9E9] w-full max-w-sm rounded-t-[32px] rounded-b-none sm:rounded-[32px] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6 border-2 border-b-0 sm:border-b-2 border-[#d6c7b2] shadow-2xl space-y-4 text-right animate-slide-up font-baloo text-[#2d221b]">
        <div class="flex items-center gap-3 pb-3 border-b border-[#d6c7b2]/60">
          ${
            pet.photos?.[0]
              ? `<img src="${pet.photos[0]}" alt="${pet.name}" class="w-14 h-14 rounded-2xl object-cover border-2 border-[#d6c7b2] shrink-0" />`
              : `<div class="w-14 h-14 rounded-2xl bg-[#fff5ea] border-2 border-[#d6c7b2] text-[#e67e22] flex items-center justify-center text-2xl shrink-0"><i class="fa-solid fa-paw"></i></div>`
          }
          <div class="min-w-0">
            <h3 class="text-lg font-black text-[#1a1612] m-0">تأكيد حذف الأليف</h3>
            <p class="text-xs font-bold text-[#786555] m-0 truncate">${pet.name} • ${pet.breed}</p>
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-[#fffefc] border border-[#d6c7b2] space-y-1.5">
          <p class="text-sm font-black text-[#1a1612] m-0">
            هل تريد حذف ملف «${pet.name}» من حسابك؟
          </p>
          <p class="text-xs font-bold text-[#786555] leading-relaxed m-0">
            سيؤدي تأكيد الحذف إلى إزالة ملف الحيوان وصوره وبياناته من حسابك نهائياً${
              isInGroup
                ? '، كما سيتم إزالته من إعلان التبني الجماعي الحالي.'
                : '.'
            }
          </p>
        </div>

        <div class="grid grid-cols-2 gap-2.5 pt-1">
          <button
            id="confirm-delete-pet-btn"
            type="button"
            class="h-12 rounded-2xl bg-[#2d221b] hover:bg-[#1a1612] text-white font-black text-sm shadow-sm transition cursor-pointer active:scale-95 font-baloo"
          >
            تأكيد الحذف
          </button>
          <button
            id="cancel-delete-pet-btn"
            type="button"
            class="h-12 rounded-2xl bg-[#fffefc] hover:bg-[#faf6ed] border-2 border-[#d6c7b2] text-[#2d221b] font-black text-sm transition cursor-pointer active:scale-95 font-baloo"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  `;
}

function getStatusArabicLabel(status: PetStatus): string {
  if (status === 'mating') return 'للتزاوج ❤️';
  if (status === 'adoption') return 'للتبني 🏠';
  return 'خاص (غير معروض) ⏸️';
}

function renderStatusChangeConfirmModal(): string {
  const pending = state.getPendingStatusChange();
  if (!pending) return '';

  const { pet, targetStatus } = pending;
  const groupListing = state.getUserGroupAdoptionListing();
  const isInGroup = Boolean(groupListing?.groupPetIds?.includes(pet.id));
  const otherAdoptionCount = state
    .getUserPets()
    .filter((p) => p.status === 'adoption' && p.id !== pet.id).length;

  let detailMessage = '';
  if (targetStatus === 'mating') {
    detailMessage = `سيظهر ملف «${pet.name}» في قسم التزاوج للمستخدمين المناسبين${
      isInGroup ? '، كما سيتم إزالته من إعلان التبني الجماعي النشط.' : '.'
    }`;
  } else if (targetStatus === 'adoption') {
    detailMessage =
      otherAdoptionCount > 0 || groupListing
        ? `سيتم تحويل حالة «${pet.name}» للتبني، ثم ستختار بين الإعلان الجماعي فقط أو إعلانات منفصلة أو الاثنان معاً.`
        : `سيتم عرض «${pet.name}» في قسم التبني كإعلان مستقل ليتمكن المهتمون بالتبني من التواصل معك.`;
  } else {
    detailMessage = `سيتم إيقاف عرض «${pet.name}» مؤقتاً وإخفاؤه من قوائم التزاوج والتبني دون حذف بياناته${
      isInGroup ? '، كما سيتم إزالته من إعلان التبني الجماعي الحالي.' : '.'
    }`;
  }

  return `
    <div id="status-change-confirm-backdrop" class="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" dir="rtl">
      <div class="bg-[#FFF9E9] w-full max-w-sm rounded-t-[32px] rounded-b-none sm:rounded-[32px] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6 border-2 border-b-0 sm:border-b-2 border-[#d6c7b2] shadow-2xl space-y-4 text-right animate-slide-up font-baloo text-[#2d221b]">
        <div class="flex items-center gap-3 pb-3 border-b border-[#d6c7b2]/60">
          <div class="w-11 h-11 rounded-2xl bg-[#e67e22]/15 text-[#e67e22] flex items-center justify-center text-xl shrink-0">
            <i class="fa-solid fa-arrows-rotate"></i>
          </div>
          <div class="min-w-0">
            <h3 class="text-lg font-black text-[#1a1612] m-0">تأكيد تغيير الحالة</h3>
            <p class="text-xs font-bold text-[#786555] m-0 truncate">${pet.name}</p>
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-[#fffefc] border border-[#d6c7b2] space-y-2.5">
          <div class="flex items-center justify-between gap-2 text-xs font-black">
            <span class="px-2.5 py-1 rounded-xl bg-[#f3ebdd] text-[#786555]">${getStatusArabicLabel(pet.status)}</span>
            <i class="fa-solid fa-arrow-left text-[#e67e22]"></i>
            <span class="px-2.5 py-1 rounded-xl bg-[#fff5ea] border border-[#e67e22]/40 text-[#e67e22]">${getStatusArabicLabel(targetStatus)}</span>
          </div>
          <p class="text-xs sm:text-sm font-bold text-[#2d221b] leading-relaxed m-0">
            ${detailMessage}
          </p>
        </div>

        <div class="grid grid-cols-2 gap-2.5 pt-1">
          <button
            id="confirm-status-change-btn"
            type="button"
            class="h-12 rounded-2xl bg-[#e67e22] hover:bg-[#ea580c] text-white font-black text-sm shadow-sm transition cursor-pointer active:scale-95 font-baloo"
          >
            تأكيد التغيير
          </button>
          <button
            id="cancel-status-change-btn"
            type="button"
            class="h-12 rounded-2xl bg-[#fffefc] hover:bg-[#faf6ed] border-2 border-[#d6c7b2] text-[#2d221b] font-black text-sm transition cursor-pointer active:scale-95 font-baloo"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderAdoptionActionConfirmModal(): string {
  const pending = state.getPendingAdoptionActionConfirm();
  if (!pending) return '';

  let title = '';
  let message = '';
  let confirmLabel = 'تأكيد';

  if (pending.kind === 'stop_group') {
    title = 'إيقاف الإعلان الجماعي';
    message =
      'سيتم إيقاف إعلان التبني الجماعي وإزالته من قسم التبني. الحيوانات التي لها إعلان فردي مستقل ستظل ظاهرة كإعلانات منفصلة، والبقية ستصبح بحالة «خاص».';
    confirmLabel = 'تأكيد الإيقاف';
  } else if (pending.kind === 'dissolve_group') {
    title = 'فصل المجموعة لإعلانات مستقلة';
    message =
      'سيتم إيقاف الإعلان الجماعي وتحويل جميع الحيوانات داخل المجموعة إلى إعلانات تبنٍ فردية مستقلة.';
    confirmLabel = 'تأكيد الفصل';
  } else if (pending.kind === 'stop_individual' && pending.pet) {
    title = `إيقاف الإعلان الفردي: ${pending.pet.name}`;
    message = `سيتم إيقاف الإعلان الفردي المستقل لـ «${pending.pet.name}»، مع بقائه ظاهراً ضمن إعلان التبني الجماعي الحالي.`;
    confirmLabel = 'إيقاف الفردي';
  } else if (pending.kind === 'enable_individual' && pending.pet) {
    title = `تفعيل إعلان فردي: ${pending.pet.name}`;
    message = `سيظهر «${pending.pet.name}» في إعلان تبنٍ فردي مستقل بالإضافة إلى وجوده داخل الإعلان الجماعي.`;
    confirmLabel = 'تفعيل الإعلان';
  }

  return `
    <div id="adoption-action-confirm-backdrop" class="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" dir="rtl">
      <div class="bg-[#FFF9E9] w-full max-w-sm rounded-t-[32px] rounded-b-none sm:rounded-[32px] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6 border-2 border-b-0 sm:border-b-2 border-[#d6c7b2] shadow-2xl space-y-4 text-right animate-slide-up font-baloo text-[#2d221b]">
        <div class="flex items-center gap-3 pb-3 border-b border-[#d6c7b2]/60">
          <div class="w-11 h-11 rounded-2xl bg-[#e67e22]/15 text-[#e67e22] flex items-center justify-center text-xl shrink-0">
            <i class="fa-solid fa-house-chimney-heart"></i>
          </div>
          <h3 class="text-lg font-black text-[#1a1612] m-0">${title}</h3>
        </div>

        <p class="p-3.5 rounded-2xl bg-[#fffefc] border border-[#d6c7b2] text-xs sm:text-sm font-bold text-[#2d221b] leading-relaxed m-0">
          ${message}
        </p>

        <div class="grid grid-cols-2 gap-2.5 pt-1">
          <button
            id="confirm-adoption-action-btn"
            type="button"
            class="h-12 rounded-2xl bg-[#e67e22] hover:bg-[#ea580c] text-white font-black text-sm shadow-sm transition cursor-pointer active:scale-95 font-baloo"
          >
            ${confirmLabel}
          </button>
          <button
            id="cancel-adoption-action-btn"
            type="button"
            class="h-12 rounded-2xl bg-[#fffefc] hover:bg-[#faf6ed] border-2 border-[#d6c7b2] text-[#2d221b] font-black text-sm transition cursor-pointer active:scale-95 font-baloo"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  `;
}

