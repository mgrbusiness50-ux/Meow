export type MobileToastTone = 'default' | 'success' | 'danger';

let activeToastTimer: number | null = null;
let activeToastEl: HTMLElement | null = null;

/**
 * Displays a crisp, touch-friendly floating toast pill at the bottom/top of the screen
 * while respecting mobile safe-area insets.
 */
export function showMobileToast(
  message: string,
  tone: MobileToastTone = 'default',
  durationMs = 2200
): void {
  if (typeof document === 'undefined') return;
  if (activeToastTimer !== null) {
    window.clearTimeout(activeToastTimer);
    activeToastTimer = null;
  }
  activeToastEl?.remove();

  const toneClasses =
    tone === 'success'
      ? 'bg-emerald-600 text-white border-emerald-500'
      : tone === 'danger'
        ? 'bg-red-600 text-white border-red-500'
        : 'bg-brand-brown text-white border-brand-brown/80';

  const toast = document.createElement('div');
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.className = `meow-mobile-toast fixed left-1/2 z-[140] -translate-x-1/2 px-4 py-2.5 rounded-full border shadow-lg text-xs sm:text-sm font-bold flex items-center gap-2 pointer-events-none max-w-[calc(100vw-2rem)] text-center transition-all duration-200 opacity-0 translate-y-2 ${toneClasses}`;
  toast.style.bottom = 'calc(env(safe-area-inset-bottom, 0px) + 5.75rem)';
  toast.textContent = message;

  document.body.appendChild(toast);
  activeToastEl = toast;

  window.requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-y-2');
    toast.classList.add('opacity-100', 'translate-y-0');
  });

  activeToastTimer = window.setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-2');
    window.setTimeout(() => {
      if (activeToastEl === toast) activeToastEl = null;
      toast.remove();
    }, 200);
    activeToastTimer = null;
  }, durationMs);
}

export interface SwipeToDismissOptions {
  listEl: HTMLElement | null;
  itemSelector: string;
  cardSelector: string;
  idAttribute?: string;
  ignoreSelector?: string;
  onDismiss: (id: string, itemEl: HTMLElement) => void;
}

/**
 * Enables axis-locked horizontal swipe-to-dismiss on individual list cards
 * without interfering with vertical scroll or dedicated delete/action buttons.
 */
