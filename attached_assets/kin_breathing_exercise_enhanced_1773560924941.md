# KIN-0XX --- Breathing Exercise (Enhanced)

Category: Mental Health\
Creator: Kin\
File: kin-breathing-exercise.html

------------------------------------------------------------------------

# Concept

A guided breathing tool designed for stress regulation, focus resets,
and sleep preparation.

The interface centers on a visual breathing guide that expands and
contracts to cue inhale, hold, and exhale phases. The tool includes
common breathing techniques, customizable patterns, and optional audio
or haptic cues.

Everything runs fully client-side in a single HTML file and works
offline after the first load.

------------------------------------------------------------------------

# Core Breathing Patterns

## Box Breathing (4-4-4-4)

Inhale → Hold → Exhale → Hold

Used by athletes, meditation practices, and military training to
stabilize breathing and calm the nervous system.

## 4-7-8 Breathing

Inhale → Hold → Exhale

Often used for relaxation and sleep preparation.

## ADHD Focus Reset

Short rhythmic breathing cycle designed for attention resets.

Example: Inhale 3s\
Exhale 3s

Continuous rhythm with no hold phase to quickly regulate breathing and
attention.

## Sleep Wind‑Down

Slower breathing cycle designed to gradually calm the body.

Example: Inhale 4s\
Exhale 6s

Encourages longer exhale to activate parasympathetic response.

## Custom Pattern

Users define durations for:

• Inhale\
• Hold after inhale\
• Exhale\
• Hold after exhale

All values entered in seconds.

------------------------------------------------------------------------

# Visual Breathing Guide

Primary animation is a **breathing circle** that expands and contracts.

States:

Inhale\
Circle slowly expands

Hold\
Circle remains stable

Exhale\
Circle slowly contracts

Optional visual mode:

## Rhythm Ring Mode

Instead of a circle growing and shrinking, a ring fills and empties
around the edge of the screen.

This can feel calmer and more meditative for some users.

Toggle:

Circle Mode\
Ring Mode

------------------------------------------------------------------------

# Audio Cue (Optional)

Audio toggle enables gentle tones when breathing phases change.

Generated with Web Audio API.

Characteristics:

• soft sine tone\
• extremely short duration\
• no external audio files

Purpose:

Helps users close their eyes while breathing.

------------------------------------------------------------------------

# Haptic Cue (Mobile Optional)

If device supports vibration:

• short vibration pulse when phase changes

Useful for:

• eyes‑closed breathing • ADHD focus resets • discreet breathing
sessions

Uses the browser Vibration API.

------------------------------------------------------------------------

# Session Timer

Users can choose a breathing session length.

Presets:

1 minute\
3 minutes\
5 minutes\
10 minutes

Custom duration supported.

Timer display shown at top of interface.

When session ends:

• breathing stops • gentle tone plays • message displayed: Session
Complete

------------------------------------------------------------------------

# Interface Layout

Minimal design.

Top Section Session timer Breathing pattern selector

Center Section Breathing animation (circle or ring) Large phase label:
Inhale Hold Exhale

Bottom Section Start / Pause Reset Audio toggle Haptic toggle Animation
mode toggle

------------------------------------------------------------------------

# Controls

Pattern Selector Dropdown menu:

• Box Breathing • 4‑7‑8 • ADHD Focus Reset • Sleep Wind‑Down • Custom

Start Begins breathing cycle.

Pause Stops animation and timer.

Reset Returns tool to initial state.

Keyboard Support

Spacebar → Start / Pause

------------------------------------------------------------------------

# Animation Logic

Animation driven using requestAnimationFrame.

Each breathing phase has:

• target duration • visual state • optional cue trigger

Example Box Breathing Cycle:

Inhale 4 seconds Hold 4 seconds Exhale 4 seconds Hold 4 seconds

Cycle repeats until timer completes.

------------------------------------------------------------------------

# Accessibility

Large readable phase labels.

Reduced Motion Mode:

If user prefers reduced motion, animation transitions become instant
instead of smooth.

Color contrast designed for visibility.

Keyboard support included.

------------------------------------------------------------------------

# Kin Compliance

This tool must follow Kin ecosystem standards.

Requirements:

Single HTML file

All CSS and JavaScript inline

No frameworks or external libraries

No analytics

No cookies

No accounts

No data storage

No external assets

Works offline after first load

Readable, lightweight code

------------------------------------------------------------------------

# Future Enhancements

KIN‑0XX.1 Guided breathing voice option using browser speech synthesis.

KIN‑0XX.2 Daily breathing streak counter stored locally.

KIN‑0XX.3 Ambient gradient background synchronized with breathing
rhythm.

KIN‑0XX.4 Short breathing session presets for:

• anxiety spikes • pre‑sleep relaxation • focus resets

------------------------------------------------------------------------
