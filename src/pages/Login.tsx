import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import { LogIn } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { t } = useLanguage();
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); };

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
              <button type="submit" className="w-full glow-btn text-xs py-2.5">{t('lp.submit')}</button>
            </form>
          </div>
          <p className="text-center text-slate-700 text-xs mt-6">{t('lp.noAccount')} <Link to="/register" className="text-blue-700 hover:text-blue-900 transition-colors font-bold">{t('lp.register')}</Link></p>
        </div>
      </main>
    </>
  );
}
