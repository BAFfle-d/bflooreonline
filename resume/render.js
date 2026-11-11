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
    if (state.view === 'cv') return 'Full CV. Hide any section. PDF exports only what stays on screen.';
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

  /* Contact is stored as reversed pieces so the shipped page has no raw address or number. */
  function sealPerson(person) {
    var at = String(person.email).split('@');
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
        m: at.map(function (part) { return part.split('.').map(rev); }),
        v: String(person.phone).split('-').map(rev),
        s: String(person.sms).split('-').map(rev)
      }
    };
  }

  function openReach(person) {
    var reach = (person && person.reach) || {};
    var email = (reach.m || []).map(function (group) {
      return (group || []).map(rev).join('.');
    }).join('@');
    var v = (reach.v || []).map(rev);
    var s = (reach.s || []).map(rev);
    return {
      email: email,
      phone: v.join('-'),
      sms: s.join('-'),
      tel: v.length ? '+1' + v.join('') : '',
      smsTel: s.length ? '+1' + s.join('') : ''
    };
  }

  function reachLink(kind, label) {
    return '<a class="reach" data-reach="' + kind + '" href="#contact">' + label + '</a>';
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
      'EMAIL:' + c.email,
      'TEL;TYPE=VOICE:+1-' + c.phone,
      'TEL;TYPE=CELL:+1-' + c.sms,
      'ADR;TYPE=HOME:;;' + p.city + ';' + p.region + ';;USA',
      'URL:' + p.linkedin,
      'URL:' + data.hubUrl,
      'END:VCARD'
    ];
    return lines.join('\r\n') + '\r\n';
  }

  function whoHtml(data) {
    var p = data.person;
    return '<p class="kicker">// ' + esc(p.display) + '</p>' +
      '<h1 id="name">' + esc(p.full) + '</h1>' +
      '<p class="identity">' + esc(data.identity.line) + '</p>' +
      '<ul class="contact-line">' +
        '<li>' + bookLink(data) + '</li>' +
        '<li>' + reachLink('voice', 'Call') + '</li>' +
        '<li>' + reachLink('sms', 'Text') + '</li>' +
        '<li>' + esc(p.localityLabel) + ' · ' + esc(p.remote) + '</li>' +
        '<li><a href="' + esc(p.linkedin) + '">' + esc(p.linkedinLabel) + '</a></li>' +
        '<li><a href="' + esc(data.hubUrl) + '">bfloore.online</a></li>' +
      '</ul>';
  }

  function contactHtml(data) {
    var p = data.person;
    return '<p class="kicker">// contact</p>' +
      '<h2>Contact</h2>' +
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
      '<div class="qr-frame" role="img" aria-label="QR code that adds Barry Floore to a phone\'s contacts">' + data.qrSvg + '</div>' +
      '<p class="qr-note">Scan the code to add Barry Floore, or download the same contact card.</p>' +
      '<button type="button" class="btn primary" id="vcard">Download vCard</button>' +
      '<dl class="facts">' +
        '<div><dt>Phone</dt><dd>' + reachLink('voice', 'Call') + '</dd></div>' +
        '<div><dt>SMS</dt><dd>' + reachLink('sms', 'Text') + '</dd></div>' +
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

  var GROUPS = [
    { id: 'summary', title: 'Summary', ids: ['summary'] },
    { id: 'experience', title: 'Experience', ids: ['exp-ai', 'exp-cs', 'clinical'] },
    { id: 'projects', title: 'Projects', ids: ['projects'] },
    { id: 'education', title: 'Education', ids: ['education'] },
    { id: 'skills', title: 'Skills', ids: ['skills-ai', 'skills-ops', 'skills-health', 'skills-creative'] }
  ];

  function renderRole(job, level) {
    var org = [job.org, job.where].filter(Boolean).join(' · ');
    var bullets = (job.bullets || []).map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('');
    var tag = level === 4 ? 'h4' : 'h3';
    return '<div class="role"><div class="role-top"><' + tag + '>' + esc(job.title) + '</' + tag + '>' +
      (job.dates ? '<span class="when">' + esc(job.dates) + '</span>' : '') +
      '</div>' +
      (org ? '<p class="org">' + esc(org) + '</p>' : '') +
      (bullets ? '<ul>' + bullets + '</ul>' : '') +
      '</div>';
  }

  function renderRoles(entries, level) {
    var jobs = entries || [];
    if (!jobs.length) return '';
    var leadCount = jobs.length > 3 ? 2 : jobs.length;
    var html = jobs.slice(0, leadCount).map(function (job) { return renderRole(job, level); }).join('');
    var rest = jobs.slice(leadCount);
    if (!rest.length) return html;
    return html + '<details class="more"><summary>Earlier roles</summary>' +
      rest.map(function (job) { return renderRole(job, level); }).join('') + '</details>';
  }

  function renderSkills(items) {
    function list(rows) {
      return '<ul class="skills">' + rows.map(function (item) { return '<li>' + esc(item) + '</li>'; }).join('') + '</ul>';
    }
    var rows = items || [];
    if (rows.length <= 8) return list(rows);
    return list(rows.slice(0, 6)) + '<details class="more"><summary>More skills</summary>' + list(rows.slice(6)) + '</details>';
  }

  function trackBody(data, state, mod) {
    var variant = variantFor(data, state, mod);
    if (mod.kind === 'prose') {
      return '<div class="prose">' + variant.paragraphs.map(function (para) { return '<p>' + esc(para) + '</p>'; }).join('') + '</div>';
    }
    if (mod.kind === 'roles') return renderRoles(variant.entries, 4);
    if (mod.kind === 'credentials') {
      return variant.entries.map(function (job) {
        return '<div class="cred"><div class="role-top"><h3>' + esc(job.title) + '</h3>' +
          (job.dates ? '<span class="when">' + esc(job.dates) + '</span>' : '') +
          '</div>' +
          (job.org ? '<p class="org">' + esc(job.org) + '</p>' : '') +
          (job.notes ? '<p class="note">' + esc(job.notes) + '</p>' : '') +
          '</div>';
      }).join('');
    }
    if (mod.kind === 'items') {
      return variant.entries.map(function (it) {
        var href = it.href && /^https:\/\//.test(it.href) ? it.href : '';
        var name = href ? '<a href="' + esc(href) + '">' + esc(it.title) + '</a>' : esc(it.title);
        var links = (it.links || []).map(function (link) {
          if (!link || !link.href || !/^https:\/\//.test(link.href)) return '';
          return '<a href="' + esc(link.href) + '">' + esc(link.label || link.href) + '</a>';
        }).join('');
        return '<p class="item"><strong>' + name + '</strong><span>' + esc(it.text) + '</span>' +
          (links ? '<span class="links">' + links + '</span>' : '') + '</p>';
      }).join('');
    }
    if (mod.kind === 'skills') return renderSkills(variant.items);
    return '';
  }

  function trackHtml(data, state, mod, group) {
    var variant = variantFor(data, state, mod);
    var heading = mod.title === group.title ? (variant.kicker || '') : mod.title;
    var kicker = variant.kicker && heading !== variant.kicker ? '<p class="sub">' + esc(variant.kicker) + '</p>' : '';
    return '<div class="track" id="mod-' + esc(mod.id) + '">' +
      (heading ? '<h3 class="track-title">' + esc(heading) + '</h3>' : '') +
      kicker + trackBody(data, state, mod) + '</div>';
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
      return '<section class="card" id="' + group.id + '"><h2>' + esc(group.title) + '</h2>' +
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
