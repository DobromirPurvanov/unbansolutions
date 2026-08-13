import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const reference = JSON.parse(
  await readFile(new URL('../src/data/reference/sanctions.json', import.meta.url), 'utf8'),
);
const diagnostic = JSON.parse(
  await readFile(new URL('../src/data/reference/diagnostic.json', import.meta.url), 'utf8'),
);
const referenceEn = JSON.parse(
  await readFile(new URL('../src/data/reference/sanctions.en.json', import.meta.url), 'utf8'),
);
const diagnosticEn = JSON.parse(
  await readFile(new URL('../src/data/reference/diagnostic.en.json', import.meta.url), 'utf8'),
);
const guides = {
  organic: JSON.parse(await readFile(new URL('../src/data/reference/rules-organic.json', import.meta.url), 'utf8')),
  ads: JSON.parse(await readFile(new URL('../src/data/reference/rules-ads.json', import.meta.url), 'utf8')),
};
const guidesEn = {
  organic: JSON.parse(await readFile(new URL('../src/data/reference/rules-organic.en.json', import.meta.url), 'utf8')),
  ads: JSON.parse(await readFile(new URL('../src/data/reference/rules-ads.en.json', import.meta.url), 'utf8')),
};

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

test('диагностиката подава платформа и вид казус, за да не се пита втори път', async () => {
  const diagnosticPage = await readFile(new URL('../src/pages/Diagnostic.tsx', import.meta.url), 'utf8');
  const contact = await readFile(new URL('../src/pages/Contact.tsx', import.meta.url), 'utf8');

  // Платформите в диагностиката трябва да са същите стойности като във формата.
  const diagnosticPlatforms = [...diagnosticPage.matchAll(/value: '([a-z]+)', label:/g)].map((m) => m[1]);
  const formPlatforms = contact.match(/const PLATFORM_VALUES = \[([^\]]+)\]/)[1]
    .match(/'([a-z]+)'/g)
    .map((value) => value.replaceAll("'", ''));
  assert.ok(diagnosticPlatforms.length >= 6, 'диагностиката предлага под шест платформи');
  for (const platform of diagnosticPlatforms) {
    assert.ok(formPlatforms.includes(platform), `формата не познава платформа ${platform}`);
  }

  assert.match(diagnosticPage, /state=\{\{ issue: result\.issue, platform \}\}/);
  // При готови отговори формата отваря направо стъпка 2.
  assert.match(contact, /const hasPrefill = PLATFORM_VALUES\.includes\(requestedPlatform\) && ISSUE_VALUES\.includes\(requestedIssue\)/);
  assert.match(contact, /useState<1 \| 2>\(hasPrefill \? 2 : 1\)/);
});

test('двете ръководства са пълни и без обещания за резултат', () => {
  assert.equal(guides.organic.topics.length, 10);
  assert.equal(guides.ads.topics.length, 16);

  for (const guide of Object.values(guides)) {
    assert.ok(guide.slug && guide.metaTitle && guide.metaDescription, `${guide.slug}: липсват мета данни`);
    assert.ok(guide.intro.length >= 1 && guide.closing.steps.length >= 3, `${guide.slug}: липсва увод или закриваща процедура`);

    const ids = new Set();
    for (const topic of guide.topics) {
      assert.ok(!ids.has(topic.id), `${guide.slug}: дублиран id ${topic.id}`);
      ids.add(topic.id);
      assert.ok(topic.restricted.length > 30, `${topic.id}: твърде кратко „какво се ограничава“`);
      assert.ok(topic.avoid.length >= 2, `${topic.id}: под две неща за избягване`);
      assert.ok(topic.instead.length >= 2, `${topic.id}: под две алтернативи`);
      assert.ok(topic.checklist.length >= 2, `${topic.id}: чеклист под два въпроса`);
      assert.ok(topic.example.before && topic.example.after, `${topic.id}: липсва пример преди/след`);
    }

    const text = JSON.stringify(guide).toLowerCase();
    for (const promise of ['гарантираме', 'сигурно одобрение', '100% одобрение']) {
      assert.ok(!text.includes(promise), `${guide.slug}: обещание за резултат — ${promise}`);
    }
  }
});

