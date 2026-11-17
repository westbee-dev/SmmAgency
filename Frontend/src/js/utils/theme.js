/**
 * Theme Manager (Dark / Light mode) with localStorage persistence
 */

export const THEME_STORAGE_KEY = 'smm_theme';

export function getPreferredTheme() {
  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function applyTheme(theme) {
  const isDark = theme === 'dark';
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem(THEME_STORAGE_KEY, theme);
  updateAllThemeTogglesUI(theme);
}

export function toggleTheme() {
  const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

export function updateAllThemeTogglesUI(theme) {
  const isDark = theme === 'dark';
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.title = isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему';
    btn.setAttribute('aria-label', isDark ? 'Переключить на светлую тему' : 'Переключить на тёмную тему');

    const textEl = btn.querySelector('[data-theme-text]');
    const dotEl = btn.querySelector('[data-theme-dot]');
    const sunIcon = btn.querySelector('[data-theme-sun]');
    const moonIcon = btn.querySelector('[data-theme-moon]');

    if (textEl) {
      textEl.textContent = isDark ? 'Dark mode' : 'Light mode';
    }
    if (dotEl) {
      if (isDark) {
        dotEl.classList.remove('translate-x-0');
        dotEl.classList.add('translate-x-3');
      } else {
        dotEl.classList.remove('translate-x-3');
        dotEl.classList.add('translate-x-0');
      }
    }
    if (sunIcon && moonIcon) {
      if (isDark) {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
      } else {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
      }
    }
  });
}

export function setupThemeToggle() {
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    if (!btn._hasThemeListener) {
      btn._hasThemeListener = true;
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleTheme();
      });
    }
  });
}
