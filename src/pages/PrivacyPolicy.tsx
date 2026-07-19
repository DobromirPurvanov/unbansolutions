import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import { openCookieSettings } from '@/lib/analytics';

export default function PrivacyPolicy() {
  const { lang } = useLanguage();
  const isBg = lang === 'bg';

  const sections = isBg ? [
    {
      title: '1. Администратор и контакт',
      content: <p>Администратор на данните за този сайт е Unban Solutions, адрес: гр. София, бул. „Шипченски проход“ 18, имейл: <a className="text-blue-700 underline" href="mailto:support@unbansolutions.com">support@unbansolutions.com</a>, телефон: <a className="text-blue-700 underline" href="tel:+359883391411">+359 883 391 411</a>.</p>,
    },
    {
      title: '2. Какви данни обработваме',
      content: <ul className="list-disc pl-5 space-y-1"><li>име и имейл, които въвеждате във формата;</li><li>избрана платформа, тип на проблема и съдържание на съобщението;</li><li>файловете, които доброволно прикачвате;</li><li>IP адрес за краткотрайна защита от злоупотреби и технически логове на хостинг доставчика;</li><li>данни за използването на сайта само ако приемете аналитични или маркетингови технологии.</li></ul>,
    },
    {
      title: '3. Цели и правни основания',
      content: <ul className="list-disc pl-5 space-y-1"><li>отговор и предварителна оценка на запитване — действия преди сключване на договор;</li><li>предоставяне на възложена услуга — изпълнение на договор;</li><li>сигурност и предотвратяване на злоупотреби — легитимен интерес;</li><li>аналитика и маркетинг — единствено въз основа на вашето съгласие;</li><li>законови и счетоводни задължения — когато са приложими.</li></ul>,
    },
    {
      title: '4. Получатели и услуги на трети страни',
      content: <p>Данни могат да се обработват от доставчиците, необходими за работата на сайта и комуникацията: Vercel (хостинг), Resend (изпращане на имейл) и, когато е конфигуриран, Upstash (псевдонимизиран хеш на IP адреса за разпределена защита от злоупотреби с 15-минутен срок). Google Analytics и Meta Pixel се зареждат само след изрично съгласие. Когато доставчик обработва данни извън ЕИП, се прилагат наличните по закон механизми за трансфер.</p>,
    },
    {
      title: '5. Срокове за съхранение',
      content: <p>Запитванията и прикачените файлове се пазят до 12 месеца, освен ако се стигне до договор или е нужно по-дълго съхранение за правна защита. Договорни и счетоводни записи се пазят за приложимите законови срокове. Съгласието за бисквитки се подновява най-късно след 180 дни.</p>,
    },
    {
      title: '6. Бисквитки и избор',
      content: <><p>Необходимите технологии поддържат основната работа и запомнят вашите настройки. Google Analytics и Meta Pixel не се зареждат преди съгласие.</p><button type="button" onClick={openCookieSettings} className="mt-3 min-h-11 px-4 py-2 rounded-lg bg-blue-700 text-white font-bold text-xs hover:bg-blue-800">Промени настройките за бисквитки</button></>,
    },
    {
      title: '7. Вашите права',
      content: <p>Имате право на достъп, коригиране, изтриване, ограничаване, преносимост и възражение, когато съответното право е приложимо. Можете да оттеглите съгласието си по всяко време, без това да засяга предходното законосъобразно обработване. Пишете на support@unbansolutions.com. Можете да подадете жалба и до Комисията за защита на личните данни.</p>,
    },
  ] : [
    {
      title: '1. Controller and contact',
      content: <p>The data controller for this website is Unban Solutions, address: 18 Shipchenski Prohod Blvd., Sofia, Bulgaria, email: <a className="text-blue-700 underline" href="mailto:support@unbansolutions.com">support@unbansolutions.com</a>, phone: <a className="text-blue-700 underline" href="tel:+359883391411">+359 883 391 411</a>.</p>,
    },
    {
      title: '2. Data we process',
      content: <ul className="list-disc pl-5 space-y-1"><li>the name and email you enter in the form;</li><li>the selected platform, issue type and message content;</li><li>files you voluntarily attach;</li><li>IP address for short-lived abuse protection and hosting provider technical logs;</li><li>website usage data only if you accept analytics or marketing technologies.</li></ul>,
    },
    {
      title: '3. Purposes and legal bases',
      content: <ul className="list-disc pl-5 space-y-1"><li>responding to and assessing an inquiry — pre-contractual steps;</li><li>providing an ordered service — contract performance;</li><li>security and abuse prevention — legitimate interest;</li><li>analytics and marketing — only with your consent;</li><li>legal and accounting duties — where applicable.</li></ul>,
    },
    {
      title: '4. Recipients and third-party services',
      content: <p>Data may be processed by providers needed to run the website and communications: Vercel (hosting), Resend (email delivery) and, when configured, Upstash (a pseudonymised IP-address hash for distributed abuse protection with a 15-minute lifetime). Google Analytics and Meta Pixel load only after explicit consent. Where a provider processes data outside the EEA, legally available transfer mechanisms are used.</p>,
    },
    {
      title: '5. Retention',
      content: <p>Inquiries and attachments are retained for up to 12 months unless a contract follows or longer retention is needed for legal protection. Contract and accounting records are retained for applicable statutory periods. Cookie consent is renewed no later than every 180 days.</p>,
    },
    {
      title: '6. Cookies and choice',
      content: <><p>Essential technologies support core operation and remember your settings. Google Analytics and Meta Pixel do not load before consent.</p><button type="button" onClick={openCookieSettings} className="mt-3 min-h-11 px-4 py-2 rounded-lg bg-blue-700 text-white font-bold text-xs hover:bg-blue-800">Change cookie settings</button></>,
    },
    {
      title: '7. Your rights',
      content: <p>You may have rights of access, rectification, erasure, restriction, portability and objection. You can withdraw consent at any time without affecting prior lawful processing. Email support@unbansolutions.com. You may also complain to the Bulgarian Commission for Personal Data Protection.</p>,
    },
  ];

  return (
    <>
      <SEOMeta
        title={isBg ? 'Политика за поверителност | Unban Solutions' : 'Privacy Policy | Unban Solutions'}
        description={isBg ? 'Как Unban Solutions събира, използва, съхранява и защитава личните данни.' : 'How Unban Solutions collects, uses, retains and protects personal data.'}
        canonical="https://www.unbansolutions.com/privacy-policy"
      />
      <main className="min-h-[100dvh] pt-24 pb-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-[800px] mx-auto px-6">
          <p className="label-mono mb-2">{isBg ? 'Правна информация' : 'Legal'}</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">{isBg ? 'Политика за поверителност' : 'Privacy Policy'}</h1>
          <p className="text-slate-600 text-sm mb-8">{isBg ? 'Актуализирано: 19 юли 2026 г.' : 'Updated: 19 July 2026'}</p>
          <div className="space-y-5 text-slate-700 text-sm leading-relaxed">
            {sections.map((section) => (
              <section key={section.title} className="glass-card p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-3">{section.title}</h2>
                {section.content}
              </section>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
