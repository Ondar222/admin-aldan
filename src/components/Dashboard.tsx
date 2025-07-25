import React, { useState, useEffect } from "react";
import { Search, Award, History, ExternalLink } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Dashboard.css";

interface Certificate {
  id: string;
  balance: number;
  status: "paid" | "unpaid";
  createdAt: string;
  clientName?: string;
  clientEmail?: string;
  transactions?: Transaction[];
}

interface Transaction {
  id: string;
  type: "add" | "subtract" | "create";
  amount: number;
  date: string;
  description: string;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [searchId, setSearchId] = useState("");
  const [foundCertificate, setFoundCertificate] = useState<Certificate | null>(
    null
  );
  const [searchError, setSearchError] = useState("");
  const [alfaBankConfig, setAlfaBankConfig] = useState<any>(null);

  // Load Alfa Bank config from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem("alfaBankConfig");
    if (savedConfig) {
      setAlfaBankConfig(JSON.parse(savedConfig));
    }
  }, []);

  // Mock certificates database
  const certificates: Certificate[] = [
    {
      id: "1234567",
      balance: 5000,
      status: "paid",
      createdAt: "2025-01-15",
      clientName: "Иванов И.И.",
      clientEmail: "ivanov@example.com",
      transactions: [
        {
          id: "1",
          type: "create",
          amount: 5000,
          date: "2025-01-15",
          description: "Создание сертификата",
        },
        {
          id: "2",
          type: "subtract",
          amount: 1500,
          date: "2025-01-16",
          description: "Оплата услуг",
        },
        {
          id: "3",
          type: "add",
          amount: 2000,
          date: "2025-01-17",
          description: "Пополнение баланса",
        },
      ],
    },
    { id: "2345678", balance: 8000, status: "unpaid", createdAt: "2025-01-14" },
    {
      id: "3456789",
      balance: 12000,
      status: "paid",
      createdAt: "2025-01-13",
      clientName: "Петрова А.С.",
      clientEmail: "petrova@example.com",
    },
  ];

  const handleSearch = () => {
    setSearchError("");
    setFoundCertificate(null);

    if (!searchId) {
      setSearchError("Введите номер сертификата");
      return;
    }

    if (searchId.length !== 7 || !/^\d{7}$/.test(searchId)) {
      setSearchError("Номер сертификата должен содержать 7 цифр");
      return;
    }

    const certificate = certificates.find((cert) => cert.id === searchId);
    if (certificate) {
      setFoundCertificate(certificate);
    } else {
      setSearchError("Сертификат не найден");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Электронные сертификаты клиники</h1>
        <p className="dashboard-subtitle">
          Сертификаты для оплаты медицинских услуг. Поиск, создание и управление
          балансом
        </p>
        {user?.role !== "admin" && (
          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
              marginTop: "10px",
              textAlign: "center",
            }}
          >
            Как менеджер, вы можете только просматривать и проверять
            сертификаты. Создание и управление сертификатами доступно только
            супер администраторам.
          </p>
        )}
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-container">
          <label className="search-label">Поиск сертификата по номеру</label>
          <div className="search-input-group">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                value={searchId}
                onChange={(e) =>
                  setSearchId(e.target.value.replace(/\D/g, "").slice(0, 7))
                }
                onKeyPress={handleKeyPress}
                placeholder="1234567"
                className="search-input"
                maxLength={7}
              />
            </div>
            <button onClick={handleSearch} className="search-button">
              Найти
            </button>
          </div>
          {searchError && <p className="search-error">{searchError}</p>}
        </div>
      </div>

      {/* Found Certificate */}
      {foundCertificate && (
        <div className="certificate-card">
          <div className="certificate-header">
            <h3 className="certificate-title">
              Сертификат #{foundCertificate.id}
            </h3>
            <span className={`certificate-status ${foundCertificate.status}`}>
              {foundCertificate.status === "paid" ? "Активна" : "Неактивна"}
            </span>
          </div>

          <div className="certificate-grid">
            <div className="certificate-info">
              <p className="info-label">Баланс</p>
              <p className="info-value">
                ₽{foundCertificate.balance.toLocaleString()}
              </p>
            </div>
            <div className="certificate-info">
              <p className="info-label">Дата создания</p>
              <p className="info-value">
                {new Date(foundCertificate.createdAt).toLocaleDateString(
                  "ru-RU"
                )}
              </p>
            </div>
            <div className="certificate-info">
              <p className="info-label">Клиент</p>
              <p className="info-value">
                {foundCertificate.clientName || "Не указан"}
              </p>
              {foundCertificate.clientEmail && (
                <p className="info-email">{foundCertificate.clientEmail}</p>
              )}
            </div>
          </div>

          <div className="certificate-actions">
            <div className="action-buttons">
              {/* Кнопки управления убраны */}
            </div>
          </div>

          {/* Transaction History */}
          {foundCertificate.transactions &&
            foundCertificate.transactions.length > 0 && (
              <div className="transaction-history">
                <h4 className="history-title">
                  <History className="history-icon" />
                  История операций
                </h4>
                <div className="transactions-list">
                  {foundCertificate.transactions.map((transaction) => (
                    <div key={transaction.id} className="transaction-item">
                      <div className="transaction-details">
                        <div
                          className={`transaction-indicator ${transaction.type}`}
                        ></div>
                        <div>
                          <p className="transaction-description">
                            {transaction.description ||
                              (transaction.type === "add"
                                ? "Пополнение карты"
                                : transaction.type === "subtract"
                                ? "Оплата услуг"
                                : "Создание сертификата")}
                          </p>
                          <p className="transaction-date">
                            {new Date(transaction.date).toLocaleDateString(
                              "ru-RU"
                            )}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`transaction-amount ${transaction.type}`}
                      >
                        {transaction.type === "add"
                          ? "+"
                          : transaction.type === "subtract"
                          ? "-"
                          : ""}
                        ₽{transaction.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Создать новый сертификат - убрано */}

      {/* Modals - убраны */}
    </div>
  );
};

export default Dashboard;
