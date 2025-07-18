import React, { useState } from "react";
import {
  CertificateGenerator,
  sendCertificateByEmail,
  downloadCertificate,
} from "../utils/certificateGenerator";
import { CertificatePreview } from "./CertificatePreview";
import "../styles/CertificateManager.css";

interface Certificate {
  id: string;
  number: string; // 6-значный номер сертификата
  amount: number;
  status: "active" | "used";
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  recipientName?: string;
  recipientPhone?: string;
  recipientEmail?: string;
  message?: string;
  createdAt: Date;
  usedAmount: number;
}

export const CertificateManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"buy" | "verify">("buy");
  const [sendType, setSendType] = useState<"self" | "other">("self");
  const [searchNumber, setSearchNumber] = useState("");
  const [searchResult, setSearchResult] = useState<Certificate | null>(null);

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

  // Mock certificates data (в реальном проекте это будет в базе данных)
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: "1",
      number: "123456",
      amount: 5000,
      status: "active",
      buyerName: "Иван Иванов",
      buyerPhone: "+7 999 123-45-67",
      buyerEmail: "ivan@example.com",
      recipientName: "Петр Петров",
      recipientPhone: "+7 999 987-65-43",
      recipientEmail: "petr@example.com",
      message: "С днем рождения!",
      createdAt: new Date("2024-01-15"),
      usedAmount: 0,
    },
    {
      id: "2",
      number: "789012",
      amount: 3000,
      status: "used",
      buyerName: "Мария Сидорова",
      buyerPhone: "+7 999 111-22-33",
      buyerEmail: "maria@example.com",
      createdAt: new Date("2024-01-10"),
      usedAmount: 3000,
    },
    {
      id: "3",
      number: "345678",
      amount: 10000,
      status: "active",
      buyerName: "Анна Козлова",
      buyerPhone: "+7 999 555-44-33",
      buyerEmail: "anna@example.com",
      createdAt: new Date("2024-01-20"),
      usedAmount: 2000,
    },
    {
      id: "4",
      number: "000123",
      amount: 2500,
      status: "active",
      buyerName: "Сергей Волков",
      buyerPhone: "+7 999 777-88-99",
      buyerEmail: "sergey@example.com",
      createdAt: new Date("2024-01-25"),
      usedAmount: 0,
    },
  ]);

  const generateCertificateNumber = (): string => {
    // Генерируем ровно 6 цифр
    let number: string;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      number = Math.floor(100000 + Math.random() * 900000).toString();
      attempts++;
    } while (
      certificates.some(
        (cert) =>
          formatCertificateNumber(cert.number) ===
          formatCertificateNumber(number)
      ) &&
      attempts < maxAttempts
    );

    if (attempts >= maxAttempts) {
      throw new Error("Не удалось сгенерировать уникальный номер сертификата");
    }

    // Гарантируем, что номер всегда 6 цифр
    return formatCertificateNumber(number);
  };

  // Проверка, что номер состоит из 6 цифр
  const isValidCertificateNumber = (number: string): boolean => {
    // Проверяем, что строка содержит ровно 6 цифр
    return /^\d{6}$/.test(number);
  };

  // Форматирование номера для отображения (всегда 6 цифр)
  const formatCertificateNumber = (number: string): string => {
    // Убеждаемся, что номер всегда 6 цифр
    const cleanNumber = number.replace(/\D/g, ""); // Убираем все не-цифры
    return cleanNumber.padStart(6, "0");
  };

  const createCertificate = () => {
    try {
      const newCertificate: Certificate = {
        id: Date.now().toString(),
        number: generateCertificateNumber(),
        amount: parseFloat(amount),
        status: "active",
        buyerName,
        buyerPhone,
        buyerEmail,
        recipientName: sendType === "other" ? recipientName : undefined,
        recipientPhone: sendType === "other" ? recipientPhone : undefined,
        recipientEmail: sendType === "other" ? recipientEmail : buyerEmail,
        message: sendType === "other" ? message : undefined,
        createdAt: new Date(),
        usedAmount: 0,
      };

      setPendingCertificate(newCertificate);
      setShowPreview(true);
    } catch (error) {
      console.error("Ошибка при создании сертификата:", error);
      alert("Произошла ошибка при создании сертификата. Попробуйте еще раз.");
    }
  };

  const confirmCertificate = async () => {
    if (pendingCertificate) {
      setCertificates([...certificates, pendingCertificate]);
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
        number: certificate.number,
        amount: certificate.amount,
        recipientName: certificate.recipientName,
        message: certificate.message,
      });

      // Отправляем на почту
      const emailSent = await sendCertificateByEmail(
        certificateImage,
        certificate.recipientEmail || certificate.buyerEmail,
        {
          number: certificate.number,
          amount: certificate.amount,
          recipientName: certificate.recipientName,
          message: certificate.message,
        }
      );

      if (emailSent) {
        alert(
          `Сертификат №${formatCertificateNumber(
            certificate.number
          )} на сумму ${certificate.amount}₽ создан и отправлен на ${
            certificate.recipientEmail || certificate.buyerEmail
          }`
        );

        // Предлагаем скачать сертификат
        if (confirm("Хотите скачать сертификат?")) {
          downloadCertificate(
            certificateImage,
            `certificate-${formatCertificateNumber(certificate.number)}.png`
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

  const searchCertificate = () => {
    if (!isValidCertificateNumber(searchNumber)) {
      alert("Номер сертификата должен состоять из 6 цифр");
      return;
    }

    // Ищем сертификат, сравнивая отформатированные номера
    const formattedSearchNumber = formatCertificateNumber(searchNumber);
    const found = certificates.find(
      (cert) => formatCertificateNumber(cert.number) === formattedSearchNumber
    );
    setSearchResult(found || null);
  };

  const useCertificate = (certificateId: string, useAmount: number) => {
    setCertificates((certs) =>
      certs.map((cert) => {
        if (cert.id === certificateId) {
          const newUsedAmount = cert.usedAmount + useAmount;
          return {
            ...cert,
            usedAmount: newUsedAmount,
            status: newUsedAmount >= cert.amount ? "used" : "active",
          };
        }
        return cert;
      })
    );
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

  return (
    <div className="certificate-manager">
      <div className="certificate-tabs">
        <button
          className={`tab-button ${activeTab === "buy" ? "active" : ""}`}
          onClick={() => setActiveTab("buy")}
        >
          Покупка сертификата
        </button>
        <button
          className={`tab-button ${activeTab === "verify" ? "active" : ""}`}
          onClick={() => setActiveTab("verify")}
        >
          Проверка сертификата
        </button>
      </div>

      {activeTab === "buy" && (
        <div className="certificate-buy">
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
              createCertificate();
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
              type="submit"
              className="pay-button"
              disabled={!isFormValid()}
            >
              Оплатить
            </button>
          </form>
        </div>
      )}

      {activeTab === "verify" && (
        <div className="certificate-verify">
          <div className="search-section">
            <h3>Проверка сертификата</h3>
            <div className="search-form">
              <input
                type="text"
                placeholder="Введите номер сертификата (6 цифр)"
                value={searchNumber}
                onChange={(e) => {
                  // Разрешаем только цифры
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
                disabled={searchNumber.length !== 6}
              >
                Проверить
              </button>
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
                  {formatCertificateNumber(searchResult.number)}
                </p>
                <p>
                  <strong>Статус:</strong>
                  <span className={`status ${searchResult.status}`}>
                    {searchResult.status === "active"
                      ? "Активен"
                      : "Использован"}
                  </span>
                </p>
                <p>
                  <strong>Сумма:</strong> {searchResult.amount}₽
                </p>
                <p>
                  <strong>Использовано:</strong> {searchResult.usedAmount}₽
                </p>
                <p>
                  <strong>Остаток:</strong>{" "}
                  {searchResult.amount - searchResult.usedAmount}₽
                </p>
                <p>
                  <strong>Покупатель:</strong> {searchResult.buyerName}
                </p>
                <p>
                  <strong>Дата создания:</strong>{" "}
                  {searchResult.createdAt.toLocaleDateString()}
                </p>
              </div>

              {searchResult.status === "active" && (
                <div className="use-certificate">
                  <h5>Использовать сертификат</h5>
                  <input
                    type="number"
                    placeholder="Сумма к списанию"
                    min="1"
                    max={searchResult.amount - searchResult.usedAmount}
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
                        useAmount <=
                          searchResult.amount - searchResult.usedAmount
                      ) {
                        useCertificate(searchResult.id, useAmount);
                        setSearchResult(null);
                        setSearchNumber("");
                      }
                    }}
                  >
                    Списать сумму
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="certificates-list">
            <h3>Все сертификаты</h3>
            <div className="certificates-grid">
              {certificates.map((cert) => (
                <div key={cert.id} className="certificate-card">
                  <div className="certificate-header">
                    <span className="certificate-number">
                      №{formatCertificateNumber(cert.number)}
                    </span>
                    <span className={`status ${cert.status}`}>
                      {cert.status === "active" ? "Активен" : "Использован"}
                    </span>
                  </div>
                  <div className="certificate-details">
                    <p>
                      <strong>Сумма:</strong> {cert.amount}₽
                    </p>
                    <p>
                      <strong>Использовано:</strong> {cert.usedAmount}₽
                    </p>
                    <p>
                      <strong>Остаток:</strong> {cert.amount - cert.usedAmount}₽
                    </p>
                    <p>
                      <strong>Покупатель:</strong> {cert.buyerName}
                    </p>
                    <p>
                      <strong>Дата:</strong>{" "}
                      {cert.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showPreview && pendingCertificate && (
        <CertificatePreview
          number={pendingCertificate.number}
          amount={pendingCertificate.amount}
          recipientName={pendingCertificate.recipientName}
          message={pendingCertificate.message}
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
