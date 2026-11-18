/* vCard 3.0 for the contact QR and the downloadable .vcf.
   The card carries the business line and the website. No personal email,
   and no personal phone number. */
function vcard(cfg) {
  const p = cfg.person;
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:' + p.family + ';' + p.given + ';;;',
    'FN:' + p.full,
    'TEL;TYPE=TEXT:' + p.workPhoneE164,
    'ADR;TYPE=WORK:;;' + p.city + ';' + p.region + ';;USA',
    'URL:' + cfg.hubUrl,
    'URL:' + p.linkedin,
    'END:VCARD'
  ];
  return lines.join('\r\n') + '\r\n';
}

module.exports = { vcard };
