# Инструкции по развертыванию на Vercel

## Проблема

При развертывании на Vercel возникает ошибка CORS, так как фронтенд пытается подключиться к `localhost:3001`, а бэкенд не настроен для работы с Vercel доменами.

## Решение

### 1. Развертывание бэкенда на Vercel

1. Создайте новый проект на Vercel для бэкенда
2. Загрузите папку `backend/` как отдельный проект
3. В настройках проекта добавьте переменные окружения:

```env
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.vercel.app
JWT_SECRET=your-super-secret-jwt-key
DB_PATH=./database/certificates.db
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@clinic.com
```

### 2. Настройка фронтенда

1. В настройках фронтенд проекта на Vercel добавьте переменную окружения:

```env
VITE_API_URL=https://your-backend-domain.vercel.app/api
```

### 3. Альтернативное решение - использование одного проекта

Если хотите развернуть все в одном проекте:

1. Создайте файл `vercel.json` в корне проекта:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "functions": {
    "backend/server.js": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/backend/server.js"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

2. В настройках проекта добавьте переменные окружения:

```env
VITE_API_URL=/api
FRONTEND_URL=https://your-domain.vercel.app
```

### 4. Проверка работоспособности

После развертывания проверьте:

1. Бэкенд доступен по адресу: `https://your-backend-domain.vercel.app/health`
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
