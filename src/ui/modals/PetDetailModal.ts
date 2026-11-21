import { state } from '../../state.ts';
import { GroupAdoptionMember, GroupPhotoItem, Pet, PetSpecies, VaccinationStatus } from '../../types.ts';
import { attachThreeDotsMenuEvents, renderThreeDotsMenu } from '../components/BlockMenu.ts';
import {
  formatPetSpecies,
  formatPetAgeFull,
  formatPetLocation,
  formatVaccinationStatus as formatVaccination,
} from '../../utils/petFormatters.ts';
import { attachHorizontalCarouselSwipe } from '../../utils/touchGestures.ts';

let activePhotoIndex = 0;
let lastOpenedPetId: string | null = null;
let isConfirmationDialogOpen = false;
let activeGroupMemberId: string | 'all' = 'all';
let pendingRequestMemberId: string | null = null;
const memberPhotoIndices: Record<string, number> = {};

interface GalleryItem {
  url: string;
  label: string;
  kind: 'individual' | 'collective';
  petId?: string;
}

interface IndividualProfileParams {
  name: string;
  species: PetSpecies;
  breed: string;
  hybridBreed?: string;
  ageYears: number;
  ageMonths: number;
  color?: string;
  gender: 'male' | 'female';
  vaccinationStatus?: VaccinationStatus;
  personality?: string[];
  healthNotes?: string;
  locationText: string;
  statusBadgeLabel: string;
  statusBadgeClass: string;
  aboutHeading: string;
  adoptionExtraHtml?: string;
  isGroupMemberCard?: boolean;
}

function buildGroupCoverGalleryItems(pet: Pet): GalleryItem[] {
  const members = pet.groupMembers || [];
  const result: GalleryItem[] = [];
  const seenUrl = new Set<string>();

  const pushUnique = (item: GalleryItem) => {
    const cleanUrl = (item.url || '').trim();
    if (!cleanUrl || result.length >= 10 || seenUrl.has(cleanUrl)) return;
    seenUrl.add(cleanUrl);
    result.push({ ...item, url: cleanUrl });
  };

  // Optional collective group photos first
  if (pet.photoEntries && pet.photoEntries.length > 0) {
    pet.photoEntries
      .filter((e: GroupPhotoItem) => e.kind === 'collective')
      .forEach((e) => {
        pushUnique({
          url: e.url,
          label: e.label || 'صورة جماعية للمجموعة',
          kind: 'collective',
        });
      });
  }

  (pet.sharedGroupPhotos || []).forEach((url) => {
    pushUnique({
      url,
      label: 'صورة جماعية للمجموعة',
      kind: 'collective',
    });
  });

  // One representative photo per animal (never stacked vertically; swipeable horizontal slides)
  members.forEach((m) => {
    const first = m.individualPhotos?.[0];
    if (first) {
      pushUnique({
        url: first,
        label: m.name,
        kind: 'individual',
        petId: m.petId,
      });
    }
  });

  if (result.length === 0) {
    (pet.photos || []).forEach((url) => {
      pushUnique({
        url,
        label: pet.name,
        kind: 'individual',
      });
    });
  }

  return result;
}

function buildMemberGalleryItems(member: GroupAdoptionMember): GalleryItem[] {
  const photos = (member.individualPhotos || []).map((u) => u.trim()).filter(Boolean);
  return photos.map((url) => ({
    url,
    label: member.name,
    kind: 'individual',
    petId: member.petId,
  }));
}

/**
 * Shared Individual Pet Profile sections — used identically by:
 * 1) Standalone individual adoption/mating pets
 * 2) A selected member tab inside a group adoption
 * 3) Each animal card inside the "الكل" view of a group adoption
 */
