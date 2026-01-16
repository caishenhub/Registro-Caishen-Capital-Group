
import React, { useState, useEffect } from 'react';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyVL2e0ZQGYIRTa99NaIE5MqyKlsiWZjGcpXNc13mExxzcfKyTwCdKx-xBjdiH4-LPJ_g/exec';
const LOGO_URL = 'https://i.ibb.co/zT3RhhT9/CAISHEN-NO-FONDO-AZUL-1.png';
const ACCENT_COLOR = '#ceff04'; // Verde Caishen
const PRIMARY_BLUE = '#1d1c2d'; // Azul Caishen

const generateUniqueCode = () => {
  const prefix = 'CCG';
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${random}`;
};

const SectionTitle: React.FC<{ number: string; title: string }> = ({ number, title }) => (
  <div className="flex items-center space-x-3 mb-6 pb-2 border-b-2 mt-10" style={{ borderColor: PRIMARY_BLUE }}>
    <span className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm shadow-sm shrink-0" style={{ backgroundColor: PRIMARY_BLUE }}>
      {number}
    </span>
    <h2 className="text-lg md:text-xl font-bold uppercase tracking-tight" style={{ color: PRIMARY_BLUE }}>{title}</h2>
  </div>
);

const InputField: React.FC<{
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  options?: string[];
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  readOnly?: boolean;
  pattern?: string;
  inputMode?: "numeric" | "text" | "tel" | "email" | "url" | "decimal" | "search" | "none";
}> = ({ label, name, placeholder, type = "text", required = true, options, value, onChange, readOnly = false, pattern, inputMode }) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block truncate">
        {label} {required && !readOnly && <span className="text-red-500 ml-1">*</span>}
      </label>
      {options ? (
        <div className="relative">
          <select 
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg outline-none transition-all appearance-none cursor-pointer text-slate-900 text-base md:text-sm shadow-sm focus:ring-2"
            style={{ 
              ['--tw-ring-color' as any]: ACCENT_COLOR,
              borderColor: value ? ACCENT_COLOR : '#cbd5e1' 
            }}
          >
            <option value="">Seleccione una opción</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
            <i className="fas fa-chevron-down text-xs"></i>
          </div>
        </div>
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          readOnly={readOnly}
          placeholder={placeholder}
          pattern={pattern}
          inputMode={inputMode}
          className={`px-4 py-3 border rounded-lg outline-none transition-all text-base md:text-sm shadow-sm focus:ring-2 ${
            readOnly 
              ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed font-mono' 
              : 'bg-white border-slate-300 text-slate-900'
          }`}
          style={!readOnly ? { 
            ['--tw-ring-color' as any]: ACCENT_COLOR,
            borderColor: value ? ACCENT_COLOR : '#cbd5e1'
          } : {}}
        />
      )}
    </div>
  );
};

const CheckboxField: React.FC<{ 
  label: string; 
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, name, checked, onChange }) => (
  <label className="flex items-start space-x-3 cursor-pointer group py-2">
    <div className="flex items-center h-5">
      <input 
        type="checkbox" 
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 rounded border-slate-300 focus:ring-offset-0 focus:ring-2 cursor-pointer transition-colors" 
        style={{ color: ACCENT_COLOR, ['--tw-ring-color' as any]: ACCENT_COLOR }}
      />
    </div>
    <span className="text-sm text-slate-600 leading-tight group-hover:text-slate-900 transition-colors select-none">
      {label}
    </span>
  </label>
);

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ip, setIp] = useState('Detectando...');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp('Protegida (Proxy)'));
  }, []);

  const initialState = {
    fecha_registro: new Date().toISOString().split('T')[0],
    codigo_registro: generateUniqueCode(),
    canal_ingreso: '',
    asesor_asignado: '',
    nombre_completo: '',
    tipo_documento: '',
    numero_documento: '',
    fecha_expedicion: '',
    fecha_nacimiento: '',
    nacionalidad: 'Colombiana',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: 'Colombia',
    actividad_economica: '',
    nivel_ingresos: '',
    origen_fondos: '',
    experiencia_inversion: '',
    objetivo_inversion: '',
    horizonte_inversion: '',
    tolerancia_riesgo: '',
    autoriza_tratamiento_datos: false,
    declara_origen_licito: false,
    declara_informacion_veraz: false,
    autoriza_kyc_biometria: false,
    firmante_nombre: ''
  };

  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleReset = () => {
    setFormData({
      ...initialState,
      codigo_registro: generateUniqueCode()
    });
    setSubmitted(false);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isFormValid = () => {
    return (
      formData.autoriza_tratamiento_datos &&
      formData.declara_origen_licito &&
      formData.declara_informacion_veraz &&
      formData.autoriza_kyc_biometria
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    if (!isFormValid()) {
      setError("Debe autorizar todas las declaraciones legales y el protocolo KYC para continuar.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({
          ...formData,
          ip_registro: ip,
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }),
      });

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error("Submit error:", err);
      setError("Error de comunicación. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 text-center animate-fade-in">
        <div className="bg-white p-10 rounded-3xl shadow-xl border-b-8" style={{ borderBottomColor: PRIMARY_BLUE }}>
          <div className="mb-8 flex justify-center">
            <img src={LOGO_URL} alt="Caishen Capital Group Logo" className="h-20 object-contain" />
          </div>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md" style={{ backgroundColor: ACCENT_COLOR }}>
            <i className="fas fa-check text-slate-900 text-2xl"></i>
          </div>
          <h1 className="text-2xl font-black mb-2 uppercase tracking-tight" style={{ color: PRIMARY_BLUE }}>Registro Recibido</h1>
          <p className="text-slate-500 text-sm mb-10 uppercase tracking-widest font-bold">Oficialía de Cumplimiento</p>
          
          <div className="bg-slate-50 p-8 rounded-2xl mb-8 border border-slate-200">
            <p className="text-[10px] text-slate-400 uppercase font-black mb-1 tracking-widest">ID Único de Radicado:</p>
            <p className="text-2xl font-mono font-bold tracking-widest" style={{ color: PRIMARY_BLUE }}>{formData.codigo_registro}</p>
          </div>
          
          <p className="text-slate-600 mb-10 text-sm leading-relaxed max-w-md mx-auto italic">
            "Su perfil institucional ha sido protocolizado. El departamento de cumplimiento iniciará el análisis de vinculación societaria."
          </p>

          <button 
            type="button"
            onClick={handleReset} 
            className="w-full text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-lg active:scale-95"
            style={{ backgroundColor: PRIMARY_BLUE }}
          >
            Realizar Nuevo Registro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-12 px-4 animate-fade-in">
      <header className="bg-white p-6 md:p-8 rounded-t-3xl shadow-sm border-b-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4 md:gap-0" style={{ borderBottomColor: PRIMARY_BLUE }}>
        <div className="flex flex-col items-center md:items-start space-y-2">
          <img src={LOGO_URL} alt="Caishen Capital Group Logo" className="h-12 md:h-14 object-contain" />
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.25em] uppercase pl-1">Protocolo Onboarding Digital</p>
        </div>
        
        <div className="flex items-center space-x-4 bg-slate-50/50 px-6 py-4 rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex flex-col items-center md:items-end">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1.5">Estatus Normativo</p>
            <div className="flex items-center bg-white px-3 py-1.5 rounded-full border border-slate-100 shadow-inner">
              <div className="relative mr-2.5">
                 <i className="fas fa-fingerprint text-[14px] leading-none" style={{ color: ACCENT_COLOR }}></i>
                 <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: ACCENT_COLOR }}></span>
                    <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: ACCENT_COLOR }}></span>
                 </span>
              </div>
              <span className="text-[12px] font-extrabold uppercase tracking-widest" style={{ color: PRIMARY_BLUE }}>KYC PROTOCOL</span>
            </div>
          </div>
        </div>
      </header>

      <main className="bg-white shadow-xl rounded-b-3xl p-6 md:p-12 mb-12">
        <form onSubmit={handleSubmit} className="space-y-10">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-xs font-bold uppercase rounded-xl border border-red-200">
              <i className="fas fa-exclamation-circle mr-2"></i> {error}
            </div>
          )}
          
          <SectionTitle number="1" title="Datos de Auditoría" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50 p-8 rounded-2xl border border-slate-100">
            <InputField label="Fecha Registro" name="fecha_registro" type="date" value={formData.fecha_registro} readOnly />
            <InputField label="ID de Radicado" name="codigo_registro" value={formData.codigo_registro} readOnly />
            <InputField label="Referencia" name="asesor_asignado" required={false} value={formData.asesor_asignado} onChange={handleInputChange} placeholder="Asesor/Canal" />
          </div>

          <SectionTitle number="2" title="Identificación del Titular" />
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center">
              <i className="fas fa-info-circle text-blue-500 mr-3"></i>
              <p className="text-xs font-bold text-blue-800 uppercase tracking-tight">
                Importante: Verifique que sus nombres y documento coincidan exactamente con su identificación legal. Esta información será cruzada en listas restrictivas.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <InputField label="Nombre Completo" name="nombre_completo" value={formData.nombre_completo} onChange={handleInputChange} placeholder="Nombres y Apellidos según documento" />
            </div>
            <InputField label="Tipo de Documento" name="tipo_documento" options={["Cédula de Ciudadanía", "Cédula de Extranjería", "Pasaporte", "Número de Identificación Tributaria (NIT)"]} value={formData.tipo_documento} onChange={handleInputChange} />
            <InputField label="Número de Documento" name="numero_documento" type="text" pattern="[0-9]*" inputMode="numeric" value={formData.numero_documento} onChange={handleInputChange} placeholder="Solo números" />
            <InputField label="Fecha Expedición" name="fecha_expedicion" type="date" value={formData.fecha_expedicion} onChange={handleInputChange} />
            <InputField label="Fecha Nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleInputChange} />
            <InputField label="Nacionalidad" name="nacionalidad" value={formData.nacionalidad} onChange={handleInputChange} placeholder="Ej: Colombiana" />
          </div>

          <SectionTitle number="3" title="Localización y Contacto" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Email Institucional / Personal" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            <InputField label="Teléfono Celular" name="telefono" value={formData.telefono} onChange={handleInputChange} />
            <div className="md:col-span-2">
              <InputField label="Dirección de Residencia" name="direccion" value={formData.direccion} onChange={handleInputChange} />
            </div>
            <InputField label="Ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} />
            <InputField label="País" name="pais" value={formData.pais} onChange={handleInputChange} />
          </div>

          <SectionTitle number="4" title="Información Financiera (USD)" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Actividad Económica" name="actividad_economica" options={["Directivo / Gerente", "Dueño de Empresa", "Consultor Senior", "Inversionista Profesional", "Otros"]} value={formData.actividad_economica} onChange={handleInputChange} />
            <InputField label="Ingresos Mensuales Aproximados (USD)" name="nivel_ingresos" options={["0 - 1.000 USD", "1.001 - 5.000 USD", "5.001 - 10.000 USD", "10.001 - 25.000 USD", "Más de 25.000 USD"]} value={formData.nivel_ingresos} onChange={handleInputChange} />
            <InputField label="Origen de los Fondos" name="origen_fondos" options={["Utilidades Operativas", "Ahorros Patrimoniales", "Venta de Activos Reales", "Liquidación de Dividendos"]} value={formData.origen_fondos} onChange={handleInputChange} />
            <InputField label="Experiencia en Mercados" name="experiencia_inversion" options={["Sin experiencia", "Básica", "Intermedia", "Experto / Institucional"]} value={formData.experiencia_inversion} onChange={handleInputChange} />
          </div>

          <SectionTitle number="5" title="Perfil de Socio Potencial" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InputField label="Tolerancia al Riesgo" name="tolerancia_riesgo" options={["Bajo / Conservador", "Medio / Moderado", "Alto / Agresivo"]} value={formData.tolerancia_riesgo} onChange={handleInputChange} />
            <InputField label="Horizonte de Tiempo" name="horizonte_inversion" options={["Corto Plazo", "Mediano Plazo", "Largo Plazo"]} value={formData.horizonte_inversion} onChange={handleInputChange} />
            <InputField label="Objetivo de Asociación" name="objetivo_inversion" options={["Expansión de Capital Corporativo", "Participación en Equity", "Crecimiento Patrimonial", "Diversificación de Negocios"]} value={formData.objetivo_inversion} onChange={handleInputChange} />
          </div>

          <SectionTitle number="6" title="Cumplimiento Legal" />
          <div className="space-y-2 bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
            <CheckboxField name="autoriza_tratamiento_datos" checked={formData.autoriza_tratamiento_datos} onChange={handleInputChange} label="Autorizo tratamiento de datos personales conforme a la Ley 1581 de 2012." />
            <CheckboxField name="declara_origen_licito" checked={formData.declara_origen_licito} onChange={handleInputChange} label="Certifico el origen lícito de mis fondos bajo la gravedad de juramento." />
            <CheckboxField name="declara_informacion_veraz" checked={formData.declara_informacion_veraz} onChange={handleInputChange} label="Confirmo que toda la información suministrada es verídica y verificable." />
          </div>

          <SectionTitle number="7" title="Validación KYC y Biometría" />
          <div className="p-8 rounded-2xl border border-slate-700 shadow-inner" style={{ backgroundColor: PRIMARY_BLUE }}>
            <div className="mb-6 border-b border-slate-700 pb-4">
              <h3 className="text-white text-sm font-bold uppercase tracking-wider">Protocolo de Identidad Digital</h3>
              <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                Caishen Capital Group emplea sistemas avanzados de validación biométrica para garantizar la seguridad de sus operaciones y prevenir riesgos de suplantación o fraude societario.
              </p>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-start space-x-4 cursor-pointer group py-2">
                <div className="flex items-center h-6">
                  <input 
                    type="checkbox" 
                    name="autoriza_kyc_biometria"
                    checked={formData.autoriza_kyc_biometria}
                    onChange={handleInputChange}
                    className="w-5 h-5 rounded border-slate-600 bg-slate-800 focus:ring-offset-0 focus:ring-2 cursor-pointer transition-colors"
                    style={{ color: ACCENT_COLOR, ['--tw-ring-color' as any]: ACCENT_COLOR }}
                  />
                </div>
                <span className="text-[12px] text-slate-300 leading-tight group-hover:text-white transition-colors select-none">
                  Acepto el protocolo de validación KYC y autorizo el cruce de mis datos en centrales de riesgo y listas restrictivas internacionales (OFAC, ONU, etc.).
                </span>
              </label>
            </div>
          </div>

          <div className="pt-8 flex flex-col items-center border-t-2" style={{ borderColor: PRIMARY_BLUE }}>
            <div className="w-full mb-8">
              <InputField label="Firma de Aceptación (Escriba su Nombre Completo)" name="firmante_nombre" value={formData.firmante_nombre} onChange={handleInputChange} placeholder="Firma electrónica institucional" />
            </div>
            
            <button 
              type="submit" 
              disabled={loading || !isFormValid()} 
              className={`w-full md:w-auto min-w-[320px] text-slate-900 px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl ${loading || !isFormValid() ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:-translate-y-1 active:scale-95 cursor-pointer'}`}
              style={{ backgroundColor: ACCENT_COLOR }}
            >
              {loading ? 'Validando Credenciales...' : 'Protocolizar Onboarding'}
            </button>
            {!isFormValid() && (
              <p className="mt-4 text-[10px] text-red-500 font-bold uppercase tracking-widest text-center">
                * Debe completar las autorizaciones de las secciones 6 y 7 para habilitar el envío.
              </p>
            )}
            <p className="mt-8 text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center max-w-lg leading-relaxed italic">
              Este formulario no constituye oferta pública ni contrato de inversión. Es un protocolo de debida diligencia privado.
            </p>
          </div>
        </form>
      </main>

      <footer className="text-[10px] text-slate-400 text-center uppercase pb-12 tracking-[0.3em] space-y-6">
        <div className="flex justify-center opacity-60 hover:opacity-100 transition-opacity duration-500">
           <img src={LOGO_URL} alt="Footer Logo" className="h-10 object-contain grayscale" />
        </div>
        <p className="font-bold">© 2026 CAISHEN CAPITAL GROUP S.A.S. | OFICIALÍA DE CUMPLIMIENTO</p>
      </footer>
    </div>
  );
};

export default App;
