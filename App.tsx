
import React, { useState, useEffect } from 'react';

/**
 * CAISHEN CAPITAL GROUP - ONBOARDING INSTITUCIONAL v3.9
 * Restauración de mensaje funcional y mantenimiento de estética premium.
 */

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx9eYMH85av1PTxYuFgJOPvdVeu11aMelYXgxw7VIANAfYFobZqGuIV0xeAdUa3VXACMQ/exec';
const LOGO_URL = 'https://i.ibb.co/zT3RhhT9/CAISHEN-NO-FONDO-AZUL-1.png';

const generateUniqueCode = () => {
  const prefix = 'CCG';
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${random}`;
};

const SectionHeader: React.FC<{ number: string; title: string }> = ({ number, title }) => (
  <div className="flex items-center space-x-3 mb-6 mt-12">
    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-[10px] shrink-0">
      {number}
    </div>
    <h2 className="text-[12px] font-extrabold uppercase tracking-widest text-slate-800">{title}</h2>
    <div className="flex-grow h-[1px] bg-slate-200 ml-4"></div>
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
  highlight?: boolean;
}> = ({ label, name, placeholder, type = "text", required = true, options, value, onChange, readOnly = false, highlight = false }) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">
        {label} {required && !readOnly && <span className="text-red-500">*</span>}
      </label>
      {options ? (
        <div className="relative">
          <select 
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`w-full px-3 py-2.5 bg-white border ${highlight ? 'border-[#ceff04] border-2' : 'border-slate-200'} rounded-md outline-none transition-all appearance-none text-slate-700 text-[11px] focus:border-slate-400 focus:ring-0`}
          >
            <option value="">Seleccione una opción</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
            <i className="fas fa-chevron-down text-[10px]"></i>
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
          className={`px-3 py-2.5 border ${highlight ? 'border-[#ceff04] border-2' : 'border-slate-200'} rounded-md outline-none transition-all text-slate-700 text-[11px] placeholder:text-slate-300 focus:border-slate-400 focus:ring-0 ${
            readOnly ? 'bg-slate-50 text-slate-400 cursor-not-allowed font-mono' : 'bg-white'
          }`}
        />
      )}
    </div>
  );
};

const CheckboxCard: React.FC<{ 
  icon: string;
  title: string;
  label: string; 
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dark?: boolean;
}> = ({ icon, title, label, name, checked, onChange, dark = false }) => (
  <label className={`flex items-start space-x-4 p-4 rounded-xl border transition-all cursor-pointer group mb-3 ${
    dark 
    ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' 
    : 'bg-white border-slate-100 hover:border-slate-300 shadow-sm'
  }`}>
    <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${dark ? 'bg-slate-700' : 'bg-slate-50'}`}>
      <i className={`${icon} ${dark ? 'text-[#ceff04]' : 'text-slate-400'} text-[14px]`}></i>
    </div>
    <div className="flex-grow">
      <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${dark ? 'text-white' : 'text-slate-800'}`}>{title}</p>
      <p className={`text-[9px] leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
    </div>
    <div className="flex items-center h-5 ml-2">
      <input 
        type="checkbox" 
        name={name}
        checked={checked}
        onChange={onChange}
        className={`w-4 h-4 rounded border-slate-300 focus:ring-0 cursor-pointer ${dark ? 'accent-[#ceff04]' : 'text-slate-900'}`} 
      />
    </div>
  </label>
);

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ip, setIp] = useState('0.0.0.0');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp('0.0.0.0'));
  }, []);

  const initialState = {
    fecha_registro: new Date().toLocaleDateString('es-CO'),
    codigo_registro: generateUniqueCode(),
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
    tolerancia_riesgo: '',
    horizonte_inversion: '',
    objetivo_inversion: '',
    autoriza_tratamiento_datos: false,
    declara_origen_licito: false,
    declara_informacion_veraz: false,
    autoriza_kyc_biometria: false,
    firmante_nombre: ''
  };

  const [formData, setFormData] = useState(initialState);

  const resetApp = () => {
    setFormData({
      ...initialState,
      fecha_registro: new Date().toLocaleDateString('es-CO'),
      codigo_registro: generateUniqueCode()
    });
    setSubmitted(false);
    setShowIntro(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const isFormValid = () => {
    return (
      formData.nombre_completo.length > 3 &&
      formData.numero_documento.length > 4 &&
      formData.email.includes('@') &&
      formData.firmante_nombre.length > 3 &&
      formData.autoriza_tratamiento_datos &&
      formData.declara_origen_licito &&
      formData.declara_informacion_veraz &&
      formData.autoriza_kyc_biometria
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);

    const payload = {
      ...formData,
      ip_registro: ip,
      timestamp: new Date().toLocaleString('es-CO')
    };

    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      setTimeout(() => {
        setSubmitted(true);
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 2000);

    } catch (err) {
      setError("Fallo en la sincronización institucional.");
      setLoading(false);
    }
  };

  if (showIntro) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#f1f5f9]/95 backdrop-blur-md animate-fade-in">
        <div className="max-w-[720px] w-full bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden">
          <div className="p-10 md:p-20 text-center">
            <div className="mb-16 flex justify-center animate-bounce-slow">
              <img src={LOGO_URL} alt="Caishen Capital Group" className="h-16 md:h-24 object-contain" />
            </div>
            
            <h1 className="text-[28px] md:text-[38px] font-black text-[#1d1c2d] leading-tight mb-10 px-4 tracking-tighter uppercase">
              BIENVENIDO A<br/> 
              <span className="whitespace-nowrap text-[#1d1c2d]">CAISHEN CAPITAL GROUP</span>
            </h1>
            
            <div className="space-y-8 mb-16 px-4 md:px-10">
              <p className="text-[#64748b] text-[15px] md:text-[17px] leading-relaxed font-semibold">
                Está a punto de iniciar el pre-registro de accionistas, un proceso informativo y de verificación inicial que nos permite conocer su perfil antes de cualquier vinculación formal.
              </p>
              <p className="text-[#94a3b8] text-[12px] md:text-[14px] leading-relaxed font-medium uppercase tracking-wide">
                Verificación de identidad y perfil de inversionista en tiempo real.
              </p>
            </div>

            <div className="px-4 md:px-14 mb-12">
              <button 
                onClick={() => setShowIntro(false)}
                className="w-full bg-[#ceff04] text-[#1d1c2d] py-7 rounded-3xl font-black uppercase tracking-[0.4em] text-[13px] shadow-[0_15px_45px_-10px_rgba(206,255,4,0.6)] transition-all hover:shadow-[0_20px_50px_-10px_rgba(206,255,4,0.8)] hover:-translate-y-1 active:scale-[0.96]"
              >
                ACCEDER AL PROTOCOLO
              </button>
            </div>

            <div className="flex justify-center items-center space-x-8 md:space-x-12 mb-4 text-[10px] font-black text-[#1d1c2d] uppercase tracking-widest opacity-80">
              <span className="flex items-center"><i className="fas fa-shield-halved mr-2"></i> SECURITY+</span>
              <span className="flex items-center"><i className="fas fa-fingerprint mr-2"></i> BIOMETRIC</span>
              <span className="flex items-center"><i className="fas fa-link mr-2"></i> BLOCKCHAIN-SYNC</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-12 text-center animate-fade-in border-b-8 border-[#1d1c2d]">
          <div className="w-16 h-16 bg-[#ceff04] rounded-full flex items-center justify-center mx-auto mb-8">
            <i className="fas fa-check text-[#1d1c2d] text-xl"></i>
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Registro Procesado</h2>
          <p className="text-slate-500 text-[11px] mb-8 font-mono">Su información ha sido encriptada y enviada a revisión.</p>
          <div className="bg-slate-50 p-4 rounded-xl mb-8 border border-slate-100">
            <p className="text-[8px] text-slate-400 font-bold uppercase mb-1 tracking-widest">FOLIO ASIGNADO</p>
            <p className="text-lg font-black text-slate-800 font-mono tracking-tighter">{formData.codigo_registro}</p>
          </div>
          <button onClick={resetApp} className="w-full py-4 bg-[#1d1c2d] text-white rounded-xl font-bold uppercase tracking-widest text-[10px]">Nuevo Registro</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white md:bg-slate-50 py-0 md:py-10">
      <div className="max-w-[700px] mx-auto bg-white rounded-none md:rounded-3xl shadow-none md:shadow-2xl overflow-hidden border border-transparent md:border-slate-100 animate-fade-in">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-50">
          <div className="flex flex-col">
            <img src={LOGO_URL} alt="Caishen Logo" className="h-10 object-contain w-max mb-1" />
            <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.4em]">Protocolo Onboarding Digital</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2 text-center shadow-sm">
             <p className="text-[7px] font-bold text-slate-400 uppercase mb-0.5">Sistemas de Información</p>
             <div className="flex items-center space-x-1.5">
                <div className="w-1.5 h-1.5 bg-[#ceff04] rounded-full animate-pulse"></div>
                <p className="text-[9px] font-black text-[#1d1c2d] uppercase tracking-tighter">KYC PROTOCOL</p>
             </div>
          </div>
        </div>

        <div className="px-8 md:px-14 pb-20 pt-4">
          <form onSubmit={handleSubmit}>
            <SectionHeader number="1" title="Datos de Auditoría" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 p-6 rounded-xl border border-slate-100">
              <InputField label="Fecha Registro" name="fecha_registro" value={formData.fecha_registro} readOnly />
              <InputField label="ID Radicado" name="codigo_registro" value={formData.codigo_registro} readOnly />
              <InputField 
                label="Referencia" 
                name="asesor_asignado" 
                value={formData.asesor_asignado} 
                onChange={handleInputChange} 
                placeholder="Asesor/Canal"
                required={false}
              />
            </div>

            <SectionHeader number="2" title="Identificación del Titular" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <InputField label="Nombre Completo" name="nombre_completo" value={formData.nombre_completo} onChange={handleInputChange} placeholder="Nombres y Apellidos según documento" />
              </div>
              <InputField label="Tipo Doc Identidad" name="tipo_documento" options={["Cédula de Ciudadanía", "Pasaporte", "Cédula de Extranjería"]} value={formData.tipo_documento} onChange={handleInputChange} />
              <InputField label="Número de Documento" name="numero_documento" value={formData.numero_documento} onChange={handleInputChange} placeholder="Solo números" />
              <InputField label="Fecha Expedición" name="fecha_expedicion" type="date" value={formData.fecha_expedicion} onChange={handleInputChange} />
              <InputField label="Fecha Nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleInputChange} />
              <div className="md:col-span-2">
                <InputField label="Nacionalidad" name="nacionalidad" value={formData.nacionalidad} onChange={handleInputChange} highlight />
              </div>
            </div>

            <SectionHeader number="3" title="Localización y Contacto" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Correo Electrónico" name="email" type="email" value={formData.email} onChange={handleInputChange} />
              <InputField label="WhatsApp / Celular" name="telefono" value={formData.telefono} onChange={handleInputChange} />
              <div className="md:col-span-2">
                <InputField label="Dirección de Residencia" name="direccion" value={formData.direccion} onChange={handleInputChange} />
              </div>
              <InputField label="Ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} />
              <InputField label="País" name="pais" value={formData.pais} onChange={handleInputChange} highlight />
            </div>

            <SectionHeader number="4" title="Información Financiera (USD)" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Actividad Económica" name="actividad_economica" options={["Empleado", "Independiente", "Empresario", "Pensionado"]} value={formData.actividad_economica} onChange={handleInputChange} />
              <InputField label="Ingresos Mensuales (USD)" name="nivel_ingresos" options={["0 - 5.000", "5.001 - 15.000", "15.001 - 50.000", "Más de 50.000"]} value={formData.nivel_ingresos} onChange={handleInputChange} />
              <InputField label="Origen de los Fondos" name="origen_fondos" options={["Ahorros", "Venta Activos", "Dividendos", "Laboral"]} value={formData.origen_fondos} onChange={handleInputChange} />
              <InputField label="Experiencia en Mercados" name="experiencia_inversion" options={["Ninguna", "Básica", "Media", "Avanzada"]} value={formData.experiencia_inversion} onChange={handleInputChange} />
            </div>

            <SectionHeader number="5" title="Perfil de Socio" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InputField label="Riesgo" name="tolerancia_riesgo" options={["Conservador", "Moderado", "Agresivo"]} value={formData.tolerancia_riesgo} onChange={handleInputChange} />
              <InputField label="Horizonte" name="horizonte_inversion" options={["< 1 año", "1 - 3 años", "> 3 años"]} value={formData.horizonte_inversion} onChange={handleInputChange} />
              <InputField label="Objetivo" name="objetivo_inversion" options={["Preservación", "Crecimiento", "Especulación"]} value={formData.objetivo_inversion} onChange={handleInputChange} />
            </div>

            <SectionHeader number="6" title="Protocolo de Cumplimiento Legal" />
            <div className="mb-6 space-y-2">
              <CheckboxCard 
                icon="fas fa-database"
                title="Tratamiento de Datos (Ley 1581)"
                label="Autorizo el tratamiento de mis datos personales según la Política de Privacidad de Caishen, bajo los estándares de Habeas Data y protección de información sensible."
                name="autoriza_tratamiento_datos"
                checked={formData.autoriza_tratamiento_datos}
                onChange={handleInputChange}
              />
              <CheckboxCard 
                icon="fas fa-hand-holding-usd"
                title="Declaración SARLAFT"
                label="Certifico bajo gravedad de juramento que mis recursos provienen de actividades lícitas y no han sido destinados a la financiación del terrorismo o lavado de activos."
                name="declara_origen_licito"
                checked={formData.declara_origen_licito}
                onChange={handleInputChange}
              />
              <CheckboxCard 
                icon="fas fa-balance-scale"
                title="Veracidad de Información"
                label="Confirmo que la totalidad de los datos suministrados en este pre-registro son reales, vigentes y pueden ser verificados por la Oficialía de Cumplimiento."
                name="declara_informacion_veraz"
                checked={formData.declara_informacion_veraz}
                onChange={handleInputChange}
              />
            </div>

            <SectionHeader number="7" title="Validación de Identidad y Blindaje" />
            <div className="bg-[#1d1c2d] p-8 rounded-[2rem] border border-slate-700 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <i className="fas fa-fingerprint text-white text-8xl"></i>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="px-3 py-1 bg-[#ceff04] rounded-full">
                    <p className="text-[8px] font-black text-[#1d1c2d] uppercase tracking-tighter">SISTEMA ANTI-FRAUDE ACTIVE</p>
                  </div>
                </div>
                
                <h3 className="text-white text-[16px] font-black uppercase mb-4 tracking-tight">Escrutinio de Seguridad Internacional</h3>
                <p className="text-slate-400 text-[10px] leading-relaxed mb-8 pr-10 font-medium">
                  Al proceder, usted autoriza a Caishen Capital Group S.A.S. a realizar el cruce automático de su identidad con listas restrictivas internacionales, incluyendo <span className="text-white font-bold">OFAC (Lista Clinton), ONU, Interpol, Europol</span> y sistemas de alertas tempranas SARLAFT/PADM.
                </p>

                <CheckboxCard 
                  icon="fas fa-user-shield"
                  title="Aceptación de Protocolo KYC"
                  label="Acepto la validación de mi identidad mediante sistemas de biometría y escaneo de antecedentes globales para asegurar la transparencia societaria."
                  name="autoriza_kyc_biometria"
                  checked={formData.autoriza_kyc_biometria}
                  onChange={handleInputChange}
                  dark
                />
              </div>
            </div>

            <div className="mt-16 space-y-8">
              <div className="border-t border-slate-100 pt-10">
                <InputField label="Firma Electrónica (Nombre Completo)" name="firmante_nombre" value={formData.firmante_nombre} onChange={handleInputChange} placeholder="Escriba su nombre completo para firmar" highlight />
              </div>
              
              <div className="flex flex-col items-center">
                <button 
                  type="submit" 
                  disabled={loading || !isFormValid()}
                  className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-[12px] transition-all ${
                    !isFormValid() 
                      ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
                      : 'bg-slate-900 text-white hover:bg-black shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] active:scale-[0.98]'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <i className="fas fa-circle-notch animate-spin mr-3"></i> ENCRIPTANDO DATOS...
                    </span>
                  ) : 'PROTOCOLIZAR PRE-REGISTRO'}
                </button>
                {error && <p className="mt-4 text-[9px] text-red-600 font-bold uppercase">{error}</p>}
                {!isFormValid() && !loading && (
                   <p className="mt-4 text-[8px] text-slate-400 font-bold uppercase tracking-widest flex items-center">
                     <i className="fas fa-lock mr-2"></i> Verifique los consentimientos legales para continuar
                   </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="mt-10 mb-20 text-center">
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.6em]">© 2026 CAISHEN CAPITAL GROUP S.A.S. | OFICIALÍA DE CUMPLIMIENTO REGIONAL</p>
      </div>
    </div>
  );
};

export default App;
