import { state } from '../../state.ts';
import type { ChatMessage, ChatMessageReply, Conversation } from '../../types.ts';
import { attachThreeDotsMenuEvents, renderThreeDotsMenu } from '../components/BlockMenu.ts';
import {
  formatPetAgeFull,
  formatPetSpeciesShort,
  formatVaccinationStatus,
} from '../../utils/petFormatters.ts';
import {
  SAFE_FALLBACK_AVATAR_SVG,
  SAFE_FALLBACK_PET_SVG,
  escapeAttr,
  escapeHtml,
  sanitizeAudioSrc,
  sanitizeImageSrc,
  sanitizeTelUrl,
  sanitizeUrl,
  validateUploadedFile,
} from '../../utils/sanitize.ts';
import {
  attachLongPress,
  attachPullToRefresh,
  attachSheetDragToDismiss,
  showMobileToast,
} from '../../utils/touchGestures.ts';

let chatCategoryFilter: 'all' | 'mating' | 'adoption' | 'clinics' = 'all';
let requestsDirectionFilter: 'incoming' | 'outgoing' = 'incoming';
let isStickersOpen = false;
let isGroupDetailsExpanded = false;
let lastRenderedChatRoomId: string | null = null;
let previewChatImageUrl: string | null = null;
let previewChatImageMsgId: string | null = null;
let pendingChatAttachment: {
  type: 'image' | 'file';
  fileUrl: string;
  fileName: string;
  fileSize: string;
  pendingFile?: File;
  caption?: string;
  errorMessage?: string;
  isSending?: boolean;
} | null = null;
let isStickerSearchOpen = false;
let stickerSearchQuery = '';
let activeStickerTab: 'all' | 'recent' | 'favorites' | 'custom' = 'all';
let activeReplyTarget: ChatMessageReply | null = null;
let inRoomSearchOpen = false;
let inRoomSearchQuery = '';
let firstUnreadMsgId: string | null = null;
let userIsNearBottom = true;
let justSentMessageFlag = false;
const knownConvMsgCountMap = new Map<string, number>();

// Calm scattered pattern: cat paws, dog paws, pet toys (yarn ball, bone, mouse), and supplies (food bowl, collar bell)
const ASYMMETRIC_PAW_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="320" viewBox="0 0 320 320">
    <!-- آثار أقدام قطط هادئة -->
    <g fill="#E67E22" fill-opacity="0.10">
      <g transform="translate(26,24) rotate(-20) scale(0.8)">
        <circle cx="7" cy="8.5" r="2"/><circle cx="11" cy="6.5" r="2"/><circle cx="15" cy="7.5" r="2"/><circle cx="18" cy="10.5" r="1.8"/>
        <path d="M13 11c-2.6 0-4.6 1.8-4.6 4.2 0 2 1.8 3.3 4.2 3.3s4.2-1.3 4.2-3.3c0-2.4-1.2-4.2-3.8-4.2z"/>
      </g>
      <g transform="translate(238,166) rotate(28) scale(0.76)">
        <circle cx="7" cy="8.5" r="2"/><circle cx="11" cy="6.5" r="2"/><circle cx="15" cy="7.5" r="2"/><circle cx="18" cy="10.5" r="1.8"/>
        <path d="M13 11c-2.6 0-4.6 1.8-4.6 4.2 0 2 1.8 3.3 4.2 3.3s4.2-1.3 4.2-3.3c0-2.4-1.2-4.2-3.8-4.2z"/>
      </g>
    </g>

    <!-- آثار أقدام كلاب مبعثرة -->
    <g fill="#B46934" fill-opacity="0.095">
      <g transform="translate(182,24) rotate(24) scale(0.95)">
        <ellipse cx="6.5" cy="8" rx="2.1" ry="2.6"/><ellipse cx="11.5" cy="5.5" rx="2.1" ry="2.7"/><ellipse cx="16.8" cy="6.5" rx="2.1" ry="2.6"/><ellipse cx="20.5" cy="10.5" rx="1.9" ry="2.4"/>
        <path d="M13.5 11.5c-3.4 0-5.8 2.4-5.8 5.1 0 2.4 2.4 3.9 5.8 3.9s5.8-1.5 5.8-3.9c0-2.7-2.4-5.1-5.8-5.1z"/>
      </g>
      <g transform="translate(42,216) rotate(-32) scale(0.9)">
        <ellipse cx="6.5" cy="8" rx="2.1" ry="2.6"/><ellipse cx="11.5" cy="5.5" rx="2.1" ry="2.7"/><ellipse cx="16.8" cy="6.5" rx="2.1" ry="2.6"/><ellipse cx="20.5" cy="10.5" rx="1.9" ry="2.4"/>
        <path d="M13.5 11.5c-3.4 0-5.8 2.4-5.8 5.1 0 2.4 2.4 3.9 5.8 3.9s5.8-1.5 5.8-3.9c0-2.7-2.4-5.1-5.8-5.1z"/>
      </g>
    </g>

    <!-- عظمة لعبة -->
    <g transform="translate(116,74) rotate(-18)" fill="#E67E22" fill-opacity="0.10">
      <circle cx="4" cy="5" r="3.4"/><circle cx="4" cy="11" r="3.4"/>
      <circle cx="26" cy="5" r="3.4"/><circle cx="26" cy="11" r="3.4"/>
      <rect x="4" y="5.5" width="22" height="5" rx="2"/>
    </g>

    <!-- كرة خيط صوف -->
    <g transform="translate(262,64) rotate(12)" stroke="#B46934" stroke-opacity="0.11" stroke-width="1.6" fill="none" stroke-linecap="round">
      <circle cx="14" cy="14" r="11"/>
      <path d="M6 10c5-2 11-1 16 4M4 16c6-1 13 1 18 5M9 23c4-4 9-9 13-15M24 21c3 2 5 1 7-1"/>
    </g>

    <!-- طبق طعام ومستلزمات -->
    <g transform="translate(138,176) rotate(-8)" fill="#E67E22" fill-opacity="0.10">
      <path d="M5 12c0-2 3-3 11-3s11 1 11 3l3 8c.4 1.2-.5 2-2 2H4c-1.5 0-2.4-.8-2-2l3-8z"/>
      <ellipse cx="16" cy="10.5" rx="8.5" ry="2.1" fill="#B46934" fill-opacity="0.095"/>
    </g>

    <!-- فأرة لعبة للقطط -->
    <g transform="translate(206,258) rotate(-25)" fill="#B46934" fill-opacity="0.10" stroke="#B46934" stroke-opacity="0.10" stroke-width="1.4" stroke-linecap="round">
      <ellipse cx="14" cy="14" rx="9" ry="5.5"/>
      <circle cx="9" cy="8.5" r="2.6"/><circle cx="13" cy="8.2" r="2.3"/>
      <path d="M23 14c4 0 6-3 8-2" fill="none"/>
    </g>

    <!-- جرس طوق -->
    <g transform="translate(96,264) rotate(14)" stroke="#E67E22" stroke-opacity="0.11" stroke-width="1.6" fill="#E67E22" fill-opacity="0.085">
      <circle cx="12" cy="13" r="8"/>
      <circle cx="12" cy="4" r="2.2" fill="none"/>
      <path d="M7 14h10" fill="none"/>
      <circle cx="12" cy="17" r="1.4"/>
    </g>
  </svg>`
);
const CHAT_PAW_BACKDROP_STYLE = `background-image: url("data:image/svg+xml,${ASYMMETRIC_PAW_SVG}"); background-size: 320px 320px; background-repeat: repeat;`;

// Audio recording state
let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let activeRecorderMimeType = 'audio/webm';
let isRecordingAudio = false;
let recordingSeconds = 0;
let recordingTimer: ReturnType<typeof setInterval> | null = null;
let currentlyPlayingAudio: HTMLAudioElement | null = null;
let currentPlayingMsgId: string | null = null;

function getFilteredChatConversations(): ReturnType<typeof state.getConversations> {
  const conversations = state.getConversations();
  return conversations.filter((c) => {
    if (chatCategoryFilter === 'mating') return c.petType === 'mating';
    if (chatCategoryFilter === 'adoption') return c.petType === 'adoption';
    return true;
  });
}

function renderChatCategoryPillsHtml(conversationsCount: number): string {
  const isClinics = chatCategoryFilter === 'clinics';
  return `
    <div id="chat-category-pills-container" class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1" data-no-ptr="true">
      <!-- 1. الكل -->
      <button
        data-chat-filter="all"
        type="button"
        class="chat-category-btn h-10 px-4 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap font-baloo shadow-sm ${
          chatCategoryFilter === 'all'
            ? 'bg-brand-orange text-white shadow-soft ring-2 ring-brand-orange/30'
            : 'bg-white dark:bg-[#27201B] border-2 border-brand-peachBorder dark:border-warm-darkBorder text-warm-textSec dark:text-[#D1C7BD] hover:bg-brand-peachBorder/20'
        }"
      >
        الكل (${conversationsCount})
      </button>

      <!-- 2. التزاوج -->
      <button
        data-chat-filter="mating"
        type="button"
        class="chat-category-btn h-10 px-4 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap font-baloo shadow-sm ${
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
        class="chat-category-btn h-10 px-4 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap font-baloo shadow-sm ${
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
          class="chat-category-btn h-10 px-4 rounded-full text-xs font-black transition-all cursor-pointer whitespace-nowrap font-baloo flex items-center gap-1.5 shadow-sm border-2 ${
            isClinics
              ? 'bg-brand-orange text-white shadow-soft ring-2 ring-brand-orange/30 border-brand-orange'
              : 'bg-white dark:bg-[#27201B] border-brand-peachBorder dark:border-warm-darkBorder text-warm-textSec dark:text-[#D1C7BD] opacity-85 hover:opacity-100'
          }"
        >
          <i class="fa-solid fa-house-medical text-xs ${isClinics ? 'text-white' : 'text-brand-orange'}"></i>
          <span>العيادات</span>
          <span class="text-[10px] font-black px-1.5 py-0.5 rounded-full border ${
            isClinics
              ? 'bg-white/20 text-white border-white/30'
              : 'bg-brand-cream dark:bg-[#342A24] text-brand-orange border-brand-peachBorder/80 dark:border-warm-darkBorder'
          }">
            قريباً
          </span>
        </button>
      </div>
    </div>
  `;
}

function renderChatSubTabSwitcherHtml(
  activeSubTab: 'chats' | 'requests',
  filteredConversationsCount: number,
  incomingPendingCount: number,
  totalRequestsCount: number
): string {
  return `
    <div id="chat-subtab-switcher" class="relative grid grid-cols-2 items-center bg-white/90 dark:bg-[#27201B] border-2 border-brand-peachBorder/80 dark:border-warm-darkBorder rounded-full p-1 shadow-sm">
      <div
        id="chat-subtab-pill"
        aria-hidden="true"
        class="pointer-events-none absolute top-1 bottom-1 w-[calc(50%-0.25rem)] rounded-full bg-brand-orange shadow-soft transition-all duration-200 ease-out"
        style="right: ${activeSubTab === 'chats' ? '0.25rem' : 'calc(50%)'};"
      ></div>

      <button
        id="subtab-chats-btn"
        type="button"
        class="relative z-10 h-10 px-3.5 rounded-full text-xs sm:text-sm font-black transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer font-baloo ${
          activeSubTab === 'chats'
            ? 'text-white'
            : 'text-brand-dark/70 dark:text-[#D1C7BD] hover:text-brand-orange'
        }"
      >
        <span>المحادثات</span>
        <span id="subtab-chats-badge" class="px-2 py-0.5 rounded-full text-[11px] transition-colors ${
          activeSubTab === 'chats'
            ? 'bg-white text-brand-orange font-black'
            : 'bg-brand-peachBorder/40 dark:bg-[#342A24] text-brand-dark dark:text-white'
        }">${filteredConversationsCount}</span>
      </button>

      <button
        id="subtab-requests-btn"
        type="button"
        class="relative z-10 h-10 px-3.5 rounded-full text-xs sm:text-sm font-black transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer font-baloo ${
          activeSubTab === 'requests'
            ? 'text-white'
            : 'text-brand-dark/70 dark:text-[#D1C7BD] hover:text-brand-orange'
        }"
      >
        <span>طلبات التواصل</span>
        <span id="subtab-requests-badge" class="px-2 py-0.5 rounded-full text-[11px] transition-colors ${
          incomingPendingCount > 0
            ? 'bg-red-500 text-white font-black animate-pulse'
            : activeSubTab === 'requests'
              ? 'bg-white text-brand-orange font-black'
              : 'bg-brand-peachBorder/40 dark:bg-[#342A24] text-brand-dark dark:text-white'
        }">${incomingPendingCount > 0 ? incomingPendingCount : totalRequestsCount}</span>
      </button>
    </div>
  `;
}

function renderChatListBodyHtml(
  filteredConversations: ReturnType<typeof state.getConversations>,
  incomingRequests: ReturnType<typeof state.getIncomingContactRequests>,
  outgoingRequests: ReturnType<typeof state.getOutgoingContactRequests>,
  activeSubTab: 'chats' | 'requests'
): string {
  if (chatCategoryFilter === 'clinics') {
    return `
      <div class="bg-white/80 dark:bg-[#27201B]/80 border border-brand-peachBorder dark:border-warm-darkBorder rounded-3xl p-6 text-center space-y-3 shadow-card meow-card-enter" dir="rtl">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-orange/20 to-brand-peachBorder/40 dark:from-brand-orange/30 dark:to-warm-darkBorder text-brand-orange flex items-center justify-center mx-auto text-2xl border-2 border-brand-peachBorder/80 dark:border-warm-darkBorder shadow-soft relative">
          <i class="fa-solid fa-house-medical text-2xl text-brand-orange drop-shadow-sm"></i>
          <span class="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-[#342A24] border border-brand-peachBorder dark:border-warm-darkBorder rounded-full flex items-center justify-center text-brand-orange text-[11px] shadow-sm">
            <i class="fa-solid fa-stethoscope"></i>
          </span>
        </div>
        <h3 class="text-lg font-black font-baloo text-warm-text dark:text-white">محادثات العيادات البيطرية</h3>
        <p class="text-xs sm:text-sm font-bold text-warm-textSec dark:text-[#D1C7BD] max-w-xs mx-auto leading-relaxed">
          هذا القسم سيكون متاحاً قريباً للتواصل المباشر مع الأطباء البيطريين وحجز الاستشارات والمواعيد.
        </p>
        <span class="inline-block text-xs font-black px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/60">
          قريباً في التحديث القادم
        </span>
      </div>
    `;
  }

  return activeSubTab === 'chats'
    ? renderConversationsList(filteredConversations)
    : renderRequestsList(incomingRequests, outgoingRequests);
}

export function renderChatView(): string {
  const incomingRequests = state.getIncomingContactRequests();
  const outgoingRequests = state.getOutgoingContactRequests();
  const incomingPendingCount = state.getPendingRequestsCount();
  const totalRequestsCount = incomingRequests.length + outgoingRequests.length;
  const conversations = state.getConversations();
  const activeConversation = state.getActiveConversation();
  const activeSubTab = state.getChatSubTab();

  // If there's an active conversation, show WhatsApp-like chat room
  if (activeConversation) {
    return renderChatRoom(activeConversation);
  }

  const filteredConversations = getFilteredChatConversations();

  return `
    <div id="chat-list-view-root" class="w-full max-w-md mx-auto px-3.5 sm:px-4 pt-3 pb-6 flex-1 min-w-0">

      <!-- Categories & Filters Order (1. الكل, 2. التزاوج, 3. التبني, 4. العيادات) -->
      <div class="mb-3.5 flex flex-col gap-2.5">
        ${renderChatCategoryPillsHtml(conversations.length)}

        <!-- Switcher Between Active Chats & Contact Requests -->
        ${renderChatSubTabSwitcherHtml(
          activeSubTab,
          filteredConversations.length,
          incomingPendingCount,
          totalRequestsCount
        )}
      </div>

      <!-- Content -->
      <div id="chat-tab-content">
        ${renderChatListBodyHtml(filteredConversations, incomingRequests, outgoingRequests, activeSubTab)}
      </div>

    </div>
  `;
}

function renderConversationsList(conversations: ReturnType<typeof state.getConversations>): string {
  if (conversations.length === 0) {
    return `
      <div class="relative flex flex-col items-center justify-center text-center px-4 py-7 overflow-hidden bg-white/75 dark:bg-[#27201B]/80 border border-brand-peachBorder dark:border-warm-darkBorder rounded-3xl shadow-card meow-card-enter" data-purpose="empty-messages-state">
        <div class="relative mb-4">
          <div class="w-20 h-20 rounded-full bg-gradient-to-tr from-brand-orange/20 to-brand-peachBorder/40 dark:to-warm-darkBorder flex items-center justify-center relative">
            <div class="w-14 h-14 rounded-full bg-white dark:bg-[#342A24] flex items-center justify-center shadow-soft border-2 border-brand-peachBorder/60 dark:border-warm-darkBorder">
              <i class="fa-solid fa-comments text-2xl text-brand-orange"></i>
            </div>
            <span class="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-[#342A24] border-2 border-brand-peachBorder dark:border-warm-darkBorder rounded-full flex items-center justify-center text-brand-orange text-xs shadow-sm">
              <i class="fa-solid fa-paw"></i>
            </span>
          </div>
        </div>

        <h2 class="text-lg sm:text-xl font-black text-brand-dark dark:text-white mb-1.5 tracking-tight font-baloo">لا توجد رسائل حتى الآن</h2>
        <p class="text-xs sm:text-sm font-semibold text-brand-subtleGray dark:text-[#A89F91] max-w-xs leading-relaxed mb-5">
          ابدأ المحادثة مع أصحاب الحيوانات الأليفة للتبني أو التزاوج وشارك حبك للمياو!
        </p>

        <button
          type="button"
          id="explore-pets-btn"
          class="h-11 px-6 rounded-full bg-brand-orange text-white font-black text-sm shadow-soft hover:bg-brand-orangeHover transition-all flex items-center gap-2 cursor-pointer font-baloo active:scale-95"
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
          const resolvedPet = state.getPetForConversation(conv);
          const isGroupConv =
            conv.adoptionType === 'group' || resolvedPet?.adoptionType === 'group';
          const groupMembers =
            conv.groupMembers && conv.groupMembers.length > 0
              ? conv.groupMembers
              : resolvedPet?.groupMembers || [];
          const groupCount =
            conv.groupCount || resolvedPet?.groupCount || groupMembers.length || 2;
          const mustAdoptTogether =
            conv.mustAdoptTogether ?? resolvedPet?.mustAdoptTogether;
          const memberNames = groupMembers.map((m) => m.name).filter(Boolean);
          const groupThumbs = groupMembers
            .map((m) => m.individualPhotos?.[0] || '')
            .filter(Boolean)
            .slice(0, 4);
          const groupLocation =
            conv.petLocation ||
            (resolvedPet
              ? resolvedPet.area && resolvedPet.area !== resolvedPet.city
                ? `${resolvedPet.area}، ${resolvedPet.city}`
                : resolvedPet.city || resolvedPet.governorate
              : '');

          return `
            <div
              data-conversation-id="${escapeAttr(conv.id)}"
              class="conversation-item-card meow-card-enter ${
                conv.isPinned
                  ? 'bg-[#FFFDF7] dark:bg-[#2F251E] border-2 border-brand-orange/70 shadow-sm'
                  : 'bg-white/90 dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder shadow-sm'
              } rounded-3xl p-3.5 flex items-center justify-between gap-3.5 cursor-pointer hover:border-brand-orange/80 transition-all duration-200 group active:scale-[0.99]"
            >
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <div class="relative flex-shrink-0">
                  <img
                    src="${escapeAttr(sanitizeImageSrc(conv.otherUserAvatar, SAFE_FALLBACK_AVATAR_SVG))}"
                    alt="${escapeAttr(conv.otherUserName)}"
                    referrerpolicy="no-referrer"
                    onerror="this.onerror=null;this.src='${escapeAttr(SAFE_FALLBACK_AVATAR_SVG)}';"
                    class="w-12 h-12 rounded-2xl object-cover border-2 border-brand-peachBorder dark:border-warm-darkBorder group-hover:border-brand-orange transition"
                  />
                  <img
                    src="${escapeAttr(sanitizeImageSrc((isGroupConv && groupThumbs[0]) || conv.petPhoto, SAFE_FALLBACK_PET_SVG))}"
                    alt="${escapeAttr(conv.petName)}"
                    onerror="this.onerror=null;this.src='${escapeAttr(SAFE_FALLBACK_PET_SVG)}';"
                    class="w-5 h-5 rounded-full object-cover border-2 border-white dark:border-[#27201B] absolute -bottom-1 -right-1 shadow-sm"
                  />
                </div>

                <div class="flex-1 min-w-0 text-right">
                  <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-1.5 min-w-0">
                      ${
                        conv.isPinned
                          ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-orange/15 text-brand-orange text-[10px] font-black shrink-0 font-baloo" title="محادثة مثبتة"><i class="fa-solid fa-thumbtack text-[9px]"></i> مثبتة</span>`
                          : ''
                      }
                      ${
                        conv.isMuted
                          ? `<span class="inline-flex items-center text-brand-subtleGray dark:text-[#A89F91] text-[10px] shrink-0" title="الإشعارات مكتومة"><i class="fa-solid fa-bell-slash"></i></span>`
                          : ''
                      }
                      <h4 class="text-sm font-black text-brand-dark dark:text-white group-hover:text-brand-orange transition truncate font-baloo m-0">${escapeHtml(conv.otherUserName)}</h4>
                    </div>
                    <span class="text-[10px] text-brand-subtleGray dark:text-[#A89F91] font-bold whitespace-nowrap">${escapeHtml(conv.lastMessageTime)}</span>
                  </div>

                  <div class="text-[11px] font-bold text-brand-orange mt-0.5 truncate font-baloo">
                    بخصوص: ${escapeHtml(conv.petName)} (${conv.petType === 'mating' ? 'تزاوج' : isGroupConv ? `تبني جماعي • ${groupCount} حيوانات` : 'تبني'})
                  </div>

                  ${
                    isGroupConv
                      ? `
                      <div class="mt-1 px-3 py-2 rounded-2xl bg-[#fff5ea]/90 border border-brand-orange/30 text-[10px] font-bold text-brand-dark space-y-1">
                        <div class="flex items-center justify-between gap-1.5">
                          <span class="truncate">
                            🐾 ${memberNames.length > 0 ? escapeHtml(memberNames.join('، ')) : `${groupCount} حيوانات`}
                          </span>
                          <span class="shrink-0 font-black ${mustAdoptTogether ? 'text-brand-orange' : 'text-emerald-700'}">
                            ${mustAdoptTogether ? 'معاً فقط' : 'معاً أو منفرد'}
                          </span>
                        </div>
                        ${
                          groupThumbs.length > 0 || groupLocation
                            ? `
                              <div class="flex items-center justify-between gap-1.5">
                                ${
                                  groupThumbs.length > 0
                                    ? `
                                      <div class="flex items-center gap-1">
                                        ${groupThumbs
                                          .map(
                                            (thumb) => `
                                              <img src="${escapeAttr(sanitizeImageSrc(thumb, SAFE_FALLBACK_PET_SVG))}" alt="حيوان في المجموعة" class="w-4 h-4 rounded-md object-cover border border-brand-peachBorder" />
                                            `
                                          )
                                          .join('')}
                                      </div>
                                    `
                                    : ''
                                }
                                ${
                                  groupLocation
                                    ? `<span class="text-[9px] font-bold text-brand-subtleGray truncate">${escapeHtml(groupLocation)}</span>`
                                    : ''
                                }
                              </div>
                            `
                            : ''
                        }
                      </div>
                      `
                      : ''
                  }

                  <p class="text-xs font-semibold text-brand-subtleGray dark:text-[#A89F91] truncate mt-0.5 mb-0">
                    ${escapeHtml(conv.lastMessage)}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-1.5 flex-shrink-0">
                ${
                  conv.unreadCount > 0
                    ? `<span class="w-5 h-5 rounded-full bg-brand-orange text-white text-[10px] font-black flex items-center justify-center shadow-soft">${conv.unreadCount}</span>`
                    : ''
                }
                ${renderThreeDotsMenu({
                  userId: conv.otherUserId,
                  userName: conv.otherUserName,
                  userAvatar: conv.otherUserAvatar,
                  petId: conv.petId,
                  petName: conv.petName,
                  conversationId: conv.id,
                  isPinned: Boolean(conv.isPinned),
                  showPinActions: true,
                  showDeleteConversation: true,
                  reportTargetType: 'chat',
                  buttonClass:
                    'w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-brand-subtleGray hover:text-brand-dark dark:hover:text-white flex items-center justify-center transition cursor-pointer active:scale-90',
                  dropdownAlign: 'left',
                })}
                <i class="fa-solid fa-chevron-left text-xs text-brand-subtleGray group-hover:text-brand-orange transition"></i>
              </div>
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}

