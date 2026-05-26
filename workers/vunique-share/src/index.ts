/**
 * Vunique Share Worker
 * Handles upload, preview, raw download, and deletion of Vunique JSON files.
 *
 * Routes:
 *   POST   /upload          Upload a Vunique JSON file
 *   GET    /u/:slug         Preview page
 *   GET    /u/:slug/raw     Raw JSON download
 *   DELETE /u/:slug         Delete file (requires X-Delete-Token header)
 */

export interface Env {
  VUNIQUE_LISTS: R2Bucket
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

// Count entries per category for the preview page
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

// ── Preview page HTML ─────────────────────────────────────────────────────────

function buildPreviewPage(data: VuniqueExport, slug: string, uploadedAt: string): string {
  const { identity, entries } = data
  const categorySummary = formatCategorySummary(summariseEntries(entries))
  const date = new Date(uploadedAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${identity.handle} — Vunique</title>
  <meta name="description" content="${identity.statement || `A curated list by ${identity.handle}`}">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
    :root {
      --ink: #0a0a0a;
      --grey: #666;
      --dim: #999;
      --gold: #c8a86e;
      --bg: #fafaf8;
      --surf: #f0ede8;
      --border: #e0ddd8;
      --r: 4px;
    }
    body {
      font-family: system-ui, -apple-system, sans-serif;
      background: var(--bg);
      color: var(--ink);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1rem;
      padding-bottom: env(safe-area-inset-bottom);
    }
    .card {
      max-width: 480px;
      width: 100%;
      border: 0.5px solid var(--border);
      background: white;
      padding: 2rem;
    }
    .kicker {
      font-size: 9px;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--dim);
      margin-bottom: 12px;
    }
    .handle {
      font-size: 26px;
      font-weight: 500;
      color: var(--ink);
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    .statement {
      font-size: 14px;
      color: var(--grey);
      line-height: 1.6;
      margin-bottom: 20px;
    }
    .meta {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 14px 0;
      border-top: 0.5px solid var(--border);
      border-bottom: 0.5px solid var(--border);
      margin-bottom: 20px;
    }
    .meta-row {
      display: flex;
      gap: 8px;
      font-size: 12px;
    }
    .meta-label {
      color: var(--dim);
      min-width: 80px;
    }
    .meta-value {
      color: var(--grey);
    }
    .btn {
      display: block;
      width: 100%;
      padding: 14px;
      font-size: 13px;
      font-weight: 500;
      letter-spacing: 1px;
      text-transform: uppercase;
      text-align: center;
      text-decoration: none;
      background: var(--ink);
      color: var(--bg);
      border: none;
      border-radius: var(--r);
      cursor: pointer;
      transition: opacity 0.15s;
      min-height: 44px;
    }
    .btn:hover { opacity: 0.82 }
    .privacy {
      margin-top: 14px;
      font-size: 10px;
      color: var(--dim);
      line-height: 1.5;
      text-align: center;
    }
    .footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 0.5px solid var(--border);
      font-size: 10px;
      color: var(--dim);
      text-align: center;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .footer a { color: var(--dim); text-decoration: none }
    .footer a:hover { color: var(--grey) }
  </style>
</head>
<body>
  <div class="card">
    <div class="kicker">Vunique / Shared List</div>
    <div class="handle">${identity.handle}</div>
    ${identity.statement ? `<p class="statement">${identity.statement}</p>` : ''}
    <div class="meta">
      <div class="meta-row">
        <span class="meta-label">Entries</span>
        <span class="meta-value">${entries.length} &nbsp;·&nbsp; ${categorySummary}</span>
      </div>
      <div class="meta-row">
        <span class="meta-label">Updated</span>
        <span class="meta-value">${date}</span>
      </div>
      ${identity.contact ? `
      <div class="meta-row">
        <span class="meta-label">Contact</span>
        <span class="meta-value">${identity.contact}</span>
      </div>` : ''}
    </div>
    <a href="/u/${slug}/raw" download="vunique-${slug}.json" class="btn">
      Download JSON
    </a>
    <p class="privacy">
      This list was shared publicly by its owner.<br>
      Import into Vunique to browse it locally.
    </p>
    <div class="footer">
      <a href="https://kintools.net">KIN Tools</a>
      &nbsp;·&nbsp;
      <a href="https://kintools.net/vunique">Vunique</a>
    </div>
  </div>
</body>
</html>`
}

// ── Rate limiting ─────────────────────────────────────────────────────────────
// Simple in-memory rate limit -- one upload per slug per minute.
// Note: resets on Worker cold start. Good enough for this use case.
const uploadTimestamps = new Map<string, number>()

function isRateLimited(slug: string): boolean {
  const last = uploadTimestamps.get(slug)
  if (!last) return false
  return Date.now() - last < 60_000
}

function recordUpload(slug: string): void {
  uploadTimestamps.set(slug, Date.now())
}

// ── Handler ───────────────────────────────────────────────────────────────────

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const { method } = request
    const path = url.pathname

    // CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() })
    }

    // POST /upload
    if (method === 'POST' && path === '/upload') {
      return handleUpload(request, env)
    }

    // GET /u/:slug/raw
    const rawMatch = path.match(/^\/u\/([a-z0-9-]+)\/raw$/)
    if (method === 'GET' && rawMatch) {
      return handleRaw(rawMatch[1], env)
    }

    // GET /u/:slug
    const previewMatch = path.match(/^\/u\/([a-z0-9-]+)$/)
    if (method === 'GET' && previewMatch) {
      return handlePreview(previewMatch[1], env)
    }

    // DELETE /u/:slug
    const deleteMatch = path.match(/^\/u\/([a-z0-9-]+)$/)
    if (method === 'DELETE' && deleteMatch) {
      return handleDelete(request, deleteMatch[1], env)
    }

    return errorResponse('Not found', 404)
  },
}

// ── Upload ────────────────────────────────────────────────────────────────────

async function handleUpload(request: Request, env: Env): Promise<Response> {
  // Content type check
  const contentType = request.headers.get('Content-Type') || ''
  if (!contentType.includes('application/json')) {
    return errorResponse('Content-Type must be application/json', 400)
  }

  // Size check -- 500KB limit
  const contentLength = Number(request.headers.get('Content-Length') || 0)
  if (contentLength > 500_000) {
    return errorResponse('File too large. Maximum 500KB.', 413)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorResponse('Invalid JSON', 400)
  }

  // Validate Vunique file
  if (!isValidVuniqueFile(body)) {
    return errorResponse(
      'This does not appear to be a valid Vunique file. Check it contains version, type, identity.handle, and entries.',
      400
    )
  }

  const data = body as VuniqueExport
  const baseSlug = normaliseSlug(data.identity.handle)

  if (!baseSlug) {
    return errorResponse('Handle is required and must contain valid characters.', 400)
  }

  // Rate limiting
  if (isRateLimited(baseSlug)) {
    return new Response(
      JSON.stringify({ error: 'Too many uploads. Please wait a minute before uploading again.' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60',
          ...corsHeaders(),
        },
      }
    )
  }

  // Determine final slug -- check for existing file
  const existingDeleteToken = request.headers.get('X-Delete-Token')
  let slug = baseSlug

  const existingObject = await env.VUNIQUE_LISTS.get(`meta:${baseSlug}`)
  if (existingObject) {
    const existingMeta: StoredMeta = await existingObject.json()
    if (existingMeta.deleteToken === existingDeleteToken) {
      // Valid token -- overwrite at same slug
      slug = baseSlug
    } else {
      // Different user -- generate suffixed slug
      const suffix = generateToken(4)
      slug = `${baseSlug}-${suffix}`
    }
  }

  // Generate delete token
  const deleteToken = generateToken(32)
  const uploadedAt = new Date().toISOString()

  const meta: StoredMeta = { deleteToken, uploadedAt, handle: data.identity.handle, slug }

  // Store file and metadata in R2
  const fileContent = JSON.stringify(data)
  await env.VUNIQUE_LISTS.put(`file:${slug}`, fileContent, {
    httpMetadata: { contentType: 'application/json' },
    customMetadata: { uploadedAt, handle: data.identity.handle },
  })
  await env.VUNIQUE_LISTS.put(`meta:${slug}`, JSON.stringify(meta), {
    httpMetadata: { contentType: 'application/json' },
  })

  recordUpload(baseSlug)

  return jsonResponse({
    url: `https://vunique.kintools.net/u/${slug}`,
    slug,
    deleteToken,
    uploadedAt,
  })
}

