# Fer 表达式


## 求值模型

表达式产生一个值，或产生无值结果。实现可以优化求值顺序，但不得改变可观察结果、错误诊断或资源安全边界。任何具有副作用的操作都必须在其所属库的接口中明确说明。

一个块的值严格等于其最后一行表达式的值：

```fer
location = {
  lat = 120
  lng = 30
  { lat = lat, lng = lng }
}
```

如果最后一行是绑定操作，则该块不返回实质性值：

```fer
{
  temporary = create-resource()
  close-resource(temporary)
}
```

## Must-use 规则

如果块产生了 `string`、整数、结构体、枚举或其他实质性值，该值必须被绑定、作为参数传递、作为返回值返回，或显式交给一个消费函数。表达式不得悬空：

```fer
// 合法：值被绑定
message = format-user(user)

// 合法：值作为参数传递
print(format-user(user))

// 非法：结果被丢弃
format-user(user)
```

返回 `void` 的调用可以单独成行。实现不能仅凭函数名判断调用是否有值，必须根据函数签名和类型系统应用 Must-use 规则。

## Condition 表达式

condition 表达式返回 `bool`。比较词和符号是等价写法；项目应使用格式化工具的默认形式，不得在同一代码库中人为混用两套风格。

| 语义 | 词法形式 | 符号形式 | 适用类型 |
| --- | --- | --- | --- |
| 小于 | `less` | `<` | number |
| 大于 | `more` | `>` | number |
| 至少 | `least` | `>=` | number |
| 至多 | `most` | `<=` | number |
| 包含 | `contains` | 无 | string |
| 相等 | `equals` | 无 | string、number 或可比较类型 |
| 成员 | `in` | 无 | array 或集合 |
| 匹配 | `matches` | 无 | string 与 regex |
| 前缀 | `starts` | 无 | string |
| 后缀 | `ends` | 无 | string |
| 逻辑非 | `not` | `!` | bool |

**Quantifier** 组合多个 condition expression：

| 量词语法 | 数学含义 | 对应命令式 | 业务意图 |
| :--- | :--- | :--- | :--- |
| **`all ( ... )`** | 全部为真（∀） | `AND` / `&&` | 所有条件必须全部满足 |
| **`any ( ... )`** | 至少一个为真（∃ ≥ 1） | `OR` / `\|\|` | 命中任意一个即可 |
| **`one ( ... )`** | 恰好只有一个为真（∃ = 1） | `XOR` / 异或 | 排他互斥（有且仅有一个） |
| **`none ( ... )`** | 全部为假（∃ = 0） | `NOR` / `!any` | 所有条件绝不能命中 |

`all`、`any`、`one` 和 `none` 统称为 **Quantifier**（量词）。Quantifier 的形式为 `quantifier ( condition-expression-list )`，其中 `quantifier` 必须是这四个名称之一。内部 condition expression 无需额外加括号；Quantifier 遵循与 FON 相同的通用元素分隔规则：逗号 `,` 与换行 `\n` 均为合法分隔符，单行、多行和逗号与换行混合的分组都具有相同语义。列表中的表达式可以继续嵌套 Quantifier。`all`、`any` 和 `none` 可以在确定结果后短路；`one` 在已经确认有两个满足条件的表达式后可以短路。condition 表达式应保持纯语义，因此实现不得让短路优化改变可观察结果或资源安全边界。

示例：

```fer
/* All must match: */
can-access = all (
  user.is-logged-in

  /* At least one: */
  any (
    user.role equals .admin
    user.reputation >= 100
  )

  /* Exactly one: */
  one (
    payment.is-credit-card
    payment.is-crypto
  )

  /* None allowed: */
  none (
    user.is-banned
    user.is-suspended
  )
)

is-following = any (
  user.relationship equals .follower
  user.relationship equals .friend
)

/* Single-line Quantifier: */
cond = all (x > 10, y < 10, not (z contains `123`))

/* Multi-line Quantifier: */
cond = all (
  x > 10
  y < 10
  not (z contains `123`)
)

/* Mixed separators are also valid: */
cond = all (a > 1, b > 2
  c < 3)

is-text = not (comment.content matches `\\btx(|et|t|.*)\\b`)
```

`and`、`or` 和 `xor` 不再是 Fer 关键字；组合多个 condition expression 时，必须使用 `all`、`any`、`one` 或 `none` Quantifier。逗号 `,` 与换行 `\n` 都是合法的通用元素分隔符，Parser 必须将单行纯逗号、多行纯换行以及逗号与换行混合的 Quantifier 解析为等价的条件序列。CST 必须保留原始物理排版，以支持无损还原。

## Match 表达式

match 以一个表达式作为输入，并按分支顺序返回第一个匹配分支的值。分支使用大括号表示：

```fer
age = 20
category = age {
  < 18 { `minor` }
  > 60 { `old` }
  { `adult` }
}
```

最后一个没有模式的分支是默认分支。没有匹配分支且没有默认分支时，编译器必须报告非穷尽匹配；不得隐式返回空值。

condition 结果也可以作为 match 输入：

```fer
label = any (
  comment.content matches `regex`
  comment.content contains `xxx`
) {
  true { `匹配或包含` }
  { `未匹配到` }
}
```

模式分支的结果必须具有可统一的类型，或者显式声明为共同的枚举、结构体或 `Option`。分支内部同样遵循块返回值和 Must-use 规则。

## 成员访问和调用

成员访问使用点号。若成员后面是调用括号，则它可能触发 UFCS 解析；完整规则见 [函数与调用](../functions/zh-hans.md)：

```fer
io.stdout.writer().write(bytes = `Zero cost abstraction`)
```

成员访问不得动态创建字段。访问未知字段、访问私有字段或把函数当作值使用但缺少显式函数类型时，必须报告编译期错误。

## 条件与副作用

condition 和 match 的判断表达式应当是纯表达式。需要执行 I/O、锁、网络或资源释放时，应调用明确命名的函数，并让其返回值遵循 Must-use 规则。实现不得把条件分支的求值改写成会额外执行副作用的形式。

## 相关主题

- [函数与调用](../functions/zh-hans.md)
- [类型系统](../types/zh-hans.md)
- [字符串](../strings/zh-hans.md)
- [Fer 语法基础](../syntax/zh-hans.md)