function renderRequestsList(
  incomingRequests: ReturnType<typeof state.getIncomingContactRequests>,
  outgoingRequests: ReturnType<typeof state.getOutgoingContactRequests>
): string {
  const incomingPendingCount = incomingRequests.filter(
    (r) => r.status === 'pending' && !r.isWithdrawn
  ).length;
  const activeList =
    requestsDirectionFilter === 'incoming' ? incomingRequests : outgoingRequests;

  const directionSwitcherHtml = `
    <div class="bg-white/90 dark:bg-[#27201B] border border-brand-peachBorder/80 dark:border-warm-darkBorder rounded-2xl p-1 flex items-center gap-1 shadow-sm">
      <button
        type="button"
        data-req-direction="incoming"
        class="req-direction-btn flex-1 h-9 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer font-baloo ${
          requestsDirectionFilter === 'incoming'
            ? 'bg-brand-orange text-white shadow-sm'
            : 'text-brand-dark/75 dark:text-[#D1C7BD] hover:bg-brand-peachBorder/20'
        }"
      >
        <span>الواردة</span>
        <span class="px-1.5 py-0.5 rounded-full text-[10px] ${
          requestsDirectionFilter === 'incoming'
            ? 'bg-white text-brand-orange font-black'
            : incomingPendingCount > 0
              ? 'bg-red-500 text-white font-black'
              : 'bg-brand-peachBorder/40 dark:bg-[#342A24] text-brand-dark dark:text-white'
        }">${incomingRequests.length}</span>
      </button>

      <button
        type="button"
        data-req-direction="outgoing"
        class="req-direction-btn flex-1 h-9 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer font-baloo ${
          requestsDirectionFilter === 'outgoing'
            ? 'bg-brand-orange text-white shadow-sm'
            : 'text-brand-dark/75 dark:text-[#D1C7BD] hover:bg-brand-peachBorder/20'
        }"
      >
        <span>الصادرة</span>
        <span class="px-1.5 py-0.5 rounded-full text-[10px] ${
          requestsDirectionFilter === 'outgoing'
            ? 'bg-white text-brand-orange font-black'
            : 'bg-brand-peachBorder/40 dark:bg-[#342A24] text-brand-dark dark:text-white'
        }">${outgoingRequests.length}</span>
      </button>
    </div>
  `;

  if (activeList.length === 0) {
    return `
      <div class="space-y-3">
        ${directionSwitcherHtml}
        <div class="bg-white/75 dark:bg-[#27201B]/80 border border-brand-peachBorder dark:border-warm-darkBorder rounded-3xl p-6 text-center space-y-2.5 shadow-card meow-card-enter">
          <div class="w-14 h-14 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center mx-auto text-xl border-2 border-brand-peachBorder/60 dark:border-warm-darkBorder">
            <i class="fa-solid ${requestsDirectionFilter === 'incoming' ? 'fa-inbox' : 'fa-paper-plane'}"></i>
          </div>
          <h3 class="text-base sm:text-lg font-black text-brand-dark dark:text-white font-baloo m-0">
            ${
              requestsDirectionFilter === 'incoming'
                ? 'لا توجد طلبات واردة حالياً'
                : 'لم ترسل أي طلبات تواصل بعد'
            }
          </h3>
          <p class="text-xs sm:text-sm font-bold text-brand-subtleGray dark:text-[#A89F91] max-w-xs mx-auto leading-relaxed">
            ${
              requestsDirectionFilter === 'incoming'
                ? 'عندما يبدي أحد أصحاب الحيوانات اهتمامه بحيوانك، ستظهر هنا طلباته للموافقة أو الرفض.'
                : 'الطلبات التي ترسلها للتزاوج أو التبني ستظهر هنا لمتابعة حالتها أو سحبها قبل الموافقة.'
            }
          </p>
        </div>
      </div>
    `;
  }

  const privacy = state.getRequestsPrivacySummary(activeList);
  const privacyNoticeText = !privacy.hasPublicPhoneRequests
    ? 'الخصوصية مفعّلة: أرقام الهواتف مخفية افتراضياً وفق إعدادات الحسابات، ويمكنك التواصل بأمان داخل المحادثة.'
    : !privacy.hasHiddenPhoneRequests
    ? 'حسب إعدادات الخصوصية الحالية: قد يظهر رقم الهاتف لمن فعّل خيار «إظهار رقم الهاتف في الملف الشخصي» داخل الإعدادات.'
    : 'احترام إعدادات الخصوصية: يظهر رقم الهاتف فقط للأطراف التي فعّلت إظهاره في الإعدادات، ويبقى مخفياً للبقية.';

  return `
    <div class="space-y-3">
      ${directionSwitcherHtml}

      <div class="p-3 rounded-2xl bg-brand-orange/10 border border-brand-peachBorder/80 dark:border-warm-darkBorder text-xs font-bold text-brand-dark dark:text-[#EFE6DD] flex items-center gap-2.5 shadow-sm">
        <i class="fa-solid fa-shield-halved text-brand-orange text-sm shrink-0"></i>
        <span>${privacyNoticeText}</span>
      </div>

      ${activeList
        .map((req) => {
          const isWithdrawn = Boolean(req.isWithdrawn);
          const isPending = req.status === 'pending' && !isWithdrawn;
          const isAccepted = req.status === 'accepted';
          const isRejected = req.status === 'rejected' && !isWithdrawn;
          const previewPet = state.getPetForRequestPreview(req);
          const isGroupPet = previewPet?.adoptionType === 'group';
          const isIncoming = req.senderId !== state.getUser().id;
          const displayUserName = isIncoming
            ? req.senderName
            : previewPet?.ownerName || 'صاحب الأليف';
          const displayUserAvatar = isIncoming
            ? req.senderAvatar
            : previewPet?.ownerAvatar || '';
          const menuTargetUserId = isIncoming ? req.senderId : (previewPet?.ownerId || '');
          const menuTargetUserName = isIncoming ? req.senderName : (previewPet?.ownerName || 'صاحب الأليف');
          const menuTargetUserAvatar = isIncoming ? req.senderAvatar : (previewPet?.ownerAvatar || '');
          const reqGroupMembers = isGroupPet ? previewPet?.groupMembers || [] : [];
          const reqGroupCount = previewPet?.groupCount || reqGroupMembers.length || 2;
          const reqThumb = isGroupPet
            ? reqGroupMembers.find((m) => m.individualPhotos?.[0])?.individualPhotos?.[0] || previewPet?.photos[0] || ''
            : previewPet?.photos[0] || '';
          const reqLocation = previewPet?.city || previewPet?.governorate || '';

          return `
            <div class="meow-card-enter bg-white/95 dark:bg-[#27201B] border-2 border-brand-peachBorder dark:border-warm-darkBorder rounded-3xl p-4 shadow-sm space-y-2.5 text-right">
              <div class="flex items-center justify-between gap-2.5">
                <div class="flex items-center gap-2.5 min-w-0">
                  <img
                    src="${escapeAttr(sanitizeImageSrc(displayUserAvatar, SAFE_FALLBACK_AVATAR_SVG))}"
                    alt="${escapeAttr(displayUserName)}"
                    referrerpolicy="no-referrer"
                    onerror="this.onerror=null;this.src='${escapeAttr(SAFE_FALLBACK_AVATAR_SVG)}';"
                    class="w-11 h-11 rounded-full object-cover border-2 border-brand-peachBorder dark:border-warm-darkBorder shadow-sm shrink-0"
                  />
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <h4 class="text-sm sm:text-base font-black text-brand-dark dark:text-white truncate font-baloo m-0">${
                        isIncoming ? escapeHtml(displayUserName) : `إلى: ${escapeHtml(displayUserName)}`
                      }</h4>
                      <span class="text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        req.type === 'mating'
                          ? 'bg-brand-orange/10 text-brand-orange border border-brand-peachBorder dark:border-warm-darkBorder'
                          : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                      }">
                        ${req.type === 'mating' ? 'تزاوج' : 'تبني'}
                      </span>
                    </div>
                    <div class="text-[11px] font-bold text-brand-subtleGray dark:text-[#A89F91] truncate mt-0.5">
                      بخصوص: <strong class="text-brand-dark dark:text-white">${escapeHtml(req.receiverPetName)}</strong> • ${escapeHtml(req.timestamp)}
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-1.5 shrink-0">
                  ${
                    isWithdrawn
                      ? `<span class="text-[11px] font-black px-2.5 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">تم السحب</span>`
                      : isAccepted
                      ? `<span class="text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">تمت الموافقة</span>`
                      : isRejected
                      ? `<span class="text-[11px] font-black px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300">مرفوض</span>`
                      : `<span class="text-[11px] font-black px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">قيد الانتظار</span>`
                  }
                  ${
                    menuTargetUserId && menuTargetUserId !== state.getUser().id
                      ? renderThreeDotsMenu({
                          userId: menuTargetUserId,
                          userName: menuTargetUserName,
                          userAvatar: menuTargetUserAvatar,
                          petId: previewPet?.id || req.senderPetId || req.receiverPetId,
                          petName: previewPet?.name || req.senderPetName || req.receiverPetName,
                          reportTargetType: 'request',
                          buttonClass:
                            'w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-brand-subtleGray hover:text-brand-dark dark:hover:text-white flex items-center justify-center transition cursor-pointer active:scale-90',
                          dropdownAlign: 'left',
                        })
                      : ''
                  }
                </div>
              </div>

              ${
                previewPet
                  ? `
                    <div
                      data-preview-request-id="${escapeAttr(req.id)}"
                      class="preview-request-pet-card p-2.5 rounded-2xl bg-[#FFF9E9]/90 dark:bg-[#342A24]/80 border border-brand-peachBorder/80 dark:border-warm-darkBorder flex items-center justify-between gap-2.5 hover:border-brand-orange/70 transition cursor-pointer"
                    >
                      <div class="flex items-center gap-2.5 min-w-0">
                        <img
                          src="${escapeAttr(sanitizeImageSrc(reqThumb, SAFE_FALLBACK_PET_SVG))}"
                          alt="${escapeAttr(previewPet.name)}"
                          onerror="this.onerror=null;this.src='${escapeAttr(SAFE_FALLBACK_PET_SVG)}';"
                          class="w-10 h-10 rounded-full object-cover border border-brand-peachBorder dark:border-warm-darkBorder shrink-0"
                        />
                        <div class="min-w-0">
                          <div class="flex items-center gap-1.5">
                            <span class="text-xs font-black text-brand-dark dark:text-white font-baloo truncate">${escapeHtml(previewPet.name)}</span>
                            ${
                              isGroupPet
                                ? `<span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-brand-orange text-white shrink-0">جماعي (${reqGroupCount})</span>`
                                : ''
                            }
                          </div>
                          <p class="text-[11px] font-bold text-brand-subtleGray dark:text-[#A89F91] truncate m-0">
                            ${isGroupPet ? (previewPet.mustAdoptTogether ? 'معاً فقط' : 'معاً أو منفرداً') : escapeHtml(previewPet.breed)}${reqLocation ? ` • ${escapeHtml(reqLocation)}` : ''}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        data-preview-request-id="${escapeAttr(req.id)}"
                        class="preview-request-pet-btn h-8 px-3 rounded-full bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder hover:border-brand-orange text-brand-orange text-xs font-black transition cursor-pointer shrink-0 font-baloo active:scale-95"
                      >
                        معاينة
                      </button>
                    </div>
                  `
                  : ''
              }

              <p class="text-xs font-semibold text-brand-dark/90 dark:text-[#EFE6DD] bg-[#FFFDF8] dark:bg-[#1E1713] border border-brand-peachBorder/50 dark:border-warm-darkBorder rounded-2xl px-3.5 py-2.5 m-0 leading-relaxed line-clamp-2">
                "${escapeHtml(req.message)}"
              </p>

              ${
                isIncoming && isPending
                  ? `
                  <div class="flex items-center justify-end gap-2 pt-1">
                    <button
                      data-reject-request-id="${escapeAttr(req.id)}"
                      class="reject-request-btn h-9 px-4 rounded-full bg-white dark:bg-[#342A24] border-2 border-brand-peachBorder dark:border-warm-darkBorder text-brand-dark dark:text-white text-xs font-bold hover:bg-brand-peachBorder/20 transition active:scale-95 cursor-pointer font-baloo"
                      type="button"
                    >
                      رفض
                    </button>
                    <button
                      data-approve-request-id="${escapeAttr(req.id)}"
                      class="approve-request-btn h-9 px-4 rounded-full bg-brand-orange text-white text-xs font-black shadow-soft hover:bg-brand-orangeHover transition active:scale-95 cursor-pointer font-baloo"
                      type="button"
                    >
                      موافقة ومحادثة
                    </button>
                  </div>
                  `
                  : !isIncoming && isPending
                  ? `
                  <div class="flex justify-end pt-1">
                    <button
                      data-withdraw-request-id="${escapeAttr(req.id)}"
                      class="withdraw-request-btn h-9 px-4 rounded-full bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-600 dark:text-red-300 text-xs font-black hover:bg-red-100 transition active:scale-95 cursor-pointer font-baloo"
                      type="button"
                    >
                      سحب الطلب
                    </button>
                  </div>
                  `
                  : isAccepted
                  ? `
                  <div class="flex justify-end pt-1">
                    <button
                      data-request-id="${escapeAttr(req.id)}"
                      data-other-user-id="${escapeAttr(menuTargetUserId)}"
                      class="view-conversation-direct-btn h-9 px-4 rounded-full bg-white dark:bg-[#342A24] border-2 border-brand-orange text-brand-orange text-xs font-black hover:bg-brand-orange/10 transition active:scale-95 cursor-pointer font-baloo"
                      type="button"
                    >
                      فتح المحادثة
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

