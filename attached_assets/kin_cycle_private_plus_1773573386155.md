# KIN-0XX --- Cycle (Private+)

Category: Health\
Platform: KIN single‑file tool\
Architecture: Client‑side only • Offline capable • No tracking

------------------------------------------------------------------------

# Concept

Cycle (Private+) is a privacy‑first menstrual cycle tracker built around
one rule:

Your reproductive health data should **never leave your device.**

This tool intentionally avoids the architecture used by most health
apps.

There are:

No accounts\
No cloud sync\
No analytics\
No trackers\
No network calls

All data is stored locally using browser `localStorage`.

Because there is no backend, the data cannot be harvested, sold,
subpoenaed from a server, or used for profiling.

------------------------------------------------------------------------

# Core Features

## Start Period Logging

Primary button:

Start Period

Records the current date as the beginning of a cycle.

Example stored structure:

\[ { "start": "2026-03-15" }, { "start": "2026-02-17" }\]

Users can:

Add cycle start\
Add past entry\
Edit entry\
Delete entry

------------------------------------------------------------------------

## Automatic Cycle Prediction

Cycle length is calculated from the average interval between recorded
cycles.

Example:

Feb 17 → Mar 15 = 26 days

Prediction:

Next expected period → Apr 10

Displayed as:

Next Period\
Apr 10

In 25 days

------------------------------------------------------------------------

## Cycle Statistics

Average cycle length\
Shortest cycle\
Longest cycle\
Total cycles tracked

Example:

Average: 27 days\
Shortest: 25 days\
Longest: 29 days

------------------------------------------------------------------------

## Period Length Tracking

User can mark **period end**.

Example:

Start → Mar 15\
End → Mar 19

Calculated:

Length → 5 days

Average period length is displayed.

------------------------------------------------------------------------

## Fertility Window (Optional)

Toggle:

Enable Fertility Estimate

Calculated roughly as:

Ovulation ≈ 14 days before predicted period.

Example display:

Fertile Window\
Apr 1 -- Apr 5

Ovulation approx\
Apr 4

Disclaimer:

Estimates only. Not medical advice.

------------------------------------------------------------------------

## Symptom / Note Logging

Optional note field when logging cycle.

Examples:

cramps\
headache\
fatigue\
mood

Example storage:

{ "start": "2026-03-15", "note": "mild cramps" }

------------------------------------------------------------------------

## Calendar View

Minimal monthly calendar.

Legend:

● period start\
○ predicted period\
◇ fertile window

Tap a date to view entry or notes.

------------------------------------------------------------------------

## Cycle Timeline

Simple visual chart of cycle history.

Example:

Cycle History

27 \|■■■■■■\
26 \|■■■■■\
28 \|■■■■■■■

Implementation: simple CSS bars or canvas chart.

------------------------------------------------------------------------

## Irregularity Indicator

If cycle variability exceeds threshold (e.g. \>7 days difference):

Display notice:

Cycle variability detected.

This helps users notice irregular patterns.

------------------------------------------------------------------------

# Privacy Features

## Local‑Only Storage

Data stored with:

localStorage

No external data transfer.

------------------------------------------------------------------------

## Export Data

Button:

Export Data

Downloads:

cycle-data.txt

Example:

Cycle Log

2026-03-15\
2026-02-17\
2026-01-20

------------------------------------------------------------------------

## Delete All Data

Button:

Delete All Data

Requires confirmation.

Clears all stored data.

------------------------------------------------------------------------

# Advanced Privacy Tools

These features strengthen user trust.

## Panic Delete

Hidden gesture:

Tap logo **5 times quickly**.

Result:

Instantly clears all stored cycle data.

Confirmation message:

All local data erased.

Use case:

Allows immediate data removal if privacy is needed.

------------------------------------------------------------------------

## Optional PIN Lock

Users may set a **4 digit PIN**.

When enabled:

Tool requires PIN to open stored data.

PIN is stored locally (hashed if implemented).

Options:

Set PIN\
Change PIN\
Remove PIN

------------------------------------------------------------------------

# Install as Offline App

Users can install the tool to their phone using:

Add to Home Screen

This makes the tool behave like a private standalone app.

------------------------------------------------------------------------

# Privacy Transparency Panel

Visible section explaining guarantees:

Privacy Guarantee

This tool stores data only on your device.

No servers\
No accounts\
No analytics\
No tracking\
No data sharing

You can verify this by viewing the source code.

------------------------------------------------------------------------

# Interface Layout

Header:

KIN --- Cycle (Private+)

Main card:

Next Period\
Apr 10

In 25 days

Buttons:

Start Period\
Add Past Entry

Below:

Calendar\
Statistics\
Cycle timeline

Footer:

Local‑only health tool\
No accounts • No tracking

------------------------------------------------------------------------

# KIN Technical Constraints

Must follow KIN design rules:

Single HTML file\
Inline CSS\
Inline JavaScript\
No external libraries\
No frameworks\
Works offline after first visit

Target size ideally \<70kb.

------------------------------------------------------------------------

# Why This Tool Matters

Menstrual data is extremely sensitive.

Several popular tracking apps have been criticized for:

Selling reproductive data\
Sharing information with advertisers\
Linking health data to identity profiles

Cycle (Private+) removes this entire risk surface by **eliminating the
server entirely.**

------------------------------------------------------------------------

# Possible Names

Cycle (Private+)\
Quiet Cycle\
Moon Cycle\
Local Cycle\
Private Cycle

Cycle (Private+) communicates the privacy angle most clearly.

------------------------------------------------------------------------

# KIN Philosophy Fit

This tool strongly represents the KIN ethos:

Solve one real problem\
Respect user autonomy\
Avoid surveillance systems\
Be instantly usable\
Require zero onboarding

Privacy becomes a **core product feature**, not an afterthought.
