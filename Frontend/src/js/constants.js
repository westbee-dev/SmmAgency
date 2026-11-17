/**
 * SmmAgency — Перечисления и константы клиентского приложения (Vanilla JS)
 */

export const UserRole = {
  Manager: 0,
  Admin: 1,
};

export const UserRoleLabels = {
  [UserRole.Manager]: 'Менеджер',
  [UserRole.Admin]: 'Администратор',
};

export const BusinessStatus = {
  NoCampaigns: 0,
  InProgress: 1,
  Completed: 2,
};

export const BloggerStatus = {
  NoAnswer: 0,
  Agreed: 1,
  Disagreed: 2,
  Posted: 3,
};

export const TOKEN_STORAGE_KEY = 'smm_auth_token';

/**
 * Конфигурация отображения статусов бизнесов (согласно дизайн-системе)
 */
export const BUSINESS_STATUS_CONFIG = {
  [BusinessStatus.NoCampaigns]: {
    label: 'Нет кампаний',
    className:
      'text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700/80 shadow-2xs',
    dotColor: 'bg-slate-400 dark:bg-slate-500',
  },
  [BusinessStatus.InProgress]: {
    label: 'В процессе',
    className:
      'text-blue-700 dark:text-blue-300 bg-blue-50/80 dark:bg-blue-950/50 border-blue-200/80 dark:border-blue-800/70 shadow-2xs',
    dotColor: 'bg-blue-600 dark:bg-blue-400',
  },
  [BusinessStatus.Completed]: {
    label: 'Завершена',
    className:
      'text-emerald-700 dark:text-emerald-300 bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-200/80 dark:border-emerald-800/70 shadow-2xs',
    dotColor: 'bg-emerald-600 dark:bg-emerald-400',
  },
};

/**
 * Конфигурация отображения статусов блогеров (согласно дизайн-системе)
 */
export const BLOGGER_STATUS_CONFIG = {
  [BloggerStatus.NoAnswer]: {
    label: 'Нет ответа',
    className:
      'text-slate-600 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 border-slate-200/90 dark:border-slate-700/80 shadow-2xs',
    dotColor: 'bg-slate-400 dark:bg-slate-500',
  },
  [BloggerStatus.Agreed]: {
    label: 'Согласен',
    className:
      'text-amber-800 dark:text-amber-300 bg-amber-50/80 dark:bg-amber-950/50 border-amber-200/80 dark:border-amber-800/70 shadow-2xs',
    dotColor: 'bg-amber-600 dark:bg-amber-400',
  },
  [BloggerStatus.Disagreed]: {
    label: 'Отказ',
    className:
      'text-rose-700 dark:text-rose-300 bg-rose-50/80 dark:bg-rose-950/50 border-rose-200/80 dark:border-rose-800/70 shadow-2xs',
    dotColor: 'bg-rose-600 dark:bg-rose-400',
  },
  [BloggerStatus.Posted]: {
    label: 'Опубликовал',
    className:
      'text-purple-700 dark:text-purple-300 bg-purple-50/80 dark:bg-purple-950/50 border-purple-200/80 dark:border-purple-800/70 shadow-2xs',
    dotColor: 'bg-purple-600 dark:bg-purple-400',
  },
};
