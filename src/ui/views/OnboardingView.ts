import { state, OnboardingStep } from '../../state.ts';

const SPLASH_LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBkUboxHVAVTpJU18DOk8LGxlZINhBS3GyspVpAnljo_ufEzmybRtZjfwD2izQ4ck6QZJszfzEROi_8GSqmxgIs8nfh6X9a2weRQJHugsh7tIjzldPRXfASsGwL1ed96d1NI3PLfkVzY7jisJPkE-wbo5VsxogWc5MkQYTEdiFPaSO2GHSv4O7QhUswU9KT4XnE4sieTVurv6MPIAjNrs3MPskxA07TFv2ZDQdowVrUfuT6-BTLSIhQKmYp7q5sJcab';

const MASCOT_IMG_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBjCmSu0xDxJXyrHUBK1tLOi3THUHNrBykChM-wCkfFmb7-SylOoi2gZy7q_0EhekEOoSWaq1XAW437WsLx2Q-8LdB5VeHq3alZjh5JUU5lAdHpKERnUOvvsVZHitTZTkE0WfQaUjnb15I4u4ZRg-k6nKAGaMLGRGvlkBmmux8JCsxfcFhuyG6PsA2X6yQCLhFb6xjiq2en0tv84Rc-_1K1_Iz8Ksk-G_oCqvhJR4epnBXI3Nb8P4VJGtYl5QeTGeaj';

const WELCOME_LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAWUkBSCToKuvsTzQdLeDgwewWrq25QuzlXIMyGRB-Io9sku--2d3rTcZCl6XZF69mO-W6kLkpbWijMmbnBhZlr96SK1xym8KWRRwcSdB8eG2gUQx5yRozTUYvWbUiRkg1vcpkatS1wxB3IgxzpC-b_yVuh9f3pVi_2uo_Gf95WQrWe8elhb3rg8B95vh6Qy2i7uhWh2lwB01rwZrliMckY1uDIvnwkaTKPZtS7CJw';

const HAS_PET_IMG_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDkbGNMk8BmUCkQwfJzMRgVLJ6YM4ZQ2xa1Kx7XTjZmZOxi7v4fKZlOLD_AbvHf4xoMJyUQrj-e2KOl1quHveOGec2YsESHyr1RnDqxUrz_GAW3ONfw1SQOvqYyw0BXrQAhejT3PFjgSGvfBdn5XqRlC9nQtG4cpsMao_3MPClhD_-dqZwCURM7xLoaVj5YB4ibED4FGnoq6fxYLGSa6XdpXLFPA--BuLrBVFjS1E5bd2S7y1VFJ5mi';

// 27 Egyptian Governorates and Cities Data
export const EGYPT_DATA: Record<string, string[]> = {
  'القاهرة': ['مدينة نصر', 'مصر الجديدة', 'التجمع الخامس / القاهرة الجديدة', 'المعادي', 'الزمالك', 'الدقي / وسط البلد', 'شبرا', 'حلوان', 'المقطم', 'عين شمس'],
  'الجيزة': ['الدقي', 'المهندسين', '6 أكتوبر', 'الشيخ زايد', 'الهرم', 'فيصل', 'العجوزة', 'العمرانية', 'الحوامدية'],
  'الإسكندرية': ['سموحة', 'سيدي جابر', 'لوران', 'جليم', 'ميامي', 'المنتزه', 'العجمي', 'الرمل', 'الإبراهيمية'],
  'القليوبية': ['بنها', 'شبرا الخيمة', 'قلیوب', 'العبور', 'طوخ', 'القناطر الخيرية'],
  'الدقهلية': ['المنصورة', 'ميت غمر', 'طلخا', 'دكرنس', 'بلقاس', 'السنبلاوين'],
  'الغربية': ['طنطا', 'المحلة الكبرى', 'زفتى', 'كفر الزيات', 'سمنود'],
  'الشرقية': ['الزقازيق', 'العاشر من رمضان', 'بلبيس', 'منيا القمح', 'فاقوس'],
  'المنوفية': ['شبين الكوم', 'قويسنا', 'أشمون', 'منوف', 'السادات', 'بركة السبع'],
  'البحيرة': ['دمنهور', 'كفر الدوار', 'إيتاي البارود', 'رشيد', 'أبو حمص'],
  'كفر الشيخ': ['كفر الشيخ', 'دسوق', 'فوة', 'مطوبس', 'بلطيم'],
  'دمياط': ['دمياط', 'رأس البر', 'دمياط الجديدة', 'فارسكور', 'كفر سعد'],
  'بورسعيد': ['حي الشرق', 'حي بورفؤاد', 'حي العرب', 'حي الضواحي', 'حي الزهور'],
  'الإسماعيلية': ['الإسماعيلية', 'فايد', 'القنطرة غرب', 'القنطرة شرق', 'التل الكبير'],
  'السويس': ['حي السويس', 'الأربعين', 'فيصل', 'الجناين', 'عتاقة'],
  'شمال سيناء': ['العريش', 'بئر العبد', 'الشيخ زويد', 'رفح', 'الحسنة'],
  'جنوب سيناء': ['شرم الشيخ', 'دهب', 'نويبع', 'طور سيناء', 'طابا', 'رأس سدر'],
  'بني سويف': ['بني سويف', 'بني سويف الجديدة', 'الواسطى', 'ناصر', 'ببا'],
  'الفيوم': ['الفيوم', 'سنورس', 'إطسا', 'طامية', 'يوسف الصديق'],
  'المنيا': ['المنيا', 'المنيا الجديدة', 'ملوي', 'مغاغة', 'بني مزار', 'سمالوط'],
  'أسيوط': ['أسيوط', 'أسيوط الجديدة', 'ديروط', 'القوصية', 'منفلوط', 'أبنوب'],
  'سوهاج': ['سوهاج', 'سوهاج الجديدة', 'أخميم', 'جرجا', 'طهطا', 'المراغة'],
  'قنا': ['قنا', 'قنا الجديدة', 'نجع حمادي', 'دشنا', 'قوص', 'فرشوط'],
  'الأقصر': ['الأقصر', 'البياضية', 'القرنة', 'أرمنت', 'إسنا', 'طيبة الجديدة'],
  'أسوان': ['أسوان', 'أسوان الجديدة', 'كوم أمبو', 'إدفو', 'نصر النوبة', 'دراو'],
  'البحر الأحمر': ['الغردقة', 'الجونة', 'سفاجا', 'القصير', 'مرسى علم', 'رأس غارب'],
  'الوادي الجديد': ['الخارجة', 'الداخلة', 'الفرافرة', 'باريس', 'بلاط'],
  'مطروح': ['مرسى مطروح', 'العلمين', 'الساحل الشمالي', 'سيوة', 'الضبعة']
};

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

