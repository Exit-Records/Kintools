# Vunique — Content Policy and Reporting

## Overview

The Share feature hosts user-generated JSON files on kintools.net. The files contain URLs and text notes. This document covers prohibited content, the reporting mechanism, automatic retention limits, and the terms document required before public launch.

---

## What Vunique Share Hosts

Each uploaded file is a JSON document containing:
- A handle and statement (plain text)
- A list of URLs with titles, notes, categories, and tags
- A trail of handles showing how entries passed between people

Vunique Share does not host media files, images, audio, or video. It hosts structured text and URLs.

---

## Prohibited Content

The following are not permitted in any uploaded Vunique file:

- URLs pointing to child sexual abuse material (CSAM) or any content sexualising minors
- URLs pointing to content that facilitates violence, terrorism, or serious organised crime
- URLs pointing to phishing, malware, or fraudulent sites designed to harm recipients
- Notes or text that constitute targeted harassment of a named individual
- Content that violates applicable law in the jurisdiction of the uploader or kintools.net

Vunique Share is not a general file hosting service. It is designed for personal curation lists. Files that are clearly not Vunique lists or that exist solely to distribute harmful links will be removed without notice.

---

## Reporting

### On the preview page

Every preview page at `vunique.kintools.net/u/:slug` includes a small report link in the footer:

```
Report this list
```

Links to `vunique.kintools.net/report?slug=:slug`

### Report page

A minimal form. Three fields:

- Slug (pre-filled from URL parameter)
- Reason (dropdown: harmful links / harassment / spam / other)
- Details (optional free text, 500 char max)

On submit, the report is written to a Cloudflare KV store with the slug, reason, details, and timestamp. An email notification is sent to `dbridge@mac.com` via the existing Resend integration.

Reports are reviewed manually. Response target: 48 hours for CSAM (immediate removal, no review required) and serious harm reports, 7 days for others.

### CSAM zero tolerance

Any file containing URLs to CSAM is removed immediately on report, without review. The slug is added to a blocklist in KV. Re-upload of a blocked slug is rejected at the Worker level.

---

## Takedown Process

1. Report received via form or email to `dbridge@mac.com`
2. File reviewed against prohibited content list
3. If violation confirmed: DELETE both `file:{slug}` and `meta:{slug}` from R2, add slug to KV blocklist
4. Reporter notified by reply email if contact provided
5. Uploader is not notified (no accounts, no contact details held)

For DMCA / copyright notices: send to `dbridge@mac.com` with the slug, the specific content at issue, and a statement of ownership. Response within 14 days.

---

## Automatic Retention Limit

Files not re-uploaded within 90 days are automatically deleted.

Implementation: a Cloudflare Cron Trigger runs daily. It lists all objects in the `vunique-lists` R2 bucket, checks the `uploadedAt` timestamp in each `meta:{slug}` object, and deletes both `file:` and `meta:` objects where `uploadedAt` is older than 90 days.

```typescript
// wrangler.jsonc addition
"triggers": {
  "crons": ["0 2 * * *"]  // runs at 2am UTC daily
}

// In Worker
async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000
  const listed = await env.VUNIQUE_LISTS.list({ prefix: 'meta:' })
  for (const obj of listed.objects) {
    const meta = await env.VUNIQUE_LISTS.get(obj.key)
    if (!meta) continue
    const { uploadedAt, slug } = await meta.json() as StoredMeta
    if (new Date(uploadedAt).getTime() < cutoff) {
      await env.VUNIQUE_LISTS.delete(`file:${slug}`)
      await env.VUNIQUE_LISTS.delete(`meta:${slug}`)
    }
  }
}
```

Users are not notified before deletion. The uploaded state in the Vunique app shows the upload date -- users can see when their file was last shared and re-share to reset the clock.

A note on the info panel (first share confirmation) and the uploaded state:

```
Lists are automatically removed after 90 days of inactivity.
Re-share at any time to keep your link active.
```

---

## Terms of Service Page

A single page at `kintools.net/terms`. Plain language. No legal boilerplate.

---

### Draft terms

**KIN Tools — Terms of Use**

*Last updated: May 2026*

KIN Tools are free, privacy-first web apps built by Exit Records. These terms cover the Share feature in Vunique, which stores files on kintools.net servers. The rest of KIN Tools runs entirely on your device and is not subject to these terms.

**What you can share**

Vunique Share is for personal curation lists: URLs you have found and notes on why they matter. That is it.

**What you cannot share**

You may not upload files containing:
- Links to child sexual abuse material or content sexualising minors
- Links to content facilitating violence, terrorism, or serious organised crime
- Links to phishing, malware, or sites designed to harm people
- Targeted harassment of named individuals
- Anything illegal under applicable law

Violations result in immediate removal. Serious violations are reported to relevant authorities.

**Your data**

Uploaded files are stored on Cloudflare R2 infrastructure. They are publicly accessible to anyone with the link. They are automatically deleted after 90 days of inactivity. No user accounts are held. No analytics are collected. No data is sold or shared with third parties.

You can delete your file at any time using the Remove option in the Vunique app.

**Reporting**

To report a file: use the Report link on any preview page, or email dbridge@mac.com with the link and reason.

To request removal of your own content: email dbridge@mac.com with the link.

DMCA notices: email dbridge@mac.com. Include the specific content at issue and a statement of ownership.

**Liability**

KIN Tools makes no warranties about the content uploaded by users. We are not responsible for content on sites that Vunique lists link to. We act on valid reports promptly.

---

## Worker Changes Required

### New KV namespace

Add to `wrangler.jsonc`:

```jsonc
"kv_namespaces": [
  {
    "binding": "REPORTS",
    "id": "<kv-namespace-id>"
  },
  {
    "binding": "BLOCKLIST",
    "id": "<kv-namespace-id>"
  }
]
```

### Blocklist check on upload

In the upload handler, before processing:

```typescript
const blocked = await env.BLOCKLIST.get(baseSlug)
if (blocked) {
  return errorResponse('This handle has been blocked from the share service.', 403)
}
```

### Report endpoint

**POST /report**

```typescript
// Body: { slug, reason, details }
// Writes to REPORTS KV
// Sends email via Resend
```

**GET /report**

Returns the report form HTML page. Pre-fills slug from query parameter.

### Cron trigger

Add `scheduled` export to Worker for 90-day retention cleanup (see above).

### Preview page footer

Add to `buildPreviewPage()`:

```html
<div class="footer">
  <a href="https://kintools.net">KIN Tools</a>
  &nbsp;·&nbsp;
  <a href="https://kintools.net/vunique">Vunique</a>
  &nbsp;·&nbsp;
  <a href="/report?slug=${slug}">Report this list</a>
  &nbsp;·&nbsp;
  <a href="https://kintools.net/terms">Terms</a>
</div>
```

---

## Pre-launch Checklist

Before share feature goes beyond Exit Records Telegram group:

- [ ] Terms page live at kintools.net/terms
- [ ] Report endpoint live and sending emails
- [ ] Blocklist KV namespace created
- [ ] CSAM removal procedure documented and understood
- [ ] 90-day cron trigger deployed and tested
- [ ] Report link visible on all preview pages
- [ ] Info panel updated to mention 90-day retention limit
- [ ] dbridge@mac.com monitored for takedown requests
