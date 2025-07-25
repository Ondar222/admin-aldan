import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      amount,
      recipientName,
      recipientEmail,
      recipientPhone,
      message,
      orderNumber,
    } = req.body;

    // Валидация данных
    if (!amount || !recipientName || !recipientEmail || !recipientPhone) {
      return res.status(400).json({
        success: false,
        error: "Все обязательные поля должны быть заполнены",
      });
    }

    if (amount < 1000 || amount > 50000) {
      return res.status(400).json({
        success: false,
        error: "Сумма должна быть от 1,000 до 50,000 рублей",
      });
    }

    // Генерируем уникальный номер сертификата (7 цифр)
    const certificateId = Math.floor(
      1000000 + Math.random() * 9000000
    ).toString();

    // Создаем сертификат
    const certificate = {
      id: certificateId,
      balance: amount,
      status: "unpaid", // Пока не оплачен
      clientName: recipientName,
      clientEmail: recipientEmail,
      clientPhone: recipientPhone,
      message: message || "",
      orderNumber: orderNumber || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Сохраняем сертификат в базе данных (здесь должна быть реальная логика)
    console.log("Создан сертификат:", certificate);

    // Отправляем email с сертификатом
    await sendCertificateEmail(certificate);

    return res.status(200).json({
      success: true,
      certificate,
      message: "Сертификат успешно создан и отправлен",
    });
  } catch (error) {
    console.error("Create certificate error:", error);
    return res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
}

// Отправка email с сертификатом
async function sendCertificateEmail(certificate) {
  // Здесь должна быть реальная отправка email
  // Например, через Nodemailer, SendGrid и т.д.

  console.log(`Отправка сертификата на email: ${certificate.clientEmail}`);
  console.log(`Номер сертификата: ${certificate.id}`);
  console.log(`Сумма: ${certificate.balance} руб.`);
  console.log(`Поздравление: ${certificate.message || "Не указано"}`);

  // Симулируем отправку email
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log("Email отправлен успешно");
}