export function attachSwipeToDismissList({
  listEl,
  itemSelector,
  cardSelector,
  idAttribute = 'data-notification-id',
  ignoreSelector,
  onDismiss,
}: SwipeToDismissOptions): void {
  if (!listEl) return;

  let activeItem: HTMLElement | null = null;
  let activeCard: HTMLElement | null = null;
  let startX = 0;
  let startY = 0;
  let currentDx = 0;
  let startTime = 0;
  let mode: 'idle' | 'pending' | 'horizontal' | 'vertical' = 'idle';
  let suppressClickUntil = 0;

  const resetCard = (card: HTMLElement, animate = true) => {
    card.style.transition = animate
      ? 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease'
      : 'none';
    card.style.transform = 'translate3d(0, 0, 0)';
    card.style.opacity = '1';
    if (animate) {
      window.setTimeout(() => {
        if (card.style.transform === 'translate3d(0, 0, 0)') {
          card.style.transition = '';
          card.style.transform = '';
          card.style.opacity = '';
        }
      }, 230);
    }
  };

  listEl.addEventListener(
    'click',
    (e) => {
      if (Date.now() < suppressClickUntil) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );

  listEl.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length !== 1) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (ignoreSelector && target.closest(ignoreSelector)) return;

      const card = target.closest(cardSelector) as HTMLElement | null;
      const item = card?.closest(itemSelector) as HTMLElement | null;
      if (!card || !item) return;

      activeItem = item;
      activeCard = card;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      currentDx = 0;
      startTime = performance.now();
      mode = 'pending';
    },
    {passive: true}
  );

  listEl.addEventListener(
    'touchmove',
    (e) => {
      if (!activeCard || mode === 'idle' || mode === 'vertical') return;
      if (e.touches.length !== 1) return;

      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (mode === 'pending') {
        if (absDy > 10 && absDy >= absDx) {
          mode = 'vertical';
          activeCard = null;
          activeItem = null;
          return;
        }
        if (absDx > 10 && absDx > absDy * 1.15) {
          mode = 'horizontal';
          activeCard.style.transition = 'none';
        } else {
          return;
        }
      }

      if (mode === 'horizontal') {
        e.preventDefault();
        currentDx = dx;
        const width = Math.max(activeCard.offsetWidth, 240);
        const progress = Math.min(1, Math.abs(dx) / width);
        activeCard.style.transform = `translate3d(${dx}px, 0, 0)`;
        activeCard.style.opacity = `${Math.max(0.32, 1 - progress * 0.65)}`;
      }
    },
    {passive: false}
  );

  const finishSwipe = () => {
    if (mode !== 'horizontal' || !activeCard || !activeItem) {
      mode = 'idle';
      activeCard = null;
      activeItem = null;
      return;
    }

    const card = activeCard;
    const item = activeItem;
    const dx = currentDx;
    const elapsed = Math.max(1, performance.now() - startTime);
    const velocity = Math.abs(dx) / elapsed;
    const width = Math.max(card.offsetWidth, 240);
    const threshold = Math.max(92, width * 0.34);

    if (Math.abs(dx) > 8) {
      suppressClickUntil = Date.now() + 340;
    }

    const shouldDismiss =
      Math.abs(dx) >= threshold || (velocity > 0.55 && Math.abs(dx) > 48);

    mode = 'idle';
    activeCard = null;
    activeItem = null;

    if (!shouldDismiss) {
      resetCard(card, true);
      return;
    }

    const direction = dx >= 0 ? 1 : -1;
    const exitX = direction * (width + 48);
    card.style.transition =
      'transform 190ms ease-in, opacity 190ms ease-in';
    card.style.transform = `translate3d(${exitX}px, 0, 0)`;
    card.style.opacity = '0';

    const notifId =
      card.getAttribute(idAttribute) || item.getAttribute(idAttribute) || '';

    const startHeight = item.offsetHeight;
    item.style.maxHeight = `${startHeight}px`;
    item.style.overflow = 'hidden';

    window.setTimeout(() => {
      item.style.transition =
        'max-height 160ms ease, margin 160ms ease, opacity 140ms ease';
      item.style.maxHeight = '0px';
      item.style.marginBottom = '0px';
      item.style.opacity = '0';
      window.setTimeout(() => {
        if (notifId) onDismiss(notifId, item);
      }, 165);
    }, 175);
  };

  listEl.addEventListener('touchend', finishSwipe, {passive: true});
  listEl.addEventListener('touchcancel', () => {
    if (activeCard) resetCard(activeCard, true);
    mode = 'idle';
    activeCard = null;
    activeItem = null;
  });
}

/**
 * Enables rightward horizontal swipe-to-close on RTL right-anchored side drawers.
 */
