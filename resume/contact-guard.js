/* Hashes of personal contacts and one retired token.
   The source strings are not stored here. Compare a SHA-256 of a
   normalized email, a 10-digit phone, or a lowercase token. */
const crypto = require('crypto');

function sha256(value) {
  return crypto.createHash('sha256').update(String(value), 'utf8').digest('hex');
}

function normEmail(value) {
  return String(value).trim().toLowerCase();
}

function normPhone(value) {
  let digits = String(value).replace(/\D/g, '');
  if (digits.length === 11 && digits.charAt(0) === '1') digits = digits.slice(1);
  return digits;
}

const PERSONAL_EMAIL_HASHES = new Set([
  '26d8f57f7db775998f6b8c6ba394ee700402b8c0e24790dea28a4acd8e9f8e15',
  '7a5909821244998cf31757a165f526c033e5e0e46e3eea43e3999caf12bac77d'
]);

const PERSONAL_PHONE_HASHES = new Set([
  '9dc5c9363f0e4751d6dbba783604bdd83f6889d1c643cd7dcaa516361a9d9cd6',
  '8d61f82703a24dfcc179389a97e946c5c8c680f50bdb054484f0685cd91ade7c'
]);

const RETIRED_TOKEN_HASHES = new Set([
  '9b70b156835261d825014bc65f2f8d835cd0b638e95486accab780e2a338dfce'
]);

/* Business line. The page seals it. site.config.js may still carry it. */
const SEALED_PHONE_HASHES = new Set([
  'ef92771e9e08a6e770638dbde0771b26c76093c73d26a4dfc8a7f1e73f15549e'
]);

function emailsIn(text) {
  const found = [];
  const re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
  let match;
  while ((match = re.exec(String(text)))) found.push(normEmail(match[0]));
  return found;
}

function phonesIn(text) {
  const found = [];
  const re = /(?:\+?1[\s.-]?)?(?:\(?\d{3}\)?[\s.-]*)\d{3}[\s.-]?\d{4}/g;
  let match;
  while ((match = re.exec(String(text)))) {
    const digits = normPhone(match[0]);
    if (digits.length === 10) found.push(digits);
  }
  return found;
}

function tokensIn(text) {
  const found = [];
  const re = /[A-Za-z][A-Za-z0-9]{4,}/g;
  let match;
  while ((match = re.exec(String(text)))) found.push(match[0].toLowerCase());
  return found;
}

function personalHits(text) {
  const hits = [];
  emailsIn(text).forEach(function (email) {
    if (PERSONAL_EMAIL_HASHES.has(sha256(email))) hits.push('email');
  });
  phonesIn(text).forEach(function (phone) {
    if (PERSONAL_PHONE_HASHES.has(sha256(phone))) hits.push('phone');
  });
  tokensIn(text).forEach(function (token) {
    if (RETIRED_TOKEN_HASHES.has(sha256(token))) hits.push('token');
  });
  return hits;
}

function sealedPhoneHits(text) {
  const hits = [];
  phonesIn(text).forEach(function (phone) {
    if (SEALED_PHONE_HASHES.has(sha256(phone))) hits.push('phone');
  });
  return hits;
}

module.exports = {
  sha256: sha256,
  normEmail: normEmail,
  normPhone: normPhone,
  personalHits: personalHits,
  sealedPhoneHits: sealedPhoneHits
};
