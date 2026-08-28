# 发布包

当你已经有一个包目录，并需要将它发布到 FPM 注册表时，可以使用本指南。

## 发布前检查

目标目录必须包含 `package.json`。FPM 要求包名带作用域，并且版本号有效。包名和版本共同标识一个发布版本，因此同一个包发布新版本前需要先递增版本号。

发布前请检查包的边界。`files` 字段会将归档限制为匹配的条目；未设置该字段时，FPM 会考虑未被 `.gitignore` 排除的文件。FPM 始终包含 `package.json`，并排除 `.git`、`node_modules` 以及其他被忽略的元数据。只有普通文件可以被发布。

## 预览归档

在包目录中执行 dry-run：

```bash
fpm publish --dry-run
```

如果要预览其他目录，可以传入目录路径：

```bash
fpm publish ./packages/widget --dry-run
```

dry-run 会执行本地打包和验证，但不会获取上传会话、上传字节或提交发布版本。

## 发布到指定注册表

默认使用已配置的注册表。可以使用 `--registry` 为单次执行覆盖注册表：

```bash
fpm publish ./packages/widget --registry https://registry.example.com/v1
```

令牌会优先从 `FPM_TOKEN` 读取；如果没有设置，则使用 `fpm login` 写入的本地配置。命令行传入的注册表只影响当前执行，不会改写已保存的注册表配置。

## 在自动化环境中使用 JSON 输出

流水线需要读取结果时，请使用 `--json`：

```bash
FPM_TOKEN="$FPM_PUBLISH_TOKEN" fpm publish ./packages/widget --json
```

JSON 结果包含 `name`、`version`、`tarball` 和 `sha256`。请将令牌保存到 CI 的密钥存储中，并仅在发布步骤中注入。不要把 FPM 配置文件或令牌提交到源代码仓库。

## 了解上传流程

FPM 首先向注册表发送包名、版本和 SHA-256 校验和，以获取上传会话。随后，它将 gzip 归档上传到返回的 URL，并使用规范化后的包清单提交会话。注册表 API 请求使用 JSON；配置了令牌时，请求会将令牌放在 Bearer authorization header 中。

如果网络或注册表错误可重试，上传步骤最多会重试一次。发布成功后会输出包标识符、归档 URL 和校验和。如果之后需要验证上传的归档，可以将校验和保存到发布元数据中。

## 排查常见错误

如果 FPM 报告没有配置令牌，请执行 `fpm login` 或设置 `FPM_TOKEN`。如果包名校验失败，请改为 `@example/widget` 这样的带作用域名称。如果版本无效，请使用符合 Semantic Version 的版本号。如果归档缺少文件，请同时检查 `files` 字段和 `.gitignore` 规则。
