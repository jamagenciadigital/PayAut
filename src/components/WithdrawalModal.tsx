import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Building2, Send, CheckCircle2, ArrowRight } from 'lucide-react';
import breveLogo from '../assets/bre-b-minisite.jpg';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalanceCop: number;
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountType: string;
  };
  onSuccess: (amount: number) => void;
}

export const WithdrawalModal = ({ isOpen, onClose, availableBalanceCop, bankInfo, onSuccess }: WithdrawalModalProps) => {
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<'BANK' | 'BREVE'>('BANK');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setMethod('BANK');
      setStep('FORM');
    }
  }, [isOpen]);

  const handleWithdraw = async () => {
    setLoading(true);
    // Simulate withdrawal processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setStep('SUCCESS');
    onSuccess(Number(amount));
  };

  if (!isOpen) return null;

  const isValidAmount = Number(amount) > 0 && Number(amount) <= availableBalanceCop;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[600] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden relative"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-slate-100 rounded-full transition-colors z-10"
          >
            <X size={20} className="text-black/20" />
          </button>

          {step === 'FORM' ? (
            <div className="p-8 md:p-10">
              <div className="mb-8">
                <h2 className="text-2xl font-black text-black tracking-tighter uppercase">Solicitar Retiro</h2>
                <p className="text-black/40 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Transfiere tus fondos disponibles</p>
              </div>

              <div className="space-y-6">
                {/* Amount Input */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-2">
                    <label className="text-[10px] font-black text-black/30 uppercase tracking-widest">Monto a Retirar (COP)</label>
                    <span className="text-[10px] font-bold text-[#7F00DF]">Max: ${availableBalanceCop.toLocaleString()}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black font-black text-xl">$</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-[#000051]/20 p-5 pl-10 rounded-2xl text-xl font-black text-black focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Destination Method */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-black/30 uppercase tracking-widest px-2">Destino de los fondos</label>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {/* Bank Account */}
                    <button
                      onClick={() => setMethod('BANK')}
                      className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                        method === 'BANK' ? 'border-[#000051] bg-[#000051]/5' : 'border-black/5 hover:border-black/10'
                      }`}
                    >
                      <div className={`p-3 rounded-xl ${method === 'BANK' ? 'bg-[#000051] text-white' : 'bg-slate-100 text-black/20'}`}>
                        <Building2 size={20} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-black uppercase tracking-tight ${method === 'BANK' ? 'text-[#000051]' : 'text-black'}`}>Mi Cuenta Bancaria</p>
                        <p className="text-[10px] text-black/40 font-bold mt-1">{bankInfo.bankName} • {bankInfo.accountNumber}</p>
                      </div>
                      {method === 'BANK' && <CheckCircle2 size={18} className="text-[#000051]" />}
                    </button>

                    {/* Breve Transfer */}
                    <button
                      onClick={() => setMethod('BREVE')}
                      className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left ${
                        method === 'BREVE' ? 'border-[#7F00DF] bg-[#7F00DF]/5' : 'border-black/5 hover:border-black/10'
                      }`}
                    >
                      <div className="w-11 h-11 rounded-xl overflow-hidden border border-black/5 bg-white flex items-center justify-center">
                        <img src={breveLogo} alt="Breve" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className={`text-xs font-black uppercase tracking-tight ${method === 'BREVE' ? 'text-[#7F00DF]' : 'text-black'}`}>Transferencia BREVE</p>
                        <p className="text-[10px] text-black/40 font-bold mt-1">Envío instantáneo por número de celular</p>
                      </div>
                      {method === 'BREVE' && <CheckCircle2 size={18} className="text-[#7F00DF]" />}
                    </button>
                  </div>
                </div>

                <button
                  disabled={loading || !isValidAmount}
                  onClick={handleWithdraw}
                  className="w-full bg-[#000051] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#000051]/20 hover:bg-[#000051]/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      Confirmar Retiro
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-black text-black tracking-tighter uppercase mb-2">Solicitud Enviada</h2>
              <p className="text-black/40 text-sm font-bold mb-10 max-w-[240px]">
                Tu retiro por <span className="text-black font-black">${Number(amount).toLocaleString()} COP</span> está siendo procesado.
              </p>
              <button
                onClick={onClose}
                className="w-full bg-[#000051] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg"
              >
                Cerrar
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
