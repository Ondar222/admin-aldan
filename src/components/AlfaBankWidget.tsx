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
  const [scriptId] = useState(`alfa-payment-script-${Date.now()}`);

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
      // Initialize widget after a short delay
      setTimeout(() => {
        if (window.AlfaPayment) {
          try {
            window.AlfaPayment.init();
          } catch (error) {
            console.warn("Widget initialization error:", error);
          }
        }
      }, 100);
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
        data-amount-selector=".amount"
        data-order-number-selector=".orderNumber"
        data-client-info-selector=".clientInfo"
        data-email-selector=".clientEmail"
        data-description-selector=".orderDescription"
        className="widget-button-container"
      />

      {!isScriptLoaded && (
        <div className="widget-loading">
          <div className="loading-spinner"></div>
          <p>Загрузка виджета...</p>
        </div>
      )}

      {isScriptLoaded && (
        <div className="widget-debug">
          <p>Статус: Виджет загружен</p>
          <button
            onClick={() => {
              if (window.AlfaPayment) {
                try {
                  window.AlfaPayment.init();
                } catch (error) {
                  console.warn("Widget re-initialization error:", error);
                }
              }
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
