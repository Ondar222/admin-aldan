import React, { useState } from "react";
import { CertificateWidget } from "./CertificateWidget";
import { Settings, Code, Eye } from "lucide-react";
import "../styles/CertificateWidgetTest.css";

export const CertificateWidgetTest: React.FC = () => {
  const [config, setConfig] = useState({
    title: "Подарочный сертификат",
    subtitle: "Клиника Алдан",
    logo: "❤️",
    primaryColor: "#2563eb",
    backgroundColor: "#ffffff",
  });

  const [showConfig, setShowConfig] = useState(false);
  const [apiUrl, setApiUrl] = useState("http://localhost:3001/api");
  const [token, setToken] = useState("");

  const handleSuccess = (certificateData: any) => {
    console.log("Certificate created successfully:", certificateData);
    alert(`Сертификат №${certificateData.id} создан успешно!`);
  };

  const handleError = (error: string) => {
    console.error("Certificate creation error:", error);
    alert(`Ошибка: ${error}`);
  };

  const generateEmbedCode = () => {
    const widgetConfig = JSON.stringify(config);
    return `<iframe 
  src="${window.location.origin}/widget/certificate?config=${encodeURIComponent(
      widgetConfig
    )}&apiUrl=${encodeURIComponent(apiUrl)}&token=${encodeURIComponent(token)}"
  width="400" 
  height="600" 
  frameborder="0"
  style="border: none; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);"
></iframe>`;
  };

  const generateDirectCode = () => {
    return `<div id="certificate-widget"></div>
<script>
  // Load React and dependencies
  const script = document.createElement('script');
  script.src = '${window.location.origin}/widget/certificate.js';
  script.onload = function() {
    window.CertificateWidget.init({
      container: '#certificate-widget',
      config: ${JSON.stringify(config)},
      apiUrl: '${apiUrl}',
      token: '${token}',
      onSuccess: function(certificateData) {
        console.log('Certificate created:', certificateData);
      },
      onError: function(error) {
        console.error('Error:', error);
      }
    });
  };
  document.head.appendChild(script);
</script>`;
  };

  return (
    <div className="widget-test-page">
      <div className="test-header">
        <h1>Тест виджета покупки сертификатов</h1>
        <p>Настройте и протестируйте виджет для встраивания на внешние сайты</p>
      </div>

      <div className="test-container">
        <div className="test-sidebar">
          <div className="sidebar-section">
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="config-toggle"
            >
              <Settings className="icon" />
              {showConfig ? "Скрыть настройки" : "Показать настройки"}
            </button>

            {showConfig && (
              <div className="config-panel">
                <h3>Настройки виджета</h3>

                <div className="config-group">
                  <label>Заголовок</label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) =>
                      setConfig({ ...config, title: e.target.value })
                    }
                  />
                </div>

                <div className="config-group">
                  <label>Подзаголовок</label>
                  <input
                    type="text"
                    value={config.subtitle}
                    onChange={(e) =>
                      setConfig({ ...config, subtitle: e.target.value })
                    }
                  />
                </div>

                <div className="config-group">
                  <label>Логотип (эмодзи или текст)</label>
                  <input
                    type="text"
                    value={config.logo}
                    onChange={(e) =>
                      setConfig({ ...config, logo: e.target.value })
                    }
                  />
                </div>

                <div className="config-group">
                  <label>Основной цвет</label>
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) =>
                      setConfig({ ...config, primaryColor: e.target.value })
                    }
                  />
                </div>

                <div className="config-group">
                  <label>Цвет фона</label>
                  <input
                    type="color"
                    value={config.backgroundColor}
                    onChange={(e) =>
                      setConfig({ ...config, backgroundColor: e.target.value })
                    }
                  />
                </div>

                <div className="config-group">
                  <label>API URL</label>
                  <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="http://localhost:3001/api"
                  />
                </div>

                <div className="config-group">
                  <label>Токен авторизации (опционально)</label>
                  <input
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Bearer token"
                  />
                </div>
              </div>
            )}

            <div className="sidebar-section">
              <h3>Код для встраивания</h3>

              <div className="code-tabs">
                <button className="tab-button active">Iframe</button>
                <button className="tab-button">JavaScript</button>
              </div>

              <div className="code-container">
                <div className="code-header">
                  <span>Код для вставки</span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(generateEmbedCode())
                    }
                    className="copy-button"
                  >
                    Копировать
                  </button>
                </div>
                <pre className="code-block">
                  <code>{generateEmbedCode()}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>

        <div className="test-main">
          <div className="widget-preview">
            <h3>Предварительный просмотр</h3>
            <div className="preview-container">
              <CertificateWidget
                config={config}
                apiUrl={apiUrl}
                token={token}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            </div>
          </div>

          <div className="test-info">
            <h3>Информация о тестировании</h3>
            <div className="info-grid">
              <div className="info-item">
                <h4>API Endpoint</h4>
                <p>{apiUrl}/certificates</p>
              </div>
              <div className="info-item">
                <h4>Метод</h4>
                <p>POST</p>
              </div>
              <div className="info-item">
                <h4>Авторизация</h4>
                <p>{token ? "Bearer Token" : "Не требуется"}</p>
              </div>
              <div className="info-item">
                <h4>Формат данных</h4>
                <p>JSON</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
