# Basic Syntax

If you are already familiar with basic Markdown, you have practically mastered 90% of FFM. This section will quickly walk you through the standard core syntaxes supported by FFM.

## Headings

Use `#` to declare headings. The number of `#` characters (1–6) corresponds to heading levels 1 through 6.

```ffm
# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6
```

**🌟 NOTE:**

- The `#` symbol must be at the beginning of a line and **must be followed by a space**.
- FFM only supports headings declared with `#`; it does not support using `===` or `---` placed below the text.

## Text Emphasis

To make text *italic*, wrap it in a single asterisk:

```ffm
This is *italic text*.
```

To make text **bold**, wrap it in two asterisks:

```ffm
This is **bold text**.
```

To make text ***bold and italic***, wrap it in three asterisks:

```ffm
This is ***bold and italic text***.
```

To apply --strikethrough--, wrap the text with two hyphens `--`:

```ffm
This is --deleted content--.
```

To underline text (typically for emphasis or a conclusive statement), wrap it with two underscores `__`:

```ffm
This is __underlined content, usually representing a conclusive statement__.
```

## Lists

FFM supports unordered and ordered lists. Unordered lists support both `*` and `-`, but `-` is recommended; create sub‑lists by indenting with 2 spaces:

````slide
```ffm
- Item 1
  - Nested sub‑item 1
    - Third level
    - Third level
  - Nested sub‑item 2
- Item 2
- Item 3
```

---

```ffm
* Item 1
  * Nested sub‑item 1
    * Third level
    * Third level
  * Nested sub‑item 2
* Item 2
* Item 3
```
````

For ordered lists, start directly with a number followed by a **half-width** period `.`. Use 4 spaces for nesting:

```ffm
1. First item
    - Nested unordered item 1
        - Third-level item
2. Second item
3. Third item
```

## Links and Images

Inserting links and images is very intuitive; the syntax for an image merely adds a `!` before the link syntax.

```ffm
Welcome to [Ф social](https://www.fuyeor.com).

![A cute cat](https://example.com/cat.jpg)
```

**Note**: Due to security concerns, not all platforms support image embedding.

## Blockquotes

When you need to quote someone or highlight a particular explanation, use the `>` symbol:

```ffm
> "To be, or not to be, that is the question."
```

For multi-line quotes (3 lines or more), it is recommended to wrap the content inside ` ```quote `:

````ffm
```quote
"To be, or not to be, that is the question."

— *Hamlet*
```
````

## Code

Representing code in Markdown usually falls into two categories: inline code and code blocks.

### Inline Code

For inline code, wrap the text with backticks `` ` ``, for example:

```ffm
The way to declare a constant in JavaScript is: `const name = "Fuyeor"`
```

If the inline code itself contains a backtick, use two backticks to wrap it, for example:

```ffm
The way to declare a constant in Fer is: `` name = `Fuyeor` ``
```

### Code Blocks

Use three backticks ` ``` ` to denote a code block:

````ffm
You can declare a function in TypeScript like this:

```typescript
function sayHello() {
  console.log('Hello, Fuyeor!');
}
```
````

It is recommended to specify the language name right after the opening backticks for perfect syntax highlighting upon rendering.

Code blocks can be nested. If you need to represent a code block within a code block, **use a higher number of backticks for the outer layer**:

`````ffm
Create an accordion in FFM using the following syntax:

````ffm
```accordion
**Title or Step**

Paragraph content
```
````
`````
