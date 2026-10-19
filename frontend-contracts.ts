/**
 * SmmAgency API — TypeScript контракты для фронтенда
 * Содержит типы данных, enum'ы и интерфейсы для взаимодействия с бэкендом.
 */

// ==========================================
// 1. ПЕРЕЧИСЛЕНИЯ (ENUMS)
// Сериализуются бэкендом как числа (0, 1, 2, 3)
// ==========================================

export enum UserRole {
  Manager = 0,
  Admin = 1,
}

export enum BusinessStatus {
  NoCampaigns = 0,
  InProgress = 1,
  Completed = 2,
}

export enum BloggerStatus {
  NoAnswer = 0,
  Agreed = 1,
  Disagreed = 2,
  Posted = 3,
}

// ==========================================
// 2. ОБЩИЕ СТРУКТУРЫ (ПАГИНАЦИЯ И ОШИБКИ)
// ==========================================

export interface PaginationParams {
  page?: number;      // по умолчанию 1
  pageSize?: number;  // по умолчанию 10, максимум 50
}

export interface PagedResult<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

/**
 * Единый формат необработанной ошибки сервера (500 Internal Server Error)
 */
export interface ErrorResponse {
  status: number;
  title: string;
  detail: string;
}

/**
 * Формат ошибок валидации FluentValidation (400 Bad Request)
 */
export interface ValidationErrorsResponse {
  type?: string;
  title: string;
  status: number;
  errors: Record<string, string[]>;
}

// ==========================================
// 3. АВТОРИЗАЦИЯ (AUTHORIZATION)
// ==========================================

export interface AuthorizationDto {
  login: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface RegistrationDto {
  login: string;     // min: 3, max: 20
  password: string;  // min: 6, max: 30
  role: UserRole;    // 0 = Manager, 1 = Admin
}

// ==========================================
// 4. БИЗНЕСЫ (BUSINESSES)
// ==========================================

export interface BusinessResponseDto {
  id: number;
  name: string;
  instagramHandle: string;
  category: string;
  status: BusinessStatus;
}

export interface CreateBusinessDto {
  name: string;             // max: 20
  instagramHandle: string;  // must start with '@', unique
  category: string;         // max: 40
}

export interface UpdateBusinessDto {
  name: string;             // max: 20
  instagramHandle: string;  // must start with '@', unique
  category: string;         // max: 40
}

// ==========================================
// 5. БЛОГЕРЫ (BLOGGERS)
// ==========================================

export interface BloggerResponseDto {
  id: number;
  instagramHandle: string;
  instagramUrl: string;
  followersCount: number;
  engagementRate: number;
  status: BloggerStatus;
}

export interface CreateBloggerDto {
  instagramHandle: string;  // must start with '@', unique
  instagramUrl: string;     // valid absolute URL
  followersCount: number;   // > 0
  engagementRate: number;   // between 1.5 and 10.0
}

export interface UpdateBloggerDto {
  instagramHandle: string;  // must start with '@', unique
  instagramUrl: string;     // valid absolute URL
  followersCount: number;   // > 0
  engagementRate: number;   // between 1.5 and 10.0
}

// ==========================================
// 6. КАМПАНИИ (CAMPAIGNS)
// ==========================================

export interface CampaignResponseDto {
  id: number;
  businessId: number;
  targetReelsCount: number;
  completedReelsCount: number;
  createdDate: string; // ISO 8601 строка даты/времени, e.g. "2026-10-19T10:00:00Z"
}

export interface CreateCampaignDto {
  businessId: number;       // > 0, бизнес должен быть со статусом NoCampaigns (0)
  targetReelsCount: number; // 1..100
}

export interface UpdateCampaignDto {
  targetReelsCount: number;
}

// ==========================================
// 7. СТАТИСТИКА ПОСТОВ / РИЛСОВ (POST STATS)
// ==========================================

export interface PostStatResponseDto {
  id: number;
  campaignId: number;
  bloggerId: number;
  managerName: string;
  postUrl: string;
  likes: number;
  views: number;
}

export interface CreatePostStatDto {
  campaignId: number;   // > 0
  bloggerId: number;    // > 0, 1 блогер = 1 рилс на кампанию
  managerName: string;  // max: 20
  postUrl: string;      // valid absolute URL
  likes: number;        // >= 0
  views: number;        // >= 0
}

export interface UpdatePostStatDto {
  campaignId: number;
  bloggerId: number;
  managerName: string;
  postUrl: string;
  likes: number;
  views: number;
}
