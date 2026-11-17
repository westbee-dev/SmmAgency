/**
 * Authentication Guard and Layout Sidebar Initializer
 */
import { TOKEN_STORAGE_KEY, UserRole } from '../constants.js';
import { parseJwt, isTokenExpired } from '../utils/jwt.js';
import { initServerStatusWidget } from '../utils/serverStatusWidget.js';
import { setupThemeToggle } from '../utils/theme.js';

export function checkAuth(requiredRole = null) {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (!token) {
    window.location.href = '/index.html';
    return null;
  }

  // Reject legacy mock tokens
  if (token.includes('mockSignature') || isTokenExpired(token)) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.location.href = '/index.html';
    return null;
  }

  const user = parseJwt(token);
  if (!user) {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.location.href = '/index.html';
    return null;
  }

  if (requiredRole !== null && user.role !== requiredRole) {
    alert('У вас нет доступа к этой странице');
    window.location.href = '/businesses.html';
    return null;
  }

  setupSidebarProfile(user);
  applyRoleVisibility(user);
  initServerStatusWidget();
  setupThemeToggle();

  return user;
}

export function setupSidebarProfile(user) {
  const loginEl = document.getElementById('user-login-display');
  const roleNameEl = document.getElementById('user-role-name');
  const roleDotEl = document.getElementById('user-role-dot');
  const logoutBtn = document.getElementById('logout-btn');

  if (loginEl) loginEl.textContent = user.login;

  const isAdmin = user.role === UserRole.Admin;
  if (roleNameEl) {
    roleNameEl.textContent = isAdmin ? 'Администратор' : 'Менеджер';
  }

  if (roleDotEl) {
    roleDotEl.className = `w-1.5 h-1.5 rounded-full ${isAdmin ? 'bg-indigo-600' : 'bg-blue-600'}`;
  }

  if (logoutBtn && !logoutBtn._hasLogoutListener) {
    logoutBtn._hasLogoutListener = true;
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.location.href = '/index.html';
    });
  }
}

export function applyRoleVisibility(user) {
  const isAdmin = user.role === UserRole.Admin;

  if (!isAdmin) {
    document.querySelectorAll('[data-role="admin"]').forEach((el) => {
      el.classList.add('hidden');
    });
  } else {
    document.querySelectorAll('[data-role="admin"]').forEach((el) => {
      el.classList.remove('hidden');
    });
  }
}
