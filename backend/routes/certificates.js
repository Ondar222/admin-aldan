import express from "express";
import { body, validationResult } from "express-validator";
import crypto from "crypto";
import Database from "../utils/database.js";
import SmsService from "../services/smsService.js";
import EmailService from "../services/emailService.js";
import PaymentService from "../services/paymentService.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
const db = new Database();
const smsService = new SmsService();
const emailService = new EmailService();
const paymentService = new PaymentService();

// Get all certificates
router.get("/", authenticateToken, async (req, res) => {
  try {
    const certificates = await db.getAllCertificates();
    res.json({ success: true, certificates });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Get certificate by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const certificate = await db.getCertificate(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        error: "Certificate not found",
      });
    }

    // Get transactions for this certificate
    const transactions = await db.getTransactions(req.params.id);

    res.json({
      success: true,
      certificate: { ...certificate, transactions },
    });
  } catch (error) {
    console.error("Error fetching certificate:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Create new certificate
router.post(
  "/",
  authenticateToken,
  [
    body("balance")
      .isInt({ min: 1 })
      .withMessage("Balance must be a positive integer"),
    body("client_name").optional().isString().trim(),
    body("client_email")
      .optional()
      .isEmail()
      .withMessage("Invalid email format"),
    body("client_phone").optional().isString().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { balance, client_name, client_email, client_phone } = req.body;

      // Generate unique certificate ID
      const certificateId = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      // Create certificate
      await db.createCertificate({
        id: certificateId,
        balance: parseInt(balance),
        client_name,
        client_email,
        client_phone,
      });

      // Create initial transaction
      await db.createTransaction({
        id: crypto.randomUUID(),
        certificate_id: certificateId,
        type: "create",
        amount: parseInt(balance),
        description: "Создание сертификата",
      });

      // Get created certificate
      const certificate = await db.getCertificate(certificateId);

      // Send notifications
      await smsService.sendCertificateCreated(certificate);
      await emailService.sendCertificateCreated(certificate);

      res.status(201).json({
        success: true,
        certificate,
        message: "Certificate created successfully",
      });
    } catch (error) {
      console.error("Error creating certificate:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

// Update certificate balance
router.patch(
  "/:id/balance",
  authenticateToken,
  [
    body("operation")
      .isIn(["add", "subtract"])
      .withMessage("Operation must be add or subtract"),
    body("amount")
      .isInt({ min: 1 })
      .withMessage("Amount must be a positive integer"),
    body("description").optional().isString().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { operation, amount, description } = req.body;
      const certificateId = req.params.id;

      // Get current certificate
      const certificate = await db.getCertificate(certificateId);
      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }

      // Calculate new balance
      const newBalance =
        operation === "add"
          ? certificate.balance + parseInt(amount)
          : certificate.balance - parseInt(amount);

      // Check if enough balance for subtraction
      if (operation === "subtract" && newBalance < 0) {
        return res.status(400).json({
          success: false,
          error: "Insufficient balance",
        });
      }

      // Update balance
      await db.updateCertificateBalance(certificateId, newBalance);

      // Create transaction record
      await db.createTransaction({
        id: crypto.randomUUID(),
        certificate_id: certificateId,
        type: operation,
        amount: parseInt(amount),
        description:
          description ||
          (operation === "add" ? "Пополнение баланса" : "Оплата услуг"),
      });

      // Get updated certificate
      const updatedCertificate = await db.getCertificate(certificateId);

      // Send notifications
      await smsService.sendBalanceUpdated(
        updatedCertificate,
        operation,
        parseInt(amount)
      );
      await emailService.sendBalanceUpdated(
        updatedCertificate,
        operation,
        parseInt(amount)
      );

      // Check for low balance warning
      if (newBalance < 1000) {
        await smsService.sendLowBalanceWarning(updatedCertificate);
        await emailService.sendLowBalanceWarning(updatedCertificate);
      }

      res.json({
        success: true,
        certificate: updatedCertificate,
        message: `Balance ${
          operation === "add" ? "added" : "subtracted"
        } successfully`,
      });
    } catch (error) {
      console.error("Error updating certificate balance:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

// Create payment order
router.post(
  "/:id/payment",
  authenticateToken,
  [
    body("amount")
      .isInt({ min: 1 })
      .withMessage("Amount must be a positive integer"),
    body("payment_type")
      .isIn(["activate", "topup"])
      .withMessage("Payment type must be activate or topup"),
    body("client_name").optional().isString().trim(),
    body("client_email")
      .optional()
      .isEmail()
      .withMessage("Invalid email format"),
    body("description").optional().isString().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const certificateId = req.params.id;
      const { amount, payment_type, client_name, client_email, description } =
        req.body;

      // Get certificate
      const certificate = await db.getCertificate(certificateId);
      if (!certificate) {
        return res.status(404).json({
          success: false,
          error: "Certificate not found",
        });
      }

      // Generate order number
      const orderNumber = `CERT-${certificateId}-${Date.now()}`;

      // Create payment order
      const paymentResult = await paymentService.createOrder({
        certificate_id: certificateId,
        order_number: orderNumber,
        amount: parseInt(amount),
        payment_type,
        client_name: client_name || certificate.client_name,
        client_email: client_email || certificate.client_email,
        description:
          description ||
          (payment_type === "activate"
            ? `Активация сертификата №${certificateId}`
            : `Пополнение сертификата №${certificateId}`),
      });

      res.json({
        success: true,
        payment: paymentResult,
        message: "Payment order created successfully",
      });
    } catch (error) {
      console.error("Error creating payment order:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
      });
    }
  }
);

// Get certificate transactions
router.get("/:id/transactions", authenticateToken, async (req, res) => {
  try {
    const transactions = await db.getTransactions(req.params.id);
    res.json({ success: true, transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

// Get certificate payments
router.get("/:id/payments", authenticateToken, async (req, res) => {
  try {
    const payments = await paymentService.getPaymentsByCertificate(
      req.params.id
    );
    res.json({ success: true, payments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

export default router;
