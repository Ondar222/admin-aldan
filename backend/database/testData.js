import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, "certificates.db");

const db = new sqlite3.Database(dbPath);

// Test certificates data
const testCertificates = [
  {
    id: "123456",
    balance: 5000,
    status: "paid",
    client_name: "Иванов Иван Иванович",
    client_email: "ivanov@example.com",
    client_phone: "+79001234567",
  },
  {
    id: "234567",
    balance: 8000,
    status: "unpaid",
    client_name: "Петрова Анна Сергеевна",
    client_email: "petrova@example.com",
    client_phone: "+79001234568",
  },
  {
    id: "345678",
    balance: 12000,
    status: "paid",
    client_name: "Сидоров Владимир Петрович",
    client_email: "sidorov@example.com",
    client_phone: "+79001234569",
  },
  {
    id: "456789",
    balance: 3000,
    status: "paid",
    client_name: "Козлова Мария Александровна",
    client_email: "kozlova@example.com",
    client_phone: "+79001234570",
  },
  {
    id: "567890",
    balance: 15000,
    status: "unpaid",
    client_name: "Морозов Дмитрий Николаевич",
    client_email: "morozov@example.com",
    client_phone: "+79001234571",
  },
];

// Test transactions data
const testTransactions = [
  // Certificate 123456
  {
    id: crypto.randomUUID(),
    certificate_id: "123456",
    type: "create",
    amount: 5000,
    description: "Создание сертификата",
  },
  {
    id: crypto.randomUUID(),
    certificate_id: "123456",
    type: "subtract",
    amount: 1500,
    description: "Консультация терапевта",
  },
  {
    id: crypto.randomUUID(),
    certificate_id: "123456",
    type: "add",
    amount: 2000,
    description: "Пополнение баланса",
  },
  {
    id: crypto.randomUUID(),
    certificate_id: "123456",
    type: "subtract",
    amount: 800,
    description: "Анализы крови",
  },

  // Certificate 234567
  {
    id: crypto.randomUUID(),
    certificate_id: "234567",
    type: "create",
    amount: 8000,
    description: "Создание сертификата",
  },

  // Certificate 345678
  {
    id: crypto.randomUUID(),
    certificate_id: "345678",
    type: "create",
    amount: 12000,
    description: "Создание сертификата",
  },
  {
    id: crypto.randomUUID(),
    certificate_id: "345678",
    type: "subtract",
    amount: 3000,
    description: "УЗИ брюшной полости",
  },
  {
    id: crypto.randomUUID(),
    certificate_id: "345678",
    type: "subtract",
    amount: 2500,
    description: "Консультация кардиолога",
  },

  // Certificate 456789
  {
    id: crypto.randomUUID(),
    certificate_id: "456789",
    type: "create",
    amount: 3000,
    description: "Создание сертификата",
  },
  {
    id: crypto.randomUUID(),
    certificate_id: "456789",
    type: "subtract",
    amount: 1200,
    description: "Стоматологический осмотр",
  },

  // Certificate 567890
  {
    id: crypto.randomUUID(),
    certificate_id: "567890",
    type: "create",
    amount: 15000,
    description: "Создание сертификата",
  },
];

// Test payments data
const testPayments = [
  {
    id: crypto.randomUUID(),
    certificate_id: "123456",
    order_number: "PAY-123456-001",
    amount: 5000,
    status: "success",
    payment_type: "activate",
    alfa_bank_order_id: "ALFA-001",
    client_name: "Иванов Иван Иванович",
    client_email: "ivanov@example.com",
    description: "Активация сертификата №123456",
  },
  {
    id: crypto.randomUUID(),
    certificate_id: "123456",
    order_number: "PAY-123456-002",
    amount: 2000,
    status: "success",
    payment_type: "topup",
    alfa_bank_order_id: "ALFA-002",
    client_name: "Иванов Иван Иванович",
    client_email: "ivanov@example.com",
    description: "Пополнение сертификата №123456",
  },
  {
    id: crypto.randomUUID(),
    certificate_id: "345678",
    order_number: "PAY-345678-001",
    amount: 12000,
    status: "success",
    payment_type: "activate",
    alfa_bank_order_id: "ALFA-003",
    client_name: "Сидоров Владимир Петрович",
    client_email: "sidorov@example.com",
    description: "Активация сертификата №345678",
  },
  {
    id: crypto.randomUUID(),
    certificate_id: "456789",
    order_number: "PAY-456789-001",
    amount: 3000,
    status: "success",
    payment_type: "activate",
    alfa_bank_order_id: "ALFA-004",
    client_name: "Козлова Мария Александровна",
    client_email: "kozlova@example.com",
    description: "Активация сертификата №456789",
  },
  {
    id: crypto.randomUUID(),
    certificate_id: "234567",
    order_number: "PAY-234567-001",
    amount: 8000,
    status: "pending",
    payment_type: "activate",
    alfa_bank_order_id: "ALFA-005",
    client_name: "Петрова Анна Сергеевна",
    client_email: "petrova@example.com",
    description: "Активация сертификата №234567",
  },
  {
    id: crypto.randomUUID(),
    certificate_id: "567890",
    order_number: "PAY-567890-001",
    amount: 15000,
    status: "pending",
    payment_type: "activate",
    alfa_bank_order_id: "ALFA-006",
    client_name: "Морозов Дмитрий Николаевич",
    client_email: "morozov@example.com",
    description: "Активация сертификата №567890",
  },
];

