# FPM CLI reference

The global executable is `fpm`. Run `fpm help` to print the current command summary.

## Commands

| Command | Purpose |
| :--- | :--- |
| `fpm login [--registry <url>]` | Save a registry and personal access token locally. |
| `fpm logout` | Remove the saved token while retaining the registry setting. |
| `fpm whoami` | Query the registry for the authenticated user. |
| `fpm config` | Print the configured registry and whether a token is present. The token itself is never printed. |
| `fpm publish [directory] [options]` | Pack and publish a package. The directory defaults to `.`. |

## `publish`

```text
fpm publish [directory] [--dry-run] [--json] [--registry <url>]
```

The command reads `package.json`, validates the scoped name and Semantic Version, packs the selected files, and publishes the archive. `directory` is optional and defaults to the current working directory.

| Option | Behavior |
| :--- | :--- |
| `--dry-run` | Pack and validate locally without contacting the registry. |
| `--json` | Print the result as one JSON object instead of human-readable lines. |
| `--registry <url>` | Use a registry URL for this invocation. |
| `--help`, `-h` | Print help. |
| `--version`, `-v` | Print the CLI version after a command has been selected. |

A successful human-readable result contains the package identifier, tarball URL, and SHA-256 checksum:

```text
Published @example/widget@1.0.0
Tarball: https://registry.example.com/v1/packages/@example/widget/1.0.0.tgz
SHA-256: <hexadecimal checksum>
```

The JSON form contains these keys:

```json
{
  "name": "@example/widget",
  "version": "1.0.0",
  "tarball": "https://registry.example.com/v1/packages/@example/widget/1.0.0.tgz",
  "sha256": "<hexadecimal checksum>"
}
```

## Configuration

The registry and token are resolved using the following precedence:

| Value | Precedence |
| :--- | :--- |
| Registry | `--registry` for `publish`, then `FPM_REGISTRY`, then the saved configuration. |
| Token | `FPM_TOKEN`, then the saved configuration. |

`fpm login` writes the configuration to `fpm/config.json` below the platform configuration directory. On systems that set `XDG_CONFIG_HOME`, FPM uses `$XDG_CONFIG_HOME/fpm/config.json`; otherwise it uses the user's platform configuration directory. The file is written with mode `0600`.

## Package requirements

A publishable package must have a `package.json` with a scoped `name` and a valid `version`. The packer includes `package.json`, respects the `files` field, applies `.gitignore` exclusions, excludes `.git` and `node_modules`, and rejects non-regular files. Workspace dependency ranges are rewritten to publishable version ranges when a workspace root can be found.

## Runtime and installation

Install the CLI globally with npm or pnpm:

```bash
npm install --global @fuyeor/fpm-cli
pnpm add --global @fuyeor/fpm-cli
```

The package exposes `dist/cli.js` as the `fpm` binary through `package.json#bin`. The published package is built during packing, so consumers do not need the repository or TypeScript toolchain installed.
