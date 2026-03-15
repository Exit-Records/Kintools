
# KIN-0XX — Decision Flip
Agent Build Specification (KIN Format)

## Purpose

Decision Flip is a minimal tool that helps users break decision paralysis.
Users paste a list of options and the tool randomly selects one.

The goal is **speed and simplicity**. The user should reach a decision in under 10 seconds.

---

# KIN Compliance Requirements

The tool MUST follow all KIN standards:

- Single self‑contained HTML file
- HTML, CSS, and JavaScript inline
- No external libraries, frameworks, fonts, APIs, or CDNs
- No analytics, tracking, cookies, accounts, or storage
- Must work offline after first load
- Lightweight and readable code

---

# Core Features

## 1. Option Input

Component: multiline textarea

Behaviour:
- User pastes or types options
- Each line represents one option
- Empty lines ignored

Example:

Pizza
Burger
Salad
Sushi

---

## 2. Decide Button

Primary action button.

Label:

Decide

Behaviour:

1. Read textarea lines
2. Remove empty entries
3. Randomly select one item
4. Display result prominently

Randomization method:

Math.random()

---

## 3. Result Display

Large centered text showing selected option.

Example:

Selected:
Sushi

Requirements:

- large font
- visually prominent
- immediate feedback

---

# Optional Enhancements

These features are recommended but not required.

## Shuffle Animation

Short animation (1–2 seconds) before revealing result.

Possible implementations:

- rapidly cycle through options
- fade transitions

Animation must be lightweight and not block functionality.

---

## Multi Pick

User can select number of picks:

Pick:
1
2
3

Tool randomly selects multiple unique items.

---

## Remove Selected

Option to remove chosen item from list after selection.

Useful for:

- drawing multiple winners
- prioritizing tasks

---

# UI Layout

Minimal layout.

Top section:

Title
Decision Flip

Middle:

Textarea for options

Below:

Decide button

Bottom:

Result display

Spacing should prioritize readability and quick interaction.

---

# UX Principles

Design must emphasize:

- zero learning curve
- instant action
- distraction free interface
- large readable output
- keyboard accessibility

Example flow:

1. Paste list
2. Click Decide
3. See result

---

# Edge Cases

Handle the following:

### No Input

If textarea empty:

Show message:

"Add at least one option."

---

### Single Option

If only one option exists:

Return that option without randomization.

---

### Duplicate Items

Duplicates are allowed and treated as separate entries.

---

# Accessibility

- button accessible via keyboard
- textarea focus on load
- readable contrast
- large result text

---

# Suggested Category

Utility

or

Mind Tools

---

# Catalog Metadata

Catalog Number: KIN-0XX  
Tool Name: Decision Flip  
Creator: KIN  
Type: Randomizer / Decision Tool

