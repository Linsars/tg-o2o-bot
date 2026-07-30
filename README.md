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

## 技术架构

```
访客 → Telegram → Cloudflare Worker (D1 + KV) → 管理群话题
                ← 转发/回复 ←
```

### 持久化（D1）

| 表 | 用途 |
|----|------|
| `users` | 用户数据（状态、昵称、话题ID、曾用名、资料卡等） |
| `thread_map` | 话题ID ↔ 用户ID |
| `bot_msgs` | bot 发给访客的消息ID（用于撤回） |
| `msg_map` | 群消息ID ↔ 用户ID |
| `msg_del` | 群消息ID ↔ 访客消息ID（用于 `/del` 和 `/reply` 引用） |

### 临时态（KV）

验证码、限流、消息编辑映射等短期数据存在 KV，自动过期。

## 部署

### 你需要准备

1. **Cloudflare 账号** — free 就行
2. **一个 Telegram Bot Token** — 找 [@BotFather](https://t.me/BotFather) 要
3. **Telegram 管理群** — 建个群，把 bot 拉进去设成管理员

### 步骤

1. **Fork 仓库** 到你自己的 GitHub
2. **Cloudflare Dashboard** → Workers & Pages → 创建 Worker
3. **创建 D1 数据库**（名如 `tg-o2o-bot-db`），Worker 绑定变量名填 `TG_O2O_DB`
4. **创建 KV namespace**（名如 `tg-o2o-bot-kv`），Worker 绑定变量名填 `KV`
5. **设环境变量 `BOT_CONFIGS`**：

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

6. **部署 Worker** — 把 `worker.js` 的内容粘贴到 Cloudflare Dashboard 编辑器，保存并部署。或者用 wrangler CLI / API 部署（记得在 metadata 里带上 D1 和 KV 绑定）
7. **激活 webhook** — 浏览器打开 Worker 域名，页面会自动注册 webhook

### 加第二个 bot

继续往 `BOT_CONFIGS` 数组里加就行：

```json
[
  { "token": "bot1的token", "ownerId": "...", "supergroupId": "...", "webhookSecret": "...", "healthKey": "..." },
  { "token": "bot2的token", "ownerId": "...", "supergroupId": "...", "webhookSecret": "...", "healthKey": "..." }
]
```

### API 部署（带绑定的 metadata 示例）

```json
{
  "main_module": "worker.js",
  "bindings": [
    {"name": "KV", "type": "kv_namespace", "namespace_id": "你的KV namespace ID"},
    {"name": "TG_O2O_DB", "type": "d1", "id": "你的D1数据库ID"}
  ],
  "keep_bindings": ["plain_text", "secret_text", "service"]
}
```

## D1 初始化

首次部署后 Worker 会自动建表，无需手动操作。建的表包括：

```sql
CREATE TABLE IF NOT EXISTS users (...)
CREATE TABLE IF NOT EXISTS thread_map (...)
CREATE TABLE IF NOT EXISTS bot_msgs (...)
CREATE TABLE IF NOT EXISTS msg_map (...)
CREATE TABLE IF NOT EXISTS msg_del (...)
```

## 开源协议

MIT