function formatMessageTextWithLinks(text: string, isUser: boolean): string {
  if (!text) return '';
  const urlRegex = /(https?:\/\/[^\s<>"']+)/gi;
  let result = '';
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = urlRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result += escapeHtml(text.slice(lastIndex, match.index));
    }
    let rawUrl = match[0];
    let trailing = '';
    while (rawUrl.length > 0 && /[.,!?:;)\]]$/.test(rawUrl)) {
      trailing = rawUrl.slice(-1) + trailing;
      rawUrl = rawUrl.slice(0, -1);
    }
    const safeUrl = sanitizeUrl(rawUrl, '');
    if (safeUrl) {
      result += `<a href="${escapeAttr(safeUrl)}" target="_blank" rel="noopener noreferrer" class="underline decoration-dotted break-all ${
        isUser ? 'text-white font-black' : 'text-brand-orange font-black'
      }">${escapeHtml(rawUrl)}</a>${escapeHtml(trailing)}`;
    } else {
      result += escapeHtml(match[0]);
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    result += escapeHtml(text.slice(lastIndex));
  }
  return result;
}

function getMessagePreviewSnippet(msg: ChatMessage): string {
  if (msg.deletedAt) return 'اتمسحت الرسالة دي';
  if (msg.type === 'image') return msg.text ? `📷 ${msg.text}` : '📷 صورة';
  if (msg.type === 'audio') return '🎤 رسالة صوتية';
  if (msg.type === 'sticker') return `🎭 ${msg.stickerTitle || 'ملصق'}`;
  if (msg.type === 'file') return `📎 ${msg.fileName || 'ملف مرفق'}`;
  return (msg.text || '').trim();
}

function isSameSenderGrouped(a: ChatMessage | undefined, b: ChatMessage): boolean {
  if (!a) return false;
  if (a.senderId === 'system' || b.senderId === 'system') return false;
  if (a.isFromUser !== b.isFromUser || a.senderId !== b.senderId) return false;
  if (typeof a.createdAtMs === 'number' && typeof b.createdAtMs === 'number') {
    return Math.abs(b.createdAtMs - a.createdAtMs) <= 120_000;
  }
  return a.timestamp === b.timestamp;
}

function renderChatHeaderSubtitle(
  conv: Conversation,
  isGroupConv: boolean,
  groupCount: number
): string {
  const petTypeLabel =
    conv.petType === 'mating'
      ? 'تزاوج'
      : isGroupConv
        ? `تبني جماعي • ${groupCount} حيوانات`
        : 'تبني';
  return `${escapeHtml(conv.petName)} (${petTypeLabel}) • ${
    conv.isMuted ? 'مكتومة' : 'متصل الآن'
  }`;
}

function renderInRoomSearchBarHtml(conv: Conversation): string {
  const query = inRoomSearchQuery.trim().toLowerCase();
  const hitsCount = query
    ? conv.messages.filter(
        (m) =>
          m.senderId !== 'system' &&
          !m.deletedAt &&
          ((m.text || '').toLowerCase().includes(query) ||
            (m.fileName || '').toLowerCase().includes(query) ||
            (m.stickerTitle || '').toLowerCase().includes(query))
      ).length
    : 0;

  return `
    <div id="chat-inroom-search-bar" class="${
      inRoomSearchOpen ? 'flex' : 'hidden'
    } shrink-0 bg-[#FFFDF8] dark:bg-[#221B17] border-b border-brand-peachBorder/70 dark:border-warm-darkBorder px-3.5 py-2 items-center gap-2 z-25">
      <div class="flex-1 min-w-0 relative flex items-center">
        <i class="fa-solid fa-magnifying-glass text-xs text-brand-subtleGray absolute right-3 pointer-events-none"></i>
        <input
          id="chat-inroom-search-input"
          type="text"
          value="${escapeAttr(inRoomSearchQuery)}"
          placeholder="ابحث جوه المحادثة..."
          class="w-full h-9 pr-8 pl-3 rounded-full bg-white dark:bg-[#1A1512] border border-brand-peachBorder dark:border-warm-darkBorder text-xs font-bold text-brand-dark dark:text-white placeholder-brand-subtleGray font-baloo"
          autocomplete="off"
        />
      </div>
      ${
        query
          ? `<span id="chat-inroom-search-count" class="text-[11px] font-black text-brand-orange px-2 py-1 rounded-full bg-brand-orange/10 shrink-0">${hitsCount}</span>`
          : '<span id="chat-inroom-search-count" class="hidden"></span>'
      }
      <button
        id="chat-inroom-search-close-btn"
        type="button"
        aria-label="إغلاق البحث"
        class="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 text-brand-dark dark:text-white hover:text-brand-orange flex items-center justify-center text-xs cursor-pointer shrink-0"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `;
}

function renderReplyPreviewBarHtml(): string {
  if (!activeReplyTarget) {
    return `<div id="chat-reply-preview-bar" class="hidden"></div>`;
  }
  return `
    <div id="chat-reply-preview-bar" class="pointer-events-auto flex items-center justify-between gap-2.5 bg-[#FFF9E9]/98 dark:bg-[#27201B]/98 backdrop-blur-md border-2 border-brand-peachBorder dark:border-warm-darkBorder border-r-4 border-r-brand-orange rounded-2xl px-3.5 py-2 shadow-sm animate-fade-in">
      <div class="min-w-0 flex-1 text-right">
        <p class="text-[11px] font-black text-brand-orange m-0 truncate font-baloo">
          الرد على ${escapeHtml(activeReplyTarget.senderName || 'رسالة')}
        </p>
        <p class="text-xs font-bold text-brand-dark/80 dark:text-[#D1C7BD] m-0 truncate">
          ${escapeHtml(activeReplyTarget.text || 'رسالة')}
        </p>
      </div>
      <button
        id="chat-cancel-reply-btn"
        type="button"
        aria-label="إلغاء الرد"
        class="w-7 h-7 rounded-full bg-black/5 dark:bg-white/10 text-brand-dark dark:text-white hover:text-red-500 flex items-center justify-center text-xs cursor-pointer shrink-0"
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
  `;
}

function renderChatMessagesListHtml(conv: Conversation): string {
  if (conv.messages.length === 0) {
    return `
      <div class="flex justify-center my-4 select-none">
        <span class="px-4 py-2 rounded-2xl bg-white/90 dark:bg-[#27201B]/90 border border-brand-peachBorder/70 dark:border-warm-darkBorder text-xs font-bold text-brand-subtleGray dark:text-[#D1C7BD] text-center shadow-xs font-baloo">
          ابدأ الكلام دلوقتي — كل رسائلكم محفوظة ومؤمّنة 🐾
        </span>
      </div>
    `;
  }

  const normalizedSearch = inRoomSearchOpen ? inRoomSearchQuery.trim().toLowerCase() : '';
  let renderedFirstRetryId = false;

  return conv.messages
    .map((msg, idx) => {
      const unreadDividerHtml =
        firstUnreadMsgId && msg.id === firstUnreadMsgId
          ? `
            <div id="chat-unread-divider" class="flex items-center justify-center my-3 select-none">
              <span class="px-3.5 py-1 rounded-full bg-brand-orange/15 border border-brand-orange/35 text-[11px] font-black text-brand-orange font-baloo shadow-xs">
                رسائل غير مقروءة
              </span>
            </div>
          `
          : '';

      if (msg.senderId === 'system') {
        return `
          ${unreadDividerHtml}
          <div class="flex justify-center my-2.5 select-none" data-msg-id="${escapeAttr(msg.id)}">
            <span class="px-3.5 py-1.5 rounded-lg bg-white/95 dark:bg-[#27201B]/95 border border-brand-peachBorder/70 dark:border-warm-darkBorder text-xs sm:text-[13px] font-bold text-brand-orange text-center max-w-[88%] shadow-sm leading-relaxed font-baloo">
              ${escapeHtml(msg.text)}
            </span>
          </div>
        `;
      }

      const isUser = msg.isFromUser;
      const isDeleted = Boolean(msg.deletedAt);
      const prevMsg = idx > 0 ? conv.messages[idx - 1] : undefined;
      const isGrouped = isSameSenderGrouped(prevMsg, msg);
      const safeImgUrl = msg.fileUrl ? sanitizeImageSrc(msg.fileUrl, SAFE_FALLBACK_PET_SVG) : '';
      const safeDownloadUrl = msg.fileUrl ? sanitizeUrl(msg.fileUrl, '') : '';
      const safeAudioUrl = sanitizeAudioSrc(msg.audioBlobUrl || msg.fileUrl || '');
      const safeStickerUrl = msg.stickerUrl ? sanitizeImageSrc(msg.stickerUrl, SAFE_FALLBACK_PET_SVG) : '';
      const isPlayingThisAudio = currentPlayingMsgId === msg.id;

      const isSearchHit = Boolean(
        normalizedSearch &&
          !isDeleted &&
          ((msg.text || '').toLowerCase().includes(normalizedSearch) ||
            (msg.fileName || '').toLowerCase().includes(normalizedSearch) ||
            (msg.stickerTitle || '').toLowerCase().includes(normalizedSearch))
      );

      const bubbleClass = isUser
        ? isGrouped
          ? 'meow-bubble-grouped-out bg-brand-orange text-white rounded-2xl'
          : 'meow-bubble-out bg-brand-orange text-white rounded-2xl'
        : isGrouped
          ? 'meow-bubble-grouped-in bg-white dark:bg-[#261E19] text-brand-dark dark:text-white rounded-2xl border border-brand-peachBorder/70 dark:border-warm-darkBorder'
          : 'meow-bubble-in bg-white dark:bg-[#261E19] text-brand-dark dark:text-white rounded-2xl border border-brand-peachBorder/70 dark:border-warm-darkBorder';

      let retryIdAttr = '';
      if (isUser && msg.localStatus === 'failed' && !renderedFirstRetryId) {
        renderedFirstRetryId = true;
        retryIdAttr = 'id="chat-retry-msg-btn"';
      }

      const statusIndicatorHtml = isUser
        ? msg.localStatus === 'sending'
          ? `<span class="text-white/80 text-[11px]" title="جاري الإرسال"><i class="fa-regular fa-clock"></i></span>`
          : msg.localStatus === 'failed'
            ? `<button ${retryIdAttr} type="button" data-retry-msg-id="${escapeAttr(msg.id)}" class="chat-retry-msg-btn inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black cursor-pointer hover:bg-red-700 transition" title="${escapeAttr(msg.localError || 'فشل الإرسال — اضغط لإعادة المحاولة')}">
                 <i class="fa-solid fa-circle-exclamation"></i>
                 <span>إعادة الإرسال</span>
               </button>`
            : msg.status === 'read'
              ? `<span class="text-sky-200 text-xs" title="تمت القراءة"><i class="fa-solid fa-check-double"></i></span>`
              : msg.status === 'delivered'
                ? `<span class="text-white/90 text-xs" title="تم التسليم"><i class="fa-solid fa-check-double"></i></span>`
                : `<span class="text-white/80 text-xs" title="تم الإرسال"><i class="fa-solid fa-check"></i></span>`
        : '';

      return `
        ${unreadDividerHtml}
        <div class="flex flex-col ${isUser ? 'items-end' : 'items-start'} ${isGrouped ? 'mt-0.5' : 'mt-2.5'} transition-all group" data-msg-id="${escapeAttr(msg.id)}">
          <div class="relative max-w-[86%] sm:max-w-[80%] px-4 py-2.5 shadow-sm text-right ${bubbleClass} ${
            isSearchHit ? 'meow-chat-search-hit ring-2 ring-amber-300' : ''
          }">
            ${
              !isDeleted && msg.replyTo
                ? `
                  <button
                    type="button"
                    data-jump-reply-id="${escapeAttr(msg.replyTo.messageId)}"
                    class="chat-reply-quote-jump w-full text-right mb-2 px-2.5 py-1.5 rounded-xl border-r-4 ${
                      isUser
                        ? 'bg-black/15 border-r-white/90 text-white/95'
                        : 'bg-[#FFF5EA] dark:bg-[#1E1713] border-r-brand-orange text-brand-dark dark:text-[#EFE6DD]'
                    } block cursor-pointer"
                  >
                    <p class="text-[10px] font-black m-0 truncate font-baloo">${escapeHtml(msg.replyTo.senderName || 'رسالة')}</p>
                    <p class="text-[11px] font-semibold opacity-90 m-0 truncate">${escapeHtml(msg.replyTo.text || '')}</p>
                  </button>
                `
                : ''
            }

            ${
              isDeleted
                ? `
                  <p class="text-xs sm:text-sm font-bold italic opacity-75 m-0 flex items-center gap-1.5 font-baloo">
                    <i class="fa-solid fa-ban text-xs"></i>
                    <span>اتمسحت الرسالة دي</span>
                  </p>
                `
                : `
                  ${
                    msg.type === 'text' || !msg.type
                      ? `
                        <p class="text-[15px] sm:text-base font-bold leading-[1.6] m-0 break-words font-baloo select-text">
                          ${formatMessageTextWithLinks(msg.text || '', isUser)}
                        </p>
                      `
                      : ''
                  }

                  ${
                    msg.type === 'image' && msg.fileUrl
                      ? `
                        <div class="rounded-xl overflow-hidden mb-1.5 border ${isUser ? 'border-white/25' : 'border-brand-peachBorder/40'}">
                          <img 
                            src="${escapeAttr(safeImgUrl)}" 
                            alt="صورة مرفقة" 
                            loading="lazy"
                            decoding="async"
                            data-chat-image-preview="${escapeAttr(safeImgUrl)}"
                            data-chat-image-msg-id="${escapeAttr(msg.id)}"
                            class="chat-msg-image-preview w-full max-h-60 object-cover cursor-pointer hover:opacity-95 transition" 
                          />
                        </div>
                        ${msg.text ? `<p class="text-sm font-bold mt-1.5 mb-0 leading-relaxed select-text">${formatMessageTextWithLinks(msg.text, isUser)}</p>` : ''}
                      `
                      : ''
                  }

                  ${
                    msg.type === 'file'
                      ? `
                        <div class="flex items-center gap-2.5 p-2 rounded-xl ${isUser ? 'bg-black/15 border border-white/20' : 'bg-black/5 dark:bg-white/5 border border-brand-peachBorder/40'} mb-1">
                          <div class="w-9 h-9 rounded-lg ${isUser ? 'bg-white/20 text-white' : 'bg-brand-orange/20 text-brand-orange'} flex items-center justify-center shrink-0">
                            <i class="fa-solid fa-file-lines text-base"></i>
                          </div>
                          <div class="min-w-0 flex-1 text-right">
                            <p class="text-xs font-black truncate m-0 font-baloo">${escapeHtml(msg.fileName || 'ملف مرفق')}</p>
                            <span class="text-[10px] ${isUser ? 'text-white/80' : 'text-brand-subtleGray'} font-bold">${escapeHtml(msg.fileSize || 'ملف')}</span>
                          </div>
                          ${
                            safeDownloadUrl
                              ? `
                                <a href="${escapeAttr(safeDownloadUrl)}" download="${escapeAttr(msg.fileName || 'meow_file')}" rel="noopener noreferrer" class="w-9 h-9 rounded-full ${isUser ? 'bg-white text-brand-orange' : 'bg-brand-orange text-white'} flex items-center justify-center text-xs shrink-0 active:scale-90 transition" title="تحميل">
                                  <i class="fa-solid fa-download"></i>
                                </a>
                              `
                              : ''
                          }
                        </div>
                        ${msg.text ? `<p class="text-sm font-bold mt-1.5 mb-0 leading-relaxed select-text">${formatMessageTextWithLinks(msg.text, isUser)}</p>` : ''}
                      `
                      : ''
                  }

                  ${
                    msg.type === 'audio'
                      ? `
                        <div class="flex items-center gap-3 py-1 min-w-[200px]" data-audio-msg="${escapeAttr(msg.id)}">
                          <button
                            type="button"
                            class="play-audio-msg-btn w-10 h-10 rounded-full ${isUser ? 'bg-white text-brand-orange' : 'bg-brand-orange text-white'} flex items-center justify-center shrink-0 shadow-soft active:scale-90 transition cursor-pointer"
                            data-audio-url="${escapeAttr(safeAudioUrl)}"
                            data-msg-id="${escapeAttr(msg.id)}"
                            aria-label="تشغيل الرسالة الصوتية"
                          >
                            <i class="fa-solid ${isPlayingThisAudio ? 'fa-pause' : 'fa-play ml-0.5'} text-sm"></i>
                          </button>
                          <div class="flex-1 flex flex-col gap-1 min-w-0">
                            <div class="flex items-center gap-0.5 h-6">
                              <span class="w-1 h-3 ${isUser ? 'bg-white' : 'bg-brand-orange'} rounded-full"></span>
                              <span class="w-1 h-5 ${isUser ? 'bg-white' : 'bg-brand-orange'} rounded-full"></span>
                              <span class="w-1 h-2 ${isUser ? 'bg-white/75' : 'bg-brand-orange/70'} rounded-full"></span>
                              <span class="w-1 h-6 ${isUser ? 'bg-white' : 'bg-brand-orange'} rounded-full"></span>
                              <span class="w-1 h-4 ${isUser ? 'bg-white/70' : 'bg-brand-orange/60'} rounded-full"></span>
                              <span class="w-1 h-3 ${isUser ? 'bg-white' : 'bg-brand-orange'} rounded-full"></span>
                              <span class="w-1 h-5 ${isUser ? 'bg-white' : 'bg-brand-orange'} rounded-full"></span>
                              <span class="w-1 h-2 ${isUser ? 'bg-white/80' : 'bg-brand-orange/80'} rounded-full"></span>
                              <span class="w-1 h-4 ${isUser ? 'bg-white' : 'bg-brand-orange'} rounded-full"></span>
                              <span class="w-1 h-5 ${isUser ? 'bg-white/75' : 'bg-brand-orange/70'} rounded-full"></span>
                              <span class="w-1 h-3 ${isUser ? 'bg-white' : 'bg-brand-orange'} rounded-full"></span>
                            </div>
                            <span class="text-[10px] font-mono font-bold ${isUser ? 'text-white/85' : 'text-brand-subtleGray dark:text-[#A89F91]'}">
                              ${msg.audioDuration ? `0:${msg.audioDuration.toString().padStart(2, '0')}` : '0:07'}
                            </span>
                          </div>
                        </div>
                      `
                      : ''
                  }

                  ${
                    msg.type === 'sticker'
                      ? `
                        <div class="flex flex-col items-center justify-center py-1.5 px-1.5 select-none">
                          ${
                            msg.stickerUrl
                              ? `<img src="${escapeAttr(safeStickerUrl)}" alt="استيكر" decoding="async" class="max-w-[145px] max-h-[145px] object-contain drop-shadow-md rounded-2xl hover:scale-105 transition-transform" />`
                              : `<span class="text-6xl sm:text-7xl filter drop-shadow-md inline-block">${escapeHtml(msg.stickerEmoji || '🐾')}</span>`
                          }
                          <span class="mt-1.5 px-3 py-0.5 rounded-full ${isUser ? 'bg-white/20 text-white border border-white/25' : 'bg-brand-orange/15 text-brand-orange border border-brand-orange/20'} text-[10px] font-black font-baloo shadow-sm">
                            ${escapeHtml(msg.stickerTitle || 'ملصق مخصص')}
                          </span>
                        </div>
                      `
                      : ''
                  }
                `
            }

            <!-- Timestamp & Status Ticks -->
            <div class="flex items-center justify-end gap-1.5 mt-1 -mb-0.5 text-[11px] ${isUser ? 'text-white/85' : 'text-brand-subtleGray dark:text-[#A89F91]'} font-bold select-none">
              <span>${escapeHtml(msg.timestamp)}</span>
              ${statusIndicatorHtml}
            </div>
          </div>

          ${
            !isDeleted
              ? `
                <div class="flex items-center gap-1 mt-1 px-1 opacity-85">
                  <button
                    type="button"
                    data-reply-msg-id="${escapeAttr(msg.id)}"
                    class="chat-msg-reply-btn px-2 py-0.5 rounded-full bg-white/80 dark:bg-[#27201B]/80 border border-brand-peachBorder/60 dark:border-warm-darkBorder text-[10px] font-black text-warm-textSec dark:text-[#D1C7BD] hover:text-brand-orange transition cursor-pointer"
                    title="رد على الرسالة"
                  >
                    <i class="fa-solid fa-reply text-[9px] ml-0.5"></i> رد
                  </button>
                  ${
                    msg.text
                      ? `
                        <button
                          type="button"
                          data-copy-msg-id="${escapeAttr(msg.id)}"
                          class="chat-msg-copy-btn px-2 py-0.5 rounded-full bg-white/80 dark:bg-[#27201B]/80 border border-brand-peachBorder/60 dark:border-warm-darkBorder text-[10px] font-black text-warm-textSec dark:text-[#D1C7BD] hover:text-brand-orange transition cursor-pointer"
                          title="نسخ النص"
                        >
                          <i class="fa-regular fa-copy text-[9px] ml-0.5"></i> نسخ
                        </button>
                      `
                      : ''
                  }
                  ${
                    isUser
                      ? `
                        <button
                          type="button"
                          data-delete-msg-id="${escapeAttr(msg.id)}"
                          class="chat-msg-delete-btn px-2 py-0.5 rounded-full bg-white/80 dark:bg-[#27201B]/80 border border-red-200/70 dark:border-red-900/60 text-[10px] font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                          title="مسح الرسالة"
                        >
                          <i class="fa-solid fa-trash-can text-[9px] ml-0.5"></i> مسح
                        </button>
                      `
                      : ''
                  }
                </div>
              `
              : ''
          }
        </div>
      `;
    })
    .join('');
}

