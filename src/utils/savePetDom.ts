import { state } from '../state.ts';

/**
 * Updates all heart save buttons & drawer counter in-place for a pet ID
 * without triggering a full view re-render.
 */
export function syncPetSaveButtonsInDom(petId: string, isSaved: boolean): void {
  if (typeof document === 'undefined' || !petId) return;
  const escapedId =
    typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
      ? CSS.escape(petId)
      : petId.replace(/"/g, '\\"');
  const buttons = document.querySelectorAll<HTMLButtonElement>(
    `[data-pet-save-id="${escapedId}"]`
  );

  buttons.forEach((btn) => {
    btn.setAttribute('aria-pressed', isSaved ? 'true' : 'false');
    btn.setAttribute('title', isSaved ? 'إزالة من المحفوظات' : 'حفظ');
    const icon = btn.querySelector('i');
    if (icon) {
      if (isSaved) {
        icon.classList.remove('fa-regular', 'text-brand-subtleGray', 'text-warm-textSec', 'dark:text-[#A89F91]');
        icon.classList.add('fa-solid', 'text-red-500');
      } else {
        icon.classList.remove('fa-solid', 'text-red-500');
        icon.classList.add('fa-regular');
        if (btn.id === 'detail-save-pet-btn') {
          icon.classList.add('text-brand-subtleGray');
        } else {
          icon.classList.add('text-warm-textSec', 'dark:text-[#A89F91]');
        }
      }
    }
  });

  const drawerBadge = document.querySelector('#drawer-saved-pets-btn span.rounded-full');
  if (drawerBadge) {
    drawerBadge.textContent = String(state.getSavedCount());
  }
}

/**
 * Toggles save state silently and patches DOM in-place with rollback on sync failure.
 */
export function handleZeroFlashSavePetClick(petId: string): boolean {
  const isSavedNow = state.toggleSavePet(petId, {
    silent: true,
    onErrorRollback: (rolledBackSaved) => {
      syncPetSaveButtonsInDom(petId, rolledBackSaved);
    },
  });
  syncPetSaveButtonsInDom(petId, isSavedNow);
  return isSavedNow;
}
