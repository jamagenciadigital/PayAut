import React from 'react';
import { Link } from 'react-router-dom';
import { currentUser, mockTransactions as mockData } from '../mockData';
import { dbService } from '../services/api';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign,
  Plus,
  CreditCard,
  Eye,
  X,
  User,
  Mail,
  Phone,
  FileText,
  MapPin,
  Calendar,
  Hash,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  LinkIcon,
  Globe,
  Settings2,
  Check,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layout } from '../components/Layout';
import pseLogo from '../assets/pse-seeklogo.png';
import { BuyUsdModal } from '../components/BuyUsdModal';
import { WithdrawalModal } from '../components/WithdrawalModal';
import { Wallet } from 'lucide-react';

const StatCard = ({ title, value, trend, icon: Icon, trendUp }: any) => (
  <div className="bg-white border border-black/5 p-8 rounded-sm shadow-sm flex flex-col gap-4 flex-1">
    <div className="flex justify-between items-start mb-2">
      <div className="p-3 bg-black/5 rounded-lg">
        <Icon className="text-black" size={20} />
      </div>
      <div className={trendUp ? "text-emerald-600 flex items-center text-xs font-bold" : "text-[#7F00DF] flex items-center text-xs font-bold"}>
        {trend}
        {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      </div>
    </div>
    <h3 className="text-black/40 text-[10px] font-black uppercase tracking-[0.2em]">{title}</h3>
    <p className="text-3xl font-bold text-[#7F00DF] tracking-tighter leading-none">{value}</p>
  </div>
);

const TransactionDetailModal = ({ isOpen, onClose, tx }: any) => {
  if (!isOpen || !tx) return null;

  const amount = Number(tx.amount);
  const isPse = String(tx.paymentMethod || tx.payment_method).toUpperCase() === 'PSE';
  const feePercent = isPse ? 0.025 : 0.029;
  const flatFee = 900;
  const subtotalFee = (amount * feePercent) + flatFee;
  const iva = subtotalFee * 0.19;
  const totalDiscount = subtotalFee + iva;
  const netAmount = amount - totalDiscount;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[500] flex items-center justify-end p-0 md:p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="bg-white w-full max-w-2xl h-full md:h-[calc(100vh-48px)] overflow-y-auto md:rounded-3xl shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header con Saldo Grande */}
        <div className="bg-black p-10 text-white sticky top-0 z-10">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Saldo Neto Disponible</span>
            <h2 className="text-5xl font-black tracking-tighter text-[#7F00DF]">
              ${Math.round(netAmount).toLocaleString()}
            </h2>
            <div className="flex items-center gap-2 mt-4">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                tx.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' : 
                tx.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-rose-400'
              }`}>
                {tx.status === 'APPROVED' ? 'PAGO EXITOSO' : 
                 tx.status === 'PENDING' ? 'PROCESANDO' : 'FALLIDO'}
              </span>
              <span className="text-white/20 text-[10px] font-bold">|</span>
              <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Ref: {String(tx.id).slice(0, 12)}</span>
            </div>
          </div>
        </div>

        <div className="p-10 flex flex-col gap-10">
          {/* Resumen Financiero */}
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-1 p-6 bg-slate-50 rounded-2xl">
              <span className="text-[9px] font-black text-black/30 uppercase tracking-widest">Monto Pagado</span>
              <span className="text-lg font-black text-black">${amount.toLocaleString()}</span>
            </div>
            <div className="flex flex-col gap-1 p-6 bg-indigo-50 rounded-2xl">
              <span className="text-[9px] font-black text-[#7F00DF]/40 uppercase tracking-widest">Descuento</span>
              <span className="text-lg font-black text-[#7F00DF]">-${Math.round(totalDiscount).toLocaleString()}</span>
            </div>
            <div className="flex flex-col gap-1 p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-[9px] font-black text-emerald-600/40 uppercase tracking-widest">Neto a Recibir</span>
              <span className="text-lg font-black text-emerald-600">${Math.round(netAmount).toLocaleString()}</span>
            </div>
          </div>

          {/* Información del Cliente */}
          <div>
            <h4 className="text-[11px] font-black text-black/20 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <User size={14} />
              Información del Pagador
            </h4>
            <div className="grid grid-cols-2 gap-y-8 bg-black/[0.02] p-8 rounded-3xl border border-black/5">
              <DetailItem label="Nombre Completo" value={tx.customer_name || 'Cliente No Identificado'} icon={User} />
              <DetailItem label="Correo Electrónico" value={tx.customerEmail || tx.customer_email} icon={Mail} />
              <DetailItem label="Teléfono de Contacto" value={tx.customer_phone || '---'} icon={Phone} />
              <DetailItem label="Documento" value={tx.customer_document || '---'} icon={FileText} />
              <DetailItem label="Dirección de Facturación" value={tx.customer_address || '---'} icon={MapPin} full />
            </div>
          </div>

          {/* Detalles del Pago */}
          <div className="grid grid-cols-2 gap-12">
            <div>
              <h4 className="text-[11px] font-black text-black/20 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Hash size={14} />
                Detalles del Pago
              </h4>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center py-2 border-b border-black/5">
                  <span className="text-[10px] font-bold text-black/40 uppercase">Código / Referencia</span>
                  <span className="text-xs font-mono font-bold text-black">TX-{String(tx.id).slice(-6)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-black/5">
                  <span className="text-[10px] font-bold text-black/40 uppercase">Método de Pago</span>
                  <div className="flex items-center gap-2">
                    {isPse ? (
                      <img src={pseLogo} alt="PSE" className="w-5 h-5 object-contain" />
                    ) : (
                      <CreditCard size={14} className="text-[#7F00DF]" />
                    )}
                    <span className="text-xs font-bold text-black">{isPse ? 'PSE' : 'Tarjeta Crédito'}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-black/5">
                  <span className="text-[10px] font-bold text-black/40 uppercase">Fecha de Proceso</span>
                  <span className="text-xs font-bold text-black">
                    {new Date(tx.createdAt).toLocaleString('es-CO')}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-[11px] font-black text-black/20 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Shield size={14} />
                Resumen del Descuento
              </h4>
              <div className="bg-indigo-50/30 p-6 rounded-2xl border border-rose-100/50 flex flex-col gap-3">
                <div className="flex justify-between text-[10px] font-bold text-rose-900/60 uppercase">
                  <span>Comisión ({feePercent * 100}%)</span>
                  <span>${(amount * feePercent).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-rose-900/60 uppercase">
                  <span>Tarifa Fija</span>
                  <span>${flatFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-rose-900/60 uppercase border-b border-rose-100 pb-2">
                  <span>IVA (19%)</span>
                  <span>${Math.round(iva).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-black text-[#7F00DF] uppercase pt-1">
                  <span>Total Descuento</span>
                  <span>${Math.round(totalDiscount).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DetailItem = ({ label, value, icon: Icon, full }: any) => (
  <div className={`flex flex-col gap-1.5 ${full ? 'col-span-2' : ''}`}>
    <div className="flex items-center gap-2 text-black/20">
      <Icon size={12} />
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-xs font-bold text-black truncate">{value || '---'}</span>
  </div>
);

import { PaymentLinkModal } from '../components/PaymentLinkModal';

export const MerchantDashboard = () => {
  const userStr = localStorage.getItem('currentUser');
  const user = userStr ? JSON.parse(userStr) : currentUser;
  
  const [transactions, setTransactions] = React.useState(mockData);
  const [loading, setLoading] = React.useState(true);
  const [selectedTx, setSelectedTx] = React.useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = React.useState(false);
  const [isBuyUsdModalOpen, setIsBuyUsdModalOpen] = React.useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

  const [merchant, setMerchant] = React.useState<any>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // En una app real, esto vendría del contexto de Auth
        const merch = await dbService.getMerchantByUserId(user.id);
        if (merch) {
          setMerchant(merch);
          const data = await dbService.getTransactions(merch.id);
          if (data && data.length > 0) {
            setTransactions(data as any);
          }
        }
      } catch (err) {
        console.warn('Usando datos mock (Neon no configurado aún)');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout role="MERCHANT">
      <div className="p-4 md:p-12 w-full max-w-[1600px] mx-auto bg-[#F2F2F2] min-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 pt-12 lg:pt-0">
          <div className="text-left">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-black uppercase tracking-tighter">Dashboard</h1>
            <p className="text-black/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Bienvenido de nuevo, {user?.name || 'Usuario'}</p>
          </div>
          
          <div className="flex flex-row items-center gap-2 md:gap-3 w-full md:w-auto justify-end">
            <button 
              onClick={() => setIsBuyUsdModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#7F00DF] text-white px-3 md:px-6 py-4 rounded-xl font-bold shadow-premium hover:scale-105 transition-all outline-none border-none cursor-pointer whitespace-nowrap text-[9px] md:text-sm uppercase tracking-tighter"
            >
              <Wallet size={16} className="hidden sm:block" />
              COMPRAR USD
            </button>
            <button 
              onClick={() => setIsWithdrawalModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-black text-white px-3 md:px-6 py-4 rounded-xl font-bold shadow-premium hover:scale-105 transition-all outline-none border-none cursor-pointer whitespace-nowrap text-[9px] md:text-sm uppercase tracking-tighter"
            >
              <ArrowUpRight size={16} className="hidden sm:block" />
              RETIRO
            </button>
            <button 
              onClick={() => setIsLinkModalOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#000051] text-white px-3 md:px-6 py-4 rounded-xl font-bold shadow-premium hover:scale-105 transition-all outline-none border-none cursor-pointer whitespace-nowrap text-[9px] md:text-sm uppercase tracking-tighter"
            >
              <Plus size={16} className="hidden sm:block" />
              Nuevo Link
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12">
          <StatCard 
            title="Ventas Totales" 
            value="$1,250,000" 
            trend="+12.5%" 
            icon={DollarSign} 
            trendUp 
          />
          <StatCard 
            title="Transacciones" 
            value="48" 
            trend="+8.2%" 
            icon={TrendingUp} 
            trendUp 
          />
          <StatCard 
            title="Saldo Disponible" 
            value={`$${merchant?.balanceAvailable?.toLocaleString() || '0'}`} 
            trend="Configurar" 
            icon={CreditCard} 
            trendUp={false} 
          />
          <StatCard 
            title="Saldo en USD" 
            value={`$${merchant?.balanceUSD?.toLocaleString() || '0'}`} 
            trend="Recargar" 
            icon={DollarSign} 
            trendUp={true} 
          />
        </div>

        {/* Recent Transactions Table */}
        <div className="bg-white border border-black/5 rounded-sm shadow-sm p-4 md:p-10">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-xl font-bold text-black">Transacciones Recientes</h2>
            <button className="text-[#7F00DF] text-sm font-bold hover:underline cursor-pointer">Ver todas</button>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <div className="animate-spin h-8 w-8 border-4 border-[#7F00DF] border-t-transparent rounded-full" />
                <p className="text-[10px] font-black uppercase tracking-widest text-black/20">Cargando transacciones...</p>
              </div>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black/5 text-black/40 text-sm">
                    <th className="pb-6 font-bold uppercase tracking-widest text-[10px]">Cliente</th>
                    <th className="pb-6 font-bold uppercase tracking-widest text-[10px]">Monto</th>
                    <th className="pb-6 font-bold uppercase tracking-widest text-[10px]">Valor Descuento</th>
                    <th className="pb-6 font-bold uppercase tracking-widest text-[10px]">Saldo</th>
                    <th className="pb-6 font-bold uppercase tracking-widest text-[10px]">Método</th>
                    <th className="pb-6 font-bold uppercase tracking-widest text-[10px]">Estado</th>
                    <th className="pb-6 font-bold uppercase tracking-widest text-[10px]">Fecha</th>
                    <th className="pb-6 font-bold uppercase tracking-widest text-[10px] text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {transactions.map((tx: any) => {
                    const amount = Number(tx.amount);
                    const isPse = String(tx.paymentMethod || tx.payment_method).toUpperCase() === 'PSE';
                    const feePercent = isPse ? 0.025 : 0.029;
                    const flatFee = 900;
                    const subtotalFee = (amount * feePercent) + flatFee;
                    const iva = subtotalFee * 0.19;
                    const totalDiscount = subtotalFee + iva;
                    const netAmount = amount - totalDiscount;

                    return (
                      <tr key={tx.id} className="text-black/80 hover:bg-slate-50 transition-colors group">
                        <td className="py-6 font-semibold">{tx.customerEmail || tx.customer_email}</td>
                        <td className="py-6 font-bold text-black">${amount.toLocaleString()}</td>
                        <td className="py-6 font-bold text-rose-500">
                          -${Math.round(totalDiscount).toLocaleString()}
                          <span className="block text-[8px] font-black text-rose-400 uppercase tracking-tighter">Comisión + IVA</span>
                        </td>
                        <td className="py-6 font-bold text-emerald-600">
                          ${Math.round(netAmount).toLocaleString()}
                          <span className="block text-[8px] font-black text-emerald-500/40 uppercase tracking-tighter">Neto</span>
                        </td>
                        <td className="py-6">
                          {isPse ? (
                            <div className="flex items-center gap-2" title="PSE">
                              <img src={pseLogo} alt="PSE" className="w-8 h-8 object-contain" />
                              <span className="text-[10px] font-black text-black/40 uppercase tracking-widest">PSE</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-black/60" title="Tarjeta">
                              <CreditCard size={16} className="text-[#7F00DF]" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Tarjeta</span>
                            </div>
                          )}
                        </td>
                        <td className="py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit ${
                            tx.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-600' : 
                            tx.status === 'PENDING' ? 'bg-amber-500/10 text-amber-600' : 'bg-indigo-500/10 text-[#7F00DF]'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              tx.status === 'APPROVED' ? 'bg-emerald-600' : 
                              tx.status === 'PENDING' ? 'bg-amber-600 animate-pulse' : 'bg-[#000051]'
                            }`} />
                            {tx.status === 'APPROVED' ? 'Aprobado' : 
                             tx.status === 'PENDING' ? 'Pendiente' : 'Rechazado'}
                          </span>
                        </td>
                        <td className="py-6 text-black/40 text-sm font-medium">
                          {tx.createdAt instanceof Date ? tx.createdAt.toLocaleDateString() : new Date(tx.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-6 text-right">
                          <button 
                            onClick={() => {
                              setSelectedTx(tx);
                              setIsDetailModalOpen(true);
                            }}
                            className="p-2 text-black/20 hover:text-[#7F00DF] transition-colors hover:bg-indigo-50 rounded-lg"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isDetailModalOpen && (
          <TransactionDetailModal 
            isOpen={isDetailModalOpen}
            onClose={() => setIsDetailModalOpen(false)}
            tx={selectedTx}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLinkModalOpen && (
          <PaymentLinkModal
            isOpen={isLinkModalOpen}
            onClose={() => setIsLinkModalOpen(false)}
            saving={saving}
            onSave={async (data: any) => {
              if (!merchant) return;
              setSaving(true);
              try {
                await dbService.createPaymentLink({
                  merchantId: merchant.id,
                  amount: Number(data.amount) || 0,
                  description: data.concept,
                  slug: data.id,
                  isOpenAmount: data.isOpenAmount,
                  returnUrl: data.returnUrl,
                  allowPse: data.allowPse,
                  allowCard: data.allowCard
                });
              } catch (err) {
                console.error('Error saving link:', err);
              } finally {
                setSaving(false);
              }
            }}
          />
        )}
        <BuyUsdModal 
          isOpen={isBuyUsdModalOpen} 
          onClose={() => setIsBuyUsdModalOpen(false)}
          availableBalanceCop={merchant?.balanceAvailable || 0}
          onSuccess={(amount) => {
            setMerchant((prev: any) => ({
              ...prev,
              balanceUSD: (prev.balanceUSD || 0) + amount
            }));
          }}
        />
        <WithdrawalModal
          isOpen={isWithdrawalModalOpen}
          onClose={() => setIsWithdrawalModalOpen(false)}
          availableBalanceCop={merchant?.balanceAvailable || 0}
          bankInfo={merchant?.bankInfo || { bankName: 'No configurado', accountNumber: '-', accountType: 'SAVINGS' }}
          onSuccess={(amount) => {
            setMerchant((prev: any) => ({
              ...prev,
              balanceAvailable: (prev.balanceAvailable || 0) - amount
            }));
          }}
        />
      </AnimatePresence>
    </Layout>
  );
};
