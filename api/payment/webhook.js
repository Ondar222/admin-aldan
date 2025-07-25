import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { orderNumber, amount, status, paymentId, signature } = req.body;

    console.log("Alfa-Bank webhook received:", {
      orderNumber,
      amount,
      status,
      paymentId,
    });

    // Проверяем подпись от Альфа-Банка
    if (!verifyAlfaBankSignature(req.body, signature)) {
      console.error("Invalid Alfa-Bank signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    if (status === "SUCCESS" || status === "COMPLETED") {
      // Платеж успешен - активируем сертификат
      await activateCertificate(orderNumber, amount);

      console.log(
        `Certificate for order ${orderNumber} activated successfully`
      );

      return res.status(200).json({
        success: true,
        message: "Certificate activated",
      });
    } else if (status === "FAILED" || status === "CANCELLED") {
      // Платеж не прошел - деактивируем сертификат
      await deactivateCertificate(orderNumber);

      console.log(
        `Certificate for order ${orderNumber} deactivated due to payment failure`
      );

      return res.status(200).json({
        success: true,
        message: "Certificate deactivated",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Webhook processed",
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}

// Проверка подписи от Альфа-Банка
function verifyAlfaBankSignature(data, signature) {
  // Получаем секретный ключ из переменных окружения
  const secretKey = process.env.ALFA_BANK_SECRET || "your-secret-key";

  // Создаем подпись для проверки
  const expectedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(JSON.stringify(data))
    .digest("hex");

  console.log("Verifying Alfa-Bank signature...");
  console.log("Expected:", expectedSignature);
  console.log("Received:", signature);

  // Сравниваем подписи
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, "hex"),
    Buffer.from(signature || "", "hex")
  );
}

// Активация сертификата
async function activateCertificate(orderNumber, amount) {
  // Здесь должна быть логика активации сертификата в базе данных
  console.log(
    `Activating certificate for order ${orderNumber} with amount ${amount}`
  );

  // Симулируем обновление в базе данных
  await new Promise((resolve) => setTimeout(resolve, 100));

  console.log(`Certificate for order ${orderNumber} activated`);
}

// Деактивация сертификата
async function deactivateCertificate(orderNumber) {
  // Здесь должна быть логика деактивации сертификата в базе данных
  console.log(`Deactivating certificate for order ${orderNumber}`);

  // Симулируем обновление в базе данных
  await new Promise((resolve) => setTimeout(resolve, 100));

  console.log(`Certificate for order ${orderNumber} deactivated`);
}
