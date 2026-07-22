# What Is Markdown?

Markdown is a lightweight markup language that lets you write documents in plain text, using a few simple symbols to represent formatting. The same document can then be converted into multiple formats, including HTML, PDF, and Word.

## Why use Markdown?

Some argue that “using special symbols for formatting” feels odd, or that it’s merely a programmer’s tool. In modern digital writing, however, it is widely recognized as the most efficient and versatile text solution:

- **Stay focused on content**: No need to constantly take your hands off the keyboard to click buttons for font size, weight, or color. Formatting happens naturally as you write—just concentrate on your words.
- **Minimal learning curve**: A handful of core symbols (such as `#`, `-`, `**`) is all it takes to get started.
- **Lightweight and cross-platform**: At heart, the file is plain text and extremely small. Any text editor—even the built-in Notepad—can open, read, and edit it directly.
- **Strong compatibility and easy conversion**: Renders seamlessly into web pages (HTML), and can be exported with dedicated tools to produce beautifully typeset PDFs, Word documents, and more.
- **Cost-effective for large models**: Markdown content contains no superfluous styling code, allowing AI to understand and process it accurately while consuming the minimum possible tokens.
- **Not at odds with visual editing**: In many advanced editors, Markdown supports WYSIWYG-style live preview, giving you both efficiency and visual intuition.

## Why not just use Microsoft Word or HTML?

### ❌ The limitations of Microsoft Word

- **Opaque structure**: A Word document (`.docx`) is essentially a zipped package of XML in which styles, text, and images are all intermixed. Extracting clean content programmatically through scripts or external tools is highly complex.
- **Weak compatibility**: The same Word file, when opened in Microsoft Office, WPS, LibreOffice, or on a mobile device, often displays inconsistent formatting—tables may deform, and styles can differ.
- **Large storage overhead**: Because of the heavy metadata XML, even a Word document containing just a single character consumes around 13 KB of disk space, making it unsuitable for mass storage or lightweight distribution.

### ❌ The limitations of HTML

- **Privacy and security risks**: HTML documents normally allow embedding of CSS styles and even JavaScript. Opening an unknown local HTML file may trigger unauthorized background network requests (such as loading a remote image), potentially leaking the user’s real IP address or other private information.
- **Overly bloated content**: HTML is full of repetitive closing tags (e.g., `<div>`, `<p>`) and its syntactic structure is verbose. Without visual aids, it is extremely difficult both to write by hand and to read intuitively.