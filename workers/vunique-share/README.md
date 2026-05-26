# vunique-share Worker

Cloudflare Worker handling upload, preview, raw download, and deletion of Vunique JSON files.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /upload | Upload a Vunique JSON file |
| GET | /u/:slug | Preview page |
| GET | /u/:slug/raw | Raw JSON download |
| DELETE | /u/:slug | Delete (requires X-Delete-Token header) |

## Setup

### 1. Create R2 bucket

In Cloudflare dashboard: R2 → Create bucket → name it `vunique-lists`

### 2. Add DNS record

In Cloudflare DNS for kintools.net:
- Type: CNAME
- Name: vunique
- Target: your Workers subdomain (e.g. vunique-share.yourname.workers.dev)
- Proxied: yes

### 3. Add custom domain to Worker

In Workers dashboard → vunique-share → Settings → Domains → Add custom domain → vunique.kintools.net

### 4. Deploy

```bash
cd workers/vunique-share
npm install
wrangler deploy
```

### 5. Test

```bash
# Upload a test file
curl -X POST https://vunique.kintools.net/upload \
  -H "Content-Type: application/json" \
  -d '{"version":"1.0","type":"vunique","identity":{"handle":"test-user"},"entries":[]}'

# Preview
curl https://vunique.kintools.net/u/test-user

# Raw download
curl https://vunique.kintools.net/u/test-user/raw

# Delete (use token from upload response)
curl -X DELETE https://vunique.kintools.net/u/test-user \
  -H "X-Delete-Token: <token>"
```

## File locations in repo

```
workers/
  vunique-share/
    src/
      index.ts          ← Worker source
      types.ts          ← Shared types
    package.json
    tsconfig.json
    wrangler.jsonc

app/
  lib/
    share.ts            ← Client library for Vunique app
```

## Rate limiting

One upload per slug per minute. Resets on Worker cold start.
Not persistent across instances -- acceptable for this use case.

## Storage

Files stored in R2 under two keys per upload:
- `file:{slug}` — the JSON content
- `meta:{slug}` — delete token, upload timestamp, handle

No user data beyond what is in the Vunique JSON itself.
No analytics. No tracking.
