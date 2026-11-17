/**
 * DOM Formatting & Rendering Utilities
 */
import {
  BUSINESS_STATUS_CONFIG,
  BLOGGER_STATUS_CONFIG,
} from '../constants.js';
import { renderIcon } from './icons.js';

export function escapeHtml(text) {
  if (text === null || text === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

export function formatNumber(value) {
  if (typeof value !== 'number' || isNaN(value)) return '0';
  return new Intl.NumberFormat('ru-RU').format(value);
}

export function formatPercent(value) {
  if (typeof value !== 'number' || isNaN(value)) return '0%';
  return `${value.toFixed(1)}%`;
}

export function formatDate(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return isoString;
  }
}

/**
 * Status Badge matching reference StatusBadge.tsx
 */
export function renderStatusBadge(type, status) {
  const config =
    type === 'business'
      ? BUSINESS_STATUS_CONFIG[status]
      : BLOGGER_STATUS_CONFIG[status];

  if (!config) return '<span class="text-slate-400">—</span>';

  return `
    <span class="inline-flex items-center gap-1.5 font-medium rounded-lg backdrop-blur-md border whitespace-nowrap transition-all px-2.5 py-0.5 text-xs ${config.className}">
      <span class="w-1.5 h-1.5 rounded-full ${config.dotColor} shrink-0" aria-hidden="true"></span>
      <span>${escapeHtml(config.label)}</span>
    </span>
  `;
}

/**
 * Pagination component matching reference Pagination.tsx
 */
export function renderPagination({
  container,
  pageNumber,
  totalPages,
  totalCount,
  pageSize,
  hasPrevious,
  hasNext,
  onPageChange,
  onPageSizeChange,
}) {
  if (!container) return;

  const startItem = totalCount === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const endItem = Math.min(pageNumber * pageSize, totalCount);

  container.innerHTML = `
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-3.5 border-t border-slate-200/70 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 bg-white/45 dark:bg-[#141925]/80 backdrop-blur-md">
      <div class="flex items-center gap-3">
        <span class="tabular-nums font-mono text-[11px]">
          Показано <strong class="font-semibold text-slate-800 dark:text-slate-200">${formatNumber(startItem)}–${formatNumber(endItem)}</strong> из
          <strong class="font-semibold text-slate-800 dark:text-slate-200">${formatNumber(totalCount)}</strong> записей
        </span>

        <div class="flex items-center gap-1.5 pl-3 border-l border-slate-200 dark:border-slate-800">
          <span class="text-slate-400 dark:text-slate-500 text-xs">По:</span>
          <select id="pagination-page-size" class="bg-white/90 dark:bg-[#181f2f] border border-slate-200/80 dark:border-slate-700 rounded-lg px-2 py-0.5 text-xs text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-2xs cursor-pointer">
            <option value="10" ${pageSize === 10 ? 'selected' : ''}>10</option>
            <option value="20" ${pageSize === 20 ? 'selected' : ''}>20</option>
            <option value="50" ${pageSize === 50 ? 'selected' : ''}>50</option>
          </select>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="mr-2 tabular-nums text-slate-500 dark:text-slate-400 font-mono text-[11px]">
          Стр. ${pageNumber} из ${Math.max(1, totalPages)}
        </span>

        <button
          type="button"
          id="btn-pagination-prev"
          ${!hasPrevious ? 'disabled' : ''}
          class="flex items-center justify-center p-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-white/80 dark:bg-[#181f2f] text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 shadow-2xs transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          title="Предыдущая страница"
        >
          ${renderIcon('chevronLeft', 16)}
        </button>

        <button
          type="button"
          id="btn-pagination-next"
          ${!hasNext ? 'disabled' : ''}
          class="flex items-center justify-center p-1.5 rounded-lg border border-slate-200/80 dark:border-slate-700 bg-white/80 dark:bg-[#181f2f] text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 shadow-2xs transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          title="Следующая страница"
        >
          ${renderIcon('chevronRight', 16)}
        </button>
      </div>
    </div>
  `;

  container.querySelector('#btn-pagination-prev')?.addEventListener('click', () => {
    if (hasPrevious) onPageChange(pageNumber - 1);
  });

  container.querySelector('#btn-pagination-next')?.addEventListener('click', () => {
    if (hasNext) onPageChange(pageNumber + 1);
  });

  container.querySelector('#pagination-page-size')?.addEventListener('change', (e) => {
    if (onPageSizeChange) onPageSizeChange(Number(e.target.value));
  });
}

/**
 * Debounce helper for search inputs
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}
