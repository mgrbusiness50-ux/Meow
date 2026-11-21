import { state } from '../../state.ts';

interface StoredContactMessage {
  id: string;
  subject: string;
  message: string;
  timestamp: string;
  userName: string;
  userPhone: string;
}

export function renderContactView(): string {
  return `
    <div id="contact-us-view" class="fixed inset-0 z-50 bg-[#FFF9E9] text-[#2A2521] w-full min-h-[100dvh] overflow-y-auto flex flex-col font-baloo animate-fade-in" dir="rtl">
      
      <!-- Top Bar: Natural Meow Aesthetic -->
      <header class="sticky top-0 z-40 w-full max-w-md mx-auto px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] flex items-center gap-3 bg-[#FFF9E9]/95 backdrop-blur-md border-b border-brand-peachBorder/70">
        <button
          id="contact-back-btn"
          type="button"
          aria-label="رجوع"
          class="w-11 h-11 rounded-full bg-white border-2 border-brand-peachBorder text-brand-dark flex items-center justify-center hover:bg-brand-orange hover:text-white transition-all cursor-pointer active:scale-90 shadow-sm shrink-0"
        >
          <i class="fa-solid fa-arrow-right text-base"></i>
        </button>
        <h1 class="text-2xl font-black text-brand-dark m-0 tracking-tight font-baloo">
          اتصل بنا
        </h1>
      </header>

      <!-- Main Content Container: Clean & Light Natural Meow Colors -->
      <div class="w-full max-w-md mx-auto px-4 sm:px-5 pt-8 pb-[max(4rem,calc(2rem+env(safe-area-inset-bottom)))] flex-1 flex flex-col items-center text-center min-w-0">
        
        <!-- Centered Warm Message Icon Card -->
        <div class="w-24 h-24 rounded-3xl bg-white border-2 border-brand-peachBorder flex items-center justify-center shadow-card mb-6 relative group">
          <div class="w-14 h-14 rounded-2xl bg-brand-orange/15 border border-brand-orange/30 flex items-center justify-center">
            <svg class="w-8 h-8 text-brand-orange" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              <line x1="8" y1="9" x2="16" y2="9"></line>
              <line x1="8" y1="13" x2="14" y2="13"></line>
            </svg>
          </div>
          <span class="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-brand-orange text-white text-[11px] font-black flex items-center justify-center shadow-sm">
            🐾
          </span>
        </div>

        <!-- Heading & Updated Subtitle -->
        <h2 class="text-2xl sm:text-3xl font-black text-brand-dark mb-2 tracking-tight font-baloo">
          كيف يمكننا مساعدتك؟
        </h2>
        <p class="text-sm font-semibold text-brand-subtleGray leading-relaxed max-w-xs mb-8">
          أرسل لنا رسالة وسيقوم فريق الدعم بالرد عليك في أقرب وقت ممكن.
        </p>

        <!-- Contact Form -->
        <form id="contact-form" class="w-full space-y-5 text-right">
          
          <!-- Subject Field (الموضوع) -->
          <div class="space-y-1.5">
            <label for="contact-subject" class="block text-sm font-black text-brand-dark pr-1">
              الموضوع
            </label>
            <input
              type="text"
              id="contact-subject"
              required
              placeholder="ما هو موضوع رسالتك؟"
              class="w-full h-14 px-4 rounded-2xl bg-white border-2 border-brand-peachBorder text-brand-dark placeholder-brand-subtleGray text-sm font-bold focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all font-baloo shadow-sm"
            />
          </div>

          <!-- Message Field (الرسالة) -->
          <div class="space-y-1.5">
            <label for="contact-message" class="block text-sm font-black text-brand-dark pr-1">
              الرسالة
            </label>
            <textarea
              id="contact-message"
              required
              rows="5"
              placeholder="...صف مشكلتك أو ملاحظاتك"
              class="w-full p-4 rounded-2xl bg-white border-2 border-brand-peachBorder text-brand-dark placeholder-brand-subtleGray text-sm font-bold focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all font-baloo resize-none leading-relaxed shadow-sm"
            ></textarea>
          </div>

          <!-- Submit Button: Substantial & Prominent Pill Button (Pill Shape with Meow Palette) -->
          <div class="pt-5 flex justify-center w-full">
            <button
              type="submit"
              id="contact-submit-btn"
              class="w-full max-w-sm h-16 px-10 rounded-full bg-brand-orange hover:bg-brand-orangeHover text-white text-lg font-black shadow-soft hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center gap-3 font-baloo border-2 border-brand-orange/30 tracking-wide"
            >
              <span class="text-lg font-black">إرسال الرسالة</span>
              <i class="fa-solid fa-paper-plane text-base"></i>
            </button>
          </div>
        </form>

      </div>

      <!-- Toast Notification Alert (Hidden by default) -->
      <div
        id="contact-toast"
        class="hidden fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] inset-x-4 max-w-sm mx-auto bg-emerald-600 text-white p-4 rounded-2xl shadow-2xl z-50 text-right animate-slide-up"
      >
        <div class="flex items-center gap-3">
          <i class="fa-solid fa-circle-check text-2xl shrink-0"></i>
          <div>
            <h4 class="text-sm font-black m-0 font-baloo">تم إرسال رسالتك بنجاح!</h4>
            <p class="text-xs font-bold text-emerald-100 m-0 mt-0.5">
              شكراً لتواصلك، سنرد عليك في أقرب وقت ممكن.
            </p>
          </div>
        </div>
      </div>

    </div>
  `;
}

export function attachContactEvents(): void {
  const backBtn = document.getElementById('contact-back-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      state.closeContactView();
    });
  }

  const form = document.getElementById('contact-form') as HTMLFormElement;
  const toast = document.getElementById('contact-toast');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const subjectInput = document.getElementById('contact-subject') as HTMLInputElement;
      const messageInput = document.getElementById('contact-message') as HTMLTextAreaElement;

      const subject = subjectInput?.value.trim() || '';
      const message = messageInput?.value.trim() || '';

      if (!subject || !message) return;

      const user = state.getUser();
      const storedMsg: StoredContactMessage = {
        id: `contact_${Date.now()}`,
        subject,
        message,
        timestamp: new Date().toLocaleString('ar-EG'),
        userName: user.name,
        userPhone: user.phone,
      };

      try {
        const existing = JSON.parse(localStorage.getItem('meow_contact_messages') || '[]');
        existing.unshift(storedMsg);
        localStorage.setItem('meow_contact_messages', JSON.stringify(existing));
      } catch (err) {
        console.warn('Failed to save contact message to localStorage:', err);
      }

      // Reset form & show toast
      form.reset();

      if (toast) {
        toast.classList.remove('hidden');
        setTimeout(() => {
          toast.classList.add('hidden');
          state.closeContactView();
        }, 1800);
      } else {
        state.closeContactView();
      }
    });
  }
}
