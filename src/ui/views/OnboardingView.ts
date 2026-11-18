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
import { signInWithGoogleOAuth } from '../../services/authService.ts';
import { validateEgyptianMobile } from '../../utils/validation.ts';

const SPLASH_LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBkUboxHVAVTpJU18DOk8LGxlZINhBS3GyspVpAnljo_ufEzmybRtZjfwD2izQ4ck6QZJszfzEROi_8GSqmxgIs8nfh6X9a2weRQJHugsh7tIjzldPRXfASsGwL1ed96d1NI3PLfkVzY7jisJPkE-wbo5VsxogWc5MkQYTEdiFPaSO2GHSv4O7QhUswU9KT4XnE4sieTVurv6MPIAjNrs3MPskxA07TFv2ZDQdowVrUfuT6-BTLSIhQKmYp7q5sJcab';

const MASCOT_IMG_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBjCmSu0xDxJXyrHUBK1tLOi3THUHNrBykChM-wCkfFmb7-SylOoi2gZy7q_0EhekEOoSWaq1XAW437WsLx2Q-8LdB5VeHq3alZjh5JUU5lAdHpKERnUOvvsVZHitTZTkE0WfQaUjnb15I4u4ZRg-k6nKAGaMLGRGvlkBmmux8JCsxfcFhuyG6PsA2X6yQCLhFb6xjiq2en0tv84Rc-_1K1_Iz8Ksk-G_oCqvhJR4epnBXI3Nb8P4VJGtYl5QeTGeaj';

const WELCOME_LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAWUkBSCToKuvsTzQdLeDgwewWrq25QuzlXIMyGRB-Io9sku--2d3rTcZCl6XZF69mO-W6kLkpbWijMmbnBhZlr96SK1xym8KWRRwcSdB8eG2gUQx5yRozTUYvWbUiRkg1vcpkatS1wxB3IgxzpC-b_yVuh9f3pVi_2uo_Gf95WQrWe8elhb3rg8B95vh6Qy2i7uhWh2lwB01rwZrliMckY1uDIvnwkaTKPZtS7CJw';

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
let selectedAuthMethod: 'google' | 'apple' | null = null;
let authMode: 'login' | 'signup' = 'signup';
let isTermsAccepted = false;
let isAuthenticatingWithGoogle = false;
let authErrorMessage: string = '';

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

