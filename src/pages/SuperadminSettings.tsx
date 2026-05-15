import React from 'react';
import { Layout } from '../components/Layout';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Save,
  Plus,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  X,
  Users,
  Mail,
  Phone,
  Key,
} from 'lucide-react';
import { dbService } from '../services/api';

// ─── Sub-components ────────────────────────────────────────────────────────────

const ConfigSection = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <section className="bg-white border border-black/5 rounded-sm shadow-sm p-10 mb-8">
    <div className="mb-8">
      <h2 className="text-xl font-bold text-black tracking-tight">{title}</h2>
      <p className="text-black/40 text-sm mt-1">{description}</p>
    </div>
    {children}
  </section>
);

const Toggle = ({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) => (
  <div className="flex items-center justify-between py-4 border-b border-black/5 last:border-0">
    <span className="text-sm font-semibold text-black/80">{label}</span>
    <button
      onClick={() => onChange(!enabled)}
      className={`w-12 h-6 rounded-full transition-colors relative ${
        enabled ? 'bg-[#cc0066]' : 'bg-black/10'
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
          enabled ? 'left-7' : 'left-1'
        }`}
      />
    </button>
  </div>
);

// ─── Plan Modal ────────────────────────────────────────────────────────────────

interface PlanFormData {
  id?: string;
  name: string;
  monthly_price: number;
  pse_fee_percent: number;
  card_fee_percent: number;
  card_retefuente_percent: number;
}

const EMPTY_PLAN: PlanFormData = {
  name: '',
  monthly_price: 0,
  pse_fee_percent: 0,
  card_fee_percent: 0,
  card_retefuente_percent: 0,
};

const PlanModal = ({
  isOpen,
  onClose,
  onSave,
  saving,
  plan,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PlanFormData) => void;
  saving: boolean;
  plan: PlanFormData | null;
}) => {
  const [form, setForm] = React.useState<PlanFormData>(EMPTY_PLAN);

  React.useEffect(() => {
    if (isOpen) {
      setForm(plan || EMPTY_PLAN);
    }
  }, [isOpen, plan]);

  const set = (field: keyof PlanFormData, raw: string) => {
    const value =
      field === 'name' ? raw : parseFloat(raw) || 0;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="bg-white rounded-sm shadow-2xl w-full max-w-lg p-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-xl font-bold text-black uppercase tracking-tight">
              {plan ? 'Editar Plan' : 'Nuevo Plan de Suscripción'}
            </h3>
            <p className="text-black/40 text-sm mt-1">
              {plan ? 'Modifica los parámetros del plan seleccionado.' : 'Configura los detalles del nuevo plan para comercios.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-black/20 hover:text-black transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-5">
          {/* Nombre */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-black/40">
              Nombre del Plan *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ej: Plan Corporativo"
              className="w-full bg-black/5 border-0 p-4 rounded-sm text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#cc0066]"
            />
          </div>

          {/* Tarifa Fija + Retefuente */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40">
                Tarifa Fija ($)
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={form.monthly_price}
                onChange={(e) => set('monthly_price', e.target.value)}
                className="w-full bg-black/5 border-0 p-4 rounded-sm text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#cc0066]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-rose-400">
                Retefuente Tarjeta (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.card_retefuente_percent}
                onChange={(e) => set('card_retefuente_percent', e.target.value)}
                className="w-full bg-rose-50 border-0 p-4 rounded-sm text-sm font-bold text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <p className="text-[10px] text-black/30">Solo aplica a Tarjeta Crédito</p>
            </div>
          </div>

          {/* PSE + Card fee */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#cc0066]">
                Comisión PSE (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.pse_fee_percent}
                onChange={(e) => set('pse_fee_percent', e.target.value)}
                className="w-full bg-pink-50 border-0 p-4 rounded-sm text-sm font-bold text-[#cc0066] focus:outline-none focus:ring-2 focus:ring-[#cc0066]"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#7a00cc]">
                Comisión Tarjeta (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={form.card_fee_percent}
                onChange={(e) => set('card_fee_percent', e.target.value)}
                className="w-full bg-purple-50 border-0 p-4 rounded-sm text-sm font-bold text-[#7a00cc] focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-10 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-black/40 font-bold text-sm hover:text-black transition-colors border border-black/10 rounded-sm"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !form.name.trim()}
            className="flex-1 bg-[#cc0066] text-white px-4 py-3 rounded-sm font-bold text-sm hover:bg-[#a30052] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {saving && (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            )}
            {plan ? 'Guardar Cambios' : 'Crear Plan'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Delete Confirmation Modal ───────────────────────────────────────────

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title: string;
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[250] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="bg-white rounded-sm shadow-2xl w-full max-w-md p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-6">
            <Trash2 size={32} className="text-rose-500" />
          </div>
          <h3 className="text-xl font-bold text-black uppercase tracking-tight mb-2">
            ¿Eliminar Plan?
          </h3>
          <p className="text-black/40 text-sm mb-8 leading-relaxed">
            Estás a punto de eliminar el plan <span className="font-bold text-black">"{title}"</span>. 
            Esta acción no se puede deshacer y afectará a los nuevos comercios.
          </p>

          <div className="flex gap-4 w-full">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 text-black/40 font-bold text-sm hover:text-black transition-colors border border-black/10 rounded-sm"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 bg-rose-600 text-white px-4 py-3 rounded-sm font-bold text-sm hover:bg-rose-700 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                'Eliminar'
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── User Modal ────────────────────────────────────────────────────────────────

interface UserFormData {
  id?: string;
  name: string;
  email: string;
  phone: string;
  role: 'SUPERADMIN' | 'MERCHANT';
  merchant_id?: string;
  password?: string;
  confirmPassword?: string;
}

const EMPTY_USER: UserFormData = {
  name: '',
  email: '',
  phone: '',
  role: 'MERCHANT',
  merchant_id: '',
  password: '',
  confirmPassword: '',
};

const UserModal = ({
  isOpen,
  onClose,
  onSave,
  saving,
  user,
  merchants,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: UserFormData) => void;
  saving: boolean;
  user: UserFormData | null;
  merchants: any[];
}) => {
  const [form, setForm] = React.useState<UserFormData>(EMPTY_USER);

  React.useEffect(() => {
    if (isOpen) {
      setForm(user ? { ...user, password: '', confirmPassword: '' } : EMPTY_USER);
    }
  }, [isOpen, user]);

  const set = (field: keyof UserFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  const isFormValid = 
    form.name.trim() && 
    form.email.trim() && 
    (user ? true : (form.password && form.password === form.confirmPassword)) &&
    (form.role !== 'MERCHANT' || form.merchant_id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[250] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        className="bg-white rounded-sm shadow-2xl w-full max-w-lg p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-xl font-bold text-black uppercase tracking-tight">
              {user ? 'Editar Usuario' : 'Nuevo Usuario'}
            </h3>
            <p className="text-black/40 text-sm mt-1">
              {user ? 'Modifica los datos del usuario seleccionado.' : 'Registra un nuevo usuario en el sistema.'}
            </p>
          </div>
          <button onClick={onClose} className="text-black/20 hover:text-black transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Nombre Completo *</label>
            <div className="relative">
              <input
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Ej: Juan Pérez"
                className="w-full bg-black/5 border-0 p-4 pl-12 rounded-sm text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#cc0066]"
              />
              <Users size={16} className="absolute left-4 top-4 text-black/20" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Correo Electrónico *</label>
              <div className="relative">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  placeholder="juan@ejemplo.com"
                  className="w-full bg-black/5 border-0 p-4 pl-12 rounded-sm text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#cc0066]"
                />
                <Mail size={16} className="absolute left-4 top-4 text-black/20" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Teléfono</label>
              <div className="relative">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => set('phone', e.target.value)}
                  placeholder="3001234567"
                  className="w-full bg-black/5 border-0 p-4 pl-12 rounded-sm text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#cc0066]"
                />
                <Phone size={16} className="absolute left-4 top-4 text-black/20" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Rol de Usuario *</label>
              <select
                value={form.role}
                onChange={(e) => set('role', e.target.value as any)}
                className="w-full bg-black/5 border-0 p-4 rounded-sm text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#cc0066]"
              >
                <option value="MERCHANT">Comercio (Vendedor)</option>
                <option value="SUPERADMIN">Superadministrador</option>
              </select>
            </div>
            {form.role === 'MERCHANT' && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-[#7a00cc]">Vincular Comercio *</label>
                <select
                  value={form.merchant_id}
                  onChange={(e) => set('merchant_id', e.target.value)}
                  className="w-full bg-purple-50 border-0 p-4 rounded-sm text-sm font-bold text-[#7a00cc] focus:outline-none focus:ring-2 focus:ring-purple-300"
                >
                  <option value="">Seleccionar comercio...</option>
                  {merchants.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.business_name}
                    </option>
                  ))}
                </select>
                {merchants.length === 0 && (
                  <p className="text-[10px] text-rose-500 font-bold uppercase tracking-tight">No hay comercios creados</p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40">
                {user ? 'Nueva Clave (Opcional)' : 'Clave *'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  className="w-full bg-black/5 border-0 p-4 pl-12 rounded-sm text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#cc0066]"
                />
                <Key size={16} className="absolute left-4 top-4 text-black/20" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-black/40">Confirmar Clave *</label>
              <div className="relative">
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => set('confirmPassword', e.target.value)}
                  className="w-full bg-black/5 border-0 p-4 pl-12 rounded-sm text-sm font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#cc0066]"
                />
                <Key size={16} className="absolute left-4 top-4 text-black/20" />
              </div>
            </div>
          </div>
          {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
            <p className="text-[10px] text-rose-500 font-bold uppercase tracking-tight">Las claves no coinciden</p>
          )}
        </div>

        <div className="mt-10 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 text-black/40 font-bold text-sm hover:text-black transition-colors border border-black/10 rounded-sm"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(form)}
            disabled={saving || !isFormValid}
            className="flex-1 bg-[#cc0066] text-white px-4 py-3 rounded-sm font-bold text-sm hover:bg-[#a30052] transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {saving && <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />}
            {user ? 'Actualizar' : 'Crear Usuario'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Toast = ({
  notification,
}: {
  notification: { type: 'success' | 'error'; message: string } | null;
}) => (
  <AnimatePresence>
    {notification && (
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        className={`fixed bottom-8 right-8 px-6 py-4 rounded-sm shadow-2xl z-[300] flex items-center gap-3 border ${
          notification.type === 'success'
            ? 'bg-white border-emerald-100'
            : 'bg-white border-rose-100'
        }`}
      >
        {notification.type === 'success' ? (
          <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
        ) : (
          <XCircle size={20} className="text-rose-500 shrink-0" />
        )}
        <span
          className={`text-sm font-bold ${
            notification.type === 'success' ? 'text-emerald-800' : 'text-rose-800'
          }`}
        >
          {notification.message}
        </span>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Main Component ────────────────────────────────────────────────────────────

export const SuperadminSettings = () => {
  const [activeTab, setActiveTab] = React.useState<'gateway' | 'plans' | 'users' | 'merchants'>('gateway');
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = React.useState(false);
  const [editingPlan, setEditingPlan] = React.useState<PlanFormData | null>(null);
  const [editingUser, setEditingUser] = React.useState<UserFormData | null>(null);
  const [planToDelete, setPlanToDelete] = React.useState<{ id: string; name: string } | null>(
    null
  );
  const [userToDelete, setUserToDelete] = React.useState<{ id: string; name: string } | null>(
    null
  );
  const [selectedMerchant, setSelectedMerchant] = React.useState<any | null>(null);
  const [isMerchantModalOpen, setIsMerchantModalOpen] = React.useState(false);
  const [notification, setNotification] = React.useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [gatewayConfig, setGatewayConfig] = React.useState({
    pse_active: true,
    card_active: true,
    pse_api_key: '',
    card_api_key: '',
  });
  const [showApiKey, setShowApiKey] = React.useState(false);
  const [plans, setPlans] = React.useState<any[]>([]);
  const [users, setUsers] = React.useState<any[]>([]);
  const [merchants, setMerchants] = React.useState<any[]>([]);

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const [settings, plansData, usersData, merchantsData] = await Promise.all([
        dbService.getGlobalSettings(),
        dbService.getSubscriptionPlans(),
        dbService.getUsers(),
        dbService.getMerchants(),
      ]);
      setGatewayConfig(settings);
      setPlans(plansData as any[]);
      setUsers(usersData as any[]);
      setMerchants(merchantsData as any[]);
    } catch (err) {
      console.error('Error loading settings:', err);
      notify('error', 'Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSaveGateway = async () => {
    setSaving(true);
    try {
      await dbService.updateGlobalSettings(gatewayConfig);
      notify('success', 'Configuración de pasarela guardada correctamente');
    } catch {
      notify('error', 'Error al guardar la configuración de pasarela');
    } finally {
      setSaving(false);
    }
  };

  const handleSavePlan = async (formData: PlanFormData) => {
    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        monthly_price: Number(formData.monthly_price),
        pse_fee_percent: Number(formData.pse_fee_percent),
        card_fee_percent: Number(formData.card_fee_percent),
        card_retefuente_percent: Number(formData.card_retefuente_percent),
        is_active: true,
      };

      if (formData.id) {
        await dbService.updateSubscriptionPlan(formData.id, payload);
        notify('success', `Plan "${formData.name}" actualizado exitosamente`);
      } else {
        await dbService.createSubscriptionPlan(payload);
        notify('success', `Plan "${formData.name}" creado exitosamente`);
      }
      
      await loadData();
      setIsModalOpen(false);
      setEditingPlan(null);
    } catch (err: any) {
      console.error('Save plan error:', err);
      notify('error', 'No se pudo guardar el plan. Revisa la consola para más detalles.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;
    
    setSaving(true);
    try {
      await dbService.deleteSubscriptionPlan(planToDelete.id);
      await loadData();
      notify('success', `Plan "${planToDelete.name}" eliminado correctamente`);
      setPlanToDelete(null);
    } catch (err) {
      console.error('Delete plan error:', err);
      notify('error', 'Error al eliminar el plan');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveUser = async (formData: UserFormData) => {
    setSaving(true);
    try {
      if (formData.id) {
        await dbService.updateUser(formData.id, formData);
        notify('success', `Usuario "${formData.name}" actualizado exitosamente`);
      } else {
        await dbService.createUser(formData);
        notify('success', `Usuario "${formData.name}" creado exitosamente`);
      }
      await loadData();
      setIsUserModalOpen(false);
      setEditingUser(null);
    } catch (err: any) {
      console.error('Save user error:', err);
      notify('error', 'No se pudo guardar el usuario.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setSaving(true);
    try {
      await dbService.deleteUser(userToDelete.id);
      await loadData();
      notify('success', `Usuario "${userToDelete.name}" eliminado correctamente`);
      setUserToDelete(null);
    } catch (err) {
      console.error('Delete user error:', err);
      notify('error', 'Error al eliminar el usuario');
    } finally {
      setSaving(false);
    }
  };

  const handleActivateMerchant = async (id: string) => {
    setSaving(true);
    try {
      await dbService.updateMerchantStatus(id, 'ACTIVE');
      notify('success', 'Comercio activado exitosamente');
      await loadData();
    } catch (err) {
      console.error('Activation error:', err);
      notify('error', 'No se pudo activar el comercio');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout role="SUPERADMIN">
        <div className="flex items-center justify-center min-h-screen bg-[#F2F2F2]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#cc0066]" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="SUPERADMIN">
      <div className="p-4 md:p-12 w-full max-w-[1280px] mx-auto bg-[#F2F2F2] min-h-screen">
        {/* Page Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 pt-12 lg:pt-0">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-black tracking-tight uppercase">
              Configuración del Sistema
            </h1>
            <p className="text-black/40 text-sm mt-1">
              Gestiona los métodos de pago globales y planes de suscripción.
            </p>
          </div>
          {activeTab === 'gateway' && (
            <button
              onClick={handleSaveGateway}
              disabled={saving}
              className="w-full md:w-auto bg-[#cc0066] text-white px-8 py-3 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-[#a30052] transition-all disabled:opacity-50"
            >
              {saving ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <Save size={16} />
              )}
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          )}
        </header>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-black/5 mb-8">
          {(['gateway', 'plans', 'users', 'merchants'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-bold transition-all relative ${
                activeTab === tab
                  ? 'text-[#cc0066]'
                  : 'text-black/40 hover:text-black'
              }`}
            >
              {tab === 'gateway' ? 'Pasarela' : tab === 'plans' ? 'Planes' : tab === 'users' ? 'Usuarios' : 'Comercios'}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#cc0066]" />
              )}
            </button>
          ))}
        </div>

        {/* ── Tab: Gateway ────────────────────────────── */}
        {activeTab === 'gateway' && (
          <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
            <ConfigSection
              title="Métodos de Pago Activos"
              description="Activa o desactiva la disponibilidad de métodos de pago para todos los comercios."
            >
              <Toggle
                enabled={gatewayConfig.pse_active}
                onChange={(v) => setGatewayConfig({ ...gatewayConfig, pse_active: v })}
                label="Habilitar Pagos PSE (Débito Bancario)"
              />
              <Toggle
                enabled={gatewayConfig.card_active}
                onChange={(v) => setGatewayConfig({ ...gatewayConfig, card_active: v })}
                label="Habilitar Tarjeta de Crédito"
              />
            </ConfigSection>

            <ConfigSection
              title="Credenciales de API"
              description="Llaves de acceso para el procesador de pagos. Mantén la llave privada segura."
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40">
                    Llave Pública (PSE / General)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={gatewayConfig.pse_api_key}
                      onChange={(e) =>
                        setGatewayConfig({ ...gatewayConfig, pse_api_key: e.target.value })
                      }
                      placeholder="pub_test_..."
                      className="w-full bg-black/5 border-0 p-4 pr-12 rounded-sm text-sm font-mono text-black/60 focus:outline-none focus:ring-2 focus:ring-[#cc0066]"
                    />
                    <Lock size={16} className="absolute right-4 top-4 text-black/20" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-black/40">
                    Llave Privada (Tarjetas)
                  </label>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={gatewayConfig.card_api_key}
                      onChange={(e) =>
                        setGatewayConfig({ ...gatewayConfig, card_api_key: e.target.value })
                      }
                      placeholder="prv_test_..."
                      className="w-full bg-black/5 border-0 p-4 pr-12 rounded-sm text-sm font-mono text-black/60 focus:outline-none focus:ring-2 focus:ring-[#cc0066]"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-4 top-4 text-black/20 hover:text-black/50 transition-colors"
                    >
                      {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </ConfigSection>
          </motion.div>
        )}

        {/* ── Tab: Plans ──────────────────────────────── */}
        {activeTab === 'plans' && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
            <ConfigSection
              title="Gestión de Planes"
              description="Define tarifas fijas y comisiones diferenciadas por método de pago para cada plan."
            >
              {plans.length === 0 ? (
                <p className="text-center text-black/30 py-8 text-sm">
                  No hay planes configurados aún. Crea el primero.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-black/5 text-black/40 text-[10px] font-black uppercase tracking-widest">
                        <th className="pb-5">Nombre del Plan</th>
                        <th className="pb-5">Tarifa Fija</th>
                        <th className="pb-5">Comisión PSE</th>
                        <th className="pb-5">Comisión T.Crédito</th>
                        <th className="pb-5">Retefuente T.C</th>
                        <th className="pb-5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {plans.map((plan) => (
                        <tr key={plan.id} className="hover:bg-black/[0.015] transition-colors">
                          <td className="py-5 font-bold text-black">{plan.name}</td>
                          <td className="py-5 font-semibold text-black/60">
                            ${Number(plan.monthly_price).toLocaleString('es-CO')}
                          </td>
                          <td className="py-5 font-bold text-[#cc0066]">
                            {Number(plan.pse_fee_percent).toFixed(1)}%
                          </td>
                          <td className="py-5 font-bold text-[#7a00cc]">
                            {Number(plan.card_fee_percent).toFixed(1)}%
                          </td>
                          <td className="py-5 font-bold text-rose-500">
                            {Number(plan.card_retefuente_percent).toFixed(1)}%
                          </td>
                          <td className="py-5 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => {
                                  setEditingPlan(plan);
                                  setIsModalOpen(true);
                                }}
                                className="p-2 text-black/20 hover:text-black/60 transition-colors"
                              >
                                <Settings size={17} />
                              </button>
                              <button 
                                onClick={() => setPlanToDelete({ id: plan.id, name: plan.name })}
                                className="p-2 text-black/20 hover:text-rose-600 transition-colors"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button
                onClick={() => {
                  setEditingPlan(null);
                  setIsModalOpen(true);
                }}
                className="mt-8 flex items-center gap-2 text-[#cc0066] font-bold text-sm hover:underline"
              >
                <Plus size={18} />
                Agregar Nuevo Plan
              </button>
            </ConfigSection>
          </motion.div>
        )}

        {/* ── Tab: Users ──────────────────────────────── */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
            <ConfigSection
              title="Gestión de Usuarios"
              description="Administra los usuarios del sistema, sus accesos y credenciales."
            >
              {users.length === 0 ? (
                <p className="text-center text-black/30 py-8 text-sm">
                  No hay usuarios registrados aún.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-black/5 text-black/40 text-[10px] font-black uppercase tracking-widest">
                        <th className="pb-5">Nombre Completo</th>
                        <th className="pb-5">Email</th>
                        <th className="pb-5">Teléfono</th>
                        <th className="pb-5">Rol</th>
                        <th className="pb-5 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-black/[0.015] transition-colors">
                          <td className="py-5">
                            <div className="flex flex-col">
                              <span className="font-bold text-black">{user.name}</span>
                              {user.merchant_name && (
                                <span className="text-[10px] font-bold text-purple-600 uppercase tracking-tighter">
                                  {user.merchant_name}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-5 font-semibold text-black/60">{user.email}</td>
                          <td className="py-5 text-black/60 font-mono text-xs">{user.phone || '---'}</td>
                          <td className="py-5">
                            <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest ${
                              user.role === 'SUPERADMIN' 
                                ? 'bg-rose-100 text-rose-700' 
                                : 'bg-emerald-100 text-emerald-700'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-5 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => {
                                  setEditingUser(user);
                                  setIsUserModalOpen(true);
                                }}
                                className="p-2 text-black/20 hover:text-black/60 transition-colors"
                              >
                                <Settings size={17} />
                              </button>
                              <button 
                                onClick={() => setUserToDelete({ id: user.id, name: user.name })}
                                className="p-2 text-black/20 hover:text-rose-600 transition-colors"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button
                onClick={() => {
                  setEditingUser(null);
                  setIsUserModalOpen(true);
                }}
                className="mt-8 flex items-center gap-2 text-[#cc0066] font-bold text-sm hover:underline"
              >
                <Plus size={18} />
                Agregar Nuevo Usuario
              </button>
            </ConfigSection>
          </motion.div>
        )}

        {/* ── Tab: Merchants ───────────────────────────── */}
        {activeTab === 'merchants' && (
          <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}>
            <ConfigSection
              title="Lista de Comercios"
              description="Visualiza todos los comercios registrados en la plataforma y sus planes actuales."
            >
              {merchants.length === 0 ? (
                <p className="text-center text-black/30 py-8 text-sm">
                  No hay comercios registrados aún.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-black/5 text-black/40 text-[10px] font-black uppercase tracking-widest">
                        <th className="pb-5">Nombre Comercial</th>
                        <th className="pb-5">NIT / TAX ID</th>
                        <th className="pb-5">Representante</th>
                        <th className="pb-5">Plan</th>
                        <th className="pb-5 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {merchants.map((m) => (
                        <tr key={m.id} className="hover:bg-black/[0.015] transition-colors">
                          <td className="py-5">
                            <div className="flex flex-col">
                              <span className="font-bold text-black">{m.business_name}</span>
                              <span className="text-[10px] font-medium text-black/40 uppercase">ID: {m.id.slice(0, 8)}...</span>
                            </div>
                          </td>
                          <td className="py-5 font-semibold text-black/60">{m.tax_id}</td>
                          <td className="py-5 text-black/60 font-medium">
                            {m.legal_rep_name} {m.legal_rep_lastname}
                          </td>
                          <td className="py-5">
                            <span className="text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-widest bg-purple-100 text-purple-700">
                              {m.plan_name || 'Sin Plan'}
                            </span>
                          </td>
                          <td className="py-5 text-right">
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Activo</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </ConfigSection>
          </motion.div>
        )}

        {/* ── Modal ───────────────────────────────────── */}
        <AnimatePresence>
          {isModalOpen && (
            <PlanModal
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setEditingPlan(null);
              }}
              onSave={handleSavePlan}
              saving={saving}
              plan={editingPlan}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isUserModalOpen && (
            <UserModal
              isOpen={isUserModalOpen}
              onClose={() => {
                setIsUserModalOpen(false);
                setEditingUser(null);
              }}
              onSave={handleSaveUser}
              saving={saving}
              user={editingUser}
              merchants={merchants}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {planToDelete && (
            <DeleteConfirmModal
              isOpen={!!planToDelete}
              onClose={() => setPlanToDelete(null)}
              onConfirm={handleDeletePlan}
              loading={saving}
              title={planToDelete.name}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {userToDelete && (
            <DeleteConfirmModal
              isOpen={!!userToDelete}
              onClose={() => setUserToDelete(null)}
              onConfirm={handleDeleteUser}
              loading={saving}
              title={userToDelete.name}
            />
          )}
        </AnimatePresence>

        {/* ── Toast ───────────────────────────────────── */}
        <Toast notification={notification} />

      </div>
    </Layout>
  );
};



const DetailItem = ({ label, value, full }: any) => (
  <div className={`flex flex-col gap-1 ${full ? 'col-span-2' : ''}`}>
    <span className="text-[9px] font-black text-black/30 uppercase tracking-widest">{label}</span>
    <span className="text-xs font-bold text-black">{value || '---'}</span>
  </div>
);

const DocLink = ({ label, value }: any) => (
  <div className="flex items-center justify-between p-4 bg-black/5 rounded-2xl hover:bg-black/10 transition-colors cursor-pointer group">
    <div className="flex items-center gap-3">
      <FileText size={18} className="text-black/20 group-hover:text-[#cc0066] transition-colors" />
      <span className="text-[10px] font-black text-black uppercase tracking-widest">{label}</span>
    </div>
    <span className="text-[9px] font-bold text-[#cc0066] underline">{value ? 'VER ARCHIVO' : 'NO CARGADO'}</span>
  </div>
);

