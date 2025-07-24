import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import apiService from "../services/api";
import "../styles/PaymentStatus.css";

interface PaymentStatusProps {
  paymentId: string;
  onStatusChange?: (status: string) => void;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({
  paymentId,
  onStatusChange,
}) => {
  const [status, setStatus] = useState<string>("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setLoading(true);
        const response = await apiService.checkPaymentStatus(paymentId);

        if (response.success) {
          const newStatus = (response as any).status || "pending";
          setStatus(newStatus);
          onStatusChange?.(newStatus);
        } else {
          setError("Ошибка при проверке статуса");
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
        setError("Ошибка при проверке статуса");
      } finally {
        setLoading(false);
      }
    };

    checkStatus();

    // Poll for status updates every 5 seconds
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, [paymentId, onStatusChange]);

  const getStatusIcon = () => {
    switch (status) {
      case "success":
        return <CheckCircle className="status-icon success" />;
      case "failed":
        return <XCircle className="status-icon failed" />;
      case "pending":
        return <Clock className="status-icon pending" />;
      default:
        return <AlertCircle className="status-icon unknown" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "success":
        return "Платеж успешно обработан";
      case "failed":
        return "Платеж не прошел";
      case "pending":
        return "Ожидание обработки платежа";
      default:
        return "Неизвестный статус";
    }
  };

  if (loading) {
    return (
      <div className="payment-status">
        <div className="status-loading">
          <div className="loading-spinner"></div>
          <span>Проверка статуса...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="payment-status">
        <div className="status-error">
          <AlertCircle className="status-icon error" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-status">
      <div className="status-content">
        {getStatusIcon()}
        <span className="status-text">{getStatusText()}</span>
      </div>
    </div>
  );
};
