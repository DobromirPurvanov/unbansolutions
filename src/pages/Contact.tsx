import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, X, Upload, FileImage, ChevronDown } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface FormData {
  name: string;
  email: string;
  platforms: string[];
  issue: string;
  message: string;
  files: File[];
  _gotcha: string; // honeypot field - bots fill this
}

// MultiSelect Dropdown Component
function PlatformMultiSelect({
  options,
  selected,
  onChange,
  label,
  placeholder,
}: {
  options: string[];
  selected: string[];
  onChange: (vals: string[]) => void;
  label: string;
  placeholder: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listboxId = 'contact-platform-options';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  const displayText =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? selected[0]
        : `${selected.length} избрани`;

  return (
    <div ref={dropdownRef} className="relative">
      <span id="contact-platform-label" className="block text-slate-700 text-[10px] uppercase tracking-wider mb-1 font-bold">
        {label}
      </span>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-labelledby="contact-platform-label"
        className={`w-full form-input flex items-center justify-between text-left ${
          selected.length === 0 ? 'text-slate-400' : 'text-slate-800'
        }`}
      >
        <span className="text-xs truncate">{displayText}</span>
        <ChevronDown
          size={14}
          className={`text-slate-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div id={listboxId} role="group" aria-labelledby="contact-platform-label" className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
          {options.map((opt) => (
            <label
              key={opt}
              className="flex min-h-11 items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggleOption(opt)}
                className="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600"
              />
              <span className="text-slate-700 text-xs select-none">{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '', email: '', platforms: [], issue: '', message: '', files: [], _gotcha: ''
  });
  const { t, lang } = useLanguage();
  const isBg = lang === 'bg';

  useEffect(() => {
    if (window.innerWidth < 768 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ctx: { revert: () => void } | undefined;
    const init = async () => {
      const { default: gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from('.contact-anim', { y: 30, duration: 0.6, stagger: 0.08, ease: 'power2.out',
          scrollTrigger: { trigger: ref.current, start: 'top 80%', toggleActions: 'play none none reverse' },
        });
      });
    };
    init();
    return () => { if (ctx) ctx.revert(); };
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [fileError, setFileError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('platforms', formData.platforms.join(', '));
      data.append('issue', formData.issue);
      data.append('message', formData.message);
      data.append('_gotcha', formData._gotcha); // honeypot
      formData.files.forEach((file) => data.append('attachments', file));

      trackEvent('contact_form_started', {
        platforms_count: formData.platforms.length,
        has_attachments: formData.files.length > 0,
      });

      const res = await fetch('/api/contact', {
        method: 'POST',
        body: data,
      });

      let result: { error?: string; success?: boolean };
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = await res.json();
      } else {
        await res.text();
        throw new Error('Сървърът не отговори правилно. Моля, опитайте отново.');
      }

      if (!res.ok) {
        throw new Error(result.error || 'Грешка при изпращане');
      }

      trackEvent('contact_form_submitted', {
        platforms_count: formData.platforms.length,
        has_attachments: formData.files.length > 0,
      }, 'Lead');

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', platforms: [], issue: '', message: '', files: [], _gotcha: '' });
      }, 4000);
    } catch (err: unknown) {
      trackEvent('contact_form_failed', { reason: err instanceof Error ? 'request_error' : 'unknown_error' });
      setSubmitError(err instanceof Error ? err.message : 'Грешка при изпращане. Опитайте отново.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateFile = (file: File): boolean => {
    if (file.size > 3 * 1024 * 1024) return false;
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    return allowed.includes(file.type);
  };

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const incoming = Array.from(newFiles);
    const filesArray = incoming.filter(validateFile);
    if (filesArray.length !== incoming.length) {
      setFileError('Позволени са JPG, PNG, GIF, WebP и PDF файлове до 3 MB.');
    } else {
      setFileError('');
    }
    setFormData(prev => {
      const combined = [...prev.files, ...filesArray];
      const accepted: File[] = [];
      let total = 0;
      for (const file of combined) {
        if (accepted.length >= 3 || total + file.size > 4 * 1024 * 1024) break;
        accepted.push(file);
        total += file.size;
      }
      if (accepted.length !== combined.length) setFileError('Можете да прикачите до 3 файла с общ размер до 4 MB.');
      return { ...prev, files: accepted };
    });
  }, []);

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const contactInfo = [
    { icon: Mail, label: t('cp.info.email'), value: t('cp.info.emailVal'), href: 'mailto:support@unbansolutions.com' },
    { icon: Phone, label: t('cp.info.phone'), value: t('cp.info.phoneVal'), href: 'tel:0883391411' },
    { icon: MapPin, label: t('cp.info.address'), value: t('cp.info.addrVal') + '\n' + t('cp.info.addrVal2') },
    { icon: Clock, label: t('cp.info.availability'), value: t('cp.info.availVal') + '\n' + t('cp.info.availVal2') },
  ];

  const platformOptions = [
    t('cp.form.platformO1'), t('cp.form.platformO2'), t('cp.form.platformO3'),
    t('cp.form.platformO4'), t('cp.form.platformO5'), t('cp.form.platformO6'), t('cp.form.platformO7'),
  ];

  const issueOptions = [
    t('cp.form.issueO1'), t('cp.form.issueO2'), t('cp.form.issueO3'),
    t('cp.form.issueO4'), t('cp.form.issueO5'), t('cp.form.issueO6'),
  ];

  return (
    <>
      <SEOMeta
        title={isBg ? 'Контакт и безплатна първоначална оценка | Unban Solutions' : 'Contact and initial assessment | Unban Solutions'}
        description={isBg ? 'Опишете проблема с вашия акаунт и изпратете нужните доказателства чрез защитената форма. Ще получите ясна първоначална оценка на казуса.' : 'Describe your account issue and send the necessary evidence through the protected form for a clear initial assessment.'}
        keywords="контакт unban solutions, безплатна оценка акаунт, помогнете instagram бан, възстановяване профил"
        canonical="https://www.unbansolutions.com/contact"
      />
      <main>
        {/* Hero */}
        <section className="relative pt-24 pb-10 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-200/30 rounded-full filter blur-[80px]" />
          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10">
            <p className="label-mono mb-2">{t('cp.hero.label')}</p>
            <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-bold text-slate-900 mb-3">
              {t('cp.hero.title')}<span className="gradient-text">{t('cp.hero.titleSpan')}</span>{t('cp.hero.sub')}
            </h1>
            <p className="text-slate-700 text-sm max-w-[400px]">{t('cp.hero.desc')}</p>
          </div>
        </section>

        {/* Contact Form + Info */}
        <section ref={ref} className="py-10 lg:py-14 bg-gradient-to-b from-white to-slate-50">
          <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
            <div className="grid lg:grid-cols-[1fr_1.3fr] gap-6">
              {/* Contact Info */}
              <div className="contact-anim">
                <h2 className="text-lg font-bold text-slate-900 mb-4">
                  {t('cp.info.title')}<span className="gradient-text">{t('cp.info.titleSpan')}</span>
                </h2>
                <div className="space-y-3 mb-5">
                  {contactInfo.map((item) => (
                    <div key={item.label} className="flex items-start gap-3 glass-card-hover p-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <item.icon size={14} className="text-blue-700" />
                      </div>
                      <div>
                        <p className="text-slate-600 text-[10px] uppercase tracking-wider mb-0.5 font-bold">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-slate-800 text-xs hover:text-blue-700 transition-colors font-medium">{item.value}</a>
                        ) : (
                          <p className="text-slate-800 text-xs whitespace-pre-line font-medium">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="contact-anim">
                <div className="glass-card p-5">
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                        <CheckCircle2 size={24} className="text-blue-700" />
                      </div>
                      <h3 className="text-slate-900 text-base font-bold mb-1">{t('cp.success.title')}</h3>
                      <p className="text-slate-700 text-xs">{t('cp.success.desc')}</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      {/* Honeypot field - hidden from humans, traps bots */}
                      <div style={{ position: 'absolute', left: '-9999px', opacity: 0 }}>
                        <input
                          type="text"
                          name="_gotcha"
                          value={formData._gotcha}
                          onChange={handleChange}
                          tabIndex={-1}
                          autoComplete="off"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="contact-name" className="block text-slate-700 text-[10px] uppercase tracking-wider mb-1 font-bold">{t('cp.form.name')}</label>
                          <input id="contact-name" type="text" name="name" value={formData.name} onChange={handleChange} required minLength={2} maxLength={120} autoComplete="name" className="form-input" placeholder={t('cp.form.namePh')} />
                        </div>
                        <div>
                          <label htmlFor="contact-email" className="block text-slate-700 text-[10px] uppercase tracking-wider mb-1 font-bold">{t('cp.form.email')}</label>
                          <input id="contact-email" type="email" name="email" value={formData.email} onChange={handleChange} required maxLength={254} autoComplete="email" className="form-input" placeholder={t('cp.form.emailPh')} />
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {/* Platform Multi-Select */}
                        <PlatformMultiSelect
                          options={platformOptions}
                          selected={formData.platforms}
                          onChange={(vals) => setFormData({ ...formData, platforms: vals })}
                          label={t('cp.form.platform')}
                          placeholder={t('cp.form.platformDef')}
                        />
                        <div>
                          <label htmlFor="contact-issue" className="block text-slate-700 text-[10px] uppercase tracking-wider mb-1 font-bold">{t('cp.form.issue')}</label>
                          <select id="contact-issue" name="issue" value={formData.issue} onChange={handleChange} required className="form-input bg-transparent">
                            <option value="" className="bg-white">{t('cp.form.issueDef')}</option>
                            {issueOptions.map((i) => (
                              <option key={i} value={i.toLowerCase().replace(/ /g, '')} className="bg-white">{i}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Selected platforms tags */}
                      {formData.platforms.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {formData.platforms.map((p) => (
                            <span key={p} className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-200 rounded-md text-blue-700 text-[11px] font-medium">
                              {p}
                              <button
                                type="button"
                                onClick={() => setFormData({ ...formData, platforms: formData.platforms.filter((pl) => pl !== p) })}
                                className="w-11 h-11 inline-flex items-center justify-center hover:text-red-700 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                aria-label={`Премахни ${p}`}
                              >
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <div>
                        <label htmlFor="contact-message" className="block text-slate-700 text-[10px] uppercase tracking-wider mb-1 font-bold">{t('cp.form.message')}</label>
                        <textarea id="contact-message" name="message" value={formData.message} onChange={handleChange} required minLength={10} maxLength={5000} rows={4} className="form-input resize-y" placeholder={t('cp.form.messagePh')} />
                      </div>

                      {/* File Upload */}
                      <div>
                        <span className="block text-slate-700 text-[10px] uppercase tracking-wider mb-1 font-bold">{t('cp.form.files')}</span>
                        <p className="text-slate-600 text-[11px] mb-2">{t('cp.form.filesDesc')}</p>

                        <button
                          type="button"
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`w-full cursor-pointer border-2 border-dashed rounded-xl p-4 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                            isDragOver
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-slate-300 hover:border-blue-400 bg-slate-50'
                          }`}
                        >
                          <Upload size={24} className="text-blue-600 mx-auto mb-1" />
                          <p className="text-slate-700 text-xs">
                            {t('cp.form.filesDrop')} <span className="text-blue-700 font-bold">{t('cp.form.filesBrowse')}</span>
                          </p>
                          <p className="text-slate-500 text-[10px] mt-0.5">{t('cp.form.filesMax')}</p>
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                          onChange={(e) => addFiles(e.target.files)}
                          className="sr-only"
                          tabIndex={-1}
                        />
                        {fileError && <p className="mt-2 text-xs text-red-700" role="alert">{fileError}</p>}

                        {/* Selected Files */}
                        {formData.files.length > 0 && (
                          <div className="mt-2 space-y-1.5">
                            <p className="text-slate-700 text-[11px] font-bold">
                              {formData.files.length} {t('file.selected')}
                            </p>
                            {formData.files.map((file, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                                <FileImage size={14} className="text-blue-600 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-slate-800 text-[11px] font-medium truncate">{file.name}</p>
                                  <p className="text-slate-500 text-[10px]">{formatFileSize(file.size)}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                                  className="w-11 h-11 rounded-full bg-slate-200 hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                                  aria-label={`Премахни ${file.name}`}
                                >
                                  <X size={10} className="text-slate-600 hover:text-red-600" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {submitError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs" role="alert">
                          {submitError}
                        </div>
                      )}
                      <button type="submit" disabled={isSubmitting} aria-busy={isSubmitting} className={`w-full min-h-11 glow-btn flex items-center justify-center gap-2 text-xs py-2.5 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
                        {isSubmitting ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Изпращане...</span>
                          </>
                        ) : (
                          <>
                            <Send size={12} /><span>{t('cp.form.submit')}</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Emergency */}
        <section className="py-6 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-[1000px] mx-auto px-6 lg:px-10">
            <div className="glass-card p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-blue-100/50 rounded-full filter blur-[40px]" />
              <div className="relative flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h3 className="text-slate-900 text-sm font-bold mb-0.5">{t('cp.emergency.title')}</h3>
                  <p className="text-slate-700 text-xs">{t('cp.emergency.desc')}</p>
                </div>
                <a href="tel:0883391411" className="glow-btn flex items-center gap-2 whitespace-nowrap text-xs py-2.5 px-5">
                  <Phone size={12} /><span>{t('cp.emergency.btn')}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
