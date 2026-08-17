# Get started with FPM

This tutorial takes you from an empty directory to a locally verified package publish. It assumes that Node.js 24.19 or later and npm or pnpm are available on your machine.

## Install the CLI globally

Install the published CLI with npm:

```bash
npm install --global @fuyeor/fpm-cli
```

Or install it with pnpm:

```bash
pnpm add --global @fuyeor/fpm-cli
```

The package declares the `fpm` binary in its `bin` field. The package manager therefore creates a global executable named `fpm`.

Confirm that the command is available:

```bash
fpm help
```

If you use pnpm, make sure the directory reported by `pnpm bin --global` is on your `PATH`. On a new pnpm installation, `pnpm setup` can configure the pnpm home directory for your shell.

## Authenticate with the registry

Run:

```bash
fpm login
```

The command prompts for a personal access token and saves the registry and token in the FPM configuration file. To use a different registry, pass it explicitly:

```bash
fpm login --registry https://registry.example.com/v1
```

For automation, set the token through the environment instead of writing it in a script:

```bash
export FPM_TOKEN='replace-with-a-token'
```

You can inspect the active registry without printing the token:

```bash
fpm config
```

## Create a minimal package

Create a directory with a manifest and one source file:

```bash
mkdir hello-fpm
cd hello-fpm
cat > package.json <<'EOF'
{
  "name": "@example/hello-fpm",
  "version": "1.0.0",
  "description": "A minimal FPM package",
  "type": "module",
  "exports": "./index.js",
  "files": ["index.js"]
}
EOF
printf 'export const message = "Hello from FPM";\n' > index.js
```

The name is scoped because FPM requires package names such as `@example/hello-fpm`. The version must be valid Semantic Version syntax.

## Verify before publishing

From the package directory, create a dry run:

```bash
fpm publish --dry-run
```

The dry run packs and validates the package without contacting the registry. Review the manifest, selected files, and version before publishing.

## Publish

When the package is ready, publish it:

```bash
fpm publish
```

For machine-readable output, add `--json`:

```bash
fpm publish --json
```

The command prints the package name, version, tarball URL, and SHA-256 checksum. Continue with [Publish a package](../../how-to/publish) for CI and directory-specific workflows.
