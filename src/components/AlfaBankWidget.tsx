import React, { useEffect, useRef, useState } from "react";
import "../styles/AlfaBankWidget.css";

// Extend Window interface for AlfaPayment
declare global {
  interface Window {
    AlfaPayment?: {
      init: () => void;
    };
  }
}

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
  const widgetContainerRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [scriptId] = useState("alfa-payment-script");

  useEffect(() => {
    if (!config.token) return;

    // Cleanup function to safely remove script
    const cleanup = () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript && existingScript.parentNode) {
        try {
          existingScript.parentNode.removeChild(existingScript);
        } catch (error) {
          console.warn("Script cleanup error:", error);
        }
      }
    };

    // Clean up any existing script
    cleanup();

    // Create new script
    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "text/javascript";
    script.src = config.testMode
      ? "https://testpay.alfabank.ru/assets/alfa-payment.js"
      : "https://pay2.alfabank.ru/assets/alfa-payment.js";

    script.onload = () => {
      setIsScriptLoaded(true);
      console.log("Script loaded successfully");

      // Try to initialize widget after script loads
      setTimeout(() => {
        console.log("Attempting widget initialization...");

        // Check if widget container exists
        const widgetContainer = document.getElementById("alfa-payment-button");
        if (widgetContainer) {
          console.log("Widget container found:", widgetContainer);
          console.log("Widget container HTML:", widgetContainer.innerHTML);

          // Check if AlfaPayment is available
          if (window.AlfaPayment) {
            console.log("AlfaPayment is available, calling init()");
            try {
              window.AlfaPayment.init();
              console.log("AlfaPayment.init() called successfully");
            } catch (error) {
              console.error("Error calling AlfaPayment.init():", error);
            }
          } else {
            console.log(
              "AlfaPayment not available, triggering DOMContentLoaded"
            );
            const event = new Event("DOMContentLoaded");
            document.dispatchEvent(event);
          }
        } else {
          console.error("Widget container not found!");
        }
      }, 500);
    };

    script.onerror = () => {
      console.error("Failed to load Alfa Bank widget script");
    };

    // Append script to head
    document.head.appendChild(script);

    // Return cleanup function
    return cleanup;
  }, [config.testMode, config.gateway, config.token, scriptId]);

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
    <div className="alfa-widget-container" ref={widgetContainerRef}>
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
            <strong>AlfaPayment доступен:</strong>{" "}
            {window.AlfaPayment ? "Да" : "Нет"}
          </p>
          <p>
            <strong>Скрипт загружен:</strong> {isScriptLoaded ? "Да" : "Нет"}
          </p>
        </div>
      </div>

      {/* Hidden fields for widget data */}
      <input type="hidden" className="amount" value={orderData.amount} />
      <input
        type="hidden"
        className="orderNumber"
        value={orderData.orderNumber}
      />
      <input
        type="hidden"
        className="clientInfo"
        value={orderData.clientName}
      />
      <input
        type="hidden"
        className="clientEmail"
        value={orderData.clientEmail}
      />
      <input
        type="hidden"
        className="orderDescription"
        value={orderData.description}
      />

      {/* Alfa Bank Widget Container */}
      <div
        id="alfa-payment-button"
        data-token={config.token}
        data-gateway={config.gateway}
        data-language={config.language}
        data-button-text={config.buttonText}
        data-return-url={config.returnUrl || "https://yoursite.com/success"}
        data-fail-url={config.failUrl || "https://yoursite.com/fail"}
        data-amount={orderData.amount}
        data-order-number={orderData.orderNumber}
        data-client-info={orderData.clientName}
        data-email={orderData.clientEmail}
        data-description={orderData.description}
        className="widget-button-container"
        style={{
          minHeight: "60px",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "10px",
        }}
      >
        {/* Loading indicator */}
        {!isScriptLoaded && (
          <div style={{ textAlign: "center", color: "#6b7280" }}>
            Загрузка виджета...
          </div>
        )}

        {/* Fallback button if widget doesn't load */}
        {isScriptLoaded && !window.AlfaPayment && (
          <button
            style={{
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "16px",
              cursor: "pointer",
              width: "100%",
            }}
            onClick={() => {
              alert(
                "Виджет Альфа-Банка не загрузился. Пожалуйста, попробуйте обновить страницу."
              );
            }}
          >
            {config.buttonText || "Оплатить картой"}
          </button>
        )}
      </div>

      {!isScriptLoaded && (
        <div className="widget-loading">
          <div className="loading-spinner"></div>
          <p>Загрузка виджета...</p>
        </div>
      )}

      {isScriptLoaded && (
        <div className="widget-debug">
          <p>Статус: Виджет загружен</p>
          <p>Токен: {config.token}</p>
          <p>Сумма: {orderData.amount}</p>
          <p>Номер заказа: {orderData.orderNumber}</p>
          <p>AlfaPayment доступен: {window.AlfaPayment ? "Да" : "Нет"}</p>
          <button
            onClick={() => {
              console.log("Manual widget refresh...");
              // Reload the page to refresh the widget
              window.location.reload();
            }}
            className="debug-button"
          >
            Обновить виджет
          </button>
        </div>
      )}

      <div className="widget-status">
        <p>
          <strong>Режим:</strong> {config.testMode ? "Тестовый" : "Продакшн"}
        </p>
        <p>
          <strong>Язык:</strong>{" "}
          {config.language === "ru" ? "Русский" : "English"}
        </p>
      </div>
    </div>
  );
};
