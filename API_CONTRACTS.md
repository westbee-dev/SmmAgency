# SmmAgency API — Спецификация контрактов для фронтенда

## 1. Общие сведения и аутентификация

- **Базовый URL:** `http://localhost:5000` (или `https://localhost:5001`, см. `launchSettings.json`)
- **Формат данных:** `application/json` (camelCase во всех JSON-ответах и запросах)
- **Схема аутентификации:** `Bearer <JWT_TOKEN>` через заголовок `Authorization`:
  ```http
  Authorization: Bearer <token>
  ```
- **Ролевая модель:**
  - `Admin`: полный доступ ко всем ресурсам и операциям (регистрация пользователей, создание/изменение/удаление кампаний, удаление любых записей).
  - `Manager`: доступ на чтение, создание и обновление бизнесов, блогеров и статистики постов. **Запрещены:** регистрация (`/api/Authorization/registration`), создание/изменение/удаление кампаний (`/api/Campaigns`), любые операции `DELETE` (возвращают `403 Forbidden`).

---

## 2. Перечисления (Enums)

В JSON сериализуются как **числа** (`number`):

### `UserRole`
| Значение | Название | Описание |
|---|---|---|
| `0` | `Manager` | Менеджер |
| `1` | `Admin` | Администратор |

### `BusinessStatus`
| Значение | Название | Описание |
|---|---|---|
| `0` | `NoCampaigns` | Нет активных кампаний |
| `1` | `InProgress` | Кампания в процессе |
| `2` | `Completed` | Кампания завершена |

### `BloggerStatus`
| Значение | Название | Описание |
|---|---|---|
| `0` | `NoAnswer` | Нет ответа |
| `1` | `Agreed` | Согласился |
| `2` | `Disagreed` | Отказался |
| `3` | `Posted` | Рилс опубликован |

---

## 3. Общие структуры данных

### Пагинированный ответ `PagedResult<T>`
Все списочные `GET` эндпоинты возвращают объект со следующей структурой:
```json
{
  "items": [],
  "pageNumber": 1,
  "pageSize": 10,
  "totalCount": 42,
  "totalPages": 5,
  "hasPrevious": false,
  "hasNext": true
}
```
**Параметры пагинации в Query:**
- `page` (число, по умолчанию `1`, минимально `1`)
- `pageSize` (число, по умолчанию `10`, максимум `50`)

### Ошибка сервера `ErrorResponse` (500 Internal Server Error)
Глобальный перехватчик исключений возвращает ошибку в едином формате без stack trace:
```json
{
  "status": 500,
  "title": "Internal Server Error",
  "detail": "Текст ошибки"
}
```

### Ошибки валидации FluentValidation (400 Bad Request)
```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "InstagramHandle": [
      "InstagramHandle должно начинаться с @"
    ]
  }
}
```

---

## 4. Эндпоинты API

### 4.1. Авторизация (`/api/Authorization`)

#### `POST /api/Authorization/authorization`
Вход в систему и получение JWT-токена.
- **Доступ:** `[AllowAnonymous]` (любой пользователь)
- **Request Body (`AuthorizationDto`):**
  ```json
  {
    "login": "admin",
    "password": "adminPassword111"
  }
  ```
- **Правила валидации:**
  - `login`: обязателен
  - `password`: обязателен
