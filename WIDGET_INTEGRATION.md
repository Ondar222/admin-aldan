# Интеграция виджета покупки сертификатов с Альфа-Банком

## 1. Виджет для встраивания

### HTML виджет

Виджет доступен по адресу: `https://your-domain.vercel.app/widget.html`

### Встраивание на внешний сайт

#### Вариант 1: Iframe

```html
<iframe
  src="https://your-domain.vercel.app/widget.html"
  width="100%"
  height="600px"
  frameborder="0"
  style="border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
>
</iframe>
```

#### Вариант 2: JavaScript

```html
<div id="certificate-widget"></div>
<script>
  fetch("https://your-domain.vercel.app/widget.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("certificate-widget").innerHTML = html;
    });
</script>
```

## 2. Интеграция с Альфа-Банком

### Настройка в Альфа-Банке

1. Зарегистрируйтесь в [Альфа-Банк API](https://alfabank.ru/sme/payservice/internet-acquiring/docs/connection-options/widget/)
2. Получите токен для тестовой среды
3. Настройте webhook URL: `https://your-domain.vercel.app/api/payment/webhook`

### Токен для тестирования

```
pfcr5js74l5jnsqcsrms960nok
```

### Переменные окружения

```env
ALFA_BANK_TOKEN=pfcr5js74l5jnsqcsrms960nok
ALFA_BANK_SECRET=your-secret-key
ALFA_BANK_GATEWAY=test
```

## 3. API роуты

### Создание сертификата

```
POST /api/certificates/create
```

### Webhook для уведомлений от Альфа-Банка

```
POST /api/payment/webhook
```

### Страницы успеха/ошибки

```
GET /api/payment/success
GET /api/payment/fail
```

## 4. Процесс работы

### 1. Пользователь заполняет форму

- Выбирает сумму сертификата (3,000, 5,000, 10,000 руб.)
- Вводит данные получателя
- Добавляет поздравление (опционально)

### 2. Интеграция с Альфа-Банком

- Генерируется уникальный номер заказа
- Данные передаются в платёжный виджет Альфа-Банка
- Пользователь вводит данные карты в защищенном окне

### 3. Обработка платежа

- Альфа-Банк обрабатывает платеж
- При успешной оплате отправляется webhook
- Сертификат автоматически активируется

### 4. Отправка сертификата

- Генерируется PDF сертификата
- Отправляется на email получателя
- Копия отправляется покупателю

## 5. Безопасность

### Проверка подписи

Все webhook'и от Альфа-Банка проверяются по HMAC-SHA256 подписи.

### Валидация данных

- Сумма: от 1,000 до 50,000 рублей
- Email: валидный формат
- Телефон: российский формат

### PCI DSS

Платёжный виджет Альфа-Банка обеспечивает полную безопасность передачи карточных данных без необходимости сертификации сайта по стандарту PCI DSS.

## 6. Тестирование

### Тестовые карты Альфа-Банка

- **Успешная оплата:** 4111 1111 1111 1111
- **Недостаточно средств:** 4444 4444 4444 4444
- **Карта заблокирована:** 5555 5555 5555 5555

### Тестовые данные

```json
{
  "amount": 3000,
  "recipientName": "Тест Тестович",
  "recipientEmail": "test@example.com",
  "recipientPhone": "+79001234567",
  "message": "Тестовое поздравление"
}
```

## 7. Переход в продакшн

### 1. Получите продакшн токен

- Обратитесь в Альфа-Банк для получения продакшн токена
- Замените тестовый токен на продакшн

### 2. Обновите настройки

```javascript
// В widget.html замените:
data-gateway="test" → data-gateway="pay"
src="https://testpay.alfabank.ru/assets/alfa-payment.js" → src="https://pay2.alfabank.ru/assets/alfa-payment.js"
```

### 3. Обновите переменные окружения

```env
ALFA_BANK_GATEWAY=pay
ALFA_BANK_SECRET=your-production-secret
```

## 8. Мониторинг

### Логи

Все операции логируются:

- Создание сертификатов
- Платежи через Альфа-Банк
- Webhook'и от банка
- Активация/деактивация сертификатов

### Уведомления

При ошибках отправляются уведомления администраторам.

## 9. Поддержка

### Документация Альфа-Банка

- [Платёжный виджет](https://alfabank.ru/sme/payservice/internet-acquiring/docs/connection-options/widget/)
- [API документация](https://developer.alfabank.ru/)

### Контакты

- Техподдержка Альфа-Банка: acquiring@alfabank.ru
- Наша поддержка: support@your-domain.com
