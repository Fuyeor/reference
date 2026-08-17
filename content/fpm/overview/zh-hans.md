# FPM 包发布工具

FPM 是一个包注册表和命令行发布工具，面向源代码包作者。它可以验证包、生成确定性的压缩归档、将归档上传到 FPM 注册表，并提交已发布的包清单。

## 选择文档路径

| 你想要…… | 从这里开始 |
| :--- | :--- |
| 安装 FPM 并发布第一个包 | [快速上手](../tutorials/getting-started) |
| 从指定目录发布已有包 | [发布包](../how-to/publish) |
| 查看全部命令和选项 | [CLI 参考](../reference/cli) |
| 了解包和上传流程 | [CLI 参考：publish](../reference/cli#publish) |

FPM 设计为全局安装。安装完成后，直接使用 `fpm` 命令即可，不需要再通过 Node.js 显式执行生成的 JavaScript 文件。

## FPM 发布什么内容

FPM 会读取目标目录中的 `package.json`。包名必须是带作用域的名称，例如 `@example/widget`，版本号必须符合 Semantic Version 规范。归档包含包清单，以及由清单和 `.gitignore` 规则选中的文件。提交清单前，workspace 依赖范围会被规范化。

发布过程使用短期上传会话：FPM 先获取上传 URL，再使用 SHA-256 校验和上传压缩归档，最后提交包清单。注册表令牌会作为 Bearer token 发送；使用 `fpm login` 时，令牌会以严格的本地文件权限保存。

## 文档组织方式

本模块将学习、完成任务和查找信息分开：教程提供完整的首次使用路径，操作指南聚焦发布已有包，参考页描述命令语法与行为。这种划分参考了 [Diátaxis](https://diataxis.fr/) 的用户需求模型，以及 [Microsoft Learn 信息架构原则](https://learn.microsoft.com/en-us/sharepoint/information-architecture-principles) 中以用户任务和可查找性为中心的导航方式。
