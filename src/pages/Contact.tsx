import { useCallback, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  FileImage,
  LockKeyhole,
  Mail,
  MapPin,
  Paperclip,
  Phone,
  Send,
  ShieldCheck,
  Upload,
  X,
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import { trackEvent } from '@/lib/analytics';

interface FormData {
  name: string;
  email: string;
  platforms: string[];
  issue: string;
  message: string;
  files: File[];
  _gotcha: string;
}

interface SelectOption {
  value: string;
  label: string;
}

const ISSUE_VALUES = ['banned', 'suspended', 'shadowban', 'restricted', 'hacked', 'other'];
const PLATFORM_VALUES = ['instagram', 'tiktok', 'youtube', 'x', 'facebook', 'linkedin', 'other'];

function getEnglishSubmitError(status: number) {
  if (status === 400) return 'Please check the fields and attachments, then try again.';
  if (status === 403) return 'This request could not be verified. Please refresh the page and try again.';
  if (status === 413) return 'The selected files are too large.';
  if (status === 415) return 'The submitted form or attachment format is not supported.';
  if (status === 429) return 'Too many attempts. Please wait a moment and try again.';
  if (status === 502) return 'The email service could not send your message. Please try again or call us.';
  if (status === 503) return 'The form is temporarily unavailable. Please contact us by phone or email.';
  return 'Unable to send your case. Please try again.';
}

export default function Contact() {
  const { t, lang } = useLanguage();
  const isBg = lang === 'bg';
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const hasTrackedStart = useRef(false);

  const routeState = location.state as { issue?: string; platform?: string } | null;
  const requestedIssue = routeState?.issue || '';
  const requestedPlatform = routeState?.platform || '';
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [stepError, setStepError] = useState('');
  const [fileError, setFileError] = useState('');
  const [formData, setFormData] = useState<FormData>(() => ({
    name: '',
    email: '',
    platforms: PLATFORM_VALUES.includes(requestedPlatform) ? [requestedPlatform] : [],
    issue: ISSUE_VALUES.includes(requestedIssue) ? requestedIssue : '',
    message: '',
    files: [],
    _gotcha: '',
  }));

  const platformOptions: SelectOption[] = [
    { value: 'instagram', label: t('cp.form.platformO1') },
    { value: 'tiktok', label: t('cp.form.platformO2') },
    { value: 'youtube', label: t('cp.form.platformO3') },
    { value: 'x', label: t('cp.form.platformO4') },
    { value: 'facebook', label: t('cp.form.platformO5') },
    { value: 'linkedin', label: t('cp.form.platformO6') },
    { value: 'other', label: t('cp.form.platformO7') },
  ];

  const issueOptions: SelectOption[] = [
    { value: 'banned', label: t('cp.form.issueO1') },
    { value: 'suspended', label: t('cp.form.issueO2') },
    { value: 'shadowban', label: t('cp.form.issueO3') },
    { value: 'restricted', label: t('cp.form.issueO4') },
    { value: 'hacked', label: t('cp.form.issueO5') },
    { value: 'other', label: t('cp.form.issueO6') },
  ];

  const contactInfo = [
    { icon: Mail, label: t('cp.info.email'), value: t('cp.info.emailVal'), href: 'mailto:support@unbansolutions.com' },
    { icon: Phone, label: t('cp.info.phone'), value: t('cp.info.phoneVal'), href: 'tel:+359883391411' },
    { icon: MapPin, label: t('cp.info.address'), value: `${t('cp.info.addrVal')}\n${t('cp.info.addrVal2')}` },
    { icon: Clock, label: t('cp.info.availability'), value: `${t('cp.info.availVal')}\n${t('cp.info.availVal2')}` },
  ];

  const markFormStarted = () => {
    if (hasTrackedStart.current) return;
    hasTrackedStart.current = true;
    trackEvent('contact_form_started');
  };

  const focusStepHeading = () => {
    window.requestAnimationFrame(() => stepHeadingRef.current?.focus());
  };

  const handleNextStep = () => {
    markFormStarted();
    if (formData.platforms.length === 0) {
      setStepError(isBg ? 'Изберете поне една платформа.' : 'Select at least one platform.');
      return;
    }
    if (!formData.issue) {
      setStepError(isBg ? 'Изберете какъв е проблемът.' : 'Select the issue you are experiencing.');
      return;
    }

    setStepError('');
    setFormStep(2);
    trackEvent('contact_form_step_completed', { step: 1 });
    focusStepHeading();
  };

  const handlePreviousStep = () => {
    setSubmitError('');
    setFormStep(1);
    focusStepHeading();
  };

  const togglePlatform = (value: string) => {
    markFormStarted();
    setStepError('');
    setFormData((current) => ({
      ...current,
      platforms: current.platforms.includes(value)
        ? current.platforms.filter((platform) => platform !== value)
        : [...current.platforms, value],
    }));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    markFormStarted();
    setFormData((current) => ({ ...current, [event.target.name]: event.target.value }));
    if (event.target.name === 'issue') setStepError('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (formStep === 1) {
      handleNextStep();
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = new FormData();
      const selectedPlatforms = platformOptions
        .filter((option) => formData.platforms.includes(option.value))
        .map((option) => option.label);
      const selectedIssue = issueOptions.find((option) => option.value === formData.issue)?.label || formData.issue;

      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('platforms', selectedPlatforms.join(', '));
      payload.append('issue', selectedIssue);
      payload.append('message', formData.message);
      payload.append('_gotcha', formData._gotcha);
      formData.files.forEach((file) => payload.append('attachments', file));

      const response = await fetch('/api/contact', { method: 'POST', body: payload });
      const contentType = response.headers.get('content-type');
      let result: { error?: string; success?: boolean } = {};

      if (contentType?.includes('application/json')) {
        result = await response.json();
      } else {
        await response.text();
        throw new Error(isBg
          ? 'Сървърът не отговори правилно. Моля, опитайте отново.'
          : 'The server did not respond correctly. Please try again.');
      }

      if (!response.ok) {
        throw new Error(isBg ? (result.error || 'Грешка при изпращане.') : getEnglishSubmitError(response.status));
      }

      trackEvent('contact_form_submitted', {}, 'Lead');
      setIsSubmitted(true);
      focusStepHeading();
    } catch (error: unknown) {
      trackEvent('contact_form_failed', { reason: 'request_error' });
      setSubmitError(error instanceof Error
        ? error.message
        : (isBg ? 'Грешка при изпращане. Опитайте отново.' : 'Unable to send your case. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateFile = (file: File) => {
    if (file.size > 3 * 1024 * 1024) return false;
    return ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'].includes(file.type);
  };

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const incoming = Array.from(newFiles);
    const validFiles = incoming.filter(validateFile);

    if (validFiles.length !== incoming.length) {
      setFileError(isBg
        ? 'Позволени са JPG, PNG, GIF, WebP и PDF файлове до 3 MB.'
        : 'JPG, PNG, GIF, WebP and PDF files up to 3 MB are allowed.');
    } else {
      setFileError('');
    }

    setFormData((current) => {
      const candidates = [...current.files, ...validFiles];
      const accepted: File[] = [];
      let totalSize = 0;

      for (const file of candidates) {
        if (accepted.length >= 3 || totalSize + file.size > 4 * 1024 * 1024) break;
        accepted.push(file);
        totalSize += file.size;
      }

      if (accepted.length !== candidates.length) {
        setFileError(isBg
          ? 'Можете да прикачите до 3 файла с общ размер до 4 MB.'
          : 'You can attach up to 3 files with a combined size of 4 MB.');
      }
      return { ...current, files: accepted };
    });
  }, [isBg]);

  const removeFile = (index: number) => {
    setFormData((current) => ({
      ...current,
      files: current.files.filter((_, fileIndex) => fileIndex !== index),
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const activeStep = isSubmitted ? 3 : formStep;
  const progressLabels = isBg
    ? ['Казус', 'Контакт', 'Оценка']
    : ['Case', 'Contact', 'Assessment'];

  return (
    <>
      <SEOMeta
        title={isBg ? 'Контакт и безплатна първоначална оценка | Unban Solutions' : 'Contact and initial assessment | Unban Solutions'}
        description={isBg
          ? 'Опишете проблема с вашия акаунт и изпратете нужните доказателства чрез защитената форма. Ще получите ясна първоначална оценка на казуса.'
          : 'Describe your account issue and send the necessary evidence through the protected form for a clear initial assessment.'}
        keywords="контакт unban solutions, безплатна оценка акаунт, помогнете instagram бан, възстановяване профил"
        canonical="https://www.unbansolutions.com/contact"
      />

      <main>
        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-slate-50 via-white to-violet-50/70 pt-24 pb-7 sm:pt-28 sm:pb-9">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-200/35 blur-[90px]" aria-hidden="true" />
          <div className="mx-auto max-w-5xl px-5 sm:px-6">
            <p className="section-kicker">{t('cp.hero.label')}</p>
            <h1 className="mt-3 max-w-3xl text-[clamp(2.15rem,7vw,3.75rem)] font-extrabold leading-[1.06] tracking-[-0.04em] text-slate-950">
              {t('cp.hero.title')}<span className="gradient-text">{t('cp.hero.titleSpan')}</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">{t('cp.hero.desc')}</p>
            <Link
              to="/pricing"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl border border-violet-200 bg-white/90 px-4 py-2 text-sm font-bold text-slate-900 shadow-sm transition-colors hover:border-violet-300 hover:bg-violet-50"
            >
              <span className="text-violet-700">{isBg ? 'Цени' : 'Pricing'}</span>
              <span aria-hidden="true">·</span>
              <span>100 · 250 · 500 EUR</span>
              <ArrowRight size={15} className="text-violet-700" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className="bg-white py-6 sm:py-10">
          <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.72fr_1.28fr] lg:gap-10">
            <aside className="order-2 lg:order-1">
              <div className="lg:sticky lg:top-24">
                <h2 className="text-xl font-bold text-slate-950 sm:text-2xl">
                  {isBg ? 'Друг начин за връзка' : 'Other ways to reach us'}
                </h2>
                <p className="mt-2 text-base leading-7 text-slate-600">
                  {isBg ? 'За най-точна оценка използвайте формата. Можете да се свържете и директно.' : 'Use the form for the most accurate assessment, or contact us directly.'}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex min-h-20 items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-700 shadow-sm ring-1 ring-slate-200">
                        <item.icon size={18} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-500">{item.label}</p>
                        {item.href ? (
                          <a
                            href={item.href}
                            className="mt-1 block text-base font-semibold text-slate-900 hover:text-blue-700"
                            onClick={() => item.href.startsWith('tel:') && trackEvent('phone_cta_clicked', { location: 'contact_info' }, 'Contact')}
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="mt-1 whitespace-pre-line text-base font-semibold leading-6 text-slate-900">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-slate-900 p-4 text-white">
                  <ShieldCheck size={20} className="mt-0.5 shrink-0 text-sky-300" aria-hidden="true" />
                  <p className="text-sm leading-6 text-slate-200">
                    {isBg
                      ? 'Не изпращайте пароли, резервни кодове или кодове за двуфакторна защита.'
                      : 'Never send passwords, recovery codes or two-factor authentication codes.'}
                  </p>
                </div>
              </div>
            </aside>

            <div className="order-1 lg:order-2">
              <div className="rounded-3xl border border-violet-200/70 bg-white p-4 shadow-[0_20px_60px_rgba(63,47,120,0.11)] sm:p-7">
                <div
                  className="mb-7"
                  role="progressbar"
                  aria-label={isBg ? 'Напредък на оценката' : 'Assessment progress'}
                  aria-valuemin={1}
                  aria-valuemax={3}
                  aria-valuenow={activeStep}
                  aria-valuetext={isBg
                    ? `Стъпка ${activeStep} от 3: ${progressLabels[activeStep - 1]}`
                    : `Step ${activeStep} of 3: ${progressLabels[activeStep - 1]}`}
                >
                  <div className="flex items-center" aria-hidden="true">
                    {[1, 2, 3].map((step, index) => (
                      <div key={step} className="flex flex-1 items-center last:flex-none">
                        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          activeStep >= step ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {activeStep > step ? <Check size={16} /> : step}
                        </span>
                        {index < 2 && (
                          <span className={`mx-2 h-0.5 flex-1 ${activeStep > step ? 'bg-blue-700' : 'bg-slate-200'}`} />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 grid grid-cols-3 text-center text-xs font-semibold text-slate-500">
                    {progressLabels.map((label, index) => (
                      <span key={label} className={activeStep === index + 1 ? 'text-blue-700' : ''}>{label}</span>
                    ))}
                  </div>
                </div>

                {isSubmitted ? (
                  <div className="form-step-enter py-5 text-center sm:py-9">
                    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                      <CheckCircle2 size={32} aria-hidden="true" />
                    </span>
                    <h2 ref={stepHeadingRef} tabIndex={-1} className="mt-5 text-2xl font-bold text-slate-950 focus:outline-none">
                      {t('cp.success.title')}
                    </h2>
                    <p className="mx-auto mt-3 max-w-md text-base leading-7 text-slate-600">{t('cp.success.desc')}</p>
                    <div className="mx-auto mt-6 max-w-md rounded-2xl bg-slate-50 p-4 text-left">
                      <p className="text-sm font-bold text-slate-900">{isBg ? 'Какво следва' : 'What happens next'}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        {isBg
                          ? 'Ще прегледаме информацията и ще се свържем на посочения имейл с първоначална оценка.'
                          : 'We will review the information and contact you by email with an initial assessment.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} noValidate={false}>
                    <div className="sr-only" aria-hidden="true">
                      <label htmlFor="contact-gotcha">Website</label>
                      <input
                        id="contact-gotcha"
                        type="text"
                        name="_gotcha"
                        value={formData._gotcha}
                        onChange={handleChange}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    {formStep === 1 ? (
                      <div className="form-step-enter">
                        <p className="text-sm font-semibold text-blue-700">{isBg ? 'Стъпка 1' : 'Step 1'}</p>
                        <h2 ref={stepHeadingRef} tabIndex={-1} className="mt-1 text-2xl font-bold text-slate-950 focus:outline-none">
                          {isBg ? 'Какво се е случило?' : 'What happened?'}
                        </h2>
                        <p className="mt-2 text-base leading-7 text-slate-600">
                          {isBg ? 'Изберете една или повече платформи и вида на проблема.' : 'Select one or more platforms and the type of issue.'}
                        </p>

                        <fieldset className="mt-6">
                          <legend className="text-sm font-bold text-slate-900">{t('cp.form.platform')}</legend>
                          <p className="mt-1 text-sm text-slate-500">{isBg ? 'Може да изберете повече от една.' : 'You can select more than one.'}</p>
                          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                            {platformOptions.map((option) => {
                              const selected = formData.platforms.includes(option.value);
                              return (
                                <button
                                  key={option.value}
                                  type="button"
                                  onClick={() => togglePlatform(option.value)}
                                  aria-pressed={selected}
                                  className={`flex min-h-12 items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition-colors ${option.value === 'other' ? 'col-span-2 sm:col-span-1' : ''} ${
                                    selected
                                      ? 'border-blue-700 bg-blue-50 text-blue-800'
                                      : 'border-slate-300 bg-white text-slate-700 hover:border-blue-300 hover:bg-slate-50'
                                  }`}
                                >
                                  <span className="truncate">{option.label}</span>
                                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                    selected ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-300 bg-white'
                                  }`}>
                                    {selected && <Check size={13} aria-hidden="true" />}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </fieldset>

                        <div className="mt-6">
                          <label htmlFor="contact-issue" className="text-sm font-bold text-slate-900">{t('cp.form.issue')}</label>
                          <select
                            id="contact-issue"
                            name="issue"
                            value={formData.issue}
                            onChange={handleChange}
                            required
                            className="form-input mt-2 bg-white"
                          >
                            <option value="">{t('cp.form.issueDef')}</option>
                            {issueOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                          </select>
                        </div>

                        {stepError && (
                          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800" role="alert">
                            {stepError}
                          </p>
                        )}

                        <button type="button" onClick={handleNextStep} className="primary-cta mt-6 w-full">
                          {isBg ? 'Продължи към детайлите' : 'Continue to Details'}
                          <ArrowRight size={18} aria-hidden="true" />
                        </button>
                      </div>
                    ) : (
                      <div className="form-step-enter">
                        <p className="text-sm font-semibold text-blue-700">{isBg ? 'Стъпка 2' : 'Step 2'}</p>
                        <h2 ref={stepHeadingRef} tabIndex={-1} className="mt-1 text-2xl font-bold text-slate-950 focus:outline-none">
                          {isBg ? 'Къде да изпратим оценката?' : 'Where should we send the assessment?'}
                        </h2>
                        <p className="mt-2 text-base leading-7 text-slate-600">
                          {isBg ? 'Добавете контакт и кратко описание. Файловете са по желание.' : 'Add your contact details and a short description. Files are optional.'}
                        </p>

                        <div className="mt-6 space-y-5">
                          <div>
                            <label htmlFor="contact-name" className="text-sm font-bold text-slate-900">{t('cp.form.name')}</label>
                            <input
                              id="contact-name"
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              minLength={2}
                              maxLength={120}
                              autoComplete="name"
                              className="form-input mt-2"
                              placeholder={t('cp.form.namePh')}
                            />
                          </div>

                          <div>
                            <label htmlFor="contact-email" className="text-sm font-bold text-slate-900">{t('cp.form.email')}</label>
                            <input
                              id="contact-email"
                              type="email"
                              inputMode="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              maxLength={254}
                              autoComplete="email"
                              className="form-input mt-2"
                              placeholder={t('cp.form.emailPh')}
                            />
                          </div>

                          <div>
                            <label htmlFor="contact-message" className="text-sm font-bold text-slate-900">{t('cp.form.message')}</label>
                            <p id="contact-message-help" className="mt-1 text-sm text-slate-500">
                              {isBg ? 'Какво известие получихте и какво вече опитахте?' : 'What notice did you receive and what have you already tried?'}
                            </p>
                            <textarea
                              id="contact-message"
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              required
                              minLength={10}
                              maxLength={5000}
                              rows={5}
                              aria-describedby="contact-message-help"
                              className="form-input mt-2 resize-y"
                              placeholder={t('cp.form.messagePh')}
                            />
                          </div>

                          <details className="group rounded-2xl border border-slate-200 bg-slate-50">
                            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                              <span className="flex items-center gap-2">
                                <Paperclip size={18} className="text-blue-700" aria-hidden="true" />
                                {isBg ? 'Добави снимки или PDF' : 'Add screenshots or a PDF'}
                                <span className="font-normal text-slate-500">({isBg ? 'по желание' : 'optional'})</span>
                              </span>
                              <span className="text-lg text-slate-400 transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                            </summary>
                            <div className="border-t border-slate-200 p-4">
                              <p className="text-sm leading-6 text-slate-600">{t('cp.form.filesDesc')}</p>
                              <button
                                type="button"
                                onDragOver={(event) => { event.preventDefault(); setIsDragOver(true); }}
                                onDragLeave={(event) => { event.preventDefault(); setIsDragOver(false); }}
                                onDrop={(event) => {
                                  event.preventDefault();
                                  setIsDragOver(false);
                                  addFiles(event.dataTransfer.files);
                                }}
                                onClick={() => fileInputRef.current?.click()}
                                className={`mt-3 w-full rounded-xl border-2 border-dashed p-5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                                  isDragOver ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-white hover:border-blue-400'
                                }`}
                              >
                                <Upload size={24} className="mx-auto text-blue-700" aria-hidden="true" />
                                <span className="mt-2 block text-sm font-bold text-slate-800">{t('cp.form.filesBrowse')}</span>
                                <span className="mt-1 block text-xs leading-5 text-slate-500">{t('cp.form.filesMax')}</span>
                              </button>
                              <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                                onChange={(event) => {
                                  addFiles(event.target.files);
                                  event.currentTarget.value = '';
                                }}
                                className="sr-only"
                                tabIndex={-1}
                              />

                              {fileError && <p className="mt-3 text-sm font-medium text-red-700" role="alert">{fileError}</p>}
                              {formData.files.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  {formData.files.map((file, index) => (
                                    <div key={`${file.name}-${index}`} className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2">
                                      <FileImage size={18} className="shrink-0 text-blue-700" aria-hidden="true" />
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-semibold text-slate-800">{file.name}</p>
                                        <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-700"
                                        aria-label={`${t('file.remove')} ${file.name}`}
                                      >
                                        <X size={17} aria-hidden="true" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </details>
                        </div>

                        <div className="mt-5 flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-sm leading-6 text-blue-950">
                          <LockKeyhole size={18} className="mt-0.5 shrink-0 text-blue-700" aria-hidden="true" />
                          <span>{isBg ? 'Използваме данните само за оценка и комуникация по казуса.' : 'We use your information only to assess and communicate about your case.'}</span>
                        </div>

                        {submitError && (
                          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800" role="alert">
                            {submitError}
                          </p>
                        )}

                        <div className="mt-6 grid grid-cols-[auto_1fr] gap-2">
                          <button type="button" onClick={handlePreviousStep} className="secondary-cta px-4" aria-label={isBg ? 'Назад към стъпка 1' : 'Back to step 1'}>
                            <ArrowLeft size={18} aria-hidden="true" />
                            <span className="hidden sm:inline">{isBg ? 'Назад' : 'Back'}</span>
                          </button>
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            aria-busy={isSubmitting}
                            className={`primary-cta w-full ${isSubmitting ? 'cursor-not-allowed opacity-70' : ''}`}
                          >
                            {isSubmitting ? (
                              <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" aria-hidden="true" />
                                {isBg ? 'Изпращане...' : 'Sending...'}
                              </>
                            ) : (
                              <>
                                <Send size={18} aria-hidden="true" />
                                {t('cp.form.submit')}
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
