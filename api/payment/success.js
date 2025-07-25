export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { orderNumber, amount, status } = req.query;

    console.log("Payment success:", { orderNumber, amount, status });

    // Здесь можно добавить дополнительную логику
    // Например, отправку уведомлений, логирование и т.д.

    // Возвращаем HTML страницу с сообщением об успехе
    const html = `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Оплата прошла успешно</title>
          <style>
              body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  margin: 0;
                  padding: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  color: white;
              }
              .success-container {
                  background: rgba(255, 255, 255, 0.1);
                  backdrop-filter: blur(10px);
                  padding: 40px;
                  border-radius: 20px;
                  text-align: center;
                  max-width: 500px;
                  margin: 20px;
              }
              .success-icon {
                  font-size: 64px;
                  margin-bottom: 20px;
              }
              h1 {
                  margin-bottom: 20px;
                  font-size: 28px;
              }
              p {
                  margin-bottom: 15px;
                  opacity: 0.9;
                  line-height: 1.6;
              }
              .amount {
                  font-size: 24px;
                  font-weight: bold;
                  margin: 20px 0;
              }
              .order-number {
                  background: rgba(255, 255, 255, 0.2);
                  padding: 10px 20px;
                  border-radius: 10px;
                  font-family: monospace;
                  margin: 20px 0;
              }
              .close-button {
                  background: rgba(255, 255, 255, 0.2);
                  border: 2px solid rgba(255, 255, 255, 0.3);
                  color: white;
                  padding: 12px 30px;
                  border-radius: 25px;
                  cursor: pointer;
                  font-size: 16px;
                  transition: all 0.3s;
                  margin-top: 20px;
              }
              .close-button:hover {
                  background: rgba(255, 255, 255, 0.3);
                  border-color: rgba(255, 255, 255, 0.5);
              }
          </style>
      </head>
      <body>
          <div class="success-container">
              <div class="success-icon">✅</div>
              <h1>Оплата прошла успешно!</h1>
              <p>Спасибо за покупку подарочного сертификата.</p>
              <div class="amount">Сумма: ${
                amount ? (amount / 100).toFixed(2) + " ₽" : "Не указана"
              }</div>
              ${
                orderNumber
                  ? `<div class="order-number">Номер заказа: ${orderNumber}</div>`
                  : ""
              }
              <p>Сертификат будет отправлен на указанный email в ближайшее время.</p>
              <button class="close-button" onclick="window.close()">Закрыть</button>
          </div>
          <script>
              // Автоматически закрываем окно через 5 секунд
              setTimeout(() => {
                  window.close();
              }, 5000);
          </script>
      </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (error) {
    console.error("Payment success error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
