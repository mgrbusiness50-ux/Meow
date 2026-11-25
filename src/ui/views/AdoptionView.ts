import { state } from '../../state.ts';
import { getViewMode } from '../components/Header.ts';
import { renderThreeDotsMenu } from '../components/BlockMenu.ts';
import { attachPullToRefresh, showMobileToast } from '../../utils/touchGestures.ts';
import { escapeAttr, escapeHtml, sanitizeImageSrc } from '../../utils/sanitize.ts';

export function renderAdoptionView(): string {
  const filters = state.getAdoptionFilters();
  const pets = state.getFilteredAdoptionPets();
  const matchSummary = state.getAdoptionMatchSummary();
  const viewMode = getViewMode();
  const currentUserId = state.getUser().id;
  const loadingState = state.getFilteringLoadingState();

  return `
    <div id="adoption-view-root" class="w-full max-w-md mx-auto px-3.5 min-[360px]:px-4 pt-2 pb-24 flex-1 space-y-4">
      
      <!-- Dismissible Meow Advice Message (Small message with X button) -->
      ${
        !state.getIsAdviceDismissed()
          ? `
          <div id="meow-adoption-advice-banner" class="bg-amber-50/90 dark:bg-[#342A24] border border-brand-peachBorder/70 dark:border-warm-darkBorder rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-2.5 text-sm text-brand-dark/90 dark:text-white shadow-sm transition-all">
            <div class="flex items-center gap-2.5 min-w-0">
              <span class="text-lg text-brand-orange shrink-0">💡</span>
              <p class="m-0 font-bold text-xs sm:text-sm leading-normal">
                <strong class="text-brand-orange font-black">نصيحة Meow:</strong> التبني مسؤولية جميلة، تواصل مع صاحب الأليف وتعرّف على احتياجاته!
              </p>
            </div>
            <button
              id="dismiss-adoption-advice-btn"
              class="w-9 h-9 rounded-full flex items-center justify-center text-brand-subtleGray dark:text-[#A89F91] hover:text-brand-orange hover:bg-black/5 dark:hover:bg-white/10 shrink-0 cursor-pointer transition active:scale-90"
              type="button"
              aria-label="إغلاق الرسالة"
              title="إغلاق"
            >
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>
          `
          : ''
      }

      <!-- Smart Warm Banner for Adoption -->
      <div class="bg-white/90 dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder rounded-3xl p-4 shadow-sm relative overflow-hidden">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-brand-orange/15 border border-brand-peachBorder dark:border-warm-darkBorder flex items-center justify-center text-2xl flex-shrink-0 text-brand-orange">
            <i class="fa-solid fa-hand-holding-heart"></i>
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5 mb-0.5">
              <span class="text-xs font-black text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded-md">تبني رحيم وآمن</span>
              <span class="text-xs font-bold text-brand-subtleGray dark:text-[#A89F91]">بدون أي مقابل مالي 💛</span>
            </div>
            <h3 class="text-base font-black text-brand-dark dark:text-white truncate font-baloo">امنح حيوانًا أليفًا بيتًا دافئًا ومستقرًا</h3>
            <p class="text-xs font-semibold text-brand-subtleGray dark:text-[#A89F91] leading-tight line-clamp-1">
              تصفح الحالات الفردية والمجموعات واطلع على شروط تبني المجموعة
            </p>
          </div>
        </div>

        <!-- Filter pills for Individual vs Group -->
        <div class="flex items-center gap-2 mt-3 pt-3 border-t border-brand-peachBorder/40 dark:border-warm-darkBorder/40 overflow-x-auto no-scrollbar">
          <button
            data-adopt-type="all"
            type="button"
            class="adopt-type-btn text-xs sm:text-sm font-black px-4 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap font-baloo ${
              filters.adoptionType === 'all'
                ? 'bg-brand-orange text-white shadow-soft'
                : 'bg-white dark:bg-[#342A24] text-brand-dark dark:text-[#D1C7BD] border border-brand-peachBorder/80 dark:border-warm-darkBorder hover:bg-brand-peachBorder/20'
            }"
          >
            الكل (${pets.length})
          </button>
          <button
            data-adopt-type="individual"
            type="button"
            class="adopt-type-btn text-xs sm:text-sm font-black px-4 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap font-baloo ${
              filters.adoptionType === 'individual'
                ? 'bg-brand-orange text-white shadow-soft'
                : 'bg-white dark:bg-[#342A24] text-brand-dark dark:text-[#D1C7BD] border border-brand-peachBorder/80 dark:border-warm-darkBorder hover:bg-brand-peachBorder/20'
            }"
          >
            🐾 تبني فردي
          </button>
          <button
            data-adopt-type="group"
            type="button"
            class="adopt-type-btn text-xs sm:text-sm font-black px-4 py-2 rounded-full transition-all cursor-pointer whitespace-nowrap font-baloo ${
              filters.adoptionType === 'group'
                ? 'bg-brand-orange text-white shadow-soft'
                : 'bg-white dark:bg-[#342A24] text-brand-dark dark:text-[#D1C7BD] border border-brand-peachBorder/80 dark:border-warm-darkBorder hover:bg-brand-peachBorder/20'
            }"
          >
            👨‍👩‍👧 مجموعات وعائلات
          </button>
        </div>
      </div>

      <!-- Search Row -->
      <div class="flex items-center justify-between gap-2 px-1">
        <div class="relative flex-1">
          <input
            type="text"
            id="adoption-search-input"
            value="${escapeAttr(filters.breed || '')}"
            placeholder="ابحث بالسلالة أو المدينة أو المحافظة..."
            class="w-full bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder rounded-2xl py-2 px-3 pr-8 text-xs sm:text-sm font-bold text-brand-dark dark:text-white placeholder-brand-subtleGray focus:outline-none focus:border-brand-orange shadow-sm font-baloo"
          />
          <i class="fa-solid fa-magnifying-glass absolute right-2.5 top-3 text-xs text-brand-subtleGray"></i>
        </div>
      </div>

      ${
        matchSummary.hasFilters && !matchSummary.hasExactMatch && pets.length > 0
          ? `
            <div id="adoption-ranked-fallback-notice" class="bg-[#fff5ea] border border-[#e67e22]/45 rounded-2xl px-4 py-2.5 text-right font-baloo">
              <p class="text-xs font-black text-[#1a1612] m-0">
                عرض حالات التبني المتاحة من الأقرب لفلترك والموقع الجغرافي إلى الأقل
              </p>
              <p class="text-[11px] font-bold text-[#786555] m-0">
                لم يتوفر تطابق كامل لكل الخيارات المحددة، لذلك تظهر أقرب الحالات المناسبة أولاً
              </p>
            </div>
          `
          : ''
      }

      ${
        loadingState.active
          ? `
            <div id="adoption-loading-indicator" class="bg-[#fff5ea] border border-[#e67e22]/40 rounded-2xl px-4 py-2.5 flex items-center gap-2.5 text-xs font-black text-[#786555] font-baloo shadow-sm animate-fade-in">
              <span class="w-4 h-4 rounded-full border-2 border-[#e67e22] border-t-transparent animate-spin shrink-0"></span>
              <span>${escapeHtml(loadingState.label || 'جاري تحميل حالات التبني...')}</span>
            </div>
          `
          : ''
      }

      <!-- Adoption Grid (Original Stitch Layout: 2-column bg-brand-lightCream cards, h-44 photo, centered name/age & breed) -->
      ${
        pets.length === 0
          ? `
          <div class="bg-white/90 dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder rounded-3xl p-8 text-center shadow-card space-y-3">
            <div class="w-16 h-16 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center mx-auto text-2xl">
              <i class="fa-solid fa-shield-cat"></i>
            </div>
            <h4 class="text-base font-black text-brand-dark dark:text-white">لا توجد حالات تبني مطابقة</h4>
            <p class="text-xs font-semibold text-brand-subtleGray dark:text-[#A89F91] max-w-xs mx-auto">
              جرب تغيير نوع التبني (فردي / مجموعة) أو تصفح كل الحالات المتاحة.
            </p>
          </div>
          `
          : `
          <div class="${viewMode === 'grid' ? 'grid grid-cols-2 gap-3 sm:gap-4' : 'flex flex-col gap-4'}" data-purpose="pet-listings-grid">
            ${pets
              .map((pet) => {
                const isGroup = pet.adoptionType === 'group';
                const isSaved = state.isPetSaved(pet.id);
                const groupMembers = isGroup && pet.groupMembers ? pet.groupMembers : [];
                const groupCount = pet.groupCount || groupMembers.length || 2;
                const primaryPhoto = sanitizeImageSrc(
                  isGroup && groupMembers[0]?.individualPhotos?.[0]
                    ? groupMembers[0].individualPhotos[0]
                    : pet.photos[0]
                );
                const safePetPhoto = sanitizeImageSrc(pet.photos[0]);
                const memberThumbs = isGroup
                  ? groupMembers
                      .map((m) => ({
                        name: m.name,
                        photo: sanitizeImageSrc(m.individualPhotos?.[0] || ''),
                      }))
                      .filter((t) => Boolean(t.photo))
                      .slice(0, 4)
                  : [];
                const locationLabel =
                  pet.area && pet.area !== pet.city
                    ? `${pet.area}، ${pet.city}`
                    : pet.city || pet.governorate;
                const ageDisplay = pet.ageYears > 0 ? pet.ageYears : `${pet.ageMonths}ش`;

                if (viewMode === 'grid') {
                  if (isGroup) {
                    const memberSummaryText =
                      groupMembers.length > 0
                        ? groupMembers
                            .map((m) => {
                              const ageText =
                                m.ageYears > 0
                                  ? `${m.ageYears} سنة`
                                  : m.ageMonths > 0
                                  ? `${m.ageMonths} شهر`
                                  : '';
                              return `${m.name} (${m.breed} • ${m.gender === 'male' ? 'ذكر' : 'أنثى'}${
                                ageText ? ` • ${ageText}` : ''
                              })`;
                            })
                            .join(' | ')
                        : `${groupCount} حيوانات`;

                    return `
                      <article
                        class="pet-card meow-card-enter min-w-0 bg-brand-lightCream dark:bg-[#27201B] rounded-3xl border border-brand-peachBorder dark:border-warm-darkBorder shadow-card flex flex-col group transition-all duration-300 hover:shadow-soft cursor-pointer relative"
                        data-pet-detail-id="${escapeAttr(pet.id)}"
                        data-pet-type="${escapeAttr(pet.species || 'cat')}"
                      >
                        <!-- Group Adoption Primary Image & Thumbnails Strip -->
                        <div class="relative w-full h-44 rounded-t-3xl bg-brand-peachBorder/30 dark:bg-[#342A24]">
                          <div class="absolute inset-0 overflow-hidden rounded-t-3xl">
                            <img
                              src="${escapeAttr(primaryPhoto)}"
                              alt="${escapeAttr(`تبني جماعي: ${pet.name}`)}"
                              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pet-card-img"
                              loading="lazy"
                            />
                            <div class="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 via-black/35 to-transparent pointer-events-none"></div>
                          </div>

                          <!-- Top-left actions: Heart Save Button + 3-Dots More Menu -->
                          <div class="absolute top-2 left-2 flex items-center gap-1.5 z-30">
                            <button
                              type="button"
                              aria-label="حفظ الأليف"
                              class="toggle-save-pet-btn w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all active:scale-90 cursor-pointer shadow-md"
                              data-pet-save-id="${escapeAttr(pet.id)}"
                              title="${isSaved ? 'إزالة من المحفوظات' : 'حفظ في المحفوظات'}"
                            >
                              <i class="${isSaved ? 'fa-solid fa-heart text-red-500 scale-110' : 'fa-regular fa-heart text-white'} text-sm transition-transform"></i>
                            </button>
                            ${
                              pet.ownerId !== currentUserId
                                ? renderThreeDotsMenu({
                                    userId: pet.ownerId,
                                    userName: pet.ownerName,
                                    userAvatar: pet.ownerAvatar,
                                    petName: pet.name,
                                    petId: pet.id,
                                    reportTargetType: 'pet',
                                    buttonClass:
                                      'w-9 h-9 min-w-[36px] min-h-[36px] bg-transparent border-0 text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer opacity-95 hover:opacity-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)]',
                                    dropdownAlign: 'left',
                                  })
                                : ''
                            }
                          </div>

                          <!-- Clear Group Adoption Status Badge -->
                          <div class="absolute top-2 right-2 bg-brand-orange/95 backdrop-blur-sm text-white px-2 py-0.5 rounded-xl text-[10px] sm:text-[11px] font-bold shadow-sm font-baloo pointer-events-none z-20 flex items-center gap-1">
                            <i class="fa-solid fa-people-roof text-[9px]"></i>
                            <span>تبني جماعي (${groupCount})</span>
                          </div>

                          <!-- Individual Animal Thumbnails + Adoption Rule Pill -->
                          <div class="absolute bottom-2 inset-x-2 flex flex-col gap-1 z-10 pointer-events-none">
                            ${
                              memberThumbs.length > 0
                                ? `
                                  <div class="flex items-center gap-1">
                                    ${memberThumbs
                                      .map(
                                        (t) => `
                                          <img
                                            src="${escapeAttr(t.photo)}"
                                            alt="${escapeAttr(t.name)}"
                                            class="w-7 h-7 rounded-lg object-cover border border-white/90 shadow-sm shrink-0"
                                          />
                                        `
                                      )
                                      .join('')}
                                    ${
                                      groupCount > memberThumbs.length
                                        ? `<span class="w-7 h-7 rounded-lg bg-black/65 text-white text-[10px] font-black flex items-center justify-center border border-white/60 shrink-0">+${groupCount - memberThumbs.length}</span>`
                                        : ''
                                    }
                                  </div>
                                `
                                : ''
                            }
                            <div class="bg-brand-dark/80 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-lg text-center truncate">
                              ${pet.mustAdoptTogether ? 'يُشترط التبني معاً' : 'متاح التبني منفرداً أو معاً'}
                            </div>
                          </div>
                        </div>

                        <!-- Group Card Info Summary (Distinct Members + Single Shared Location) -->
                        <div class="p-3 text-center flex flex-col justify-center items-center gap-0.5">
                          <h2 class="text-base sm:text-lg font-black text-brand-dark dark:text-white tracking-tight leading-tight font-baloo max-w-full truncate">
                            ${escapeHtml(pet.name)}
                          </h2>
                          <p class="text-[11px] font-extrabold text-brand-subtleGray dark:text-[#D1C7BD] mt-0.5 line-clamp-2 leading-snug">
                            ${escapeHtml(memberSummaryText)}
                          </p>
                          ${
                            locationLabel
                              ? `
                                <p class="text-[10px] font-bold text-brand-orange flex items-center justify-center gap-1 max-w-full truncate m-0">
                                  <i class="fa-solid fa-location-dot text-[9px] shrink-0"></i>
                                  <span class="truncate">${escapeHtml(locationLabel)}</span>
                                </p>
                              `
                              : ''
                          }
                        </div>
                      </article>
                    `;
                  }

                  return `
                    <article
                      class="pet-card meow-card-enter min-w-0 bg-brand-lightCream dark:bg-[#27201B] rounded-3xl border border-brand-peachBorder dark:border-warm-darkBorder shadow-card flex flex-col group transition-all duration-300 hover:shadow-soft cursor-pointer relative"
                      data-pet-detail-id="${escapeAttr(pet.id)}"
                      data-pet-type="${escapeAttr(pet.species || 'cat')}"
                    >
                      <!-- Pet Image Container with Heart Save Button + 3-Dots Menu & Status Badge -->
                      <div class="relative w-full h-44 rounded-t-3xl bg-brand-peachBorder/30 dark:bg-[#342A24]">
                        <div class="absolute inset-0 overflow-hidden rounded-t-3xl">
                          <img
                            src="${escapeAttr(safePetPhoto)}"
                            alt="${escapeAttr(`صورة ${pet.name}`)}"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pet-card-img"
                            loading="lazy"
                          />
                        </div>

                        <!-- Top-left actions: Heart Save Button + 3-Dots More Menu -->
                        <div class="absolute top-2 left-2 flex items-center gap-1.5 z-30">
                          <button
                            type="button"
                            aria-label="حفظ الأليف"
                            class="toggle-save-pet-btn w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all active:scale-90 cursor-pointer shadow-md"
                            data-pet-save-id="${escapeAttr(pet.id)}"
                            title="${isSaved ? 'إزالة من المحفوظات' : 'حفظ في المحفوظات'}"
                          >
                            <i class="${isSaved ? 'fa-solid fa-heart text-red-500 scale-110' : 'fa-regular fa-heart text-white'} text-sm transition-transform"></i>
                          </button>
                          ${
                            pet.ownerId !== currentUserId
                              ? renderThreeDotsMenu({
                                  userId: pet.ownerId,
                                  userName: pet.ownerName,
                                  userAvatar: pet.ownerAvatar,
                                  petName: pet.name,
                                  petId: pet.id,
                                  reportTargetType: 'pet',
                                  buttonClass:
                                    'w-9 h-9 min-w-[36px] min-h-[36px] bg-transparent border-0 text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer opacity-95 hover:opacity-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)]',
                                  dropdownAlign: 'left',
                                })
                              : ''
                          }
                        </div>

                        <!-- Status Badge: Original rounded-xl style -->
                        <div class="absolute top-2 right-2 bg-brand-orange/95 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-xl text-[11px] font-bold flex items-center gap-1 shadow-sm font-baloo pointer-events-none z-20">
                          <span>للتبني</span>
                        </div>
                      </div>

                      <!-- Pet Info Content matching original Stitch design -->
                      <div class="p-3 text-center flex flex-col justify-center items-center">
                        <h2 class="text-lg font-black text-brand-dark dark:text-white tracking-tight leading-tight font-baloo max-w-full truncate">
                          ${escapeHtml(pet.name)}, ${escapeHtml(String(ageDisplay))}
                        </h2>
                        <p class="text-xs uppercase font-extrabold text-brand-subtleGray dark:text-[#A89F91] tracking-wider mt-0.5 max-w-full truncate">
                          ${escapeHtml(pet.breed)}
                        </p>
                      </div>
                    </article>
                  `;
                }

                // Single column / Full card view: Group adoption keeps distinct member info & thumbnails
                if (isGroup) {
                  return `
                    <article
                      class="pet-card meow-card-enter bg-brand-lightCream dark:bg-[#27201B] rounded-3xl border border-brand-peachBorder dark:border-warm-darkBorder shadow-card flex flex-col group transition-all duration-300 hover:shadow-soft cursor-pointer relative"
                      data-pet-detail-id="${escapeAttr(pet.id)}"
                      data-pet-type="${escapeAttr(pet.species || 'cat')}"
                    >
                      <div class="relative w-full aspect-[4/4.3] sm:aspect-[4/4] rounded-3xl bg-brand-peachBorder/30 dark:bg-[#342A24]">
                        <div class="absolute inset-0 overflow-hidden rounded-3xl">
                          <img
                            src="${escapeAttr(primaryPhoto)}"
                            alt="${escapeAttr(`تبني جماعي: ${pet.name}`)}"
                            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none"></div>
                        </div>

                        <!-- Top-left actions: Heart Save Button + 3-Dots More Menu -->
                        <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-30">
                          <button
                            type="button"
                            aria-label="حفظ الأليف"
                            class="toggle-save-pet-btn w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all active:scale-90 cursor-pointer shadow-md"
                            data-pet-save-id="${escapeAttr(pet.id)}"
                            title="${isSaved ? 'إزالة من المحفوظات' : 'حفظ في المحفوظات'}"
                          >
                            <i class="${isSaved ? 'fa-solid fa-heart text-red-500 scale-110' : 'fa-regular fa-heart text-white'} text-sm transition-transform"></i>
                          </button>
                          ${
                            pet.ownerId !== currentUserId
                              ? renderThreeDotsMenu({
                                  userId: pet.ownerId,
                                  userName: pet.ownerName,
                                  userAvatar: pet.ownerAvatar,
                                  petName: pet.name,
                                  petId: pet.id,
                                  reportTargetType: 'pet',
                                  buttonClass:
                                    'w-9 h-9 min-w-[36px] min-h-[36px] bg-transparent border-0 text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer opacity-95 hover:opacity-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)]',
                                  dropdownAlign: 'left',
                                })
                              : ''
                          }
                        </div>

                        <!-- Group Adoption Badge -->
                        <div class="absolute top-2.5 right-2.5 bg-brand-orange/95 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-xl text-[11px] font-bold shadow-sm font-baloo pointer-events-none z-20 flex items-center gap-1.5">
                          <i class="fa-solid fa-people-roof text-[10px]"></i>
                          <span>تبني جماعي • ${groupCount} حيوانات</span>
                        </div>

                        <!-- Bottom Overlaid External Group Summary -->
                        <div class="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-right flex flex-col gap-2 z-20 text-white">
                          <div class="flex items-center justify-between gap-2 flex-wrap">
                            <span class="px-3 py-1 rounded-xl text-[11px] font-bold font-baloo ${
                              pet.mustAdoptTogether
                                ? 'bg-brand-orange/90 text-white'
                                : 'bg-emerald-600/90 text-white'
                            }">
                              ${pet.mustAdoptTogether ? 'يُشترط تبني المجموعة كاملة معاً' : 'يمكن تبني كل حيوان منفرداً أو معاً'}
                            </span>
                            ${
                              locationLabel
                                ? `
                                  <span class="text-xs font-bold text-white/95 flex items-center gap-1">
                                    <i class="fa-solid fa-location-dot text-brand-orange text-[11px]"></i>
                                    <span>${escapeHtml(locationLabel)}</span>
                                  </span>
                                `
                                : ''
                            }
                          </div>

                          <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight font-baloo drop-shadow-md m-0">
                            ${escapeHtml(pet.name)}
                          </h2>

                          <!-- Individual Animals Mini Cards (Fixed single-row horizontal layout matching تيمور وبندق) -->
                          ${
                            groupMembers.length > 0
                              ? `
                                <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pt-0.5">
                                  ${groupMembers
                                    .map((m) => {
                                      const mAge =
                                        m.ageYears > 0
                                          ? `${m.ageYears} سنة`
                                          : m.ageMonths > 0
                                          ? `${m.ageMonths} شهر`
                                          : '';
                                      const memberPhoto = sanitizeImageSrc(m.individualPhotos?.[0] || '') || primaryPhoto;
                                      return `
                                        <div class="flex items-center gap-2 px-2.5 py-1.5 rounded-2xl bg-black/55 backdrop-blur-md border border-white/25 shrink-0 max-w-[190px]">
                                          <img
                                            src="${escapeAttr(memberPhoto)}"
                                            alt="${escapeAttr(m.name)}"
                                            class="w-7 h-7 rounded-xl object-cover border border-white/80 shrink-0"
                                          />
                                          <div class="min-w-0 text-right">
                                            <div class="text-xs font-black text-white font-baloo leading-tight truncate">
                                              ${escapeHtml(m.name)} (${m.gender === 'male' ? 'ذكر' : 'أنثى'})
                                            </div>
                                            <div class="text-[10px] font-bold text-white/85 truncate">
                                              ${escapeHtml(m.breed)}${mAge ? ` • ${escapeHtml(mAge)}` : ''}
                                            </div>
                                          </div>
                                        </div>
                                      `;
                                    })
                                    .join('')}
                                </div>
                              `
                              : ''
                          }
                        </div>
                      </div>
                    </article>
                  `;
                }

                // Single column / Full card view
                return `
                  <article
                    class="pet-card meow-card-enter bg-brand-lightCream dark:bg-[#27201B] rounded-3xl border border-brand-peachBorder dark:border-warm-darkBorder shadow-card flex flex-col group transition-all duration-300 hover:shadow-soft cursor-pointer relative"
                    data-pet-detail-id="${escapeAttr(pet.id)}"
                    data-pet-type="${escapeAttr(pet.species || 'cat')}"
                  >
                    <!-- Photo filling card with Gradient & Superimposed Info -->
                    <div class="relative w-full aspect-[4/4.3] sm:aspect-[4/4] rounded-3xl bg-brand-peachBorder/30 dark:bg-[#342A24]">
                      <div class="absolute inset-0 overflow-hidden rounded-3xl">
                        <img
                          src="${escapeAttr(safePetPhoto)}"
                          alt="${escapeAttr(`صورة ${pet.name}`)}"
                          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />

                        <!-- Gradient Overlay from bottom up -->
                        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent pointer-events-none"></div>
                      </div>

                      <!-- Top-left actions: Heart Save Button + 3-Dots More Menu -->
                      <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-30">
                        <button
                          type="button"
                          aria-label="حفظ الأليف"
                          class="toggle-save-pet-btn w-8 h-8 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all active:scale-90 cursor-pointer shadow-md"
                          data-pet-save-id="${escapeAttr(pet.id)}"
                          title="${isSaved ? 'إزالة من المحفوظات' : 'حفظ في المحفوظات'}"
                        >
                          <i class="${isSaved ? 'fa-solid fa-heart text-red-500 scale-110' : 'fa-regular fa-heart text-white'} text-sm transition-transform"></i>
                        </button>
                        ${
                          pet.ownerId !== currentUserId
                            ? renderThreeDotsMenu({
                                userId: pet.ownerId,
                                userName: pet.ownerName,
                                userAvatar: pet.ownerAvatar,
                                petName: pet.name,
                                petId: pet.id,
                                reportTargetType: 'pet',
                                buttonClass:
                                  'w-9 h-9 min-w-[36px] min-h-[36px] bg-transparent border-0 text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer opacity-95 hover:opacity-100 drop-shadow-[0_1px_3px_rgba(0,0,0,0.75)]',
                                dropdownAlign: 'left',
                              })
                            : ''
                        }
                      </div>

                      <!-- Status Badge -->
                      <div class="absolute top-2.5 right-2.5 bg-brand-orange/95 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-xl text-[11px] font-bold shadow-sm font-baloo pointer-events-none z-20">
                        <span>للتبني</span>
                      </div>

                      <!-- Basic Info Overlaid on Image with Gradient: Name, Age, Location, Breed & Traits -->
                      <div class="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-right flex flex-col gap-1.5 z-20 text-white">
                        <h2 class="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight font-baloo drop-shadow-md m-0">
                          ${escapeHtml(pet.name)}, ${escapeHtml(String(ageDisplay))}
                        </h2>
                        <p class="text-xs sm:text-sm font-bold text-white/95 drop-shadow-sm m-0 font-baloo flex items-center gap-1.5">
                          <span>${pet.area && pet.area !== pet.city ? `${escapeHtml(pet.area)}، ${escapeHtml(pet.city)}` : escapeHtml(pet.city || pet.governorate)}</span>
                          <span class="opacity-70">•</span>
                          <span>${escapeHtml(pet.breed)}</span>
                        </p>

                        <!-- Traits Chips on Photo -->
                        <div class="flex items-center gap-2 flex-wrap pt-1.5">
                          ${pet.personality
                            .slice(0, 3)
                            .map(
                              (trait) => `
                              <span class="px-3 py-1 rounded-xl bg-white/25 backdrop-blur-md border border-white/30 text-white text-xs font-bold shadow-sm font-baloo">
                                ${escapeHtml(trait)}
                              </span>
                            `
                            )
                            .join('')}
                        </div>
                      </div>

                    </div>
                  </article>
                `;
              })
              .join('')}
          </div>
          `
      }

    </div>
  `;
}