export function attachSwipeToCloseDrawer(
  panelEl: HTMLElement | null,
  backdropEl: HTMLElement | null,
  onClose: () => void,
  direction: 'right' | 'left' = 'right'
): void {
  if (!panelEl) return;

  let startX = 0;
  let startY = 0;
  let currentDx = 0;
  let startTime = 0;
  let mode: 'idle' | 'pending' | 'horizontal' | 'vertical' = 'idle';

  const resetDrawer = (animate = true) => {
    panelEl.style.transition = animate
      ? 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)'
      : 'none';
    panelEl.style.transform = 'translate3d(0, 0, 0)';
    if (backdropEl) {
      backdropEl.style.transition = animate ? 'opacity 220ms ease' : 'none';
      backdropEl.style.opacity = '';
    }
    if (animate) {
      window.setTimeout(() => {
        panelEl.style.transition = '';
        panelEl.style.transform = '';
        if (backdropEl) backdropEl.style.transition = '';
      }, 230);
    }
  };

  panelEl.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      currentDx = 0;
      startTime = performance.now();
      mode = 'pending';
    },
    {passive: true}
  );

  panelEl.addEventListener(
    'touchmove',
    (e) => {
      if (mode === 'idle' || mode === 'vertical' || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      const towardClose = direction === 'right' ? dx > 0 : dx < 0;

      if (mode === 'pending') {
        if (absDy > 10 && absDy >= absDx) {
          mode = 'vertical';
          return;
        }
        if (towardClose && absDx > 10 && absDx > absDy * 1.15) {
          mode = 'horizontal';
          panelEl.style.transition = 'none';
          if (backdropEl) backdropEl.style.transition = 'none';
        } else if (!towardClose && absDx > 12) {
          mode = 'vertical';
          return;
        } else {
          return;
        }
      }

      if (mode === 'horizontal') {
        const clampedDx =
          direction === 'right' ? Math.max(0, dx) : Math.min(0, dx);
        e.preventDefault();
        currentDx = clampedDx;
        panelEl.style.transform = `translate3d(${clampedDx}px, 0, 0)`;
        if (backdropEl) {
          const width = Math.max(panelEl.offsetWidth, 260);
          const ratio = Math.max(0.15, 1 - Math.abs(clampedDx) / width);
          backdropEl.style.opacity = `${ratio}`;
        }
      }
    },
    {passive: false}
  );

  const finish = () => {
    if (mode !== 'horizontal') {
      mode = 'idle';
      return;
    }
    const elapsed = Math.max(1, performance.now() - startTime);
    const velocity = Math.abs(currentDx) / elapsed;
    const width = Math.max(panelEl.offsetWidth, 260);
    const threshold = Math.max(85, width * 0.3);
    mode = 'idle';

    if (Math.abs(currentDx) >= threshold || (velocity > 0.55 && Math.abs(currentDx) > 40)) {
      const exitX = direction === 'right' ? width + 32 : -(width + 32);
      panelEl.style.transition = 'transform 190ms ease-in';
      panelEl.style.transform = `translate3d(${exitX}px, 0, 0)`;
      if (backdropEl) {
        backdropEl.style.transition = 'opacity 190ms ease-in';
        backdropEl.style.opacity = '0';
      }
      window.setTimeout(onClose, 185);
    } else {
      resetDrawer(true);
    }
  };

  panelEl.addEventListener('touchend', finish, {passive: true});
  panelEl.addEventListener('touchcancel', () => {
    mode = 'idle';
    resetDrawer(true);
  });
}

/**
 * Enables drag-down-to-dismiss on mobile bottom sheets from either the grab handle
 * or the top scroll edge (`scrollTop <= 1`).
 */
