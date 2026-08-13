import { useLanguage } from '@/contexts/LanguageContext';
import { RISK_LABELS, type Sanction } from '@/data/reference';

export default function RiskBadge({ risk }: { risk: Sanction['risk'] }) {
  const { lang } = useLanguage();
  const tone =
    risk === 3
      ? 'border-rose-200 bg-rose-50 text-rose-700'
      : risk === 2
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-slate-200 bg-slate-50 text-slate-600';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${tone}`}>
      <span aria-hidden="true">{'▲'.repeat(risk)}</span>
      {RISK_LABELS[lang][risk]}
    </span>
  );
}