test('английските ръководства са огледало на българските', () => {
  for (const key of Object.keys(guides)) {
    const source = guides[key];
    const translated = guidesEn[key];
    // Адресът се пази от българския slug — той е в маршрутите и в sitemap-а.
    assert.equal(translated.slug, source.slug, `${key}: разминат slug`);
    assert.deepEqual(
      translated.topics.map((topic) => topic.id),
      source.topics.map((topic) => topic.id),
      `${key}: разминати теми`,
    );
    for (const [index, topic] of translated.topics.entries()) {
      const original = source.topics[index];
      assert.equal(topic.avoid.length, original.avoid.length, `${topic.id}: различен брой „не прави“`);
      assert.equal(topic.instead.length, original.instead.length, `${topic.id}: различен брой алтернативи`);
      assert.equal(topic.checklist.length, original.checklist.length, `${topic.id}: различен чеклист`);
      assert.ok(topic.restricted.length > 30, `${topic.id}: липсва превод на „какво се ограничава“`);
      assert.ok(topic.example.before && topic.example.after, `${topic.id}: непреведен пример`);
    }
    assert.equal(translated.intro.length, source.intro.length, `${key}: различен увод`);
    assert.equal(translated.closing.steps.length, source.closing.steps.length, `${key}: различна закриваща процедура`);
    assert.equal(Boolean(translated.templates), Boolean(source.templates), `${key}: разминати шаблони`);
  }
});

test('ръководствата са вързани в приложението, prerender-а и sitemap-а', async () => {
  const app = await readFile(new URL('../src/App.tsx', import.meta.url), 'utf8');
  const prerender = await readFile(new URL('../scripts/prerender.mjs', import.meta.url), 'utf8');
  const llms = await readFile(new URL('../public/llms.txt', import.meta.url), 'utf8');

  for (const guide of Object.values(guides)) {
    assert.ok(app.includes(`path="/pravila/${guide.slug}"`), `липсва маршрут за ${guide.slug}`);
    assert.ok(llms.includes(`/pravila/${guide.slug}`), `${guide.slug} липсва в llms.txt`);
  }
  assert.match(prerender, /guideStaticHtml/);
  assert.match(prerender, /guideSitemapEntries/);
});

test('английската версия на справочника е огледало на българската', () => {
  assert.deepEqual(
    referenceEn.sanctions.map((sanction) => sanction.id),
    reference.sanctions.map((sanction) => sanction.id),
  );
  for (const [index, sanction] of referenceEn.sanctions.entries()) {
    const source = reference.sanctions[index];
    // Тези стойности управляват логика, а не текст — не се превеждат.
    for (const field of ['path', 'risk', 'issue', 'article']) {
      assert.equal(sanction[field], source[field], `${sanction.id}: разминаване в „${field}“`);
    }
    assert.equal(sanction.firstSteps.length, source.firstSteps.length, `${sanction.id}: различен брой първи стъпки`);
    for (const field of ['title', 'summary', 'looksLike', 'whereToSee', 'causes']) {
      assert.ok(sanction[field]?.length > 10, `${sanction.id}: липсва превод на „${field}“`);
    }
  }
  for (const field of ['statusPlaces', 'reportOutcomes', 'reportSignals', 'reportSop', 'myths', 'strikePaths']) {
    assert.equal(referenceEn[field].length, reference[field].length, `различен брой елементи в „${field}“`);
  }
});

test('английското дърво на диагностиката повтаря структурата на българското', () => {
  assert.equal(diagnosticEn.root, diagnostic.root);
  assert.deepEqual(Object.keys(diagnosticEn.nodes).sort(), Object.keys(diagnostic.nodes).sort());
  for (const [id, node] of Object.entries(diagnosticEn.nodes)) {
    const source = diagnostic.nodes[id];
    assert.equal(node.options.length, source.options.length, `${id}: различен брой отговори`);
    // Разклоненията трябва да водят до същите места, независимо от езика.
    assert.deepEqual(
      node.options.map((option) => option.next ?? option.result),
      source.options.map((option) => option.next ?? option.result),
      `${id}: отговорите водят другаде`,
    );
    for (const option of node.options) {
      assert.ok(option.label && option.detail, `${id}: непреведен отговор`);
    }
  }
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
