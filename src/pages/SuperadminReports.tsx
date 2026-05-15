import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Calendar, 
  Download, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Building2,
  ChevronDown,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_MONTHLY_DATA = [
  { name: 'Ene', aprobadas: 4000, rechazadas: 2400 },
  { name: 'Feb', aprobadas: 3000, rechazadas: 1398 },
  { name: 'Mar', aprobadas: 2000, rechazadas: 9800 },
  { name: 'Abr', aprobadas: 2780, rechazadas: 3908 },
  { name: 'May', aprobadas: 1890, rechazadas: 4800 },
  { name: 'Jun', aprobadas: 2390, rechazadas: 3800 },
];

const MOCK_PIE_DATA = [
  { name: 'Aprobadas', value: 75 },
  { name: 'Rechazadas', value: 25 },
];

const COLORS = ['#cc0066', '#f43f5e'];

const ReportCard = ({ title, value, subValue, trend, icon: Icon, delay }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white p-8 rounded-[32px] border border-black/5 shadow-xl shadow-black/5 flex-1"
  >
    <div className="flex justify-between items-start mb-6">
      <div className="p-3 bg-[#cc0066]/5 rounded-2xl text-[#cc0066]">
        <Icon size={24} />
      </div>
      {trend && (
        <span className={`text-[10px] font-black px-3 py-1 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
      )}
    </div>
    <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.2em] mb-1">{title}</p>
    <h3 className="text-3xl font-black text-black tracking-tighter mb-2">{value}</h3>
    <p className="text-xs font-bold text-black/40">{subValue}</p>
  </motion.div>
);

export const SuperadminReports = () => {
  const [dateRange, setDateRange] = useState('30D');
  const [selectedMerchant, setSelectedMerchant] = useState('ALL');

  return (
    <Layout role="SUPERADMIN">
      <div className="p-4 md:p-12 w-full max-w-[1600px] mx-auto flex flex-col gap-10 bg-[#F2F2F2] min-h-screen">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-12 lg:pt-0">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-black uppercase tracking-tighter">Reportes Globales</h1>
            <p className="text-black/40 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Análisis comparativo y métricas de red</p>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4">
            <div className="bg-white p-1.5 rounded-2xl border border-black/5 shadow-sm flex overflow-x-auto no-scrollbar">
              {['7D', '30D', '90D', '1Y'].map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all flex-1 sm:flex-none whitespace-nowrap ${
                    dateRange === range ? 'bg-black text-white' : 'text-black/40 hover:text-black'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-auto">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-[#cc0066]" size={18} />
              <select 
                value={selectedMerchant}
                onChange={(e) => setSelectedMerchant(e.target.value)}
                className="pl-12 pr-10 py-4 bg-white border border-black/5 rounded-2xl text-sm font-black uppercase tracking-tight focus:outline-none appearance-none cursor-pointer shadow-sm w-full"
              >
                <option value="ALL">Todos los Comercios</option>
                <option value="T1">TechStore SAS</option>
                <option value="T2">Restaurante Gourmet</option>
              </select>
            </div>

            <button className="w-full sm:w-auto bg-[#cc0066] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-110 transition-all shadow-xl shadow-[#cc0066]/20">
              <Download size={18} />
              Exportar
            </button>
          </div>
        </header>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <ReportCard 
            title="Transacciones" 
            value="12.845" 
            subValue="Total procesado" 
            trend={12.5} 
            icon={TrendingUp} 
            delay={0.1}
          />
          <ReportCard 
            title="Conversión" 
            value="75.2%" 
            subValue="Tasa de aprobación" 
            trend={2.1} 
            icon={FileText} 
            delay={0.2}
          />
          <ReportCard 
            title="Rechazos" 
            value="3.120" 
            subValue="Transacciones fallidas" 
            trend={-4.3} 
            icon={TrendingDown} 
            delay={0.3}
          />
          <ReportCard 
            title="Comercios" 
            value="156" 
            subValue="Nuevos registrados" 
            trend={8.7} 
            icon={Users} 
            delay={0.4}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart: Approved vs Rejected */}
          <div className="lg:col-span-2 bg-white p-10 rounded-[40px] shadow-2xl shadow-black/5 border border-black/5">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-xl font-black text-black uppercase tracking-tight">Aprobadas vs Rechazadas</h3>
                <p className="text-[10px] font-black text-black/30 uppercase tracking-widest mt-1">Comparativa mensual de desempeño</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#cc0066]" />
                  <span className="text-[10px] font-black uppercase text-black/40">Aprobadas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400" />
                  <span className="text-[10px] font-black uppercase text-black/40">Rechazadas</span>
                </div>
              </div>
            </div>
            
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_MONTHLY_DATA}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 900, fill: '#94a3b8' }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="aprobadas" fill="#cc0066" radius={[6, 6, 0, 0]} barSize={30} />
                  <Bar dataKey="rechazadas" fill="#fb7185" radius={[6, 6, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Chart: Distribution */}
          <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-black/5 border border-black/5 flex flex-col">
            <div className="mb-10 text-center">
              <h3 className="text-xl font-black text-black uppercase tracking-tight">Distribución</h3>
              <p className="text-[10px] font-black text-black/30 uppercase tracking-widest mt-1">Porcentaje de éxito total</p>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center relative">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={MOCK_PIE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {MOCK_PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-2xl font-black text-black">75%</p>
                <p className="text-[9px] font-black text-black/30 uppercase tracking-widest">Éxito</p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {MOCK_PIE_DATA.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-black/5">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-[10px] font-black uppercase text-black/60 tracking-widest">{item.name}</span>
                  </div>
                  <span className="text-sm font-black text-black">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Report Interface */}
        <div className="bg-black p-10 md:p-16 rounded-[60px] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#cc0066]/10 blur-[100px] rounded-full -mr-48 -mt-48" />
          
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter mb-4">Constructor de Reportes</h2>
            <p className="text-white/40 text-sm font-bold leading-relaxed">
              Genera reportes personalizados en formato PDF o Excel. Filtra por fechas específicas, comercios asociados y tipos de transacciones para obtener un análisis detallado de tu red.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto relative z-10">
            <button className="flex-1 md:flex-none px-10 py-5 bg-white text-black rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl">
              <FileSpreadsheet size={18} />
              Excel (.xlsx)
            </button>
            <button className="flex-1 md:flex-none px-10 py-5 bg-[#cc0066] text-white rounded-[24px] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-all shadow-xl">
              <FileText size={18} />
              PDF (.pdf)
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
