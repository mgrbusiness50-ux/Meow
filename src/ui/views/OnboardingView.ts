import { state, OnboardingStep } from '../../state.ts';
import {
  EGYPT_GOVERNORATES_CITIES,
  getGovernorates,
  getMarkazesForGovernorate,
  getCitiesForMarkaz,
  getVillagesForCity,
  getGeoNodeById,
  resolveLocationLineage,
  GeoNode,
  CAT_BREEDS,
  DOG_BREEDS,
} from '../../data/egyptLocations.ts';
import {
  renderSearchableSelect,
  attachSearchableSelect,
  SearchableOption,
  SearchableSelectController,
} from '../components/SearchableSelect.ts';
import {
  RECOVERY_OTP_COOLDOWN_SECONDS,
  resendSignUpConfirmationEmail,
  sendPasswordRecoveryOtp,
  signInWithEmailPassword,
  signInWithGoogleSupabaseOAuth,
  signUpWithEmailPassword,
  updateSupabasePassword,
  verifyPasswordRecoveryOtp,
} from '../../services/supabaseAuthService.ts';
import { validateEgyptianMobile } from '../../utils/validation.ts';
import {
  SAFE_FALLBACK_PET_SVG,
  escapeAttr,
  escapeHtml,
  sanitizeImageSrc,
  validateUploadedFile,
} from '../../utils/sanitize.ts';

const SPLASH_LOGO_URL = '/assets/meow-logo.png';

const MASCOT_IMG_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBjCmSu0xDxJXyrHUBK1tLOi3THUHNrBykChM-wCkfFmb7-SylOoi2gZy7q_0EhekEOoSWaq1XAW437WsLx2Q-8LdB5VeHq3alZjh5JUU5lAdHpKERnUOvvsVZHitTZTkE0WfQaUjnb15I4u4ZRg-k6nKAGaMLGRGvlkBmmux8JCsxfcFhuyG6PsA2X6yQCLhFb6xjiq2en0tv84Rc-_1K1_Iz8Ksk-G_oCqvhJR4epnBXI3Nb8P4VJGtYl5QeTGeaj';

const WELCOME_LOGO_URL = '/assets/meow-logo.png';

const HAS_PET_IMG_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDkbGNMk8BmUCkQwfJzMRgVLJ6YM4ZQ2xa1Kx7XTjZmZOxi7v4fKZlOLD_AbvHf4xoMJyUQrj-e2KOl1quHveOGec2YsESHyr1RnDqxUrz_GAW3ONfw1SQOvqYyw0BXrQAhejT3PFjgSGvfBdn5XqRlC9nQtG4cpsMao_3MPClhD_-dqZwCURM7xLoaVj5YB4ibED4FGnoq6fxYLGSa6XdpXLFPA--BuLrBVFjS1E5bd2S7y1VFJ5mi';

// 27 Egyptian Governorates and Cities Data
export const EGYPT_DATA: Record<string, string[]> = EGYPT_GOVERNORATES_CITIES;

export const PERSONALITY_TRAITS = [
  'مجرم',
  'حرامي',
  'شحات',
  'متسول',
  'عبيط',
  'تعبان في دماغه',
  'لئيم / لئيمة',
  'ذكي',
  'غيبوبة',
  'متمرد',
  'مجنون',
  'هادئ',
  'لطيف',
  'مرح',
  'شجاع',
  'مخلص',
  'نشيط',
  'اجتماعي',
];

let lastRenderedStep: OnboardingStep | null = null;
let authMode: 'login' | 'signup' = 'signup';
let authSubView: 'main' | 'forgot_password' | 'forgot_otp' = 'main';
let authEmail = '';
let authPassword = '';
let showAuthPassword = false;
let authNewPassword = '';
let authConfirmPassword = '';
let showRecoveryPassword = false;
let recoveryOtpCode = '';
let recoveryResendSeconds = 0;
let recoveryCooldownTimer: ReturnType<typeof setInterval> | null = null;
let pendingConfirmationEmail = '';
let isTermsAccepted = false;
let isAuthSubmitting = false;
let isGoogleSubmitting = false;
let isContinuingAuth = false;
let isResendingConfirmation = false;
let isSendingRecovery = false;
let isVerifyingOtp = false;
let isResendingRecoveryOtp = false;
let isUpdatingPassword = false;
let authErrorMessage = '';
let authSuccessMessage = '';
let isSavingOwnerDetails = false;
let isCompletingOnboarding = false;
let hasSavedOnboardingPet = false;
let hasPetErrorMessage = '';

function stopRecoveryCooldownTimer(): void {
  if (recoveryCooldownTimer !== null) {
    clearInterval(recoveryCooldownTimer);
    recoveryCooldownTimer = null;
  }
  recoveryResendSeconds = 0;
}

function startRecoveryCooldown(seconds = RECOVERY_OTP_COOLDOWN_SECONDS): void {
  stopRecoveryCooldownTimer();
  recoveryResendSeconds = seconds;
  recoveryCooldownTimer = setInterval(() => {
    if (recoveryResendSeconds <= 1) {
      stopRecoveryCooldownTimer();
    } else {
      recoveryResendSeconds -= 1;
    }
    const resendBtn = document.getElementById(
      'btn-resend-recovery-otp'
    ) as HTMLButtonElement | null;
    if (resendBtn && !isResendingRecoveryOtp) {
      resendBtn.disabled = recoveryResendSeconds > 0;
      resendBtn.textContent =
        recoveryResendSeconds > 0
          ? `إعادة إرسال الرمز (${recoveryResendSeconds} ث)`
          : 'إعادة إرسال رمز التحقق';
      if (recoveryResendSeconds > 0) {
        resendBtn.classList.add('opacity-65', 'cursor-not-allowed');
        resendBtn.classList.remove('cursor-pointer');
      } else {
        resendBtn.classList.remove('opacity-65', 'cursor-not-allowed');
        resendBtn.classList.add('cursor-pointer');
      }
    }
  }, 1000);
}

interface OwnerDetailsFormValues {
  name: string;
  phone: string;
  gender: 'male' | 'female' | null;
  govId: string;
  markazId: string;
  cityId: string;
  villageId: string;
}

const onboardingOwnerFormState: OwnerDetailsFormValues = {
  name: '',
  phone: '',
  gender: null,
  govId: '',
  markazId: '',
  cityId: '',
  villageId: '',
};

const editOwnerFormState: OwnerDetailsFormValues = {
  name: '',
  phone: '',
  gender: null,
  govId: '',
  markazId: '',
  cityId: '',
  villageId: '',
};
let isEditOwnerDraftActive = false;

let selectedPetSpecies: 'cat' | 'dog' | null = null;
let selectedPetGender: 'male' | 'female' | null = null;
let selectedVaccination: 'yes' | 'no' | null = null;
let draftPetName = '';
let draftPetColor = '';
let draftPetBreed = '';
let draftPetHybrid = '';
let draftPetAgeYears = '';
let draftPetAgeMonths = '';
let draftPetNotes = '';
const selectedTraits: Set<string> = new Set();
const uploadedPetPhotos: (string | null)[] = [null, null, null];

function resetTransientAuthState(opts?: { preserveMessages?: boolean }): void {
  authSubView = 'main';
  authPassword = '';
  showAuthPassword = false;
  authNewPassword = '';
  authConfirmPassword = '';
  showRecoveryPassword = false;
  recoveryOtpCode = '';
  stopRecoveryCooldownTimer();
  isTermsAccepted = false;
  isAuthSubmitting = false;
  isGoogleSubmitting = false;
  isContinuingAuth = false;
  isResendingConfirmation = false;
  isSendingRecovery = false;
  isVerifyingOtp = false;
  isResendingRecoveryOtp = false;
  isUpdatingPassword = false;
  if (!opts?.preserveMessages) {
    authEmail = '';
    pendingConfirmationEmail = '';
    authErrorMessage = '';
    authSuccessMessage = '';
  }
  state.setTermsAccepted(false, true);
}

function resetTransientFormState(): void {
  onboardingOwnerFormState.name = '';
  onboardingOwnerFormState.phone = '';
  onboardingOwnerFormState.gender = null;
  onboardingOwnerFormState.govId = '';
  onboardingOwnerFormState.markazId = '';
  onboardingOwnerFormState.cityId = '';
  onboardingOwnerFormState.villageId = '';
  isSavingOwnerDetails = false;
  isCompletingOnboarding = false;
  hasSavedOnboardingPet = false;
  hasPetErrorMessage = '';

  selectedPetSpecies = null;
  selectedPetGender = null;
  selectedVaccination = null;
  draftPetName = '';
  draftPetColor = '';
  draftPetBreed = '';
  draftPetHybrid = '';
  draftPetAgeYears = '';
  draftPetAgeMonths = '';
  draftPetNotes = '';
  selectedTraits.clear();
  uploadedPetPhotos[0] = null;
  uploadedPetPhotos[1] = null;
  uploadedPetPhotos[2] = null;
}

function syncOnboardingOwnerDraftIfEmpty(): void {
  const user = state.getUser();
  if (!user) return;
  if (
    onboardingOwnerFormState.name ||
    onboardingOwnerFormState.phone ||
    onboardingOwnerFormState.gender ||
    onboardingOwnerFormState.govId
  ) {
    return;
  }

  const lineage = resolveLocationLineage({
    governorateId: user.governorateId,
    markazId: user.markazId,
    cityId: user.cityId,
    villageId: user.villageId,
    locationId: user.locationId,
    governorate: user.governorate,
    markaz: user.markaz,
    city: user.city,
    village: user.village,
  });

  onboardingOwnerFormState.name = user.name || '';
  onboardingOwnerFormState.phone = user.phone ? formatOwnerPhoneForInput(user.phone) : '';
  onboardingOwnerFormState.gender =
    user.gender === 'female' ? 'female' : user.gender === 'male' ? 'male' : null;
  onboardingOwnerFormState.govId = lineage.governorate?.id || user.governorateId || '';
  onboardingOwnerFormState.markazId = lineage.markaz?.id || user.markazId || '';
  onboardingOwnerFormState.cityId = lineage.city?.id || user.cityId || '';
  onboardingOwnerFormState.villageId = lineage.village?.id || user.villageId || '';
}


function getPetNameTextColorClass(gender: 'male' | 'female' | null): string {
  if (gender === 'male') return 'text-[#60A5FA]';
  if (gender === 'female') return 'text-[#F472B6]';
  return 'text-[#1a1612]';
}

export function renderOnboardingView(): string {
  const step = state.getOnboardingStep();

  if (step !== lastRenderedStep) {
    const previousStep = lastRenderedStep;
    lastRenderedStep = step;
    if (step === 'auth_method') {
      if (state.isSupabasePasswordRecovery()) {
        resetTransientAuthState({ preserveMessages: true });
      } else if (previousStep === 'completed') {
        authMode = 'login';
        resetTransientAuthState();
        resetTransientFormState();
        authSuccessMessage = 'تم تسجيل الخروج بنجاح. يمكنك تسجيل الدخول أو إنشاء حساب جديد.';
      } else {
        authMode = 'signup';
        resetTransientAuthState();
        resetTransientFormState();
      }
    } else {
      stopRecoveryCooldownTimer();
      if (step === 'splash') {
        authMode = 'signup';
        resetTransientAuthState();
        resetTransientFormState();
      } else if (step === 'owner_details') {
        isGoogleSubmitting = false;
        syncOnboardingOwnerDraftIfEmpty();
      }
    }
    if (step !== 'pet_details') {
      hasSavedOnboardingPet = false;
    }
    if (step !== 'has_pet') {
      hasPetErrorMessage = '';
    }
  }

  if (isGoogleSubmitting && (state.getSupabaseAuthError() || state.isSupabaseAuthenticated())) {
    isGoogleSubmitting = false;
  }

  // Splash screen renders standalone without step dots or footer
  if (step === 'splash') {
    return renderSplashScreen();
  }

  return `
    <div class="min-h-[100dvh] w-full flex flex-col items-center justify-between px-4 sm:px-6 pt-[max(0.75rem,env(safe-area-inset-top))] sm:pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-[#FFF9E9] text-[#3E2723] relative overflow-x-hidden" dir="rtl">
      
      ${renderPawBackdrop()}

      <!-- Minimal Step Dots Navigation (no skip button) -->
      <div class="w-full max-w-md flex items-center justify-center pt-1 pb-1 sm:pb-2 z-20">
        <div class="flex items-center gap-1.5">
          ${renderStepDots(step)}
        </div>
      </div>

      <!-- Main Step Container -->
      <div class="w-full max-w-md flex-1 flex flex-col justify-between z-10">
        ${renderStepContent(step)}
      </div>

      <!-- Footer Handle Only (@Meow2026) -->
      <footer class="w-full max-w-md pt-2 sm:pt-4 pb-1 sm:pb-4 text-center z-20">
        <span dir="ltr" class="inline-block text-[11px] sm:text-xs font-bold text-[#8C827A] tracking-wide font-baloo">@Meow2026</span>
      </footer>

    </div>
  `;
}

function renderPawBackdrop(): string {
  return `
    <div aria-hidden="true" class="pointer-events-none fixed inset-0 overflow-hidden z-0 select-none opacity-25">
      <svg class="absolute top-12 left-6 text-[#d6c7b2] w-12 h-12 transform -rotate-12" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="7" cy="8.5" r="2"></circle>
        <circle cx="11" cy="6.5" r="2"></circle>
        <circle cx="15" cy="7.5" r="2"></circle>
        <circle cx="18" cy="10.5" r="1.8"></circle>
        <path d="M13 11c-2.8 0-5 2-5 4.5 0 2.2 2 3.5 4.5 3.5s4.5-1.3 4.5-3.5c0-2.5-1.2-4.5-4-4.5z"></path>
      </svg>
      <svg class="absolute top-44 right-8 text-[#d6c7b2] w-14 h-14 transform rotate-45" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="7" cy="8.5" r="2"></circle>
        <circle cx="11" cy="6.5" r="2"></circle>
        <circle cx="15" cy="7.5" r="2"></circle>
        <circle cx="18" cy="10.5" r="1.8"></circle>
        <path d="M13 11c-2.8 0-5 2-5 4.5 0 2.2 2 3.5 4.5 3.5s4.5-1.3 4.5-3.5c0-2.5-1.2-4.5-4-4.5z"></path>
      </svg>
      <svg class="absolute top-1/2 left-4 text-[#d6c7b2] w-10 h-10 transform rotate-12" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="7" cy="8.5" r="2"></circle>
        <circle cx="11" cy="6.5" r="2"></circle>
        <circle cx="15" cy="7.5" r="2"></circle>
        <circle cx="18" cy="10.5" r="1.8"></circle>
        <path d="M13 11c-2.8 0-5 2-5 4.5 0 2.2 2 3.5 4.5 3.5s4.5-1.3 4.5-3.5c0-2.5-1.2-4.5-4-4.5z"></path>
      </svg>
      <svg class="absolute bottom-28 right-6 text-[#d6c7b2] w-12 h-12 transform -rotate-45" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="7" cy="8.5" r="2"></circle>
        <circle cx="11" cy="6.5" r="2"></circle>
        <circle cx="15" cy="7.5" r="2"></circle>
        <circle cx="18" cy="10.5" r="1.8"></circle>
        <path d="M13 11c-2.8 0-5 2-5 4.5 0 2.2 2 3.5 4.5 3.5s4.5-1.3 4.5-3.5c0-2.5-1.2-4.5-4-4.5z"></path>
      </svg>
      <svg class="absolute bottom-8 left-10 text-[#d6c7b2] w-11 h-11 transform rotate-12" fill="currentColor" viewBox="0 0 24 24">
        <circle cx="7" cy="8.5" r="2"></circle>
        <circle cx="11" cy="6.5" r="2"></circle>
        <circle cx="15" cy="7.5" r="2"></circle>
        <circle cx="18" cy="10.5" r="1.8"></circle>
        <path d="M13 11c-2.8 0-5 2-5 4.5 0 2.2 2 3.5 4.5 3.5s4.5-1.3 4.5-3.5c0-2.5-1.2-4.5-4-4.5z"></path>
      </svg>
    </div>
  `;
}

function getStepLabel(step: OnboardingStep): string {
  switch (step) {
    case 'welcome':
      return 'أهلاً بك';
    case 'auth_method':
      return authMode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب';
    case 'owner_details':
      return 'بيانات المالك';
    case 'has_pet':
      return 'هل تمتلك أليفاً؟';
    case 'pet_details':
      return 'بيانات المياو';
    default:
      return '';
  }
}

function renderStepDots(currentStep: OnboardingStep): string {
  const steps: OnboardingStep[] = ['welcome', 'auth_method', 'owner_details', 'has_pet', 'pet_details'];
  const currentIndex = steps.indexOf(currentStep);

  return steps
    .map((s, idx) => {
      const isCompleted = idx <= currentIndex;
      const isCurrent = idx === currentIndex;
      const isFuture = idx > currentIndex;
      return `
        <button
          type="button"
          data-onboarding-step="${s}"
          ${isFuture ? 'disabled' : ''}
          aria-label="${getStepLabel(s)}"
          title="${getStepLabel(s)}"
          class="onboarding-step-dot h-2 rounded-full transition-all duration-300 ${
            isFuture ? 'cursor-default' : 'cursor-pointer'
          } ${
            isCurrent
              ? 'w-6 bg-[#e67e22]'
              : isCompleted
              ? 'w-2.5 bg-[#e67e22]/60'
              : 'w-2 bg-[#d6c7b2]'
          }"
        ></button>
      `;
    })
    .join('');
}

