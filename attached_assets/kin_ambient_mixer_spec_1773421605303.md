# Kin Ambient Mixer --- Specification

## Overview

A privacy-first white noise and ambient sound mixer designed for the Kin
ecosystem.

All sound generation and mixing happens locally in the browser. No audio
is streamed, no data is transmitted, and the tool works offline once
loaded.

Principles: - Single HTML file - HTML, CSS, and JavaScript fully
contained - No analytics, cookies, tracking, or accounts - No locked or
premium sounds - Lightweight and readable code - Works offline

------------------------------------------------------------------------

# Core Sound Engines

Noise should be generated locally rather than played from recordings.

## Noise Types

Users can enable and mix:

-   White Noise
-   Pink Noise
-   Brown Noise

Each includes: - On/off toggle - Independent volume control

Allowing blending of multiple noise types improves sleep and focus
options.

------------------------------------------------------------------------

# Ambient Sound Layers

Short seamless loops embedded directly in the file.

Recommended sounds:

Natural: - Rain - Wind - Ocean Waves - Forest / Night ambience -
Fireplace

Optional additions if file size allows:

-   Distant thunder
-   Stream / waterfall
-   Soft birds
-   Cave drip

Each sound includes: - Volume slider - Mute toggle

All sounds can be layered simultaneously.

------------------------------------------------------------------------

# Mixer Interface

Channel-style controls.

Noise - White - Pink - Brown

Nature - Rain - Wind - Waves - Fire

Each channel has a simple level control.

------------------------------------------------------------------------

# Master Controls

Master Volume

Play / Pause

Reset mix

Shuffle mix (randomizes levels)

------------------------------------------------------------------------

# Sleep Timer

Options:

-   15 minutes
-   30 minutes
-   1 hour
-   2 hours
-   Infinite

When the timer expires: audio fades out over \~10 seconds

------------------------------------------------------------------------

# Presets

Simple presets that move sliders automatically.

Examples:

Deep Sleep - Brown noise - Rain

Storm Night - Wind - Thunder

Ocean Calm - Waves - Pink noise

Fireplace - Fire - Wind

Presets simply set slider positions.

------------------------------------------------------------------------

# Procedural Noise Generation

Noise is generated using the Web Audio API rather than audio files.

Benefits:

-   zero file size for noise
-   infinite non-repeating audio
-   higher quality blending
-   smaller overall app size

Examples:

White noise random value per sample

Pink noise frequency-weighted filtering

Brown noise integrated white noise producing deeper rumble

------------------------------------------------------------------------

# Gentle Sound Evolution

Ambient layers slowly change intensity to prevent static looping.

Example behavior:

Rain level = base ±5% Cycle length = 2--5 minutes

Wind slightly changes strength

Fire crackles randomly

These subtle changes create a more natural sound environment.

------------------------------------------------------------------------

# Zero-Click Start Preset

The tool should be usable immediately.

On load display:

Start Relaxing

Pressing it starts a default mix such as:

Brown Noise 40% Rain 30% Wind 10%

Users can adjust afterwards.

------------------------------------------------------------------------

# Shareable Mix Codes

Instead of accounts or storage, mixes can be represented by short text
codes.

Example:

KINMIX: B40 P10 R30 W10

Meaning:

Brown 40 Pink 10 Rain 30 Wind 10

Users paste the code to restore the mix.

This keeps everything fully offline.

------------------------------------------------------------------------

# Circular Mixer Interface

Instead of vertical sliders, sounds can be arranged around a circular
sound field.

Example concept:

           Wind

Rain Waves

         Listener

Fire Forest

           Noise

Behavior:

-   Distance from center = volume
-   Dragging a sound closer increases intensity

Advantages:

-   faster mixing
-   intuitive interaction
-   visually communicates balance

------------------------------------------------------------------------

# Sound Weight Instead of Volume

Replace technical volume labels with intuitive strength levels.

Example:

Light Medium Heavy

Or use visual fill indicators rather than numbers.

------------------------------------------------------------------------

# Focus Mode

Selecting a sound makes it dominant in the mix.

Example:

User selects Waves

Waves +10% Other sounds −20%

This helps quickly create balanced environments.

------------------------------------------------------------------------

# Drift Mode

A toggle that introduces slow variation to all ambient layers.

Characteristics:

-   very slow 3--8 minute cycles
-   ±5 percent level changes
-   no audible jumps

This creates a more organic atmosphere.

------------------------------------------------------------------------

# Subtle Visual Feedback

Visuals should remain calming and minimal.

Examples:

Rain intensity → gentle ripple pattern

Wind → slow drifting particles

Fire → warm glow tint

Animations must remain subtle to avoid distraction.

------------------------------------------------------------------------

# Privacy Statement

All audio generation and mixing happens locally in your browser. No
sounds are streamed. No data is sent or stored. Works offline.

------------------------------------------------------------------------

# Features to Avoid

To remain aligned with Kin principles:

-   premium sounds
-   locked sound packs
-   accounts or login systems
-   analytics or tracking
-   streaming audio services
-   ads

All features should be immediately available.

------------------------------------------------------------------------

# Ideal Interface Layout

KIN AMBIENT MIXER

Noise White Pink Brown

Nature Rain Wind Waves Fire

Master Volume

Play / Pause Shuffle Mix Reset

Sleep Timer

Footer All audio is generated locally. No tracking. No streaming. Works
offline.

------------------------------------------------------------------------

# Technical Targets

Single HTML file

Estimated total size target: 80 KB -- 400 KB

Technologies:

-   Web Audio API
-   Embedded audio loops
-   Procedural noise generation
