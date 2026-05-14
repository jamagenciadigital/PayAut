import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { dbService } from '../services/api';
import { 
  Users, 
  CheckCircle2, 
  Eye,
  FileText,
  Search,
  XCircle,
  Download,
  ChevronDown,
  CreditCard
} from 'lucide-react';

const DetailItem = ({ label, value }: { label: string; value: any }) => (
  <div className="space-y-1">
    <p className="text-[9px] font-black text-black/30 uppercase tracking-widest">{label}</p>
    <p className="text-sm font-bold text-black break-words">{String(value || '---')}</p>
  </div>
);

const DocLink = ({ label, value, onPreview }: { label: string; value: any; onPreview: (url: string) => void }) => {
  const hasFile = value && value !== 'undefined' && value !== 'null' && value !== '#';
  
  return (
    <div className="bg-white rounded-2xl border border-black/5 hover:border-[#cc0066]/30 transition-all group shadow-sm overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-black/20 group-hover:text-[#cc0066] group-hover:bg-[#cc0066]/10 shrink-0 transition-colors">
            <FileText size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black text-black uppercase tracking-widest truncate">{label}</p>
            <p className="text-[9px] font-bold text-black/30 truncate">
              {hasFile ? 'Archivo disponible' : 'Falta documento'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          {hasFile ? (
            <>
              <button 
                onClick={() => onPreview(String(value))}
                className="px-3 py-2 bg-[#cc0066]/10 hover:bg-[#cc0066] text-[#cc0066] hover:text-white rounded-xl transition-all text-[9px] font-black uppercase tracking-widest whitespace-nowrap"
              >
                Ver
              </button>
              <a
                href={String(value || '#')}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-100 hover:bg-black text-black/40 hover:text-white rounded-xl transition-all shrink-0"
              >
                <Download size={14} />
              </a>
            </>
          ) : (
            <span className="text-[8px] font-black text-rose-500/50 uppercase tracking-widest px-3 py-1.5 bg-rose-50 rounded-lg whitespace-nowrap">
              Pendiente
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const MerchantDetailsModal = ({ isOpen, onClose, merchant, onUpdateStatus, onUpdatePlan, plans, saving }: any) => {
  const [activePreview, setActivePreview] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState(merchant?.plan_id || '');

  if (!isOpen || !merchant) return null;

  const handlePreview = (url: string) => {
    if (url && url !== 'undefined' && url !== 'null' && url !== '#') {
      setActivePreview(url);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6">
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-5xl bg-white rounded-[32px] md:rounded-[40px] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        <div className="p-6 md:p-8 border-b border-black/5 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-[#cc0066] to-[#7a00cc] flex items-center justify-center text-white font-black text-lg shadow-lg">
              {String(merchant.business_name || 'C').charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight">{merchant.business_name || 'Comercio'}</h2>
              <p className="text-[9px] md:text-[10px] font-black text-black/40 uppercase tracking-widest">Expediente de Validación</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/20 hover:text-black">
            <XCircle size={28} />
          </button>
        </div>

        <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-1 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12">
            <div className="lg:col-span-3 space-y-10 md:space-y-12">
              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-[#cc0066]/10 flex items-center justify-center text-[#cc0066]">
                    <Users size={16} />
                  </div>
                  <h3 className="text-xs font-black text-black uppercase tracking-[0.2em]">Representante Legal</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-6 md:p-8 bg-slate-50/50 rounded-[32px] border border-black/5">
                  <DetailItem label="Nombre Completo" value={`${merchant.legal_rep_name || ''} ${merchant.legal_rep_lastname || ''}`} />
                  <DetailItem label="Correo Electrónico" value={merchant.legal_rep_email} />
                  <DetailItem label="Celular de Contacto" value={merchant.legal_rep_phone} />
                  <DetailItem label="Documento Identidad" value={`${merchant.legal_rep_doc_type || ''} ${merchant.legal_rep_doc_number || ''}`} />
                  <DetailItem label="Fecha Expedición" value={merchant.legal_rep_doc_exp_date} />
                  <DetailItem label="Lugar de Expedición" value={`${merchant.legal_rep_exp_city || ''}, ${merchant.legal_rep_exp_country || ''}`} />
                  <div className="md:col-span-2">
                    <DetailItem label="Dirección Residencial" value={merchant.legal_rep_address} />
                  </div>
                </div>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-[#7a00cc]/10 flex items-center justify-center text-[#7a00cc]">
                    <FileText size={16} />
                  </div>
                  <h3 className="text-xs font-black text-black uppercase tracking-[0.2em]">Información Corporativa</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 p-6 md:p-8 bg-slate-50/50 rounded-[32px] border border-black/5">
                  <DetailItem label="NIT / Registro Tax" value={merchant.tax_id} />
                  <DetailItem label="Sitio Web" value={merchant.website} />
                  <DetailItem label="Ubicación Principal" value={`${merchant.city || ''}, ${merchant.country || ''}`} />
                  <DetailItem label="Actividad Económica" value={merchant.economic_activity} />
                  <div className="md:col-span-2">
                    <DetailItem label="Dirección de Oficina" value={merchant.address} />
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <section className="lg:sticky lg:top-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-600">
                    <Download size={16} />
                  </div>
                  <h3 className="text-xs font-black text-black uppercase tracking-[0.2em]">Documentos</h3>
                </div>
                
                <div className="space-y-3 p-6 bg-slate-50 rounded-[32px] border border-black/5 shadow-inner">
                  <DocLink label="Doc. Identidad (Frontal)" value={merchant.doc_front_url} onPreview={handlePreview} />
                  <DocLink label="Doc. Identidad (Trasero)" value={merchant.doc_back_url} onPreview={handlePreview} />
                  <DocLink label="Cámara de Comercio" value={merchant.chamber_commerce_url} onPreview={handlePreview} />
                  <DocLink label="Registro RUT" value={merchant.rut_url} onPreview={handlePreview} />
                  <DocLink label="Certificación Bancaria" value={merchant.bank_cert_url} onPreview={handlePreview} />
                </div>

                {activePreview && (
                  <div className="mt-4 p-4 bg-white rounded-[24px] border-2 border-[#cc0066]/20 shadow-lg animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center justify-between mb-3 px-2">
                      <span className="text-[9px] font-black text-[#cc0066] uppercase tracking-widest">Vista Previa Activa</span>
                      <button onClick={() => setActivePreview(null)} className="text-black/40 hover:text-black p-1">
                        <XCircle size={14} />
                      </button>
                    </div>
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-black/5 relative group">
                      {activePreview.toLowerCase().endsWith('.pdf') ? (
                        <iframe 
                          src={activePreview} 
                          className="w-full h-full border-none"
                          title="PDF Preview"
                        />
                      ) : (
                        <img 
                          src={activePreview} 
                          alt="Document Preview" 
                          className="w-full h-full object-contain cursor-zoom-in"
                          onClick={() => window.open(activePreview, '_blank')}
                        />
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-8 p-6 md:p-8 bg-slate-50 rounded-[32px] border border-black/5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-black/5 flex items-center justify-center text-black/40">
                      <CreditCard size={16} />
                    </div>
                    <h4 className="text-[10px] font-black text-black uppercase tracking-[0.2em]">Plan de Suscripción</h4>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <select 
                        value={selectedPlanId}
                        onChange={(e) => setSelectedPlanId(e.target.value)}
                        className="w-full pl-6 pr-10 py-4 bg-white border border-black/10 rounded-2xl text-xs font-black uppercase tracking-tight focus:outline-none appearance-none cursor-pointer shadow-sm focus:border-[#cc0066]"
                      >
                        <option value="">Sin Plan Asignado</option>
                        {Array.isArray(plans) && plans.map((p: any) => (
                          <option key={p.id} value={p.id}>{p.name} - {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(p.monthly_price)}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 pointer-events-none" size={16} />
                    </div>

                    <button
                      onClick={() => onUpdatePlan(merchant.id, selectedPlanId)}
                      disabled={saving || selectedPlanId === merchant.plan_id}
                      className="w-full bg-black text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
                    >
                      Actualizar Plan
                    </button>
                  </div>
                </div>

                <div className="mt-8 p-6 md:p-8 bg-slate-50 rounded-[32px] border border-black/5 text-center">
                  <h4 className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] mb-4">Estado de Validación</h4>
                  <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full border mb-8 ${
                    merchant.status === 'ACTIVE' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${merchant.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-amber-600 animate-pulse'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {merchant.status === 'ACTIVE' ? 'Comercio Validado' : 'Pendiente Validar'}
                    </span>
                  </div>

                  {merchant.status === 'PENDING' ? (
                    <button
                      onClick={() => onUpdateStatus(merchant.id, 'ACTIVE')}
                      disabled={saving}
                      className="w-full bg-[#cc0066] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#cc0066]/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 size={18} />
                          Aprobar Registro
                        </>
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={() => onUpdateStatus(merchant.id, 'PENDING')}
                      disabled={saving}
                      className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-600/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <XCircle size={18} />
                          Desactivar Comercio
                        </>
                      )}
                    </button>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const SuperadminMerchants = () => {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [saving, setSaving] = useState(false);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    loadMerchants();
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const data = await dbService.getSubscriptionPlans();
      setPlans(data);
    } catch (err) {
      console.error('Error loading plans:', err);
    }
  };

  const loadMerchants = async () => {
    setLoading(true);
    try {
      const data = await dbService.getMerchants();
      setMerchants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading merchants:', err);
      setMerchants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'ACTIVE' | 'PENDING') => {
    setSaving(true);
    try {
      await dbService.updateMerchantStatus(id, status);
      await loadMerchants();
      if (selectedMerchant && selectedMerchant.id === id) {
        setSelectedMerchant((prev: any) => ({ ...prev, status }));
      }
    } catch (err) {
      console.error(`Error updating status:`, err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdatePlan = async (merchantId: string, planId: string) => {
    setSaving(true);
    try {
      await dbService.updateMerchantPlan(merchantId, planId);
      await loadMerchants();
      if (selectedMerchant && selectedMerchant.id === merchantId) {
        setSelectedMerchant((prev: any) => ({ ...prev, plan_id: planId }));
      }
    } catch (err) {
      console.error(`Error updating plan:`, err);
    } finally {
      setSaving(false);
    }
  };

  const filteredMerchants = (merchants || []).filter(m => {
    const name = String(m.business_name || '').toLowerCase();
    const rep = String(m.legal_rep_name || '').toLowerCase();
    const nit = String(m.tax_id || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    
    const matchesSearch = name.includes(search) || rep.includes(search) || nit.includes(search);
    const matchesFilter = filterStatus === 'ALL' || m.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <Layout role="SUPERADMIN">
        <div className="flex items-center justify-center min-h-screen bg-[#F2F2F2]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc0066]" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="SUPERADMIN">
      <div className="p-4 md:p-12 w-full max-w-[1280px] mx-auto bg-[#F2F2F2] min-h-screen">
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-black uppercase tracking-tighter mb-2">Comercios</h1>
            <p className="text-black/40 font-bold uppercase tracking-widest text-[10px]">Gestión y validación de registros</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
              <input 
                type="text" 
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-64 pl-12 pr-6 py-3 bg-white border border-black/5 rounded-2xl text-sm font-bold focus:outline-none focus:border-[#cc0066] transition-all shadow-sm"
              />
            </div>
            
            <div className="flex bg-white p-1 rounded-2xl border border-black/5 shadow-sm overflow-x-auto">
              {['ALL', 'PENDING', 'ACTIVE'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    filterStatus === status 
                      ? 'bg-[#cc0066] text-white shadow-lg' 
                      : 'text-black/40 hover:text-black'
                  }`}
                >
                  {status === 'ALL' ? 'Todos' : status === 'PENDING' ? 'Pendientes' : 'Activos'}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="bg-white rounded-[32px] md:rounded-[40px] shadow-2xl shadow-black/5 border border-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-[10px] font-black text-black/30 uppercase tracking-[0.2em] border-b border-black/5">Empresa</th>
                  <th className="px-8 py-6 text-[10px] font-black text-black/30 uppercase tracking-[0.2em] border-b border-black/5">Representante</th>
                  <th className="px-8 py-6 text-[10px] font-black text-black/30 uppercase tracking-[0.2em] border-b border-black/5">Documento / NIT</th>
                  <th className="px-8 py-6 text-[10px] font-black text-black/30 uppercase tracking-[0.2em] border-b border-black/5">Estado</th>
                  <th className="px-8 py-6 text-[10px] font-black text-black/30 uppercase tracking-[0.2em] border-b border-black/5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {filteredMerchants.length > 0 ? (
                  filteredMerchants.map((merchant) => (
                    <tr key={merchant.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#cc0066] to-[#7a00cc] flex items-center justify-center text-white font-black text-xs shadow-lg">
                            {String(merchant.business_name || 'C').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-black text-sm uppercase tracking-tight">{merchant.business_name || 'Sin Nombre'}</p>
                            <p className="text-[10px] font-bold text-black/30 truncate max-w-[150px]">{merchant.website || '---'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-black">{merchant.legal_rep_name || ''} {merchant.legal_rep_lastname || ''}</p>
                        <p className="text-[10px] font-bold text-black/30">{merchant.legal_rep_email || '---'}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm font-bold text-black uppercase tracking-tighter">{merchant.tax_id || '---'}</p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <CreditCard size={10} className="text-[#cc0066]" />
                          <p className="text-[9px] font-black text-[#cc0066] uppercase tracking-widest">{merchant.plan_name || 'Sin Plan'}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          merchant.status === 'ACTIVE' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${merchant.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-amber-600 animate-pulse'}`} />
                          {merchant.status === 'ACTIVE' ? 'Activo' : 'Pendiente'}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedMerchant(merchant);
                              setIsModalOpen(true);
                            }}
                            className="p-3 bg-slate-100 hover:bg-[#cc0066] hover:text-white rounded-2xl transition-all duration-300 group/btn"
                            title="Ver Comercio"
                          >
                            <Eye size={18} />
                          </button>
                          
                          {merchant.status === 'PENDING' ? (
                            <button
                              onClick={() => handleUpdateStatus(merchant.id, 'ACTIVE')}
                              className="p-3 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-2xl transition-all duration-300 group/btn"
                              title="Activar Comercio"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateStatus(merchant.id, 'PENDING')}
                              className="p-3 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-2xl transition-all duration-300 group/btn"
                              title="Desactivar Comercio"
                            >
                              <XCircle size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                          <Users className="text-black/10" size={32} />
                        </div>
                        <div>
                          <p className="font-black text-black uppercase tracking-tight">No se encontraron comercios</p>
                          <p className="text-xs font-bold text-black/30">Intenta con otro término de búsqueda o filtro</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && selectedMerchant && (
        <MerchantDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedMerchant(null);
          }}
          merchant={selectedMerchant}
          onUpdateStatus={handleUpdateStatus}
          onUpdatePlan={handleUpdatePlan}
          plans={plans}
          saving={saving}
        />
      )}
    </Layout>
  );
};
