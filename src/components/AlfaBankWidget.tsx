import React, { useEffect, useRef, useState } from "react";
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
  const widgetRef = useRef<HTMLDivElement>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    // Remove existing script if any
    const existingScript = document.getElementById("alfa-payment-script");
    if (existingScript) {
      existingScript.remove();
    }

    // Create and load new script
    const script = document.createElement("script");
    script.id = "alfa-payment-script";
    script.type = "text/javascript";
    script.src = config.testMode
      ? "https://testpay.alfabank.ru/assets/alfa-payment.js"
      : "https://pay2.alfabank.ru/assets/alfa-payment.js";

    script.onload = () => {
      setIsScriptLoaded(true);
    };

    script.onerror = () => {
      console.error("Failed to load Alfa Bank widget script");
    };

    document.head.appendChild(script);

    return () => {
      const scriptToRemove = document.getElementById("alfa-payment-script");
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [config.testMode, config.gateway]);

  if (!config.token) {
    return (
      <div className="widget-error">
        <p>
          Токен не настроен. Пожалуйста, настройте виджет в разделе "Платежная
          система".
        </p>
      </div>
    );
  }

  return (
    <div className="alfa-widget-container">
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

      {/* Alfa Bank Widget */}
      <div
        ref={widgetRef}
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
      ></div>

      {!isScriptLoaded && (
        <div className="widget-loading">
          <div className="loading-spinner"></div>
          <p>Загрузка виджета...</p>
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
