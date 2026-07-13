import { Navigate, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import SEOMeta from '@/components/SEOMeta';
import { ShieldCheck, LogOut, FolderOpen } from 'lucide-react';

export default function Portal() {
  const { user, loading, signOut } = useAuth();
  const { t } = useLanguage();

  if (loading) {
    return (
      <main className="min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  const displayName = (user.user_metadata?.full_name as string) || user.email || '';

  return (
    <>
      <SEOMeta title={t('pp.title') + ' | Unban Solutions'} noindex />
      <main className="min-h-[100dvh] pt-24 pb-12 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-200/30 rounded-full filter blur-[80px]" />
        <div className="relative max-w-2xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                <ShieldCheck size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-slate-900 text-lg font-bold leading-tight">{t('pp.hello')}, {displayName}!</h1>
                <p className="text-slate-600 text-xs">{t('pp.subtitle')}</p>
              </div>
            </div>
            <button onClick={signOut} className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors">
              <LogOut size={14} /> {t('pp.signout')}
            </button>
          </div>

          <div className="glass-card p-8 text-center">
            <FolderOpen size={32} className="mx-auto text-slate-400 mb-3" />
            <h2 className="text-slate-900 text-sm font-bold mb-1">{t('pp.casesTitle')}</h2>
            <p className="text-slate-600 text-xs leading-relaxed max-w-sm mx-auto">{t('pp.casesEmpty')}</p>
            <Link to="/contact" className="glow-btn inline-block text-xs py-2.5 px-6 mt-5">{t('pp.newCase')}</Link>
          </div>
        </div>
      </main>
    </>
  );
}
