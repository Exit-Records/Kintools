# Vunique — Fix List Round 5

Focus: Import security and input sanitisation
Required before: Share feature goes beyond the Exit Records Telegram group
Date: 2026-05-26

-----

## Overview

Imported JSON files are untrusted user input. Before the share feature goes public, every field from an imported file must be validated and sanitised before it touches the store. The attack vectors are low-sophistication but real: XSS via unsanitised fields, oversized files causing crashes, malformed types causing runtime errors, and javascript: scheme URLs rendering as clickable links.

None of these require a sophisticated attacker. A badly formed file shared in a group could affect everyone who imports it.

-----

## Fix 1 — Entry Sanitisation on Import (Priority: Critical)

**What to add**

A `sanitiseEntry` function that runs on every entry before it is written to the store. Applied in `importData`, `importPersonEntries`, and `addPersonFromJSON`.

```typescript
function sanitiseEntry(raw: unknown): Entry | null {
  if (typeof raw !== 'object' || raw === null) return null
  const e = raw as Record<string, unknown>

  // Required fields
  if (typeof e.url !== 'string') return null
  if (typeof e.title !== 'string') return null

  // URL scheme check -- reject anything that is not http or https
  const url = e.url.trim()
  if (!url.startsWith('http://') && !url.startsWith('https://')) return null
  if (url.length > 2048) return null

  // Optional fields -- type check and length cap
  const note = e.note && typeof e.note === 'string'
    ? e.note.trim().slice(0, 500)
    : undefined

  const category = e.category && typeof e.category === 'string'
    ? e.category.toLowerCase().trim().slice(0, 50)
    : undefined

  const via = e.via && typeof e.via === 'string'
    ? e.via.trim().slice(0, 100)
    : undefined

  // Tags -- must be array of strings, max 5, each max 50 chars
  const tags = Array.isArray(e.tags)
    ? e.tags
        .filter(t => typeof t === 'string')
        .slice(0, 5)
        .map(t => String(t).toLowerCase().trim().slice(0, 50))
    : []

  // Trail -- must be array of valid hops
  const trail = Array.isArray(e.trail)
    ? e.trail
        .filter(h => typeof h === 'object' && h !== null &&
                     typeof (h as Record<string, unknown>).handle === 'string' &&
                     typeof (h as Record<string, unknown>).date === 'string')
        .slice(0, 20)
        .map(h => ({
          handle: String((h as Record<string, unknown>).handle).trim().slice(0, 100),
          date: String((h as Record<string, unknown>).date).trim().slice(0, 10),
        }))
    : []

  return {
    id: generateId(),
    url,
    title: String(e.title).trim().slice(0, 200),
    note,
    category,
    tags,
    added: typeof e.added === 'string' ? e.added.trim().slice(0, 10) : today(),
    updated: typeof e.updated === 'string' ? e.updated.trim().slice(0, 10) : undefined,
    trail,
    via,
  }
}
```

**Apply in**

- `importData` – run `sanitiseEntry` on every entry in `data.entries` before processing duplicates
- `importPersonEntries` – run `sanitiseEntry` on every entry in `rawEntries` before merging
- `addPersonFromJSON` – run `sanitiseEntry` on every entry from the imported identity file

Entries that fail sanitisation (return `null`) are silently skipped. The import summary counts them as skipped rather than failing the whole import.

-----

## Fix 2 — Entry Count Cap on Import (Priority: Critical)

**What to add**

Reject or truncate files with an unreasonable number of entries before processing begins. A personal curation list does not need more than 500 entries. A file with 50,000 entries is either malicious or a mistake – either way it should not be allowed to exhaust device memory.

```typescript
const MAX_ENTRIES_PER_IMPORT = 500

// In importData and importPersonEntries, before processing:
if (data.entries && data.entries.length > MAX_ENTRIES_PER_IMPORT) {
  // Truncate silently and note in the import summary
  data.entries = data.entries.slice(0, MAX_ENTRIES_PER_IMPORT)
  // Show warning in import preview: "File contains more than 500 entries. First 500 imported."
}
```

The Worker already has a 500KB file size limit for uploaded files. The entry cap covers locally shared files that bypass the Worker.

-----

## Fix 3 — Graceful Error Handling on Import (Priority: Critical)

**What to add**

Wrap the entire import flow in a try/catch. A malformed file should produce a clear user-facing error, not a crashed tab or silent corruption of stored data.

```typescript
// In importData and importPersonEntries
try {
  const parsed = JSON.parse(fileContent)
  // ... import logic
} catch (error) {
  // Show inline error, do not write anything to store
  get().showToast('This file could not be imported. Check it is a valid Vunique JSON.')
  return { added: 0, updated: 0, skipped: 0 }
}
```

The error toast should be persistent (not auto-dismiss) when it is an import failure since the user needs to see it and understand why nothing was imported.

Error states to handle explicitly:

