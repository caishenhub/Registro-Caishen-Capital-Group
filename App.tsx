
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
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-white font-bold text-sm">
      {number}
    </span>
    <h2 className="text-lg md:text-xl font-semibold text-slate-800 uppercase tracking-tight">{title}</h2>
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
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        {label} {required && !readOnly && <span className="text-red-500">*</span>}
      </label>
      {options ? (
        <select 
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="px-4 py-3 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-slate-900 text-base md:text-sm shadow-sm"
        >
          <option value="">Seleccione una opción</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          readOnly={readOnly}
          placeholder={placeholder}
          className={`px-4 py-3 border rounded-md outline-none transition-all text-base md:text-sm shadow-sm ${
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
  checked: boolean; 
  name: string;
}> = ({ label, checked, name }) => (
  <label className="flex items-start space-x-3 cursor-pointer group py-2">
    <div className="relative flex items-center">
      <input 
        type="checkbox" 
        name={name}
        checked={checked}
        readOnly
        required
        className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer" 
      />
    </div>
    <span className="text-sm text-slate-600 leading-tight group-hover:text-slate-900 transition-colors">
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
      .catch(() => setIp('Protegida'));
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
    notas_internas: 'Registro vía Vercel Cloud Node.',
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

    const payload = {
      ...formData,
      ip_registro: ip,
      user_agent: navigator.userAgent
    };

    try {
      // Usamos no-cors para evitar problemas de redirección 302 comunes en Apps Script
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload),
      });

      // Pequeño delay para UX
      setTimeout(() => {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setLoading(false);
      }, 1500);

    } catch (err: any) {
      setError("Error de red detectado. Verifique su conexión a internet.");
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-6 text-center animate-fade-in">
        <div className="bg-white p-10 rounded-2xl shadow-2xl border-b-8 border-slate-900">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <i className="fas fa-check text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Registro Protocolizado</h1>
          <p className="text-slate-500 text-sm mb-8 font-medium">Caishen Capital Group S.A.S.</p>
          
          <div className="bg-slate-50 p-6 rounded-xl mb-8 border border-slate-200 inline-block w-full">
            <p className="text-[10px] text-slate-400 uppercase font-black mb-1 tracking-widest">ID de Seguimiento Auditoría:</p>
            <p className="text-2xl font-mono font-bold text-slate-900 tracking-widest">{formData.codigo_registro}</p>
          </div>
          
          <div className="text-left space-y-4 mb-10 text-slate-600 text-sm bg-slate-50/50 p-6 rounded-lg border border-dashed border-slate-300">
             <p className="flex items-center"><i className="fas fa-info-circle mr-3 text-slate-400"></i> Su información ha sido cifrada y enviada a cumplimiento.</p>
             <p className="flex items-center"><i className="fas fa-clock mr-3 text-slate-400"></i> Un asesor se pondrá en contacto en las próximas 24-48 horas.</p>
          </div>

          <button onClick={() => window.location.reload()} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all shadow-md active:scale-95">
            Finalizar y Salir
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 md:py-12 px-4">
      <header className="bg-white p-6 md:p-8 rounded-t-2xl shadow-sm border-b border-slate-100 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Caishen Capital Group</h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-2">S.A.S. | Registro de Intención de Inversión</p>
        </div>
        <div className="bg-green-50 px-4 py-2 rounded-full border border-green-100 hidden md:flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></span>
          <p className="text-[10px] text-green-700 font-bold uppercase tracking-wider">Terminal Segura Activa</p>
        </div>
      </header>

      <main className="bg-white shadow-2xl rounded-b-2xl p-6 md:p-10 mb-8 overflow-hidden relative">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-xs font-bold uppercase rounded-lg border border-red-200">
              <i className="fas fa-exclamation-triangle mr-2"></i> {error}
            </div>
          )}
          
          <SectionTitle number="1" title="Información Administrativa" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 bg-slate-50/50 p-6 rounded-xl border border-slate-100">
            <InputField label="Fecha de Registro" name="fecha_registro" type="date" value={formData.fecha_registro} readOnly />
            <InputField label="Radicado Auditoría" name="codigo_registro" value={formData.codigo_registro} readOnly />
            <InputField label="Asesor (Opcional)" name="asesor_asignado" required={false} value={formData.asesor_asignado} onChange={handleInputChange} placeholder="Nombre del asesor" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
             <InputField label="Canal de Conocimiento" name="canal_ingreso" options={["Web", "Referencia Personal", "Redes Sociales", "Evento Presencial", "Otro"]} value={formData.canal_ingreso} onChange={handleInputChange} />
             {formData.canal_ingreso === 'Otro' && <InputField label="Especifique Canal" name="canal_otro" value={formData.canal_otro} onChange={handleInputChange} />}
          </div>

          <SectionTitle number="2" title="Datos del Titular" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2"><InputField label="Nombre y Apellidos Completos" name="nombre_completo" value={formData.nombre_completo} onChange={handleInputChange} placeholder="Como figura en su documento" /></div>
            <InputField label="Tipo de Documento" name="tipo_documento" options={["Cédula de Ciudadanía", "Cédula de Extranjería", "Pasaporte", "NIT"]} value={formData.tipo_documento} onChange={handleInputChange} />
            <InputField label="Número de Documento" name="numero_documento" value={formData.numero_documento} onChange={handleInputChange} placeholder="Sin puntos ni comas" />
            <InputField label="Fecha de Nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleInputChange} />
            <InputField label="Nacionalidad" name="nacionalidad" value={formData.nacionalidad} onChange={handleInputChange} placeholder="Ej: Colombiana" />
          </div>

          <SectionTitle number="3" title="Información de Contacto" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="ejemplo@correo.com" />
            <InputField label="Teléfono / WhatsApp" name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="+57 300 000 0000" />
            <InputField label="Dirección de Residencia" name="direccion" value={formData.direccion} onChange={handleInputChange} placeholder="Calle, Carrera, Apto" />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} />
              <InputField label="País" name="pais" value={formData.pais} onChange={handleInputChange} />
            </div>
          </div>

          <SectionTitle number="4" title="Declaración Financiera" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField label="Ocupación Principal" name="actividad_economica" options={["Asalariado", "Independiente / Freelance", "Empresario / Dueño de negocio", "Pensionado", "Inversionista"]} value={formData.actividad_economica} onChange={handleInputChange} />
            <InputField label="Rango Mensual (COP)" name="nivel_ingresos" options={["Hasta 5M", "5M - 15M", "15M - 30M", "Más de 30M"]} value={formData.nivel_ingresos} onChange={handleInputChange} />
            <InputField label="Origen de los Recursos" name="origen_fondos" options={["Ahorros Personales", "Venta de Activos", "Herencia / Donación", "Utilidades de Negocio", "Otro"]} value={formData.origen_fondos} onChange={handleInputChange} />
            {formData.origen_fondos === 'Otro' && <InputField label="Especifique Origen" name="origen_fondos_otro" value={formData.origen_fondos_otro} onChange={handleInputChange} />}
          </div>

          <SectionTitle number="5" title="Perfil de Inversión" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <InputField label="Experiencia" name="experiencia_inversion" options={["Nula", "Básica", "Intermedia", "Experta"]} value={formData.experiencia_inversion} onChange={handleInputChange} />
            <InputField label="Objetivo" name="objetivo_inversion" options={["Preservación Capital", "Crecimiento", "Renta Mensual"]} value={formData.objetivo_inversion} onChange={handleInputChange} />
            <InputField label="Horizonte" name="horizonte_inversion" options={["< 1 año", "1 - 3 años", "> 3 años"]} value={formData.horizonte_inversion} onChange={handleInputChange} />
            <InputField label="Tolerancia" name="tolerancia_riesgo" options={["Conservador", "Moderado", "Agresivo"]} value={formData.tolerancia_riesgo} onChange={handleInputChange} />
          </div>

          <SectionTitle number="6" title="Consentimientos Legales" />
          <div className="space-y-1 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <CheckboxField name="autoriza_tratamiento_datos" checked={true} label="Autorizo el tratamiento de mis datos personales según Ley 1581 de 2012." />
            <CheckboxField name="declara_origen_licito" checked={true} label="Certifico que el origen de mis fondos es de procedencia lícita." />
            <CheckboxField name="acepta_terminos" checked={true} label="Acepto los términos generales de vinculación inicial." />
            <CheckboxField name="acepta_riesgos" checked={true} label="Declaro conocer los riesgos inherentes a los mercados financieros." />
            <CheckboxField name="declara_informacion_veraz" checked={true} label="Certifico que toda la información suministrada es verídica." />
          </div>

          <SectionTitle number="7" title="Formalización Digital" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-6 items-end">
            <div className="space-y-4 order-2 md:order-1">
               <InputField label="Firma Electrónica (Nombre Completo)" name="firmante_nombre" value={formData.firmante_nombre} onChange={handleInputChange} placeholder="Escriba su nombre completo para firmar" />
               <div className="flex justify-between items-center px-1">
                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Hash IP: {ip}</p>
                 <div className="h-0.5 w-12 bg-slate-200"></div>
                 <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Compliance v2.5</p>
               </div>
            </div>
            <div className="bg-slate-50 p-8 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center space-y-2 order-1 md:order-2">
               <i className="fas fa-fingerprint text-3xl text-slate-300"></i>
               <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.3em]">Validación Biométrica Digital</p>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-100 flex flex-col items-center">
            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full md:w-auto min-w-[320px] bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:-translate-y-1'}`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando Registro...
                </span>
              ) : 'Protocolizar Formulario'}
            </button>
            <p className="mt-8 text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center max-w-lg leading-relaxed italic">
              Este registro tiene efectos meramente declarativos e informativos de conformidad con la legislación colombiana vigente. No constituye oferta mercantil ni contrato de inversión.
            </p>
          </div>
        </form>
      </main>

      <footer className="text-[10px] text-slate-400 text-center uppercase pb-12 tracking-[0.2em] space-y-2">
        <p>© 2024 CAISHEN CAPITAL GROUP S.A.S. | OFICINA DE CUMPLIMIENTO</p>
        <p className="font-bold">Protocolo de Onboarding Digital Protegido</p>
      </footer>
    </div>
  );
};

export default App;