const selectedTraits: Set<string> = new Set();
let selectedVaccination: 'yes' | 'no' = 'no';
let selectedOwnerGender: 'male' | 'female' = 'female';
let selectedPetSpecies: 'cat' | 'dog' = 'cat';
let selectedPetGender: 'male' | 'female' = 'male';

export function renderOnboardingView(): string {
  const step = state.getOnboardingStep();

  // If splash, render standalone splash screen without headers/progress
  if (step === 'splash') {
    return renderSplashScreen();
  }

  return `
    <div class="min-h-screen w-full flex flex-col items-center justify-between p-4 sm:p-6 bg-[#FFF9E9] dark:bg-[#1C1713] text-[#2A2521] dark:text-[#F7EFE8] relative overflow-hidden transition-colors duration-200" dir="rtl">
      
      <!-- Top Skip & Progress Row -->
      <div class="w-full max-w-md flex items-center justify-between pt-2 pb-2 z-20">
        <div class="flex items-center gap-1.5">
          ${renderStepDots(step)}
        </div>
        <button
          type="button"
          id="skip-onboarding-btn"
          class="text-xs font-black text-brand-orange hover:text-brand-orangeHover px-3 py-1.5 rounded-xl bg-white/80 dark:bg-[#27201B] border border-brand-peachBorder dark:border-[#3E342B] shadow-2xs cursor-pointer active:scale-95 transition-all font-baloo"
        >
          <span>تخطي إلى التطبيق</span>
          <i class="fa-solid fa-angles-left text-[10px] mr-1"></i>
        </button>
      </div>

      <!-- Main Step Container -->
      <div class="w-full max-w-md flex-1 flex flex-col justify-center my-auto z-10 py-2">
        ${renderStepContent(step)}
      </div>

      <!-- Footer Spacer / Branding -->
      <div class="w-full max-w-md py-2 text-center text-[11px] font-bold text-brand-subtleGray dark:text-[#8C827A] z-20 font-baloo">
        <span>Meow Platform • ${getStepTitle(step)}</span>
      </div>

    </div>
  `;
}

function getStepTitle(step: OnboardingStep): string {
  switch (step) {
    case 'welcome':
      return 'أهلاً بك في مياو';
    case 'auth_method':
      return 'تسجيل الدخول';
    case 'owner_details':
      return 'بيانات المالك';
    case 'has_pet':
      return 'هل تمتلك أليفاً؟';
    case 'pet_details':
      return 'بيانات الأليف';
    default:
      return 'تسجيل الدخول';
  }
}

