import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { dbService } from '../services/api';
import { 
  User, 
  Building2, 
  FileText, 
  Settings, 
  ShieldCheck, 
  Save,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Globe,
  Briefcase,
  MapPin,
  Mail,
  Phone,
  CreditCard,
  Download,
  Eye,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Section = 'LEGAL' | 'COMPANY' | 'TAX' | 'BANK' | 'DOCS' | 'CONFIG';

export const MerchantSettings = () => {
  const [activeSection, setActiveSection] = useState<Section>('LEGAL');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [merchant, setMerchant] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    loadMerchantData();
  }, []);

  const loadMerchantData = async () => {
    try {
      setLoading(true);
      // For development, we'll fetch the first merchant or a specific one
      const merchants = await dbService.getMerchants();
      if (merchants && merchants.length > 0) {
        const current = merchants[0]; // Assuming first merchant for demo
        setMerchant(current);
        setFormData(current);
      }
    } catch (error) {
      console.error('Error loading merchant data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('bank_info.')) {
      const field = name.split('.')[1];
      setFormData((prev: any) => ({
        ...prev,
        bank_info: {
          ...(prev.bank_info || {}),
          [field]: value
        }
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await dbService.updateMerchantProfile(merchant.id, formData);
      setNotification({ type: 'success', message: 'Configuración guardada exitosamente' });
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      setNotification({ type: 'error', message: 'Error al guardar la configuración' });
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'LEGAL', label: 'Representante Legal', icon: ShieldCheck, description: 'Información del representante legal' },
    { id: 'COMPANY', label: 'Empresa', icon: Building2, description: 'Información de la empresa' },
    { id: 'TAX', label: 'Información tributaria', icon: FileCheck, description: 'Actividad económica y más' },
    { id: 'BANK', label: 'Cuenta Bancaria', icon: CreditCard, description: 'Banco y tipo de cuenta' },
    { id: 'DOCS', label: 'Documentación', icon: FileText, description: 'Documentos y datos bancarios' },
    { id: 'CONFIG', label: 'Configuración', icon: Settings, description: 'Cuentas y usuarios' },
  ];

  if (loading) {
    return (
      <Layout role="MERCHANT">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-[#cc0066]/20 border-t-[#cc0066] rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="MERCHANT">
      <div className="p-8 max-w-[1400px] mx-auto">
        <div className="mb-8">
          <p className="text-[10px] font-black text-[#cc0066] uppercase tracking-[0.3em] mb-2">Ajustes / {sections.find(s => s.id === activeSection)?.label}</p>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">Configuración del Comercio</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Menu */}
          <div className="lg:col-span-3 space-y-3">
            <div className="bg-white rounded-[32px] p-4 shadow-xl shadow-black/5 border border-black/5 overflow-hidden">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as Section)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
                    activeSection === section.id 
                      ? 'bg-slate-50 text-black translate-x-2' 
                      : 'text-black/40 hover:bg-slate-50/50 hover:text-black/60'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                    activeSection === section.id 
                      ? 'bg-gradient-to-br from-[#cc0066] to-[#7a00cc] text-white shadow-lg shadow-[#cc0066]/20' 
                      : 'bg-slate-100 text-black/20 group-hover:bg-white group-hover:text-black/40'
                  }`}>
                    <section.icon size={20} />
                  </div>
                  <div className="text-left min-w-0">
                    <p className={`text-sm font-black uppercase tracking-tight truncate ${activeSection === section.id ? 'text-black' : 'text-black/40'}`}>
                      {section.label}
                    </p>
                    <p className="text-[9px] font-bold text-black/20 uppercase tracking-widest truncate">
                      {section.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
            <motion.div 
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] shadow-2xl shadow-black/5 border border-black/5 overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="p-10 md:p-12">
                <div className="mb-10 pb-6 border-b border-black/5 flex justify-between items-end">
                  <div>
                    <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-2">
                      {sections.find(s => s.id === activeSection)?.label}
                    </h2>
                    <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
                      {sections.find(s => s.id === activeSection)?.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-10">
                  {activeSection === 'LEGAL' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InputField 
                        label="Nombre del representante legal" 
                        name="legal_rep_name" 
                        value={formData.legal_rep_name} 
                        onChange={handleInputChange} 
                        required 
                      />
                      <InputField 
                        label="Apellidos del representante legal" 
                        name="legal_rep_lastname" 
                        value={formData.legal_rep_lastname} 
                        onChange={handleInputChange} 
                        required 
                      />
                      <SelectField 
                        label="Tipo de documento de identidad" 
                        name="legal_rep_doc_type" 
                        value={formData.legal_rep_doc_type} 
                        onChange={handleInputChange}
                        options={[
                          { value: 'CC', label: 'Cédula de ciudadanía' },
                          { value: 'CE', label: 'Cédula de extranjería' },
                          { value: 'NIT', label: 'NIT' },
                          { value: 'PP', label: 'Pasaporte' }
                        ]}
                        required 
                      />
                      <InputField 
                        label="Documento de identidad" 
                        name="legal_rep_doc_number" 
                        value={formData.legal_rep_doc_number} 
                        onChange={handleInputChange} 
                        required 
                      />
                      <InputField 
                        label="Correo electrónico" 
                        name="legal_rep_email" 
                        type="email" 
                        value={formData.legal_rep_email} 
                        onChange={handleInputChange} 
                        required 
                      />
                      <InputField 
                        label="Teléfono móvil" 
                        name="legal_rep_phone" 
                        value={formData.legal_rep_phone} 
                        onChange={handleInputChange} 
                        required 
                      />
                      <InputField 
                        label="País" 
                        name="legal_rep_exp_country" 
                        value={formData.legal_rep_exp_country} 
                        onChange={handleInputChange} 
                        required 
                      />
                      <InputField 
                        label="Ciudad" 
                        name="legal_rep_exp_city" 
                        value={formData.legal_rep_exp_city} 
                        onChange={handleInputChange} 
                        required 
                      />
                      <div className="md:col-span-2">
                        <InputField 
                          label="Dirección" 
                          name="legal_rep_address" 
                          value={formData.legal_rep_address} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                    </div>
                  )}

                  {activeSection === 'COMPANY' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="md:col-span-2">
                        <InputField 
                          label="Razón Social / Nombre Comercial" 
                          name="business_name" 
                          value={formData.business_name} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                      <InputField 
                        label="Sitio Web" 
                        name="website" 
                        value={formData.website} 
                        onChange={handleInputChange} 
                      />
                      <InputField 
                        label="Actividad Económica" 
                        name="economic_activity" 
                        value={formData.economic_activity} 
                        onChange={handleInputChange} 
                      />
                      <InputField 
                        label="Ciudad" 
                        name="city" 
                        value={formData.city} 
                        onChange={handleInputChange} 
                        required 
                      />
                      <InputField 
                        label="País" 
                        name="country" 
                        value={formData.country} 
                        onChange={handleInputChange} 
                        required 
                      />
                      <div className="md:col-span-2">
                        <InputField 
                          label="Dirección de la Empresa" 
                          name="address" 
                          value={formData.address} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                    </div>
                  )}

                  {activeSection === 'TAX' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InputField 
                        label="NIT / Registro Tributario" 
                        name="tax_id" 
                        value={formData.tax_id} 
                        onChange={handleInputChange} 
                        required 
                      />
                      <SelectField 
                        label="Régimen Tributario" 
                        name="tax_regime" 
                        value={formData.tax_regime || 'SIMPLIFIED'} 
                        onChange={handleInputChange}
                        options={[
                          { value: 'SIMPLIFIED', label: 'Régimen Simplificado' },
                          { value: 'COMMON', label: 'Régimen Común' },
                          { value: 'GRAN_CONTRIBUYENTE', label: 'Gran Contribuyente' }
                        ]}
                        required 
                      />
                    </div>
                  )}

                  {activeSection === 'BANK' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InputField 
                        label="Banco" 
                        name="bank_info.bankName" 
                        value={formData.bank_info?.bankName} 
                        onChange={handleInputChange} 
                        placeholder="Ej: Bancolombia"
                        required 
                      />
                      <SelectField 
                        label="Tipo de Cuenta" 
                        name="bank_info.accountType" 
                        value={formData.bank_info?.accountType} 
                        onChange={handleInputChange}
                        options={[
                          { value: 'SAVINGS', label: 'Cuenta de Ahorros' },
                          { value: 'CHECKING', label: 'Cuenta Corriente' }
                        ]}
                        required 
                      />
                      <div className="md:col-span-2">
                        <InputField 
                          label="Número de Cuenta" 
                          name="bank_info.accountNumber" 
                          value={formData.bank_info?.accountNumber} 
                          onChange={handleInputChange} 
                          placeholder="000-000000-00"
                          required 
                        />
                      </div>
                    </div>
                  )}

                  {activeSection === 'DOCS' && (
                    <div className="space-y-6">
                      <p className="text-xs font-bold text-black/40 uppercase tracking-widest mb-4">Documentos cargados durante el registro</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <DocPreviewCard label="RUT (Registro Único Tributario)" value={formData.rut_url} />
                        <DocPreviewCard label="Cámara de Comercio" value={formData.chamber_commerce_url} />
                        <DocPreviewCard label="Doc. Identidad Representante" value={formData.doc_front_url} />
                        <DocPreviewCard label="Certificación Bancaria" value={formData.bank_cert_url} />
                      </div>
                    </div>
                  )}

                  {activeSection === 'CONFIG' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <InputField 
                        label="Cambiar Contraseña" 
                        name="password" 
                        type="password" 
                        placeholder="••••••••"
                        onChange={handleInputChange} 
                      />
                      <InputField 
                        label="Confirmar Contraseña" 
                        name="confirm_password" 
                        type="password" 
                        placeholder="••••••••"
                        onChange={handleInputChange} 
                      />
                      <div className="md:col-span-2 p-6 bg-slate-50 rounded-3xl border border-black/5">
                        <div className="flex items-center gap-4 text-[#cc0066]">
                          <AlertCircle size={20} />
                          <p className="text-[10px] font-black uppercase tracking-widest">Atención: Algunos cambios requieren validación del administrador.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-12 pt-8 border-t border-black/5 flex items-center justify-center md:justify-end gap-4">
                  <button
                    type="button"
                    onClick={loadMerchantData}
                    className="px-8 py-4 text-xs font-black text-black/40 uppercase tracking-[0.2em] hover:text-black transition-colors"
                  >
                    Descartar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-10 py-5 bg-black text-white rounded-full text-xs font-black uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Save size={18} />
                        Guardar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className={`fixed bottom-8 right-8 z-[9999] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 ${
              notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="text-xs font-black uppercase tracking-widest">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
};

const InputField = ({ label, name, type = 'text', value, onChange, required, placeholder }: any) => (
  <div className="space-y-2 group">
    <label className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em] px-2 block group-focus-within:text-[#cc0066] transition-colors">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value || ''}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full px-8 py-5 bg-slate-50 border border-black/10 rounded-2xl text-xs font-bold text-black focus:outline-none focus:ring-4 focus:ring-[#cc0066]/10 focus:border-[#cc0066] focus:bg-white transition-all shadow-sm"
    />
  </div>
);

const SelectField = ({ label, name, value, onChange, options, required }: any) => (
  <div className="space-y-2 group">
    <label className="text-[9px] font-black text-black/30 uppercase tracking-[0.2em] px-2 block group-focus-within:text-[#cc0066] transition-colors">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <select
      name={name}
      value={value || ''}
      onChange={onChange}
      required={required}
      className="w-full px-8 py-5 bg-slate-50 border border-black/10 rounded-2xl text-xs font-bold text-black focus:outline-none focus:ring-4 focus:ring-[#cc0066]/10 focus:border-[#cc0066] focus:bg-white transition-all shadow-sm appearance-none cursor-pointer"
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const DocPreviewCard = ({ label, value }: { label: string, value: string }) => (
  <div className="p-6 bg-white rounded-3xl border border-black/10 flex items-center justify-between group hover:border-[#cc0066]/30 transition-all shadow-sm">
    <div className="flex items-center gap-6 min-w-0">
      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-black/20 group-hover:text-[#cc0066] group-hover:bg-[#cc0066]/10 transition-colors">
        <FileText size={20} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black text-black uppercase tracking-tight truncate">{label}</p>
        <p className="text-[9px] font-bold text-black/30 truncate">
          {value ? 'Documento verificado' : 'Falta documento'}
        </p>
      </div>
    </div>
    <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
      {value && (
        <>
          <button className="p-2 text-black/40 hover:text-black" title="Ver">
            <Eye size={16} />
          </button>
          <a href={value} target="_blank" rel="noopener noreferrer" className="p-2 text-black/40 hover:text-black" title="Descargar">
            <Download size={16} />
          </a>
        </>
      )}
    </div>
  </div>
);
