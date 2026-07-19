import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';

export default function Terms() {
  const { lang, t } = useLanguage();
  const isBg = lang === 'bg';
  const sections = isBg ? [
    ['1. Обхват', 'Тези условия уреждат използването на сайта и услугите по оценка, подготовка на документи, обжалвания и консултиране във връзка с дигитални акаунти.'],
    ['2. Възлагане', 'Изпращането на формата е запитване, а не автоматично сключване на договор. Конкретна услуга се възлага след писмено потвърждение на обхват, цена, срок и условия.'],
    ['3. Без обещание за решение', 'Unban Solutions е независим доставчик и не е част от Instagram, Meta, TikTok, Google, YouTube или друга платформа. Крайното решение се взема единствено от съответната платформа и конкретен резултат не се гарантира.'],
    ['4. Задължения на клиента', 'Клиентът предоставя точна и законосъобразно притежавана информация, съдейства своевременно и не възлага действия за чужд акаунт без право или за заобикаляне на правила и закон.'],
    ['5. Цена и плащане', 'Цената, включените действия и начинът на плащане са посочени в писмената оферта. Допълнителна работа се извършва само след предварително съгласуване.'],
    ['6. Отказ и възстановяване', 'Правата на потребителите при договор от разстояние, включително 14-дневният срок за отказ, се прилагат според закона. Ако клиентът изрично поиска работата да започне преди изтичането му, при отказ може да се дължи пропорционална сума за извършеното. Подробностите са в страницата „Плащания и възстановявания“.'],
    ['7. Поверителност и данни', 'Информацията по казуса се използва за оценка и изпълнение на услугата и се обработва съгласно Политиката за поверителност. Клиентът не трябва да изпраща пароли или кодове за двуфакторна автентикация.'],
    ['8. Отговорност', 'Страните отговарят за действително причинени и предвидими вреди според приложимия закон. Нищо в тези условия не ограничава права или отговорност, които не могат да бъдат ограничени по закон.'],
    ['9. Прекратяване', 'Всяка страна може да прекрати при съществено нарушение. Дължимите суми за вече извършена работа и задълженията за поверителност остават приложими.'],
    ['10. Приложимо право и спорове', 'Прилага се българското право, без да се отнема задължителната защита на потребителя по правото на неговата държава. Споровете първо се решават чрез добросъвестни преговори, а след това от компетентния орган.'],
  ] : [
    ['1. Scope', 'These terms govern use of the website and services for assessment, document preparation, appeals and advice relating to digital accounts.'],
    ['2. Engagement', 'Submitting the form is an inquiry, not an automatic contract. A service is engaged after written confirmation of scope, price, timing and terms.'],
    ['3. No promise of a platform decision', 'Unban Solutions is an independent provider and is not part of Instagram, Meta, TikTok, Google, YouTube or any other platform. The relevant platform makes the final decision and no specific outcome is guaranteed.'],
    ['4. Client duties', 'The client provides accurate, lawfully held information, cooperates promptly and does not request action on another person’s account without authority or to circumvent rules or law.'],
    ['5. Price and payment', 'The price, included work and payment method are set out in the written offer. Additional work is performed only after prior agreement.'],
    ['6. Withdrawal and refunds', 'Consumer rights for distance contracts, including the 14-day withdrawal period, apply according to law. If the client expressly asks for work to start early, a proportionate amount for work performed may be due upon withdrawal. Details are on the Payments and Refunds page.'],
    ['7. Confidentiality and data', 'Case information is used to assess and deliver the service and is processed under the Privacy Policy. Clients must not send passwords or two-factor authentication codes.'],
    ['8. Liability', 'The parties are responsible for actual and foreseeable loss under applicable law. Nothing in these terms limits rights or liability that cannot legally be limited.'],
    ['9. Termination', 'Either party may terminate for material breach. Amounts due for completed work and confidentiality duties remain applicable.'],
    ['10. Governing law and disputes', 'Bulgarian law applies without removing mandatory consumer protection under the law of the consumer’s country. Disputes should first be addressed through good-faith negotiation and then by the competent authority.'],
  ];

  return (
    <>
      <SEOMeta title={`${t('leg.terms')}${t('leg.termsSpan')} | Unban Solutions`} description={isBg ? 'Условия за използване на сайта и възлагане на услуги.' : 'Terms for using the website and engaging services.'} canonical="https://www.unbansolutions.com/terms" />
      <main className="min-h-[100dvh] pt-24 pb-12 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-[760px] mx-auto px-6">
          <p className="label-mono mb-2">{t('leg.label')}</p>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">{t('leg.terms')}<span className="gradient-text">{t('leg.termsSpan')}</span></h1>
          <p className="text-slate-600 text-sm mb-8">{t('leg.date')}</p>
          <div className="space-y-4 text-slate-800 text-sm leading-relaxed">
            {sections.map(([title, text]) => <section key={title} className="glass-card p-5"><h2 className="text-slate-900 text-base font-bold mb-2">{title}</h2><p>{text}</p></section>)}
            <section className="glass-card p-5"><h2 className="text-slate-900 text-base font-bold mb-2">{isBg ? '11. Контакт' : '11. Contact'}</h2><p><a className="text-blue-700 underline" href="mailto:support@unbansolutions.com">support@unbansolutions.com</a> · <Link className="text-blue-700 underline" to="/payments-and-refunds">{isBg ? 'Плащания и възстановявания' : 'Payments and refunds'}</Link></p></section>
          </div>
        </div>
      </main>
    </>
  );
}
