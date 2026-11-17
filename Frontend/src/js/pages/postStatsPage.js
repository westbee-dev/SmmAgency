/**
 * PostStats Page Controller
 */
import { checkAuth } from '../auth/authGuard.js';
import { postStatsApi } from '../api/postStatsApi.js';
import { campaignsApi } from '../api/campaignsApi.js';
import { bloggersApi } from '../api/bloggersApi.js';
import { UserRole } from '../constants.js';
import {
  renderPagination,
  formatNumber,
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
  let searchTerm = '';
  const isAdmin = user.role === UserRole.Admin;

  const tableBody = document.getElementById('poststats-table-body');
  const paginationContainer = document.getElementById('pagination-container');
  const countBadge = document.getElementById('count-poststats');
  const searchInput = document.getElementById('poststats-search-input');
  const modal = document.getElementById('poststat-modal');
  const modalTitle = document.getElementById('poststat-modal-title');
  const modalSubtitle = document.getElementById('poststat-modal-subtitle');
  const submitBtn = document.getElementById('poststat-submit-btn');
  const form = document.getElementById('poststat-form');
  const generalError = document.getElementById('poststat-general-error');
  const campaignSelect = document.getElementById('poststat-campaignId');
  const bloggerSelect = document.getElementById('poststat-bloggerId');
  const btnCreate = document.getElementById('btn-create-poststat');

  initModal(modal);

  async function loadPostStats() {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="px-5 py-8 text-center text-slate-400">
          <div class="inline-flex items-center gap-2">
            <span class="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></span>
            <span>Загрузка статистики рилсов...</span>
          </div>
        </td>
      </tr>
    `;

    try {
      const data = await postStatsApi.getAll(currentPage, pageSize, searchTerm);
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
          loadPostStats();
        },
        onPageSizeChange: (newSize) => {
          pageSize = newSize;
          currentPage = 1;
          loadPostStats();
        },
      });

      if (countBadge) {
        countBadge.textContent = data.totalCount ?? data.items?.length ?? 0;
      }
    } catch (err) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" class="px-5 py-8 text-center text-rose-500">
            Ошибка загрузки данных: ${escapeHtml(err.message)}
          </td>
        </tr>
      `;
    }
  }

  function renderTable(items) {
    if (!items || items.length === 0) {
      const emptyText = searchTerm
        ? 'По заданному запросу публикации не найдены'
        : 'В базе пока нет внесенных публикаций рилсов';
      tableBody.innerHTML = `
        <tr>
          <td colspan="8" class="px-5 py-8 text-center text-slate-400">
            ${emptyText}
          </td>
        </tr>
      `;
      return;
    }

    tableBody.innerHTML = items
      .map(
        (stat) => `
      <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors h-12 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0">
        <td class="px-5 py-2.5 font-mono text-slate-400 dark:text-slate-500 tabular-nums">#${stat.id}</td>
        <td class="px-5 py-2.5 font-mono text-slate-600 dark:text-slate-400">#${stat.campaignId}</td>
        <td class="px-5 py-2.5 font-mono text-indigo-600 dark:text-indigo-400 font-semibold">${escapeHtml(stat.bloggerHandle || '—')}</td>
        <td class="px-5 py-2.5 text-slate-700 dark:text-slate-300">${escapeHtml(stat.managerName)}</td>
        <td class="px-5 py-2.5 text-right font-mono tabular-nums font-semibold text-slate-900 dark:text-slate-100">
          ${formatNumber(stat.viewsCount)}
        </td>
        <td class="px-5 py-2.5 text-right font-mono tabular-nums text-slate-800 dark:text-slate-200">
          ${formatNumber(stat.likesCount)}
        </td>
        <td class="px-5 py-2.5">
          <a
            href="${escapeHtml(stat.postUrl)}"
            target="_blank"
            rel="noreferrer"
            class="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
          >
            <span>Instagram Reel</span>
            ${renderIcon('externalLink', 11)}
          </a>
        </td>
        <td class="px-5 py-2.5 text-right space-x-1 whitespace-nowrap">
          <button
            type="button"
            data-action="edit"
            data-id="${stat.id}"
            class="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
            title="Редактировать запись"
          >
            ${renderIcon('edit2', 14)}
          </button>
          ${
            isAdmin
              ? `<button
                  type="button"
                  data-action="delete"
                  data-id="${stat.id}"
                  class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
                  title="Удалить запись (Admin Only)"
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
        openEditPostStat(id);
      });
    });

    tableBody.querySelectorAll('[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        confirmDeletePostStat(id);
      });
    });
  }

  function confirmDeletePostStat(id) {
    showConfirmDialog({
      title: `Удалить запись статистики #${id}?`,
      description:
        'Вы собираетесь удалить запись о публикации рилса. Счетчик выполненных рилсов в кампании будет пересчитан. Это действие необратимо.',
      confirmLabel: 'Удалить запись',
      isDangerous: true,
      onConfirm: async () => {
        try {
          await postStatsApi.delete(id);
          showToast('Запись статистики удалена', 'success');
          loadPostStats();
        } catch (err) {
          showToast(err.message || 'Ошибка при удалении статистики', 'error');
        }
      },
    });
  }

  async function loadSelectOptions(selectedCampaignId = null, selectedBloggerId = null) {
    campaignSelect.innerHTML = '<option value="">Загрузка кампаний...</option>';
    bloggerSelect.innerHTML = '<option value="">Загрузка блогеров...</option>';

    try {
      const [campaignsRes, bloggersRes] = await Promise.all([
        campaignsApi.getAll(1, 100),
        bloggersApi.getAll(1, 100),
      ]);

      const campaigns = campaignsRes.items || [];
      const bloggers = bloggersRes.items || [];

      if (campaigns.length === 0) {
        campaignSelect.innerHTML = '<option value="">Нет созданных кампаний</option>';
      } else {
        campaignSelect.innerHTML = campaigns
          .map(
            (c) =>
              `<option value="${c.id}" ${c.id === selectedCampaignId ? 'selected' : ''}>#${c.id} ${escapeHtml(c.businessName)} (${c.completedReelsCount}/${c.targetReelsCount} рилсов)</option>`
          )
          .join('');
      }

      if (bloggers.length === 0) {
        bloggerSelect.innerHTML = '<option value="">Нет зарегистрированных блогеров</option>';
      } else {
        bloggerSelect.innerHTML = bloggers
          .map(
            (b) =>
              `<option value="${b.id}" ${b.id === selectedBloggerId ? 'selected' : ''}>${escapeHtml(b.instagramHandle)} (${formatNumber(b.followersCount)} подп.)</option>`
          )
          .join('');
      }
    } catch (err) {
      showToast('Не удалось загрузить списки кампаний или блогеров', 'error');
    }
  }

  // Open Edit Modal
  async function openEditPostStat(id) {
    editingId = id;
    if (modalTitle) modalTitle.textContent = 'Редактировать статистику рилса';
    if (modalSubtitle) modalSubtitle.textContent = 'Изменение параметров или показателей публикации';
    if (submitBtn) submitBtn.textContent = 'Сохранить изменения';
    clearErrors();

    try {
      const stat = await postStatsApi.getById(id);
      await loadSelectOptions(stat.campaignId, stat.bloggerId);

      campaignSelect.value = stat.campaignId;
      bloggerSelect.value = stat.bloggerId;
      form.managerName.value = stat.managerName || user.login || '';
      form.managerName.readOnly = true;
      form.postUrl.value = stat.postUrl || '';
      form.viewsCount.value = stat.viewsCount ?? stat.views ?? 0;
      form.likesCount.value = stat.likesCount ?? stat.likes ?? 0;

      openModal(modal);
    } catch (err) {
      showToast('Не удалось загрузить данные рилса', 'error');
    }
  }

  // Open Create Modal
  btnCreate?.addEventListener('click', async () => {
    editingId = null;
    if (modalTitle) modalTitle.textContent = 'Внесение статистики рилса';
    if (modalSubtitle) modalSubtitle.textContent = 'Фиксация выхода рекламы и инкремент счетчика рилсов кампании';
    if (submitBtn) submitBtn.textContent = 'Зафиксировать рилс';
    clearErrors();
    form.reset();
    form.managerName.value = user.login || '';
    form.managerName.readOnly = true;
    form.postUrl.value = 'https://instagram.com/reel/';
    form.viewsCount.value = '25000';
    form.likesCount.value = '1500';

    openModal(modal);
    await loadSelectOptions();
  });

  // Form Submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const campaignId = Number(campaignSelect.value);
    const bloggerId = Number(bloggerSelect.value);
    const managerName = (form.managerName.value.trim() || user.login || '');
    const postUrl = form.postUrl.value.trim();
    const viewsCount = Number(form.viewsCount.value);
    const likesCount = Number(form.likesCount.value);

    let hasError = false;

    if (!campaignId || isNaN(campaignId)) {
      showFieldError('campaignId', 'Выберите кампанию');
      hasError = true;
    }

    if (!bloggerId || isNaN(bloggerId)) {
      showFieldError('bloggerId', 'Выберите блогера');
      hasError = true;
    }

    if (!managerName) {
      showFieldError('managerName', 'Имя менеджера обязательно');
      hasError = true;
    } else if (managerName.length > 20) {
      showFieldError('managerName', 'Максимальная длина имени — 20 символов');
      hasError = true;
    }

    if (!postUrl) {
      showFieldError('postUrl', 'Ссылка на рилс обязательна');
      hasError = true;
    } else if (!postUrl.startsWith('http://') && !postUrl.startsWith('https://')) {
      showFieldError('postUrl', 'Введите валидный URL (https://...)');
      hasError = true;
    }

    if (isNaN(viewsCount) || viewsCount < 0) {
      showFieldError('viewsCount', 'Просмотры не могут быть отрицательными');
      hasError = true;
    }

    if (isNaN(likesCount) || likesCount < 0) {
      showFieldError('likesCount', 'Лайки не могут быть отрицательными');
      hasError = true;
    }

    if (hasError) return;

    const payload = {
      campaignId,
      bloggerId,
      managerName,
      postUrl,
      viewsCount,
      likesCount,
      views: viewsCount,
      likes: likesCount,
    };

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      if (editingId) {
        await postStatsApi.update(editingId, payload);
        showToast('Запись статистики рилса обновлена!', 'success');
      } else {
        await postStatsApi.create(payload);
        showToast('Статистика рилса внесена! Статус блогера переведен в "Опубликовал"', 'success');
      }
      closeModal(modal);
      loadPostStats();
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
          generalError.textContent = err.message || 'Ошибка внесения рилса';
          generalError.classList.remove('hidden');
        }
      } else {
        generalError.textContent = err.message || 'Ошибка внесения рилса';
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
      loadPostStats();
    }, 300)
  );

  loadPostStats();
}
