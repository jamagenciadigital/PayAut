import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { currentUser } from '../mockData';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  role?: 'SUPERADMIN' | 'MERCHANT';
}

export const Layout = ({ children, role }: LayoutProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const displayRole = role || currentUser.role as any;
  
  return (
    <div className="flex min-h-screen bg-[#F2F2F2] w-full relative">
      {/* Mobile Menu Toggle */}
      <button 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-[#cc0066] text-white rounded-lg shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-[40]"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile unless open */}
      <div className={`
        fixed inset-y-0 left-0 w-72 z-50 transition-transform duration-300 lg:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <Sidebar role={displayRole} />
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:pl-72 min-h-screen overflow-x-hidden min-w-0 w-full pt-16 lg:pt-0">
        {children}
      </main>
    </div>
  );
};
