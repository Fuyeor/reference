# 连接到 Mastodon 平台

> 我们目前仅支持 **mastodon.social** 实例，其他实例暂不支持。

## 1、创建 Mastodon 账号

访问 [https://mastodon.social](https://mastodon.social)，点击“注册”按钮，按照页面提示完成账号创建。

若已有账号，请从以下步骤开始：

## 2、创建应用程序并获取 Access Token

1. 登录你的 Mastodon 账号后，打开[应用程序创建页面](https://mastodon.social/settings/applications/new)。
2. 在“应用名称”字段填写任意名称（建议填写 `Ф syncservice`）。
3. 在权限设置中，至少启用 **write:statuses**（发布嘟文）。
4. 提交后，返回 [应用程序列表页面](https://mastodon.social/settings/applications)。
5. 点击你刚创建的应用名称，复制“Your access token”。

## 3、在 Ф social 绑定

访问 [Ф Connections](https://www.fuyeor.com/options/account/connections) ，选择 Mastodon 连接选项，将上一步复制的 Access Token 粘贴并保存。

绑定成功后，即可使用相关同步功能。如遇问题，请检查 Token 是否正确或权限是否充足。

## 4、在 Mastodon 启用“机器人标识”（可选）

打开[更改个人资料](https://mastodon.social/settings/profile) > 其他，选择：

> **这是一个机器人账号**
>
> 来自这个账号的绝大多数操作都是自动进行的，并且可能无人监控

此步骤有助于更加透明。
