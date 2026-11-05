/* Client for the static resume. No network calls.
   Remixes, section toggles, the full CV view, and the share URL. */
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

    who.innerHTML = R.whoHtml(data);
    document.getElementById('contact').innerHTML = R.contactHtml(data);

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

    window.addEventListener('beforeprint', function () {
      document.title = R.pageTitle(data, state);
    });
    window.addEventListener('afterprint', function () {
      document.title = R.pageTitle(data, state) + ' · ' + data.siteTitle;
    });
    document.getElementById('pdf').addEventListener('click', function () { window.print(); });

    window.addEventListener('popstate', function () {
      state = RS.parseState(location.search, catalog);
      copied.textContent = '';
      render({ skipUrl: true });
    });

    render({ push: false });
  }

  globalThis.bootResume = bootResume;
})();
