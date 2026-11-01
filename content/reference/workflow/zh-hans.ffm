# 编辑与 PR 工作流

Reference 的普通文档变更应通过独立分支和 Pull Request 完成。这样可以让结构、链接、正文和生成结果在合并前被复查，也能避免未审查内容直接进入 `main`。

## 推荐流程

```text
更新 main
  → 创建 docs/ 或 fix/ 分支
  → 修改 Markdown 与 structure.json
  → 检查链接、JSON 和导航路径
  → 运行测试与生成器
  → 检查 diff
  → 创建 PR
  → 根据审查意见修改
  → 合并后删除分支
```

开始工作前先同步远端：

```sh
git fetch origin main
git switch -c docs/update-reference-content origin/main
```

分支名应描述变更目的。文档提交遵循 Angular Conventional 风格，首字母大写，例如：

```text
docs: Add Fer and FON reference modules
```

## 提交前检查

| 检查 | 目的 |
| :--- | :--- |
| `git diff --check` | 发现尾随空格和空白错误。 |
| JSON 解析 | 确认每个新增或修改的 `structure.json` 是合法 JSON。 |
| 导航路径 | 确认每个叶节点都有对应的 `zh-hans.md`。 |
| 相对链接 | 确认页面移动后没有残留旧路径或死链。 |
| 内容生成 | 运行仓库提供的 generator，检查本地化 structure 和页面元数据。 |
| 自动化测试 | 运行 `pnpm test`；若改动只涉及内容，也应记录测试结果。 |
| 差异审查 | 确认没有把生成文件、密钥、临时日志或无关格式化提交进 PR。 |

生成器对缺少语言文件可能输出警告。中文-only 模块可以暂不提供英文正文，但 PR 描述应明确这是有意选择，而不是遗漏。

## PR 内容

PR 标题应简洁说明变更结果。正文至少说明变更模块、导航或链接影响、是否新增语言文件、运行过的检查，以及是否存在尚未冻结的内容。涉及规范迁移时，应说明源仓库、目标路径和被移除的头部元信息。

PR 不应包含研究日志、临时脚本、中文以外的过程性说明文件或与目标无关的代码。需要长期维护的编辑规则应写入 [Reference 网站编辑指南](../overview/zh-hans)，而不是只留在 PR 对话中。

## 合并后

合并后确认 `main` 的内容目录、生成产物和站点页面都能访问。若发现导航路径错误，应优先修复 `structure.json` 或目录结构，而不是在前端增加额外的路径兜底。稳定链接一旦公开，后续重命名必须同时提供迁移或重定向策略。
