import express from "express";
import { body, validationResult } from "express-validator";
import PaymentService from "../services/paymentService.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();
const paymentService = new PaymentService();

// Get payment by ID
router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const payment = await paymentService.getPayment(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    res.json({ success: true, payment });
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Check payment status
router.get("/:id/status", authenticateToken, async (req, res) => {
  try {
    const payment = await paymentService.getPayment(req.params.id);

    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    const status = await paymentService.checkPaymentStatus(
      payment.alfa_bank_order_id
    );

    res.json({
      success: true,
      paymentId: req.params.id,
      status: status.status,
      message: status.message,
    });
  } catch (error) {
    console.error("Error checking payment status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Cancel payment
router.post("/:id/cancel", authenticateToken, async (req, res) => {
  try {
    const result = await paymentService.cancelPayment(req.params.id);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Error cancelling payment:", error);
    res.status(400).json({ error: error.message });
  }
});

// Payment webhook (for Alfa Bank callbacks)
router.post("/webhook", async (req, res) => {
  try {
    const { orderId, orderStatus, errorCode, errorMessage } = req.body;

    console.log("Payment webhook received:", req.body);

    // Find payment by Alfa Bank order ID
    const db = new Database();
    const payment = await db.get(
      "SELECT * FROM payments WHERE alfa_bank_order_id = ?",
      [orderId]
    );

    if (!payment) {
      console.error("Payment not found for orderId:", orderId);
      return res.status(404).json({ error: "Payment not found" });
    }

    if (errorCode === "0" && orderStatus === "2") {
      // Payment successful
      await paymentService.processPaymentSuccess(payment.id, {
        certificate_id: payment.certificate_id,
        amount: payment.amount,
        payment_type: payment.payment_type,
      });
    } else {
      // Payment failed
      await db.updatePaymentStatus(payment.id, "failed");
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Payment webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Payment success callback
router.get("/success", async (req, res) => {
  try {
    const { orderId, paymentId } = req.query;

    if (orderId === "simulated") {
      // Handle simulated payment
      res.json({
        success: true,
        message: "Payment simulated successfully",
        paymentId,
      });
    } else {
      // Handle real payment
      const status = await paymentService.checkPaymentStatus(orderId);

      res.json({
        success: true,
        status: status.status,
        message: status.message,
      });
    }
  } catch (error) {
    console.error("Payment success callback error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Payment fail callback
router.get("/fail", async (req, res) => {
  try {
    const { orderId, errorCode, errorMessage } = req.query;

    console.log("Payment failed:", { orderId, errorCode, errorMessage });

    res.json({
      success: false,
      error: errorMessage || "Payment failed",
      errorCode,
    });
  } catch (error) {
    console.error("Payment fail callback error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
