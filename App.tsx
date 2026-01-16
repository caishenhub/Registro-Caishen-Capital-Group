
import React, { useState, useEffect } from 'react';

// URL confirmada por el cliente: https://script.google.com/macros/s/AKfycbwyAgrVmcM0bAwJmrzX-X5h7-4TY8Pbz-WV12ArZP1Y3l8b4VRtq5seoSssufJEM9MN3A/exec
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
    <h2 className="text-xl font-semibold text-slate-800 uppercase tracking-tight">{title}</h2>
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
      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
        {label} {required && !readOnly && <span className="text-red-500">*</span>}
      </label>
      {options ? (
        <select 
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="px-4 py-2.5 bg-white border border-slate-300 rounded focus:ring-2 focus:ring-slate-400 focus:border-transparent outline-none transition-all appearance-none cursor-pointer text-slate-900"
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
          className={`px-4 py-2.5 border rounded outline-none transition-all ${
            readOnly 
              ? 'bg-slate-100 border-slate-200 text-slate-500 cursor-not-allowed font-mono' 
              : 'bg-white border-slate-300 focus:ring-2 focus:ring-slate-400 focus:border-transparent text-slate-900'
          }`}
        />
      )}
    </div>
  );
};

const CheckboxField: React.FC<{ 
  label: string | React.ReactNode; 
  checked: boolean; 
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}> = ({ label, checked, onChange, name }) => (
  <label className="flex items-start space-x-3 cursor-pointer group">
    <input 
      type="checkbox" 
      name={name}
      checked={checked}
      onChange={onChange}
      required
      className="mt-1 w-5 h-5 rounded border-slate-300 text-slate-800 focus:ring-slate-500 cursor-pointer" 
    />
    <span className="text-sm text-slate-700 leading-tight group-hover:text-slate-900 transition-colors">
      {label}
    </span>
  </label>
);

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ip, setIp] = useState('0.0.0.0');

  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setIp(data.ip))
      .catch(() => console.log('IP tracking bypass'));
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
    notas_internas: 'Registro vía terminal web.',
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
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError("Error en la transmisión de datos. Intente de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-6 text-center animate-fade-in">
        <div className="bg-white p-12 rounded-lg shadow-2xl border-t-4 border-slate-900">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-check-double text-4xl text-green-700"></i>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4 uppercase tracking-tighter">Registro Protocolizado</h1>
          <div className="bg-slate-50 p-6 rounded-lg mb-8 border border-slate-200">
            <p className="text-[10px] text-slate-400 uppercase font-black mb-2 tracking-widest">Número de Radicado:</p>
            <p className="text-3xl font-mono font-bold text-slate-900 tracking-wider">{formData.codigo_registro}</p>
          </div>
          <p className="text-slate-600 mb-8 max-w-lg mx-auto leading-relaxed text-sm italic">
            "Su perfil ha sido sincronizado con la Matriz de Cumplimiento de Caishen Capital Group S.A.S."
          </p>
          <button onClick={() => {
            setSubmitted(false);
            setFormData(prev => ({...prev, codigo_registro: generateUniqueCode()}));
          }} className="bg-slate-900 text-white px-10 py-4 rounded font-black uppercase tracking-widest text-xs hover:bg-black transition-all shadow-lg">
            Nuevo Registro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <header className="bg-white p-8 rounded-t-lg shadow-sm border-b-2 border-slate-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="text-center md:text-left">
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">Caishen Capital Group</h1>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase mt-1">S.A.S. | Onboarding de Inversionistas</p>
        </div>
        <div className="text-center md:text-right border-l md:pl-8 border-slate-200">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Protocolo Seguro</h2>
          <p className="text-[11px] text-green-600 font-bold uppercase mt-0.5"><i className="fas fa-shield-alt mr-1"></i> Auditoría Digital Activa</p>
        </div>
      </header>

      <main className="bg-white shadow-xl rounded-b-lg p-8 md:p-12 mb-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && <div className="p-4 bg-red-50 text-red-700 text-xs font-bold uppercase rounded border border-red-200">{error}</div>}
          
          <SectionTitle number="1" title="Control Administrativo" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50 p-6 rounded border border-slate-100 italic text-slate-500">
            <InputField label="Fecha de Registro" name="fecha_registro" type="date" value={formData.fecha_registro} readOnly />
            <InputField label="Código de Radicado" name="codigo_registro" value={formData.codigo_registro} readOnly />
            <InputField label="Asesor (Si aplica)" name="asesor_asignado" required={false} value={formData.asesor_asignado} onChange={handleInputChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
             <InputField label="Canal de Ingreso" name="canal_ingreso" options={["Web Directo", "Referido", "Redes Sociales", "Evento", "Otro"]} value={formData.canal_ingreso} onChange={handleInputChange} />
             {formData.canal_ingreso === 'Otro' && <InputField label="Especifique Canal" name="canal_otro" value={formData.canal_otro} onChange={handleInputChange} />}
          </div>

          <SectionTitle number="2" title="Información del Titular" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2"><InputField label="Nombre Completo" name="nombre_completo" value={formData.nombre_completo} onChange={handleInputChange} /></div>
            <InputField label="Tipo de Documento" name="tipo_documento" options={["CC", "CE", "Pasaporte", "NIT"]} value={formData.tipo_documento} onChange={handleInputChange} />
            <InputField label="Número de Documento" name="numero_documento" value={formData.numero_documento} onChange={handleInputChange} />
            <InputField label="Fecha de Nacimiento" name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleInputChange} />
            <InputField label="Nacionalidad" name="nacionalidad" value={formData.nacionalidad} onChange={handleInputChange} />
          </div>

          <SectionTitle number="3" title="Datos de Contacto" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Correo Electrónico" name="email" type="email" value={formData.email} onChange={handleInputChange} />
            <InputField label="Teléfono / WhatsApp" name="telefono" value={formData.telefono} onChange={handleInputChange} />
            <InputField label="Dirección de Residencia" name="direccion" value={formData.direccion} onChange={handleInputChange} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} />
              <InputField label="País" name="pais" value={formData.pais} onChange={handleInputChange} />
            </div>
          </div>

          <SectionTitle number="4" title="Perfil Financiero" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Actividad Económica" name="actividad_economica" options={["Empleado", "Empresario", "Independiente", "Pensionado", "Rentista"]} value={formData.actividad_economica} onChange={handleInputChange} />
            <InputField label="Nivel de Ingresos (SMMLV)" name="nivel_ingresos" options={["1-10", "11-30", "31-50", ">50"]} value={formData.nivel_ingresos} onChange={handleInputChange} />
            <InputField label="Origen de Fondos" name="origen_fondos" options={["Salario", "Ahorros", "Dividendos", "Venta de Activos", "Otro"]} value={formData.origen_fondos} onChange={handleInputChange} />
            {formData.origen_fondos === 'Otro' && <InputField label="Especifique Origen" name="origen_fondos_otro" value={formData.origen_fondos_otro} onChange={handleInputChange} />}
          </div>

          <SectionTitle number="5" title="Perfil de Inversionista" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <InputField label="Experiencia" name="experiencia_inversion" options={["Ninguna", "Básica", "Media", "Avanzada"]} value={formData.experiencia_inversion} onChange={handleInputChange} />
            <InputField label="Objetivo" name="objetivo_inversion" options={["Renta", "Crecimiento", "Preservación"]} value={formData.objetivo_inversion} onChange={handleInputChange} />
            <InputField label="Horizonte" name="horizonte_inversion" options={["Corto", "Mediano", "Largo"]} value={formData.horizonte_inversion} onChange={handleInputChange} />
            <InputField label="Riesgo" name="tolerancia_riesgo" options={["Bajo", "Moderado", "Alto"]} value={formData.tolerancia_riesgo} onChange={handleInputChange} />
          </div>

          <SectionTitle number="6" title="Cumplimiento Legal y Declaraciones" />
          <div className="space-y-4 bg-slate-50 p-6 rounded-lg border border-slate-200">
            <CheckboxField name="autoriza_tratamiento_datos" checked={true} label="Autorizo tratamiento de datos (Ley 1581 Habeas Data)." />
            <CheckboxField name="declara_origen_licito" checked={true} label="Certifico el origen lícito de mis recursos." />
            <CheckboxField name="acepta_terminos" checked={true} label="Acepto términos y condiciones de Caishen Capital Group S.A.S." />
            <CheckboxField name="acepta_riesgos" checked={true} label="Reconozco los riesgos de las inversiones financieras." />
            <CheckboxField name="declara_informacion_veraz" checked={true} label="Certifico que la información es verídica." />
          </div>

          <SectionTitle number="7" title="Firma Digital" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
            <div className="border-b-2 border-slate-900 h-24 bg-slate-50 flex items-center justify-center border-dashed">
              <span className="text-[9px] text-slate-300 uppercase font-black italic tracking-widest">Hash de Seguridad Biométrica</span>
            </div>
            <div className="space-y-4">
               <InputField label="Firma (Escriba su nombre completo)" name="firmante_nombre" value={formData.firmante_nombre} onChange={handleInputChange} />
               <div className="text-[8px] text-slate-400 font-bold uppercase flex justify-between">
                  <span>IP: {ip}</span>
                  <span>Protocolo v2.1</span>
               </div>
            </div>
          </div>

          <div className="pt-10 flex flex-col items-center">
            <button type="submit" disabled={loading} className={`w-full md:w-auto bg-slate-900 text-white px-24 py-6 rounded font-black uppercase tracking-[0.3em] text-sm transition-all shadow-xl ${loading ? 'opacity-50' : 'hover:-translate-y-1'}`}>
              {loading ? 'Transmitiendo...' : 'Protocolizar Registro'}
            </button>
            <p className="mt-4 text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center">Este documento tiene carácter declarativo informativo y no constituye contrato.</p>
          </div>
        </form>
      </main>

      <footer className="text-[10px] text-slate-400 text-center uppercase pb-10 tracking-[0.2em]">
        <p>© 2024 CAISHEN CAPITAL GROUP S.A.S. | DEPARTAMENTO DE COMPLIANCE</p>
      </footer>
    </div>
  );
};

export default App;
