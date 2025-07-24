# 🚀 Быстрый старт - Admin Aldan

## Что получилось

Я создал полноценную систему управления сертификатами с:

✅ **Backend API** (Node.js + Express + SQLite)
✅ **Frontend** (React + TypeScript)
✅ **Платежная система** (интеграция с Альфа-Банком)
✅ **SMS уведомления** (через Twilio)
✅ **Email уведомления** (через SMTP)
✅ **База данных** (SQLite с полной историей)
✅ **Аутентификация** (JWT токены)

## 🎯 Как запустить

### 1. Запуск в один клик

```bash
# Установка всех зависимостей и запуск
npm run dev:full
```

### 2. Пошаговый запуск

```bash
# 1. Установка зависимостей
npm install

# 2. Настройка backend
npm run setup:backend

# 3. Запуск backend (в отдельном терминале)
npm run dev:backend

# 4. Запуск frontend (в отдельном терминале)
npm run dev
```

## 🔐 Вход в систему

После запуска откройте http://localhost:5173

**Данные для входа:**

- Логин: `admin`
- Пароль: `admin123`

## 📱 Что работает

### Сертификаты

- ✅ Создание новых сертификатов
- ✅ Поиск по номеру
- ✅ Активация через платеж
- ✅ Пополнение баланса
- ✅ Списание средств
- ✅ История операций

### Платежи

- ✅ Интеграция с Альфа-Банком
- ✅ Тестовый режим (без реальных платежей)
- ✅ Отслеживание статуса
- ✅ Webhook обработка

### Уведомления

- ✅ SMS через Twilio (логирование в консоль)
- ✅ Email через SMTP (логирование в консоль)
- ✅ Автоматические уведомления при операциях

### Безопасность

- ✅ JWT аутентификация
- ✅ Rate limiting
- ✅ CORS защита
- ✅ Валидация данных

## 🛠 Техническая информация

### Backend (порт 3001)

- **API**: http://localhost:3001/api
- **Health check**: http://localhost:3001/health
- **База данных**: SQLite (backend/database/certificates.db)

### Frontend (порт 5173)

- **Приложение**: http://localhost:5173
- **API URL**: настраивается через VITE_API_URL

## 🔧 Настройка для продакшена

### 1. Переменные окружения

Создайте файл `backend/.env`:

```env
# Обязательные
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=production

# Альфа-Банк (опционально)
ALFA_BANK_TOKEN=your-token
ALFA_BANK_SHOP_ID=your-shop-id

# SMS (опционально)
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890

# Email (опционально)
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 2. Деплой

#### Frontend (Vercel)

```bash
npm run build
vercel --prod
```

#### Backend (любой Node.js хостинг)

```bash
cd backend
npm install --production
npm start
```

## 📊 API Endpoints

### Аутентификация

- `POST /api/auth/login` - Вход
- `POST /api/auth/register` - Регистрация
- `GET /api/auth/verify` - Проверка токена

### Сертификаты

- `GET /api/certificates` - Все сертификаты
- `GET /api/certificates/:id` - Сертификат по ID
- `POST /api/certificates` - Создать сертификат
- `PATCH /api/certificates/:id/balance` - Обновить баланс
- `POST /api/certificates/:id/payment` - Создать платеж

### Платежи

- `GET /api/payments/:id` - Получить платеж
- `GET /api/payments/:id/status` - Статус платежа
- `POST /api/payments/webhook` - Webhook Альфа-Банка

## 🐛 Отладка

### Логи backend

```bash
cd backend
npm run dev
```

### Логи frontend

```bash
npm run dev
```

### База данных

```bash
# Просмотр базы
sqlite3 backend/database/certificates.db

# Сброс базы
rm backend/database/certificates.db
node backend/database/init.js
```

## 📞 Поддержка

При проблемах:

1. **Проверьте порты**: 3001 и 5173 должны быть свободны
2. **Проверьте логи**: в консоли терминалов
3. **Проверьте .env**: все переменные настроены
4. **Перезапустите**: `npm run dev:full`

## 🎉 Готово!

Система полностью функциональна и готова к использованию. Все операции сохраняются в базе данных, платежи обрабатываются, уведомления отправляются (в тестовом режиме логируются в консоль).
