
import React, { useState, useEffect } from 'react';

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwyAgrVmcM0bAwJmrzX-X5h7-4TY8Pbz-WV12ArZP1Y3l8b4VRtq5seoSssufJEM9MN3A/exec';

const generateUniqueCode = () => {
  const prefix = 'CCG';
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${random}`;
};

const SectionTitle: React.FC<{ number: string; title: string }> = ({ number, title }) => (
  <div className="flex items-center space-x-3 mb-6 pb-2 border-b border-slate-200 mt-10">
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm shadow-sm shrink-0">
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
  const [ip, setIp] = useState('Detectando...');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => setIp('Protegida (Proxy)'));
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
    autoriza_kyc_biometria: 'SÍ',
    estado_registro: 'PENDIENTE_KYC',
    notas_internas: 'Registro vía Vercel Node con Protocolo KYC.',
    firmante_nombre: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
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

      setTimeout(() => {
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setLoading(false);
      }, 1000);

    } catch (err: any) {
      setError("Error de comunicación. Por favor intente nuevamente.");
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-6 text-center animate-fade-in">
        <div className="bg-white p-10 rounded-3xl shadow-xl border-b-8 border-slate-900">
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-shield-halved text-white text-2xl"></i>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Registro en Validación</h1>
          <p className="text-slate-500 text-sm mb-10 uppercase tracking-widest font-bold">Caishen Capital Group S.A.S.</p>
          
          <div className="bg-slate-50 p-8 rounded-2xl mb-8 border border-slate-200">
            <p className="text-[10px] text-slate-400 uppercase font-black mb-1 tracking-widest">Código de Radicado KYC:</p>
            <p className="text-2xl font-mono font-bold text-slate-900 tracking-widest">{formData.codigo_registro}</p>
          </div>
          
          <p className="text-slate-600 mb-10 text-sm leading-relaxed max-w-md mx-auto italic">
            "Su perfil y autorizaciones KYC han sido protocolizados exitosamente. Iniciando validación de antecedentes y biometría."
          </p>

          <button onClick={() => window.location.reload()} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-black transition-all">
            Nuevo Registro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 md:py-12 px-4 animate-fade-in">
      <header className="bg-white p-6 md:p-10 rounded-t-3xl shadow-sm border-b border-slate-100 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Caishen Capital Group</h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase mt-3">S.A.S. | Protocolo Onboarding Digital</p>
        </div>
        <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-100">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center">Protocolo de Seguridad</p>
          <p className="text-[11px] text-green-600 font-bold uppercase mt-1 flex items-center justify-center">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span> KYC Ready
          </p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <InputField label="Nombre Completo" name="nombre_completo" value={formData.nombre_completo} onChange={handleInputChange} placeholder="Nombres y Apellidos" />
            </div>
            <InputField label="Tipo Documento" name="tipo_documento" options={["CC", "CE", "PPT", "NIT"]} value={formData.tipo_documento} onChange={handleInputChange} />
            <InputField label="Número" name="numero_documento" value={formData.numero_documento} onChange={handleInputChange} />
          </div>

          <SectionTitle number="3" title="Localización" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            <InputField label="Celular" name="telefono" value={formData.telefono} onChange={handleInputChange} />
            <div className="md:col-span-2">
              <InputField label="Dirección" name="direccion" value={formData.direccion} onChange={handleInputChange} />
            </div>
          </div>

          <SectionTitle number="4" title="Actividad Económica" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Ocupación" name="actividad_economica" options={["Empleado", "Empresario", "Independiente", "Pensionado", "Rentista"]} value={formData.actividad_economica} onChange={handleInputChange} />
            <InputField label="Fuente de Fondos" name="origen_fondos" options={["Ahorros", "Salario", "Venta de Activos", "Otro"]} value={formData.origen_fondos} onChange={handleInputChange} />
          </div>

          <SectionTitle number="5" title="Perfil de Riesgo" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField label="Experiencia" name="experiencia_inversion" options={["Nula", "Media", "Alta"]} value={formData.experiencia_inversion} onChange={handleInputChange} />
            <InputField label="Riesgo" name="tolerancia_riesgo" options={["Bajo", "Medio", "Alto"]} value={formData.tolerancia_riesgo} onChange={handleInputChange} />
            <InputField label="Plazo" name="horizonte_inversion" options={["Corto", "Largo"]} value={formData.horizonte_inversion} onChange={handleInputChange} />
            <InputField label="Objetivo" name="objetivo_inversion" options={["Renta", "Crecimiento"]} value={formData.objetivo_inversion} onChange={handleInputChange} />
          </div>

          <SectionTitle number="6" title="Cumplimiento Legal" />
          <div className="space-y-2 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <CheckboxField name="autoriza_tratamiento_datos" label="Autorizo tratamiento de datos personales (Ley 1581 de 2012)." />
            <CheckboxField name="declara_origen_licito" label="Certifico el origen lícito de mis fondos bajo gravedad de juramento." />
            <CheckboxField name="declara_informacion_veraz" label="Confirmo que toda la información suministrada es verídica." />
          </div>

          <SectionTitle number="7" title="Validación KYC y Biometría" />
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700 shadow-inner">
            <div className="flex items-start space-x-4 mb-6 border-b border-slate-800 pb-4">
              <div className="bg-slate-800 p-3 rounded-xl border border-slate-700 shrink-0">
                <i className="fas fa-face-viewfinder text-xl text-slate-400"></i>
              </div>
              <div>
                <h3 className="text-white text-sm font-bold uppercase tracking-wider">Protocolo de Identidad Digital</h3>
                <p className="text-slate-400 text-[11px] leading-relaxed mt-1">
                  Caishen Capital Group emplea sistemas avanzados de validación biométrica para garantizar la seguridad de sus operaciones y prevenir riesgos de suplantación o fraude.
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-start space-x-3 cursor-pointer group py-2">
                <div className="flex items-center h-5">
                  <input 
                    type="checkbox" 
                    name="autoriza_kyc_biometria"
                    defaultChecked={true}
                    required
                    className="w-5 h-5 rounded border-slate-600 bg-slate-800 text-white focus:ring-slate-400 cursor-pointer transition-colors" 
                  />
                </div>
                <span className="text-[12px] text-slate-300 leading-tight group-hover:text-white transition-colors select-none">
                  Autorizo la captura y procesamiento de mis datos biométricos (reconocimiento facial, huella o voz) para la validación de mi identidad. Así mismo, autorizo el cruce de mi información en listas restrictivas nacionales e internacionales (SARLAFT/OFAC/UN) y me comprometo a actualizar mi información periódicamente cuando se requiera, con el fin de mantener los estándares de seguridad y cumplimiento establecidos por Caishen Capital Group y el sector.
                </span>
              </label>
            </div>
          </div>

          <div className="pt-8 flex flex-col items-center border-t border-slate-100">
            <div className="w-full mb-8">
              <InputField label="Firma Electrónica (Nombre Completo)" name="firmante_nombre" value={formData.firmante_nombre} onChange={handleInputChange} placeholder="Escriba su nombre completo para firmar" />
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full md:w-auto min-w-[320px] bg-slate-900 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm transition-all shadow-xl ${loading ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:bg-black hover:-translate-y-1 active:scale-95'}`}
            >
              {loading ? 'Validando Identidad...' : 'Protocolizar y Validar KYC'}
            </button>
            <p className="mt-8 text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center max-w-lg leading-relaxed italic">
              Al hacer clic en "Protocolizar", inicia un proceso formal de debida diligencia. Este registro es informativo y no constituye un contrato de inversión.
            </p>
          </div>
        </form>
      </main>

      <footer className="text-[10px] text-slate-400 text-center uppercase pb-12 tracking-[0.3em] space-y-2">
        <p>© 2024 CAISHEN CAPITAL GROUP S.A.S. | OFICIALÍA DE CUMPLIMIENTO</p>
      </footer>
    </div>
  );
};

export default App;
