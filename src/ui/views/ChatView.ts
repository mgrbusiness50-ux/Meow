import { state } from '../../state.ts';
import { Conversation, ChatMessage } from '../../types.ts';

let activeSubTab: 'chats' | 'requests' = 'chats';
let chatCategoryFilter: 'all' | 'mating' | 'adoption' | 'clinics' = 'all';
let isStickersOpen = false;

// Custom Sticker Management (لا استيكرز جاهزة - ميزة إنشاء استيكر من الصور وحفظها محلياً)
export interface CustomSticker {
  id: string;
  imageUrl: string;
  title: string;
  createdAt: string;
}

function getCustomStickers(): CustomSticker[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('meow_custom_stickers') || '[]');
  } catch {
    return [];
  }
}

function saveCustomSticker(imageUrl: string, title: string = 'استيكر مخصص'): CustomSticker {
  const stickers = getCustomStickers();
  const newStk: CustomSticker = {
    id: `stk_${Date.now()}`,
    imageUrl,
    title,
    createdAt: new Date().toISOString(),
  };
  stickers.unshift(newStk);
  if (typeof window !== 'undefined') {
    localStorage.setItem('meow_custom_stickers', JSON.stringify(stickers));
  }
  return newStk;
}

function deleteCustomSticker(id: string): void {
  const stickers = getCustomStickers().filter((s) => s.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem('meow_custom_stickers', JSON.stringify(stickers));
  }
}

// Audio recording state
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let isRecordingAudio = false;
let recordingSeconds = 0;
let recordingTimer: any = null;
let currentlyPlayingAudio: HTMLAudioElement | null = null;
let currentPlayingMsgId: string | null = null;

export function renderChatView(): string {
  const requests = state.getContactRequests();
  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const conversations = state.getConversations();
  const activeConversation = state.getActiveConversation();

  // If there's an active conversation, show WhatsApp-like chat room
  if (activeConversation) {
    return renderChatRoom(activeConversation);
  }

  // Filter conversations by category if selected
  const filteredConversations = conversations.filter((c) => {
    if (chatCategoryFilter === 'mating') return c.petType === 'mating';
    if (chatCategoryFilter === 'adoption') return c.petType === 'adoption';
    return true;
  });

  return `
    <main class="w-full max-w-md mx-auto px-4 pt-3 pb-24 flex-1">

      <!-- Categories & Filters Order (1. الكل, 2. التزاوج, 3. التبني, 4. العيادات) - Enlarged Pill Buttons -->
      <div class="mb-4 flex flex-col gap-3">
        <div class="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          <!-- 1. الكل -->
          <button
            data-chat-filter="all"
            type="button"
            class="chat-category-btn h-12 px-5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap font-baloo shadow-xs ${
              chatCategoryFilter === 'all'
                ? 'bg-brand-orange text-white shadow-soft ring-2 ring-brand-orange/30'
                : 'bg-white dark:bg-[#27201B] border-2 border-brand-peachBorder dark:border-warm-darkBorder text-warm-textSec dark:text-[#D1C7BD] hover:bg-brand-peachBorder/20'
            }"
          >
            الكل (${conversations.length})
          </button>

          <!-- 2. التزاوج -->
          <button
            data-chat-filter="mating"
            type="button"
            class="chat-category-btn h-12 px-5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap font-baloo shadow-xs ${
              chatCategoryFilter === 'mating'
                ? 'bg-brand-orange text-white shadow-soft ring-2 ring-brand-orange/30'
                : 'bg-white dark:bg-[#27201B] border-2 border-brand-peachBorder dark:border-warm-darkBorder text-warm-textSec dark:text-[#D1C7BD] hover:bg-brand-peachBorder/20'
            }"
          >
            التزاوج
          </button>

          <!-- 3. التبني -->
          <button
            data-chat-filter="adoption"
            type="button"
            class="chat-category-btn h-12 px-5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap font-baloo shadow-xs ${
              chatCategoryFilter === 'adoption'
                ? 'bg-brand-orange text-white shadow-soft ring-2 ring-brand-orange/30'
                : 'bg-white dark:bg-[#27201B] border-2 border-brand-peachBorder dark:border-warm-darkBorder text-warm-textSec dark:text-[#D1C7BD] hover:bg-brand-peachBorder/20'
            }"
          >
            التبني
          </button>

          <!-- 4. العيادات (متاح قريباً) -->
          <div class="relative shrink-0">
            <button
              data-chat-filter="clinics"
              type="button"
              class="chat-category-btn h-12 px-5 rounded-full text-xs sm:text-sm font-black transition-all cursor-pointer whitespace-nowrap font-baloo bg-white dark:bg-[#27201B] border-2 border-brand-peachBorder dark:border-warm-darkBorder text-warm-textSec dark:text-[#D1C7BD] opacity-80 hover:opacity-100 flex items-center gap-2 shadow-xs ${
                chatCategoryFilter === 'clinics' ? 'border-brand-orange bg-brand-orange/10' : ''
              }"
            >
              <i class="fa-solid fa-house-medical text-sm text-brand-orange"></i>
              <span>العيادات</span>
              <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-brand-cream dark:bg-[#342A24] text-brand-orange border border-brand-peachBorder/80 dark:border-warm-darkBorder">
                قريباً
              </span>
            </button>
          </div>
        </div>

        <!-- Switcher Between Active Chats & Contact Requests - Enlarged Pill Switcher -->
        <div class="bg-white/90 dark:bg-[#27201B] border-2 border-brand-peachBorder/80 dark:border-warm-darkBorder rounded-full p-1.5 flex items-center gap-1.5 shadow-2xs">
          <button
            id="subtab-chats-btn"
            type="button"
            class="flex-1 h-11 px-4 rounded-full text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer font-baloo ${
              activeSubTab === 'chats'
                ? 'bg-brand-orange text-white shadow-soft'
                : 'text-brand-dark/70 dark:text-[#D1C7BD] hover:bg-brand-peachBorder/20'
            }"
          >
            <span>المحادثات</span>
            <span class="px-2 py-0.5 rounded-full text-[11px] ${
              activeSubTab === 'chats' ? 'bg-white text-brand-orange font-black' : 'bg-brand-peachBorder/40 dark:bg-[#342A24] text-brand-dark dark:text-white'
            }">${filteredConversations.length}</span>
          </button>

          <button
            id="subtab-requests-btn"
            type="button"
            class="flex-1 h-11 px-4 rounded-full text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer font-baloo ${
              activeSubTab === 'requests'
                ? 'bg-brand-orange text-white shadow-soft'
                : 'text-brand-dark/70 dark:text-[#D1C7BD] hover:bg-brand-peachBorder/20'
            }"
          >
            <span>طلبات التواصل</span>
            ${
              pendingRequests.length > 0
                ? `<span class="px-2 py-0.5 rounded-full text-[11px] bg-red-500 text-white font-black animate-pulse">${pendingRequests.length}</span>`
                : `<span class="px-2 py-0.5 rounded-full text-[11px] bg-brand-peachBorder/40 dark:bg-[#342A24] text-brand-dark dark:text-white">${requests.length}</span>`
            }
          </button>
        </div>

      </div>

      <!-- Content -->
      ${
        chatCategoryFilter === 'clinics'
          ? `
          <div class="bg-white/80 dark:bg-[#27201B]/80 border-2 border-brand-peachBorder dark:border-warm-darkBorder rounded-3xl p-8 text-center space-y-4 shadow-card" dir="rtl">
            <div class="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-orange/20 to-brand-peachBorder/40 dark:from-brand-orange/30 dark:to-warm-darkBorder text-brand-orange flex items-center justify-center mx-auto text-3xl border-2 border-brand-peachBorder/80 dark:border-warm-darkBorder shadow-soft relative">
              <i class="fa-solid fa-house-medical text-3xl text-brand-orange drop-shadow-sm"></i>
              <span class="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-[#342A24] border border-brand-peachBorder dark:border-warm-darkBorder rounded-full flex items-center justify-center text-brand-orange text-xs shadow-2xs">
                <i class="fa-solid fa-stethoscope"></i>
              </span>
            </div>
            <h3 class="text-lg sm:text-xl font-black font-baloo text-warm-text dark:text-white">محادثات العيادات البيطرية</h3>
            <p class="text-sm sm:text-base font-bold text-warm-textSec dark:text-[#D1C7BD] max-w-sm mx-auto leading-relaxed">
              هذا القسم سيكون متاحاً قريباً للتواصل المباشر مع الأطباء البيطريين وحجز الاستشارات والمواعيد.
            </p>
            <span class="inline-block text-xs font-black px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60">
              قريباً في التحديث القادم
            </span>
          </div>
          `
          : activeSubTab === 'chats'
          ? renderConversationsList(filteredConversations)
          : renderRequestsList(requests)
      }

    </main>
  `;
}

