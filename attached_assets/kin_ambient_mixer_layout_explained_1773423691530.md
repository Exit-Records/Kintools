# Kin Ambient Mixer --- Layout Concept (with Explanation)

## Interface Layout

    KIN AMBIENT MIXER

            Wind

      Rain         Waves

          ● Listener

      Fire        Forest

            Noise

    ---------------------

    Master Volume

    Play / Pause
    Shuffle Mix
    Sleep Timer

    ---------------------

    All audio is generated locally.
    No tracking. No streaming.
    Works offline.

------------------------------------------------------------------------

## Concept

The mixer uses a **radial sound field** instead of traditional sliders.

The listener sits at the centre of the environment and sound sources
surround them.

Each sound behaves like a **movable node** in the sound field.

------------------------------------------------------------------------

## Interaction Model

The user drags each sound source toward or away from the listener.

Distance from the centre determines the volume.

Example behaviour:

-   Close to centre → louder sound
-   Far from centre → quieter sound
-   At outer edge → muted

This creates an intuitive interaction where users feel like they are
**placing sounds around themselves** rather than adjusting technical
volume sliders.

------------------------------------------------------------------------

## Example Mapping

    distance → gain

    center       = 100%
    mid distance = 50%
    edge         = 0%

This can be implemented by mapping node distance to a gain value in the
Web Audio API.

------------------------------------------------------------------------

## Advantages

• visually intuitive\
• faster mixing than sliders\
• feels like building an environment rather than adjusting controls\
• works well on desktop and touch devices\
• reinforces the ambient experience

------------------------------------------------------------------------

## Technical Notes

Implementation can use:

-   Web Audio API for sound generation and playback
-   HTML canvas or SVG for the circular interface
-   simple drag interactions for sound nodes
-   gain nodes mapped to distance from centre

All processing should remain **fully local in the browser**.

No external assets or network requests are required.