function renderIndividualProfileDetails(params: IndividualProfileParams): string {
  const isMale = params.gender === 'male';
  const fullAgeText = formatPetAgeFull(params.ageYears, params.ageMonths);
  const titleSuffix =
    params.ageYears > 0
      ? `, ${params.ageYears}`
      : params.ageMonths > 0
      ? `, ${params.ageMonths} شهر`
      : '';
  const hasHealthNotes = Boolean(params.healthNotes && params.healthNotes.trim());
  const personalityList = (params.personality || []).map((t) => t.trim()).filter(Boolean);
  const hybridBreed =
    params.hybridBreed &&
    params.hybridBreed.trim() &&
    params.hybridBreed.trim() !== 'بدون هجين'
      ? params.hybridBreed.trim()
      : '';
  const colorText = params.color ? params.color.trim() : '';

  return `
    <!-- Name, Location & Gender Pill -->
    <div class="flex items-start justify-between gap-3 text-right">
      <div class="min-w-0">
        <${params.isGroupMemberCard ? 'h3' : 'h1'} class="${
          params.isGroupMemberCard ? 'text-2xl sm:text-3xl' : 'text-3xl sm:text-4xl'
        } font-black font-baloo text-brand-dark leading-tight m-0">
          ${params.name}${titleSuffix}
        </${params.isGroupMemberCard ? 'h3' : 'h1'}>
        ${
          params.locationText
            ? `
              <p class="text-xs sm:text-sm font-bold text-brand-subtleGray flex items-center gap-1.5 mt-1.5 m-0">
                <i class="fa-solid fa-location-dot text-brand-orange text-sm"></i>
                <span>${params.locationText}</span>
              </p>
            `
            : ''
        }
      </div>

      <!-- Gender Pill -->
      <div class="px-6 py-2.5 rounded-full bg-white border-2 border-brand-peachBorder/80 shadow-sm font-baloo font-black text-sm sm:text-base shrink-0 ${
        isMale ? 'text-blue-600' : 'text-pink-600'
      }">
        ${isMale ? 'ذكر' : 'أنثى'}
      </div>
    </div>

    <!-- Section: "عن [الاسم]" -->
    <div class="bg-white/90 border border-brand-peachBorder/90 rounded-[34px] p-5 sm:p-6 shadow-sm space-y-3.5 text-right">
      <div class="flex items-center justify-between gap-2">
        <h3 class="text-base sm:text-lg font-black font-baloo text-brand-dark flex items-center gap-2 m-0">
          <span>${params.aboutHeading}</span>
          <span class="text-brand-orange text-lg">🐾</span>
        </h3>
        <span class="px-4 py-1.5 rounded-full text-xs sm:text-sm font-black shadow-sm font-baloo shrink-0 ${params.statusBadgeClass}">
          ${params.statusBadgeLabel}
        </span>
      </div>

      ${
        hasHealthNotes
          ? `
            <p class="text-sm sm:text-base font-semibold text-brand-dark/90 leading-relaxed m-0">
              ${params.healthNotes!.trim()}
            </p>
          `
          : ''
      }

      ${
        personalityList.length > 0
          ? `
            <div class="flex items-center gap-2 flex-wrap pt-1">
              ${personalityList
                .map(
                  (trait) => `
                    <span class="px-4 py-2 rounded-full bg-brand-cream/85 border border-brand-peachBorder/75 text-xs sm:text-sm font-bold text-brand-dark shadow-sm">
                      ${trait}
                    </span>
                  `
                )
                .join('')}
            </div>
          `
          : ''
      }

      ${params.adoptionExtraHtml || ''}
    </div>

    <!-- Complete Registration Attributes Grid -->
    <div class="grid grid-cols-2 gap-3.5">
      <!-- النوع -->
      <div class="bg-white/90 border border-brand-peachBorder/90 rounded-[30px] p-4 sm:p-5 flex flex-col gap-2 shadow-sm text-right">
        <div class="flex items-center gap-2">
          <span class="w-10 h-10 rounded-full bg-[#e67e22]/15 text-[#e67e22] flex items-center justify-center text-base shrink-0">
            <i class="fa-solid ${params.species === 'dog' ? 'fa-dog' : 'fa-cat'}"></i>
          </span>
          <span class="text-xs sm:text-sm font-bold text-brand-subtleGray">النوع</span>
        </div>
        <span class="text-base sm:text-lg font-black font-baloo text-brand-dark mt-0.5 leading-snug">
          ${formatPetSpecies(params.species)}
        </span>
      </div>

      <!-- العمر -->
      ${
        fullAgeText
          ? `
            <div class="bg-white/90 border border-brand-peachBorder/90 rounded-[30px] p-4 sm:p-5 flex flex-col gap-2 shadow-sm text-right">
              <div class="flex items-center gap-2">
                <span class="w-10 h-10 rounded-full bg-amber-500/15 text-amber-600 flex items-center justify-center text-base shrink-0">
                  <i class="fa-regular fa-calendar"></i>
                </span>
                <span class="text-xs sm:text-sm font-bold text-brand-subtleGray">العمر</span>
              </div>
              <span class="text-base sm:text-lg font-black font-baloo text-brand-dark mt-0.5 leading-snug">
                ${fullAgeText}
              </span>
            </div>
          `
          : ''
      }

      <!-- الصحة / حالة التطعيم -->
      <div class="bg-white/90 border border-brand-peachBorder/90 rounded-[30px] p-4 sm:p-5 flex flex-col gap-2 shadow-sm text-right">
        <div class="flex items-center gap-2">
          <span class="w-10 h-10 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center text-base shrink-0">
            <i class="fa-solid fa-circle-check"></i>
          </span>
          <span class="text-xs sm:text-sm font-bold text-brand-subtleGray">حالة التطعيم</span>
        </div>
        <span class="text-base sm:text-lg font-black font-baloo text-brand-dark mt-0.5 leading-snug">
          ${formatVaccination(params.vaccinationStatus ?? 'not_vaccinated')}
        </span>
      </div>

      <!-- السلالة -->
      ${
        params.breed && params.breed.trim()
          ? `
            <div class="bg-white/90 border border-brand-peachBorder/90 rounded-[30px] p-4 sm:p-5 flex flex-col gap-2 shadow-sm text-right">
              <div class="flex items-center gap-2">
                <span class="w-10 h-10 rounded-full bg-blue-500/15 text-blue-600 flex items-center justify-center text-base shrink-0">
                  <i class="fa-solid fa-paw"></i>
                </span>
                <span class="text-xs sm:text-sm font-bold text-brand-subtleGray">السلالة</span>
              </div>
              <span class="text-base sm:text-lg font-black font-baloo text-brand-dark mt-0.5 leading-snug">
                ${params.breed.trim()}
              </span>
            </div>
          `
          : ''
      }

      <!-- سلالة هجينة -->
      ${
        hybridBreed
          ? `
            <div class="bg-white/90 border border-brand-peachBorder/90 rounded-[30px] p-4 sm:p-5 flex flex-col gap-2 shadow-sm text-right">
              <div class="flex items-center gap-2">
                <span class="w-10 h-10 rounded-full bg-purple-500/15 text-purple-600 flex items-center justify-center text-base shrink-0">
                  <i class="fa-solid fa-dna"></i>
                </span>
                <span class="text-xs sm:text-sm font-bold text-brand-subtleGray">سلالة هجينة</span>
              </div>
              <span class="text-base sm:text-lg font-black font-baloo text-brand-dark mt-0.5 leading-snug">
                ${hybridBreed}
              </span>
            </div>
          `
          : ''
      }

      <!-- اللون -->
      ${
        colorText
          ? `
            <div class="bg-white/90 border border-brand-peachBorder/90 rounded-[30px] p-4 sm:p-5 flex flex-col gap-2 shadow-sm text-right">
              <div class="flex items-center gap-2">
                <span class="w-10 h-10 rounded-full bg-pink-500/15 text-pink-600 flex items-center justify-center text-base shrink-0">
                  <i class="fa-solid fa-palette"></i>
                </span>
                <span class="text-xs sm:text-sm font-bold text-brand-subtleGray">اللون</span>
              </div>
              <span class="text-base sm:text-lg font-black font-baloo text-brand-dark mt-0.5 leading-snug">
                ${colorText}
              </span>
            </div>
          `
          : ''
      }
    </div>
  `;
}

