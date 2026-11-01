[**reference**](https://reference.fuyeor.com) is the documentation platform for Ф.

## Documentation

All documentation content is managed within the `/content/` directory. Documents under `/content/` must use the `.ffm` extension and follow [the FFM syntax](/content/ffm/overview/en.ffm).

## Development

### Documentation Generation

The generator runs directly from TypeScript source — no separate build step is required.

```bash
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
