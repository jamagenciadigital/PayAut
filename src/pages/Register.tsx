import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Mail, Phone, Lock, ChevronRight, ChevronLeft, 
  Building2, Globe, FileText, Upload, CheckCircle2, 
  MapPin, Briefcase, Info, ShieldCheck, AlertCircle
} from 'lucide-react';
import { dbService } from '../services/api';
import logo from '../assets/logo.png';
import bgLogin from '../assets/bg-login.jpg';

const STEPS = [
  { id: 1, title: 'Crear Cuenta', icon: <User size={18} /> },
  { id: 2, title: 'Representante Legal', icon: <ShieldCheck size={18} /> },
  { id: 3, title: 'Empresa', icon: <Building2 size={18} /> },
  { id: 4, title: 'Documentación', icon: <FileText size={18} /> },
];

export const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    user: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
    legal: {
      name: '',
      lastname: '',
      email: '',
      phone: '',
      doc_type: 'C.C',
      doc_number: '',
      doc_exp_date: '',
      exp_country: 'Colombia',
      exp_city: '',
      address: '',
    },
    company: {
      business_name: '',
      tax_id: '',
      doc_type: 'NIT',
      website: '',
      country: 'Colombia',
      city: '',
      address: '',
      economic_activity: '',
    },
    docs: {
      doc_front: '',
      doc_back: '',
      chamber: '',
      rut: '',
      bank_cert: '',
    }
  });

  const updateField = (section: keyof typeof formData, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const nextStep = () => {
    if (step === 1) {
      if (formData.user.password !== formData.user.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      if (!formData.user.email || !formData.user.name) {
        setError('Por favor completa los campos obligatorios');
        return;
      }
    }
    setError('');
    setStep(s => s + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(s => s - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      await dbService.registerMerchant(formData);
      setSuccess(true);
    } catch (err: any) {
      console.error('Registration error:', err);
      setError('Error al registrar el comercio. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white p-12 rounded-[40px] shadow-2xl text-center"
        >
          <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-black text-black mb-4">¡Registro Exitoso!</h2>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">
            Tu solicitud ha sido enviada correctamente. Un administrador revisará la documentación y activará tu cuenta en las próximas 24-48 horas.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#B92070] text-white py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:brightness-110 transition-all"
          >
            VOLVER AL INICIO
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-6 relative"
      style={{
        backgroundImage: `url(${bgLogin})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 mb-8 flex flex-col items-center">
        <img src={logo} alt="PagoX" className="h-12 mb-4" />
        <div className="flex items-center gap-2">
          {STEPS.map((s) => (
            <React.Fragment key={s.id}>
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  step >= s.id ? 'bg-[#B92070] text-white shadow-lg' : 'bg-white text-gray-300 shadow-sm'
                }`}
              >
                {s.icon}
              </div>
              {s.id < 4 && (
                <div className={`w-8 h-1 rounded-full transition-all duration-500 ${
                  step > s.id ? 'bg-[#B92070]' : 'bg-white'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white/90 backdrop-blur-xl shadow-2xl relative z-10 p-10 overflow-hidden"
           style={{ borderRadius: '40px' }}>
        
        <AnimatePresence mode="wait">
          {/* STEP 1: ACCOUNT */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-black text-black">CREAR CUENTA</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Paso 1 de 4: Información de acceso</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label="Nombre Completo" icon={<User size={16}/>} value={formData.user.name} onChange={(v) => updateField('user', 'name', v)} placeholder="Ej: Juan Pérez" />
                <InputGroup label="Correo Electrónico" icon={<Mail size={16}/>} value={formData.user.email} onChange={(v) => updateField('user', 'email', v)} placeholder="juan@ejemplo.com" type="email" />
                <InputGroup label="Teléfono / Celular" icon={<Phone size={16}/>} value={formData.user.phone} onChange={(v) => updateField('user', 'phone', v)} placeholder="+57 300..." />
                <div />
                <InputGroup label="Contraseña" icon={<Lock size={16}/>} value={formData.user.password} onChange={(v) => updateField('user', 'password', v)} type="password" placeholder="••••••••" />
                <InputGroup label="Confirmar Contraseña" icon={<Lock size={16}/>} value={formData.user.confirmPassword} onChange={(v) => updateField('user', 'confirmPassword', v)} type="password" placeholder="••••••••" />
              </div>
            </motion.div>
          )}

          {/* STEP 2: LEGAL REP */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-black text-black">REPRESENTANTE LEGAL</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Paso 2 de 4: Información del representante</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label="Nombre" value={formData.legal.name} onChange={(v) => updateField('legal', 'name', v)} />
                <InputGroup label="Apellido" value={formData.legal.lastname} onChange={(v) => updateField('legal', 'lastname', v)} />
                <InputGroup label="Correo" value={formData.legal.email} onChange={(v) => updateField('legal', 'email', v)} />
                <InputGroup label="Celular" value={formData.legal.phone} onChange={(v) => updateField('legal', 'phone', v)} />
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Tipo Documento</label>
                  <select 
                    value={formData.legal.doc_type}
                    onChange={(e) => updateField('legal', 'doc_type', e.target.value)}
                    className="bg-black/5 border-0 p-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#B92070]"
                  >
                    <option value="C.C">Cédula de Ciudadanía</option>
                    <option value="Pasaporte">Pasaporte</option>
                    <option value="Nit">NIT</option>
                  </select>
                </div>
                <InputGroup label="No. Documento" value={formData.legal.doc_number} onChange={(v) => updateField('legal', 'doc_number', v)} />
                <InputGroup label="Fecha Expedición" type="date" value={formData.legal.doc_exp_date} onChange={(v) => updateField('legal', 'doc_exp_date', v)} />
                <InputGroup label="País" value={formData.legal.exp_country} onChange={(v) => updateField('legal', 'exp_country', v)} />
                <InputGroup label="Ciudad Expedición" value={formData.legal.exp_city} onChange={(v) => updateField('legal', 'exp_city', v)} />
                <InputGroup label="Dirección" value={formData.legal.address} onChange={(v) => updateField('legal', 'address', v)} />
              </div>
            </motion.div>
          )}

          {/* STEP 3: COMPANY INFO */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-black text-black">INFORMACIÓN DE LA EMPRESA</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Paso 3 de 4: Datos de la compañía</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup label="Nombre de la empresa" icon={<Building2 size={16}/>} value={formData.company.business_name} onChange={(v) => updateField('company', 'business_name', v)} />
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Tipo Documento Empresa</label>
                  <select 
                    value={formData.company.doc_type}
                    onChange={(e) => updateField('company', 'doc_type', e.target.value)}
                    className="bg-black/5 border-0 p-4 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#B92070]"
                  >
                    <option value="NIT">NIT</option>
                    <option value="C.C">Cédula de Ciudadanía</option>
                  </select>
                </div>
                <InputGroup label="No. Documento / NIT" icon={<FileText size={16}/>} value={formData.company.tax_id} onChange={(v) => updateField('company', 'tax_id', v)} />
                <InputGroup label="Sitio Web" icon={<Globe size={16}/>} value={formData.company.website} onChange={(v) => updateField('company', 'website', v)} placeholder="https://..." />
                <InputGroup label="País" icon={<MapPin size={16}/>} value={formData.company.country} onChange={(v) => updateField('company', 'country', v)} />
                <InputGroup label="Ciudad" icon={<MapPin size={16}/>} value={formData.company.city} onChange={(v) => updateField('company', 'city', v)} />
                <InputGroup label="Dirección" icon={<MapPin size={16}/>} value={formData.company.address} onChange={(v) => updateField('company', 'address', v)} />
                <InputGroup label="Actividad Económica" icon={<Briefcase size={16}/>} value={formData.company.economic_activity} onChange={(v) => updateField('company', 'economic_activity', v)} />
              </div>
            </motion.div>
          )}

          {/* STEP 4: DOCUMENTATION */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-black text-black">DOCUMENTACIÓN</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Paso 4 de 4: Sube tus archivos</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUpload label="Doc. Rep. Legal (Frontal)" value={formData.docs.doc_front} onChange={(v) => updateField('docs', 'doc_front', v)} />
                <FileUpload label="Doc. Rep. Legal (Trasera)" value={formData.docs.doc_back} onChange={(v) => updateField('docs', 'doc_back', v)} />
                <FileUpload label="Cámara de Comercio" value={formData.docs.chamber} onChange={(v) => updateField('docs', 'chamber', v)} />
                <FileUpload label="RUT" value={formData.docs.rut} onChange={(v) => updateField('docs', 'rut', v)} />
                <FileUpload label="Certificación Bancaria" value={formData.docs.bank_cert} onChange={(v) => updateField('docs', 'bank_cert', v)} />
              </div>

              <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start gap-3 mt-4">
                <Info className="text-amber-500 shrink-0" size={18} />
                <p className="text-[11px] text-amber-700 font-medium">
                  Asegúrate de que los documentos sean legibles y estén en formato PDF o Imagen (JPG/PNG).
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="mt-6 flex items-center gap-2 text-rose-500 bg-rose-50 p-3 rounded-xl border border-rose-100"
          >
            <AlertCircle size={16} />
            <span className="text-[11px] font-bold uppercase tracking-tight">{error}</span>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-10 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 text-gray-400 font-bold text-sm hover:text-black transition-colors"
            >
              <ChevronLeft size={20} />
              ATRÁS
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-gray-400 font-bold text-sm hover:text-black transition-colors"
            >
              VOLVER AL LOGIN
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={nextStep}
              className="bg-black text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-black/80 transition-all shadow-xl"
            >
              SIGUIENTE
              <ChevronRight size={18} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#B92070] text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:brightness-110 transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? 'REGISTRANDO...' : 'FINALIZAR REGISTRO'}
              <CheckCircle2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper Components
const InputGroup = ({ label, icon, value, onChange, type = "text", placeholder }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-black/40">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-black/5 border-0 rounded-2xl p-4 text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#B92070] transition-all ${icon ? 'pl-11' : ''}`}
      />
    </div>
  </div>
);

const FileUpload = ({ label, value, onChange }: any) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange(reader.result as string);
        setUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-black/40">{label}</label>
      <div className="relative group">
        <input 
          type="file" 
          accept="image/*,.pdf"
          className="absolute inset-0 opacity-0 cursor-pointer z-10"
          onChange={handleFileChange}
          disabled={uploading}
        />
        <div className={`border-2 border-dashed rounded-3xl p-6 flex flex-col items-center justify-center gap-2 transition-all group-hover:bg-black/5 ${value ? 'border-emerald-200 bg-emerald-50/30' : 'border-black/5'}`}>
          <div className={`p-2 rounded-full ${value ? 'bg-emerald-100 text-emerald-500' : 'bg-black/5 text-black/20'}`}>
            {uploading ? (
              <div className="w-5 h-5 border-2 border-[#B92070] border-t-transparent rounded-full animate-spin" />
            ) : value ? (
              <CheckCircle2 size={20} />
            ) : (
              <Upload size={20} />
            )}
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-tight text-center ${value ? 'text-emerald-600' : 'text-black/40'}`}>
            {uploading ? 'Procesando...' : value ? 'Archivo Cargado' : 'Seleccionar Archivo'}
          </span>
          {value && !uploading && (
            <p className="text-[8px] text-emerald-600/60 font-black uppercase tracking-[0.1em]">Listo para guardar</p>
          )}
        </div>
      </div>
    </div>
  );
};