function renderConversationsList(conversations: ReturnType<typeof state.getConversations>): string {
  if (conversations.length === 0) {
    return `
      <div class="relative flex flex-col items-center justify-center text-center px-4 py-12 overflow-hidden bg-white/60 dark:bg-[#27201B]/80 border border-brand-peachBorder dark:border-warm-darkBorder rounded-3xl shadow-card" data-purpose="empty-messages-state">
        <div class="relative mb-6">
          <div class="w-28 h-28 rounded-full bg-gradient-to-tr from-brand-orange/20 to-brand-peachBorder/40 dark:to-warm-darkBorder flex items-center justify-center relative">
            <div class="w-20 h-20 rounded-full bg-white dark:bg-[#342A24] flex items-center justify-center shadow-soft border-2 border-brand-peachBorder/60 dark:border-warm-darkBorder">
              <i class="fa-solid fa-comments text-3xl text-brand-orange"></i>
            </div>
            <span class="absolute -bottom-1 -right-1 w-8 h-8 bg-white dark:bg-[#342A24] border-2 border-brand-peachBorder dark:border-warm-darkBorder rounded-full flex items-center justify-center text-brand-orange text-xs shadow-sm">
              🐾
            </span>
          </div>
        </div>

        <h2 class="text-2xl font-black text-brand-dark dark:text-white mb-2 tracking-tight font-baloo">لا توجد رسائل حتى الآن</h2>
        <p class="text-sm font-semibold text-brand-subtleGray dark:text-[#A89F91] max-w-xs leading-relaxed mb-6">
          ابدأ المحادثة مع أصحاب الحيوانات الأليفة للتبني أو التزاوج وشارك حبك للمياو!
        </p>

        <button
          type="button"
          id="explore-pets-btn"
          class="px-8 py-3 rounded-2xl bg-brand-orange text-white font-black text-sm shadow-soft hover:bg-brand-orangeHover transition-all flex items-center gap-2 cursor-pointer font-baloo active:scale-95"
        >
          <i class="fa-solid fa-magnifying-glass text-xs"></i>
          <span>استكشف الحيوانات المتاحة</span>
        </button>
      </div>
    `;
  }

  return `
    <div class="space-y-3">
      ${conversations
        .map((conv) => {
          return `
            <div
              data-conversation-id="${conv.id}"
              class="conversation-item-card bg-white/90 dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder rounded-3xl p-3.5 flex items-center justify-between gap-3.5 cursor-pointer hover:border-brand-orange/60 shadow-sm transition-all duration-200 group active:scale-[0.99]"
            >
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <div class="relative flex-shrink-0">
                  <img
                    src="${conv.otherUserAvatar}"
                    alt="${conv.otherUserName}"
                    class="w-12 h-12 rounded-2xl object-cover border-2 border-brand-peachBorder dark:border-warm-darkBorder group-hover:border-brand-orange transition"
                  />
                  <img
                    src="${conv.petPhoto}"
                    alt="${conv.petName}"
                    class="w-5 h-5 rounded-full object-cover border-2 border-white dark:border-[#27201B] absolute -bottom-1 -right-1 shadow-sm"
                  />
                </div>

                <div class="flex-1 min-w-0 text-right">
                  <div class="flex items-center justify-between gap-2">
                    <h4 class="text-sm font-black text-brand-dark dark:text-white group-hover:text-brand-orange transition truncate font-baloo">${conv.otherUserName}</h4>
                    <span class="text-[10px] text-brand-subtleGray dark:text-[#A89F91] font-bold whitespace-nowrap">${conv.lastMessageTime}</span>
                  </div>

                  <div class="text-[11px] font-bold text-brand-orange mt-0.5 truncate font-baloo">
                    بخصوص: ${conv.petName} (${conv.petType === 'mating' ? 'تزاوج' : 'تبني'})
                  </div>

                  <p class="text-xs font-semibold text-brand-subtleGray dark:text-[#A89F91] truncate mt-0.5">
                    ${conv.lastMessage}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 flex-shrink-0">
                ${
                  conv.unreadCount > 0
                    ? `<span class="w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] font-black flex items-center justify-center shadow-soft">${conv.unreadCount}</span>`
                    : ''
                }
                <i class="fa-solid fa-chevron-left text-xs text-brand-subtleGray group-hover:text-brand-orange transition"></i>
              </div>
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}

