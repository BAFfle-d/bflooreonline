/* Client for the resume. Remixes, section toggles, the full CV view,
   the share URL, and the contact form. The form posts to /api/contact. */
(function () {
  var RS = globalThis.ResumeState;
  var R = globalThis.ResumeRender;

  function bootResume(data) {
    var catalog = { moduleIds: data.moduleIds, presets: data.presets };
    var state = RS.parseState(location.search, catalog);
    var who = document.getElementById('who');
    var sections = document.getElementById('sections');
    var remixes = document.getElementById('remixes');
    var toggles = document.getElementById('toggles');
    var adjust = document.getElementById('adjust');
    var deck = document.getElementById('deck');
    var cvBtn = document.getElementById('cv');
    var copied = document.getElementById('copied');
    var jump = document.getElementById('jump');

    who.innerHTML = R.whoHtml(data);
    document.getElementById('contact').innerHTML = R.contactHtml(data);

    function reachSpecs() {
      var c = R.openReach(data.person);
      return {
        voice: { href: 'tel:' + c.tel, label: 'Call', print: c.phone },
        sms: { href: 'sms:' + c.smsTel, label: 'Text', print: 'SMS ' + c.sms }
      };
    }

    function paintReach(mode) {
      var specs = reachSpecs();
      document.querySelectorAll('[data-reach]').forEach(function (el) {
        var spec = specs[el.getAttribute('data-reach')];
        if (!spec) return;
        el.setAttribute('href', spec.href);
        var printed = mode === 'print' && el.closest('.contact-line');
        el.textContent = printed ? spec.print : spec.label;
      });
    }

    paintReach('live');
    wireContactForm();
    document.getElementById('vcard').addEventListener('click', function () {
      var blob = new Blob([R.contactCard(data)], { type: 'text/vcard;charset=utf-8' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'Barry-Floore.vcf';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });

    function writeUrl(push) {
      var qs = RS.serializeState(state, catalog);
      var next = location.pathname + (qs ? '?' + qs : '');
      var current = location.pathname + location.search;
      if (next === current) return;
      if (push) history.pushState({ q: qs }, '', next);
      else history.replaceState({ q: qs }, '', next);
    }

    function focusAfter(key) {
      if (!key) return;
      var el = document.querySelector('[data-remix="' + key + '"], [data-module="' + key + '"]');
      if (!el && document.getElementById(key)) el = document.getElementById(key);
      if (el) el.focus();
    }

    function render(opts) {
      opts = opts || {};
      var focusKey = '';
      var active = document.activeElement;
      if (active && active.dataset) focusKey = active.dataset.remix || active.dataset.module || active.id || '';

      document.title = R.pageTitle(data, state) + ' · ' + data.siteTitle;
      deck.textContent = R.deckText(data, state);
      cvBtn.setAttribute('aria-pressed', state.view === 'cv' ? 'true' : 'false');
      remixes.innerHTML = R.remixesHtml(data, state);
      toggles.innerHTML = R.togglesHtml(data, state);
      var note = R.adjustHtml(data, state);
      adjust.hidden = !note;
      adjust.innerHTML = note;
      sections.innerHTML = R.sectionsHtml(data, state);
      if (jump) jump.innerHTML = R.navHtml(data, state);
      if (!opts.skipUrl) writeUrl(!!opts.push);
      focusAfter(focusKey);
    }

    remixes.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-remix]');
      if (!btn) return;
      state.view = 'resume';
      state.remix = btn.dataset.remix;
      state.on = RS.inOrder(data.moduleIds, data.presets[state.remix]);
      copied.textContent = '';
      render({ push: true });
    });

    toggles.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-module]');
      if (!btn) return;
      var id = btn.dataset.module;
      if (state.on.indexOf(id) !== -1) state.on = state.on.filter(function (x) { return x !== id; });
      else state.on = RS.inOrder(data.moduleIds, state.on.concat([id]));
      copied.textContent = '';
      render({ push: true });
    });

    cvBtn.addEventListener('click', function () {
      state.view = 'cv';
      state.on = data.moduleIds.slice();
      copied.textContent = '';
      render({ push: true });
    });

    adjust.addEventListener('click', function (e) {
      if (e.target.id !== 'reset') return;
      if (state.view === 'cv') state.on = data.moduleIds.slice();
      else state.on = RS.inOrder(data.moduleIds, data.presets[state.remix]);
      render({ push: true });
    });

    function legacyCopy(text) {
      return new Promise(function (resolve, reject) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
        document.body.removeChild(ta);
        ok ? resolve() : reject(new Error('copy'));
      });
    }

    document.getElementById('copy').addEventListener('click', function () {
      var url = location.href;
      var write = navigator.clipboard && navigator.clipboard.writeText
        ? navigator.clipboard.writeText(url).catch(function () { return legacyCopy(url); })
        : legacyCopy(url);
      write.then(function () { copied.textContent = 'Link copied.'; }, function () { copied.textContent = 'Copy the address bar to share this view.'; });
    });

    var closedDetails = [];
    window.addEventListener('beforeprint', function () {
      document.title = R.pageTitle(data, state);
      paintReach('print');
      closedDetails = [];
      document.querySelectorAll('details.more').forEach(function (el) {
        if (!el.open) { closedDetails.push(el); el.open = true; }
      });
    });
    window.addEventListener('afterprint', function () {
      document.title = R.pageTitle(data, state) + ' · ' + data.siteTitle;
      paintReach('live');
      closedDetails.forEach(function (el) { el.open = false; });
      closedDetails = [];
    });
    document.getElementById('pdf').addEventListener('click', function () { window.print(); });

    function wireContactForm() {
      var form = document.getElementById('contact-form');
      var statusEl = document.getElementById('form-status');
      var sendBtn = document.getElementById('contact-send');
      if (!form || !sendBtn || !statusEl) return;
      var widgetId = null;
      var ready = false;

      function setStatus(text) { statusEl.textContent = text; }

      function resetWidget() {
        if (widgetId != null && window.turnstile) window.turnstile.reset(widgetId);
      }

      function mountTurnstile(siteKey) {
        function renderWidget() {
          if (!window.turnstile) return;
          widgetId = window.turnstile.render('#turnstile', {
            sitekey: siteKey,
            action: 'contact',
            theme: 'dark'
          });
          ready = true;
          sendBtn.disabled = false;
          setStatus('');
        }
        if (window.turnstile) { renderWidget(); return; }
        var script = document.createElement('script');
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.addEventListener('load', renderWidget);
        script.addEventListener('error', function () {
          setStatus('The contact form is not available yet. Book a time still works.');
        });
        document.head.appendChild(script);
      }

      fetch('/api/contact', { headers: { Accept: 'application/json' } })
        .then(function (res) { return res.json(); })
        .then(function (body) {
          if (!body || !body.configured || !body.turnstileSiteKey) {
            setStatus('The contact form is not set up yet. Book a time still works.');
            return;
          }
          mountTurnstile(body.turnstileSiteKey);
        })
        .catch(function () {
          setStatus('The contact form is not available yet. Book a time still works.');
        });

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!ready || sendBtn.disabled) return;
        var token = window.turnstile && widgetId != null ? (window.turnstile.getResponse(widgetId) || '') : '';
        if (!token) {
          setStatus('Confirm the check, then send again.');
          return;
        }
        sendBtn.disabled = true;
        setStatus('Sending…');
        fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: form.name.value,
            email: form.email.value,
            message: form.message.value,
            company: form.company.value,
            'cf-turnstile-response': token,
            page: location.href
          })
        }).then(function (res) {
          return res.json().then(function (body) {
            return { ok: res.ok, body: body };
          }, function () {
            return { ok: false, body: {} };
          });
        }).then(function (out) {
          resetWidget();
          if (out.ok && out.body && out.body.ok) {
            form.reset();
            setStatus('Sent. Thanks for writing.');
          } else {
            setStatus((out.body && out.body.error) || 'The message could not be sent. Book a time, or try again later.');
          }
        }).catch(function () {
          resetWidget();
          setStatus('The message could not be sent. Book a time, or try again later.');
        }).then(function () {
          if (ready) sendBtn.disabled = false;
        });
      });
    }

    window.addEventListener('popstate', function () {
      state = RS.parseState(location.search, catalog);
      copied.textContent = '';
      render({ skipUrl: true });
    });

    render({ push: false });
  }

  globalThis.bootResume = bootResume;
})();
