import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';

export default function PrivacyPolicy() {
  const { lang } = useLanguage();
  const isBg = lang === 'bg';

  return (
    <>
      <SEOMeta 
        title={isBg ? 'Политика за поверителност | Unban Solutions' : 'Privacy Policy | Unban Solutions'} 
        description={isBg ? 'Политика за поверителност на Unban Solutions' : 'Privacy Policy of Unban Solutions'} 
      />
      <main className="min-h-[100dvh] pt-24 pb-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-[800px] mx-auto px-6">
          <p className="label-mono mb-2">{isBg ? 'Правна информация' : 'Legal'}</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-8">
            {isBg ? 'Политика за ' : 'Privacy '}
            <span className="gradient-text">{isBg ? 'поверителност' : 'Policy'}</span>
          </h1>

          <div className="space-y-6 text-slate-700 text-sm leading-relaxed">
            
            <section className="glass-card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">{isBg ? '1. Въведение' : '1. Introduction'}</h2>
              <p>{isBg 
                ? 'Unban Solutions ("ние", "нас", "нашата") е ангажирана със защитата на вашата поверителност. Настоящата Политика за поверителност описва как събираме, използваме, съхраняваме и защитаваме вашите лични данни, когато използвате нашия уебсайт и услуги. Тази политика е в съответствие с Общия регламент за защита на данните (GDPR) и Закона за защита на личните данни на Република България.'
                : 'Unban Solutions ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy describes how we collect, use, store, and protect your personal data when you use our website and services. This policy complies with the General Data Protection Regulation (GDPR) and the Bulgarian Personal Data Protection Act.'}</p>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">{isBg ? '2. Администратор на лични данни' : '2. Data Controller'}</h2>
              <p>{isBg ? 'Администратор на личните данни е:' : 'The Data Controller is:'}</p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li><strong>{isBg ? 'Наименование' : 'Name'}:</strong> Unban Solutions</li>
                <li><strong>{isBg ? 'Адрес' : 'Address'}:</strong> {isBg ? 'гр. София, Шипченски Проход 18' : 'Sofia, Shipchenski Prohod 18'}</li>
                <li><strong>{isBg ? 'ЕИК/БУЛСТАТ' : 'Company ID'}:</strong> {isBg ? '[Вашият ЕИК]' : '[Your Company ID]'}</li>
                <li><strong>{isBg ? 'Имейл' : 'Email'}:</strong> support@unbansolutions.com</li>
                <li><strong>{isBg ? 'Телефон' : 'Phone'}:</strong> 0883 391411</li>
              </ul>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">{isBg ? '3. Какви данни събираме' : '3. What Data We Collect'}</h2>
              <p className="mb-2">{isBg ? 'Събираме следните категории лични данни:' : 'We collect the following categories of personal data:'}</p>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>{isBg ? 'Идентификационни данни' : 'Identification Data'}:</strong> {isBg ? 'Име, фамилия, имейл адрес, телефонен номер' : 'Name, surname, email address, phone number'}</li>
                <li><strong>{isBg ? 'Данни за акаунта' : 'Account Data'}:</strong> {isBg ? 'Потребителско име в социалните мрежи, URL на профила, тип на проблема' : 'Social media username, profile URL, type of issue'}</li>
                <li><strong>{isBg ? 'Технически данни' : 'Technical Data'}:</strong> {isBg ? 'IP адрес, тип браузър, операционна система, устройство' : 'IP address, browser type, operating system, device'}</li>
                <li><strong>{isBg ? 'Данни за комуникация' : 'Communication Data'}:</strong> {isBg ? 'Съобщения, прикачени файлове, кореспонденция' : 'Messages, attachments, correspondence'}</li>
                <li><strong>{isBg ? 'Данни за използване' : 'Usage Data'}:</strong> {isBg ? 'Информация за това как използвате нашия уебсайт и услуги' : 'Information about how you use our website and services'}</li>
              </ul>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">{isBg ? '4. На какво правно основание обработваме данните' : '4. Legal Basis for Processing'}</h2>
              <p className="mb-2">{isBg ? 'Обработваме вашите лични данни на следните правни основания:' : 'We process your personal data on the following legal bases:'}</p>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>{isBg ? 'Изпълнение на договор' : 'Contract Performance'}:</strong> {isBg ? 'Когато предоставяме услугите, които сте заявили' : 'When providing the services you have requested'}</li>
                <li><strong>{isBg ? 'Съгласие' : 'Consent'}:</strong> {isBg ? 'Когато сте ни дали изрично съгласие' : 'When you have given us explicit consent'}</li>
                <li><strong>{isBg ? 'Законов интерес' : 'Legitimate Interest'}:</strong> {isBg ? 'За подобряване на нашите услуги и сигурност' : 'To improve our services and security'}</li>
                <li><strong>{isBg ? 'Законово задължение' : 'Legal Obligation'}:</strong> {isBg ? 'Когато законът изисква това' : 'When required by law'}</li>
              </ul>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">{isBg ? '5. Бисквитки (Cookies)' : '5. Cookies'}</h2>
              <p className="mb-2">{isBg 
                ? 'Нашият уебсайт използва бисквитки. Бисквитката е малък текстов файл, който се съхранява на вашето устройство, когато посещавате уебсайта. Използваме следните видове бисквитки:'
                : 'Our website uses cookies. A cookie is a small text file stored on your device when you visit the website. We use the following types of cookies:'}</p>
              <ul className="space-y-2 list-disc list-inside">
                <li><strong>{isBg ? 'Необходими бисквитки' : 'Essential Cookies'}:</strong> {isBg ? 'Задължителни за работата на уебсайта' : 'Required for the website to function'}</li>
                <li><strong>{isBg ? 'Аналитични бисквитки' : 'Analytics Cookies'}:</strong> {isBg ? 'Google Analytics за анализ на трафика' : 'Google Analytics for traffic analysis'}</li>
                <li><strong>{isBg ? 'Маркетингови бисквитки' : 'Marketing Cookies'}:</strong> {isBg ? 'Facebook Pixel за рекламни цели' : 'Facebook Pixel for advertising purposes'}</li>
              </ul>
              <p className="mt-2">{isBg 
                ? 'Можете да управлявате предпочитанията си за бисквитки чрез банера за съгласие, който се показва при първо посещение.'
                : 'You can manage your cookie preferences through the consent banner shown on first visit.'}</p>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">{isBg ? '6. Вашите права' : '6. Your Rights'}</h2>
              <p className="mb-2">{isBg ? 'Съгласно GDPR, имате следните права:' : 'Under GDPR, you have the following rights:'}</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>{isBg ? 'Право на достъп до вашите лични данни' : 'Right to access your personal data'}</li>
                <li>{isBg ? 'Право на корекция на неточни данни' : 'Right to rectification of inaccurate data'}</li>
                <li>{isBg ? 'Право на изтриване („право да бъдеш забравен")' : 'Right to erasure ("right to be forgotten")'}</li>
                <li>{isBg ? 'Право на ограничаване на обработката' : 'Right to restrict processing'}</li>
                <li>{isBg ? 'Право на преносимост на данни' : 'Right to data portability'}</li>
                <li>{isBg ? 'Право на възражение срещу обработката' : 'Right to object to processing'}</li>
                <li>{isBg ? 'Право да оттеглите съгласието си по всяко време' : 'Right to withdraw consent at any time'}</li>
              </ul>
              <p className="mt-2">{isBg 
                ? 'За упражняване на вашите права, моля свържете се с нас на support@unbansolutions.com'
                : 'To exercise your rights, please contact us at support@unbansolutions.com'}</p>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">{isBg ? '7. Сигурност на данните' : '7. Data Security'}</h2>
              <p>{isBg 
                ? 'Прилагаме подходящи технически и организационни мерки за защита на вашите лични данни: SSL криптиране, защитени сървъри, ограничен достъп до данни, редовно обновяване на системите.'
                : 'We implement appropriate technical and organizational measures to protect your personal data: SSL encryption, secure servers, restricted data access, regular system updates.'}</p>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">{isBg ? '8. Срок за съхранение' : '8. Retention Period'}</h2>
              <p>{isBg 
                ? 'Съхраняваме вашите лични данни за период от 5 години след приключване на нашите услуги, освен ако законът не изисква по-дълъг срок. След това данните се изтриват или анонимизират.'
                : 'We retain your personal data for a period of 5 years after completion of our services, unless the law requires a longer period. After that, data is deleted or anonymized.'}</p>
            </section>

            <section className="glass-card p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-3">{isBg ? '9. Контакт' : '9. Contact'}</h2>
              <p className="mb-2">{isBg ? 'За въпроси относно поверителността:' : 'For privacy questions:'}</p>
              <ul className="space-y-1 list-disc list-inside">
                <li><strong>{isBg ? 'Имейл' : 'Email'}:</strong> support@unbansolutions.com</li>
                <li><strong>{isBg ? 'Телефон' : 'Phone'}:</strong> 0883 391411</li>
                <li><strong>{isBg ? 'Адрес' : 'Address'}:</strong> {isBg ? 'гр. София, Шипченски Проход 18' : 'Sofia, Shipchenski Prohod 18'}</li>
              </ul>
              <p className="mt-2">{isBg 
                ? 'Имате право да подадете жалба до Комисията за защита на личните данни (КЗЛД) на Република България.'
                : 'You have the right to lodge a complaint with the Commission for Personal Data Protection (CPDP) of the Republic of Bulgaria.'}</p>
            </section>

            <p className="text-slate-500 text-xs pt-4">{isBg ? 'Последна актуализация: Юли 2025' : 'Last updated: July 2025'}</p>
          </div>
        </div>
      </main>
    </>
  );
}
