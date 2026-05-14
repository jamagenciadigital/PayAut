import React from 'react';
import { Sidebar } from './Sidebar';
import { currentUser } from '../mockData';

interface LayoutProps {
  children: React.ReactNode;
  role?: 'SUPERADMIN' | 'MERCHANT';
}

export const Layout = ({ children, role }: LayoutProps) => {
  const displayRole = role || currentUser.role as any;
  
  return (
    <div className="flex min-h-screen bg-[#F2F2F2] w-full">
      <div className="fixed inset-y-0 left-0 w-72 z-50">
        <Sidebar role={displayRole} />
      </div>
      <main className="flex-1 pl-72 min-h-screen overflow-x-hidden min-w-0">
        {children}
      </main>
    </div>
  );
};
