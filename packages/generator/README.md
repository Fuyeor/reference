<!-- packages/generator/README.md -->
# Reference Content Generator

The reference content generator compiles Markdown documents into the JSON metadata consumed by the frontend. It generates localized module structures and per-directory document metadata from the source files under `/content`.

## Build

Build the CLI bundle before running it:

```bash
pnpm --filter @fuyeor/reference-generator build
```

Run a full build to regenerate the global module indexes and every module's generated metadata:

```bash
pnpm --filter @fuyeor/reference-generator start
```

## Module-scoped builds

Use `-m=<module>` to build one module without regenerating global indexes or touching generated files in other modules. For example, the following command builds only the `chemistry` module:

```bash
pnpm --filter @fuyeor/reference-generator start -- -m=chemistry
```

The parser also accepts `--m=<module>` and the long-compatible form `--module=<module>`:

```bash
pnpm --filter @fuyeor/reference-generator start -- --m=ffm
pnpm --filter @fuyeor/reference-generator start -- --module=ffm
```

The module name must match a direct directory under `/content`. An unknown module or an unsupported option fails immediately with an error instead of falling back to a full build.

| Invocation | Scope | Global module indexes |
| --- | --- | --- |
| `start` | All modules | Regenerated |
| `start -- -m=chemistry` | `chemistry` only | Preserved |
| `start -- --m=ffm` | `ffm` only | Preserved |

Generated `structure.*.json` and `index.json` files are ignored by Git and are intended to be rebuilt as part of the deployment workflow.

## Tests

Run the generator test suite with:

```bash
pnpm --filter @fuyeor/reference-generator test
```
