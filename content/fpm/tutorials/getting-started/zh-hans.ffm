# FPM 快速上手

本教程将带你从空目录开始，完成一个包的本地验证和发布。开始前，请确认机器上已经安装 Node.js 24.19 或更高版本，以及 npm 或 pnpm。

## 全局安装 CLI

使用 npm 安装已发布的 CLI：

```bash
npm install --global @fuyeor/fpm-cli
```

也可以使用 pnpm：

```bash
pnpm add --global @fuyeor/fpm-cli
```

该包在 `bin` 字段中声明了 `fpm` 二进制入口，因此包管理器会创建名为 `fpm` 的全局可执行命令。

确认命令可用：

```bash
fpm help
```

如果使用 pnpm，请确认 `pnpm bin --global` 输出的目录已经加入 `PATH`。全新安装 pnpm 时，可以运行 `pnpm setup` 为当前 shell 配置 pnpm home 目录。

## 登录注册表

运行：

```bash
fpm login
```

命令会提示输入个人访问令牌，并将注册表地址和令牌保存到 FPM 配置文件中。若要使用其他注册表，请明确传入地址：

```bash
fpm login --registry https://registry.example.com/v1
```

在自动化环境中，应通过环境变量提供令牌，不要把令牌写入脚本：

```bash
export FPM_TOKEN='replace-with-a-token'
```

可以查看当前注册表，但不会打印令牌：

```bash
fpm config
```

## 创建最小包

创建包含清单和一个源文件的目录：

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

由于 FPM 要求使用形如 `@example/hello-fpm` 的包名，因此名称必须带作用域。版本号必须符合 Semantic Version 语法。

## 发布前验证

在包目录中执行 dry-run：

```bash
fpm publish --dry-run
```

dry-run 会打包并验证包，但不会访问注册表。发布前请检查清单、选中的文件和版本号。

## 发布

包准备完成后执行：

```bash
fpm publish
```

如果需要机器可读的输出，添加 `--json`：

```bash
fpm publish --json
```

命令会输出包名、版本、归档 URL 和 SHA-256 校验和。CI 和指定目录发布方式请继续阅读[发布包](../../how-to/publish)。
