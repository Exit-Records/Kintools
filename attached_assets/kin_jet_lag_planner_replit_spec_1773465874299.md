
# KIN — Jet Lag Planner
Replit Builder Specification

Catalog concept:
A lightweight browser tool that helps travellers minimise jet lag using circadian rhythm principles.

KIN principles:
- Single self‑contained HTML file
- HTML + CSS + JS inline
- No accounts
- No tracking
- No analytics
- No cookies
- Runs client‑side only
- Works offline after first visit
- Solves one clear problem quickly
- Typical use time: under 2 minutes

---

# Core Tool Concept

The Jet Lag Planner generates a **circadian adjustment plan** based on:

• origin time zone  
• destination time zone  
• departure time  
• arrival time  
• optional usual sleep schedule  

The tool then calculates:

• timezone difference  
• direction of travel (east or west)  
• estimated circadian shift rate  
• daily adjustment schedule  
• sunlight exposure recommendations  
• sleep timing suggestions  
• circadian fatigue window  

Output is presented as a **visual timeline + simple plan**.

---

# Required Inputs

UI Inputs:

Origin Time Zone  
Destination Time Zone  

Departure Time (optional)  
Arrival Time  

Usual Sleep Time (optional)  
Usual Wake Time (optional)

Buttons:

Generate Plan

Optional:

Airport Mode (minimal inputs)

---

# Output

The planner generates:

Adjustment Difficulty

Example:

Timezone difference: 7 hours  
Direction: East  
Difficulty: High  

---

Daily Plan

Example:

Day -2  
Sleep 1 hour earlier  
Morning sunlight  
Avoid bright light after 21:00

Day -1  
Sleep 2 hours earlier  
Morning sunlight  
Limit caffeine after 14:00

Arrival Day  
Stay awake until 21:00 local time  
Morning sunlight next day

Estimated adjustment: 4 days

---

# Dual Clock Timeline

Display two synchronized timelines.

Top timeline:
Destination local time

Bottom timeline:
Body clock (origin time)

Example conceptual structure:

Destination
06 08 10 12 14 16 18 20 22

Body Clock
23 01 03 05 07 09 11 13 15

Overlay bands:

Sleep window  
Sunlight exposure window  
Avoid bright light window

---

# Circadian Low Point (Fatigue Window)

Circadian low occurs approximately:

03:00–05:00 body clock time

Algorithm:

circadianLow = wakeTime − 2.5 hours

Convert to destination timezone.

Display warning:

Fatigue Window
10:00–12:00 local time

Advice:

Avoid driving  
Short nap allowed  
Hydrate and move

---

# Light Exposure Guidance

Morning light
→ shifts body clock earlier

Evening light
→ shifts body clock later

Planner calculates:

Sunlight Anchor Time

Example:

Seek sunlight between
08:30–10:00 local time

This becomes the daily adjustment cue.

---

# Minimum Jet Lag Strategy

If trip duration is short:

Suggest partial adjustment.

Example:

Trip length: 3 days
Timezone shift: 7 hours

Recommended strategy:
Shift body clock by 3 hours only.

Avoid full reset.

---

# Difficulty Indicator

Direction affects difficulty.

Rule:

West travel → easier  
East travel → harder

Display indicator:

Difficulty Level:

Low  
Moderate  
High

---

# Screenshot Mode

Button:

Save Plan

Creates a simple printable layout:

JET LAG PLAN

London → Bangkok  
Arrival 14:20

Day 1
Stay awake until 21:30

Day 2
Morning sunlight
Sleep 22:00

Adjustment: 4 days

Users can screenshot and close tool.

---

# Interface Layout

Header

Jet Lag Planner

Input Section

Origin Time Zone
Dropdown

Destination Time Zone
Dropdown

Departure Time
Time input

Arrival Time
Time input

Optional Sleep Schedule

Generate Plan Button

---

# Timeline Section

Dual timeline display

Bands:

Sleep
Sunlight
Avoid Light
Fatigue Window

---

# Plan Output Section

Adjustment Difficulty

Daily Plan

Sunlight Anchor

Fatigue Warning

---

# Technical Implementation

All logic runs client‑side.

Required modules:

Timezone calculator  
Circadian shift calculator  
Timeline generator  

No libraries required.

---

# Core Algorithm

1. Calculate timezone difference

delta = destinationOffset − originOffset

2. Determine travel direction

if delta > 0 → east
if delta < 0 → west

3. Estimate circadian shift

East travel
shift = 1 hour per day

West travel
shift = 1.5 hours per day

4. Generate daily adjustment schedule

days = ceil(|delta| / shift)

5. Calculate sunlight anchor

Morning sunlight for east travel
Evening light exposure for west travel

---

# Timezone Dataset

Small embedded dataset.

Example:

{
"London":0,
"Bangkok":7,
"Tokyo":9,
"New York":-5
}

For full version use subset of IANA timezone offsets.

---

# Privacy

Tool must:

Never store user data  
Never transmit data  
Never include analytics  
Never include tracking  

All calculations happen locally.

---

# Performance Requirements

Total file size target:

< 150 KB

Dataset target:

< 30 KB

Instant load time.

---

# Optional Future Extensions

Chronotype selection
Early bird / night owl

Melatonin timing suggestion

Tour Mode
Multiple flights

Athlete Mode

Child Travel Mode

---

# KIN Fit

The Jet Lag Planner fits the Kin catalog because it:

solves a real problem  
works instantly  
requires no accounts  
runs offline  
replaces expensive apps

Typical user behaviour:

Open tool  
Enter flight  
Generate plan  
Screenshot plan  
Close tool
