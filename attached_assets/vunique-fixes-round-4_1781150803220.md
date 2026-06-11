# Vunique — Fix List Round 4

Build audited: `index.html` (single-file Vite bundle, 1.3MB)
Date: 2026-05-26

-----

## Fix 1 — Tab Name Consistency (Priority: High)

**What is wrong**

The rename from People/Identity to Voices/Voice is partially applied. `people` appears in lowercase in the codebase. `Voices` appears once but the tab rendering is inconsistent.

**What to fix**

Global find and replace across all component and store references:

|Old                       |Correct                 |
|--------------------------|------------------------|
|`people` (tab id)         |`voices`                |
|`identity` (tab id)       |`voice`                 |
|`People` (tab label)      |`Voices`                |
|`Identity` (tab label)    |`Voice`                 |
|`setActiveTab('people')`  |`setActiveTab('voices')`|
|`setActiveTab('identity')`|`setActiveTab('voice')` |
|`panel-people`            |`panel-voices`          |
|`panel-identity`          |`panel-voice`           |
|`tab-people`              |`tab-voices`            |
|`tab-identity`            |`tab-voice`             |

Check aria-labels, toast messages, and any internal navigation references that use the old tab names.

**Verify**

After rename, search for any remaining instances of `people` or `identity` as tab identifiers. Zero remaining instances expected.

-----

## Fix 2 — Trail Field Verification (Priority: High)

**What is wrong**

`addFromVoices` is present in the build but `TrailHop`, `buildTrailOnAdd`, and the `trail` field itself are absent. The function may exist without the trail being built or stored correctly. Entries added from Voices may not be carrying their trail.

**What to verify**

Open the app. Import `kiddrama-vunique.json`. Add an entry from Kid Drama’s list. Export your JSON. Open the exported file and check:

```json
{
  "trail": [
    { "handle": "kid-drama", "date": "2026-05-23" }
  ],
  "via": "kid-drama"
}
```

If `trail` is missing or `[]` on the entry, the `addFromVoices` function is not calling `buildTrailOnAdd` correctly.

**What to fix if trail is missing**

Ensure `addFromVoices` in the store builds the trail before storing the entry:

```typescript
addFromVoices: (sourceEntry: Entry, sourcePerson: Person) => {
  const newEntry: Entry = {
    ...sourceEntry,
    id: generateId(),
    added: today(),
    updated: undefined,
    trail: [
      ...(sourceEntry.trail || []),
      {
        handle: sourcePerson.handle,
        date: sourceEntry.added
      }
    ],
    via: sourcePerson.handle,
  }
  set(state => ({ entries: [newEntry, ...state.entries] }))
  get().showToast('Added to your list')
}
```

Ensure `trail: []` is set on all new entries added directly (not from Voices):

```typescript
addEntry: (entry) => {
  const newEntry: Entry = {
    ...entry,
    id: generateId(),
    added: today(),
    trail: [],
    tags: entry.tags || [],
  }
  ...
}
```

Ensure `trail` is included in the JSON export. It should not be stripped or omitted.

-----

## Fix 3 — Font Subsetting (Priority: Medium)

**What is wrong**

905KB of the 1.3MB file is embedded font data. 52 font chunks are present. The full variable font family has been embedded rather than just the weights and styles in use.

**Impact**

The file is 1.3MB. With font subsetting it should be under 500KB. Slower initial load, especially on mobile and poor connections.

**What to fix**

Identify which font weights and styles are actually used in the build. Likely:

- Regular (400)
- Medium (500)
- Bold (700)
- Italic (400i)

Subset the embedded fonts to these four variants only. In the Vite config, if using `vite-plugin-google-fonts` or similar:

```typescript
// Only embed the weights actually used
fonts: [
  'DM Sans:wght@400;500;700',
  'Source Serif 4:ital,wght@0,400;1,400'
]
```

If fonts are embedded via a CSS `@font-face` block with base64 data, remove the unused weight variants from the block manually.

**Target**

File size under 600KB after subsetting. Ideally under 500KB.

-----

## Fix 4 — Zustand Migration Warning (Priority: Low)

**What is wrong**

The following console warning fires on every load:

```
State loaded from storage couldn't be migrated since no migrate function was provided
```

This is a Zustand persist middleware warning. It fires when the stored schema version does not match the current version and no `migrate` function is provided to handle the difference.

**Impact**

Harmless in production but noisy in development and signals that schema versioning is not being handled. If the schema changes in future without a migration function, stored data could silently fail to load correctly.

**What to fix**

Add a version and migrate function to the Zustand persist config:

```typescript
persist(
  (set, get) => ({ ...store }),
  {
    name: 'vunique-storage',
    version: 1,
    migrate: (persistedState, version) => {
      // v0 -> v1: ensure trail field exists on all entries
      if (version === 0) {
        const state = persistedState as VuniqueState
        return {
          ...state,
          entries: state.entries.map(e => ({
            ...e,
            trail: e.trail || [],
          }))
        }
      }
      return persistedState as VuniqueState
    },
  }
)
```

This also handles the case where existing stored entries are missing the `trail` field – the migration adds it automatically on first load after the update, which is the correct behaviour for Fix 2.

-----

## KIN Verified Status After These Fixes

|Requirement                 |Current       |After fixes|
|----------------------------|--------------|-----------|
|No external requests at load|✓             |✓          |
|No tracking or analytics    |✓             |✓          |
|Safe area insets            |✓             |✓          |
|No user-scalable=no         |✓             |✓          |
|apple-touch-icon            |✓             |✓          |
|theme-color                 |✓             |✓          |
|Service worker / offline    |✓             |✓          |
|Tab names consistent        |✗             |✓ Fix 1    |
|Trail implemented correctly |✗ (unverified)|✓ Fix 2    |
|File size reasonable        |✗ 1.3MB       |✓ Fix 3    |
|No console warnings on load |✗             |✓ Fix 4    |

-----

## Test Sequence After Fixes

1. Open app. Verify tab bar shows List, Add, Voices, Voice, Export. No People or Identity anywhere.
1. Navigate to Voices tab via `setActiveTab`. Verify URL or state updates to `voices` not `people`.
1. Import `kiddrama-vunique.json`. Add Touch Music from Kid Drama’s list. Export your JSON. Open the file. Verify `trail: [{ "handle": "kid-drama", "date": "2026-01-30" }]` is present on the entry.
1. Add an entry directly in the Add tab. Export. Verify `trail: []` on that entry.
1. Check browser console on load. Verify no Zustand migration warning.
1. Check file size of built output. Verify under 600KB.
1. Open on a slow 3G connection or throttled in DevTools. Verify acceptable load time with reduced font payload.