const BG_MONTHS = [
  'януари', 'февруари', 'март', 'април', 'май', 'юни',
  'юли', 'август', 'септември', 'октомври', 'ноември', 'декември',
];
const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function formatDate(isoDate: string, lang: 'bg' | 'en'): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  if (!year || !month || !day) return isoDate;
  return lang === 'bg'
    ? `${day} ${BG_MONTHS[month - 1]} ${year} г.`
    : `${EN_MONTHS[month - 1]} ${day}, ${year}`;
}
