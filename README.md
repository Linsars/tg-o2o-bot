[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Linsars/tg-o2o-bot)

# tg-o2o-bot 🤖

**一个 Telegram Bot，帮你管理访客。** 访客必须先答题验证才能找你聊天，管理群有每个人的资料卡、话题分区，谁断线了、谁改过名字一目了然。

## 它能做什么

- **访客验证** — 访客发 `/start` 后弹出 50 道随机文字题 + 20 个 emoji 图案题。第一题答错自动编辑成 emoji 题，再错自动封禁 7 天。全程不新发消息，界面干净
- **中英双语** — 所有题目、选项、系统消息中英文双语显示，两行按钮（中文 + 英文）任选
- **资料卡** — 每个访客在管理群有张卡片，状态实时更新，支持封禁/解封/信任/刷新/重建话题
- **断线检测** — 发消息被 TG 退回自动标记失信，需重新验证
- **话题自动重建** — 删了话题也不怕，下条消息自动建新的
- **多 bot 支持** — 一个 Worker 跑多个 bot，互不干扰

## 资料卡状态

| 状态 | 说明 |
|------|------|
| ⏳ 答题中 | 正在验证 |
| ✅ 正常 | 验证通过 |
| ❌ 失信 | 断线后标记，需重新答题 |
| 🌟 信任 | 永久免验证，断线不受影响 |
| 🚫 封禁（含到期时间） | 被封禁 |

## 访客命令

在私聊中：

| 命令 | 作用 |
|------|------|
| `/start` | 开始验证 |
| `/reply <内容>` | 引用回复管理员消息 |
| `/status` | 查看自身状态 |
| `/help` | 显示帮助 |

## 管理命令

在管理群的**访客话题**内使用：

| 命令 | 作用 |
|------|------|
| `/delall` | 撤回该访客全部消息（双方） |
| `/del` | 回复转发消息，撤回单条（群+访客端） |
| `/recall <用户ID>` | 按用户ID撤回全部消息 |
| `/reply <内容>` | 引用回复转发消息 |
| `/broadcast <消息>` | 广播消息给所有访客 |
| `/help` | 管理员帮助 |

资料卡按钮也支持：🚫封禁 / ✅解封 / 🌟信任 / ❌取消信任 / 🔄刷新资料 / 🆕重建话题。

## 部署

### 你需要准备

1. **Cloudflare 账号** — free 就行
2. **一个 Telegram Bot Token** — 找 [@BotFather](https://t.me/BotFather) 要
3. **Telegram 管理群** — 建个群，把 bot 拉进去设成管理员，获取群 ID（带 `-100` 前缀）
4. **你的 Telegram 用户 ID** — 找 [@userinfobot](https://t.me/userinfobot) 查

### 一键部署

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Linsars/tg-o2o-bot)

点上面的按钮，按提示授权 Cloudflare。它会自动创建 Worker + KV namespace，**但不支持 D1 数据库**。需要用以下额外步骤完成：

### 需要手动创建的

一键部署后，去 [Cloudflare Dashboard → Workers → tg-o2o-bot](https://dash.cloudflare.com/)：

**1. 创建 D1 数据库**

Workers & Pages → D1 → 创建数据库（名字随意，如 `tg-o2o-bot-db`）。创建好后进 Worker 的 **设置 → 绑定**，添加 **D1 数据库** 绑定：
- 变量名称: `TG_O2O_DB`
- 选择刚创建的 D1 数据库

**2. 设环境变量**

Worker → 设置 → 变量，添加一个 **环境变量** `BOT_CONFIGS`：

```json
[
  {
    "token": "你的bot token",
    "ownerId": "你的 Telegram 用户ID",
    "supergroupId": "管理群ID（带 -100 前缀）",
    "webhookSecret": "随便写个密码",
    "healthKey": "health_check_key"
  }
]
```

D1 的表由 Worker 首次运行时自动创建，无需手动建表。

**3. 激活**

浏览器打开你的 Worker 域名（`https://tg-o2o-bot.xxxx.workers.dev/`），看到绿色勾代表成功。

去管理群看看——应该出现了一个 **📋 用户资料汇总** 话题，里面有你的第一个资料卡。

### 加第二个 bot

继续往 `BOT_CONFIGS` 数组里加就行：

```json
[
  { "token": "bot1的token", "ownerId": "...", "supergroupId": "...", "webhookSecret": "...", "healthKey": "..." },
  { "token": "bot2的token", "ownerId": "...", "supergroupId": "...", "webhookSecret": "...", "healthKey": "..." }
]
```



MIT