function resetTransientAuthState(): void {
  selectedAuthMethod = null;
  isTermsAccepted = false;
  isAuthenticatingWithGoogle = false;
  authErrorMessage = '';
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

function escapeAttr(val: string): string {
  return (val || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getPetNameTextColorClass(gender: 'male' | 'female' | null): string {
  if (gender === 'male') return 'text-[#60A5FA]';
  if (gender === 'female') return 'text-[#F472B6]';
  return 'text-[#1a1612]';
}

export function renderOnboardingView(): string {
  const step = state.getOnboardingStep();

  if (step !== lastRenderedStep) {
    lastRenderedStep = step;
    if (step === 'auth_method') {
      authMode = 'signup';
      resetTransientAuthState();
    } else if (step === 'splash') {
      authMode = 'signup';
      resetTransientAuthState();
      resetTransientFormState();
    }
  }

  // Splash screen renders standalone without step dots or footer
  if (step === 'splash') {
    return renderSplashScreen();
  }

  return `
    <div class="min-h-[100dvh] w-full flex flex-col items-center justify-between px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-[#FFF9E9] text-[#3E2723] relative overflow-x-hidden" dir="rtl">
      
      ${renderPawBackdrop()}

      <!-- Minimal Step Dots Navigation (no skip button) -->
      <div class="w-full max-w-md flex items-center justify-center pt-1 pb-2 z-20">
        <div class="flex items-center gap-1.5">
          ${renderStepDots(step)}
        </div>
      </div>

      <!-- Main Step Container -->
      <div class="w-full max-w-md flex-1 flex flex-col justify-between z-10">
        ${renderStepContent(step)}
      </div>

      <!-- Footer Handle Only (@Meow2026) -->
      <footer class="w-full max-w-md pt-4 pb-4 text-center z-20">
        <span dir="ltr" class="inline-block text-xs font-bold text-[#8C827A] tracking-wide font-baloo">@Meow2026</span>
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

// -------------------------------------------------------------
// Step 1: Splash Screen (Exact Stitch splash_screen/code.html)
// No text below logo, no added elements.
// -------------------------------------------------------------
function renderSplashScreen(): string {
  return `
    <div
      id="splash-screen-container"
      class="relative h-[100dvh] w-full flex flex-col items-center justify-center px-8 text-[#3E2723] overflow-hidden cursor-pointer select-none"
      style="background: radial-gradient(circle at center, #FFFBEB 0%, #FFF8E7 100%);"
      dir="rtl"
    >
      <!-- Center Logo Section with Soft Aura -->
      <div class="relative flex-grow flex items-center justify-center animate-fade-in">
        <div class="absolute w-72 h-72 rounded-full bg-[#F7E1C3] blur-[40px] opacity-40 -z-10"></div>
        <img
          alt="Meow Logo"
          class="relative z-10 w-64 h-auto object-contain max-w-[80vw]"
          src="${SPLASH_LOGO_URL}"
        />
      </div>

      <!-- Footer Text: By Mohamed Gamil -->
      <div class="pb-12 text-center animate-fade-in" style="font-family: 'Bubblegum Sans', 'Baloo Bhaijaan 2', cursive;">
        <p class="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-1.5 font-medium">By</p>
        <p class="text-sm font-semibold tracking-[0.05em] text-[#3E2723]/80">Mohamed Gamil</p>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// Step 2: Welcome Screen (Exact Stitch welcome_screen/code.html)
// -------------------------------------------------------------
function renderWelcomeStep(): string {
  return `
    <div class="flex-1 flex flex-col items-center justify-between py-2 animate-fade-in">
      
      <!-- Top Official Logo -->
      <header class="w-full pt-2 pb-2 flex flex-col items-center text-center">
        <div class="relative w-44 h-44 flex items-center justify-center">
          <img alt="Meow Logo" class="w-44 h-auto mx-auto object-contain drop-shadow-sm" src="${WELCOME_LOGO_URL}">
        </div>
      </header>

      <!-- Center Mascot Card & Headline -->
      <div class="flex flex-col items-center text-center space-y-6 my-auto">
        <div class="relative flex items-center justify-center">
          <div class="w-48 h-48 rounded-3xl overflow-hidden shadow-lg border-4 border-white/80 bg-white/40 flex items-center justify-center">
            <img alt="Meow Mascot" class="w-full h-full object-cover" src="${MASCOT_IMG_URL}">
          </div>
        </div>

        <div class="space-y-3 px-4 w-full max-w-sm mx-auto">
          <h1 class="text-3xl font-extrabold text-[#2d1b10] leading-snug font-baloo" style="font-size: 1.85rem; line-height: 1.4;">
            كل الي حيوانك الأليف محتاجه في مكان واحد
            <span class="block text-2xl pt-2 text-[#895036]">🤎</span>
          </h1>
        </div>
      </div>

      <!-- Bottom Next CTA Button -->
      <div class="w-full pt-4 flex justify-end">
        <button
          type="button"
          id="btn-welcome-next"
          class="w-24 h-24 rounded-3xl font-bold text-lg text-white shadow-md active:scale-95 transition-all flex flex-col items-center justify-center gap-1.5 hover:opacity-95 cursor-pointer bg-[#e67e22]"
        >
          <span class="text-lg font-baloo">التالي</span>
          <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"></path>
          </svg>
        </button>
      </div>

    </div>
  `;
}

// -------------------------------------------------------------
// Step 3: Auth Method (Signup First + Login Secondary + Real Google OAuth + Unchecked Privacy)
// -------------------------------------------------------------
function renderAuthMethodStep(): string {
  const isLogin = authMode === 'login';
  const googleSelected = selectedAuthMethod === 'google';
  const appleSelected = selectedAuthMethod === 'apple';
  const authenticatedAccount = state.getAuthenticatedGoogleAccount();
  const canContinue = Boolean(isTermsAccepted && authenticatedAccount);

  return `
    <div class="flex-1 flex flex-col items-center justify-between py-2 animate-fade-in">
      
      <!-- Header Section -->
      <header class="w-full pt-4 flex flex-col items-center text-center space-y-5">
        <div class="relative w-44 h-44 flex items-center justify-center">
          <img alt="Meow Logo" class="w-44 h-auto mx-auto object-contain drop-shadow-sm" src="${WELCOME_LOGO_URL}">
        </div>

        <div class="space-y-2">
          ${
            isLogin
              ? `<h1 class="text-2xl font-bold text-[#3E2723] font-baloo">تسجيل الدخول</h1>
                 <p class="text-[#3E2723]/70 text-lg font-bold font-baloo">مرحباً بعودتك إلى Meow 🐾</p>`
              : `<h1 class="text-2xl font-bold text-[#3E2723] font-baloo">إنشاء حساب جديد</h1>
                 <p class="text-[#3E2723]/70 text-lg font-bold font-baloo">ابدأ رحلتك مع Meow 🐾</p>`
          }
        </div>
      </header>

      <!-- Main Content: Social Buttons + Continue CTA -->
      <main class="w-full flex-1 flex flex-col justify-center space-y-7 py-6">
        
        <!-- Social Login Grid -->
        <div class="space-y-4">
          <!-- Google Button (Real Google OAuth) -->
          <button
            id="btn-login-google"
            type="button"
            ${isAuthenticatingWithGoogle ? 'disabled' : ''}
            class="flex items-center justify-center gap-4 w-full py-4 px-6 bg-white text-[#1f1f1f] rounded-2xl font-semibold transition-all hover:bg-gray-50 active:scale-95 shadow-sm ${
              isAuthenticatingWithGoogle ? 'opacity-70 cursor-wait' : 'cursor-pointer'
            } ${
              googleSelected
                ? 'border-2 border-[#e67e22] ring-4 ring-[#e67e22]/20'
                : 'border border-[#3E2723]/10'
            }"
          >
            <svg class="w-6 h-6 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </svg>
            <span id="google-btn-label" class="tracking-wide text-[17px] font-bold font-baloo">
              ${
                isAuthenticatingWithGoogle
                  ? 'جاري التحقق عبر Google...'
                  : isLogin
                  ? 'تسجيل الدخول بواسطة Google'
                  : 'إنشاء حساب بواسطة Google'
              }
            </span>
          </button>

          <!-- Apple Button -->
          <button
            id="btn-login-apple"
            type="button"
            class="flex items-center justify-center gap-4 w-full py-4 px-6 bg-black text-white rounded-2xl font-semibold transition-all hover:opacity-90 active:scale-95 shadow-sm cursor-pointer ${
              appleSelected
                ? 'border-2 border-[#e67e22] ring-4 ring-[#e67e22]/30'
                : 'border border-black'
            }"
          >
            <svg class="w-6 h-6 fill-white shrink-0" viewBox="0 0 384 512">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 21.8-88.5 21.8-11.4 0-51.1-20.8-82.3-20.1-41.2.6-79.1 23.9-100.4 61-43.7 75.8-11.2 188.6 31.1 250.3 20.6 29.7 45.4 63.3 77.2 62.1 30.6-1.1 42.1-19.8 79-19.8 36.8 0 47.4 19.8 79.9 19.2 33.4-.6 54.8-30.3 75.2-60.2 23.5-34.4 33.2-67.8 33.6-69.5-.8-.3-65-24.9-65.1-99.3zm-30.2-184.2c27.1-32.9 25.1-62.4 23.6-70.5-23.7 1.1-51.1 15.7-68 35.5-15.1 17.5-28.1 47.2-24.2 74.9 26.8 2.1 51.5-17 68.6-39.9z"></path>
            </svg>
            <span class="tracking-wide text-[17px] font-bold font-baloo">${
              isLogin ? 'تسجيل الدخول بواسطة Apple' : 'إنشاء حساب بواسطة Apple'
            }</span>
          </button>

          <!-- Validation / OAuth Status Box -->
          <div
            id="auth-error-msg"
            class="${authErrorMessage ? '' : 'hidden'} rounded-2xl border border-[#e67e22]/40 bg-[#fff3e0] px-4 py-3 text-center text-sm font-bold text-[#7c2d12] font-baloo"
            role="alert"
          >
            ${authErrorMessage}
          </div>
        </div>

        <!-- Primary CTA Area -->
        <div class="space-y-5">
          <button
            id="btn-auth-continue"
            type="button"
            ${canContinue ? '' : 'disabled'}
            class="w-full py-4 text-white rounded-2xl text-lg shadow-sm transition-all font-bold font-baloo ${
              canContinue
                ? 'bg-[#f38f42] hover:bg-[#e67e22] active:scale-[0.98] cursor-pointer'
                : 'bg-[#f38f42]/50 opacity-60 cursor-not-allowed'
            }"
          >
            التالي
          </button>

          <!-- Agreements (Strictly unchecked by default) -->
          <div id="terms-agreement-box" class="flex items-start gap-3 px-3 py-2 rounded-2xl border border-transparent transition-all">
            <div class="mt-1">
              <input
                class="w-5 h-5 rounded border-[#3E2723]/30 text-[#944a00] focus:ring-[#944a00]/20 bg-white/80 transition-colors cursor-pointer"
                id="terms-checkbox"
                type="checkbox"
                ${isTermsAccepted ? 'checked' : ''}
              />
            </div>
            <label class="text-[#3E2723]/75 text-sm leading-relaxed cursor-pointer font-baloo" for="terms-checkbox">
              من خلال المتابعة، أنت توافق على
              <span class="text-[#944a00] font-bold">شروط الاستخدام</span>
              و
              <span class="text-[#944a00] font-bold">سياسة الخصوصية</span>.
            </label>
          </div>
        </div>

      </main>

      <!-- Footer Mode Switch Pill -->
      <div class="w-full pb-2 text-center">
        <button
          id="btn-toggle-auth-mode"
          type="button"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border cursor-pointer transition-all hover:opacity-90 active:scale-95"
          style="background-color: rgba(247, 225, 195, 0.5); border-color: rgba(230, 126, 34, 0.2);"
        >
          ${
            isLogin
              ? `<span class="text-[#3E2723]/70 text-sm font-semibold font-baloo">ليس لديك حساب؟</span>
                 <span class="text-[#944a00] font-bold text-sm font-baloo">إنشاء حساب جديد</span>`
              : `<span class="text-[#3E2723]/70 text-sm font-semibold font-baloo">لديك حساب بالفعل؟</span>
                 <span class="text-[#944a00] font-bold text-sm font-baloo">تسجيل الدخول</span>`
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
    <div class="flex-1 flex flex-col items-center justify-start py-1 animate-fade-in">
      
      <!-- Header Section -->
      <header class="w-full pt-2 flex flex-col items-center text-center space-y-3 relative">
        ${
          mode === 'edit'
            ? `
              <button
                id="close-edit-owner-btn"
                type="button"
                aria-label="رجوع"
                class="absolute top-2 right-0 w-11 h-11 rounded-full bg-[#fffefc] border-2 border-[#d6c7b2] text-[#2d221b] flex items-center justify-center hover:border-[#e67e22] hover:text-[#e67e22] transition cursor-pointer shadow-sm active:scale-95"
              >
                <i class="fa-solid fa-arrow-right text-base"></i>
              </button>
            `
            : ''
        }
        <div class="relative w-40 h-40 flex items-center justify-center">
          <img alt="Meow Logo" class="w-40 h-auto mx-auto object-contain drop-shadow-sm select-none" src="${WELCOME_LOGO_URL}">
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-[#1a1612] tracking-normal font-baloo">${headingText}</h1>
      </header>

      <!-- Main Content: Form directly on #FFF9E9 -->
      <main class="w-full flex-1 flex flex-col justify-start py-4">
        <form id="owner-details-form" novalidate class="space-y-5 font-baloo">
          
          <!-- الاسم -->
          <div class="space-y-2">
            <label for="owner-full-name-input" class="block text-base font-bold text-[#2d221b]">الاسم</label>
            <div class="relative flex items-center">
              <input
                type="text"
                id="owner-full-name-input"
                placeholder="اكتب اسمك الكامل"
                value="${escapeAttr(values.name)}"
                autocomplete="off"
                class="w-full h-16 px-6 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[28px] text-lg font-bold text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm"
              />
            </div>
          </div>

          <!-- رقم الهاتف -->
          <div class="space-y-2">
            <label for="owner-phone-number-input" class="block text-base font-bold text-[#2d221b]">رقم الهاتف</label>
            <div id="owner-phone-wrapper" class="relative flex items-center h-16 rounded-[28px]" dir="ltr">
              <span class="h-full inline-flex items-center justify-center px-5 rounded-l-[28px] border-2 border-r-0 border-[#d6c7b2] bg-[#F7E1C3] text-[#1a1612] font-black text-lg tracking-wider select-none">+20</span>
              <input
                type="tel"
                id="owner-phone-number-input"
                inputmode="tel"
                placeholder="01xxxxxxxxx"
                value="${escapeAttr(values.phone)}"
                dir="ltr"
                autocomplete="off"
                class="w-full h-full px-5 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-r-[28px] text-lg font-bold text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm text-left"
              />
            </div>
            <p id="owner-phone-hint" class="hidden text-xs font-bold text-rose-600 px-2"></p>
          </div>

          <!-- الجنس -->
          <div class="space-y-2">
            <label class="block text-base font-bold text-[#2d221b]">الجنس</label>
            <div id="owner-gender-group" class="grid grid-cols-2 gap-3.5 rounded-[28px]">
              <button
                type="button"
                id="owner-gender-male-btn"
                class="h-16 relative flex items-center justify-center gap-2 px-5 rounded-[28px] border-2 ${
                  values.gender === 'male'
                    ? 'border-[#3b82f6] bg-[#e8f1fc] text-[#2563eb]'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } font-bold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="text-2xl">♂</span>
                <span>ذكر</span>
              </button>

              <button
                type="button"
                id="owner-gender-female-btn"
                class="h-16 relative flex items-center justify-center gap-2 px-5 rounded-[28px] border-2 ${
                  values.gender === 'female'
                    ? 'border-[#ec4899] bg-[#fce7f3] text-[#db2777]'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } font-bold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="text-2xl">♀</span>
                <span>أنثى</span>
              </button>
            </div>
          </div>

          <!-- الموقع الجغرافي في مصر: الدولة ← المحافظة ← المركز/القسم ← المدينة/الحي ← القرية/النجع/العزبة -->
          <div class="space-y-3.5">
            <div class="flex items-center justify-between gap-2">
              <label class="block text-base font-bold text-[#2d221b]">الموقع الجغرافي</label>
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fffefc] border border-[#d6c7b2] text-xs font-black text-[#2d221b]">
                <span>🇪🇬</span>
                <span>الدولة: مصر</span>
              </span>
            </div>

            <div class="grid grid-cols-2 gap-3.5">
              <!-- المحافظة -->
              <div class="space-y-2">
                <label for="owner-governorate-select-trigger" class="block text-sm sm:text-base font-bold text-[#2d221b]">المحافظة</label>
                ${renderSearchableSelect({
                  id: 'owner-governorate-select',
                  options: ownerNodesToOptions(govNodes),
                  value: values.govId,
                  placeholder: 'اختر المحافظة',
                  searchPlaceholder: 'ابحث عن المحافظة...',
                })}
              </div>

              <!-- المركز أو القسم -->
              <div class="space-y-2">
                <label for="owner-markaz-select-trigger" class="block text-sm sm:text-base font-bold text-[#2d221b]">المركز أو القسم</label>
                ${renderSearchableSelect({
                  id: 'owner-markaz-select',
                  options: ownerNodesToOptions(markazNodes),
                  value: values.markazId,
                  placeholder: values.govId ? 'اختر المركز أو القسم' : 'اختر المحافظة أولاً',
                  searchPlaceholder: 'ابحث عن المركز أو القسم...',
                  disabled: !values.govId,
                })}
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3.5">
              <!-- المدينة أو الحي -->
              <div class="space-y-2">
                <label for="owner-city-select-trigger" class="block text-sm sm:text-base font-bold text-[#2d221b]">المدينة أو الحي</label>
                ${renderSearchableSelect({
                  id: 'owner-city-select',
                  options: ownerNodesToOptions(cityNodes),
                  value: values.cityId,
                  placeholder: values.markazId ? 'اختر المدينة أو الحي' : 'اختر المركز أولاً',
                  searchPlaceholder: 'ابحث عن المدينة أو الحي...',
                  disabled: !values.markazId,
                })}
              </div>

              <!-- القرية / النجع / العزبة -->
              <div class="space-y-2">
                <label for="owner-village-select-trigger" class="block text-sm font-bold text-[#2d221b] truncate">القرية / النجع / العزبة</label>
                ${renderSearchableSelect({
                  id: 'owner-village-select',
                  options: villageMeta.options,
                  value: values.villageId,
                  placeholder: villageMeta.placeholder,
                  searchPlaceholder: 'ابحث عن القرية أو التجمع...',
                  disabled: villageMeta.disabled,
                })}
              </div>
            </div>
          </div>

          <!-- Validation Alert -->
          <div
            id="owner-form-error"
            class="hidden rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 leading-relaxed"
            role="alert"
          ></div>

          <!-- CTA Button -->
          <div class="pt-4">
            <button
              id="btn-owner-submit"
              type="submit"
              class="w-full h-16 px-6 text-white bg-[#e67e22] hover:bg-[#ea580c] rounded-[28px] font-extrabold text-2xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer font-baloo"
            >
              <span>${submitLabel}</span>
            </button>
          </div>

        </form>
      </main>

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
    <div id="edit-owner-overlay" class="fixed inset-0 z-[75] bg-[#FFF9E9] text-[#3E2723] overflow-y-auto flex flex-col justify-start" dir="rtl">
      <div class="w-full max-w-md mx-auto flex flex-col px-6 pt-[max(1.25rem,env(safe-area-inset-top))] pb-10">
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
    <div class="flex-1 flex flex-col items-center justify-between py-2 animate-fade-in">
      
      <!-- Header Logo -->
      <header class="w-full pt-2 flex flex-col items-center text-center">
        <div class="relative w-40 h-40 flex items-center justify-center">
          <img alt="Meow Logo" class="w-40 h-auto mx-auto object-contain drop-shadow-sm select-none" src="${WELCOME_LOGO_URL}">
        </div>
      </header>

      <!-- Main Question, Pet Photo, and Action Buttons -->
      <div class="flex-1 flex flex-col items-center justify-center text-center space-y-8 my-auto py-4 w-full">
        <div>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-[#2d221b] tracking-normal leading-snug font-baloo">
            هل تمتلك حيواناً أليفاً؟
          </h2>
        </div>

        <div class="flex justify-center items-center my-2">
          <img
            src="${HAS_PET_IMG_URL}"
            alt="Pet"
            class="w-56 h-56 object-cover rounded-3xl shadow-md border-4 border-white/60"
          />
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4">
          <button
            type="button"
            id="btn-has-pet-yes"
            class="w-full sm:w-48 py-5 px-8 bg-[#e67e22] hover:bg-[#ea580c] active:scale-[0.98] text-white text-2xl font-black rounded-full shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer font-baloo"
          >
            <span class="whitespace-nowrap">مياو</span>
            <span class="text-2xl">🐾</span>
          </button>

          <button
            type="button"
            id="btn-has-pet-no"
            class="w-full sm:w-48 py-5 px-8 bg-[#F3EBDD] hover:bg-[#eae0d0] active:scale-[0.98] text-[#564337] text-2xl font-black rounded-full border-2 border-[#d6c7b2] shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 cursor-pointer font-baloo"
          >
            <span>لا</span>
          </button>
        </div>
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
        (breed) => `<option value="${breed}" ${breed === selectedValue ? 'selected' : ''}>${breed}</option>`
      ),
    ].join('');
  }

  return [
    `<option value="" ${selectedValue === '' ? 'selected' : ''}>اختر السلالة</option>`,
    ...breeds.map(
      (breed) => `<option value="${breed}" ${breed === selectedValue ? 'selected' : ''}>${breed}</option>`
    ),
  ].join('');
}

function renderPetDetailsStep(): string {
  const isTraitsValid = selectedTraits.size >= 3;
  const petNameColorClass = getPetNameTextColorClass(selectedPetGender);

  return `
    <div class="flex-1 flex flex-col items-center justify-start py-1 animate-fade-in">
      
      <!-- Header Section -->
      <header class="w-full pt-2 flex flex-col items-center text-center space-y-3">
        <div class="relative w-40 h-40 flex items-center justify-center">
          <img alt="Meow Logo" class="w-40 h-auto mx-auto object-contain drop-shadow-sm select-none" src="${WELCOME_LOGO_URL}">
        </div>
        <h1 class="text-2xl sm:text-3xl font-extrabold text-[#1a1612] tracking-normal font-baloo">تسجيل بيانات المياو</h1>
      </header>

      <!-- Main Form directly on #FFF9E9 -->
      <main class="w-full flex-1 flex flex-col justify-start py-4">
        <form id="pet-details-form" novalidate class="space-y-5 font-baloo">
          
          <!-- نوع الأليف (عندك ايه: قطة / كلب) -->
          <div class="space-y-2">
            <label class="block text-base font-bold text-[#2d221b]">عندك ايه</label>
            <div id="pet-species-group" class="grid grid-cols-2 gap-3.5 rounded-[28px]">
              <button
                type="button"
                id="pet-type-cat-btn"
                class="h-16 relative flex items-center justify-center gap-2.5 px-4 rounded-[28px] border-2 ${
                  selectedPetSpecies === 'cat'
                    ? 'border-[#e67e22] bg-[#fff5ea] text-[#e67e22] font-extrabold'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold'
                } text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="text-2xl">🐱</span>
                <span class="font-black">قطة</span>
              </button>

              <button
                type="button"
                id="pet-type-dog-btn"
                class="h-16 relative flex items-center justify-center gap-2 px-4 rounded-[28px] border-2 ${
                  selectedPetSpecies === 'dog'
                    ? 'border-[#e67e22] bg-[#fff5ea] text-[#e67e22] font-extrabold'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555] font-bold'
                } text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="text-2xl">🐶</span>
                <span class="font-black">كلب</span>
              </button>
            </div>
          </div>

          <!-- صور للمياو (3 مربعات) -->
          <div class="space-y-2">
            <label class="block text-base font-bold text-[#2d221b]">صور للمياو</label>
            <div id="pet-photos-group" class="grid grid-cols-3 gap-3 rounded-3xl">
              ${[0, 1, 2]
                .map((idx) => {
                  const photo = uploadedPetPhotos[idx];
                  const isPrimary = idx === 0;
                  return `
                    <label
                      class="relative flex items-center justify-center aspect-square rounded-3xl border-2 overflow-hidden ${
                        isPrimary
                          ? 'border-[#e67e22] bg-[#fffbf2] hover:bg-[#fff5e5]'
                          : 'border-[#d6c7b2] bg-[#fffefc] hover:bg-[#faf6ed]'
                      } cursor-pointer transition-all shadow-sm group"
                    >
                      <input accept="image/*" class="hidden pet-photo-file-input" data-photo-slot="${idx}" type="file" />
                      ${
                        photo
                          ? `<img src="${photo}" alt="صورة ${idx + 1}" class="w-full h-full object-cover" />`
                          : `<span class="text-4xl font-black ${
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
          <div class="grid grid-cols-2 gap-3.5">
            <div class="space-y-2">
              <label for="pet-name-input" class="block text-base font-bold text-[#2d221b]">اسم المياو</label>
              <div class="relative flex items-center h-16">
                <input
                  type="text"
                  id="pet-name-input"
                  value="${escapeAttr(draftPetName)}"
                  autocomplete="off"
                  class="w-full h-16 py-4 px-5 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[28px] text-lg font-black text-center ${petNameColorClass} focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label for="pet-color-input" class="block text-base font-bold text-[#2d221b]">اللون</label>
              <div class="relative flex items-center h-16">
                <input
                  type="text"
                  id="pet-color-input"
                  value="${escapeAttr(draftPetColor)}"
                  autocomplete="off"
                  class="w-full h-16 py-4 px-5 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[28px] text-lg font-black text-center text-[#1a1612] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm"
                />
              </div>
            </div>
          </div>

          <!-- السلالة وسلالة هجينة (اختياري) + العمر -->
          <div class="space-y-3.5">
            <div class="grid grid-cols-2 gap-3.5">
              <div class="space-y-2">
                <label for="pet-breed-select" class="block text-base font-black text-[#2d221b]">السلالة</label>
                <div class="relative flex items-center h-16">
                  <select
                    id="pet-breed-select"
                    ${selectedPetSpecies ? '' : 'disabled'}
                    class="w-full h-16 py-3 pr-4 pl-11 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[28px] text-base font-black text-right text-[#1a1612] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm appearance-none truncate ${
                      selectedPetSpecies ? 'cursor-pointer' : 'opacity-65 cursor-not-allowed'
                    }"
                  >
                    ${renderBreedOptionsHtml(selectedPetSpecies, false, draftPetBreed)}
                  </select>
                  <div class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-[#786555]">
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="space-y-2">
                <label for="pet-hybrid-select" class="block text-base font-black text-[#2d221b]">سلالة هجينة (اختياري)</label>
                <div class="relative flex items-center h-16">
                  <select
                    id="pet-hybrid-select"
                    ${selectedPetSpecies ? '' : 'disabled'}
                    class="w-full h-16 py-3 pr-4 pl-11 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[28px] text-base font-black text-right text-[#1a1612] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm appearance-none truncate ${
                      selectedPetSpecies ? 'cursor-pointer' : 'opacity-65 cursor-not-allowed'
                    }"
                  >
                    ${renderBreedOptionsHtml(selectedPetSpecies, true, draftPetHybrid)}
                  </select>
                  <div class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-[#786555]">
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- العمر -->
            <div class="space-y-2">
              <label class="block text-base font-black text-[#2d221b]">العمر</label>
              <div id="pet-age-group" class="grid grid-cols-2 gap-3.5 h-16 rounded-[28px]">
                <div class="relative flex items-center h-16">
                  <input
                    type="number"
                    id="pet-age-years-input"
                    inputmode="numeric"
                    min="0"
                    max="25"
                    placeholder="سنة"
                    value="${escapeAttr(draftPetAgeYears)}"
                    class="w-full h-16 py-4 px-2 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[28px] text-lg font-black text-center text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm"
                  />
                </div>
                <div class="relative flex items-center h-16">
                  <input
                    type="number"
                    id="pet-age-months-input"
                    inputmode="numeric"
                    min="0"
                    max="11"
                    placeholder="شهر (اختياري)"
                    value="${escapeAttr(draftPetAgeMonths)}"
                    class="w-full h-16 py-4 px-2 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[28px] text-base font-black text-center text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- الجنس -->
          <div class="space-y-2">
            <label class="block text-base font-bold text-[#2d221b]">الجنس</label>
            <div id="pet-gender-group" class="grid grid-cols-2 gap-3.5 rounded-[28px]">
              <button
                type="button"
                id="pet-gender-male-btn"
                class="h-16 relative flex items-center justify-center gap-2 rounded-[28px] border-2 ${
                  selectedPetGender === 'male'
                    ? 'border-[#3b82f6] bg-[#eff6ff] text-[#2563eb]'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } font-bold cursor-pointer shadow-sm transition-all active:scale-[0.98] text-xl px-5"
              >
                <span class="font-black">ذكر</span>
              </button>

              <button
                type="button"
                id="pet-gender-female-btn"
                class="h-16 relative flex items-center justify-center gap-2 px-5 rounded-[28px] border-2 ${
                  selectedPetGender === 'female'
                    ? 'border-[#ec4899] bg-[#fce7f3] text-[#db2777]'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } font-bold text-xl cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="font-black">انثى</span>
              </button>
            </div>
          </div>

          <!-- حالة التطعيم -->
          <div class="space-y-2">
            <label class="block text-base font-black text-[#2d221b]">حالة التطعيم</label>
            <div id="pet-vax-group" class="grid grid-cols-2 gap-3.5 h-16 rounded-[28px]">
              <button
                type="button"
                id="vax-yes-btn"
                class="h-16 relative flex items-center justify-center gap-2 rounded-[28px] border-2 ${
                  selectedVaccination === 'yes'
                    ? 'border-[#10b981] bg-[#ecfdf5] text-[#059669]'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } font-bold cursor-pointer shadow-sm transition-all active:scale-[0.98] text-base px-2"
              >
                <i class="fa-solid fa-check"></i>
                <span class="font-black">مطعم</span>
              </button>

              <button
                type="button"
                id="vax-no-btn"
                class="h-16 relative flex items-center justify-center gap-1.5 px-2 rounded-[28px] border-2 ${
                  selectedVaccination === 'no'
                    ? 'border-[#ea580c] bg-[#fff7ed] text-[#c2410c]'
                    : 'border-[#d6c7b2] bg-[#ffffff] text-[#786555]'
                } font-bold text-base cursor-pointer shadow-sm transition-all active:scale-[0.98]"
              >
                <span class="font-black">غير مطعم</span>
              </button>
            </div>
          </div>

          <!-- سمات الشخصية -->
          <div id="pet-traits-group" class="space-y-2.5 pt-2 rounded-3xl">
            <div class="flex items-center justify-between gap-2 pb-1 flex-wrap">
              <div class="flex items-center gap-2">
                <label class="block text-xl font-black text-[#2d221b]">الشخصية</label>
                <span class="text-xs sm:text-sm font-bold text-[#8a7663] bg-[#fffbf2] border border-[#d6c7b2]/60 px-3 py-1 rounded-full shadow-sm">(اختر 3 إلى 6 صفات)</span>
              </div>
              <span
                id="traits-count-badge"
                class="text-xs sm:text-sm font-black px-3 py-1 rounded-full border transition-all shadow-sm ${
                  isTraitsValid
                    ? 'bg-[#ecfdf5] text-[#059669] border-[#10b981]/30'
                    : 'bg-[#faecd8] text-[#c25807] border-[#e67e22]/20'
                }"
              >
                المحدد: ${selectedTraits.size} من 6
              </span>
            </div>

            <div class="flex flex-wrap pt-2 gap-2.5 justify-start">
              ${PERSONALITY_TRAITS.map((trait) => {
                const isSelected = selectedTraits.has(trait);
                return `
                  <button
                    type="button"
                    data-trait-name="${trait}"
                    class="trait-chip-btn rounded-full border-2 px-5 py-2.5 text-base transition-all cursor-pointer select-none active:scale-95 shadow-sm flex items-center justify-center ${
                      isSelected
                        ? 'border-[#e67300] bg-[#fff2e2] text-[#c25807] font-black ring-2 ring-[#e67300]/20'
                        : 'border-[#d6c7b2] bg-[#fffefc] text-[#6d5b4c] font-black hover:border-[#e67e22]/50'
                    }"
                  >
                    ${trait}
                  </button>
                `;
              }).join('')}
            </div>

            <p id="trait-limit-msg" class="text-xs font-bold text-rose-500 hidden">الحد الأقصى هو 6 صفات فقط!</p>
          </div>

          <!-- ملاحظات صحية / سلوكية -->
          <div class="space-y-2">
            <label for="pet-notes-input" class="block text-base font-bold text-[#2d221b]">ملاحظات صحية / سلوكية</label>
            <div class="relative flex items-center">
              <textarea
                id="pet-notes-input"
                rows="3"
                class="w-full p-5 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[28px] text-lg font-black text-[#1a1612] focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm resize-none"
              >${escapeAttr(draftPetNotes)}</textarea>
            </div>
          </div>

          <!-- Validation Alert -->
          <div
            id="pet-form-error"
            class="hidden rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 leading-relaxed"
            role="alert"
          ></div>

          <!-- CTA Button -->
          <div class="pt-4">
            <button
              id="btn-pet-submit"
              type="submit"
              class="w-full h-16 px-6 text-white bg-[#e67e22] hover:bg-[#ea580c] rounded-[28px] font-extrabold text-2xl shadow-md hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer font-baloo"
            >
              <span>نونو على الكلام</span>
            </button>
          </div>

        </form>
      </main>

    </div>
  `;
}

// -------------------------------------------------------------
// Attach Events
// -------------------------------------------------------------
export function attachOnboardingEvents(): void {
  // Splash Screen Click anywhere -> goes to welcome
  const splashContainer = document.getElementById('splash-screen-container');
  if (splashContainer) {
    splashContainer.addEventListener('click', () => {
      state.setOnboardingStep('welcome');
    });
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

  // Auth Method Selection (Google Real OAuth / Apple / Terms / Continue / Mode Toggle)
  const googleBtn = document.getElementById('btn-login-google') as HTMLButtonElement | null;
  const googleBtnLabel = document.getElementById('google-btn-label');
  const appleBtn = document.getElementById('btn-login-apple') as HTMLButtonElement | null;
  const authContinueBtn = document.getElementById('btn-auth-continue') as HTMLButtonElement | null;
  const authErrorBox = document.getElementById('auth-error-msg');
  const termsCheckbox = document.getElementById('terms-checkbox') as HTMLInputElement | null;
  const termsBox = document.getElementById('terms-agreement-box');
  const toggleAuthModeBtn = document.getElementById('btn-toggle-auth-mode');

  const syncAuthMethodUI = () => {
    const authenticatedAccount = state.getAuthenticatedGoogleAccount();
    const canContinue = Boolean(isTermsAccepted && authenticatedAccount);

    if (googleBtn) {
      googleBtn.disabled = isAuthenticatingWithGoogle;
      googleBtn.className = `flex items-center justify-center gap-4 w-full py-4 px-6 bg-white text-[#1f1f1f] rounded-2xl font-semibold transition-all hover:bg-gray-50 active:scale-95 shadow-sm ${
        isAuthenticatingWithGoogle ? 'opacity-70 cursor-wait' : 'cursor-pointer'
      } ${
        selectedAuthMethod === 'google'
          ? 'border-2 border-[#e67e22] ring-4 ring-[#e67e22]/20'
          : 'border border-[#3E2723]/10'
      }`;
    }
    if (googleBtnLabel) {
      googleBtnLabel.textContent = isAuthenticatingWithGoogle
        ? 'جاري التحقق عبر Google...'
        : authMode === 'login'
        ? 'تسجيل الدخول بواسطة Google'
        : 'إنشاء حساب بواسطة Google';
    }
    if (appleBtn) {
      appleBtn.className = `flex items-center justify-center gap-4 w-full py-4 px-6 bg-black text-white rounded-2xl font-semibold transition-all hover:opacity-90 active:scale-95 shadow-sm cursor-pointer ${
        selectedAuthMethod === 'apple'
          ? 'border-2 border-[#e67e22] ring-4 ring-[#e67e22]/30'
          : 'border border-black'
      }`;
    }
    if (authContinueBtn) {
      authContinueBtn.disabled = !canContinue;
      authContinueBtn.className = `w-full py-4 text-white rounded-2xl text-lg shadow-sm transition-all font-bold font-baloo ${
        canContinue
          ? 'bg-[#f38f42] hover:bg-[#e67e22] active:scale-[0.98] cursor-pointer'
          : 'bg-[#f38f42]/50 opacity-60 cursor-not-allowed'
      }`;
    }
    if (termsBox) {
      if (!isTermsAccepted && authErrorMessage.includes('شروط الاستخدام')) {
        termsBox.className =
          'flex items-start gap-3 px-3 py-2 rounded-2xl border border-rose-400 bg-rose-50/70 transition-all';
      } else {
        termsBox.className =
          'flex items-start gap-3 px-3 py-2 rounded-2xl border border-transparent transition-all';
      }
    }
    if (authErrorBox) {
      if (authErrorMessage) {
        authErrorBox.textContent = authErrorMessage;
        authErrorBox.classList.remove('hidden');
      } else {
        authErrorBox.textContent = '';
        authErrorBox.classList.add('hidden');
      }
    }
  };

  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      if (isAuthenticatingWithGoogle) return;

      const checked = Boolean(termsCheckbox?.checked && isTermsAccepted);
      if (!checked) {
        selectedAuthMethod = 'google';
        authErrorMessage = 'يرجى الموافقة على شروط الاستخدام وسياسة الخصوصية أولاً قبل المتابعة عبر Google.';
        syncAuthMethodUI();
        return;
      }

      selectedAuthMethod = 'google';
      isAuthenticatingWithGoogle = true;
      authErrorMessage = '';
      syncAuthMethodUI();

      const result = await signInWithGoogleOAuth();
      isAuthenticatingWithGoogle = false;

      if (result.success && result.account) {
        authErrorMessage = '';
        state.completeGoogleAuthentication(result.account, authMode);
        return;
      }

      authErrorMessage =
        result.errorMessage || 'لم تكتمل عملية التحقق عبر Google. يرجى المحاولة مرة أخرى.';
      syncAuthMethodUI();
    });
  }

  if (appleBtn) {
    appleBtn.addEventListener('click', () => {
      selectedAuthMethod = 'apple';
      authErrorMessage =
        'عذراً، تسجيل الدخول عبر Apple غير متاح حالياً. يرجى استخدام Google للمتابعة.';
      syncAuthMethodUI();
    });
  }

  if (authContinueBtn) {
    authContinueBtn.addEventListener('click', () => {
      const checked = Boolean(termsCheckbox?.checked && isTermsAccepted);
      if (!checked) {
        authErrorMessage = 'يرجى الموافقة على شروط الاستخدام وسياسة الخصوصية للمتابعة.';
        syncAuthMethodUI();
        return;
      }
      const authenticatedAccount = state.getAuthenticatedGoogleAccount();
      if (!authenticatedAccount) {
        authErrorMessage =
          'يرجى إتمام تسجيل الدخول الحقيقي عبر Google أولاً قبل الانتقال للخطوة التالية.';
        syncAuthMethodUI();
        return;
      }
      authErrorMessage = '';
      state.completeGoogleAuthentication(authenticatedAccount, authMode);
    });
  }

  if (termsCheckbox) {
    termsCheckbox.addEventListener('change', () => {
      isTermsAccepted = Boolean(termsCheckbox.checked);
      state.setTermsAccepted(isTermsAccepted);
      if (isTermsAccepted && authErrorMessage.includes('شروط الاستخدام')) {
        authErrorMessage = '';
      }
      syncAuthMethodUI();
    });
  }

  if (toggleAuthModeBtn) {
    toggleAuthModeBtn.addEventListener('click', () => {
      authMode = authMode === 'login' ? 'signup' : 'login';
      authErrorMessage = '';
      selectedAuthMethod = null;
      state.setOnboardingStep('auth_method');
    });
  }

  attachOwnerDetailsFormEvents(onboardingOwnerFormState, (payload) => {
    state.setOwnerDetailsCompleted(
      payload.name,
      payload.city,
      payload.phone,
      payload.gender,
      payload.governorate,
      payload.extraLoc
    );
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
  }) => void
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
  if (ownerForm) {
    ownerForm.addEventListener('submit', (e) => {
      e.preventDefault();
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
          ownerFormError.innerHTML = errors.join('<br />');
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

      onValidSubmit({
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

  attachOwnerDetailsFormEvents(editOwnerFormState, (payload) => {
    isEditOwnerDraftActive = false;
    state.updateUserInfo(
      payload.name,
      payload.city,
      payload.phone,
      payload.gender,
      payload.governorate,
      payload.extraLoc
    );
    state.setEditOwnerModalVisible(false);
  });
}

function attachRemainingOnboardingEvents(): void {

  // Has Pet: Yes (مياو 🐾) -> Goes to Pet Details
  const hasPetYesBtn = document.getElementById('btn-has-pet-yes');
  if (hasPetYesBtn) {
    hasPetYesBtn.addEventListener('click', () => {
      state.setOnboardingStep('pet_details');
    });
  }

  // Has Pet: No (لا) -> Completes onboarding
  const hasPetNoBtn = document.getElementById('btn-has-pet-no');
  if (hasPetNoBtn) {
    hasPetNoBtn.addEventListener('click', () => {
      state.setOnboardingStep('completed');
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

      photosGroup?.classList.remove('ring-2', 'ring-rose-400', 'p-1');

      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : null;
        if (!result) return;
        uploadedPetPhotos[slot] = result;
        const labelEl = input.closest('label');
        if (labelEl) {
          const existingImg = labelEl.querySelector('img');
          const plusSpan = labelEl.querySelector('span');
          if (plusSpan) plusSpan.remove();
          if (existingImg) {
            existingImg.src = result;
          } else {
            const img = document.createElement('img');
            img.src = result;
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
  if (petForm) {
    petForm.addEventListener('submit', (e) => {
      e.preventDefault();
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
          petFormError.innerHTML = errors.join('<br />');
          petFormError.classList.remove('hidden');
          petFormError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        return;
      }

      if (petFormError) {
        petFormError.innerHTML = '';
        petFormError.classList.add('hidden');
      }

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

      state.setOnboardingStep('completed');
    });
  }
}
