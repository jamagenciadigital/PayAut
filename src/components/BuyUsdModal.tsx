import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, CreditCard, Wallet, ArrowRight, CheckCircle2, Globe } from 'lucide-react';

interface BuyUsdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (amountUsd: number) => void;
  availableBalanceCop: number;
}

export const BuyUsdModal = ({ isOpen, onClose, onSuccess, availableBalanceCop }: BuyUsdModalProps) => {
  const [usdAmount, setUsdAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'PSE' | 'CARD' | 'BALANCE'>('PSE');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');

  const EXCHANGE_RATE = 4150; // Mock rate

  const copCost = Number(usdAmount) * EXCHANGE_RATE;
  const canPayWithBalance = copCost <= availableBalanceCop;

  useEffect(() => {
    if (!isOpen) {
      setUsdAmount('');
      setPaymentMethod('PSE');
      setStep('FORM');
    }
  }, [isOpen]);

  const handleBuy = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setStep('SUCCESS');
    onSuccess(Number(usdAmount));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
      onClick={onClose}
    >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
          <div className="bg-[#7F00DF] p-8 text-white flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black text-white tracking-tighter uppercase">Comprar USD</h2>
              <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Recarga tu saldo en dólares PagoX</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          <div className="p-8 md:p-10">
            {step === 'FORM' ? (
              <div className="space-y-6">
                {/* Input Amount */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-black/30 uppercase tracking-widest px-2">Valor en Dólares (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7F00DF]" size={20} />
                    <input
                      type="number"
                      placeholder="0.00"
                      value={usdAmount}
                      onChange={(e) => setUsdAmount(e.target.value)}
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-[#7F00DF]/20 p-5 pl-12 rounded-2xl text-lg font-black text-black focus:outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Conversion Info */}
                <div className="bg-[#000051]/5 p-6 rounded-2xl border border-[#000051]/10 flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-black text-[#000051]/40 uppercase tracking-widest mb-1">Costo total en Pesos</p>
                    <p className="text-xl font-black text-[#000051]">${Math.round(copCost).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] font-black text-black/20 uppercase tracking-widest mb-1">Tasa TRM</p>
                    <p className="text-xs font-bold text-black/60">${EXCHANGE_RATE.toLocaleString()}</p>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-black/30 uppercase tracking-widest px-2">Método de Pago</label>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      { id: 'PSE', label: 'PSE', icon: Globe },
                      { id: 'CARD', label: 'Tarjeta de Crédito', icon: CreditCard },
                      { id: 'BALANCE', label: 'Saldo Disponible', icon: Wallet, disabled: !canPayWithBalance && usdAmount !== '' }
                    ].map((method) => (
                      <button
                        key={method.id}
                        disabled={(method as any).disabled}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                          paymentMethod === method.id 
                            ? 'border-[#7F00DF] bg-[#7F00DF]/5 text-[#7F00DF]' 
                            : 'border-black/5 hover:border-black/10 text-black/40'
                        } ${(method as any).disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <method.icon size={18} />
                          <span className="text-xs font-bold uppercase tracking-tight">{method.label}</span>
                        </div>
                        {paymentMethod === method.id && <CheckCircle2 size={16} />}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={loading || !usdAmount || Number(usdAmount) <= 0}
                  onClick={handleBuy}
                  className="w-full bg-[#7F00DF] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#7F00DF]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      Confirmar Compra
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-12 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-3xl font-black text-black tracking-tighter uppercase mb-2">¡Compra Exitosa!</h2>
                <p className="text-black/40 text-sm font-bold mb-10 max-w-[240px]">
                  Has adquirido <span className="text-black font-black text-lg">${usdAmount} USD</span> que ya están disponibles en tu saldo.
                </p>
                <button
                  onClick={onClose}
                  className="w-full bg-[#7F00DF] text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  Cerrar
                </button>
              </div>
            )}
          </div>
        </motion.div>
    </motion.div>
  );
};