- **Ответ 200 OK:**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```
- **Ошибки:**
  - `400 Bad Request` — ошибка валидации входных данных
  - `401 Unauthorized` — `"Неверный логин или пароль"`

#### `POST /api/Authorization/registration`
Регистрация нового пользователя (менеджера или администратора).
- **Доступ:** `[Authorize(Roles = "Admin")]`
- **Request Body (`RegistrationDto`):**
  ```json
  {
    "login": "new_manager",
    "password": "strongPassword123",
    "role": 0
  }
  ```
- **Правила валидации:**
  - `login`: обязателен, длина от 3 до 20 символов
  - `password`: обязателен, длина от 6 до 30 символов
  - `role`: число, допустимые значения: `0` (Manager) или `1` (Admin)
- **Ответ 200 OK:**
  ```json
  "Пользователь успешно создан!"
  ```
- **Ошибки:**
  - `400 Bad Request` — логин уже занят или ошибка валидации
  - `401 Unauthorized` — нет/невалидный токен
  - `403 Forbidden` — попытка вызвать пользователем с ролью `Manager`

---

### 4.2. Бизнесы (`/api/Businesses`)
- **Базовый доступ к контроллеру:** `[Authorize(Roles = "Admin,Manager")]`

#### `GET /api/Businesses?page=1&pageSize=10`
Получение пагинированного списка бизнесов (сортировка по `id`).
- **Доступ:** `Admin`, `Manager`
- **Ответ 200 OK:**
  ```json
  {
    "items": [
      {
        "id": 1,
        "name": "Coffee Shop",
        "instagramHandle": "@coffeeshop",
        "category": "Food & Beverage",
        "status": 0
      }
    ],
    "pageNumber": 1,
    "pageSize": 10,
    "totalCount": 1,
    "totalPages": 1,
    "hasPrevious": false,
    "hasNext": false
  }
  ```

#### `GET /api/Businesses/{id}`
Получение бизнеса по ID.
- **Доступ:** `Admin`, `Manager`
- **Ответ 200 OK:**
  ```json
  {
    "id": 1,
    "name": "Coffee Shop",
    "instagramHandle": "@coffeeshop",
    "category": "Food & Beverage",
    "status": 0
  }
  ```
- **Ошибки:** `404 Not Found`

#### `POST /api/Businesses`
Создание нового бизнеса.
- **Доступ:** `Admin`, `Manager`
- **Request Body (`CreateBusinessDto`):**
  ```json
  {
    "name": "Coffee Shop",
    "instagramHandle": "@coffeeshop",
    "category": "Food & Beverage"
  }
  ```
- **Правила валидации:**
  - `name`: обязателен, максимум 20 символов
  - `instagramHandle`: обязателен, должен начинаться с `@`, уникален в базе
  - `category`: обязателен, максимум 40 символов
- **Ответ 201 Created:** (с заголовком `Location: /api/Businesses/{id}`)
  ```json
  {
    "id": 1,
    "name": "Coffee Shop",
    "instagramHandle": "@coffeeshop",
    "category": "Food & Beverage",
    "status": 0
  }
  ```
- **Ошибки:**
  - `400 Bad Request` — дубликат `instagramHandle` (`"Бизнес с таким InstagramHandle уже существует"`) или ошибка валидации

#### `PUT /api/Businesses/{id}`
Обновление существующего бизнеса.
- **Доступ:** `Admin`, `Manager`
- **Request Body (`UpdateBusinessDto`):**
  ```json
  {
    "name": "Coffee Shop Updated",
    "instagramHandle": "@coffeeshop",
    "category": "Restaurants"
  }
  ```
- **Правила валидации:** те же, что и при создании; уникальность `instagramHandle` проверяется среди других записей (`id != текущий id`).
- **Ответ 204 No Content**
- **Ошибки:**
  - `400 Bad Request` — дубликат `instagramHandle` или ошибка валидации
  - `404 Not Found` — бизнес не найден

#### `DELETE /api/Businesses/{id}`
Удаление бизнеса.
- **Доступ:** `[Authorize(Roles = "Admin")]`
- **Ответ 204 No Content**
- **Ошибки:**
  - `403 Forbidden` — при попытке удаления менеджером
  - `404 Not Found` — бизнес не найден

---

### 4.3. Блогеры (`/api/Bloggers`)
- **Базовый доступ к контроллеру:** `[Authorize(Roles = "Admin,Manager")]`

#### `GET /api/Bloggers?page=1&pageSize=10`
Получение пагинированного списка блогеров (сортировка по `id`).
- **Доступ:** `Admin`, `Manager`
- **Ответ 200 OK:**
  ```json
  {
    "items": [
      {
        "id": 1,
        "instagramHandle": "@alex_blogger",
        "instagramUrl": "https://instagram.com/alex_blogger",
        "followersCount": 25000,
        "engagementRate": 3.8,
        "status": 0
      }
    ],
    "pageNumber": 1,
    "pageSize": 10,
    "totalCount": 1,
    "totalPages": 1,
    "hasPrevious": false,
    "hasNext": false
  }
  ```

#### `GET /api/Bloggers/{id}`
Получение блогера по ID.
- **Доступ:** `Admin`, `Manager`
- **Ответ 200 OK:** `BloggerResponseDto` (см. элемент массива выше)
- **Ошибки:** `404 Not Found`

#### `POST /api/Bloggers`
Создание нового блогера. При создании блогеру автоматически выставляется `status: 0` (`NoAnswer`).
- **Доступ:** `Admin`, `Manager`
- **Request Body (`CreateBloggerDto`):**
  ```json
  {
    "instagramHandle": "@alex_blogger",
    "instagramUrl": "https://instagram.com/alex_blogger",
    "followersCount": 25000,
    "engagementRate": 3.8
  }
  ```
- **Правила валидации:**
  - `instagramHandle`: обязателен, начинается с `@`, уникален в базе
  - `instagramUrl`: обязателен, валидный абсолютный URL
  - `followersCount`: больше `0`
  - `engagementRate`: число от `1.5` до `10`
- **Ответ 201 Created:** `BloggerResponseDto`
- **Ошибки:**
  - `400 Bad Request` — дубликат `instagramHandle` (`"Блогер с таким InstagramHandle уже существует"`) или ошибка валидации

#### `PUT /api/Bloggers/{id}`
Обновление данных блогера.
- **Доступ:** `Admin`, `Manager`
- **Request Body (`UpdateBloggerDto`):** те же поля, что в `CreateBloggerDto`
- **Ответ 204 No Content**
- **Ошибки:**
  - `400 Bad Request` — дубликат `instagramHandle` или ошибка валидации
  - `404 Not Found` — блогер не найден

#### `DELETE /api/Bloggers/{id}`
Удаление блогера.
- **Доступ:** `[Authorize(Roles = "Admin")]`
- **Ответ 204 No Content**
- **Ошибки:**
  - `403 Forbidden` — при попытке удаления менеджером
  - `404 Not Found` — блогер не найден

---

### 4.4. Кампании (`/api/Campaigns`)
- **Базовый доступ к контроллеру:** `[Authorize(Roles = "Admin,Manager")]`
- **Важно:** Все операции изменения (`POST`, `PUT`, `DELETE`) доступны **только роли `Admin`**.

#### `GET /api/Campaigns?page=1&pageSize=10`
Пагинированный список кампаний (сортировка по `id`).
- **Доступ:** `Admin`, `Manager`
- **Ответ 200 OK:**
  ```json
  {
    "items": [
      {
        "id": 1,
        "businessId": 1,
        "targetReelsCount": 10,
        "completedReelsCount": 0,
        "createdDate": "2026-10-19T09:00:00Z"
      }
    ],
    "pageNumber": 1,
    "pageSize": 10,
    "totalCount": 1,
    "totalPages": 1,
    "hasPrevious": false,
    "hasNext": false
  }
  ```

#### `GET /api/Campaigns/{id}`
Кампания по ID.
- **Доступ:** `Admin`, `Manager`
- **Ответ 200 OK:** `CampaignResponseDto`
- **Ошибки:** `404 Not Found`

#### `POST /api/Campaigns`
Создание кампании.
- **Доступ:** `[Authorize(Roles = "Admin")]`
- **Request Body (`CreateCampaignDto`):**
  ```json
  {
    "businessId": 1,
    "targetReelsCount": 10
  }
  ```
- **Правила и бизнес-логика:**
  - `businessId`: больше `0`, бизнес должен существовать в базе
  - `targetReelsCount`: от `1` до `100`
  - **Бизнес-правило:** Создание кампании разрешено только для бизнеса со статусом `NoCampaigns` (`0`). Если у бизнеса статус `InProgress` (`1`) или `Completed` (`2`), запрос отклоняется с кодом 400.
  - При успешном создании статус бизнеса переводится в `InProgress` (`1`).
- **Ответ 201 Created:** `CampaignResponseDto`
- **Ошибки:**
  - `400 Bad Request` — бизнес не найден или статус бизнеса не `NoCampaigns`
  - `403 Forbidden` — вызов менеджером

#### `PUT /api/Campaigns/{id}`
Обновление целевого количества рилсов кампании.
- **Доступ:** `[Authorize(Roles = "Admin")]`
- **Request Body (`UpdateCampaignDto`):**
  ```json
  {
    "targetReelsCount": 15
  }
  ```
- **Ответ 204 No Content**
- **Ошибки:**
  - `403 Forbidden` — вызов менеджером
  - `404 Not Found` — кампания не найдена

#### `DELETE /api/Campaigns/{id}`
Удаление кампании с автоматическим пересчётом статуса привязанного бизнеса.
- **Доступ:** `[Authorize(Roles = "Admin")]`
- **Ответ 204 No Content**
- **Ошибки:**
  - `403 Forbidden` — вызов менеджером
  - `404 Not Found` — кампания не найдена

---

### 4.5. Статистика постов / Рилсов (`/api/PostStats`)
- **Базовый доступ к контроллеру:** `[Authorize(Roles = "Admin,Manager")]`

#### `GET /api/PostStats?page=1&pageSize=10`
Пагинированный список статистики постов (сортировка по `id`).
- **Доступ:** `Admin`, `Manager`
- **Ответ 200 OK:**
  ```json
  {
    "items": [
      {
        "id": 1,
        "campaignId": 1,
        "bloggerId": 1,
        "managerName": "John Doe",
        "postUrl": "https://instagram.com/reel/xyz123",
        "likes": 1500,
        "views": 25000
      }
    ],
    "pageNumber": 1,
    "pageSize": 10,
    "totalCount": 1,
    "totalPages": 1,
    "hasPrevious": false,
    "hasNext": false
  }
  ```

#### `GET /api/PostStats/{id}`
Получение статистики поста по ID.
- **Доступ:** `Admin`, `Manager`
- **Ответ 200 OK:** `PostStatResponseDto`
- **Ошибки:** `404 Not Found`

#### `POST /api/PostStats`
Создание записи статистики рилса.
- **Доступ:** `Admin`, `Manager`
- **Request Body (`CreatePostStatDto`):**
  ```json
  {
    "campaignId": 1,
    "bloggerId": 1,
    "managerName": "John Doe",
    "postUrl": "https://instagram.com/reel/xyz123",
    "likes": 1500,
    "views": 25000
  }
  ```
- **Правила и бизнес-логика:**
  - `campaignId`, `bloggerId`: больше `0`, сущности должны существовать
  - `managerName`: обязателен, максимум 20 символов
  - `postUrl`: валидный абсолютный URL
  - `likes`, `views`: неотрицательные числа (>= 0)
  - **Бизнес-правило 1 блогер = 1 рилс на кампанию:** если данный блогер уже выложил рилс для этой кампании, возвращается `400 Bad Request` (`"Blogger уже выложил рилс для этой Campaign"`).
  - При создании: `campaign.CompletedReelsCount += 1`, блогеру выставляется `status: 3` (`Posted`), статус бизнеса пересчитывается.
- **Ответ 201 Created:** `PostStatResponseDto`

#### `PUT /api/PostStats/{id}`
Обновление записи статистики.
- **Доступ:** `Admin`, `Manager`
- **Request Body (`UpdatePostStatDto`):** те же поля, что в `CreatePostStatDto`
- **Ответ 204 No Content**
- **Ошибки:**
  - `400 Bad Request` — нарушение правила "1 блогер = 1 рилс", отсутствие кампании/блогера или ошибки валидации
  - `404 Not Found` — запись не найдена

#### `DELETE /api/PostStats/{id}`
Удаление записи статистики (с уменьшением `completedReelsCount`, возвратом статуса блогера в `0` (`NoAnswer`) и пересчётом статуса бизнеса).
- **Доступ:** `[Authorize(Roles = "Admin")]`
- **Ответ 204 No Content**
- **Ошибки:**
  - `403 Forbidden` — вызов менеджером
  - `404 Not Found` — запись не найдена
