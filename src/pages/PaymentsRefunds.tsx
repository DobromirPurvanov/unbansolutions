import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import { CheckCircle, Clock, Shield } from 'lucide-react';

export default function PaymentsRefunds() {
  const { lang, t } = useLanguage();
  const isBg = lang === 'bg';
  const items = [
    { icon: CheckCircle, title: t('pay.full'), text: t('pay.fullDesc'), color: 'text-emerald-700', border: 'border-l-emerald-600' },
    { icon: Clock, title: t('pay.partial'), text: t('pay.partialDesc'), color: 'text-amber-700', border: 'border-l-amber-600' },
    { icon: Shield, title: t('pay.none'), text: t('pay.noneDesc'), color: 'text-blue-700', border: 'border-l-blue-700' },
  ];

  return (
    <>
      <SEOMeta title={`${t('leg.payments')}${t('leg.paymentsSpan')} | Unban Solutions`} description={isBg ? 'Условия за плащане, право на отказ и възстановяване при възложени услуги.' : 'Payment, withdrawal and refund conditions for engaged services.'} canonical="https://www.unbansolutions.com/payments-and-refunds" />
      <main className="min-h-[100dvh] pt-24 pb-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-[760px] mx-auto px-6">
          <p className="label-mono mb-2">{t('leg.label')}</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">{t('leg.payments')}<span className="gradient-text">{t('leg.paymentsSpan')}</span></h1>
          <p className="text-slate-600 text-sm mb-8">{t('leg.date')}</p>

          <section className="glass-card p-5 mb-5">
            <h2 className="text-slate-900 text-base font-bold mb-2">{isBg ? 'Цена и начин на плащане' : 'Price and payment method'}</h2>
            <p className="text-slate-700 text-sm leading-relaxed">{isBg ? 'Точната цена, валута, включени действия и начин на плащане се потвърждават писмено преди започване на работа. Формата за контакт не извършва плащане и не създава автоматично договор.' : 'The exact price, currency, included work and payment method are confirmed in writing before work begins. The contact form does not take payment or automatically create a contract.'}</p>
          </section>

          <section className="mb-5">
            <h2 className="text-slate-900 text-base font-bold mb-3">{isBg ? 'Отказ и възстановяване' : 'Withdrawal and refunds'}</h2>
            <div className="space-y-3">
              {items.map((item) => <div key={item.title} className={`flex items-start gap-3 p-5 glass-card border-l-4 ${item.border}`}><item.icon size={18} className={`${item.color} flex-shrink-0 mt-0.5`} aria-hidden="true" /><div><h3 className="text-slate-900 font-bold text-sm mb-1">{item.title}</h3><p className="text-slate-700 text-sm leading-relaxed">{item.text}</p></div></div>)}
            </div>
          </section>

          <section className="glass-card p-5 mb-5">
            <h2 className="text-slate-900 text-base font-bold mb-2">{isBg ? '14-дневно право на отказ' : '14-day right of withdrawal'}</h2>
            <p className="text-slate-700 text-sm leading-relaxed">{isBg ? 'Потребителят по договор от разстояние обичайно има 14 дни за отказ. Ако изрично поиска услугата да започне през този период, при последващ отказ може да дължи пропорционална сума за извършеното. При напълно изпълнена услуга правото може да отпадне само при изпълнение на законовите изисквания за предварително изрично съгласие и потвърждение.' : 'A consumer under a distance contract generally has 14 days to withdraw. If the consumer expressly asks for the service to begin during that period, a proportionate amount for completed work may be due upon later withdrawal. For a fully performed service, the right may be lost only when the legal requirements for prior express consent and acknowledgement are met.'}</p>
          </section>

          <p className="text-slate-600 text-xs leading-relaxed">{isBg ? 'За отказ или спор по плащане пишете на' : 'For a withdrawal or payment dispute, email'} <a className="text-blue-700 underline" href="mailto:support@unbansolutions.com">support@unbansolutions.com</a>. {isBg ? 'Задължителните потребителски права винаги имат предимство пред противоречаща договорна клауза.' : 'Mandatory consumer rights always prevail over a conflicting contractual term.'}</p>
        </div>
      </main>
    </>
  );
}
