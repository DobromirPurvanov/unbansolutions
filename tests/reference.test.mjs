import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const reference = JSON.parse(
  await readFile(new URL('../src/data/reference/sanctions.json', import.meta.url), 'utf8'),
);
const diagnostic = JSON.parse(
  await readFile(new URL('../src/data/reference/diagnostic.json', import.meta.url), 'utf8'),
);

// Съвпада с падащото меню „Какъв е проблемът“ в контактната форма.
const ISSUE_VALUES = ['banned', 'suspended', 'shadowban', 'restricted', 'hacked', 'other'];

test('всяка санкция е попълнена докрай', () => {
  assert.equal(reference.sanctions.length, 12);
  const ids = new Set();
  const pathIds = new Set(reference.strikePaths.map((path) => path.id));

  for (const sanction of reference.sanctions) {
    assert.ok(!ids.has(sanction.id), `дублиран id: ${sanction.id}`);
    ids.add(sanction.id);
    assert.ok(pathIds.has(sanction.path), `${sanction.id}: непозната strike пътека`);
    assert.ok(ISSUE_VALUES.includes(sanction.issue), `${sanction.id}: непознат тип казус`);
    assert.ok([1, 2, 3].includes(sanction.risk), `${sanction.id}: нивото на риск е извън 1–3`);
    for (const field of ['title', 'summary', 'looksLike', 'whereToSee', 'causes']) {
      assert.ok(sanction[field]?.length > 10, `${sanction.id}: липсва или е твърде кратко „${field}“`);
    }
    assert.ok(sanction.firstSteps.length >= 3, `${sanction.id}: под три първи стъпки`);
  }
});

test('връзките към блога сочат към съществуващи статии', async () => {
  const slugs = new Set(
    (await readdir(new URL('../content/blog/', import.meta.url)))
      .filter((file) => file.endsWith('.md'))
      .map((file) => file.replace(/\.md$/, '')),
  );
  for (const sanction of reference.sanctions) {
    if (!sanction.article) continue;
    assert.ok(slugs.has(sanction.article), `${sanction.id}: сочи към несъществуваща статия`);
  }
});

test('справочникът не обещава резултат от платформата', () => {
  const text = JSON.stringify(reference).toLowerCase();
  for (const promise of ['гарантира', 'гарантирано', '100%', 'сигурно възстановяв']) {
    assert.ok(!text.includes(promise), `справочникът съдържа обещание: ${promise}`);
  }
});

test('дървото на диагностиката води до реални санкции и покрива всичките 12', () => {
  const sanctionIds = new Set(reference.sanctions.map((sanction) => sanction.id));
  const reachable = new Set();
  assert.ok(diagnostic.nodes[diagnostic.root], 'коренът сочи към несъществуващ въпрос');

  for (const [id, node] of Object.entries(diagnostic.nodes)) {
    assert.ok(node.question?.length > 5, `${id}: липсва въпрос`);
    assert.ok(node.options.length >= 2, `${id}: под два отговора`);
    for (const option of node.options) {
      assert.ok(option.label && option.detail, `${id}: отговор без текст или пояснение`);
      assert.ok(
        Boolean(option.next) !== Boolean(option.result),
        `${id} → ${option.label}: отговорът трябва да води или към следващ въпрос, или към санкция`,
      );
      if (option.next) assert.ok(diagnostic.nodes[option.next], `${id}: сочи към несъществуващ въпрос ${option.next}`);
      if (option.result) {
        assert.ok(sanctionIds.has(option.result), `${id}: сочи към несъществуваща санкция ${option.result}`);
        reachable.add(option.result);
      }
    }
  }

  // Диагностиката е входната точка към справочника — всяка санкция трябва да е достижима.
  for (const id of sanctionIds) assert.ok(reachable.has(id), `санкцията ${id} не се достига от диагностиката`);
});

test('диагностиката не праща данни за казуса към аналитиката', async () => {
  const page = await readFile(new URL('../src/pages/Diagnostic.tsx', import.meta.url), 'utf8');
  const events = [...page.matchAll(/trackEvent\(([^)]*)\)/g)].map((match) => match[1]);
  assert.ok(events.length > 0);
  for (const call of events) {
    assert.doesNotMatch(call, /result|sanction|issue|answer/i, `събитието носи данни за казуса: ${call}`);
  }
  // Типът казус се предава на формата през router state, не през адреса.
  assert.doesNotMatch(page, /\/contact\?(?:issue|platform)=/);
});

test('страницата е вързана в приложението, prerender-а и sitemap-а', async () => {
  const app = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8');
  const navbar = await readFile(new URL('../src/components/Navbar.tsx', import.meta.url), 'utf8');
  const prerender = await readFile(new URL('../scripts/prerender.mjs', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../public/llms.txt', import.meta.url), 'utf8');

  assert.match(app, /path="\/vidove-sanktsii"/);
  assert.match(app, /path="\/diagnostika"/);
  assert.match(navbar, /path: '\/vidove-sanktsii'/);
  // Маршрутът, статичният HTML за ботове и sitemap записът вървят заедно.
  assert.match(prerender, /path: '\/vidove-sanktsii'/);
  assert.match(prerender, /referenceStaticHtml/);
  assert.match(prerender, /loc: `\$\{siteUrl\}\/vidove-sanktsii`/);
  assert.match(prerender, /path: '\/diagnostika'/);
  assert.match(prerender, /diagnosticStaticHtml/);
  assert.match(prerender, /loc: `\$\{siteUrl\}\/diagnostika`/);
  assert.match(llms, /\/vidove-sanktsii/);
  assert.match(llms, /\/diagnostika/);
});
