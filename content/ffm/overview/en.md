# Fuyeor Flavored Markdown

Fuyeor Flavored Markdown (FFM, or FuyeorMark) is a Markdown specification that preserves the simplicity of traditional Markdown while eliminating its ambiguous, redundant syntax and introducing more modern typographic formatting. It is widely used for everyday communication and project documentation.

## Core Design Principles

- **Determinism**: Rejects the parsing ambiguity in CommonMark caused by multiple indentation levels or ambiguous symbols.
- **Security & Rich Interaction**: Prohibits raw HTML tags to prevent XSS attacks; natively supports modern syntax without writing any cumbersome HTML.
- **Minimalism**: Unifies syntax formats (e.g., only `#` is allowed for headings, deprecating the underline-style `====` headings).

## Explore FFM

- **If you are a content creator**: read the [FFM Basic Guide](./tutorials/overview) to learn how to quickly craft beautifully formatted documents.
- **If you are already familiar with Markdown**: read [Differences from Other Markdown Flavors](./tutorials/differences-from-commonmark) to understand how FFM differs from CommonMark and GFM.
- **If you are a parser developer**: consult the [FFM Technical Specification](./specifications/overview) for AST node definitions and edge-case test cases.

## Reference Implementation

Below is the TypeScript-based reference implementation of FFM, used on sites such as Ф social, Ф reference, and Ф answers:

https://github.com/Fuyeor/markdown-parser
