import nodemailer from "nodemailer";
import Database from "../utils/database.js";

class EmailService {
  constructor() {
    this.db = new Database();

    // Initialize email transporter if credentials are available
    if (
      process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS
    ) {
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      console.warn(
        "SMTP credentials not configured. Emails will be logged only."
      );
      this.transporter = null;
    }
  }

  async sendEmail(to, subject, message, html = null) {
    try {
      // Create email notification record
      const emailId = await this.db.createEmailNotification({
        email: to,
        subject: subject,
        message: message,
      });

      if (!this.transporter) {
        // Log email for development/testing
        console.log(`[EMAIL] To: ${to}`);
        console.log(`[EMAIL] Subject: ${subject}`);
        console.log(`[EMAIL] Message: ${message}`);

        // Update status to sent (simulated)
        await this.db.updateEmailStatus(emailId.id, "sent");
        return {
          success: true,
          messageId: "simulated",
          message: "Email logged (SMTP not configured)",
        };
      }

      // Send actual email
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: to,
        subject: subject,
        text: message,
        html: html || message,
      };

      const result = await this.transporter.sendMail(mailOptions);

      // Update status
      await this.db.updateEmailStatus(emailId.id, "sent");

      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error("Email sending error:", error);

      // Update status to failed
      if (emailId) {
        await this.db.updateEmailStatus(emailId.id, "failed");
      }

      return { success: false, error: error.message };
    }
  }

  async sendCertificateCreated(certificate) {
    if (!certificate.client_email) return;

    const subject = `Сертификат №${certificate.id} создан`;
    const message = `
Здравствуйте!

Ваш сертификат успешно создан.

Данные сертификата:
- Номер: ${certificate.id}
- Баланс: ₽${certificate.balance.toLocaleString()}
- Статус: ${certificate.status === "paid" ? "Активен" : "Ожидает активации"}

Для активации сертификата обратитесь в клинику или воспользуйтесь онлайн-оплатой.

С уважением,
Команда клиники
    `;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Сертификат создан</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2c5aa0;">Сертификат №${certificate.id} создан</h2>
        
        <p>Здравствуйте!</p>
        
        <p>Ваш сертификат успешно создан.</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3>Данные сертификата:</h3>
            <ul>
                <li><strong>Номер:</strong> ${certificate.id}</li>
                <li><strong>Баланс:</strong> ₽${certificate.balance.toLocaleString()}</li>
                <li><strong>Статус:</strong> ${
                  certificate.status === "paid"
                    ? "Активен"
                    : "Ожидает активации"
                }</li>
            </ul>
        </div>
        
        <p>Для активации сертификата обратитесь в клинику или воспользуйтесь онлайн-оплатой.</p>
        
        <p>С уважением,<br>Команда клиники</p>
    </div>
</body>
</html>
    `;

    return this.sendEmail(certificate.client_email, subject, message, html);
  }

  async sendCertificateActivated(certificate) {
    if (!certificate.client_email) return;

    const subject = `Сертификат №${certificate.id} активирован`;
    const message = `
Здравствуйте!

Ваш сертификат успешно активирован и готов к использованию.

Данные сертификата:
- Номер: ${certificate.id}
- Баланс: ₽${certificate.balance.toLocaleString()}
- Статус: Активен

Теперь вы можете использовать сертификат для оплаты медицинских услуг в нашей клинике.

С уважением,
Команда клиники
    `;

    return this.sendEmail(certificate.client_email, subject, message);
  }

  async sendBalanceUpdated(certificate, operation, amount) {
    if (!certificate.client_email) return;

    const operationText = operation === "add" ? "пополнен" : "списан";
    const sign = operation === "add" ? "+" : "-";

    const subject = `Баланс сертификата №${certificate.id} обновлен`;
    const message = `
Здравствуйте!

Баланс вашего сертификата был обновлен.

Операция: ${operationText}
Сумма: ${sign}₽${amount.toLocaleString()}
Новый баланс: ₽${certificate.balance.toLocaleString()}

С уважением,
Команда клиники
    `;

    return this.sendEmail(certificate.client_email, subject, message);
  }

  async sendPaymentReceived(certificate, amount) {
    if (!certificate.client_email) return;

    const subject = `Платеж получен - Сертификат №${certificate.id}`;
    const message = `
Здравствуйте!

Мы получили ваш платеж на пополнение сертификата.

Сумма платежа: ₽${amount.toLocaleString()}
Новый баланс сертификата: ₽${certificate.balance.toLocaleString()}

Спасибо за доверие!

С уважением,
Команда клиники
    `;

    return this.sendEmail(certificate.client_email, subject, message);
  }

  async sendLowBalanceWarning(certificate) {
    if (!certificate.client_email) return;

    const subject = `Низкий баланс сертификата №${certificate.id}`;
    const message = `
Здравствуйте!

Обращаем ваше внимание, что на сертификате осталось мало средств.

Текущий баланс: ₽${certificate.balance.toLocaleString()}

Рекомендуем пополнить баланс для продолжения использования услуг клиники.

С уважением,
Команда клиники
    `;

    return this.sendEmail(certificate.client_email, subject, message);
  }
}

export default EmailService;
