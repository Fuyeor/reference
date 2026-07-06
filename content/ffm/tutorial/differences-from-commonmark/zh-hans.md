# FFM 与其他 Markdown 的差异

Markdown 作为轻量标记语言，通常存在不同规范，例如最普及的 CommonMark，或 GitHub 在前者基础上扩展而来的 GitHub Flavored Markdown（GFM）等。

## 与 CommonMark 的差异

FFM（Fuyeor Flavored Markdown）和 CommonMark 是两种语法有交集但在设计哲学上不同的 Markdown 规范。

以下是 FFM 不支持的 CommonMark 核心语法特性：

```chain
**底线标题（Setext headings）**

CommonMark 中使用连续底线（如 `===` 或 `---`）声明 H1/H2 的语法，经常会导致因文本分隔线和文字没有换 2 行而触发意外标题的错误，且仅支持前两级标题。FFM 使用 ATX 标题语法（即以 `#` 开头）。

**内联 HTML（Inline HTML）**

CommonMark 建议在文档中使用 HTML，而 FFM 完全不支持任何 HTML 渲染。

此举旨在提升兼容性，避免耦合浏览器引擎，以及彻底避免跨站脚本攻击（XSS），并确保文档解析引擎的绝对可预测性。

**下划线相关语法**

1、下划线粗体与斜体（`__bold__` / `_italic_`）：

- 单/双下划线在 CommonMark 规范中以“西方空格分隔单词”为基础逻辑。
- 在不使用空格分隔字词的中文、日文连写中，极易引发解析边界识别歧义，从而导致意外的渲染失效。

2、下划线分隔符（`___`）：

- 分隔符语法已经有 `---`、`***` 两种，支持第三种必要性低。
- 下划线分隔符上方留白间距大于下方留白间距，容易无意中上方忘记换行。

**缩进代码块（Indented Code Blocks）、波浪号围栏代码块（Tilde Fenced Code Blocks）**

行首 ≥4 空格或 1 Tab 触发的代码块语法极易在日常排版时被意外触发。

在 FFM 中，只使用现代、清晰且语义明确的围栏代码块（Fenced Code Blocks，即 ` ``` `）作为唯一代码块语法。
```

## 与 GFM 的差异

FFM 支持 GFM 的表格、任务列表语法，但不支持 GitHub 删除线（`~~text~~`）。

这是因为在 CJK（中日韩）语境下，波浪号 `~` 经常被用户高频用于表达语气拉长或情绪缓冲（如“好哒~~”），GFM 删除线语法极易与该习惯发生解析冲突导致无意的删除线。

## 扩展语法

为提供更直观的排版体验，FFM 引入了以下更具视觉隐喻的行间语法：

| 输入语法 | 渲染效果 | 视觉隐喻 |
| :--- | :--- | :--- |
| `__Underline__` | __Underline__ | 底线代表下划线 |
| `--Strike--` | --Strike-- | 减号（删除线）横穿文本 |

以及 slide、quote、chain、accordion 等块语法。