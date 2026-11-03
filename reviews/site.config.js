/* ============================================================
   reviews.bfloore.online — the only file you should need to edit
   besides the posts themselves.
   ============================================================ */
module.exports = {
  siteTitle: 'b. floore reviews',
  siteTagline: 'Tested, argued over, and written up by someone who reads the fine print.',
  siteUrl: 'https://reviews.bfloore.online',
  hubUrl: 'https://www.bfloore.online',
  author: 'b. floore',

  /* Your Amazon Associates tracking ID, e.g. 'bfloore-20'.
     Every amazon.com link in a post gets ?tag=<this> added automatically.
     Leave empty and links are left exactly as you wrote them.
     (You can also set AMAZON_TAG in Vercel's environment variables.) */
  amazonTag: process.env.AMAZON_TAG || '',

  /* Any other store whose links are affiliate links (your dropshipping
     storefronts, other programs). Links to these hosts get marked
     rel="sponsored nofollow" like Amazon links do. */
  affiliateHosts: ['amazon.com', 'amzn.to', 'amzn.com'],

  /* Shown at the top of any post that contains an affiliate link.
     The first sentence is the wording Amazon requires. */
  disclosure: 'As an Amazon Associate I earn from qualifying purchases. Links marked “affiliate” on this page may earn me a commission at no cost to you. I only write up things I would recommend to a friend.',

  /* Niche labels as they should appear on the site. A post's `niche:`
     line is matched against the keys; unknown niches show as written. */
  niches: {
    pets: 'Pets',
    home: 'Home',
    tech: 'Tech',
    books: 'Books',
    health: 'Health & Care',
    kids: 'Kids & Learning'
  }
};
