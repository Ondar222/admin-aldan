import React from "react";
import {
  Database,
  CreditCard,
  MessageSquare,
  Mail,
  Users,
  Activity,
} from "lucide-react";
import "../styles/TestDataInfo.css";

export const TestDataInfo: React.FC = () => {
  return (
    <div className="test-data-info">
      <h2 className="info-title">📊 Тестовые данные системы</h2>

      <div className="info-grid">
        <div className="info-card">
          <div className="card-icon">
            <Users />
          </div>
          <h3>Тестовые сертификаты</h3>
          <ul>
            <li>
              <strong>123456</strong> - Иванов И.И. (₽5,000, активен)
            </li>
            <li>
              <strong>234567</strong> - Петрова А.С. (₽8,000, неактивен)
            </li>
            <li>
              <strong>345678</strong> - Сидоров В.П. (₽12,000, активен)
            </li>
            <li>
              <strong>456789</strong> - Козлова М.А. (₽3,000, активен)
            </li>
            <li>
              <strong>567890</strong> - Морозов Д.Н. (₽15,000, неактивен)
            </li>
          </ul>
        </div>

        <div className="info-card">
          <div className="card-icon">
            <CreditCard />
          </div>
          <h3>Тестовые карты</h3>
          <ul>
            <li>
              <strong>Visa:</strong> 4111 1111 1111 1111
            </li>
            <li>
              <strong>MasterCard:</strong> 5555 5555 5555 4444
            </li>
            <li>
              <strong>Visa:</strong> 4000 0000 0000 0002
            </li>
            <li>
              <strong>MasterCard:</strong> 5105 1051 0510 5100
            </li>
          </ul>
          <p className="card-note">Любая будущая дата и CVC код</p>
        </div>

        <div className="info-card">
          <div className="card-icon">
            <Database />
          </div>
          <h3>База данных</h3>
          <ul>
            <li>
              <strong>Сертификаты:</strong> 5 записей
            </li>
            <li>
              <strong>Транзакции:</strong> 11 операций
            </li>
            <li>
              <strong>Платежи:</strong> 6 записей
            </li>
            <li>
              <strong>SMS:</strong> 5 уведомлений
            </li>
            <li>
              <strong>Email:</strong> 4 уведомления
            </li>
          </ul>
        </div>

        <div className="info-card">
          <div className="card-icon">
            <Activity />
          </div>
          <h3>Статусы платежей</h3>
          <ul>
            <li>
              <span className="status success">Успешно:</span> 4 платежа
            </li>
            <li>
              <span className="status pending">Ожидание:</span> 2 платежа
            </li>
            <li>
              <span className="status failed">Ошибка:</span> 0 платежей
            </li>
          </ul>
        </div>

        <div className="info-card">
          <div className="card-icon">
            <MessageSquare />
          </div>
          <h3>SMS уведомления</h3>
          <ul>
            <li>Создание сертификатов</li>
            <li>Активация сертификатов</li>
            <li>Пополнение баланса</li>
            <li>Предупреждения о низком балансе</li>
          </ul>
          <p className="card-note">Логируются в консоль backend</p>
        </div>

        <div className="info-card">
          <div className="card-icon">
            <Mail />
          </div>
          <h3>Email уведомления</h3>
          <ul>
            <li>Подтверждения операций</li>
            <li>Детальные отчеты</li>
            <li>HTML шаблоны</li>
            <li>Автоматические уведомления</li>
          </ul>
          <p className="card-note">Логируются в консоль backend</p>
        </div>
      </div>

      <div className="usage-instructions">
        <h3>🎯 Как использовать тестовые данные</h3>

        <div className="instruction-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h4>Поиск сертификата</h4>
              <p>
                Введите любой из номеров сертификатов (1234567, 2345678,
                3456789, 4567890, 5678901) для поиска
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h4>Тестирование платежей</h4>
              <p>
                Используйте тестовые карты для активации или пополнения
                сертификатов. Платежи будут симулированы.
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h4>Проверка уведомлений</h4>
              <p>
                Откройте консоль backend для просмотра SMS и Email уведомлений
              </p>
            </div>
          </div>

          <div className="step">
            <div className="step-number">4</div>
            <div className="step-content">
              <h4>Создание новых сертификатов</h4>
              <p>
                Создавайте новые сертификаты с любыми данными. Они автоматически
                сохранятся в базе.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="api-info">
        <h3>🔗 API Endpoints</h3>
        <div className="api-grid">
          <div className="api-section">
            <h4>Сертификаты</h4>
            <ul>
              <li>
                <code>GET /api/certificates</code> - Все сертификаты
              </li>
              <li>
                <code>GET /api/certificates/:id</code> - Сертификат по ID
              </li>
              <li>
                <code>POST /api/certificates</code> - Создать сертификат
              </li>
              <li>
                <code>PATCH /api/certificates/:id/balance</code> - Обновить
                баланс
              </li>
            </ul>
          </div>

          <div className="api-section">
            <h4>Платежи</h4>
            <ul>
              <li>
                <code>POST /api/certificates/:id/payment</code> - Создать платеж
              </li>
              <li>
                <code>GET /api/payments/:id/status</code> - Статус платежа
              </li>
              <li>
                <code>POST /api/payments/webhook</code> - Webhook Альфа-Банка
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
