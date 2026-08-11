# Native JavaScript integration

You can call the depict endpoint directly from the browser using the Fetch API. The endpoint returns an SVG string, which you can inject into your page's DOM.

This guide covers native JavaScript integration. An official `@fuyeor/chemistry` package will be available in the future to simplify color customization and rendering workflows.

## Basic usage

Use `fetch` to request the SVG from the depict endpoint, then set the `innerHTML` of a target element.

```javascript
// The SMILES string you want to render
const smiles = 'CCO';

// Construct the request URL, encoding the SMILES parameter
const url = `https://chemistry.fuyeor.net/v1/depict?smiles=${encodeURIComponent(smiles)}`;

fetch(url)
  .then((response) => {
    if (!response.ok) {
      throw new Error(`Failed to fetch SVG: ${response.status}`);
    }
    return response.text();
  })
  .then((svg) => {
    document.getElementById('molecule-container').innerHTML = svg;
  })
  .catch((error) => {
    console.error('Error rendering molecule:', error);
  });
```

## Rendering multiple molecules

To render multiple structures on the same page, iterate over a list of SMILES strings and create a container for each.

```javascript
const molecules = [
  { id: 'mol-ethanol', smiles: 'CCO' },
  { id: 'mol-aspirin', smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O' },
  { id: 'mol-caffeine', smiles: 'CN1C=NC2=C1C(=O)N(C(=O)N2C)C' }
];

molecules.forEach(({ id, smiles }) => {
  const container = document.getElementById(id);
  if (!container) return;

  const url = `https://chemistry.fuyeor.net/v1/depict?smiles=${encodeURIComponent(smiles)}`;

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Error ${res.status}`);
      return res.text();
    })
    .then((svg) => {
      container.innerHTML = svg;
    })
    .catch((err) => {
      container.innerHTML = `<span class="error">Failed to render ${smiles}</span>`;
      console.error(err);
    });
});
```

## Error handling

The endpoint returns `4xx` or `5xx` status codes when the request fails. Always check `response.ok` or the status code before processing the body.

| Status code | Meaning |
| :--- | :--- |
| `400` | Invalid SMILES, missing parameters, or malformed `config` JSON. |
| `404` | The provided compound name was not found in PubChem. |
| `502` | PubChem upstream service is unavailable. |

For detailed error payloads, see the [API reference](/chemistry/apis/depict).

## Customizing colors

You can pass a `config` parameter with a JSON object to override the default CPK colors. The JSON must be URL-encoded.

```javascript
const smiles = 'CCO';
const config = JSON.stringify({
  color: {
    bg: '111827',
    c: 'FFFFFF'
  }
});
const url = `https://chemistry.fuyeor.net/v1/depict?smiles=${encodeURIComponent(smiles)}&config=${encodeURIComponent(config)}`;

fetch(url)
  .then((res) => res.text())
  .then((svg) => {
    document.getElementById('dark-molecule').innerHTML = svg;
  });
```

For a complete reference of supported color keys and value formats, see the [API reference](/chemistry/apis/depict).