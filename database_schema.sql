-- AppPagos Database Schema (PostgreSQL for Neon)
-- Created: 2026-05-14

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User Roles
CREATE TYPE user_role AS ENUM ('SUPERADMIN', 'MERCHANT');

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role user_role DEFAULT 'MERCHANT',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subscription Plans Table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    monthly_price DECIMAL(12, 2) NOT NULL,
    fee_percent DECIMAL(5, 2) NOT NULL,
    fee_flat DECIMAL(12, 2) NOT NULL,
    features JSONB, -- Array of strings
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Merchants Table
CREATE TABLE IF NOT EXISTS merchants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    tax_id TEXT UNIQUE,
    bank_info JSONB, -- {bank_name, account_number, account_type}
    plan_id UUID REFERENCES subscription_plans(id),
    balance_available DECIMAL(15, 2) DEFAULT 0,
    balance_pending DECIMAL(15, 2) DEFAULT 0,
    status TEXT DEFAULT 'PENDING', -- PENDING, ACTIVE, SUSPENDED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payment Links Table
CREATE TABLE IF NOT EXISTS payment_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, DISABLED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_link_id UUID REFERENCES payment_links(id),
    merchant_id UUID REFERENCES merchants(id),
    customer_email TEXT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    fee_amount DECIMAL(15, 2) NOT NULL,
    net_amount DECIMAL(15, 2) NOT NULL,
    currency TEXT DEFAULT 'COP',
    status TEXT DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, REFUNDED
    payment_method TEXT, -- CARD, PSE
    provider_tx_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payouts Table
CREATE TABLE IF NOT EXISTS payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    merchant_id UUID REFERENCES merchants(id) ON DELETE CASCADE,
    amount DECIMAL(15, 2) NOT NULL,
    status TEXT DEFAULT 'PENDING', -- PENDING, PROCESSED, FAILED
    bank_snapshot JSONB, -- Snapshot of bank info at time of request
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP WITH TIME ZONE
);

-- Seed Data
INSERT INTO subscription_plans (name, monthly_price, fee_percent, fee_flat, features) VALUES
('Básico', 0, 2.9, 900, '["Links ilimitados", "Dashboard básico", "Soporte vía email"]'),
('Pro', 49900, 2.5, 800, '["Todo en Básico", "Dashboard avanzado", "Soporte prioritario", "API access"]');

-- Superadmin Default (Password is admin123 - this is just a placeholder, use bcrypt/argon2 in real app)
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@apppagos.com', '$2b$10$YourHashHere', 'Super Admin', 'SUPERADMIN');
