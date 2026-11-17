/**
 * Guide & Knowledge Base Page Controller
 */
import { checkAuth } from '../auth/authGuard.js';
import { showToast } from '../utils/toast.js';

const user = checkAuth();

if (user) {
  // 1. Live ER Calculator
  const followersInput = document.getElementById('calc-followers');
  const viewsInput = document.getElementById('calc-views');
  const likesInput = document.getElementById('calc-likes');
  const commentsInput = document.getElementById('calc-comments');

  const resultEl = document.getElementById('calc-er-result');
  const badgeEl = document.getElementById('calc-badge');
  const verdictEl = document.getElementById('calc-verdict');

  function calculateER() {
    if (!followersInput || !resultEl) return;

    const followers = Math.max(1, Number(followersInput.value) || 0);
    const views = Math.max(0, Number(viewsInput.value) || 0);
    const likes = Math.max(0, Number(likesInput.value) || 0);
    const comments = Math.max(0, Number(commentsInput.value) || 0);

    const interactions = likes + comments;
    const er = (interactions / followers) * 100;
    const erFormatted = er.toFixed(2);

    resultEl.textContent = `${erFormatted}%`;

    let badgeClass = '';
    let badgeText = '';
    let verdictText = '';

    if (er >= 4.0) {
      badgeClass = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60';
      badgeText = '🟢 Отличная вовлеченность (High ER)';
      verdictText =
        'Прекрасный результат! Аудитория очень активна и лояльна. Отлично подходит для микро- и мидл-инфлюенсеров.';
    } else if (er >= 2.0) {
      badgeClass = 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/60';
      badgeText = '🔵 Хорошая рабочая норма (Standard)';
      verdictText =
        'Стабильный норматив для большинства коммерческих размещений в среднем ценовом сегменте блогеров.';
    } else if (er >= 1.0) {
      badgeClass = 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60';
      badgeText = '🟡 Умеренный ER (Допустимо для крупных блогеров)';
      verdictText =
        'Нормально для авторов от 300 000+ подписчиков. Для микро-блогеров такой ER может говорить о выгорании аудитории.';
    } else {
      badgeClass = 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60';
      badgeText = '🔴 Критически низкий ER (Риск накрутки / ботов)';
      verdictText =
        'Внимание! Менее 1% вовлеченности. Высокий риск накрученных подписчиков или неактивной аудитории. Требуется детальная ручная проверка.';
    }

    if (views > 0) {
      const viewsRatio = ((views / followers) * 100).toFixed(1);
      verdictText += ` Просмотры рилса составляют ~${viewsRatio}% от общего числа подписчиков.`;
    }

    if (badgeEl) {
      badgeEl.className = `mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${badgeClass}`;
      badgeEl.textContent = badgeText;
    }

    if (verdictEl) {
      verdictEl.textContent = verdictText;
    }
  }

  [followersInput, viewsInput, likesInput, commentsInput].forEach((input) => {
    input?.addEventListener('input', calculateER);
  });

  calculateER();

  // 2. Copy script text to clipboard
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const targetId = btn.dataset.copyTarget;
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      const text = targetEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        showToast('Шаблон сообщения скопирован в буфер обмена', 'success');
      } catch {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Шаблон сообщения скопирован в буфер обмена', 'success');
      }
    });
  });
}
