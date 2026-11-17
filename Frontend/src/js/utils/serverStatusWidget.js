/**
 * Global Server & Database Health Status Widget
 * Renders in bottom-right corner with 3 state indicators:
 *   - Red:   Database disconnected / Server offline
 *   - Blue:  Checking / Syncing
 *   - Green: Database connected & ready
 */
import { checkBackendConnection } from '../api/client.js';

let isPollingStarted = false;

export function initServerStatusWidget(options = {}) {
  const { autoPoll = true, pollIntervalMs = 25000, onStatusChange = null } = options;

  let widget = document.getElementById('server-status-pill');

  if (!widget) {
    widget = document.createElement('div');
    widget.id = 'server-status-pill';
    widget.className =
      'fixed bottom-4 right-4 z-50 flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-white/90 dark:bg-[#131824]/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-700/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] text-xs transition-all duration-300 select-none group hover:shadow-[0_8px_30px_rgb(0,0,0,0.14)]';

    widget.innerHTML = `
      <div class="flex items-center gap-1.5 p-1 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
        <span
          id="status-dot-red"
          class="w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-25 bg-slate-300 dark:bg-slate-600"
          title="Красный — Сервер недоступен / Ошибка"
        ></span>
        <span
          id="status-dot-blue"
          class="w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-25 bg-slate-300 dark:bg-slate-600"
          title="Синий — Проверка соединения"
        ></span>
        <span
          id="status-dot-green"
          class="w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-25 bg-slate-300 dark:bg-slate-600"
          title="Зелёный — Сервер подключен и активен"
        ></span>
      </div>
      <div class="flex flex-col">
        <div class="flex items-center gap-1.5">
          <span class="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">Сервер:</span>
          <span id="server-status-text" class="text-xs font-semibold text-slate-700 dark:text-slate-200 font-display">
            Проверка...
          </span>
        </div>
      </div>
      <button
        type="button"
        id="btn-recheck-server"
        class="p-1 -mr-1 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-all cursor-pointer"
        title="Обновить состояние сервера"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="status-refresh-icon"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
      </button>
    `;
    document.body.appendChild(widget);
  }

  const dotRed = widget.querySelector('#status-dot-red');
  const dotBlue = widget.querySelector('#status-dot-blue');
  const dotGreen = widget.querySelector('#status-dot-green');
  const textEl = widget.querySelector('#server-status-text');
  const recheckBtn = widget.querySelector('#btn-recheck-server');
  const refreshIcon = widget.querySelector('.status-refresh-icon');

  function setCheckingState() {
    if (dotRed) dotRed.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-25 bg-slate-300';
    if (dotGreen) dotGreen.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-25 bg-slate-300';
    if (dotBlue) dotBlue.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-100 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.9)] animate-pulse';

    if (textEl) {
      textEl.textContent = 'Опрос...';
      textEl.className = 'text-xs font-semibold text-blue-600 font-display';
    }
    if (refreshIcon) refreshIcon.classList.add('animate-spin');
  }

  function setConnectedState() {
    if (dotRed) dotRed.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-25 bg-slate-300';
    if (dotBlue) dotBlue.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-25 bg-slate-300';
    if (dotGreen) dotGreen.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-100 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.9)]';

    if (textEl) {
      textEl.textContent = 'В сети';
      textEl.className = 'text-xs font-semibold text-emerald-600 font-display';
    }
    if (refreshIcon) refreshIcon.classList.remove('animate-spin');
  }

  function setDisconnectedState(details = 'Нет связи') {
    if (dotBlue) dotBlue.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-25 bg-slate-300';
    if (dotGreen) dotGreen.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-25 bg-slate-300';
    if (dotRed) dotRed.className = 'w-2.5 h-2.5 rounded-full transition-all duration-300 opacity-100 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.9)] animate-pulse';

    if (textEl) {
      textEl.textContent = details;
      textEl.className = 'text-xs font-semibold text-rose-600 font-display';
    }
    if (refreshIcon) refreshIcon.classList.remove('animate-spin');
  }

  async function updateStatus() {
    setCheckingState();
    const result = await checkBackendConnection();
    if (result.online && result.database === 'connected') {
      setConnectedState();
    } else if (result.online && result.database === 'disconnected') {
      setDisconnectedState('БД офлайн');
    } else {
      setDisconnectedState('Сервер офлайн');
    }

    if (typeof onStatusChange === 'function') {
      onStatusChange(result);
    }
    return result;
  }

  if (recheckBtn && !recheckBtn._hasStatusListener) {
    recheckBtn._hasStatusListener = true;
    recheckBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      updateStatus();
    });
  }

  // Initial check
  updateStatus();

  // Background polling (every 25s)
  if (autoPoll && !isPollingStarted) {
    isPollingStarted = true;
    setInterval(() => {
      updateStatus();
    }, pollIntervalMs);
  }

  return { updateStatus, setConnectedState, setDisconnectedState };
}