function renderStepContent(step: OnboardingStep): string {
  switch (step) {
    case 'welcome':
      return renderWelcomeStep();
    case 'auth_method':
      return renderAuthMethodStep();
    case 'owner_details':
      return renderOwnerDetailsStep();
    case 'has_pet':
      return renderHasPetStep();
    case 'pet_details':
      return renderPetDetailsStep();
    default:
      return renderWelcomeStep();
  }
}

export function renderSplashLoadingIndicatorHtml(isDelayed: boolean): string {
  if (!isDelayed) return '';
  return `
    <div
      id="splash-loading-indicator"
      class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 border border-[#d6c7b2]/70 shadow-sm text-xs font-bold text-[#786555] font-baloo animate-fade-in"
      role="status"
      aria-live="polite"
    >
      <span class="w-2 h-2 rounded-full bg-[#e67e22] animate-ping"></span>
      <span>جاري تجهيز الحساب...</span>
    </div>
  `;
}

// -------------------------------------------------------------
// Step 1: Splash Screen (Minimum 7000ms + automatic transition)
// -------------------------------------------------------------
function renderSplashScreen(): string {
  const isDelayed = state.isSplashLoadingDelayed();

  return `
    <div
      id="splash-screen-container"
      class="relative h-[100dvh] w-full flex flex-col items-center justify-center px-6 sm:px-8 text-[#3E2723] overflow-hidden select-none"
      style="height: 100dvh; min-height: 100dvh; width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0 1.5rem; background: radial-gradient(circle at center, #FFFBEB 0%, #FFF8E7 100%); color: #3E2723; overflow: hidden; box-sizing: border-box; opacity: 1;"
      dir="rtl"
    >
      <!-- Center Logo Section with Soft Aura -->
      <div
        class="relative flex-grow flex flex-col items-center justify-center"
        style="position: relative; flex: 1 1 auto; display: flex; flex-direction: column; align-items: center; justify-content: center;"
      >
        <div
          class="absolute w-52 h-52 sm:w-72 sm:h-72 rounded-full bg-[#F7E1C3] blur-[40px] opacity-40 -z-10"
          style="position: absolute; width: 13rem; height: 13rem; border-radius: 9999px; background-color: #F7E1C3; opacity: 0.4; filter: blur(40px); z-index: 0; pointer-events: none;"
        ></div>
        <img
          id="splash-logo-img"
          alt="Meow Logo"
          width="240"
          height="218"
          loading="eager"
          decoding="sync"
          fetchpriority="high"
          class="relative z-10 w-48 sm:w-64 h-auto object-contain max-w-[68vw] sm:max-w-[80vw]"
          style="position: relative; z-index: 1; width: 12rem; max-width: 68vw; height: auto; object-fit: contain; display: block; opacity: 1;"
          src="${SPLASH_LOGO_URL}"
        />
        <div id="splash-loading-slot" class="mt-6 min-h-[34px] flex items-center justify-center" style="margin-top: 1.5rem; min-height: 34px;">${renderSplashLoadingIndicatorHtml(isDelayed)}</div>
      </div>

      <!-- Footer Text: By Mohamed Gamil -->
      <div
        id="splash-brand-credit"
        class="pb-8 sm:pb-12 text-center"
        style="padding-bottom: max(2rem, env(safe-area-inset-bottom)); text-align: center; font-family: 'Bubblegum Sans', 'Fredoka', 'Baloo Bhaijaan 2', ui-rounded, 'Segoe UI', system-ui, sans-serif; opacity: 1;"
      >
        <p class="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-1 sm:mb-1.5 font-medium" style="margin: 0 0 0.25rem; font-size: 10px; letter-spacing: 0.3em; opacity: 0.45; text-transform: uppercase;">By</p>
        <p class="text-xs sm:text-sm font-semibold tracking-[0.05em] text-[#3E2723]/80" style="margin: 0; font-size: 0.85rem; font-weight: 600; color: rgba(62, 39, 35, 0.82);">Mohamed Gamil</p>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// Step 2: Welcome Screen (Fits cleanly in 1 mobile viewport without scroll)
// -------------------------------------------------------------
function renderWelcomeStep(): string {
  return `
    <div class="flex-1 flex flex-col items-center justify-between py-1 sm:py-2 animate-fade-in">
      
      <!-- Top Official Logo -->
      <header class="w-full pt-0.5 sm:pt-2 pb-1 sm:pb-2 flex flex-col items-center text-center">
        <div class="relative w-28 h-28 sm:w-44 sm:h-44 flex items-center justify-center">
          <img alt="Meow Logo" class="w-28 sm:w-44 h-auto mx-auto object-contain drop-shadow-sm" src="${WELCOME_LOGO_URL}">
        </div>
      </header>

      <!-- Center Mascot Card & Headline -->
      <div class="flex flex-col items-center text-center space-y-3.5 sm:space-y-6 my-auto">
        <div class="relative flex items-center justify-center">
          <div class="w-36 h-36 sm:w-48 sm:h-48 rounded-3xl overflow-hidden shadow-lg border-4 border-white/80 bg-white/40 flex items-center justify-center">
            <img alt="Meow Mascot" class="w-full h-full object-cover" src="${MASCOT_IMG_URL}">
          </div>
        </div>

        <div class="space-y-2 sm:space-y-3 px-2 sm:px-4 w-full max-w-sm mx-auto">
          <h1 class="text-[1.45rem] leading-[1.35] sm:text-[1.85rem] sm:leading-[1.4] font-extrabold text-[#2d1b10] font-baloo">
            كل الي حيوانك الأليف محتاجه في مكان واحد
            <span class="block text-xl sm:text-2xl pt-1 sm:pt-2 text-[#895036]">🤎</span>
          </h1>
        </div>
      </div>

      <!-- Bottom Next CTA Button -->
      <div class="w-full pt-2 sm:pt-4 flex justify-end">
        <button
          type="button"
          id="btn-welcome-next"
          class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl font-bold text-base sm:text-lg text-white shadow-md active:scale-95 transition-all flex flex-col items-center justify-center gap-1 sm:gap-1.5 hover:opacity-95 cursor-pointer bg-[#e67e22]"
        >
          <span class="text-base sm:text-lg font-baloo">التالي</span>
          <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
        </button>
      </div>

    </div>
  `;
}

// -------------------------------------------------------------
// Step 3: Auth Method (Supabase Email/Password + Confirmation + Recovery + Deferred Social)
// -------------------------------------------------------------
function renderAuthMethodStep(): string {
  const isLogin = authMode === 'login';
  const isRecoveryActive = state.isSupabasePasswordRecovery();
  const isForgotPassword = !isRecoveryActive && authSubView === 'forgot_password';
  const isForgotOtp = !isRecoveryActive && authSubView === 'forgot_otp';
  const stateAuthError = !authErrorMessage && !authSuccessMessage ? state.getSupabaseAuthError() || '' : '';
  if (isGoogleSubmitting && !state.isProcessingAuthDeepLink() && (stateAuthError || authErrorMessage)) {
    isGoogleSubmitting = false;
  }
  const visibleError = authErrorMessage || stateAuthError;
  const isAuthBusy =
    isAuthSubmitting ||
    isGoogleSubmitting ||
    isContinuingAuth ||
    state.getIsSupabaseProfileLoading();
  const isAuthenticated = state.isSupabaseAuthenticated() && !isRecoveryActive && !isAuthBusy;
  const currentSessionEmail = state.getUser().email || authEmail;

  if (isRecoveryActive) {
    return `
      <div class="flex-1 flex flex-col items-center justify-between py-1 sm:py-2 animate-fade-in">
        <header class="w-full pt-1 sm:pt-2 flex flex-col items-center text-center space-y-2 sm:space-y-3">
          <div class="relative w-24 h-24 sm:w-36 sm:h-36 flex items-center justify-center">
            <img alt="Meow Logo" class="w-24 sm:w-36 h-auto mx-auto object-contain drop-shadow-sm" src="${WELCOME_LOGO_URL}">
          </div>
          <div class="space-y-1 sm:space-y-1.5">
            <h1 class="text-xl sm:text-2xl font-extrabold text-[#3E2723] font-baloo">إعادة تعيين كلمة المرور</h1>
            <p class="text-[#3E2723]/75 text-sm sm:text-base font-bold font-baloo">أدخل كلمة المرور الجديدة لحسابك في Meow 🐾</p>
          </div>
        </header>

        <div class="w-full flex-1 flex flex-col justify-center py-2 sm:py-4 min-w-0">
          <form id="recovery-password-form" novalidate class="space-y-3 sm:space-y-4 font-baloo">
            <div class="space-y-1 sm:space-y-1.5">
              <label for="recovery-new-password-input" class="block text-xs sm:text-sm font-bold text-[#2d221b]">كلمة المرور الجديدة</label>
              <div class="relative flex items-center">
                <input
                  id="recovery-new-password-input"
                  type="${showRecoveryPassword ? 'text' : 'password'}"
                  dir="ltr"
                  placeholder="••••••••"
                  value="${escapeAttr(authNewPassword)}"
                  autocomplete="new-password"
                  class="w-full h-12 sm:h-14 pl-12 pr-4 sm:pr-5 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[20px] sm:rounded-[24px] text-sm sm:text-base font-bold text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm text-left"
                />
                <button
                  id="btn-toggle-recovery-pw"
                  type="button"
                  aria-label="إظهار أو إخفاء كلمة المرور"
                  class="absolute left-3 sm:left-3.5 w-9 h-9 rounded-full text-[#786555] hover:text-[#e67e22] flex items-center justify-center cursor-pointer"
                >
                  <i class="fa-solid ${showRecoveryPassword ? 'fa-eye-slash' : 'fa-eye'}"></i>
                </button>
              </div>
            </div>

            <div class="space-y-1 sm:space-y-1.5">
              <label for="recovery-confirm-password-input" class="block text-xs sm:text-sm font-bold text-[#2d221b]">تأكيد كلمة المرور الجديدة</label>
              <input
                id="recovery-confirm-password-input"
                type="${showRecoveryPassword ? 'text' : 'password'}"
                dir="ltr"
                placeholder="••••••••"
                value="${escapeAttr(authConfirmPassword)}"
                autocomplete="new-password"
                class="w-full h-12 sm:h-14 px-4 sm:px-5 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[20px] sm:rounded-[24px] text-sm sm:text-base font-bold text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm text-left"
              />
            </div>

            <div
              id="auth-error-msg"
              class="${visibleError ? '' : 'hidden'} rounded-2xl border border-rose-300 bg-rose-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-bold text-rose-700 font-baloo"
              role="alert"
            >${escapeHtml(visibleError)}</div>

            <div
              id="auth-success-msg"
              class="${authSuccessMessage ? '' : 'hidden'} rounded-2xl border border-emerald-300 bg-emerald-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-bold text-emerald-800 font-baloo"
              role="status"
            >${escapeHtml(authSuccessMessage)}</div>

            <button
              id="btn-update-recovery-password"
              type="submit"
              ${isUpdatingPassword ? 'disabled' : ''}
              class="w-full h-12 sm:h-14 text-white bg-[#e67e22] hover:bg-[#ea580c] rounded-[20px] sm:rounded-[24px] text-base sm:text-lg shadow-sm transition-all font-extrabold font-baloo active:scale-[0.98] ${
                isUpdatingPassword ? 'opacity-70 cursor-wait' : 'cursor-pointer'
              }"
            >
              ${isUpdatingPassword ? 'جاري حفظ كلمة المرور...' : 'حفظ كلمة المرور الجديدة'}
            </button>

            <button
              id="btn-cancel-recovery-signout"
              type="button"
              ${isUpdatingPassword ? 'disabled' : ''}
              class="w-full h-11 sm:h-12 bg-[#F3EBDD] hover:bg-[#eae0d0] text-[#564337] border-2 border-[#d6c7b2] rounded-[20px] sm:rounded-[24px] text-xs sm:text-sm font-bold transition-all cursor-pointer font-baloo"
            >
              إلغاء والعودة لتسجيل الدخول
            </button>
          </form>
        </div>

        <div class="w-full pb-1 sm:pb-2"></div>
      </div>
    `;
  }

  if (isForgotOtp) {
    return `
      <div class="flex-1 flex flex-col items-center justify-between py-1 sm:py-2 animate-fade-in">
        <header class="w-full pt-1 sm:pt-2 flex flex-col items-center text-center space-y-2 sm:space-y-3">
          <div class="relative w-24 h-24 sm:w-36 sm:h-36 flex items-center justify-center">
            <img alt="Meow Logo" class="w-24 sm:w-36 h-auto mx-auto object-contain drop-shadow-sm" src="${WELCOME_LOGO_URL}">
          </div>
          <div class="space-y-1 sm:space-y-1.5">
            <h1 class="text-xl sm:text-2xl font-extrabold text-[#3E2723] font-baloo">أدخل رمز التحقق</h1>
            <p class="text-[#3E2723]/75 text-xs sm:text-sm font-bold font-baloo leading-relaxed">
              أدخل الرمز المكون من 6 أرقام المرسل إلى
              <span dir="ltr" class="inline-block text-[#2d221b] font-black">${escapeHtml(authEmail)}</span>
            </p>
          </div>
        </header>

        <div class="w-full flex-1 flex flex-col justify-center py-2 sm:py-4 min-w-0">
          <form id="recovery-otp-form" novalidate class="space-y-3 sm:space-y-4 font-baloo">
            <div class="space-y-1.5">
              <label for="recovery-otp-input" class="block text-xs sm:text-sm font-bold text-[#2d221b]">رمز التحقق (6 أرقام)</label>
              <input
                id="recovery-otp-input"
                type="text"
                inputmode="numeric"
                maxlength="6"
                pattern="[0-9]*"
                autocomplete="one-time-code"
                dir="ltr"
                placeholder="000000"
                value="${escapeAttr(recoveryOtpCode)}"
                class="w-full h-14 px-4 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[22px] sm:rounded-[24px] text-2xl font-black tracking-[0.45em] text-center text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm"
              />
            </div>

            <div
              id="auth-error-msg"
              class="${visibleError ? '' : 'hidden'} rounded-2xl border border-rose-300 bg-rose-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-bold text-rose-700 font-baloo"
              role="alert"
            >${escapeHtml(visibleError)}</div>

            <div
              id="auth-success-msg"
              class="${authSuccessMessage ? '' : 'hidden'} rounded-2xl border border-emerald-300 bg-emerald-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-bold text-emerald-800 font-baloo"
              role="status"
            >${escapeHtml(authSuccessMessage)}</div>

            <button
              id="btn-verify-recovery-otp"
              type="submit"
              ${isVerifyingOtp ? 'disabled' : ''}
              class="w-full h-12 sm:h-14 text-white bg-[#e67e22] hover:bg-[#ea580c] rounded-[20px] sm:rounded-[24px] text-base sm:text-lg shadow-sm transition-all font-extrabold font-baloo active:scale-[0.98] ${
                isVerifyingOtp ? 'opacity-70 cursor-wait' : 'cursor-pointer'
              }"
            >
              ${isVerifyingOtp ? 'جاري التحقق من الرمز...' : 'تحقق من الرمز'}
            </button>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                id="btn-resend-recovery-otp"
                type="button"
                ${isResendingRecoveryOtp || recoveryResendSeconds > 0 ? 'disabled' : ''}
                class="w-full h-11 bg-white hover:bg-[#fffaf2] text-[#c25807] border-2 border-[#e67e22]/50 rounded-[20px] text-xs font-black transition-all font-baloo ${
                  isResendingRecoveryOtp || recoveryResendSeconds > 0
                    ? 'opacity-65 cursor-not-allowed'
                    : 'cursor-pointer'
                }"
              >
                ${
                  isResendingRecoveryOtp
                    ? 'جاري إعادة الإرسال...'
                    : recoveryResendSeconds > 0
                    ? `إعادة إرسال الرمز (${recoveryResendSeconds} ث)`
                    : 'إعادة إرسال رمز التحقق'
                }
              </button>
              <button
                id="btn-change-recovery-email"
                type="button"
                ${isVerifyingOtp ? 'disabled' : ''}
                class="w-full h-11 bg-[#F3EBDD] hover:bg-[#eae0d0] text-[#564337] border-2 border-[#d6c7b2] rounded-[20px] text-xs font-bold transition-all cursor-pointer font-baloo"
              >
                تغيير البريد الإلكتروني
              </button>
            </div>

            <button
              id="btn-back-to-auth-main"
              type="button"
              ${isVerifyingOtp ? 'disabled' : ''}
              class="w-full h-11 bg-white/80 hover:bg-[#eae0d0] text-[#564337] border border-[#d6c7b2] rounded-[20px] text-xs sm:text-sm font-bold transition-all cursor-pointer font-baloo"
            >
              العودة لتسجيل الدخول
            </button>
          </form>
        </div>

        <div class="w-full pb-1 sm:pb-2"></div>
      </div>
    `;
  }

  if (isForgotPassword) {
    return `
      <div class="flex-1 flex flex-col items-center justify-between py-1 sm:py-2 animate-fade-in">
        <header class="w-full pt-1 sm:pt-2 flex flex-col items-center text-center space-y-2 sm:space-y-3">
          <div class="relative w-24 h-24 sm:w-36 sm:h-36 flex items-center justify-center">
            <img alt="Meow Logo" class="w-24 sm:w-36 h-auto mx-auto object-contain drop-shadow-sm" src="${WELCOME_LOGO_URL}">
          </div>
          <div class="space-y-1 sm:space-y-1.5">
            <h1 class="text-xl sm:text-2xl font-extrabold text-[#3E2723] font-baloo">استعادة كلمة المرور</h1>
            <p class="text-[#3E2723]/75 text-sm sm:text-base font-bold font-baloo">أدخل بريدك الإلكتروني لإرسال رمز تحقق مكون من 6 أرقام</p>
          </div>
        </header>

        <div class="w-full flex-1 flex flex-col justify-center py-2 sm:py-4 min-w-0">
          <form id="forgot-password-form" novalidate class="space-y-3 sm:space-y-4 font-baloo">
            <div class="space-y-1 sm:space-y-1.5">
              <label for="recovery-email-input" class="block text-xs sm:text-sm font-bold text-[#2d221b]">البريد الإلكتروني</label>
              <input
                id="recovery-email-input"
                type="email"
                dir="ltr"
                placeholder="name@example.com"
                value="${escapeAttr(authEmail)}"
                autocomplete="email"
                class="w-full h-12 sm:h-14 px-4 sm:px-5 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[20px] sm:rounded-[24px] text-sm sm:text-base font-bold text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm text-left"
              />
            </div>

            <div
              id="auth-error-msg"
              class="${visibleError ? '' : 'hidden'} rounded-2xl border border-rose-300 bg-rose-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-bold text-rose-700 font-baloo"
              role="alert"
            >${escapeHtml(visibleError)}</div>

            <div
              id="auth-success-msg"
              class="${authSuccessMessage ? '' : 'hidden'} rounded-2xl border border-emerald-300 bg-emerald-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-bold text-emerald-800 font-baloo"
              role="status"
            >${escapeHtml(authSuccessMessage)}</div>

            <button
              id="btn-send-recovery-email"
              type="submit"
              ${isSendingRecovery ? 'disabled' : ''}
              class="w-full h-12 sm:h-14 text-white bg-[#e67e22] hover:bg-[#ea580c] rounded-[20px] sm:rounded-[24px] text-base sm:text-lg shadow-sm transition-all font-extrabold font-baloo active:scale-[0.98] ${
                isSendingRecovery ? 'opacity-70 cursor-wait' : 'cursor-pointer'
              }"
            >
              ${isSendingRecovery ? 'جاري إرسال الرمز...' : 'إرسال رمز التحقق'}
            </button>

            <button
              id="btn-back-to-auth-main"
              type="button"
              ${isSendingRecovery ? 'disabled' : ''}
              class="w-full h-11 sm:h-12 bg-[#F3EBDD] hover:bg-[#eae0d0] text-[#564337] border-2 border-[#d6c7b2] rounded-[20px] sm:rounded-[24px] text-xs sm:text-sm font-bold transition-all cursor-pointer font-baloo"
            >
              العودة لتسجيل الدخول
            </button>
          </form>
        </div>

        <div class="w-full pb-1 sm:pb-2"></div>
      </div>
    `;
  }

  return `
    <div class="flex-1 flex flex-col items-center justify-between py-0.5 sm:py-1 animate-fade-in">
      
      <!-- Header Section -->
      <header class="w-full pt-0.5 sm:pt-2 flex flex-col items-center text-center space-y-1.5 sm:space-y-2.5">
        <div class="relative w-24 h-24 sm:w-36 sm:h-36 flex items-center justify-center">
          <img alt="Meow Logo" class="w-24 sm:w-36 h-auto mx-auto object-contain drop-shadow-sm" src="${WELCOME_LOGO_URL}">
        </div>

        <div class="space-y-0.5 sm:space-y-1">
          ${
            isLogin
              ? `<h1 class="text-xl sm:text-2xl font-extrabold text-[#3E2723] font-baloo">تسجيل الدخول</h1>
                 <p class="text-[#3E2723]/70 text-sm sm:text-base font-bold font-baloo">مرحباً بعودتك إلى Meow 🐾</p>`
              : `<h1 class="text-xl sm:text-2xl font-extrabold text-[#3E2723] font-baloo">إنشاء حساب جديد</h1>
                 <p class="text-[#3E2723]/70 text-sm sm:text-base font-bold font-baloo">ابدأ رحلتك مع Meow 🐾</p>`
          }
        </div>
      </header>

      <!-- Main Content: Email/Password + Confirmation + Google/Apple -->
      <div class="w-full flex-1 flex flex-col justify-center space-y-3 sm:space-y-4 py-1.5 sm:py-3 min-w-0">

        ${
          isAuthenticated
            ? `
              <div class="rounded-[20px] sm:rounded-[24px] border-2 border-emerald-300 bg-emerald-50/90 p-3.5 sm:p-4 text-center space-y-2.5 sm:space-y-3 font-baloo shadow-sm">
                <p class="text-xs sm:text-sm font-black text-emerald-900 m-0">
                  تم التحقق من الحساب${currentSessionEmail ? `: ${escapeHtml(currentSessionEmail)}` : ''}
                </p>
                <button
                  id="btn-auth-continue"
                  type="button"
                  ${isContinuingAuth ? 'disabled' : ''}
                  class="w-full h-11 sm:h-12 rounded-2xl bg-[#e67e22] hover:bg-[#ea580c] text-white font-extrabold text-sm sm:text-base shadow-sm transition active:scale-[0.98] ${
                    isContinuingAuth ? 'opacity-70 cursor-wait' : 'cursor-pointer'
                  }"
                >
                  ${isContinuingAuth ? 'جاري المتابعة...' : 'متابعة'}
                </button>
              </div>
            `
            : ''
        }

        <form id="auth-email-form" novalidate class="space-y-2.5 sm:space-y-3.5 font-baloo">
          <div class="space-y-1 sm:space-y-1.5">
            <label for="auth-email-input" class="block text-xs sm:text-sm font-bold text-[#2d221b]">البريد الإلكتروني</label>
            <input
              id="auth-email-input"
              type="email"
              dir="ltr"
              placeholder="name@example.com"
              value="${escapeAttr(authEmail)}"
              autocomplete="email"
              class="w-full h-12 sm:h-14 px-4 sm:px-5 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[20px] sm:rounded-[24px] text-sm sm:text-base font-bold text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm text-left"
            />
          </div>

          <div class="space-y-1 sm:space-y-1.5">
            <div class="flex items-center justify-between gap-2">
              <label for="auth-password-input" class="block text-xs sm:text-sm font-bold text-[#2d221b]">كلمة المرور</label>
              ${
                isLogin
                  ? `<button
                       id="btn-forgot-password"
                       type="button"
                       class="text-xs font-black text-[#944a00] hover:text-[#e67e22] underline underline-offset-2 cursor-pointer"
                     >نسيت كلمة المرور؟</button>`
                  : `<span class="text-[11px] font-bold text-[#786555]">6 أحرف على الأقل</span>`
              }
            </div>
            <div class="relative flex items-center">
              <input
                id="auth-password-input"
                type="${showAuthPassword ? 'text' : 'password'}"
                dir="ltr"
                placeholder="••••••••"
                value="${escapeAttr(authPassword)}"
                autocomplete="${isLogin ? 'current-password' : 'new-password'}"
                class="w-full h-12 sm:h-14 pl-12 pr-4 sm:pr-5 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[20px] sm:rounded-[24px] text-sm sm:text-base font-bold text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm text-left"
              />
              <button
                id="btn-toggle-auth-password"
                type="button"
                aria-label="إظهار أو إخفاء كلمة المرور"
                class="absolute left-3 sm:left-3.5 w-9 h-9 rounded-full text-[#786555] hover:text-[#e67e22] flex items-center justify-center cursor-pointer"
              >
                <i class="fa-solid ${showAuthPassword ? 'fa-eye-slash' : 'fa-eye'}"></i>
              </button>
            </div>
          </div>

          ${
            !isLogin
              ? `
                <!-- Agreements (Strictly unchecked by default on signup) -->
                <div id="terms-agreement-box" class="flex items-start gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl border border-transparent transition-all">
                  <div class="mt-0.5">
                    <input
                      class="w-4 h-4 sm:w-5 sm:h-5 rounded border-[#3E2723]/30 text-[#944a00] focus:ring-[#944a00]/20 bg-white/80 transition-colors cursor-pointer"
                      id="terms-checkbox"
                      type="checkbox"
                      ${isTermsAccepted ? 'checked' : ''}
                    />
                  </div>
                  <label class="text-[#3E2723]/80 text-xs sm:text-sm leading-relaxed cursor-pointer font-baloo" for="terms-checkbox">
                    من خلال إنشاء الحساب، أنت توافق على
                    <span class="text-[#944a00] font-bold">شروط الاستخدام</span>
                    و
                    <span class="text-[#944a00] font-bold">سياسة الخصوصية</span>.
                  </label>
                </div>
              `
              : ''
          }

          ${
            pendingConfirmationEmail
              ? `
                <div id="email-confirmation-box" class="rounded-[20px] sm:rounded-[24px] border-2 border-[#e67e22]/45 bg-[#fff5ea] p-3.5 sm:p-4 space-y-2 sm:space-y-2.5 text-right shadow-sm">
                  <div class="flex items-start gap-2.5">
                    <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#e67e22]/15 text-[#e67e22] flex items-center justify-center shrink-0">
                      <i class="fa-solid fa-envelope-open-text text-sm"></i>
                    </div>
                    <div class="min-w-0 space-y-1">
                      <p class="text-xs sm:text-sm font-black text-[#2d221b] m-0">تأكيد البريد الإلكتروني مطلوب</p>
                      <p class="text-[11px] sm:text-xs font-bold text-[#786555] leading-relaxed m-0">
                        أرسلنا رابط التفعيل إلى <span dir="ltr" class="text-[#2d221b]">${escapeHtml(pendingConfirmationEmail)}</span>. افتح الرابط في بريدك أولاً قبل المتابعة.
                      </p>
                    </div>
                  </div>
                  <div class="flex flex-col sm:flex-row gap-2 pt-0.5 sm:pt-1">
                    <button
                      id="btn-resend-confirmation"
                      type="button"
                      ${isResendingConfirmation ? 'disabled' : ''}
                      class="flex-1 h-10 sm:h-11 px-3 rounded-2xl bg-white border-2 border-[#e67e22]/50 text-[#c25807] hover:bg-[#fffaf2] text-xs font-black transition cursor-pointer active:scale-95 ${
                        isResendingConfirmation ? 'opacity-65 cursor-wait' : ''
                      }"
                    >
                      ${isResendingConfirmation ? 'جاري الإرسال...' : 'إعادة إرسال رسالة التأكيد'}
                    </button>
                    <button
                      id="btn-switch-to-login-after-confirm"
                      type="button"
                      class="flex-1 h-10 sm:h-11 px-3 rounded-2xl bg-[#e67e22] hover:bg-[#ea580c] text-white text-xs font-black transition cursor-pointer active:scale-95"
                    >
                      تم التأكيد • تسجيل الدخول
                    </button>
                  </div>
                </div>
              `
              : ''
          }

          <!-- Status / Validation Banners -->
          <div
            id="auth-error-msg"
            class="${visibleError ? '' : 'hidden'} rounded-2xl border border-rose-300 bg-rose-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-bold text-rose-700 font-baloo"
            role="alert"
          >${escapeHtml(visibleError)}</div>

          <div
            id="auth-success-msg"
            class="${authSuccessMessage ? '' : 'hidden'} rounded-2xl border border-emerald-300 bg-emerald-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-center text-xs sm:text-sm font-bold text-emerald-800 font-baloo"
            role="status"
          >${escapeHtml(authSuccessMessage)}</div>

          <button
            id="btn-auth-email-submit"
            type="submit"
            ${isAuthSubmitting ? 'disabled' : ''}
            class="w-full h-12 sm:h-14 text-white bg-[#f38f42] hover:bg-[#e67e22] rounded-[20px] sm:rounded-[24px] text-base sm:text-lg shadow-sm transition-all font-extrabold font-baloo active:scale-[0.98] ${
              isAuthSubmitting ? 'opacity-70 cursor-wait' : 'cursor-pointer'
            }"
          >
            ${
              isAuthSubmitting
                ? isLogin
                  ? 'جاري تسجيل الدخول...'
                  : 'جاري إنشاء الحساب...'
                : isLogin
                ? 'تسجيل الدخول'
                : 'إنشاء حساب'
            }
          </button>
        </form>

        <!-- Divider -->
        <div class="px-2">
          <div class="h-px w-full bg-[#d6c7b2]/70"></div>
        </div>

        <!-- Social Login Options -->
        <div class="space-y-2 sm:space-y-2.5">
          <button
            id="btn-login-google"
            type="button"
            ${isGoogleSubmitting ? 'disabled' : ''}
            class="flex items-center justify-center gap-2.5 sm:gap-3 w-full py-3 sm:py-3.5 px-4 sm:px-5 bg-white hover:bg-[#fffaf5] text-[#1f1f1f] rounded-xl sm:rounded-2xl font-semibold border border-[#3E2723]/15 shadow-sm transition-all active:scale-[0.98] ${
              isGoogleSubmitting ? 'opacity-70 cursor-wait' : 'cursor-pointer'
            }"
          >
            <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span id="google-btn-label" class="text-sm sm:text-base font-bold font-baloo truncate">
              ${
                isGoogleSubmitting
                  ? 'جاري الاتصال بـ Google...'
                  : isLogin
                  ? 'تسجيل الدخول بواسطة Google'
                  : 'إنشاء حساب بواسطة Google'
              }
            </span>
          </button>

          <button
            id="btn-login-apple"
            type="button"
            disabled
            aria-disabled="true"
            class="flex items-center justify-between w-full py-3 sm:py-3.5 px-4 sm:px-5 bg-black/75 text-white/80 rounded-xl sm:rounded-2xl font-semibold border border-black/40 shadow-sm opacity-65 cursor-not-allowed select-none"
          >
            <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <svg class="w-5 h-5 fill-white/80 shrink-0" viewBox="0 0 384 512">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-82.3-20.1-41.2.6-79.1 23.9-100.4 61-43.7 75.8-11.2 188.6 31.1 250.3 20.6 29.7 45.4 63.3 77.2 62.1 30.6-1.1 42.1-19.8 79-19.8 36.8 0 47.4 19.8 79.9 19.2 33.4-.6 54.8-30.3 75.2-60.2 23.5-34.4 33.2-67.8 33.6-69.5-.8-.3-65-24.9-65.1-99.3zm-30.2-184.2c27.1-32.9 25.1-62.4 23.6-70.5-23.7 1.1-51.1 15.7-68 35.5-15.1 17.5-28.1 47.2-24.2 74.9 26.8 2.1 51.5-17 68.6-39.9z"></path>
              </svg>
              <span class="text-sm sm:text-base font-bold font-baloo truncate">
                ${isLogin ? 'تسجيل الدخول بواسطة Apple' : 'إنشاء حساب بواسطة Apple'}
              </span>
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-white/15 border border-white/25 text-[11px] font-black text-white/90 font-baloo shrink-0">
              قريبًا
            </span>
          </button>
        </div>

      </div>

      <!-- Footer Mode Switch Pill -->
      <div class="w-full pt-1.5 sm:pt-2 pb-1 text-center">
        <button
          id="btn-toggle-auth-mode"
          type="button"
          class="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border cursor-pointer transition-all hover:opacity-90 active:scale-95"
          style="background-color: rgba(247, 225, 195, 0.5); border-color: rgba(230, 126, 34, 0.2);"
        >
          ${
            isLogin
              ? `<span class="text-[#3E2723]/70 text-xs sm:text-sm font-semibold font-baloo">ليس لديك حساب؟</span>
                 <span class="text-[#944a00] font-bold text-xs sm:text-sm font-baloo">إنشاء حساب جديد</span>`
              : `<span class="text-[#3E2723]/70 text-xs sm:text-sm font-semibold font-baloo">لديك حساب بالفعل؟</span>
                 <span class="text-[#944a00] font-bold text-xs sm:text-sm font-baloo">تسجيل الدخول</span>`
          }
        </button>
      </div>

    </div>
  `;
}

// -------------------------------------------------------------
// Step 4: Owner Details (Empty inputs - zero auto-fill)
// -------------------------------------------------------------
function ownerNodesToOptions(nodes: GeoNode[], emptyLabel?: string): SearchableOption[] {
  const mapped: SearchableOption[] = nodes.map((node) => ({
    value: node.id,
    label: node.name,
    searchText: node.aliases?.join(' '),
  }));
  return emptyLabel ? [{ value: '', label: emptyLabel }, ...mapped] : mapped;
}

function getOwnerVillageMeta(cityId: string): {
  options: SearchableOption[];
  disabled: boolean;
  placeholder: string;
} {
  if (!cityId) {
    return {
      options: [],
      disabled: true,
      placeholder: 'اختر المدينة أولاً',
    };
  }
  const villages = getVillagesForCity(cityId);
  if (villages.length === 0) {
    return {
      options: [{ value: '', label: 'لا توجد قرى مسجلة تحت هذا النطاق' }],
      disabled: true,
      placeholder: 'لا توجد قرى مسجلة تحت هذا النطاق',
    };
  }
  return {
    options: ownerNodesToOptions(villages, 'بدون تحديد قرية / تجمع'),
    disabled: false,
    placeholder: 'اختر القرية / النجع (اختياري)',
  };
}

function formatOwnerPhoneForInput(rawPhone: string): string {
  const check = validateEgyptianMobile(rawPhone || '');
  if (check.isValid && check.local11Digits) {
    return check.local11Digits;
  }
  return (rawPhone || '').replace(/^\+?20\s*/, '').trim();
}

function syncEditOwnerDraftFromUser(): void {
  const user = state.getUser();
  const lineage = resolveLocationLineage({
    governorateId: user.governorateId,
    markazId: user.markazId,
    cityId: user.cityId,
    villageId: user.villageId,
    locationId: user.locationId,
    governorate: user.governorate,
    markaz: user.markaz,
    city: user.city,
    village: user.village,
  });

  editOwnerFormState.name = user.name || '';
  editOwnerFormState.phone = formatOwnerPhoneForInput(user.phone || '');
  editOwnerFormState.gender = user.gender === 'female' ? 'female' : user.gender === 'male' ? 'male' : null;
  editOwnerFormState.govId = lineage.governorate?.id || user.governorateId || '';
  editOwnerFormState.markazId = lineage.markaz?.id || user.markazId || '';
  editOwnerFormState.cityId = lineage.city?.id || user.cityId || '';
  editOwnerFormState.villageId = lineage.village?.id || user.villageId || '';
}

function renderOwnerDetailsFormContent(
  mode: 'onboarding' | 'edit',
  values: OwnerDetailsFormValues
): string {
  const govNodes = getGovernorates();
  const markazNodes = values.govId ? getMarkazesForGovernorate(values.govId) : [];
  const cityNodes = values.markazId ? getCitiesForMarkaz(values.markazId) : [];
  const villageMeta = getOwnerVillageMeta(values.cityId);
  const headingText = mode === 'edit' ? 'تعديل بيانات المالك' : 'تسجيل بيانات المالك';
  const submitLabel = mode === 'edit' ? 'حفظ التعديلات' : 'اشطا';

  return `
    <div class="flex-1 flex flex-col items-center justify-start py-0.5 sm:py-1 animate-fade-in">
      
      <!-- Header Section -->
      <header class="w-full pt-0.5 sm:pt-2 flex flex-col items-center text-center space-y-1.5 sm:space-y-3 relative">
        ${
          mode === 'edit'
            ? `
              <button
                id="close-edit-owner-btn"
                type="button"
                aria-label="رجوع"
                class="absolute top-1 sm:top-2 right-0 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#fffefc] border-2 border-[#d6c7b2] text-[#2d221b] flex items-center justify-center hover:border-[#e67e22] hover:text-[#e67e22] transition cursor-pointer shadow-sm active:scale-95"
              >
                <i class="fa-solid fa-arrow-right text-sm sm:text-base"></i>
              </button>
            `
            : ''
        }
        <div class="relative w-24 h-24 sm:w-40 sm:h-40 flex items-center justify-center">
          <img alt="Meow Logo" class="w-24 sm:w-40 h-auto mx-auto object-contain drop-shadow-sm select-none" src="${WELCOME_LOGO_URL}">
        </div>
        <h1 class="text-xl sm:text-3xl font-extrabold text-[#1a1612] tracking-normal font-baloo">${headingText}</h1>
      </header>

      <!-- Main Content: Form directly on #FFF9E9 -->
      <div class="w-full flex-1 flex flex-col justify-start py-2.5 sm:py-4 min-w-0">
        <form id="owner-details-form" novalidate class="space-y-3.5 sm:space-y-5 font-baloo">
          
          <!-- الاسم -->
          <div class="space-y-1.5 sm:space-y-2">
            <label for="owner-full-name-input" class="block text-sm sm:text-base font-bold text-[#2d221b]">الاسم</label>
            <div class="relative flex items-center">
              <input
                type="text"
                id="owner-full-name-input"
                placeholder="اكتب اسمك الكامل"
                value="${escapeAttr(values.name)}"
                autocomplete="off"
                class="w-full h-[52px] sm:h-16 px-4 sm:px-6 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[22px] sm:rounded-[28px] text-base sm:text-lg font-bold text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm"
              />
            </div>
          </div>

          <!-- رقم الهاتف -->
          <div class="space-y-1.5 sm:space-y-2">
            <label for="owner-phone-number-input" class="block text-sm sm:text-base font-bold text-[#2d221b]">رقم الهاتف</label>
            <div id="owner-phone-wrapper" class="relative flex items-center h-[52px] sm:h-16 rounded-[22px] sm:rounded-[28px]" dir="ltr">
              <span class="h-full inline-flex items-center justify-center px-3.5 sm:px-5 rounded-l-[22px] sm:rounded-l-[28px] border-2 border-r-0 border-[#d6c7b2] bg-[#F7E1C3] text-[#1a1612] font-black text-base sm:text-lg tracking-wider select-none shrink-0">+20</span>
              <input
                type="tel"
                id="owner-phone-number-input"
                inputmode="tel"
                placeholder="01xxxxxxxxx"
                value="${escapeAttr(values.phone)}"
                dir="ltr"
                autocomplete="off"
                class="w-full min-w-0 h-full px-3.5 sm:px-5 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-r-[22px] sm:rounded-r-[28px] text-base sm:text-lg font-bold text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm text-left"
              />
            </div>
            <p id="owner-phone-hint" class="hidden text-xs font-bold text-rose-600 px-2"></p>
          </div>

          <!-- الجنس -->
          <div class="space-y-1.5 sm:space-y-2">
            <label class="block text-sm sm:text-base font-bold text-[#2d221b]">الجنس</label>
            <div id="owner-gender-group" class="grid grid-cols-2 gap-3 sm:gap-3.5 rounded-[22px] sm:rounded-[28px]">
              <button
                type="button"
                id="owner-gender-male-btn"
                class="h-[52px] sm:h-16 relative flex items-center justify-center gap-2 px-4 sm:px-5 rounded-[22px] sm:rounded-[28px] border-2 ${
                  values.gender === 'male'
                    ? 'border-[#3b82f6] bg-[#e8f1fc] text-[#2563eb]'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } font-bold text-lg sm:text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="text-xl sm:text-2xl">♂</span>
                <span>ذكر</span>
              </button>

              <button
                type="button"
                id="owner-gender-female-btn"
                class="h-[52px] sm:h-16 relative flex items-center justify-center gap-2 px-4 sm:px-5 rounded-[22px] sm:rounded-[28px] border-2 ${
                  values.gender === 'female'
                    ? 'border-[#ec4899] bg-[#fce7f3] text-[#db2777]'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } font-bold text-lg sm:text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="text-xl sm:text-2xl">♀</span>
                <span>أنثى</span>
              </button>
            </div>
          </div>

          <!-- الموقع الجغرافي في مصر: الدولة ← المحافظة ← المركز/القسم ← المدينة/الحي ← القرية/النجع/العزبة -->
          <div class="space-y-2.5 sm:space-y-3.5">
            <div class="flex items-center justify-between gap-2">
              <label class="block text-sm sm:text-base font-bold text-[#2d221b]">الموقع الجغرافي</label>
              <span class="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-[#fffefc] border border-[#d6c7b2] text-[11px] sm:text-xs font-black text-[#2d221b]">
                <span>🇪🇬</span>
                <span>الدولة: مصر</span>
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2.5 sm:gap-3.5">
              <!-- المحافظة -->
              <div class="space-y-1.5 sm:space-y-2 min-w-0">
                <label for="owner-governorate-select-trigger" class="block text-xs sm:text-base font-bold text-[#2d221b]">المحافظة</label>
                ${renderSearchableSelect({
                  id: 'owner-governorate-select',
                  options: ownerNodesToOptions(govNodes),
                  value: values.govId,
                  placeholder: 'اختر المحافظة',
                  searchPlaceholder: 'ابحث عن المحافظة...',
                  heightClass: 'h-[52px] sm:h-16',
                })}
              </div>

              <!-- المركز أو القسم -->
              <div class="space-y-1.5 sm:space-y-2 min-w-0">
                <label for="owner-markaz-select-trigger" class="block text-xs sm:text-base font-bold text-[#2d221b]">المركز أو القسم</label>
                ${renderSearchableSelect({
                  id: 'owner-markaz-select',
                  options: ownerNodesToOptions(markazNodes),
                  value: values.markazId,
                  placeholder: values.govId ? 'اختر المركز أو القسم' : 'اختر المحافظة أولاً',
                  searchPlaceholder: 'ابحث عن المركز أو القسم...',
                  disabled: !values.govId,
                  heightClass: 'h-[52px] sm:h-16',
                })}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2.5 sm:gap-3.5">
              <!-- المدينة أو الحي -->
              <div class="space-y-1.5 sm:space-y-2 min-w-0">
                <label for="owner-city-select-trigger" class="block text-xs sm:text-base font-bold text-[#2d221b]">المدينة أو الحي</label>
                ${renderSearchableSelect({
                  id: 'owner-city-select',
                  options: ownerNodesToOptions(cityNodes),
                  value: values.cityId,
                  placeholder: values.markazId ? 'اختر المدينة أو الحي' : 'اختر المركز أولاً',
                  searchPlaceholder: 'ابحث عن المدينة أو الحي...',
                  disabled: !values.markazId,
                  heightClass: 'h-[52px] sm:h-16',
                })}
              </div>

              <!-- القرية / النجع / العزبة -->
              <div class="space-y-1.5 sm:space-y-2 min-w-0">
                <label for="owner-village-select-trigger" class="block text-xs sm:text-sm font-bold text-[#2d221b] truncate">القرية / النجع / العزبة</label>
                ${renderSearchableSelect({
                  id: 'owner-village-select',
                  options: villageMeta.options,
                  value: values.villageId,
                  placeholder: villageMeta.placeholder,
                  searchPlaceholder: 'ابحث عن القرية أو التجمع...',
                  disabled: villageMeta.disabled,
                  heightClass: 'h-[52px] sm:h-16',
                })}
              </div>
            </div>
          </div>

          <!-- Validation Alert -->
          <div
            id="owner-form-error"
            class="hidden rounded-2xl border border-rose-300 bg-rose-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-rose-700 leading-relaxed"
            role="alert"
          ></div>

          <!-- CTA Button -->
          <div class="pt-2 sm:pt-4">
            <button
              id="btn-owner-submit"
              type="submit"
              class="w-full h-[54px] sm:h-16 px-6 text-white bg-[#e67e22] hover:bg-[#ea580c] rounded-[22px] sm:rounded-[28px] font-extrabold text-xl sm:text-2xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer font-baloo"
            >
              <span>${submitLabel}</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  `;
}

function renderOwnerDetailsStep(): string {
  return renderOwnerDetailsFormContent('onboarding', onboardingOwnerFormState);
}

export function renderOwnerEditView(): string {
  if (!state.isEditOwnerModalVisible()) {
    isEditOwnerDraftActive = false;
    return '';
  }
  if (!isEditOwnerDraftActive) {
    syncEditOwnerDraftFromUser();
    isEditOwnerDraftActive = true;
  }

  return `
    <div id="edit-owner-overlay" class="fixed inset-0 z-[75] bg-[#FFF9E9] text-[#3E2723] overflow-y-auto overscroll-contain flex flex-col justify-start" dir="rtl">
      <div class="w-full max-w-md mx-auto flex flex-col px-4 sm:px-6 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        ${renderOwnerDetailsFormContent('edit', editOwnerFormState)}
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// Step 5: Has Pet Question (Exact Stitch _2/code.html)
// No extra subtitle added below heading.
// -------------------------------------------------------------
function renderHasPetStep(): string {
  return `
    <div class="flex-1 flex flex-col items-center justify-between py-1 sm:py-2 animate-fade-in">
      
      <!-- Header Logo -->
      <header class="w-full pt-0.5 sm:pt-2 flex flex-col items-center text-center">
        <div class="relative w-28 h-28 sm:w-40 sm:h-40 flex items-center justify-center">
          <img alt="Meow Logo" class="w-28 sm:w-40 h-auto mx-auto object-contain drop-shadow-sm select-none" src="${WELCOME_LOGO_URL}">
        </div>
      </header>

      <!-- Main Question, Pet Photo, and Action Buttons -->
      <div class="flex-1 flex flex-col items-center justify-center text-center space-y-5 sm:space-y-8 my-auto py-2 sm:py-4 w-full">
        <div>
          <h2 class="text-2xl sm:text-4xl font-extrabold text-[#2d221b] tracking-normal leading-snug font-baloo">
            هل تمتلك حيواناً أليفاً؟
          </h2>
        </div>

        <div class="flex justify-center items-center my-1 sm:my-2">
          <img
            src="${HAS_PET_IMG_URL}"
            alt="Pet"
            class="w-44 h-44 sm:w-56 sm:h-56 object-cover rounded-3xl shadow-md border-4 border-white/60"
          />
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full px-3 sm:px-4">
          <button
            type="button"
            id="btn-has-pet-yes"
            ${isCompletingOnboarding ? 'disabled' : ''}
            class="w-full sm:w-48 py-3.5 sm:py-5 px-6 sm:px-8 bg-[#e67e22] hover:bg-[#ea580c] active:scale-[0.98] text-white text-xl sm:text-2xl font-black rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2.5 sm:gap-3 cursor-pointer font-baloo ${
              isCompletingOnboarding ? 'opacity-65 cursor-not-allowed' : ''
            }"
          >
            <span class="whitespace-nowrap">مياو</span>
            <span class="text-xl sm:text-2xl">🐾</span>
          </button>

          <button
            type="button"
            id="btn-has-pet-no"
            ${isCompletingOnboarding ? 'disabled' : ''}
            class="w-full sm:w-48 py-3.5 sm:py-5 px-6 sm:px-8 bg-[#F3EBDD] hover:bg-[#eae0d0] active:scale-[0.98] text-[#564337] text-xl sm:text-2xl font-black rounded-full border-2 border-[#d6c7b2] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2.5 sm:gap-3 cursor-pointer font-baloo ${
              isCompletingOnboarding ? 'opacity-70 cursor-wait' : ''
            }"
          >
            <span>${isCompletingOnboarding ? 'جاري الإنهاء...' : 'لا'}</span>
          </button>
        </div>

        <div
          id="has-pet-error"
          class="${hasPetErrorMessage ? '' : 'hidden'} w-full max-w-sm rounded-2xl border border-rose-300 bg-rose-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-rose-700 leading-relaxed font-baloo"
          role="alert"
        >${escapeHtml(hasPetErrorMessage)}</div>
      </div>

    </div>
  `;
}

