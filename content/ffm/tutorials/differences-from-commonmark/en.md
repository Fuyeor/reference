# FFM Differences from Other Markdown Flavors

Markdown, as a lightweight markup language, has spawned many different variants (Flavored Markdown). The most widespread include CommonMark (Common Flavored Markdown) and GitHub Flavored Markdown (GFM), which extends CommonMark.

## Differences from CommonMark

FFM and CommonMark are two Markdown specifications with overlapping syntax but fundamentally different design philosophies.

Below are the core CommonMark features that FFM does not support:

```chain
**Setext Headings**

In CommonMark, using underlines (e.g., `===` or `---`) to declare H1/H2 frequently causes accidental headings when a separator is not separated by two line breaks from the text above. Moreover, it only supports the first two heading levels. FFM uses ATX heading syntax (i.e., starting with `#`).

**Inline HTML**

CommonMark allows HTML in documents, whereas FFM completely forbids any HTML rendering.

This decision improves compatibility, avoids tight coupling with browser engines, entirely eliminates cross-site scripting (XSS) attacks, and guarantees absolute predictability of the document parser.

**Underscore-related Syntax**

1. Underscore bold & italic (`__bold__` / `_italic_`):

- In the CommonMark specification, single/double underscores rely on word boundaries based on space-separated Western text.
- In Chinese and Japanese scripts, which are written without spaces, this easily causes ambiguous boundary detection and unintended rendering failures.

2. Underscore thematic break (`___`):

- Horizontal rules already have `---` and `***`; a third variant offers little necessity.
- The underscore rule often leaves more blank space above than below, making it easy to forget a preceding line break and accidentally trigger a rule.

**Indented Code Blocks & Tilde Fenced Code Blocks**

Code blocks triggered by ≥4 leading spaces or a single tab are extremely prone to being accidentally activated in everyday writing.

FFM uses only modern, clear, and semantically explicit fenced code blocks (i.e., ` ``` `) as the sole code block syntax.
```

## Differences from GFM

FFM supports GFM tables and task list syntax, but does **not** support GitHub-style strikethrough (`~~text~~`).

This is because, in CJK (Chinese, Japanese, Korean) contexts, the tilde `~` is very frequently used to express an elongated tone or [an emotional buffer](https://en.wikipedia.org/wiki/Tilde#Chinese). The GFM strikethrough syntax easily conflicts with this habit, causing unintentional strikethrough rendering.

## Extended Syntax

To deliver a more intuitive typographic experience, FFM introduces the following inline syntaxes with stronger visual metaphors:

| Input Syntax      | Rendered Effect | Visual Metaphor                              |
| :---------------- | :-------------- | :------------------------------------------- |
| `__Underline__`   | __Underline__   | Underscores evoke an underline beneath text. |
| `--Strike--`      | --Strike--      | Dashes strike through the text, symbolizing strikethrough. |

It also includes block syntaxes such as slide, quote, chain, accordion, and others.
