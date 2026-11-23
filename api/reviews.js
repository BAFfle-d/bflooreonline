/* ============================================================
   /api/reviews - buying guides for /shop/.
   Same reader as /api/feed, but this source is not merged into
   the writing feed. Cached like the blogroll.
   ============================================================ */
const { pull } = require('./feed.js');

const SRC = {
  id: 'reviews',
  label: 'Reviews',
  url: 'https://reviews.bfloore.online/rss.xml',
  home: 'https://reviews.bfloore.online',
  kind: 'review'
};

module.exports = async function handler(req, res) {
  const result = await pull(SRC);
  const items = (result.items || []).slice().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const data = {
    updated: new Date().toISOString(),
    home: SRC.home,
    ok: !!result.ok,
    count: items.length,
    items
  };
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.setHeader('cache-control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.setHeader('access-control-allow-origin', '*');
  res.status(200).send(JSON.stringify(data));
};
module.exports.pull = function () { return pull(SRC); };
