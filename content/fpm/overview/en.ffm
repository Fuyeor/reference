# FPM package publishing

FPM is a package registry and command-line publishing tool for source packages. It helps package authors validate a package, create a deterministic archive, upload it to an FPM registry, and commit the published manifest.

## Choose a path

| If you want to... | Start here |
| :--- | :--- |
| Install FPM and publish your first package | [Get started](../tutorials/getting-started) |
| Publish an existing package from a specific directory | [Publish a package](../how-to/publish) |
| Check every command and option | [CLI reference](../reference/cli) |
| Understand the package and upload workflow | [CLI reference](../reference/cli#publish) |

FPM is designed to be installed globally. After installation, use the `fpm` command directly instead of invoking the generated JavaScript file with Node.js.

## What FPM publishes

FPM reads the `package.json` in the target directory. The package must have a scoped name, such as `@example/widget`, and a valid Semantic Version. The archive includes the package manifest and the files selected by the manifest and `.gitignore` rules. Workspace dependency ranges are normalized before the manifest is committed.

The publish operation uses a short-lived upload session: FPM acquires an upload URL, uploads the compressed archive with its SHA-256 checksum, and commits the manifest. The registry token is sent as a Bearer token and is stored locally with restrictive file permissions when you use `fpm login`.

## Documentation model

This module separates learning, task completion, and lookup. The tutorial gives a complete first-run path, the how-to guide focuses on publishing an existing package, and the reference describes command syntax and behavior. This separation follows the user-needs model described by [Diátaxis](https://diataxis.fr/) and the task-oriented navigation principles used by [Microsoft Learn](https://learn.microsoft.com/en-us/sharepoint/information-architecture-principles).
