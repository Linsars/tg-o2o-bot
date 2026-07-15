const BOT_NAME = "tg-o2o-bot";

const HTML_PAGE = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${BOT_NAME}</title>
<style>
body{font-family:Arial,sans-serif;text-align:center;padding:50px;background:#f5f5f5}
.box{background:#fff;padding:30px;border-radius:10px;max-width:420px;margin:0 auto;box-shadow:0 2px 8px rgba(0,0,0,.08)}
input{width:90%;padding:10px;margin:10px 0;border:1px solid #ddd;border-radius:5px;font-size:14px}
input[type=number]{width:60px;padding:10px;margin:10px 5px;border:1px solid #ddd;border-radius:5px;font-size:14px;text-align:center}
button{background:#0088cc;color:#fff;border:none;padding:12px 28px;border-radius:5px;font-size:15px;cursor:pointer;margin-top:10px}
button:hover{background:#006699}.tip{font-size:12px;color:#999;margin-top:15px}
#result{margin-top:15px;padding:10px;border-radius:5px;display:none}
.ok{background:#d4edda;color:#155724}.err{background:#f8d7da;color:#721c24}
#health{position:fixed;top:10px;right:10px;padding:4px 10px;border-radius:12px;font-size:11px;color:#fff;cursor:pointer}
.h-ok{background:#28a745}.h-err{background:#dc3545}.h-ing{background:#6c757d}
</style>
</head>
<body>
<span id="health" class="h-ing">检查中...</span>
<div class="box">
<h1>🤖 Telegram Bot</h1>
<p>输入 Bot Token 和 Bot 编号激活 Webhook：</p>
<input type="text" id="token" placeholder="123456:ABC-DEF...">
<label>#</label><input type="number" id="botIdx" value="1" min="1">
<br>
<button onclick="activate()">激活机器人</button>
<div id="result"></div>
<p class="tip">Token 仅在浏览器本地使用，不会上传到服务器</p>
</div>
<script>
(async()=>{try{const r=await fetch("/health?key="+new URLSearchParams(location.search).get("key"));const d=await r.json();const h=document.getElementById("health");h.textContent=d.bot+" "+d.count+" bots "+(d.status==="ok"?"运行中":"异常");h.className=d.status==="ok"?"h-ok":"h-err"}catch(e){document.getElementById("health").textContent="离线";document.getElementById("health").className="h-err"}})();
async function activate(){var t=document.getElementById("token").value.trim(),i=parseInt(document.getElementById("botIdx").value)||1,r=document.getElementById("result");if(!t){r.style.display="block";r.className="err";r.textContent="请输入 Token";return}r.style.display="block";r.className="";r.textContent="正在激活...";try{var resp=await fetch("/activate"+(i>1?i:""),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token:t})});var d=await resp.json();if(d.ok){r.className="ok";r.textContent="✅ 激活成功！"}else{r.className="err";r.textContent="❌ "+d.description}}catch(e){r.className="err";r.textContent="❌ "+e.message}}
</script></body></html>`;

const TEXT_QUESTIONS = [
  {q:"冰融化后会变成什么？",a:"水",o:["水","石头","木头","火"]},{q:"正常人有几只眼睛？",a:"2",o:["2","1","3","4"]},{q:"以下哪个属于水果？",a:"香蕉",o:["香蕉","白菜","猪肉","大米"]},{q:"1 加 2 等于几？",a:"3",o:["3","2","4","5"]},{q:"5 减 2 等于几？",a:"3",o:["3","1","2","4"]},{q:"2 乘以 3 等于几？",a:"6",o:["6","4","5","7"]},{q:"在天上飞的交通工具是什么？",a:"飞机",o:["飞机","汽车","轮船","自行车"]},{q:"星期一的后面是星期几？",a:"星期二",o:["星期二","星期日","星期五","星期三"]},{q:"鱼通常生活在哪里？",a:"水里",o:["水里","树上","土里","火里"]},{q:"晴朗的天空通常是什么颜色？",a:"蓝色",o:["蓝色","绿色","红色","紫色"]},{q:"太阳从哪个方向升起？",a:"东方",o:["东方","西方","南方","北方"]},{q:"小狗发出的叫声通常是？",a:"汪汪",o:["汪汪","喵喵","咩咩","呱呱"]},{q:"10 加 5 等于几？",a:"15",o:["15","10","12","20"]},{q:"8 减 4 等于几？",a:"4",o:["4","2","3","5"]},{q:"我们用什么器官来听声音？",a:"耳朵",o:["耳朵","眼睛","鼻子","嘴巴"]},{q:"一年有几个月？",a:"12",o:["12","10","11","13"]},{q:"一周有几天？",a:"7",o:["7","5","6","8"]},{q:"地球是什么形状？",a:"球形",o:["球形","方形","三角形","圆柱形"]},{q:"水的化学式是什么？",a:"H2O",o:["H2O","CO2","O2","NaCl"]},{q:"中国有多少个省级行政区？",a:"34",o:["34","30","32","36"]},{q:"以下哪个是哺乳动物？",a:"鲸鱼",o:["鲸鱼","鲨鱼","鳄鱼","蜥蜴"]},{q:"光合作用需要什么气体？",a:"二氧化碳",o:["二氧化碳","氧气","氮气","氢气"]},{q:"月亮绕地球一圈大约多久？",a:"一个月",o:["一个月","一天","一周","一年"]},{q:"以下哪个是中国的传统节日？",a:"春节",o:["春节","圣诞节","感恩节","复活节"]},{q:"人体最大的器官是什么？",a:"皮肤",o:["皮肤","肝脏","大脑","心脏"]},{q:"哪种动物被称为百兽之王？",a:"老虎",o:["老虎","狮子","大象","熊"]},{q:"一打等于几个？",a:"12",o:["12","10","24","6"]},{q:"世界上最长的河流是？",a:"尼罗河",o:["尼罗河","长江","亚马逊河","黄河"]},{q:"铅笔芯主要成分是什么？",a:"石墨",o:["石墨","铅","碳","铁"]},{q:"WiFi 是什么的缩写？",a:"无线保真",o:["无线保真","宽带网络","光纤传输","蓝牙连接"]},{q:"一天有多少小时？",a:"24",o:["24","12","48","36"]},{q:"三角形内角和是多少度？",a:"180",o:["180","360","90","270"]},{q:"以下哪个是可再生能源？",a:"太阳能",o:["太阳能","石油","煤炭","天然气"]},{q:"蜜蜂采蜜后会酿成什么？",a:"蜂蜜",o:["蜂蜜","蜂蜡","花粉","果酱"]},{q:"人体有多少块骨头？",a:"206",o:["206","180","300","150"]},{q:"以下哪个行星最大？",a:"木星",o:["木星","地球","火星","土星"]},{q:"彩虹有几种颜色？",a:"7",o:["7","5","6","8"]},{q:"向日葵会朝向哪个方向？",a:"太阳",o:["太阳","月亮","北方","南方"]},{q:"大象的鼻子有什么功能？",a:"呼吸和抓取",o:["呼吸和抓取","只能呼吸","只能抓取","装饰用"]},{q:"铁生锈需要什么？",a:"水和氧气",o:["水和氧气","只需要水","只需要氧气","阳光"]},{q:"哪种鸟不会飞？",a:"企鹅",o:["企鹅","麻雀","鸽子","燕子"]},{q:"以下哪个是哺乳动物的特征？",a:"胎生",o:["胎生","卵生","有鳞片","有羽毛"]},{q:"地球自转一圈需要多久？",a:"24小时",o:["24小时","12小时","365天","30天"]},{q:"糖溶解在水里会怎样？",a:"消失不见",o:["消失不见","沉到水底","浮在水面","变色"]},{q:"以下哪个是中国的首都？",a:"北京",o:["北京","上海","广州","深圳"]},{q:"鸡蛋是哪种动物的卵？",a:"鸡",o:["鸡","鸭","鹅","鸟"]},{q:"镜子利用的是什么原理？",a:"光的反射",o:["光的反射","光的折射","光的散射","光的吸收"]},{q:"人正常体温大约是多少度？",a:"36.5",o:["36.5","35","38","40"]},{q:"冰水混合物的温度是？",a:"0度",o:["0度","10度","-10度","100度"]},{q:"以下哪个交通工具最快？",a:"飞机",o:["飞机","火车","汽车","轮船"]}
];

const EMOJI_POOL = ["🐶","🐱","🐼","🦊","🐸","🦁","🐮","🐷","🐵","🐰","🐻","🐧","🦄","🐙","🦋","🐳","🦜","🐢","🦔","🐲"];

function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function genTextQ(){const q=TEXT_QUESTIONS[Math.floor(Math.random()*TEXT_QUESTIONS.length)];return{question:q.q,answer:q.a,options:shuffle(q.o)}}
function genEmojiQ(){const answer=EMOJI_POOL[Math.floor(Math.random()*EMOJI_POOL.length)];const d=shuffle(EMOJI_POOL.filter(e=>e!==answer)).slice(0,7);return{question:`Tap ${answer}`,answer,options:shuffle([answer,...d])}}
function shortId(){return Math.random().toString(36).substring(2,8)}
function msToTime(ms){const h=Math.floor(ms/3600000);return h<24?`${h}小时`:`${Math.floor(h/24)}天${h%24}小时`}

// ============ 动态多 bot 配置系统 ============
// BOT_CONFIGS env var: JSON array of bot configs
// [{"token":"...","owner":"...","group":"...","secret":"...","healthKey":"..."}]
// 回退: ENV_BOT_TOKEN + ENV_BOT_TOKEN_2/3/... 等旧格式
function loadConfigs(env) {
  if (env.BOT_CONFIGS) {
    try {
      const c = JSON.parse(env.BOT_CONFIGS);
      if (Array.isArray(c) && c.length > 0) return c;
    } catch(e) { console.error("BOT_CONFIGS parse error:", e.message); }
  }
  // 旧格式回退：扫描 _2, _3, ... 后缀
  const cfgs = [];
  for (let i = 1; ; i++) {
    const s = i === 1 ? '' : `_${i}`;
    const t = env[`ENV_BOT_TOKEN${s}`];
    if (!t) break;
    cfgs.push({
      token: t,
      ownerId: env[`ENV_OWNER_ID${s}`] || '',
      supergroupId: env[`ENV_SUPERGROUP_ID${s}`] || '',
      webhookSecret: env[`ENV_WEBHOOK_SECRET${s}`] || '',
      healthKey: env[`ENV_HEALTH_KEY${s}`] || '',
    });
  }
  return cfgs;
}

function getBotIndex(url) {
  // /webhook  → 0, /webhook2 → 1, /health3 → 2, /activate4 → 3
  const m = url.pathname.match(/(\d+)$/);
  if (m) return Math.max(0, parseInt(m[1]) - 1);
  return 0;
}

function botSuffix(idx) { return idx === 0 ? '' : String(idx + 1); }

function getCfg(configs, idx, kv) {
  const c = configs[idx] || configs[0];
  return {
    bot: `bot${idx + 1}`,
    token: c.token,
    ownerId: c.ownerId,
    supergroupId: c.supergroupId,
    healthKey: c.healthKey || '',
    webhookSecret: c.webhookSecret || '',
    kv: kv,
    kvPrefix: `b${idx}:`,
  };
}

function k(cfg, key) { return cfg.kvPrefix + key; }

// ============ Telegram API 工具 ============
async function tgWithRetry(token,method,body,retries=2){
  for(let i=0;i<=retries;i++){
    try{
      const r=await fetch(`https://api.telegram.org/bot${token}/${method}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});
      const d=await r.json();
      if(d.ok||i===retries)return d;
      if(d.error_code===429){const wait=(d.parameters?.retry_after||1)*1000;await new Promise(r=>setTimeout(r,wait));continue}
      return d;
    }catch(e){if(i===retries)return{ok:false,description:e.message};await new Promise(r=>setTimeout(r,1000))}
  }
}

async function isBlocked(token,userId){
  const r=await fetch(`https://api.telegram.org/bot${token}/sendChatAction`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({chat_id:userId,action:"typing"})});
  const d=await r.json();return!d.ok&&(d.description||"").includes("blocked");
}

function buildTopicTitle(from){
  const name=[from.first_name||"",from.last_name||""].join(" ").trim().substring(0,50);
  const u=from.username?`@${from.username}`:"";
  return`${name} ${u} [${from.id}]`.trim().substring(0,128);
}

async function getNameHistory(cfg, userId) {
  const rec = await cfg.kv.get(cfg.kvPrefix + `user:${userId}`, {type:"json"});
  return rec?.nameHistory || [];
}

async function saveNameChange(cfg, userId, from) {
  const key = cfg.kvPrefix + `user:${userId}`;
  const rec = await cfg.kv.get(key, {type:"json"});
  // 逐字段比较：三个独立字段全等才算没变
  if (rec && rec.first_name === from.first_name && rec.last_name === from.last_name && rec.username === from.username) {
    if (!rec.nameHistory) { rec.nameHistory = []; await cfg.kv.put(key, JSON.stringify(rec)); }
    if (rec.title !== buildTopicTitle(from)) { rec.title = buildTopicTitle(from); await cfg.kv.put(key, JSON.stringify(rec)); }
    return rec;
  }
  // 自动修正：first_name 里含 @用户名（旧 bug 遗留）但来源没有 → 直接修复，不写历史
  if (rec && from.first_name && !from.first_name.includes('@') && rec.first_name && rec.first_name.includes('@')) {
    rec.first_name = from.first_name || '';
    rec.last_name = from.last_name || '';
    rec.username = from.username || '';
    rec.title = buildTopicTitle(from);
    if (!rec.nameHistory) rec.nameHistory = [];
    await cfg.kv.put(key, JSON.stringify(rec));
    return rec;
  }
  // 自动修正：last_name 被旧 fakeFrom 清空了的 → 静默补回
  if (rec && from.last_name && !rec.last_name && rec.first_name === from.first_name && rec.username === from.username) {
    rec.last_name = from.last_name;
    rec.title = buildTopicTitle(from);
    await cfg.kv.put(key, JSON.stringify(rec));
    return rec;
  }
  if (rec) {
    // 有变化，存旧名到历史
    const oldName = rec.title ? rec.title.split(' [')[0] : '';
    const history = rec.nameHistory || [];
    history.push({name: oldName, username: rec.username || '', time: new Date().toLocaleString('zh-CN')});
    rec.nameHistory = history;
  }
  const newRec = rec || {};
  newRec.first_name = from.first_name || '';
  newRec.last_name = from.last_name || '';
  newRec.username = from.username || '';
  newRec.title = buildTopicTitle(from);
  if (!newRec.nameHistory) newRec.nameHistory = [];
  await cfg.kv.put(key, JSON.stringify(newRec));
  return newRec;
}

async function getTopic(cfg,userId,from){
  const ex=await cfg.kv.get(k(cfg,`user:${userId}`),{type:"json"});
  if(ex?.thread_id){
    if(from&&(ex.last_name!==from.last_name||ex.username!==from.username)){
      // 先用 saveNameChange 记录旧名
      await saveNameChange(cfg, userId, from);
      // 再读更新后的记录
      const updated = await cfg.kv.get(k(cfg,`user:${userId}`), {type:"json"});
      if (updated?.thread_id) {
        try{await tgWithRetry(cfg.token,"editForumTopic",{chat_id:cfg.supergroupId,message_thread_id:updated.thread_id,name:updated.title.substring(0,128)});}catch(e){}
      }
      return updated;
    }
    return ex;
  }
  const title=buildTopicTitle(from);
  const res=await tgWithRetry(cfg.token,"createForumTopic",{chat_id:cfg.supergroupId,name:title});
  if(!res.ok)throw new Error("创建话题失败: "+res.description);
  const rec={thread_id:res.result.message_thread_id,title,username:from.username,last_name:from.last_name,first_name:from.first_name||'',nameHistory:[]};
  await cfg.kv.put(k(cfg,`user:${userId}`),JSON.stringify(rec));
  await cfg.kv.put(k(cfg,`thread:${rec.thread_id}`),String(userId));
  return rec;
}

async function uidByThread(cfg,tid){const u=await cfg.kv.get(k(cfg,`thread:${tid}`));return u?Number(u):null}

function scheduleDelete(ctx,token,chatId,msgId){
  const p=new Promise(r=>setTimeout(async()=>{try{await tgWithRetry(token,"deleteMessage",{chat_id:chatId,message_id:msgId});}catch(e){}r()},30000));
  if(ctx?.waitUntil)ctx.waitUntil(p);
}

async function notifyOwner(cfg,userId,from,text){
  // 在用户话题中发通知（失败时自动创建话题）
  try{
    const topic=await getTopic(cfg,userId,from);
    await tgWithRetry(cfg.token,"sendMessage",{chat_id:cfg.supergroupId,message_thread_id:topic.thread_id,text});
    // 同步更新资料卡
    await syncProfileCard(cfg,userId,from).catch(e=>console.error("syncProfileCard:",e.message));
  }catch(e){
    console.error("notifyOwner:",e.message);
    try{await tgWithRetry(cfg.token,"sendMessage",{chat_id:cfg.ownerId,text:`[话题失败] ${text}`});}catch(e2){}
  }
}

async function notifyOwnerSimple(cfg,userId,from,text){
  // 备用：直接往主人 DM 发一条通知（当前未使用）
  try{await tgWithRetry(cfg.token,"sendMessage",{chat_id:cfg.ownerId,text});}
  catch(e){console.error("notifyOwnerSimple:",e.message)}
}

// ============ 用户资料汇总 ============
async function ensureProfileTopic(cfg) {
  const key = k(cfg, 'profile_log_topic');
  let tid = await cfg.kv.get(key);
  if (tid) return tid;
  const res = await tgWithRetry(cfg.token, 'createForumTopic', {
    chat_id: cfg.supergroupId,
    name: '📋 用户资料汇总',
  });
  if (!res.ok) return null;
  tid = String(res.result.message_thread_id);
  await cfg.kv.put(key, tid);
  return tid;
}

function escapeHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

function profileCardText(userId, from, status, nameHistory, banExpireStr) {
  const name = escapeHtml([from.first_name||'', from.last_name||''].join(' ').trim()) || '未知';
  const username = from.username ? `@${escapeHtml(from.username)}` : '无';
  const statusMap = {pending:'⏳ 答题中', verified:'✅ 正常', banned:'🚫 封禁', trusted:'🌟 信任', failed:'❌ 验证失败', distrusted:'❌ 失信', normal:'✅ 正常'};
  let s = statusMap[status] || '✅ 正常';
  if (status === 'banned' && banExpireStr) s += `（到期 ${banExpireStr}）`;
  let text = `<b>👤 用户资料卡</b>\n• 昵称: ${name}\n• 用户名: <code>${username}</code>\n• ID: <code>${escapeHtml(userId)}</code>\n• 状态: ${s}`;
  if (nameHistory && nameHistory.length > 0) {
    const hs = nameHistory.map(h => escapeHtml(h.name)).join(' → ');
    text += `\n• 曾用名: ${hs}`;
  }
  text += `\n• ${new Date().toLocaleString('zh-CN')}`;
  return text;
}

function profileCardButtons(userId, isBanned, isTrusted) {
  return {inline_keyboard: [
    [
      {text: isBanned ? '✅ 解封' : '🚫 封禁', callback_data: (isBanned ? 'unban:' : 'ban:') + userId},
      {text: isTrusted ? '❌ 取消信任' : '🌟 信任', callback_data: (isTrusted ? 'untrust:' : 'trust:') + userId},
    ],
    [
      {text: '🔄 刷新资料', callback_data: 'refresh:' + userId},
      {text: '👤 查看', url: `tg://user?id=${userId}`},
    ],
  ]};
}

async function syncProfileCard(cfg, userId, from, statusOverride) {
  const topicId = await ensureProfileTopic(cfg);
  if (!topicId) return;
  const isBanned = !!await cfg.kv.get(k(cfg, `banned:${userId}`));
  const isTrusted = !!await cfg.kv.get(k(cfg, `trusted:${userId}`));
  // 解析封禁到期时间
  let banExpireStr = '';
  if (isBanned) {
    const banRaw = await cfg.kv.get(k(cfg, `banned:${userId}`), {type:"json"}).catch(()=>null);
    if (banRaw?.until) {
      const d = new Date(banRaw.until);
      banExpireStr = `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    }
  }
  // 调用 saveNameChange 确保 nameHistory 是最新的
  await saveNameChange(cfg, userId, from);
  const userRec = await cfg.kv.get(k(cfg, `user:${userId}`), {type:"json"});
  const nameHistory = userRec?.nameHistory || [];
  const status = statusOverride || (isBanned ? 'banned' : isTrusted ? 'trusted' : 'normal');
  // 失信状态覆盖 normal
  const finalStatus = (status === 'normal' && !!await cfg.kv.get(k(cfg, `distrusted:${userId}`))) ? 'distrusted' : status;
  const text = profileCardText(userId, from, finalStatus, nameHistory, banExpireStr);
  const buttons = profileCardButtons(userId, isBanned, isTrusted);
  const cardKey = k(cfg, `profile_card:${userId}`);
  const existing = await cfg.kv.get(cardKey, {type:"json"});
  if (existing?.mid) {
    const editRes = await tgWithRetry(cfg.token, 'editMessageText', {
      chat_id: existing.cid, message_id: Number(existing.mid), text,
      reply_markup: buttons, parse_mode: 'HTML',
    });
    // 编辑失败（卡片被删了等）→ 发新卡
    if (!editRes.ok) {
      const res = await tgWithRetry(cfg.token, 'sendMessage', {
        chat_id: cfg.supergroupId, message_thread_id: Number(topicId), text,
        reply_markup: buttons, parse_mode: 'HTML',
      });
      if (res.ok?.result?.message_id) {
        await cfg.kv.put(cardKey, JSON.stringify({cid: cfg.supergroupId, mid: res.result.message_id}));
      }
    }
  } else {
    const res = await tgWithRetry(cfg.token, 'sendMessage', {
      chat_id: cfg.supergroupId, message_thread_id: Number(topicId), text,
      reply_markup: buttons, parse_mode: 'HTML',
    });
    if (res.ok?.result?.message_id) {
      await cfg.kv.put(cardKey, JSON.stringify({cid: cfg.supergroupId, mid: res.result.message_id}));
    }
  }
}

async function sendTextVerify(cfg,ctx,userId,from){
  const q=genTextQ();const qid=shortId();const opts=shuffle(q.options);
  await cfg.kv.put(k(cfg,`v:${qid}`),JSON.stringify({answer:q.answer,opts,uid:userId}),{expirationTtl:300});
  const buttons=opts.map((o,i)=>({text:o,callback_data:`vt:${qid}:${i}`}));
  const res=await tgWithRetry(cfg.token,"sendMessage",{chat_id:userId,text:`🤖 请回答以下问题：\n\n${q.question}`,reply_markup:{inline_keyboard:[buttons]}});
  const msgId = res.ok?.result?.message_id || 0;
  await cfg.kv.put(k(cfg,`verify:${userId}`),JSON.stringify({stage:"text",qid,warned:false,qids:[msgId]}),{expirationTtl:300});
  await syncProfileCard(cfg,userId,from,'pending').catch(e=>console.error("syncProfileCard:",e.message));
}

// sendEmojiVerify 和 deleteVerifyMsgs 已合并到回调中，不再使用

async function sendMsg(token,chatId,msg,extra){
  const b={chat_id:chatId,...extra};
  if(msg.text)return tgWithRetry(token,"sendMessage",{...b,text:msg.text});
  if(msg.photo)return tgWithRetry(token,"sendPhoto",{...b,photo:msg.photo[msg.photo.length-1].file_id,caption:msg.caption||""});
  if(msg.video)return tgWithRetry(token,"sendVideo",{...b,video:msg.video.file_id,caption:msg.caption||""});
  if(msg.voice)return tgWithRetry(token,"sendVoice",{...b,voice:msg.voice.file_id});
  if(msg.audio)return tgWithRetry(token,"sendAudio",{...b,audio:msg.audio.file_id,caption:msg.caption||""});
  if(msg.document)return tgWithRetry(token,"sendDocument",{...b,document:msg.document.file_id,caption:msg.caption||""});
  if(msg.sticker)return tgWithRetry(token,"sendSticker",{...b,sticker:msg.sticker.file_id});
  if(msg.video_note)return tgWithRetry(token,"sendVideoNote",{...b,video_note:msg.video_note.file_id});
  if(msg.animation)return tgWithRetry(token,"sendAnimation",{...b,animation:msg.animation.file_id,caption:msg.caption||""});
  if(msg.location)return tgWithRetry(token,"sendLocation",{...b,latitude:msg.location.latitude,longitude:msg.location.longitude});
  if(msg.contact)return tgWithRetry(token,"sendContact",{...b,phone_number:msg.contact.phone_number,first_name:msg.contact.first_name});
  return tgWithRetry(token,"sendMessage",{...b,text:"[未知消息类型]"});
}

async function forwardToTopic(cfg,ctx,userId,from,msg){
  const topic=await getTopic(cfg,userId,from);
  let res=await sendMsg(cfg.token,cfg.supergroupId,msg,{message_thread_id:topic.thread_id});
  // 话题被删了 → 重建话题 + 重发
  if(!res.ok&&((res.description||"").includes("message thread not found")||(res.description||"").includes("TOPIC_ID_INVALID"))){
    // 清理旧 KV
    await cfg.kv.delete(k(cfg,`user:${userId}`));
    if(topic.thread_id)await cfg.kv.delete(k(cfg,`thread:${topic.thread_id}`));
    // 重建话题
    const newTopic=await getTopic(cfg,userId,from);
    res=await sendMsg(cfg.token,cfg.supergroupId,msg,{message_thread_id:newTopic.thread_id});
  }
  if(res.ok?.result?.message_id){
    await cfg.kv.put(k(cfg,`m:${cfg.supergroupId}:${res.result.message_id}`),userId,{expirationTtl:86400});
    await cfg.kv.put(k(cfg,`mv:${userId}:${msg.message_id}`),res.result.message_id,{expirationTtl:86400});
  }
  // 如果有话题重建的 fallback，放在这里
}
}

async function replyToVisitor(cfg,ctx,targetUserId,msg){
  let extra={};
  if(msg.reply_to_message){
    const origTopicMsgId=msg.reply_to_message.message_id;
    const visitorMsgId=await cfg.kv.get(k(cfg,`mr:${targetUserId}:${origTopicMsgId}`));
    if(visitorMsgId)extra.reply_to_message_id=visitorMsgId;
  }
  const res=await sendMsg(cfg.token,targetUserId,msg,extra);
  if(!res.ok&&(res.description||"").includes("blocked")){
    const isTrusted = !!await cfg.kv.get(k(cfg,`trusted:${targetUserId}`));
    // 信任用户不受影响，非信任用户标记失信并清除验证
    if (!isTrusted) {
      await cfg.kv.delete(k(cfg,`verified:${targetUserId}`));
      await cfg.kv.put(k(cfg,`distrusted:${targetUserId}`),"1");
    }
    const topic=await cfg.kv.get(k(cfg,`user:${targetUserId}`),{type:"json"});
    if(topic){
      const statusText = isTrusted ? '⚠️ 该访客已断开连接（信任用户不受影响）' : '⚠️ 该访客已断开连接，需重新发送 /start 验证';
      await tgWithRetry(cfg.token,"sendMessage",{chat_id:cfg.supergroupId,message_thread_id:topic.thread_id,text:statusText});
      const rec = await cfg.kv.get(k(cfg,`user:${targetUserId}`),{type:"json"});
      if(rec){
        const fakeFrom={id:Number(targetUserId),first_name:rec.first_name||rec.title?.split(' [')[0]||'用户',last_name:rec.last_name||'',username:rec.username};
        await syncProfileCard(cfg,targetUserId,fakeFrom,isTrusted?null:'distrusted').catch(e=>console.error("card:",e.message));
      }
    }
    return;
  }
}

async function handleAdmin(cfg,ctx,userId,tid,text){
  const t=cfg.token,cid=cfg.supergroupId,b={chat_id:cid,message_thread_id:tid};
  // 更新资料卡的辅助函数
  const updateCard = async () => {
    try {
      const rec = await cfg.kv.get(k(cfg,`user:${userId}`),{type:"json"});
      if (rec) {
        const fakeFrom = {id:Number(userId), first_name: rec.first_name || (rec.title||'').split(' [')[0]||'用户', last_name: rec.last_name||'', username: rec.username};
        await syncProfileCard(cfg, userId, fakeFrom);
      }
    } catch(e) { console.error("updateCard failed:", e.message); }
  };
  const cmds={
    "/close":async()=>{await cfg.kv.put(k(cfg,`closed:${userId}`),"1");await tgWithRetry(t,"closeForumTopic",{chat_id:cid,message_thread_id:tid});await tgWithRetry(t,"sendMessage",{...b,text:"🚫 对话已关闭"})},
    "/open":async()=>{await cfg.kv.delete(k(cfg,`closed:${userId}`));await tgWithRetry(t,"reopenForumTopic",{chat_id:cid,message_thread_id:tid});await tgWithRetry(t,"sendMessage",{...b,text:"✅ 对话已恢复"})},
    "/ban":async()=>{await cfg.kv.put(k(cfg,`banned:${userId}`),"1");await tgWithRetry(t,"sendMessage",{...b,text:"🚫 用户已封禁"});await updateCard()},
    "/unban":async()=>{await cfg.kv.delete(k(cfg,`banned:${userId}`));await cfg.kv.delete(k(cfg,`verified:${userId}`));await tgWithRetry(t,"sendMessage",{...b,text:"✅ 用户已解封"});await updateCard()},
    "/trust":async()=>{await cfg.kv.put(k(cfg,`trusted:${userId}`),"1");await cfg.kv.delete(k(cfg,`verified:${userId}`));await tgWithRetry(t,"sendMessage",{...b,text:"🌟 已设置永久信任"});await updateCard()},
    "/reset":async()=>{await cfg.kv.delete(k(cfg,`verified:${userId}`));await tgWithRetry(t,"sendMessage",{...b,text:"🔄 验证已重置"})},
    "/info":async()=>{await tgWithRetry(t,"sendMessage",{...b,text:`👤 UID: ${userId}\nTopic: ${tid}\nLink: tg://user?id=${userId}`})},
  };
  if(cmds[text]){await cmds[text]();return true}return false;
}

export default{
  async fetch(request,env,ctx){
    try{
      const url=new URL(request.url);
      const configs=loadConfigs(env);
      const idx=getBotIndex(url);
      const cfg=getCfg(configs, idx, env.KV);

      if(request.method==="GET"){
        const p=url.pathname;
        // 调试端点 - 测试 TG API 是否通畅
        if(p==="/test") {
          const results = [];
          for (let i = 0; i < configs.length; i++) {
            const c = getCfg(configs, i, env.KV);
            try {
              const r = await fetch(`https://api.telegram.org/bot${c.token}/getMe`);
              const d = await r.json();
              results.push({ bot: i+1, ok: d.ok, botName: d.ok ? d.result.username : d.description });
              // 也测试给 owner 发消息
              if (d.ok) {
                const s = await fetch(`https://api.telegram.org/bot${c.token}/sendMessage`, {
                  method: "POST",
                  headers: {"Content-Type":"application/json"},
                  body: JSON.stringify({chat_id: c.ownerId, text: "🤖 诊断消息：Worker 通信正常 ✅\n请发送 /start 测试回复"})
                });
                const sd = await s.json();
                results[results.length-1].sendTest = sd.ok ? "✅" : "❌ "+sd.description;
              }
            } catch(e) { results.push({ bot: i+1, ok: false, error: e.message }); }
          }
          return new Response(JSON.stringify(results, null, 2), {headers:{"Content-Type":"application/json; charset=utf-8"}});
        }
        if(p==="/health"||p==="/health2"||p==="/health3"||p==="/health4"||p==="/health5"){
          const key=cfg.healthKey;
          if(key&&url.searchParams.get("key")!==key)return new Response("Forbidden",{status:403});
          return new Response(JSON.stringify({status:"ok",bot:cfg.bot,count:configs.length,time:new Date().toISOString()}),{headers:{"Content-Type":"application/json"}});
        }
        // 根路径：一键激活所有 webhook + 显示状态
        const results = [];
        for (let i = 0; i < configs.length; i++) {
          const c = getCfg(configs, i, env.KV);
          const suffix = botSuffix(i);
          const whUrl = `${url.origin}/webhook${suffix}`;
          const setUrl = `https://api.telegram.org/bot${c.token}/setWebhook?url=${encodeURIComponent(whUrl)}${c.webhookSecret ? '&secret_token='+encodeURIComponent(c.webhookSecret) : ''}&max_connections=40`;
          let ok = false, desc = '';
          try { const r = await fetch(setUrl); const d = await r.json(); ok = d.ok; desc = d.description || ''; } catch(e) { desc = e.message; }
          results.push({ bot: i+1, ok, url: whUrl, desc });
        }
        const allOk = results.every(r => r.ok);
        return new Response(JSON.stringify({
          status: allOk ? 'running' : 'partial',
          message: allOk ? '✅ 所有 Bot Webhook 已激活' : '⚠️ 部分激活失败',
          count: configs.length,
          bots: results,
          debug: `/health?key=${cfg.healthKey}`,
        }, null, 2), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
      }

      if(request.method==="POST"){
        const p=url.pathname;
        if(p==="/setup"){
          // 自动注册所有 bot 的 webhook
          const results = [];
          for (let i = 0; i < configs.length; i++) {
            const c = getCfg(configs, i, env.KV);
            const suffix = botSuffix(i);
            const whUrl = `${url.origin}/webhook${suffix}`;
            const setUrl = `https://api.telegram.org/bot${c.token}/setWebhook?url=${encodeURIComponent(whUrl)}${c.webhookSecret ? '&secret_token='+encodeURIComponent(c.webhookSecret) : ''}&max_connections=40`;
            try {
              const r = await fetch(setUrl);
              const d = await r.json();
              results.push({ bot: i+1, ok: d.ok, description: d.description || '' });
            } catch(e) {
              results.push({ bot: i+1, ok: false, description: e.message });
            }
          }
          return new Response(JSON.stringify({ok: true, results}), {headers:{"Content-Type":"application/json"}});
        }
        if(p.startsWith("/activate")){
          // 支持提供 token 手动激活，也支持用配置的 token 激活
          let token;
          try {
            const body = await request.json();
            token = body.token;
          } catch(e) {}
          if (!token) token = cfg.token; // fallback to config token
          if(!token)return new Response(JSON.stringify({ok:false,description:"No token available"}),{headers:{"Content-Type":"application/json"}});
          const suffix=botSuffix(idx);
          let setUrl=`https://api.telegram.org/bot${token}/setWebhook?url=${url.origin}/webhook${suffix}`;
          const secret=cfg.webhookSecret;
          if(secret)setUrl+=`&secret_token=${encodeURIComponent(secret)}`;
          const r=await fetch(setUrl);
          return new Response(await r.text(),{headers:{"Content-Type":"application/json"}});
        }
      }

      if(request.method!=="POST")return new Response("Method not allowed",{status:405});

      const secret=cfg.webhookSecret;
      if(secret&&request.headers.get("X-Telegram-Bot-Api-Secret-Token")!==secret)return new Response("Unauthorized",{status:401});

      const update=await request.json();

      if(update.edited_message){
        const msg=update.edited_message,uid=msg.from.id;
        if(String(uid)===String(cfg.ownerId)&&msg.chat&&String(msg.chat.id)===String(cfg.supergroupId)&&msg.message_thread_id){
          const target=await uidByThread(cfg,msg.message_thread_id);
          if(target)await sendMsg(cfg.token,target,msg);
        }else if(String(uid)!==String(cfg.ownerId)){
          const topic=await cfg.kv.get(k(cfg,`user:${uid}`),{type:"json"});
          if(topic?.thread_id)await sendMsg(cfg.token,cfg.supergroupId,msg,{message_thread_id:topic.thread_id});
        }
        return new Response("ok");
      }

      if(update.message_reaction){
        const mr=update.message_reaction;
        if(String(mr.chat.id)===String(cfg.supergroupId)&&mr.message_thread_id){
          const uid=await uidByThread(cfg,mr.message_thread_id);
          if(uid){
            const emoji=(mr.new_reaction||[]).map(r=>r.emoji||"").filter(Boolean).join("");
            if(emoji)await tgWithRetry(cfg.token,"sendMessage",{chat_id:uid,text:`👍 主人回应：${emoji}`});
          }
        }
        return new Response("ok");
      }

      if(update.callback_query){
        const q=update.callback_query,uid=q.from.id,data=q.data;

        if(data.startsWith("vt:")||data.startsWith("ve:")){
          const parts=data.split(":"),type=parts[0],qid=parts[1],idx=parseInt(parts[2]);
          const vdata=await cfg.kv.get(k(cfg,`v:${qid}`),{type:"json"});
          if(!vdata||vdata.uid!==uid)return new Response(JSON.stringify({method:"answerCallbackQuery",callback_query_id:q.id,text:"验证已过期，请重发 /start"}),{headers:{"Content-Type":"application/json"}});
          const state=await cfg.kv.get(k(cfg,`verify:${uid}`),{type:"json"});
          if(!state)return new Response(JSON.stringify({method:"answerCallbackQuery",callback_query_id:q.id,text:"验证已过期"}),{headers:{"Content-Type":"application/json"}});
          const editMid = q.message?.message_id;

          const selected=vdata.opts[idx];

          if(selected===vdata.answer){
            // 正确 → 编辑同一条消息为欢迎语
            if (editMid) {
              await tgWithRetry(cfg.token, 'editMessageText', {
                chat_id: uid, message_id: editMid, text: '✅ 验证通过！欢迎加入。',
              });
            }
            await cfg.kv.put(k(cfg,`verified:${uid}`),"1",{expirationTtl:2592000});await cfg.kv.delete(k(cfg,`verify:${uid}`));await cfg.kv.delete(k(cfg,`v:${qid}`));await cfg.kv.delete(k(cfg,`distrusted:${uid}`));
            const topic = await getTopic(cfg, uid, q.from);
            await tgWithRetry(cfg.token, 'sendMessage', {
              chat_id: cfg.supergroupId, message_thread_id: topic.thread_id,
              text: `✅ 访客 ${escapeHtml(q.from.first_name||'未知')} (${uid}) 验证通过`,
            });
            await syncProfileCard(cfg, uid, q.from, 'verified').catch(e=>console.error("card:",e.message));
            return new Response(JSON.stringify({method:"answerCallbackQuery",callback_query_id:q.id,text:"✅ 验证通过！"}),{headers:{"Content-Type":"application/json"}});
          }

          if(type==="vt"){
            // 第一题答错 → 编辑同一条消息为第二题
            const c=genEmojiQ();const qid2=shortId();
            // 第二题按钮也带上当前消息 ID
            await cfg.kv.put(k(cfg,`v:${qid2}`),JSON.stringify({answer:c.answer,opts:c.options,uid}),{expirationTtl:300});
            const buttons=c.options.map((o,i)=>({text:o,callback_data:`ve:${qid2}:${i}`}));
            if (editMid) {
              await tgWithRetry(cfg.token, 'editMessageText', {
                chat_id: uid, message_id: editMid,
                text: `❌ 答错了，再来一个：\n\n${c.question}`,
                reply_markup: {inline_keyboard: [buttons]},
              });
            }
            await cfg.kv.put(k(cfg,`verify:${uid}`),JSON.stringify({stage:"emoji",qid:qid2,warned:false,qids:[editMid]}),{expirationTtl:300});
            return new Response(JSON.stringify({method:"answerCallbackQuery",callback_query_id:q.id}),{headers:{"Content-Type":"application/json"}});
          }

          // ve: 答错 → 编辑同一条消息为封禁语
          const banExpiry=Date.now()+604800000;
          await cfg.kv.put(k(cfg,`banned:${uid}`),JSON.stringify({until:banExpiry}),{expirationTtl:604800});await cfg.kv.delete(k(cfg,`verify:${uid}`));await cfg.kv.delete(k(cfg,`v:${qid}`));
          if (editMid) {
            await tgWithRetry(cfg.token, 'editMessageText', {
              chat_id: uid, message_id: editMid,
              text: `🚫 验证失败，你已被关小黑屋，${msToTime(604800000)}后自动解除。`,
            });
          }
          await syncProfileCard(cfg,uid,q.from,'banned').catch(e=>console.error("card:",e.message));
          return new Response(JSON.stringify({method:"answerCallbackQuery",callback_query_id:q.id,text:"🚫 已被封禁",show_alert:true}),{headers:{"Content-Type":"application/json"}});
        }
        // 用户资料卡按钮 — 直接编辑当前卡片，不查 KV
        const [action, targetUid] = data.split(':');
        if (['ban','unban','trust','untrust','refresh'].includes(action) && targetUid) {
          const tid = targetUid;
          if (action === 'ban') {
            await cfg.kv.put(k(cfg,`banned:${tid}`),'1');
          } else if (action === 'unban') {
            await cfg.kv.delete(k(cfg,`banned:${tid}`));
            await cfg.kv.delete(k(cfg,`verified:${tid}`));
          } else if (action === 'trust') {
            await cfg.kv.put(k(cfg,`trusted:${tid}`),'1');
            await cfg.kv.delete(k(cfg,`verified:${tid}`));
          } else if (action === 'untrust') {
            await cfg.kv.delete(k(cfg,`trusted:${tid}`));
          } else if (action === 'refresh') {
            const chatInfo = await tgWithRetry(cfg.token, 'getChat', {chat_id: Number(tid)});
            if (!chatInfo.ok) {
              return new Response(JSON.stringify({method:"answerCallbackQuery",callback_query_id:q.id,text:"❌ 无法获取用户信息"}),{headers:{"Content-Type":"application/json"}});
            }
            const r = chatInfo.result;
            const freshFrom = {id:Number(tid), first_name:r.first_name||'', last_name:r.last_name||'', username:r.username||''};
            await saveNameChange(cfg, tid, freshFrom);
            const rec = await cfg.kv.get(k(cfg,`user:${tid}`),{type:"json"});
            if (rec?.thread_id) {
              try{await tgWithRetry(cfg.token,"editForumTopic",{chat_id:cfg.supergroupId,message_thread_id:rec.thread_id,name:rec.title?.substring(0,128)});}catch(e){}
            }
          }
          // 统一用 callback 的 chat_id + message_id 直接编辑（不依赖 KV 查卡片位置）
          const isBanned = !!await cfg.kv.get(k(cfg,`banned:${tid}`));
          const isTrusted = !!await cfg.kv.get(k(cfg,`trusted:${tid}`));
          // isDisconnected removed — 失信状态由 isDistrusted 替代
          const st = isBanned ? 'banned' : isTrusted ? 'trusted' : 'normal';
          // 失信覆盖
          const isDistrusted = !isBanned && !isTrusted && !!await cfg.kv.get(k(cfg,`distrusted:${tid}`));
          let banExpireStr = '';
          if (isBanned) {
            const banRaw = await cfg.kv.get(k(cfg,`banned:${tid}`),{type:"json"}).catch(()=>null);
            if (banRaw?.until) {
              const d = new Date(banRaw.until);
              banExpireStr = `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
            }
          }
          const rec = await cfg.kv.get(k(cfg,`user:${tid}`),{type:"json"});
          const fakeFrom = rec ? {id:Number(tid), first_name: rec.first_name || (rec.title||'').split(' [')[0]||'用户', last_name: rec.last_name||'', username:rec.username} : {id:Number(tid), first_name:'用户'};
          const nameHistory = rec?.nameHistory || [];
          const text = profileCardText(tid, fakeFrom, isDistrusted?'distrusted':st, nameHistory, banExpireStr);
          const btns = profileCardButtons(tid, isBanned, isTrusted);
          await tgWithRetry(cfg.token, 'editMessageText', {
            chat_id: q.message.chat.id,
            message_id: q.message.message_id,
            text, reply_markup: btns, parse_mode: 'HTML',
          });
          await cfg.kv.put(k(cfg,`profile_card:${tid}`), JSON.stringify({cid: q.message.chat.id, mid: q.message.message_id}));
          const labels = {ban:'🚫 已封禁',unban:'✅ 已解封',trust:'🌟 已信任',untrust:'❌ 已取消信任',refresh:'✅ 资料已刷新'};
          return new Response(JSON.stringify({method:"answerCallbackQuery",callback_query_id:q.id,text:labels[action]||'✅'}),{headers:{"Content-Type":"application/json"}});
        }
        return new Response("ok");
      }

      if(update.message){
        const msg=update.message,uid=msg.from.id,text=(msg.text||"").trim();

        if(msg.chat&&String(msg.chat.id)===String(cfg.supergroupId)&&msg.message_thread_id){
          const target=await uidByThread(cfg,msg.message_thread_id);
          if(!target)return new Response("ok");
          if(text.startsWith("/")){await handleAdmin(cfg,ctx,target,msg.message_thread_id,text);return new Response("ok")}
          if(await cfg.kv.get(k(cfg,`closed:${target}`))){
            await tgWithRetry(cfg.token,"sendMessage",{chat_id:cfg.supergroupId,message_thread_id:msg.message_thread_id,text:"⚠️ 对话已关闭，请先 /open"});
            return new Response("ok");
          }
          await replyToVisitor(cfg,ctx,target,msg);
          if(msg.reply_to_message){
            const origMsgId=msg.reply_to_message.message_id;
            const visitorUid=await cfg.kv.get(k(cfg,`m:${cfg.supergroupId}:${origMsgId}`),{type:"json"});
            if(visitorUid)await cfg.kv.put(k(cfg,`mr:${visitorUid}:${msg.message_id}`),origMsgId,{expirationTtl:86400});
          }
          return new Response("ok");
        }

        if(String(uid)===String(cfg.ownerId))return new Response("ok");

        const banData=await cfg.kv.get(k(cfg,`banned:${uid}`));
        if(banData){
          if(typeof banData==="object"&&banData.until){
            if(Date.now()<banData.until)return new Response("ok");
            await cfg.kv.delete(k(cfg,`banned:${uid}`));
          }else return new Response("ok");
        }

        if(await cfg.kv.get(k(cfg,`trusted:${uid}`))){
          if(text==="/start"){await tgWithRetry(cfg.token,"sendMessage",{chat_id:uid,text:"🌟 你是信任用户，无需验证，直接发消息即可。"});return new Response("ok")}
          if(text==="/status"){
            await tgWithRetry(cfg.token,"sendMessage",{chat_id:uid,text:"🌟 信任用户，永久有效"});
            return new Response("ok");
          }
          await forwardToTopic(cfg,ctx,uid,msg.from,msg);
          return new Response("ok");
        }
        // 失信或已过期 → 重新答题
        const isDistrusted = !!await cfg.kv.get(k(cfg,`distrusted:${uid}`));
        if(isDistrusted && text==="/start"){
          await cfg.kv.delete(k(cfg,`distrusted:${uid}`));
          await sendTextVerify(cfg,ctx,uid,msg.from);
          return new Response("ok");
        }
        // 已验证且非失信 → 直接通过（可能断线重连）
        if(await cfg.kv.get(k(cfg,`verified:${uid}`))){
          if(text==="/start"){await tgWithRetry(cfg.token,"sendMessage",{chat_id:uid,text:"✅ 你已通过验证，直接发消息即可。"});return new Response("ok")}
          await forwardToTopic(cfg,ctx,uid,msg.from,msg);
          return new Response("ok");
        }

        if(text.startsWith("/")){
          if(text==="/start"){
            const vs=await cfg.kv.get(k(cfg,`verify:${uid}`),{type:"json"});
            if(vs){const r=await tgWithRetry(cfg.token,"sendMessage",{chat_id:uid,text:"⏳ 验证进行中，请回答上方的问题。"});if(r.ok?.result)scheduleDelete(ctx,cfg.token,uid,r.result.message_id)}
            else await sendTextVerify(cfg,ctx,uid,msg.from);
          }
          return new Response("ok");
        }

        const vs=await cfg.kv.get(k(cfg,`verify:${uid}`),{type:"json"});
        if(vs){
          if(vs.warned){
            // 第二次乱发 → 编辑题目消息为封禁语 + 禁封
            await cfg.kv.put(k(cfg,`banned:${uid}`),JSON.stringify({until:Date.now()+3600000}),{expirationTtl:3600});await cfg.kv.delete(k(cfg,`verify:${uid}`));
            const banMid = vs.qids?.[0];
            if (banMid) {
              await tgWithRetry(cfg.token, 'editMessageText', {
                chat_id: uid, message_id: banMid, text: '🚫 无视警告，你已被封禁1小时。',
              });
            }
            await syncProfileCard(cfg,uid,msg.from,'banned').catch(e=>console.error("card:",e.message));
          }else{
            vs.warned=true;await cfg.kv.put(k(cfg,`verify:${uid}`),JSON.stringify(vs),{expirationTtl:300});
            // 第一次乱发 → 新发一条警告消息（题目不动）
            const r=await tgWithRetry(cfg.token,"sendMessage",{chat_id:uid,text:"⚠️ 请认真答题，再次乱发消息将被封禁。"});
            if(r.ok?.result)scheduleDelete(ctx,cfg.token,uid,r.result.message_id);
          }
          return new Response("ok");
        }

        await sendTextVerify(cfg,ctx,uid,msg.from);
      }

      return new Response("ok");
    }catch(e){
      console.error("Unhandled error:",e);
      return new Response("ok");
    }
  }
};
