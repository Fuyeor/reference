# structure.json 编写方式

`structure.json` 是一个 content 模块的导航源文件。它不承载正文，也不负责定义页面的 Markdown 内容；它只描述模块元数据和页面树。内容生成器会根据它生成 `structure.en.json`、`structure.zh-hans.json` 等本地化结构文件，并扫描实际 Markdown 文件生成页面元数据。

## 最小结构

```json
{
  "title": {
    "zh-hans": "模块标题"
  },
  "description": {
    "zh-hans": "模块简介。"
  },
  "navigation": [
    { "slug": "overview" }
  ]
}
```

`title` 和 `description` 使用本地化对象。暂不提供英文版的模块可以只写 `zh-hans`；不要为了填充字段而复制机器翻译或虚构英文页面。`navigation` 中的每个叶节点必须对应一个目录及其中的 `<locale>.md` 文件。

## 页面节点

最简单的页面节点只有 `slug`：

```json
{ "slug": "overview" }
```

如果需要给目录节点或没有对应正文的导航分组命名，可以提供本地化 `title` 和子 `navigation`：

```json
{
  "slug": "tutorials",
  "title": {
    "zh-hans": "基础指南"
  },
  "navigation": [
    { "slug": "getting-started" },
    { "slug": "syntax" }
  ]
}
```

上例要求存在以下文件：

```text
content/<module>/tutorials/getting-started/zh-hans.md
content/<module>/tutorials/syntax/zh-hans.md
```

子导航的 `slug` 会参与实际路径拼接。不要把根目录中的 `formatting/zh-hans.md` 放在名为 `tooling` 的子导航下，否则生成器会寻找不存在的 `tooling/formatting/zh-hans.md`。

## 叶节点与标题

叶节点的页面标题默认从 Markdown 第一个一级标题读取，因此推荐只写 `slug`，并把真实标题放在正文的 `#` 标题中。目录节点没有独立 Markdown 页面时，必须通过 `title` 提供导航显示名称。

```json
{
  "slug": "apis",
  "title": {
    "zh-hans": "服务端点"
  },
  "navigation": [
    { "slug": "depict" }
  ]
}
```

## 编写检查表

| 检查项 | 要求 |
| :--- | :--- |
| JSON 语法 | 必须是合法 JSON，使用双引号，不写注释和尾逗号。 |
| 模块目录 | `content/<module>/structure.json` 必须位于模块根目录。 |
| slug | 使用稳定、简短的 kebab-case，并与实际目录名一致。 |
| 页面文件 | 每个叶节点都必须存在对应语言的 Markdown 文件。 |
| 路径层级 | 子导航会增加目录层级，不能只改变显示名称。 |
| 语言 | 只提供实际存在的语言；中文-only 模块至少提供 `zh-hans`。 |
| 结构责任 | structure.json 只管导航，不把长篇正文塞入 JSON。 |

结构变更应与新增或移动的页面放在同一个 PR 中。移动页面时必须同步修改所有相对链接，并检查生成器是否仍能找到每个叶节点。
