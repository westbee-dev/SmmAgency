/**
 * Businesses Page Controller
 */
import { checkAuth } from '../auth/authGuard.js';
import { businessesApi } from '../api/businessesApi.js';
import { UserRole } from '../constants.js';
import { renderStatusBadge, renderPagination, escapeHtml, debounce } from '../utils/dom.js';
import { openModal, closeModal, initModal, showConfirmDialog } from '../utils/modal.js';
import { showToast } from '../utils/toast.js';
import { renderIcon } from '../utils/icons.js';
import { ApiError } from '../api/client.js';

const user = checkAuth();
if (user) {
  let currentPage = 1;
  let pageSize = 10;
  let editingId = null;
  let searchTerm = '';
  let selectedStatus = '';

  const tableBody = document.getElementById('businesses-table-body');
  const paginationContainer = document.getElementById('pagination-container');
  const countBadge = document.getElementById('count-businesses');
  const searchInput = document.getElementById('businesses-search-input');
  const statusFilter = document.getElementById('businesses-status-filter');
  const modal = document.getElementById('business-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const form = document.getElementById('business-form');
  const generalError = document.getElementById('business-general-error');
  const btnCreate = document.getElementById('btn-create-business');

  initModal(modal);

  async function loadBusinesses() {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="px-5 py-8 text-center text-slate-400">
          <div class="inline-flex items-center gap-2">
            <span class="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
            <span>Загрузка бизнесов...</span>
          </div>
        </td>
      </tr>
    `;

    try {
      const data = await businessesApi.getAll(currentPage, pageSize, searchTerm, selectedStatus);
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
          loadBusinesses();
        },
        onPageSizeChange: (newSize) => {
          pageSize = newSize;
          currentPage = 1;
          loadBusinesses();
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
          ? 'По заданным параметрам поиска бизнесы не найдены'
          : 'В базе пока нет зарегистрированных бизнесов';
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="px-5 py-8 text-center text-slate-400">
            ${emptyText}
          </td>
        </tr>
      `;
      return;
    }

    const isAdmin = user.role === UserRole.Admin;

    tableBody.innerHTML = items
      .map(
        (b) => `
      <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors h-12 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0">
        <td class="px-5 py-2.5 font-mono text-slate-400 dark:text-slate-500 tabular-nums">#${b.id}</td>
        <td class="px-5 py-2.5 font-semibold text-slate-900 dark:text-slate-100">${escapeHtml(b.name)}</td>
        <td class="px-5 py-2.5 font-mono text-indigo-600 dark:text-indigo-400 font-medium">${escapeHtml(b.instagramHandle)}</td>
        <td class="px-5 py-2.5 text-slate-600 dark:text-slate-400">${escapeHtml(b.category)}</td>
        <td class="px-5 py-2.5">${renderStatusBadge('business', b.status)}</td>
        <td class="px-5 py-2.5 text-right space-x-1 whitespace-nowrap">
          <button
            type="button"
            data-action="edit"
            data-id="${b.id}"
            class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
            title="Редактировать"
          >
            ${renderIcon('edit2', 14)}
          </button>
          ${
            isAdmin
              ? `<button
                  type="button"
                  data-action="delete"
                  data-id="${b.id}"
                  data-name="${escapeHtml(b.name)}"
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
      btn.addEventListener('click', () => openEditModal(Number(btn.dataset.id)));
    });

    tableBody.querySelectorAll('[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        const name = btn.dataset.name || `ID #${id}`;
        confirmDeleteBusiness(id, name);
      });
    });
  }

  function confirmDeleteBusiness(id, name) {
    showConfirmDialog({
      title: `Удалить бизнес "${name}"?`,
      description:
        'Вы собираетесь удалить этот бизнес из базы данных агентства. Все связанные кампании должны быть завершены или удалены. Это действие необратимо.',
      confirmLabel: 'Удалить бизнес',
      isDangerous: true,
      onConfirm: async () => {
        try {
          await businessesApi.delete(id);
          showToast('Бизнес успешно удален', 'success');
          loadBusinesses();
        } catch (err) {
          showToast(err.message || 'Ошибка при удалении бизнеса', 'error');
        }
      },
    });
  }

  // Open Create Modal
  btnCreate?.addEventListener('click', () => {
    editingId = null;
    modalTitle.textContent = 'Новый бизнес клиента';
    modalSubtitle.textContent = 'Заведение карточки бренда в базу данных агентства';
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Сохранить бренд';
    form.reset();
    form.instagramHandle.value = '@';
    clearErrors();
    openModal(modal);
  });

  // Open Edit Modal
  async function openEditModal(id) {
    editingId = id;
    modalTitle.textContent = 'Редактировать бизнес';
    modalSubtitle.textContent = 'Изменение реквизитов и категории бренда';
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.textContent = 'Сохранить изменения';
    clearErrors();

    try {
      const data = await businessesApi.getById(id);
      form.name.value = data.name || '';
      form.instagramHandle.value = data.instagramHandle || '@';
      form.category.value = data.category || '';
      openModal(modal);
    } catch (err) {
      showToast('Не удалось загрузить данные бизнеса', 'error');
    }
  }

  // Form Submit (POST / PUT)
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const name = form.name.value.trim();
    const instagramHandle = form.instagramHandle.value.trim();
    const category = form.category.value.trim();

    let hasClientError = false;

    if (!name) {
      showFieldError('name', 'Название компании обязательно');
      hasClientError = true;
    } else if (name.length > 100) {
      showFieldError('name', 'Максимальная длина названия — 100 символов');
      hasClientError = true;
    }

    if (!instagramHandle) {
      showFieldError('instagramHandle', 'InstagramHandle обязателен');
      hasClientError = true;
    } else if (!instagramHandle.startsWith('@')) {
      showFieldError('instagramHandle', 'InstagramHandle должен начинаться с символа @');
      hasClientError = true;
    }

    if (!category) {
      showFieldError('category', 'Категория бизнеса обязательна');
      hasClientError = true;
    } else if (category.length > 40) {
      showFieldError('category', 'Максимальная длина категории — 40 символов');
      hasClientError = true;
    }

    if (hasClientError) return;

    const payload = { name, instagramHandle, category };
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      if (editingId) {
        await businessesApi.update(editingId, payload);
        showToast('Бизнес успешно обновлен', 'success');
      } else {
        await businessesApi.create(payload);
        showToast('Бизнес успешно создан со статусом "Нет кампаний"', 'success');
      }
      closeModal(modal);
      loadBusinesses();
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
          generalError.textContent = err.message || 'Ошибка сохранения данных';
          generalError.classList.remove('hidden');
        }
      } else {
        generalError.textContent = err.message || 'Ошибка сохранения данных';
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
      loadBusinesses();
    }, 300)
  );

  // Status select filter
  statusFilter?.addEventListener('change', (e) => {
    selectedStatus = e.target.value;
    currentPage = 1;
    loadBusinesses();
  });

  loadBusinesses();
}
