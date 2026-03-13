# Kin Flashcards --- Build Prompt (Agent Optimized)

## Goal

Build a lightweight browser-based flashcard tool.

The tool allows users to create decks, study flashcards, and
import/export decks as plain text files.\
All data must be stored locally in the browser.

Target size: \~50--150 KB.

------------------------------------------------------------------------

# Core Capabilities

Users must be able to:

• Create decks\
• Rename and delete decks\
• Add, edit, and remove cards\
• Study cards interactively\
• Flip cards\
• Mark cards as known or unknown\
• Import and export decks as text files

------------------------------------------------------------------------

# Card Structure

Each card has:

Front\
Back

Example:

What year did the Berlin Wall fall? \| 1989

Cards must be editable.

------------------------------------------------------------------------

# Study Interaction

Default study flow:

1.  Show card front
2.  Tap or press space to flip
3.  User marks result
4.  Next card appears

Buttons:

Know\
Don't Know

Keyboard shortcuts:

Space → Flip\
Right Arrow → Know\
Left Arrow → Don't Know

------------------------------------------------------------------------

# Swipe Controls

Optional gesture controls:

Swipe Right → Know\
Swipe Left → Don't Know\
Tap → Flip

------------------------------------------------------------------------

# Smart Reappearance Logic

Simple reinforcement system.

Rules:

Don't Know → reappear within next \~3 cards\
Know → move toward end of deck

No complex spaced repetition algorithms.

------------------------------------------------------------------------

# Confidence Grading (Optional)

Allow three responses:

Easy\
Hard\
Don't Know

Meaning:

Easy → rare appearance\
Hard → appear again soon\
Don't Know → appear very soon

------------------------------------------------------------------------

# Typing Mode (Optional)

Allow users to type answers.

Flow:

Question shown\
User types answer\
Reveal correct answer

------------------------------------------------------------------------

# Reverse Mode

If enabled, cards are studied in both directions.

Example stored card:

Hello \| Hola

Study session generates:

Hello → Hola\
Hola → Hello

------------------------------------------------------------------------

# Cloze Cards

Support fill-in-the-blank cards.

Syntax:

The capital of France is {{Paris}}

Display:

The capital of France is \_\_\_\_\_\_

Reveal:

The capital of France is Paris

Multiple cloze sections allowed.

------------------------------------------------------------------------

# Pile Study Mode

Users sort cards into piles.

Know\
Don't Know\
Review Later

Interactions:

Right → Know\
Left → Don't Know\
Down → Review Later

Review Later cards appear near the end of the session.

------------------------------------------------------------------------

# Shuffle Mode

Option to randomize card order.

------------------------------------------------------------------------

# Study Filters

Allow filtering by card state:

All\
Unknown\
Learning\
Known

------------------------------------------------------------------------

# Import / Export

Decks must support text import and export.

Format:

Front \| Back

Example:

Hello \| Hola Dog \| Perro The capital of France is {{Paris}}

Delimiter: pipe character.

------------------------------------------------------------------------

# Deck Metadata

Lines starting with \# are metadata and should be ignored.

Example:

# Deck: Spanish Vocabulary

------------------------------------------------------------------------

# Parsing Rules

Ignore:

• Empty lines\
• Lines starting with \#

Detect card types:

Contains "\|" → standard card\
Contains "{{ }}" → cloze card

Optional tags allowed:

Run \| Correr \| verb

------------------------------------------------------------------------

# Storage

Decks must be stored locally.

Acceptable methods:

localStorage\
IndexedDB

No network requests.

------------------------------------------------------------------------

# Interface Layout

Main screen:

KIN FLASHCARDS

Deck list\
Create Deck

Study screen:

\[ CARD \]

Tap to flip

Know \| Don't Know

------------------------------------------------------------------------

# Privacy

All decks remain stored locally in the browser.

No data is transmitted externally.

Users should export decks for backup.
