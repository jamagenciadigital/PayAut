import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  CheckCircle2, 
  ChevronRight, 
  Building2, 
  ShieldCheck,
  Lock,
  ArrowLeft,
  Loader2
} from 'lucide-react';
import logo from '../assets/logo_pagosx.svg';
import bgLogin from '../assets/bg-login.jpg';
import { dbService } from '../services/api';

export const Checkout = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Success
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'PSE'>('CARD');
  const [loading, setLoading] = useState(true);
  const [linkData, setLinkData] = useState<any>(null);
  const [customAmount, setCustomAmount] = useState('');

  useEffect(() => {
    const fetchLink = async () => {
      if (!slug) return;
      setLoading(true);
      const data = await dbService.getPaymentLinkBySlug(slug);
      setLinkData(data);
      setLoading(false);
    };
    fetchLink();
  }, [slug]);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3); // Success
  };

  if (loading) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgLogin})` }}
      >
        <div className="absolute inset-0 bg-brand-deep/40 backdrop-blur-sm"></div>
        <div className="relative z-10 flex flex-col items-center">
          <Loader2 className="w-12 h-12 text-brand-cyan animate-spin mb-4" />
          <p className="text-white font-bold tracking-widest uppercase text-sm">Cargando Checkout...</p>
        </div>
      </div>
    );
  }

  if (!linkData) {
    return (
      <div 
        className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgLogin})` }}
      >
        <div className="absolute inset-0 bg-brand-deep/40 backdrop-blur-sm"></div>
        <div className="relative z-10 bg-white p-10 rounded-3xl max-w-md space-y-6 shadow-2xl">
          <h1 className="text-3xl font-bold text-brand-deep">Enlace no encontrado</h1>
          <p className="text-black/60 text-lg">El link de pago que intentas usar no existe o ha sido desactivado.</p>
          <button 
            onClick={() => navigate('/login')} 
            className="w-full bg-brand-cyan text-brand-deep py-4 rounded-2xl font-bold cyan-glow transition-all"
          >
            Ir al Inicio
          </button>
        </div>
      </div>
    );
  }

  const finalAmount = linkData.is_open_amount ? (parseFloat(customAmount) || 0) : parseFloat(linkData.amount);

  if (step === 3) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgLogin})` }}
      >
        <div className="absolute inset-0 bg-brand-deep/40 backdrop-blur-sm"></div>
        <div className="relative z-10 bg-white w-full max-w-md p-10 rounded-3xl text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-emerald-500 w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-brand-deep">¡Pago Exitoso!</h1>
          <p className="text-black/60">Tu pago por <strong className="text-brand-deep">${finalAmount.toLocaleString()}</strong> a {linkData.merchant_name} ha sido procesado correctamente.</p>
          <div className="bg-gray-50 p-4 rounded-xl text-left font-mono text-xs text-black/40 border border-black/5">
            ID de Transacción: TX-{Math.random().toString(36).substr(2, 9).toUpperCase()}
          </div>
          <button 
            onClick={() => {
              if (linkData.return_url) {
                window.location.href = linkData.return_url;
              } else {
                navigate('/login');
              }
            }} 
            className="w-full bg-brand-cyan text-brand-deep py-4 rounded-2xl font-bold cyan-glow hover:scale-105 transition-all mt-6"
          >
            Finalizar y Regresar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <div className="absolute inset-0 bg-brand-deep/40 backdrop-blur-sm"></div>
      
      <div className="w-full max-w-4xl relative z-10 animate-in fade-in zoom-in duration-500">
        <header className="flex flex-col items-center mb-12 gap-4">
          <img src={logo} alt="PagoX" className="h-12 brightness-0 invert" />
        </header>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Order Summary */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="bg-white p-8 rounded-3xl shadow-2xl">
              <p className="text-black text-sm mb-1 uppercase tracking-wider font-bold">Pagar a</p>
              <h2 className="text-black text-2xl font-bold mb-6">{linkData.merchant_name}</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center text-black">
                  <span className="font-medium">Concepto</span>
                  <span className="font-bold">{linkData.description}</span>
                </div>
                {linkData.is_open_amount && (
                  <div className="space-y-2 mt-4 p-4 bg-gray-50 rounded-2xl border border-black/5">
                    <label className="text-black/40 text-xs uppercase font-bold tracking-widest px-1">Define el monto a pagar</label>
                    <div className="relative">
                      <span className="absolute left-5 top-1/2 -translate-y-1/2 text-black font-bold text-xl">$</span>
                      <input 
                        type="number" 
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-white border border-black/10 rounded-xl pl-10 pr-5 py-4 text-black text-2xl font-bold focus:outline-none focus:border-[#000051] transition-all shadow-sm"
                      />
                    </div>
                  </div>
                )}
                <div className="border-t border-black/5 pt-4 mt-4 flex justify-between items-center">
                  <span className="text-lg text-black font-medium">Total a pagar</span>
                  <span className="text-3xl font-bold text-black">${finalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-white px-4 bg-black/20 py-3 rounded-2xl backdrop-blur-md">
              <ShieldCheck size={20} className="text-brand-cyan" />
              <p className="text-sm">Pagos seguros protegidos por cifrado SSL de 256 bits.</p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white p-8 lg:p-10 rounded-3xl order-1 lg:order-2 shadow-2xl">
            <div className="flex gap-2 mb-8 bg-gray-100 p-1.5 rounded-2xl">
              {linkData.allow_card !== false && (
                <button 
                  onClick={() => setPaymentMethod('CARD')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold ${
                    paymentMethod === 'CARD' ? 'bg-[#000051] text-white shadow-lg' : 'text-black/40 hover:text-black/60'
                  }`}
                >
                  <CreditCard size={18} />
                  Tarjeta
                </button>
              )}
              {linkData.allow_pse !== false && (
                <button 
                  onClick={() => setPaymentMethod('PSE')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all font-bold ${
                    paymentMethod === 'PSE' ? 'bg-[#000051] text-white shadow-lg' : 'text-black/40 hover:text-black/60'
                  }`}
                >
                  <Building2 size={18} />
                  PSE
                </button>
              )}
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              {paymentMethod === 'CARD' ? (
                <>
                  <div className="space-y-1.5">
                    <label className="text-black/40 text-xs uppercase font-bold tracking-widest px-1">Número de Tarjeta</label>
                    <input 
                      type="text" 
                      placeholder="0000 0000 0000 0000"
                      className="w-full bg-white border border-black/10 rounded-2xl px-5 py-4 text-black focus:outline-none focus:border-[#B92070] transition-all shadow-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-black/40 text-xs uppercase font-bold tracking-widest px-1">Vencimiento</label>
                      <input 
                        type="text" 
                        placeholder="MM/YY"
                        className="w-full bg-white border border-black/10 rounded-2xl px-5 py-4 text-black focus:outline-none focus:border-[#B92070] transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-black/40 text-xs uppercase font-bold tracking-widest px-1">CVV</label>
                      <input 
                        type="password" 
                        placeholder="***"
                        className="w-full bg-white border border-black/10 rounded-2xl px-5 py-4 text-black focus:outline-none focus:border-[#000051] transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-black/40 text-xs uppercase font-bold tracking-widest px-1">Selecciona tu Banco</label>
                  <select className="w-full bg-white border border-black/10 rounded-2xl px-5 py-4 text-black focus:outline-none focus:border-[#B92070] transition-all appearance-none shadow-sm cursor-pointer">
                    <option>Bancolombia</option>
                    <option>Davivienda</option>
                    <option>Banco de Bogotá</option>
                    <option>Nequi / Daviplata</option>
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-black/40 text-xs uppercase font-bold tracking-widest px-1">Nombre Completo</label>
                <input 
                  type="text" 
                  placeholder="COMO APARECE EN EL DOCUMENTO"
                  className="w-full bg-white border border-black/10 rounded-2xl px-5 py-4 text-black focus:outline-none focus:border-[#B92070] transition-all shadow-sm"
                />
              </div>

              <button 
                type="submit"
                disabled={linkData.is_open_amount && !customAmount}
                className="w-full text-white py-5 rounded-2xl font-bold text-lg bg-[#000051] hover:bg-[#7F00DF] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-[#000051]/20"
              >
                Pagar Ahora
                <ChevronRight size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
