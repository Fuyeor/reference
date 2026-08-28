# Layout Code Blocks

FFM currently supports table, slide, chain, and accordion syntax. Except for tables, all are wrapped in fenced code blocks.

## Table

Tables are typically used to display structured data comparisons.

### Basic Syntax

- Declare the header in the first row, using `|` to separate columns.
- In the second row, declare the separator line, using `|` and at least three consecutive hyphens `---` (more than three are allowed) to separate columns.
- Write the table data in subsequent rows.

The header supports alignment control using colons `:`:

- `:---` means left‑aligned (same as `---`)
- `:---:` means center‑aligned
- `---:` means right‑aligned

### Syntax Examples

#### Basic Table

```ffm
| Name | Age | City |
| --- | --- | --- |
| Alice | 25 | New York |
| Bob | 30 | London |
| Charlie | 28 | Paris |
```

#### Table with Alignment

```ffm
| Left Align | Center Align | Right Align |
| :--- | :---: | ---: |
| Content | Content | Content |
| Long text | Long text | Long text |
```

### Styling Tips

- It is recommended to leave blank lines before and after the table to ensure proper separation from other elements.
- Table cells support basic inline syntax, such as `**bold**`, `*italic*`, `` `inline code` ``, etc.
- Avoid adding too many delimiters or spaces just for alignment purposes.

## slide

slide is typically used for items of similar length that are meant to be compared side by side.

### Basic Syntax

- Use ` ```slide ` to declare a slide block.
- Use the horizontal rule `---` to split sections; `---` must have line breaks before and after.

````ffm
Below is a comparison of various social media platforms:

```slide
**Ф social**
- Character limit: 3000 – 5000 (characters)
- Content format: Fuyeor Flavored Markdown

---

**Bluesky**
- Character limit: 300 (characters)
- Content format: Plain text

---

**Mastodon**
- Character limit: Varies per instance, but defaults to 500 on most instances
- Content format: Plain text
```
````

### Styling Tips

- It is recommended to leave blank lines before and after the slide block to ensure proper separation from other elements.
- Slide sections support basic inline syntax, such as `**bold**`, `*italic*`, `` `inline code` ``, etc.
- Avoid adding too many delimiters or spaces just for alignment purposes.

## chain

chain (thought chain) is typically used for FAQs, thought steps, timelines, task lists, tutorial steps, and similar scenarios.

### Basic Syntax

- Use ` ```chain ` to declare a chain block.
- Use bold text (`**`) on its own line to create heading nodes.

Heading nodes support Markdown task‑list syntax. For example:

- `**[x] Heading**` renders as completed (green node)
- `**[ ] Heading**` renders as incomplete (yellow node)
- `**Heading**` renders in the default style (usually purple)

### Syntax Examples

#### Timeline

````ffm
The internet evolved from a military experimental network to global connectivity and the participatory information age through the following stages:

```chain
**1960s: Concept and Prototype**
The U.S. Department of Defense proposed the "ARPANET" concept, aiming to build a decentralized network that could still communicate even if some nodes were destroyed.

**1970s–1980s: Laying the Technical Foundation**
The TCP/IP protocol suite was born, establishing a universal language for computers to talk to each other, gradually forming the prototype of the internet.

**1990s: The World Wide Web and Popularization**
The emergence of the World Wide Web (WWW) made web pages browsable. The internet officially opened to the public, entering an era of large-scale commercialization and mass adoption.

**2000s–2010s: Flourishing Growth**
Forums, blogs, and social media boomed. The widespread adoption of smartphones truly put the internet in people’s pockets, enabling access anytime, anywhere.

**Present: Intelligent Interconnection**
We have fully entered an era deeply integrated with mobile internet, the Internet of Things, big data, and artificial intelligence.
```
````

#### Task List

````ffm
Progress of the preparations for a friend’s weekend birthday party:

```chain
**[x] Step 1: Book the party venue**
We have already reserved the board game place that everyone agreed on, and paid the deposit.

**[x] Step 2: Confirm the final headcount**
Everyone has signed up in the group chat, and a total of 8 people will attend.

**[ ] Step 3: Buy snacks and drinks**
We've made a shopping list and plan to buy everything on Saturday morning and bring it directly to the venue.

**[ ] Step 4: Prepare the mystery birthday gift**
The gift we ordered online is still on the way and is expected to arrive by Friday afternoon.
```
````

#### How‑to Guide

chain is also very suitable for writing simple operation guides. Here is an example:

````ffm
How to brew yourself a delicious cup of drip coffee:

```chain
**Tear open the filter bag**
Carefully tear along the perforated line on the package, and hang the two paper "ears" firmly on the rim of the cup.

**First pour – blooming**
Gently wet the coffee grounds with hot water and let it sit for 20 seconds. You will smell a rich coffee aroma.

**Complete the pour in stages**
Continue to slowly pour hot water until the cup reaches your desired strength, then remove the filter bag and discard it.
```
````

## accordion

accordion is recommended for FAQs, hiding detailed content to save space, click‑to‑reveal answers, behind‑the‑scenes trivia, and similar scenarios.

It uses the same syntax as chain, except that **accordion content is collapsed by default** (users need to click the heading to expand), and it **does not support** Markdown task‑list syntax (so `[x]` or `[ ]` cannot be used to change colours).

> The name "accordion" comes from a vivid analogy in web design: just like the bellows of an accordion can freely expand and collapse, this component allows content to be freely expanded and collapsed, thus keeping the page clean and tidy.

### Basic Syntax

- Use ` ```accordion ` to declare an accordion block.
- As with chain, use bold text (`**`) on its own line to create heading nodes.

### Syntax Examples

#### FAQ

````ffm
Some common questions about our community:

```accordion
**How can I join your volunteer team?**
Click "Join Us" in the upper-right corner of the homepage, fill out a simple application form, and our admin will contact you within three working days.

**Do I need to bring my own tools for the event?**
No, you don't. All the materials and tools needed for each activity will be provided for free on site.

**What if something comes up and I can't make it?**
That's okay. Just click "Cancel Reservation" in your personal center at least 24 hours before the event starts.
```
````

#### Hidden Detailed Steps

````ffm
Today we'll teach you how to make the classic dish "Scrambled Eggs with Tomatoes." Click the headings to view the specific steps:

```accordion
**Step 1: Prepare the ingredients**
Wash 2 tomatoes and cut them into wedges. Crack 3 eggs into a bowl, add a pinch of salt, and beat until combined.

**Step 2: Cook on the stove**
Heat oil in a wok. First, scramble the egg mixture until just set and remove. Then, sauté the tomatoes until they release their juices, and finally add the eggs back in and mix well.
```
````

### Styling Tips

- Inside the content area of `chain` and `accordion`, it is not recommended to use `#` heading syntax.
- Both `chain` and `accordion` use a standalone single line of `**` as the heading node; therefore, the body text should not contain standalone bold lines.
- If a code block appears inside the content area of a `chain` or `accordion`, follow the code block nesting rules and use a higher number of backticks for the outermost layer, e.g., ``` ```chain ```.
