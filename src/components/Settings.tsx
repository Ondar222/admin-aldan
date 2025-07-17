import React, { useState } from "react";
import {
  Save,
  Building,
  Mail,
  Phone,
  MapPin,
  Clock,
  Users,
  CreditCard,
  Shield,
  Bell,
} from "lucide-react";
import "../styles/Setting.css";

export const Settings: React.FC = () => {
  const [clinicSettings, setClinicSettings] = useState({
    name: "Клиника Алдан",
    address: "г. Кызыл, ул. Ленина, д. 60",
    phone: "+7 (923) 317 60 60",
    email: "info@clinic-health.ru",
    workingHours: "Пн-Пт 08-22, Сб-Вс 09-18",
    website: " clinicaldan@mail.ru",
  });

  const [certificateSettings, setCertificateSettings] = useState({
    minAmount: 1000,
    maxAmount: 100000,
    defaultAmount: 5000,
    expirationDays: 365,
    autoActivation: false,
    allowPartialPayment: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    lowBalanceAlert: true,
    lowBalanceThreshold: 500,
    expirationAlert: true,
    expirationDays: 30,
  });

  const [userSettings, setUserSettings] = useState({
    maxAdmins: 5,
    sessionTimeout: 60,
    requireTwoFactor: false,
    passwordExpiration: 90,
  });

  const [loading, setLoading] = useState(false);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Settings saved:", {
        clinic: clinicSettings,
        certificates: certificateSettings,
        notifications: notificationSettings,
        users: userSettings,
      });

      alert("Настройки успешно сохранены!");
    } catch (error) {
      alert("Ошибка при сохранении настроек");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-header">
        <h1 className="settings-title">Настройки системы</h1>
        <button
          onClick={handleSaveSettings}
          disabled={loading}
          className="save-button"
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              <span>Сохранение...</span>
            </>
          ) : (
            <>
              <Save className="save-icon" />
              <span>Сохранить все</span>
            </>
          )}
        </button>
      </div>

      {/* Clinic Information */}
      <div className="settings-card">
        <div className="card-header">
          <Building className="card-icon" />
          <h2 className="card-title">Информация о клинике</h2>
        </div>

        <div className="card-grid">
          <div className="input-group">
            <label className="input-label">Название клиники</label>
            <input
              type="text"
              value={clinicSettings.name}
              onChange={(e) =>
                setClinicSettings({ ...clinicSettings, name: e.target.value })
              }
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Телефон</label>
            <div className="input-with-icon">
              <Phone className="input-icon" />
              <input
                type="tel"
                value={clinicSettings.phone}
                onChange={(e) =>
                  setClinicSettings({
                    ...clinicSettings,
                    phone: e.target.value,
                  })
                }
                className="input-field"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <div className="input-with-icon">
              <Mail className="input-icon" />
              <input
                type="email"
                value={clinicSettings.email}
                onChange={(e) =>
                  setClinicSettings({
                    ...clinicSettings,
                    email: e.target.value,
                  })
                }
                className="input-field"
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Часы работы</label>
            <div className="input-with-icon">
              <Clock className="input-icon" />
              <input
                type="text"
                value={clinicSettings.workingHours}
                onChange={(e) =>
                  setClinicSettings({
                    ...clinicSettings,
                    workingHours: e.target.value,
                  })
                }
                className="input-field"
              />
            </div>
          </div>

          <div className="input-group double-width">
            <label className="input-label">Адрес</label>
            <div className="input-with-icon">
              <MapPin className="input-icon" />
              <textarea
                value={clinicSettings.address}
                onChange={(e) =>
                  setClinicSettings({
                    ...clinicSettings,
                    address: e.target.value,
                  })
                }
                rows={2}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Settings */}
      <div className="settings-card">
        <div className="card-header">
          <CreditCard className="card-icon" />
          <h2 className="card-title">Настройки сертификатов</h2>
        </div>

        <div className="card-grid">
          <div className="input-group">
            <label className="input-label">Минимальная сумма (₽)</label>
            <input
              type="number"
              value={certificateSettings.minAmount}
              onChange={(e) =>
                setCertificateSettings({
                  ...certificateSettings,
                  minAmount: parseInt(e.target.value),
                })
              }
              className="input-field"
              min="1"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Максимальная сумма (₽)</label>
            <input
              type="number"
              value={certificateSettings.maxAmount}
              onChange={(e) =>
                setCertificateSettings({
                  ...certificateSettings,
                  maxAmount: parseInt(e.target.value),
                })
              }
              className="input-field"
              min="1"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Сумма по умолчанию (₽)</label>
            <input
              type="number"
              value={certificateSettings.defaultAmount}
              onChange={(e) =>
                setCertificateSettings({
                  ...certificateSettings,
                  defaultAmount: parseInt(e.target.value),
                })
              }
              className="input-field"
              min="1"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Срок действия (дней)</label>
            <input
              type="number"
              value={certificateSettings.expirationDays}
              onChange={(e) =>
                setCertificateSettings({
                  ...certificateSettings,
                  expirationDays: parseInt(e.target.value),
                })
              }
              className="input-field"
              min="1"
            />
          </div>

          <div className="input-group double-width checkbox-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="autoActivation"
                checked={certificateSettings.autoActivation}
                onChange={(e) =>
                  setCertificateSettings({
                    ...certificateSettings,
                    autoActivation: e.target.checked,
                  })
                }
                className="checkbox-input"
              />
              <label htmlFor="autoActivation" className="checkbox-label">
                Автоматическая активация после оплаты
              </label>
            </div>

            <div className="checkbox-item">
              <input
                type="checkbox"
                id="allowPartialPayment"
                checked={certificateSettings.allowPartialPayment}
                onChange={(e) =>
                  setCertificateSettings({
                    ...certificateSettings,
                    allowPartialPayment: e.target.checked,
                  })
                }
                className="checkbox-input"
              />
              <label htmlFor="allowPartialPayment" className="checkbox-label">
                Разрешить частичную оплату услуг
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="settings-card">
        <div className="card-header">
          <Bell className="card-icon" />
          <h2 className="card-title">Уведомления</h2>
        </div>

        <div className="card-grid">
          <div className="input-group">
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="emailNotifications"
                checked={notificationSettings.emailNotifications}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    emailNotifications: e.target.checked,
                  })
                }
                className="checkbox-input"
              />
              <label htmlFor="emailNotifications" className="checkbox-label">
                Email уведомления
              </label>
            </div>

            <div className="checkbox-item">
              <input
                type="checkbox"
                id="smsNotifications"
                checked={notificationSettings.smsNotifications}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    smsNotifications: e.target.checked,
                  })
                }
                className="checkbox-input"
              />
              <label htmlFor="smsNotifications" className="checkbox-label">
                SMS уведомления
              </label>
            </div>

            <div className="checkbox-item">
              <input
                type="checkbox"
                id="lowBalanceAlert"
                checked={notificationSettings.lowBalanceAlert}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    lowBalanceAlert: e.target.checked,
                  })
                }
                className="checkbox-input"
              />
              <label htmlFor="lowBalanceAlert" className="checkbox-label">
                Уведомления о низком балансе
              </label>
            </div>
          </div>

          <div className="input-group">
            <div className="input-group">
              <label className="input-label">Порог низкого баланса (₽)</label>
              <input
                type="number"
                value={notificationSettings.lowBalanceThreshold}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    lowBalanceThreshold: parseInt(e.target.value),
                  })
                }
                className="input-field"
                min="0"
                disabled={!notificationSettings.lowBalanceAlert}
              />
            </div>

            <div className="input-group">
              <label className="input-label">
                Уведомлять об истечении за (дней)
              </label>
              <input
                type="number"
                value={notificationSettings.expirationDays}
                onChange={(e) =>
                  setNotificationSettings({
                    ...notificationSettings,
                    expirationDays: parseInt(e.target.value),
                  })
                }
                className="input-field"
                min="1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* User Management Settings */}
      <div className="settings-card">
        <div className="card-header">
          <Users className="card-icon" />
          <h2 className="card-title">Управление пользователями</h2>
        </div>

        <div className="card-grid">
          <div className="input-group">
            <label className="input-label">Максимум администраторов</label>
            <input
              type="number"
              value={userSettings.maxAdmins}
              onChange={(e) =>
                setUserSettings({
                  ...userSettings,
                  maxAdmins: parseInt(e.target.value),
                })
              }
              className="input-field"
              min="1"
              max="20"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Таймаут сессии (минут)</label>
            <input
              type="number"
              value={userSettings.sessionTimeout}
              onChange={(e) =>
                setUserSettings({
                  ...userSettings,
                  sessionTimeout: parseInt(e.target.value),
                })
              }
              className="input-field"
              min="5"
              max="480"
            />
          </div>

          <div className="input-group">
            <label className="input-label">Срок действия пароля (дней)</label>
            <input
              type="number"
              value={userSettings.passwordExpiration}
              onChange={(e) =>
                setUserSettings({
                  ...userSettings,
                  passwordExpiration: parseInt(e.target.value),
                })
              }
              className="input-field"
              min="30"
              max="365"
            />
          </div>

          <div className="input-group checkbox-item">
            <input
              type="checkbox"
              id="requireTwoFactor"
              checked={userSettings.requireTwoFactor}
              onChange={(e) =>
                setUserSettings({
                  ...userSettings,
                  requireTwoFactor: e.target.checked,
                })
              }
              className="checkbox-input"
            />
            <label htmlFor="requireTwoFactor" className="checkbox-label">
              Требовать двухфакторную аутентификацию
            </label>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="settings-card">
        <div className="card-header">
          <Shield className="card-icon" />
          <h2 className="card-title">Безопасность</h2>
        </div>

        <div className="security-grid">
          <div className="alert-box warning">
            <h3 className="alert-title">Резервное копирование</h3>
            <p className="alert-text">
              Последнее резервное копирование: 15.01.2025 в 03:00
            </p>
            <button className="alert-button warning">
              Создать резервную копию
            </button>
          </div>

          <div className="alert-box danger">
            <h3 className="alert-title">Журнал безопасности</h3>
            <p className="alert-text">
              Последние попытки входа и изменения в системе
            </p>
            <button className="alert-button danger">Просмотреть журнал</button>
          </div>
        </div>
      </div>
    </div>
  );
};
