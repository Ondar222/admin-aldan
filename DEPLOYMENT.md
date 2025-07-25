# Инструкции по развертыванию на Vercel

## Проблема

При развертывании на Vercel возникает ошибка CORS, так как фронтенд пытается подключиться к `localhost:3001`, а бэкенд не настроен для работы с Vercel доменами.

## Решение (Обновлено)

### 1. Автоматическое развертывание с API роутом

Проект теперь настроен для автоматического развертывания на Vercel с встроенным API роутом.

1. Загрузите весь проект на Vercel
2. В настройках проекта добавьте переменные окружения:

```env
NODE_ENV=production
FRONTEND_URL=https://your-domain.vercel.app
JWT_SECRET=your-super-secret-jwt-key
DB_PATH=./database/certificates.db
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@clinic.com
VITE_API_URL=/api
```

### 2. Структура проекта

```
admin-aldan/
├── api/
│   ├── server.js          # API роут для Vercel
│   └── package.json       # Зависимости для API
├── backend/               # Локальный бэкенд для разработки
├── src/                   # Фронтенд
├── vercel.json           # Конфигурация Vercel
└── package.json          # Зависимости фронтенда
```

### 3. Проверка работоспособности

После развертывания проверьте:

1. API доступен по адресу: `https://your-domain.vercel.app/api/health`
2. Фронтенд может подключиться к API
3. Авторизация работает корректно

## Локальная разработка

Для локальной разработки используйте:

```bash
# Бэкенд
cd backend
npm install
node server.js

# Фронтенд
npm install
npm run dev
```

Переменные окружения для локальной разработки:

- `VITE_API_URL=http://localhost:3001/api`
- `FRONTEND_URL=http://localhost:5176`

## Альтернативное решение - отдельный бэкенд

Если хотите развернуть бэкенд отдельно:

1. Создайте новый проект на Vercel для бэкенда
2. Загрузите папку `backend/`
3. В настройках фронтенд проекта добавьте переменную:
   ```
   VITE_API_URL=https://your-backend-domain.vercel.app/api
   ```
