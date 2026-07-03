import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';

export default function PrivacyPolicy() {
  const { lang, t } = useLanguage();
  const isBg = lang === 'bg';
  const sections = [
    { title: '1. ' + (isBg ? 'Въведение' : 'Introduction'), text: isBg
      ? 'Unban Solutions защитава вашата поверителност. Спазваме GDPR и българските закони.'
      : 'Unban Solutions protects your privacy. We comply with GDPR and Bulgarian laws.' },
    { title: '2. ' + (isBg ? 'Информация' : 'Information'), text: isBg
      ? 'Събираме: лична информация, данни за акаунти, технически данни и комуникация.'
      : 'We collect: personal information, account data, technical data, and communications.' },
    { title: '3. ' + (isBg ? 'Използване' : 'Usage'), text: isBg
      ? 'За възстановяване на акаунти, комуникация, плащания и подобряване на услугите.'
      : 'For account recovery, communication, payments, and service improvement.' },
    { title: '4. ' + (isBg ? 'Споделяне' : 'Sharing'), text: isBg
      ? 'Не продаваме данни. Споделяме с доставчици и платформи при необходимост.'
      : 'We do not sell data. We share with providers and platforms when necessary.' },
    { title: '5. ' + (isBg ? 'Сигурност' : 'Security'), text: isBg
      ? 'SSL криптиране и сигурни сървъри.'
      : 'SSL encryption and secure servers.' },
    { title: '6. ' + (isBg ? 'Права' : 'Rights'), text: isBg
      ? 'Достъп, коригиране, изтриване, ограничаване, преносимост по GDPR.'
      : 'Access, rectification, erasure, restriction, and data portability under GDPR.' },
    { title: '7. ' + (isBg ? 'Бисквитки' : 'Cookies'), text: isBg
      ? 'Използваме бисквитки за подобряване на преживяването.'
      : 'We use cookies to improve your experience.' },
    { title: '8. ' + (isBg ? 'Контакт' : 'Contact'), text: 'support@unbansolutions.com' },
  ];

  return (
    <>
      <SEOMeta title={t('leg.privacy') + t('leg.privacySpan') + ' | Unban Solutions'} noindex />
      <main className="min-h-[100dvh] pt-24 pb-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-[700px] mx-auto px-6">
          <p className="label-mono mb-2">{t('leg.label')}</p>
          <h1 className="text-2xl font-bold text-slate-900 mb-6">{t('leg.privacy')}<span className="gradient-text">{t('leg.privacySpan')}</span></h1>
          <div className="space-y-4 text-slate-800 text-sm">
            {sections.map((s) => (
              <section key={s.title} className="glass-card p-4">
                <h2 className="text-slate-900 text-sm font-bold mb-1">{s.title}</h2>
                <p className="text-xs">{s.text}</p>
              </section>
            ))}
            <p className="text-slate-700 text-xs pt-2">{t('leg.date')}</p>
          </div>
        </div>
      </main>
    </>
  );
}
