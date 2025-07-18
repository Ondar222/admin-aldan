interface CertificateData {
  number: string;
  amount: number;
  recipientName?: string;
  message?: string;
}

export class CertificateGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private templateImage: HTMLImageElement | null = null;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  // Загрузка шаблона сертификата
  async loadTemplate(templateUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.templateImage = new Image();
      this.templateImage.crossOrigin = 'anonymous';
      
      this.templateImage.onload = () => {
        this.canvas.width = this.templateImage!.width;
        this.canvas.height = this.templateImage!.height;
        resolve();
      };
      
      this.templateImage.onerror = () => {
        reject(new Error('Не удалось загрузить шаблон сертификата'));
      };
      
      this.templateImage.src = templateUrl;
    });
  }

  // Генерация сертификата с наложением текста
  generateCertificate(data: CertificateData): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.templateImage) {
        reject(new Error('Шаблон не загружен'));
        return;
      }

      // Очищаем canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Рисуем шаблон
      this.ctx.drawImage(this.templateImage, 0, 0);
      
      // Настройки текста
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#000000';
      
      // Добавляем номер сертификата (6-значный)
      this.ctx.font = 'bold 48px Arial';
      this.ctx.fillText(`№ ${data.number.padStart(6, '0')}`, this.canvas.width / 2, 200);
      
      // Добавляем сумму
      this.ctx.font = 'bold 36px Arial';
      this.ctx.fillText(`${data.amount.toLocaleString()} ₽`, this.canvas.width / 2, 300);
      
      // Добавляем имя получателя (если есть)
      if (data.recipientName) {
        this.ctx.font = '24px Arial';
        this.ctx.fillText(data.recipientName, this.canvas.width / 2, 400);
      }
      
      // Добавляем сообщение (если есть)
      if (data.message) {
        this.ctx.font = '18px Arial';
        this.wrapText(data.message, this.canvas.width / 2, 500, this.canvas.width - 100, 30);
      }
      
      // Добавляем дату
      this.ctx.font = '16px Arial';
      this.ctx.fillText(new Date().toLocaleDateString('ru-RU'), this.canvas.width / 2, this.canvas.height - 50);
      
      // Конвертируем в base64
      const dataUrl = this.canvas.toDataURL('image/png');
      resolve(dataUrl);
    });
  }

  // Перенос текста на несколько строк
  private wrapText(text: string, x: number, y: number, maxWidth: number, lineHeight: number): void {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = this.ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        this.ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    this.ctx.fillText(line, x, currentY);
  }

  // Создание простого сертификата без шаблона (для демонстрации)
  createSimpleCertificate(data: CertificateData): string {
    const width = 800;
    const height = 600;
    
    this.canvas.width = width;
    this.canvas.height = height;
    
    // Фон
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.fillRect(0, 0, width, height);
    
    // Рамка
    this.ctx.strokeStyle = '#2563eb';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(20, 20, width - 40, height - 40);
    
    // Заголовок
    this.ctx.fillStyle = '#2563eb';
    this.ctx.font = 'bold 32px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('ПОДАРОЧНЫЙ СЕРТИФИКАТ', width / 2, 80);
    
    // Номер сертификата (6-значный)
    this.ctx.fillStyle = '#000000';
    this.ctx.font = 'bold 24px Arial';
    this.ctx.fillText(`Номер: ${data.number.padStart(6, '0')}`, width / 2, 150);
    
    // Сумма
    this.ctx.font = 'bold 36px Arial';
    this.ctx.fillText(`${data.amount.toLocaleString()} ₽`, width / 2, 220);
    
    // Получатель
    if (data.recipientName) {
      this.ctx.font = '20px Arial';
      this.ctx.fillText(`Получатель: ${data.recipientName}`, width / 2, 280);
    }
    
    // Сообщение
    if (data.message) {
      this.ctx.font = '16px Arial';
      this.wrapText(data.message, width / 2, 350, width - 100, 25);
    }
    
    // Дата
    this.ctx.font = '14px Arial';
    this.ctx.fillText(`Дата выдачи: ${new Date().toLocaleDateString('ru-RU')}`, width / 2, height - 80);
    
    // Условия
    this.ctx.font = '12px Arial';
    this.ctx.fillText('Сертификат действителен в течение 1 года с момента выдачи', width / 2, height - 50);
    
    return this.canvas.toDataURL('image/png');
  }
}

// Функция для отправки сертификата на почту (симуляция)
export const sendCertificateByEmail = async (
  certificateImage: string, 
  recipientEmail: string, 
  certificateData: CertificateData
): Promise<boolean> => {
  // В реальном проекте здесь будет интеграция с почтовым сервисом
  console.log('Отправка сертификата на email:', recipientEmail);
  console.log('Данные сертификата:', certificateData);
  
  // Симуляция отправки
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return true;
};

// Функция для скачивания сертификата
export const downloadCertificate = (certificateImage: string, fileName: string): void => {
  const link = document.createElement('a');
  link.download = fileName;
  link.href = certificateImage;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 