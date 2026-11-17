/**
 * Login Page Controller
 * Strictly requires active Backend connection (no offline mode)
 */
import { authApi } from '../api/authApi.js';
import { TOKEN_STORAGE_KEY } from '../constants.js';
import { isTokenExpired } from '../utils/jwt.js';
import { showToast } from '../utils/toast.js';
import { ApiError } from '../api/client.js';
import { initServerStatusWidget } from '../utils/serverStatusWidget.js';
import { setupThemeToggle } from '../utils/theme.js';

// Setup theme switcher on login page
setupThemeToggle();

// Purge any legacy mock tokens from previous offline sessions
const existingToken = localStorage.getItem(TOKEN_STORAGE_KEY);
if (existingToken && (existingToken.includes('mockSignature') || isTokenExpired(existingToken))) {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

const loginForm = document.getElementById('login-form');
const loginInput = document.getElementById('login');
const passwordInput = document.getElementById('password');
const errorMessageEl = document.getElementById('error-message');
const errorTitleEl = document.getElementById('error-title');
const errorTextEl = document.getElementById('error-text');
const submitBtn = document.getElementById('submit-btn');

let isBackendReachable = null;

function showError(title, message) {
  if (errorMessageEl) {
    if (errorTitleEl) errorTitleEl.textContent = title || 'Ошибка';
    if (errorTextEl) errorTextEl.textContent = message || '';
    errorMessageEl.classList.remove('hidden');
  }
}

function clearError() {
  if (errorMessageEl) {
    errorMessageEl.classList.add('hidden');
    if (errorTitleEl) errorTitleEl.textContent = '';
    if (errorTextEl) errorTextEl.textContent = '';
  }
}

// Initialize floating server & database status widget in bottom-right corner
const statusWidget = initServerStatusWidget({
  autoPoll: true,
  pollIntervalMs: 20000,
  onStatusChange: (result) => {
    isBackendReachable = result.online;
    if (result.online && result.database === 'connected') {
      clearError();
      const currentToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (currentToken && !isTokenExpired(currentToken) && !currentToken.includes('mockSignature')) {
        window.location.href = '/businesses.html';
      }
    } else if (result.online && result.database === 'disconnected') {
      showError(
        'Ошибка сервера',
        'Сервер временно недоступен. Пожалуйста, повторите попытку позже.'
      );
    } else {
      showError(
        'Сервер недоступен',
        'Не удалось связаться с сервером. Пожалуйста, проверьте подключение к сети или повторите попытку позже.'
      );
    }
  },
});

async function handleLogin() {
  clearError();

  const login = loginInput.value.trim();
  const password = passwordInput.value;

  if (!login) {
    showError('Заполните поле', 'Введите логин для входа');
    loginInput.focus();
    return;
  }

  if (login.length < 3 || login.length > 20) {
    showError('Некорректный логин', 'Логин должен содержать от 3 до 20 символов');
    loginInput.focus();
    return;
  }

  if (!password) {
    showError('Заполните поле', 'Введите пароль');
    passwordInput.focus();
    return;
  }

  if (password.length < 6 || password.length > 30) {
    showError('Некорректный пароль', 'Пароль должен содержать от 6 до 30 символов');
    passwordInput.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerHTML = `
    <span class="inline-flex items-center gap-2">
      <span class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
      <span>Авторизация...</span>
    </span>
  `;

  try {
    const result = await authApi.login(login, password);

    if (result && result.token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, result.token);
      showToast('Вход выполнен успешно', 'success');
      setTimeout(() => {
        window.location.href = '/businesses.html';
      }, 300);
    } else {
      throw new Error('Токен не получен от сервера бэкенда');
    }
  } catch (err) {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Войти в систему';

    // Handle Network / Backend Offline Error
    if (err.isNetworkError || err.status === 0 || err.status === 502 || err.status === 503 || err.status === 504) {
      showError(
        'Сервер недоступен',
        'Не удалось связаться с сервером. Пожалуйста, проверьте подключение к интернету или повторите попытку через пару минут.'
      );
      showToast('Ошибка: сервер недоступен', 'error');
      return;
    }

    if (err instanceof ApiError) {
      if (err.status === 401) {
        showError(
          'Неверные учетные данные',
          'Неверный логин или пароль. Пожалуйста, проверьте правильность введенных данных.'
        );
      } else if (err.fieldErrors) {
        const firstErr = Object.values(err.fieldErrors)[0];
        showError('Ошибка валидации', firstErr ? firstErr[0] : err.message);
      } else {
        showError('Ошибка сервера', err.message || 'Ошибка авторизации на сервере');
      }
    } else {
      showError('Ошибка запроса', err.message || 'Произошла непредвиденная ошибка при отправке запроса');
    }
  }
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleLogin();
  });
} else if (submitBtn) {
  submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    handleLogin();
  });
}
