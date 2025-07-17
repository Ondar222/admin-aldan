import React, { useState } from "react";
import { CreditCard, ExternalLink } from "lucide-react";
import "../styles/PaymentSystem.css";

export const PaymentSystem: React.FC = () => {
  const [showAlphaModal, setShowAlphaModal] = useState(false);

  return (
    <div className="payment-system-container">
      <div className="payment-system-header">
        <h1 className="payment-system-title">Платежная система</h1>
        <button
          onClick={() => setShowAlphaModal(true)}
          className="configure-button"
        >
          <CreditCard className="button-icon" />
          <span>Настроить Альфа-Банк</span>
        </button>
      </div>

      <div className="integration-card">
        <div className="integration-content">
          <CreditCard className="integration-icon" />
          <h2 className="integration-title">Интеграция с Альфа-Банком</h2>
          <p className="integration-description">
            Настройте интеграцию с платежным виджетом Альфа-Банка для приема
            платежей
          </p>
          <button
            onClick={() => setShowAlphaModal(true)}
            className="integration-button"
          >
            Настроить интеграцию
          </button>
        </div>
      </div>

      {/* Alfa Bank Configuration Modal */}
      {showAlphaModal && (
        <AlphaBankModal onClose={() => setShowAlphaModal(false)} />
      )}
    </div>
  );
};

interface AlphaBankModalProps {
  onClose: () => void;
}

const AlphaBankModal: React.FC<AlphaBankModalProps> = ({ onClose }) => {
  const [config, setConfig] = useState({
    merchantId: "",
    apiKey: "",
    secretKey: "",
    testMode: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would save the configuration
    console.log("Alfa Bank config:", config);
    alert("Настройки сохранены!");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Настройка Альфа-Банка</h2>
          <button onClick={onClose} className="modal-close-button">
            ✕
          </button>
        </div>

        <div className="documentation-box">
          <h3 className="documentation-title">Документация</h3>
          <p className="documentation-text">
            Для настройки интеграции с Альфа-Банком используйте виджет платежей.
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
            <label className="form-label">Merchant ID</label>
            <input
              type="text"
              value={config.merchantId}
              onChange={(e) =>
                setConfig({ ...config, merchantId: e.target.value })
              }
              className="form-input"
              placeholder="Введите Merchant ID"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">API Key</label>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              className="form-input"
              placeholder="Введите API Key"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Secret Key</label>
            <input
              type="password"
              value={config.secretKey}
              onChange={(e) =>
                setConfig({ ...config, secretKey: e.target.value })
              }
              className="form-input"
              placeholder="Введите Secret Key"
              required
            />
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="testMode"
              checked={config.testMode}
              onChange={(e) =>
                setConfig({ ...config, testMode: e.target.checked })
              }
              className="checkbox-input"
            />
            <label htmlFor="testMode" className="checkbox-label">
              Тестовый режим
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Отмена
            </button>
            <button type="submit" className="submit-button">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