function getVisibleStickersForActiveTab() {
  const allStickers = state.getCustomStickers();
  const byId = new Map(allStickers.map((s) => [s.id, s]));
  let baseList = allStickers;

  if (activeStickerTab === 'recent') {
    const recentIds = state.getRecentStickerIds();
    baseList = recentIds.map((id) => byId.get(id)).filter((s): s is NonNullable<typeof s> => Boolean(s));
  } else if (activeStickerTab === 'favorites') {
    const favSet = new Set(state.getFavoriteStickerIds());
    baseList = allStickers.filter((s) => favSet.has(s.id));
  }

  const query = stickerSearchQuery.trim().toLowerCase();
  const filteredStickers = query
    ? baseList.filter((stk) => stk.title.toLowerCase().includes(query))
    : baseList;

  return { allStickers, filteredStickers };
}

function getStickerTabTitle(): { icon: string; label: string } {
  switch (activeStickerTab) {
    case 'recent':
      return { icon: 'fa-regular fa-clock', label: 'الأخيرة' };
    case 'favorites':
      return { icon: 'fa-solid fa-star', label: 'المفضلة' };
    case 'custom':
      return { icon: 'fa-solid fa-note-sticky', label: 'ملصقاتي' };
    default:
      return { icon: 'fa-solid fa-paw', label: 'الكل' };
  }
}

function renderStickersDrawerInnerHtml(): string {
  const { allStickers, filteredStickers } = getVisibleStickersForActiveTab();
  const tabMeta = getStickerTabTitle();

  return `
    <!-- 1. Top Drag Handle & Switcher Header -->
    <div id="chat-stickers-drag-handle" class="pt-2.5 pb-2 px-4 flex flex-col items-center border-b border-brand-peachBorder/60 dark:border-warm-darkBorder shrink-0 bg-[#FFF9E9]/95 dark:bg-[#27201B] touch-none cursor-grab">
      <div class="w-11 h-1.5 bg-brand-peachBorder dark:bg-warm-darkBorder rounded-full mb-2"></div>

      <div class="w-full flex items-center justify-between gap-2">
        <button
          type="button"
          id="sticker-search-btn"
          class="w-9 h-9 rounded-full bg-white dark:bg-[#2F241C] border border-brand-peachBorder dark:border-warm-darkBorder ${isStickerSearchOpen ? 'text-brand-orange border-brand-orange' : 'text-warm-textSec dark:text-[#D1C7BD]'} hover:text-brand-orange flex items-center justify-center text-sm transition active:scale-90 cursor-pointer shadow-sm shrink-0"
          title="بحث في الملصقات"
        >
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>

        <div class="flex items-center gap-1.5 min-w-0">
          <div class="flex items-center bg-brand-peachBorder/30 dark:bg-black/30 p-1 rounded-full border border-brand-peachBorder/60 dark:border-warm-darkBorder shadow-sm">
            <span class="px-3 py-1 rounded-full text-xs font-black bg-white dark:bg-[#2F241C] text-brand-orange shadow-sm flex items-center gap-1.5 font-baloo">
              <i class="${tabMeta.icon} text-xs"></i>
              <span>${tabMeta.label}</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-orange/15 text-brand-orange font-mono">${filteredStickers.length}</span>
            </span>
          </div>
          <button
            type="button"
            id="import-stickers-btn"
            class="h-8 px-2.5 rounded-full bg-brand-orange/15 text-brand-orange hover:bg-brand-orange hover:text-white text-[11px] font-black transition cursor-pointer font-baloo flex items-center gap-1 shrink-0 active:scale-95"
            title="استيراد عدة صور كملصقات"
          >
            <i class="fa-solid fa-file-import text-[10px]"></i>
            <span>استيراد ملصقات</span>
          </button>
        </div>

        <button 
          id="close-stickers-btn" 
          type="button" 
          class="w-9 h-9 rounded-full bg-white dark:bg-[#2F241C] border border-brand-peachBorder dark:border-warm-darkBorder text-warm-textSec hover:text-brand-orange flex items-center justify-center text-sm cursor-pointer transition active:scale-90 shadow-sm shrink-0"
          title="إغلاق لوحة الملصقات"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      ${
        isStickerSearchOpen
          ? `
          <div class="w-full mt-2">
            <input
              id="sticker-search-input"
              type="text"
              value="${escapeAttr(stickerSearchQuery)}"
              placeholder="ابحث باسم الملصق..."
              class="w-full h-8 px-3 rounded-full bg-white dark:bg-[#1E1713] border border-brand-peachBorder dark:border-warm-darkBorder text-xs font-bold text-brand-dark dark:text-white focus:outline-none focus:border-brand-orange"
            />
          </div>
          `
          : ''
      }
    </div>

    <!-- 2. Stickers Content Grid with Smooth Scroll -->
    <div id="chat-stickers-scroll" class="flex-1 overflow-y-auto px-4 py-3 min-h-0 overscroll-contain">
      <div class="grid grid-cols-4 sm:grid-cols-5 gap-3">
        ${
          activeStickerTab === 'all' || activeStickerTab === 'custom'
            ? `
              <div
                id="create-sticker-tile"
                class="create-sticker-tile group aspect-square rounded-2xl border-2 border-dashed border-brand-orange/80 bg-brand-orange/5 hover:bg-brand-orange/15 hover:border-brand-orange flex flex-col items-center justify-center p-2 text-center cursor-pointer transition-all active:scale-95 shadow-sm"
                title="إنشاء ملصق جديد من صورك"
              >
                <div class="w-9 h-9 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-soft mb-1 group-hover:scale-110 transition-transform">
                  <i class="fa-solid fa-plus text-sm"></i>
                </div>
                <span class="text-[11px] font-black text-brand-orange font-baloo leading-tight">
                  إنشاء ملصق
                </span>
              </div>
            `
            : ''
        }

        ${filteredStickers
          .map((stk) => {
            const safeStickerImg = sanitizeImageSrc(stk.imageUrl, SAFE_FALLBACK_PET_SVG);
            const isFav = state.isStickerFavorite(stk.id);
            return `
              <div class="relative group aspect-square rounded-2xl bg-white dark:bg-[#2F241C] border-2 border-brand-peachBorder dark:border-warm-darkBorder hover:border-brand-orange p-1.5 flex items-center justify-center transition-all shadow-sm hover:shadow-md">
                <button
                  type="button"
                  class="custom-sticker-send-btn w-full h-full flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
                  data-sticker-id="${escapeAttr(stk.id)}"
                  data-sticker-url="${escapeAttr(safeStickerImg)}"
                  data-sticker-title="${escapeAttr(stk.title)}"
                  title="إرسال هذا الملصق"
                >
                  <img src="${escapeAttr(safeStickerImg)}" alt="${escapeAttr(stk.title)}" decoding="async" class="max-w-full max-h-full object-contain rounded-xl select-none" />
                </button>
                <button
                  type="button"
                  class="sticker-fav-toggle-btn absolute -top-2 -left-2 w-6 h-6 rounded-full bg-white dark:bg-[#27201B] border border-brand-peachBorder dark:border-warm-darkBorder ${
                    isFav ? 'text-amber-400' : 'text-brand-subtleGray hover:text-amber-400'
                  } flex items-center justify-center text-[10px] shadow-sm hover:scale-110 active:scale-90 transition cursor-pointer"
                  data-sticker-id="${escapeAttr(stk.id)}"
                  title="${isFav ? 'إزالة من المفضلة' : 'إضافة للمفضلة'}"
                >
                  <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-star"></i>
                </button>
                <button
                  type="button"
                  class="delete-custom-sticker-btn absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-[11px] shadow-sm hover:scale-110 active:scale-90 transition cursor-pointer"
                  data-sticker-id="${escapeAttr(stk.id)}"
                  title="حذف الملصق"
                >
                  <i class="fa-solid fa-xmark"></i>
                </button>
              </div>
            `;
          })
          .join('')}
      </div>

      ${
        allStickers.length === 0
          ? `
            <div class="mt-4 p-3 rounded-2xl bg-white/70 dark:bg-[#27201B]/70 border border-brand-peachBorder/60 dark:border-warm-darkBorder text-center">
              <p class="text-xs font-bold text-warm-textSec dark:text-[#D1C7BD] font-baloo m-0">
                حوّل صور أليفك إلى ملصقات مخصصة محفوظة في حسابك عبر زر «إنشاء ملصق» أو «استيراد ملصقات».
              </p>
            </div>
          `
          : filteredStickers.length === 0
            ? `
              <div class="mt-4 p-3 rounded-2xl bg-white/70 dark:bg-[#27201B]/70 border border-brand-peachBorder/60 dark:border-warm-darkBorder text-center">
                <p class="text-xs font-bold text-warm-textSec dark:text-[#D1C7BD] font-baloo m-0">
                  ${
                    activeStickerTab === 'recent'
                      ? 'لسه مفيش ملصقات استخدمتها مؤخراً.'
                      : activeStickerTab === 'favorites'
                        ? 'اضغط على النجمة فوق أي ملصق لإضافته للمفضلة.'
                        : 'لا توجد ملصقات مطابقة للبحث.'
                  }
                </p>
              </div>
            `
            : ''
      }
    </div>

    <!-- 3. Bottom Pack Navigation Bar -->
    <div class="shrink-0 px-4 py-1.5 bg-[#FFF9E9] dark:bg-[#231C17] border-t border-brand-peachBorder/60 dark:border-warm-darkBorder flex items-center justify-between">
      <div class="flex items-center gap-2">
        <button
          type="button"
          data-sticker-tab="recent"
          class="sticker-tab-btn relative ${
            activeStickerTab === 'recent' ? 'text-brand-orange' : 'text-warm-textSec dark:text-[#A89F91] hover:text-brand-orange'
          } transition p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-sm cursor-pointer active:scale-90"
          title="الأخيرة"
          aria-label="الأخيرة"
        >
          <i class="fa-regular fa-clock"></i>
          ${activeStickerTab === 'recent' ? '<span class="absolute bottom-0.5 inset-x-0 mx-auto w-3.5 h-0.5 bg-brand-orange rounded-full"></span>' : ''}
        </button>
        <button
          type="button"
          data-sticker-tab="favorites"
          class="sticker-tab-btn relative ${
            activeStickerTab === 'favorites' ? 'text-brand-orange' : 'text-warm-textSec dark:text-[#A89F91] hover:text-brand-orange'
          } transition p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-sm cursor-pointer active:scale-90"
          title="المفضلة"
          aria-label="المفضلة"
        >
          <i class="${activeStickerTab === 'favorites' ? 'fa-solid' : 'fa-regular'} fa-star"></i>
          ${activeStickerTab === 'favorites' ? '<span class="absolute bottom-0.5 inset-x-0 mx-auto w-3.5 h-0.5 bg-brand-orange rounded-full"></span>' : ''}
        </button>
        <button
          type="button"
          data-sticker-tab="all"
          class="sticker-tab-btn relative ${
            activeStickerTab === 'all' ? 'text-brand-orange' : 'text-warm-textSec dark:text-[#A89F91] hover:text-brand-orange'
          } transition p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-base cursor-pointer active:scale-90"
          title="كل الملصقات"
          aria-label="الكل"
        >
          <i class="fa-solid fa-paw"></i>
          ${activeStickerTab === 'all' ? '<span class="absolute bottom-0.5 inset-x-0 mx-auto w-3.5 h-0.5 bg-brand-orange rounded-full"></span>' : ''}
        </button>
        <button
          type="button"
          data-sticker-tab="custom"
          class="sticker-tab-btn relative ${
            activeStickerTab === 'custom' ? 'text-brand-orange' : 'text-warm-textSec dark:text-[#A89F91] hover:text-brand-orange'
          } transition p-2 min-w-[36px] min-h-[36px] flex items-center justify-center text-sm cursor-pointer active:scale-90"
          title="ملصقاتي"
          aria-label="ملصقاتي"
        >
          <i class="fa-solid fa-note-sticky"></i>
          ${activeStickerTab === 'custom' ? '<span class="absolute bottom-0.5 inset-x-0 mx-auto w-3.5 h-0.5 bg-brand-orange rounded-full"></span>' : ''}
        </button>
      </div>

      <button
        id="add-sticker-pack-btn"
        type="button"
        class="w-9 h-9 rounded-full bg-brand-orange/15 text-brand-orange hover:bg-brand-orange hover:text-white flex items-center justify-center text-sm transition active:scale-90 cursor-pointer"
        title="إضافة ملصق جديد من صورة"
      >
        <i class="fa-solid fa-plus"></i>
      </button>
    </div>
  `;
}