// ── Preview ───────────────────────────────────────────────────────────────────

async function handlePreview(slug: string, env: Env): Promise<Response> {
  const fileObject = await env.VUNIQUE_LISTS.get(`file:${slug}`)
  if (!fileObject) {
    return new Response('List not found', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  const metaObject = await env.VUNIQUE_LISTS.get(`meta:${slug}`)
  const meta: StoredMeta = metaObject
    ? await metaObject.json()
    : { uploadedAt: new Date().toISOString(), deleteToken: '', handle: slug, slug }

  const data: VuniqueExport = await fileObject.json()
  const html = buildPreviewPage(data, slug, meta.uploadedAt)

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
      ...corsHeaders(),
    },
  })
}

// ── Raw download ──────────────────────────────────────────────────────────────

async function handleRaw(slug: string, env: Env): Promise<Response> {
  const fileObject = await env.VUNIQUE_LISTS.get(`file:${slug}`)
  if (!fileObject) {
    return errorResponse('List not found', 404)
  }

  const data = await fileObject.text()

  return new Response(data, {
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

  // Remove both file and metadata
  await env.VUNIQUE_LISTS.delete(`file:${slug}`)
  await env.VUNIQUE_LISTS.delete(`meta:${slug}`)

  return jsonResponse({ deleted: true, slug })
}