export function attachSheetDragToDismiss(
  sheetEl: HTMLElement | null,
  options: {
    backdropEl?: HTMLElement | null;
    handleSelector?: string;
    scrollContainerSelector?: string;
    onClose: () => void;
  }
): void {
  if (!sheetEl) return;
  const {backdropEl, handleSelector, scrollContainerSelector, onClose} = options;

  let startX = 0;
  let startY = 0;
  let currentDy = 0;
  let startTime = 0;
  let mode: 'idle' | 'pending' | 'vertical' | 'blocked' = 'idle';

  const resetSheet = (animate = true) => {
    sheetEl.style.transition = animate
      ? 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)'
      : 'none';
    sheetEl.style.transform = 'translate3d(0, 0, 0)';
    if (backdropEl) {
      backdropEl.style.transition = animate ? 'opacity 220ms ease' : 'none';
      backdropEl.style.opacity = '';
    }
    if (animate) {
      window.setTimeout(() => {
        sheetEl.style.transition = '';
        sheetEl.style.transform = '';
        if (backdropEl) backdropEl.style.transition = '';
      }, 230);
    }
  };

  sheetEl.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length !== 1) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select')) {
        mode = 'blocked';
        return;
      }

      const startedOnHandle = Boolean(
        handleSelector && target?.closest(handleSelector)
      );
      const scrollEl = scrollContainerSelector
        ? (sheetEl.querySelector(scrollContainerSelector) as HTMLElement | null)
        : sheetEl;
      const atTop = !scrollEl || scrollEl.scrollTop <= 1;

      if (!startedOnHandle && !atTop) {
        mode = 'blocked';
        return;
      }

      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      currentDy = 0;
      startTime = performance.now();
      mode = 'pending';
    },
    {passive: true}
  );

  sheetEl.addEventListener(
    'touchmove',
    (e) => {
      if (mode === 'idle' || mode === 'blocked' || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      if (mode === 'pending') {
        if (dy < -8 || Math.abs(dx) > Math.abs(dy) * 1.15) {
          mode = 'blocked';
          return;
        }
        if (dy > 10 && dy > Math.abs(dx) * 1.15) {
          mode = 'vertical';
          sheetEl.style.transition = 'none';
          if (backdropEl) backdropEl.style.transition = 'none';
        } else {
          return;
        }
      }

      if (mode === 'vertical') {
        const clampedDy = Math.max(0, dy);
        e.preventDefault();
        currentDy = clampedDy;
        sheetEl.style.transform = `translate3d(0, ${clampedDy}px, 0)`;
        if (backdropEl) {
          const h = Math.max(sheetEl.offsetHeight, 320);
          backdropEl.style.opacity = `${Math.max(0.15, 1 - clampedDy / h)}`;
        }
      }
    },
    {passive: false}
  );

  const finish = () => {
    if (mode !== 'vertical') {
      mode = 'idle';
      return;
    }
    const elapsed = Math.max(1, performance.now() - startTime);
    const velocity = currentDy / elapsed;
    const h = Math.max(sheetEl.offsetHeight, 320);
    const threshold = Math.max(90, h * 0.24);
    mode = 'idle';

    if (currentDy >= threshold || (velocity > 0.6 && currentDy > 44)) {
      sheetEl.style.transition = 'transform 190ms ease-in';
      sheetEl.style.transform = `translate3d(0, ${h + 36}px, 0)`;
      if (backdropEl) {
        backdropEl.style.transition = 'opacity 190ms ease-in';
        backdropEl.style.opacity = '0';
      }
      window.setTimeout(onClose, 185);
    } else {
      resetSheet(true);
    }
  };

  sheetEl.addEventListener('touchend', finish, {passive: true});
  sheetEl.addEventListener('touchcancel', () => {
    mode = 'idle';
    resetSheet(true);
  });
}

/**
 * Enables smooth mobile pull-to-refresh on top-level scrollable feed views.
 */