function renderRequestsList(requests: ReturnType<typeof state.getContactRequests>): string {
  if (requests.length === 0) {
    return `
      <div class="bg-white/70 dark:bg-[#27201B] border-2 border-brand-peachBorder dark:border-warm-darkBorder rounded-3xl p-8 text-center space-y-3 shadow-card">
        <div class="w-16 h-16 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center mx-auto text-2xl border-2 border-brand-peachBorder/60">
          <i class="fa-solid fa-inbox"></i>
        </div>
        <h3 class="text-lg font-black text-brand-dark dark:text-white font-baloo">لا توجد طلبات تواصل حالياً</h3>
        <p class="text-sm font-bold text-brand-subtleGray dark:text-[#A89F91] max-w-xs mx-auto leading-relaxed">
          عندما يبدي أحد أصحاب الحيوانات اهتمامه بحيوانك أو ترسل طلب تواصل، ستظهر هنا الطلبات للموافقة.
        </p>
      </div>
    `;
  }

  return `
    <div class="space-y-3">
      <div class="p-3.5 rounded-2xl bg-brand-orange/10 border-2 border-brand-peachBorder/80 dark:border-warm-darkBorder text-xs sm:text-sm font-bold text-brand-dark dark:text-white flex items-center gap-2.5 shadow-2xs">
        <i class="fa-solid fa-shield-halved text-brand-orange text-base shrink-0"></i>
        <span><strong>خصوصية كاملة:</strong> لن يتم كشف رقم الهاتف أو وسيلة الاتصال المباشر إلا بعد موافقة الطرفين.</span>
      </div>

      ${requests
        .map((req) => {
          const isPending = req.status === 'pending';
          const isAccepted = req.status === 'accepted';
          const isRejected = req.status === 'rejected';

          return `
            <div class="bg-white/95 dark:bg-[#27201B] border-2 border-brand-peachBorder dark:border-warm-darkBorder rounded-3xl p-4 shadow-sm space-y-3 text-right">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <img src="${req.senderAvatar}" alt="${req.senderName}" class="w-12 h-12 rounded-2xl object-cover border-2 border-brand-peachBorder shadow-xs" />
                  <div class="min-w-0">
                    <div class="flex items-center gap-2">
                      <h4 class="text-base font-black text-brand-dark dark:text-white truncate font-baloo">${req.senderName}</h4>
                      <span class="text-[11px] font-black px-2.5 py-0.5 rounded-full ${
                        req.type === 'mating'
                          ? 'bg-brand-orange/10 text-brand-orange border border-brand-peachBorder'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                      }">
                        ${req.type === 'mating' ? 'طلب تزاوج ❤️' : 'طلب تبني 🏠'}
                      </span>
                    </div>
                    <div class="text-xs font-bold text-brand-subtleGray dark:text-[#A89F91] truncate mt-0.5">
                      حيوانك: <strong class="text-brand-dark dark:text-white">${req.receiverPetName}</strong>
                    </div>
                  </div>
                </div>

                <div class="flex flex-col items-end gap-1 flex-shrink-0">
                  <span class="text-[11px] font-bold text-brand-subtleGray">${req.timestamp}</span>
                  ${
                    isAccepted
                      ? `<span class="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">✓ تمت الموافقة</span>`
                      : isRejected
                      ? `<span class="text-xs font-black px-3 py-1 rounded-full bg-rose-100 text-rose-800">✕ تم الرفض</span>`
                      : `<span class="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-800">قيد الانتظار</span>`
                  }
                </div>
              </div>

              <!-- Message Body -->
              <div class="p-3.5 rounded-2xl bg-[#FFF9E9] dark:bg-[#342A24] border border-brand-peachBorder/60 dark:border-warm-darkBorder text-xs sm:text-sm font-semibold text-brand-dark dark:text-white leading-relaxed">
                "${req.message}"
              </div>

              <!-- Actions (Soft Rounded-full Pill Buttons) -->
              ${
                isPending
                  ? `
                  <div class="flex items-center justify-end gap-2.5 pt-2 border-t border-brand-peachBorder/40 dark:border-warm-darkBorder">
                    <button
                      data-reject-request-id="${req.id}"
                      class="reject-request-btn px-5 py-2 rounded-full bg-white dark:bg-[#342A24] border-2 border-brand-peachBorder dark:border-warm-darkBorder text-brand-dark dark:text-white text-xs font-bold hover:bg-brand-peachBorder/20 transition active:scale-95 cursor-pointer"
                      type="button"
                    >
                      رفض
                    </button>
                    <button
                      data-approve-request-id="${req.id}"
                      class="approve-request-btn px-6 py-2 rounded-full bg-brand-orange text-white text-xs sm:text-sm font-black shadow-soft hover:bg-brand-orangeHover transition active:scale-95 cursor-pointer font-baloo"
                      type="button"
                    >
                      موافقة ومحادثة 💬
                    </button>
                  </div>
                  `
                  : isAccepted
                  ? `
                  <div class="flex justify-end pt-1">
                    <button
                      id="view-conversation-direct-btn"
                      class="px-5 py-2 rounded-full bg-white dark:bg-[#342A24] border-2 border-brand-orange text-brand-orange text-xs sm:text-sm font-black hover:bg-brand-orange/10 transition active:scale-95 cursor-pointer font-baloo"
                      type="button"
                    >
                      الانتقال للمحادثة 💬
                    </button>
                  </div>
                  `
                  : ''
              }
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}

