[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Linsars/tg-o2o-bot)

# tg-o2o-bot 🤖

**一个 Telegram Bot，帮你管理访客。** 访客必须先答题验证才能找你聊天，管理群有每个人的资料卡、话题分区，谁断线了、谁改过名字一目了然。

## 它能做什么

- **访客验证** — 访客发 `/start` 后先答题，答对才能聊天。两道题（文字+表情），错了就封禁
- **资料卡** — 每个访客在管理群有张卡片，状态实时更新：⏳答题中 → ✅正常 / ❌失信 / 🚫封禁 / 🌟信任
- **断线检测** — 你给访客发消息如果被 TG 退回（对方删了对话/屏蔽了 bot），非信任用户自动标记 ❌失信，访客需重新发 `/start` 验证；信任用户不受影响，重新发消息自动恢复
- **昵称历史** — 点卡片上的 🔥刷新 按钮，bot 拉取最新昵称和用户名，旧昵称自动存到"曾用名"里，话题标题也跟着更新
- **多 bot 支持** — 一个 Worker 跑多个 bot，互不干扰
- **私聊转发** — 访客给 bot 发消息 → 自动转到管理群的话题里；你在话题里回复 → 自动转发给访客
- **话题自动重建** — 删了话题也不怕，访客再发消息会自动重建

## 资料卡状态

| 状态 | 说明 |
|------|------|
| ⏳ 答题中 | 正在验证 |
| ✅ 正常 | 验证通过，可以聊天 |
| ❌ 失信 | 断线后被标记，需重新答题 |
| 🌟 信任 | 永久免验证，断线也不影响 |
| 🚫 封禁（到期时间） | 被封禁了 |
| ⏳ 答题中 | 访客正在验证答题 |

## 部署

### 你需要准备

1. **Cloudflare 账号** — free 就行
2. **一个 Telegram Bot Token** — 找 [@BotFather](https://t.me/BotFather) 要
3. **Telegram 管理群** — 建个群，把 bot 拉进去，设成管理员

### 一键部署

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Linsars/tg-o2o-bot)

点上面的屎黄色按钮，按提示授权 Cloudflare，Worker 就自动部署好了。

### 配置

部署完后，去 Cloudflare Dashboard 找到你的 Worker，设**环境变量** `BOT_CONFIGS`：

```json
[
  {
    "token": "你的bot token（找 @BotFather 要）",
    "ownerId": "你的 Telegram 用户ID（找 @userinfobot 查）",
    "supergroupId": "管理群ID（带 -100 前缀）",
    "webhookSecret": "随便写个密码",
    "healthKey": "health_check_key"
  }
]
```

- `token` — BotFather 给你的 token
- `ownerId` — 你的 Telegram User ID（找 [@userinfobot](https://t.me/userinfobot) 查）
- `supergroupId` — 管理群的 ID（带 `-100` 前缀）
- `webhookSecret` — 随意，用来保证 webhook 安全
- `healthKey` — 健康检查用

**加第二个 bot** 继续往数组里加就行：

```json
[
  { "token": "第一个bot的token", "ownerId": "...", "supergroupId": "...", "webhookSecret": "...", "healthKey": "..." },
  { "token": "第二个bot的token", "ownerId": "...", "supergroupId": "...", "webhookSecret": "...", "healthKey": "..." }
]
```

还要设一个 KV 绑定（如果一键部署没自动配好的话）：
- 创建一个 KV namespace（名字随意）
- 在 Worker 的 KV 绑定里，变量名填 `KV`，选择刚建的 namespace

### 激活

配好后，在浏览器打开你的 Worker 域名（`https://tg-o2o-bot-v1.xxxx.workers.dev/`），它会自动注册所有 bot 的 webhook。看到绿色勾就代表成功了。

去管理群看看——应该出现了一个「📋 用户资料汇总」话题，里面有你的第一个资料卡。

### 管理命令

在管理群的**访客话题**里发：

| 命令 | 作用 |
|------|------|
| `/ban 原因` | 封禁该访客 |
| `/unban` | 解封 |
| `/trust` | 设为信任（永久免验证） |
| `/status` | 查看该访客状态 |
| `/close` | 关闭话题 |
| `/open` | 重新打开话题 |
| `/reply 文字` | 回复访客（也可以直接回复消息） |
| `/broadcast 文字` | 群发给所有已通过验证的访客 |

当然，你也可以直接在资料卡上点按钮：🚫封禁 / 🌟信任 / 🔄刷新资料。

## 技术架构

一个 Cloudflare Worker 同时跑 N 个 bot，所有配置在 `BOT_CONFIGS` 环境变量里。每个 bot 的数据用 `b0:` `b1:` 前缀隔离存在同一个 KV namespace 里。

```
访客 → Telegram → Cloudflare Worker → 管理群话题
                ← 转发/回复 ←
```

## 开源协议

MIT