export function attachPullToRefresh(
  targetEl: HTMLElement | null,
  options: {
    isBlocked?: () => boolean;
    onRefresh: () => void | Promise<void>;
    readyLabel?: string;
    releaseLabel?: string;
    refreshingLabel?: string;
  }
): void {
  if (!targetEl) return;

  let startX = 0;
  let startY = 0;
  let pullDistance = 0;
  let active = false;
  let refreshing = false;
  let indicatorEl: HTMLElement | null = null;

  const ensureIndicator = (): HTMLElement => {
    if (indicatorEl && document.body.contains(indicatorEl)) return indicatorEl;
    document.getElementById('meow-ptr-indicator')?.remove();
    const el = document.createElement('div');
    el.id = 'meow-ptr-indicator';
    el.className =
      'fixed left-1/2 z-[125] pointer-events-none flex items-center justify-center transition-opacity duration-150 opacity-0';
    el.style.top = 'calc(env(safe-area-inset-top, 0px) + 0.65rem)';
    el.innerHTML =
      '<div class="meow-ptr-dots" data-ptr-dots aria-hidden="true"><span></span><span></span><span></span></div>';
    document.body.appendChild(el);
    indicatorEl = el;
    return el;
  };

  const updateIndicator = (dist: number, armed: boolean, spinning = false) => {
    const el = ensureIndicator();
    const dots = el.querySelector('[data-ptr-dots]') as HTMLElement | null;
    if (dots) {
      dots.classList.toggle('is-spinning', spinning);
      if (!spinning) {
        const progress = Math.min(1, Math.max(0.25, dist / 70));
        dots.style.transform = `translate3d(0, ${Math.min(8, dist * 0.1).toFixed(1)}px, 0) scale(${
          armed ? 1.08 : 0.78 + progress * 0.24
        })`;
        dots.style.opacity = String(armed ? 1 : 0.55 + progress * 0.45);
      } else {
        dots.style.transform = '';
        dots.style.opacity = '1';
      }
    }
    const clampedY = Math.min(68, dist * 0.52);
    el.style.opacity = dist > 8 || spinning ? '1' : '0';
    el.style.transform = `translate3d(-50%, ${clampedY}px, 0)`;
  };

  const hideIndicator = () => {
    if (!indicatorEl) return;
    indicatorEl.style.opacity = '0';
    indicatorEl.style.transform = 'translate(-50%, -12px)';
    window.setTimeout(() => {
      if (!active && !refreshing) {
        indicatorEl?.remove();
        indicatorEl = null;
      }
    }, 180);
  };

  targetEl.addEventListener(
    'touchstart',
    (e) => {
      if (refreshing || e.touches.length !== 1) return;
      if (window.scrollY > 2) return;
      if (options.isBlocked?.()) return;
      const target = e.target as HTMLElement | null;
      if (
        target?.closest(
          'input, textarea, select, [data-no-ptr], [data-member-gallery], #pet-gallery-viewport'
        )
      ) {
        return;
      }
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      pullDistance = 0;
      active = true;
    },
    {passive: true}
  );

  targetEl.addEventListener(
    'touchmove',
    (e) => {
      if (!active || refreshing || e.touches.length !== 1) return;
      if (window.scrollY > 2) {
        active = false;
        hideIndicator();
        return;
      }
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      if (dy <= 0) {
        if (pullDistance > 0) {
          pullDistance = 0;
          hideIndicator();
        }
        return;
      }
      if (Math.abs(dx) > dy * 1.1 && pullDistance === 0) {
        active = false;
        return;
      }

      pullDistance = Math.min(130, dy * 0.65);
      if (pullDistance > 12) {
        e.preventDefault();
        const armed = pullDistance >= 70;
        updateIndicator(pullDistance, armed, false);
      }
    },
    {passive: false}
  );

  const finishPull = () => {
    if (!active) return;
    active = false;
    if (pullDistance >= 70 && !refreshing) {
      refreshing = true;
      updateIndicator(52, false, true);
      window.setTimeout(async () => {
        try {
          await options.onRefresh();
        } finally {
          refreshing = false;
          hideIndicator();
        }
      }, 280);
    } else {
      hideIndicator();
    }
    pullDistance = 0;
  };

  targetEl.addEventListener('touchend', finishPull, {passive: true});
  targetEl.addEventListener('touchcancel', () => {
    active = false;
    pullDistance = 0;
    hideIndicator();
  });
}

/**
 * Attaches a conflict-free mobile long-press gesture that cancels cleanly if
 * the user scrolls or drags, and suppresses trailing clicks once fired.
 */
