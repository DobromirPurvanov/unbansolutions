// Справочните данни живеят като JSON, за да ги четат и React страниците, и
// scripts/prerender.mjs (Node не може да импортира TS). Този модул е мястото,
// където JSON-ът получава типове.
import sanctionsJson from '@/data/reference/sanctions.json';
import sanctionsEnJson from '@/data/reference/sanctions.en.json';
import diagnosticJson from '@/data/reference/diagnostic.json';
import diagnosticEnJson from '@/data/reference/diagnostic.en.json';
import organicRulesJson from '@/data/reference/rules-organic.json';
import adsRulesJson from '@/data/reference/rules-ads.json';

export interface StrikePath {
  id: string;
  name: string;
  scope: string;
  triggers: string;
  escalation: string;
  response: string;
}

/** Стойностите съвпадат с падащото меню „Какъв е проблемът“ в контактната форма. */
export type ContactIssue = 'banned' | 'suspended' | 'shadowban' | 'restricted' | 'hacked' | 'other';

export interface Sanction {
  id: string;
  title: string;
  /** Коя strike пътека натрупва тази санкция. */
  path: string;
  /** 1 = ограничава растежа, 2 = ескалира при повторяемост, 3 = загуба на достъп или приходи. */
  risk: 1 | 2 | 3;
  issue: ContactIssue;
  summary: string;
  looksLike: string;
  whereToSee: string;
  causes: string;
  firstSteps: string[];
  /** Slug на блог статия по темата, ако има такава. */
  article?: string;
}

export interface StatusPlace {
  name: string;
  detail: string;
}

export interface SopStep {
  title: string;
  detail: string;
}

export interface Myth {
  myth: string;
  reality: string;
}

export interface SanctionsReference {
  updated: string;
  strikePaths: StrikePath[];
  sanctions: Sanction[];
  statusPlaces: StatusPlace[];
  reportOutcomes: string[];
  reportSignals: string[];
  reportSop: SopStep[];
  myths: Myth[];
}

/** Езиците на сайта; съвпада с типа в LanguageContext. */
export type ReferenceLang = 'bg' | 'en';

export const sanctionsByLang: Record<ReferenceLang, SanctionsReference> = {
  bg: sanctionsJson as SanctionsReference,
  en: sanctionsEnJson as SanctionsReference,
};

/** Българската версия е каноничната — prerender-ът и схемите се хранят от нея. */
export const sanctionsReference = sanctionsByLang.bg;

export interface DiagnosticOption {
  label: string;
  detail: string;
  /** Следващият въпрос или id на санкция от sanctions.json — винаги едно от двете. */
  next?: string;
  result?: string;
}

export interface DiagnosticNode {
  question: string;
  hint?: string;
  options: DiagnosticOption[];
}

export interface DiagnosticTree {
  root: string;
  nodes: Record<string, DiagnosticNode>;
}

export const diagnosticByLang: Record<ReferenceLang, DiagnosticTree> = {
  bg: diagnosticJson as DiagnosticTree,
  en: diagnosticEnJson as DiagnosticTree,
};

export function findSanction(id: string, lang: ReferenceLang = 'bg'): Sanction | undefined {
  return sanctionsByLang[lang].sanctions.find((sanction) => sanction.id === id);
}

export interface RuleTopic {
  id: string;
  title: string;
  /** Името на политиката, по която платформата преценява темата. */
  standard?: string;
  restricted: string;
  avoid: string[];
  instead: string[];
  example: { before: string; after: string };
  checklist: string[];
}

export interface RulesGuide {
  slug: string;
  updated: string;
  kicker: string;
  title: string;
  lead: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  intro: { title: string; items: string[] }[];
  goldenRule: { title: string; detail: string };
  topics: RuleTopic[];
  templates?: string[];
  closing: { title: string; steps: string[] };
}

export const rulesGuides = {
  organic: organicRulesJson as RulesGuide,
  ads: adsRulesJson as RulesGuide,
};

export type RulesGuideKey = keyof typeof rulesGuides;

export const RISK_LABELS: Record<ReferenceLang, Record<Sanction['risk'], string>> = {
  bg: {
    1: 'Ограничава растежа',
    2: 'Ескалира при повторяемост',
    3: 'Загуба на достъп или приходи',
  },
  en: {
    1: 'Limits growth',
    2: 'Escalates if repeated',
    3: 'Loss of access or revenue',
  },
};
