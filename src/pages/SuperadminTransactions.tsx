import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  CheckCircle2, 
  XCircle,
  CreditCard,
  Building2,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import pseLogo from '../assets/pse-seeklogo.png';

const StatCard = ({ title, value, icon: Icon, color, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white p-8 rounded-[32px] border border-black/5 shadow-xl shadow-black/5 flex-1 group hover:scale-[1.02] transition-all"
  >
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
        <Icon size={24} className={color.replace('bg-', 'text-')} />
      </div>
      <div className="flex items-center gap-1 text-[10px] font-black text-black/20 uppercase tracking-widest">
        <span>Hoy</span>
        <ChevronDown size={12} />
      </div>
    </div>
    <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] mb-1">{title}</p>
    <h3 className="text-3xl font-black text-black tracking-tighter">{value}</h3>
  </motion.div>
);

export const SuperadminTransactions = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [merchantFilter, setMerchantFilter] = useState('ALL');

  // Mock Data
  const MOCK_TRANSACTIONS = [
    { id: '1', merchant: 'TechStore SAS', customer: 'maria@gmail.com', amount: 450000, method: 'PSE', date: '2024-05-14 10:30', status: 'SUCCESS', available: 436500 },
    { id: '2', merchant: 'Restaurante Gourmet', customer: 'carlos@outlook.com', amount: 125000, method: 'CARD', date: '2024-05-14 09:15', status: 'SUCCESS', available: 121250 },
    { id: '3', merchant: 'TechStore SAS', customer: 'pedro@yahoo.es', amount: 890000, method: 'CARD', date: '2024-05-14 08:45', status: 'REJECTED', available: 0 },
    { id: '4', merchant: 'Moda Fashion', customer: 'ana.v@gmail.com', amount: 230000, method: 'PSE', date: '2024-05-13 16:20', status: 'SUCCESS', available: 223100 },
    { id: '5', merchant: 'Gimnasio Fit', customer: 'luis.m@live.com', amount: 150000, method: 'CARD', date: '2024-05-13 14:10', status: 'SUCCESS', available: 145500 },
    { id: '6', merchant: 'TechStore SAS', customer: 'sofia@gmail.com', amount: 320000, method: 'CARD', date: '2024-05-13 11:30', status: 'SUCCESS', available: 310400 },
  ];

  const filteredTransactions = MOCK_TRANSACTIONS.filter(tx => {
    const matchesSearch = tx.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          tx.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMerchant = merchantFilter === 'ALL' || tx.merchant === merchantFilter;
    return matchesSearch && matchesMerchant;
  });

  const stats = {
    approved: 1284500,
    rejected: 890000,
    available: 1236750
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val);
  };

  const merchants = Array.from(new Set(MOCK_TRANSACTIONS.map(tx => tx.merchant)));

  return (
    <Layout role="SUPERADMIN">
      <div className="p-4 md:p-12 w-full max-w-[1600px] mx-auto flex flex-col gap-10 bg-[#F2F2F2] min-h-screen">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-12 lg:pt-0">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-black uppercase tracking-tighter">Historial Transaccional</h1>
            <p className="text-black/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Monitoreo de flujos y conciliación</p>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por cliente o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-6 py-4 bg-white border border-black/5 rounded-2xl text-sm font-bold focus:outline-none focus:border-[#cc0066] transition-all w-full sm:w-64 shadow-sm"
              />
            </div>
            
            <div className="relative w-full sm:w-auto">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cc0066]" size={18} />
              <select 
                value={merchantFilter}
                onChange={(e) => setMerchantFilter(e.target.value)}
                className="pl-12 pr-10 py-4 bg-white border border-black/5 rounded-2xl text-sm font-black uppercase tracking-tight focus:outline-none appearance-none cursor-pointer shadow-sm w-full"
              >
                <option value="ALL">Todos los Comercios</option>
                {merchants.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <StatCard 
            title="Saldo Aprobado" 
            value={formatCurrency(stats.approved)} 
            icon={CheckCircle2} 
            color="bg-emerald-500" 
            delay={0.1}
          />
          <StatCard 
            title="Saldo Rechazado" 
            value={formatCurrency(stats.rejected)} 
            icon={XCircle} 
            color="bg-rose-500" 
            delay={0.2}
          />
          <StatCard 
            title="Saldo Disponible" 
            value={formatCurrency(stats.available)} 
            icon={Wallet} 
            color="bg-[#cc0066]" 
            delay={0.3}
          />
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-black/5 border border-black/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-8 py-6 text-[10px] font-black text-black/30 uppercase tracking-[0.2em] border-b border-black/5">Comercio</th>
                  <th className="px-8 py-6 text-[10px] font-black text-black/30 uppercase tracking-[0.2em] border-b border-black/5">Cliente</th>
                  <th className="px-8 py-6 text-[10px] font-black text-black/30 uppercase tracking-[0.2em] border-b border-black/5">Monto Total</th>
                  <th className="px-8 py-6 text-[10px] font-black text-black/30 uppercase tracking-[0.2em] border-b border-black/5">Valor Descuento</th>
                  <th className="px-8 py-6 text-[10px] font-black text-black/30 uppercase tracking-[0.2em] border-b border-black/5">Método / Fecha</th>
                  <th className="px-8 py-6 text-[10px] font-black text-black/30 uppercase tracking-[0.2em] border-b border-black/5">Estado</th>
                  <th className="px-8 py-6 text-[10px] font-black text-black/30 uppercase tracking-[0.2em] border-b border-black/5 text-right">Saldo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                  {filteredTransactions.map((tx) => {
                    const amount = Number(tx.amount);
                    const isPse = tx.method === 'PSE';
                    const feePercent = isPse ? 0.025 : 0.029;
                    const flatFee = 900;
                    const subtotalFee = (amount * feePercent) + flatFee;
                    const iva = subtotalFee * 0.19;
                    const totalDiscount = subtotalFee + iva;
                    const netAmount = amount - totalDiscount;

                    return (
                      <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-black text-[10px]">
                              {tx.merchant.charAt(0)}
                            </div>
                            <span className="text-xs font-black text-black uppercase tracking-tight">{tx.merchant}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-bold text-black">{tx.customer}</p>
                          <p className="text-[10px] font-medium text-black/30 tracking-tight">Ref: TX-{tx.id}00234</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-black">{formatCurrency(amount)}</p>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-sm font-black text-rose-500">-{formatCurrency(totalDiscount)}</p>
                          <p className="text-[9px] font-bold text-rose-400 uppercase tracking-tighter">Comisión + IVA</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 mb-1">
                            {isPse ? (
                              <img src={pseLogo} alt="PSE" className="w-8 h-8 object-contain" />
                            ) : (
                              <CreditCard size={14} className="text-[#7a00cc]" />
                            )}
                            <span className="text-[10px] font-black text-black/60 uppercase">{isPse ? 'PSE' : 'Tarjeta'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-black/20">
                            <Calendar size={12} />
                            <span>{tx.date}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            tx.status === 'SUCCESS' 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                              : 'bg-rose-50 text-rose-600 border border-rose-100'
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${tx.status === 'SUCCESS' ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                            {tx.status === 'SUCCESS' ? 'Aprobado' : 'Rechazado'}
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <p className={`text-sm font-black ${tx.status === 'SUCCESS' ? 'text-[#cc0066]' : 'text-black/20'}`}>
                            {formatCurrency(tx.status === 'SUCCESS' ? netAmount : 0)}
                          </p>
                          <p className="text-[9px] font-bold text-black/30 uppercase tracking-widest">Saldo</p>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Placeholder */}
          <div className="p-8 border-t border-black/5 bg-slate-50 flex items-center justify-between">
            <p className="text-[10px] font-bold text-black/40 uppercase tracking-widest">Mostrando 6 de 128 transacciones</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-black/5 rounded-xl text-[10px] font-black text-black/30 uppercase tracking-widest hover:text-[#cc0066] transition-colors">Anterior</button>
              <button className="px-4 py-2 bg-white border border-black/5 rounded-xl text-[10px] font-black text-black uppercase tracking-widest hover:border-[#cc0066] transition-colors shadow-sm">Siguiente</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
