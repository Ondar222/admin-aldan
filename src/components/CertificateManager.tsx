import React, { useState, useEffect } from "react";
import {
  CertificateGenerator,
  sendCertificateByEmail,
  downloadCertificate,
} from "../utils/certificateGenerator";
import { CertificatePreview } from "./CertificatePreview";

import { ExternalLink, Search, Plus, RefreshCw } from "lucide-react";
import { apiService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import "../styles/CertificateManager.css";

interface Certificate {
  id: string;
  balance: number;
  status: "unpaid" | "paid" | "used";
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  created_at: string;
  updated_at: string;
  transactions?: Transaction[];
}

interface Transaction {
  id: string;
  certificate_id: string;
  type: "create" | "add" | "subtract";
  amount: number;
  description: string;
  created_at: string;
}

export const CertificateManager: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"buy" | "verify">("verify");
  const [sendType, setSendType] = useState<"self" | "other">("self");
  const [searchNumber, setSearchNumber] = useState("");
  const [searchResult, setSearchResult] = useState<Certificate | null>(null);

  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  // Load certificates on component mount
  useEffect(() => {
    loadCertificates();
  }, []);

  const loadCertificates = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCertificates();
      if (response.success && response.certificates) {
        setCertificates(response.certificates as Certificate[]);
      }
    } catch (error) {
      console.error("Error loading certificates:", error);
      alert("Ошибка при загрузке сертификатов");
    } finally {
      setLoading(false);
    }
  };

  // Form states for buying certificate
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [pendingCertificate, setPendingCertificate] =
    useState<Certificate | null>(null);

  const generateCertificateNumber = (): string => {
    // Генерируем ровно 6 цифр
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Проверка, что номер состоит из 6 цифр
  const isValidCertificateNumber = (number: string): boolean => {
    return /^\d{6}$/.test(number);
  };

  // Форматирование номера для отображения (всегда 6 цифр)
  const formatCertificateNumber = (number: string): string => {
    const cleanNumber = number.replace(/\D/g, "");
    return cleanNumber.padStart(6, "0");
  };

  const createCertificate = async (certificateData: Certificate) => {
    try {
      const response = await apiService.createCertificate({
        balance: certificateData.balance,
        client_name: certificateData.client_name,
        client_email: certificateData.client_email,
        client_phone: certificateData.client_phone,
      });

      if (response.success && response.certificate) {
        const newCertificate = response.certificate as Certificate;
        setCertificates((prev: Certificate[]) => [newCertificate, ...prev]);

        // Generate and send certificate
        generateAndSendCertificate(newCertificate);

        alert(`Сертификат успешно создан! Номер: ${newCertificate.id}`);
        resetForm();
      } else {
        alert("Ошибка при создании сертификата");
      }
    } catch (error) {
      console.error("Ошибка при создании сертификата:", error);
      alert("Произошла ошибка при создании сертификата. Попробуйте еще раз.");
    }
  };

  const confirmCertificate = async () => {
    if (pendingCertificate) {
      await generateAndSendCertificate(pendingCertificate);
      setShowPreview(false);
      setPendingCertificate(null);
      resetForm();
    }
  };

  const generateAndSendCertificate = async (certificate: Certificate) => {
    try {
      const generator = new CertificateGenerator();

      // Создаем сертификат
      const certificateImage = generator.createSimpleCertificate({
        number: certificate.id,
        amount: certificate.balance,
        recipientName: certificate.client_name,
        message: message,
      });

      // Отправляем на почту
      const emailSent = await sendCertificateByEmail(
        certificateImage,
        certificate.client_email || "",
        {
          number: certificate.id,
          amount: certificate.balance,
          recipientName: certificate.client_name,
          message: message,
        }
      );

      if (emailSent) {
        alert(
          `Сертификат №${formatCertificateNumber(certificate.id)} на сумму ${
            certificate.balance
          }₽ создан и отправлен на ${certificate.client_email}`
        );

        // Предлагаем скачать сертификат
        if (confirm("Хотите скачать сертификат?")) {
          downloadCertificate(
            certificateImage,
            `certificate-${formatCertificateNumber(certificate.id)}.png`
          );
        }
      }
    } catch (error) {
      console.error("Ошибка при создании сертификата:", error);
      alert("Произошла ошибка при создании сертификата");
    }
  };

  const resetForm = () => {
    setBuyerName("");
    setBuyerPhone("");
    setBuyerEmail("");
    setRecipientName("");
    setRecipientPhone("");
    setRecipientEmail("");
    setAmount("");
    setMessage("");
  };

  const searchCertificate = async () => {
    if (!isValidCertificateNumber(searchNumber)) {
      alert("Номер сертификата должен состоять из 6 цифр");
      return;
    }

    try {
      setSearchLoading(true);
      const formattedSearchNumber = formatCertificateNumber(searchNumber);

      const response = await apiService.getCertificate(formattedSearchNumber);

      if (response.success && response.certificate) {
        setSearchResult(response.certificate as Certificate);
      } else {
        setSearchResult(null);
        alert("Сертификат не найден");
      }
    } catch (error) {
      console.error("Ошибка при поиске сертификата:", error);
      setSearchResult(null);
      alert("Ошибка при поиске сертификата");
    } finally {
      setSearchLoading(false);
    }
  };

  const useCertificate = async (certificateId: string, useAmount: number) => {
    try {
      const response = await apiService.updateCertificateBalance(
        certificateId,
        "subtract",
        useAmount,
        "Оплата услуг"
      );

      if (response.success) {
        alert(`С сертификата списано ${useAmount}₽`);
        setSearchResult(null);
        setSearchNumber("");
        await loadCertificates();
      } else {
        alert("Ошибка при списании средств");
      }
    } catch (error) {
      console.error("Ошибка при списании средств:", error);
      alert("Ошибка при списании средств");
    }
  };

  const addBalance = async (certificateId: string, addAmount: number) => {
    try {
      const response = await apiService.updateCertificateBalance(
        certificateId,
        "add",
        addAmount,
        "Пополнение баланса"
      );

      if (response.success) {
        alert(`На сертификат добавлено ${addAmount}₽`);
        setSearchResult(null);
        setSearchNumber("");
        await loadCertificates();
      } else {
        alert("Ошибка при пополнении баланса");
      }
    } catch (error) {
      console.error("Ошибка при пополнении баланса:", error);
      alert("Ошибка при пополнении баланса");
    }
  };

  const isFormValid = () => {
    if (sendType === "self") {
      return buyerName && buyerPhone && buyerEmail && amount;
    } else {
      return (
        buyerName &&
        buyerPhone &&
        recipientName &&
        recipientPhone &&
        recipientEmail &&
        amount
      );
    }
  };

  const createCertificateDirectly = () => {
    if (!isFormValid()) {
      alert("Пожалуйста, заполните все обязательные поля");
      return;
    }

    // Create certificate directly
    const newCertificate: Certificate = {
      id: generateCertificateNumber(),
      balance: parseInt(amount),
      status: "paid", // Directly mark as paid since no payment processing
      client_name: buyerName,
      client_email: buyerEmail,
      client_phone: buyerPhone,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Create certificate in backend
    createCertificate(newCertificate);
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "unpaid":
        return "Не оплачен";
      case "paid":
        return "Оплачен";
      case "used":
        return "Использован";
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "unpaid":
        return "status-unpaid";
      case "paid":
        return "status-paid";
      case "used":
        return "status-used";
      default:
        return "";
    }
  };

  return (
    <div className="certificate-manager">
      <div className="user-role-info">
        <p>
          <strong>Роль:</strong>{" "}
          {user?.role === "admin" ? "Супер Админ" : "Менеджер"}
        </p>
        <p>
          <strong>Пользователь:</strong> {user?.name}
        </p>
      </div>
      <div className="certificate-tabs">
        {user?.role === "admin" && (
          <button
            className={`tab-button ${activeTab === "buy" ? "active" : ""}`}
            onClick={() => setActiveTab("buy")}
          >
            Создание сертификата
          </button>
        )}
        <button
          className={`tab-button ${activeTab === "verify" ? "active" : ""}`}
          onClick={() => setActiveTab("verify")}
        >
          Проверка сертификата
        </button>
      </div>

      {activeTab === "buy" && (
        <div className="certificate-create">
          <div className="send-type-selector">
            <button
              className={`type-button ${sendType === "self" ? "active" : ""}`}
              onClick={() => setSendType("self")}
            >
              Отправить себе
            </button>
            <button
              className={`type-button ${sendType === "other" ? "active" : ""}`}
              onClick={() => setSendType("other")}
            >
              Отправить другому человеку
            </button>
          </div>

          <form
            className="certificate-form"
            onSubmit={(e) => {
              e.preventDefault();
              createCertificateDirectly();
            }}
          >
            <div className="form-section">
              <h3>Данные покупателя</h3>
              <div className="form-group">
                <label>ФИО покупателя *</label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Номер телефона покупателя *</label>
                <input
                  type="tel"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  required
                />
              </div>
              {sendType === "self" && (
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    required
                  />
                </div>
              )}
            </div>

            {sendType === "other" && (
              <div className="form-section">
                <h3>Данные получателя</h3>
                <div className="form-group">
                  <label>ФИО получателя *</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Номер телефона получателя *</label>
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email получателя *</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Текст поздравления</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}

            <div className="form-section">
              <h3>Сумма сертификата</h3>
              <div className="form-group">
                <label>Сумма (₽) *</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="100"
                  step="100"
                  required
                />
              </div>
            </div>

            <button
              type="button"
              className="pay-button"
              disabled={!isFormValid()}
              onClick={createCertificateDirectly}
            >
              Создать сертификат
            </button>
          </form>
        </div>
      )}

      {activeTab === "verify" && (
        <div className="certificate-verify">
          <div className="search-section">
            <h3>Проверка сертификата</h3>
            <div className="search-form">
              <div className="search-input-container">
                <Search className="search-icon" />
                <input
                  type="text"
                  placeholder="Введите номер сертификата (6 цифр)"
                  value={searchNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setSearchNumber(value);
                  }}
                  maxLength={6}
                  pattern="[0-9]{6}"
                  className={
                    searchNumber.length > 0 && searchNumber.length < 6
                      ? "input-warning"
                      : ""
                  }
                />
                <button
                  onClick={searchCertificate}
                  disabled={searchNumber.length !== 6 || searchLoading}
                  className="search-button"
                >
                  {searchLoading ? (
                    <RefreshCw className="loading-icon" />
                  ) : (
                    "Проверить"
                  )}
                </button>
              </div>
              {searchNumber.length > 0 && searchNumber.length < 6 && (
                <div className="search-hint">Введите ровно 6 цифр</div>
              )}
            </div>
          </div>

          {searchResult && (
            <div className="certificate-result">
              <h4>Результат проверки</h4>
              <div className="certificate-info">
                <p>
                  <strong>Номер:</strong>{" "}
                  {formatCertificateNumber(searchResult.id)}
                </p>
                <p>
                  <strong>Статус:</strong>
                  <span
                    className={`status ${getStatusClass(searchResult.status)}`}
                  >
                    {getStatusText(searchResult.status)}
                  </span>
                </p>
                <p>
                  <strong>Баланс:</strong> {searchResult.balance}₽
                </p>
                <p>
                  <strong>Покупатель:</strong>{" "}
                  {searchResult.client_name || "Не указан"}
                </p>
                <p>
                  <strong>Телефон:</strong>{" "}
                  {searchResult.client_phone || "Не указан"}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {searchResult.client_email || "Не указан"}
                </p>
                <p>
                  <strong>Дата создания:</strong>{" "}
                  {new Date(searchResult.created_at).toLocaleDateString()}
                </p>
              </div>

              {searchResult.status === "paid" && user?.role === "admin" && (
                <div className="use-certificate">
                  <h5>Управление сертификатом (только для супер админов)</h5>
                  <div className="certificate-actions">
                    <div className="action-group">
                      <label>Списать сумму:</label>
                      <input
                        type="number"
                        placeholder="Сумма к списанию"
                        min="1"
                        max={searchResult.balance}
                        id="useAmount"
                      />
                      <button
                        onClick={() => {
                          const useAmount = parseFloat(
                            (
                              document.getElementById(
                                "useAmount"
                              ) as HTMLInputElement
                            ).value
                          );
                          if (
                            useAmount > 0 &&
                            useAmount <= searchResult.balance
                          ) {
                            useCertificate(searchResult.id, useAmount);
                          } else {
                            alert("Неверная сумма для списания");
                          }
                        }}
                        className="action-button subtract"
                      >
                        Списать
                      </button>
                    </div>

                    <div className="action-group">
                      <label>Пополнить баланс:</label>
                      <input
                        type="number"
                        placeholder="Сумма пополнения"
                        min="1"
                        id="addAmount"
                      />
                      <button
                        onClick={() => {
                          const addAmount = parseFloat(
                            (
                              document.getElementById(
                                "addAmount"
                              ) as HTMLInputElement
                            ).value
                          );
                          if (addAmount > 0) {
                            addBalance(searchResult.id, addAmount);
                          } else {
                            alert("Неверная сумма для пополнения");
                          }
                        }}
                        className="action-button add"
                      >
                        Пополнить
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="certificates-list">
            <div className="list-header">
              <h3>Все сертификаты</h3>
              <button
                onClick={loadCertificates}
                disabled={loading}
                className="refresh-button"
              >
                {loading ? (
                  <RefreshCw className="loading-icon" />
                ) : (
                  <RefreshCw />
                )}
                Обновить
              </button>
            </div>

            {loading ? (
              <div className="loading-message">Загрузка сертификатов...</div>
            ) : certificates.length === 0 ? (
              <div className="empty-message">Сертификаты не найдены</div>
            ) : (
              <div className="certificates-grid">
                {certificates.map((cert) => (
                  <div key={cert.id} className="certificate-card">
                    <div className="certificate-header">
                      <span className="certificate-number">
                        №{formatCertificateNumber(cert.id)}
                      </span>
                      <span className={`status ${getStatusClass(cert.status)}`}>
                        {getStatusText(cert.status)}
                      </span>
                    </div>
                    <div className="certificate-details">
                      <p>
                        <strong>Баланс:</strong> {cert.balance}₽
                      </p>
                      <p>
                        <strong>Покупатель:</strong>{" "}
                        {cert.client_name || "Не указан"}
                      </p>
                      <p>
                        <strong>Телефон:</strong>{" "}
                        {cert.client_phone || "Не указан"}
                      </p>
                      <p>
                        <strong>Дата:</strong>{" "}
                        {new Date(cert.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="certificate-actions">
                      <button
                        onClick={() => {
                          setSearchNumber(cert.id);
                          searchCertificate();
                        }}
                        className="action-button view"
                      >
                        Просмотреть
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {showPreview && pendingCertificate && (
        <CertificatePreview
          number={pendingCertificate.id}
          amount={pendingCertificate.balance}
          recipientName={pendingCertificate.client_name}
          message={message}
          onClose={() => {
            setShowPreview(false);
            setPendingCertificate(null);
          }}
          onConfirm={confirmCertificate}
        />
      )}
    </div>
  );
};
