export type UserRole = 'SUPERADMIN' | 'MERCHANT' | 'CLIENT';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface Merchant {
  id: string;
  userId: string;
  businessName: string;
  taxId: string;
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountType: 'SAVINGS' | 'CHECKING';
  };
  balanceAvailable: number;
  balancePending: number;
  balanceUSD?: number;
  subscriptionPlanId: string;
  status: 'ACTIVE' | 'PENDING' | 'SUSPENDED';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  transactionFeePercent: number;
  transactionFeeFlat: number;
  features: string[];
}

export interface PaymentLink {
  id: string;
  merchantId: string;
  amount: number;
  currency: 'COP' | 'USD';
  description: string;
  slug: string; // Unique URL part
  status: 'ACTIVE' | 'EXPIRED' | 'PAID';
  createdAt: Date;
}

export type TransactionStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'REFUNDED';
export type PaymentMethod = 'CARD' | 'PSE';

export interface Transaction {
  id: string;
  paymentLinkId: string;
  merchantId: string;
  customerEmail: string;
  amount: number;
  feeAmount: number;
  netAmount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  providerTxId: string;
  createdAt: Date;
}

export interface Payout {
  id: string;
  merchantId: string;
  amount: number;
  status: 'PENDING' | 'PROCESSED' | 'FAILED';
  requestedAt: Date;
  processedAt?: Date;
}
