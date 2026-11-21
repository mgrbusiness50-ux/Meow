export function renderClinicView(): string {
  return `
    <div class="w-full max-w-md mx-auto px-4 sm:px-5 pt-3 pb-6 flex-1 min-w-0">
      <div class="relative flex flex-col items-center justify-center text-center px-4 py-12 overflow-hidden bg-white/60 border border-brand-peachBorder rounded-3xl shadow-card" data-purpose="empty-messages-state">
        
        <!-- Decorative scattered paw prints matching _6/code.html -->
        <div class="absolute top-4 left-6 text-brand-orange/20 text-3xl transform -rotate-12 pointer-events-none select-none">
          <i class="fa-solid fa-paw"></i>
        </div>
        <div class="absolute top-10 right-8 text-brand-orange/20 text-2xl transform rotate-45 pointer-events-none select-none">
          <i class="fa-solid fa-paw"></i>
        </div>
        <div class="absolute bottom-8 left-10 text-brand-orange/20 text-4xl transform rotate-20 pointer-events-none select-none">
          <i class="fa-solid fa-paw"></i>
        </div>
        <div class="absolute bottom-16 right-6 text-brand-orange/20 text-2xl transform -rotate-25 pointer-events-none select-none">
          <i class="fa-solid fa-paw"></i>
        </div>
        <div class="absolute top-1/2 left-3 text-brand-peachBorder/40 text-xl pointer-events-none select-none">
          <i class="fa-solid fa-paw"></i>
        </div>

        <!-- Center Soft Illustration Badge -->
        <div class="relative mb-6">
          <div class="w-32 h-32 rounded-full bg-gradient-to-tr from-brand-orange/20 to-brand-peachBorder/40 flex items-center justify-center shadow-inner relative">
            <div class="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-soft border-2 border-brand-peachBorder/60">
              <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-orange to-brand-accent flex items-center justify-center text-white shadow-soft">
                <i class="fa-solid fa-house-medical text-2xl drop-shadow-sm"></i>
              </div>
            </div>
            <!-- Cute little floating paw badge -->
            <span class="absolute -bottom-1 -right-1 w-9 h-9 bg-white border-2 border-brand-peachBorder rounded-full flex items-center justify-center text-brand-orange text-sm shadow-sm">
              <i class="fa-solid fa-paw"></i>
            </span>
          </div>
        </div>

        <!-- Friendly Empty State Text (Enlarged & Legible) -->
        <h2 class="text-2xl sm:text-3xl font-black text-brand-dark dark:text-white mb-2.5 tracking-tight font-baloo">العيادات البيطرية قريباً!! 🐾</h2>
        <p class="text-base font-bold text-brand-subtleGray dark:text-[#D1C7BD] max-w-sm leading-relaxed mb-8 font-baloo">
          نعمل على توفير أفضل الأطباء والعيادات البيطرية المعتمدة لرعاية ومتابعة صحة أليفك في أقرب وقت.
        </p>

        <!-- Friendly Soft Call-to-Action Button (Pill / Rounded Full) -->
        <button
          type="button"
          id="clinic-notify-btn"
          class="px-8 py-3.5 rounded-full bg-brand-orange text-white font-black text-base shadow-soft hover:bg-brand-orangeHover active:scale-95 transition-all flex items-center gap-2 border border-brand-orange cursor-pointer font-baloo"
        >
          <i class="fa-solid fa-bell text-sm"></i>
          <span id="clinic-notify-text">تنبيهي عند التوفر 🔔</span>
        </button>

      </div>
    </div>
  `;
}

export function attachClinicEvents(): void {
  const notifyBtn = document.getElementById('clinic-notify-btn');
  const notifyText = document.getElementById('clinic-notify-text');
  if (notifyBtn && notifyText) {
    notifyBtn.addEventListener('click', () => {
      notifyBtn.classList.remove('bg-brand-orange', 'border-brand-orange');
      notifyBtn.classList.add('bg-emerald-600', 'border-emerald-600');
      notifyText.innerText = 'تم تسجيل رغبتك بالتنبيه! 🎉';
    });
  }
}
