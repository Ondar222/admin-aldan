import axios from "axios";
import crypto from "crypto";
import Database from "../utils/database.js";
import SmsService from "./smsService.js";
import EmailService from "./emailService.js";

class PaymentService {
  constructor() {
    this.db = new Database();
    this.smsService = new SmsService();
    this.emailService = new EmailService();

    this.token = process.env.ALFA_BANK_TOKEN;
    this.shopId = process.env.ALFA_BANK_SHOP_ID;
    this.gatewayUrl =
      process.env.ALFA_BANK_GATEWAY_URL ||
      "https://pay.alfabank.ru/payment/rest";
  }

  // Create payment order
  async createOrder(paymentData) {
    try {
      const {
        certificate_id,
        order_number,
        amount,
        payment_type,
        client_name,
        client_email,
        description,
      } = paymentData;

      // Create payment record in database
      const paymentId = crypto.randomUUID();
      await this.db.createPayment({
        id: paymentId,
        certificate_id,
        order_number,
        amount: parseInt(amount),
        payment_type,
        client_name,
        client_email,
        description,
      });

      if (!this.token || !this.shopId) {
        // Simulate payment for development
        console.log(
          "Alfa Bank credentials not configured. Simulating payment..."
        );
        return this.simulatePayment(paymentId, paymentData);
      }

      // Create order in Alfa Bank
      const orderData = {
        token: this.token,
        shopId: this.shopId,
        orderNumber: order_number,
        amount: parseInt(amount) * 100, // Convert to kopecks
        returnUrl: `${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }/payment-success`,
        failUrl: `${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }/payment-fail`,
        description: description || `Оплата сертификата №${certificate_id}`,
        clientId: certificate_id,
        jsonParams: JSON.stringify({
          certificate_id,
          payment_type,
          client_name,
          client_email,
        }),
      };

      const response = await axios.post(
        `${this.gatewayUrl}/register.do`,
        orderData
      );

      if (response.data.errorCode === "0") {
        // Update payment with Alfa Bank order ID
        await this.db.updatePaymentStatus(
          paymentId,
          "pending",
          response.data.orderId
        );

        return {
          success: true,
          paymentId: paymentId,
          orderId: response.data.orderId,
          formUrl: response.data.formUrl,
          orderNumber: order_number,
        };
      } else {
        throw new Error(`Alfa Bank error: ${response.data.errorMessage}`);
      }
    } catch (error) {
      console.error("Payment creation error:", error);
      throw error;
    }
  }

  // Simulate payment for development/testing
  async simulatePayment(paymentId, paymentData) {
    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Update payment status to success
        await this.db.updatePaymentStatus(paymentId, "success", "simulated");

        // Process payment success
        await this.processPaymentSuccess(paymentId, paymentData);
      } catch (error) {
        console.error("Simulated payment error:", error);
      }
    }, 2000);

    return {
      success: true,
      paymentId: paymentId,
      orderId: "simulated",
      formUrl: `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/payment-success?orderId=simulated&paymentId=${paymentId}`,
      orderNumber: paymentData.order_number,
      message: "Payment simulated (Alfa Bank not configured)",
    };
  }

  // Process payment success
  async processPaymentSuccess(paymentId, paymentData) {
    try {
      const payment = await this.db.getPayment(paymentId);
      if (!payment) {
        throw new Error("Payment not found");
      }

      const certificate = await this.db.getCertificate(payment.certificate_id);
      if (!certificate) {
        throw new Error("Certificate not found");
      }

      // Update certificate based on payment type
      if (payment.payment_type === "activate") {
        // Activate certificate
        await this.db.updateCertificateStatus(certificate.id, "paid");

        // Send notifications
        await this.smsService.sendCertificateActivated(certificate);
        await this.emailService.sendCertificateActivated(certificate);
      } else if (payment.payment_type === "topup") {
        // Top up certificate balance
        const newBalance = certificate.balance + payment.amount;
        await this.db.updateCertificateBalance(certificate.id, newBalance);

        // Create transaction record
        await this.db.createTransaction({
          id: crypto.randomUUID(),
          certificate_id: certificate.id,
          type: "add",
          amount: payment.amount,
          description: `Пополнение через Альфа-Банк (${payment.order_number})`,
          payment_id: paymentId,
        });

        // Send notifications
        await this.smsService.sendPaymentReceived(certificate, payment.amount);
        await this.emailService.sendPaymentReceived(
          certificate,
          payment.amount
        );
      }

      console.log(`Payment ${paymentId} processed successfully`);
      return { success: true };
    } catch (error) {
      console.error("Payment processing error:", error);
      throw error;
    }
  }

  // Check payment status
  async checkPaymentStatus(orderId) {
    try {
      if (!this.token || !this.shopId) {
        // For development, return simulated status
        return { status: "success", message: "Payment simulated" };
      }

      const response = await axios.post(
        `${this.gatewayUrl}/getOrderStatus.do`,
        {
          token: this.token,
          orderId: orderId,
        }
      );

      if (response.data.errorCode === "0") {
        return {
          status: response.data.orderStatus,
          message: response.data.errorMessage || "OK",
        };
      } else {
        throw new Error(`Alfa Bank error: ${response.data.errorMessage}`);
      }
    } catch (error) {
      console.error("Payment status check error:", error);
      throw error;
    }
  }

  // Get payment by ID
  async getPayment(paymentId) {
    return this.db.getPayment(paymentId);
  }

  // Get payments by certificate ID
  async getPaymentsByCertificate(certificateId) {
    return this.db.all(
      "SELECT * FROM payments WHERE certificate_id = ? ORDER BY created_at DESC",
      [certificateId]
    );
  }

  // Cancel payment
  async cancelPayment(paymentId) {
    try {
      const payment = await this.db.getPayment(paymentId);
      if (!payment) {
        throw new Error("Payment not found");
      }

      if (payment.status === "pending") {
        await this.db.updatePaymentStatus(paymentId, "cancelled");
        return { success: true, message: "Payment cancelled" };
      } else {
        throw new Error("Payment cannot be cancelled");
      }
    } catch (error) {
      console.error("Payment cancellation error:", error);
      throw error;
    }
  }
}

export default PaymentService;