// -------------------------------------------------------------
// Step 6: Pet Details Form (Zero auto-fill + gender name text color)
// -------------------------------------------------------------
function renderBreedOptionsHtml(
  species: 'cat' | 'dog' | null,
  includeNoHybridPrefix = false,
  selectedValue = ''
): string {
  if (!species) {
    return includeNoHybridPrefix
      ? `<option value="" selected>بدون هجين</option>`
      : `<option value="" selected>اختر النوع أولاً</option>`;
  }

  const breeds = species === 'dog' ? DOG_BREEDS : CAT_BREEDS;
  if (includeNoHybridPrefix) {
    return [
      `<option value="" ${selectedValue === '' ? 'selected' : ''}>بدون هجين</option>`,
      ...breeds.map(
        (breed) =>
          `<option value="${escapeAttr(breed)}" ${breed === selectedValue ? 'selected' : ''}>${escapeHtml(breed)}</option>`
      ),
    ].join('');
  }

  return [
    `<option value="" ${selectedValue === '' ? 'selected' : ''}>اختر السلالة</option>`,
    ...breeds.map(
      (breed) =>
        `<option value="${escapeAttr(breed)}" ${breed === selectedValue ? 'selected' : ''}>${escapeHtml(breed)}</option>`
    ),
  ].join('');
}

