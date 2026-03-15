# Recipe Scaler

**Category:** Food / Kitchen\
**Build Difficulty:** Medium\
**Platform:** Browser-based web app\
**Architecture:** Single self-contained HTML file (HTML + CSS + JS
inline)

------------------------------------------------------------------------

# Concept

Recipe Scaler is a fast kitchen tool that adjusts ingredient quantities
when changing the number of servings in a recipe.

Users paste or type ingredients, set the original number of servings,
choose the target servings, and the tool instantly calculates adjusted
quantities.

The tool recognizes common cooking units, supports fractions, and
formats output for readability.

All calculations run locally in the browser.

No accounts.\
No tracking.\
No analytics.\
No cloud storage.

Works offline after first load.

------------------------------------------------------------------------

# Primary Use Case

User has a recipe for **4 servings** but wants to cook for **6 people**.

Input:

Original servings: 4

Ingredients:

2 cups flour\
1.5 cups milk\
1 tbsp sugar\
2 eggs\
0.5 tsp salt

Target servings: 6

Output:

3 cups flour\
2.25 cups milk\
1.5 tbsp sugar\
3 eggs\
0.75 tsp salt

------------------------------------------------------------------------

# Core Features

## Ingredient Input

Multiline ingredient editor.

Each line contains:

quantity + unit + ingredient name

Examples:

2 cups flour\
1.5 tbsp olive oil\
½ tsp salt\
3 eggs\
200 g chicken\
1 can tomatoes

The tool detects: - quantity - unit - ingredient description

------------------------------------------------------------------------

# Serving Adjustment

Inputs: - Original servings - Target servings

Scaling formula:

scaled amount = original × (target servings / original servings)

Scaling updates instantly when values change.

------------------------------------------------------------------------

# Fraction Support

Recognizes common cooking fractions:

½\
¼\
¾\
⅓\
⅔

Fractions convert internally to decimals.

Example:

½ tsp → 0.5 tsp

------------------------------------------------------------------------

# Output Formatting

User can choose:

Decimal mode

0.75 tsp

or

Cooking fraction mode

¾ tsp

------------------------------------------------------------------------

# Copy Result

Button:

Copy Scaled Recipe

Outputs clean formatted ingredient list suitable for pasting.

------------------------------------------------------------------------

# Improvements Included

## Smart Unit Conversion (Optional Toggle)

Automatically converts units to cleaner equivalents.

Examples:

1000 g → 1 kg\
16 tbsp → 1 cup\
3 tsp → 1 tbsp

Toggle:

\[ \] Auto convert units

------------------------------------------------------------------------

## Quick Multiply / Divide Buttons

Fast recipe adjustments.

×2\
×3\
½\
⅓

------------------------------------------------------------------------

## Ingredient Lock

Allows specific ingredients to remain unchanged during scaling.

Example:

\[lock\] salt\
\[lock\] pepper

Locked ingredients do not scale.

------------------------------------------------------------------------

## Flexible Ingredient Parsing

The parser tolerates messy input such as:

1cup flour\
1 cup flour\
1 c flour

The tool normalizes units internally using regex parsing.

------------------------------------------------------------------------

## Grocery List Mode

Optional toggle:

\[ \] Combine duplicate ingredients

Example:

1 cup milk\
0.5 cup milk

Output:

1.5 cups milk

------------------------------------------------------------------------

## Precision Control

User chooses rounding style:

Nearest fraction\
Nearest 0.25\
Exact decimal

------------------------------------------------------------------------

# Interface Layout

Top controls:

Original Servings \[4\]\
Target Servings \[6\]

Buttons:

Scale Recipe\
×2 ×3 ½ ⅓

Ingredient input area:

Paste Ingredients

2 cups flour\
1 cup milk\
2 eggs\
½ tsp salt

Output area:

Scaled Recipe

3 cups flour\
1.5 cups milk\
3 eggs\
0.75 tsp salt

Bottom controls:

Copy Result\
Combine Ingredients\
Auto Convert Units

------------------------------------------------------------------------

# Supported Units

Metric: g\
kg\
ml\
l

Imperial: tsp\
tbsp\
cup\
oz\
lb

Neutral: egg\
clove\
piece\
can

------------------------------------------------------------------------

# Technical Implementation

Single HTML file containing:

-   HTML interface
-   CSS styling
-   JavaScript parsing engine

No external libraries required.

Key functions:

parseIngredientLine()\
convertFractions()\
scaleQuantity()\
formatOutput()\
combineIngredients()

------------------------------------------------------------------------

# Offline Support

After first visit the app should work offline using:

Service Worker caching

Cached assets: - HTML - CSS - JS

------------------------------------------------------------------------

# KIN Compliance

The tool follows KIN design principles:

Single purpose\
No login\
No tracking\
Instant interaction\
Offline capable\
Single-file architecture

------------------------------------------------------------------------

# Estimated Build Complexity

Medium difficulty.

Primary complexity comes from ingredient parsing and unit handling.

Approximate size:

400--600 lines of code
