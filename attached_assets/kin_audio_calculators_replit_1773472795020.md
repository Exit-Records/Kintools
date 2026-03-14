
# KIN — Audio Calculator Suite
Replit Builder Specification

Purpose:
A collection of small audio engineering and music production calculators.
Each calculator follows Kin principles and can live inside a single tool page
or as modular sections within one HTML file.

KIN standards:
- Single HTML file
- HTML + CSS + JS inline
- No accounts
- No analytics
- No tracking
- Client-side only
- Works offline after first visit
- Instant calculations
- No external libraries required

Typical use time: 10–60 seconds

---

# Calculator Categories

The suite focuses on **technical audio calculations** useful for:

• music producers  
• sound engineers  
• sound designers  
• recording engineers  

DJ‑specific tools are intentionally excluded and can live in a separate app.

Categories included:

Timing  
Frequency  
Phase & Delay  
Digital Audio  
Studio Acoustics  
Data & File Calculations

---

# 1. BPM → LFO Rate

Convert tempo into modulation frequency.

Example:

120 BPM  
1 bar cycle = 0.5 Hz  
1/4 note = 2 Hz

Features:
- BPM input
- note division selector
- frequency output in Hz
- copy result button

Implementation:

frequency = BPM / 60

division multipliers applied depending on selected note value.

---

# 2. BPM → Sample Length

Calculate exact loop duration.

Example:

120 BPM  
4 bars = 8 seconds

Features:
- BPM input
- bars selector
- seconds output
- sample length output

Example output:

4 bars @120 BPM
8 seconds
352800 samples @44.1k

Formula:

seconds = (60 / BPM) * beats

---

# 3. Frequency → Musical Note

Convert frequency to note name.

Example:

440 Hz → A4

Features:
- frequency input
- note name output
- octave output
- cents deviation

Useful for:

• tuning analysis  
• pitch detection verification

---

# 4. Musical Note → Frequency

Reverse conversion.

Example:

C3 → 130.81 Hz

Features:
- note selector
- tuning reference selector (A440, A442)
- frequency output

Formula:

f = 440 * 2^((n−69)/12)

---

# 5. Frequency → Period

Convert Hz into waveform cycle duration.

Example:

50 Hz = 20 ms

Features:
- frequency input
- period output in milliseconds

Formula:

period = 1 / frequency

---

# 6. Frequency → Wavelength

Convert frequency to wavelength.

Example:

50 Hz = 6.86 meters

Features:
- frequency input
- temperature selector
- wavelength output in meters and feet

Formula:

wavelength = speed_of_sound / frequency

Default speed of sound:
343 m/s

---

# 7. Phase Delay Calculator

Calculate delay needed to correct phase offset.

Example:

100 Hz
90° phase shift

Delay = 2.5 ms

Features:
- frequency input
- phase offset input
- delay output

Formula:

delay = (phase / 360) / frequency

---

# 8. Distance → Delay

Used for speaker alignment.

Example:

1 meter = 2.9 ms delay

Features:
- distance input
- unit selector (m / ft)
- delay output

Formula:

delay = distance / speed_of_sound

---

# 9. Sample Rate → Nyquist Frequency

Calculate Nyquist limit.

Example:

44.1 kHz → 22.05 kHz

Features:
- sample rate input
- nyquist frequency output

Formula:

nyquist = sample_rate / 2

---

# 10. Bit Depth → Dynamic Range

Calculate theoretical dynamic range.

Example:

16 bit ≈ 96 dB  
24 bit ≈ 144 dB

Features:
- bit depth input
- dynamic range output

Formula:

dynamic_range = bit_depth * 6.02

---

# 11. Latency Calculator

Calculate audio latency from buffer settings.

Example:

Buffer: 256 samples  
Sample rate: 48k

Latency = 5.33 ms

Features:
- buffer size input
- sample rate input
- latency output

Formula:

latency = buffer_size / sample_rate

---

# 12. Comb Filter Frequency Calculator

Estimate comb filter notches.

Example:

Delay: 3 ms

First notch: 167 Hz

Features:
- delay input
- frequency outputs for first several notches

Formula:

f = 1 / delay

---

# 13. Room Fundamental Frequency

Calculate basic room resonance.

Example:

Room length: 5 m

Mode = 34.3 Hz

Features:
- room dimension input
- fundamental frequency output

Formula:

f = speed_of_sound / (2 * length)

---

# 14. Audio Duration → Samples

Convert time into sample count.

Example:

3 seconds @ 48kHz

144000 samples

Features:
- duration input
- sample rate selector
- sample count output

Formula:

samples = duration * sample_rate

---

# 15. Bitrate → File Size

Estimate audio file size.

Example:

320 kbps
3 min track

≈ 7.2 MB

Features:
- bitrate input
- duration input
- file size output

Formula:

size = bitrate * duration

---

# UI Layout Suggestion

Simple Kin style interface:

Header:
Audio Calculators

Dropdown:
Select Calculator

Dynamic panel shows relevant inputs and output.

All results update instantly.

---

# Implementation Notes

Use plain JavaScript functions.

Example structure:

calculators = {
 bpmDelay(),
 bpmSampleLength(),
 freqToNote(),
 noteToFreq(),
 phaseDelay(),
 latencyCalc()
}

Switch calculators dynamically.

---

# Performance Targets

Total file size target:

< 200 KB

All calculations instant.

No external APIs.

---

# Why This Fits Kin

The tool:

• solves common technical problems  
• replaces scattered online calculators  
• works instantly  
• requires no account  

Typical user flow:

Open tool  
Enter value  
Copy result  
Close tool
