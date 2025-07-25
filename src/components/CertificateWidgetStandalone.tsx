import React, { useState, useEffect } from "react";
import { CertificateWidget } from "./CertificateWidget";
import "../styles/CertificateWidgetStandalone.css";

export const CertificateWidgetStandalone: React.FC = () => {
  const [config, setConfig] = useState({
    title: "Подарочный сертификат",
    subtitle: "Клиника Алдан",
    logo: "❤️",
    primaryColor: "#2563eb",
    backgroundColor: "#ffffff",
  });
  const [apiUrl, setApiUrl] = useState("http://localhost:3001/api");
  const [token, setToken] = useState("");

  useEffect(() => {
    // Получаем параметры из URL
    const urlParams = new URLSearchParams(window.location.search);

    const configParam = urlParams.get("config");
    if (configParam) {
      try {
        const parsedConfig = JSON.parse(decodeURIComponent(configParam));
        setConfig(parsedConfig);
      } catch (error) {
        console.error("Error parsing config:", error);
      }
    }

    const apiUrlParam = urlParams.get("apiUrl");
    if (apiUrlParam) {
      setApiUrl(decodeURIComponent(apiUrlParam));
    }

    const tokenParam = urlParams.get("token");
    if (tokenParam) {
      setToken(decodeURIComponent(tokenParam));
    }
  }, []);

  const handleSuccess = (certificateData: any) => {
    console.log("Certificate created successfully:", certificateData);

    // Отправляем сообщение родительскому окну
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: "CERTIFICATE_CREATED",
          data: certificateData,
        },
        "*"
      );
    }

    // Показываем уведомление
    alert(`Сертификат №${certificateData.id} создан успешно!`);
  };

  const handleError = (error: string) => {
    console.error("Certificate creation error:", error);

    // Отправляем сообщение родительскому окну
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: "CERTIFICATE_ERROR",
          error: error,
        },
        "*"
      );
    }

    alert(`Ошибка: ${error}`);
  };

  return (
    <div className="widget-standalone">
      <CertificateWidget
        config={config}
        apiUrl={apiUrl}
        token={token}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </div>
  );
};
