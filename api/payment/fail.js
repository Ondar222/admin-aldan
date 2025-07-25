export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { orderNumber, amount, status, error_code, error_message } =
      req.query;

    console.log("Payment failed:", {
      orderNumber,
      amount,
      status,
      error_code,
      error_message,
    });

    // Возвращаем HTML страницу с сообщением об ошибке
    const html = `
      <!DOCTYPE html>
      <html lang="ru">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Ошибка оплаты</title>
          <style>
              body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                  margin: 0;
                  padding: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  color: white;
              }
              .error-container {
                  background: rgba(255, 255, 255, 0.1);
                  backdrop-filter: blur(10px);
                  padding: 40px;
                  border-radius: 20px;
                  text-align: center;
                  max-width: 500px;
                  margin: 20px;
              }
              .error-icon {
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
              .error-details {
                  background: rgba(255, 255, 255, 0.2);
                  padding: 15px;
                  border-radius: 10px;
                  margin: 20px 0;
                  text-align: left;
              }
              .error-details h3 {
                  margin-top: 0;
                  margin-bottom: 10px;
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
              .retry-button {
                  background: rgba(255, 255, 255, 0.3);
                  border: 2px solid rgba(255, 255, 255, 0.5);
                  color: white;
                  padding: 12px 30px;
                  border-radius: 25px;
                  cursor: pointer;
                  font-size: 16px;
                  transition: all 0.3s;
                  margin-top: 10px;
                  margin-left: 10px;
              }
              .retry-button:hover {
                  background: rgba(255, 255, 255, 0.4);
                  border-color: rgba(255, 255, 255, 0.6);
              }
          </style>
      </head>
      <body>
          <div class="error-container">
              <div class="error-icon">❌</div>
              <h1>Ошибка оплаты</h1>
              <p>К сожалению, произошла ошибка при обработке платежа.</p>
              <div class="amount">Сумма: ${
                amount ? (amount / 100).toFixed(2) + " ₽" : "Не указана"
              }</div>
              ${
                orderNumber
                  ? `<div class="order-number">Номер заказа: ${orderNumber}</div>`
                  : ""
              }
              
              ${
                error_code || error_message
                  ? `
                <div class="error-details">
                    <h3>Детали ошибки:</h3>
                    ${
                      error_code
                        ? `<p><strong>Код ошибки:</strong> ${error_code}</p>`
                        : ""
                    }
                    ${
                      error_message
                        ? `<p><strong>Сообщение:</strong> ${error_message}</p>`
                        : ""
                    }
                </div>
              `
                  : ""
              }
              
              <p>Пожалуйста, попробуйте еще раз или обратитесь в службу поддержки.</p>
              <div>
                  <button class="close-button" onclick="window.close()">Закрыть</button>
                  <button class="retry-button" onclick="window.history.back()">Попробовать снова</button>
              </div>
          </div>
          <script>
              // Автоматически закрываем окно через 10 секунд
              setTimeout(() => {
                  window.close();
              }, 10000);
          </script>
      </body>
      </html>
    `;

    res.setHeader("Content-Type", "text/html");
    res.status(200).send(html);
  } catch (error) {
    console.error("Payment fail error:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
