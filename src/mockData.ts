import type { SubscriptionPlan, User, Merchant, Transaction } from './types';

export const mockPlans: SubscriptionPlan[] = [
  {
    id: 'plan-basic',
    name: 'Básico',
    monthlyPrice: 0,
    transactionFeePercent: 2.9,
    transactionFeeFlat: 900,
    features: ['Links ilimitados', 'Dashboard básico', 'Soporte vía email'],
  },
  {
    id: 'plan-pro',
    name: 'Pro',
    monthlyPrice: 49900,
    transactionFeePercent: 2.5,
    transactionFeeFlat: 800,
    features: ['Todo en Básico', 'Dashboard avanzado', 'Soporte prioritario', 'API access'],
  },
];

export const currentUser: User = {
  id: 'e0cd4fef-07e2-4749-bf41-65432068db61',
  email: 'comercio@ejemplo.com',
  role: 'MERCHANT',
  name: 'Juan Pérez',
  createdAt: new Date(),
};

export const mockMerchant: Merchant = {
  id: '27df41c5-5ab6-40b9-8941-d3e4e0ed9ef2',
  userId: 'e0cd4fef-07e2-4749-bf41-65432068db61',
  businessName: 'Gimnasio FitLife',
  taxId: '900.123.456-7',
  bankInfo: {
    bankName: 'Bancolombia',
    accountNumber: '123-456789-01',
    accountType: 'SAVINGS',
  },
  balanceAvailable: 1250000,
  balancePending: 350000,
  balanceUSD: 0,
  subscriptionPlanId: 'plan-pro',
  status: 'ACTIVE',
};

export const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    paymentLinkId: 'link-1',
    merchantId: 'merch-1',
    customerEmail: 'cliente@correo.com',
    amount: 150000,
    feeAmount: 5250,
    netAmount: 144750,
    currency: 'COP',
    status: 'APPROVED',
    paymentMethod: 'CARD',
    providerTxId: 'auth_12345',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: 'tx-2',
    paymentLinkId: 'link-2',
    merchantId: 'merch-1',
    customerEmail: 'otro@cliente.com',
    amount: 85000,
    feeAmount: 3025,
    netAmount: 81975,
    currency: 'COP',
    status: 'PENDING',
    paymentMethod: 'PSE',
    providerTxId: 'auth_67890',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
];
