import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Database from "../utils/database.js";

const db = new Database();

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.getUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// Login function
export const login = async (username, password) => {
  try {
    const user = await db.getUserByUsername(username);

    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new Error("Invalid password");
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    throw error;
  }
};

// Register function
export const register = async (userData) => {
  try {
    const { username, password, email, role = "admin" } = userData;

    // Check if user already exists
    const existingUser = await db.getUserByUsername(username);
    if (existingUser) {
      throw new Error("Username already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user (this would need to be implemented in Database class)
    // For now, we'll use a simple insert
    const result = await db.run(
      "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, email, role]
    );

    return {
      success: true,
      userId: result.id,
    };
  } catch (error) {
    throw error;
  }
};