function renderPetDetailsStep(): string {
  const isTraitsValid = selectedTraits.size >= 3;
  const petNameColorClass = getPetNameTextColorClass(selectedPetGender);

  return `
    <div class="flex-1 flex flex-col items-center justify-start py-0.5 sm:py-1 animate-fade-in">
      
      <!-- Header Section -->
      <header class="w-full pt-0.5 sm:pt-2 flex flex-col items-center text-center space-y-1.5 sm:space-y-3">
        <div class="relative w-24 h-24 sm:w-40 sm:h-40 flex items-center justify-center">
          <img alt="Meow Logo" class="w-24 sm:w-40 h-auto mx-auto object-contain drop-shadow-sm select-none" src="${WELCOME_LOGO_URL}">
        </div>
        <h1 class="text-xl sm:text-3xl font-extrabold text-[#1a1612] tracking-normal font-baloo">تسجيل بيانات المياو</h1>
      </header>

      <!-- Main Form directly on #FFF9E9 -->
      <div class="w-full flex-1 flex flex-col justify-start py-2.5 sm:py-4 min-w-0">
        <form id="pet-details-form" novalidate class="space-y-3.5 sm:space-y-5 font-baloo">
          
          <!-- نوع الأليف (عندك ايه: قطة / كلب) -->
          <div class="space-y-1.5 sm:space-y-2">
            <label class="block text-sm sm:text-base font-bold text-[#2d221b]">عندك ايه</label>
            <div id="pet-species-group" class="grid grid-cols-2 gap-3 sm:gap-3.5 rounded-[22px] sm:rounded-[28px]">
              <button
                type="button"
                id="pet-type-cat-btn"
                class="h-[52px] sm:h-16 relative flex items-center justify-center gap-2 sm:gap-2.5 px-3 sm:px-4 rounded-[22px] sm:rounded-[28px] border-2 ${
                  selectedPetSpecies === 'cat'
                    ? 'border-[#e67e22] bg-[#fff5ea] text-[#e67e22] font-extrabold'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold'
                } text-lg sm:text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="text-xl sm:text-2xl">🐱</span>
                <span class="font-black">قطة</span>
              </button>

              <button
                type="button"
                id="pet-type-dog-btn"
                class="h-[52px] sm:h-16 relative flex items-center justify-center gap-2 px-3 sm:px-4 rounded-[22px] sm:rounded-[28px] border-2 ${
                  selectedPetSpecies === 'dog'
                    ? 'border-[#e67e22] bg-[#fff5ea] text-[#e67e22] font-extrabold'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold'
                } text-lg sm:text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="text-xl sm:text-2xl">🐶</span>
                <span class="font-black">كلب</span>
              </button>
            </div>
          </div>

          <!-- صور للمياو (3 مربعات) -->
          <div class="space-y-1.5 sm:space-y-2">
            <label class="block text-sm sm:text-base font-bold text-[#2d221b]">صور للمياو</label>
            <div id="pet-photos-group" class="grid grid-cols-3 gap-2.5 sm:gap-3 rounded-2xl sm:rounded-3xl">
              ${[0, 1, 2]
                .map((idx) => {
                  const photo = uploadedPetPhotos[idx];
                  const isPrimary = idx === 0;
                  return `
                    <label
                      class="relative flex items-center justify-center aspect-square rounded-2xl sm:rounded-3xl border-2 overflow-hidden ${
                        isPrimary
                          ? 'border-[#e67e22] bg-[#fffbf2] hover:bg-[#fff5e5]'
                          : 'border-[#d6c7b2] bg-[#fffefc] hover:bg-[#faf6ed]'
                      } cursor-pointer transition-all shadow-sm group"
                    >
                      <input accept="image/*" class="hidden pet-photo-file-input" data-photo-slot="${idx}" type="file" />
                      ${
                        photo
                          ? `<img src="${escapeAttr(sanitizeImageSrc(photo, SAFE_FALLBACK_PET_SVG))}" alt="صورة ${idx + 1}" class="w-full h-full object-cover" />`
                          : `<span class="text-3xl sm:text-4xl font-black ${
                              isPrimary ? 'text-[#e67e22]' : 'text-[#998b7c]'
                            } group-hover:scale-110 transition-transform">+</span>`
                      }
                    </label>
                  `;
                })
                .join('')}
            </div>
          </div>

          <!-- اسم المياو واللون -->
          <div class="grid grid-cols-2 gap-2.5 sm:gap-3.5">
            <div class="space-y-1.5 sm:space-y-2 min-w-0">
              <label for="pet-name-input" class="block text-xs sm:text-base font-bold text-[#2d221b]">اسم المياو</label>
              <div class="relative flex items-center h-[52px] sm:h-16">
                <input
                  type="text"
                  id="pet-name-input"
                  value="${escapeAttr(draftPetName)}"
                  autocomplete="off"
                  class="w-full min-w-0 h-[52px] sm:h-16 py-3 sm:py-4 px-3 sm:px-5 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[22px] sm:rounded-[28px] text-sm sm:text-lg font-black text-center ${petNameColorClass} focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm"
                />
              </div>
            </div>

            <div class="space-y-1.5 sm:space-y-2 min-w-0">
              <label for="pet-color-input" class="block text-xs sm:text-base font-bold text-[#2d221b]">اللون</label>
              <div class="relative flex items-center h-[52px] sm:h-16">
                <input
                  type="text"
                  id="pet-color-input"
                  value="${escapeAttr(draftPetColor)}"
                  autocomplete="off"
                  class="w-full min-w-0 h-[52px] sm:h-16 py-3 sm:py-4 px-3 sm:px-5 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[22px] sm:rounded-[28px] text-sm sm:text-lg font-black text-center text-[#1a1612] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          <!-- السلالة وسلالة هجينة (اختياري) + العمر -->
          <div class="space-y-2.5 sm:space-y-3.5">
            <div class="grid grid-cols-2 gap-2.5 sm:gap-3.5">
              <div class="space-y-1.5 sm:space-y-2 min-w-0">
                <label for="pet-breed-select" class="block text-xs sm:text-base font-black text-[#2d221b]">السلالة</label>
                <div class="relative flex items-center h-[52px] sm:h-16">
                  <select
                    id="pet-breed-select"
                    ${selectedPetSpecies ? '' : 'disabled'}
                    class="w-full min-w-0 h-[52px] sm:h-16 py-2.5 sm:py-3 pr-3 sm:pr-4 pl-8 sm:pl-11 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[22px] sm:rounded-[28px] text-xs sm:text-base font-black text-right text-[#1a1612] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm appearance-none truncate ${
                      selectedPetSpecies ? 'cursor-pointer' : 'opacity-65 cursor-not-allowed'
                    }"
                  >
                    ${renderBreedOptionsHtml(selectedPetSpecies, false, draftPetBreed)}
                  </select>
                  <div class="pointer-events-none absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 flex items-center text-[#786555]">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="space-y-1.5 sm:space-y-2 min-w-0">
                <label for="pet-hybrid-select" class="block text-xs sm:text-base font-black text-[#2d221b] truncate">سلالة هجينة (اختياري)</label>
                <div class="relative flex items-center h-[52px] sm:h-16">
                  <select
                    id="pet-hybrid-select"
                    ${selectedPetSpecies ? '' : 'disabled'}
                    class="w-full min-w-0 h-[52px] sm:h-16 py-2.5 sm:py-3 pr-3 sm:pr-4 pl-8 sm:pl-11 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[22px] sm:rounded-[28px] text-xs sm:text-base font-black text-right text-[#1a1612] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm appearance-none truncate ${
                      selectedPetSpecies ? 'cursor-pointer' : 'opacity-65 cursor-not-allowed'
                    }"
                  >
                    ${renderBreedOptionsHtml(selectedPetSpecies, true, draftPetHybrid)}
                  </select>
                  <div class="pointer-events-none absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 flex items-center text-[#786555]">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- العمر -->
            <div class="space-y-1.5 sm:space-y-2">
              <label class="block text-sm sm:text-base font-black text-[#2d221b]">العمر</label>
              <div id="pet-age-group" class="grid grid-cols-2 gap-2.5 sm:gap-3.5 h-[52px] sm:h-16 rounded-[22px] sm:rounded-[28px]">
                <div class="relative flex items-center h-[52px] sm:h-16">
                  <input
                    type="number"
                    id="pet-age-years-input"
                    inputmode="numeric"
                    min="0"
                    max="25"
                    placeholder="سنة"
                    value="${escapeAttr(draftPetAgeYears)}"
                    class="w-full h-[52px] sm:h-16 py-3 sm:py-4 px-2 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[22px] sm:rounded-[28px] text-base sm:text-lg font-black text-center text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm"
                  />
                </div>
                <div class="relative flex items-center h-[52px] sm:h-16">
                  <input
                    type="number"
                    id="pet-age-months-input"
                    inputmode="numeric"
                    min="0"
                    max="11"
                    placeholder="شهر (اختياري)"
                    value="${escapeAttr(draftPetAgeMonths)}"
                    class="w-full h-[52px] sm:h-16 py-3 sm:py-4 px-2 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[22px] sm:rounded-[28px] text-sm sm:text-base font-black text-center text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- الجنس -->
          <div class="space-y-1.5 sm:space-y-2">
            <label class="block text-sm sm:text-base font-bold text-[#2d221b]">الجنس</label>
            <div id="pet-gender-group" class="grid grid-cols-2 gap-2.5 sm:gap-3.5 rounded-[22px] sm:rounded-[28px]">
              <button
                type="button"
                id="pet-gender-male-btn"
                class="h-[52px] sm:h-16 relative flex items-center justify-center gap-2 rounded-[22px] sm:rounded-[28px] border-2 ${
                  selectedPetGender === 'male'
                    ? 'border-[#3b82f6] bg-[#eff6ff] text-[#2563eb]'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } font-bold cursor-pointer shadow-sm transition-all active:scale-[0.98] text-lg sm:text-xl px-4 sm:px-5"
              >
                <span class="font-black">ذكر</span>
              </button>

              <button
                type="button"
                id="pet-gender-female-btn"
                class="h-[52px] sm:h-16 relative flex items-center justify-center gap-2 px-4 sm:px-5 rounded-[22px] sm:rounded-[28px] border-2 ${
                  selectedPetGender === 'female'
                    ? 'border-[#ec4899] bg-[#fce7f3] text-[#db2777]'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } font-bold text-lg sm:text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="font-black">انثى</span>
              </button>
            </div>
          </div>

          <!-- حالة التطعيم -->
          <div class="space-y-1.5 sm:space-y-2">
            <label class="block text-sm sm:text-base font-black text-[#2d221b]">حالة التطعيم</label>
            <div id="pet-vax-group" class="grid grid-cols-2 gap-2.5 sm:gap-3.5 h-[52px] sm:h-16 rounded-[22px] sm:rounded-[28px]">
              <button
                type="button"
                id="vax-yes-btn"
                class="h-[52px] sm:h-16 relative flex items-center justify-center gap-2 rounded-[22px] sm:rounded-[28px] border-2 ${
                  selectedVaccination === 'yes'
                    ? 'border-[#10b981] bg-[#ecfdf5] text-[#059669]'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } font-bold cursor-pointer shadow-sm transition-all active:scale-[0.98] text-sm sm:text-base px-2"
              >
                <i class="fa-solid fa-check"></i>
                <span class="font-black">مطعم</span>
              </button>

              <button
                type="button"
                id="vax-no-btn"
                class="h-[52px] sm:h-16 relative flex items-center justify-center gap-1.5 px-2 rounded-[22px] sm:rounded-[28px] border-2 ${
                  selectedVaccination === 'no'
                    ? 'border-[#ea580c] bg-[#fff7ed] text-[#c2410c]'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } font-bold text-sm sm:text-base cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="font-black">غير مطعم</span>
              </button>
            </div>
          </div>

          <!-- سمات الشخصية -->
          <div id="pet-traits-group" class="space-y-2 sm:space-y-2.5 pt-1 sm:pt-2 rounded-3xl">
            <div class="flex items-center justify-between gap-2 pb-1 flex-wrap">
              <div class="flex items-center gap-1.5 sm:gap-2">
                <label class="block text-lg sm:text-xl font-black text-[#2d221b]">الشخصية</label>
                <span class="text-[11px] sm:text-sm font-bold text-[#8a7663] bg-[#fffbf2] border border-[#d6c7b2]/60 px-2.5 sm:px-3 py-1 rounded-full shadow-sm">(اختر 3 إلى 6 صفات)</span>
              </div>
              <span
                id="traits-count-badge"
                class="text-[11px] sm:text-sm font-black px-2.5 sm:px-3 py-1 rounded-full border transition-all shadow-sm ${
                  isTraitsValid
                    ? 'bg-[#ecfdf5] text-[#059669] border-[#10b981]/30'
                    : 'bg-[#faecd8] text-[#c25807] border-[#e67e22]/20'
                }"
              >
                المحدد: ${selectedTraits.size} من 6
              </span>
            </div>

            <div class="flex flex-wrap pt-1 sm:pt-2 gap-2 sm:gap-2.5 justify-start">
              ${PERSONALITY_TRAITS.map((trait) => {
                const isSelected = selectedTraits.has(trait);
                return `
                  <button
                    type="button"
                    data-trait-name="${escapeAttr(trait)}"
                    class="trait-chip-btn rounded-full border-2 px-3.5 sm:px-5 py-1.5 sm:py-2.5 text-sm sm:text-base transition-all cursor-pointer select-none active:scale-95 shadow-sm flex items-center justify-center ${
                      isSelected
                        ? 'border-[#e67300] bg-[#fff2e2] text-[#c25807] font-black ring-2 ring-[#e67e22]/20'
                        : 'border-[#d6c7b2] bg-[#fffefc] text-[#6d5b4c] font-black hover:border-[#e67e22]/50'
                    }"
                  >
                    ${escapeHtml(trait)}
                  </button>
                `;
              }).join('')}
            </div>

            <p id="trait-limit-msg" class="text-xs font-bold text-rose-500 hidden">الحد الأقصى هو 6 صفات فقط!</p>
          </div>

          <!-- ملاحظات صحية / سلوكية -->
          <div class="space-y-1.5 sm:space-y-2">
            <label for="pet-notes-input" class="block text-sm sm:text-base font-bold text-[#2d221b]">ملاحظات صحية / سلوكية</label>
            <div class="relative flex items-center">
              <textarea
                id="pet-notes-input"
                rows="3"
                class="w-full p-3.5 sm:p-5 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[22px] sm:rounded-[28px] text-sm sm:text-lg font-black text-[#1a1612] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm resize-none"
              >${escapeHtml(draftPetNotes)}</textarea>
            </div>
          </div>

          <!-- Validation Alert -->
          <div
            id="pet-form-error"
            class="hidden rounded-2xl border border-rose-300 bg-rose-50 px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-rose-700 leading-relaxed"
            role="alert"
          ></div>

          <!-- CTA Button -->
          <div class="pt-2 sm:pt-4">
            <button
              id="btn-pet-submit"
              type="submit"
              class="w-full h-[54px] sm:h-16 px-6 text-white bg-[#e67e22] hover:bg-[#ea580c] rounded-[22px] sm:rounded-[28px] font-extrabold text-xl sm:text-2xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer font-baloo"
            >
              <span>نونو على الكلام</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  `;
}

