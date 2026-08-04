# 连接到 Telegram 平台

## 1、打开 BotFather

打开 Telegram 应用，搜索并访问 [BotFather](https://t.me/BotFather)。

## 2、创建新机器人

在 BotFather 的聊天窗口中，回复 `/newbot`。

## 3、提供机器人信息

按照提示，分别输入机器人的名称和用户名（用户名必须以 "bot" 结尾）。

## 4、完成设置

创建完成后，BotFather 会回复：

> Done! Congratulations on your new bot. You will find it at `t.me/你的用户名`. You can now add a description, about section and profile picture for your bot, see /help for a list of commands. By the way, when you've finished creating your cool bot, ping our Bot Support if you want a better username for it. Just make sure the bot is fully operational before you do this. Use this token to access the HTTP API: [你的 Token] Keep your token secure and store it safely, it can be used by anyone to control your bot.

请妥善保存生成的 **Token**，该 Token 将用于访问 HTTP API。请勿泄露此 Token 到公共频道。

## 5、添加机器人到频道

打开频道设置，选择“管理员”，然后搜索第三步中填写的机器人的用户名，将其添加到频道。

## 6、配置连接

访问 [Ф Connections](https://www.fuyeor.com/options/account/connections) ，选择 Telegram 连接选项，输入机器人的 Token 和频道的用户名，以完成连接配置。

> 注意：请不要填写机器人的用户名，既以 bot 结尾的用户名。
