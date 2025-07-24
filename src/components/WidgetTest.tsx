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
  const [scriptId] = useState("alfa-payment-script");

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

      // Let the widget initialize itself
      setTimeout(() => {
        console.log("Widget should be ready now");
      }, 1000);
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
          <strong>Токен:</strong> pfcr5js74l5jnsqcsrms960nok
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
        data-token="pfcr5js74l5jnsqcsrms960nok"
        data-gateway="test"
        data-language="ru"
        data-button-text="Оплатить картой"
        data-return-url="https://yoursite.com/success"
        data-fail-url="https://yoursite.com/fail"
        data-amount="1000"
        data-order-number="TEST-001"
        data-client-info="Тестовый клиент"
        data-email="test@example.com"
        data-description="Тестовый платеж"
        style={{
          minHeight: "60px",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          padding: "10px",
        }}
      />

      <div className="widget-actions">
        <button
          onClick={() => {
            console.log("Manual widget refresh...");
            // Reload the page to refresh the widget
            window.location.reload();
          }}
          className="debug-button"
        >
          Принудительно обновить виджет
        </button>
      </div>
    </div>
  );
};
