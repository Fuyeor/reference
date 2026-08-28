[**reference**](https://reference.fuyeor.com) is the documentation platform for Ф.

## Documentation

All documentation content is managed within the `/content/` directory.

## Development

### Documentation Generation

Run `build` to generate the documentation builder, then run the start command to produce localized structure and document metadata JSON artifacts:

```bash
# Build the generator CLI
pnpm --filter @fuyeor/reference-generator build

# Compile all modules
pnpm --filter @fuyeor/reference-generator start

# Compile only the FFM module
pnpm --filter @fuyeor/reference-generator start --module=ffm
```

A module-specific build skips the global module indexes and does not rewrite generated artifacts belonging to other modules.

### Locale Generation

Generate the locale assets directly from the repository root:

```bash
pnpm locale make reference
```
