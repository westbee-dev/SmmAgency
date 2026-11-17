/**
 * Campaigns Page Controller
 */
import { checkAuth } from '../auth/authGuard.js';
import { campaignsApi } from '../api/campaignsApi.js';
import { businessesApi } from '../api/businessesApi.js';
import { BusinessStatus, UserRole } from '../constants.js';
import { renderPagination, formatDate, escapeHtml, debounce } from '../utils/dom.js';
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
  const isAdmin = user.role === UserRole.Admin;

  const tableBody = document.getElementById('campaigns-table-body');
  const paginationContainer = document.getElementById('pagination-container');
  const countBadge = document.getElementById('count-campaigns');
  const searchInput = document.getElementById('campaigns-search-input');
  const modal = document.getElementById('campaign-modal');
  const modalTitle = document.getElementById('campaign-modal-title');
  const modalSubtitle = document.getElementById('campaign-modal-subtitle');
  const submitBtn = document.getElementById('campaign-submit-btn');
  const form = document.getElementById('campaign-form');
  const generalError = document.getElementById('campaign-general-error');
  const businessSelect = document.getElementById('campaign-businessId');
  const btnCreate = document.getElementById('btn-create-campaign');
  const headerActionContainer = document.getElementById('header-action-container');

  initModal(modal);

  // Setup header action for Admin vs Manager
  if (headerActionContainer) {
    if (isAdmin) {
      headerActionContainer.innerHTML = `
        <button
          type="button"
          id="btn-create-campaign"
          class="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border dark:border-slate-700 active:scale-[0.98] rounded-xl shadow-xs transition-all whitespace-nowrap cursor-pointer"
        >
          ${renderIcon('plus', 15)}
          <span>Создать кампанию</span>
        </button>
      `;
      headerActionContainer
        .querySelector('#btn-create-campaign')
        ?.addEventListener('click', handleOpenCreateCampaign);
    } else {
      headerActionContainer.innerHTML = `
        <div class="text-xs px-3.5 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 flex items-center gap-2">
          ${renderIcon('shieldAlert', 14, 'text-amber-600 dark:text-amber-400 shrink-0')}
          <span>Создание доступно только Администратору</span>
        </div>
      `;
    }
  }

  async function loadCampaigns() {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="px-5 py-8 text-center text-slate-400">
          <div class="inline-flex items-center gap-2">
            <span class="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
            <span>Загрузка кампаний...</span>
          </div>
        </td>
      </tr>
    `;

    try {
      const data = await campaignsApi.getAll(currentPage, pageSize, searchTerm);
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
          loadCampaigns();
        },
        onPageSizeChange: (newSize) => {
          pageSize = newSize;
          currentPage = 1;
          loadCampaigns();
        },
      });

      if (countBadge) {
        countBadge.textContent = data.totalCount ?? data.items?.length ?? 0;
      }
    } catch (err) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="px-5 py-8 text-center text-rose-500">
            Ошибка загрузки данных: ${escapeHtml(err.message)}
          </td>
        </tr>
      `;
    }
  }

  function renderTable(items) {
    if (!items || items.length === 0) {
      const emptyText = searchTerm
        ? 'По заданному запросу кампании не найдены'
        : 'В базе пока нет активных рекламных кампаний';
      tableBody.innerHTML = `
        <tr>
          <td colspan="5" class="px-5 py-8 text-center text-slate-400">
            ${emptyText}
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = items
      .map((c) => {
        const percent = Math.min(
          100,
          Math.round(((c.completedReelsCount || 0) / (c.targetReelsCount || 1)) * 100)
        );
        const isComplete = percent >= 100;

        return `
        <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors h-14 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0">
          <td class="px-5 py-2.5 font-mono text-slate-400 dark:text-slate-500 tabular-nums">#${c.id}</td>
          <td class="px-5 py-2.5">
            <div class="font-semibold text-slate-900 dark:text-slate-100">${escapeHtml(c.businessName)}</div>
            <div class="font-mono text-[11px] text-slate-500 dark:text-slate-400">${escapeHtml(c.businessHandle || '—')}</div>
          </td>
          <td class="px-5 py-2.5 min-w-[190px]">
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-mono font-medium ${isComplete ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-600 dark:text-slate-300'}">
                  ${c.completedReelsCount} / ${c.targetReelsCount} рилсов
                </span>
                <span class="font-mono text-slate-400 dark:text-slate-500 font-medium">${percent}%</span>
              </div>
              <div class="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-300 ${
                    isComplete ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-indigo-600 dark:bg-indigo-500'
                  }"
                  style="width: ${percent}%"
                ></div>
              </div>
            </div>
          </td>
          <td class="px-5 py-2.5 font-mono text-slate-500 dark:text-slate-400">${formatDate(c.createdDate || c.createdAt)}</td>
          <td class="px-5 py-2.5 text-right space-x-1 whitespace-nowrap">
            ${
              isAdmin
                ? `<button
                    type="button"
                    data-action="edit"
                    data-id="${c.id}"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
                    title="Редактировать кампанию (Admin Only)"
                  >
                    ${renderIcon('edit2', 14)}
                  </button>
                  <button
                    type="button"
                    data-action="delete"
                    data-id="${c.id}"
                    data-name="${escapeHtml(c.businessName)}"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
                    title="Удалить кампанию (Admin Only)"
                  >
                    ${renderIcon('trash2', 14)}
                  </button>`
                : '<span class="text-slate-300 dark:text-slate-600 text-[11px]">—</span>'
            }
          </td>
        </tr>
      `;
      })
      .join('');

    tableBody.querySelectorAll('[data-action="edit"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        handleOpenEditCampaign(id);
      });
    });

    tableBody.querySelectorAll('[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        const name = btn.dataset.name || `ID #${id}`;
        confirmDeleteCampaign(id, name);
      });
    });
  }

  function confirmDeleteCampaign(id, name) {
    showConfirmDialog({
      title: `Удалить кампанию для "${name}"?`,
      description:
        'Вы собираетесь удалить рекламную кампанию из базы. Статус бизнеса будет возвращен в исходное состояние. Это действие необратимо.',
      confirmLabel: 'Удалить кампанию',
      isDangerous: true,
      onConfirm: async () => {
        try {
          await campaignsApi.delete(id);
          showToast('Кампания удалена из базы', 'success');
          loadCampaigns();
        } catch (err) {
          showToast(err.message || 'Ошибка при удалении кампании', 'error');
        }
      },
    });
  }

  async function handleOpenEditCampaign(id) {
    if (!isAdmin) {
      showToast('Редактирование кампаний доступно только Администратору', 'error');
      return;
    }

    editingId = id;
    if (modalTitle) modalTitle.textContent = 'Редактировать кампанию';
    if (modalSubtitle) modalSubtitle.textContent = 'Изменение целевого количества рилсов';
    if (submitBtn) submitBtn.textContent = 'Сохранить изменения';
    clearErrors();

    try {
      const c = await campaignsApi.getById(id);
      businessSelect.innerHTML = `<option value="${c.businessId}">${escapeHtml(c.businessName)} (Кампания #${c.id})</option>`;
      businessSelect.disabled = true;
      form.targetReelsCount.value = c.targetReelsCount;
      openModal(modal);
    } catch (err) {
      showToast('Не удалось загрузить данные кампании', 'error');
    }
  }

  async function handleOpenCreateCampaign() {
    if (!isAdmin) {
      showToast('Создание кампаний доступно только Администратору', 'error');
      return;
    }

    editingId = null;
    businessSelect.disabled = false;
    if (modalTitle) modalTitle.textContent = 'Запуск рекламной кампании';
    if (modalSubtitle) modalSubtitle.textContent = 'Создание кампании разрешено только для бизнеса со статусом "Нет кампаний"';
    if (submitBtn) submitBtn.textContent = 'Запустить кампанию';

    clearErrors();
    form.reset();
    form.targetReelsCount.value = '10';

    // Load available businesses
    businessSelect.innerHTML = '<option value="">Загрузка списка бизнесов...</option>';
    openModal(modal);

    try {
      const bizData = await businessesApi.getAll(1, 100);
      const items = bizData.items || [];
      const available = items.filter((b) => b.status === BusinessStatus.NoCampaigns);

      if (items.length === 0) {
        businessSelect.innerHTML = '<option value="">Сначала создайте бизнес в разделе Бизнесы</option>';
        return;
      }

      businessSelect.innerHTML = items
        .map((b) => {
          const isEligible = b.status === BusinessStatus.NoCampaigns;
          return `
          <option value="${b.id}" ${!isEligible ? 'disabled' : ''}>
            ${escapeHtml(b.name)} (${isEligible ? 'Готов к запуску' : 'Кампания уже активна/завершена'})
          </option>
        `;
        })
        .join('');

      if (available.length > 0) {
        businessSelect.value = available[0].id;
      } else {
        generalError.textContent =
          'Нет доступных бизнесов со статусом "Нет кампаний". Все бизнесы уже участвуют в кампаниях.';
        generalError.classList.remove('hidden');
      }
    } catch (err) {
      businessSelect.innerHTML = '<option value="">Ошибка загрузки бизнесов</option>';
      showToast('Не удалось загрузить список бизнесов', 'error');
    }
  }

  // Form Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const businessId = Number(businessSelect.value);
    const targetReelsCount = Number(form.targetReelsCount.value);

    let hasError = false;

    if (!businessId || isNaN(businessId)) {
      showFieldError('businessId', 'Выберите бизнес со статусом "Нет кампаний"');
      hasError = true;
    }

    if (isNaN(targetReelsCount) || targetReelsCount < 1 || targetReelsCount > 100) {
      showFieldError('targetReelsCount', 'Целевое число рилсов должно быть от 1 до 100');
      hasError = true;
    }

    if (hasError) return;

    const payload = {
      businessId,
      targetReelsCount,
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      if (editingId) {
        await campaignsApi.update(editingId, { targetReelsCount });
        showToast('Кампания успешно обновлена', 'success');
      } else {
        await campaignsApi.create(payload);
        showToast('Кампания создана! Статус бизнеса переведен в "В процессе"', 'success');
      }
      closeModal(modal);
      loadCampaigns();
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
          generalError.textContent = err.message || 'Ошибка запуска кампании';
          generalError.classList.remove('hidden');
        }
      } else {
        generalError.textContent = err.message || 'Ошибка запуска кампании';
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
      loadCampaigns();
    }, 300)
  );

  loadCampaigns();
}
