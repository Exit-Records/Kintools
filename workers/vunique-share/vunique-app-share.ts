/**
 * Vunique app — lib/share.ts
 *
 * Client functions for uploading, deleting, and fetching Vunique JSON files
 * from the vunique-share Worker at vunique.kintools.net
 */

const BASE_URL = 'https://vunique.kintools.net'

export interface UploadResponse {
  url: string
  slug: string
  deleteToken: string
  uploadedAt: string
}

export interface ShareState {
  url: string | null
  slug: string | null
  deleteToken: string | null
  uploadedAt: string | null
}

// Upload the user's Vunique JSON to the share service.
// Pass existingDeleteToken if the user has previously uploaded
// to allow overwriting the same URL.
export async function uploadList(
  data: object,
  existingDeleteToken?: string | null
): Promise<UploadResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (existingDeleteToken) {
    headers['X-Delete-Token'] = existingDeleteToken
  }

  const response = await fetch(`${BASE_URL}/upload`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  })

  if (response.status === 429) {
    throw new Error('Too many uploads. Please wait a minute before trying again.')
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Upload failed' }))
    throw new Error((error as { error: string }).error || 'Upload failed')
  }

  return response.json() as Promise<UploadResponse>
}

// Delete a previously uploaded list.
// Requires the delete token returned at upload time.
export async function deleteList(
  slug: string,
  deleteToken: string
): Promise<void> {
  const response = await fetch(`${BASE_URL}/u/${slug}`, {
    method: 'DELETE',
    headers: {
      'X-Delete-Token': deleteToken,
    },
  })

  if (response.status === 403) {
    throw new Error('Invalid delete token. Cannot remove this list.')
  }

  if (!response.ok) {
    throw new Error('Delete failed')
  }
}

// Fetch a Vunique JSON from a share URL or raw URL.
// Accepts both the preview URL (vunique.kintools.net/u/slug)
// and the raw URL (vunique.kintools.net/u/slug/raw).
// Normalises to the raw endpoint automatically.
export async function fetchFromShareUrl(url: string): Promise<object> {
  // Normalise to raw endpoint
  let rawUrl = url.trim()
  if (!rawUrl.endsWith('/raw')) {
    rawUrl = rawUrl.replace(/\/$/, '') + '/raw'
  }

  const response = await fetch(rawUrl)

  if (response.status === 404) {
    throw new Error('List not found. The owner may have removed it.')
  }

  if (!response.ok) {
    throw new Error('Could not fetch list')
  }

  return response.json()
}

// Validate that a URL looks like a Vunique share URL
export function isShareUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return (
      u.hostname === 'vunique.kintools.net' &&
      /^\/u\/[a-z0-9-]+/.test(u.pathname)
    )
  } catch {
    return false
  }
}
