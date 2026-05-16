import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { dbService } from '../services/api';
import { motion } from 'framer-motion';
import { 
  Users, 
  BarChart3, 
  TrendingUp, 
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';
import pseLogo from '../assets/pse-seeklogo.png';

const GlobalStat = ({ title, value, delay, icon: Icon }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    className="bg-white border border-black/5 p-8 md:p-10 rounded-3xl shadow-sm flex flex-col gap-6 flex-1 relative overflow-hidden group hover:shadow-xl hover:shadow-[#7F00DF]/5 transition-all"
  >
    <div className="flex justify-between items-start">
      <div className="p-3 bg-black/5 rounded-2xl group-hover:bg-[#7F00DF]/10 transition-colors">
        <Icon className="text-black/40 group-hover:text-[#7F00DF] transition-colors" size={20} />
      </div>
    </div>
    <div className="flex flex-col gap-2">
      <p className="text-black/40 font-black uppercase tracking-[0.2em] text-[9px]">{title}</p>
      <h3 className="text-3xl md:text-4xl font-black text-black group-hover:text-[#7F00DF] tracking-tighter leading-none transition-colors">
        {value}
      </h3>
    </div>
  </motion.div>
);

export const SuperadminDashboard = () => {
  const [stats, setStats] = useState({ total_volume: 0, active_merchants: 0, total_commissions: 0 });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, txData] = await Promise.all([
          dbService.getGlobalStats(),
          dbService.getTransactions()
        ]);
        setStats(statsData);
        setTransactions(txData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <Layout role="SUPERADMIN">
      <div className="p-4 md:p-12 w-full max-w-[1600px] mx-auto flex flex-col gap-8 bg-[#F2F2F2] min-h-screen">
        <header className="mb-4 pt-12 lg:pt-0">
          <h1 className="text-xl md:text-2xl font-black text-black tracking-tight uppercase">Panel Global de Control</h1>
          <p className="text-black/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Monitoreo en tiempo real de la plataforma</p>
        </header>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlobalStat 
            title="Volumen Transaccional" 
            value={formatCurrency(stats.total_volume)} 
            icon={TrendingUp}
            delay={0.1} 
          />
          <GlobalStat 
            title="Comercios Registrados" 
            value={stats.active_merchants.toString()} 
            icon={Users}
            delay={0.2} 
          />
          <GlobalStat 
            title="Ingresos por Comisiones" 
            value={formatCurrency(stats.total_commissions)} 
            icon={BarChart3}
            delay={0.3} 
          />
        </div>

        {/* Main Content Area: Recent Transactions */}
        <div className="bg-white border border-black/5 rounded-[40px] shadow-2xl shadow-black/5 p-8 md:p-10">
          <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-black uppercase tracking-tight">Transacciones Recientes</h2>
                <p className="text-[10px] font-black text-black/40 uppercase tracking-widest mt-1">Últimos movimientos de todos los comercios</p>
              </div>
              <button className="flex items-center gap-2 text-[10px] font-black text-[#7F00DF] uppercase tracking-widest hover:translate-x-1 transition-transform">
                Ver Todo <ChevronRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="pb-6 text-[9px] font-black text-black/30 uppercase tracking-[0.2em] border-b border-black/5">Fecha</th>
                    <th className="pb-6 text-[9px] font-black text-black/30 uppercase tracking-[0.2em] border-b border-black/5">Comercio</th>
                    <th className="pb-6 text-[9px] font-black text-black/30 uppercase tracking-[0.2em] border-b border-black/5">Cliente</th>
                    <th className="pb-6 text-[9px] font-black text-black/30 uppercase tracking-[0.2em] border-b border-black/5">Monto</th>
                    <th className="pb-6 text-[9px] font-black text-black/30 uppercase tracking-[0.2em] border-b border-black/5">Estado</th>
                    <th className="pb-6 text-[9px] font-black text-black/30 uppercase tracking-[0.2em] border-b border-black/5 text-right">Método</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {transactions.length > 0 ? (
                    transactions.map((tx, idx) => (
                      <tr key={tx.id || idx} className="group hover:bg-slate-50 transition-colors">
                        <td className="py-6 pr-4">
                          <p className="text-[11px] font-bold text-black/60">
                            {new Date(tx.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-[9px] text-black/30 uppercase font-black tracking-tighter">
                            {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>
                        <td className="py-6 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[#7F00DF] font-black text-[10px]">
                              {tx.merchant_name?.charAt(0)}
                            </div>
                            <span className="text-xs font-black text-black uppercase tracking-tight">{tx.merchant_name}</span>
                          </div>
                        </td>
                        <td className="py-6 px-4">
                          <p className="text-xs font-bold text-black">{tx.customer_email}</p>
                        </td>
                        <td className="py-6 px-4">
                          <p className="text-xs font-black text-black">{formatCurrency(tx.amount)}</p>
                          <p className="text-[9px] font-bold text-emerald-600">Comisión: {formatCurrency(tx.fee_amount)}</p>
                        </td>
                        <td className="py-6 px-4">
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            tx.status === 'SUCCESS' || tx.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-600' 
                              : 'bg-amber-50 text-amber-600'
                          }`}>
                            <div className={`w-1 h-1 rounded-full ${tx.status === 'SUCCESS' || tx.status === 'COMPLETED' ? 'bg-emerald-600' : 'bg-amber-600 animate-pulse'}`} />
                            {tx.status === 'SUCCESS' || tx.status === 'COMPLETED' ? 'Completado' : 'Pendiente'}
                          </div>
                        </td>
                        <td className="py-6 pl-4 text-right">
                          <div className="flex items-center justify-end gap-2 text-black/60">
                            {tx.payment_method === 'PSE' ? (
                              <img src={pseLogo} alt="PSE" className="w-8 h-8 object-contain" />
                            ) : (
                              <CreditCard size={14} className="text-[#7F00DF]" />
                            )}
                            <span className="text-[10px] font-black uppercase tracking-widest">{tx.payment_method === 'PSE' ? 'PSE' : 'Tarjeta'}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-20 text-center">
                        <div className="flex flex-col items-center gap-3 opacity-20">
                          <Clock size={40} />
                          <p className="text-sm font-black uppercase tracking-widest">Esperando transacciones...</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