function renderGroupMemberIndividualCard(
  pet: Pet,
  member: GroupAdoptionMember,
  index: number,
  total: number,
  locationText: string,
  isUserPet: boolean,
  isSaved: boolean
): string {
  const photos = (member.individualPhotos || []).map((u) => u.trim()).filter(Boolean);
  const currentIdx = Math.min(memberPhotoIndices[member.petId] || 0, Math.max(0, photos.length - 1));
  memberPhotoIndices[member.petId] = currentIdx;

  const extraHtml = pet.adoptionReason && pet.adoptionReason.trim()
    ? `
      <div class="pt-2.5 border-t border-brand-peachBorder/50 space-y-1 text-xs sm:text-sm font-bold text-[#5d4b3d]">
        <div>ضمن مجموعة: ${pet.name} • ${pet.mustAdoptTogether ? 'يُشترط التبني معاً' : 'متاح منفرداً أو معاً'}</div>
        <div>سبب العرض للتبني: ${pet.adoptionReason.trim()}</div>
      </div>
    `
    : `
      <div class="pt-2.5 border-t border-brand-peachBorder/50 text-xs sm:text-sm font-bold text-[#5d4b3d]">
        ضمن مجموعة: ${pet.name} • ${pet.mustAdoptTogether ? 'يُشترط التبني معاً' : 'متاح منفرداً أو معاً'}
      </div>
    `;

  return `
    <article
      data-member-section-id="${member.petId}"
      class="bg-white/60 border-2 border-brand-peachBorder/90 rounded-[36px] overflow-hidden shadow-card flex flex-col"
    >
      <!-- Member's Own Dedicated Photo Carousel (Locked 4/4.3 aspect ratio + light bottom black gradient) -->
      <div
        class="relative w-full aspect-[4/4.3] bg-[#f3ebdd] overflow-hidden select-none touch-pan-y"
        data-member-gallery="${member.petId}"
      >
        ${
          photos.length > 0
            ? `
              <div
                class="member-gallery-track absolute inset-0 flex transition-transform duration-300 ease-out will-change-transform"
                dir="ltr"
                data-member-track="${member.petId}"
                style="transform: translate3d(-${currentIdx * 100}%, 0, 0);"
              >
                ${photos
                  .map(
                    (url, pIdx) => `
                      <div class="w-full h-full shrink-0 bg-[#f3ebdd]">
                        <img
                          src="${url}"
                          alt="${member.name} - صورة ${pIdx + 1}"
                          class="w-full h-full object-cover pointer-events-none select-none"
                          draggable="false"
                        />
                      </div>
                    `
                  )
                  .join('')}
              </div>
            `
            : `
              <div class="absolute inset-0 flex items-center justify-center text-[#998b7c]">
                <i class="fa-solid fa-paw text-5xl"></i>
              </div>
            `
        }

        <!-- Consistent Soft Bottom-to-Top Dark Gradient -->
        <div class="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none z-[5]"></div>

        <!-- Top-Right Order & Status Badge -->
        <div class="absolute top-3 right-3 bg-brand-orange/95 backdrop-blur-sm text-white px-3.5 py-1.5 rounded-full text-xs font-black font-baloo shadow-sm z-10 pointer-events-none">
          ${member.name} • ${index + 1} من ${total}
        </div>

        <!-- Top-Left Independent Save Heart + 3-Dots Menu -->
        <div class="absolute top-3 left-3 flex items-center gap-2 z-20">
          <button
            type="button"
            class="member-card-save-btn w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all active:scale-90 cursor-pointer shadow-md"
            data-pet-save-id="${pet.id}"
            aria-label="حفظ الأليف"
            title="${isSaved ? 'إزالة من المحفوظات' : 'حفظ في المحفوظات'}"
          >
            <i class="${isSaved ? 'fa-solid fa-heart text-red-500 scale-110' : 'fa-regular fa-heart text-white'} text-base transition-transform"></i>
          </button>
          ${
            !isUserPet
              ? renderThreeDotsMenu({
                  userId: pet.ownerId,
                  userName: pet.ownerName,
                  userAvatar: pet.ownerAvatar,
                  petName: member.name,
                  petId: pet.id,
                  reportTargetType: 'pet',
                  buttonClass:
                    'w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all active:scale-90 cursor-pointer shadow-md',
                  dropdownAlign: 'left',
                })
              : ''
          }
        </div>

        ${
          photos.length > 1
            ? `
              <div
                class="member-gallery-counter absolute bottom-4 left-4 px-3 py-1 rounded-full bg-black/45 backdrop-blur-sm text-white text-xs font-bold z-10 pointer-events-none"
                data-member-counter="${member.petId}"
                dir="ltr"
              >
                ${currentIdx + 1} / ${photos.length}
              </div>

              <div class="absolute bottom-4 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
                ${photos
                  .map(
                    (_, pIdx) => `
                      <button
                        type="button"
                        data-member-dot="${member.petId}"
                        data-member-dot-index="${pIdx}"
                        aria-label="عرض صورة ${pIdx + 1} لـ ${member.name}"
                        class="member-gallery-dot h-2 rounded-full transition-all duration-300 cursor-pointer pointer-events-auto ${
                          currentIdx === pIdx ? 'w-5 bg-brand-orange shadow-sm' : 'w-2 bg-white/80 hover:bg-white'
                        }"
                      ></button>
                    `
                  )
                  .join('')}
              </div>

              <button
                type="button"
                data-member-prev="${member.petId}"
                aria-label="الصورة السابقة"
                class="member-gallery-prev absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 backdrop-blur-md text-white flex items-center justify-center hover:bg-brand-orange transition-all cursor-pointer shadow-md active:scale-90 z-10"
              >
                <i class="fa-solid fa-chevron-right text-xs"></i>
              </button>
              <button
                type="button"
                data-member-next="${member.petId}"
                aria-label="الصورة التالية"
                class="member-gallery-next absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/45 backdrop-blur-md text-white flex items-center justify-center hover:bg-brand-orange transition-all cursor-pointer shadow-md active:scale-90 z-10"
              >
                <i class="fa-solid fa-chevron-left text-xs"></i>
              </button>
            `
            : ''
        }
      </div>

      <!-- Member's Complete Individual Profile Sections + Own Action Buttons -->
      <div class="p-4 sm:p-5 bg-[#FFF9E9] flex flex-col gap-4">
        ${renderIndividualProfileDetails({
          name: member.name,
          species: member.species,
          breed: member.breed,
          hybridBreed: member.hybridBreed,
          ageYears: member.ageYears,
          ageMonths: member.ageMonths,
          color: member.color,
          gender: member.gender,
          vaccinationStatus: member.vaccinationStatus,
          personality: member.personality,
          healthNotes: member.healthNotes,
          locationText,
          statusBadgeLabel: 'للتبني',
          statusBadgeClass: 'bg-brand-orange text-white',
          aboutHeading: `عن ${member.name}`,
          adoptionExtraHtml: extraHtml,
          isGroupMemberCard: true,
        })}

        <!-- Member's Own Action Buttons -->
        <div class="flex items-center gap-2.5 pt-1">
          <button
            type="button"
            data-group-member-nav="${member.petId}"
            class="group-member-nav-btn flex-1 h-12 px-4 rounded-full bg-white border-2 border-brand-peachBorder text-brand-dark hover:border-brand-orange hover:text-brand-orange font-black text-xs sm:text-sm transition-all cursor-pointer active:scale-95 font-baloo flex items-center justify-center gap-2 shadow-sm"
          >
            <i class="fa-solid fa-id-card text-xs text-brand-orange"></i>
            <span>عرض ملف ${member.name}</span>
          </button>
          ${
            !isUserPet && !pet.mustAdoptTogether
              ? `
                <button
                  type="button"
                  data-member-request-id="${member.petId}"
                  class="member-request-adopt-btn flex-1 h-12 px-4 rounded-full bg-brand-orange hover:bg-brand-orangeHover text-white font-black text-xs sm:text-sm transition-all cursor-pointer active:scale-95 font-baloo flex items-center justify-center gap-2 shadow-soft"
                >
                  <i class="fa-solid fa-house-heart text-xs"></i>
                  <span>طلب تبني ${member.name}</span>
                </button>
              `
              : ''
          }
        </div>
      </div>
    </article>
  `;
}

