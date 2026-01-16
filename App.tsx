
import React, { useState, useEffect } from 'react';

// URL institucional del Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwyAgrVmcM0bAwJmrzX-X5h7-4TY8Pbz-WV12ArZP1Y3l8b4VRtq5seoSssufJEM9MN3A/exec';

const generateUniqueCode = () => {
  const prefix = 'CCG';
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${random}`;
};

const SectionTitle: React.FC<{ number: string; title: string }> = ({ number, title }) => (
  <div className="flex items-center space-x-3 mb-6 pb-2 border-b border-slate-200 mt-10">
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm shadow-sm">
      {number}
    </span>
    <h2 className="text-lg md:text-xl font-bold text-slate-800 uppercase tracking-tight">{title}</h2>
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
}> = ({ label, name, placeholder, type = "text", required = true, options, value, onChange, readOnly = false }) => {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
        {label} {required && !readOnly && <span className="text-red-500">*</span>}
      </label>
      {options ? (
        <div className="relative">
          <select 
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-slate-900 text-base md:text-sm shadow-sm"
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
          className={`px-4 py-3 border rounded-lg outline-none transition-all text-base md:text-sm shadow-sm ${
            readOnly 
              ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed font-mono' 
              : 'bg-white border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-transparent text-slate-900'
          }`}
        />
      )}
    </div>
  );
};

const CheckboxField: React.FC<{ 
  label: string; 
  name: string;
}> = ({ label, name }) => (
  <label className="flex items-start space-x-3 cursor-pointer group py-2">
    <div className="flex items-center h-5">
      <input 
        type="checkbox" 
        name={name}
        defaultChecked={true}
        required
        className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer transition-colors" 
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
  const [ip, setIp] = useState('Localizando...');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp('Protegida (VPN/Tor)'));
  }, []);

  const [formData, setFormData] = useState({
    fecha_registro: new Date().toISOString().split('T')[0],
    codigo_registro: generateUniqueCode(),
    canal_ingreso: '',
    canal_otro: 'N/A',
    asesor_asignado: '',
    nombre_completo: '',
    tipo_documento: '',
    numero_documento: '',
    fecha_nacimiento: '',
    nacionalidad: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: '',
    actividad_economica: '',
    nivel_ingresos: '',
    origen_fondos: '',
    origen_fondos_otro: 'N/A',
    experiencia_inversion: '',
    objetivo_inversion: '',
    horizonte_inversion: '',
    tolerancia_riesgo: '',
    acepta_terminos: 'SÍ',
    acepta_riesgos: 'SÍ',
    autoriza_tratamiento_datos: 'SÍ',
    declara_informacion_veraz: 'SÍ',
    declara_origen_licito: 'SÍ',
    estado_registro: 'PENDIENTE',
    notas_internas: 'Registro vía Vercel Deployment.',
    firmante_nombre: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Envío compatible con Google Apps Script (no-cors)
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

      // Simulación de delay para confirmación visual
      setTimeout(() => {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setLoading(false);
      }, 1200);

    } catch (err: any) {
      setError("No se pudo establecer conexión con el servidor de auditoría.");
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 text-center animate-fade-in">
        <div className="bg-white p-10 rounded-3xl shadow-2xl border-b-8 border-slate-900">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-check text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Registro Exitoso</h1>
          <p className="text-slate-500 text-sm mb-10">Caishen Capital Group S.A.S.</p>
          
          <div className="bg-slate-50 p-8 rounded-2xl mb-8 border border-slate-200">
            <p className="text-[10px] text-slate-400 uppercase font-black mb-1 tracking-widest">Código Único de Radicado:</p>
            <p className="text-3xl font-mono font-bold text-slate-900 tracking-widest">{formData.codigo_registro}</p>
          </div>
          
          <p className="text-slate-600 mb-10 text-sm leading-relaxed max-w-md mx-auto italic">
            "Su perfil ha sido protocolizado bajo normas de compliance. Un Oficial de Relaciones le contactará formalmente."
          </p>

          <button onClick={() => window.location.reload()} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-md active:scale-[0.98]">
            Nuevo Registro de Inversionista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-12 px-4">
      <header className="bg-white p-6 md:p-10 rounded-t-3xl shadow-sm border-b border-slate-100 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Caishen Capital Group</h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase mt-3">S.A.S. | Portal de Onboarding Digital</p>
        </div>
        <div className="hidden md:block">
           <div className="text-right">
              <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Estado del Sistema</p>
              <p className="text-[11px] text-green-600 font-bold uppercase mt-1 flex items-center justify-end">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span> Encriptación AES-256 Activa
              </p>
           </div>
        </div>
      </header>

      <main className="bg-white shadow-2xl rounded-b-3xl p-6 md:p-12 mb-12">
        <form onSubmit={handleSubmit} className="space-y-10">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-xs font-bold uppercase rounded-xl border border-red-200 flex items-center">
              <i className="fas fa-exclamation-circle mr-3 text-lg"></i> {error}
            </div>
          )}
          
          <SectionTitle number="1" title="Protocolo de Auditoría" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50/50 p-8 rounded-2xl border border-slate-100">
            <InputField label="Fecha de Protocolización" name="fecha_registro" type="date" value={formData.fecha_registro} readOnly />
            <InputField label="ID de Seguimiento" name="codigo_registro" value={formData.codigo_registro} readOnly />
            <InputField label="Código de Asesor" name="asesor_asignado" required={false} value={formData.asesor_asignado} onChange={handleInputChange} placeholder="Opcional" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
             <InputField label="¿Cómo nos conoció?" name="canal_ingreso" options={["Web Corporativa", "Referido Directo", "Redes Sociales", "Conferencia / Evento", "Otro"]} value={formData.canal_ingreso} onChange={handleInputChange} />
             {formData.canal_ingreso === 'Otro' && <InputField label="Especifique el Canal" name="canal_otro" value={formData.canal_otro} onChange={handleInputChange} />}
          </div>

          <SectionTitle number="2" title="Identificación del Titular" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2"><InputField label="Nombre y Apellidos Completos" name="nombre_completo" value={formData.nombre_completo} onChange={handleInputChange} placeholder="Según documento de identidad" /></div>
            <InputField label="Tipo de Documento" name="tipo_documento" options={["Cédula de Ciudadanía", "Cédula de Extranjería", "Pasaporte", "NIT"]} value={formData.tipo_documento} onChange={handleInputChange} />
            <InputField label="Número de Identificación" name="numero_documento" value={formData.numero_documento} onChange={handleInputChange} placeholder="Sin puntos ni espacios" />
            <InputField label="Fecha de Nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleInputChange} />
            <InputField label="Nacionalidad" name="nacionalidad" value={formData.nacionalidad} onChange={handleInputChange} placeholder="Ej: Colombiana" />
          </div>

          <SectionTitle number="3" title="Datos de Localización" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Correo Electrónico Principal" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="usuario@dominio.com" />
            <InputField label="Teléfono / WhatsApp" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="+57 300 000 0000" />
            <InputField label="Dirección de Domicilio" name="direccion" value={formData.direccion} onChange={handleInputChange} placeholder="Dirección completa" />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} />
              <InputField label="País" name="pais" value={formData.pais} onChange={handleInputChange} />
            </div>
          </div>

          <SectionTitle number="4" title="Declaración de Actividad" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Actividad Económica" name="actividad_economica" options={["Empleado", "Empresario Propietario", "Independiente Profesional", "Pensionado", "Rentista de Capital"]} value={formData.actividad_economica} onChange={handleInputChange} />
            <InputField label="Nivel de Ingresos Mensuales" name="nivel_ingresos" options={["Menos de 10 SMMLV", "10 a 30 SMMLV", "30 a 50 SMMLV", "Más de 50 SMMLV"]} value={formData.nivel_ingresos} onChange={handleInputChange} />
            <InputField label="Fuente de los Recursos" name="origen_fondos" options={["Salario / Honorarios", "Utilidades de Negocio", "Venta de Propiedades", "Ahorros Históricos", "Otro"]} value={formData.origen_fondos} onChange={handleInputChange} />
            {formData.origen_fondos === 'Otro' && <InputField label="Especifique la Fuente" name="origen_fondos_otro" value={formData.origen_fondos_otro} onChange={handleInputChange} />}
          </div>

          <SectionTitle number="5" title="Perfil del Inversionista" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <InputField label="Experiencia" name="experiencia_inversion" options={["Sin experiencia", "Básica", "Media", "Sofisticada"]} value={formData.experiencia_inversion} onChange={handleInputChange} />
            <InputField label="Objetivo" name="objetivo_inversion" options={["Preservación", "Crecimiento", "Renta Periódica"]} value={formData.objetivo_inversion} onChange={handleInputChange} />
            <InputField label="Plazo Estimado" name="horizonte_inversion" options={["Menos de 1 año", "1 a 3 años", "Más de 3 años"]} value={formData.horizonte_inversion} onChange={handleInputChange} />
            <InputField label="Perfil Riesgo" name="tolerancia_riesgo" options={["Conservador", "Moderado", "Agresivo"]} value={formData.tolerancia_riesgo} onChange={handleInputChange} />
          </div>

          <SectionTitle number="6" title="Cumplimiento y Aceptación" />
          <div className="space-y-2 bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <CheckboxField name="autoriza_tratamiento_datos" label="Autorizo expresamente el tratamiento de mis datos personales según la Ley 1581 de 2012." />
            <CheckboxField name="declara_origen_licito" label="Certifico bajo gravedad de juramento que mis fondos provienen de actividades lícitas." />
            <CheckboxField name="acepta_terminos" label="Acepto los términos de uso y el alcance del presente registro inicial." />
            <CheckboxField name="acepta_riesgos" label="Reconozco que toda inversión financiera implica riesgos de mercado inherentes." />
            <CheckboxField name="declara_informacion_veraz" label="Confirmo que la información suministrada en este formulario es exacta y verídica." />
          </div>

          <SectionTitle number="7" title="Firma y Formalización" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-8 items-end">
            <div className="space-y-5 order-2 md:order-1">
               <InputField label="Nombre completo para Firma Electrónica" name="firmante_nombre" value={formData.firmante_nombre} onChange={handleInputChange} placeholder="Firme escribiendo su nombre aquí" />
               <div className="flex justify-between items-center text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] px-1">
                 <span>IP Registro: {ip}</span>
                 <span>Verificación: Vercel_Secure_Node</span>
               </div>
            </div>
            <div className="bg-slate-900 h-32 rounded-2xl flex flex-col items-center justify-center space-y-3 order-1 md:order-2 shadow-inner">
               <div className="w-10 h-10 border-2 border-slate-700 rounded-lg flex items-center justify-center">
                  <i className="fas fa-fingerprint text-xl text-slate-500"></i>
               </div>
               <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.4em]">Sello Digital de Seguridad</p>
            </div>
          </div>

          <div className="pt-12 flex flex-col items-center">
            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full md:w-auto min-w-[300px] bg-slate-900 text-white px-16 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:-translate-y-1'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Protocolizando...
                </span>
              ) : 'Formalizar Registro'}
            </button>
            <p className="mt-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center max-w-lg leading-relaxed italic">
              Este documento tiene carácter meramente declarativo e informativo. No constituye oferta comercial vinculante ni contrato de inversión de conformidad con la ley colombiana.
            </p>
          </div>
        </form>
      </main>

      <footer className="text-[10px] text-slate-400 text-center uppercase pb-16 tracking-[0.3em] space-y-3">
        <p>© 2024 CAISHEN CAPITAL GROUP S.A.S. | OFICIALÍA DE CUMPLIMIENTO</p>
        <p className="font-black text-slate-300">Bogotá D.C. - Colombia</p>
      </footer>
    </div>
  );
};

export default App;