function renderMediaPreviewModalHtml(): string {
  if (!pendingChatAttachment) return '';
  return `
    <div id="chat-media-preview-modal" class="fixed inset-0 z-[92] bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" dir="rtl">
      <div class="bg-[#FFFDF8] dark:bg-[#27201B] w-full max-w-md rounded-t-[30px] sm:rounded-[28px] border-2 border-brand-peachBorder dark:border-warm-darkBorder p-4 sm:p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl space-y-3.5 animate-slide-up">
        <div class="flex items-center justify-between gap-2 pb-2 border-b border-brand-peachBorder/60 dark:border-warm-darkBorder">
          <h3 class="text-base font-black text-brand-dark dark:text-white font-baloo m-0">معاينة المرفق قبل الإرسال</h3>
          <button
            id="cancel-chat-media-preview-btn"
            type="button"
            aria-label="إلغاء إرسال المرفق"
            ${pendingChatAttachment.isSending ? 'disabled' : ''}
            class="w-9 h-9 rounded-full bg-black/5 dark:bg-white/10 text-brand-dark dark:text-white hover:bg-red-500 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        ${
          pendingChatAttachment.type === 'image'
            ? `
              <div class="rounded-2xl overflow-hidden bg-black/5 dark:bg-black/30 border border-brand-peachBorder/60 dark:border-warm-darkBorder flex items-center justify-center max-h-[46dvh]">
                <img src="${escapeAttr(sanitizeImageSrc(pendingChatAttachment.fileUrl, SAFE_FALLBACK_PET_SVG))}" alt="${escapeAttr(pendingChatAttachment.fileName)}" class="max-w-full max-h-[46dvh] object-contain" />
              </div>
            `
            : `
              <div class="flex items-center gap-3 p-3.5 rounded-2xl bg-white dark:bg-[#1E1713] border border-brand-peachBorder dark:border-warm-darkBorder">
                <div class="w-11 h-11 rounded-xl bg-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0">
                  <i class="fa-solid fa-file-lines text-xl"></i>
                </div>
                <div class="min-w-0 flex-1 text-right">
                  <p class="text-sm font-black text-brand-dark dark:text-white truncate m-0 font-baloo">${escapeHtml(pendingChatAttachment.fileName)}</p>
                  <span class="text-xs font-bold text-brand-subtleGray dark:text-[#A89F91]">${escapeHtml(pendingChatAttachment.fileSize)}</span>
                </div>
              </div>
            `
        }

        <div
          id="chat-media-preview-error"
          class="${
            pendingChatAttachment.errorMessage ? 'block' : 'hidden'
          } p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs font-bold text-right"
        >
          ${escapeHtml(pendingChatAttachment.errorMessage || '')}
        </div>

        <input
          id="chat-media-caption-input"
          type="text"
          value="${escapeAttr(pendingChatAttachment.caption || '')}"
          placeholder="أضف تعليقاً اختيارياً..."
          class="w-full h-11 px-4 rounded-2xl bg-white dark:bg-[#1E1713] border-2 border-brand-peachBorder dark:border-warm-darkBorder text-sm font-bold text-brand-dark dark:text-white placeholder-brand-subtleGray focus:outline-none focus:border-brand-orange font-baloo"
          autocomplete="off"
        />

        <div class="grid grid-cols-2 gap-2.5 pt-1">
          <button
            id="cancel-chat-media-secondary-btn"
            type="button"
            ${pendingChatAttachment.isSending ? 'disabled' : ''}
            class="h-11 rounded-full bg-white dark:bg-[#342A24] border-2 border-brand-peachBorder dark:border-warm-darkBorder text-brand-dark dark:text-white font-black text-sm hover:bg-brand-peachBorder/20 transition active:scale-95 cursor-pointer font-baloo"
          >
            إلغاء
          </button>
          <button
            id="confirm-send-chat-media-btn"
            type="button"
            ${pendingChatAttachment.isSending ? 'disabled' : ''}
            class="h-11 rounded-full bg-brand-orange hover:bg-brand-orangeHover text-white font-black text-sm shadow-soft flex items-center justify-center gap-2 transition active:scale-95 ${
              pendingChatAttachment.isSending ? 'opacity-75 cursor-wait' : 'cursor-pointer'
            } font-baloo"
          >
            <span>${pendingChatAttachment.isSending ? 'جاري الإرسال...' : 'إرسال'}</span>
            <i class="fa-solid ${pendingChatAttachment.isSending ? 'fa-spinner fa-spin' : 'fa-paper-plane'} text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderImageLightboxHtml(): string {
  if (!previewChatImageUrl) return '';
  const safeImg = sanitizeImageSrc(previewChatImageUrl, SAFE_FALLBACK_PET_SVG);
  return `
    <div id="chat-image-lightbox" class="fixed inset-0 z-[95] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" dir="rtl">
      <div class="absolute top-[max(1rem,env(safe-area-inset-top))] inset-x-4 flex items-center justify-between gap-2 z-10">
        <button
          id="close-chat-image-lightbox-btn"
          type="button"
          aria-label="إغلاق الصورة"
          class="w-11 h-11 rounded-full bg-white/15 hover:bg-brand-orange text-white flex items-center justify-center text-lg cursor-pointer transition active:scale-90"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
        <button
          id="chat-lightbox-download-btn"
          type="button"
          aria-label="تحميل الصورة"
          class="h-10 px-4 rounded-full bg-white/15 hover:bg-brand-orange text-white text-xs font-black flex items-center gap-2 cursor-pointer transition active:scale-90 font-baloo"
        >
          <i class="fa-solid fa-download"></i>
          <span>حفظ الصورة</span>
        </button>
      </div>
      <img
        id="chat-lightbox-img"
        src="${escapeAttr(safeImg)}"
        alt="معاينة الصورة"
        class="max-w-full max-h-[85dvh] rounded-2xl object-contain shadow-2xl"
      />
    </div>
  `;
}

// WhatsApp-like Chat Room with real audio recorder, attachment handling, and in-place patching
function renderChatRoom(conv: ReturnType<typeof state.getActiveConversation>): string {
  if (!conv) return '';

  if (lastRenderedChatRoomId !== conv.id) {
    lastRenderedChatRoomId = conv.id;
    isGroupDetailsExpanded = false;
    previewChatImageUrl = null;
    previewChatImageMsgId = null;
    pendingChatAttachment = null;
    activeReplyTarget = null;
    inRoomSearchOpen = false;
    inRoomSearchQuery = '';
    firstUnreadMsgId = null;
    userIsNearBottom = true;
    justSentMessageFlag = false;
    knownConvMsgCountMap.set(conv.id, conv.messages.length);
  }

  const resolvedPet = state.getPetForConversation(conv);
  const isGroupConv =
    conv.adoptionType === 'group' || resolvedPet?.adoptionType === 'group';
  const groupMembers =
    conv.groupMembers && conv.groupMembers.length > 0
      ? conv.groupMembers
      : resolvedPet?.groupMembers || [];
  const groupCount =
    conv.groupCount || resolvedPet?.groupCount || groupMembers.length || 2;
  const mustAdoptTogether =
    conv.mustAdoptTogether ?? resolvedPet?.mustAdoptTogether;
  const adoptionReason =
    conv.adoptionReason || resolvedPet?.adoptionReason || '';
  const sharedLocation =
    conv.petLocation ||
    (resolvedPet
      ? resolvedPet.area && resolvedPet.area !== resolvedPet.city
        ? `${resolvedPet.area}، ${resolvedPet.city}`
        : resolvedPet.city || resolvedPet.governorate
      : '');
  const groupMemberThumbs = groupMembers
    .map((m) => ({ name: m.name, photo: m.individualPhotos?.[0] || '' }))
    .filter((t) => Boolean(t.photo))
    .slice(0, 4);

  return `
    <!-- WhatsApp-Style Chat Room (Meow Warm Theme) - Full Screen without Taskbar -->
    <div id="active-chat-room" data-conv-id="${escapeAttr(conv.id)}" class="fixed inset-0 z-50 bg-[#FAF4ED] dark:bg-[#1A1512] flex flex-col w-full max-w-md mx-auto shadow-2xl h-[100dvh] overflow-hidden" dir="rtl">
      
      <!-- Top WhatsApp Header (Clean & Warm, Larger & Clear) -->
      <header class="shrink-0 bg-[#FFF9E9] dark:bg-[#27201B] border-b-2 border-brand-peachBorder/70 dark:border-warm-darkBorder px-3.5 sm:px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] flex items-center justify-between shadow-sm z-30">
        <div class="flex items-center gap-2 min-w-0 flex-1">
          <!-- Back button -->
          <button 
            id="back-to-chats-btn" 
            class="w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 hover:bg-brand-orange hover:text-white text-brand-dark dark:text-white flex items-center justify-center text-base cursor-pointer transition active:scale-90 shadow-sm shrink-0" 
            type="button"
            aria-label="الرجوع إلى المحادثات"
            title="رجوع"
          >
            <i class="fa-solid fa-arrow-right text-lg"></i>
          </button>

          <!-- Clickable User + Pet Details Shortcut -->
          <button
            id="open-chat-pet-detail-btn"
            type="button"
            class="flex items-center gap-2.5 min-w-0 flex-1 text-right cursor-pointer hover:opacity-90 transition"
            aria-label="عرض تفاصيل الأليف"
          >
            <div class="relative shrink-0">
              <img
                src="${escapeAttr(sanitizeImageSrc(conv.otherUserAvatar, SAFE_FALLBACK_AVATAR_SVG))}"
                alt="${escapeAttr(conv.otherUserName)}"
                referrerpolicy="no-referrer"
                onerror="this.onerror=null;this.src='${escapeAttr(SAFE_FALLBACK_AVATAR_SVG)}';"
                class="w-11 h-11 rounded-full object-cover border-2 border-brand-orange shadow-sm"
              />
              <span class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#27201B]"></span>
            </div>

            <div class="min-w-0 text-right flex-1">
              <div class="flex items-center gap-1.5">
                <h3 class="text-sm sm:text-base font-black text-brand-dark dark:text-white truncate font-baloo leading-tight m-0">
                  ${escapeHtml(conv.otherUserName)}
                </h3>
                ${
                  conv.isPinned
                    ? `<span class="px-1.5 py-0.5 rounded-full bg-brand-orange/15 text-brand-orange text-[10px] font-black shrink-0"><i class="fa-solid fa-thumbtack text-[9px]"></i></span>`
                    : ''
                }
                <span id="chat-header-muted-badge" class="${conv.isMuted ? 'inline-flex' : 'hidden'} px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-brand-subtleGray text-[10px] shrink-0" title="مكتومة">
                  <i class="fa-solid fa-bell-slash text-[9px]"></i>
                </span>
              </div>
              <p id="chat-header-subtitle" class="text-[11px] sm:text-xs font-bold text-brand-orange truncate m-0 font-baloo mt-0.5">
                ${renderChatHeaderSubtitle(conv, isGroupConv, groupCount)}
              </p>
            </div>
          </button>
        </div>

        <div class="flex items-center gap-1 shrink-0">
          <button
            id="chat-inroom-search-toggle-btn"
            type="button"
            aria-label="بحث في المحادثة"
            title="بحث في المحادثة"
            class="w-9 h-9 rounded-full ${inRoomSearchOpen ? 'bg-brand-orange text-white' : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-brand-dark dark:text-white'} flex items-center justify-center text-sm transition cursor-pointer active:scale-90"
          >
            <i class="fa-solid fa-magnifying-glass"></i>
          </button>
          <button
            id="chat-mute-toggle-btn"
            type="button"
            aria-label="${conv.isMuted ? 'إلغاء كتم المحادثة' : 'كتم المحادثة'}"
            title="${conv.isMuted ? 'إلغاء الكتم' : 'كتم الإشعارات'}"
            class="w-9 h-9 rounded-full ${conv.isMuted ? 'bg-brand-orange/15 text-brand-orange' : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-brand-dark dark:text-white'} flex items-center justify-center text-sm transition cursor-pointer active:scale-90"
          >
            <i class="fa-solid ${conv.isMuted ? 'fa-bell-slash' : 'fa-bell'}"></i>
          </button>
          ${
            state.canRevealConversationPhone(conv) && conv.otherUserPhone
              ? `
              <a 
                href="${escapeAttr(sanitizeTelUrl(conv.otherUserPhone))}" 
                class="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-100 transition shadow-sm"
                title="اتصال هاتفي"
                aria-label="اتصال هاتفي"
              >
                <i class="fa-solid fa-phone text-sm"></i>
              </a>
              `
              : ''
          }
          ${renderThreeDotsMenu({
            userId: conv.otherUserId,
            userName: conv.otherUserName,
            userAvatar: conv.otherUserAvatar,
            petId: conv.petId,
            petName: conv.petName,
            conversationId: conv.id,
            isPinned: Boolean(conv.isPinned),
            showPinActions: true,
            showDeleteConversation: true,
            reportTargetType: 'chat',
            buttonClass:
              'w-9 h-9 min-w-[36px] min-h-[36px] rounded-xl bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-brand-dark dark:text-white flex items-center justify-center transition cursor-pointer active:scale-90',
            dropdownAlign: 'left',
          })}
        </div>
      </header>

      ${renderInRoomSearchBarHtml(conv)}

      ${
        isGroupConv
          ? `
          <!-- Group Adoption Summary & Full Details Drawer inside Active Chat -->
          <div class="shrink-0 bg-[#FFFDF8] border-b border-brand-peachBorder/70 px-3.5 py-2.5 z-20 text-right">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2 min-w-0">
                ${
                  groupMemberThumbs.length > 0
                    ? `
                      <div class="flex items-center -space-x-1.5 space-x-reverse shrink-0">
                        ${groupMemberThumbs
                          .slice(0, 3)
                          .map(
                            (t) => `
                              <img src="${escapeAttr(sanitizeImageSrc(t.photo, SAFE_FALLBACK_PET_SVG))}" alt="${escapeAttr(t.name)}" class="w-8 h-8 rounded-xl object-cover border-2 border-white shadow-sm" />
                            `
                          )
                          .join('')}
                      </div>
                    `
                    : `
                      <span class="w-8 h-8 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center text-xs shrink-0">
                        <i class="fa-solid fa-people-roof"></i>
                      </span>
                    `
                }
                <div class="min-w-0">
                  <p class="text-xs font-black text-brand-dark font-baloo truncate m-0">
                    تبني جماعي (${groupCount} حيوانات)${sharedLocation ? ` • ${escapeHtml(sharedLocation)}` : ''}
                  </p>
                  <p class="text-[10px] font-bold ${mustAdoptTogether ? 'text-brand-orange' : 'text-emerald-700'} truncate m-0">
                    ${mustAdoptTogether ? 'يُشترط تبني المجموعة كاملة معاً' : 'يمكن تبنيها معاً أو بشكل منفصل'}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  class="open-chat-group-full-btn px-3 py-1.5 min-h-[34px] rounded-full bg-white border border-brand-peachBorder text-[11px] font-black text-brand-dark hover:border-brand-orange hover:text-brand-orange transition cursor-pointer font-baloo active:scale-95"
                >
                  الملف الكامل
                </button>
                <button
                  id="toggle-chat-group-details-btn"
                  type="button"
                  class="px-3 py-1.5 min-h-[34px] rounded-full bg-brand-orange/15 text-brand-orange text-[11px] font-black hover:bg-brand-orange hover:text-white transition cursor-pointer font-baloo flex items-center gap-1 active:scale-95"
                >
                  <span>${isGroupDetailsExpanded ? 'إخفاء' : 'الحيوانات'}</span>
                  <i class="fa-solid ${isGroupDetailsExpanded ? 'fa-chevron-up' : 'fa-chevron-down'} text-[10px]"></i>
                </button>
              </div>
            </div>

            ${
              isGroupDetailsExpanded
                ? `
                <div id="chat-group-details-panel" class="mt-2.5 pt-2.5 border-t border-brand-peachBorder/50 space-y-2.5 max-h-[42vh] overflow-y-auto pl-1">
                  <div class="p-2.5 rounded-xl bg-[#FFF9E9] border border-brand-peachBorder/60 text-[11px] font-bold text-[#5d4b3d] space-y-1">
                    <div class="flex items-center justify-between gap-2">
                      <span>الموقع المشترك: <strong class="text-brand-dark">${escapeHtml(sharedLocation || 'غير محدد')}</strong></span>
                      <span class="font-black text-emerald-700">${mustAdoptTogether ? 'معاً فقط' : 'منفرداً متاح'}</span>
                    </div>
                    ${
                      adoptionReason
                        ? `<p class="m-0 leading-relaxed">سبب العرض للتبني: ${escapeHtml(adoptionReason)}</p>`
                        : ''
                    }
                  </div>
                  <div class="space-y-2">
                    ${groupMembers
                      .map((m, idx) => {
                        const mAge = formatPetAgeFull(m.ageYears, m.ageMonths);
                        const mTraits = (m.personality || []).filter(Boolean);
                        const mPhotos = (m.individualPhotos || []).filter(Boolean);
                        return `
                          <div class="p-3 rounded-2xl bg-[#FFF9E9]/95 border border-brand-peachBorder/80 space-y-2">
                            <div class="flex items-start gap-2.5">
                              <img
                                src="${escapeAttr(sanitizeImageSrc(mPhotos[0] || conv.petPhoto, SAFE_FALLBACK_PET_SVG))}"
                                alt="${escapeAttr(m.name)}"
                                class="w-14 h-14 rounded-xl object-cover border-2 border-brand-orange shrink-0"
                              />
                              <div class="min-w-0 flex-1 space-y-0.5">
                                <div class="flex items-center justify-between gap-2">
                                  <span class="text-xs sm:text-sm font-black text-brand-dark font-baloo truncate">
                                    ${idx + 1}. ${escapeHtml(m.name)}
                                  </span>
                                  <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-white border border-brand-peachBorder ${
                                    m.gender === 'male' ? 'text-blue-600' : 'text-pink-600'
                                  } shrink-0">
                                    ${m.gender === 'male' ? 'ذكر' : 'أنثى'}
                                  </span>
                                </div>
                                <p class="text-[10px] font-bold text-[#786555] m-0">
                                  ${escapeHtml(formatPetSpeciesShort(m.species))} • ${escapeHtml(m.breed)}${
                                    m.hybridBreed ? ` (${escapeHtml(m.hybridBreed)})` : ''
                                  }${mAge ? ` • ${escapeHtml(mAge)}` : ''}${m.color ? ` • ${escapeHtml(m.color)}` : ''}
                                </p>
                                <p class="text-[10px] font-bold text-emerald-700 m-0">
                                  ${escapeHtml(formatVaccinationStatus(m.vaccinationStatus))}
                                </p>
                              </div>
                            </div>
                            ${
                              mTraits.length > 0
                                ? `
                                  <div class="flex items-center gap-1 flex-wrap">
                                    ${mTraits
                                      .map(
                                        (tr) => `<span class="px-2 py-0.5 rounded-full bg-white border border-brand-peachBorder/70 text-[10px] font-bold text-brand-dark">${escapeHtml(tr)}</span>`
                                      )
                                      .join('')}
                                  </div>
                                `
                                : ''
                            }
                            ${
                              m.healthNotes
                                ? `<p class="text-[10px] font-semibold text-brand-dark/80 m-0">${escapeHtml(m.healthNotes)}</p>`
                                : ''
                            }
                            <div class="flex items-center justify-between gap-2 pt-1 border-t border-brand-peachBorder/40">
                              <span class="text-[10px] font-bold text-brand-subtleGray">
                                ${mPhotos.length} ${mPhotos.length === 1 ? 'صورة منفصلة' : 'صور منفصلة'}
                              </span>
                              <button
                                type="button"
                                data-open-member-detail-id="${escapeAttr(m.petId)}"
                                class="open-chat-member-detail-btn px-2.5 py-1 rounded-full bg-brand-orange/15 text-brand-orange hover:bg-brand-orange hover:text-white text-[10px] font-black transition cursor-pointer font-baloo"
                              >
                                عرض ملف ${escapeHtml(m.name)} المستقل
                              </button>
                            </div>
                          </div>
                        `;
                      })
                      .join('')}
                  </div>
                </div>
                `
                : ''
            }
          </div>
          `
          : ''
      }

      <!-- Messages Body (Bubble layout with calm pet supplies & paws backdrop) -->
      <div class="relative flex-1 min-h-0 flex flex-col">
        <div 
          id="chat-messages-container" 
          class="flex-1 overflow-y-auto px-3.5 pt-4 pb-6 space-y-2 overscroll-contain bg-[#FAF4ED] dark:bg-[#1A1512]"
          style="${CHAT_PAW_BACKDROP_STYLE}"
        >
          ${
            state.isMatingConversationApproved(conv)
              ? `
                <div
                  id="mating-approved-banner"
                  class="rounded-[28px] p-4 bg-gradient-to-l from-[#FFF5EA] via-white to-[#FFF9E9] border-2 border-brand-orange/60 shadow-sm flex items-center gap-3.5 text-right select-none mb-2"
                >
                  <div class="w-12 h-12 rounded-full bg-brand-orange text-white flex items-center justify-center shrink-0 shadow-soft">
                    <svg viewBox="0 0 64 48" class="w-8 h-6 text-white" fill="none" aria-hidden="true">
                      <path d="M12.5 23.5 14 14.5l5.5 4.2h4l5.5-4.2 1.5 9c1.2 1.8 1.8 4 1.8 6.4 0 6.2-4.4 10.6-10.3 10.6S11 36.1 11 29.9c0-2.4.6-4.6 1.5-6.4Z" fill="currentColor"/>
                      <path d="M33.5 24.5 35 15.8l5 3.9h3.8l5-3.9 1.5 8.7c1.1 1.7 1.7 3.8 1.7 6 0 6-4.2 10-9.7 10s-9.7-4-9.7-10c0-2.2.5-4.3.9-6Z" fill="currentColor"/>
                      <path d="M23.5 33.5c2.2-6.5 8-12 8.5-18.8.4-4.8-3.2-8.2-6.6-8.2-2.6 0-4.6 1.6-5.2 4.1" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>
                      <path d="M40.5 33.5c-2.2-6.5-8-12-8.5-18.8-.4-4.8 3.2-8.2 6.6-8.2 2.6 0 4.6 1.6 5.2 4.1" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>
                      <path d="M32 13.5c-1.4-2.5-5.1-2.4-5.9.3-.8 2.6 2.1 5.1 5.9 7.5 3.8-2.4 6.7-4.9 5.9-7.5-.8-2.7-4.5-2.8-5.9-.3Z" fill="#FFE082"/>
                    </svg>
                  </div>
                  <div class="min-w-0 flex-1">
                    <h4 class="text-sm sm:text-base font-black font-baloo text-brand-orange m-0">
                      تمت الموافقة على التزاوج! بالتوفيق 🐾
                    </h4>
                    <p class="text-xs font-bold text-brand-dark/85 mt-0.5 mb-0 leading-relaxed">
                      وفّق ديلين في الحلال — يمكنك الآن الاتفاق على الموعد والفحوصات الطبية بهدوء ووضوح.
                    </p>
                  </div>
                </div>
              `
              : ''
          }
          <div id="chat-messages-list" class="space-y-2">
            ${renderChatMessagesListHtml(conv)}
          </div>
        </div>

        <button
          id="chat-scroll-to-bottom-btn"
          type="button"
          aria-label="النزول لآخر الرسائل"
          class="${
            userIsNearBottom ? 'hidden' : 'flex'
          } absolute bottom-3 left-3 z-20 w-10 h-10 rounded-full bg-white/95 dark:bg-[#27201B]/95 border-2 border-brand-orange text-brand-orange shadow-lg items-center justify-center cursor-pointer transition active:scale-90"
        >
          <i class="fa-solid fa-chevron-down text-sm"></i>
        </button>
      </div>

      <!-- Hidden Real File Picker for Attachments -->
      <input 
        type="file" 
        id="chat-file-picker" 
        class="hidden" 
        accept="image/*,application/pdf,.doc,.docx"
      />

      <!-- Hidden File Input for Custom Sticker Creation (supports multi-import) -->
      <input
        type="file"
        id="sticker-upload-input"
        class="hidden"
        accept="image/*"
        multiple
      />

      <!-- Detached Floating Bubble Composer & Floating Audio/Sticker Drawers -->
      <footer class="shrink-0 px-3 pt-1.5 pb-[max(0.85rem,env(safe-area-inset-bottom))] z-40 pointer-events-none flex flex-col gap-2 bg-transparent">
        
        <div id="chat-reply-preview-slot">
          ${renderReplyPreviewBarHtml()}
        </div>

        <!-- Live Voice Recording Floating Bubble Bar -->
        <div 
          id="recording-ui-bar" 
          class="hidden pointer-events-auto bg-[#FFF0E0]/95 backdrop-blur-md border-2 border-brand-orange rounded-[30px] px-4 py-3 items-center justify-between shadow-nav animate-slide-up"
        >
          <div class="flex items-center gap-3">
            <span class="w-3.5 h-3.5 rounded-full bg-red-600 animate-ping"></span>
            <span class="text-sm font-black text-red-600 font-baloo">جاري تسجيل رسالة صوتية...</span>
            <span id="recording-live-timer" class="font-mono text-sm font-black text-brand-dark">00:00</span>
          </div>

          <div class="flex items-center gap-2.5">
            <button 
              id="cancel-recording-btn" 
              type="button" 
              class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-base hover:bg-red-200 transition cursor-pointer active:scale-90"
              title="إلغاء التسجيل"
            >
              <i class="fa-solid fa-trash-can"></i>
            </button>

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

        <!-- Floating Bubble Sticker Drawer -->
        <div 
          id="chat-stickers-drawer" 
          class="${isStickersOpen ? 'flex' : 'hidden'} pointer-events-auto flex-col bg-[#FAF4ED]/98 dark:bg-[#221B17]/98 backdrop-blur-md border-2 border-brand-peachBorder dark:border-warm-darkBorder rounded-[30px] h-72 sm:h-80 transition-all overflow-hidden shadow-nav"
        >
          ${renderStickersDrawerInnerHtml()}
        </div>

        <!-- Floating Bubble Composer Bar -->
        <div class="pointer-events-auto bg-[#FFF9E9]/95 dark:bg-[#27201B]/95 backdrop-blur-md border-2 border-brand-peachBorder dark:border-warm-darkBorder rounded-[34px] p-2 shadow-nav flex items-center gap-2">
          <button
            id="chat-attachment-btn"
            type="button"
            class="w-11 h-11 rounded-full bg-white dark:bg-[#342A24] border-2 border-brand-peachBorder dark:border-warm-darkBorder text-brand-orange hover:bg-brand-orange hover:text-white flex items-center justify-center text-lg transition-all active:scale-90 cursor-pointer shadow-sm shrink-0"
            title="إرفاق صورة أو ملف"
            aria-label="إرفاق ملف"
          >
            <i class="fa-solid fa-paperclip"></i>
          </button>

          <button
            id="chat-stickers-btn"
            type="button"
            class="w-11 h-11 rounded-full bg-white dark:bg-[#342A24] border-2 ${
              isStickersOpen
                ? 'border-brand-orange text-brand-orange bg-brand-orange/15 shadow-soft'
                : 'border-brand-peachBorder dark:border-warm-darkBorder text-warm-textSec dark:text-[#D1C7BD]'
            } hover:border-brand-orange hover:text-brand-orange flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm shrink-0"
            title="ملصقات مياو"
            aria-label="ملصقات"
          >
            <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M5 4h11l4 4v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
              <path d="M15 4v4h4" />
              <path d="M8.5 11.5 9.5 10l1.5 1.2h2l1.5-1.2 1 1.5c.6.8.9 1.6.9 2.5 0 2.1-1.8 3.5-4.4 3.5S7.6 16.1 7.6 14c0-.9.3-1.7.9-2.5Z" />
            </svg>
          </button>

          <div class="flex-1 min-w-0 min-h-[46px] relative flex items-center bg-white dark:bg-[#1E1713] border-2 border-brand-peachBorder/90 dark:border-warm-darkBorder rounded-full px-4 py-1 shadow-sm focus-within:border-brand-orange transition-colors">
            <input
              type="text"
              id="chat-message-input"
              value="${escapeAttr(state.getChatDraft(conv.id))}"
              placeholder="اكتب رسالة..."
              class="w-full min-w-0 bg-transparent border-none py-1 text-[15px] sm:text-base font-bold text-brand-dark dark:text-white placeholder-brand-subtleGray dark:placeholder-[#A89F91] focus:outline-none font-baloo"
              autocomplete="off"
            />
          </div>

          <button
            id="chat-action-btn"
            class="w-11 h-11 rounded-full bg-brand-orange text-white flex items-center justify-center hover:bg-brand-orangeHover active:scale-90 transition-all shadow-soft cursor-pointer shrink-0 font-baloo"
            type="button"
            aria-label="تسجيل صوتي أو إرسال"
            title="${state.getChatDraft(conv.id).trim() ? 'إرسال' : 'تسجيل صوتي'}"
          >
            <i id="chat-action-icon" class="fa-solid ${state.getChatDraft(conv.id).trim() ? 'fa-paper-plane' : 'fa-microphone'} text-lg"></i>
          </button>
        </div>
      </footer>

      <div id="chat-media-preview-slot">${renderMediaPreviewModalHtml()}</div>
      <div id="chat-image-lightbox-slot">${renderImageLightboxHtml()}</div>

    </div>
  `;
}

function bindChatCategoryButtons(): void {
  const chatFilterBtns = document.querySelectorAll<HTMLButtonElement>('.chat-category-btn');
  chatFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-chat-filter') as
        | 'all'
        | 'mating'
        | 'adoption'
        | 'clinics'
        | null;
      if (!filter || filter === chatCategoryFilter) return;
      chatCategoryFilter = filter;
      refreshChatListInPlace();
    });
  });
}

function attachChatListBodyEvents(scope: ParentNode = document): void {
  // Explore button in empty state
  const exploreBtn = scope.querySelector('#explore-pets-btn');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      state.setCurrentTab('mating');
    });
  }

  // Incoming / Outgoing requests direction tabs
  scope.querySelectorAll<HTMLButtonElement>('.req-direction-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const dir = btn.getAttribute('data-req-direction');
      if (dir === 'incoming' || dir === 'outgoing') {
        if (requestsDirectionFilter === dir && state.getChatSubTab() === 'requests') return;
        requestsDirectionFilter = dir;
        state.setChatSubTab('requests', { silent: true });
        refreshChatListInPlace();
      }
    });
  });

  // Conversation card click + Long-press to open quick options menu
  const conversationCards = scope.querySelectorAll<HTMLElement>('.conversation-item-card');
  conversationCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      if ((e.target as HTMLElement).closest('.meow-more-menu-container')) {
        return;
      }
      if (card.dataset.longPressConsumed === '1') {
        delete card.dataset.longPressConsumed;
        return;
      }
      const convId = card.getAttribute('data-conversation-id');
      if (convId) {
        state.setActiveConversationId(convId);
      }
    });

    attachLongPress(card, () => {
      const menuBtn = card.querySelector<HTMLButtonElement>('.meow-more-btn');
      if (menuBtn) {
        card.dataset.longPressConsumed = '1';
        window.setTimeout(() => {
          delete card.dataset.longPressConsumed;
        }, 400);
        menuBtn.click();
      }
    });
  });

  // Preview sender's pet profile before accepting or rejecting request (no status change)
  const previewPetTriggers = scope.querySelectorAll<HTMLElement>(
    '.preview-request-pet-btn, .preview-request-pet-card'
  );
  previewPetTriggers.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const reqId = el.getAttribute('data-preview-request-id');
      if (!reqId) return;
      const req = state.getContactRequests().find((r) => r.id === reqId);
      if (!req) return;
      state.markRequestNotificationsRead(req.id);
      const pet = state.getPetForRequestPreview(req);
      if (pet) {
        state.setSelectedPetForDetail(pet);
      }
    });
  });

  // Approve request
  const approveBtns = scope.querySelectorAll<HTMLButtonElement>('.approve-request-btn');
  approveBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const reqId = btn.getAttribute('data-approve-request-id');
      if (reqId) {
        state.approveContactRequest(reqId);
      }
    });
  });

  // Reject request
  const rejectBtns = scope.querySelectorAll<HTMLButtonElement>('.reject-request-btn');
  rejectBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const reqId = btn.getAttribute('data-reject-request-id');
      if (reqId) {
        state.rejectContactRequest(reqId);
      }
    });
  });

  // Withdraw outgoing request
  const withdrawBtns = scope.querySelectorAll<HTMLButtonElement>('.withdraw-request-btn');
  withdrawBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const reqId = btn.getAttribute('data-withdraw-request-id');
      if (reqId) {
        state.withdrawContactRequest(reqId);
        showMobileToast('تم سحب الطلب', 'default', 1500);
      }
    });
  });

  // Direct to exact matching conversation for an accepted request
  const directBtns = scope.querySelectorAll<HTMLButtonElement>('.view-conversation-direct-btn');
  directBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const reqId = btn.getAttribute('data-request-id') || '';
      const otherId = btn.getAttribute('data-other-user-id') || '';
      const convs = state.getConversations();
      const matched =
        convs.find((c) => c.requestId === reqId) ||
        (otherId ? convs.find((c) => c.otherUserId === otherId) : undefined) ||
        convs[0];
      state.setChatSubTab('chats', { silent: true });
      state.setActiveConversationId(matched?.id || null);
    });
  });
}

function refreshChatListInPlace(): void {
  const activeSubTab = state.getChatSubTab();
  const incomingRequests = state.getIncomingContactRequests();
  const outgoingRequests = state.getOutgoingContactRequests();
  const incomingPendingCount = state.getPendingRequestsCount();
  const totalRequestsCount = incomingRequests.length + outgoingRequests.length;
  const allConversationsCount = state.getConversations().length;
  const filteredConversations = getFilteredChatConversations();

  const pillsContainer = document.getElementById('chat-category-pills-container');
  if (pillsContainer) {
    pillsContainer.outerHTML = renderChatCategoryPillsHtml(allConversationsCount);
    bindChatCategoryButtons();
  }

  const pillEl = document.getElementById('chat-subtab-pill');
  if (pillEl) {
    pillEl.style.right = activeSubTab === 'chats' ? '0.25rem' : 'calc(50%)';
  }

  const chatsBtn = document.getElementById('subtab-chats-btn');
  const requestsBtn = document.getElementById('subtab-requests-btn');
  const chatsBadge = document.getElementById('subtab-chats-badge');
  const requestsBadge = document.getElementById('subtab-requests-badge');

  if (chatsBtn) {
    chatsBtn.className = `relative z-10 h-10 px-3.5 rounded-full text-xs sm:text-sm font-black transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer font-baloo ${
      activeSubTab === 'chats'
        ? 'text-white'
        : 'text-brand-dark/70 dark:text-[#D1C7BD] hover:text-brand-orange'
    }`;
  }
  if (requestsBtn) {
    requestsBtn.className = `relative z-10 h-10 px-3.5 rounded-full text-xs sm:text-sm font-black transition-colors duration-200 flex items-center justify-center gap-2 cursor-pointer font-baloo ${
      activeSubTab === 'requests'
        ? 'text-white'
        : 'text-brand-dark/70 dark:text-[#D1C7BD] hover:text-brand-orange'
    }`;
  }
  if (chatsBadge) {
    chatsBadge.textContent = String(filteredConversations.length);
    chatsBadge.className = `px-2 py-0.5 rounded-full text-[11px] transition-colors ${
      activeSubTab === 'chats'
        ? 'bg-white text-brand-orange font-black'
        : 'bg-brand-peachBorder/40 dark:bg-[#342A24] text-brand-dark dark:text-white'
    }`;
  }
  if (requestsBadge) {
    requestsBadge.textContent = String(
      incomingPendingCount > 0 ? incomingPendingCount : totalRequestsCount
    );
    requestsBadge.className = `px-2 py-0.5 rounded-full text-[11px] transition-colors ${
      incomingPendingCount > 0
        ? 'bg-red-500 text-white font-black animate-pulse'
        : activeSubTab === 'requests'
          ? 'bg-white text-brand-orange font-black'
          : 'bg-brand-peachBorder/40 dark:bg-[#342A24] text-brand-dark dark:text-white'
    }`;
  }

  const contentEl = document.getElementById('chat-tab-content');
  if (contentEl) {
    contentEl.classList.remove('meow-fade-in');
    contentEl.innerHTML = renderChatListBodyHtml(
      filteredConversations,
      incomingRequests,
      outgoingRequests,
      activeSubTab
    );
    void contentEl.offsetWidth;
    contentEl.classList.add('meow-fade-in');
    attachChatListBodyEvents(contentEl);
    attachThreeDotsMenuEvents(contentEl);
  }
}

function updateReplyPreviewBarInPlace(): void {
  const slot = document.getElementById('chat-reply-preview-slot');
  if (!slot) return;
  slot.innerHTML = renderReplyPreviewBarHtml();
  const cancelBtn = document.getElementById('chat-cancel-reply-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      activeReplyTarget = null;
      updateReplyPreviewBarInPlace();
    });
  }
}

function updateMediaPreviewSlotInPlace(): void {
  const slot = document.getElementById('chat-media-preview-slot');
  if (!slot) return;
  slot.innerHTML = renderMediaPreviewModalHtml();
  attachMediaPreviewModalEvents();
}

function updateImageLightboxSlotInPlace(): void {
  const slot = document.getElementById('chat-image-lightbox-slot');
  if (!slot) return;
  slot.innerHTML = renderImageLightboxHtml();
  attachImageLightboxEvents();
}

function refreshStickersDrawerInPlace(): void {
  const drawer = document.getElementById('chat-stickers-drawer');
  if (!drawer) return;
  const searchFocused = document.activeElement?.id === 'sticker-search-input';
  const searchInputPrev = document.getElementById('sticker-search-input') as HTMLInputElement | null;
  const cursorPos = searchInputPrev?.selectionStart ?? stickerSearchQuery.length;

  drawer.innerHTML = renderStickersDrawerInnerHtml();
  attachStickersDrawerInnerEvents();

  if (searchFocused) {
    const newInput = document.getElementById('sticker-search-input') as HTMLInputElement | null;
    if (newInput) {
      newInput.focus();
      try {
        newInput.setSelectionRange(cursorPos, cursorPos);
      } catch {
        // ignore selection error
      }
    }
  }
}

function scrollChatToBottom(smooth = false): void {
  const container = document.getElementById('chat-messages-container');
  if (!container) return;
  if (typeof container.scrollTo === 'function') {
    container.scrollTo({
      top: container.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  } else {
    container.scrollTop = container.scrollHeight;
  }
  userIsNearBottom = true;
  firstUnreadMsgId = null;
  document.getElementById('chat-scroll-to-bottom-btn')?.classList.add('hidden');
  document.getElementById('chat-scroll-to-bottom-btn')?.classList.remove('flex');
}

function copyTextToClipboard(text: string): void {
  if (!text) return;
  if (navigator.clipboard?.writeText) {
    navigator.clipboard
      .writeText(text)
      .then(() => showMobileToast('تم نسخ نص الرسالة', 'success'))
      .catch(() => {
        copyTextFallback(text);
        showMobileToast('تم نسخ نص الرسالة', 'success');
      });
  } else {
    copyTextFallback(text);
    showMobileToast('تم نسخ نص الرسالة', 'success');
  }
}

function attachChatMessagesEvents(scope: ParentNode, conv: Conversation): void {
  // Audio playback buttons
  scope.querySelectorAll<HTMLButtonElement>('.play-audio-msg-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const msgId = btn.getAttribute('data-msg-id');
      let audioUrl = sanitizeAudioSrc(btn.getAttribute('data-audio-url'));
      if (!audioUrl && msgId) {
        const refreshed = await state.ensureMessageMediaUrl(conv.id, msgId);
        audioUrl = sanitizeAudioSrc(refreshed);
      }

      if (currentlyPlayingAudio && currentPlayingMsgId === msgId) {
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

        void audio.play();
        audio.onended = () => {
          btn.innerHTML = '<i class="fa-solid fa-play text-sm ml-0.5"></i>';
          currentlyPlayingAudio = null;
          currentPlayingMsgId = null;
        };
      } else {
        showMobileToast('المقطع الصوتي غير متاح للتشغيل حاليًا.', 'default');
      }
    });
  });

  // Image click -> Lightbox + signed URL fallback on broken image
  scope.querySelectorAll<HTMLImageElement>('.chat-msg-image-preview').forEach((img) => {
    img.addEventListener('click', () => {
      const url = sanitizeImageSrc(img.getAttribute('data-chat-image-preview') || img.src, '');
      const msgId = img.getAttribute('data-chat-image-msg-id');
      if (url) {
        previewChatImageUrl = url;
        previewChatImageMsgId = msgId;
        updateImageLightboxSlotInPlace();
      }
    });
    img.addEventListener('error', () => {
      if (img.dataset.refreshedUrl === '1') return;
      img.dataset.refreshedUrl = '1';
      const msgId = img.getAttribute('data-chat-image-msg-id');
      if (msgId) {
        void state.ensureMessageMediaUrl(conv.id, msgId).then((signed) => {
          if (signed) {
            img.src = sanitizeImageSrc(signed, SAFE_FALLBACK_PET_SVG);
            img.setAttribute('data-chat-image-preview', signed);
          }
        });
      }
    });
  });

  // Retry failed message
  scope.querySelectorAll<HTMLButtonElement>('.chat-retry-msg-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const msgId = btn.getAttribute('data-retry-msg-id');
      if (msgId) {
        void state.retryFailedMessage(conv.id, msgId);
      }
    });
  });

  // Reply button on message
  scope.querySelectorAll<HTMLButtonElement>('.chat-msg-reply-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const msgId = btn.getAttribute('data-reply-msg-id');
      const targetMsg = conv.messages.find((m) => m.id === msgId);
      if (!targetMsg || targetMsg.deletedAt) return;
      activeReplyTarget = {
        messageId: targetMsg.id,
        senderName: targetMsg.isFromUser ? 'أنت' : conv.otherUserName,
        text: getMessagePreviewSnippet(targetMsg),
        type: targetMsg.type || 'text',
      };
      updateReplyPreviewBarInPlace();
      document.getElementById('chat-message-input')?.focus();
    });
  });

  // Copy button on message
  scope.querySelectorAll<HTMLButtonElement>('.chat-msg-copy-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const msgId = btn.getAttribute('data-copy-msg-id');
      const targetMsg = conv.messages.find((m) => m.id === msgId);
      const text = targetMsg?.text?.trim() || '';
      if (text) copyTextToClipboard(text);
    });
  });

  // Soft-delete own message
  scope.querySelectorAll<HTMLButtonElement>('.chat-msg-delete-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const msgId = btn.getAttribute('data-delete-msg-id');
      if (msgId) {
        void state.softDeleteMessage(conv.id, msgId);
      }
    });
  });

  // Jump to quoted message
  scope.querySelectorAll<HTMLButtonElement>('.chat-reply-quote-jump').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = btn.getAttribute('data-jump-reply-id');
      if (!targetId) return;
      const targetRow = document.querySelector<HTMLElement>(`#chat-messages-list [data-msg-id="${targetId}"]`);
      if (targetRow) {
        targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetRow.classList.add('meow-chat-search-hit');
        window.setTimeout(() => targetRow.classList.remove('meow-chat-search-hit'), 1400);
      }
    });
  });

  // Long-press on message copies text
  scope.querySelectorAll<HTMLElement>('#chat-messages-list > [data-msg-id]').forEach((row) => {
    attachLongPress(row, () => {
      const msgId = row.getAttribute('data-msg-id');
      const targetMsg = conv.messages.find((m) => m.id === msgId);
      if (targetMsg?.deletedAt) return;
      const textToCopy = targetMsg?.text?.trim() || '';
      if (!textToCopy) {
        showMobileToast('يمكن نسخ الرسائل النصية فقط', 'default');
        return;
      }
      copyTextToClipboard(textToCopy);
    });
  });
}

