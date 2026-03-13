# Kin QR Builder --- Specification

## Overview

A privacy-first QR code generator designed for the Kin ecosystem.\
All functionality runs entirely in the browser. No data is transmitted,
stored, or tracked.

Principles: - Single HTML file - No external dependencies unless
absolutely necessary - Works offline once loaded - No analytics,
cookies, accounts, or data collection - Transparent and minimal design

------------------------------------------------------------------------

# Core Function

## Instant QR Generation

The QR code updates live as the user types or pastes content.

No generation button required.

Supported input types: - URL - Plain text - Email (mailto) - Phone
number (tel) - SMS (sms) - Wi‑Fi credentials - Contact card (vCard)

These cover the majority of real-world QR usage.

------------------------------------------------------------------------

# Visual Controls

## Size Control

Slider to change output size.\
Preview updates instantly.

## Error Correction Level

Selectable levels: - L - M - Q - H

Higher levels allow the code to remain readable even when partially
obstructed.

## Quiet Zone Toggle

Option to enable or disable the border padding around the QR code.

## Colour Controls

Foreground colour picker\
Background colour picker

The interface should warn users if colour contrast becomes too low for
reliable scanning.

------------------------------------------------------------------------

# Export Options

Users can export the QR code as:

-   PNG
-   SVG
-   Copy to clipboard

SVG is important because it scales perfectly for printing or design
work.

------------------------------------------------------------------------

# Usability Features

## Live Preview

A large central preview showing the generated QR code.

## Input Type Auto Detection

The system detects common formats automatically.

Examples: - https://example.com → URL - email@example.com → Email -
+123456789 → Phone

Users can manually override the detected type.

## Character Counter

Displays how much data is encoded.

Example: 132 / 2953 characters

This helps users avoid exceeding QR limits.

------------------------------------------------------------------------

# Privacy Transparency

The interface should clearly display a statement such as:

"All QR generation happens in your browser.\
No data is sent, stored, or tracked.\
Works offline."

This reinforces the Kin privacy philosophy.

------------------------------------------------------------------------

# Optional Features

## Wi‑Fi QR Helper

Instead of manually typing the Wi‑Fi string format, provide fields:

-   Network name (SSID)
-   Password
-   Encryption type (WPA / WEP / None)

The tool builds the correct QR string automatically.

## Contact Card Builder

Simple fields:

-   Name
-   Phone
-   Email
-   Website

The tool generates a vCard QR code.

## Print Mode

A high-contrast printable layout optimized for physical labels or
posters.

------------------------------------------------------------------------

# Features to Avoid

To maintain Kin standards, the following should not be included:

-   QR analytics
-   scan tracking
-   dynamic QR codes
-   login systems
-   cloud storage
-   link shorteners

These require servers and violate the privacy-first model.

------------------------------------------------------------------------

# Ideal Interface Layout

KIN QR BUILDER

Input\
Paste text, URL, Wi‑Fi details, or contact info.

Type\
Auto \| URL \| Text \| Email \| Phone \| WiFi \| Contact

Options\
Size\
Error correction\
Foreground colour\
Background colour\
Quiet zone

Preview\
Large QR display

Export\
PNG \| SVG \| Copy

Footer\
All processing happens locally.\
No data leaves your browser.

------------------------------------------------------------------------

# Technical Notes

The tool can be implemented as a single HTML file containing:

-   HTML
-   CSS
-   JavaScript

A small embedded QR generation library (approximately 5--10 KB minified)
can be included directly in the file.

No external network calls are required.

------------------------------------------------------------------------

# Why This Fits the Kin Ecosystem

A QR builder is ideal for Kin because it is:

-   Privacy preserving
-   Universally useful
-   Offline capable
-   Extremely lightweight
-   Timeless in functionality

Many existing QR generators log or store user data.\
A Kin implementation becomes a trusted alternative that aligns with the
ecosystem's values.
