export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Мок данные сертификатов
    const certificates = [
      {
        id: "1234567",
        balance: 5000,
        status: "paid",
        clientName: "Иванов И.И.",
        clientEmail: "ivanov@example.com",
        clientPhone: "+79001234567",
        createdAt: "2025-01-15T10:00:00.000Z",
        transactions: [
          {
            id: "1",
            type: "create",
            amount: 5000,
            date: "2025-01-15T10:00:00.000Z",
            description: "Создание сертификата",
          },
        ],
      },
      {
        id: "2345678",
        balance: 8000,
        status: "unpaid",
        clientName: "Петрова А.С.",
        clientEmail: "petrova@example.com",
        clientPhone: "+79001234568",
        createdAt: "2025-01-16T11:00:00.000Z",
        transactions: [],
      },
      {
        id: "3456789",
        balance: 12000,
        status: "paid",
        clientName: "Сидоров В.П.",
        clientEmail: "sidorov@example.com",
        clientPhone: "+79001234569",
        createdAt: "2025-01-17T12:00:00.000Z",
        transactions: [
          {
            id: "3",
            type: "create",
            amount: 12000,
            date: "2025-01-17T12:00:00.000Z",
            description: "Создание сертификата",
          },
        ],
      },
    ];

    return res.status(200).json({
      success: true,
      certificates,
    });
  } catch (error) {
    console.error("Get certificates error:", error);
    return res.status(500).json({
      success: false,
      error: "Внутренняя ошибка сервера",
    });
  }
}
