/**
 * Vunique Share Worker
 *
 * Routes:
 *   POST   /upload          Upload a Vunique JSON file
 *   GET    /u/:slug         Preview page
 *   GET    /u/:slug/raw     Raw JSON download
 *   DELETE /u/:slug         Delete file (requires X-Delete-Token header)
 *   GET    /report          Report form (pre-fills ?slug=)
 *   POST   /report          Submit a report
 *
 * Scheduled:
 *   Cron 0 2 * * *          Delete files not re-uploaded in 90 days
 */

export interface Env {
  VUNIQUE_LISTS: R2Bucket
  REPORTS: KVNamespace
  BLOCKLIST: KVNamespace
}

// ── Types ────────────────────────────────────────────────────────────────────

interface VuniqueIdentity {
  handle: string
  statement?: string
  contact?: string
}

interface VuniqueEntry {
  id?: string
  url: string
  title: string
  note?: string
  category?: string
  tags?: string[]
  added?: string
  trail?: TrailHop[]
  via?: string
}

interface TrailHop {
  handle: string
  date: string
}

interface VuniqueExport {
  version: string
  type: string
  identity: VuniqueIdentity
  entries: VuniqueEntry[]
  meta?: {
    exported?: string
    generator?: string
  }
}

interface StoredMeta {
  deleteToken: string
  uploadedAt: string
  handle: string
  slug: string
}

interface ReportPayload {
  slug: string
  reason: string
  details?: string
}

// ── Rate limiting (in-memory, resets on cold start) ──────────────────────────

const uploadTimestamps = new Map<string, number>()

// ── Helpers ──────────────────────────────────────────────────────────────────

function normaliseSlug(handle: string): string {
  return handle
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function generateToken(length = 32): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes)
    .map(b => chars[b % chars.length])
    .join('')
}

function isValidVuniqueFile(data: unknown): data is VuniqueExport {
  if (typeof data !== 'object' || data === null) return false
  const d = data as Record<string, unknown>
  return (
    typeof d.version === 'string' &&
    d.type === 'vunique' &&
    typeof d.identity === 'object' &&
    d.identity !== null &&
    typeof (d.identity as Record<string, unknown>).handle === 'string' &&
    Array.isArray(d.entries)
  )
}

function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Delete-Token',
  }
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders() },
  })
}

function errorResponse(message: string, status: number): Response {
  return jsonResponse({ error: message }, status)
}

function htmlResponse(html: string, status = 200): Response {
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html;charset=UTF-8' },
  })
}

function summariseEntries(entries: VuniqueEntry[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const entry of entries) {
    const cat = entry.category?.toLowerCase() || 'other'
    counts[cat] = (counts[cat] || 0) + 1
  }
  return counts
}

function formatCategorySummary(counts: Record<string, number>): string {
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .map(([cat, n]) => `${n} ${cat}`)
    .join(', ')
}

// ── Notification via Google Apps Script ──────────────────────────────────────

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxBRGfOmtQUxyaBGjYVj2mtKinI7qlGm1v921K49TiBDP5RUY9CWK_M-vpLCm2HWJxhuA/exec'

async function sendReportNotification(report: ReportPayload): Promise<void> {
  await fetch(SHEETS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      form_type: 'report',
      subject: `Vunique report: ${report.slug}`,
      app: 'KIN-073',
      type: report.reason,
      description: [
        `Slug: ${report.slug}`,
        `Reason: ${report.reason}`,
        report.details ? `Details: ${report.details}` : '',
        `Preview: https://vunique.kintools.net/u/${report.slug}`,
      ].filter(Boolean).join('\n'),
    }),
  }).catch(() => {})
}

// ── Preview page ──────────────────────────────────────────────────────────────

