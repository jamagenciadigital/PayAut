import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ChevronRight, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';
import bgLogin from '../assets/bg-login.jpg';

import { dbService } from '../services/api';

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await dbService.login(email, password);
      
      // Store user info in localStorage for the demo session
      localStorage.setItem('currentUser', JSON.stringify(user));

      if (user.role === 'SUPERADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/merchant/dashboard');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative"
      style={{
        backgroundImage: `url(${bgLogin})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay sutil */}
      <div className="absolute inset-0 bg-[#B92070]/5 pointer-events-none" />

      <div
        className="w-full bg-white shadow-2xl relative z-10 p-8 flex flex-col items-center animate-in fade-in zoom-in duration-500"
        style={{
          borderRadius: '40px',
          maxWidth: '420px'
        }}
      >
        <div className="text-center mb-8 w-full">
          <img src={logo} alt="PayAut Logo" className="h-16 mb-6 mx-auto" />
          <h1 className="title_login">Iniciar sesion</h1>
        </div>

        {error && (
          <div className="w-full bg-rose-50 border border-rose-100 p-4 rounded-2xl mb-6 flex items-start gap-3">
            <AlertCircle className="text-rose-500 shrink-0" size={20} />
            <p className="text-rose-600 text-xs">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="w-full">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Correo"
              className="w-full bg-white border border-slate-300 rounded-full px-6 py-4 text-gray-700 focus:outline-none focus:border-[#B92070] transition-all placeholder:text-gray-400 text-sm"
              style={{ borderRadius: '100px' }}
            />
          </div>

          <div className="w-full">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              className="w-full bg-white border border-slate-300 rounded-full px-6 py-4 text-gray-700 focus:outline-none focus:border-[#B92070] transition-all placeholder:text-gray-400 text-sm"
              style={{ borderRadius: '100px' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 shadow-lg cursor-pointer ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            style={{
              backgroundColor: '#B92070',
              borderRadius: '100px'
            }}
          >
            {loading ? 'INICIANDO SESIÓN...' : 'INICIAR SESIÓN'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-xs font-medium">
            ¿No tienes cuenta?{' '}
            <button 
              onClick={() => navigate('/register')}
              className="text-[#B92070] font-bold hover:underline cursor-pointer"
            >
              Regístrate
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
