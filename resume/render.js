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
    if (state.remix === 'health') return 'Barry Floore — health / education';
    if (state.remix === 'support') return 'Barry Floore — remote support / crisis';
    if (state.remix === 'creative') return 'Barry Floore — content creation';
    return 'Barry Floore — resume';
  }

  function deckText(data, state) {
    if (state.view === 'cv') return 'Full CV. Hide any section. PDF exports the sections on screen, with Earlier roles and Show all expanded.';
    return remixById(data, state.remix).deck;
  }

  function variantFor(data, state, mod) {
    if (state.view === 'cv') return mod.variants.full;
    var key = (data.variantMap[mod.id] || {})[state.remix];
    return mod.variants[key] || mod.variants.full;
  }

  function rev(s) {
    return String(s).split('').reverse().join('');
  }

  /* The business line is stored reversed so the shipped page has no raw number. */
  function sealPerson(person) {
    return {
      given: person.given,
      family: person.family,
      display: person.display,
      full: person.full,
      city: person.city,
      region: person.region,
      country: person.country,
      localityLabel: person.localityLabel,
      remote: person.remote,
      linkedin: person.linkedin,
      linkedinLabel: person.linkedinLabel,
      reach: {
        w: String(person.workPhone || '').split('-').filter(Boolean).map(rev)
      }
    };
  }

  function openReach(person) {
    var reach = (person && person.reach) || {};
    var w = (reach.w || []).map(rev);
    return {
      phone: w.join('-'),
      tel: w.length && w.join('') ? '+1' + w.join('') : ''
    };
  }

  function bookLink(data, className) {
    var href = data.calendlyUrl || '';
    var url;
    try { url = new URL(href); } catch (err) { return ''; }
    if (url.protocol !== 'https:' || url.hostname !== 'calendly.com' || url.pathname.length < 2) return '';
    if (url.username || url.password) return '';
    var safe = url.origin + url.pathname + url.search + url.hash;
    var cls = className ? ' class="' + className + '"' : '';
    return '<a' + cls + ' href="' + esc(safe) + '" target="_blank" rel="noopener noreferrer">Book a time</a>';
  }

  function contactCard(data) {
    var p = data.person;
    var c = openReach(p);
    var lines = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'N:' + p.family + ';' + p.given + ';;;',
      'FN:' + p.full,
      'TEL;TYPE=TEXT:+1-' + c.phone,
      'ADR;TYPE=WORK:;;' + p.city + ';' + p.region + ';;USA',
      'URL:' + data.hubUrl,
      'URL:' + p.linkedin,
      'END:VCARD'
    ];
    return lines.join('\r\n') + '\r\n';
  }

  function whoHtml(data) {
    var p = data.person;
    var creds = (data.hero || []).map(function (line) {
      return '<li>' + esc(line) + '</li>';
    }).join('');
    return '<p class="kicker">// ' + esc(p.display) + '</p>' +
      '<h1 id="name">' + esc(p.full) + '</h1>' +
      '<p class="identity">' + esc(data.identity.line) + '</p>' +
      (creds ? '<ul class="credentials">' + creds + '</ul>' : '') +
      '<div class="toolbar">' +
        '<button type="button" class="btn primary" id="pdf" aria-describedby="pdf-hint">Download PDF</button>' +
        '<button type="button" class="btn" id="copy">Copy link</button>' +
        '<button type="button" class="btn versions-btn" id="versions" aria-expanded="false" aria-controls="rail">Versions</button>' +
        '<span class="copied" id="copied" role="status"></span>' +
      '</div>' +
      '<ul class="contact-line">' +
        '<li>' + esc(p.localityLabel) + ' · ' + esc(p.remote) + '</li>' +
        '<li><a href="' + esc(p.linkedin) + '">' + esc(p.linkedinLabel) + '</a></li>' +
        '<li><a href="' + esc(data.hubUrl) + '">bfloore.online</a></li>' +
        '<li>' + bookLink(data) + '</li>' +
      '</ul>';
  }

  function contactHtml(data) {
    var p = data.person;
    return '<h2>Contact</h2>' +
      '<p class="qr-note">Book a time, or send a note. The note goes through this site, so no address is shown here.</p>' +
      bookLink(data, 'btn primary book') +
      '<form class="form" id="contact-form" novalidate>' +
        '<label for="contact-name">Name<input id="contact-name" name="name" type="text" required maxlength="80" autocomplete="name"></label>' +
        '<label for="contact-email">Your email<input id="contact-email" name="email" type="email" required maxlength="120" autocomplete="email"></label>' +
        '<label for="contact-message">Message<textarea id="contact-message" name="message" required maxlength="4000"></textarea></label>' +
        '<div class="hp" aria-hidden="true"><label for="contact-company">Company<input id="contact-company" name="company" type="text" tabindex="-1" autocomplete="off"></label></div>' +
        '<div id="turnstile"></div>' +
        '<button type="submit" class="btn primary" id="contact-send" disabled>Send</button>' +
        '<p class="form-status" id="form-status" role="status">Checking whether the contact form is available.</p>' +
      '</form>' +
      '<h3 class="subhead">Save to phone</h3>' +
      '<div class="qr-frame" role="img" aria-label="QR code that saves a contact card for Barry Floore">' + data.qrSvg + '</div>' +
      '<p class="qr-note">Scan the code to save the contact card, or download the same card.</p>' +
      '<button type="button" class="btn primary" id="vcard">Download vCard</button>' +
      '<dl class="facts">' +
        '<div><dt>Location</dt><dd>' + esc(p.localityLabel) + ' · ' + esc(p.remote) + '</dd></div>' +
        '<div><dt>LinkedIn</dt><dd><a href="' + esc(p.linkedin) + '">' + esc(p.linkedinLabel) + '</a></dd></div>' +
        '<div><dt>Website</dt><dd><a href="' + esc(data.hubUrl) + '">bfloore.online</a></dd></div>' +
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

  var GROUPS = [
    { id: 'summary', title: 'Summary', ids: ['summary'] },
    { id: 'experience', title: 'Experience', ids: ['exp-ai', 'exp-cs', 'clinical'] },
    { id: 'education', title: 'Education', ids: ['education'] },
    { id: 'skills', title: 'Skills', ids: ['skills-ai', 'skills-ops', 'skills-health', 'skills-creative'] },
    { id: 'projects', title: 'Projects', ids: ['projects'] }
  ];

  function renderLines(lines) {
    return '<ul class="nested">' + lines.map(function (line) {
      var label = esc(line.org || line.title || '');
      var text = line.text ? '<span>' + esc(line.text) + '</span>' : '';
      return '<li><strong>' + label + '</strong>' + text + '</li>';
    }).join('') + '</ul>';
  }

  function renderRole(job) {
    var meta = [job.dates, job.where].filter(Boolean).join(' · ');
    var bullets = (job.bullets || []).map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('');
    var lines = (job.lines && job.lines.length) ? renderLines(job.lines) : '';
    return '<article class="role"><div class="role-body">' +
      '<div class="role-top"><h3>' + esc(job.title) + '</h3>' +
        (meta ? '<p class="meta">' + esc(meta) + '</p>' : '') +
      '</div>' +
      (job.org ? '<p class="org">' + esc(job.org) + '</p>' : '') +
      (bullets ? '<ul>' + bullets + '</ul>' : '') +
      lines +
      '</div></article>';
  }

  function renderRoles(entries, collapse) {
    var jobs = entries || [];
    if (!jobs.length) return '';
    function list(rows) {
      return rows.map(function (job) { return renderRole(job); }).join('');
    }
    if (!collapse) return list(jobs);
    var open = jobs.filter(function (job) { return !job.collapsed; });
    var hidden = jobs.filter(function (job) { return job.collapsed; });
    if (!hidden.length) return list(jobs);
    return list(open) +
      '<details class="more"><summary>Earlier roles</summary>' + list(hidden) + '</details>';
  }

  function renderCred(job) {
    return '<article class="cred"><div class="role-body">' +
      '<div class="role-top"><h3>' + esc(job.title) + '</h3>' +
        (job.dates ? '<p class="meta">' + esc(job.dates) + '</p>' : '') +
      '</div>' +
      (job.org ? '<p class="org">' + esc(job.org) + '</p>' : '') +
      (job.notes ? '<p class="note">' + esc(job.notes) + '</p>' : '') +
      '</div></article>';
  }

  function renderSkills(items) {
    function list(rows) {
      return '<ul class="skills">' + rows.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('') + '</ul>';
    }
    var rows = items || [];
    if (rows.length <= 8) return list(rows);
    return list(rows.slice(0, 6)) + '<details class="more"><summary>More skills</summary>' + list(rows.slice(6)) + '</details>';
  }

  function resolveHref(data, it) {
    var href = it && it.href ? String(it.href).trim() : '';
    if (!href && it && it.portfolio && data && data.portfolios) {
      href = String(data.portfolios[it.portfolio] || '').trim();
    }
    if (!/^https:\/\//.test(href)) return '';
    var url;
    try { url = new URL(href); } catch (err) { return ''; }
    if (url.protocol !== 'https:' || url.username || url.password) return '';
    return url.origin + url.pathname + url.search + url.hash;
  }

  function renderItems(data, entries) {
    var shown = 0;
    var visible = [];
    var hidden = [];
    (entries || []).forEach(function (it) {
      var href = resolveHref(data, it);
      if (it.linkOnly && !href) return;
      var name = href ? '<a href="' + esc(href) + '">' + esc(it.title) + '</a>' : esc(it.title);
      var links = (it.links || []).map(function (link) {
        if (!link || !link.href || !/^https:\/\//.test(link.href)) return '';
        return '<a href="' + esc(link.href) + '">' + esc(link.label || link.href) + '</a>';
      }).join('');
      var text = it.text ? '<span>' + esc(it.text) + '</span>' : '';
      var html = '<p class="item"><strong>' + name + '</strong>' + text +
        (links ? '<span class="links">' + links + '</span>' : '') + '</p>';
      if (shown < 6) visible.push(html);
      else hidden.push(html);
      shown += 1;
    });
    if (!hidden.length) return visible.join('');
    return visible.join('') + '<details class="more"><summary>Show all</summary>' + hidden.join('') + '</details>';
  }

  function trackBody(data, state, mod) {
    var variant = variantFor(data, state, mod);
    var collapseRoles = state.view !== 'cv' && state.remix === 'general';
    if (mod.kind === 'prose') {
      return '<div class="prose">' + variant.paragraphs.map(function (para) { return '<p>' + esc(para) + '</p>'; }).join('') + '</div>';
    }
    if (mod.kind === 'roles') return renderRoles(variant.entries, collapseRoles);
    if (mod.kind === 'credentials') {
      return variant.entries.map(renderCred).join('');
    }
    if (mod.kind === 'items') return renderItems(data, variant.entries);
    if (mod.kind === 'skills') return renderSkills(variant.items);
    return '';
  }

  function trackHtml(data, state, mod, group) {
    var variant = variantFor(data, state, mod);
    var heading = mod.title === group.title ? (variant.kicker || '') : mod.title;
    var kicker = variant.kicker && heading !== variant.kicker ? variant.kicker : '';
    return '<div class="track" id="mod-' + esc(mod.id) + '">' +
      (heading ? '<p class="sub">' + esc(heading) + '</p>' : '') +
      (kicker ? '<p class="sub">' + esc(kicker) + '</p>' : '') +
      trackBody(data, state, mod) + '</div>';
  }

  function visibleGroups(data, state) {
    var on = {};
    state.on.forEach(function (id) { on[id] = true; });
    return GROUPS.filter(function (group) {
      return group.ids.some(function (id) { return on[id]; });
    });
  }

  function navHtml(data, state) {
    var links = visibleGroups(data, state).map(function (group) {
      return '<a href="#' + group.id + '">' + esc(group.title) + '</a>';
    });
    links.push('<a href="#contact">Contact</a>');
    return links.join('');
  }

  function sectionsHtml(data, state) {
    if (!state.on.length) return '<p class="empty">Every section is hidden. Turn one back on to rebuild the page.</p>';
    var on = {};
    state.on.forEach(function (id) { on[id] = true; });
    return GROUPS.map(function (group) {
      var mods = data.modules.filter(function (mod) { return group.ids.indexOf(mod.id) !== -1 && on[mod.id]; });
      if (!mods.length) return '';
      return '<section class="block card" id="' + group.id + '"><h2>' + esc(group.title) + '</h2>' +
        mods.map(function (mod) { return trackHtml(data, state, mod, group); }).join('') + '</section>';
    }).join('');
  }

  return {
    esc: esc,
    pageTitle: pageTitle,
    deckText: deckText,
    sealPerson: sealPerson,
    openReach: openReach,
    contactCard: contactCard,
    whoHtml: whoHtml,
    contactHtml: contactHtml,
    remixesHtml: remixesHtml,
    togglesHtml: togglesHtml,
    adjustHtml: adjustHtml,
    sectionsHtml: sectionsHtml,
    navHtml: navHtml,
    variantFor: variantFor
  };
});
