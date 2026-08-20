[**reference**](https://reference.fuyeor.com) is the documentation platform for Ф.

## Documentation

All documentation content is managed within the `/content/` directory.

## Development

### Documentation Generation

Run `build` to generate the documentation builder, then run the start command to produce the `structure.json` files for each language:

```bash
# Build the generator CLI
pnpm --filter @fuyeor/reference-generator build

# Compile Markdown/FON contents into static JSON artifacts
pnpm --filter @fuyeor/reference-generator start
```

### Locale Generation

Generate the locale assets directly from the repository root:

```bash
pnpm locale make reference
```
