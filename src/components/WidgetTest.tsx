import React, { useEffect, useState } from "react";
import "../styles/AlfaBankWidget.css";

// Extend Window interface for AlfaPayment
declare global {
  interface Window {
    AlfaPayment?: {
      init: () => void;
    };
  }
}

export const WidgetTest: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [scriptId] = useState(`widget-test-script-${Date.now()}`);

  useEffect(() => {
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

    // Load Alfa Bank widget script
    const script = document.createElement("script");
    script.id = scriptId;
    script.type = "text/javascript";
    script.src = "https://testpay.alfabank.ru/assets/alfa-payment.js";

    script.onload = () => {
      setIsLoaded(true);
      console.log("Alfa Bank script loaded successfully");

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
      console.error("Failed to load Alfa Bank script");
    };

    document.head.appendChild(script);

    // Return cleanup function
    return cleanup;
  }, [scriptId]);

  return (
    <div className="widget-test-container">
      <h2>Тест виджета Альфа-Банка</h2>

      <div className="widget-info">
        <p>
          <strong>Токен:</strong> pfcr5js7415jnsqcsrms960nok
        </p>
        <p>
          <strong>Режим:</strong> Тестовый
        </p>
        <p>
          <strong>Статус скрипта:</strong>{" "}
          {isLoaded ? "Загружен" : "Загрузка..."}
        </p>
      </div>

      {/* Hidden fields for test data */}
      <input type="hidden" className="amount" value="1000" />
      <input type="hidden" className="orderNumber" value="TEST-001" />
      <input type="hidden" className="clientInfo" value="Тестовый клиент" />
      <input type="hidden" className="clientEmail" value="test@example.com" />
      <input
        type="hidden"
        className="orderDescription"
        value="Тестовый платеж"
      />

      {/* Alfa Bank Widget */}
      <div
        id="alfa-payment-button"
        data-token="pfcr5js7415jnsqcsrms960nok"
        data-gateway="test"
        data-language="ru"
        data-button-text="Оплатить картой"
        data-return-url="https://yoursite.com/success"
        data-fail-url="https://yoursite.com/fail"
        data-amount-selector=".amount"
        data-order-number-selector=".orderNumber"
        data-client-info-selector=".clientInfo"
        data-email-selector=".clientEmail"
        data-description-selector=".orderDescription"
      />

      <div className="widget-actions">
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
          Принудительно обновить виджет
        </button>
      </div>
    </div>
  );
};
