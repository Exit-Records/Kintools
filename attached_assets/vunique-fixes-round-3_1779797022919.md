# Vunique — Fix List Round 3

Date: 2026-05-26

-----

## Fix 1 — Remove Source Filter (Priority: High)

**Decision**

The source/domain filter is removed from both the own list view and the person detail view in Voices.

**Reasoning**

Category and tags provide sufficient filtering. The source filter adds complexity without enough return:

- Single-entry domains create noise – a chip for `deformative.com` covering one entry is not useful
- At scale the source row becomes a long list of rarely-needed filters that clutters the interface
- Inconsistent categorisation is the underlying problem the filter was solving – better curation is the right answer, not another filter layer
- The Bandcamp scenario that motivated the feature is more relevant at the Voices level (seeing the same domain across multiple people’s lists independently) than at the individual list level

**What to remove**

- Source chip row from `list-tab.tsx`
- Source chip row from the person detail view in `voices-tab.tsx`
- `extractDomain` function from `lib/utils.ts` – no longer needed
- `activeDomain` / `listDomain` state from both components
- The combined category + domain filter logic
- The SUBDOMAIN_PLATFORMS constant and subdomain normalisation logic
- The “SOURCE” label and its associated section
- Any references to domain filtering in the store

**What stays**

Category chip filter remains on both views. Tags remain on entries. No other filter changes.

**Fix list updates**

Round 2 Fix 3 (Source filter label rename from DOMAIN to SOURCE) is withdrawn – the feature is removed entirely.

Round 2 Fix 4 (Bandcamp subdomain collapse) is withdrawn – the feature is removed entirely.

Round 1 Fix 5 (Source filter on own list) is withdrawn – the feature is removed entirely.

-----

## Fix 2 — Tags Available on Add (Priority: High)

**What is wrong**

Tags are only accessible after an entry has been created, via the edit flow. They should be available in the add form at the point of creation – the same way category is.

**Fix**

Add the tags input to `add-tab.tsx` between the category selector and the via field:

```
URL *
Title *
Note
Category  [ chips ]
Tags       [ chip input ]
Via
```

### Tags input behaviour

Tags render as removable chips. A text input at the end of the chip row adds new tags on Enter or comma. Tapping an existing chip removes it.

```tsx
<div className="flex flex-col gap-2">
  <label className="text-xs uppercase tracking-wider text-muted-foreground">
    Tags
  </label>
  <div className="flex flex-wrap gap-2 p-3 border border-border min-h-[44px]">
    {tags.map((tag, i) => (
      <button
        key={i}
        onClick={() => removeTag(i)}
        className="text-xs px-2 py-1 border border-border flex items-center gap-1 min-h-[44px]"
      >
        {tag} ×
      </button>
    ))}
    <input
      type="text"
      value={tagInput}
      onChange={e => setTagInput(e.target.value)}
      onKeyDown={handleTagKeyDown}
      placeholder={tags.length === 0 ? "Add tags..." : ""}
      className="flex-1 min-w-[80px] text-sm bg-transparent outline-none"
    />
  </div>
  <p className="text-xs text-muted-foreground">
    Enter or comma to add · tap to remove · three max recommended
  </p>
</div>
```

### Tag normalisation

Tags normalised to lowercase on add, consistent with Fix 1 from Round 2:

```typescript
const addTag = (input: string) => {
  const normalised = input.trim().toLowerCase()
  if (!normalised || tags.includes(normalised)) return
  setTags([...tags, normalised])
  setTagInput('')
}

const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault()
    addTag(tagInput)
  }
  // Backspace on empty input removes last tag
  if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
    setTags(tags.slice(0, -1))
  }
}
```

### State

Add `tags` and `tagInput` state to the add form, reset to `[]` and `''` on successful save or cancel.

### Edit mode consistency

The edit flow already has tags. Verify it uses the same component and the same normalisation. If not, align both to the same implementation.

-----

## Fix 3 — Add Record Shops Category (Priority: Low)

**Decision**

Add `record shops` to the preloaded category set.

**Updated preloaded categories**

```
music  label  writing  tool  community  art  person  place  film  record shops  other
```

Eleven categories. Record shops sits between film and other.

**Reasoning**

Record shops are a distinct curatorial context – not a place in the general sense, not a label, not a tool. The trust network that Vunique is modelling has always run through record shops. Rough Trade, Phonica, Rush Hour, Drift – these deserve their own category rather than being lumped into place or other.

**What to update**

- `PRELOADED_CATEGORIES` constant wherever it is defined in the codebase
- Category chip selector in `add-tab.tsx`
- Category chip selector in edit mode
- The preloaded categories section in the how-it-works PDF and any other documentation that lists them

**Note on wrapping**

Eleven chips may wrap to two rows on narrow screens. This is acceptable. The chip row already wraps for custom categories – record shops adds one more and the layout handles it. Verify on 375px viewport that the row remains readable and all chips meet the 44px touch target minimum.

-----

## Combined Test Sequence

1. Open Add tab. Verify tags input is present between category and via fields.
1. Type a tag and press Enter. Verify chip appears. Type another and press comma. Verify chip appears. Tap a chip to remove it. Verify it disappears.
1. Type “Electronic” with capital E. Press Enter. Verify stored as “electronic”.
1. Add a duplicate tag. Verify it is not added a second time.
1. Press Backspace on empty tag input. Verify last tag is removed.
1. Save entry with tags. Open entry detail. Verify tags are present and correct.
1. Open Add tab. Verify record shops chip is present in the category selector.
1. Select record shops. Save entry. Verify category filter in list view includes a record shops chip.
1. Open list view on a 375px viewport. Verify category chips wrap cleanly and remain tappable.
1. Edit an existing entry. Verify tags field uses the same chip input component as add. Verify same normalisation applies.