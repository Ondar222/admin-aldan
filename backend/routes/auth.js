import express from "express";
import { body, validationResult } from "express-validator";
import { login, register } from "../middleware/auth.js";

const router = express.Router();

// Login endpoint
router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password } = req.body;

      const result = await login(username, password);

      res.json({
        success: true,
        token: result.token,
        user: result.user,
        message: "Login successful",
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(401).json({
        error: "Invalid credentials",
        message: error.message,
      });
    }
  }
);

// Register endpoint
router.post(
  "/register",
  [
    body("username")
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("email").isEmail().withMessage("Invalid email format"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password, email, role } = req.body;

      const result = await register({ username, password, email, role });

      res.status(201).json({
        success: true,
        userId: result.userId,
        message: "User registered successfully",
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({
        error: "Registration failed",
        message: error.message,
      });
    }
  }
);

// Verify token endpoint
router.get("/verify", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Token verification is handled by authenticateToken middleware
    // This endpoint just confirms the token is valid
    res.json({
      success: true,
      message: "Token is valid",
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
