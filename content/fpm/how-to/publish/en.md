# Publish a package

Use this guide when you already have a package directory and need to publish it to an FPM registry.

## Before you publish

The target directory must contain `package.json`. FPM requires a scoped package name and a valid version. The package name and version identify the release, so increment the version before publishing a new release of the same package.

Review the package boundary before uploading. The `files` field limits the archive to matching entries; when it is absent, FPM considers files not excluded by `.gitignore`. FPM always includes `package.json`, and it excludes `.git`, `node_modules`, and other ignored metadata. Only regular files can be published.

## Preview the archive

Run a dry run from the package directory:

```bash
fpm publish --dry-run
```

To preview another directory, pass its path:

```bash
fpm publish ./packages/widget --dry-run
```

A dry run performs local packing and validation but does not acquire an upload session, upload bytes, or commit a release.

## Publish to a selected registry

The configured registry is used by default. Override it for one invocation with `--registry`:

```bash
fpm publish ./packages/widget --registry https://registry.example.com/v1
```

The token is resolved from `FPM_TOKEN` first and then from the local configuration created by `fpm login`. A command-line registry override changes the endpoint for that invocation; it does not rewrite the saved registry configuration.

## Use JSON output in automation

Use `--json` when a pipeline needs to consume the result:

```bash
FPM_TOKEN="$FPM_PUBLISH_TOKEN" fpm publish ./packages/widget --json
```

The JSON result contains `name`, `version`, `tarball`, and `sha256`. Keep the token in the CI secret store and expose it only to the publishing step. Do not commit FPM configuration files or tokens to source control.

## Understand the upload sequence

FPM first sends the package name, version, and SHA-256 checksum to the registry to acquire an upload session. It then uploads the gzip archive to the returned upload URL and commits the session with the normalized manifest. Registry API requests use JSON and include the token as a Bearer authorization header when a token is configured.

If a network or registry error is retryable, the upload step may be retried once. A successful publish prints the package identifier, tarball URL, and checksum. Save the checksum with the release metadata when you need to verify the uploaded archive later.

## Troubleshoot common failures

If FPM reports that no token is configured, run `fpm login` or set `FPM_TOKEN`. If the manifest name is rejected, change it to a scoped name such as `@example/widget`. If the version is invalid, use a valid Semantic Version. If a file is missing from the archive, check both the `files` field and `.gitignore` rules.
