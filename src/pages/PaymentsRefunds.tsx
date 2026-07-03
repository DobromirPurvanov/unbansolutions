import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import { CheckCircle, XCircle, Clock, Shield } from 'lucide-react';

export default function PaymentsRefunds() {
  const { lang, t } = useLanguage();

  return (
    <>
      <SEOMeta title={t('leg.payments') + t('leg.paymentsSpan') + ' | Unban Solutions'} noindex />
      <main className="min-h-[100dvh] pt-24 pb-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-[700px] mx-auto px-6">
          <p className="label-mono mb-2">{t('leg.label')}</p>
          <h1 className="text-2xl font-bold text-slate-900 mb-6">{t('leg.payments')}<span className="gradient-text">{t('leg.paymentsSpan')}</span></h1>

          <div className="space-y-4 text-slate-800 text-sm">
            <section className="glass-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={16} className="text-blue-700" />
                <h2 className="text-slate-900 text-sm font-bold">{t('pay.methods')}</h2>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['Visa/Mastercard', lang === 'bg' ? 'Банков превод' : 'Bank Transfer', 'PayPal', 'Crypto'].map((m) => (
                  <div key={m} className="flex items-center gap-2">
                    <CheckCircle size={11} className="text-blue-700 flex-shrink-0" />
                    <span className="text-slate-800 text-xs font-medium">{m}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-slate-900 text-sm font-bold mb-3">{t('pay.policy')}</h2>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-4 glass-card border-l-4 border-l-green-500">
                  <CheckCircle size={16} className="text-green-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-slate-900 font-bold text-xs mb-1">{t('pay.full')}</h3>
                    <p className="text-slate-700 text-xs">{t('pay.fullDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 glass-card border-l-4 border-l-yellow-500">
                  <Clock size={16} className="text-yellow-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-slate-900 font-bold text-xs mb-1">{t('pay.partial')}</h3>
                    <p className="text-slate-700 text-xs">{t('pay.partialDesc')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 glass-card border-l-4 border-l-red-500">
                  <XCircle size={16} className="text-red-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-slate-900 font-bold text-xs mb-1">{t('pay.none')}</h3>
                    <p className="text-slate-700 text-xs">{t('pay.noneDesc')}</p>
                  </div>
                </div>
              </div>
            </section>

            <p className="text-slate-700 text-xs pt-2">{t('leg.date')}</p>
          </div>
        </div>
      </main>
    </>
  );
}