// WhatsApp-like Chat Room with real audio recorder, attachment handling, and keyboard scroll
function renderChatRoom(conv: ReturnType<typeof state.getActiveConversation>): string {
  if (!conv) return '';

  return `
    <!-- WhatsApp-Style Chat Room (Meow Warm Theme) - Full Screen without Taskbar -->
    <div id="active-chat-room" class="fixed inset-0 z-50 bg-[#FAF4ED] dark:bg-[#1A1512] flex flex-col w-full max-w-md mx-auto shadow-2xl h-[100dvh] overflow-hidden" dir="rtl">
      
      <!-- Top WhatsApp Header (Clean & Warm, Larger & Clear) -->
      <header class="shrink-0 bg-[#FFF9E9] dark:bg-[#27201B] border-b-2 border-brand-peachBorder/70 dark:border-warm-darkBorder px-4 py-3 flex items-center justify-between shadow-xs z-30">
        <div class="flex items-center gap-2.5 min-w-0">
          <!-- Back button -->
          <button 
            id="back-to-chats-btn" 
            class="w-11 h-11 rounded-full bg-black/5 dark:bg-white/10 hover:bg-brand-orange hover:text-white text-brand-dark dark:text-white flex items-center justify-center text-base cursor-pointer transition active:scale-90 shadow-2xs shrink-0" 
            type="button"
            aria-label="الرجوع إلى المحادثات"
            title="رجوع"
          >
            <i class="fa-solid fa-arrow-right text-lg"></i>
          </button>
          
          <!-- Avatar & Online status -->
          <div class="relative shrink-0">
            <img
              src="${conv.otherUserAvatar}"
              alt="${conv.otherUserName}"
              class="w-12 h-12 rounded-full object-cover border-2 border-brand-orange shadow-xs"
            />
            <span class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#27201B]"></span>
          </div>

          <div class="min-w-0 text-right">
            <h3 class="text-base font-black text-brand-dark dark:text-white truncate font-baloo leading-tight m-0">
              ${conv.otherUserName}
            </h3>
            <p class="text-xs font-bold text-brand-orange truncate m-0 font-baloo mt-0.5">
              ${conv.petName} (${conv.petType === 'mating' ? 'تزاوج' : 'تبني'}) • متصل الآن
            </p>
          </div>
        </div>

        <div class="flex items-center gap-1 shrink-0">
          ${
            conv.otherUserPhone
              ? `
              <a 
                href="tel:${conv.otherUserPhone}" 
                class="w-9 h-9 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center hover:bg-emerald-100 transition shadow-2xs"
                title="اتصال هاتفي"
              >
                <i class="fa-solid fa-phone text-xs"></i>
              </a>
              `
              : ''
          }
        </div>
      </header>

      <!-- Messages Body (WhatsApp-like bubbles with Meow warm styling & pet doodle pattern) -->
      <div 
        id="chat-messages-container" 
        class="flex-1 overflow-y-auto px-3.5 py-4 space-y-3 overscroll-contain bg-[#FAF4ED] dark:bg-[#1A1512]"
        style="background-image: radial-gradient(circle, rgba(230, 126, 34, 0.05) 1.5px, transparent 1.5px), url(&quot;data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23E67E22' fill-opacity='0.035' fill-rule='evenodd'%3E%3Cpath d='M20 20c2 0 3.5-1.5 3.5-3.5S22 13 20 13s-3.5 1.5-3.5 3.5 1.5 3.5 3.5 3.5zm12-3c2 0 3.5-1.5 3.5-3.5S34 10 32 10s-3.5 1.5-3.5 3.5 1.5 3.5 3.5 3.5zm12 3c2 0 3.5-1.5 3.5-3.5S46 13 44 13s-3.5 1.5-3.5 3.5 1.5 3.5 3.5 3.5zm-12 9c-5 0-9 4-9 9 0 3.5 3 6.5 7 6.5h4c4 0 7-3 7-6.5 0-5-4-9-9-9z'/%3E%3C/g%3E%3C/svg%3E&quot;); background-size: 24px 24px, 80px 80px;"
      >
        ${conv.messages
          .map((msg) => {
            if (msg.senderId === 'system') {
              return `
                <div class="flex justify-center my-2 select-none">
                  <span class="px-3.5 py-1.5 rounded-2xl bg-white/80 dark:bg-[#27201B]/80 border border-brand-peachBorder/60 dark:border-warm-darkBorder text-[11px] font-bold text-brand-orange text-center max-w-[85%] shadow-2xs leading-relaxed font-baloo">
                    ${msg.text}
                  </span>
                </div>
              `;
            }

            const isUser = msg.isFromUser;
            return `
              <div class="flex flex-col ${isUser ? 'items-end' : 'items-start'} transition-all animate-fade-in group" data-msg-id="${msg.id}">
                
                <!-- Bubble Container -->
                <div class="relative max-w-[84%] sm:max-w-[78%] px-3.5 py-2.5 shadow-sm text-right ${
                  isUser
                    ? 'bg-[#FFEAD7] dark:bg-[#342419] text-brand-dark dark:text-white rounded-2xl rounded-br-2xs border border-brand-peachBorder/60 dark:border-warm-darkBorder'
                    : 'bg-white dark:bg-[#27201B] text-brand-dark dark:text-white rounded-2xl rounded-bl-2xs border border-brand-peachBorder/70 dark:border-warm-darkBorder'
                }">

                  <!-- 1. Text Message Content -->
                  ${
                    msg.type === 'text' || !msg.type
                      ? `
                      <p class="text-[13px] font-semibold leading-relaxed m-0 break-words font-baloo select-text">
                        ${msg.text || ''}
                      </p>
                      `
                      : ''
                  }

                  <!-- 2. Image Attachment Content -->
                  ${
                    msg.type === 'image' && msg.fileUrl
                      ? `
                      <div class="rounded-xl overflow-hidden mb-1.5 border border-brand-peachBorder/40">
                        <img 
                          src="${msg.fileUrl}" 
                          alt="صورة مرفقة" 
                          class="w-full max-h-60 object-cover cursor-pointer hover:opacity-95 transition" 
                          onclick="window.open('${msg.fileUrl}', '_blank')"
                        />
                      </div>
                      ${msg.text ? `<p class="text-xs font-semibold mt-1">${msg.text}</p>` : ''}
                      `
                      : ''
                  }

                  <!-- 3. Document / File Attachment Content -->
                  ${
                    msg.type === 'file'
                      ? `
                      <div class="flex items-center gap-2.5 p-2 rounded-xl bg-black/5 dark:bg-white/5 border border-brand-peachBorder/40 mb-1">
                        <div class="w-9 h-9 rounded-lg bg-brand-orange/20 text-brand-orange flex items-center justify-center shrink-0">
                          <i class="fa-solid fa-file-lines text-base"></i>
                        </div>
                        <div class="min-w-0 flex-1 text-right">
                          <p class="text-xs font-black truncate m-0 font-baloo">${msg.fileName || 'ملف مرفق'}</p>
                          <span class="text-[10px] text-brand-subtleGray font-bold">${msg.fileSize || 'ملف'}</span>
                        </div>
                        ${
                          msg.fileUrl
                            ? `
                            <a href="${msg.fileUrl}" download="${msg.fileName || 'meow_file'}" class="w-7 h-7 rounded-full bg-brand-orange text-white flex items-center justify-center text-xs shrink-0" title="تحميل">
                              <i class="fa-solid fa-download"></i>
                            </a>
                            `
                            : ''
                        }
                      </div>
                      `
                      : ''
                  }

                  <!-- 4. Voice Audio Message (Real Player) -->
                  ${
                    msg.type === 'audio'
                      ? `
                      <div class="flex items-center gap-3 py-1 min-w-[200px]" data-audio-msg="${msg.id}">
                        <button
                          type="button"
                          class="play-audio-msg-btn w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center shrink-0 shadow-soft active:scale-90 transition cursor-pointer"
                          data-audio-url="${msg.audioBlobUrl || ''}"
                          data-msg-id="${msg.id}"
                          aria-label="تشغيل الرسالة الصوتية"
                        >
                          <i class="fa-solid fa-play text-sm ml-0.5"></i>
                        </button>

                        <!-- Simulated / Real Audio Waveform bars -->
                        <div class="flex-1 flex flex-col gap-1 min-w-0">
                          <div class="flex items-center gap-0.5 h-6">
                            <span class="w-1 h-3 bg-brand-orange rounded-full"></span>
                            <span class="w-1 h-5 bg-brand-orange rounded-full"></span>
                            <span class="w-1 h-2 bg-brand-orange/70 rounded-full"></span>
                            <span class="w-1 h-6 bg-brand-orange rounded-full"></span>
                            <span class="w-1 h-4 bg-brand-orange/60 rounded-full"></span>
                            <span class="w-1 h-3 bg-brand-orange rounded-full"></span>
                            <span class="w-1 h-5 bg-brand-orange rounded-full"></span>
                            <span class="w-1 h-2 bg-brand-orange/80 rounded-full"></span>
                            <span class="w-1 h-4 bg-brand-orange rounded-full"></span>
                            <span class="w-1 h-5 bg-brand-orange/70 rounded-full"></span>
                            <span class="w-1 h-3 bg-brand-orange rounded-full"></span>
                          </div>
                          <span class="text-[10px] font-mono font-bold text-brand-subtleGray dark:text-[#A89F91]">
                            ${msg.audioDuration ? `0:${msg.audioDuration.toString().padStart(2, '0')}` : '0:07'}
                          </span>
                        </div>
                      </div>
                      `
                      : ''
                  }

                  <!-- 5. Custom Pet Sticker Message -->
                  ${
                    msg.type === 'sticker'
                      ? `
                      <div class="flex flex-col items-center justify-center py-2 px-2 select-none group">
                        ${
                          msg.stickerUrl
                            ? `<img src="${msg.stickerUrl}" alt="استيكر" class="max-w-[150px] max-h-[150px] object-contain drop-shadow-md rounded-2xl hover:scale-105 transition-transform" />`
                            : `<span class="text-6xl sm:text-7xl filter drop-shadow-md transform hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer animate-fade-in inline-block">${msg.stickerEmoji || '🐾'}</span>`
                        }
                        <span class="mt-1.5 px-3 py-0.5 rounded-full bg-brand-orange/15 text-brand-orange text-[10px] font-black font-baloo border border-brand-orange/20 shadow-2xs">
                          ${msg.stickerTitle || 'استيكر مخصص'}
                        </span>
                      </div>
                      `
                      : ''
                  }

                  <!-- Timestamp & Read Receipts (WhatsApp Style in bottom corner) -->
                  <div class="flex items-center justify-end gap-1 mt-1 -mb-1 text-[10px] text-brand-subtleGray dark:text-[#A89F91] font-semibold select-none">
                    <span>${msg.timestamp}</span>
                    ${
                      isUser
                        ? `
                        <span class="text-blue-500 text-[11px]" title="تمت القراءة">
                          <i class="fa-solid fa-check-double"></i>
                        </span>
                        `
                        : ''
                    }
                  </div>

                </div>

              </div>
            `;
          })
          .join('')}
      </div>

      <!-- Live Voice Recording Bar (Appears when recording audio) -->
      <div 
        id="recording-ui-bar" 
        class="hidden shrink-0 bg-[#FFF0E0] dark:bg-[#342419] border-t-2 border-brand-orange px-4 py-3.5 items-center justify-between shadow-lg z-40 animate-slide-up"
      >
        <div class="flex items-center gap-3">
          <span class="w-3.5 h-3.5 rounded-full bg-red-600 animate-ping"></span>
          <span class="text-sm font-black text-red-600 font-baloo">جاري تسجيل رسالة صوتية...</span>
          <span id="recording-live-timer" class="font-mono text-sm font-black text-brand-dark dark:text-white">00:00</span>
        </div>

        <div class="flex items-center gap-2.5">
          <!-- Cancel Recording -->
          <button 
            id="cancel-recording-btn" 
            type="button" 
            class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-base hover:bg-red-200 transition cursor-pointer active:scale-90"
            title="إلغاء التسجيل"
          >
            <i class="fa-solid fa-trash-can"></i>
          </button>

          <!-- Send Recorded Audio -->
          <button 
            id="send-recording-btn" 
            type="button" 
            class="h-10 px-5 rounded-full bg-brand-orange text-white text-xs font-black flex items-center gap-2 shadow-soft hover:bg-brand-orangeHover transition cursor-pointer font-baloo active:scale-90"
            title="إرسال الصوت"
          >
            <span>إرسال</span>
            <i class="fa-solid fa-check"></i>
          </button>
        </div>
      </div>

      <!-- Hidden Real File Picker for Attachments -->
      <input 
        type="file" 
        id="chat-file-picker" 
        class="hidden" 
        accept="image/*,application/pdf,.doc,.docx"
      />

      <!-- WhatsApp-like Input Field Row (Always stays above keyboard, enlarged & prominent) -->
      <footer class="shrink-0 bg-[#FFF9E9] dark:bg-[#231C17] border-t-2 border-brand-peachBorder dark:border-warm-darkBorder z-40 shadow-lg pb-safe flex flex-col">
        
        <!-- Input Row (Always visible, WhatsApp layout) -->
        <div class="px-3.5 py-3 sm:py-3.5 flex items-center gap-2">
          
          <!-- Attachment Button (+) -->
          <button
            id="chat-attachment-btn"
            type="button"
            class="w-11 sm:w-12 h-11 sm:h-12 rounded-full bg-white dark:bg-[#2F241C] border-2 border-brand-peachBorder dark:border-warm-darkBorder text-brand-orange hover:bg-brand-orange hover:text-white flex items-center justify-center text-xl transition-all active:scale-90 cursor-pointer shadow-sm shrink-0"
            title="إرفاق صورة أو ملف"
            aria-label="إرفاق ملف"
          >
            <i class="fa-solid fa-paperclip"></i>
          </button>

          <!-- Interactive Stickers Toggle Button -->
          <button
            id="chat-stickers-btn"
            type="button"
            class="w-11 sm:w-12 h-11 sm:h-12 rounded-full bg-white dark:bg-[#2F241C] border-2 ${
              isStickersOpen
                ? 'border-brand-orange text-brand-orange bg-brand-orange/15 shadow-soft'
                : 'border-brand-peachBorder dark:border-warm-darkBorder text-warm-textSec dark:text-[#D1C7BD]'
            } hover:border-brand-orange hover:text-brand-orange flex items-center justify-center text-xl transition-all active:scale-90 cursor-pointer shadow-sm shrink-0"
            title="ملصقات مياو"
            aria-label="ملصقات"
          >
            <span class="text-xl select-none">😻</span>
          </button>

          <!-- Input Text Field (Empty by default, clean placeholder 'اكتب رسالة...', larger font & height) -->
          <div class="flex-1 min-h-[50px] relative flex items-center bg-white dark:bg-[#2F241C] border-2 border-brand-peachBorder dark:border-warm-darkBorder rounded-full px-4 py-1.5 shadow-sm focus-within:border-brand-orange transition-colors">
            <input
              type="text"
              id="chat-message-input"
              placeholder="اكتب رسالة..."
              class="w-full bg-transparent border-none py-1.5 text-sm sm:text-base font-bold text-brand-dark dark:text-white placeholder-brand-subtleGray focus:outline-none font-baloo"
              autocomplete="off"
            />
          </div>

          <!-- Dynamic Action Button: Voice Record Mic by default, Airplane Send when typing -->
          <button
            id="chat-action-btn"
            class="w-11 sm:w-12 h-11 sm:h-12 rounded-full bg-brand-orange text-white flex items-center justify-center hover:bg-brand-orangeHover active:scale-90 transition-all shadow-soft cursor-pointer shrink-0 font-baloo"
            type="button"
            aria-label="تسجيل صوتي أو إرسال"
            title="تسجيل صوتي"
          >
            <i id="chat-action-icon" class="fa-solid fa-microphone text-lg"></i>
          </button>

        </div>

        <!-- Hidden File Input for Custom Sticker Creation -->
        <input
          type="file"
          id="sticker-upload-input"
          class="hidden"
          accept="image/*"
        />

        <!-- WhatsApp-Inspired Docked Bottom Sticker Drawer (Meow Warm Theme) -->
        <div 
          id="chat-stickers-drawer" 
          class="${isStickersOpen ? 'flex' : 'hidden'} flex-col bg-[#FAF4ED] dark:bg-[#1E1814] border-t-2 border-brand-peachBorder/70 dark:border-warm-darkBorder h-72 sm:h-80 transition-all overflow-hidden"
        >
          <!-- 1. Top Drag Handle & Switcher Header (Inspired by WhatsApp screenshot) -->
          <div class="pt-2 pb-2 px-4 flex flex-col items-center border-b border-brand-peachBorder/60 dark:border-warm-darkBorder shrink-0 bg-[#FFF9E9]/90 dark:bg-[#231C17]/90">
            <!-- Top Drag Handle Pill -->
            <div class="w-10 h-1 bg-brand-peachBorder dark:bg-warm-darkBorder rounded-full mb-2"></div>
            
            <!-- Controls Bar: Search Icon, Center Switcher Pills, Close Button -->
            <div class="w-full flex items-center justify-between gap-2">
              
              <!-- Search Icon Button -->
              <button
                type="button"
                id="sticker-search-btn"
                class="w-8 h-8 rounded-full bg-white dark:bg-[#2F241C] border border-brand-peachBorder dark:border-warm-darkBorder text-warm-textSec dark:text-[#D1C7BD] hover:text-brand-orange flex items-center justify-center text-xs transition active:scale-90 cursor-pointer shadow-2xs"
                title="بحث في الملصقات"
              >
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>

              <!-- Center Switcher Pill Tabs (Emoji / GIF / Stickers style) -->
              <div class="flex items-center bg-brand-peachBorder/30 dark:bg-black/30 p-1 rounded-full border border-brand-peachBorder/60 dark:border-warm-darkBorder shadow-2xs">
                <button
                  type="button"
                  class="px-3.5 py-1 rounded-full text-xs font-black bg-white dark:bg-[#2F241C] text-brand-orange shadow-2xs flex items-center gap-1.5 font-baloo cursor-pointer"
                >
                  <i class="fa-solid fa-note-sticky text-xs"></i>
                  <span>ملصقاتي</span>
                  <span class="text-[10px] px-1.5 py-0.2 rounded-full bg-brand-orange/15 text-brand-orange font-mono">${getCustomStickers().length}</span>
                </button>
              </div>

              <!-- Close Drawer Button (✕) -->
              <button 
                id="close-stickers-btn" 
                type="button" 
                class="w-8 h-8 rounded-full bg-white dark:bg-[#2F241C] border border-brand-peachBorder dark:border-warm-darkBorder text-warm-textSec hover:text-brand-orange flex items-center justify-center text-xs cursor-pointer transition active:scale-90 shadow-2xs"
                title="إغلاق لوحة الملصقات"
              >
                <i class="fa-solid fa-xmark"></i>
              </button>

            </div>
          </div>

          <!-- 2. Stickers Content Grid with Smooth Scroll -->
          <div class="flex-1 overflow-y-auto px-4 py-3 min-h-0 overscroll-contain">
            
            <div class="grid grid-cols-4 sm:grid-cols-5 gap-3">
              
              <!-- FIRST ITEM IN GRID: Dedicated 'Create sticker' / 'إنشاء استيكر' Tile (WhatsApp Style in Meow Palette) -->
              <div
                id="create-sticker-tile"
                class="create-sticker-tile group aspect-square rounded-2xl border-2 border-dashed border-brand-orange/80 bg-brand-orange/5 hover:bg-brand-orange/15 hover:border-brand-orange flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all active:scale-95 shadow-2xs"
                title="إنشاء استيكر جديد من صورك"
              >
                <div class="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-soft mb-1.5 group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-pen text-sm"></i>
                </div>
                <span class="text-[11px] font-black text-brand-orange font-baloo leading-tight">
                  إنشاء استيكر
                </span>
              </div>

              <!-- User's Saved Custom Stickers -->
              ${getCustomStickers()
                .map(
                  (stk) => `
                <div class="relative group aspect-square rounded-2xl bg-white dark:bg-[#2F241C] border-2 border-brand-peachBorder dark:border-warm-darkBorder hover:border-brand-orange p-1.5 flex items-center justify-center transition-all shadow-2xs hover:shadow-sm">
                  <button
                    type="button"
                    class="custom-sticker-send-btn w-full h-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
                    data-sticker-url="${stk.imageUrl}"
                    data-sticker-title="${stk.title}"
                    title="إرسال هذا الاستيكر"
                  >
                    <img src="${stk.imageUrl}" alt="${stk.title}" class="max-w-full max-h-full object-contain rounded-xl select-none" />
                  </button>
                  <button
                    type="button"
                    class="delete-custom-sticker-btn absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] shadow-sm hover:scale-110 active:scale-90 transition cursor-pointer"
                    data-sticker-id="${stk.id}"
                    title="حذف الاستيكر"
                  >
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
              `
                )
                .join('')}

            </div>

            <!-- Helpful Warm Note if No Stickers Yet -->
            ${
              getCustomStickers().length === 0
                ? `
                <div class="mt-4 p-3 rounded-2xl bg-white/70 dark:bg-[#27201B]/70 border border-brand-peachBorder/60 dark:border-warm-darkBorder text-center">
                  <p class="text-xs font-bold text-warm-textSec dark:text-[#D1C7BD] font-baloo m-0">
                    حول أي صورة أليف عندك إلى استيكر بضغطة واحدة من زر «إنشاء استيكر» أعلاه!
                  </p>
                </div>
                `
                : ''
            }

          </div>

          <!-- 3. Bottom Pack Navigation Bar (Like WhatsApp: Clock, Star, Pet Pack, Add) -->
          <div class="shrink-0 px-4 py-2 bg-[#FFF9E9] dark:bg-[#231C17] border-t border-brand-peachBorder/60 dark:border-warm-darkBorder flex items-center justify-between">
            <div class="flex items-center gap-3.5">
              <!-- Recents 🕒 -->
              <button type="button" class="text-warm-textSec dark:text-[#A89F91] hover:text-brand-orange transition p-1 text-sm cursor-pointer" title="الأخيرة">
                <i class="fa-regular fa-clock"></i>
              </button>
              <!-- Favorites ⭐ -->
              <button type="button" class="text-warm-textSec dark:text-[#A89F91] hover:text-brand-orange transition p-1 text-sm cursor-pointer" title="المفضلة">
                <i class="fa-regular fa-star"></i>
              </button>
              <!-- Meow Pet Pack 🐾 (Active Tab) -->
              <button type="button" class="relative text-brand-orange transition p-1 text-base cursor-pointer" title="استيكرز مياو">
                <i class="fa-solid fa-paw"></i>
                <span class="absolute -bottom-1 inset-x-0 mx-auto w-3.5 h-0.5 bg-brand-orange rounded-full"></span>
              </button>
            </div>

            <!-- Add new sticker (+) button in bottom bar -->
            <button
              id="add-sticker-pack-btn"
              type="button"
              class="w-7 h-7 rounded-full bg-brand-orange/15 text-brand-orange hover:bg-brand-orange hover:text-white flex items-center justify-center text-xs transition active:scale-90 cursor-pointer"
              title="إضافة استيكر جديد من صورة"
            >
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>

        </div>
      </footer>

    </div>
  `;
}