|Condition                      |Message                                                         |
|-------------------------------|----------------------------------------------------------------|
|Not valid JSON                 |“This file could not be read. Check it is a valid Vunique JSON.”|
|Valid JSON but not type vunique|“This does not appear to be a Vunique file.”                    |
|No entries array               |“This file has no entries.”                                     |
|All entries failed sanitisation|“No valid entries found in this file.”                          |
|Entry count exceeded           |“File contains more than 500 entries. First 500 imported.”      |

-----

## Fix 4 — URL Scheme Validation in UI (Priority: High)

**What to add**

Before rendering any URL from an imported entry as a clickable anchor, validate the scheme. This prevents `javascript:` URLs being rendered as clickable links anywhere in the app.

```typescript
function isSafeUrl(url: string): boolean {
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}
```

Apply in every component that renders entry URLs as anchor tags:

- `list-tab.tsx` – entry URL links
- `voices-tab.tsx` – entry URL links in person detail view
- `export-tab.tsx` – any URL preview rendering

If `isSafeUrl` returns false, render the URL as plain text rather than an anchor. No click, no navigation.

**Also apply to**

- Endorsement URLs in Voice tab
- Person URLs in Voices list
- Network URLs in Voice identity

-----

## Fix 5 — Prototype Pollution Prevention (Priority: Medium)

**What to add**

When parsing imported JSON, strip any keys that could pollute the JavaScript prototype before the object is used.

```typescript
function stripDangerousKeys(obj: Record<string, unknown>): Record<string, unknown> {
  const dangerous = ['__proto__', 'constructor', 'prototype']
  const clean: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (!dangerous.includes(key)) {
      clean[key] = value
    }
  }
  return clean
}
```

Apply to the top-level parsed object and to each entry object before sanitisation. Belt and braces – modern V8 handles most prototype pollution attempts but the defence costs nothing.

-----

## Fix 6 — Identity Field Sanitisation (Priority: High)

**What to add**

The same sanitisation discipline applied to entries must apply to the identity block of an imported file. When importing a person via JSON, sanitise their identity fields before storing them as a Person object.

```typescript
function sanitiseIdentity(raw: unknown): Partial<Person> | null {
  if (typeof raw !== 'object' || raw === null) return null
  const i = raw as Record<string, unknown>

  if (typeof i.handle !== 'string') return null

  return {
    handle: String(i.handle).toLowerCase().trim().slice(0, 100)
      .replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, ''),
    statement: i.statement && typeof i.statement === 'string'
      ? i.statement.trim().slice(0, 300)
      : undefined,
    contact: i.contact && typeof i.contact === 'string'
      ? i.contact.trim().slice(0, 200)
      : undefined,
  }
}
```

Note: handle normalisation is applied here too – an imported handle that contains uppercase or spaces is normalised to lowercase-with-hyphens before storage.

-----

## Fix 7 — Worker Upload Validation (Priority: High)

**What to add**

The Worker already validates that uploaded files are valid Vunique JSON. Add the same entry sanitisation at the Worker level so files stored in R2 are clean before anyone downloads them.

```typescript
// In handleUpload, after isValidVuniqueFile check
const sanitisedEntries = data.entries
  .map(sanitiseEntry)
  .filter((e): e is Entry => e !== null)
  .slice(0, 500)

const cleanData = {
  ...data,
  entries: sanitisedEntries,
}

// Store cleanData rather than the raw data object
await env.VUNIQUE_LISTS.put(`file:${slug}`, JSON.stringify(cleanData), ...)
```

This means files downloaded from the share service are pre-sanitised. The app-level sanitisation on import is still required as a second layer since files can be shared directly without going through the Worker.

-----

## Test Coverage

1. Import a JSON file where one entry has `note: <script>alert('xss')</script>`. Verify the note renders as plain text in the list view, not as executed script.
1. Import a JSON file with 600 entries. Verify import summary shows “First 500 imported” and exactly 500 entries are added.
1. Import a JSON file with an entry where `url` is `javascript:alert('xss')`. Verify the entry is either rejected entirely or the URL renders as plain text with no clickable link.
1. Import a JSON file that is valid JSON but not a Vunique file (e.g. `{"foo":"bar"}`). Verify error message shown, nothing written to store.
1. Import a malformed JSON file (syntax error). Verify error message shown, app does not crash, existing data intact.
1. Import a JSON file with `__proto__` key at the top level. Verify it is stripped and import proceeds normally.
1. Import a JSON file where the handle contains `<script>`. Verify it is stripped to an empty or safe string.
1. Upload a JSON file via the share endpoint with a `javascript:` URL entry. Verify it is stripped from the stored file. Download the file and verify the entry is absent or sanitised.
1. Import a JSON file where all entries fail sanitisation. Verify “No valid entries found” message shown.
1. Import a valid JSON file with mixed valid and invalid entries. Verify only valid entries are imported and the summary count is accurate.

-----

## Summary

These fixes are not optional before public launch. The share feature creates a direct vector for malicious files to be distributed to everyone in a group. The fixes are lightweight – sanitisation and validation at the import boundary – and do not change any user-facing behaviour for legitimate files. The cost of not implementing them is a single crafted JSON file being able to affect every Vunique user who imports it.