/**
 * SmmAgency — Контракты фронтенда (ES-модули / Vanilla JS + JSDoc)
 * Содержит описания моделей данных, схем валидации и методов форматирования.
 */

import {
  UserRole,
  UserRoleLabels,
  BusinessStatus,
  BloggerStatus,
  BUSINESS_STATUS_CONFIG,
  BLOGGER_STATUS_CONFIG,
  TOKEN_STORAGE_KEY,
} from './constants.js';

export {
  UserRole,
  UserRoleLabels,
  BusinessStatus,
  BloggerStatus,
  BUSINESS_STATUS_CONFIG,
  BLOGGER_STATUS_CONFIG,
  TOKEN_STORAGE_KEY,
};

/**
 * @typedef {Object} LoginDto
 * @property {string} login - Логин (3-20 символов)
 * @property {string} password - Пароль (6-30 символов)
 */

/**
 * @typedef {Object} RegistrationDto
 * @property {string} login - Логин (3-20 символов)
 * @property {string} password - Пароль (6-30 символов)
 * @property {number} role - Роль (0 = Manager, 1 = Admin)
 */

/**
 * @typedef {Object} AuthorizationResponseDto
 * @property {string} token - JWT Bearer токен
 * @property {number} role - Роль пользователя (0 = Manager, 1 = Admin)
 */

/**
 * @typedef {Object} BusinessResponseDto
 * @property {number} id
 * @property {string} name
 * @property {string} instagramHandle
 * @property {string} category
 * @property {number} status - 0: NoCampaigns, 1: InProgress, 2: Completed
 */

/**
 * @typedef {Object} CreateBusinessDto
 * @property {string} name
 * @property {string} instagramHandle
 * @property {string} category
 */

/**
 * @typedef {Object} BloggerResponseDto
 * @property {number} id
 * @property {string} instagramHandle
 * @property {string} instagramUrl
 * @property {number} followersCount
 * @property {number} engagementRate
 * @property {number} status - 0: NoAnswer, 1: Agreed, 2: Disagreed, 3: Posted
 */

/**
 * @typedef {Object} CreateBloggerDto
 * @property {string} instagramHandle
 * @property {string} instagramUrl
 * @property {number} followersCount
 * @property {number} engagementRate
 */

/**
 * @typedef {Object} CampaignResponseDto
 * @property {number} id
 * @property {number} businessId
 * @property {string} businessName
 * @property {number} targetReelsCount
 * @property {number} completedReelsCount
 * @property {string} createdAt
 */

/**
 * @typedef {Object} CreateCampaignDto
 * @property {number} businessId
 * @property {number} targetReelsCount
 */

/**
 * @typedef {Object} PostStatResponseDto
 * @property {number} id
 * @property {number} campaignId
 * @property {number} bloggerId
 * @property {string} bloggerHandle
 * @property {string} managerName
 * @property {string} postUrl
 * @property {number} likesCount
 * @property {number} viewsCount
 * @property {string} createdAt
 */

/**
 * @typedef {Object} CreatePostStatDto
 * @property {number} campaignId
 * @property {number} bloggerId
 * @property {string} managerName
 * @property {string} postUrl
 * @property {number} likesCount
 * @property {number} viewsCount
 */

/**
 * @template T
 * @typedef {Object} PagedResult
 * @property {T[]} items
 * @property {number} pageNumber
 * @property {number} pageSize
 * @property {number} totalCount
 * @property {number} totalPages
 * @property {boolean} hasPrevious
 * @property {boolean} hasNext
 */

/**
 * Правила валидации по контракту API
 */
export const ValidationRules = {
  Login: {
    loginMin: 3,
    loginMax: 20,
    passwordMin: 6,
    passwordMax: 30,
  },
  Business: {
    nameMax: 20,
    handlePrefix: '@',
    categoryMax: 40,
  },
  Blogger: {
    handlePrefix: '@',
    followersMin: 1,
    erMin: 1.5,
    erMax: 10.0,
  },
  Campaign: {
    targetMin: 1,
    targetMax: 100,
  },
  PostStat: {
    managerNameMax: 20,
    likesMin: 0,
    viewsMin: 0,
  },
};
