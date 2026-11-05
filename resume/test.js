/* node test.js — content rules, shareable URLs, vCard, rendered remixes. */
const assert = require('assert');
const CFG = require('./site.config');
const CONTENT = require('./content');
const { vcard } = require('./vcard');
const RS = require('./state');
const R = require('./render');

const catalog = { moduleIds: CONTENT.moduleIds, presets: CONTENT.presets };
const data = Object.assign({}, CONTENT, {
  siteTitle: CFG.siteTitle,
  hubUrl: CFG.hubUrl,
  person: CFG.person,
  qrSvg: '<svg></svg>'
});

function eq(a, b, msg) {
  assert.deepStrictEqual(a, b, msg || JSON.stringify(a) + ' !== ' + JSON.stringify(b));
}

assert.deepStrictEqual(CONTENT.remixes.map(function (r) { return r.id; }), ['general', 'ai', 'freelance']);
assert.deepStrictEqual(CONTENT.remixes.map(function (r) { return r.label; }), ['General', 'AI trainer', 'Business owner / freelancer']);
assert.strictEqual(CONTENT.remixes.length, 3);

CONTENT.moduleIds.forEach(function (id) {
  const mod = CONTENT.modules.find(function (m) { return m.id === id; });
  assert.ok(mod.variants.full, id + ' needs a full variant for the CV view');
  ['general', 'ai', 'freelance'].forEach(function (remix) {
    const key = CONTENT.variantMap[id][remix];
    assert.ok(mod.variants[key], id + ' ' + remix + ' missing variant ' + key);
  });
});

Object.keys(CONTENT.presets).forEach(function (name) {
  let last = -1;
  CONTENT.presets[name].forEach(function (id) {
    const i = CONTENT.moduleIds.indexOf(id);
    assert.ok(i > last, name + ' preset is out of module order at ' + id);
    last = i;
  });
});

assert.ok(!CONTENT.presets.general.includes('exp-cs'));
assert.ok(!CONTENT.presets.general.includes('clinical'));
assert.ok(!CONTENT.presets.ai.includes('exp-cs'));
assert.ok(!CONTENT.presets.ai.includes('clinical'));
assert.ok(!CONTENT.presets.ai.includes('skills-ops'));
assert.ok(CONTENT.presets.ai.includes('projects'));
assert.ok(CONTENT.presets.freelance.includes('exp-cs'));
assert.ok(CONTENT.presets.freelance.includes('projects'));
assert.ok(CONTENT.presets.freelance.includes('skills-ops'));
assert.ok(CONTENT.presets.freelance.includes('exp-ai'));
assert.ok(!CONTENT.presets.freelance.includes('clinical'));
assert.ok(!CONTENT.presets.freelance.includes('skills-ai'));
assert.strictEqual(CONTENT.variantMap.projects.ai, 'light');
assert.strictEqual(CONTENT.variantMap.projects.general, 'light');
assert.strictEqual(CONTENT.variantMap.projects.freelance, 'full');
assert.strictEqual(CONTENT.variantMap['exp-ai'].freelance, 'supporting');
assert.strictEqual(CONTENT.variantMap['exp-cs'].freelance, 'select');

const general = RS.parseState('', catalog);
eq(general, { view: 'resume', remix: 'general', on: CONTENT.presets.general });
assert.strictEqual(RS.serializeState(general, catalog), '');

const ai = RS.parseState('?remix=ai', catalog);
eq(ai.on, CONTENT.presets.ai);
assert.strictEqual(RS.serializeState(ai, catalog), 'remix=ai');

const custom = { view: 'resume', remix: 'ai', on: ['summary', 'exp-ai', 'exp-cs', 'education'] };
const customQs = RS.serializeState(custom, catalog);
eq(RS.parseState('?' + customQs, catalog), custom);

const cv = RS.parseState('?view=cv', catalog);
assert.strictEqual(cv.view, 'cv');
eq(cv.on, CONTENT.moduleIds);
assert.strictEqual(RS.serializeState(cv, catalog), 'view=cv');

const cvCut = { view: 'cv', remix: 'general', on: ['summary', 'education'] };
eq(RS.parseState('?' + RS.serializeState(cvCut, catalog), catalog).on, cvCut.on);
assert.ok(RS.serializeState(cvCut, catalog).indexOf('view=cv') !== -1);

