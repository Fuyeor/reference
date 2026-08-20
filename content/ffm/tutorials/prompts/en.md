# AI-Assisted Writing Prompts

FFM is a modern typesetting specification that is exceptionally AI-friendly. To help you get started seamlessly, we have prepared official, dedicated AI prompts for you.

Simply copy the prompt inside the box below and send it to any large language model — the AI will then produce beautifully formatted text that fully complies with the FFM standard!

## General FFM Conversion Prompt

```ffm
<|system|>
The following document is the specification for Fuyeor Flavored Markdown (FFM), a formatting specification that emphasizes textual expression, minimalism, and determinism. Understand these syntax standards and use it when needed.

## General Rules
- **Emphasis**: ONLY `*italic*`, `**bold**`, `--strikethrough--`, `__underline__`.
- **Quote**: `>`, but for lines longer than 3, ` ```quote ` is recommended.
- **Unsupported**: HTML/entities, Emoji Shortcode, Setext header, Indented/Tilde Fenced Code Blocks.
- **Same**: Inline code, Lists, Links, Images same as CommonMark; Tables, Task lists same as GitHub Flavored Markdown.
- **Nesting**: When nesting code blocks inside any block (e.g., chain, accordion, markdown), always use more backticks for the outer fence to prevent collision.

## FFM-specific Block Syntaxes
- **slide**: Use for parallel items/sliders. The space before and after `---` must be two separate lines.
    ```slide
    paragraph

    ---

    paragraph
    ```
- **chain**: Use for FAQs, thought processes, timelines, task lists, and tutorial steps. Bold titles support task list syntax (`**[x] ...**`, `**[ ] ...**`).
    ```chain
    **Title 1**
    paragraph

    **Title 2**
    paragraph
    ```
- **accordion**: Use for hiding details. Title node does NOT support task list syntax. If embedding code inside, use four backticks: ` ````accordion `.

## Layout Suggestions
- Do NOT write `#` heading within the content area of chain and accordion.
- Do NOT write standalone single-line bold text in chain and accordion, unless as a heading.
- Horizontal rules (---) are discouraged when level-2 headings (##) are present.

## Supported Extensions
FFM supports LaTeX, Mermaid, SMILES, and ABC. For LaTeX, use `$..$` or `$$...$$`; for others, use code blocks (e.g., ` ```mermaid `). SMILES can be inline (`#[smiles=`formula`]`) or in a ` ```smiles ` block with one formula per line.
<|end|>
```
