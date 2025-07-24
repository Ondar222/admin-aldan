import React, { useState, useEffect, useRef } from "react";
import {
  CreditCard,
  ExternalLink,
  Settings,
  Play,
  Copy,
  Check,
} from "lucide-react";
import { AlfaBankWidget } from "./AlfaBankWidget";
import "../styles/PaymentSystem.css";

interface AlfaBankConfig {
  token: string;
  gateway: "test" | "pay";
  testMode: boolean;
  returnUrl: string;
  failUrl: string;
  language: "ru" | "en";
  buttonText: string;
}

export const PaymentSystem: React.FC = () => {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [config, setConfig] = useState<AlfaBankConfig>({
    token: "",
    gateway: "test",
    testMode: true,
    returnUrl: "",
    failUrl: "",
    language: "ru",
    buttonText: "Оплатить картой",
  });

  // Load config from localStorage on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem("alfaBankConfig");
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const saveConfig = (newConfig: AlfaBankConfig) => {
    setConfig(newConfig);
    localStorage.setItem("alfaBankConfig", JSON.stringify(newConfig));
  };

  return (
    <div className="payment-system-container">
      <div className="payment-system-header">
        <h1 className="payment-system-title">Платежная система</h1>
        <div className="header-actions">
          <button
            onClick={() => setShowTestModal(true)}
            className="test-button"
            disabled={!config.token}
          >
            <Play className="button-icon" />
            <span>Тестировать виджет</span>
          </button>
          <button
            onClick={() => setShowConfigModal(true)}
            className="configure-button"
          >
            <Settings className="button-icon" />
            <span>Настройки</span>
          </button>
        </div>
      </div>

      <div className="integration-card">
        <div className="integration-content">
          <CreditCard className="integration-icon" />
          <h2 className="integration-title">Интеграция с Альфа-Банком</h2>
          <p className="integration-description">
            Настройте и протестируйте платежный виджет Альфа-Банка для приема
            платежей на вашем сайте
          </p>

          {config.token ? (
            <div className="config-status">
              <div className="status-indicator active"></div>
              <span className="status-text">Виджет настроен</span>
            </div>
          ) : (
            <div className="config-status">
              <div className="status-indicator inactive"></div>
              <span className="status-text">Виджет не настроен</span>
            </div>
          )}

          <div className="integration-actions">
            <button
              onClick={() => setShowConfigModal(true)}
              className="integration-button"
            >
              Настроить виджет
            </button>
            {config.token && (
              <button
                onClick={() => setShowTestModal(true)}
                className="test-widget-button"
              >
                <Play className="button-icon" />
                <span>Тестировать</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Configuration Modal */}
      {showConfigModal && (
        <ConfigModal
          config={config}
          onSave={saveConfig}
          onClose={() => setShowConfigModal(false)}
        />
      )}

      {/* Test Widget Modal */}
      {showTestModal && (
        <TestWidgetModal
          config={config}
          onClose={() => setShowTestModal(false)}
        />
      )}
    </div>
  );
};

interface ConfigModalProps {
  config: AlfaBankConfig;
  onSave: (config: AlfaBankConfig) => void;
  onClose: () => void;
}

const ConfigModal: React.FC<ConfigModalProps> = ({
  config,
  onSave,
  onClose,
}) => {
  const [formConfig, setFormConfig] = useState<AlfaBankConfig>(config);
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formConfig);
    onClose();
  };

  const generateWidgetCode = () => {
    const scriptUrl = formConfig.testMode
      ? "https://testpay.alfabank.ru/assets/alfa-payment.js"
      : "https://pay2.alfabank.ru/assets/alfa-payment.js";

    return `<!-- Альфа-Банк Платежный виджет -->
<script
  id="alfa-payment-script"
  type="text/javascript"
  src="${scriptUrl}">
</script>

<div id="alfa-payment-button"
     data-token="${formConfig.token}"
     data-gateway="${formConfig.gateway}"
     data-language="${formConfig.language}"
     data-button-text="${formConfig.buttonText}"
     data-return-url="${formConfig.returnUrl}"
     data-fail-url="${formConfig.failUrl}"
     data-amount-selector=".amount"
     data-order-number-selector=".orderNumber"
     data-client-info-selector=".clientInfo"
     data-email-selector=".clientEmail"
     data-description-selector=".orderDescription">
</div>`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateWidgetCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h2 className="modal-title">Настройка виджета Альфа-Банка</h2>
          <button onClick={onClose} className="modal-close-button">
            ✕
          </button>
        </div>

        <div className="documentation-box">
          <h3 className="documentation-title">Документация</h3>
          <p className="documentation-text">
            Для получения токена и настройки интеграции используйте документацию
            Альфа-Банка.
          </p>
          <a
            href="https://alfabank.ru/sme/payservice/internet-acquiring/docs/connection-options/widget/"
            target="_blank"
            rel="noopener noreferrer"
            className="documentation-link"
          >
            <span>Документация по интеграции</span>
            <ExternalLink className="link-icon" />
          </a>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Токен магазина *</label>
            <input
              type="text"
              value={formConfig.token}
              onChange={(e) =>
                setFormConfig({ ...formConfig, token: e.target.value })
              }
              className="form-input"
              placeholder="fhojfle6ssav32c6ao42bkcr54"
              required
            />
            <p className="form-help">
              Получите токен в личном кабинете Альфа-Банка
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Режим работы</label>
            <select
              value={formConfig.gateway}
              onChange={(e) =>
                setFormConfig({
                  ...formConfig,
                  gateway: e.target.value as "test" | "pay",
                  testMode: e.target.value === "test",
                })
              }
              className="form-input"
            >
              <option value="test">Тестовый режим</option>
              <option value="pay">Продакшн режим</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Язык интерфейса</label>
            <select
              value={formConfig.language}
              onChange={(e) =>
                setFormConfig({
                  ...formConfig,
                  language: e.target.value as "ru" | "en",
                })
              }
              className="form-input"
            >
              <option value="ru">Русский</option>
              <option value="en">English</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Текст кнопки</label>
            <input
              type="text"
              value={formConfig.buttonText}
              onChange={(e) =>
                setFormConfig({ ...formConfig, buttonText: e.target.value })
              }
              className="form-input"
              placeholder="Оплатить картой"
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL успешной оплаты</label>
            <input
              type="url"
              value={formConfig.returnUrl}
              onChange={(e) =>
                setFormConfig({ ...formConfig, returnUrl: e.target.value })
              }
              className="form-input"
              placeholder="https://yoursite.com/success"
            />
          </div>

          <div className="form-group">
            <label className="form-label">URL неуспешной оплаты</label>
            <input
              type="url"
              value={formConfig.failUrl}
              onChange={(e) =>
                setFormConfig({ ...formConfig, failUrl: e.target.value })
              }
              className="form-input"
              placeholder="https://yoursite.com/fail"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Отмена
            </button>
            <button type="submit" className="submit-button">
              Сохранить настройки
            </button>
          </div>
        </form>

        {formConfig.token && (
          <div className="code-section">
            <div className="code-header">
              <h3 className="code-title">Код для вставки на сайт</h3>
              <button onClick={copyToClipboard} className="copy-button">
                {copied ? (
                  <Check className="button-icon" />
                ) : (
                  <Copy className="button-icon" />
                )}
                <span>{copied ? "Скопировано" : "Копировать"}</span>
              </button>
            </div>
            <pre className="code-block">
              <code>{generateWidgetCode()}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

interface TestWidgetModalProps {
  config: AlfaBankConfig;
  onClose: () => void;
}

const TestWidgetModal: React.FC<TestWidgetModalProps> = ({
  config,
  onClose,
}) => {
  const [orderData, setOrderData] = useState({
    amount: "1000",
    orderNumber: "TEST-001",
    clientName: "Тестовый клиент",
    clientEmail: "test@example.com",
    description: "Тестовый заказ",
  });

  return (
    <div className="modal-overlay">
      <div className="modal-container large">
        <div className="modal-header">
          <h2 className="modal-title">Тестирование виджета</h2>
          <button onClick={onClose} className="modal-close-button">
            ✕
          </button>
        </div>

        <div className="test-container">
          <div className="test-form">
            <h3 className="test-title">Данные заказа</h3>

            <div className="form-group">
              <label className="form-label">Сумма (₽)</label>
              <input
                type="number"
                value={orderData.amount}
                onChange={(e) =>
                  setOrderData({ ...orderData, amount: e.target.value })
                }
                className="form-input"
                placeholder="1000"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Номер заказа</label>
              <input
                type="text"
                value={orderData.orderNumber}
                onChange={(e) =>
                  setOrderData({ ...orderData, orderNumber: e.target.value })
                }
                className="form-input"
                placeholder="TEST-001"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Имя клиента</label>
              <input
                type="text"
                value={orderData.clientName}
                onChange={(e) =>
                  setOrderData({ ...orderData, clientName: e.target.value })
                }
                className="form-input"
                placeholder="Иван Иванов"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email клиента</label>
              <input
                type="email"
                value={orderData.clientEmail}
                onChange={(e) =>
                  setOrderData({ ...orderData, clientEmail: e.target.value })
                }
                className="form-input"
                placeholder="client@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Описание заказа</label>
              <input
                type="text"
                value={orderData.description}
                onChange={(e) =>
                  setOrderData({ ...orderData, description: e.target.value })
                }
                className="form-input"
                placeholder="Консультация врача"
              />
            </div>
          </div>

          <div className="widget-preview">
            <h3 className="preview-title">Предварительный просмотр</h3>
            <div className="preview-content">
              <div className="order-summary">
                <p>
                  <strong>Сумма:</strong> ₽{orderData.amount}
                </p>
                <p>
                  <strong>Заказ:</strong> {orderData.orderNumber}
                </p>
                <p>
                  <strong>Клиент:</strong> {orderData.clientName}
                </p>
                <p>
                  <strong>Email:</strong> {orderData.clientEmail}
                </p>
                <p>
                  <strong>Описание:</strong> {orderData.description}
                </p>
              </div>

              <AlfaBankWidget config={config} orderData={orderData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
