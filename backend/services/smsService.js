import twilio from "twilio";
import Database from "../utils/database.js";

class SmsService {
  constructor() {
    this.db = new Database();

    // Initialize Twilio client if credentials are available
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
    } else {
      console.warn(
        "Twilio credentials not configured. SMS will be logged only."
      );
      this.client = null;
    }
  }

  async sendSms(phoneNumber, message) {
    try {
      // Create SMS notification record
      const smsId = await this.db.createSmsNotification({
        phone_number: phoneNumber,
        message: message,
      });

      if (!this.client) {
        // Log SMS for development/testing
        console.log(`[SMS] To: ${phoneNumber}`);
        console.log(`[SMS] Message: ${message}`);

        // Update status to sent (simulated)
        await this.db.updateSmsStatus(smsId.id, "sent", "simulated");
        return {
          success: true,
          sid: "simulated",
          message: "SMS logged (Twilio not configured)",
        };
      }

      // Send actual SMS via Twilio
      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: phoneNumber,
      });

      // Update status
      await this.db.updateSmsStatus(smsId.id, "sent", result.sid);

      return { success: true, sid: result.sid };
    } catch (error) {
      console.error("SMS sending error:", error);

      // Update status to failed
      if (smsId) {
        await this.db.updateSmsStatus(smsId.id, "failed");
      }

      return { success: false, error: error.message };
    }
  }

  async sendCertificateCreated(certificate) {
    if (!certificate.client_phone) return;

    const message = `Ваш сертификат №${
      certificate.id
    } создан! Баланс: ₽${certificate.balance.toLocaleString()}. Для активации перейдите в клинику.`;

    return this.sendSms(certificate.client_phone, message);
  }

  async sendCertificateActivated(certificate) {
    if (!certificate.client_phone) return;

    const message = `Сертификат №${
      certificate.id
    } активирован! Баланс: ₽${certificate.balance.toLocaleString()}. Можете использовать для оплаты услуг.`;

    return this.sendSms(certificate.client_phone, message);
  }

  async sendBalanceUpdated(certificate, operation, amount) {
    if (!certificate.client_phone) return;

    const operationText = operation === "add" ? "пополнен" : "списан";
    const sign = operation === "add" ? "+" : "-";

    const message = `Сертификат №${
      certificate.id
    } ${operationText} на ${sign}₽${amount.toLocaleString()}. Новый баланс: ₽${certificate.balance.toLocaleString()}.`;

    return this.sendSms(certificate.client_phone, message);
  }

  async sendPaymentReceived(certificate, amount) {
    if (!certificate.client_phone) return;

    const message = `Платеж на сумму ₽${amount.toLocaleString()} получен! Сертификат №${
      certificate.id
    } пополнен. Новый баланс: ₽${certificate.balance.toLocaleString()}.`;

    return this.sendSms(certificate.client_phone, message);
  }

  async sendLowBalanceWarning(certificate) {
    if (!certificate.client_phone) return;

    const message = `Внимание! На сертификате №${
      certificate.id
    } осталось ₽${certificate.balance.toLocaleString()}. Рекомендуем пополнить баланс.`;

    return this.sendSms(certificate.client_phone, message);
  }
}

export default SmsService;
