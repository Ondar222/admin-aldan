import React, { useState } from "react";
import "../styles/AlfaBankWidget.css";

interface AlfaBankWidgetProps {
  config: {
    token: string;
    gateway: "test" | "pay";
    testMode: boolean;
    returnUrl: string;
    failUrl: string;
    language: "ru" | "en";
    buttonText: string;
  };
  orderData: {
    amount: string;
    orderNumber: string;
    clientName: string;
    clientEmail: string;
    description: string;
  };
}

export const AlfaBankWidget: React.FC<AlfaBankWidgetProps> = ({
  config,
  orderData,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Симуляция платежа
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Генерируем случайный статус платежа
      const isSuccess = Math.random() > 0.3; // 70% успешных платежей

      if (isSuccess) {
        alert(
          `Платеж успешно обработан!\nСумма: ${orderData.amount}₽\nНомер заказа: ${orderData.orderNumber}`
        );

        // Отправляем сообщение об успешном платеже
        if (window.parent !== window) {
          window.parent.postMessage(
            {
              type: "PAYMENT_SUCCESS",
              data: {
                amount: orderData.amount,
                orderNumber: orderData.orderNumber,
                clientName: orderData.clientName,
                clientEmail: orderData.clientEmail,
              },
            },
            "*"
          );
        }
      } else {
        alert("Платеж не прошел. Попробуйте еще раз.");
      }
    } catch (error) {
      alert("Ошибка при обработке платежа: " + error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!config.token) {
    return (
      <div className="alfa-widget-container">
        <div className="widget-error">
          <p>Токен не настроен. Перейдите в настройки платежей.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="alfa-widget-container">
      <div className="widget-info">
        <h3>Платежный виджет Альфа-Банка</h3>
        <p>Нажмите кнопку ниже для тестирования платежа</p>
        <div className="debug-info">
          <p>
            <strong>Токен:</strong> {config.token}
          </p>
          <p>
            <strong>Сумма:</strong> ₽{orderData.amount}
          </p>
          <p>
            <strong>Номер заказа:</strong> {orderData.orderNumber}
          </p>
          <p>
            <strong>Клиент:</strong> {orderData.clientName}
          </p>
          <p>
            <strong>Email:</strong> {orderData.clientEmail}
          </p>
        </div>
      </div>

      {/* Кнопка оплаты */}
      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="payment-button"
        style={{
          backgroundColor: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "8px",
          padding: "12px 24px",
          fontSize: "16px",
          cursor: isProcessing ? "not-allowed" : "pointer",
          width: "100%",
          opacity: isProcessing ? 0.7 : 1,
        }}
      >
        {isProcessing ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <div
              className="loading-spinner"
              style={{ width: "16px", height: "16px" }}
            ></div>
            Обработка...
          </div>
        ) : (
          config.buttonText || "Оплатить картой"
        )}
      </button>

      <div className="widget-status">
        <p>
          <strong>Режим:</strong> {config.testMode ? "Тестовый" : "Продакшн"}
        </p>
        <p>
          <strong>Язык:</strong>{" "}
          {config.language === "ru" ? "Русский" : "English"}
        </p>
        <p>
          <strong>Шлюз:</strong> {config.gateway}
        </p>
      </div>

      <div className="widget-note">
        <p>
          <small>
            ⚠️ Это тестовая версия виджета. В реальном проекте здесь будет
            интегрирован настоящий виджет Альфа-Банка.
          </small>
        </p>
      </div>
    </div>
  );
};
