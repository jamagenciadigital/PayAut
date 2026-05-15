import { neon, neonConfig } from '@neondatabase/serverless';

// Force HTTP transport so it works in browser (Vite)
neonConfig.fetchConnectionCache = true;
neonConfig.poolQueryViaFetch = true;

// Helper to validate and get the connection string
const getConnectionString = () => {
  const url = import.meta.env.VITE_NEON_DATABASE_URL || '';
  
  // LOG DE DIAGNÓSTICO (Visible en la consola F12 del navegador)
  if (!url) {
    console.error('❌ ERROR CRÍTICO: La variable VITE_NEON_DATABASE_URL está VACÍA en este entorno.');
    return null;
  }

  if (!url.startsWith('postgresql://') && !url.startsWith('postgres://')) {
    console.warn('⚠️ Neon: URL con formato inválido. Comienza con:', url.slice(0, 10));
    return null;
  }
  
  console.info('✅ Neon: Variable detectada correctamente.');
  return url;
};

const connectionString = getConnectionString();
const sql = connectionString ? neon(connectionString) : null;

export const dbService = {
  // Merchants
  async getMerchants() {
    if (!sql) return [];
    try {
      return await sql`
        SELECT *, (SELECT name FROM subscription_plans WHERE id = plan_id) as plan_name 
        FROM merchants 
        ORDER BY created_at DESC
      `;
    } catch (error) {
      console.error('Error fetching merchants:', error);
      return [];
    }
  },

  async getMerchantByUserId(userId: string) {
    if (!sql) return null;
    try {
      const results = await sql`SELECT * FROM merchants WHERE user_id = ${userId}`;
      return results[0] || null;
    } catch (error) {
      console.error('Error fetching merchant by user id:', error);
      return null;
    }
  },

  async getMerchantById(id: string) {
    if (!sql) return null;
    try {
      const results = await sql`SELECT * FROM merchants WHERE id = ${id}`;
      return results[0] || null;
    } catch (error) {
      console.error('Error fetching merchant by id:', error);
      return null;
    }
  },


  async updateMerchantPlan(merchantId: string, planId: string) {
    if (!sql) return null;
    try {
      return await sql`UPDATE merchants SET plan_id = ${planId} WHERE id = ${merchantId} RETURNING *`;
    } catch (error) {
      console.error('Error updating merchant plan:', error);
      return null;
    }
  },

  async updateMerchantProfile(id: string, data: any) {
    if (!sql) return null;
    try {
      return await sql`
        UPDATE merchants 
        SET 
          business_name = ${data.business_name},
          tax_id = ${data.tax_id},
          legal_rep_name = ${data.legal_rep_name},
          legal_rep_lastname = ${data.legal_rep_lastname},
          legal_rep_email = ${data.legal_rep_email},
          legal_rep_phone = ${data.legal_rep_phone},
          legal_rep_doc_type = ${data.legal_rep_doc_type},
          legal_rep_doc_number = ${data.legal_rep_doc_number},
          legal_rep_exp_city = ${data.legal_rep_exp_city},
          legal_rep_exp_country = ${data.legal_rep_exp_country},
          legal_rep_address = ${data.legal_rep_address},
          website = ${data.website},
          economic_activity = ${data.economic_activity},
          city = ${data.city},
          country = ${data.country},
          address = ${data.address},
          bank_info = ${data.bank_info}
        WHERE id = ${id}
        RETURNING *
      `;
    } catch (error) {
      console.error('Error updating merchant profile:', error);
      return null;
    }
  },

  // Transactions
  async getTransactions(merchantId?: string) {
    if (!sql) return [];
    try {
      if (merchantId) {
        return await sql`
          SELECT t.*, m.business_name as merchant_name 
          FROM transactions t
          JOIN merchants m ON t.merchant_id = m.id
          WHERE t.merchant_id = ${merchantId} 
          ORDER BY t.created_at DESC
        `;
      }
      return await sql`
        SELECT t.*, m.business_name as merchant_name 
        FROM transactions t
        JOIN merchants m ON t.merchant_id = m.id
        ORDER BY t.created_at DESC 
        LIMIT 20
      `;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  },

  // Payment Links
  async createPaymentLink(data: {
    merchantId: string;
    amount: number;
    description: string;
    slug: string;
    isOpenAmount: boolean;
    returnUrl?: string;
    allowPse: boolean;
    allowCard: boolean;
  }) {
    if (!sql) throw new Error('Database not connected');
    try {
      return await sql`
        INSERT INTO payment_links (
          merchant_id, 
          amount, 
          description, 
          slug, 
          is_open_amount, 
          return_url, 
          allow_pse, 
          allow_card
        )
        VALUES (
          ${data.merchantId}, 
          ${data.amount}, 
          ${data.description}, 
          ${data.slug}, 
          ${data.isOpenAmount}, 
          ${data.returnUrl || null}, 
          ${data.allowPse}, 
          ${data.allowCard}
        )
        RETURNING *
      `;
    } catch (error) {
      console.error('Error creating payment link:', error);
      throw error;
    }
  },

  async getPaymentLinks(merchantId: string) {
    if (!sql) return [];
    try {
      return await sql`
        SELECT 
          *,
          (SELECT COUNT(*) FROM transactions WHERE payment_link_id = payment_links.id) as payments_count
        FROM payment_links 
        WHERE merchant_id = ${merchantId}
        ORDER BY created_at DESC
      `;
    } catch (error) {
      console.error('Error fetching payment links:', error);
      return [];
    }
  },
  
  async getPaymentLinkBySlug(slug: string) {
    if (!sql) return null;
    try {
      const results = await sql`
        SELECT l.*, m.business_name as merchant_name
        FROM payment_links l
        JOIN merchants m ON l.merchant_id = m.id
        WHERE l.slug = ${slug}
      `;
      return results[0] || null;
    } catch (error) {
      console.error('Error fetching payment link by slug:', error);
      return null;
    }
  },

  // Global Stats for Superadmin
  async getGlobalStats() {
    if (!sql) return { total_volume: 0, active_merchants: 0, total_commissions: 0 };
    try {
      const stats = await sql`
        SELECT 
          COALESCE(SUM(amount), 0) as total_volume,
          COUNT(DISTINCT merchant_id) as active_merchants,
          COALESCE(SUM(fee_amount), 0) as total_commissions
        FROM transactions
      `;
      return stats[0];
    } catch (error) {
      console.error('Error fetching global stats:', error);
      return { total_volume: 0, active_merchants: 0, total_commissions: 0 };
    }
  },

  // Global Settings (Gateway Config)
  async getGlobalSettings() {
    if (!sql) return { pse_active: true, card_active: true, pse_api_key: '', card_api_key: '' };
    try {
      const settings = await sql`SELECT value FROM global_settings WHERE key = 'gateway_config'`;
      return settings[0]?.value || { pse_active: true, card_active: true, pse_api_key: '', card_api_key: '' };
    } catch (error) {
      console.error('Error fetching settings:', error);
      return { pse_active: true, card_active: true, pse_api_key: '', card_api_key: '' };
    }
  },

  async updateGlobalSettings(config: any) {
    if (!sql) throw new Error('Database not connected');
    try {
      return await sql`
        UPDATE global_settings 
        SET value = ${config}, updated_at = CURRENT_TIMESTAMP
        WHERE key = 'gateway_config'
        RETURNING *
      `;
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  },

  // Subscription Plans
  async getSubscriptionPlans() {
    if (!sql) return [];
    try {
      return await sql`SELECT * FROM subscription_plans ORDER BY monthly_price ASC`;
    } catch (error) {
      console.error('Error fetching plans:', error);
      return [];
    }
  },

  async updateSubscriptionPlan(id: string, data: any) {
    if (!sql) throw new Error('Database not connected');
    try {
      return await sql`
        UPDATE subscription_plans 
        SET 
          name = ${data.name},
          monthly_price = ${data.monthly_price},
          pse_fee_percent = ${data.pse_fee_percent},
          card_fee_percent = ${data.card_fee_percent},
          card_retefuente_percent = ${data.card_retefuente_percent},
          is_active = ${data.is_active}
        WHERE id = ${id}
        RETURNING *
      `;
    } catch (error) {
      console.error('Error updating plan:', error);
      throw error;
    }
  },

  async createSubscriptionPlan(data: any) {
    if (!sql) throw new Error('Database not connected');
    try {
      return await sql`
        INSERT INTO subscription_plans (name, monthly_price, pse_fee_percent, card_fee_percent, card_retefuente_percent, fee_percent, fee_flat, is_active)
        VALUES (${data.name}, ${data.monthly_price}, ${data.pse_fee_percent}, ${data.card_fee_percent}, ${data.card_retefuente_percent}, 0, 0, true)
        RETURNING *
      `;
    } catch (error) {
      console.error('Error creating plan:', error);
      throw error;
    }
  },

  async deleteSubscriptionPlan(id: string) {
    if (!sql) throw new Error('Database not connected');
    try {
      return await sql`DELETE FROM subscription_plans WHERE id = ${id}`;
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw error;
    }
  },

  async login(email: string, password_hash: string) {
    if (!sql) throw new Error('Database not connected');
    try {
      const users = await sql`
        SELECT u.*, m.id as merchant_id, m.status as merchant_status
        FROM users u
        LEFT JOIN merchants m ON m.user_id = u.id
        WHERE u.email = ${email} AND u.password_hash = ${password_hash}
      `;

      if (users.length === 0) {
        throw new Error('Credenciales inválidas');
      }

      const user = users[0];

      // Si es un comercio, debe estar activo
      if (user.role === 'MERCHANT' && user.merchant_status !== 'ACTIVE') {
        throw new Error('Su cuenta de comercio aún no ha sido activada por un administrador.');
      }

      return user;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Users
  async getUsers() {
    if (!sql) return [];
    try {
      return await sql`
        SELECT u.id, u.email, u.name, u.role, u.phone, u.created_at, m.id as merchant_id, m.business_name as merchant_name
        FROM users u
        LEFT JOIN merchants m ON m.user_id = u.id
        ORDER BY u.created_at DESC
      `;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  },

  async createUser(data: any) {
    if (!sql) throw new Error('Database not connected');
    try {
      const result = await sql`
        INSERT INTO users (name, email, phone, password_hash, role)
        VALUES (${data.name}, ${data.email}, ${data.phone}, ${data.password}, ${data.role})
        RETURNING id, name, email, phone, role, created_at
      `;
      const newUser = result[0];

      if (data.role === 'MERCHANT' && data.merchant_id) {
        await sql`
          UPDATE merchants 
          SET user_id = ${newUser.id} 
          WHERE id = ${data.merchant_id}
        `;
      }

      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async updateUser(id: string, data: any) {
    if (!sql) throw new Error('Database not connected');
    try {
      let updatedUser;
      if (data.password) {
        const result = await sql`
          UPDATE users 
          SET name = ${data.name}, email = ${data.email}, phone = ${data.phone}, password_hash = ${data.password}, role = ${data.role}
          WHERE id = ${id}
          RETURNING id, name, email, phone, role, created_at
        `;
        updatedUser = result[0];
      } else {
        const result = await sql`
          UPDATE users 
          SET name = ${data.name}, email = ${data.email}, phone = ${data.phone}, role = ${data.role}
          WHERE id = ${id}
          RETURNING id, name, email, phone, role, created_at
        `;
        updatedUser = result[0];
      }

      if (data.role === 'MERCHANT' && data.merchant_id) {
        // Reset previous links for this user
        await sql`UPDATE merchants SET user_id = NULL WHERE user_id = ${id}`;
        // Link to new merchant
        await sql`UPDATE merchants SET user_id = ${id} WHERE id = ${data.merchant_id}`;
      }

      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(id: string) {
    if (!sql) throw new Error('Database not connected');
    try {
      return await sql`DELETE FROM users WHERE id = ${id}`;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  async registerMerchant(data: any) {
    if (!sql) throw new Error('Database not connected');
    try {
      // 1. Create User
      const userResult = await sql`
        INSERT INTO users (name, email, phone, password_hash, role)
        VALUES (${data.user.name}, ${data.user.email}, ${data.user.phone}, ${data.user.password}, 'MERCHANT')
        RETURNING id
      `;
      const userId = userResult[0].id;

      // 2. Create Merchant with all the info from Steps 2, 3, 4
      await sql`
        INSERT INTO merchants (
          user_id, business_name, tax_id, status,
          legal_rep_name, legal_rep_lastname, legal_rep_email, legal_rep_phone, 
          legal_rep_doc_type, legal_rep_doc_number, legal_rep_doc_exp_date, 
          legal_rep_exp_country, legal_rep_exp_city, legal_rep_address,
          website, country, city, address, economic_activity,
          doc_front_url, doc_back_url, chamber_commerce_url, rut_url, bank_cert_url
        ) VALUES (
          ${userId}, ${data.company.business_name}, ${data.company.tax_id}, 'PENDING',
          ${data.legal.name}, ${data.legal.lastname}, ${data.legal.email}, ${data.legal.phone},
          ${data.legal.doc_type}, ${data.legal.doc_number}, ${data.legal.doc_exp_date || null},
          ${data.legal.exp_country}, ${data.legal.exp_city}, ${data.legal.address},
          ${data.company.website}, ${data.company.country}, ${data.company.city}, 
          ${data.company.address}, ${data.company.economic_activity},
          ${data.docs.doc_front}, ${data.docs.doc_back}, ${data.docs.chamber}, 
          ${data.docs.rut}, ${data.docs.bank_cert}
        )
      `;

      return { success: true, userId };
    } catch (error) {
      console.error('Error in registerMerchant:', error);
      throw error;
    }
  },

  async updateMerchantStatus(id: string, status: string) {
    if (!sql) throw new Error('Database not connected');
    try {
      return await sql`
        UPDATE merchants 
        SET status = ${status} 
        WHERE id = ${id}
        RETURNING id, business_name, status
      `;
    } catch (error) {
      console.error('Error updating merchant status:', error);
      throw error;
    }
  }
};
