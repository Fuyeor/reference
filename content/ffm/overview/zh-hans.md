# Fuyeor Flavored Markdown

Fuyeor Flavored Markdown（简称 FFM 或 FuyeorMark）是一种在保留传统 Markdown 简洁性的基础上，移除其易混淆的冗余语法、并引入更多现代排版格式的 Markdown 规范，广泛用于日常交流、项目文档。

## 核心设计理念

- **确定性**：摒弃 CommonMark 中由于多重缩进或歧义符号导致的解析不确定性。
- **安全性与富交互增强**：禁止使用 HTML 标签，避免 XSS 攻击；原生支持现代语法而无需编写任何繁琐的 HTML 标签。
- **极简主义**：统一语法格式（例如只允许使用 `#` 作为标题，废弃 `====` 下划线标题语法）。

## 探索 FFM

- **如果你是内容创作者**：可阅读 [FFM 基础指南](./tutorials/overview)，了解如何快速编写美观的文档。
- **如果你已熟悉 Markdown**：可阅读 [FFM 与其他 Markdown 的差异](./tutorials/differences-from-commonmark)，了解 FFM 和 CommonMark、GFM 的差异。
- **如果你是解析器开发者**：可查阅 [FFM 技术规范](./specifications/overview)，获取 AST 节点定义与边界测试用例。

## 参考实现

以下是基于 TypeScript 的 FFM 参考实现，应用于 Ф social、Ф reference、Ф answers 等站点：

https://github.com/Fuyeor/markdown-parser
