import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  ArrowUpRight, 
  Settings,
  Home,
  Wallet
} from 'lucide-react';

export const MobileNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Inicio', path: '/merchant/dashboard' },
    { icon: LinkIcon, label: 'Links', path: '/merchant/links' },
    { icon: Wallet, label: 'Retiro', path: '#', isAction: true },
    { icon: Settings, label: 'Ajustes', path: '/merchant/settings' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="lg:hidden fixed bottom-6 left-6 right-6 z-[100]">
      <div className="bg-[#7F00DF] rounded-[32px] px-8 py-4 shadow-2xl flex justify-between items-center border border-white/10 backdrop-blur-sm bg-[#7F00DF]/95">
        {navItems.map((item, index) => {
          const Active = isActive(item.path);
          return (
            <Link
              key={index}
              to={item.path === '#' ? location.pathname : item.path}
              className={`flex flex-col items-center gap-1 transition-all ${
                Active ? 'scale-110 text-white' : 'text-white/60 hover:text-white/80'
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all ${
                Active ? 'bg-white/20' : ''
              }`}>
                <item.icon size={22} strokeWidth={Active ? 2.5 : 2} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
