import { 
  LayoutGrid, 
  BarChart3, 
  FileText, 
  Users, 
  Settings, 
  CreditCard, 
  ArrowUpRight, 
  Key,
  LogOut
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logoWhite from '../assets/logo_white.svg';

interface SidebarProps {
  role: 'SUPERADMIN' | 'MERCHANT';
}

export const Sidebar = ({ role }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, clear tokens/session here
    navigate('/login');
  };

  const SuperadminMenu = [
    { icon: LayoutGrid, label: 'Inicio', path: '/admin/dashboard' },
    { icon: BarChart3, label: 'Reportes', path: '/admin/reports' },
    { icon: FileText, label: 'Transacciones', path: '/admin/transactions' },
    { icon: Users, label: 'Comercios', path: '/admin/merchants' },
    { icon: Settings, label: 'Configuraciones', path: '/admin/settings' },
  ];

  const MerchantMenu = [
    { icon: LayoutGrid, label: 'Dashboard', path: '/merchant/dashboard' },
    { icon: CreditCard, label: 'Links de Pago', path: '/merchant/links' },
    { icon: ArrowUpRight, label: 'Retiros', path: '/merchant/payouts' },
    { icon: Key, label: 'API Keys', path: '/merchant/keys' },
    { icon: Settings, label: 'Ajustes', path: '/merchant/settings' },
  ];

  const menuItems = role === 'SUPERADMIN' ? SuperadminMenu : MerchantMenu;

  return (
    <div className="w-72 h-full bg-gradient-to-b from-[#cc0066] to-[#7a00cc] flex flex-col p-6 overflow-hidden">
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-2 mb-16 shrink-0">
        <img src={logoWhite} alt="PayAut" className="h-10 w-auto" />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-l-2xl transition-all duration-300 group relative no-underline ${
                isActive 
                  ? 'bg-[#F2F2F2] text-[#cc0066] translate-x-4' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <item.icon size={20} className={isActive ? 'text-[#cc0066]' : 'text-white'} />
              <span className={`text-sm font-semibold ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
              
              {isActive && (
                <>
                  <div className="inverted-corner-top" />
                  <div className="inverted-corner-bottom" />
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="mt-auto pt-6 border-t border-white/10">
        <div className="flex items-center gap-4 px-2">
          <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center text-white font-bold shadow-inner">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-bold truncate">Juan Delgado</p>
            <p className="text-white/40 text-[10px] uppercase tracking-widest font-black">
              {role === 'SUPERADMIN' ? 'Super Administrador' : 'Comercio'}
            </p>
          </div>
          <div className="flex gap-1">
            <button 
              onClick={() => navigate(role === 'SUPERADMIN' ? '/admin/settings' : '/merchant/settings')}
              className="p-2 text-white/40 hover:text-white transition-colors"
              title="Configuración"
            >
              <Settings size={18} />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-white/40 hover:text-[#FF3B30] transition-colors"
              title="Cerrar Sesión"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
