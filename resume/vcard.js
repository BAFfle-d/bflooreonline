/* vCard 3.0 for the contact QR and the downloadable .vcf.
   Phones stay distinct: voice, then SMS. */
function vcard(cfg) {
  const p = cfg.person;
  /* Kept short so the QR stays coarse enough to scan off a screen.
     Voice and SMS stay separate TEL types. */
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:' + p.family + ';' + p.given + ';;;',
    'FN:' + p.full,
    'EMAIL:' + p.email,
    'TEL;TYPE=VOICE:' + p.phoneE164,
    'TEL;TYPE=CELL:' + p.smsE164,
    'ADR;TYPE=HOME:;;' + p.city + ';' + p.region + ';;USA',
    'URL:' + p.linkedin,
    'URL:' + cfg.hubUrl,
    'END:VCARD'
  ];
  return lines.join('\r\n') + '\r\n';
}

module.exports = { vcard };
