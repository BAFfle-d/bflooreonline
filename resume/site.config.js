/* ============================================================
   resume.bfloore.online — site identity and contact.
   The resume sections live in content.js.
   Personal email and personal phone numbers are not stored here.
   The contact form recipients stay in the Pages environment.
   ============================================================ */
module.exports = {
  siteTitle: 'b. floore resume',
  siteTagline: 'Interactive resume for Barry Floore, writer, composer, producer, and AI data trainer. Jacksonville, FL. 100% remote.',
  siteUrl: 'https://resume.bfloore.online',
  hubUrl: 'https://www.bfloore.online',
  reviewsUrl: 'https://reviews.bfloore.online',
  calendlyUrl: 'https://calendly.com/barryfloore',
  author: 'b. floore',
  /* An empty portfolio string renders no link. */
  portfolios: {
    instagram: 'https://www.instagram.com/barrylikethefruit/',
    adobeStock: 'https://stock.adobe.com/contributor/210767491/Barry',
    getty: 'https://www.istockphoto.com/portfolio/BFloore'
  },
  person: {
    given: 'Barry',
    family: 'Floore',
    display: 'b. floore',
    full: 'Barry Floore',
    /* Schema only. The visible header stays Barry Floore / b. floore. */
    alternateName: ['b. floore', 'Michael Floore'],
    /* Business line for the vCard and QR only. The hub lists it as text only. */
    workPhone: '904-297-8201',
    workPhoneE164: '+1-904-297-8201',
    city: 'Jacksonville',
    region: 'FL',
    country: 'United States',
    localityLabel: 'Jacksonville, FL',
    remote: '100% remote',
    linkedin: 'https://linkedin.com/in/mbfloore',
    linkedinLabel: 'linkedin.com/in/mbfloore'
  }
};
