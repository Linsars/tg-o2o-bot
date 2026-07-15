# tg-o2o-bot

动态多 bot Telegram 客服系统，运行在 Cloudflare Workers 上。

## 功能

- **多 bot 支持** — 单个 Worker 驱动多个 bot，通过 `BOT_CONFIGS` JSON 配置
- **访客验证** — 文字题 + 表情题双验证，答错自动编辑为下一题（全程单消息）
- **资料汇总卡片** — 每个访客一张卡片，显示昵称、状态、曾用名、断线标记
- **话题隔离** — 每个访客自动创建独立话题，互不干扰
- **状态流转**

```
✅ 正常       — 通过验证
❌ 失信       — 断线后标记，需重新答题
🌟 信任       — 白名单，免验证
🚫 封禁       — 含到期时间显示
📴 失联       — 主人发消息 blocked 自动检测
```

- **管理命令** — `/ban` `/unban` `/trust` `/status` `/reply` `/broadcast`
- **资料卡按钮** — 封禁/信任/刷新资料，直接编辑卡片
- **昵称历史** — 自动追踪访客曾用名，刷新按钮同步话题标题
- **断线检测** — 主人回复访客时 blocked → 自动标记失联 + 标记失信
- **话题重建** — 管理员删话题后访客再发消息自动重建

## 部署

### 前置

- Cloudflare 账号
- 准备好 bot token（从 @BotFather 获取）
- 创建 KV namespace

### 步骤

1. 在 Cloudflare Dashboard 创建 Worker 服务（ES Module 格式）

2. 创建 KV namespace 并绑定到 Worker（绑定名 `KV`）

3. 设置环境变量 `BOT_CONFIGS`：

```json
[
  {
    "token": "7953831204:AAE...",
    "ownerId": "5562061420",
    "supergroupId": "-1003904689841",
    "webhookSecret": "your_secret",
    "healthKey": "health"
  }
]
```

| 字段 | 说明 |
|------|------|
| `token` | Bot token |
| `ownerId` | 管理员的 Telegram 用户 ID（数字） |
| `supergroupId` | 管理群组 ID（含 -100 前缀） |
| `webhookSecret` | Webhook 密钥（用于 X-Telegram-Bot-Api-Secret-Token） |
| `healthKey` | 健康检查端点后缀（如 health → /health） |

4. 上传 `worker.js` 到 Worker

5. 访问 Worker 域名 → 自动激活所有 bot 的 webhook

### 添加新 bot

只需在 `BOT_CONFIGS` 末尾追加一个对象，访问一次 Worker 域名即可自动注册 webhook。
无需改代码，无需额外部署。

### KV 键名约定

| 前缀 | 用途 |
|------|------|
| `b0:` / `b1:` ... | bot 数据隔离，b0 对应 BOT_CONFIGS[0] |
| `verify:{uid}` | 验证状态 |
| `user:{uid}` | 用户话题信息和昵称历史 |
| `profile_card:{uid}` | 资料卡消息位置 |
| `banned:{uid}` | 封禁状态 |
| `trusted:{uid}` | 信任状态 |
| `disconnected:{uid}` | 断线标记 |
| `distrusted:{uid}` | 失信标记 |

## 架构

```
访客 → Bot Private Chat → Worker → 管理员群组话题
        ↑                        ↓
        验证 ← ← ← ← ← ← ← ← ← ←
```

- 访客首次 `/start` → 验证答题 → 通过后建话题
- 访客在话题发消息 → bot 转发到管理员群组的话题
- 管理员在话题回复 → bot 转发给访客
- 所有状态通过资料卡在「📋 用户资料汇总」话题统一管理
