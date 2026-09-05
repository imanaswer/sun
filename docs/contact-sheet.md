# Contact form → Google Sheet

Enquiries from `/contact` are appended to a Google Sheet by an Apps Script web
app. The site has no database, and a Vercel function's disk disappears when the
request ends — the sheet is the store.

## One-time setup

1. Create a Google Sheet named e.g. **Sun Umbrella — Contact enquiries**.
2. **Extensions → Apps Script**, delete the placeholder, paste
   [`scripts/contact-sheet.gs`](../scripts/contact-sheet.gs).
3. Generate a secret and put it in the script's `SECRET` constant:
   ```
   openssl rand -hex 32
   ```
4. **Deploy → New deployment → Web app**
   - *Execute as*: **Me**
   - *Who has access*: **Anyone** — the secret is the lock, not the URL.
   Copy the `/exec` URL it gives you.
5. Add three variables to `.env` locally and to **Vercel → Settings →
   Environment Variables** (Production + Preview):
   ```
   CONTACT_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/…/exec
   CONTACT_SHEET_SECRET=<the same secret as step 3>
   CONTACT_EXPORT_TOKEN=<a second `openssl rand -hex 32`>
   ```
   None of these take the `VITE_` prefix — that would ship them to the browser.
6. Redeploy the site so the functions pick the variables up.

After any edit to the script, **Deploy → Manage deployments → Edit → New
version**, or the old code keeps serving.

## Downloading the CSV

```
https://sunumbrella.in/admin/contacts.csv?token=<CONTACT_EXPORT_TOKEN>
```

Opens a `sun-umbrella-contacts-YYYY-MM-DD.csv` download, newest enquiry first.
The URL carries customers' names, phone numbers and addresses, so:

- with no `CONTACT_EXPORT_TOKEN` set the route answers **404**, not an open list;
- a wrong token answers 401, compared in constant time;
- the response is `no-store` and `X-Robots-Tag: noindex`.

Because the token sits in the query string it lands in browser history and
proxy logs. To keep it out of both:

```
curl -H "Authorization: Bearer $CONTACT_EXPORT_TOKEN" \
  https://sunumbrella.in/admin/contacts.csv -o contacts.csv
```

Rotate the token by changing the env var and redeploying — old links stop
working immediately. The sheet itself remains a fallback export
(**File → Download → CSV**) if the site is ever down.