function buildPreviewPage(data: VuniqueExport, slug: string, uploadedAt: string): string {
  const { identity, entries } = data
  const categorySummary = formatCategorySummary(summariseEntries(entries))
  const date = new Date(uploadedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const entryItems = entries
    .map(e => {
      const trail = (e.trail || [])
        .map(h => `<span class="hop">via ${h.handle}</span>`)
        .join('')
      return `<li>
        <a href="${e.url}" target="_blank" rel="noopener noreferrer">${e.title}</a>
        ${e.note ? `<p>${e.note}</p>` : ''}
        ${e.category ? `<span class="tag">${e.category}</span>` : ''}
        ${trail}
      </li>`
    })
    .join('\n')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${identity.handle} — Vunique</title>
  <meta name="description" content="${identity.statement || `A curated list by ${identity.handle}`}">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
    :root { --ink: #0a0a0a; --grey: #666; --light: #f5f5f0; --border: #e0e0d8; --accent: #2a5caa }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: var(--light); color: var(--ink); line-height: 1.6; padding: 2rem 1rem 4rem }
    .wrap { max-width: 680px; margin: 0 auto }
    header { margin-bottom: 2.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border) }
    h1 { font-size: 1.5rem; font-weight: 600; letter-spacing: -0.02em }
    .statement { margin-top: 0.5rem; color: var(--grey) }
    .meta { margin-top: 0.75rem; font-size: 0.8125rem; color: var(--grey) }
    ul { list-style: none }
    li { padding: 1rem 0; border-bottom: 1px solid var(--border) }
    li:last-child { border-bottom: none }
    li a { font-size: 1rem; font-weight: 500; color: var(--accent); text-decoration: none; display: block }
    li a:hover { text-decoration: underline }
    li p { margin-top: 0.35rem; font-size: 0.875rem; color: var(--grey) }
    .tag { display: inline-block; margin-top: 0.4rem; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.06em; color: var(--grey); border: 1px solid var(--border); border-radius: 3px; padding: 0.1rem 0.4rem }
    .hop { display: inline-block; margin-top: 0.3rem; font-size: 0.75rem; color: #999; margin-right: 0.35rem }
    .download { display: inline-block; margin-top: 2rem; font-size: 0.8125rem; color: var(--accent); text-decoration: none; border: 1px solid var(--border); border-radius: 4px; padding: 0.4rem 0.75rem; background: white }
    .download:hover { background: var(--border) }
    footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--border); font-size: 0.75rem; color: #999; display: flex; flex-wrap: wrap; gap: 0.5rem }
    footer a { color: #999; text-decoration: none }
    footer a:hover { text-decoration: underline }
    .sep { color: #ccc }
  </style>
</head>
<body>
  <div class="wrap">
    <header>
      <h1>@${identity.handle}</h1>
      ${identity.statement ? `<p class="statement">${identity.statement}</p>` : ''}
      <p class="meta">${entries.length} links &middot; ${categorySummary} &middot; shared ${date}</p>
    </header>
    <ul>${entryItems}</ul>
    <a class="download" href="/u/${slug}/raw" download="vunique-${slug}.json">Download JSON</a>
    <footer>
      <a href="https://kintools.net">KIN Tools</a>
      <span class="sep">&middot;</span>
      <a href="https://vunique.kintools.net">Vunique</a>
      <span class="sep">&middot;</span>
      <a href="/report?slug=${slug}">Report this list</a>
      <span class="sep">&middot;</span>
      <a href="https://kintools.net/terms">Terms</a>
    </footer>
  </div>
</body>
</html>`
}

// ── Report form page ──────────────────────────────────────────────────────────

function buildReportPage(slug: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Report a list — Vunique</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f0; color: #0a0a0a; padding: 2rem 1rem; line-height: 1.5 }
    .wrap { max-width: 480px; margin: 0 auto }
    h1 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem }
    p.sub { color: #666; font-size: 0.875rem; margin-bottom: 2rem }
    label { display: block; font-size: 0.8125rem; font-weight: 500; margin-bottom: 0.35rem }
    input, select, textarea { width: 100%; padding: 0.55rem 0.75rem; border: 1px solid #d0d0c8; border-radius: 5px; font-size: 0.9375rem; font-family: inherit; background: white; margin-bottom: 1.25rem }
    textarea { height: 6rem; resize: vertical }
    button { background: #0a0a0a; color: white; border: none; border-radius: 5px; padding: 0.65rem 1.25rem; font-size: 0.9375rem; cursor: pointer; width: 100% }
    button:hover { background: #333 }
    .success { display: none; background: #e8f5e9; border: 1px solid #a5d6a7; border-radius: 5px; padding: 1rem; font-size: 0.9375rem; color: #2e7d32; margin-top: 1rem }
    footer { margin-top: 2rem; font-size: 0.75rem; color: #999 }
    footer a { color: #999 }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Report a list</h1>
    <p class="sub">Reports are reviewed manually. Serious harm and CSAM are acted on immediately.</p>
    <form id="form">
      <label for="slug">List ID</label>
      <input id="slug" name="slug" type="text" value="${slug}" required>

      <label for="reason">Reason</label>
      <select id="reason" name="reason" required>
        <option value="">Select a reason…</option>
        <option value="csam">CSAM or content sexualising minors</option>
        <option value="harmful-links">Links to harmful content (violence, malware, fraud)</option>
        <option value="harassment">Targeted harassment</option>
        <option value="spam">Spam or not a Vunique list</option>
        <option value="other">Other</option>
      </select>

      <label for="details">Details (optional)</label>
      <textarea id="details" name="details" maxlength="500" placeholder="Describe the issue…"></textarea>

      <button type="submit">Submit report</button>
    </form>
    <div class="success" id="success">Report received. Thank you.</div>
    <footer><a href="https://kintools.net/terms">Terms</a> &middot; <a href="https://kintools.net">KIN Tools</a></footer>
  </div>
  <script>
    document.getElementById('form').addEventListener('submit', async function(e) {
      e.preventDefault()
      const slug = document.getElementById('slug').value.trim()
      const reason = document.getElementById('reason').value
      const details = document.getElementById('details').value.trim()
      const btn = e.target.querySelector('button')
      btn.disabled = true
      btn.textContent = 'Sending\u2026'
      try {
        const res = await fetch('/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, reason, details })
        })
        if (res.ok) {
          document.getElementById('form').style.display = 'none'
          document.getElementById('success').style.display = 'block'
        } else {
          btn.disabled = false
          btn.textContent = 'Submit report'
          alert('Something went wrong. Please email dbridge@mac.com directly.')
        }
      } catch {
        btn.disabled = false
        btn.textContent = 'Submit report'
        alert('Something went wrong. Please email dbridge@mac.com directly.')
      }
    })
  </script>
</body>
</html>`
}

// ── Upload ────────────────────────────────────────────────────────────────────

async function handleUpload(request: Request, env: Env): Promise<Response> {
  let data: unknown
  try {
    data = await request.json()
  } catch {
    return errorResponse('Invalid JSON body', 400)
  }

  if (!isValidVuniqueFile(data)) {
    return errorResponse('Not a valid Vunique file', 400)
  }

  const baseSlug = normaliseSlug(data.identity.handle)
  if (!baseSlug) {
    return errorResponse('Handle required to generate a share URL', 400)
  }

  const blocked = await env.BLOCKLIST.get(baseSlug)
  if (blocked) {
    return errorResponse('This handle has been blocked from the share service.', 403)
  }

  const lastUpload = uploadTimestamps.get(baseSlug)
  if (lastUpload && Date.now() - lastUpload < 60_000) {
    return new Response(JSON.stringify({ error: 'Too many uploads. Please wait a minute before trying again.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', ...corsHeaders() },
    })
  }

  const existingDeleteToken = request.headers.get('X-Delete-Token')
  if (existingDeleteToken) {
    const existingMeta = await env.VUNIQUE_LISTS.get(`meta:${baseSlug}`)
    if (existingMeta) {
      const meta: StoredMeta = await existingMeta.json()
      if (meta.deleteToken !== existingDeleteToken) {
        return errorResponse('Invalid delete token for overwrite', 403)
      }
    }
  }

  const deleteToken = generateToken()
  const uploadedAt = new Date().toISOString()

  const storedMeta: StoredMeta = {
    deleteToken,
    uploadedAt,
    handle: data.identity.handle,
    slug: baseSlug,
  }

  await env.VUNIQUE_LISTS.put(`file:${baseSlug}`, JSON.stringify(data))
  await env.VUNIQUE_LISTS.put(`meta:${baseSlug}`, JSON.stringify(storedMeta))

  uploadTimestamps.set(baseSlug, Date.now())

  return jsonResponse({
    url: `https://vunique.kintools.net/u/${baseSlug}`,
    slug: baseSlug,
    deleteToken,
    uploadedAt,
  })
}

// ── Preview ───────────────────────────────────────────────────────────────────

async function handlePreview(slug: string, env: Env): Promise<Response> {
  const [fileObject, metaObject] = await Promise.all([
    env.VUNIQUE_LISTS.get(`file:${slug}`),
    env.VUNIQUE_LISTS.get(`meta:${slug}`),
  ])

  if (!fileObject || !metaObject) {
    return htmlResponse(
      `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Not found — Vunique</title></head>` +
      `<body style="font-family:sans-serif;padding:2rem;color:#333">` +
      `<h1 style="margin-bottom:.5rem">List not found</h1>` +
      `<p>This list may have expired or been removed.</p>` +
      `<p style="margin-top:1rem"><a href="https://kintools.net/vunique" style="color:#2a5caa">About Vunique</a></p>` +
      `</body></html>`,
      404,
    )
  }

  const data: VuniqueExport = await fileObject.json()
  const meta: StoredMeta = await metaObject.json()

  return htmlResponse(buildPreviewPage(data, slug, meta.uploadedAt))
}

// ── Raw download ──────────────────────────────────────────────────────────────

async function handleRaw(slug: string, env: Env): Promise<Response> {
  const fileObject = await env.VUNIQUE_LISTS.get(`file:${slug}`)
  if (!fileObject) {
    return errorResponse('List not found', 404)
  }

  return new Response(await fileObject.text(), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="vunique-${slug}.json"`,
      'Cache-Control': 'public, max-age=60',
      ...corsHeaders(),
    },
  })
}

// ── Delete ────────────────────────────────────────────────────────────────────

async function handleDelete(request: Request, slug: string, env: Env): Promise<Response> {
  const deleteToken = request.headers.get('X-Delete-Token')
  if (!deleteToken) {
    return errorResponse('X-Delete-Token header required', 400)
  }

  const metaObject = await env.VUNIQUE_LISTS.get(`meta:${slug}`)
  if (!metaObject) {
    return errorResponse('List not found', 404)
  }

  const meta: StoredMeta = await metaObject.json()
  if (meta.deleteToken !== deleteToken) {
    return errorResponse('Invalid delete token', 403)
  }

  await env.VUNIQUE_LISTS.delete(`file:${slug}`)
  await env.VUNIQUE_LISTS.delete(`meta:${slug}`)

  return jsonResponse({ deleted: true, slug })
}

// ── Report (GET) ──────────────────────────────────────────────────────────────

function handleReportForm(request: Request): Response {
  const url = new URL(request.url)
  const slug = url.searchParams.get('slug') || ''
  return htmlResponse(buildReportPage(slug))
}

// ── Report (POST) ─────────────────────────────────────────────────────────────

async function handleReportSubmit(request: Request, env: Env): Promise<Response> {
  let payload: ReportPayload
  try {
    payload = await request.json() as ReportPayload
  } catch {
    return errorResponse('Invalid JSON body', 400)
  }

  const { slug, reason, details } = payload
  if (!slug || !reason) {
    return errorResponse('slug and reason are required', 400)
  }

  const cleanSlug = normaliseSlug(slug)
  const reportKey = `${cleanSlug}:${Date.now()}`

  await env.REPORTS.put(reportKey, JSON.stringify({
    slug: cleanSlug,
    reason,
    details: (details || '').slice(0, 500),
    reportedAt: new Date().toISOString(),
  }))

  if (reason === 'csam') {
    await Promise.all([
      env.VUNIQUE_LISTS.delete(`file:${cleanSlug}`),
      env.VUNIQUE_LISTS.delete(`meta:${cleanSlug}`),
      env.BLOCKLIST.put(cleanSlug, new Date().toISOString()),
    ])
  }

  await sendReportNotification({ slug: cleanSlug, reason, details })

  return jsonResponse({ received: true })
}

// ── Cron: 90-day retention cleanup ───────────────────────────────────────────

async function runRetentionCleanup(env: Env): Promise<void> {
  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000
  let cursor: string | undefined

  do {
    const listed = await env.VUNIQUE_LISTS.list({ prefix: 'meta:', cursor })

    for (const obj of listed.objects) {
      const metaObj = await env.VUNIQUE_LISTS.get(obj.key)
      if (!metaObj) continue
      const meta: StoredMeta = await metaObj.json()
      if (new Date(meta.uploadedAt).getTime() < cutoff) {
        await env.VUNIQUE_LISTS.delete(`file:${meta.slug}`)
        await env.VUNIQUE_LISTS.delete(`meta:${meta.slug}`)
      }
    }

    cursor = listed.truncated ? listed.cursor : undefined
  } while (cursor)
}

// ── Router ────────────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { method } = request
    const url = new URL(request.url)
    const pathname = url.pathname

    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() })
    }

    if (method === 'POST' && pathname === '/upload') {
      return handleUpload(request, env)
    }

    const rawMatch = pathname.match(/^\/u\/([a-z0-9-]+)\/raw$/)
    if (method === 'GET' && rawMatch) {
      return handleRaw(rawMatch[1], env)
    }

    const slugMatch = pathname.match(/^\/u\/([a-z0-9-]+)$/)
    if (slugMatch) {
      if (method === 'GET') return handlePreview(slugMatch[1], env)
      if (method === 'DELETE') return handleDelete(request, slugMatch[1], env)
    }

    if (pathname === '/report') {
      if (method === 'GET') return handleReportForm(request)
      if (method === 'POST') return handleReportSubmit(request, env)
    }

    return errorResponse('Not found', 404)
  },

  async scheduled(_event: ScheduledEvent, env: Env): Promise<void> {
    await runRetentionCleanup(env)
  },
}