// -------------------------------------------------------------
// Attach Events
// -------------------------------------------------------------
export function attachOnboardingEvents(): void {
  // Splash Screen automatically transitions after >=7000ms and auth readiness
  if (state.getOnboardingStep() === 'splash') {
    state.scheduleSplashAutoTransition();
  }

  // Step indicator dots navigation (backwards only — disallow skipping required steps)
  const stepOrder: OnboardingStep[] = ['welcome', 'auth_method', 'owner_details', 'has_pet', 'pet_details'];
  const stepDotBtns = document.querySelectorAll<HTMLButtonElement>('.onboarding-step-dot');
  stepDotBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetStep = btn.getAttribute('data-onboarding-step') as OnboardingStep | null;
      if (!targetStep) return;
      const currentIdx = stepOrder.indexOf(state.getOnboardingStep());
      const targetIdx = stepOrder.indexOf(targetStep);
      if (targetIdx >= 0 && targetIdx < currentIdx) {
        state.setOnboardingStep(targetStep);
      }
    });
  });

  // Welcome Next Button
  const welcomeNextBtn = document.getElementById('btn-welcome-next');
  if (welcomeNextBtn) {
    welcomeNextBtn.addEventListener('click', () => {
      state.setOnboardingStep('auth_method');
    });
  }

  // Auth Method: Email/Password SignUp & SignIn + Confirmation + OTP Recovery
  const authEmailInput = document.getElementById('auth-email-input') as HTMLInputElement | null;
  const authPasswordInput = document.getElementById('auth-password-input') as HTMLInputElement | null;
  const toggleAuthPasswordBtn = document.getElementById('btn-toggle-auth-password');
  const authEmailForm = document.getElementById('auth-email-form');
  const forgotPasswordBtn = document.getElementById('btn-forgot-password');
  const resendConfirmationBtn = document.getElementById('btn-resend-confirmation');
  const switchToLoginAfterConfirmBtn = document.getElementById('btn-switch-to-login-after-confirm');
  const authContinueBtn = document.getElementById('btn-auth-continue') as HTMLButtonElement | null;
  const termsCheckbox = document.getElementById('terms-checkbox') as HTMLInputElement | null;
  const termsBox = document.getElementById('terms-agreement-box');
  const loginGoogleBtn = document.getElementById('btn-login-google') as HTMLButtonElement | null;
  const toggleAuthModeBtn = document.getElementById('btn-toggle-auth-mode');

  const forgotPasswordForm = document.getElementById('forgot-password-form');
  const recoveryEmailInput = document.getElementById('recovery-email-input') as HTMLInputElement | null;
  const recoveryOtpForm = document.getElementById('recovery-otp-form');
  const recoveryOtpInput = document.getElementById('recovery-otp-input') as HTMLInputElement | null;
  const resendRecoveryOtpBtn = document.getElementById('btn-resend-recovery-otp') as HTMLButtonElement | null;
  const changeRecoveryEmailBtn = document.getElementById('btn-change-recovery-email') as HTMLButtonElement | null;
  const backToAuthMainBtn = document.getElementById('btn-back-to-auth-main');

  const recoveryPasswordForm = document.getElementById('recovery-password-form');
  const recoveryNewPasswordInput = document.getElementById('recovery-new-password-input') as HTMLInputElement | null;
  const recoveryConfirmPasswordInput = document.getElementById('recovery-confirm-password-input') as HTMLInputElement | null;
  const toggleRecoveryPwBtn = document.getElementById('btn-toggle-recovery-pw');
  const cancelRecoverySignoutBtn = document.getElementById('btn-cancel-recovery-signout');

  const refreshAuthStep = () => {
    state.setOnboardingStep('auth_method');
  };

  if (authEmailInput) {
    authEmailInput.addEventListener('input', () => {
      authEmail = authEmailInput.value;
    });
  }

  if (authPasswordInput) {
    authPasswordInput.addEventListener('input', () => {
      authPassword = authPasswordInput.value;
    });
  }

  if (toggleAuthPasswordBtn && authPasswordInput) {
    toggleAuthPasswordBtn.addEventListener('click', () => {
      showAuthPassword = !showAuthPassword;
      authPasswordInput.type = showAuthPassword ? 'text' : 'password';
      const icon = toggleAuthPasswordBtn.querySelector('i');
      if (icon) {
        icon.className = `fa-solid ${showAuthPassword ? 'fa-eye-slash' : 'fa-eye'}`;
      }
    });
  }

  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', () => {
      isTermsAccepted = Boolean(termsCheckbox.checked);
      state.setTermsAccepted(isTermsAccepted, true);
      if (isTermsAccepted && termsBox) {
        termsBox.className =
          'flex items-start gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-2xl border border-transparent transition-all';
        if (authErrorMessage.includes('شروط الاستخدام')) {
          authErrorMessage = '';
          const errEl = document.getElementById('auth-error-msg');
          if (errEl) {
            errEl.textContent = '';
            errEl.classList.add('hidden');
          }
        }
      }
    });
  }

  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', () => {
      stopRecoveryCooldownTimer();
      recoveryOtpCode = '';
      pendingConfirmationEmail = '';
      authSubView = 'forgot_password';
      authErrorMessage = '';
      authSuccessMessage = '';
      refreshAuthStep();
    });
  }

  if (backToAuthMainBtn) {
    backToAuthMainBtn.addEventListener('click', () => {
      stopRecoveryCooldownTimer();
      recoveryOtpCode = '';
      authSubView = 'main';
      authErrorMessage = '';
      authSuccessMessage = '';
      refreshAuthStep();
    });
  }

  if (switchToLoginAfterConfirmBtn) {
    switchToLoginAfterConfirmBtn.addEventListener('click', () => {
      authMode = 'login';
      authErrorMessage = '';
      authSuccessMessage = 'أدخل كلمة المرور لتسجيل الدخول بعد فتح رابط التفعيل في بريدك.';
      refreshAuthStep();
    });
  }

  if (resendConfirmationBtn) {
    resendConfirmationBtn.addEventListener('click', async () => {
      if (isResendingConfirmation) return;
      const targetEmail = (pendingConfirmationEmail || authEmail || '').trim();
      if (!targetEmail) {
        authErrorMessage = 'يرجى إدخال البريد الإلكتروني لإعادة إرسال رسالة التفعيل.';
        authSuccessMessage = '';
        refreshAuthStep();
        return;
      }

      isResendingConfirmation = true;
      authErrorMessage = '';
      authSuccessMessage = '';
      refreshAuthStep();

      const res = await resendSignUpConfirmationEmail(targetEmail);
      isResendingConfirmation = false;
      if (res.success) {
        authSuccessMessage = res.message || 'تم إرسال رابط التفعيل إلى بريدك الإلكتروني بنجاح.';
        authErrorMessage = '';
      } else {
        authErrorMessage = res.errorMessage || 'تعذر إعادة إرسال رابط التفعيل حاليًا.';
        authSuccessMessage = '';
      }
      refreshAuthStep();
    });
  }

  if (authContinueBtn) {
    authContinueBtn.addEventListener('click', async () => {
      if (isContinuingAuth || isAuthSubmitting || isGoogleSubmitting) return;
      if (!state.isSupabaseAuthenticated() || state.isSupabasePasswordRecovery()) {
        authErrorMessage = 'يرجى تسجيل الدخول بحساب مؤكد أولاً للمتابعة.';
        refreshAuthStep();
        return;
      }

      isContinuingAuth = true;
      authErrorMessage = '';
      authSuccessMessage = '';
      authContinueBtn.disabled = true;
      authContinueBtn.classList.add('opacity-70', 'cursor-wait');
      authContinueBtn.textContent = 'جاري المتابعة...';

      try {
        const res = await state.continueAuthenticatedFromAuthMethod();
        isContinuingAuth = false;
        if (!res.success) {
          authErrorMessage =
            res.errorMessage ||
            'تعذر تحميل بيانات الحساب من قاعدة البيانات. يرجى المحاولة مرة أخرى.';
          refreshAuthStep();
        }
      } catch {
        isContinuingAuth = false;
        authErrorMessage = 'تعذر متابعة التسجيل حاليًا. يرجى المحاولة مرة أخرى.';
        refreshAuthStep();
      }
    });
  }

  if (authEmailForm) {
    authEmailForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isAuthSubmitting || isGoogleSubmitting) return;

      authEmail = (authEmailInput?.value || authEmail || '').trim();
      authPassword = authPasswordInput?.value || authPassword || '';
      authErrorMessage = '';
      authSuccessMessage = '';

      if (authMode === 'signup') {
        const checked = Boolean(termsCheckbox?.checked && isTermsAccepted);
        if (!checked) {
          authErrorMessage = 'يرجى الموافقة على شروط الاستخدام وسياسة الخصوصية أولاً لإنشاء الحساب.';
          refreshAuthStep();
          return;
        }
      }

      if (state.isPreviewOnboardingMode()) {
        authErrorMessage =
          'أنت الآن في وضع المعاينة. لاختبار المصادقة الحقيقية، افتح التطبيق بدون ?preview=onboarding.';
        refreshAuthStep();
        return;
      }

      const submitBtn = document.getElementById('btn-auth-email-submit') as HTMLButtonElement | null;
      if (submitBtn) submitBtn.disabled = true;
      isAuthSubmitting = true;
      refreshAuthStep();

      try {
        if (authMode === 'signup') {
          const res = await signUpWithEmailPassword({
            email: authEmail,
            password: authPassword,
          });

          if (!res.success) {
            isAuthSubmitting = false;
            authErrorMessage = res.errorMessage || 'تعذر إنشاء الحساب. يرجى المحاولة مرة أخرى.';
            if (res.errorCode === 'user_already_exists') {
              pendingConfirmationEmail = '';
            }
            refreshAuthStep();
            return;
          }

          if (res.needsEmailConfirmation || !res.session) {
            isAuthSubmitting = false;
            pendingConfirmationEmail = authEmail;
            authSuccessMessage =
              res.message ||
              'تم إنشاء الحساب! يرجى تأكيد بريدك الإلكتروني عبر الرابط المرسل إليك قبل المتابعة.';
            authErrorMessage = '';
            refreshAuthStep();
            return;
          }

          pendingConfirmationEmail = '';
          const syncRes = await state.handleDirectSupabaseAuthSuccess(res.session, {
            isPasswordRecovery: false,
          });
          isAuthSubmitting = false;
          if (!syncRes.success) {
            authErrorMessage =
              syncRes.errorMessage || 'تم إنشاء الحساب لكن تعذر تحميل ملف الحساب. يرجى المحاولة مجددًا.';
            refreshAuthStep();
            return;
          }
          return;
        }

        // Login Mode
        const res = await signInWithEmailPassword({
          email: authEmail,
          password: authPassword,
        });

        if (!res.success || !res.session) {
          isAuthSubmitting = false;
          authErrorMessage = res.errorMessage || 'تعذر تسجيل الدخول. يرجى التحقق من البيانات.';
          if (res.needsEmailConfirmation || res.errorCode === 'email_not_confirmed') {
            pendingConfirmationEmail = authEmail;
          }
          refreshAuthStep();
          return;
        }

        pendingConfirmationEmail = '';
        const syncRes = await state.handleDirectSupabaseAuthSuccess(res.session, {
          isPasswordRecovery: false,
        });
        isAuthSubmitting = false;
        if (!syncRes.success) {
          authErrorMessage =
            syncRes.errorMessage || 'تم تسجيل الدخول لكن تعذر تحميل بيانات الحساب. يرجى المحاولة مجددًا.';
          refreshAuthStep();
          return;
        }
      } catch {
        isAuthSubmitting = false;
        authErrorMessage = 'حدث خطأ غير متوقع أثناء المصادقة. يرجى المحاولة مرة أخرى.';
        refreshAuthStep();
      }
    });
  }

  if (recoveryEmailInput) {
    recoveryEmailInput.addEventListener('input', () => {
      authEmail = recoveryEmailInput.value;
    });
  }

  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isSendingRecovery) return;
      authEmail = (recoveryEmailInput?.value || authEmail || '').trim();
      authErrorMessage = '';
      authSuccessMessage = '';

      isSendingRecovery = true;
      refreshAuthStep();

      const res = await sendPasswordRecoveryOtp(authEmail);
      isSendingRecovery = false;
      if (res.success) {
        authSubView = 'forgot_otp';
        recoveryOtpCode = '';
        startRecoveryCooldown(RECOVERY_OTP_COOLDOWN_SECONDS);
        authSuccessMessage =
          res.message ||
          'إذا كان البريد الإلكتروني مسجلًا لدينا، فقد تم إرسال رمز تحقق مكون من 6 أرقام إليه.';
      } else {
        authErrorMessage = res.errorMessage || 'تعذر إرسال رمز استعادة كلمة المرور.';
      }
      refreshAuthStep();
    });
  }

  if (recoveryOtpInput) {
    recoveryOtpInput.addEventListener('input', () => {
      const cleaned = recoveryOtpInput.value.replace(/\D/g, '').slice(0, 6);
      recoveryOtpInput.value = cleaned;
      recoveryOtpCode = cleaned;
    });
  }

  if (recoveryOtpForm) {
    recoveryOtpForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isVerifyingOtp || isResendingRecoveryOtp) return;
      const cleaned = (recoveryOtpInput?.value || recoveryOtpCode || '')
        .replace(/\D/g, '')
        .slice(0, 6);
      recoveryOtpCode = cleaned;
      authErrorMessage = '';
      authSuccessMessage = '';

      if (!/^\d{6}$/.test(cleaned)) {
        authErrorMessage = 'يرجى إدخال رمز التحقق المكون من 6 أرقام.';
        refreshAuthStep();
        return;
      }

      isVerifyingOtp = true;
      refreshAuthStep();

      const res = await verifyPasswordRecoveryOtp({
        email: authEmail,
        token: cleaned,
      });
      isVerifyingOtp = false;

      if (!res.success || !res.session) {
        authErrorMessage =
          res.errorMessage ||
          'رمز التحقق غير صحيح أو منتهي الصلاحية. يرجى التأكد من الأرقام أو طلب رمز جديد.';
        refreshAuthStep();
        return;
      }

      stopRecoveryCooldownTimer();
      recoveryOtpCode = '';
      authSubView = 'main';
      authNewPassword = '';
      authConfirmPassword = '';
      authSuccessMessage =
        res.message || 'تم التحقق من الرمز بنجاح. يمكنك الآن تعيين كلمة المرور الجديدة.';
      await state.handleDirectSupabaseAuthSuccess(res.session, {
        isPasswordRecovery: true,
      });
    });
  }

  if (resendRecoveryOtpBtn) {
    resendRecoveryOtpBtn.addEventListener('click', async () => {
      if (isResendingRecoveryOtp || isVerifyingOtp || recoveryResendSeconds > 0) return;
      authErrorMessage = '';
      authSuccessMessage = '';
      isResendingRecoveryOtp = true;
      refreshAuthStep();

      const res = await sendPasswordRecoveryOtp(authEmail);
      isResendingRecoveryOtp = false;
      if (res.success) {
        startRecoveryCooldown(RECOVERY_OTP_COOLDOWN_SECONDS);
        authSuccessMessage =
          res.message || 'تم إرسال رمز تحقق جديد مكون من 6 أرقام إلى بريدك الإلكتروني.';
      } else {
        if (
          res.errorCode === 'over_email_send_rate_limit' ||
          res.errorCode === 'over_request_rate_limit'
        ) {
          startRecoveryCooldown(RECOVERY_OTP_COOLDOWN_SECONDS);
        }
        authErrorMessage = res.errorMessage || 'تعذر إعادة إرسال رمز التحقق حاليًا.';
      }
      refreshAuthStep();
    });
  }

  if (changeRecoveryEmailBtn) {
    changeRecoveryEmailBtn.addEventListener('click', () => {
      stopRecoveryCooldownTimer();
      recoveryOtpCode = '';
      authSubView = 'forgot_password';
      authErrorMessage = '';
      authSuccessMessage = '';
      refreshAuthStep();
    });
  }

  if (recoveryNewPasswordInput) {
    recoveryNewPasswordInput.addEventListener('input', () => {
      authNewPassword = recoveryNewPasswordInput.value;
    });
  }

  if (recoveryConfirmPasswordInput) {
    recoveryConfirmPasswordInput.addEventListener('input', () => {
      authConfirmPassword = recoveryConfirmPasswordInput.value;
    });
  }

  if (toggleRecoveryPwBtn) {
    toggleRecoveryPwBtn.addEventListener('click', () => {
      showRecoveryPassword = !showRecoveryPassword;
      if (recoveryNewPasswordInput) {
        recoveryNewPasswordInput.type = showRecoveryPassword ? 'text' : 'password';
      }
      if (recoveryConfirmPasswordInput) {
        recoveryConfirmPasswordInput.type = showRecoveryPassword ? 'text' : 'password';
      }
      const icon = toggleRecoveryPwBtn.querySelector('i');
      if (icon) {
        icon.className = `fa-solid ${showRecoveryPassword ? 'fa-eye-slash' : 'fa-eye'}`;
      }
    });
  }

  if (recoveryPasswordForm) {
    recoveryPasswordForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isUpdatingPassword) return;

      if (!state.isSupabasePasswordRecovery() || !state.isSupabaseAuthenticated()) {
        authErrorMessage = 'يرجى التحقق من رمز الاستعادة المكون من 6 أرقام أولًا قبل تعيين كلمة المرور.';
        authSuccessMessage = '';
        refreshAuthStep();
        return;
      }

      authNewPassword = recoveryNewPasswordInput?.value || authNewPassword || '';
      authConfirmPassword = recoveryConfirmPasswordInput?.value || authConfirmPassword || '';
      authErrorMessage = '';
      authSuccessMessage = '';

      if (authNewPassword.length < 6) {
        authErrorMessage = 'كلمة المرور الجديدة يجب أن تتكون من 6 أحرف على الأقل.';
        refreshAuthStep();
        return;
      }
      if (authNewPassword !== authConfirmPassword) {
        authErrorMessage = 'كلمتا المرور غير متطابقتين. يرجى التأكد وإعادة الإدخال.';
        refreshAuthStep();
        return;
      }

      isUpdatingPassword = true;
      refreshAuthStep();

      const res = await updateSupabasePassword(authNewPassword);
      isUpdatingPassword = false;
      if (!res.success) {
        authErrorMessage = res.errorMessage || 'تعذر تحديث كلمة المرور حاليًا.';
        refreshAuthStep();
        return;
      }

      authNewPassword = '';
      authConfirmPassword = '';
      authSuccessMessage = res.message || 'تم تحديث كلمة المرور بنجاح.';
      await state.completePasswordRecoveryFlow(res.session);
    });
  }

  if (cancelRecoverySignoutBtn) {
    cancelRecoverySignoutBtn.addEventListener('click', async () => {
      authNewPassword = '';
      authConfirmPassword = '';
      authErrorMessage = '';
      authSuccessMessage = '';
      await state.signOutSupabaseAccount();
      authMode = 'login';
      refreshAuthStep();
    });
  }

  if (loginGoogleBtn) {
    loginGoogleBtn.addEventListener('click', async () => {
      if (isGoogleSubmitting || isAuthSubmitting) return;
      authErrorMessage = '';
      authSuccessMessage = '';

      if (authMode === 'signup') {
        const checked = Boolean(termsCheckbox?.checked && isTermsAccepted);
        if (!checked) {
          authErrorMessage = 'يرجى الموافقة على شروط الاستخدام وسياسة الخصوصية أولاً لإنشاء الحساب.';
          refreshAuthStep();
          return;
        }
      } else {
        state.setTermsAccepted(true, true);
      }

      if (state.isPreviewOnboardingMode()) {
        authErrorMessage =
          'أنت الآن في وضع المعاينة. لاختبار تسجيل الدخول عبر Google، افتح التطبيق بدون ?preview=onboarding.';
        refreshAuthStep();
        return;
      }

      loginGoogleBtn.disabled = true;
      isGoogleSubmitting = true;
      refreshAuthStep();

      try {
        const res = await signInWithGoogleSupabaseOAuth({
          onExternalBrowserClosed: () => {
            window.setTimeout(() => {
              if (
                isGoogleSubmitting &&
                !state.isSupabaseAuthenticated() &&
                !state.isProcessingAuthDeepLink() &&
                state.getOnboardingStep() === 'auth_method'
              ) {
                isGoogleSubmitting = false;
                if (!authErrorMessage && !state.getSupabaseAuthError()) {
                  authErrorMessage =
                    'تم إغلاق متصفح Google قبل إتمام تسجيل الدخول. يمكنك المحاولة مرة أخرى.';
                }
                refreshAuthStep();
              }
            }, 1200);
          },
        });

        if (!res.success) {
          isGoogleSubmitting = false;
          authErrorMessage =
            res.errorMessage || 'تعذر إتمام تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.';
          refreshAuthStep();
          return;
        }

        if (!res.launchedExternalBrowser && res.session) {
          const syncRes = await state.handleDirectSupabaseAuthSuccess(res.session, {
            isPasswordRecovery: false,
          });
          isGoogleSubmitting = false;
          if (!syncRes.success) {
            authErrorMessage =
              syncRes.errorMessage ||
              'تم تسجيل الدخول عبر Google لكن تعذر تحميل بيانات الحساب. يرجى المحاولة مجددًا.';
            refreshAuthStep();
          }
          return;
        }
      } catch {
        isGoogleSubmitting = false;
        authErrorMessage = 'تعذر إتمام تسجيل الدخول عبر Google. يرجى المحاولة مرة أخرى.';
        refreshAuthStep();
      }
    });
  }

  if (toggleAuthModeBtn) {
    toggleAuthModeBtn.addEventListener('click', () => {
      stopRecoveryCooldownTimer();
      authMode = authMode === 'login' ? 'signup' : 'login';
      authSubView = 'main';
      pendingConfirmationEmail = '';
      recoveryOtpCode = '';
      authErrorMessage = '';
      authSuccessMessage = '';
      state.setOnboardingStep('auth_method');
    });
  }

  attachOwnerDetailsFormEvents(onboardingOwnerFormState, async (payload) => {
    const result = await state.saveOwnerDetailsAndAdvance(
      payload.name,
      payload.city,
      payload.phone,
      payload.gender,
      payload.governorate,
      payload.extraLoc
    );
    return result;
  });
  attachRemainingOnboardingEvents();
}

