/**
 * User Registration Page Controller (Admin Only)
 */
import { checkAuth } from '../auth/authGuard.js';
import { authApi } from '../api/authApi.js';
import { UserRole } from '../constants.js';
import { showToast } from '../utils/toast.js';
import { ApiError } from '../api/client.js';
import { escapeHtml } from '../utils/dom.js';
import { renderIcon } from '../utils/icons.js';
import { showConfirmDialog } from '../utils/modal.js';

// Enforce Admin role requirement
const user = checkAuth(UserRole.Admin);

if (user) {
  const form = document.getElementById('register-form');
  const generalError = document.getElementById('register-general-error');
  const submitBtn = document.getElementById('submit-btn');
  const usersTableBody = document.getElementById('users-table-body');
  const countUsers = document.getElementById('count-users');

  async function loadUsers() {
    if (!usersTableBody) return;
    try {
      const users = await authApi.getUsers();
      const list = Array.isArray(users) ? users : users.items || [];
      if (countUsers) countUsers.textContent = list.length;

      if (list.length === 0) {
        usersTableBody.innerHTML = `
          <tr>
            <td colspan="4" class="px-5 py-6 text-center text-slate-400">
              В системе пока нет других зарегистрированных сотрудников
            </td>
          </tr>
        `;
        return;
      }

      usersTableBody.innerHTML = list
        .map((u) => {
          const isAdminRole =
            u.role === UserRole.Admin || u.roleName === 'Admin' || u.role === 1;
          const badge = isAdminRole
            ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold font-mono border text-purple-700 dark:text-purple-300 bg-purple-50/90 dark:bg-purple-950/60 border-purple-200/80 dark:border-purple-800/60">
                <span class="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400"></span>
                Администратор (Admin)
              </span>`
            : `<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold font-mono border text-indigo-700 dark:text-indigo-300 bg-indigo-50/90 dark:bg-indigo-950/60 border-indigo-200/80 dark:border-indigo-800/60">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                Менеджер (Manager)
              </span>`;

          const isSelf = user.login && u.login.toLowerCase() === user.login.toLowerCase();

          const actionHtml = isSelf
            ? `<span class="inline-block text-[11px] font-medium text-slate-400 dark:text-slate-500 italic px-2 py-1">Текущий аккаунт</span>`
            : `<button
                type="button"
                data-action="delete"
                data-id="${u.id}"
                data-login="${escapeHtml(u.login)}"
                class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-white dark:hover:bg-slate-800 shadow-2xs transition-all cursor-pointer"
                title="Удалить сотрудника"
              >
                ${renderIcon('trash2', 14)}
              </button>`;

          return `
            <tr class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors h-11 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0">
              <td class="px-5 py-2.5 font-mono text-slate-400 dark:text-slate-500 tabular-nums">#${u.id}</td>
              <td class="px-5 py-2.5 font-semibold text-slate-800 dark:text-slate-200">${escapeHtml(u.login)}</td>
              <td class="px-5 py-2.5">${badge}</td>
              <td class="px-5 py-2.5 text-right whitespace-nowrap">${actionHtml}</td>
            </tr>
          `;
        })
        .join('');

      usersTableBody.querySelectorAll('[data-action="delete"]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const id = Number(btn.dataset.id);
          const login = btn.dataset.login || `ID #${id}`;
          confirmDeleteUser(id, login);
        });
      });
    } catch (err) {
      usersTableBody.innerHTML = `
        <tr>
          <td colspan="4" class="px-5 py-6 text-center text-rose-500">
            Не удалось загрузить список сотрудников: ${escapeHtml(err.message || 'Ошибка')}
          </td>
        </tr>
      `;
    }
  }

  function confirmDeleteUser(id, login) {
    showConfirmDialog({
      title: `Удалить сотрудника "${login}"?`,
      description: `Вы собираетесь удалить учетную запись пользователя "${login}" из системы агентства. Пользователь потеряет доступ к CRM. Это действие необратимо.`,
      confirmLabel: 'Удалить сотрудника',
      isDangerous: true,
      onConfirm: async () => {
        try {
          await authApi.deleteUser(id);
          showToast(`Сотрудник "${login}" успешно удален`, 'success');
          loadUsers();
        } catch (err) {
          showToast(err.message || 'Ошибка при удалении сотрудника', 'error');
        }
      },
    });
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearErrors();

    const login = form.login.value.trim();
    const password = form.password.value;
    const role = Number(form.role.value);

    let hasError = false;

    if (!login) {
      showFieldError('login', 'Логин обязателен');
      hasError = true;
    } else if (login.length < 3 || login.length > 20) {
      showFieldError('login', 'Длина логина должна быть от 3 до 20 символов');
      hasError = true;
    }

    if (!password) {
      showFieldError('password', 'Пароль обязателен');
      hasError = true;
    } else if (password.length < 6 || password.length > 30) {
      showFieldError('password', 'Длина пароля должна быть от 6 до 30 символов');
      hasError = true;
    }

    if (isNaN(role) || (role !== UserRole.Manager && role !== UserRole.Admin)) {
      showFieldError('role', 'Выберите корректную роль');
      hasError = true;
    }

    if (hasError) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Регистрация...';

    try {
      await authApi.register(login, password, role);
      showToast(`Сотрудник "${login}" успешно зарегистрирован в системе`, 'success');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Зарегистрировать сотрудника';
      loadUsers();
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Зарегистрировать сотрудника';

      if (err instanceof ApiError && err.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([field, msgs]) => {
          const lower = field.charAt(0).toLowerCase() + field.slice(1);
          showFieldError(lower, msgs[0]);
        });
      } else {
        generalError.textContent = err.message || 'Ошибка регистрации сотрудника';
        generalError.classList.remove('hidden');
      }
    }
  });

  function clearErrors() {
    if (generalError) {
      generalError.classList.add('hidden');
      generalError.textContent = '';
    }
    document.querySelectorAll('.field-error').forEach((el) => {
      el.textContent = '';
    });
  }

  function showFieldError(fieldName, message) {
    const errEl = document.getElementById(`error-${fieldName}`);
    if (errEl) errEl.textContent = message;
  }

  loadUsers();
}
