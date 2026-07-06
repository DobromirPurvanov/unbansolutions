import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import SEOMeta from '@/components/SEOMeta';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, X, Upload, FileImage, ChevronDown } from 'lucide-react';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
    fbq?: (...args: any[]) => void;
  }
}

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
      <label className="block text-slate-700 text-[10px] uppercase tracking-wider mb-1 font-bold">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
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
        <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
          {options.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                  selected.includes(opt)
                    ? 'bg-blue-600 border-blue-600'
                    : 'border-slate-300'
                }`}
                onClick={() => toggleOption(opt)}
              >
                {selected.includes(opt) && (
                  <CheckCircle2 size={10} className="text-white" />
                )}
              </div>
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
  const { t } = useLanguage();

  useEffect(() => {
    if (window.innerWidth < 768) return;
    let ctx: any;
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
  // Анти-бот: кога е заредена формата (ботовете пращат мигновено)
  const [formLoadedAt] = useState(() => Date.now());
  const [submitError, setSubmitError] = useState('');

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
      data.append('_ts', String(formLoadedAt)); // анти-бот времеви печат
      formData.files.forEach((file) => data.append('attachments', file));

      // GA4 + Meta Pixel - begin form submit
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'contact_form_submit', {
          event_category: 'engagement',
          event_label: formData.platforms.join(', ') || 'none',
          platforms_count: formData.platforms.length,
          issue_type: formData.issue || 'none',
          has_attachments: formData.files.length > 0,
          attachments_count: formData.files.length,
        });
      }
      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', 'Lead', {
          content_name: 'Contact Form Submit',
          content_category: formData.issue || 'general',
        });
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        body: data,
      });

      let result;
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

      // GA4 + Meta Pixel - form submit success
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'contact_form_success', {
          event_category: 'conversion',
          event_label: 'contact_submitted',
          value: 1,
        });
      }
      if (typeof window.fbq !== 'undefined') {
        window.fbq('track', 'Lead', { content_name: 'Contact Form Success' });
      }

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', platforms: [], issue: '', message: '', files: [], _gotcha: '' });
      }, 4000);
    } catch (err: any) {
      // GA4 + Meta Pixel - form submit error
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'contact_form_error', {
          event_category: 'error',
          event_label: err.message || 'unknown_error',
        });
      }
      if (typeof window.fbq !== 'undefined') {
        window.fbq('trackCustom', 'FormError', { error: err.message || 'unknown' });
      }
      setSubmitError(err.message || 'Грешка при изпращане. Опитайте отново.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateFile = (file: File): boolean => {
    if (file.size > 10 * 1024 * 1024) return false;
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    return allowed.includes(file.type);
  };

  const addFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return;
    const filesArray = Array.from(newFiles).filter(validateFile);
    setFormData(prev => {
      const combined = [...prev.files, ...filesArray];
      return { ...prev, files: combined.slice(0, 5) };
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
        title={t('cp.hero.label') + ' | Свържете се с нас | Безплатна оценка | Unban Solutions'}
        description="Свържете се с Unban Solutions за безплатна оценка на вашия случай. Възстановяване на баннати акаунти в Instagram, TikTok, YouTube, Facebook."
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
                          <label className="block text-slate-700 text-[10px] uppercase tracking-wider mb-1 font-bold">{t('cp.form.name')}</label>
                          <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-input" placeholder={t('cp.form.namePh')} />
                        </div>
                        <div>
                          <label className="block text-slate-700 text-[10px] uppercase tracking-wider mb-1 font-bold">{t('cp.form.email')}</label>
                          <input type="email" name="email" value={formData.email} onChange={handleChange} required className="form-input" placeholder={t('cp.form.emailPh')} />
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
                          <label className="block text-slate-700 text-[10px] uppercase tracking-wider mb-1 font-bold">{t('cp.form.issue')}</label>
                          <select name="issue" value={formData.issue} onChange={handleChange} required className="form-input bg-transparent">
                            <option value="" className="bg-white">{t('cp.form.issueDef')}</option>
                            {issueOptions.map((i) => (
                              <option key={i} value={i} className="bg-white">{i}</option>
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
                                className="hover:text-red-600 transition-colors"
                              >
                                <X size={10} />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      <div>
                        <label className="block text-slate-700 text-[10px] uppercase tracking-wider mb-1 font-bold">{t('cp.form.message')}</label>
                        <textarea name="message" value={formData.message} onChange={handleChange} required rows={3} className="form-input resize-none" placeholder={t('cp.form.messagePh')} />
                      </div>

                      {/* File Upload */}
                      <div>
                        <label className="block text-slate-700 text-[10px] uppercase tracking-wider mb-1 font-bold">{t('cp.form.files')}</label>
                        <p className="text-slate-600 text-[11px] mb-2">{t('cp.form.filesDesc')}</p>

                        <div
                          onDragOver={handleDragOver}
                          onDragLeave={handleDragLeave}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          className={`cursor-pointer border-2 border-dashed rounded-xl p-4 text-center transition-all ${
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
                          <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/jpeg,image/png,image/gif,image/webp,application/pdf"
                            onChange={(e) => addFiles(e.target.files)}
                            className="hidden"
                          />
                        </div>

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
                                  className="w-5 h-5 rounded-full bg-slate-200 hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0"
                                >
                                  <X size={10} className="text-slate-600 hover:text-red-600" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {submitError && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                          {submitError}
                        </div>
                      )}
                      <button type="submit" disabled={isSubmitting} className={`w-full glow-btn flex items-center justify-center gap-2 text-xs py-2.5 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}>
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
