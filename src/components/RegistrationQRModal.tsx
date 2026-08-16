import React, { useState, useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';

interface RegistrationQRModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUrl?: string;
  folioCode?: string;
  title?: string;
  subtitle?: string;
}

export const RegistrationQRModal: React.FC<RegistrationQRModalProps> = ({
  isOpen,
  onClose,
  defaultUrl = 'https://registro.caishencapitalgroup.com/',
  folioCode,
  title = 'Código QR de Registro',
  subtitle = 'Escanee con su dispositivo móvil para acceder al protocolo institucional'
}) => {
  const [selectedTarget, setSelectedTarget] = useState<'registro' | 'compliance'>('registro');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const currentUrl =
    selectedTarget === 'compliance'
      ? 'https://compliance.caishencapitalgroup.com/'
      : (typeof window !== 'undefined' && window.location.href.startsWith('http')
          ? defaultUrl || window.location.href
          : defaultUrl);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if clipboard API is restricted
      const input = document.createElement('input');
      input.value = currentUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadQR = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current.querySelector('canvas');
    if (!canvas) return;

    // Create high-res branded export with border and text
    const exportCanvas = document.createElement('canvas');
    const size = 600;
    exportCanvas.width = size;
    exportCanvas.height = size + 160;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.roundRect ? ctx.roundRect(0, 0, exportCanvas.width, exportCanvas.height, 24) : ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    ctx.fill();

    // Draw header bar
    ctx.fillStyle = '#1d1c2d';
    ctx.fillRect(0, 0, exportCanvas.width, 90);

    // Header text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CAISHEN CAPITAL GROUP', size / 2, 45);

    ctx.fillStyle = '#ceff04';
    ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('REGISTRO DE INVERSIONISTA & COMPLIANCE', size / 2, 70);

    // Draw QR canvas in center
    const qrSize = 440;
    const qrX = (size - qrSize) / 2;
    const qrY = 120;
    ctx.drawImage(canvas, qrX, qrY, qrSize, qrSize);

    // Footer text
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(folioCode ? `RADICADO: ${folioCode}` : 'ESCANEAR PARA ACCESO DIRECTO', size / 2, size + 120);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(currentUrl, size / 2, size + 142);

    const link = document.createElement('a');
    link.download = `QR-Caishen-${folioCode || 'Registro'}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🔐 *Caishen Capital Group - Registro de Inversionistas*\nAccede al protocolo institucional de pre-registro y validación:\n👉 ${currentUrl}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div
      id="qr-modal-backdrop"
      className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-[#0f172a]/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="qr-modal-container"
        className="max-w-[480px] w-full bg-white rounded-[2.5rem] shadow-[0_30px_90px_-15px_rgba(0,0,0,0.3)] border border-slate-100 overflow-hidden relative"
      >
        {/* Header decoration */}
        <div className="bg-[#1d1c2d] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#ceff04] text-[#1d1c2d] flex items-center justify-center font-bold text-sm shadow-sm">
              <i className="fas fa-qrcode"></i>
            </div>
            <div>
              <p className="text-[13px] font-black tracking-wide uppercase">{title}</p>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em]">Caishen Capital Group</p>
            </div>
          </div>
          <button
            id="close-qr-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all"
            aria-label="Cerrar modal"
          >
            <i className="fas fa-times text-xs"></i>
          </button>
        </div>

        <div className="p-6 md:p-8 flex flex-col items-center text-center">
          {/* Target URL selector tabs */}
          <div className="w-full flex bg-slate-100 p-1 rounded-2xl mb-6 border border-slate-200/70">
            <button
              type="button"
              onClick={() => setSelectedTarget('registro')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 ${
                selectedTarget === 'registro'
                  ? 'bg-white text-[#1d1c2d] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <i className="fas fa-file-signature text-xs"></i>
              <span>Registro General</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTarget('compliance')}
              className={`flex-1 py-2.5 px-3 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 ${
                selectedTarget === 'compliance'
                  ? 'bg-white text-[#1d1c2d] shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <i className="fas fa-shield-halved text-xs"></i>
              <span>Validación KYC</span>
            </button>
          </div>

          {/* QR Code Container with Frame */}
          <div className="relative p-5 bg-white rounded-3xl border-2 border-slate-100 shadow-xl mb-4 group">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1d1c2d] text-[#ceff04] text-[8px] font-black uppercase tracking-[0.25em] px-3 py-1 rounded-full shadow-sm">
              {selectedTarget === 'compliance' ? 'PORTAL BIOMÉTRICO' : 'ONBOARDING 2026'}
            </div>

            {/* Hidden canvas used for high-res PNG export */}
            <div ref={canvasRef} className="hidden">
              <QRCodeCanvas
                value={currentUrl}
                size={400}
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Display SVG for perfect rendering */}
            <div className="p-2 bg-white rounded-2xl">
              <QRCodeSVG
                value={currentUrl}
                size={210}
                level="H"
                includeMargin={false}
                fgColor="#1d1c2d"
                bgColor="#ffffff"
              />
            </div>

            {folioCode && (
              <div className="mt-3 pt-3 border-t border-slate-100 text-[10px] font-black text-slate-700 font-mono">
                FOLIO: {folioCode}
              </div>
            )}
          </div>

          <p className="text-[12px] font-semibold text-slate-600 mb-2 px-4 leading-snug">
            {subtitle}
          </p>

          <div className="w-full bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-[10px] font-mono text-slate-600 mb-6 truncate text-center">
            {currentUrl}
          </div>

          {/* Action Buttons Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              id="copy-link-qr-btn"
              type="button"
              onClick={handleCopyLink}
              className={`py-3 px-3 rounded-2xl text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 border ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
              <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
            </button>

            <button
              id="download-qr-btn"
              type="button"
              onClick={handleDownloadQR}
              className="py-3 px-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 bg-[#ceff04] hover:bg-[#b8e600] text-[#1d1c2d] shadow-sm hover:shadow active:scale-95"
            >
              <i className="fas fa-download"></i>
              <span>Descargar</span>
            </button>

            <button
              id="share-whatsapp-qr-btn"
              type="button"
              onClick={handleShareWhatsApp}
              className="py-3 px-3 rounded-2xl text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-sm hover:shadow active:scale-95"
            >
              <i className="fab fa-whatsapp text-xs"></i>
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest">
          <span className="flex items-center">
            <i className="fas fa-lock mr-1.5 text-emerald-600"></i> SSL 256-BIT
          </span>
          <span>CAISHEN CAPITAL GROUP S.A.S.</span>
        </div>
      </div>
    </div>
  );
};