function attachOwnerDetailsFormEvents(
  formState: OwnerDetailsFormValues,
  onValidSubmit: (payload: {
    name: string;
    city: string;
    phone: string;
    gender: 'male' | 'female';
    governorate: string;
    extraLoc: {
      governorateId?: string;
      markazId?: string;
      cityId?: string;
      villageId?: string;
      markaz?: string;
      village?: string;
    };
  }) => Promise<{ success: boolean; errorMessage?: string }> | { success: boolean; errorMessage?: string } | void
): void {
  const ownerNameInput = document.getElementById('owner-full-name-input') as HTMLInputElement | null;
  const ownerPhoneInput = document.getElementById('owner-phone-number-input') as HTMLInputElement | null;
  const ownerPhoneWrapper = document.getElementById('owner-phone-wrapper');
  const ownerPhoneHint = document.getElementById('owner-phone-hint');
  const ownerGenderGroup = document.getElementById('owner-gender-group');
  const ownerMaleBtn = document.getElementById('owner-gender-male-btn');
  const ownerFemaleBtn = document.getElementById('owner-gender-female-btn');
  const ownerFormError = document.getElementById('owner-form-error');

  if (ownerNameInput) {
    ownerNameInput.addEventListener('input', () => {
      formState.name = ownerNameInput.value;
      ownerNameInput.classList.remove('border-rose-500', 'ring-2', 'ring-rose-200');
    });
  }

  if (ownerPhoneInput) {
    ownerPhoneInput.addEventListener('input', () => {
      formState.phone = ownerPhoneInput.value;
      ownerPhoneWrapper?.classList.remove('ring-2', 'ring-rose-400');
      if (ownerPhoneHint) {
        const trimmed = ownerPhoneInput.value.trim();
        if (trimmed.length >= 3) {
          const check = validateEgyptianMobile(trimmed);
          if (!check.isValid && trimmed.length >= 10) {
            ownerPhoneHint.textContent = check.error || '';
            ownerPhoneHint.classList.remove('hidden');
          } else {
            ownerPhoneHint.textContent = '';
            ownerPhoneHint.classList.add('hidden');
          }
        } else {
          ownerPhoneHint.textContent = '';
          ownerPhoneHint.classList.add('hidden');
        }
      }
    });
  }

  if (ownerMaleBtn && ownerFemaleBtn) {
    ownerMaleBtn.addEventListener('click', () => {
      formState.gender = 'male';
      ownerGenderGroup?.classList.remove('ring-2', 'ring-rose-400', 'p-1');
      ownerMaleBtn.className =
        'h-16 relative flex items-center justify-center gap-2 px-5 rounded-[28px] border-2 border-[#3b82f6] bg-[#e8f1fc] text-[#2563eb] font-bold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]';
      ownerFemaleBtn.className =
        'h-16 relative flex items-center justify-center gap-2 px-5 rounded-[28px] border-2 border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]';
    });
    ownerFemaleBtn.addEventListener('click', () => {
      formState.gender = 'female';
      ownerGenderGroup?.classList.remove('ring-2', 'ring-rose-400', 'p-1');
      ownerFemaleBtn.className =
        'h-16 relative flex items-center justify-center gap-2 px-5 rounded-[28px] border-2 border-[#ec4899] bg-[#fce7f3] text-[#db2777] font-bold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]';
      ownerMaleBtn.className =
        'h-16 relative flex items-center justify-center gap-2 px-5 rounded-[28px] border-2 border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]';
    });
  }

  const initVillageMeta = getOwnerVillageMeta(formState.cityId);

  const ownerVillageSelect: SearchableSelectController | null = attachSearchableSelect({
    id: 'owner-village-select',
    options: initVillageMeta.options,
    value: formState.villageId,
    placeholder: initVillageMeta.placeholder,
    searchPlaceholder: 'ابحث عن القرية أو التجمع...',
    disabled: initVillageMeta.disabled,
    onChange: (newVillageId) => {
      formState.villageId = newVillageId;
    },
  });

  const ownerCitySelect: SearchableSelectController | null = attachSearchableSelect({
    id: 'owner-city-select',
    options: formState.markazId ? ownerNodesToOptions(getCitiesForMarkaz(formState.markazId)) : [],
    value: formState.cityId,
    placeholder: formState.markazId ? 'اختر المدينة أو الحي' : 'اختر المركز أولاً',
    searchPlaceholder: 'ابحث عن المدينة أو الحي...',
    disabled: !formState.markazId,
    onChange: (newCityId) => {
      formState.cityId = newCityId;
      formState.villageId = '';
      document
        .getElementById('owner-city-select-trigger')
        ?.classList.remove('border-rose-500', 'ring-2', 'ring-rose-200');
      const nextVillages = getOwnerVillageMeta(newCityId);
      ownerVillageSelect?.setOptions(
        nextVillages.options,
        '',
        nextVillages.disabled,
        nextVillages.placeholder
      );
    },
  });

  const ownerMarkazSelect: SearchableSelectController | null = attachSearchableSelect({
    id: 'owner-markaz-select',
    options: formState.govId ? ownerNodesToOptions(getMarkazesForGovernorate(formState.govId)) : [],
    value: formState.markazId,
    placeholder: formState.govId ? 'اختر المركز أو القسم' : 'اختر المحافظة أولاً',
    searchPlaceholder: 'ابحث عن المركز أو القسم...',
    disabled: !formState.govId,
    onChange: (newMarkazId) => {
      formState.markazId = newMarkazId;
      formState.cityId = '';
      formState.villageId = '';
      document
        .getElementById('owner-markaz-select-trigger')
        ?.classList.remove('border-rose-500', 'ring-2', 'ring-rose-200');
      const nextCities = getCitiesForMarkaz(newMarkazId);
      ownerCitySelect?.setOptions(
        ownerNodesToOptions(nextCities),
        '',
        nextCities.length === 0,
        nextCities.length > 0 ? 'اختر المدينة أو الحي' : 'لا توجد مدن مسجلة'
      );
      const resetVillages = getOwnerVillageMeta('');
      ownerVillageSelect?.setOptions(
        resetVillages.options,
        '',
        resetVillages.disabled,
        resetVillages.placeholder
      );
    },
  });

  const ownerGovSelect: SearchableSelectController | null = attachSearchableSelect({
    id: 'owner-governorate-select',
    options: ownerNodesToOptions(getGovernorates()),
    value: formState.govId,
    placeholder: 'اختر المحافظة',
    searchPlaceholder: 'ابحث عن المحافظة...',
    onChange: (newGovId) => {
      formState.govId = newGovId;
      formState.markazId = '';
      formState.cityId = '';
      formState.villageId = '';
      document
        .getElementById('owner-governorate-select-trigger')
        ?.classList.remove('border-rose-500', 'ring-2', 'ring-rose-200');
      const nextMarkazes = getMarkazesForGovernorate(newGovId);
      ownerMarkazSelect?.setOptions(
        ownerNodesToOptions(nextMarkazes),
        '',
        nextMarkazes.length === 0,
        nextMarkazes.length > 0 ? 'اختر المركز أو القسم' : 'لا توجد مراكز مسجلة'
      );
      ownerCitySelect?.setOptions([], '', true, 'اختر المركز أولاً');
      const resetVillages = getOwnerVillageMeta('');
      ownerVillageSelect?.setOptions(
        resetVillages.options,
        '',
        resetVillages.disabled,
        resetVillages.placeholder
      );
    },
  });

  const ownerForm = document.getElementById('owner-details-form');
  const ownerSubmitBtn = document.getElementById('btn-owner-submit') as HTMLButtonElement | null;
  if (ownerForm) {
    ownerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isSavingOwnerDetails) return;

      const name = (ownerNameInput?.value || '').trim();
      const phoneRaw = (ownerPhoneInput?.value || '').trim();
      const govIdVal = (ownerGovSelect?.getValue() || formState.govId || '').trim();
      const markazIdVal = (ownerMarkazSelect?.getValue() || formState.markazId || '').trim();
      const cityIdVal = (ownerCitySelect?.getValue() || formState.cityId || '').trim();
      const villageIdVal = (ownerVillageSelect?.getValue() || formState.villageId || '').trim();
      const phoneCheck = validateEgyptianMobile(phoneRaw);

      const errors: string[] = [];

      if (name.length < 2) {
        errors.push('• يرجى كتابة الاسم الكامل (حرفين على الأقل).');
        ownerNameInput?.classList.add('border-rose-500', 'ring-2', 'ring-rose-200');
      }
      if (!phoneCheck.isValid) {
        errors.push(`• ${phoneCheck.error || 'رقم الهاتف المصري غير صحيح.'}`);
        ownerPhoneWrapper?.classList.add('ring-2', 'ring-rose-400');
        if (ownerPhoneHint) {
          ownerPhoneHint.textContent = phoneCheck.error || '';
          ownerPhoneHint.classList.remove('hidden');
        }
      }
      if (!formState.gender) {
        errors.push('• يرجى اختيار الجنس (ذكر أو أنثى).');
        ownerGenderGroup?.classList.add('ring-2', 'ring-rose-400', 'p-1');
      }
      if (!govIdVal) {
        errors.push('• يرجى اختيار المحافظة.');
        document
          .getElementById('owner-governorate-select-trigger')
          ?.classList.add('border-rose-500', 'ring-2', 'ring-rose-200');
      }
      if (!markazIdVal) {
        errors.push('• يرجى اختيار المركز أو القسم.');
        document
          .getElementById('owner-markaz-select-trigger')
          ?.classList.add('border-rose-500', 'ring-2', 'ring-rose-200');
      }
      if (!cityIdVal) {
        errors.push('• يرجى اختيار المدينة أو الحي.');
        document
          .getElementById('owner-city-select-trigger')
          ?.classList.add('border-rose-500', 'ring-2', 'ring-rose-200');
      }

      if (errors.length > 0) {
        if (ownerFormError) {
          ownerFormError.innerHTML = errors.map(escapeHtml).join('<br />');
          ownerFormError.classList.remove('hidden');
          ownerFormError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      if (ownerFormError) {
        ownerFormError.innerHTML = '';
        ownerFormError.classList.add('hidden');
      }

      const govNode = getGeoNodeById(govIdVal);
      const markazNode = getGeoNodeById(markazIdVal);
      const cityNode = getGeoNodeById(cityIdVal);
      const villageNode = getGeoNodeById(villageIdVal);

      const originalLabel = ownerSubmitBtn?.innerHTML || '';
      isSavingOwnerDetails = true;
      if (ownerSubmitBtn) {
        ownerSubmitBtn.disabled = true;
        ownerSubmitBtn.classList.add('opacity-70', 'cursor-wait');
        ownerSubmitBtn.innerHTML = '<span>جاري حفظ البيانات...</span>';
      }

      try {
        const result = await onValidSubmit({
          name,
          city: cityNode?.name || '',
          phone: phoneCheck.normalized,
          gender: formState.gender!,
          governorate: govNode?.name || '',
          extraLoc: {
            governorateId: govIdVal,
            markazId: markazIdVal,
            cityId: cityIdVal,
            villageId: villageIdVal || undefined,
            markaz: markazNode?.name || undefined,
            village: villageNode?.name || undefined,
          },
        });

        if (result && !result.success) {
          if (ownerFormError) {
            ownerFormError.textContent =
              result.errorMessage || 'تعذر حفظ البيانات. يرجى المحاولة مرة أخرى.';
            ownerFormError.classList.remove('hidden');
            ownerFormError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      } catch {
        if (ownerFormError) {
          ownerFormError.textContent = 'حدث خطأ أثناء حفظ البيانات. يرجى المحاولة مرة أخرى.';
          ownerFormError.classList.remove('hidden');
        }
      } finally {
        isSavingOwnerDetails = false;
        if (ownerSubmitBtn) {
          ownerSubmitBtn.disabled = false;
          ownerSubmitBtn.classList.remove('opacity-70', 'cursor-wait');
          if (originalLabel) ownerSubmitBtn.innerHTML = originalLabel;
        }
      }
    });
  }
}

export function attachOwnerEditEvents(): void {
  const closeBtn = document.getElementById('close-edit-owner-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      isEditOwnerDraftActive = false;
      state.setEditOwnerModalVisible(false);
    });
  }

  attachOwnerDetailsFormEvents(editOwnerFormState, async (payload) => {
    const res = await state.saveOwnerEditWithSupabase(
      payload.name,
      payload.city,
      payload.phone,
      payload.gender,
      payload.governorate,
      payload.extraLoc
    );
    if (res.success) {
      isEditOwnerDraftActive = false;
      state.setEditOwnerModalVisible(false);
    }
    return res;
  });
}

