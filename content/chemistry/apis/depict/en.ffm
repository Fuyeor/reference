# Depict endpoint

The `/v1/depict` endpoint generates an SVG image of a chemical structure from a SMILES string or a common name, powered by RDKit.

## Request

`GET https://chemistry.fuyeor.net/v1/depict`

### Parameters

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `smiles` | string | Conditional | A valid SMILES or reaction SMILES string. |
| `name` | string | Conditional | A case-insensitive common name (for example, `aspirin`, `ethanol`). The name is resolved against PubChem's "Names and Identifiers" database. |
| `config` | JSON | Optional | A JSON object that customizes the colors of atoms and the background. |

You must provide exactly one of `smiles` or `name`. If both are supplied, or if neither is supplied, the endpoint returns a `400 Bad Request` error.

#### `smiles` parameter

The `smiles` parameter accepts a valid SMILES string. The service adheres to the following specifications:

- [Daylight SMILES Theory Manual](https://www.daylight.com/dayhtml/doc/theory/theory.smiles.html)
- [OpenSMILES Specification](http://opensmiles.org/opensmiles.html)

#### `name` parameter

When you provide a `name`, the service queries PubChem for the corresponding compound and renders it using the canonical SMILES. The name lookup is case-insensitive.

> Using a SMILES string directly is recommended for production scenarios. The `name` parameter involves an additional network call to PubChem, which can increase latency and introduces a dependency on PubChem's availability.

#### `config` parameter

The `config` parameter is a JSON object that allows you to customize the colors of specific atoms and the background. The JSON structure is:

```json
{
  "color": {
    "bg": "111827",
    "c": "FFFFFF",
    "o": "FF0000"
  }
}
```

**Color keys**

- The key `"bg"` sets the background color.
- Atom color keys are case-insensitive chemical element symbols (for example, `"c"`, `"C"`, `"o"`, `"O"`, `"n"`, `"s"`, `"p"`, `"cl"`, `"br"`, `"f"`, `"i"`). The service automatically converts keys to lowercase during parsing, so `"C"` and `"c"` are equivalent.
- Wildcard keys (for example, `"*"`) are **not supported**. To override default CPK atom colors, specify each element explicitly.

**Color values**

- Color values must be hexadecimal RGB or RGBA strings **without** the `#` prefix. For example, `"FF0000"` for red, `"00FF0080"` for green with alpha.
- If no custom colors are provided, the service applies the standard CPK coloring scheme.

### Example requests

**Render a SMILES string**

```http
GET /v1/depict?smiles=CCO HTTP/1.1
Host: chemistry.fuyeor.net
```

**Render a common name**

```http
GET /v1/depict?name=aspirin HTTP/1.1
Host: chemistry.fuyeor.net
```

**Apply custom colors**

```http
GET /v1/depict?smiles=CC(=O)OC1=CC=CC=C1C(=O)O&config=%7B%22color%22%3A%7B%22bg%22%3A%22111827%22%2C%22c%22%3A%22FFFFFF%22%7D%7D HTTP/1.1
Host: chemistry.fuyeor.net
```

The URL-encoded `config` parameter in the last example decodes to:

```json
{"color":{"bg":"111827","c":"FFFFFF"}}
```

## Response

### Success response

A successful request returns an SVG image.

- **Status code**: `200 OK`
- **Content-Type**: `image/svg+xml`
- **Cache-Control**: `public, max-age=31536000, immutable`

The response body is a vector graphic that you can embed directly in HTML, Markdown, or view in a browser.

### Error responses

When the request fails, the endpoint returns a JSON object with an error code and a human-readable message.

The following table summarizes the possible errors:

| Scenario | Status code | Response body |
| :--- | :--- | :--- |
| Both `smiles` and `name` provided | `400 Bad Request` | `{"error": "InvalidInput", "message": "Cannot provide both 'smiles' and 'name'"}` |
| Neither `smiles` nor `name` provided | `400 Bad Request` | `{"error": "InvalidInput", "message": "Must provide either 'smiles' or 'name'"}` |
| Invalid SMILES syntax | `400 Bad Request` | `{"error": "SmilesParsingError", "message": "Failed to parse SMILES string"}` |
| Malformed JSON in `config` | `400 Bad Request` | `{"error": "InvalidInput", "message": "Invalid JSON config format"}` |
| Compound name not found in PubChem | `404 Not Found` | `{"error": "NameNotFound", "message": "Compound name not found in PubChem"}` |
| PubChem upstream failure | `502 Bad Gateway` | `{"error": "PubChemError", "message": "Failed to fetch from PubChem API"}` |

All error responses include `Content-Type: application/json`.