function renderStepDots(currentStep: OnboardingStep): string {
  const steps: OnboardingStep[] = ['welcome', 'auth_method', 'owner_details', 'has_pet', 'pet_details'];
  const currentIndex = steps.indexOf(currentStep);

  return steps
    .map((s, idx) => {
      const isCompleted = idx <= currentIndex;
      const isCurrent = idx === currentIndex;
      return `
        <span class="h-2 rounded-full transition-all duration-300 ${
          isCurrent
            ? 'w-6 bg-brand-orange'
            : isCompleted
            ? 'w-2.5 bg-brand-orange/60'
            : 'w-2 bg-brand-peachBorder dark:bg-[#3E342B]'
        }"></span>
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
// Step 1: Splash Screen matching screen splash_screen.png
// -------------------------------------------------------------
function renderSplashScreen(): string {
  return `
    <div id="splash-screen-container" class="relative h-screen w-full flex flex-col items-center justify-between px-8 bg-[#FFF9E9] text-[#3E2723] overflow-hidden cursor-pointer select-none" dir="rtl">
      
      <!-- Subtle Glow/Aura Background -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div class="w-80 h-80 rounded-full bg-[#F7E1C3] blur-3xl opacity-50"></div>
      </div>

      <div class="h-12"></div>

      <!-- Center Logo Section with Soft Aura -->
      <div class="relative z-10 flex flex-col items-center justify-center animate-fade-in my-auto">
        <img
          alt="Meow Logo"
          class="w-64 h-auto object-contain max-w-[80vw] drop-shadow-md transition-transform hover:scale-105"
          src="${SPLASH_LOGO_URL}"
        />
        <p class="text-xs font-bold text-brand-orange/80 mt-4 tracking-widest font-baloo animate-pulse">
          اضغط للمتابعة 🐾
        </p>
      </div>

      <!-- Footer Text: By Mohamed Gamil -->
      <div class="pb-12 text-center relative z-10" style="font-family: 'Bubblegum Sans', 'Baloo Bhaijaan 2', cursive;">
        <p class="text-[10px] uppercase tracking-[0.3em] opacity-40 mb-1 font-bold">By</p>
        <p class="text-base font-black tracking-wider text-[#3E2723]/90">Mohamed Gamil</p>
      </div>

    </div>
  `;
}

// -------------------------------------------------------------
// Step 2: Welcome Screen matching screen welcome_screen.png
// -------------------------------------------------------------
function renderWelcomeStep(): string {
  return `
    <div class="flex flex-col items-center text-center space-y-6 my-auto animate-fade-in">
      
      <!-- Header Mascot Card -->
      <div class="relative flex items-center justify-center">
        <div class="w-52 h-52 rounded-3xl overflow-hidden shadow-card border-4 border-white/80 dark:border-[#3E342B] bg-white/40 dark:bg-[#27201B] flex items-center justify-center">
          <img alt="Meow Mascot" class="w-full h-full object-cover" src="${MASCOT_IMG_URL}">
        </div>
      </div>

      <!-- Title & Headline matching Stitch -->
      <div class="space-y-3 px-4 w-full max-w-sm mx-auto">
        <h1 class="text-3xl font-black text-[#2d1b10] dark:text-white leading-snug font-baloo">
          كل الي حيوانك الأليف محتاجه في مكان واحد
          <span class="block text-2xl pt-2 text-[#895036] dark:text-brand-orange">🤎</span>
        </h1>
        <p class="text-xs font-bold text-brand-subtleGray dark:text-[#A89F91]">
          تزاوج، تبني، رعاية، وأمان لكل حيوان أليف في مصر
        </p>
      </div>

      <!-- Bottom Next CTA Button (Circular/Rounded with Arrow) -->
      <div class="w-full pt-4 flex justify-end">
        <button
          type="button"
          id="btn-welcome-next"
          class="w-24 h-24 rounded-3xl font-black text-white shadow-soft active:scale-95 transition-all flex flex-col items-center justify-center gap-1 hover:opacity-95 bg-brand-orange cursor-pointer border-2 border-white/50"
        >
          <span class="text-lg font-baloo">التالي</span>
          <i class="fa-solid fa-arrow-left text-base"></i>
        </button>
      </div>

    </div>
  `;
}

// -------------------------------------------------------------
// Step 3: Login / Signup with Email/Google/Apple
// Matches screen log_in_with_email_2.png & screen log_in_with_email.png
// -------------------------------------------------------------
function renderAuthMethodStep(): string {
  return `
    <div class="bg-white/90 dark:bg-[#27201B] border border-brand-peachBorder dark:border-[#3E342B] rounded-3xl p-6 shadow-card space-y-6 animate-fade-in">
      
      <!-- Header with Logo -->
      <div class="flex flex-col items-center text-center space-y-2">
        <img alt="Meow Logo" class="h-24 w-auto object-contain drop-shadow-sm" src="${WELCOME_LOGO_URL}">
        <h2 class="text-2xl font-black font-baloo text-[#3E2723] dark:text-white">تسجيل الدخول</h2>
        <p class="text-xs font-bold text-brand-subtleGray dark:text-[#A89F91]">
          مرحباً بعودتك إلى Meow 🐾
        </p>
      </div>

      <!-- Social Login Buttons (Google & Apple) -->
      <div class="space-y-3">
        <!-- Google Button -->
        <button
          id="btn-login-google"
          type="button"
          class="flex items-center justify-center gap-4 w-full py-3.5 px-6 bg-white dark:bg-[#1C1713] text-[#1f1f1f] dark:text-white rounded-2xl font-bold transition-all hover:bg-gray-50 dark:hover:bg-[#2F241D] active:scale-95 shadow-sm border border-[#3E2723]/15 dark:border-[#3E342B] cursor-pointer"
        >
          <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          <span class="text-sm font-bold font-baloo">الدخول بواسطة Google</span>
        </button>

        <!-- Apple Button -->
        <button
          id="btn-login-apple"
          type="button"
          class="flex items-center justify-center gap-4 w-full py-3.5 px-6 bg-black text-white rounded-2xl font-bold transition-all hover:opacity-90 active:scale-95 shadow-sm border border-black cursor-pointer"
        >
          <i class="fa-brands fa-apple text-lg"></i>
          <span class="text-sm font-bold font-baloo">الدخول بواسطة Apple</span>
        </button>
      </div>

      <!-- Primary CTA Next Button -->
      <div class="space-y-4 pt-1">
        <button
          id="btn-auth-continue"
          type="button"
          class="w-full py-4 text-white rounded-2xl font-black text-lg shadow-soft hover:opacity-95 active:scale-95 transition-all bg-brand-orange cursor-pointer font-baloo"
        >
          <span>التالي</span>
          <i class="fa-solid fa-arrow-left text-sm mr-2"></i>
        </button>

        <!-- Agreements Checkbox matching Stitch -->
        <div class="flex items-start gap-2.5 px-1">
          <input
            id="terms-checkbox"
            type="checkbox"
            checked
            class="w-4 h-4 mt-0.5 rounded border-[#3E2723]/30 text-brand-orange focus:ring-brand-orange/30 cursor-pointer"
          />
          <label for="terms-checkbox" class="text-[11px] font-bold text-[#3E2723]/80 dark:text-[#D1C7BD] leading-relaxed cursor-pointer">
            من خلال المتابعة، أنت توافق على
            <span class="text-brand-orange font-black">شروط الاستخدام</span>
            و
            <span class="text-brand-orange font-black">سياسة الخصوصية</span>.
          </label>
        </div>
      </div>

      <!-- Footer Mode Switch -->
      <div class="text-center pt-2 border-t border-brand-peachBorder/40 dark:border-[#3E342B]">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F7E1C3]/40 dark:bg-[#342A24] border border-[#e67e22]/20">
          <span class="text-[#3E2723]/70 dark:text-[#A89F91] text-xs font-bold font-baloo">ليس لديك حساب؟</span>
          <span class="text-brand-orange font-black text-xs cursor-pointer font-baloo hover:underline">إنشاء حساب جديد</span>
        </div>
      </div>

    </div>
  `;
}

// -------------------------------------------------------------
// Step 4: Owner Details matching screen تسجيل بيانات المالك.png
// -------------------------------------------------------------
function renderOwnerDetailsStep(): string {
  const user = state.getUser();
  const currentGov = 'القاهرة';
  const governorates = Object.keys(EGYPT_DATA);
  const cities = EGYPT_DATA[currentGov] || [];

  return `
    <div class="bg-white/95 dark:bg-[#27201B] border border-brand-peachBorder dark:border-[#3E342B] rounded-3xl p-5 sm:p-6 shadow-card space-y-4 animate-fade-in max-h-[85vh] overflow-y-auto no-scrollbar">
      
      <!-- Top Logo & Title -->
      <div class="flex flex-col items-center text-center space-y-2">
        <img alt="Meow Logo" class="h-20 w-auto object-contain drop-shadow-sm select-none" src="${WELCOME_LOGO_URL}">
        <h2 class="text-2xl font-black font-baloo text-[#1a1612] dark:text-white">تسجيل بيانات المالك</h2>
      </div>

      <form id="owner-details-form" class="space-y-4 text-xs font-baloo">
        
        <!-- Name Input ("اكتب اسمك الكامل") -->
        <div class="space-y-1.5">
          <label class="block text-sm font-black text-[#2d221b] dark:text-white">الاسم</label>
          <input
            type="text"
            id="owner-full-name-input"
            required
            placeholder="اكتب اسمك الكامل"
            value="${user.name}"
            class="w-full h-14 px-5 bg-[#fffefc] dark:bg-[#1C1713] border-2 border-brand-peachBorder dark:border-[#3E342B] rounded-[24px] text-sm font-black text-[#1a1612] dark:text-white placeholder:text-[#998b7c] focus:outline-none focus:border-brand-orange shadow-sm"
          />
        </div>

        <!-- Phone with +20 prefix -->
        <div class="space-y-1.5">
          <label class="block text-sm font-black text-[#2d221b] dark:text-white">رقم الهاتف</label>
          <div class="relative flex items-center h-14 rounded-[24px] border-2 border-brand-peachBorder dark:border-[#3E342B] overflow-hidden bg-[#fffefc] dark:bg-[#1C1713]" dir="ltr">
            <span class="h-full inline-flex items-center justify-center px-4 bg-[#F7E1C3] dark:bg-[#3E342B] text-[#1a1612] dark:text-white font-black text-base tracking-wider select-none border-r border-brand-peachBorder dark:border-[#3E342B]">+20</span>
            <input
              type="tel"
              id="owner-phone-number-input"
              required
              placeholder="01xxxxxxxxx"
              value="${user.phone.replace('+20', '').trim()}"
              class="w-full h-full px-4 bg-transparent text-left font-black text-sm text-[#1a1612] dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <!-- Gender Options (ذكر ♂ / أنثى ♀) matching screenshot -->
        <div class="space-y-1.5">
          <label class="block text-sm font-black text-[#2d221b] dark:text-white">الجنس</label>
          <div class="grid grid-cols-2 gap-3">
            <!-- Male Option -->
            <button
              type="button"
              id="owner-gender-male-btn"
              class="h-14 relative flex items-center justify-center gap-2 px-4 rounded-[24px] border-2 ${
                selectedOwnerGender === 'male'
                  ? 'border-[#3b82f6] bg-[#e8f1fc] text-[#2563eb]'
                  : 'border-brand-peachBorder dark:border-[#3E342B] bg-white dark:bg-[#1C1713] text-[#786555] dark:text-[#A89F91]'
              } font-black text-base cursor-pointer shadow-sm transition-all active:scale-95"
            >
              <span class="text-xl">♂</span>
              <span>ذكر</span>
            </button>

            <!-- Female Option -->
            <button
              type="button"
              id="owner-gender-female-btn"
              class="h-14 relative flex items-center justify-center gap-2 px-4 rounded-[24px] border-2 ${
                selectedOwnerGender === 'female'
                  ? 'border-[#ec4899] bg-[#fce7f3] text-[#db2777]'
                  : 'border-brand-peachBorder dark:border-[#3E342B] bg-white dark:bg-[#1C1713] text-[#786555] dark:text-[#A89F91]'
              } font-black text-base cursor-pointer shadow-sm transition-all active:scale-95"
            >
              <span class="text-xl">♀</span>
              <span>أنثى</span>
            </button>
          </div>
        </div>

        <!-- Governorates & City Dropdowns -->
        <div class="grid grid-cols-2 gap-3 pt-1">
          <!-- Governorate (المحافظة) -->
          <div class="space-y-1.5">
            <label class="block text-sm font-black text-[#2d221b] dark:text-white">المحافظة</label>
            <div class="relative flex items-center h-14">
              <select
                id="owner-governorate-select"
                class="w-full h-full px-3 bg-[#fffefc] dark:bg-[#1C1713] border-2 border-brand-peachBorder dark:border-[#3E342B] rounded-[24px] text-xs font-black text-center text-[#1a1612] dark:text-white focus:outline-none focus:border-brand-orange shadow-sm appearance-none cursor-pointer"
              >
                ${governorates
                  .map(
                    (gov) => `
                  <option value="${gov}" ${gov === currentGov ? 'selected' : ''}>${gov}</option>
                `
                  )
                  .join('')}
              </select>
            </div>
          </div>

          <!-- City / District (المدينة / الحي) -->
          <div class="space-y-1.5">
            <label class="block text-sm font-black text-[#2d221b] dark:text-white">المدينة / الحي</label>
            <div class="relative flex items-center h-14">
              <select
                id="owner-city-select"
                class="w-full h-full px-3 bg-[#fffefc] dark:bg-[#1C1713] border-2 border-brand-peachBorder dark:border-[#3E342B] rounded-[24px] text-xs font-black text-center text-[#1a1612] dark:text-white focus:outline-none focus:border-brand-orange shadow-sm appearance-none cursor-pointer"
              >
                ${cities
                  .map(
                    (city, idx) => `
                  <option value="${city}" ${idx === 0 ? 'selected' : ''}>${city}</option>
                `
                  )
                  .join('')}
              </select>
            </div>
          </div>
        </div>

        <!-- CTA Button "اشطا" matching screenshot -->
        <div class="pt-3">
          <button
            type="submit"
            class="w-full h-15 py-3.5 px-6 text-white bg-brand-orange hover:bg-brand-orangeHover rounded-[28px] font-black text-2xl shadow-soft hover:shadow-lg active:scale-95 transition-all flex items-center justify-center cursor-pointer font-baloo"
          >
            <span>اشطا</span>
          </button>
        </div>

      </form>

    </div>
  `;
}

// -------------------------------------------------------------
// Step 5: Has Pet Question matching screen هل تمتلك حيوان اليفا.png
// -------------------------------------------------------------
function renderHasPetStep(): string {
  return `
    <div class="flex-1 flex flex-col items-center justify-center text-center space-y-8 my-auto py-6 animate-fade-in">
      
      <div class="space-y-2">
        <h2 class="text-3xl sm:text-4xl font-black font-baloo text-[#2d221b] dark:text-white tracking-normal leading-snug">
          هل تمتلك حيواناً أليفاً؟
        </h2>
        <p class="text-xs font-bold text-brand-subtleGray dark:text-[#A89F91]">
          اختر للإدراج والمشاركة في التزاوج أو التبني
        </p>
      </div>

      <!-- Pet Center Image matching Stitch asset -->
      <div class="flex justify-center items-center my-2">
        <img
          src="${HAS_PET_IMG_URL}"
          alt="Cute Pet"
          class="w-56 h-56 object-cover rounded-3xl shadow-card border-4 border-white/80 dark:border-[#3E342B]"
        />
      </div>

      <!-- Two Buttons: مياو 🐾 (Goes to Pet Details) vs لا (Enters App Directly) -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4">
        
        <!-- Button: مياو 🐾 (Orange) -->
        <button
          type="button"
          id="btn-has-pet-yes"
          class="w-full sm:w-48 py-5 px-8 bg-brand-orange hover:bg-brand-orangeHover active:scale-95 text-white text-2xl font-black rounded-full shadow-soft transition-all flex items-center justify-center gap-3 cursor-pointer border-2 border-white/50 font-baloo"
        >
          <span class="whitespace-nowrap">مياو</span>
          <span class="text-2xl">🐾</span>
        </button>

        <!-- Button: لا (Neutral - Skip to App) -->
        <button
          type="button"
          id="btn-has-pet-no"
          class="w-full sm:w-48 py-5 px-8 bg-[#F3EBDD] dark:bg-[#27201B] hover:bg-[#eae0d0] dark:hover:bg-[#342A24] active:scale-95 text-[#564337] dark:text-[#EAE0D5] text-2xl font-black rounded-full border-2 border-brand-peachBorder dark:border-[#3E342B] shadow-2xs transition-all flex items-center justify-center gap-3 cursor-pointer font-baloo"
        >
          <span>لا</span>
        </button>

      </div>

    </div>
  `;
}

// -------------------------------------------------------------
// Step 6: Pet Details Form matching screen تسجيل بيانات الاليف.png
// -------------------------------------------------------------
function renderPetDetailsStep(): string {
  return `
    <div class="bg-white/95 dark:bg-[#27201B] border border-brand-peachBorder dark:border-[#3E342B] rounded-3xl p-5 sm:p-6 shadow-card space-y-4 animate-fade-in max-h-[85vh] overflow-y-auto no-scrollbar">
      
      <!-- Logo & Title -->
      <div class="flex flex-col items-center text-center space-y-1">
        <img alt="Meow Logo" class="h-16 w-auto object-contain drop-shadow-sm select-none" src="${WELCOME_LOGO_URL}">
        <h2 class="text-2xl font-black font-baloo text-[#1a1612] dark:text-white">تسجيل بيانات المياو</h2>
      </div>

      <form id="pet-details-form" class="space-y-4 text-xs font-baloo">
        
        <!-- عندك ايه؟ (قطة 🐱 / كلب 🐶) -->
        <div class="space-y-1.5">
          <label class="block text-sm font-black text-[#2d221b] dark:text-white">عندك ايه؟</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              id="pet-type-cat-btn"
              class="h-14 rounded-[24px] border-2 ${
                selectedPetSpecies === 'cat'
                  ? 'border-brand-orange bg-[#FFF5EA] text-brand-orange'
                  : 'border-brand-peachBorder dark:border-[#3E342B] bg-white dark:bg-[#1C1713] text-[#786555] dark:text-[#A89F91]'
              } font-black text-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <span>قطة</span>
              <span class="text-xl">🐱</span>
            </button>
            <button
              type="button"
              id="pet-type-dog-btn"
              class="h-14 rounded-[24px] border-2 ${
                selectedPetSpecies === 'dog'
                  ? 'border-brand-orange bg-[#FFF5EA] text-brand-orange'
                  : 'border-brand-peachBorder dark:border-[#3E342B] bg-white dark:bg-[#1C1713] text-[#786555] dark:text-[#A89F91]'
              } font-black text-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <span>كلب</span>
              <span class="text-xl">🐶</span>
            </button>
          </div>
        </div>

        <!-- صور للمياو (3 rounded squares with + icon) -->
        <div class="space-y-1.5">
          <label class="block text-sm font-black text-[#2d221b] dark:text-white">صور للمياو</label>
          <div class="grid grid-cols-3 gap-2.5">
            <!-- Box 1 (Active / Primary) -->
            <div class="relative aspect-square rounded-[24px] border-2 border-brand-orange bg-[#FFFBF2] dark:bg-[#342A24] flex items-center justify-center text-brand-orange text-3xl font-black cursor-pointer shadow-sm hover:scale-105 transition-transform">
              <span>+</span>
            </div>
            <!-- Box 2 -->
            <div class="relative aspect-square rounded-[24px] border-2 border-brand-peachBorder dark:border-[#3E342B] bg-[#FFFBF2] dark:bg-[#342A24] flex items-center justify-center text-brand-subtleGray dark:text-[#A89F91] text-3xl font-black cursor-pointer shadow-sm hover:scale-105 transition-transform">
              <span>+</span>
            </div>
            <!-- Box 3 -->
            <div class="relative aspect-square rounded-[24px] border-2 border-brand-peachBorder dark:border-[#3E342B] bg-[#FFFBF2] dark:bg-[#342A24] flex items-center justify-center text-brand-subtleGray dark:text-[#A89F91] text-3xl font-black cursor-pointer shadow-sm hover:scale-105 transition-transform">
              <span>+</span>
            </div>
          </div>
        </div>

        <!-- اسم المياو واللون -->
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="block text-sm font-black text-[#2d221b] dark:text-white">اسم المياو</label>
            <input
              type="text"
              id="pet-name-input"
              required
              placeholder="مثلاً: بسبوسة"
              value="مشمش"
              class="w-full h-13 px-4 bg-[#fffefc] dark:bg-[#1C1713] border-2 border-brand-peachBorder dark:border-[#3E342B] rounded-[20px] text-xs font-black text-[#1a1612] dark:text-white focus:outline-none focus:border-brand-orange shadow-sm"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-black text-[#2d221b] dark:text-white">اللون</label>
            <input
              type="text"
              id="pet-color-input"
              required
              placeholder="أبيض، كاليكو، رمادي..."
              value="مشمشي وأبيض"
              class="w-full h-13 px-4 bg-[#fffefc] dark:bg-[#1C1713] border-2 border-brand-peachBorder dark:border-[#3E342B] rounded-[20px] text-xs font-black text-[#1a1612] dark:text-white focus:outline-none focus:border-brand-orange shadow-sm"
            />
          </div>
        </div>

        <!-- السلالة وسلالة هجينة (اختياري) -->
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="block text-sm font-black text-[#2d221b] dark:text-white">السلالة</label>
            <select
              id="pet-breed-select"
              class="w-full h-13 px-3 bg-[#fffefc] dark:bg-[#1C1713] border-2 border-brand-peachBorder dark:border-[#3E342B] rounded-[20px] text-xs font-black text-[#1a1612] dark:text-white focus:outline-none focus:border-brand-orange shadow-sm cursor-pointer"
            >
              <option value="شيرازي (فارسي)">شيرازي (فارسي)</option>
              <option value="بلدي مصري">بلدي مصري</option>
              <option value="سيامي">سيامي</option>
              <option value="سكوتش فولد">سكوتش فولد</option>
              <option value="بريطاني قصير الشعر">بريطاني قصير الشعر</option>
              <option value="غولدن ريتريفر">غولدن ريتريفر</option>
              <option value="جيرمن شيبرد">جيرمن شيبرد</option>
              <option value="هاسكي">هاسكي</option>
            </select>
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-black text-[#2d221b] dark:text-white">سلالة هجينة (اختياري)</label>
            <select
              id="pet-hybrid-select"
              class="w-full h-13 px-3 bg-[#fffefc] dark:bg-[#1C1713] border-2 border-brand-peachBorder dark:border-[#3E342B] rounded-[20px] text-xs font-black text-[#1a1612] dark:text-white focus:outline-none focus:border-brand-orange shadow-sm cursor-pointer"
            >
              <option value="بدون هجين">بدون هجين</option>
              <option value="هجين شيرازي">هجين شيرازي</option>
              <option value="هجين بلدي">هجين بلدي</option>
              <option value="هجين رومي">هجين رومي</option>
            </select>
          </div>
        </div>

        <!-- العمر (سنة وشهر) -->
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1">
            <label class="block text-sm font-black text-[#2d221b] dark:text-white">العمر (سنة)</label>
            <input
              type="number"
              id="pet-age-years-input"
              value="2"
              min="0"
              max="20"
              class="w-full h-13 px-4 bg-[#fffefc] dark:bg-[#1C1713] border-2 border-brand-peachBorder dark:border-[#3E342B] rounded-[20px] text-xs font-black text-[#1a1612] dark:text-white focus:outline-none focus:border-brand-orange shadow-sm text-center"
            />
          </div>
          <div class="space-y-1">
            <label class="block text-sm font-black text-[#2d221b] dark:text-white">شهر (اختياري)</label>
            <input
              type="number"
              id="pet-age-months-input"
              value="4"
              min="0"
              max="11"
              class="w-full h-13 px-4 bg-[#fffefc] dark:bg-[#1C1713] border-2 border-brand-peachBorder dark:border-[#3E342B] rounded-[20px] text-xs font-black text-[#1a1612] dark:text-white focus:outline-none focus:border-brand-orange shadow-sm text-center"
            />
          </div>
        </div>

        <!-- التطعيم (مطعم / غير مطعم) -->
        <div class="space-y-1.5">
          <label class="block text-sm font-black text-[#2d221b] dark:text-white">حالة التطعيم</label>
          <div class="grid grid-cols-2 gap-3">
            <button
              type="button"
              id="vax-yes-btn"
              class="h-12 rounded-[20px] border-2 ${
                selectedVaccination === 'yes'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                  : 'border-brand-peachBorder dark:border-[#3E342B] bg-white dark:bg-[#1C1713] text-[#786555] dark:text-[#A89F91]'
              } font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <i class="fa-solid fa-check"></i>
              <span>مُطعّم</span>
            </button>
            <button
              type="button"
              id="vax-no-btn"
              class="h-12 rounded-[20px] border-2 ${
                selectedVaccination === 'no'
                  ? 'border-brand-orange bg-[#FFF5EA] text-brand-orange'
                  : 'border-brand-peachBorder dark:border-[#3E342B] bg-white dark:bg-[#1C1713] text-[#786555] dark:text-[#A89F91]'
              } font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm"
            >
              <span>غير مطعم</span>
            </button>
          </div>
        </div>

        <!-- الشخصية (18 Trait Chips with counter) -->
        <div class="space-y-2 pt-1">
          <div class="flex items-center justify-between">
            <label class="block text-sm font-black text-[#2d221b] dark:text-white">الشخصية (اختر 3 إلى 6)</label>
            <span id="traits-count-badge" class="px-2.5 py-0.5 rounded-full bg-brand-cream dark:bg-[#342A24] text-brand-orange font-black text-[11px] border border-brand-peachBorder dark:border-warm-darkBorder">
              المحدد: ${selectedTraits.size} من 6
            </span>
          </div>

          <div class="flex flex-wrap gap-2 pt-1">
            ${PERSONALITY_TRAITS.map((trait) => {
              const isSelected = selectedTraits.has(trait);
              return `
                <button
                  type="button"
                  data-trait-name="${trait}"
                  class="trait-chip-btn px-4 py-2 rounded-full border-2 transition-all cursor-pointer font-black text-xs active:scale-95 shadow-2xs ${
                    isSelected
                      ? 'border-brand-orange bg-brand-orange text-white shadow-soft'
                      : 'border-brand-peachBorder dark:border-[#3E342B] bg-white dark:bg-[#1C1713] text-[#6d5b4c] dark:text-[#D1C7BD] hover:border-brand-orange/60'
                  }"
                >
                  ${trait}
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- ملاحظات صحية / سلوكية -->
        <div class="space-y-1 pt-1">
          <label class="block text-sm font-black text-[#2d221b] dark:text-white">ملاحظات صحية / سلوكية</label>
          <textarea
            id="pet-notes-input"
            rows="2"
            placeholder="أليف ودود، يحب اللعب، مطعم بانتظام..."
            class="w-full p-3 bg-[#fffefc] dark:bg-[#1C1713] border-2 border-brand-peachBorder dark:border-[#3E342B] rounded-[20px] text-xs font-bold text-[#1a1612] dark:text-white focus:outline-none focus:border-brand-orange shadow-sm resize-none"
          ></textarea>
        </div>

        <!-- CTA Button "نونو على الكلام" matching screenshot -->
        <div class="pt-3">
          <button
            type="submit"
            class="w-full h-16 px-6 text-white bg-brand-orange hover:bg-brand-orangeHover rounded-[28px] font-black text-2xl shadow-soft hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer font-baloo"
          >
            <span>نونو على الكلام</span>
          </button>
        </div>

      </form>

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

  // Skip Onboarding Button
  const skipBtn = document.getElementById('skip-onboarding-btn');
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      state.setOnboardingStep('completed');
    });
  }

  // Welcome Next Button
  const welcomeNextBtn = document.getElementById('btn-welcome-next');
  if (welcomeNextBtn) {
    welcomeNextBtn.addEventListener('click', () => {
      state.setOnboardingStep('auth_method');
    });
  }

  // Auth Method Continue
  const authContinueBtn = document.getElementById('btn-auth-continue');
  if (authContinueBtn) {
    authContinueBtn.addEventListener('click', () => {
      state.setOnboardingStep('owner_details');
    });
  }

  // Google Login Button
  const googleBtn = document.getElementById('btn-login-google');
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      // Simulate real account sync: update name to Mohamed Gamil if needed and proceed
      state.setOnboardingStep('owner_details');
    });
  }

  // Apple Login Button
  const appleBtn = document.getElementById('btn-login-apple');
  if (appleBtn) {
    appleBtn.addEventListener('click', () => {
      state.setOnboardingStep('owner_details');
    });
  }

  // Owner Details Gender Buttons
  const maleBtn = document.getElementById('owner-gender-male-btn');
  const femaleBtn = document.getElementById('owner-gender-female-btn');
  if (maleBtn && femaleBtn) {
    maleBtn.addEventListener('click', () => {
      selectedOwnerGender = 'male';
      maleBtn.className =
        'h-14 relative flex items-center justify-center gap-2 px-4 rounded-[24px] border-2 border-[#3b82f6] bg-[#e8f1fc] text-[#2563eb] font-black text-base cursor-pointer shadow-sm transition-all active:scale-95';
      femaleBtn.className =
        'h-14 relative flex items-center justify-center gap-2 px-4 rounded-[24px] border-2 border-brand-peachBorder dark:border-[#3E342B] bg-white dark:bg-[#1C1713] text-[#786555] dark:text-[#A89F91] font-black text-base cursor-pointer shadow-sm transition-all active:scale-95';
    });
    femaleBtn.addEventListener('click', () => {
      selectedOwnerGender = 'female';
      femaleBtn.className =
        'h-14 relative flex items-center justify-center gap-2 px-4 rounded-[24px] border-2 border-[#ec4899] bg-[#fce7f3] text-[#db2777] font-black text-base cursor-pointer shadow-sm transition-all active:scale-95';
      maleBtn.className =
        'h-14 relative flex items-center justify-center gap-2 px-4 rounded-[24px] border-2 border-brand-peachBorder dark:border-[#3E342B] bg-white dark:bg-[#1C1713] text-[#786555] dark:text-[#A89F91] font-black text-base cursor-pointer shadow-sm transition-all active:scale-95';
    });
  }

  // Governorate Select changes dynamic Cities
  const govSelect = document.getElementById('owner-governorate-select') as HTMLSelectElement;
  const citySelect = document.getElementById('owner-city-select') as HTMLSelectElement;
  if (govSelect && citySelect) {
    govSelect.addEventListener('change', () => {
      const selectedGov = govSelect.value;
      const cities = EGYPT_DATA[selectedGov] || [];
      citySelect.innerHTML = '';
      cities.forEach((city, idx) => {
        const opt = document.createElement('option');
        opt.value = city;
        opt.textContent = city;
        if (idx === 0) opt.selected = true;
        citySelect.appendChild(opt);
      });
    });
  }

  // Owner Form Submit ("اشطا")
  const ownerForm = document.getElementById('owner-details-form');
  if (ownerForm) {
    ownerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('owner-full-name-input') as HTMLInputElement)?.value;
      const phone = (document.getElementById('owner-phone-number-input') as HTMLInputElement)?.value;
      const city = citySelect?.value || 'القاهرة';
      if (name) {
        state.updateUserInfo(name.trim(), city, `+20 ${phone ? phone.trim() : '01012345678'}`);
      }
      state.setOnboardingStep('has_pet');
    });
  }

  // Has Pet: Yes (مياو 🐾) -> Goes to Pet Details
  const hasPetYesBtn = document.getElementById('btn-has-pet-yes');
  if (hasPetYesBtn) {
    hasPetYesBtn.addEventListener('click', () => {
      state.setOnboardingStep('pet_details');
    });
  }

  // Has Pet: No (لا) -> Skips Pet Details directly into app
  const hasPetNoBtn = document.getElementById('btn-has-pet-no');
  if (hasPetNoBtn) {
    hasPetNoBtn.addEventListener('click', () => {
      state.setOnboardingStep('completed');
    });
  }

  // Pet Species (قطة / كلب)
  const catBtn = document.getElementById('pet-type-cat-btn');
  const dogBtn = document.getElementById('pet-type-dog-btn');
  if (catBtn && dogBtn) {
    catBtn.addEventListener('click', () => {
      selectedPetSpecies = 'cat';
      catBtn.className =
        'h-14 rounded-[24px] border-2 border-brand-orange bg-[#FFF5EA] text-brand-orange font-black text-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm';
      dogBtn.className =
        'h-14 rounded-[24px] border-2 border-brand-peachBorder dark:border-[#3E342B] bg-white dark:bg-[#1C1713] text-[#786555] dark:text-[#A89F91] font-black text-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm';
    });
    dogBtn.addEventListener('click', () => {
      selectedPetSpecies = 'dog';
      dogBtn.className =
        'h-14 rounded-[24px] border-2 border-brand-orange bg-[#FFF5EA] text-brand-orange font-black text-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm';
      catBtn.className =
        'h-14 rounded-[24px] border-2 border-brand-peachBorder dark:border-[#3E342B] bg-white dark:bg-[#1C1713] text-[#786555] dark:text-[#A89F91] font-black text-lg flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm';
    });
  }

  // Vaccination Yes/No
  const vaxYes = document.getElementById('vax-yes-btn');
  const vaxNo = document.getElementById('vax-no-btn');
  if (vaxYes && vaxNo) {
    vaxYes.addEventListener('click', () => {
      selectedVaccination = 'yes';
      vaxYes.className =
        'h-12 rounded-[20px] border-2 border-emerald-600 bg-emerald-50 text-emerald-700 font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm';
      vaxNo.className =
        'h-12 rounded-[20px] border-2 border-brand-peachBorder dark:border-[#3E342B] bg-white dark:bg-[#1C1713] text-[#786555] dark:text-[#A89F91] font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm';
    });
    vaxNo.addEventListener('click', () => {
      selectedVaccination = 'no';
      vaxNo.className =
        'h-12 rounded-[20px] border-2 border-brand-orange bg-[#FFF5EA] text-brand-orange font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm';
      vaxYes.className =
        'h-12 rounded-[20px] border-2 border-brand-peachBorder dark:border-[#3E342B] bg-white dark:bg-[#1C1713] text-[#786555] dark:text-[#A89F91] font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer shadow-sm';
    });
  }

  // Personality Trait Chips
  const traitBtns = document.querySelectorAll<HTMLButtonElement>('.trait-chip-btn');
  const countBadge = document.getElementById('traits-count-badge');
  traitBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const trait = btn.getAttribute('data-trait-name');
      if (!trait) return;

      if (selectedTraits.has(trait)) {
        selectedTraits.delete(trait);
        btn.className =
          'trait-chip-btn px-4 py-2 rounded-full border-2 transition-all cursor-pointer font-black text-xs active:scale-95 shadow-2xs border-brand-peachBorder dark:border-[#3E342B] bg-white dark:bg-[#1C1713] text-[#6d5b4c] dark:text-[#D1C7BD] hover:border-brand-orange/60';
      } else {
        if (selectedTraits.size >= 6) {
          return;
        }
        selectedTraits.add(trait);
        btn.className =
          'trait-chip-btn px-4 py-2 rounded-full border-2 transition-all cursor-pointer font-black text-xs active:scale-95 shadow-2xs border-brand-orange bg-brand-orange text-white shadow-soft';
      }

      if (countBadge) {
        countBadge.textContent = `المحدد: ${selectedTraits.size} من 6`;
      }
    });
  });

  // Pet Details Form Submit ("نونو على الكلام")
  const petForm = document.getElementById('pet-details-form');
  if (petForm) {
    petForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (document.getElementById('pet-name-input') as HTMLInputElement)?.value;
      const color = (document.getElementById('pet-color-input') as HTMLInputElement)?.value;
      const breed = (document.getElementById('pet-breed-select') as HTMLSelectElement)?.value;
      const ageYears = parseInt((document.getElementById('pet-age-years-input') as HTMLInputElement)?.value || '1', 10);
      const ageMonths = parseInt((document.getElementById('pet-age-months-input') as HTMLInputElement)?.value || '0', 10);
      const notes = (document.getElementById('pet-notes-input') as HTMLTextAreaElement)?.value;

      if (name) {
        state.savePet({
          name: name.trim(),
          breed: breed || 'شيرازي (فارسي)',
          color: color ? color.trim() : 'مشمشي',
          species: selectedPetSpecies,
          gender: selectedPetGender,
          ageYears: isNaN(ageYears) ? 1 : ageYears,
          ageMonths: isNaN(ageMonths) ? 0 : ageMonths,
          healthNotes: notes ? notes.trim() : 'أليف هادئ ومحبوب',
          personality: Array.from(selectedTraits).length > 0 ? Array.from(selectedTraits) : ['لطيف', 'مرح', 'ذكي'],
          vaccinationStatus: selectedVaccination === 'yes' ? 'fully_vaccinated' : 'not_vaccinated',
          status: 'mating',
        });
      }

      state.setOnboardingStep('completed');
    });
  }
}
