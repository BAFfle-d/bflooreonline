/* Pure HTML for the resume. Shared by the build, the browser, and tests. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ResumeRender = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function remixById(data, id) {
    for (var i = 0; i < data.remixes.length; i++) if (data.remixes[i].id === id) return data.remixes[i];
    return data.remixes[0];
  }

  function pageTitle(data, state) {
    if (state.view === 'cv') return 'Barry Floore — full CV';
    if (state.remix === 'ai') return 'Barry Floore — AI trainer';
    if (state.remix === 'freelance') return 'Barry Floore — business owner / freelancer';
    return 'Barry Floore — resume';
  }

  function deckText(data, state) {
    if (state.view === 'cv') return 'Full CV. Hide any section. PDF exports only what stays on screen.';
    return remixById(data, state.remix).deck;
  }

  function variantFor(data, state, mod) {
    if (state.view === 'cv') return mod.variants.full;
    var key = (data.variantMap[mod.id] || {})[state.remix];
    return mod.variants[key] || mod.variants.full;
  }

  function whoHtml(data) {
    var p = data.person;
    var tel = String(p.phoneE164).replace(/-/g, '');
    var sms = String(p.smsE164).replace(/-/g, '');
    return '<p class="kicker">// ' + esc(p.display) + '</p>' +
      '<h1 id="name">' + esc(p.full) + '</h1>' +
      '<p class="identity">' + esc(data.identity.line) + '</p>' +
      '<ul class="contact-line">' +
        '<li><a href="mailto:' + esc(p.email) + '">' + esc(p.email) + '</a></li>' +
        '<li><a href="tel:' + esc(tel) + '">' + esc(p.phone) + '</a></li>' +
        '<li><a href="sms:' + esc(sms) + '">SMS ' + esc(p.sms) + '</a></li>' +
        '<li>' + esc(p.localityLabel) + ' · ' + esc(p.remote) + '</li>' +
        '<li><a href="' + esc(p.linkedin) + '">' + esc(p.linkedinLabel) + '</a></li>' +
        '<li><a href="' + esc(data.hubUrl) + '">bfloore.online</a></li>' +
      '</ul>';
  }

  function contactHtml(data) {
    var p = data.person;
    var tel = String(p.phoneE164).replace(/-/g, '');
    var sms = String(p.smsE164).replace(/-/g, '');
    return '<p class="kicker">// contact</p>' +
      '<h2>Save to phone</h2>' +
      '<div class="qr-frame" role="img" aria-label="QR code that adds Barry Floore to a phone\'s contacts">' + data.qrSvg + '</div>' +
      '<p class="qr-note">Scan the code to add Barry Floore, or download the same contact card.</p>' +
      '<a class="btn primary" href="Barry-Floore.vcf" download="Barry-Floore.vcf">Download vCard</a>' +
      '<dl class="facts">' +
        '<div><dt>Email</dt><dd><a href="mailto:' + esc(p.email) + '">' + esc(p.email) + '</a></dd></div>' +
        '<div><dt>Phone</dt><dd><a href="tel:' + esc(tel) + '">' + esc(p.phone) + '</a></dd></div>' +
        '<div><dt>SMS</dt><dd><a href="sms:' + esc(sms) + '">' + esc(p.sms) + '</a></dd></div>' +
        '<div><dt>Location</dt><dd>' + esc(p.localityLabel) + ' · ' + esc(p.remote) + '</dd></div>' +
        '<div><dt>LinkedIn</dt><dd><a href="' + esc(p.linkedin) + '">' + esc(p.linkedinLabel) + '</a></dd></div>' +
        '<div><dt>Hub</dt><dd><a href="' + esc(data.hubUrl) + '">bfloore.online</a></dd></div>' +
      '</dl>';
  }

  function remixesHtml(data, state) {
    return data.remixes.map(function (r) {
      var on = state.view === 'resume' && state.remix === r.id;
      return '<button type="button" class="chip" data-remix="' + esc(r.id) + '" aria-pressed="' + (on ? 'true' : 'false') + '">' + esc(r.label) + '</button>';
    }).join('');
  }

  function togglesHtml(data, state) {
    return data.modules.map(function (mod) {
      var on = state.on.indexOf(mod.id) !== -1;
      return '<button type="button" class="chip" data-module="' + esc(mod.id) + '" aria-pressed="' + (on ? 'true' : 'false') + '">' + esc(mod.label) + '</button>';
    }).join('');
  }

  function sameList(a, b) {
    return a.length === b.length && a.every(function (v, i) { return v === b[i]; });
  }

  function inOrder(moduleIds, ids) {
    var want = {};
    (ids || []).forEach(function (id) { want[id] = true; });
    return moduleIds.filter(function (id) { return want[id]; });
  }

  function adjustHtml(data, state) {
    if (state.view === 'cv') {
      if (sameList(state.on, data.moduleIds)) return '';
      return 'Some sections are hidden. <button type="button" id="reset">Show all sections</button>';
    }
    var preset = inOrder(data.moduleIds, data.presets[state.remix] || []);
    if (sameList(state.on, preset)) return '';
    return 'Sections differ from ' + esc(remixById(data, state.remix).label) + '. <button type="button" id="reset">Reset sections</button>';
  }

  function renderRole(job) {
    var org = [job.org, job.where].filter(Boolean).join(' · ');
    var bullets = (job.bullets || []).map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('');
    return '<div class="role"><div class="role-top"><h3>' + esc(job.title) + '</h3>' +
      (job.dates ? '<span class="when">' + esc(job.dates) + '</span>' : '') +
      '</div>' +
      (org ? '<p class="org">' + esc(org) + '</p>' : '') +
      (bullets ? '<ul>' + bullets + '</ul>' : '') +
      '</div>';
  }

  function renderModule(data, state, mod) {
    var variant = variantFor(data, state, mod);
    var body = '';
    if (mod.kind === 'prose') {
      body = '<div class="prose">' + variant.paragraphs.map(function (para) { return '<p>' + esc(para) + '</p>'; }).join('') + '</div>';
    } else if (mod.kind === 'roles') {
      body = variant.entries.map(renderRole).join('');
    } else if (mod.kind === 'credentials') {
      body = variant.entries.map(function (job) {
        return '<div class="cred"><div class="role-top"><h3>' + esc(job.title) + '</h3>' +
          (job.dates ? '<span class="when">' + esc(job.dates) + '</span>' : '') +
          '</div>' +
          (job.org ? '<p class="org">' + esc(job.org) + '</p>' : '') +
          (job.notes ? '<p class="note">' + esc(job.notes) + '</p>' : '') +
          '</div>';
      }).join('');
    } else if (mod.kind === 'items') {
      body = variant.entries.map(function (it) {
        var href = it.href && /^https:\/\//.test(it.href) ? it.href : '';
        var name = href ? '<a href="' + esc(href) + '">' + esc(it.title) + '</a>' : esc(it.title);
        return '<p class="item"><strong>' + name + '</strong><span>' + esc(it.text) + '</span></p>';
      }).join('');
    } else if (mod.kind === 'skills') {
      body = '<ul class="skills">' + variant.items.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('') + '</ul>';
    }
    var kicker = variant.kicker ? '<p class="sub">' + esc(variant.kicker) + '</p>' : '';
    return '<section class="section" id="mod-' + esc(mod.id) + '"><h2>' + esc(mod.title) + '</h2>' + kicker + body + '</section>';
  }

  function sectionsHtml(data, state) {
    if (!state.on.length) return '<p class="empty">Every section is hidden. Turn one back on to rebuild the page.</p>';
    var on = {};
    state.on.forEach(function (id) { on[id] = true; });
    return data.modules.filter(function (mod) { return on[mod.id]; }).map(function (mod) {
      return renderModule(data, state, mod);
    }).join('');
  }

  return {
    esc: esc,
    pageTitle: pageTitle,
    deckText: deckText,
    whoHtml: whoHtml,
    contactHtml: contactHtml,
    remixesHtml: remixesHtml,
    togglesHtml: togglesHtml,
    adjustHtml: adjustHtml,
    sectionsHtml: sectionsHtml,
    variantFor: variantFor
  };
});
