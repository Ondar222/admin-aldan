import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Database from "../utils/database.js";

const db = new Database();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
};

// Middleware для проверки роли супер админа
export const requireSuperAdmin = async (req, res, next) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        error: "Super admin access required",
      });
    }
    next();
  } catch (error) {
    console.error("Error checking user role:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Middleware для проверки роли админа (любого уровня)
export const requireAdmin = async (req, res, next) => {
  try {
    const user = await db.getUserById(req.user.id);
    if (!user || (user.role !== "admin" && user.role !== "manager")) {
      return res.status(403).json({
        success: false,
        error: "Admin access required",
      });
    }
    next();
  } catch (error) {
    console.error("Error checking user role:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
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
    const { username, password, email, role = "manager" } = userData;

    // Check if user already exists
    const existingUser = await db.getUserByUsername(username);
    if (existingUser) {
      throw new Error("Username already exists");
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await db.createUser({
      username,
      password: hashedPassword,
      email,
      role,
    });

    return {
      success: true,
      userId: result.id,
    };
  } catch (error) {
    throw error;
  }
};
