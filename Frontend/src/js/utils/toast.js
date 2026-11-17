/**
 * Toast notifications — exact styling from reference ToastContext
 */
import { renderIcon } from './icons.js';

let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer || !document.body.contains(toastContainer)) {
    toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className =
        'fixed top-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none';
      document.body.appendChild(toastContainer);
    }
  }
  return toastContainer;
}

export function showToast(message, type = 'info') {
  const container = ensureToastContainer();

  const configs = {
    success: {
      cardStyle:
        'bg-white/95 border-emerald-200 text-emerald-950 shadow-[0_8px_24px_rgba(16,185,129,0.08)]',
      icon: renderIcon('checkCircle2', 17, 'text-emerald-600 shrink-0'),
    },
    error: {
      cardStyle:
        'bg-white/95 border-rose-200 text-rose-950 shadow-[0_8px_24px_rgba(244,63,94,0.08)]',
      icon: renderIcon('alertCircle', 17, 'text-rose-600 shrink-0'),
    },
    warning: {
      cardStyle:
        'bg-white/95 border-amber-200 text-amber-950 shadow-[0_8px_24px_rgba(245,158,11,0.08)]',
      icon: renderIcon('alertTriangle', 17, 'text-amber-600 shrink-0'),
    },
    info: {
      cardStyle:
        'bg-white/95 border-indigo-200 text-indigo-950 shadow-[0_8px_24px_rgba(99,102,241,0.08)]',
      icon: renderIcon('info', 17, 'text-indigo-600 shrink-0'),
    },
  };

  const config = configs[type] || configs.info;

  const toast = document.createElement('div');
  toast.className = `pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border backdrop-blur-xl transition-all duration-300 opacity-0 translate-y-2 ${config.cardStyle}`;
  toast.innerHTML = `
    <div class="pt-0.5">${config.icon}</div>
    <p class="text-xs font-medium flex-1 pt-0.5 leading-relaxed">${escapeToastText(message)}</p>
    <button type="button" class="text-slate-400 hover:text-slate-700 p-0.5 rounded-lg transition-colors" title="Закрыть">
      ${renderIcon('x', 14)}
    </button>
  `;

  const closeBtn = toast.querySelector('button');
  const remove = () => {
    toast.classList.add('opacity-0', '-translate-y-2');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 200);
  };

  closeBtn?.addEventListener('click', remove);

  container.appendChild(toast);

  // Trigger enter animation
  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-y-2');
  });

  // Auto remove after 4s
  setTimeout(remove, 4000);
}

function escapeToastText(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}
