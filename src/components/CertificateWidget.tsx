import React, { useState, useEffect } from "react";
import {
  Heart,
  Mail,
  User,
  Phone,
  CreditCard,
  CheckCircle,
} from "lucide-react";
import "../styles/CertificateWidget.css";

interface CertificateWidgetProps {
  // Конфигурация виджета
  config?: {
    title?: string;
    subtitle?: string;
    logo?: string;
    primaryColor?: string;
    backgroundColor?: string;
  };
  // Callback функции
  onSuccess?: (certificateData: any) => void;
  onError?: (error: string) => void;
  // API настройки
  apiUrl?: string;
  token?: string;
}

interface CertificateFormData {
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  amount: string;
  message: string;
  sendType: "self" | "other";
}

export const CertificateWidget: React.FC<CertificateWidgetProps> = ({
  config = {},
  onSuccess,
  onError,
  apiUrl = "http://localhost:3001/api",
  token,
}) => {
  const [formData, setFormData] = useState<CertificateFormData>({
    buyerName: "",
    buyerPhone: "",
    buyerEmail: "",
    recipientName: "",
    recipientPhone: "",
    recipientEmail: "",
    amount: "",
    message: "",
    sendType: "self",
  });

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"form" | "success">("form");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const defaultConfig = {
    title: "Подарочный сертификат",
    subtitle: "Клиника Алдан",
    logo: "❤️",
    primaryColor: "#2563eb",
    backgroundColor: "#ffffff",
  };

  const finalConfig = { ...defaultConfig, ...config };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.buyerName.trim()) {
      newErrors.buyerName = "Введите имя покупателя";
    }

    if (!formData.buyerPhone.trim()) {
      newErrors.buyerPhone = "Введите номер телефона";
    }

    if (!formData.buyerEmail.trim()) {
      newErrors.buyerEmail = "Введите email";
    } else if (!/\S+@\S+\.\S+/.test(formData.buyerEmail)) {
      newErrors.buyerEmail = "Введите корректный email";
    }

    if (formData.sendType === "other") {
      if (!formData.recipientName.trim()) {
        newErrors.recipientName = "Введите имя получателя";
      }
      if (!formData.recipientPhone.trim()) {
        newErrors.recipientPhone = "Введите телефон получателя";
      }
      if (!formData.recipientEmail.trim()) {
        newErrors.recipientEmail = "Введите email получателя";
      } else if (!/\S+@\S+\.\S+/.test(formData.recipientEmail)) {
        newErrors.recipientEmail = "Введите корректный email получателя";
      }
    }

    if (!formData.amount.trim()) {
      newErrors.amount = "Введите сумму сертификата";
    } else if (parseInt(formData.amount) < 100) {
      newErrors.amount = "Минимальная сумма 100₽";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generateCertificateNumber = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Создаем сертификат через API
      const certificateData = {
        balance: parseInt(formData.amount),
        client_name: formData.buyerName,
        client_email: formData.buyerEmail,
        client_phone: formData.buyerPhone,
      };

      const response = await fetch(`${apiUrl}/certificates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(certificateData),
      });

      const result = await response.json();

      if (result.success) {
        const certificate = {
          ...result.certificate,
          recipientName:
            formData.sendType === "other"
              ? formData.recipientName
              : formData.buyerName,
          recipientEmail:
            formData.sendType === "other"
              ? formData.recipientEmail
              : formData.buyerEmail,
          message: formData.message,
        };

        setStep("success");

        // Вызываем callback успеха
        if (onSuccess) {
          onSuccess(certificate);
        }
      } else {
        throw new Error(result.error || "Ошибка создания сертификата");
      }
    } catch (error) {
      console.error("Error creating certificate:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Произошла ошибка";

      if (onError) {
        onError(errorMessage);
      } else {
        alert(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof CertificateFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const resetForm = () => {
    setFormData({
      buyerName: "",
      buyerPhone: "",
      buyerEmail: "",
      recipientName: "",
      recipientPhone: "",
      recipientEmail: "",
      amount: "",
      message: "",
      sendType: "self",
    });
    setErrors({});
    setStep("form");
  };

  if (step === "success") {
    return (
      <div
        className="certificate-widget"
        style={{ backgroundColor: finalConfig.backgroundColor }}
      >
        <div className="widget-success">
          <CheckCircle className="success-icon" />
          <h3>Сертификат создан!</h3>
          <p>Сертификат успешно создан и отправлен на email.</p>
          <button
            onClick={resetForm}
            className="widget-button primary"
            style={{ backgroundColor: finalConfig.primaryColor }}
          >
            Создать еще один
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="certificate-widget"
      style={{ backgroundColor: finalConfig.backgroundColor }}
    >
      <div className="widget-header">
        <div className="widget-logo">
          {finalConfig.logo === "❤️" ? (
            <Heart
              className="logo-icon"
              style={{ color: finalConfig.primaryColor }}
            />
          ) : (
            <span className="logo-text">{finalConfig.logo}</span>
          )}
        </div>
        <div className="widget-title">
          <h3>{finalConfig.title}</h3>
          <p>{finalConfig.subtitle}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="widget-form">
        <div className="form-section">
          <h4>Данные покупателя</h4>

          <div className="form-group">
            <label>
              <User className="input-icon" />
              Имя покупателя *
            </label>
            <input
              type="text"
              value={formData.buyerName}
              onChange={(e) => handleInputChange("buyerName", e.target.value)}
              placeholder="Введите ваше имя"
              className={errors.buyerName ? "error" : ""}
            />
            {errors.buyerName && (
              <span className="error-text">{errors.buyerName}</span>
            )}
          </div>

          <div className="form-group">
            <label>
              <Phone className="input-icon" />
              Телефон *
            </label>
            <input
              type="tel"
              value={formData.buyerPhone}
              onChange={(e) => handleInputChange("buyerPhone", e.target.value)}
              placeholder="+7 (999) 123-45-67"
              className={errors.buyerPhone ? "error" : ""}
            />
            {errors.buyerPhone && (
              <span className="error-text">{errors.buyerPhone}</span>
            )}
          </div>

          <div className="form-group">
            <label>
              <Mail className="input-icon" />
              Email *
            </label>
            <input
              type="email"
              value={formData.buyerEmail}
              onChange={(e) => handleInputChange("buyerEmail", e.target.value)}
              placeholder="your@email.com"
              className={errors.buyerEmail ? "error" : ""}
            />
            {errors.buyerEmail && (
              <span className="error-text">{errors.buyerEmail}</span>
            )}
          </div>
        </div>

        <div className="form-section">
          <div className="send-type-selector">
            <button
              type="button"
              className={`type-button ${
                formData.sendType === "self" ? "active" : ""
              }`}
              onClick={() => handleInputChange("sendType", "self")}
              style={{
                borderColor: finalConfig.primaryColor,
                ...(formData.sendType === "self" && {
                  backgroundColor: finalConfig.primaryColor,
                  color: "#fff",
                }),
              }}
            >
              Отправить себе
            </button>
            <button
              type="button"
              className={`type-button ${
                formData.sendType === "other" ? "active" : ""
              }`}
              onClick={() => handleInputChange("sendType", "other")}
              style={{
                borderColor: finalConfig.primaryColor,
                ...(formData.sendType === "other" && {
                  backgroundColor: finalConfig.primaryColor,
                  color: "#fff",
                }),
              }}
            >
              Отправить другому
            </button>
          </div>

          {formData.sendType === "other" && (
            <>
              <div className="form-group">
                <label>
                  <User className="input-icon" />
                  Имя получателя *
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) =>
                    handleInputChange("recipientName", e.target.value)
                  }
                  placeholder="Имя получателя"
                  className={errors.recipientName ? "error" : ""}
                />
                {errors.recipientName && (
                  <span className="error-text">{errors.recipientName}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  <Phone className="input-icon" />
                  Телефон получателя *
                </label>
                <input
                  type="tel"
                  value={formData.recipientPhone}
                  onChange={(e) =>
                    handleInputChange("recipientPhone", e.target.value)
                  }
                  placeholder="+7 (999) 123-45-67"
                  className={errors.recipientPhone ? "error" : ""}
                />
                {errors.recipientPhone && (
                  <span className="error-text">{errors.recipientPhone}</span>
                )}
              </div>

              <div className="form-group">
                <label>
                  <Mail className="input-icon" />
                  Email получателя *
                </label>
                <input
                  type="email"
                  value={formData.recipientEmail}
                  onChange={(e) =>
                    handleInputChange("recipientEmail", e.target.value)
                  }
                  placeholder="recipient@email.com"
                  className={errors.recipientEmail ? "error" : ""}
                />
                {errors.recipientEmail && (
                  <span className="error-text">{errors.recipientEmail}</span>
                )}
              </div>

              <div className="form-group">
                <label>Сообщение получателю</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  placeholder="Поздравление или пожелание..."
                  rows={3}
                />
              </div>
            </>
          )}
        </div>

        <div className="form-section">
          <h4>Сумма сертификата</h4>

          <div className="form-group">
            <label>
              <CreditCard className="input-icon" />
              Сумма (₽) *
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
              placeholder="1000"
              min="100"
              step="100"
              className={errors.amount ? "error" : ""}
            />
            {errors.amount && (
              <span className="error-text">{errors.amount}</span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="widget-button primary"
          style={{ backgroundColor: finalConfig.primaryColor }}
        >
          {loading ? "Создание..." : "Создать сертификат"}
        </button>
      </form>
    </div>
  );
};
