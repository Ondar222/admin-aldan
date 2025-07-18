import React, { useEffect, useRef } from "react";
import { CertificateGenerator } from "../utils/certificateGenerator";

interface CertificatePreviewProps {
  number: string;
  amount: number;
  recipientName?: string;
  message?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  number,
  amount,
  recipientName,
  message,
  onClose,
  onConfirm,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const generator = useRef<CertificateGenerator>(new CertificateGenerator());

  useEffect(() => {
    const generatePreview = () => {
      if (canvasRef.current) {
        const certificateImage = generator.current.createSimpleCertificate({
          number,
          amount,
          recipientName,
          message,
        });

        const img = new Image();
        img.onload = () => {
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
              canvasRef.current.width = img.width;
              canvasRef.current.height = img.height;
              ctx.drawImage(img, 0, 0);
            }
          }
        };
        img.src = certificateImage;
      }
    };

    generatePreview();
  }, [number, amount, recipientName, message]);

  return (
    <div className="certificate-preview-overlay">
      <div className="certificate-preview-modal">
        <div className="preview-header">
          <h3>Предварительный просмотр сертификата</h3>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="preview-content">
          <canvas
            ref={canvasRef}
            className="certificate-canvas"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>

        <div className="preview-footer">
          <button className="cancel-button" onClick={onClose}>
            Отмена
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Подтвердить и отправить
          </button>
        </div>
      </div>
    </div>
  );
};
