import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { MerchantDashboard } from './pages/MerchantDashboard';
import { PaymentLinks } from './pages/PaymentLinks';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { SuperadminDashboard } from './pages/SuperadminDashboard';
import { SuperadminSettings } from './pages/SuperadminSettings';
import { Register } from './pages/Register';
import { SuperadminMerchants } from './pages/SuperadminMerchants';
import { SuperadminTransactions } from './pages/SuperadminTransactions';
import { SuperadminReports } from './pages/SuperadminReports';
import { MerchantSettings } from './pages/MerchantSettings';

// Placeholder components for other routes
const Placeholder = ({ title, role }: { title: string, role?: any }) => (
  <Layout role={role}>
    <div className="p-12">
      <h1 className="text-3xl font-bold text-black mb-4">{title}</h1>
      <p className="text-black/60">Esta sección está bajo desarrollo.</p>
    </div>
  </Layout>
);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Merchant Routes */}
        <Route path="/merchant/dashboard" element={<MerchantDashboard />} />
        <Route path="/merchant/links" element={<PaymentLinks />} />
        <Route path="/merchant/payouts" element={<Placeholder title="Retiros" role="MERCHANT" />} />
        <Route path="/merchant/keys" element={<Placeholder title="API Keys" role="MERCHANT" />} />
        <Route path="/merchant/settings" element={<MerchantSettings />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<SuperadminDashboard />} />
        <Route path="/admin/reports" element={<SuperadminReports />} />
        <Route path="/admin/transactions" element={<SuperadminTransactions />} />
        <Route path="/admin/merchants" element={<SuperadminMerchants />} />
        <Route path="/admin/settings" element={<SuperadminSettings />} />
        
        {/* Checkout Public Route */}
        <Route path="/checkout/:slug" element={<Checkout />} />
        <Route path="/p/:slug" element={<Checkout />} />
        
        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