export function renderPetDetailModal(pet: Pet | null): string {
  if (!pet) {
    lastOpenedPetId = null;
    activePhotoIndex = 0;
    isConfirmationDialogOpen = false;
    activeGroupMemberId = 'all';
    pendingRequestMemberId = null;
    return '';
  }

  const isGroupAdoption = pet.status === 'adoption' && pet.adoptionType === 'group';
  const groupMembers = isGroupAdoption ? pet.groupMembers || [] : [];

  if (lastOpenedPetId !== pet.id) {
    lastOpenedPetId = pet.id;
    isConfirmationDialogOpen = false;
    pendingRequestMemberId = null;
    Object.keys(memberPhotoIndices).forEach((k) => delete memberPhotoIndices[k]);
    const focusMemberId = state.getSelectedGroupMemberFocusId();
    if (
      isGroupAdoption &&
      focusMemberId &&
      groupMembers.some((m) => m.petId === focusMemberId)
    ) {
      activeGroupMemberId = focusMemberId;
    } else {
      activeGroupMemberId = 'all';
    }
    activePhotoIndex = 0;
  } else if (
    isGroupAdoption &&
    activeGroupMemberId !== 'all' &&
    !groupMembers.some((m) => m.petId === activeGroupMemberId)
  ) {
    activeGroupMemberId = 'all';
  }

  const selectedMember =
    isGroupAdoption && activeGroupMemberId !== 'all'
      ? groupMembers.find((m) => m.petId === activeGroupMemberId) || null
      : null;

  // Top hero gallery: ONLY selected animal's photos when a name tab is selected; group cover carousel on "الكل"
  const galleryItems: GalleryItem[] = isGroupAdoption
    ? selectedMember
      ? buildMemberGalleryItems(selectedMember)
      : buildGroupCoverGalleryItems(pet)
    : (pet.photos || [])
        .filter((src) => Boolean(src && src.trim()))
        .slice(0, 3)
        .map((url) => ({ url, label: '', kind: 'individual' as const }));

  if (activePhotoIndex >= galleryItems.length) {
    activePhotoIndex = 0;
  }
  const activeItem = galleryItems[activePhotoIndex];
  const activeCaption = activeItem?.label || '';
  const isCollectivePhoto = activeItem?.kind === 'collective';

  const isUserPet = pet.ownerId === state.getUser().id;
  const isMating = pet.status === 'mating';
  const isAdoption = pet.status === 'adoption';
  const isSaved = state.isPetSaved(pet.id);
  const showPhone = state.canRevealPetPhone(pet);
  const locationText = formatPetLocation(pet);

  const hasAdoptionDetails =
    isAdoption &&
    Boolean(
      pet.adoptionType ||
        pet.groupCount ||
        pet.mustAdoptTogether !== undefined ||
        (pet.adoptionReason && pet.adoptionReason.trim())
    );

  const groupCount = pet.groupCount || groupMembers.length || 2;
  const pendingMemberTarget = pendingRequestMemberId
    ? groupMembers.find((m) => m.petId === pendingRequestMemberId) || null
    : null;

  return `
    <!-- Full-Screen Pet Profile View -->
    <div id="pet-detail-modal-backdrop" class="fixed inset-0 z-[70] bg-[#FFF9E9] w-full min-h-[100dvh] overflow-y-auto flex flex-col text-[#2d221b] animate-fade-in" dir="rtl">
      
      <!-- Top Floating Navigation Buttons -->
      <div class="sticky top-0 z-50 w-full max-w-md mx-auto px-4 pt-[max(0.75rem,env(safe-area-inset-top))] flex items-center justify-between pointer-events-none">
        <button
          id="close-pet-detail-btn"
          class="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-brand-orange transition-all active:scale-95 cursor-pointer shadow-md pointer-events-auto"
          aria-label="رجوع"
          type="button"
        >
          <i class="fa-solid fa-arrow-right text-base"></i>
        </button>

        <div class="flex items-center gap-2 pointer-events-auto">
          <button
            id="detail-save-pet-btn"
            data-pet-save-id="${pet.id}"
            class="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all active:scale-95 cursor-pointer shadow-md"
            aria-label="حفظ الأليف"
            type="button"
          >
            <i class="${isSaved ? 'fa-solid fa-heart text-red-500 scale-110' : 'fa-regular fa-heart text-white'} text-base transition-transform"></i>
          </button>
          ${
            !isUserPet
              ? renderThreeDotsMenu({
                  userId: pet.ownerId,
                  userName: pet.ownerName,
                  userAvatar: pet.ownerAvatar,
                  petName: selectedMember ? selectedMember.name : pet.name,
                  petId: pet.id,
                  reportTargetType: 'pet',
                  buttonClass:
                    'w-10 h-10 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/70 transition-all active:scale-95 cursor-pointer shadow-md',
                  dropdownAlign: 'left',
                })
              : ''
          }
        </div>
      </div>

      <!-- Main Profile Scrollable Content -->
      <div class="w-full max-w-md mx-auto -mt-14 pb-32 flex-1 flex flex-col relative z-10 min-w-0">
        
        <!-- 1. Locked-Aspect Photo Gallery (Never stretches vertically regardless of photo proportions) -->
        <div
          id="pet-gallery-viewport"
          class="relative w-full aspect-[4/4.6] bg-[#f3ebdd] overflow-hidden shadow-lg select-none touch-pan-y"
        >
          ${
            galleryItems.length > 0
              ? `
                <div
                  id="pet-gallery-track"
                  dir="ltr"
                  class="absolute inset-0 flex transition-transform duration-300 ease-out will-change-transform"
                  style="transform: translate3d(-${activePhotoIndex * 100}%, 0, 0);"
                >
                  ${galleryItems
                    .map(
                      (item, idx) => `
                        <div class="w-full h-full shrink-0 bg-[#f3ebdd]">
                          <img
                            src="${item.url}"
                            alt="${item.label || `${pet.name} - صورة ${idx + 1}`}"
                            class="w-full h-full object-cover pointer-events-none select-none"
                            draggable="false"
                          />
                        </div>
                      `
                    )
                    .join('')}
                </div>
              `
              : `
                <div class="absolute inset-0 flex items-center justify-center text-[#998b7c]">
                  <i class="fa-solid fa-paw text-5xl"></i>
                </div>
              `
          }

          <!-- Light Bottom-to-Top Dark Gradient Overlay (Consistent & Non-Heavy) -->
          <div class="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none z-[5]"></div>

          ${
            isGroupAdoption && !selectedMember && galleryItems.some((item) => Boolean(item.label))
              ? `
                <div
                  id="pet-gallery-caption"
                  class="absolute bottom-14 right-4 px-3.5 py-1.5 rounded-full backdrop-blur-sm text-white text-xs font-black z-10 pointer-events-none max-w-[65%] truncate ${
                    isCollectivePhoto ? 'bg-brand-orange/90' : 'bg-black/60'
                  }"
                  style="${activeCaption ? '' : 'display: none;'}"
                >
                  ${activeCaption}
                </div>
              `
              : ''
          }

          ${
            galleryItems.length > 1
              ? `
                <!-- Photo Counter Pill -->
                <div
                  id="pet-gallery-counter"
                  class="absolute bottom-14 left-4 px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-sm text-white text-xs font-bold z-10 pointer-events-none"
                  dir="ltr"
                >
                  ${activePhotoIndex + 1} / ${galleryItems.length}
                </div>

                <!-- Dots Indicator -->
                <div
                  id="pet-gallery-dots"
                  class="absolute bottom-14 inset-x-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none"
                >
                  ${galleryItems
                    .map(
                      (_, i) => `
                        <button
                          type="button"
                          data-dot-index="${i}"
                          aria-label="عرض صورة ${i + 1}"
                          class="pet-gallery-dot h-2.5 rounded-full transition-all duration-300 cursor-pointer pointer-events-auto ${
                            activePhotoIndex === i
                              ? 'w-6 bg-brand-orange shadow-sm'
                              : 'w-2.5 bg-white/80 hover:bg-white'
                          }"
                        ></button>
                      `
                    )
                    .join('')}
                </div>

                <!-- Prev / Next Navigation Arrows -->
                <button
                  id="detail-prev-photo-btn"
                  type="button"
                  aria-label="الصورة السابقة"
                  class="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/45 backdrop-blur-md text-white flex items-center justify-center hover:bg-brand-orange transition-all cursor-pointer shadow-md active:scale-90 z-10"
                >
                  <i class="fa-solid fa-chevron-right text-sm"></i>
                </button>
                <button
                  id="detail-next-photo-btn"
                  type="button"
                  aria-label="الصورة التالية"
                  class="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/45 backdrop-blur-md text-white flex items-center justify-center hover:bg-brand-orange transition-all cursor-pointer shadow-md active:scale-90 z-10"
                >
                  <i class="fa-solid fa-chevron-left text-sm"></i>
                </button>
              `
              : ''
          }
        </div>

        <!-- 2. Profile Details Body -->
        <div class="-mt-10 relative z-20 bg-[#FFF9E9] rounded-t-[40px] px-5 pt-6 pb-6 shadow-2xl border-t border-brand-peachBorder/50 flex flex-col gap-5">
          ${
            isGroupAdoption && groupMembers.length > 0
              ? `
                <!-- HORIZONTAL BUBBLE FILTER / TABS STRIP DIRECTLY BELOW PHOTOS -->
                <div
                  id="group-member-tabs-bar"
                  class="bg-white/95 border-2 border-brand-peachBorder/85 rounded-full p-1.5 shadow-sm flex items-center gap-2 overflow-x-auto no-scrollbar"
                >
                  <button
                    type="button"
                    data-group-member-nav="all"
                    class="group-member-nav-btn h-11 px-5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 font-baloo flex items-center gap-1.5 ${
                      activeGroupMemberId === 'all'
                        ? 'bg-brand-orange text-white shadow-soft'
                        : 'bg-[#FFF9E9] border border-brand-peachBorder text-brand-dark hover:border-brand-orange'
                    }"
                  >
                    <i class="fa-solid fa-layer-group text-xs"></i>
                    <span>الكل</span>
                  </button>

                  ${groupMembers
                    .map((member) => {
                      const isSelected = activeGroupMemberId === member.petId;
                      return `
                        <button
                          type="button"
                          data-group-member-nav="${member.petId}"
                          class="group-member-nav-btn h-11 pl-4 pr-1.5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer shrink-0 font-baloo flex items-center gap-2 ${
                            isSelected
                              ? 'bg-brand-orange text-white shadow-soft'
                              : 'bg-[#FFF9E9] border border-brand-peachBorder text-brand-dark hover:border-brand-orange'
                          }"
                        >
                          <img
                            src="${member.individualPhotos?.[0] || pet.photos[0] || ''}"
                            alt="${member.name}"
                            class="w-8 h-8 rounded-full object-cover border border-white/90 shrink-0"
                          />
                          <span>${member.name}</span>
                        </button>
                      `;
                    })
                    .join('')}
                </div>

                ${
                  selectedMember
                    ? `
                      <!-- SELECTED SINGLE ANIMAL: Renders 100% Exact Individual Adoption Profile -->
                      <div class="flex items-center justify-between gap-2 px-4 py-2.5 rounded-full bg-white/90 border border-brand-peachBorder/80 text-xs font-black font-baloo">
                        <span class="text-brand-subtleGray truncate">
                          ضمن إعلان: <strong class="text-brand-dark">${pet.name}</strong>
                        </span>
                        <span class="px-3 py-1 rounded-full shrink-0 ${
                          pet.mustAdoptTogether
                            ? 'bg-[#fff5ea] text-brand-orange border border-brand-orange/35'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }">
                          ${pet.mustAdoptTogether ? 'التبني معاً فقط' : 'متاح منفرداً'}
                        </span>
                      </div>

                      ${renderIndividualProfileDetails({
                        name: selectedMember.name,
                        species: selectedMember.species,
                        breed: selectedMember.breed,
                        hybridBreed: selectedMember.hybridBreed,
                        ageYears: selectedMember.ageYears,
                        ageMonths: selectedMember.ageMonths,
                        color: selectedMember.color,
                        gender: selectedMember.gender,
                        vaccinationStatus: selectedMember.vaccinationStatus,
                        personality: selectedMember.personality,
                        healthNotes: selectedMember.healthNotes,
                        locationText,
                        statusBadgeLabel: 'للتبني',
                        statusBadgeClass: 'bg-brand-orange text-white',
                        aboutHeading: `عن ${selectedMember.name}`,
                        adoptionExtraHtml: `
                          <div class="pt-2.5 border-t border-brand-peachBorder/50 space-y-1.5 text-xs sm:text-sm font-bold text-[#5d4b3d]">
                            <div>نوع التبني: تبني جماعي (${pet.mustAdoptTogether ? 'يُشترط تبني المجموعة كاملة معاً' : 'يمكن التبني منفرداً أو معاً'})</div>
                            ${
                              pet.adoptionReason && pet.adoptionReason.trim()
                                ? `<div>سبب العرض للتبني: ${pet.adoptionReason.trim()}</div>`
                                : ''
                            }
                          </div>
                        `,
                      })}
                    `
                    : `
                      <!-- "الكل" TAB: Compact Group Banner + All Animals Ordered Vertically with Individual Layout -->
                      <div class="bg-white/95 border border-brand-peachBorder/90 rounded-[32px] p-5 shadow-sm space-y-2.5 text-right">
                        <div class="flex items-start justify-between gap-2.5">
                          <div class="min-w-0">
                            <div class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-orange text-white text-xs font-black font-baloo mb-1.5 shadow-sm">
                              <i class="fa-solid fa-people-roof text-[11px]"></i>
                              <span>تبني جماعي • ${groupCount} حيوانات</span>
                            </div>
                            <h1 class="text-2xl sm:text-3xl font-black font-baloo text-brand-dark leading-tight m-0">
                              ${pet.name}
                            </h1>
                            ${
                              locationText
                                ? `
                                  <p class="text-xs sm:text-sm font-bold text-brand-subtleGray flex items-center gap-1.5 mt-1 m-0">
                                    <i class="fa-solid fa-location-dot text-brand-orange text-sm"></i>
                                    <span>${locationText}</span>
                                  </p>
                                `
                                : ''
                            }
                          </div>

                          <div class="px-4 py-2 rounded-full border-2 shadow-sm font-baloo font-black text-xs sm:text-sm shrink-0 text-center ${
                            pet.mustAdoptTogether
                              ? 'bg-[#fff5ea] border-brand-orange/40 text-brand-orange'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                          }">
                            ${pet.mustAdoptTogether ? 'التبني معاً فقط' : 'منفرداً متاح'}
                          </div>
                        </div>

                        ${
                          pet.adoptionReason && pet.adoptionReason.trim()
                            ? `
                              <p class="text-xs sm:text-sm font-semibold text-[#5d4b3d] leading-relaxed pt-2 border-t border-brand-peachBorder/50 m-0">
                                ${pet.adoptionReason.trim()}
                              </p>
                            `
                            : ''
                        }
                      </div>

                      <!-- All Group Members Stacked Cleanly (Each with its Own Photos, Data & Actions) -->
                      <div class="space-y-6">
                        ${groupMembers
                          .map((member, index) =>
                            renderGroupMemberIndividualCard(
                              pet,
                              member,
                              index,
                              groupMembers.length,
                              locationText,
                              isUserPet,
                              isSaved
                            )
                          )
                          .join('')}
                      </div>
                    `
                }
              `
              : renderIndividualProfileDetails({
                  name: pet.name,
                  species: pet.species,
                  breed: pet.breed,
                  hybridBreed: pet.hybridBreed,
                  ageYears: pet.ageYears,
                  ageMonths: pet.ageMonths,
                  color: pet.color,
                  gender: pet.gender,
                  vaccinationStatus: pet.vaccinationStatus,
                  personality: pet.personality,
                  healthNotes: pet.healthNotes,
                  locationText,
                  statusBadgeLabel: isMating ? 'للزواج' : isAdoption ? 'للتبني' : 'أليف شخصي',
                  statusBadgeClass:
                    isMating || isAdoption
                      ? 'bg-brand-orange text-white'
                      : 'bg-[#f3ebdd] text-[#2d221b]',
                  aboutHeading: `عن ${pet.name}`,
                  adoptionExtraHtml: hasAdoptionDetails
                    ? `
                      <div class="pt-2.5 border-t border-brand-peachBorder/50 space-y-1.5 text-xs sm:text-sm font-bold text-[#5d4b3d]">
                        ${
                          pet.adoptionType === 'individual'
                            ? `<div>نوع التبني: فردي</div>`
                            : pet.adoptionType === 'group'
                            ? `<div>نوع التبني: جماعي</div>`
                            : ''
                        }
                        ${
                          pet.adoptionReason && pet.adoptionReason.trim()
                            ? `<div>سبب العرض للتبني: ${pet.adoptionReason.trim()}</div>`
                            : ''
                        }
                      </div>
                    `
                    : '',
                })
          }

          <!-- 5. Owner Info Card (Displayed once) -->
          <div class="bg-white/90 border border-brand-peachBorder/90 rounded-[32px] p-5 shadow-sm flex items-center justify-between gap-3 text-right">
            <div class="min-w-0 flex-1">
              <h4 class="text-lg sm:text-xl font-black font-baloo text-brand-dark truncate m-0">
                ${pet.ownerName}
              </h4>
              ${
                locationText
                  ? `<p class="text-xs sm:text-sm font-bold text-brand-subtleGray mt-1 m-0">${locationText}</p>`
                  : ''
              }
              ${
                showPhone && pet.ownerPhone
                  ? `<p class="text-xs sm:text-sm font-bold text-emerald-600 mt-1 font-mono" dir="ltr">${pet.ownerPhone}</p>`
                  : `<p class="text-[11px] font-bold text-brand-subtleGray mt-1 flex items-center gap-1 m-0"><i class="fa-solid fa-shield-halved text-brand-orange text-[10px]"></i><span>رقم الهاتف مخفي وفق إعدادات الخصوصية</span></p>`
              }
            </div>

            <div class="flex items-center gap-1.5 text-xs sm:text-sm font-black font-baloo text-brand-orange bg-[#fff5ea] border border-brand-orange/30 px-4 py-2 rounded-full shrink-0">
              <span>مالك</span>
              <i class="fa-solid fa-chevron-left text-[10px]"></i>
            </div>
          </div>

        </div>

      </div>

      <!-- 6. Fixed Bottom Action Bar -->
      <footer class="fixed bottom-0 inset-x-0 z-40 bg-[#FFF9E9]/95 backdrop-blur-md border-t border-brand-peachBorder/60 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] shadow-2xl">
        <div class="max-w-md mx-auto">
          ${
            !isUserPet
              ? `
              <button
                id="modal-open-confirmation-btn"
                type="button"
                class="w-full h-14 px-5 rounded-full bg-brand-orange hover:bg-brand-orangeHover text-white font-black text-base sm:text-lg shadow-soft transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer active:scale-95 font-baloo"
              >
                ${
                  isMating
                    ? `
                      <svg
                        viewBox="0 0 84 56"
                        class="w-11 h-7 shrink-0 text-white"
                        fill="none"
                        aria-hidden="true"
                      >
                        <!-- هالة قلب دافئة داخل التقاء الذيلين -->
                        <path d="M42 16c-2.6-4.4-9.4-3.8-10.8 1.2-1.4 4.8 4 10.6 10.8 15.8 6.8-5.2 12.2-11 10.8-15.8-1.4-5-8.2-5.6-10.8-1.2Z" fill="#FFE082" fill-opacity="0.28"/>
                        <!-- القط الأيسر (جالس من الخلف) -->
                        <path d="M13 24l1.2-8.2 5.2 4c1-.3 2.2-.3 3.2 0l5.2-4 1.2 8.2a9 9 0 0 1 1 11.4c1.2 2.4 1.6 5.2 1.2 8-.6 4.4-4.2 7.6-10.2 7.6s-9.6-3.2-10.2-7.6c-.4-2.8 0-5.6 1.2-8A9 9 0 0 1 13 24Z" fill="currentColor"/>
                        <path d="M14.2 31.4c4.5 1.4 9.1 1.4 13.6 0" stroke="#E67E22" stroke-width="1.9" stroke-linecap="round"/>
                        <!-- القط الأيمن (جالس من الخلف) -->
                        <path d="M55 24l1.2-8.2 5.2 4c1-.3 2.2-.3 3.2 0l5.2-4 1.2 8.2a9 9 0 0 1 1 11.4c1.2 2.4 1.6 5.2 1.2 8-.6 4.4-4.2 7.6-10.2 7.6s-9.6-3.2-10.2-7.6c-.4-2.8 0-5.6 1.2-8A9 9 0 0 1 55 24Z" fill="currentColor"/>
                        <path d="M56.2 31.4c4.5 1.4 9.1 1.4 13.6 0" stroke="#E67E22" stroke-width="1.9" stroke-linecap="round"/>
                        <!-- ذيلا القطين يمتدان من الأسفل ويلتفان من الأعلى ليشكلا قلباً واضحاً -->
                        <path d="M27 44.5c5.8 0 11.5-4 15-8.5" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>
                        <path d="M57 44.5c-5.8 0-11.5-4-15-8.5" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>
                        <path d="M42 36c-7.5-4.5-13.5-10.5-13.5-17.2 0-5.2 4-8.8 8.3-8.8 2.6 0 4.3 1.4 5.2 3.8.9-2.4 2.6-3.8 5.2-3.8 4.3 0 8.3 3.6 8.3 8.8 0 6.7-6 12.7-13.5 17.2Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
                        <!-- قلب مضيء مركزي بين الذيلين -->
                        <path d="M42 18.2c-1.8-3-6.4-2.6-7.4.8-1 3.3 2.7 7.2 7.4 10.8 4.7-3.6 8.4-7.5 7.4-10.8-1-3.4-5.6-3.8-7.4-.8Z" fill="#FFE082"/>
                      </svg>
                      <span>وفّق ديلين في الحلال</span>
                    `
                    : selectedMember && !pet.mustAdoptTogether
                    ? `
                      <i class="fa-solid fa-house-heart text-xl shrink-0"></i>
                      <span>طلب تبني ${selectedMember.name}</span>
                    `
                    : `
                      <i class="fa-solid fa-house-heart text-xl shrink-0"></i>
                      <span>طلب التبني</span>
                    `
                }
              </button>
              `
              : `
              <div class="w-full h-12 rounded-full bg-brand-cream/85 border-2 border-brand-peachBorder flex items-center justify-center text-xs sm:text-sm font-black text-brand-orange font-baloo">
                ${isGroupAdoption ? 'هذا الإعلان الجماعي مسجل ضمن حسابك الشخصي 👑' : 'هذا الأليف مسجل ضمن حسابك الشخصي 👑'}
              </div>
              `
          }
        </div>
      </footer>

      <!-- Confirmation / Request Dialog Popup -->
      ${
        isConfirmationDialogOpen
          ? `
          <div id="confirmation-dialog-backdrop" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" dir="rtl">
            <div class="bg-white w-full max-w-sm rounded-t-[32px] rounded-b-none sm:rounded-[34px] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6 shadow-2xl border-2 border-b-0 sm:border-b-2 border-brand-peachBorder space-y-4 animate-slide-up text-right">
              
              <div class="flex items-center gap-3 pb-3 border-b border-brand-peachBorder/40">
                <div class="w-12 h-12 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center text-2xl shrink-0">
                  <i class="fa-solid fa-comments"></i>
                </div>
                <div>
                  <h3 class="text-lg font-black font-baloo text-brand-dark leading-tight m-0">
                    ${
                      isMating
                        ? 'إرسال طلب تزاوج'
                        : pendingMemberTarget
                        ? `إرسال طلب تبني (${pendingMemberTarget.name})`
                        : isGroupAdoption
                        ? 'إرسال طلب تبني جماعي'
                        : 'إرسال طلب تبني'
                    }
                  </h3>
                  <p class="text-xs font-bold text-brand-subtleGray m-0">تواصل مباشر وآمن مع المالك</p>
                </div>
              </div>

              <p class="text-xs sm:text-sm font-semibold text-brand-dark/90 leading-relaxed">
                سيتم إرسال إشعار وفتح محادثة مباشرة مع <strong class="text-brand-orange">${pet.ownerName}</strong> بخصوص <strong class="text-brand-orange">${
                  pendingMemberTarget ? `${pendingMemberTarget.name} (ضمن ${pet.name})` : pet.name
                }</strong>${
                  !pendingMemberTarget && isGroupAdoption && groupMembers.length > 0
                    ? ` (${groupMembers.map((m) => m.name).join('، ')} — ${
                        pet.mustAdoptTogether ? 'تبني المجموعة كاملة معاً' : 'إمكانية التبني معاً أو منفرداً'
                      })`
                    : ''
                }.
              </p>

              <div class="grid grid-cols-2 gap-3 pt-2">
                <button
                  id="confirm-send-request-btn"
                  type="button"
                  class="h-[52px] rounded-full bg-brand-orange text-white font-black text-sm sm:text-base shadow-soft hover:bg-brand-orangeHover transition-all active:scale-95 cursor-pointer font-baloo"
                >
                  تأكيد وإرسال ✓
                </button>
                <button
                  id="cancel-confirmation-btn"
                  type="button"
                  class="h-[52px] rounded-full bg-white border-2 border-brand-peachBorder text-brand-dark font-black text-sm sm:text-base hover:bg-brand-peachBorder/20 transition-all active:scale-95 cursor-pointer font-baloo"
                >
                  إلغاء
                </button>
              </div>

            </div>
          </div>
          `
          : ''
      }

    </div>
  `;
}