function attachRemainingOnboardingEvents(): void {

  // Has Pet: Yes (مياو 🐾) -> Goes to Pet Details
  const hasPetYesBtn = document.getElementById('btn-has-pet-yes');
  if (hasPetYesBtn) {
    hasPetYesBtn.addEventListener('click', () => {
      if (isCompletingOnboarding) return;
      hasPetErrorMessage = '';
      state.setOnboardingStep('pet_details');
    });
  }

  // Has Pet: No (لا) -> Completes onboarding after confirming save in Supabase
  const hasPetNoBtn = document.getElementById('btn-has-pet-no');
  if (hasPetNoBtn) {
    hasPetNoBtn.addEventListener('click', async () => {
      if (isCompletingOnboarding) return;
      isCompletingOnboarding = true;
      hasPetErrorMessage = '';
      state.setOnboardingStep('has_pet');

      const res = await state.completeOnboardingWithSupabase();
      isCompletingOnboarding = false;
      if (!res.success) {
        hasPetErrorMessage =
          res.errorMessage || 'تعذر إتمام التسجيل حاليًا. يرجى المحاولة مرة أخرى.';
        state.setOnboardingStep('has_pet');
      }
    });
  }

  // Pet Details: Cat / Dog Toggle + dynamic breed dropdown updates (zero auto-fill)
  const catBtn = document.getElementById('pet-type-cat-btn');
  const dogBtn = document.getElementById('pet-type-dog-btn');
  const speciesGroup = document.getElementById('pet-species-group');
  const photosGroup = document.getElementById('pet-photos-group');
  const petNameInput = document.getElementById('pet-name-input') as HTMLInputElement | null;
  const petColorInput = document.getElementById('pet-color-input') as HTMLInputElement | null;
  const breedSelect = document.getElementById('pet-breed-select') as HTMLSelectElement | null;
  const hybridSelect = document.getElementById('pet-hybrid-select') as HTMLSelectElement | null;
  const petAgeGroup = document.getElementById('pet-age-group');
  const petGenderGroup = document.getElementById('pet-gender-group');
  const petVaxGroup = document.getElementById('pet-vax-group');
  const petTraitsGroup = document.getElementById('pet-traits-group');
  const petNotesInput = document.getElementById('pet-notes-input') as HTMLTextAreaElement | null;
  const petFormError = document.getElementById('pet-form-error');

  if (petNameInput) {
    petNameInput.addEventListener('input', () => {
      draftPetName = petNameInput.value;
      petNameInput.classList.remove('border-rose-500', 'ring-2', 'ring-rose-200');
    });
  }
  if (petColorInput) {
    petColorInput.addEventListener('input', () => {
      draftPetColor = petColorInput.value;
      petColorInput.classList.remove('border-rose-500', 'ring-2', 'ring-rose-200');
    });
  }
  if (breedSelect) {
    breedSelect.addEventListener('change', () => {
      draftPetBreed = breedSelect.value;
      breedSelect.classList.remove('border-rose-500', 'ring-2', 'ring-rose-200');
    });
  }
  if (hybridSelect) {
    hybridSelect.addEventListener('change', () => {
      draftPetHybrid = hybridSelect.value;
    });
  }
  if (petNotesInput) {
    petNotesInput.addEventListener('input', () => {
      draftPetNotes = petNotesInput.value;
    });
  }

  const updatePetSpeciesUI = (species: 'cat' | 'dog') => {
    const speciesChanged = selectedPetSpecies !== species;
    selectedPetSpecies = species;
    if (speciesChanged) {
      draftPetBreed = '';
      draftPetHybrid = '';
    }
    speciesGroup?.classList.remove('ring-2', 'ring-rose-400', 'p-1');

    if (catBtn && dogBtn) {
      if (species === 'cat') {
        catBtn.className =
          'h-16 relative flex items-center justify-center gap-2.5 px-4 rounded-[28px] border-2 border-[#e67e22] bg-[#fff5ea] text-[#e67e22] font-extrabold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]';
        dogBtn.className =
          'h-16 relative flex items-center justify-center gap-2 px-4 rounded-[28px] border-2 border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]';
      } else {
        dogBtn.className =
          'h-16 relative flex items-center justify-center gap-2 px-4 rounded-[28px] border-2 border-[#e67e22] bg-[#fff5ea] text-[#e67e22] font-extrabold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]';
        catBtn.className =
          'h-16 relative flex items-center justify-center gap-2.5 px-4 rounded-[28px] border-2 border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]';
      }
    }
    if (breedSelect) {
      breedSelect.disabled = false;
      breedSelect.classList.remove('opacity-65', 'cursor-not-allowed');
      breedSelect.classList.add('cursor-pointer');
      breedSelect.innerHTML = renderBreedOptionsHtml(species, false, draftPetBreed);
    }
    if (hybridSelect) {
      hybridSelect.disabled = false;
      hybridSelect.classList.remove('opacity-65', 'cursor-not-allowed');
      hybridSelect.classList.add('cursor-pointer');
      hybridSelect.innerHTML = renderBreedOptionsHtml(species, true, draftPetHybrid);
    }
  };

  if (catBtn && dogBtn) {
    catBtn.addEventListener('click', () => updatePetSpeciesUI('cat'));
    dogBtn.addEventListener('click', () => updatePetSpeciesUI('dog'));
  }

  // Pet Details: Photo file upload slots
  const photoInputs = document.querySelectorAll<HTMLInputElement>('.pet-photo-file-input');
  photoInputs.forEach((input) => {
    input.addEventListener('change', () => {
      const slotStr = input.getAttribute('data-photo-slot');
      const slot = slotStr ? parseInt(slotStr, 10) : -1;
      const file = input.files?.[0];
      if (!file || slot < 0 || slot > 2) return;

      const validation = validateUploadedFile(file, 'image');
      if (!validation.valid) {
        input.value = '';
        if (petFormError) {
          petFormError.textContent =
            validation.errorMessage || 'ملف الصورة غير مدعوم أو يتجاوز الحد المسموح.';
          petFormError.classList.remove('hidden');
          petFormError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      if (petFormError) {
        petFormError.innerHTML = '';
        petFormError.classList.add('hidden');
      }
      photosGroup?.classList.remove('ring-2', 'ring-rose-400', 'p-1');

      const reader = new FileReader();
      reader.onload = () => {
        const rawResult = typeof reader.result === 'string' ? reader.result : '';
        const safeResult = sanitizeImageSrc(rawResult, '');
        if (!safeResult) return;
        uploadedPetPhotos[slot] = safeResult;
        const labelEl = input.closest('label');
        if (labelEl) {
          const existingImg = labelEl.querySelector('img');
          const plusSpan = labelEl.querySelector('span');
          if (plusSpan) plusSpan.remove();
          if (existingImg) {
            existingImg.src = safeResult;
          } else {
            const img = document.createElement('img');
            img.src = safeResult;
            img.alt = `صورة ${slot + 1}`;
            img.className = 'w-full h-full object-cover';
            labelEl.appendChild(img);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  });

  // Pet Details: Age numeric sanitization
  const ageYearsInput = document.getElementById('pet-age-years-input') as HTMLInputElement | null;
  const ageMonthsInput = document.getElementById('pet-age-months-input') as HTMLInputElement | null;
  if (ageYearsInput) {
    ageYearsInput.addEventListener('input', () => {
      ageYearsInput.value = ageYearsInput.value.replace(/[^0-9]/g, '');
      draftPetAgeYears = ageYearsInput.value;
      petAgeGroup?.classList.remove('ring-2', 'ring-rose-400');
    });
  }
  if (ageMonthsInput) {
    ageMonthsInput.addEventListener('input', () => {
      ageMonthsInput.value = ageMonthsInput.value.replace(/[^0-9]/g, '');
      draftPetAgeMonths = ageMonthsInput.value;
      petAgeGroup?.classList.remove('ring-2', 'ring-rose-400');
    });
  }

  // Pet Details: Gender Buttons + Live Pet Name Text Color
  const applyPetNameGenderColor = (gender: 'male' | 'female' | null) => {
    if (!petNameInput) return;
    petNameInput.classList.remove('text-[#1a1612]', 'text-[#60A5FA]', 'text-[#F472B6]');
    petNameInput.classList.add(getPetNameTextColorClass(gender));
  };

  const petMaleBtn = document.getElementById('pet-gender-male-btn');
  const petFemaleBtn = document.getElementById('pet-gender-female-btn');
  if (petMaleBtn && petFemaleBtn) {
    petMaleBtn.addEventListener('click', () => {
      selectedPetGender = 'male';
      petGenderGroup?.classList.remove('ring-2', 'ring-rose-400', 'p-1');
      petMaleBtn.className =
        'h-16 relative flex items-center justify-center gap-2 rounded-[28px] border-2 border-[#3b82f6] bg-[#eff6ff] text-[#2563eb] font-bold cursor-pointer shadow-sm transition-all active:scale-[0.98] text-xl px-5';
      petFemaleBtn.className =
        'h-16 relative flex items-center justify-center gap-2 px-5 rounded-[28px] border-2 border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]';
      applyPetNameGenderColor('male');
    });
    petFemaleBtn.addEventListener('click', () => {
      selectedPetGender = 'female';
      petGenderGroup?.classList.remove('ring-2', 'ring-rose-400', 'p-1');
      petFemaleBtn.className =
        'h-16 relative flex items-center justify-center gap-2 px-5 rounded-[28px] border-2 border-[#ec4899] bg-[#fce7f3] text-[#db2777] font-bold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]';
      petMaleBtn.className =
        'h-16 relative flex items-center justify-center gap-2 rounded-[28px] border-2 border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold cursor-pointer shadow-sm transition-all active:scale-[0.98] text-xl px-5';
      applyPetNameGenderColor('female');
    });
  }

  // Vaccination Yes/No
  const vaxYes = document.getElementById('vax-yes-btn');
  const vaxNo = document.getElementById('vax-no-btn');
  if (vaxYes && vaxNo) {
    vaxYes.addEventListener('click', () => {
      selectedVaccination = 'yes';
      petVaxGroup?.classList.remove('ring-2', 'ring-rose-400', 'p-1');
      vaxYes.className =
        'h-16 relative flex items-center justify-center gap-2 rounded-[28px] border-2 border-[#10b981] bg-[#ecfdf5] text-[#059669] font-bold cursor-pointer shadow-sm transition-all active:scale-[0.98] text-base px-2';
      vaxNo.className =
        'h-16 relative flex items-center justify-center gap-1.5 px-2 rounded-[28px] border-2 border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold text-base cursor-pointer shadow-sm transition-all active:scale-[0.98]';
    });
    vaxNo.addEventListener('click', () => {
      selectedVaccination = 'no';
      petVaxGroup?.classList.remove('ring-2', 'ring-rose-400', 'p-1');
      vaxNo.className =
        'h-16 relative flex items-center justify-center gap-1.5 px-2 rounded-[28px] border-2 border-[#ea580c] bg-[#fff7ed] text-[#c2410c] font-bold text-base cursor-pointer shadow-sm transition-all active:scale-[0.98]';
      vaxYes.className =
        'h-16 relative flex items-center justify-center gap-2 rounded-[28px] border-2 border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold cursor-pointer shadow-sm transition-all active:scale-[0.98] text-base px-2';
    });
  }

  // Personality Trait Chips
  const traitBtns = document.querySelectorAll<HTMLButtonElement>('.trait-chip-btn');
  const countBadge = document.getElementById('traits-count-badge');
  const limitMsg = document.getElementById('trait-limit-msg');
  traitBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const trait = btn.getAttribute('data-trait-name');
      if (!trait) return;

      if (selectedTraits.has(trait)) {
        selectedTraits.delete(trait);
        btn.className =
          'trait-chip-btn rounded-full border-2 px-5 py-2.5 text-base transition-all cursor-pointer select-none active:scale-95 shadow-sm flex items-center justify-center border-[#d6c7b2] bg-[#fffefc] text-[#6d5b4c] font-black hover:border-[#e67e22]/50';
        if (limitMsg) limitMsg.classList.add('hidden');
      } else {
        if (selectedTraits.size >= 6) {
          if (limitMsg) {
            limitMsg.classList.remove('hidden');
            setTimeout(() => limitMsg.classList.add('hidden'), 2500);
          }
          return;
        }
        selectedTraits.add(trait);
        btn.className =
          'trait-chip-btn rounded-full border-2 px-5 py-2.5 text-base transition-all cursor-pointer select-none active:scale-95 shadow-sm flex items-center justify-center border-[#e67300] bg-[#fff2e2] text-[#c25807] font-black ring-2 ring-[#e67300]/20';
        if (limitMsg) limitMsg.classList.add('hidden');
      }

      if (selectedTraits.size >= 3) {
        petTraitsGroup?.classList.remove('ring-2', 'ring-rose-400', 'p-2');
      }

      if (countBadge) {
        countBadge.textContent = `المحدد: ${selectedTraits.size} من 6`;
        if (selectedTraits.size >= 3) {
          countBadge.className =
            'text-xs sm:text-sm font-black px-3 py-1 rounded-full border transition-all shadow-sm bg-[#ecfdf5] text-[#059669] border-[#10b981]/30';
        } else {
          countBadge.className =
            'text-xs sm:text-sm font-black px-3 py-1 rounded-full border transition-all shadow-sm bg-[#faecd8] text-[#c25807] border-[#e67e22]/20';
        }
      }
    });
  });

  // Pet Details Form Submit ("نونو على الكلام") — Strict Mandatory Field Gate
  const petForm = document.getElementById('pet-details-form');
  const petSubmitBtn = document.getElementById('btn-pet-submit') as HTMLButtonElement | null;
  if (petForm) {
    petForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (isCompletingOnboarding) return;
      const name = (petNameInput?.value || '').trim();
      const color = (petColorInput?.value || '').trim();
      const breed = (breedSelect?.value || '').trim();
      const hybridBreed = (hybridSelect?.value || '').trim();
      const ageYearsRaw = (ageYearsInput?.value || '').trim();
      const ageMonthsRaw = (ageMonthsInput?.value || '').trim();
      const notes = (petNotesInput?.value || '').trim();

      const ageYears = ageYearsRaw !== '' ? parseInt(ageYearsRaw, 10) : 0;
      const ageMonths = ageMonthsRaw !== '' ? parseInt(ageMonthsRaw, 10) : 0;
      const validPhotos = uploadedPetPhotos.filter((p): p is string => Boolean(p));

      const errors: string[] = [];

      if (!selectedPetSpecies) {
        errors.push('• يرجى اختيار نوع الأليف (قطة أو كلب).');
        speciesGroup?.classList.add('ring-2', 'ring-rose-400', 'p-1');
      }
      if (validPhotos.length === 0) {
        errors.push('• يرجى إضافة صورة واحدة على الأقل للأليف.');
        photosGroup?.classList.add('ring-2', 'ring-rose-400', 'p-1');
      }
      if (!name) {
        errors.push('• يرجى كتابة اسم الأليف.');
        petNameInput?.classList.add('border-rose-500', 'ring-2', 'ring-rose-200');
      }
      if (!color) {
        errors.push('• يرجى كتابة لون الأليف.');
        petColorInput?.classList.add('border-rose-500', 'ring-2', 'ring-rose-200');
      }
      if (!breed) {
        errors.push('• يرجى اختيار سلالة الأليف.');
        breedSelect?.classList.add('border-rose-500', 'ring-2', 'ring-rose-200');
      }
      if (
        (ageYearsRaw === '' && ageMonthsRaw === '') ||
        isNaN(ageYears) ||
        isNaN(ageMonths) ||
        ageYears < 0 ||
        ageYears > 25 ||
        ageMonths < 0 ||
        ageMonths > 11 ||
        ageYears + ageMonths === 0
      ) {
        errors.push('• يرجى إدخال عمر صحيح للأليف (سنوات من 0-25 أو أشهر من 1-11).');
        petAgeGroup?.classList.add('ring-2', 'ring-rose-400');
      }
      if (!selectedPetGender) {
        errors.push('• يرجى اختيار جنس الأليف (ذكر أو أنثى).');
        petGenderGroup?.classList.add('ring-2', 'ring-rose-400', 'p-1');
      }
      if (!selectedVaccination) {
        errors.push('• يرجى تحديد حالة التطعيم (مطعم أو غير مطعم).');
        petVaxGroup?.classList.add('ring-2', 'ring-rose-400', 'p-1');
      }
      if (selectedTraits.size < 3 || selectedTraits.size > 6) {
        errors.push('• يرجى اختيار من 3 إلى 6 صفات شخصية للأليف.');
        petTraitsGroup?.classList.add('ring-2', 'ring-rose-400', 'p-2');
      }

      if (errors.length > 0) {
        if (petFormError) {
          petFormError.innerHTML = errors.map(escapeHtml).join('<br />');
          petFormError.classList.remove('hidden');
          petFormError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      if (petFormError) {
        petFormError.innerHTML = '';
        petFormError.classList.add('hidden');
      }

      if (!hasSavedOnboardingPet) {
        const currentUser = state.getUser();
        state.savePet({
          name,
          breed,
          hybridBreed: hybridBreed || undefined,
          color,
          species: selectedPetSpecies!,
          gender: selectedPetGender!,
          photos: validPhotos,
          ageYears,
          ageMonths,
          area: currentUser.village || currentUser.city || currentUser.governorate || 'القاهرة',
          city: currentUser.city || currentUser.governorate || 'القاهرة',
          governorate: currentUser.governorate || 'القاهرة',
          markaz: currentUser.markaz,
          village: currentUser.village,
          governorateId: currentUser.governorateId,
          markazId: currentUser.markazId,
          cityId: currentUser.cityId,
          villageId: currentUser.villageId,
          locationId: currentUser.locationId,
          lat: currentUser.lat,
          lng: currentUser.lng,
          healthNotes: notes || '',
          personality: Array.from(selectedTraits),
          vaccinationStatus: selectedVaccination === 'yes' ? 'fully_vaccinated' : 'not_vaccinated',
          status: 'mating',
        });
        hasSavedOnboardingPet = true;
      }

      isCompletingOnboarding = true;
      const originalLabel = petSubmitBtn?.innerHTML || '';
      if (petSubmitBtn) {
        petSubmitBtn.disabled = true;
        petSubmitBtn.classList.add('opacity-70', 'cursor-wait');
        petSubmitBtn.innerHTML = '<span>جاري إتمام التسجيل...</span>';
      }

      try {
        const res = await state.completeOnboardingWithSupabase();
        if (!res.success && petFormError) {
          petFormError.textContent =
            res.errorMessage || 'تعذر تأكيد إتمام التسجيل حاليًا. يرجى المحاولة مرة أخرى.';
          petFormError.classList.remove('hidden');
          petFormError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      } finally {
        isCompletingOnboarding = false;
        if (petSubmitBtn) {
          petSubmitBtn.disabled = false;
          petSubmitBtn.classList.remove('opacity-70', 'cursor-wait');
          if (originalLabel) petSubmitBtn.innerHTML = originalLabel;
        }
      }
    });
  }
}
