import { normalizeArabic } from '../../data/egyptLocations.ts';

export interface SearchableOption {
  value: string;
  label: string;
  searchText?: string;
}

export interface SearchableSelectConfig {
  id: string;
  options: SearchableOption[];
  value: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  onChange?: (value: string, label: string) => void;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderSearchableSelect(config: {
  id: string;
  options: SearchableOption[];
  value: string;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  heightClass?: string;
  roundedClass?: string;
  textAlignClass?: string;
}): string {
  const {
    id,
    options,
    value,
    placeholder = 'اختر...',
    searchPlaceholder = 'ابحث هنا...',
    disabled = false,
    heightClass = 'h-16',
    roundedClass = 'rounded-[28px]',
    textAlignClass = 'text-center',
  } = config;

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption ? selectedOption.label : placeholder;
  const isPlaceholder = !selectedOption || selectedOption.value === '';

  return `
    <div class="relative w-full min-w-0 searchable-select-root" data-ss-id="${id}">
      <input type="hidden" id="${id}" value="${escapeHtml(value)}" />
      <button
        type="button"
        id="${id}-trigger"
        ${disabled ? 'disabled' : ''}
        aria-haspopup="listbox"
        aria-expanded="false"
        class="ss-trigger w-full ${heightClass} py-3 pr-3 sm:pr-4 pl-9 sm:pl-10 bg-[#fffefc] border-2 border-[#d6c7b2] ${roundedClass} text-sm sm:text-base font-black ${textAlignClass} ${
          isPlaceholder && value === '' ? 'text-[#786555]' : 'text-[#1a1612]'
        } focus:outline-none focus:ring-4 focus:ring-[#e67e22]/20 focus:border-[#e67e22] transition-all shadow-sm flex items-center justify-center truncate ${
          disabled ? 'opacity-55 cursor-not-allowed bg-[#faf6ed]' : 'cursor-pointer hover:border-[#e67e22]/70'
        }"
      >
        <span class="ss-label truncate block w-full">${escapeHtml(displayLabel)}</span>
      </button>
      <div class="pointer-events-none absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 flex items-center text-[#786555]">
        <svg class="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path>
        </svg>
      </div>

      <!-- Anchored Searchable Popover -->
      <div
        id="${id}-panel"
        class="ss-panel hidden absolute top-full mt-2 right-0 min-w-[min(220px,calc(100vw-2.25rem))] w-full max-w-[calc(100vw-2rem)] z-50 bg-[#fffefc] border-2 border-[#d6c7b2] rounded-[24px] shadow-xl p-2.5 text-right"
      >
        <div class="relative mb-2">
          <input
            type="text"
            id="${id}-search"
            placeholder="${escapeHtml(searchPlaceholder)}"
            autocomplete="off"
            class="ss-search w-full h-11 pr-9 pl-3 bg-[#FFF9E9]/80 border border-[#d6c7b2] rounded-2xl text-sm font-bold text-[#1a1612] placeholder:text-[#998b7c] focus:outline-none focus:border-[#e67e22]"
          />
          <i class="fa-solid fa-magnifying-glass absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#786555]"></i>
        </div>
        <div
          id="${id}-list"
          role="listbox"
          class="ss-list max-h-52 overflow-y-auto overscroll-contain space-y-1 pl-0.5"
        >
          ${renderOptionsListHtml(options, value)}
        </div>
      </div>
    </div>
  `;
}

function renderOptionsListHtml(
  options: SearchableOption[],
  selectedValue: string,
  emptyText = 'لا توجد نتائج مطابقة'
): string {
  if (options.length === 0) {
    return `<div class="py-4 px-3 text-center text-xs font-bold text-[#786555]">${escapeHtml(emptyText)}</div>`;
  }
  return options
    .map((opt) => {
      const isSelected = opt.value === selectedValue;
      return `
        <button
          type="button"
          role="option"
          aria-selected="${isSelected ? 'true' : 'false'}"
          data-ss-value="${escapeHtml(opt.value)}"
          data-ss-label="${escapeHtml(opt.label)}"
          class="ss-option w-full text-right px-3.5 py-2.5 rounded-2xl text-sm font-bold transition-all cursor-pointer flex items-center justify-between gap-2 ${
            isSelected
              ? 'bg-[#fff5ea] text-[#e67e22] border border-[#e67e22]/40 font-black'
              : 'text-[#2d221b] hover:bg-[#FFF9E9]'
          }"
        >
          <span class="truncate">${escapeHtml(opt.label)}</span>
          ${isSelected ? '<i class="fa-solid fa-check text-xs text-[#e67e22] shrink-0"></i>' : ''}
        </button>
      `;
    })
    .join('');
}

export function closeAllSearchableSelects(exceptId?: string): void {
  const panels = document.querySelectorAll<HTMLElement>('.ss-panel');
  panels.forEach((panel) => {
    const root = panel.closest('.searchable-select-root');
    const id = root?.getAttribute('data-ss-id');
    if (exceptId && id === exceptId) return;
    panel.classList.add('hidden');
    const trigger = root?.querySelector<HTMLButtonElement>('.ss-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
}

let globalOutsideClickBound = false;

export interface SearchableSelectController {
  getValue: () => string;
  setOptions: (
    newOptions: SearchableOption[],
    nextValue?: string,
    disabled?: boolean,
    newPlaceholder?: string
  ) => void;
  setValue: (nextValue: string) => void;
}

export function attachSearchableSelect(
  config: SearchableSelectConfig
): SearchableSelectController | null {
  const root = document.querySelector<HTMLElement>(`.searchable-select-root[data-ss-id="${config.id}"]`);
  if (!root) return null;

  const hiddenInput = root.querySelector<HTMLInputElement>(`#${config.id}`);
  const trigger = root.querySelector<HTMLButtonElement>(`#${config.id}-trigger`);
  const labelSpan = root.querySelector<HTMLElement>('.ss-label');
  const panel = root.querySelector<HTMLElement>(`#${config.id}-panel`);
  const searchInput = root.querySelector<HTMLInputElement>(`#${config.id}-search`);
  const listEl = root.querySelector<HTMLElement>(`#${config.id}-list`);

  let currentOptions = [...config.options];
  let currentValue = config.value;
  let isDisabled = Boolean(config.disabled);
  let currentPlaceholder = config.placeholder || 'اختر...';

  if (!globalOutsideClickBound && typeof document !== 'undefined') {
    globalOutsideClickBound = true;
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest('.searchable-select-root')) {
        closeAllSearchableSelects();
      }
    });
  }

  const updateTriggerDisplay = () => {
    if (hiddenInput) hiddenInput.value = currentValue;
    const match = currentOptions.find((o) => o.value === currentValue);
    if (labelSpan) {
      labelSpan.textContent = match ? match.label : currentPlaceholder;
    }
    if (trigger) {
      trigger.disabled = isDisabled;
      if (isDisabled) {
        trigger.classList.add('opacity-55', 'cursor-not-allowed', 'bg-[#faf6ed]');
        trigger.classList.remove('cursor-pointer', 'hover:border-[#e67e22]/70');
      } else {
        trigger.classList.remove('opacity-55', 'cursor-not-allowed', 'bg-[#faf6ed]');
        trigger.classList.add('cursor-pointer', 'hover:border-[#e67e22]/70');
      }
    }
  };

  const renderFilteredList = (query = '') => {
    if (!listEl) return;
    const normQuery = normalizeArabic(query);
    const filtered = normQuery
      ? currentOptions.filter((opt) =>
          normalizeArabic(`${opt.label} ${opt.searchText || ''}`).includes(normQuery)
        )
      : currentOptions;

    listEl.innerHTML = renderOptionsListHtml(
      filtered,
      currentValue,
      config.emptyText || 'لا توجد نتائج مطابقة'
    );

    const optButtons = listEl.querySelectorAll<HTMLButtonElement>('.ss-option');
    optButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = btn.getAttribute('data-ss-value') ?? '';
        const lbl = btn.getAttribute('data-ss-label') ?? '';
        currentValue = val;
        updateTriggerDisplay();
        if (panel) panel.classList.add('hidden');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
        config.onChange?.(val, lbl);
      });
    });
  };

  if (trigger) {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isDisabled || !panel) return;
      const isOpen = !panel.classList.contains('hidden');
      closeAllSearchableSelects(config.id);
      if (isOpen) {
        panel.classList.add('hidden');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        if (searchInput) searchInput.value = '';
        renderFilteredList('');
        panel.classList.remove('hidden');
        trigger.setAttribute('aria-expanded', 'true');
        panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        if (searchInput) {
          setTimeout(() => searchInput.focus(), 30);
        }
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('click', (e) => e.stopPropagation());
    searchInput.addEventListener('input', () => {
      renderFilteredList(searchInput.value);
    });
  }

  renderFilteredList('');
  updateTriggerDisplay();

  return {
    getValue: () => currentValue,
    setValue: (nextValue: string) => {
      currentValue = nextValue;
      updateTriggerDisplay();
      renderFilteredList(searchInput?.value || '');
    },
    setOptions: (
      newOptions: SearchableOption[],
      nextValue?: string,
      disabled?: boolean,
      newPlaceholder?: string
    ) => {
      currentOptions = [...newOptions];
      if (newPlaceholder !== undefined) {
        currentPlaceholder = newPlaceholder;
      }
      if (nextValue !== undefined) {
        currentValue = nextValue;
      } else if (!currentOptions.some((o) => o.value === currentValue)) {
        currentValue = currentOptions[0]?.value ?? '';
      }
      if (disabled !== undefined) {
        isDisabled = disabled;
      }
      updateTriggerDisplay();
      if (searchInput) searchInput.value = '';
      renderFilteredList('');
    },
  };
}
