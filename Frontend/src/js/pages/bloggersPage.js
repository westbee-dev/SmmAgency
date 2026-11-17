/**
 * Bloggers Page Controller
 */
import { checkAuth } from '../auth/authGuard.js';
import { bloggersApi } from '../api/bloggersApi.js';
import { UserRole } from '../constants.js';
import {
  renderStatusBadge,
  renderPagination,
  formatNumber,
  formatPercent,
  escapeHtml,
  debounce,
} from '../utils/dom.js';
import { openModal, closeModal, initModal, showConfirmDialog } from '../utils/modal.js';
import { showToast } from '../utils/toast.js';
import { renderIcon } from '../utils/icons.js';
import { ApiError } from '../api/client.js';

const user = checkAuth();
if (user) {
  let currentPage = 1;
  let pageSize = 10;
  let editingId = null;
  let editingStatus = 0;
  let searchTerm = '';
  let selectedStatus = '';
  const isAdmin = user.role === UserRole.Admin;

  const tableBody = document.getElementById('bloggers-table-body');
  const paginationContainer = document.getElementById('pagination-container');
  const countBadge = document.getElementById('count-bloggers');
  const searchInput = document.getElementById('bloggers-search-input');
  const statusFilter = document.getElementById('bloggers-status-filter');
  const modal = document.getElementById('blogger-modal');
  const modalTitle = document.getElementById('blogger-modal-title');
  const modalSubtitle = document.getElementById('blogger-modal-subtitle');
  const submitBtn = document.getElementById('blogger-submit-btn');
  const form = document.getElementById('blogger-form');
  const generalError = document.getElementById('blogger-general-error');
  const btnCreate = document.getElementById('btn-create-blogger');
  const statusGroup = document.getElementById('blogger-status-group');
  const statusSelect = document.getElementById('blogger-status');

  initModal(modal);

  async function loadBloggers() {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="px-5 py-8 text-center text-slate-400">
          <div class="inline-flex items-center gap-2">
            <span class="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
            <span>Загрузка блогеров...</span>
          </div>
        </td>
      </tr>
    `;

    try {
      const data = await bloggersApi.getAll(currentPage, pageSize, searchTerm, selectedStatus);
      renderTable(data.items || []);
      renderPagination({
        container: paginationContainer,
        pageNumber: data.pageNumber,
        totalPages: data.totalPages,
        totalCount: data.totalCount,
        pageSize: data.pageSize,
        hasPrevious: data.hasPrevious,
        hasNext: data.hasNext,
        onPageChange: (newPage) => {
          currentPage = newPage;
          loadBloggers();
        },
        onPageSizeChange: (newSize) => {
          pageSize = newSize;
          currentPage = 1;
          loadBloggers();
        },
      });

      if (countBadge) {
        countBadge.textContent = data.totalCount ?? data.items?.length ?? 0;
      }
    } catch (err) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="px-5 py-8 text-center text-rose-500">
            Ошибка загрузки данных: ${escapeHtml(err.message)}
          </td>
        </tr>
      `;
    }
  }

  function renderTable(items) {
    if (!items || items.length === 0) {
      const emptyText =
        searchTerm || selectedStatus !== ''
          ? 'По заданным параметрам поиска блогеры не найдены'
          : 'В базе пока нет зарегистрированных блогеров';
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="px-5 py-8 text-center text-slate-400">
            ${emptyText}
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = items
      .map(
        (b) => `
      <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors h-12 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0">
        <td class="px-5 py-2.5 font-mono text-slate-400 dark:text-slate-500 tabular-nums">#${b.id}</td>
        <td class="px-5 py-2.5">
          <a
            href="${escapeHtml(b.instagramUrl)}"
            target="_blank"
            rel="noreferrer"
            class="font-mono font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 text-xs"
          >
            <span>${escapeHtml(b.instagramHandle)}</span>
            ${renderIcon('externalLink', 12)}
          </a>
        </td>
        <td class="px-5 py-2.5 text-right font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
          ${formatNumber(b.followersCount)}
        </td>
        <td class="px-5 py-2.5 text-right font-mono tabular-nums text-slate-800 dark:text-slate-200">
          ${formatPercent(b.engagementRate)}
        </td>
        <td class="px-5 py-2.5">
          ${renderStatusBadge('blogger', b.status)}
        </td>
        <td class="px-5 py-2.5 text-right space-x-1 whitespace-nowrap">
          <button
            type="button"
            data-action="edit"
            data-id="${b.id}"
            class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
            title="Редактировать блогера"
          >
            ${renderIcon('edit2', 14)}
          </button>
          ${
            isAdmin
              ? `<button
                  type="button"
                  data-action="delete"
                  data-id="${b.id}"
                  data-handle="${escapeHtml(b.instagramHandle)}"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
                  title="Удалить (Admin Only)"
                >
                  ${renderIcon('trash2', 14)}
                </button>`
              : ''
          }
        </td>
      </tr>
    `
      )
      .join('');

    tableBody.querySelectorAll('[data-action="edit"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        openEditBlogger(id);
      });
    });

    tableBody.querySelectorAll('[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        const handle = btn.dataset.handle || `ID #${id}`;
        confirmDeleteBlogger(id, handle);
      });
    });
  }

  function confirmDeleteBlogger(id, handle) {
    showConfirmDialog({
      title: `Удалить блогера "${handle}"?`,
      description:
        'Вы собираетесь удалить инфлюенсера из базы данных агентства. Все связанные публикации рилсов останутся в архиве. Это действие необратимо.',
      confirmLabel: 'Удалить блогера',
      isDangerous: true,
      onConfirm: async () => {
        try {
          await bloggersApi.delete(id);
          showToast('Блогер успешно удален', 'success');
          loadBloggers();
        } catch (err) {
          showToast(err.message || 'Ошибка при удалении блогера', 'error');
        }
      },
    });
  }

  // Open Edit Modal
  async function openEditBlogger(id) {
    editingId = id;
    if (modalTitle) modalTitle.textContent = 'Редактировать блогера';
    if (modalSubtitle) modalSubtitle.textContent = 'Изменение параметров инфлюенсера';
    if (submitBtn) submitBtn.textContent = 'Сохранить изменения';
    if (statusGroup) statusGroup.classList.remove('hidden');
    clearErrors();

    try {
      const b = await bloggersApi.getById(id);
      editingStatus = b.status ?? 0;
      form.instagramHandle.value = b.instagramHandle || '@';
      form.instagramUrl.value = b.instagramUrl || '';
      form.followersCount.value = b.followersCount || 0;
      form.engagementRate.value = b.engagementRate || 1.5;
      if (statusSelect) statusSelect.value = String(editingStatus);
      openModal(modal);
    } catch (err) {
      showToast('Не удалось загрузить данные блогера', 'error');
    }
  }

  // Open Create Modal
  btnCreate?.addEventListener('click', () => {
    editingId = null;
    editingStatus = 0;
    if (modalTitle) modalTitle.textContent = 'Новый блогер в базе';
    if (modalSubtitle) modalSubtitle.textContent = 'Инфлюенсер создается со стартовым статусом "Нет ответа"';
    if (submitBtn) submitBtn.textContent = 'Добавить в реестр';
    if (statusGroup) statusGroup.classList.add('hidden');
    if (statusSelect) statusSelect.value = '0';
    form.reset();
    form.instagramHandle.value = '@';
    form.instagramUrl.value = 'https://instagram.com/';
    form.followersCount.value = '50000';
    form.engagementRate.value = '3.5';
    clearErrors();
    openModal(modal);
  });

  // Form Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const instagramHandle = form.instagramHandle.value.trim();
    const instagramUrl = form.instagramUrl.value.trim();
    const followersCount = Number(form.followersCount.value);
    const engagementRate = parseFloat(form.engagementRate.value);

    let hasError = false;

    if (!instagramHandle) {
      showFieldError('instagramHandle', 'Instagram handle обязателен');
      hasError = true;
    } else if (!instagramHandle.startsWith('@')) {
      showFieldError('instagramHandle', 'Должно начинаться с @');
      hasError = true;
    }

    if (!instagramUrl) {
      showFieldError('instagramUrl', 'URL профиля обязателен');
      hasError = true;
    } else if (!instagramUrl.startsWith('http://') && !instagramUrl.startsWith('https://')) {
      showFieldError('instagramUrl', 'Введите валидный URL (https://...)');
      hasError = true;
    }

    if (isNaN(followersCount) || followersCount <= 0) {
      showFieldError('followersCount', 'Количество подписчиков должно быть больше 0');
      hasError = true;
    }

    if (isNaN(engagementRate) || engagementRate < 0.1 || engagementRate > 100.0) {
      showFieldError('engagementRate', 'ER должен быть в интервале от 0.1 до 100.0%');
      hasError = true;
    }

    if (hasError) return;

    const payload = {
      instagramHandle,
      instagramUrl,
      followersCount,
      engagementRate,
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      if (editingId) {
        const status = statusSelect ? Number(statusSelect.value) : (editingStatus ?? 0);
        await bloggersApi.update(editingId, { ...payload, status });
        showToast('Данные блогера успешно обновлены', 'success');
      } else {
        await bloggersApi.create(payload);
        showToast('Блогер успешно добавлен в базу со статусом "Нет ответа"', 'success');
      }
      closeModal(modal);
      loadBloggers();
    } catch (err) {
      if (err instanceof ApiError && err.fieldErrors) {
        let fieldHandled = false;
        Object.entries(err.fieldErrors).forEach(([field, msgs]) => {
          const lower = field.charAt(0).toLowerCase() + field.slice(1);
          const msg = Array.isArray(msgs) ? msgs.join(', ') : msgs;
          const shown = showFieldError(lower, msg);
          if (shown) fieldHandled = true;
        });
        if (!fieldHandled) {
          generalError.textContent = err.message || 'Ошибка создания блогера';
          generalError.classList.remove('hidden');
        }
      } else {
        generalError.textContent = err.message || 'Ошибка создания блогера';
        generalError.classList.remove('hidden');
      }
    } finally {
      submitBtn.disabled = false;
    }
  });

  function clearErrors() {
    generalError.classList.add('hidden');
    generalError.textContent = '';
    document.querySelectorAll('.field-error').forEach((el) => {
      el.textContent = '';
    });
  }

  function showFieldError(fieldName, message) {
    const errEl = document.getElementById(`error-${fieldName}`);
    if (errEl) {
      errEl.textContent = message;
      return true;
    }
    return false;
  }

  // Search input with 300ms debounce
  searchInput?.addEventListener(
    'input',
    debounce((e) => {
      searchTerm = e.target.value.trim();
      currentPage = 1;
      loadBloggers();
    }, 300)
  );

  // Status select filter
  statusFilter?.addEventListener('change', (e) => {
    selectedStatus = e.target.value;
    currentPage = 1;
    loadBloggers();
  });

  loadBloggers();
}
