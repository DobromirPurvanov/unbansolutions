// Справочните данни живеят като JSON, за да ги четат и React страниците, и
// scripts/prerender.mjs (Node не може да импортира TS). Този модул е мястото,
// където JSON-ът получава типове.
import sanctionsJson from '@/data/reference/sanctions.json';

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

export const sanctionsReference = sanctionsJson as SanctionsReference;

export const RISK_LABELS: Record<Sanction['risk'], string> = {
  1: 'Ограничава растежа',
  2: 'Ескалира при повторяемост',
  3: 'Загуба на достъп или приходи',
};