function attachMediaPreviewModalEvents(): void {
  const previewModal = document.getElementById('chat-media-preview-modal');
  const cancelMediaBtn = document.getElementById('cancel-chat-media-preview-btn');
  const cancelMediaSecondaryBtn = document.getElementById('cancel-chat-media-secondary-btn');
  const confirmSendMediaBtn = document.getElementById('confirm-send-chat-media-btn');
  const mediaCaptionInput = document.getElementById('chat-media-caption-input') as HTMLInputElement | null;
  const filePicker = document.getElementById('chat-file-picker') as HTMLInputElement | null;

  const dismissPendingMedia = () => {
    if (pendingChatAttachment?.isSending) return;
    pendingChatAttachment = null;
    if (filePicker) filePicker.value = '';
    updateMediaPreviewSlotInPlace();
  };

  mediaCaptionInput?.addEventListener('input', () => {
    if (pendingChatAttachment) {
      pendingChatAttachment.caption = mediaCaptionInput.value;
    }
  });

  cancelMediaBtn?.addEventListener('click', dismissPendingMedia);
  cancelMediaSecondaryBtn?.addEventListener('click', dismissPendingMedia);
  previewModal?.addEventListener('click', (e) => {
    if (e.target === previewModal) {
      dismissPendingMedia();
    }
  });

  if (confirmSendMediaBtn) {
    const sendPendingMedia = async () => {
      if (!pendingChatAttachment || pendingChatAttachment.isSending) return;
      const conv = state.getActiveConversation();
      if (!conv) return;

      const caption = mediaCaptionInput?.value.trim() || '';
      pendingChatAttachment.caption = mediaCaptionInput?.value || '';

      if (pendingChatAttachment.type === 'image' && pendingChatAttachment.pendingFile) {
        pendingChatAttachment.isSending = true;
        pendingChatAttachment.errorMessage = undefined;
        updateMediaPreviewSlotInPlace();

        const res = await state.sendChatImageAttachmentAsync({
          conversationId: conv.id,
          file: pendingChatAttachment.pendingFile,
          caption,
          replyTo: activeReplyTarget ?? undefined,
        });

        if (!res.success) {
          if (pendingChatAttachment) {
            pendingChatAttachment.isSending = false;
            pendingChatAttachment.errorMessage =
              res.errorMessage || 'تعذر رفع وإرسال الصورة، جرب تاني.';
          }
          updateMediaPreviewSlotInPlace();
          return;
        }

        pendingChatAttachment = null;
        activeReplyTarget = null;
        justSentMessageFlag = true;
        updateReplyPreviewBarInPlace();
        updateMediaPreviewSlotInPlace();
        setTimeout(() => scrollChatToBottom(), 60);
        return;
      }

      const attachment = pendingChatAttachment;
      pendingChatAttachment = null;
      state.sendMessage(
        {
          type: attachment.type,
          fileUrl: attachment.fileUrl,
          fileName: attachment.fileName,
          fileSize: attachment.fileSize,
          text: caption || undefined,
        },
        activeReplyTarget ?? undefined
      );
      activeReplyTarget = null;
      justSentMessageFlag = true;
      updateReplyPreviewBarInPlace();
      updateMediaPreviewSlotInPlace();
      setTimeout(() => scrollChatToBottom(), 60);
    };

    confirmSendMediaBtn.addEventListener('click', () => {
      void sendPendingMedia();
    });
    mediaCaptionInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        void sendPendingMedia();
      }
    });
  }
}

