/**
 * Google Apps Script backing the Sun Umbrella contact form.
 * Paste this into Extensions → Apps Script on the sheet that should hold the
 * enquiries, then deploy it as a Web app. Setup: docs/contact-sheet.md
 *
 * POST {secret, row} appends a row. GET ?secret=… returns every row as JSON,
 * which the site turns into the CSV download.
 */

// Must match CONTACT_SHEET_SECRET in the site's environment.
const SECRET = 'PASTE_A_LONG_RANDOM_STRING_HERE';

const HEADERS = ['Submitted at', 'Name', 'Phone', 'Email', 'Address / City', 'Message'];

function sheet_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
  return sheet;
}

function json_(payload, status) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function doPost(e) {
  const body = JSON.parse(e.postData.contents);
  if (body.secret !== SECRET) return json_({ error: 'unauthorized' });

  const row = body.row || {};
  // A lock, because two people can submit at the same second and Apps Script
  // would otherwise write both into the same row.
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    sheet_().appendRow([
      row.submittedAt || new Date().toISOString(),
      row.name || '',
      row.phone || '',
      row.email || '',
      row.city || '',
      row.message || '',
    ]);
  } finally {
    lock.releaseLock();
  }
  sendAcknowledgement_(row.email);
  return json_({ ok: true });
}

/**
 * Thank-you email to the enquirer. Fixed text on purpose: echoing their name or
 * message would let anyone use the form to send our email to any address.
 * Sent from the Google account that owns this script (Gmail daily limits apply).
 */
function sendAcknowledgement_(email) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
  try {
    MailApp.sendEmail({
      to: email,
      replyTo: 'info@sunumbrellas.in',
      name: 'Sun Umbrella',
      subject: 'Thank you for contacting Sun Umbrella',
      body:
        'Thank you for contacting Sun Umbrella.\n\n' +
        'We have received your message and will get back to you within 24–48 working hours.\n\n' +
        'Warm regards,\nSun Umbrella Pvt. Ltd.\n+91 821 2514578 | info@sunumbrellas.in',
    });
  } catch (err) {
    // The row is already saved; a failed email must not fail the submission.
    console.error('Acknowledgement email failed: ' + err);
  }
}

function doGet(e) {
  if (!e || !e.parameter || e.parameter.secret !== SECRET) return json_({ error: 'unauthorized' });

  const values = sheet_().getDataRange().getValues();
  const rows = values.slice(1).map(function (r) {
    return {
      submittedAt: String(r[0]),
      name: String(r[1]),
      phone: String(r[2]),
      email: String(r[3]),
      city: String(r[4]),
      message: String(r[5]),
    };
  });
  // Newest first, matching what the CSV download should open on.
  rows.reverse();
  return json_({ rows: rows });
}
