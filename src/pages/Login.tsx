import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import { LogIn } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!supabase) {
      setError(t('auth.notConfigured'));
      return;
    }
    setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: formData.email.trim(),
      password: formData.password,
    });
    setLoading(false);
    if (authError) {
      setError(
        authError.message.includes('Invalid login credentials')
          ? t('auth.wrongCredentials')
          : authError.message.includes('Email not confirmed')
            ? t('auth.emailNotConfirmed')
            : t('auth.genericError')
      );
      return;
    }
    navigate('/portal');
  };

  return (
    <>
      <SEOMeta title={t('lp.title') + ' | Unban Solutions'} noindex />
      <main className="min-h-[100dvh] flex items-center justify-center pt-16 pb-8 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-200/30 rounded-full filter blur-[80px]" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-purple-200/30 rounded-full filter blur-[60px]" />
        <div className="relative w-full max-w-[360px] mx-auto px-6">
          <div className="text-center mb-8">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.4)]">
              <LogIn size={20} className="text-white" />
            </div>
            <h1 className="text-slate-900 text-xl font-bold mb-1">{t('lp.title')}</h1>
            <p className="text-slate-700 text-xs">{t('lp.subtitle')}</p>
          </div>
          <div className="glass-card p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 text-[10px] uppercase tracking-wider mb-1 font-bold">{t('lp.email')}</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="form-input" placeholder={t('lp.emailPh')} />
              </div>
              <div>
                <label className="block text-slate-700 text-[10px] uppercase tracking-wider mb-1 font-bold">{t('lp.password')}</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required className="form-input" placeholder={t('lp.passwordPh')} />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-red-700 text-xs">{error}</div>
              )}
              <button type="submit" disabled={loading} className="w-full glow-btn text-xs py-2.5 disabled:opacity-60">
                {loading ? t('auth.loading') : t('lp.submit')}
              </button>
            </form>
          </div>
          <p className="text-center text-slate-700 text-xs mt-6">{t('lp.noAccount')} <Link to="/register" className="text-blue-700 hover:text-blue-900 transition-colors font-bold">{t('lp.register')}</Link></p>
        </div>
      </main>
    </>
  );
}
