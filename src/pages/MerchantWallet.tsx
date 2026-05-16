import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { 
  Eye, 
  Lock, 
  Settings, 
  MoreHorizontal, 
  Plus,
  CreditCard as CardIcon
} from 'lucide-react';
import logoWhite from '../assets/logo_pagosx.svg'; // Use white version if available, or filter

export const MerchantWallet = () => {
  const userStr = localStorage.getItem('currentUser');
  const user = userStr ? JSON.parse(userStr) : { name: 'Comerciante' };

  return (
    <Layout role="MERCHANT">
      <div className="lg:hidden flex flex-col items-center p-6 bg-white min-h-screen pt-20">
        <h1 className="text-sm font-bold text-black/40 uppercase tracking-widest mb-8">Smart Card</h1>
        
        {/* Credit Card */}
        <motion.div 
          initial={{ rotateY: -20, opacity: 0 }}
          animate={{ rotateY: 0, opacity: 1 }}
          className="w-full aspect-[1.586/1] rounded-[24px] p-8 flex flex-col justify-between relative overflow-hidden shadow-2xl mb-12 bg-gradient-to-br from-[#7F00DF] to-[#000051]"
        >
          {/* Decorative Circles */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#7F00DF]/30 rounded-full blur-3xl" />

          <div className="flex justify-between items-start relative z-10">
            <div className="flex flex-col gap-1">
               <img src={logoWhite} alt="PagoX" className="h-6 brightness-0 invert" />
               <p className="text-white text-lg font-medium mt-2">{user.name}</p>
            </div>
          </div>

          <div className="flex justify-between items-end relative z-10">
            <p className="text-white font-mono text-xl tracking-[0.2em]">**** 1234</p>
            <div className="flex flex-col items-end">
              <span className="text-[40px] font-black text-white italic tracking-tighter leading-none">VISA</span>
            </div>
          </div>
        </motion.div>

        {/* Google Wallet Button */}
        <button className="w-full bg-black rounded-full py-4 px-6 flex items-center justify-center gap-3 shadow-lg mb-12 hover:scale-[1.02] transition-transform">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center overflow-hidden p-1">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Wallet_Icon_2022.svg" alt="Google Wallet" className="w-full h-full" />
          </div>
          <span className="text-white font-semibold text-lg">Agregar a Google Wallet</span>
        </button>

        {/* Actions Grid */}
        <div className="grid grid-cols-4 w-full gap-4">
          <ActionButton icon={Eye} label="Ver datos" />
          <ActionButton icon={Lock} label="Bloquear" />
          <ActionButton icon={Settings} label="Ajustes" />
          <ActionButton icon={MoreHorizontal} label="Más" />
        </div>
      </div>

      {/* Desktop Redirect/Placeholder */}
      <div className="hidden lg:flex items-center justify-center min-h-screen p-12">
         <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Vista Móvil Requerida</h2>
            <p className="text-black/40">La Billetera Smart Card es una funcionalidad exclusiva de la versión móvil.</p>
         </div>
      </div>
    </Layout>
  );
};

const ActionButton = ({ icon: Icon, label }: { icon: any, label: string }) => (
  <button className="flex flex-col items-center gap-2 group">
    <div className="w-16 h-16 rounded-full border-2 border-black/5 flex items-center justify-center transition-all group-hover:bg-[#7F00DF] group-hover:border-[#7F00DF] group-hover:text-white group-active:scale-90">
      <Icon size={24} className="text-[#000051] group-hover:text-white" />
    </div>
    <span className="text-[11px] font-bold text-[#000051] text-center">{label}</span>
  </button>
);
