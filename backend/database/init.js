import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import bcrypt from "bcryptjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, "certificates.db");

const db = new sqlite3.Database(dbPath);

// Create tables
db.serialize(() => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Certificates table
  db.run(`
    CREATE TABLE IF NOT EXISTS certificates (
      id TEXT PRIMARY KEY,
      balance INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'unpaid',
      client_name TEXT,
      client_email TEXT,
      client_phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Transactions table
  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      certificate_id TEXT NOT NULL,
      type TEXT NOT NULL,
      amount INTEGER NOT NULL,
      description TEXT,
      payment_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (certificate_id) REFERENCES certificates (id)
    )
  `);

  // Email notifications table
  db.run(`
    CREATE TABLE IF NOT EXISTS email_notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create indexes
  db.run(
    "CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status)"
  );
  db.run(
    "CREATE INDEX IF NOT EXISTS idx_transactions_certificate_id ON transactions(certificate_id)"
  );

  // Insert default admin user
  const adminPassword = bcrypt.hashSync("admin123", 10);
  const managerPassword = bcrypt.hashSync("manager123", 10);

  db.run(
    `
    INSERT OR IGNORE INTO users (username, password, email, role)
    VALUES (?, ?, ?, ?)
  `,
    ["admin", adminPassword, "admin@clinic.com", "admin"]
  );

  db.run(
    `
    INSERT OR IGNORE INTO users (username, password, email, role)
    VALUES (?, ?, ?, ?)
  `,
    ["manager1", managerPassword, "manager@clinic.com", "manager"]
  );

  // Insert sample certificates
  const sampleCertificates = [
    {
      id: "123456",
      balance: 5000,
      status: "paid",
      client_name: "Иванов И.И.",
      client_email: "ivanov@example.com",
      client_phone: "+79001234567",
    },
    {
      id: "234567",
      balance: 8000,
      status: "unpaid",
      client_name: "Петрова А.С.",
      client_email: "petrova@example.com",
      client_phone: "+79001234568",
    },
    {
      id: "345678",
      balance: 12000,
      status: "paid",
      client_name: "Сидоров В.П.",
      client_email: "sidorov@example.com",
      client_phone: "+79001234569",
    },
  ];

  sampleCertificates.forEach((cert) => {
    db.run(
      `
      INSERT OR IGNORE INTO certificates (id, balance, status, client_name, client_email, client_phone)
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

  // Insert sample transactions
  const sampleTransactions = [
    {
      id: "1",
      certificate_id: "123456",
      type: "create",
      amount: 5000,
      description: "Создание сертификата",
    },
    {
      id: "2",
      certificate_id: "123456",
      type: "subtract",
      amount: 1500,
      description: "Оплата услуг",
    },
    {
      id: "3",
      certificate_id: "123456",
      type: "add",
      amount: 2000,
      description: "Пополнение баланса",
    },
  ];

  sampleTransactions.forEach((trans) => {
    db.run(
      `
      INSERT OR IGNORE INTO transactions (id, certificate_id, type, amount, description)
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

  console.log("Database initialized successfully!");
});

db.close();
