import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';

export default function Terms() {
  const { lang, t } = useLanguage();
  const isBg = lang === 'bg';

  const sections = [
    { title: '1. ' + (isBg ? 'Приемане' : 'Acceptance'), text: isBg
      ? 'С използването на услугите приемате тези условия.'
      : 'By using our services, you accept these terms.' },
    { title: '2. ' + (isBg ? 'Услуги' : 'Services'), text: isBg
      ? 'Възстановяване на акаунти, shadowban, одити и консултации.'
      : 'Account recovery, shadowban removal, audits, and consultations.' },
    { title: '3. ' + (isBg ? 'Задължения' : 'Obligations'), text: isBg
      ? 'Точна информация, без незаконни цели.'
      : 'Accurate information, no unlawful purposes.' },
    { title: '4. ' + (isBg ? 'Плащане' : 'Payment'), text: isBg
      ? 'Предварително. Карти, преводи, PayPal.'
      : 'In advance. Cards, transfers, PayPal.' },
    { title: '5. ' + (isBg ? 'Възстановяване' : 'Refunds'), text: isBg
      ? 'Пълно при неуспех. Без при невярна информация.'
      : 'Full refund if unsuccessful. No refund for false information.' },
    { title: '6. ' + (isBg ? 'Отговорност' : 'Liability'), text: isBg
      ? 'Ограничена до платената сума.'
      : 'Limited to the amount paid.' },
    { title: '7. ' + (isBg ? 'Поверителност' : 'Confidentiality'), text: isBg
      ? 'Строго поверително.'
      : 'Strictly confidential.' },
    { title: '8. ' + (isBg ? 'Прекратяване' : 'Termination'), text: isBg
      ? 'Всяка страна може да прекрати.'
      : 'Either party may terminate.' },
    { title: '9. ' + (isBg ? 'Право' : 'Governing Law'), text: isBg
      ? 'Законите на Република България.'
      : 'The laws of the Republic of Bulgaria.' },
    { title: '10. ' + (isBg ? 'Промени' : 'Changes'), text: isBg
      ? 'Запазваме правото да променяме.'
      : 'We reserve the right to make changes.' },
    { title: '11. ' + (isBg ? 'Контакт' : 'Contact'), text: 'support@unbansolutions.com' },
  ];

  return (
    <>
      <SEOMeta title={t('leg.terms') + t('leg.termsSpan') + ' | Unban Solutions'} noindex />
      <main className="min-h-[100dvh] pt-24 pb-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-[700px] mx-auto px-6">
          <p className="label-mono mb-2">{t('leg.label')}</p>
          <h1 className="text-2xl font-bold text-slate-900 mb-6">{t('leg.terms')}<span className="gradient-text">{t('leg.termsSpan')}</span></h1>
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