function attachImageLightboxEvents(): void {
  const lightbox = document.getElementById('chat-image-lightbox');
  const closeLightboxBtn = document.getElementById('close-chat-image-lightbox-btn');
  const downloadBtn = document.getElementById('chat-lightbox-download-btn');
  const lightboxImg = document.getElementById('chat-lightbox-img') as HTMLImageElement | null;

  const closeLightbox = () => {
    previewChatImageUrl = null;
    previewChatImageMsgId = null;
    updateImageLightboxSlotInPlace();
  };

  closeLightboxBtn?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  if (lightboxImg && previewChatImageMsgId) {
    const conv = state.getActiveConversation();
    const msgId = previewChatImageMsgId;
    lightboxImg.addEventListener('error', () => {
      if (!conv || lightboxImg.dataset.refreshedUrl === '1') return;
      lightboxImg.dataset.refreshedUrl = '1';
      void state.ensureMessageMediaUrl(conv.id, msgId).then((signed) => {
        if (signed) {
          previewChatImageUrl = signed;
          lightboxImg.src = sanitizeImageSrc(signed, SAFE_FALLBACK_PET_SVG);
        }
      });
    });
  }

  downloadBtn?.addEventListener('click', async () => {
    const url = previewChatImageUrl;
    if (!url) return;
    try {
      const a = document.createElement('a');
      if (url.startsWith('data:') || url.startsWith('blob:')) {
        a.href = url;
        a.download = `meow-chat-${Date.now()}.jpg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        showMobileToast('تم حفظ الصورة', 'success');
        return;
      }
      const res = await fetch(url);
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);
      a.href = objUrl;
      a.download = `meow-chat-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(objUrl), 2500);
      showMobileToast('تم حفظ الصورة', 'success');
    } catch {
      const a = document.createElement('a');
      a.href = sanitizeUrl(url, '');
      a.download = `meow-chat-${Date.now()}.jpg`;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  });
}

function attachStickersDrawerInnerEvents(): void {
  const stickersBtn = document.getElementById('chat-stickers-btn');
  const stickersDrawer = document.getElementById('chat-stickers-drawer');
  const closeStickersBtn = document.getElementById('close-stickers-btn');
  const createStickerTile = document.getElementById('create-sticker-tile');
  const addStickerPackBtn = document.getElementById('add-sticker-pack-btn');
  const importStickersBtn = document.getElementById('import-stickers-btn');
  const stickerSearchBtn = document.getElementById('sticker-search-btn');
  const stickerSearchInput = document.getElementById('sticker-search-input') as HTMLInputElement | null;
  const stickerUploadInput = document.getElementById('sticker-upload-input') as HTMLInputElement | null;

  if (closeStickersBtn && stickersDrawer && stickersBtn) {
    const closeStickers = () => {
      isStickersOpen = false;
      stickersDrawer.classList.remove('flex');
      stickersDrawer.classList.add('hidden');
      stickersBtn.classList.remove('border-brand-orange', 'text-brand-orange', 'bg-brand-orange/15', 'shadow-soft');
      stickersBtn.classList.add('text-warm-textSec');
    };
    closeStickersBtn.addEventListener('click', closeStickers);

    attachSheetDragToDismiss(stickersDrawer, {
      handleSelector: '#chat-stickers-drag-handle',
      scrollContainerSelector: '#chat-stickers-scroll',
      onClose: closeStickers,
    });
  }

  stickerSearchBtn?.addEventListener('click', () => {
    isStickerSearchOpen = !isStickerSearchOpen;
    if (!isStickerSearchOpen) stickerSearchQuery = '';
    isStickersOpen = true;
    refreshStickersDrawerInPlace();
    if (isStickerSearchOpen) {
      document.getElementById('sticker-search-input')?.focus();
    }
  });

  stickerSearchInput?.addEventListener('input', () => {
    stickerSearchQuery = stickerSearchInput.value;
    isStickersOpen = true;
    refreshStickersDrawerInPlace();
  });

  const triggerStickerPicker = () => {
    stickerUploadInput?.click();
  };
  createStickerTile?.addEventListener('click', triggerStickerPicker);
  addStickerPackBtn?.addEventListener('click', triggerStickerPicker);
  importStickersBtn?.addEventListener('click', triggerStickerPicker);

  document.querySelectorAll<HTMLButtonElement>('.sticker-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const nextTab = btn.getAttribute('data-sticker-tab') as
        | 'all'
        | 'recent'
        | 'favorites'
        | 'custom'
        | null;
      if (!nextTab || nextTab === activeStickerTab) return;
      activeStickerTab = nextTab;
      isStickersOpen = true;
      refreshStickersDrawerInPlace();
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.sticker-fav-toggle-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const stickerId = btn.getAttribute('data-sticker-id');
      if (!stickerId) return;
      const nowFav = state.toggleFavoriteSticker(stickerId);
      showMobileToast(nowFav ? 'انضاف للمفضلة ⭐' : 'اتشال من المفضلة', 'default', 1300);
      refreshStickersDrawerInPlace();
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.custom-sticker-send-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const stickerId = btn.getAttribute('data-sticker-id') || '';
      const stickerUrl = btn.getAttribute('data-sticker-url') || '';
      const stickerTitle = btn.getAttribute('data-sticker-title') || 'ملصق مخصص';
      if (stickerId) state.recordRecentSticker(stickerId);

      state.sendMessage(
        {
          type: 'sticker',
          stickerUrl,
          stickerTitle,
        },
        activeReplyTarget ?? undefined
      );
      activeReplyTarget = null;
      justSentMessageFlag = true;
      updateReplyPreviewBarInPlace();

      isStickersOpen = false;
      if (stickersDrawer) {
        stickersDrawer.classList.remove('flex');
        stickersDrawer.classList.add('hidden');
      }
      if (stickersBtn) {
        stickersBtn.classList.remove('border-brand-orange', 'text-brand-orange', 'bg-brand-orange/15', 'shadow-soft');
        stickersBtn.classList.add('text-warm-textSec');
      }

      setTimeout(() => scrollChatToBottom(), 80);
    });
  });

  document.querySelectorAll<HTMLButtonElement>('.delete-custom-sticker-btn').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-sticker-id');
      if (id) {
        isStickersOpen = true;
        await state.removeCustomSticker(id);
        refreshStickersDrawerInPlace();
        showMobileToast('تم حذف الملصق', 'default', 1400);
      }
    });
  });
}

export function patchActiveChatRoomInPlace(): boolean {
  const conv = state.getActiveConversation();
  if (!conv) return false;
  const roomEl = document.getElementById('active-chat-room');
  if (!roomEl || roomEl.getAttribute('data-conv-id') !== conv.id) {
    return false;
  }

  const scrollContainer = document.getElementById('chat-messages-container');
  const listEl = document.getElementById('chat-messages-list');
  if (!scrollContainer || !listEl) return false;

  const prevScrollTop = scrollContainer.scrollTop;
  const distFromBottom =
    scrollContainer.scrollHeight - prevScrollTop - scrollContainer.clientHeight;
  const wasNearBottom = distFromBottom <= 90 || userIsNearBottom;

  const prevMsgCount = knownConvMsgCountMap.get(conv.id) ?? conv.messages.length;
  if (conv.messages.length > prevMsgCount && !wasNearBottom && !firstUnreadMsgId) {
    const newlyAdded = conv.messages.slice(prevMsgCount);
    const firstIncoming = newlyAdded.find(
      (m) => !m.isFromUser && m.senderId !== 'system'
    );
    if (firstIncoming) {
      firstUnreadMsgId = firstIncoming.id;
    }
  }
  knownConvMsgCountMap.set(conv.id, conv.messages.length);

  // Update header metadata + mute button state in-place
  const resolvedPet = state.getPetForConversation(conv);
  const isGroupConv =
    conv.adoptionType === 'group' || resolvedPet?.adoptionType === 'group';
  const groupCount =
    conv.groupCount ||
    resolvedPet?.groupCount ||
    conv.groupMembers?.length ||
    resolvedPet?.groupMembers?.length ||
    2;

  const subtitleEl = document.getElementById('chat-header-subtitle');
  if (subtitleEl) {
    subtitleEl.innerHTML = renderChatHeaderSubtitle(conv, isGroupConv, groupCount);
  }
  const mutedBadge = document.getElementById('chat-header-muted-badge');
  if (mutedBadge) {
    mutedBadge.className = `${
      conv.isMuted ? 'inline-flex' : 'hidden'
    } px-1.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-brand-subtleGray text-[10px] shrink-0`;
  }
  const muteBtn = document.getElementById('chat-mute-toggle-btn');
  if (muteBtn) {
    muteBtn.setAttribute('aria-label', conv.isMuted ? 'إلغاء كتم المحادثة' : 'كتم المحادثة');
    muteBtn.setAttribute('title', conv.isMuted ? 'إلغاء الكتم' : 'كتم الإشعارات');
    muteBtn.className = `w-9 h-9 rounded-full ${
      conv.isMuted
        ? 'bg-brand-orange/15 text-brand-orange'
        : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/10 text-brand-dark dark:text-white'
    } flex items-center justify-center text-sm transition cursor-pointer active:scale-90`;
    muteBtn.innerHTML = `<i class="fa-solid ${conv.isMuted ? 'fa-bell-slash' : 'fa-bell'}"></i>`;
  }

  // Update search hit counter if open
  if (inRoomSearchOpen) {
    const countEl = document.getElementById('chat-inroom-search-count');
    const q = inRoomSearchQuery.trim().toLowerCase();
    if (countEl) {
      if (q) {
        const hits = conv.messages.filter(
          (m) =>
            m.senderId !== 'system' &&
            !m.deletedAt &&
            ((m.text || '').toLowerCase().includes(q) ||
              (m.fileName || '').toLowerCase().includes(q) ||
              (m.stickerTitle || '').toLowerCase().includes(q))
        ).length;
        countEl.textContent = String(hits);
        countEl.className =
          'text-[11px] font-black text-brand-orange px-2 py-1 rounded-full bg-brand-orange/10 shrink-0';
      } else {
        countEl.className = 'hidden';
      }
    }
  }

  // Patch ONLY the messages list container (preserving #chat-message-input focus/value & drawers)
  listEl.innerHTML = renderChatMessagesListHtml(conv);
  attachChatMessagesEvents(listEl, conv);

  if (justSentMessageFlag || wasNearBottom) {
    scrollChatToBottom();
    justSentMessageFlag = false;
  } else {
    scrollContainer.scrollTop = prevScrollTop;
    const jumpBtn = document.getElementById('chat-scroll-to-bottom-btn');
    if (jumpBtn) {
      jumpBtn.classList.remove('hidden');
      jumpBtn.classList.add('flex');
    }
  }

  return true;
}