const junk = RS.parseState('?remix=chef&on=nope,summary', catalog);
eq(junk, { view: 'resume', remix: 'general', on: ['summary'] });
eq(RS.parseState('?remix=ai&on=', catalog).on, []);

const round = RS.parseState('?view=cv&remix=ai', catalog);
assert.strictEqual(round.view, 'cv');
eq(round.on, CONTENT.moduleIds);
assert.strictEqual(RS.serializeState(round, catalog), 'view=cv');

const card = vcard(CFG);
assert.ok(card.startsWith('BEGIN:VCARD\r\n'));
assert.ok(card.endsWith('END:VCARD\r\n'));
['FN:Barry Floore', 'barry.floore@gmail.com', '+1-904-438-1866', '+1-904-600-4423', 'https://linkedin.com/in/mbfloore', 'https://www.bfloore.online', 'Jacksonville'].forEach(function (bit) {
  assert.ok(card.includes(bit), 'vCard missing ' + bit);
});
for (let i = 0; i < card.length; i++) {
  if (card[i] === '\n') assert.strictEqual(card[i - 1], '\r');
  if (card[i] === '\r') assert.strictEqual(card[i + 1], '\n');
}
assert.ok(!/password|secret|api[_-]?key/i.test(card));

function htmlFor(search) {
  const state = RS.parseState(search, catalog);
  return R.sectionsHtml(data, state);
}

const gHtml = htmlFor('');
assert.ok(gHtml.includes('independent operator of personal brands'));
assert.ok(gHtml.includes('Handshake AI'));
assert.ok(gHtml.includes('Sigma Theta Tau'));
assert.ok(gHtml.includes('Safety labeling and moderation'));
assert.ok(!gHtml.includes('Baptist Health'));
assert.ok(!gHtml.includes('Direct Interactions'));
assert.ok(!gHtml.includes('HIPAA'));
assert.ok(!gHtml.includes('CRM familiarity'));
assert.ok(!gHtml.includes('visual media'));

const aiHtml = htmlFor('?remix=ai');
assert.ok(aiHtml.includes('supporting LLMs through safety labeling'));
assert.ok(aiHtml.includes('Multimodal review (text, image, video, speech).'));
assert.ok(aiHtml.includes('HIPAA'));
assert.ok(aiHtml.includes('bfloore.online'));
assert.ok(!aiHtml.includes('visual media'));
assert.ok(!aiHtml.includes('Brand ownership'));
assert.ok(!aiHtml.includes('Direct Interactions'));
assert.ok(!aiHtml.includes('Baptist Health'));
assert.ok(!aiHtml.includes('Skills — operator'));

const frHtml = htmlFor('?remix=freelance');
assert.ok(frHtml.includes('without a corporate scaffold'));
assert.ok(frHtml.includes('Client operations'));
assert.ok(frHtml.includes('Supporting contracts'));
assert.ok(frHtml.includes('CRM familiarity'));
assert.ok(frHtml.includes('visual media'));
assert.ok(frHtml.includes('Samsung.com Mobile via ibbu'));
assert.ok(!frHtml.includes('Omaha Steaks'));
assert.ok(!frHtml.includes('Skills — AI'));
assert.ok(!frHtml.includes('Baptist Health'));
assert.ok(!frHtml.includes('HIPAA'));

const cvHtml = htmlFor('?view=cv');
assert.ok(cvHtml.includes('supporting LLMs through safety labeling'));
assert.ok(cvHtml.includes('without a corporate scaffold'));
assert.ok(cvHtml.includes('Baptist Health'));
assert.ok(cvHtml.includes('Omaha Steaks'));
assert.ok(cvHtml.includes('Skills — AI'));
assert.ok(cvHtml.includes('Skills — operator'));
assert.ok(cvHtml.includes('HIPAA'));
assert.ok(cvHtml.includes('CRM familiarity'));
assert.ok(cvHtml.includes("Friendly Robots children's books."));

const hidden = htmlFor('?on=');
assert.ok(hidden.includes('Every section is hidden'));

assert.ok(R.whoHtml(data).includes('barry.floore@gmail.com'));
assert.ok(R.contactHtml(data).includes('Download vCard'));
assert.ok(!/download full/i.test(R.deckText(data, { view: 'cv', remix: 'general', on: CONTENT.moduleIds })));

console.log('ok ' + CONTENT.modules.length + ' modules · 3 remixes · vCard ' + card.length + ' bytes');
