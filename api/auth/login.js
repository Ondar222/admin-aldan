import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { username, password } = req.body;

    // Проверяем учетные данные
    if (username === "admin" && password === "admin123") {
      const token = jwt.sign(
        { username: "admin", role: "admin" },
        process.env.JWT_SECRET || "fallback-secret",
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        success: true,
        token,
        user: {
          username: "admin",
          role: "admin",
          name: "Администратор",
        },
      });
    }

    if (username === "manager1" && password === "manager123") {
      const token = jwt.sign(
        { username: "manager1", role: "manager" },
        process.env.JWT_SECRET || "fallback-secret",
        { expiresIn: "24h" }
      );

      return res.status(200).json({
        success: true,
        token,
        user: {
          username: "manager1",
          role: "manager",
          name: "Менеджер",
        },
      });
    }

    return res.status(401).json({
      success: false,
      error: "Неверные учетные данные",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
}
