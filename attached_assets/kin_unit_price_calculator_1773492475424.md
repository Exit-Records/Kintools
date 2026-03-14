# KIN-0XX --- Unit Price Calculator

## Overview

A fast tool for calculating the **true price per unit** of products
based on weight, volume, or quantity. Designed for quick comparisons
while shopping (e.g. 6-pack vs 2L bottle).

The tool runs entirely in the browser as a **single self‑contained HTML
file** with no dependencies, no tracking, and full offline capability
after first load.

------------------------------------------------------------------------

## Core Concept

Convert product price and size into a **normalized unit cost**.

Example

  Product          Price   Size        Unit Price
  ---------------- ------- ----------- ------------
  Coke 6 Pack      £4.50   6 × 330ml   £2.27 / L
  Coke 2L Bottle   £3.20   2L          £1.60 / L

Result: 2L bottle is cheaper per litre.

------------------------------------------------------------------------

# Core Features

## 1. Unit Price Calculation

Inputs: - Total price - Quantity / weight / volume - Unit type

Supported units: - ml - L - g - kg - item count - meter (optional)

Output: - price per unit - automatic rounding - normalized base unit

Example

£4.50 / 1.98L = £2.27 per litre

------------------------------------------------------------------------

## 2. Multi‑Item Comparison

Compare up to **3 products simultaneously**.

Example UI

Item A\
Price: £4.50\
Size: 6x330ml

Item B\
Price: £3.20\
Size: 2L

Output

Item B is 29% cheaper per litre.

------------------------------------------------------------------------

## 3. Pack Size Parser

Users can type common packaging formats:

Examples

6x330ml\
12x250g\
3x2L

Parser converts to total volume automatically.

Example

6 × 330ml = 1980ml = 1.98L

Implementation idea

Regex pattern examples:

(`\d+`{=tex})x(`\d+`{=tex})(ml\|g\|L\|kg)

------------------------------------------------------------------------

## 4. Unit Normalisation

The system converts units to a shared base before calculation.

Examples

750ml → 0.75L\
1500ml → 1.5L

This allows comparisons like:

750ml vs 1.5L\
500g vs 1kg

------------------------------------------------------------------------

## 5. Best Value Indicator

Instead of only displaying numbers, the tool highlights the cheapest
option.

Example output

✔ Best Value\
Option B is 29% cheaper.

Visual highlight: - green border - bold text

------------------------------------------------------------------------

## 6. Live Calculation

No submit button required.

Results update instantly when fields change.

This allows fast comparisons while standing in a shop aisle.

------------------------------------------------------------------------

## 7. Reverse Mode

Calculate product price if only the **unit price** is known.

Example

Unit price: £1.60 / L\
Bottle size: 750ml

Output

Estimated price = £1.20

------------------------------------------------------------------------

## Optional Feature (Lightweight)

### Camera Capture Mode

Open phone camera and capture price label.

Process

1.  Tap "Scan Label"
2.  Camera opens
3.  Freeze frame
4.  User taps price
5.  User taps size
6.  Fields auto‑populate

Uses browser API:

navigator.mediaDevices.getUserMedia()

No OCR required.

------------------------------------------------------------------------

# UI Design

Mobile‑first interface.

Large tap targets.

Fields:

Price Size / Pack Format Unit selector

Result card:

Price per unit Comparison result Best value badge

------------------------------------------------------------------------

# Data Handling

No storage required.

Optional: - temporary in‑memory comparison only

No: - cookies - analytics - tracking - accounts

------------------------------------------------------------------------

# Performance Goals

Single HTML file.

Target size:

\< 50 KB ideal\
\< 100 KB acceptable

Works offline after first load.

------------------------------------------------------------------------

# Example Use Case

User compares:

Coke 6 Pack\
£4.50\
6x330ml

Coke Bottle\
£3.20\
2L

Tool displays

6 Pack\
£2.27 per litre

Bottle\
£1.60 per litre

✔ Bottle is 29% cheaper

------------------------------------------------------------------------

# Kin Catalogue Entry

KIN‑0XX\
Unit Price Calculator

Find the true cost of products based on weight, volume, or quantity.

Features

• unit price calculation\
• pack size parser (6x330ml etc)\
• compare multiple items\
• automatic unit normalization\
• best value indicator\
• optional camera capture mode

Works offline.\
No accounts.\
No tracking.

------------------------------------------------------------------------

Creator: Kin Tools License: Open
