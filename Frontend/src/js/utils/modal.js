/**
 * Modal & Confirmation Dialog Management
 */
import { renderIcon } from './icons.js';
import { escapeHtml } from './dom.js';

export function openModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      closeModal(modalEl);
    }
  };

  modalEl._escListener = onKeyDown;
  window.addEventListener('keydown', onKeyDown);
}

export function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.classList.add('hidden');
  document.body.style.overflow = '';

  if (modalEl._escListener) {
    window.removeEventListener('keydown', modalEl._escListener);
    modalEl._escListener = null;
  }
}

/**
 * Setup backdrop and close button handlers on standard modal
 */
export function initModal(modalEl) {
  if (!modalEl) return;
  const backdrop = modalEl.querySelector('[data-modal-backdrop]');
  const closeBtns = modalEl.querySelectorAll('[data-modal-close]');

  backdrop?.addEventListener('click', () => closeModal(modalEl));
  closeBtns.forEach((btn) => btn.addEventListener('click', () => closeModal(modalEl)));
}

/**
 * Dynamic Confirmation Dialog matching ConfirmDialog.tsx
 */
let confirmDialogEl = null;

export function showConfirmDialog({
  title,
  description,
  confirmLabel = 'Удалить',
  cancelLabel = 'Отмена',
  isDangerous = true,
  onConfirm,
}) {
  if (confirmDialogEl && confirmDialogEl.parentNode) {
    confirmDialogEl.parentNode.removeChild(confirmDialogEl);
  }

  confirmDialogEl = document.createElement('div');
  confirmDialogEl.className =
    'fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in';
  confirmDialogEl.setAttribute('role', 'dialog');
  confirmDialogEl.setAttribute('aria-modal', 'true');

  confirmDialogEl.innerHTML = `
    <!-- Neutral optical glass ambient backdrop -->
    <div class="fixed inset-0 bg-slate-900/25 dark:bg-slate-950/70 backdrop-blur-sm transition-opacity" data-dialog-backdrop></div>

    <!-- Frosted Optical Glass Dialog Card -->
    <div class="relative w-full max-w-sm rounded-2xl bg-white/95 dark:bg-[#131824] backdrop-blur-2xl border border-white/95 dark:border-slate-700/80 shadow-[0_20px_50px_rgba(15,23,42,0.1),inset_0_1px_1px_rgba(255,255,255,1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transform transition-all z-10 text-slate-900 dark:text-slate-100">
      <div class="flex items-start justify-between px-6 py-4.5 border-b border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
        <div>
          <h3 class="font-display text-base font-bold tracking-tight text-slate-900 dark:text-white">
            ${escapeHtml(title)}
          </h3>
        </div>
        <button
          type="button"
          class="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 rounded-xl transition-colors cursor-pointer"
          data-dialog-close
          title="Закрыть"
        >
          ${renderIcon('x', 16)}
        </button>
      </div>

      <div class="px-6 py-5 space-y-4">
        <div class="flex items-start gap-3.5">
          ${
            isDangerous
              ? `<div class="p-2.5 text-rose-600 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/50 rounded-xl shrink-0 backdrop-blur-md">
                   ${renderIcon('alertTriangle', 20)}
                 </div>`
              : ''
          }
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">${escapeHtml(description)}</p>
        </div>

        <div class="flex justify-end gap-2.5 pt-4 border-t border-slate-200/60 dark:border-slate-800">
          <button
            type="button"
            data-dialog-cancel
            class="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 rounded-xl transition-all cursor-pointer"
          >
            ${escapeHtml(cancelLabel)}
          </button>
          <button
            type="button"
            data-dialog-confirm
            class="px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-all cursor-pointer ${
              isDangerous
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }"
          >
            ${escapeHtml(confirmLabel)}
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(confirmDialogEl);
  document.body.style.overflow = 'hidden';

  const closeDialog = () => {
    document.body.style.overflow = '';
    window.removeEventListener('keydown', onKeyDown);
    if (confirmDialogEl && confirmDialogEl.parentNode) {
      confirmDialogEl.parentNode.removeChild(confirmDialogEl);
      confirmDialogEl = null;
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') closeDialog();
  };
  window.addEventListener('keydown', onKeyDown);

  confirmDialogEl.querySelector('[data-dialog-backdrop]')?.addEventListener('click', closeDialog);
  confirmDialogEl.querySelector('[data-dialog-close]')?.addEventListener('click', closeDialog);
  confirmDialogEl.querySelector('[data-dialog-cancel]')?.addEventListener('click', closeDialog);

  confirmDialogEl.querySelector('[data-dialog-confirm]')?.addEventListener('click', () => {
    closeDialog();
    if (typeof onConfirm === 'function') onConfirm();
  });
}
