# Reference 网站编辑指南

Reference 是 Fuyeor 生态的文档网站。网站内容以 `content/` 下的模块目录为来源，每个模块通过 `structure.json` 描述标题、简介和导航，再由内容生成器生成本地化结构与页面元数据。

## 内容目录

```text
content/
├── <module>/
│   ├── structure.json
│   ├── overview/
│   │   └── zh-hans.md
│   └── <section>/<page>/
│       └── zh-hans.md
└── ...
```

`<module>` 是 URL 中的模块名，例如 `fer`、`fon`、`ffm` 和 `reference`。文档路径必须与 `structure.json` 中的导航路径一致；如果导航节点包含子导航，节点的 `slug` 会成为实际目录的一部分。

## 模块边界

一个模块应围绕清晰的产品、语言、平台或编辑主题组织。Fer 与 FON 分别作为独立模块维护，Next Web 作为依赖 FON 与 Fer 的独立方向维护，Reference 模块只记录本网站的编辑和发布规则。

模块之间可以通过相对 Markdown 链接互相引用，但不应复制另一模块的正文。规范、教程、API 参考和编辑指南应保持各自的责任边界；如果一个页面需要解释另一个模块的完整规则，应链接到其权威页面，而不是维护第二份版本。

## 语言文件

当前新增规范模块先提供 `zh-hans.md`。未提供的英文页面不得在 `structure.json` 中伪造正文；内容生成器会为缺失语言生成回退结构，但编辑者仍应把实际存在的语言文件作为唯一内容来源。未来添加英文版时，应在同一目录补充 `en.md`，并保持语义、示例和链接同步。

## 编辑原则

文档应先表达稳定的概念和边界，再给出最小可运行示例。规范页使用明确的“必须”“不得”“应”和“可以”区分要求强度；尚未冻结的设计应说明其限制，不得把推测写成兼容承诺。

Reference 的更改通过分支和 Pull Request 审查。直接修改 `main` 只适用于已明确授权的紧急维护；普通文档更新应让差异、链接和生成结果在 PR 中可复查。

## 相关指南

- [structure.json 编写方式](../structure-json/zh-hans.md)
- [Markdown 编辑规范](../markdown/zh-hans.md)
- [编辑与 PR 工作流](../workflow/zh-hans.md)
