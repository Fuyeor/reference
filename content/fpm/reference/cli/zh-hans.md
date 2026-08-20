# FPM CLI 参考

全局可执行命令为 `fpm`。运行 `fpm help` 可以输出当前命令摘要。

## 命令

| 命令 | 作用 |
| :--- | :--- |
| `fpm login [--registry <url>]` | 在本地保存注册表和个人访问令牌。 |
| `fpm logout` | 删除已保存的令牌，但保留注册表设置。 |
| `fpm whoami` | 向注册表查询当前已认证用户。 |
| `fpm config` | 输出已配置的注册表以及是否存在令牌；不会输出令牌本身。 |
| `fpm publish [directory] [options]` | 打包并发布包；目录默认为 `.`。 |

## `publish`

```text
fpm publish [directory] [--dry-run] [--json] [--registry <url>]
```

该命令读取 `package.json`，验证带作用域的包名和 Semantic Version，打包选中的文件，并发布归档。`directory` 是可选参数，默认为当前工作目录。

| 选项 | 行为 |
| :--- | :--- |
| `--dry-run` | 只在本地打包和验证，不访问注册表。 |
| `--json` | 将结果输出为单个 JSON 对象，而不是人类可读的多行文本。 |
| `--registry <url>` | 为本次执行使用指定的注册表 URL。 |
| `--help`、`-h` | 输出帮助。 |
| `--version`、`-v` | 在选定命令后输出 CLI 版本。 |

成功执行后的人类可读输出包含包标识符、归档 URL 和 SHA-256 校验和：

```text
Published @example/widget@1.0.0
Tarball: https://registry.example.com/v1/packages/@example/widget/1.0.0.tgz
SHA-256: <hexadecimal checksum>
```

JSON 输出包含以下字段：

```json
{
  "name": "@example/widget",
  "version": "1.0.0",
  "tarball": "https://registry.example.com/v1/packages/@example/widget/1.0.0.tgz",
  "sha256": "<hexadecimal checksum>"
}
```

## 配置

注册表和令牌按以下优先级解析：

| 值 | 优先级 |
| :--- | :--- |
| 注册表 | `publish` 的 `--registry`，然后是 `FPM_REGISTRY`，最后是已保存的配置。 |
| 令牌 | `FPM_TOKEN`，然后是已保存的配置。 |

`fpm login` 会将配置写入平台配置目录下的 `fpm/config.json`。设置了 `XDG_CONFIG_HOME` 的系统使用 `$XDG_CONFIG_HOME/fpm/config.json`；否则使用当前用户的平台配置目录。文件以 `0600` 模式写入。

## 包要求

可发布的包必须有一个包含带作用域 `name` 和有效 `version` 的 `package.json`。打包器会包含 `package.json`，遵循 `files` 字段，应用 `.gitignore` 排除规则，排除 `.git` 和 `node_modules`，并拒绝非普通文件。当能够找到 workspace 根目录时，workspace 依赖范围会被改写为可发布的版本范围。

## 运行时与安装

使用 npm 或 pnpm 全局安装 CLI：

```bash
npm install --global @fuyeor/fpm-cli
pnpm add --global @fuyeor/fpm-cli
```

该包通过 `package.json#bin` 将 `dist/cli.js` 暴露为 `fpm` 命令。发布包会在打包阶段构建，因此使用者不需要克隆仓库，也不需要安装 TypeScript 工具链。
