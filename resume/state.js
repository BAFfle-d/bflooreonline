/* Shareable resume state: query string <-> remix, full CV, visible modules.
   Loaded by the browser bundle and by node tests. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ResumeState = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const REMIXES = ['general', 'ai', 'freelance', 'health', 'support', 'creative'];

  function sameList(a, b) {
    return a.length === b.length && a.every(function (v, i) { return v === b[i]; });
  }

  function inOrder(moduleIds, ids) {
    const want = new Set(ids);
    return moduleIds.filter(function (id) { return want.has(id); });
  }

  function parseState(search, catalog) {
    const raw = String(search || '').replace(/^\?/, '');
    const q = new URLSearchParams(raw);
    const view = q.get('view') === 'cv' ? 'cv' : 'resume';
    const asked = q.get('remix');
    const remix = REMIXES.indexOf(asked) !== -1 ? asked : 'general';
    const known = new Set(catalog.moduleIds);
    let on;
    if (q.has('on')) {
      on = q.get('on').split(',').map(function (s) { return s.trim(); }).filter(function (id) { return known.has(id); });
      on = inOrder(catalog.moduleIds, on);
    } else if (view === 'cv') {
      on = catalog.moduleIds.slice();
    } else {
      on = inOrder(catalog.moduleIds, catalog.presets[remix]);
    }
    return { view: view, remix: remix, on: on };
  }

  function serializeState(state, catalog) {
    const q = new URLSearchParams();
    if (state.view === 'cv') {
      q.set('view', 'cv');
      if (!sameList(state.on, catalog.moduleIds)) q.set('on', state.on.join(','));
      return q.toString();
    }
    if (state.remix !== 'general') q.set('remix', state.remix);
    const preset = inOrder(catalog.moduleIds, catalog.presets[state.remix] || []);
    if (!sameList(state.on, preset)) q.set('on', state.on.join(','));
    return q.toString();
  }

  return { REMIXES: REMIXES, parseState: parseState, serializeState: serializeState, sameList: sameList, inOrder: inOrder };
});
