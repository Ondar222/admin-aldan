import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Heart } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import "../styles/Login.css";

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      let success = false;
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await register(
          formData.email,
          formData.password,
          formData.name
        );
      }

      if (!success) {
        setErrors({ general: "Неверные данные для входа" });
      }
    } catch (error) {
      setErrors({ general: "Произошла ошибка. Попробуйте еще раз." });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <Heart className="logo-icon" />
            <h1 className="logo-text">Клиника Алдан</h1>
          </div>
          <p className="login-subtitle">
            {isLogin ? "Вход в админ панель" : "Регистрация администратора"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Имя
              </label>
              <div className="input-container">
                <User className="input-icon" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Введите ваше имя"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Логин
            </label>
            <div className="input-container">
              <User className="input-icon" />
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="admin"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Пароль
            </label>
            <div className="input-container">
              <Lock className="input-icon" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {errors.general && (
            <div className="error-message">
              <p className="error-text">{errors.general}</p>
            </div>
          )}

          <button type="submit" disabled={loading} className="submit-button">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                Загрузка...
              </div>
            ) : isLogin ? (
              "Войти"
            ) : (
              "Зарегистрироваться"
            )}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-hint">
            <strong>Тестовые аккаунты:</strong>
          </p>
          <div className="test-accounts">
            <div className="test-account">
              <strong>Супер Админ:</strong>
              <span>admin / admin123</span>
              <small>(может создавать, пополнять и списывать)</small>
            </div>
            <div className="test-account">
              <strong>Менеджер:</strong>
              <span>manager1 / manager123</span>
              <small>(может только проверять и списывать)</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
