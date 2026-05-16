import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  FileText, 
  DollarSign, 
  Globe, 
  CreditCard, 
  Check, 
  LinkIcon, 
  Copy 
} from 'lucide-react';
import pseLogo from '../assets/pse-seeklogo.png';

export const PaymentLinkModal = ({ isOpen, onClose, onSave, saving }: any) => {
  const [form, setForm] = React.useState({
    concept: '',
    amount: '',
    isOpenAmount: false,
    returnUrl: '',
    allowPse: true,
    allowCard: true
  });
  const [generatedLink, setGeneratedLink] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    const linkId = Math.random().toString(36).substring(2, 10).toUpperCase();
    await onSave({ ...form, id: linkId });
    const baseUrl = window.location.origin;
    setGeneratedLink(`${baseUrl}/p/${linkId}`);
  };

  const copyToClipboard = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isFormValid = form.concept.trim() && (form.isOpenAmount || (form.amount && Number(form.amount) > 0));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-0 md:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-md h-full md:h-auto md:max-h-[90vh] md:rounded-[32px] shadow-2xl overflow-hidden relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#7F00DF] p-6 pt-12 md:p-8 md:pt-8 text-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-black text-white tracking-tighter uppercase">
              {generatedLink ? '¡Link Creado!' : 'Nuevo Link de Pago'}
            </h2>
            <p className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
              {generatedLink ? 'Ya puedes compartirlo con tus clientes' : 'Configura un nuevo punto de recaudo digital'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
          <AnimatePresence mode="wait">
            {!generatedLink ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col gap-6"
              >
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-black/40">Concepto del Cobro</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.concept}
                      onChange={(e) => setForm({ ...form, concept: e.target.value })}
                      placeholder="Ej: Pago de servicios / Producto ABC"
                      className="w-full bg-black/5 border-0 p-4 pl-12 rounded-2xl text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#7F00DF]"
                    />
                    <FileText size={18} className="absolute left-4 top-4 text-black/20" />
                  </div>
                </div>

                <div className="flex flex-col gap-4 bg-slate-50 p-6 rounded-3xl border border-black/5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <label className="text-[11px] font-black uppercase tracking-widest text-black/40">Monto del Link</label>
                    <label className="flex items-center gap-2 cursor-pointer group self-start sm:self-auto">
                      <div className={`w-10 h-5 rounded-full transition-all relative ${form.isOpenAmount ? 'bg-emerald-500' : 'bg-black/20'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${form.isOpenAmount ? 'left-6' : 'left-1'}`} />
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={form.isOpenAmount}
                          onChange={(e) => setForm({ ...form, isOpenAmount: e.target.checked })}
                        />
                      </div>
                      <span className="text-[10px] font-black text-black/60 uppercase tracking-tight group-hover:text-black transition-colors">Abierto</span>
                    </label>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="number"
                      disabled={form.isOpenAmount}
                      value={form.amount}
                      onChange={(e) => setForm({ ...form, amount: e.target.value })}
                      placeholder={form.isOpenAmount ? "El cliente define" : "0.00"}
                      className={`w-full bg-white border-2 p-5 pl-14 rounded-2xl text-2xl font-black text-black focus:outline-none transition-all ${
                        form.isOpenAmount ? 'opacity-40 border-dashed border-black/10' : 'border-[#7F00DF]/10 focus:border-[#7F00DF]'
                      }`}
                    />
                    <DollarSign size={24} className={`absolute left-5 top-5 ${form.isOpenAmount ? 'text-black/10' : 'text-[#7F00DF]'}`} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-black uppercase tracking-widest text-black/40">URL de Retorno (Opcional)</label>
                  <div className="relative">
                    <input
                      type="url"
                      value={form.returnUrl}
                      onChange={(e) => setForm({ ...form, returnUrl: e.target.value })}
                      placeholder="https://tu-sitio.com/gracias"
                      className="w-full bg-black/5 border-0 p-4 pl-12 rounded-2xl text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#7F00DF]"
                    />
                    <Globe size={18} className="absolute left-4 top-4 text-black/20" />
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <label className="text-[11px] font-black uppercase tracking-widest text-black/40">Métodos de Pago Habilitados</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setForm({ ...form, allowPse: !form.allowPse })}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        form.allowPse ? 'border-emerald-500 bg-emerald-50 text-emerald-900' : 'border-black/5 bg-white text-black/40 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={pseLogo} alt="PSE" className={`w-6 h-6 object-contain ${!form.allowPse && 'grayscale'}`} />
                        <span className="text-[11px] font-black uppercase tracking-widest">Pago PSE</span>
                      </div>
                      {form.allowPse && <Check size={16} className="text-emerald-600" />}
                    </button>
                    <button 
                      onClick={() => setForm({ ...form, allowCard: !form.allowCard })}
                      className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                        form.allowCard ? 'border-[#7F00DF] bg-purple-50 text-purple-900' : 'border-black/5 bg-white text-black/40 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard size={20} className={form.allowCard ? 'text-[#7F00DF]' : 'text-black/40'} />
                        <span className="text-[11px] font-black uppercase tracking-widest">Tarjetas</span>
                      </div>
                      {form.allowCard && <Check size={16} className="text-[#7F00DF]" />}
                    </button>
                  </div>
                </div>

                <button
                  disabled={!isFormValid || saving}
                  onClick={handleGenerate}
                  className="mt-2 w-full bg-black text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-30 flex items-center justify-center gap-3 shrink-0 mb-4"
                >
                  {saving ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <LinkIcon size={20} />
                      Generar Link de Pago
                    </>
                  )}
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-6 gap-8"
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500">
                  <Check size={40} strokeWidth={3} />
                </div>
                
                <div className="text-center flex flex-col gap-2">
                  <h4 className="text-2xl font-black text-black">Link Generado con Éxito</h4>
                  <p className="text-black/40 text-[10px] font-black uppercase tracking-widest">ID: {generatedLink.split('/').pop()}</p>
                </div>

                <div className="w-full flex flex-col gap-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-black/40 text-center">URL de Recaudo</label>
                  <div className="bg-black/5 p-5 rounded-3xl flex items-center justify-between gap-4 border-2 border-dashed border-black/10">
                    <span className="text-sm font-bold text-black truncate flex-1">{generatedLink}</span>
                    <button 
                      onClick={copyToClipboard}
                      className={`p-3 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-black hover:bg-black hover:text-white'}`}
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                  </div>
                </div>

                <button 
                  onClick={onClose}
                  className="w-full bg-[#7F00DF] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
                >
                  Finalizar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};
