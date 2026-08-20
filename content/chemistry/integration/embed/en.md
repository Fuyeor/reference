# Direct embed

You can embed chemical structure diagrams directly into documents, forums, and websites by using a URL. No code is required. The `/v1/depict` endpoint returns an SVG image that you can insert anywhere that supports images or custom Markdown syntax.

## Fuyeor Flavored Markdown

If your platform supports [Fuyeor Flavored Markdown](/ffm/overview), you can use the `smiles` code block to render chemical structures. List one SMILES string per line to generate multiple diagrams:

````ffm
```smiles
CCO
CC(=O)OC1=CC=CC=C1C(=O)O
```
````

You can also use an inline annotation (`` #[smiles=`molecule`] ``) to insert a structure directly within a paragraph:

```ffm
Caffeine (formula: #[smiles = `CN1C=NC2=C1C(=O)N(C(=O)N2C)C`]) keeps you awake by blocking adenosine receptors.
```

**🌟 NOTE:**

- The SMILES string must be wrapped in backticks (`` ` ``), consistent with the code block syntax.
- You can test the rendering effect in the [FFM Playground](https://flavored.fuyeor.com/).

## Common Markdown

For platforms that use Common Markdown (such as GitHub, Discourse, and static site generators), use the image syntax with the depict endpoint URL:

```markdown
![Aspirin](https://chemistry.fuyeor.net/v1/depict?smiles=CC(=O)OC1=CC=CC=C1C(=O)O)
```

The rendered output appears as a standard image:

![Aspirin](https://chemistry.fuyeor.net/v1/depict?smiles=CC(=O)OC1=CC=CC=C1C(=O)O)

> SMILES strings often contain characters that are reserved in URLs, such as `(`, `)`, and `=`. Please URL-encode the `smiles` parameter value. For example, `CCO` is safe, but `CC(=O)O` becomes `CC%28%3DO%29O`.

## HTML

Use an `<img>` tag to embed structures in HTML pages. You can set the `width`, `height`, or other standard attributes to control the display size.

```html
<img
  width="300"
  alt="Aspirin"
  src="https://chemistry.fuyeor.net/v1/depict?smiles=CC(=O)OC1=CC=CC=C1C(=O)O"
/>
```

The `alt` attribute improves accessibility and is displayed if the image fails to load.