// Test SMS notifications
const testSmsNotifications = [
  {
    phone_number: "+79001234567",
    message:
      "Сертификат №123456 создан! Баланс: ₽5,000. Для активации перейдите в клинику.",
    status: "sent",
    twilio_sid: "SM123456789",
  },
  {
    phone_number: "+79001234567",
    message:
      "Сертификат №123456 активирован! Баланс: ₽5,000. Можете использовать для оплаты услуг.",
    status: "sent",
    twilio_sid: "SM123456790",
  },
  {
    phone_number: "+79001234567",
    message: "Сертификат №123456 пополнен на +₽2,000. Новый баланс: ₽7,000.",
    status: "sent",
    twilio_sid: "SM123456791",
  },
  {
    phone_number: "+79001234569",
    message:
      "Сертификат №345678 создан! Баланс: ₽12,000. Для активации перейдите в клинику.",
    status: "sent",
    twilio_sid: "SM123456792",
  },
  {
    phone_number: "+79001234570",
    message:
      "Сертификат №456789 создан! Баланс: ₽3,000. Для активации перейдите в клинику.",
    status: "sent",
    twilio_sid: "SM123456793",
  },
];

// Test Email notifications
const testEmailNotifications = [
  {
    email: "ivanov@example.com",
    subject: "Сертификат №123456 создан",
    message:
      "Ваш сертификат успешно создан. Баланс: ₽5,000. Статус: Ожидает активации.",
    status: "sent",
  },
  {
    email: "ivanov@example.com",
    subject: "Сертификат №123456 активирован",
    message:
      "Ваш сертификат успешно активирован и готов к использованию. Баланс: ₽5,000.",
    status: "sent",
  },
  {
    email: "sidorov@example.com",
    subject: "Сертификат №345678 создан",
    message:
      "Ваш сертификат успешно создан. Баланс: ₽12,000. Статус: Ожидает активации.",
    status: "sent",
  },
  {
    email: "kozlova@example.com",
    subject: "Сертификат №456789 создан",
    message:
      "Ваш сертификат успешно создан. Баланс: ₽3,000. Статус: Ожидает активации.",
    status: "sent",
  },
];

// Insert test data
db.serialize(() => {
  console.log("Adding test data...");

  // Clear existing test data
  db.run("DELETE FROM certificates WHERE id IN (?, ?, ?, ?, ?)", [
    "123456",
    "234567",
    "345678",
    "456789",
    "567890",
  ]);
  db.run("DELETE FROM transactions WHERE certificate_id IN (?, ?, ?, ?, ?)", [
    "123456",
    "234567",
    "345678",
    "456789",
    "567890",
  ]);
  db.run("DELETE FROM payments WHERE certificate_id IN (?, ?, ?, ?, ?)", [
    "123456",
    "234567",
    "345678",
    "456789",
    "567890",
  ]);
  db.run("DELETE FROM sms_notifications");
  db.run("DELETE FROM email_notifications");

  // Insert test certificates
  testCertificates.forEach((cert) => {
    db.run(
      `
      INSERT INTO certificates (id, balance, status, client_name, client_email, client_phone)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        cert.id,
        cert.balance,
        cert.status,
        cert.client_name,
        cert.client_email,
        cert.client_phone,
      ]
    );
  });

  // Insert test transactions
  testTransactions.forEach((trans) => {
    db.run(
      `
      INSERT INTO transactions (id, certificate_id, type, amount, description)
      VALUES (?, ?, ?, ?, ?)
    `,
      [
        trans.id,
        trans.certificate_id,
        trans.type,
        trans.amount,
        trans.description,
      ]
    );
  });

  // Insert test payments
  testPayments.forEach((payment) => {
    db.run(
      `
      INSERT INTO payments (id, certificate_id, order_number, amount, status, payment_type, 
        alfa_bank_order_id, client_name, client_email, description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        payment.id,
        payment.certificate_id,
        payment.order_number,
        payment.amount,
        payment.status,
        payment.payment_type,
        payment.alfa_bank_order_id,
        payment.client_name,
        payment.client_email,
        payment.description,
      ]
    );
  });

  // Insert test SMS notifications
  testSmsNotifications.forEach((sms) => {
    db.run(
      `
      INSERT INTO sms_notifications (phone_number, message, status, twilio_sid)
      VALUES (?, ?, ?, ?)
    `,
      [sms.phone_number, sms.message, sms.status, sms.twilio_sid]
    );
  });

  // Insert test Email notifications
  testEmailNotifications.forEach((email) => {
    db.run(
      `
      INSERT INTO email_notifications (email, subject, message, status)
      VALUES (?, ?, ?, ?)
    `,
      [email.email, email.subject, email.message, email.status]
    );
  });

  console.log("✅ Test data added successfully!");
  console.log("");
  console.log("📋 Test Certificates:");
  testCertificates.forEach((cert) => {
    console.log(
      `  • ${cert.id}: ${
        cert.client_name
      } - ₽${cert.balance.toLocaleString()} (${cert.status})`
    );
  });
  console.log("");
  console.log("💳 Test Payment Cards:");
  console.log("  • Visa: 4111 1111 1111 1111");
  console.log("  • MasterCard: 5555 5555 5555 4444");
  console.log("  • Any future date (MM/YY)");
  console.log("  • Any 3-digit CVC");
  console.log("");
  console.log("🔐 Login credentials:");
  console.log("  • Username: admin");
  console.log("  • Password: admin123");
});

db.close();