export function attachChatEvents(): void {
  // Sub-tabs & category pills
  const chatsSubTabBtn = document.getElementById('subtab-chats-btn');
  const requestsSubTabBtn = document.getElementById('subtab-requests-btn');

  bindChatCategoryButtons();

  if (chatsSubTabBtn) {
    chatsSubTabBtn.addEventListener('click', () => {
      const wasClinics = chatCategoryFilter === 'clinics';
      if (state.getChatSubTab() === 'chats' && !wasClinics) return;
      if (wasClinics) chatCategoryFilter = 'all';
      state.setChatSubTab('chats', { silent: true });
      refreshChatListInPlace();
    });
  }
  if (requestsSubTabBtn) {
    requestsSubTabBtn.addEventListener('click', () => {
      const wasClinics = chatCategoryFilter === 'clinics';
      if (state.getChatSubTab() === 'requests' && !wasClinics) return;
      if (wasClinics) chatCategoryFilter = 'all';
      state.setChatSubTab('requests', { silent: true });
      refreshChatListInPlace();
    });
  }

  // Trigger one-time confetti celebration on approved mating chat open
  const currentActiveConv = state.getActiveConversation();
  if (
    currentActiveConv &&
    state.isMatingConversationApproved(currentActiveConv) &&
    state.getActiveConfettiBurstKey() === state.getCelebrationKeyForConversation(currentActiveConv)
  ) {
    state.consumeActiveConfettiBurstKey();
    launchOneTimeMatingConfetti();
  }

  // Pull-to-refresh on chat list (when outside active chat room and no modal open)
  const chatListRoot = document.getElementById('chat-list-view-root');
  if (chatListRoot && !currentActiveConv) {
    attachPullToRefresh(chatListRoot, {
      isBlocked: () =>
        Boolean(
          state.getActiveConversation() ||
            state.getIsFilterModalOpen() ||
            state.isNotificationsOpen() ||
            state.isSettingsOpen() ||
            state.getPendingDeleteConversation() ||
            document.querySelector('.meow-more-dropdown:not(.hidden)')
        ),
      onRefresh: async () => {
        await state.refreshFeed('chat');
        showMobileToast('تم التحديث', 'success', 1500);
      },
    });
  }

  attachChatListBodyEvents(document);

  if (!currentActiveConv) return;

  // Bind message-level interactions inside #chat-messages-list
  const messagesListEl = document.getElementById('chat-messages-list');
  if (messagesListEl) {
    attachChatMessagesEvents(messagesListEl, currentActiveConv);
  }

  // Back button in chat room
  const backBtn = document.getElementById('back-to-chats-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (currentlyPlayingAudio) {
        currentlyPlayingAudio.pause();
        currentlyPlayingAudio = null;
        currentPlayingMsgId = null;
      }
      isGroupDetailsExpanded = false;
      previewChatImageUrl = null;
      previewChatImageMsgId = null;
      pendingChatAttachment = null;
      activeReplyTarget = null;
      inRoomSearchOpen = false;
      inRoomSearchQuery = '';
      firstUnreadMsgId = null;
      state.setActiveConversationId(null);
    });
  }

  // Mute / unmute conversation toggle
  const muteToggleBtn = document.getElementById('chat-mute-toggle-btn');
  if (muteToggleBtn) {
    muteToggleBtn.addEventListener('click', () => {
      const conv = state.getActiveConversation();
      if (!conv) return;
      const nowMuted = state.toggleMuteConversation(conv.id);
      showMobileToast(nowMuted ? 'تم كتم إشعارات المحادثة' : 'تم إلغاء كتم المحادثة', 'default', 1600);
    });
  }

  // In-room search bar toggle & live filtering
  const searchToggleBtn = document.getElementById('chat-inroom-search-toggle-btn');
  const searchBar = document.getElementById('chat-inroom-search-bar');
  const searchInput = document.getElementById('chat-inroom-search-input') as HTMLInputElement | null;
  const searchCloseBtn = document.getElementById('chat-inroom-search-close-btn');

  if (searchToggleBtn && searchBar) {
    searchToggleBtn.addEventListener('click', () => {
      inRoomSearchOpen = !inRoomSearchOpen;
      if (inRoomSearchOpen) {
        searchBar.classList.remove('hidden');
        searchBar.classList.add('flex');
        searchToggleBtn.classList.add('bg-brand-orange', 'text-white');
        searchToggleBtn.classList.remove('bg-transparent');
        searchInput?.focus();
      } else {
        inRoomSearchQuery = '';
        if (searchInput) searchInput.value = '';
        searchBar.classList.remove('flex');
        searchBar.classList.add('hidden');
        searchToggleBtn.classList.remove('bg-brand-orange', 'text-white');
        searchToggleBtn.classList.add('bg-transparent');
      }
      patchActiveChatRoomInPlace();
    });
  }
  searchInput?.addEventListener('input', () => {
    inRoomSearchQuery = searchInput.value;
    patchActiveChatRoomInPlace();
  });
  searchCloseBtn?.addEventListener('click', () => {
    inRoomSearchOpen = false;
    inRoomSearchQuery = '';
    if (searchInput) searchInput.value = '';
    searchBar?.classList.remove('flex');
    searchBar?.classList.add('hidden');
    searchToggleBtn?.classList.remove('bg-brand-orange', 'text-white');
    searchToggleBtn?.classList.add('bg-transparent');
    patchActiveChatRoomInPlace();
  });

  // Group adoption toggle & full pet profile inside active chat
  const toggleGroupDetailsBtn = document.getElementById('toggle-chat-group-details-btn');
  if (toggleGroupDetailsBtn) {
    toggleGroupDetailsBtn.addEventListener('click', () => {
      isGroupDetailsExpanded = !isGroupDetailsExpanded;
      const activeId = state.getActiveConversation()?.id || null;
      state.setActiveConversationId(activeId);
    });
  }

  const openPetDetailHandler = () => {
    const activeConv = state.getActiveConversation();
    if (!activeConv) return;
    const pet = state.getPetForConversation(activeConv);
    if (pet) {
      state.setSelectedPetForDetail(pet, null);
    }
  };
  document.getElementById('open-chat-pet-detail-btn')?.addEventListener('click', openPetDetailHandler);
  document.querySelectorAll<HTMLButtonElement>('.open-chat-group-full-btn').forEach((btn) => {
    btn.addEventListener('click', openPetDetailHandler);
  });

  document.querySelectorAll<HTMLButtonElement>('.open-chat-member-detail-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const memberId = btn.getAttribute('data-open-member-detail-id');
      const activeConv = state.getActiveConversation();
      if (!activeConv || !memberId) return;
      const pet = state.getPetForConversation(activeConv);
      if (pet) {
        state.setSelectedPetForDetail(pet, memberId);
      }
    });
  });

  // Reply bar cancel
  document.getElementById('chat-cancel-reply-btn')?.addEventListener('click', () => {
    activeReplyTarget = null;
    updateReplyPreviewBarInPlace();
  });

  // Lightbox & Media Preview Modal bindings
  attachImageLightboxEvents();
  attachMediaPreviewModalEvents();

  // --- WHATSAPP-LIKE TOOLS: Text, File Picker, Voice Notes ---
  const input = document.getElementById('chat-message-input') as HTMLInputElement | null;
  const actionBtn = document.getElementById('chat-action-btn');
  const actionIcon = document.getElementById('chat-action-icon');
  const filePicker = document.getElementById('chat-file-picker') as HTMLInputElement | null;
  const attachmentBtn = document.getElementById('chat-attachment-btn');
  const recordingUiBar = document.getElementById('recording-ui-bar');
  const recordingTimerDisplay = document.getElementById('recording-live-timer');
  const cancelRecBtn = document.getElementById('cancel-recording-btn');
  const sendRecBtn = document.getElementById('send-recording-btn');
  const container = document.getElementById('chat-messages-container');
  const jumpBottomBtn = document.getElementById('chat-scroll-to-bottom-btn');

  scrollChatToBottom();

  if (container) {
    container.addEventListener(
      'scroll',
      () => {
        const dist = container.scrollHeight - container.scrollTop - container.clientHeight;
        userIsNearBottom = dist <= 90;
        if (userIsNearBottom) {
          firstUnreadMsgId = null;
          jumpBottomBtn?.classList.add('hidden');
          jumpBottomBtn?.classList.remove('flex');
        } else {
          jumpBottomBtn?.classList.remove('hidden');
          jumpBottomBtn?.classList.add('flex');
        }
      },
      { passive: true }
    );
  }

  jumpBottomBtn?.addEventListener('click', () => {
    scrollChatToBottom(true);
  });

  if (input) {
    input.addEventListener('focus', () => {
      setTimeout(() => {
        if (userIsNearBottom) scrollChatToBottom();
      }, 250);
    });

    input.addEventListener('input', () => {
      const convId = state.getActiveConversation()?.id;
      if (convId) state.setChatDraft(convId, input.value);
      if (!actionIcon) return;
      if (input.value.trim().length > 0) {
        actionIcon.className = 'fa-solid fa-paper-plane text-lg';
        actionBtn?.setAttribute('title', 'إرسال');
      } else {
        actionIcon.className = 'fa-solid fa-microphone text-lg';
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

  const handleSend = () => {
    if (input && input.value.trim()) {
      const convId = state.getActiveConversation()?.id;
      const textToSend = input.value.trim();
      const replyToSend = activeReplyTarget ?? undefined;
      input.value = '';
      if (convId) state.setChatDraft(convId, '');
      activeReplyTarget = null;
      justSentMessageFlag = true;
      updateReplyPreviewBarInPlace();
      if (actionIcon) actionIcon.className = 'fa-solid fa-microphone text-lg';
      actionBtn?.setAttribute('title', 'تسجيل صوتي');
      state.sendMessage(textToSend, replyToSend);
      setTimeout(() => scrollChatToBottom(), 60);
    }
  };

  if (actionBtn) {
    actionBtn.addEventListener('click', () => {
      if (input && input.value.trim().length > 0) {
        handleSend();
      } else {
        startAudioRecording();
      }
    });
  }

  // File Attachment click (stages preview confirmation modal before sending)
  if (attachmentBtn && filePicker) {
    attachmentBtn.addEventListener('click', () => {
      filePicker.click();
    });

    filePicker.addEventListener('change', () => {
      const file = filePicker.files?.[0];
      if (!file) return;

      const isImage = file.type.startsWith('image/');
      const check = validateUploadedFile(file, isImage ? 'image' : 'document');
      if (!check.valid) {
        showMobileToast(check.errorMessage || 'الملف المحدد غير مدعوم أو يتجاوز الحد المسموح.', 'danger');
        filePicker.value = '';
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        const result = typeof e.target?.result === 'string' ? e.target.result : '';
        if (!result) {
          filePicker.value = '';
          return;
        }
        if (isImage) {
          const safeUrl = sanitizeImageSrc(result, '');
          if (!safeUrl) {
            showMobileToast('تعذر قراءة الصورة المحددة.', 'danger');
            filePicker.value = '';
            return;
          }
          pendingChatAttachment = {
            type: 'image',
            fileUrl: safeUrl,
            fileName: file.name,
            fileSize: `${Math.max(1, Math.round(file.size / 1024))} KB`,
            pendingFile: file,
          };
        } else {
          pendingChatAttachment = {
            type: 'file',
            fileUrl: result,
            fileName: file.name,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
            pendingFile: file,
          };
        }
        filePicker.value = '';
        updateMediaPreviewSlotInPlace();
      };

      reader.readAsDataURL(file);
    });
  }

  // Interactive Custom Stickers Drawer Toggle, Creation & Selection
  const stickersBtn = document.getElementById('chat-stickers-btn');
  const stickersDrawer = document.getElementById('chat-stickers-drawer');
  const stickerUploadInput = document.getElementById('sticker-upload-input') as HTMLInputElement | null;

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
      setTimeout(() => {
        if (userIsNearBottom) scrollChatToBottom();
      }, 150);
    });
  }

  attachStickersDrawerInnerEvents();

  if (stickerUploadInput) {
    stickerUploadInput.addEventListener('change', async () => {
      const files = Array.from(stickerUploadInput.files || []);
      stickerUploadInput.value = '';
      if (files.length === 0) return;

      let addedCount = 0;
      let lastError = '';

      for (const file of files) {
        const check = validateUploadedFile(file, 'image');
        if (!check.valid) {
          lastError = check.errorMessage || 'يرجى اختيار صور صالحة للملصقات.';
          continue;
        }

        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            const rawUrl = typeof e.target?.result === 'string' ? e.target.result : '';
            resolve(sanitizeImageSrc(rawUrl, ''));
          };
          reader.onerror = () => resolve('');
          reader.readAsDataURL(file);
        });

        if (!dataUrl) {
          lastError = 'تعذر قراءة إحدى الصور المحددة.';
          continue;
        }

        const title = file.name.replace(/\.[^/.]+$/, '') || 'ملصق مخصص';
        const res = await state.addCustomSticker(dataUrl, title);
        if (res.success) {
          addedCount++;
        } else if (res.errorMessage) {
          lastError = res.errorMessage;
        }
      }

      isStickersOpen = true;
      refreshStickersDrawerInPlace();
      if (addedCount > 0) {
        showMobileToast(
          addedCount === 1 ? 'تمت إضافة الملصق بنجاح' : `تمت إضافة ${addedCount} ملصقات بنجاح`,
          'success',
          1800
        );
      } else if (lastError) {
        showMobileToast(lastError, 'danger');
      }
    });
  }

  // Start real Audio Recording via MediaRecorder with Android WebView MIME negotiation
  const startAudioRecording = async () => {
    if (isRecordingAudio) return;
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
        if (import.meta.env.DEV) {
          sendFallbackVoiceNote();
        } else {
          showMobileToast('التسجيل الصوتي غير مدعوم على هذا الجهاز حاليًا.', 'danger');
        }
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      audioChunks = [];
      const preferredMimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/aac',
        'audio/ogg;codecs=opus',
      ];
      const supportedMimeType =
        typeof MediaRecorder.isTypeSupported === 'function'
          ? preferredMimeTypes.find((mime) => MediaRecorder.isTypeSupported(mime))
          : undefined;

      mediaRecorder = supportedMimeType
        ? new MediaRecorder(stream, { mimeType: supportedMimeType })
        : new MediaRecorder(stream);
      activeRecorderMimeType =
        mediaRecorder.mimeType || supportedMimeType || 'audio/webm';

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
      const errorName = err instanceof Error ? err.name : '';
      console.warn('Microphone permission or recording error:', err);
      if (import.meta.env.DEV && !errorName.includes('NotAllowed')) {
        sendFallbackVoiceNote();
        return;
      }
      if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
        showMobileToast(
          'تم رفض إذن الميكروفون. يرجى تفعيل صلاحية الميكروفون من إعدادات التطبيق.',
          'danger',
          3200
        );
      } else if (errorName === 'NotFoundError' || errorName === 'DevicesNotFoundError') {
        showMobileToast('لم يتم العثور على ميكروفون متاح على هذا الجهاز.', 'danger', 2800);
      } else if (errorName === 'NotReadableError') {
        showMobileToast('الميكروفون مستخدم حالياً بواسطة تطبيق آخر.', 'danger', 2800);
      } else {
        showMobileToast(
          'تعذر تشغيل التسجيل الصوتي. يرجى التحقق من إذن الميكروفون في الجهاز.',
          'danger',
          2800
        );
      }
    }
  };

  const stopRecordingUI = () => {
    if (recordingTimer) clearInterval(recordingTimer);
    recordingTimer = null;
    isRecordingAudio = false;
    if (recordingUiBar) {
      recordingUiBar.classList.remove('flex');
      recordingUiBar.classList.add('hidden');
    }
  };

  const sendFallbackVoiceNote = () => {
    if (!import.meta.env.DEV) return;
    justSentMessageFlag = true;
    state.sendMessage(
      {
        type: 'audio',
        audioDuration: 8,
        audioBlobUrl: '',
      },
      activeReplyTarget ?? undefined
    );
    activeReplyTarget = null;
    updateReplyPreviewBarInPlace();
    setTimeout(() => scrollChatToBottom(), 80);
  };

  if (cancelRecBtn) {
    cancelRecBtn.addEventListener('click', () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach((t) => t.stop());
      }
      stopRecordingUI();
    });
  }

  if (sendRecBtn) {
    sendRecBtn.addEventListener('click', () => {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.onstop = () => {
          const cleanMime = activeRecorderMimeType.split(';')[0] || 'audio/webm';
          const audioBlob = new Blob(audioChunks, { type: cleanMime });
          const duration = Math.max(1, recordingSeconds);
          const fallbackObjectUrl = URL.createObjectURL(audioBlob);

          mediaRecorder?.stream.getTracks().forEach((t) => t.stop());

          const reader = new FileReader();
          reader.onload = (ev) => {
            const rawAudioUrl = typeof ev.target?.result === 'string' ? ev.target.result : '';
            const safeAudioDataUrl = sanitizeAudioSrc(rawAudioUrl) || fallbackObjectUrl;
            justSentMessageFlag = true;
            state.sendMessage(
              {
                type: 'audio',
                audioDuration: duration,
                audioBlobUrl: safeAudioDataUrl,
                fileUrl: safeAudioDataUrl.startsWith('data:') ? safeAudioDataUrl : undefined,
              },
              activeReplyTarget ?? undefined
            );
            activeReplyTarget = null;
            updateReplyPreviewBarInPlace();
            setTimeout(() => scrollChatToBottom(), 80);
          };
          reader.onerror = () => {
            justSentMessageFlag = true;
            state.sendMessage(
              {
                type: 'audio',
                audioDuration: duration,
                audioBlobUrl: fallbackObjectUrl,
              },
              activeReplyTarget ?? undefined
            );
            activeReplyTarget = null;
            updateReplyPreviewBarInPlace();
            setTimeout(() => scrollChatToBottom(), 80);
          };
          reader.readAsDataURL(audioBlob);
        };
        mediaRecorder.stop();
      } else if (import.meta.env.DEV) {
        sendFallbackVoiceNote();
      } else {
        showMobileToast('لم يتم تسجيل مقطع صوتي صالح للإرسال.', 'danger');
      }
      stopRecordingUI();
    });
  }
}

function launchOneTimeMatingConfetti(): void {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById('meow-mating-confetti-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'meow-mating-confetti-overlay';
  overlay.className = 'fixed inset-0 z-[120] pointer-events-none overflow-hidden';

  const colors = ['#E67E22', '#F59E0B', '#FB7185', '#10B981', '#38BDF8', '#FBBF24'];
  const piecesHtml = Array.from({ length: 42 }, (_, idx) => {
    const left = ((idx * 17 + 7) % 94) + 3;
    const delay = (idx % 7) * 0.08;
    const duration = 1.65 + (idx % 5) * 0.22;
    const size = idx % 3 === 0 ? 11 : 8;
    const color = colors[idx % colors.length];
    return `<span class="meow-confetti-piece" style="left:${left}%;width:${size}px;height:${size}px;background:${color};animation-delay:${delay}s;animation-duration:${duration}s;"></span>`;
  }).join('');

  overlay.innerHTML = piecesHtml;
  document.body.appendChild(overlay);
  window.setTimeout(() => {
    overlay.remove();
  }, 2600);
}

function copyTextFallback(text: string): void {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  } catch {
    // ignore clipboard fallback failures
  }
}

export function renderDeleteConversationConfirmModal(): string {
  const conv = state.getPendingDeleteConversation();
  if (!conv) return '';

  return `
    <div id="meow-delete-conv-backdrop" class="fixed inset-0 z-[92] bg-black/65 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in" dir="rtl">
      <div class="bg-white w-full max-w-sm rounded-t-[32px] rounded-b-none sm:rounded-[28px] p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6 shadow-2xl border-2 border-b-0 sm:border-b-2 border-red-200 space-y-4 animate-slide-up text-right">
        
        <div class="flex items-center gap-3 pb-3 border-b border-red-100">
          <div class="w-12 h-12 rounded-2xl bg-red-500/15 text-red-600 flex items-center justify-center text-xl shrink-0">
            <i class="fa-solid fa-trash-can"></i>
          </div>
          <div class="min-w-0">
            <h3 class="text-lg font-black font-baloo text-brand-dark leading-tight m-0">
              تأكيد حذف المحادثة
            </h3>
            <p class="text-xs font-bold text-brand-subtleGray m-0 mt-0.5 truncate">
              ${escapeHtml(conv.otherUserName)} • ${escapeHtml(conv.petName)}
            </p>
          </div>
        </div>

        <p class="text-xs sm:text-sm font-semibold text-brand-dark/90 leading-relaxed">
          هل أنت متأكد من رغبتك في حذف المحادثة مع <strong class="text-red-600">${escapeHtml(conv.otherUserName)}</strong>؟
          سيتم حذف جميع الرسائل داخل هذه المحادثة ولا يمكن التراجع عن ذلك.
        </p>

        <div class="grid grid-cols-2 gap-3 pt-1">
          <button
            id="confirm-delete-conv-btn"
            type="button"
            class="h-12 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-soft transition-all active:scale-95 cursor-pointer font-baloo"
          >
            تأكيد الحذف
          </button>
          <button
            id="cancel-delete-conv-btn"
            type="button"
            class="h-12 rounded-full bg-white border-2 border-brand-peachBorder text-brand-dark font-black text-sm hover:bg-brand-peachBorder/20 transition-all active:scale-95 cursor-pointer font-baloo"
          >
            إلغاء
          </button>
        </div>

      </div>
    </div>
  `;
}

export function attachDeleteConversationModalEvents(): void {
  const backdrop = document.getElementById('meow-delete-conv-backdrop');
  const cancelBtn = document.getElementById('cancel-delete-conv-btn');
  const confirmBtn = document.getElementById('confirm-delete-conv-btn');

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      state.setPendingDeleteConversationId(null);
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        state.setPendingDeleteConversationId(null);
      }
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      state.confirmDeleteConversation();
    });
  }
}