export function attachAdoptionEvents(): void {
  // Dismiss Meow Advice Message
  const dismissBtn = document.getElementById('dismiss-adoption-advice-btn');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      state.dismissAdvice();
      const banner = document.getElementById('meow-adoption-advice-banner');
      if (banner) banner.remove();
    });
  }

  // Adoption Type Filter Buttons
  const typeButtons = document.querySelectorAll<HTMLButtonElement>('.adopt-type-btn');
  typeButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-adopt-type') as any;
      state.applyAdoptionFiltersWithLoading({ adoptionType: type }, 'جاري تحديث حالات التبني...');
    });
  });

  // Search Input (preserves input focus & cursor across re-render)
  const searchInput = document.getElementById('adoption-search-input') as HTMLInputElement;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const inputEl = e.target as HTMLInputElement;
      const val = inputEl.value;
      const caret = inputEl.selectionStart ?? val.length;
      state.setAdoptionFilters({ breed: val });
      const restored = document.getElementById('adoption-search-input') as HTMLInputElement | null;
      if (restored) {
        restored.focus();
        try {
          restored.setSelectionRange(caret, caret);
        } catch {
          // Ignore selection errors on unsupported input types
        }
      }
    });
  }

  // Sort By
  const sortBySelect = document.getElementById('adoption-sort-by') as HTMLSelectElement;
  if (sortBySelect) {
    sortBySelect.addEventListener('change', (e) => {
      state.setAdoptionFilters({ sortBy: (e.target as HTMLSelectElement).value as any });
    });
  }

  const gridScope = document.querySelector<HTMLElement>('[data-purpose="pet-listings-grid"]');

  // Toggle Save Pet (Heart button) - Scoped strictly to grid/list container
  const saveTriggers = gridScope
    ? gridScope.querySelectorAll<HTMLElement>('.toggle-save-pet-btn')
    : [];
  saveTriggers.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const petId = btn.getAttribute('data-pet-save-id');
      if (petId) {
        state.toggleSavePet(petId);
      }
    });
  });

  // View Details (clicks on card) - Scoped strictly to grid/list container
  const detailTriggers = gridScope
    ? gridScope.querySelectorAll<HTMLElement>('[data-pet-detail-id]')
    : [];
  detailTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.toggle-save-pet-btn, .meow-more-menu-container')) {
        return;
      }
      const petId = trigger.getAttribute('data-pet-detail-id');
      const pet = state.getFilteredAdoptionPets().find((p) => p.id === petId);
      if (pet) {
        state.setSelectedPetForDetail(pet);
      }
    });
  });

  // Send Request
  const sendRequestBtns = document.querySelectorAll<HTMLButtonElement>('.send-adoption-request-btn');
  sendRequestBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const petId = btn.getAttribute('data-pet-request-id');
      const pet = state.getFilteredAdoptionPets().find((p) => p.id === petId);
      if (pet) {
        state.setSelectedPetForRequest(pet);
      }
    });
  });

  attachPullToRefresh(document.getElementById('adoption-view-root'), {
    isBlocked: () =>
      Boolean(
        state.isNotificationsOpen() ||
          state.isSettingsOpen() ||
          state.getSelectedPetForDetail() ||
          state.getSelectedPetForRequest() ||
          state.isAddPetModalVisible() ||
          state.getIsFilterModalOpen() ||
          state.isEditOwnerModalVisible() ||
          state.isSavedPetsVisible() ||
          state.isContactOpen() ||
          state.getPendingBlockTarget() ||
          state.getPendingReportTarget()
      ),
    onRefresh: async () => {
      await state.refreshFeed('adoption');
      showMobileToast('تم التحديث', 'success', 1500);
    },
  });
}
