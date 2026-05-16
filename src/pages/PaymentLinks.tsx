import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { 
  Plus, 
  Copy, 
  ExternalLink, 
  Trash2, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign,
  LinkIcon,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaymentLinkModal } from '../components/PaymentLinkModal';
import { dbService } from '../services/api';
import { currentUser } from '../mockData';
import pseLogo from '../assets/pse-seeklogo.png';

export const PaymentLinks = () => {
  const userStr = localStorage.getItem('currentUser');
  const user = userStr ? JSON.parse(userStr) : currentUser;
  
  const [links, setLinks] = useState<any[]>([]);
  const [merchant, setMerchant] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // En una app real, esto vendría del contexto de Auth
        // Primero buscamos el merchant vinculado al usuario actual
        const merch = await dbService.getMerchantByUserId(user.id);
        if (merch) {
          setMerchant(merch);
          const data = await dbService.getPaymentLinks(merch.id);
          setLinks(data);
        }
      } catch (err) {
        console.error('Error fetching real data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCopy = (id: string) => {
    const baseUrl = window.location.origin;
    navigator.clipboard.writeText(`${baseUrl}/p/${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredLinks = links.filter(link => 
    link.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout role="MERCHANT">
      <div className="p-4 md:p-12 w-full max-w-[1600px] mx-auto bg-[#F2F2F2] min-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pt-12 lg:pt-0">
          <div className="text-left">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-black uppercase tracking-tighter">Links de Pago</h1>
            <p className="text-black/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Gestiona y monitorea tus puntos de recaudo digital</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#000051] text-white px-8 py-4 rounded-xl font-bold shadow-premium hover:scale-105 transition-all outline-none border-none cursor-pointer"
          >
            <Plus size={20} />
            Nuevo Link de Pago
          </button>
        </header>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="Buscar por concepto o ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-black/5 p-4 pl-12 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#7F00DF]/20 transition-all"
            />
            <Search size={18} className="absolute left-4 top-4 text-black/20" />
          </div>
          <button className="w-full md:w-auto bg-white border border-black/5 px-6 py-4 md:py-0 rounded-xl flex items-center justify-center gap-2 text-sm font-black uppercase tracking-widest text-black/40 hover:bg-black/5 transition-colors">
            <Filter size={16} />
            Filtros
          </button>
        </div>

        {/* Links List */}
        <div className="bg-white border border-black/5 rounded-sm shadow-sm p-10">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <div className="animate-spin h-8 w-8 border-4 border-[#7F00DF] border-t-transparent rounded-full" />
                <p className="text-[10px] font-black uppercase tracking-widest text-black/20">Cargando datos reales...</p>
              </div>
            ) : filteredLinks.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center gap-6 opacity-40">
                <LinkIcon size={48} />
                <div className="text-center">
                  <p className="text-lg font-bold">No tienes links creados aún</p>
                  <p className="text-sm">Empieza generando tu primer punto de recaudo</p>
                </div>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black/5 text-black/40 text-sm">
                    <th className="pb-6 font-bold uppercase tracking-widest text-[10px]">Link / Concepto</th>
                    <th className="pb-6 font-bold uppercase tracking-widest text-[10px]">Monto</th>
                    <th className="pb-6 font-bold uppercase tracking-widest text-[10px]">Recaudos</th>
                    <th className="pb-6 font-bold uppercase tracking-widest text-[10px]">Estado</th>
                    <th className="pb-6 font-bold uppercase tracking-widest text-[10px]">Fecha Creación</th>
                    <th className="pb-6 font-bold uppercase tracking-widest text-[10px] text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {filteredLinks.map((link) => (
                    <tr key={link.id} className="text-black/80 hover:bg-slate-50 transition-colors group">
                      <td className="py-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-black">{link.description}</span>
                          <span className="text-[10px] font-mono font-bold text-black/40 uppercase tracking-tighter">ID: {link.slug}</span>
                        </div>
                      </td>
                      <td className="py-6 font-bold text-black">
                        {link.is_open_amount ? (
                          <span className="text-[10px] font-black uppercase tracking-widest bg-black/5 px-2 py-1 rounded text-black/40">Abierto</span>
                        ) : (
                          `$${Number(link.amount).toLocaleString()}`
                        )}
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-lg">{link.payments_count || 0}</span>
                          <span className="text-[9px] font-black text-black/30 uppercase tracking-widest">Pagos realizados</span>
                        </div>
                      </td>
                      <td className="py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit ${
                          link.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-indigo-500/10 text-[#7F00DF]'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${link.status === 'ACTIVE' ? 'bg-emerald-600' : 'bg-[#000051]'}`} />
                          {link.status === 'ACTIVE' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="py-6 text-black/40 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {new Date(link.created_at).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </div>
                      </td>
                      <td className="py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleCopy(link.slug)}
                            className={`p-2 rounded-lg transition-all ${copiedId === link.slug ? 'bg-emerald-500 text-white' : 'text-black/20 hover:text-[#7F00DF] hover:bg-indigo-50'}`}
                            title="Copiar Link"
                          >
                            {copiedId === link.slug ? <Check size={18} /> : <Copy size={18} />}
                          </button>
                          <button 
                            onClick={() => window.open(`${window.location.origin}/p/${link.slug}`, '_blank')}
                            className="p-2 text-black/20 hover:text-black hover:bg-black/5 rounded-lg transition-colors" 
                            title="Ver Checkout"
                          >
                            <ExternalLink size={18} />
                          </button>
                          <button className="p-2 text-black/20 hover:text-[#7F00DF] hover:bg-indigo-50 rounded-lg transition-colors" title="Eliminar">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <PaymentLinkModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            saving={saving}
            onSave={async (data: any) => {
              if (!merchant) return;
              setSaving(true);
              try {
                const newLink = await dbService.createPaymentLink({
                  merchantId: merchant.id,
                  amount: Number(data.amount) || 0,
                  description: data.concept,
                  slug: data.id,
                  isOpenAmount: data.isOpenAmount,
                  returnUrl: data.returnUrl,
                  allowPse: data.allowPse,
                  allowCard: data.allowCard
                });
                
                if (newLink) {
                  // Actualizar lista local con el nuevo link y contador de pagos 0
                  setLinks([{ ...newLink[0], payments_count: 0 }, ...links]);
                }
              } catch (err) {
                console.error('Error saving link:', err);
              } finally {
                setSaving(false);
              }
            }}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
};
