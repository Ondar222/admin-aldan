import React, { useState } from "react";
import {
  Search,
  Plus,
  Award,
  CreditCard,
  PlusCircle,
  MinusCircle,
  History,
} from "lucide-react";
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
  const [searchId, setSearchId] = useState("");
  const [foundCertificate, setFoundCertificate] = useState<Certificate | null>(
    null
  );
  const [searchError, setSearchError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceOperation, setBalanceOperation] = useState<"add" | "subtract">(
    "add"
  );

  // Mock certificates database
  const certificates: Certificate[] = [
    {
      id: "123456",
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
      id: "345678",
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

    if (searchId.length !== 6 || !/^\d{6}$/.test(searchId)) {
      setSearchError("Номер сертификата должен содержать 6 цифр");
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

  const handleBalanceOperation = (type: "add" | "subtract") => {
    setBalanceOperation(type);
    setShowBalanceModal(true);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Электронные сертификаты клиники</h1>
        <p className="dashboard-subtitle">
          Сертификаты для оплаты медицинских услуг. Поиск, создание и управление
          балансом
        </p>
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
                placeholder="123456"
                className="search-input"
                maxLength={6}
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
              {foundCertificate.status === "unpaid" && (
                <button className="action-button activate">
                  <CreditCard className="button-icon" />
                  <span>Активировать сертификат</span>
                </button>
              )}

              {foundCertificate.status === "paid" && (
                <>
                  <button
                    onClick={() => handleBalanceOperation("add")}
                    className="action-button add"
                  >
                    <PlusCircle className="button-icon" />
                    <span>Пополнить</span>
                  </button>

                  <button
                    onClick={() => handleBalanceOperation("subtract")}
                    className="action-button subtract"
                  >
                    <MinusCircle className="button-icon" />
                    <span>Оплата услуг</span>
                  </button>
                </>
              )}
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

      {/* Создать новый сертификат */}
      <div className="create-certificate-container">
        <button
          onClick={() => setShowCreateModal(true)}
          className="create-certificate-button"
        >
          <Plus className="create-icon" />
          <span>Создать новый сертификат</span>
        </button>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateCertificateModal onClose={() => setShowCreateModal(false)} />
      )}

      {showBalanceModal && foundCertificate && (
        <BalanceOperationModal
          certificate={foundCertificate}
          operation={balanceOperation}
          onClose={() => setShowBalanceModal(false)}
          onSuccess={() => {
            setShowBalanceModal(false);
            // Refresh certificate data
            handleSearch();
          }}
        />
      )}
    </div>
  );
};

interface CreateCertificateModalProps {
  onClose: () => void;
}

const CreateCertificateModal: React.FC<CreateCertificateModalProps> = ({
  onClose,
}) => {
  const [balance, setBalance] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const generateCertificateId = () => {
    return Math.floor(1000000 + Math.random() * 9000000).toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call for certificate creation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const certificateId = generateCertificateId();

      // Here you would save the certificate to your database
      console.log("Created certificate:", {
        id: certificateId,
        balance: parseInt(balance),
        clientName,
        clientEmail,
        status: "unpaid",
        createdAt: new Date().toISOString(),
      });

      alert(`Сертификат создан! Номер: ${certificateId}`);
      onClose();
    } catch (error) {
      alert("Ошибка при создании сертификата");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Создать новый сертификат</h2>
          <button onClick={onClose} className="modal-close-button">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Сумма сертификата (₽) *</label>
            <input
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              className="form-input"
              placeholder="5000"
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Имя клиента</label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="form-input"
              placeholder="Иванов Иван Иванович"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email клиента</label>
            <input
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="form-input"
              placeholder="client@example.com"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Отмена
            </button>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Создание сертификата...</span>
                </>
              ) : (
                <>
                  <Award className="button-icon" />
                  <span>Создать сертификат</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface BalanceOperationModalProps {
  certificate: Certificate;
  operation: "add" | "subtract";
  onClose: () => void;
  onSuccess: () => void;
}

const BalanceOperationModal: React.FC<BalanceOperationModalProps> = ({
  certificate,
  operation,
  onClose,
  onSuccess,
}) => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const operationAmount = parseInt(amount);

      if (operation === "subtract" && operationAmount > certificate.balance) {
        alert("Недостаточно средств на карте");
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Balance operation:", {
        certificateId: certificate.id,
        operation,
        amount: operationAmount,
        description,
        newBalance:
          operation === "add"
            ? certificate.balance + operationAmount
            : certificate.balance - operationAmount,
      });

      alert(
        `Операция выполнена! ${
          operation === "add" ? "Пополнение" : "Списание"
        }: ₽${operationAmount.toLocaleString()}`
      );
      onSuccess();
    } catch (error) {
      alert("Ошибка при выполнении операции");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">
            {operation === "add" ? "Пополнить сертификат" : "Оплата услуг"}
          </h2>
          <button onClick={onClose} className="modal-close-button">
            ✕
          </button>
        </div>

        <div className="certificate-info">
          <p className="certificate-id">Сертификат #{certificate.id}</p>
          <p className="certificate-balance">
            Текущий баланс: ₽{certificate.balance.toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Сумма (₽) *</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="form-input"
              placeholder="1000"
              required
              min="1"
              max={operation === "subtract" ? certificate.balance : undefined}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Описание операции</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-input"
              placeholder={
                operation === "add"
                  ? "Пополнение сертификата"
                  : "Консультация врача, анализы и т.д."
              }
            />
          </div>

          {amount && (
            <div className="balance-preview">
              <p className="balance-text">
                Новый баланс: ₽
                {(operation === "add"
                  ? certificate.balance + parseInt(amount || "0")
                  : certificate.balance - parseInt(amount || "0")
                ).toLocaleString()}
              </p>
            </div>
          )}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-button">
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`submit-button ${operation}`}
            >
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  <span>Обработка...</span>
                </>
              ) : (
                <>
                  {operation === "add" ? (
                    <PlusCircle className="button-icon" />
                  ) : (
                    <MinusCircle className="button-icon" />
                  )}
                  <span>
                    {operation === "add" ? "Пополнить" : "Оплатить услуги"}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