export function attachChatEvents(): void {
  // Sub-tabs
  const chatsSubTabBtn = document.getElementById('subtab-chats-btn');
  const requestsSubTabBtn = document.getElementById('subtab-requests-btn');
  const chatFilterBtns = document.querySelectorAll<HTMLButtonElement>('.chat-category-btn');

  chatFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-chat-filter') as any;
      if (filter) {
        chatCategoryFilter = filter;
        state.setCurrentTab('chat');
      }
    });
  });

  if (chatsSubTabBtn) {
    chatsSubTabBtn.addEventListener('click', () => {
      activeSubTab = 'chats';
      state.setActiveConversationId(null);
    });
  }
  if (requestsSubTabBtn) {
    requestsSubTabBtn.addEventListener('click', () => {
      activeSubTab = 'requests';
      state.setActiveConversationId(null);
    });
  }

  // Explore button in empty state
  const exploreBtn = document.getElementById('explore-pets-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      state.setCurrentTab('mating');
    });
  }

  // Conversation card click
  const conversationCards = document.querySelectorAll<HTMLElement>('.conversation-item-card');
  conversationCards.forEach((card) => {
    card.addEventListener('click', () => {
      const convId = card.getAttribute('data-conversation-id');
      if (convId) {
        state.setActiveConversationId(convId);
      }
    });
  });

  // Back button in chat room
  const backBtn = document.getElementById('back-to-chats-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (currentlyPlayingAudio) {
        currentlyPlayingAudio.pause();
        currentlyPlayingAudio = null;
      }
      state.setActiveConversationId(null);
    });
  }

  // --- WHATSAPP-LIKE TOOLS: Text, File Picker, Voice Notes ---
  const input = document.getElementById('chat-message-input') as HTMLInputElement;
  const actionBtn = document.getElementById('chat-action-btn');
  const actionIcon = document.getElementById('chat-action-icon');
  const filePicker = document.getElementById('chat-file-picker') as HTMLInputElement;
  const attachmentBtn = document.getElementById('chat-attachment-btn');
  const recordingUiBar = document.getElementById('recording-ui-bar');
  const recordingTimerDisplay = document.getElementById('recording-live-timer');
  const cancelRecBtn = document.getElementById('cancel-recording-btn');
  const sendRecBtn = document.getElementById('send-recording-btn');
  const container = document.getElementById('chat-messages-container');

  // Auto scroll to bottom
  const scrollToBottom = () => {
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };
  scrollToBottom();

  // Scroll into view on input focus (Keyboard behavior)
  if (input) {
    input.addEventListener('focus', () => {
      setTimeout(scrollToBottom, 250);
    });

    // Toggle between Mic and Paperplane send icon
    input.addEventListener('input', () => {
      if (!actionIcon) return;
      if (input.value.trim().length > 0) {
        actionIcon.className = 'fa-solid fa-paper-plane text-xs';
        actionBtn?.setAttribute('title', 'إرسال');
      } else {
        actionIcon.className = 'fa-solid fa-microphone text-sm';
        actionBtn?.setAttribute('title', 'تسجيل صوتي');
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    });
  }

  // Send action or Start Audio Recording
  const handleSend = () => {
    if (input && input.value.trim()) {
      state.sendMessage(input.value.trim());
      input.value = '';
      if (actionIcon) actionIcon.className = 'fa-solid fa-microphone text-sm';
      setTimeout(scrollToBottom, 100);
    }
  };

  if (actionBtn) {
    actionBtn.addEventListener('click', () => {
      if (input && input.value.trim().length > 0) {
        handleSend();
      } else {
        // Start voice recording!
        startAudioRecording();
      }
    });
  }

  // File Attachment click
  if (attachmentBtn && filePicker) {
    attachmentBtn.addEventListener('click', () => {
      filePicker.click();
    });

    filePicker.addEventListener('change', () => {
      const file = filePicker.files?.[0];
      if (!file) return;

      const isImage = file.type.startsWith('image/');
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (isImage) {
          state.sendMessage({
            type: 'image',
            fileUrl: result,
            fileName: file.name,
            fileSize: `${(file.size / 1024).toFixed(0)} KB`,
          });
        } else {
          state.sendMessage({
            type: 'file',
            fileUrl: result,
            fileName: file.name,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          });
        }
        filePicker.value = '';
        setTimeout(scrollToBottom, 100);
      };

      reader.readAsDataURL(file);
    });
  }

  // Interactive Custom Stickers Drawer Toggle, Creation & Selection
  const stickersBtn = document.getElementById('chat-stickers-btn');
  const stickersDrawer = document.getElementById('chat-stickers-drawer');
  const closeStickersBtn = document.getElementById('close-stickers-btn');
  const createStickerTile = document.getElementById('create-sticker-tile');
  const addStickerPackBtn = document.getElementById('add-sticker-pack-btn');
  const stickerUploadInput = document.getElementById('sticker-upload-input') as HTMLInputElement;

  if (stickersBtn && stickersDrawer) {
    stickersBtn.addEventListener('click', () => {
      isStickersOpen = !isStickersOpen;
      if (isStickersOpen) {
        stickersDrawer.classList.remove('hidden');
        stickersDrawer.classList.add('flex');
        stickersBtn.classList.add('border-brand-orange', 'text-brand-orange', 'bg-brand-orange/15', 'shadow-soft');
        stickersBtn.classList.remove('text-warm-textSec');
      } else {
        stickersDrawer.classList.remove('flex');
        stickersDrawer.classList.add('hidden');
        stickersBtn.classList.remove('border-brand-orange', 'text-brand-orange', 'bg-brand-orange/15', 'shadow-soft');
        stickersBtn.classList.add('text-warm-textSec');
      }
      setTimeout(scrollToBottom, 150);
    });
  }

  if (closeStickersBtn && stickersDrawer && stickersBtn) {
    closeStickersBtn.addEventListener('click', () => {
      isStickersOpen = false;
      stickersDrawer.classList.remove('flex');
      stickersDrawer.classList.add('hidden');
      stickersBtn.classList.remove('border-brand-orange', 'text-brand-orange', 'bg-brand-orange/15', 'shadow-soft');
      stickersBtn.classList.add('text-warm-textSec');
    });
  }

  // Create Sticker File Picker Trigger (Both from the First Grid Tile & Bottom Add Button)
  const triggerStickerPicker = () => {
    if (stickerUploadInput) {
      stickerUploadInput.click();
    }
  };

  if (createStickerTile) {
    createStickerTile.addEventListener('click', triggerStickerPicker);
  }
  if (addStickerPackBtn) {
    addStickerPackBtn.addEventListener('click', triggerStickerPicker);
  }

  if (stickerUploadInput) {
    stickerUploadInput.addEventListener('change', () => {
      const file = stickerUploadInput.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        if (dataUrl) {
          saveCustomSticker(dataUrl, file.name.replace(/\.[^/.]+$/, ''));
          // Keep sticker drawer open so user can immediately see and use their new sticker
          isStickersOpen = true;
          const activeId = state.getActiveConversation()?.id;
          if (activeId) {
            state.setActiveConversationId(activeId);
          }
        }
      };
      reader.readAsDataURL(file);
      stickerUploadInput.value = '';
    });
  }

  // Send Custom Sticker
  const customStickerSendBtns = document.querySelectorAll<HTMLButtonElement>('.custom-sticker-send-btn');
  customStickerSendBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const stickerUrl = btn.getAttribute('data-sticker-url') || '';
      const stickerTitle = btn.getAttribute('data-sticker-title') || 'استيكر مخصص';

      state.sendMessage({
        type: 'sticker',
        stickerUrl,
        stickerTitle,
      });

      // Close drawer after selection
      isStickersOpen = false;
      if (stickersDrawer) {
        stickersDrawer.classList.remove('flex');
        stickersDrawer.classList.add('hidden');
      }
      if (stickersBtn) {
        stickersBtn.classList.remove('border-brand-orange', 'text-brand-orange', 'bg-brand-orange/15', 'shadow-soft');
        stickersBtn.classList.add('text-warm-textSec');
      }

      setTimeout(scrollToBottom, 120);
    });
  });

  // Delete Custom Sticker
  const deleteStickerBtns = document.querySelectorAll<HTMLButtonElement>('.delete-custom-sticker-btn');
  deleteStickerBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-sticker-id');
      if (id) {
        deleteCustomSticker(id);
        isStickersOpen = true;
        const activeId = state.getActiveConversation()?.id;
        if (activeId) {
          state.setActiveConversationId(activeId);
        }
      }
    });
  });

  // Start real Audio Recording via MediaRecorder
  const startAudioRecording = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert('المتصفح لا يدعم تسجيل الصوت المباشر.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunks = [];
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.start();
      isRecordingAudio = true;
      recordingSeconds = 0;

      if (recordingUiBar) recordingUiBar.classList.remove('hidden');
      if (recordingUiBar) recordingUiBar.classList.add('flex');

      recordingTimer = setInterval(() => {
        recordingSeconds++;
        const mins = Math.floor(recordingSeconds / 60)
          .toString()
          .padStart(2, '0');
        const secs = (recordingSeconds % 60).toString().padStart(2, '0');
        if (recordingTimerDisplay) {
          recordingTimerDisplay.innerText = `${mins}:${secs}`;
        }
      }, 1000);
    } catch (err) {
      console.warn('Microphone permission denied or not available:', err);
      // Fallback simulated voice note
      sendFallbackVoiceNote();
    }
  };

  const stopRecordingUI = () => {
    if (recordingTimer) clearInterval(recordingTimer);
    isRecordingAudio = false;
    if (recordingUiBar) {
      recordingUiBar.classList.remove('flex');
      recordingUiBar.classList.add('hidden');
    }
  };

  const sendFallbackVoiceNote = () => {
    state.sendMessage({
      type: 'audio',
      audioDuration: 8,
      audioBlobUrl: '',
    });
    setTimeout(scrollToBottom, 100);
  };

  // Cancel Audio Recording
  if (cancelRecBtn) {
    cancelRecBtn.addEventListener('click', () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach((t) => t.stop());
      }
      stopRecordingUI();
    });
  }

  // Send Recorded Audio
  if (sendRecBtn) {
    sendRecBtn.addEventListener('click', () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const duration = Math.max(1, recordingSeconds);

          state.sendMessage({
            type: 'audio',
            audioDuration: duration,
            audioBlobUrl: audioUrl,
          });

          mediaRecorder?.stream.getTracks().forEach((t) => t.stop());
          setTimeout(scrollToBottom, 100);
        };
        mediaRecorder.stop();
      } else {
        sendFallbackVoiceNote();
      }
      stopRecordingUI();
    });
  }

  // Audio Playback in Chat Bubbles
  const playAudioBtns = document.querySelectorAll<HTMLButtonElement>('.play-audio-msg-btn');
  playAudioBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const msgId = btn.getAttribute('data-msg-id');
      const audioUrl = btn.getAttribute('data-audio-url');

      if (currentlyPlayingAudio && currentPlayingMsgId === msgId) {
        // Pause current
        currentlyPlayingAudio.pause();
        currentlyPlayingAudio = null;
        currentPlayingMsgId = null;
        btn.innerHTML = '<i class="fa-solid fa-play text-sm ml-0.5"></i>';
        return;
      }

      if (currentlyPlayingAudio) {
        currentlyPlayingAudio.pause();
        const prevBtn = document.querySelector(`[data-msg-id="${currentPlayingMsgId}"] .play-audio-msg-btn`);
        if (prevBtn) prevBtn.innerHTML = '<i class="fa-solid fa-play text-sm ml-0.5"></i>';
      }

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        currentlyPlayingAudio = audio;
        currentPlayingMsgId = msgId;
        btn.innerHTML = '<i class="fa-solid fa-pause text-sm"></i>';

        audio.play();
        audio.onended = () => {
          btn.innerHTML = '<i class="fa-solid fa-play text-sm ml-0.5"></i>';
          currentlyPlayingAudio = null;
          currentPlayingMsgId = null;
        };
      } else {
        // Beep simulation tone
        btn.innerHTML = '<i class="fa-solid fa-pause text-sm"></i>';
        setTimeout(() => {
          btn.innerHTML = '<i class="fa-solid fa-play text-sm ml-0.5"></i>';
        }, 3000);
      }
    });
  });

  // Approve request
  const approveBtns = document.querySelectorAll<HTMLButtonElement>('.approve-request-btn');
  approveBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const reqId = btn.getAttribute('data-approve-request-id');
      if (reqId) {
        state.approveContactRequest(reqId);
      }
    });
  });

  // Reject request
  const rejectBtns = document.querySelectorAll<HTMLButtonElement>('.reject-request-btn');
  rejectBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const reqId = btn.getAttribute('data-reject-request-id');
      if (reqId) {
        state.rejectContactRequest(reqId);
      }
    });
  });

  // Direct to conversation
  const directBtn = document.getElementById('view-conversation-direct-btn');
  if (directBtn) {
    directBtn.addEventListener('click', () => {
      activeSubTab = 'chats';
      state.setActiveConversationId(state.getConversations()[0]?.id || null);
    });
  }
}
