import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import { UserPlus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotice('');
    if (!supabase) {
      setError(t('auth.notConfigured'));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMismatch'));
      return;
    }
    if (formData.password.length < 6) {
      setError(t('auth.passwordShort'));
      return;
    }
    setLoading(true);
    const { data, error: authError } = await supabase.auth.signUp({
      email: formData.email.trim(),
      password: formData.password,
      options: { data: { full_name: formData.name.trim() } },
    });
    setLoading(false);
    if (authError) {
      setError(
        authError.message.includes('already registered')
          ? t('auth.alreadyRegistered')
          : t('auth.genericError')
      );
      return;
    }
    // Ако "Confirm email" е изключено, сесията идва веднага → право в портала.
    // Ако е включено, session е null → показваме "проверете пощата".
    if (data.session) {
      navigate('/portal');
    } else {
      setNotice(t('auth.checkEmail'));
    }
  };

  return (
    <>
      <SEOMeta title={t('rp.title') + ' | Unban Solutions'} noindex />
      <main className="min-h-[100dvh] flex items-center justify-center pt-16 pb-8 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-200/30 rounded-full filter blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-purple-200/30 rounded-full filter blur-[60px]" />
        <div className="relative w-full max-w-[360px] mx-auto px-6">
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)]">
              <UserPlus size={20} className="text-white" />
            </div>
            <h1 className="text-slate-900 text-xl font-bold mb-1">{t('rp.title')}</h1>
            <p className="text-slate-700 text-xs">{t('rp.subtitle')}</p>
          </div>
          <div className="glass-card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 text-[10px] uppercase tracking-wider mb-1 font-bold">{t('rp.name')}</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="form-input" placeholder={t('rp.namePh')} />
              </div>
              <div>
                <label className="block text-slate-700 text-[10px] uppercase tracking-wider mb-1 font-bold">{t('rp.email')}</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="form-input" placeholder={t('rp.emailPh')} />
              </div>
              <div>
                <label className="block text-slate-700 text-[10px] uppercase tracking-wider mb-1 font-bold">{t('rp.password')}</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required className="form-input" placeholder={t('rp.passwordPh')} />
              </div>
              <div>
                <label className="block text-slate-700 text-[10px] uppercase tracking-wider mb-1 font-bold">{t('rp.confirm')}</label>
                <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required className="form-input" placeholder={t('rp.confirmPh')} />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-700 text-xs">{error}</div>
              )}
              {notice && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-emerald-700 text-xs">{notice}</div>
              )}
              <button type="submit" disabled={loading} className="w-full glow-btn text-xs py-2.5 disabled:opacity-60">
                {loading ? t('auth.loading') : t('rp.submit')}
              </button>
            </form>
          </div>
          <p className="text-center text-slate-700 text-xs mt-6">{t('rp.haveAccount')} <Link to="/login" className="text-blue-700 hover:text-blue-900 transition-colors font-bold">{t('rp.login')}</Link></p>
        </div>
      </main>
    </>
  );
}