function rerenderPetDetailModalInPlace(pet: Pet, scrollToTop = false): void {
  const existingBackdrop = document.getElementById('pet-detail-modal-backdrop');
  if (!existingBackdrop) {
    state.setSelectedPetForDetail(
      pet,
      activeGroupMemberId === 'all' ? null : activeGroupMemberId
    );
    return;
  }

  const prevScrollTop = existingBackdrop.scrollTop;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = renderPetDetailModal(pet).trim();
  const nextBackdrop = wrapper.firstElementChild as HTMLElement | null;
  if (!nextBackdrop) return;

  existingBackdrop.replaceWith(nextBackdrop);
  nextBackdrop.scrollTop = scrollToTop ? 0 : prevScrollTop;
  attachPetDetailModalEvents(pet);
  attachThreeDotsMenuEvents(nextBackdrop);
}

export function attachPetDetailModalEvents(pet: Pet | null): void {
  if (!pet) return;

  const isGroupAdoption = pet.status === 'adoption' && pet.adoptionType === 'group';
  const groupMembers = isGroupAdoption ? pet.groupMembers || [] : [];
  const selectedMember =
    isGroupAdoption && activeGroupMemberId !== 'all'
      ? groupMembers.find((m) => m.petId === activeGroupMemberId) || null
      : null;

  const galleryItems: GalleryItem[] = isGroupAdoption
    ? selectedMember
      ? buildMemberGalleryItems(selectedMember)
      : buildGroupCoverGalleryItems(pet)
    : (pet.photos || [])
        .filter((src) => Boolean(src && src.trim()))
        .slice(0, 3)
        .map((url) => ({ url, label: '', kind: 'individual' as const }));
  const photoCount = galleryItems.length;

  const closeBtn = document.getElementById('close-pet-detail-btn');
  const handleClose = () => {
    activePhotoIndex = 0;
    lastOpenedPetId = null;
    isConfirmationDialogOpen = false;
    activeGroupMemberId = 'all';
    pendingRequestMemberId = null;
    state.setSelectedPetForDetail(null);
  };

  if (closeBtn) closeBtn.addEventListener('click', handleClose);

  // Save Heart Buttons (Top Floating + Any Independent Member Card Save Button)
  const saveBtn = document.getElementById('detail-save-pet-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.toggleSavePet(pet.id);
    });
  }
  document.querySelectorAll<HTMLButtonElement>('.member-card-save-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.toggleSavePet(pet.id);
    });
  });

  // Top Hero Photo Gallery Controller (no rebuild needed)
  const viewport = document.getElementById('pet-gallery-viewport');
  const track = document.getElementById('pet-gallery-track');
  const counterEl = document.getElementById('pet-gallery-counter');
  const captionEl = document.getElementById('pet-gallery-caption');
  const dotBtns = document.querySelectorAll<HTMLButtonElement>('.pet-gallery-dot');
  const prevBtn = document.getElementById('detail-prev-photo-btn');
  const nextBtn = document.getElementById('detail-next-photo-btn');

  const syncGalleryUI = (animate = true) => {
    if (!track) return;
    track.style.transition = animate ? '' : 'none';
    track.style.transform = `translate3d(-${activePhotoIndex * 100}%, 0, 0)`;
    if (counterEl && photoCount > 0) {
      counterEl.textContent = `${activePhotoIndex + 1} / ${photoCount}`;
    }
    if (captionEl) {
      const current = galleryItems[activePhotoIndex];
      const nextLabel = current?.label || '';
      captionEl.textContent = nextLabel;
      captionEl.style.display = nextLabel ? '' : 'none';
      captionEl.className = `absolute bottom-14 right-4 px-3.5 py-1.5 rounded-full backdrop-blur-sm text-white text-xs font-black z-10 pointer-events-none max-w-[65%] truncate ${
        current?.kind === 'collective' ? 'bg-brand-orange/90' : 'bg-black/60'
      }`;
    }
    dotBtns.forEach((dot, idx) => {
      dot.className =
        idx === activePhotoIndex
          ? 'pet-gallery-dot h-2.5 rounded-full transition-all duration-300 cursor-pointer pointer-events-auto w-6 bg-brand-orange shadow-sm'
          : 'pet-gallery-dot h-2.5 rounded-full transition-all duration-300 cursor-pointer pointer-events-auto w-2.5 bg-white/80 hover:bg-white';
    });
  };

  const goToPhoto = (targetIdx: number) => {
    if (photoCount <= 1) return;
    activePhotoIndex = (targetIdx + photoCount) % photoCount;
    syncGalleryUI(true);
  };

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToPhoto(activePhotoIndex - 1);
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      goToPhoto(activePhotoIndex + 1);
    });
  }
  dotBtns.forEach((dot) => {
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      const idxStr = dot.getAttribute('data-dot-index');
      if (idxStr !== null) {
        const idx = parseInt(idxStr, 10);
        if (!Number.isNaN(idx)) goToPhoto(idx);
      }
    });
  });

  // Group Adoption Filter Tabs ("الكل" | Individual Animal Names) — Instant In-Place Switch Without Full Page Reload
  if (isGroupAdoption && groupMembers.length > 0) {
    const switchMemberFocus = (nextId: string | 'all') => {
      activeGroupMemberId = nextId;
      activePhotoIndex = 0;
      pendingRequestMemberId = null;
      state.setSelectedGroupMemberFocusId(nextId === 'all' ? null : nextId);
      rerenderPetDetailModalInPlace(pet, true);
    };

    document.querySelectorAll<HTMLButtonElement>('.group-member-nav-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const target = btn.getAttribute('data-group-member-nav');
        if (target) {
          switchMemberFocus(target === 'all' ? 'all' : target);
        }
      });
    });

    // Per-Animal Dedicated Photo Carousels inside "الكل" View
    groupMembers.forEach((member) => {
      const mPhotos = (member.individualPhotos || []).map((u) => u.trim()).filter(Boolean);
      const mCount = mPhotos.length;
      if (mCount <= 1) return;

      const mViewport = document.querySelector<HTMLElement>(`[data-member-gallery="${member.petId}"]`);
      const mTrack = document.querySelector<HTMLElement>(`[data-member-track="${member.petId}"]`);
      const mCounter = document.querySelector<HTMLElement>(`[data-member-counter="${member.petId}"]`);
      const mDots = document.querySelectorAll<HTMLButtonElement>(`[data-member-dot="${member.petId}"]`);
      const mPrev = document.querySelector<HTMLButtonElement>(`[data-member-prev="${member.petId}"]`);
      const mNext = document.querySelector<HTMLButtonElement>(`[data-member-next="${member.petId}"]`);

      const syncMemberGallery = (nextIdx: number) => {
        const idx = (nextIdx + mCount) % mCount;
        memberPhotoIndices[member.petId] = idx;
        if (mTrack) {
          mTrack.style.transition = '';
          mTrack.style.transform = `translate3d(-${idx * 100}%, 0, 0)`;
        }
        if (mCounter) {
          mCounter.textContent = `${idx + 1} / ${mCount}`;
        }
        mDots.forEach((dot, dIdx) => {
          dot.className =
            dIdx === idx
              ? 'member-gallery-dot h-2 rounded-full transition-all duration-300 cursor-pointer pointer-events-auto w-5 bg-brand-orange shadow-sm'
              : 'member-gallery-dot h-2 rounded-full transition-all duration-300 cursor-pointer pointer-events-auto w-2 bg-white/80 hover:bg-white';
        });
      };

      if (mViewport && mTrack) {
        attachHorizontalCarouselSwipe({
          viewport: mViewport,
          track: mTrack,
          count: mCount,
          getIndex: () => memberPhotoIndices[member.petId] || 0,
          onChangeIndex: (idx) => syncMemberGallery(idx),
          onSync: () => syncMemberGallery(memberPhotoIndices[member.petId] || 0),
        });
      }

      if (mPrev) {
        mPrev.addEventListener('click', (e) => {
          e.stopPropagation();
          syncMemberGallery((memberPhotoIndices[member.petId] || 0) - 1);
        });
      }
      if (mNext) {
        mNext.addEventListener('click', (e) => {
          e.stopPropagation();
          syncMemberGallery((memberPhotoIndices[member.petId] || 0) + 1);
        });
      }
      mDots.forEach((dot) => {
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          const idxStr = dot.getAttribute('data-member-dot-index');
          if (idxStr !== null) {
            const idx = parseInt(idxStr, 10);
            if (!Number.isNaN(idx)) syncMemberGallery(idx);
          }
        });
      });
    });

    // Individual "طلب تبني [الاسم]" buttons on member cards when adopting individually is allowed
    document.querySelectorAll<HTMLButtonElement>('.member-request-adopt-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetMemberId = btn.getAttribute('data-member-request-id');
        pendingRequestMemberId = targetMemberId || null;
        isConfirmationDialogOpen = true;
        rerenderPetDetailModalInPlace(pet, false);
      });
    });
  }

  // Touch swipe & pointer drag on top gallery viewport
  if (viewport && track && photoCount > 1) {
    let startX = 0;
    let startY = 0;
    let deltaX = 0;
    let isDragging = false;
    let isHorizontalSwipe = false;

    const beginDrag = (x: number, y: number) => {
      startX = x;
      startY = y;
      deltaX = 0;
      isDragging = true;
      isHorizontalSwipe = false;
      track.style.transition = 'none';
    };

    const moveDrag = (x: number, y: number) => {
      if (!isDragging) return;
      const dx = x - startX;
      const dy = y - startY;
      if (!isHorizontalSwipe) {
        if (Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
          isHorizontalSwipe = true;
        } else if (Math.abs(dy) > 10) {
          isDragging = false;
          syncGalleryUI(true);
          return;
        }
      }
      if (isHorizontalSwipe) {
        deltaX = dx;
        const width = viewport.clientWidth || 1;
        const atLeftEdge = activePhotoIndex === 0 && deltaX > 0;
        const atRightEdge = activePhotoIndex === photoCount - 1 && deltaX < 0;
        const dampedDx = atLeftEdge || atRightEdge ? deltaX * 0.32 : deltaX;
        const pctOffset = (dampedDx / width) * 100;
        track.style.transform = `translate3d(calc(-${activePhotoIndex * 100}% + ${pctOffset}%), 0, 0)`;
      }
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      const threshold = Math.min(50, (viewport.clientWidth || 300) * 0.14);
      if (isHorizontalSwipe && Math.abs(deltaX) > threshold) {
        if (deltaX < 0) {
          activePhotoIndex = Math.min(photoCount - 1, activePhotoIndex + 1);
        } else {
          activePhotoIndex = Math.max(0, activePhotoIndex - 1);
        }
      }
      syncGalleryUI(true);
    };

    viewport.addEventListener(
      'touchstart',
      (e) => {
        if (e.touches.length === 1) {
          beginDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
      { passive: true }
    );
    viewport.addEventListener(
      'touchmove',
      (e) => {
        if (e.touches.length === 1) {
          moveDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
      { passive: true }
    );
    viewport.addEventListener('touchend', endDrag, { passive: true });
    viewport.addEventListener('touchcancel', endDrag, { passive: true });

    const onDocMouseMove = (e: MouseEvent) => {
      if (isDragging) moveDrag(e.clientX, e.clientY);
    };
    const onDocMouseUp = () => {
      if (isDragging) endDrag();
      document.removeEventListener('mousemove', onDocMouseMove);
      document.removeEventListener('mouseup', onDocMouseUp);
    };
    viewport.addEventListener('mousedown', (e) => {
      if ((e.target as HTMLElement)?.closest('button')) return;
      beginDrag(e.clientX, e.clientY);
      document.addEventListener('mousemove', onDocMouseMove);
      document.addEventListener('mouseup', onDocMouseUp);
    });
  }

  // Open Confirmation Dialog (Footer CTA)
  const openConfirmBtn = document.getElementById('modal-open-confirmation-btn');
  if (openConfirmBtn) {
    openConfirmBtn.addEventListener('click', () => {
      pendingRequestMemberId =
        isGroupAdoption && !pet.mustAdoptTogether && selectedMember ? selectedMember.petId : null;
      isConfirmationDialogOpen = true;
      rerenderPetDetailModalInPlace(pet, false);
    });
  }

  // Cancel Confirmation Dialog
  const cancelConfirmBtn = document.getElementById('cancel-confirmation-btn');
  const confirmBackdrop = document.getElementById('confirmation-dialog-backdrop');
  const handleCancelConfirmation = () => {
    isConfirmationDialogOpen = false;
    pendingRequestMemberId = null;
    rerenderPetDetailModalInPlace(pet, false);
  };

  if (cancelConfirmBtn) cancelConfirmBtn.addEventListener('click', handleCancelConfirmation);
  if (confirmBackdrop) {
    confirmBackdrop.addEventListener('click', (e) => {
      if (e.target === confirmBackdrop) handleCancelConfirmation();
    });
  }

  // Confirm and Send Request
  const confirmSendBtn = document.getElementById('confirm-send-request-btn');
  if (confirmSendBtn) {
    confirmSendBtn.addEventListener('click', () => {
      const requestedMember = pendingRequestMemberId
        ? groupMembers.find((m) => m.petId === pendingRequestMemberId) || null
        : null;
      isConfirmationDialogOpen = false;
      activeGroupMemberId = 'all';
      pendingRequestMemberId = null;
      state.setSelectedPetForDetail(null);
      const message =
        pet.status === 'mating'
          ? `السلام عليكم، أود التنسيق معكم بخصوص تزاوج أليفي مع ${pet.name}.`
          : requestedMember
          ? `السلام عليكم، أود تقديم طلب لتبني «${requestedMember.name}» من مجموعة «${pet.name}».`
          : isGroupAdoption && groupMembers.length > 0
          ? `السلام عليكم، أود تقديم طلب للتبني الجماعي «${pet.name}» (${groupMembers
              .map((m) => m.name)
              .join('، ')}).`
          : `السلام عليكم، أود تقديم طلب لتبني ${pet.name}.`;

      state.sendContactRequest(pet, message);
      state.setCurrentTab('chat');
    });
  }
}
