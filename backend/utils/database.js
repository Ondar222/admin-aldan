import sqlite3 from "sqlite3";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, "..", "database", "certificates.db");

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath);
  }

  // Generic query methods
  async get(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(query, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async all(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async run(query, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, function (err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  // Certificate methods
  async getCertificate(id) {
    return this.get("SELECT * FROM certificates WHERE id = ?", [id]);
  }

  async getAllCertificates() {
    return this.all("SELECT * FROM certificates ORDER BY created_at DESC");
  }

  async createCertificate(certificateData) {
    const { id, balance, client_name, client_email, client_phone } =
      certificateData;
    return this.run(
      "INSERT INTO certificates (id, balance, client_name, client_email, client_phone) VALUES (?, ?, ?, ?, ?)",
      [id, balance, client_name, client_email, client_phone]
    );
  }

  async updateCertificateBalance(id, newBalance) {
    return this.run(
      "UPDATE certificates SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [newBalance, id]
    );
  }

  async updateCertificateStatus(id, status) {
    return this.run(
      "UPDATE certificates SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [status, id]
    );
  }

  // Transaction methods
  async getTransactions(certificateId) {
    return this.all(
      "SELECT * FROM transactions WHERE certificate_id = ? ORDER BY created_at DESC",
      [certificateId]
    );
  }

  async createTransaction(transactionData) {
    const { id, certificate_id, type, amount, description, payment_id } =
      transactionData;
    return this.run(
      "INSERT INTO transactions (id, certificate_id, type, amount, description, payment_id) VALUES (?, ?, ?, ?, ?, ?)",
      [id, certificate_id, type, amount, description, payment_id]
    );
  }

  // User methods
  async getUserByUsername(username) {
    return this.get("SELECT * FROM users WHERE username = ?", [username]);
  }

  async getUserById(id) {
    return this.get("SELECT * FROM users WHERE id = ?", [id]);
  }

  async createUser(userData) {
    const { username, password, email, role } = userData;
    return this.run(
      "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
      [username, password, email, role]
    );
  }

  // Email methods
  async createEmailNotification(emailData) {
    const { email, subject, message } = emailData;
    return this.run(
      "INSERT INTO email_notifications (email, subject, message) VALUES (?, ?, ?)",
      [email, subject, message]
    );
  }

  async updateEmailStatus(id, status) {
    return this.run("UPDATE email_notifications SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
  }

  close() {
    this.db.close();
  }
}

export default Database;
