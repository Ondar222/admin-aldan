import React, { useState } from "react";
import { CreditCard, Copy, Check } from "lucide-react";
import "../styles/TestCards.css";

interface TestCard {
  type: string;
  number: string;
  name: string;
  expiry: string;
  cvc: string;
}

const testCards: TestCard[] = [
  {
    type: "Visa",
    number: "4111 1111 1111 1111",
    name: "Test Card",
    expiry: "12/25",
    cvc: "123",
  },
  {
    type: "MasterCard",
    number: "5555 5555 5555 4444",
    name: "Test Card",
    expiry: "12/25",
    cvc: "123",
  },
  {
    type: "Visa",
    number: "4000 0000 0000 0002",
    name: "Test Card",
    expiry: "12/25",
    cvc: "123",
  },
  {
    type: "MasterCard",
    number: "5105 1051 0510 5100",
    name: "Test Card",
    expiry: "12/25",
    cvc: "123",
  },
];

export const TestCards: React.FC = () => {
  const [copiedCard, setCopiedCard] = useState<string | null>(null);

  const copyToClipboard = async (text: string, cardType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCard(cardType);
      setTimeout(() => setCopiedCard(null), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="test-cards-container">
      <h3 className="test-cards-title">
        <CreditCard className="title-icon" />
        Тестовые карты для оплаты
      </h3>

      <div className="test-cards-grid">
        {testCards.map((card, index) => (
          <div key={index} className="test-card">
            <div className="card-header">
              <span className="card-type">{card.type}</span>
              <button
                className="copy-button"
                onClick={() => copyToClipboard(card.number, card.type)}
                title="Копировать номер карты"
              >
                {copiedCard === card.type ? (
                  <Check className="copy-icon success" />
                ) : (
                  <Copy className="copy-icon" />
                )}
              </button>
            </div>

            <div className="card-details">
              <div className="card-number">
                <span className="label">Номер:</span>
                <span className="value">{card.number}</span>
              </div>

              <div className="card-row">
                <div className="card-field">
                  <span className="label">Владелец:</span>
                  <span className="value">{card.name}</span>
                </div>

                <div className="card-field">
                  <span className="label">Срок:</span>
                  <span className="value">{card.expiry}</span>
                </div>

                <div className="card-field">
                  <span className="label">CVC:</span>
                  <span className="value">{card.cvc}</span>
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button
                className="copy-all-button"
                onClick={() =>
                  copyToClipboard(
                    `Номер: ${card.number}\nВладелец: ${card.name}\nСрок: ${card.expiry}\nCVC: ${card.cvc}`,
                    `${card.type}-all`
                  )
                }
              >
                {copiedCard === `${card.type}-all` ? (
                  <>
                    <Check className="button-icon" />
                    Скопировано
                  </>
                ) : (
                  <>
                    <Copy className="button-icon" />
                    Копировать все
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="test-info">
        <h4>Инструкции по тестированию:</h4>
        <ul>
          <li>Используйте любую из тестовых карт для оплаты</li>
          <li>Любая будущая дата истечения срока действия</li>
          <li>Любой 3-значный CVC код</li>
          <li>Платежи будут симулированы (без реального списания)</li>
          <li>SMS и Email уведомления будут показаны в консоли</li>
        </ul>
      </div>
    </div>
  );
};
