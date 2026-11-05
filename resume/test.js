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

assert.deepStrictEqual(CONTENT.remixes.map(function (r) { return r.id; }), ['general', 'ai', 'freelance', 'health', 'support', 'creative']);
assert.deepStrictEqual(CONTENT.remixes.map(function (r) { return r.label; }), ['General', 'AI trainer', 'Business owner / freelancer', 'Health / education', 'Remote support / crisis', 'Content creation']);
assert.strictEqual(CONTENT.remixes.length, 6);
assert.deepStrictEqual(Object.keys(CONTENT.presets), CONTENT.remixes.map(function (r) { return r.id; }));
assert.deepStrictEqual(RS.REMIXES, CONTENT.remixes.map(function (r) { return r.id; }));

CONTENT.moduleIds.forEach(function (id) {
  const mod = CONTENT.modules.find(function (m) { return m.id === id; });
  assert.ok(mod.variants.full, id + ' needs a full variant for the CV view');
  CONTENT.remixes.forEach(function (remix) {
    const key = CONTENT.variantMap[id][remix.id];
    assert.ok(key, id + ' ' + remix.id + ' missing variantMap entry');
    assert.ok(mod.variants[key], id + ' ' + remix.id + ' missing variant ' + key);
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
assert.strictEqual(CONTENT.variantMap.projects.freelance, 'practice');
assert.strictEqual(CONTENT.variantMap.projects.creative, 'creative');
assert.strictEqual(CONTENT.variantMap.projects.support, 'light');
assert.strictEqual(CONTENT.variantMap['exp-ai'].freelance, 'supporting');
assert.strictEqual(CONTENT.variantMap['exp-cs'].freelance, 'select');
assert.deepStrictEqual(CONTENT.presets.health, ['summary', 'exp-ai', 'exp-cs', 'clinical', 'education', 'skills-health']);
assert.ok(!CONTENT.presets.health.includes('projects'));
assert.ok(!CONTENT.presets.health.includes('skills-ai'));
assert.ok(!CONTENT.presets.health.includes('skills-ops'));
assert.strictEqual(CONTENT.variantMap.summary.health, 'health');
assert.strictEqual(CONTENT.variantMap['exp-ai'].health, 'education');
assert.strictEqual(CONTENT.variantMap['exp-cs'].health, 'crisis');
assert.strictEqual(CONTENT.variantMap.clinical.health, 'full');
assert.strictEqual(CONTENT.variantMap.projects.health, 'light');
assert.strictEqual(CONTENT.variantMap.education.health, 'full');
assert.strictEqual(CONTENT.variantMap['skills-ai'].health, 'core');
assert.strictEqual(CONTENT.variantMap['skills-ops'].health, 'core');
assert.strictEqual(CONTENT.variantMap['skills-health'].health, 'full');
assert.deepStrictEqual(CONTENT.presets.support, ['summary', 'exp-cs', 'clinical', 'education', 'skills-ops']);
assert.ok(!CONTENT.presets.support.includes('exp-ai'));
assert.ok(!CONTENT.presets.support.includes('projects'));
assert.ok(!CONTENT.presets.support.includes('skills-health'));
assert.ok(!CONTENT.presets.support.includes('skills-creative'));
assert.strictEqual(CONTENT.variantMap.summary.support, 'support');
assert.strictEqual(CONTENT.variantMap['exp-cs'].support, 'crisis');
assert.strictEqual(CONTENT.variantMap.clinical.support, 'full');
assert.strictEqual(CONTENT.variantMap['skills-ops'].support, 'support');
assert.deepStrictEqual(CONTENT.presets.creative, ['summary', 'projects', 'education', 'skills-ops', 'skills-creative']);
assert.ok(!CONTENT.presets.creative.includes('exp-ai'));
assert.ok(!CONTENT.presets.creative.includes('exp-cs'));
assert.ok(!CONTENT.presets.creative.includes('clinical'));
assert.ok(!CONTENT.presets.creative.includes('skills-ai'));
assert.strictEqual(CONTENT.variantMap.summary.creative, 'creative');
assert.strictEqual(CONTENT.variantMap['skills-ops'].creative, 'operator');
assert.strictEqual(CONTENT.variantMap['skills-ops'].freelance, 'operator');
assert.strictEqual(CONTENT.variantMap['skills-creative'].creative, 'full');

const projects = CONTENT.modules.find(function (m) { return m.id === 'projects'; });
assert.ok(JSON.stringify(projects.variants.practice).includes('visual media'));
assert.ok(JSON.stringify(projects.variants.full).includes('visual media'));
assert.ok(JSON.stringify(projects.variants.full).includes('World-record nominated'));
assert.ok(JSON.stringify(projects.variants.creative).includes('World-record nominated'));
assert.ok(!/world-record nominated/i.test(JSON.stringify(projects.variants.practice)));
assert.ok(!JSON.stringify(projects.variants.creative).includes('visual media'));
assert.ok(!JSON.stringify(projects.variants.light).includes('SLOP!'));
assert.ok(JSON.stringify(projects.variants.practice).includes('no paid licensing yet'));
assert.ok(JSON.stringify(projects.variants.creative).includes('no paid licensing yet'));
assert.ok(JSON.stringify(projects.variants.creative).includes('https://open.spotify.com/show/2nGTlVMwCufnCq4NUssGT9'));
assert.ok(!JSON.stringify(projects.variants.practice).includes('open.spotify.com'));
assert.ok(JSON.stringify(projects.variants.creative).includes('https://friendlyrobots.online'));
assert.ok(JSON.stringify(projects.variants.creative).includes('https://slopthemusical.com'));
assert.ok(JSON.stringify(projects.variants.creative).includes('https://spuncalliope.wordpress.com'));
assert.ok(JSON.stringify(projects.variants.creative).includes('https://thelyingliars.online'));
assert.ok(JSON.stringify(projects.variants.creative).includes('https://serialimages.vercel.app'));

const ops = CONTENT.modules.find(function (m) { return m.id === 'skills-ops'; });
assert.ok(ops.variants.support.items.indexOf('Crisis intervention and de-escalation') !== -1);
assert.ok(ops.variants.support.items.indexOf('Night-shift reliability') !== -1);
assert.ok(ops.variants.full.items.indexOf('Crisis intervention and de-escalation') !== -1);
assert.ok(ops.variants.operator.items.indexOf('Crisis intervention and de-escalation') === -1);
assert.ok(ops.variants.core.items.indexOf('Affiliate hygiene') !== -1);
assert.ok(ops.variants.support.items.indexOf('Affiliate hygiene') === -1);

const expCs = CONTENT.modules.find(function (m) { return m.id === 'exp-cs'; });
assert.ok(JSON.stringify(expCs.variants.crisis).includes('trauma-informed, person-centered practice'));
assert.ok(!JSON.stringify(expCs.variants.crisis).includes('Omaha Steaks'));
assert.ok(JSON.stringify(expCs.variants.full).includes('trauma-informed, person-centered practice'));
assert.ok(JSON.stringify(expCs.variants.full).includes('Omaha Steaks'));
assert.ok(!expCs.variants.select.entries.some(function (entry) { return entry.bullets && entry.bullets.length; }));

const general = RS.parseState('', catalog);
eq(general, { view: 'resume', remix: 'general', on: CONTENT.presets.general });
assert.strictEqual(RS.serializeState(general, catalog), '');

const ai = RS.parseState('?remix=ai', catalog);
eq(ai.on, CONTENT.presets.ai);
assert.strictEqual(RS.serializeState(ai, catalog), 'remix=ai');

const health = RS.parseState('?remix=health', catalog);
eq(health, { view: 'resume', remix: 'health', on: CONTENT.presets.health });
assert.strictEqual(RS.serializeState(health, catalog), 'remix=health');

const support = RS.parseState('?remix=support', catalog);
eq(support, { view: 'resume', remix: 'support', on: CONTENT.presets.support });
assert.strictEqual(RS.serializeState(support, catalog), 'remix=support');

const creative = RS.parseState('?remix=creative', catalog);
eq(creative, { view: 'resume', remix: 'creative', on: CONTENT.presets.creative });
assert.strictEqual(RS.serializeState(creative, catalog), 'remix=creative');

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
assert.ok(!frHtml.includes('trauma-informed, person-centered practice'));
assert.ok(!frHtml.includes('Black Friday/Cyber Monday'));
assert.ok(!frHtml.includes('inbound fundraising'));
assert.ok(!frHtml.includes('EPIC and Cerner'));
assert.ok(!frHtml.includes('Skills — health'));
assert.ok(!gHtml.includes('trauma-informed, person-centered practice'));
assert.ok(!gHtml.includes('EPIC and Cerner'));
assert.ok(!gHtml.includes('Skills — health'));
assert.ok(!gHtml.includes('Trauma-informed scoring'));
assert.ok(!aiHtml.includes('trauma-informed, person-centered practice'));
assert.ok(!aiHtml.includes('EPIC and Cerner'));
assert.ok(!aiHtml.includes('Skills — health'));
assert.ok(!aiHtml.includes('healthcare and education lens'));
assert.ok(!gHtml.includes('SLOP!'));
assert.ok(!gHtml.includes('friendlyrobots.online'));
assert.ok(!aiHtml.includes('SLOP!'));
assert.ok(!/world-record nominated/i.test(frHtml));
assert.ok(!frHtml.includes('open.spotify.com'));
assert.ok(!frHtml.includes('Skills — creative'));
assert.ok(!frHtml.includes('Crisis intervention and de-escalation'));
assert.ok(frHtml.includes('visual media'));
assert.ok(frHtml.includes('friendlyrobots.online'));
assert.ok(frHtml.includes('SLOP!'));
assert.ok(frHtml.includes('no paid licensing yet'));
assert.ok(frHtml.includes('Listed on the hub.'));

const healthHtml = htmlFor('?remix=health');
assert.ok(healthHtml.includes('health educator, behavioral support specialist'));
assert.ok(healthHtml.includes('Title IX/Clery/VAWA'));
assert.ok(healthHtml.includes('Crisis navigation and client service'));
assert.ok(healthHtml.includes('trauma-informed, person-centered practice'));
assert.ok(healthHtml.includes('Black Friday/Cyber Monday'));
assert.ok(healthHtml.includes('de-escalated angry/crisis guests'));
assert.ok(healthHtml.includes('inbound fundraising'));
assert.ok(healthHtml.includes('Direct Interactions'));
assert.ok(healthHtml.includes('Samsung.com Mobile via ibbu'));
assert.ok(healthHtml.includes('HotelPlanner.com'));
assert.ok(healthHtml.includes('ACD Direct for PBS/NPR'));
assert.ok(!healthHtml.includes('Omaha Steaks'));
assert.ok(healthHtml.includes('Baptist Health'));
assert.ok(healthHtml.includes('EPIC and Cerner'));
assert.ok(healthHtml.includes('Code White'));
assert.ok(healthHtml.includes('FlexCare'));
assert.ok(healthHtml.includes('new-hire orientation'));
assert.ok(healthHtml.includes('hallucinated diagnoses'));
assert.ok(healthHtml.includes('MSN-level clinical judgment'));
assert.ok(healthHtml.includes('Centific / Pactera Edge'));
assert.ok(healthHtml.includes('Sigma Theta Tau'));
assert.ok(healthHtml.includes('Skills — health'));
assert.ok(healthHtml.includes('Trauma-informed facilitation and crisis navigation'));
assert.ok(healthHtml.includes('Health education and AOD risk reduction'));
assert.ok(healthHtml.includes('Peer staff management'));
assert.ok(healthHtml.includes('Title IX / Clery / VAWA compliance familiarity'));
assert.ok(healthHtml.includes('Qualitative / mixed-methods research and coding'));
assert.ok(healthHtml.includes('Rubric calibration and inter-rater reliability'));
assert.ok(healthHtml.includes('Stakeholder-facing insight reporting'));
assert.ok(healthHtml.includes('Education and healthcare lens'));
assert.ok(healthHtml.includes('Handshake AI'));
assert.ok(healthHtml.includes('Mercor AI'));
assert.ok(healthHtml.includes('Appen / CrowdGen'));
assert.ok(healthHtml.includes('healthcare and education lens'));
assert.ok(healthHtml.includes('Pearson Education'));
assert.ok(healthHtml.includes('Trauma-informed scoring and rubric calibration'));
assert.ok(!healthHtml.includes('visual media'));
assert.ok(!healthHtml.includes('Skills — operator'));
assert.ok(!healthHtml.includes('Skills — AI'));
assert.ok(!healthHtml.includes('HIPAA'));
assert.ok(!healthHtml.includes('CRM familiarity'));
assert.ok(!healthHtml.includes('Brand ownership'));
assert.strictEqual(R.pageTitle(data, health), 'Barry Floore — health / education');
assert.ok(R.deckText(data, health).includes('health education, behavioral support, and research'));
const healthChips = R.remixesHtml(data, health);
assert.ok(healthChips.includes('data-remix="health" aria-pressed="true">Health / education'));
assert.ok(healthChips.includes('data-remix="general" aria-pressed="false"'));
assert.ok(healthChips.includes('data-remix="ai" aria-pressed="false"'));
assert.ok(healthChips.includes('data-remix="freelance" aria-pressed="false"'));
assert.ok(healthChips.includes('data-remix="support" aria-pressed="false"'));
assert.ok(healthChips.includes('data-remix="creative" aria-pressed="false"'));

const supportHtml = htmlFor('?remix=support');
assert.ok(supportHtml.includes('grace under fire'));
assert.ok(supportHtml.includes('crisis intervention, and de-escalation'));
assert.ok(supportHtml.includes('Crisis navigation and client service'));
assert.ok(supportHtml.includes('trauma-informed, person-centered practice'));
assert.ok(supportHtml.includes('Black Friday/Cyber Monday'));
assert.ok(supportHtml.includes('de-escalated angry/crisis guests'));
assert.ok(supportHtml.includes('inbound fundraising'));
assert.ok(supportHtml.includes('Direct Interactions'));
assert.ok(supportHtml.includes('Samsung.com Mobile via ibbu'));
assert.ok(!supportHtml.includes('Omaha Steaks'));
assert.ok(supportHtml.includes('Baptist Health'));
assert.ok(supportHtml.includes('EPIC and Cerner'));
assert.ok(supportHtml.includes('FlexCare'));
assert.ok(supportHtml.includes('hallucinated diagnoses'));
assert.ok(supportHtml.includes('Sigma Theta Tau'));
assert.ok(supportHtml.includes('Skills — operator'));
assert.ok(supportHtml.includes('Crisis intervention and de-escalation'));
assert.ok(supportHtml.includes('Trauma-informed communication'));
assert.ok(supportHtml.includes('High-pressure, high-volume support'));
assert.ok(supportHtml.includes('Live chat and phone'));
assert.ok(supportHtml.includes('Night-shift reliability'));
assert.ok(!supportHtml.includes('Affiliate hygiene'));
assert.ok(!supportHtml.includes('Publishing and site ops'));
assert.ok(!supportHtml.includes('Handshake AI'));
assert.ok(!supportHtml.includes('Skills — health'));
assert.ok(!supportHtml.includes('Skills — creative'));
assert.ok(!supportHtml.includes('Skills — AI'));
assert.ok(!supportHtml.includes('visual media'));
assert.ok(!/world-record nominated/i.test(supportHtml));
assert.ok(!supportHtml.includes('behavioral support specialist'));
assert.strictEqual(R.pageTitle(data, support), 'Barry Floore — remote support / crisis');
assert.ok(R.deckText(data, support).includes('crisis intervention, live chat, and high-volume remote support'));
const supportChips = R.remixesHtml(data, support);
assert.ok(supportChips.includes('data-remix="support" aria-pressed="true">Remote support / crisis'));

const creativeHtml = htmlFor('?remix=creative');
assert.ok(creativeHtml.includes('independent producer building books, musicals, podcasts'));
assert.ok(creativeHtml.includes('three musicals in various stages of completion'));
assert.ok(creativeHtml.includes('World-record nominated'));
assert.ok(creativeHtml.includes('https://friendlyrobots.online'));
assert.ok(creativeHtml.includes('https://www.amazon.com/stores/B.-Floore/author/B0D2DBX9BH'));
assert.ok(creativeHtml.includes('Amazon author store'));
assert.ok(creativeHtml.includes('Published novella.'));
assert.ok(creativeHtml.includes('https://thelyingliars.online'));
assert.ok(creativeHtml.includes('160k+ words'));
assert.ok(creativeHtml.includes('https://slopthemusical.com'));
assert.ok(creativeHtml.includes('Geoff &amp; Maxie'));
assert.ok(creativeHtml.includes('https://spuncalliope.wordpress.com'));
assert.ok(creativeHtml.includes('https://open.spotify.com/show/2nGTlVMwCufnCq4NUssGT9'));
assert.ok(creativeHtml.includes('that ranking is the show\'s claim'));
assert.ok(creativeHtml.includes('Adult fiction and music podcast companion to the novel.'));
assert.ok(creativeHtml.includes('https://instagram.com/barrylikethefruit'));
assert.ok(creativeHtml.includes('https://youtube.com/@bfloore_online'));
assert.ok(creativeHtml.includes('https://tiktok.com/@b_floore'));
assert.ok(creativeHtml.includes('https://barryfloore.substack.com'));
assert.ok(creativeHtml.includes('https://medium.com/@bfloore'));
assert.ok(creativeHtml.includes('active monthly licensing'));
assert.ok(creativeHtml.includes('no paid licensing yet'));
assert.ok(creativeHtml.includes('https://serialimages.vercel.app'));
assert.ok(creativeHtml.includes('Merch on Etsy and downloads on Gumroad'));
assert.ok(creativeHtml.includes('Sigma Theta Tau'));
assert.ok(creativeHtml.includes('CRM familiarity'));
assert.ok(creativeHtml.includes('Skills — creative'));
assert.ok(creativeHtml.includes('Publishing and Amazon/KDP workflow'));
assert.ok(creativeHtml.includes('Podcast production'));
assert.ok(creativeHtml.includes('Children\'s STEM/SEL content'));
assert.ok(!creativeHtml.includes('visual media'));
assert.ok(!creativeHtml.includes('Musicals in progress'));
assert.ok(!creativeHtml.includes('Baptist Health'));
assert.ok(!creativeHtml.includes('Direct Interactions'));
assert.ok(!creativeHtml.includes('Handshake AI'));
assert.ok(!creativeHtml.includes('Skills — AI'));
assert.ok(!creativeHtml.includes('Skills — health'));
assert.ok(!creativeHtml.includes('Crisis intervention and de-escalation'));
assert.ok(!creativeHtml.includes('HIPAA'));
assert.strictEqual(R.pageTitle(data, creative), 'Barry Floore — content creation');
assert.ok(R.deckText(data, creative).includes('publishing, media, photography, and multi-platform content'));
const creativeChips = R.remixesHtml(data, creative);
assert.ok(creativeChips.includes('data-remix="creative" aria-pressed="true">Content creation'));

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
assert.ok(cvHtml.includes('trauma-informed, person-centered practice'));
assert.ok(cvHtml.includes('Black Friday/Cyber Monday'));
assert.ok(cvHtml.includes('inbound fundraising'));
assert.ok(cvHtml.includes('EPIC and Cerner'));
assert.ok(cvHtml.includes('Code White'));
assert.ok(cvHtml.includes('FlexCare'));
assert.ok(cvHtml.includes('hallucinated diagnoses'));
assert.ok(cvHtml.includes('MSN-level clinical judgment'));
assert.ok(cvHtml.includes('Skills — health'));
assert.ok(cvHtml.includes('Health education and AOD risk reduction'));
assert.ok(!cvHtml.includes('healthcare and education lens'));
assert.ok(cvHtml.includes('World-record nominated'));
assert.ok(cvHtml.includes('https://open.spotify.com/show/2nGTlVMwCufnCq4NUssGT9'));
assert.ok(cvHtml.includes('https://friendlyrobots.online'));
assert.ok(cvHtml.includes('no paid licensing yet'));
assert.ok(cvHtml.includes('Skills — creative'));
assert.ok(cvHtml.includes('Crisis intervention and de-escalation'));
assert.ok(cvHtml.includes('visual media'));
assert.ok(cvHtml.includes("Friendly Robots children's books."));

const hidden = htmlFor('?on=');
assert.ok(hidden.includes('Every section is hidden'));

const sealed = R.sealPerson(CFG.person);
const opened = R.openReach(sealed);
assert.strictEqual(opened.email, CFG.person.email);
assert.strictEqual(opened.phone, CFG.person.phone);
assert.strictEqual(opened.sms, CFG.person.sms);
assert.strictEqual(opened.tel, CFG.person.phoneE164.replace(/-/g, ''));
assert.strictEqual(opened.smsTel, CFG.person.smsE164.replace(/-/g, ''));
const sealedDump = JSON.stringify(sealed);
[CFG.person.email, CFG.person.phone, CFG.person.sms, CFG.person.phoneE164, CFG.person.smsE164].forEach(function (bit) {
  assert.ok(!sealedDump.includes(bit), 'sealed contact still has ' + bit);
});
const sealedData = Object.assign({}, data, { person: sealed });
const who = R.whoHtml(sealedData);
assert.ok(who.includes('>Email</a>'));
assert.ok(who.includes('>Call</a>'));
assert.ok(who.includes('>Text</a>'));
assert.ok(!who.includes(CFG.person.email));
assert.ok(!who.includes(CFG.person.phone));
assert.ok(!who.includes('mailto:'));
assert.ok(!who.includes('tel:'));
const contact = R.contactHtml(sealedData);
assert.ok(contact.includes('Download vCard'));
assert.ok(!contact.includes(CFG.person.email));
assert.ok(!contact.includes(CFG.person.phone));
assert.strictEqual(R.contactCard(sealedData), card);
assert.ok(!/download full/i.test(R.deckText(data, { view: 'cv', remix: 'general', on: CONTENT.moduleIds })));

console.log('ok ' + CONTENT.modules.length + ' modules · ' + CONTENT.remixes.length + ' remixes · vCard ' + card.length + ' bytes');