export function attachLongPress(
  el: HTMLElement | null,
  onTrigger: (el: HTMLElement) => void,
  config?: {delayMs?: number; moveTolerance?: number}
): void {
  if (!el) return;
  const delayMs = config?.delayMs ?? 480;
  const moveTolerance = config?.moveTolerance ?? 10;

  let timer: number | null = null;
  let startX = 0;
  let startY = 0;
  let fired = false;
  let suppressClickUntil = 0;

  const cancel = () => {
    if (timer !== null) {
      window.clearTimeout(timer);
      timer = null;
    }
  };

  el.addEventListener(
    'click',
    (e) => {
      if (Date.now() < suppressClickUntil) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );

  el.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length !== 1) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, a, input, textarea')) return;
      fired = false;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      cancel();
      timer = window.setTimeout(() => {
        timer = null;
        fired = true;
        suppressClickUntil = Date.now() + 450;
        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
          try {
            navigator.vibrate(14);
          } catch {
            // Ignore vibration restrictions
          }
        }
        onTrigger(el);
      }, delayMs);
    },
    {passive: true}
  );

  el.addEventListener(
    'touchmove',
    (e) => {
      if (timer === null || e.touches.length !== 1) return;
      const dx = Math.abs(e.touches[0].clientX - startX);
      const dy = Math.abs(e.touches[0].clientY - startY);
      if (dx > moveTolerance || dy > moveTolerance) {
        cancel();
      }
    },
    {passive: true}
  );

  el.addEventListener(
    'touchend',
    () => {
      cancel();
      if (fired) {
        suppressClickUntil = Date.now() + 350;
      }
    },
    {passive: true}
  );
  el.addEventListener('touchcancel', cancel, {passive: true});
}

/**
 * Adds axis-locked horizontal touch/drag carousel swipe on photo galleries.
 */
export function attachHorizontalCarouselSwipe(options: {
  viewport: HTMLElement | null;
  track: HTMLElement | null;
  count: number;
  getIndex: () => number;
  onChangeIndex: (nextIndex: number) => void;
  onSync: () => void;
}): void {
  const {viewport, track, count, getIndex, onChangeIndex, onSync} = options;
  if (!viewport || !track || count <= 1) return;

  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let mode: 'idle' | 'pending' | 'horizontal' | 'vertical' = 'idle';

  viewport.addEventListener(
    'touchstart',
    (e) => {
      if (e.touches.length !== 1) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('button')) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      deltaX = 0;
      mode = 'pending';
    },
    {passive: true}
  );

  viewport.addEventListener(
    'touchmove',
    (e) => {
      if (mode === 'idle' || mode === 'vertical' || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (mode === 'pending') {
        if (absDy > 10 && absDy >= absDx) {
          mode = 'vertical';
          return;
        }
        if (absDx > 10 && absDx > absDy * 1.1) {
          mode = 'horizontal';
          track.style.transition = 'none';
        } else {
          return;
        }
      }

      if (mode === 'horizontal') {
        e.preventDefault();
        deltaX = dx;
        const width = Math.max(viewport.offsetWidth, 1);
        const offsetPct = -getIndex() * 100 + (deltaX / width) * 100;
        track.style.transform = `translate3d(${offsetPct}%, 0, 0)`;
      }
    },
    {passive: false}
  );

  const endSwipe = () => {
    if (mode !== 'horizontal') {
      mode = 'idle';
      return;
    }
    mode = 'idle';
    track.style.transition = '';
    const width = Math.max(viewport.offsetWidth, 1);
    const threshold = Math.max(38, width * 0.16);
    const cur = getIndex();
    if (deltaX < -threshold) {
      onChangeIndex((cur + 1) % count);
    } else if (deltaX > threshold) {
      onChangeIndex((cur - 1 + count) % count);
    } else {
      onSync();
    }
    deltaX = 0;
  };

  viewport.addEventListener('touchend', endSwipe, {passive: true});
  viewport.addEventListener('touchcancel', () => {
    if (mode === 'horizontal') {
      track.style.transition = '';
      onSync();
    }
    mode = 'idle';
    deltaX = 0;
  });
}

