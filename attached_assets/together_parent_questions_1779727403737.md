# Together — New Question Category Spec

## Category: “Ask me anything”

A new category of questions directed specifically from parent to child. Unlike the existing questions which are open to everyone at the table, these are asked by a parent and answered by a child.

-----

### Design notes for implementation

- **Direction:** Parent asks, child answers. The card should indicate this – consider a subtle label like “A question from me to you” or a different visual treatment to signal the direction.
- **Deck behaviour:** These should appear in the **family deck only**. Not in couples mode.
- **Kids language:** These are always displayed in their softened form regardless of whether the little ones toggle is on. They are written for children.
- **Pacing:** These are heavier than the average card. Consider limiting how many surface in a single session – no more than 2-3 per shuffle so they don’t dominate.
- **Category colour:** Suggest a warm gold – `#C4A55A` – distinct from existing categories.
- **Profile tags:** `["fast", "deep", "flow"]` – relevant for all profiles.

-----

### Questions

|# |Question                                                                                      |Reflection (shown on card back)                                              |
|--|----------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|
|1 |Do you ever feel like I don’t spend enough time with you?                                     |This one takes courage to ask. It takes courage to answer too.               |
|2 |When you’re trying to tell me something, do you feel like I really listen?                    |Listening and hearing aren’t always the same thing.                          |
|3 |Do you ever feel like I compare you to other people?                                          |Every person deserves to be seen as just themselves.                         |
|4 |When I say no to something, do you still feel okay with me afterwards?                        |Being safe with someone means knowing they won’t stay cross forever.         |
|5 |When something goes wrong, do you feel like you can come and tell me?                         |The most important thing is that you know you can always come to me.         |
|6 |Is there something I do that sometimes hurts your feelings?                                   |You’re allowed to say it. I want to know.                                    |
|7 |What’s something you wish I noticed more about you?                                           |We all have parts of ourselves that are waiting to be seen.                  |
|8 |Do you ever feel like I’m too busy for you?                                                   |Busy is never more important than you.                                       |
|9 |Is there something you’ve wanted to tell me but weren’t sure how I’d react?                   |Whatever it is, I’d rather know.                                             |
|10|Do you feel like I treat you and your siblings the same?                                      |It’s okay to say if something doesn’t feel fair.                             |
|11|What’s something I do that makes you feel really proud of me?                                 |Parents need to hear this too.                                               |
|12|Is there something you wish we did more together, just the two of us?                         |One-on-one time matters. What would you pick?                                |
|13|Do you ever feel like I don’t believe you when you tell me something?                         |Being trusted is one of the most important feelings there is.                |
|14|What’s something you wish I understood better about how you feel?                             |Feelings that are hard to explain are still real.                            |
|15|Do you feel like you can be silly and weird around me, or do you feel like you have to behave?|You should never have to perform for the people who love you.                |
|16|Is there a time you felt really let down by me?                                               |I get things wrong sometimes. It’s okay to say so.                           |
|17|What’s something I say that you really like hearing?                                          |Words matter more than we know.                                              |
|18|Do you ever feel like I’m harder on you than I should be?                                     |If something feels unfair, it’s worth saying out loud.                       |
|19|What would you want me to do differently when you’re upset?                                   |Everyone needs something different. Tell me what helps you.                  |
|20|Do you feel like I’m proud of you?                                                            |The answer should always be yes. And I want you to feel it, not just hear it.|

-----

### Kids language versions

These questions are already written in child-appropriate language. No separate `kidsQ` version needed – the `q` field is the kids version. Set `kids: true` on all.

### Data structure for each card

```js
{
  q: "Do you ever feel like I don't spend enough time with you?",
  kidsQ: "Do you ever feel like I don't spend enough time with you?",
  cat: "Ask me anything",
  ref: "This one takes courage to ask. It takes courage to answer too.",
  profiles: ["fast", "deep", "flow"],
  kids: true,
  directed: true  // new flag -- indicates parent-to-child direction
}
```

The `directed: true` flag allows the UI to optionally render a directional label on the card – e.g. a small line above the question reading “Ask your child” – without changing the core card component significantly.

-----

### Optional UI treatment

When a card has `directed: true`, consider:

- A small label above the question: **“A question from you to them”** in the category colour
- A subtle background tint or border treatment to visually distinguish from open questions
- The card back reflection reworded to address the parent rather than the group

-----

*Prepared for Together — a KIN Tool*
*Category: Ask me anything — 20 questions*