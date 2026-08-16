import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeCardProps {
  url: string;
  title?: string;
  folioCode?: string;
  description?: string;
  badgeLabel?: string;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({
  url,
  title = 'Continuar en Dispositivo Móvil',
  folioCode,
  description = 'Escanee este código QR con la cámara de su teléfono para continuar el proceso.',
  badgeLabel = 'ACCESO DIRECTO'
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-50/90 rounded-[2rem] p-5 md:p-6 border border-slate-200/80 shadow-inner flex flex-col items-center text-center">
      <div className="inline-flex items-center space-x-1.5 bg-[#1d1c2d] text-[#ceff04] text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-4 shadow-sm">
        <i className="fas fa-qrcode text-[9px]"></i>
        <span>{badgeLabel}</span>
      </div>

      <div className="p-3.5 bg-white rounded-2xl border-2 border-slate-100 shadow-md mb-3 hover:scale-105 transition-transform duration-300">
        <QRCodeSVG
          value={url}
          size={140}
          level="H"
          includeMargin={false}
          fgColor="#1d1c2d"
          bgColor="#ffffff"
        />
      </div>

      {folioCode && (
        <div className="text-[10px] font-mono font-bold text-slate-800 bg-white px-3 py-1 rounded-lg border border-slate-200 mb-2">
          {folioCode}
        </div>
      )}

      <p className="text-[11px] font-black uppercase tracking-tight text-slate-800 mb-1">
        {title}
      </p>
      <p className="text-[9px] text-slate-500 font-medium leading-relaxed max-w-[280px] mb-3">
        {description}
      </p>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={handleCopy}
          className="text-[9px] font-bold uppercase tracking-wider text-slate-600 bg-white hover:bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs transition-all flex items-center space-x-1.5"
        >
          <i className={`fas ${copied ? 'fa-check text-emerald-600' : 'fa-link'}`}></i>
          <span>{copied ? 'Enlace Copiado' : 'Copiar URL'}</span>
        </button>
      </div>
    </div>
  );
};
