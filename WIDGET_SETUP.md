# Виджет покупки сертификатов

Этот виджет позволяет встраивать форму покупки подарочных сертификатов на любые веб-сайты.

## Быстрый старт

### 1. Запуск сервера

```bash
# Запуск бэкенда
cd backend
npm start

# Запуск фронтенда (в новом терминале)
npm run dev
```

### 2. Тестирование виджета

Откройте файл `test-widget.html` в браузере для демонстрации работы виджета.

## Встраивание виджета

### Способ 1: Iframe (рекомендуемый)

```html
<iframe
  src="http://localhost:5173/widget.html?config=CONFIG&apiUrl=API_URL&token=TOKEN"
  width="400"
  height="600"
  frameborder="0"
  style="border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
></iframe>
```

### Способ 2: JavaScript

```html
<div id="certificate-widget"></div>
<script>
  const script = document.createElement("script");
  script.src = "http://localhost:5173/widget/certificate.js";
  script.onload = function () {
    window.CertificateWidget.init({
      container: "#certificate-widget",
      config: {
        title: "Подарочный сертификат",
        subtitle: "Клиника Алдан",
        logo: "❤️",
        primaryColor: "#2563eb",
        backgroundColor: "#ffffff",
      },
      apiUrl: "http://localhost:3001/api",
      token: "your-token-here",
      onSuccess: function (certificateData) {
        console.log("Сертификат создан:", certificateData);
      },
      onError: function (error) {
        console.error("Ошибка:", error);
      },
    });
  };
  document.head.appendChild(script);
</script>
```

## Параметры конфигурации

### config (JSON объект)

```json
{
  "title": "Подарочный сертификат",
  "subtitle": "Клиника Алдан",
  "logo": "❤️",
  "primaryColor": "#2563eb",
  "backgroundColor": "#ffffff"
}
```

- **title** - заголовок виджета
- **subtitle** - подзаголовок
- **logo** - логотип (эмодзи или текст)
- **primaryColor** - основной цвет кнопок и элементов
- **backgroundColor** - цвет фона виджета

### apiUrl

URL вашего API для создания сертификатов. По умолчанию: `http://localhost:3001/api`

### token (опционально)

Токен авторизации для API запросов.

## API Endpoints

### Создание сертификата

```
POST /api/certificates
```

**Тело запроса:**

```json
{
  "balance": 1000,
  "client_name": "Иван Иванов",
  "client_email": "ivan@example.com",
  "client_phone": "+7 999 123-45-67"
}
```

**Ответ:**

```json
{
  "success": true,
  "certificate": {
    "id": "123456",
    "balance": 1000,
    "status": "paid",
    "client_name": "Иван Иванов",
    "client_email": "ivan@example.com",
    "client_phone": "+7 999 123-45-67",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## Обработка событий

### PostMessage API

Виджет отправляет сообщения родительскому окну:

```javascript
window.addEventListener("message", function (event) {
  if (event.data.type === "CERTIFICATE_CREATED") {
    console.log("Сертификат создан:", event.data.data);
    // Обработка успешного создания
  } else if (event.data.type === "CERTIFICATE_ERROR") {
    console.error("Ошибка:", event.data.error);
    // Обработка ошибки
  }
});
```

## Настройка для продакшена

### 1. Обновление URL

Замените `http://localhost:5173` на ваш домен:

```html
<iframe
  src="https://your-domain.com/widget.html?config=CONFIG&apiUrl=API_URL"
  width="400"
  height="600"
  frameborder="0"
></iframe>
```

### 2. CORS настройки

Убедитесь, что ваш API разрешает запросы с домена, где размещен виджет:

```javascript
// В backend/server.js
app.use(
  cors({
    origin: ["https://your-domain.com", "https://client-domain.com"],
    credentials: true,
  })
);
```

### 3. Безопасность

- Используйте HTTPS для всех запросов
- Настройте правильные заголовки безопасности
- Ограничьте доступ к API по доменам

## Примеры использования

### Базовый виджет

```html
<iframe
  src="https://your-domain.com/widget.html"
  width="400"
  height="600"
  frameborder="0"
></iframe>
```

### Настроенный виджет

```html
<iframe
  src="https://your-domain.com/widget.html?config=%7B%22title%22%3A%22Подарочный%20сертификат%22%2C%22subtitle%22%3A%22Наша%20клиника%22%2C%22logo%22%3A%22🏥%22%2C%22primaryColor%22%3A%22%23e11d48%22%7D&apiUrl=https%3A//api.your-domain.com"
  width="400"
  height="600"
  frameborder="0"
></iframe>
```

## Устранение неполадок

### Виджет не загружается

1. Проверьте, что сервер запущен
2. Убедитесь, что URL правильный
3. Проверьте консоль браузера на ошибки

### API запросы не работают

1. Проверьте CORS настройки
2. Убедитесь, что API доступен
3. Проверьте токен авторизации

### Проблемы с отображением

1. Проверьте размеры iframe
2. Убедитесь, что CSS загружается
3. Проверьте параметры конфигурации

## Поддержка

Для получения поддержки обращайтесь к разработчикам системы.