export function attachHorizontalTabSwipe(
  container: HTMLElement | null,
  options: {
    isBlocked?: () => boolean;
    onSwipeNext: () => void;
    onSwipePrev: () => void;
    canSwipeNext?: () => boolean;
    canSwipePrev?: () => boolean;
    onSwipeProgress?: (normalizedOffset: number) => void;
    onSwipeCancel?: () => void;
  }
): () => void {
  if (!container) return () => {};
  const {
    isBlocked,
    onSwipeNext,
    onSwipePrev,
    canSwipeNext,
    canSwipePrev,
    onSwipeProgress,
    onSwipeCancel,
  } = options;

  let startX = 0;
  let startY = 0;
  let deltaX = 0;
  let mode: 'idle' | 'pending' | 'horizontal' | 'vertical' = 'idle';

  const isInteractiveTarget = (target: EventTarget | null): boolean => {
    const el = target as HTMLElement | null;
    if (!el) return false;
    return Boolean(
      el.closest(
        'input, textarea, select, [contenteditable="true"], [data-no-tab-swipe="true"], [data-no-ptr="true"], #pet-gallery-viewport, [data-member-gallery], .ss-panel, .meow-more-dropdown, [role="menu"], .overflow-x-auto'
      )
    );
  };

  const resetVisual = () => {
    onSwipeCancel?.();
    container.style.transition = 'transform 180ms cubic-bezier(0.22, 1, 0.36, 1)';
    container.style.transform = '';
    window.setTimeout(() => {
      if (mode === 'idle') {
        container.style.transition = '';
      }
    }, 190);
  };

  const onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    if (isBlocked?.() || isInteractiveTarget(e.target)) {
      mode = 'idle';
      return;
    }
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    deltaX = 0;
    mode = 'pending';
  };

  const onTouchMove = (e: TouchEvent) => {
    if (mode === 'idle' || mode === 'vertical' || e.touches.length !== 1) return;
    if (isBlocked?.()) {
      mode = 'idle';
      container.style.transform = '';
      container.style.transition = '';
      onSwipeCancel?.();
      return;
    }

    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    if (mode === 'pending') {
      if (absDy > 14 && absDy >= absDx) {
        mode = 'vertical';
        return;
      }
      if (absDx > 24 && absDx > absDy * 1.45) {
        mode = 'horizontal';
        container.style.transition = 'none';
      } else {
        return;
      }
    }

    if (mode === 'horizontal') {
      deltaX = dx;
      // In RTL: swiping right (dx > 0) moves to next tab; swiping left (dx < 0) moves to previous tab
      const allowed = dx > 0 ? canSwipeNext?.() ?? true : canSwipePrev?.() ?? true;
      const dampened = allowed ? Math.max(-44, Math.min(44, dx * 0.24)) : Math.max(-14, Math.min(14, dx * 0.08));
      container.style.transform = `translate3d(${dampened}px, 0, 0)`;
      if (allowed) {
        const progress = dx > 0 ? Math.min(0.85, dx / 180) : -Math.min(0.85, -dx / 180);
        onSwipeProgress?.(progress);
      } else {
        onSwipeProgress?.(0);
      }
    }
  };

  const onTouchEnd = () => {
    if (mode !== 'horizontal') {
      mode = 'idle';
      deltaX = 0;
      return;
    }
    const finalDx = deltaX;
    mode = 'idle';
    deltaX = 0;
    container.style.transition = '';
    container.style.transform = '';

    const threshold = 54;
    if (finalDx > threshold && (canSwipeNext?.() ?? true)) {
      onSwipeNext();
    } else if (finalDx < -threshold && (canSwipePrev?.() ?? true)) {
      onSwipePrev();
    } else {
      resetVisual();
    }
  };

  const onTouchCancel = () => {
    if (mode === 'horizontal') {
      resetVisual();
    }
    mode = 'idle';
    deltaX = 0;
  };

  container.addEventListener('touchstart', onTouchStart, { passive: true });
  container.addEventListener('touchmove', onTouchMove, { passive: true });
  container.addEventListener('touchend', onTouchEnd, { passive: true });
  container.addEventListener('touchcancel', onTouchCancel, { passive: true });

  return () => {
    container.removeEventListener('touchstart', onTouchStart);
    container.removeEventListener('touchmove', onTouchMove);
    container.removeEventListener('touchend', onTouchEnd);
    container.removeEventListener('touchcancel', onTouchCancel);
  };
}

