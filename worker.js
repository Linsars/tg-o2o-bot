/**
 * tg-o2o-bot v3.0 — D1 + KV 混合架构
 * 持久化: D1 (用户/话题/资料卡/配置)
 * 临时态: KV (验证码/限流)
 * 保留: 多 bot 路由 / 验证流程 / 话题创建 / 资料卡 / 曾用名
 */

// ============ 页面 & 题库 & 常量 ============
const STATUS_PAGE_HEAD = `<!DOCTYPE html><html><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>tg-o2o-bot</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f0f2f5;padding:20px;color:#333}
h1{font-size:22px;margin-bottom:18px}
.card{background:#fff;border-radius:12px;padding:20px;margin-bottom:14px;box-shadow:0 1px 4px rgba(0,0,0,.06)}
.status-bar{display:flex;gap:10px;align-items:center;margin-bottom:14px;font-size:14px}
.dot{width:10px;height:10px;border-radius:50%;display:inline-block}
.dot-ok{background:#22c55e}.dot-err{background:#ef4444}
.bot-row{display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #f0f0f0}
.bot-row:last-child{border-bottom:none}
.bot-name{font-weight:600;font-size:15px}.bot-detail{font-size:13px;color:#666;margin-top:2px}
.tag{font-size:11px;padding:2px 8px;border-radius:10px;font-weight:600}
.tag-ok{background:#dcfce7;color:#166534}.tag-err{background:#fef2f2;color:#991b1b}
.tag-warn{background:#fef9c3;color:#854d0e}
.footer{text-align:center;font-size:12px;color:#999;margin-top:20px}
.refresh{color:#0088cc;text-decoration:none;font-size:13px}
</style></head><body>`;

const TEXT_QUESTIONS = [
  {q:"冰融化后会变成什么？",a:"水",o:["水","石头","木头","火"]},{q:"正常人有几只眼睛？",a:"2",o:["2","1","3","4"]},{q:"以下哪个属于水果？",a:"香蕉",o:["香蕉","白菜","猪肉","大米"]},
  {q:"1 加 2 等于几？",a:"3",o:["3","2","4","5"]},{q:"5 减 2 等于几？",a:"3",o:["3","1","2","4"]},{q:"2 乘以 3 等于几？",a:"6",o:["6","4","5","7"]},
  {q:"在天上飞的交通工具是什么？",a:"飞机",o:["飞机","汽车","轮船","自行车"]},{q:"星期一的后面是星期几？",a:"星期二",o:["星期二","星期日","星期五","星期三"]},
  {q:"鱼通常生活在哪里？",a:"水里",o:["水里","树上","土里","火里"]},{q:"晴朗的天空通常是什么颜色？",a:"蓝色",o:["蓝色","绿色","红色","紫色"]},
  {q:"太阳从哪个方向升起？",a:"东方",o:["东方","西方","南方","北方"]},{q:"小狗发出的叫声通常是？",a:"汪汪",o:["汪汪","喵喵","咩咩","呱呱"]},
  {q:"10 加 5 等于几？",a:"15",o:["15","10","12","20"]},{q:"8 减 4 等于几？",a:"4",o:["4","2","3","5"]},
  {q:"我们用什么器官来听声音？",a:"耳朵",o:["耳朵","眼睛","鼻子","嘴巴"]},{q:"一年有几个月？",a:"12",o:["12","10","11","13"]},
  {q:"一周有几天？",a:"7",o:["7","5","6","8"]},{q:"地球是什么形状？",a:"球形",o:["球形","方形","三角形","圆柱形"]},
  {q:"水的化学式是什么？",a:"H2O",o:["H2O","CO2","O2","NaCl"]},{q:"中国有多少个省级行政区？",a:"34",o:["34","30","32","36"]},
  {q:"以下哪个是哺乳动物？",a:"鲸鱼",o:["鲸鱼","鲨鱼","鳄鱼","蜥蜴"]},{q:"光合作用需要什么气体？",a:"二氧化碳",o:["二氧化碳","氧气","氮气","氢气"]},
  {q:"月亮绕地球一圈大约多久？",a:"一个月",o:["一个月","一天","一周","一年"]},{q:"以下哪个是中国的传统节日？",a:"春节",o:["春节","圣诞节","感恩节","复活节"]},
  {q:"人体最大的器官是什么？",a:"皮肤",o:["皮肤","肝脏","大脑","心脏"]},{q:"哪种动物被称为百兽之王？",a:"老虎",o:["老虎","狮子","大象","熊"]},
  {q:"一打等于几个？",a:"12",o:["12","10","24","6"]},{q:"世界上最长的河流是？",a:"尼罗河",o:["尼罗河","长江","亚马逊河","黄河"]},
  {q:"铅笔芯主要成分是什么？",a:"石墨",o:["石墨","铅","碳","铁"]},{q:"WiFi 是什么的缩写？",a:"无线保真",o:["无线保真","宽带网络","光纤传输","蓝牙连接"]},
  {q:"一天有多少小时？",a:"24",o:["24","12","48","36"]},{q:"三角形内角和是多少度？",a:"180",o:["180","360","90","270"]},
  {q:"以下哪个是可再生能源？",a:"太阳能",o:["太阳能","石油","煤炭","天然气"]},{q:"蜜蜂采蜜后会酿成什么？",a:"蜂蜜",o:["蜂蜜","蜂蜡","花粉","果酱"]},
  {q:"人体有多少块骨头？",a:"206",o:["206","180","300","150"]},{q:"以下哪个行星最大？",a:"木星",o:["木星","地球","火星","土星"]},
  {q:"彩虹有几种颜色？",a:"7",o:["7","5","6","8"]},{q:"向日葵会朝向哪个方向？",a:"太阳",o:["太阳","月亮","北方","南方"]},
  {q:"大象的鼻子有什么功能？",a:"呼吸和抓取",o:["呼吸和抓取","只能呼吸","只能抓取","装饰用"]},{q:"铁生锈需要什么？",a:"水和氧气",o:["水和氧气","只需要水","只需要氧气","阳光"]},
  {q:"哪种鸟不会飞？",a:"企鹅",o:["企鹅","麻雀","鸽子","燕子"]},{q:"以下哪个是哺乳动物的特征？",a:"胎生",o:["胎生","卵生","有鳞片","有羽毛"]},
  {q:"地球自转一圈需要多久？",a:"24小时",o:["24小时","12小时","365天","30天"]},{q:"糖溶解在水里会怎样？",a:"消失不见",o:["消失不见","沉到水底","浮在水面","变色"]},
  {q:"以下哪个是中国的首都？",a:"北京",o:["北京","上海","广州","深圳"]},{q:"鸡蛋是哪种动物的卵？",a:"鸡",o:["鸡","鸭","鹅","鸟"]},
  {q:"镜子利用的是什么原理？",a:"光的反射",o:["光的反射","光的折射","光的散射","光的吸收"]},{q:"人正常体温大约是多少度？",a:"36.5",o:["36.5","35","38","40"]},
  {q:"冰水混合物的温度是？",a:"0度",o:["0度","10度","-10度","100度"]},{q:"以下哪个交通工具最快？",a:"飞机",o:["飞机","火车","汽车","轮船"]}
];

const EMOJI_POOL = ["🐶","🐱","🐼","🦊","🐸","🦁","🐮","🐷","🐵","🐰","🐻","🐧","🦄","🐙","🦋","🐳","🦜","🐢","🦔","🐲"];

function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function genTextQ(){const q=TEXT_QUESTIONS[Math.floor(Math.random()*TEXT_QUESTIONS.length)];return{question:q.q,answer:q.a,options:[...q.o]}}
function genEmojiQ(){const answer=EMOJI_POOL[Math.floor(Math.random()*EMOJI_POOL.length)];const d=shuffle(EMOJI_POOL.filter(e=>e!==answer)).slice(0,7);return{question:`${answer}\n请在下方选项中找到同一个表情\nFind the same emoji below:`,answer,options:shuffle([answer,...d])}}
function shortId(){return Math.random().toString(36).substring(2,8)}
function msToTime(ms){const h=Math.floor(ms/3600000);return h<24?`${h}小时`:`${Math.floor(h/24)}天${h%24}小时`}
function escapeHtml(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')}

function renderStatusPage(results, allOk) {
  const rows = results.map((r, i) => {
    const whTag = r.webhook ? '<span class="tag tag-ok">✅ 已激活</span>' : '<span class="tag tag-err">❌ 未激活</span>';
    const cmdTag = r.commandsOk ? '<span class="tag tag-ok">✅ 已注册</span>' : '<span class="tag tag-warn">⚠️ 未注册</span>';
    const errHtml = r.error ? `<div class="bot-detail">${escapeHtml(r.error)}</div>` : '';
    return `<div class="bot-row">
      <div><div class="bot-name">🤖 Bot #${i+1} ${escapeHtml(r.name||'')}</div>${errHtml}
      <div class="bot-detail">${r.webhook ? 'Webhook: ' + escapeHtml(r.whUrl||'') : ''}</div></div>
      <div style="text-align:right;line-height:1.8">${whTag}<br>${cmdTag}</div>
    </div>`;
  }).join('');
  const dot = allOk ? 'dot-ok' : 'dot-err';
  const statusText = allOk ? '✅ 所有 Bot 运行正常' : '⚠️ 部分 Bot 异常';
  return `${STATUS_PAGE_HEAD}
<div class="card">
  <div class="status-bar"><span class="dot ${dot}"></span><span>${statusText}</span></div>
  ${rows}
</div>
<div class="footer">
  <a class="refresh" href="/">🔄 刷新状态</a>
</div></body></html>`;
}

// 中译英对照
const ZH_EN = {
  '水':'Water','石头':'Stone','木头':'Wood','火':'Fire',
  '香蕉':'Banana','白菜':'Cabbage','猪肉':'Pork','大米':'Rice',
  '汽车':'Car','火车':'Train','轮船':'Ship','自行车':'Bicycle','飞机':'Airplane',
  '鲸鱼':'Whale','鲨鱼':'Shark','鳄鱼':'Crocodile','蜥蜴':'Lizard',
  '二氧化碳':'CO2','氧气':'O2','氮气':'N2','氢气':'H2',
  '皮肤':'Skin','肝脏':'Liver','大脑':'Brain','心脏':'Heart',
  '老虎':'Tiger','狮子':'Lion','大象':'Elephant','熊':'Bear',
  '尼罗河':'Nile','长江':'Yangtze','亚马逊河':'Amazon','黄河':'Yellow River',
  '石墨':'Graphite','铅':'Lead','碳':'Carbon','铁':'Iron',
  '无线保真':'WiFi','宽带网络':'Broadband','光纤传输':'Fiber Optic','蓝牙连接':'Bluetooth',
  '太阳能':'Solar','石油':'Oil','煤炭':'Coal','天然气':'Natural Gas',
  '蜂蜜':'Honey','蜂蜡':'Beeswax','花粉':'Pollen','果酱':'Jam',
  '木星':'Jupiter','地球':'Earth','火星':'Mars','土星':'Saturn',
  '太阳':'Sun','月亮':'Moon','北方':'North','南方':'South',
  '呼吸和抓取':'Breath & Grasp','只能呼吸':'Breathe Only','只能抓取':'Grasp Only','装饰用':'Decoration',
  '水和氧气':'Water & Oxygen','只需要水':'Water Only','只需要氧气':'Oxygen Only','阳光':'Sunlight',
  '企鹅':'Penguin','麻雀':'Sparrow','鸽子':'Pigeon','燕子':'Swallow',
  '胎生':'Live Birth','卵生':'Egg Laying','有鳞片':'Scaly','有羽毛':'Feathered',
  '消失不见':'Dissolve','沉到水底':'Sink','浮在水面':'Float','变色':'Change Color',
  '北京':'Beijing','上海':'Shanghai','广州':'Guangzhou','深圳':'Shenzhen',
  '鸡':'Chicken','鸭':'Duck','鹅':'Goose','鸟':'Bird',
  '光的反射':'Reflection','光的折射':'Refraction','光的散射':'Scattering','光的吸收':'Absorption',
  '东方':'East','西方':'West','南方':'South','北方':'North',
  '汪汪':'Woof','喵喵':'Meow','咩咩':'Baa','呱呱':'Croak',
  '耳朵':'Ears','眼睛':'Eyes','鼻子':'Nose','嘴巴':'Mouth',
  '球形':'Sphere','方形':'Square','三角形':'Triangle','圆柱形':'Cylinder',
  '一个月':'1 month','一天':'1 day','一周':'1 week','一年':'1 year',
  '春节':'Spring Festival','圣诞节':'Christmas','感恩节':'Thanksgiving','复活节':'Easter',
  '0度':'0°C','10度':'10°C','-10度':'-10°C','100度':'100°C',
  '24小时':'24h','12小时':'12h','365天':'365 days','30天':'30 days',
  'H2O':'H₂O','CO2':'CO₂','O2':'O₂','NaCl':'NaCl',
};
function en(t){return ZH_EN[t]||t}
function eq(s){const Q_EN={
  '冰融化后会变成什么？':'What does ice become when it melts?',
  '正常人有几只眼睛？':'How many eyes does a person have?',
  '以下哪个属于水果？':'Which one is a fruit?',
  '1 加 2 等于几？':'What is 1 + 2?','5 减 2 等于几？':'What is 5 - 2?',
  '2 乘以 3 等于几？':'What is 2 × 3?',
  '在天上飞的交通工具是什么？':'Which vehicle flies in the sky?',
  '星期一的后面是星期几？':'What day comes after Monday?',
  '鱼通常生活在哪里？':'Where do fish live?',
  '晴朗的天空通常是什么颜色？':'What color is the clear sky?',
  '太阳从哪个方向升起？':'Which direction does the sun rise?',
  '小狗发出的叫声通常是？':'What sound does a puppy make?',
  '10 加 5 等于几？':'What is 10 + 5?','8 减 4 等于几？':'What is 8 - 4?',
  '我们用什么器官来听声音？':'Which organ do we use to hear?',
  '一年有几个月？':'How many months in a year?',
  '一周有几天？':'How many days in a week?',
  '地球是什么形状？':'What shape is the Earth?',
  '水的化学式是什么？':'What is the chemical formula of water?',
  '中国有多少个省级行政区？':'How many provinces in China?',
  '以下哪个是哺乳动物？':'Which is a mammal?',
  '光合作用需要什么气体？':'What gas does photosynthesis need?',
  '月亮绕地球一圈大约多久？':'How long for the moon to orbit Earth?',
  '以下哪个是中国的传统节日？':'Which is a Chinese traditional festival?',
  '人体最大的器官是什么？':'What is the largest organ of the human body?',
  '哪种动物被称为百兽之王？':'Which animal is called king of beasts?',
  '一打等于几个？':'How many in a dozen?',
  '世界上最长的河流是？':'What is the longest river in the world?',
  '铅笔芯主要成分是什么？':'What is pencil lead mainly made of?',
  'WiFi 是什么的缩写？':'What is WiFi short for?',
  '一天有多少小时？':'How many hours in a day?',
  '三角形内角和是多少度？':'What is the sum of interior angles of a triangle?',
  '以下哪个是可再生能源？':'Which is renewable energy?',
  '蜜蜂采蜜后会酿成什么？':'What do bees make from nectar?',
  '人体有多少块骨头？':'How many bones in the human body?',
  '以下哪个行星最大？':'Which planet is the largest?',
  '彩虹有几种颜色？':'How many colors in a rainbow?',
  '向日葵会朝向哪个方向？':'Which direction does a sunflower face?',
  '大象的鼻子有什么功能？':'What function does an elephant trunk have?',
  '铁生锈需要什么？':'What does iron need to rust?',
  '哪种鸟不会飞？':'Which bird cannot fly?',
  '以下哪个是哺乳动物的特征？':'Which is a characteristic of mammals?',
  '地球自转一圈需要多久？':'How long for the Earth to rotate once?',
  '糖溶解在水里会怎样？':'What happens when sugar dissolves in water?',
  '以下哪个是中国的首都？':'Which is the capital of China?',
  '鸡蛋是哪种动物的卵？':'Which animal lays eggs we call eggs?',
  '镜子利用的是什么原理？':'What principle does a mirror use?',
  '人正常体温大约是多少度？':'What is normal human body temperature?',
  '冰水混合物的温度是？':'What is the temperature of ice-water mixture?',
  '以下哪个交通工具最快？':'Which vehicle is fastest?',
};return Q_EN[s]||s}

// ============ D1 封装 ============

async function d1Run(d1, sql, args = []) {
  try {
    if (!d1) return { success: false, error: 'no_db' };
    return await d1.prepare(sql).bind(...args).run();
  } catch (e) {
    console.error('D1 run error:', sql.slice(0,80), e.message);
    return { success: false, error: e.message };
  }
}

async function d1First(d1, sql, args = []) {
  try {
    if (!d1) return null;
    const r = await d1.prepare(sql).bind(...args).all();
    return r.results?.[0] || null;
  } catch (e) {
    console.error('D1 first error:', sql.slice(0,80), e.message);
    return null;
  }
}

async function d1All(d1, sql, args = []) {
  try {
    if (!d1) return { results: [] };
    return await d1.prepare(sql).bind(...args).all();
  } catch (e) {
    console.error('D1 all error:', sql.slice(0,80), e.message);
    return { results: [] };
  }
}

async function d1Init(env) {
  if (!env.TG_O2O_DB) return;
  try {
    await env.TG_O2O_DB.batch([
      env.TG_O2O_DB.prepare("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, thread_id INTEGER, title TEXT DEFAULT '', first_name TEXT DEFAULT '', last_name TEXT DEFAULT '', username TEXT DEFAULT '', name_history TEXT DEFAULT '[]', state TEXT DEFAULT 'new', ban_until INTEGER DEFAULT 0, trusted INTEGER DEFAULT 0, distrusted INTEGER DEFAULT 0, closed INTEGER DEFAULT 0, card_cid INTEGER DEFAULT 0, card_mid INTEGER DEFAULT 0, created_at INTEGER DEFAULT (unixepoch()), updated_at INTEGER DEFAULT (unixepoch()))"),
      env.TG_O2O_DB.prepare("CREATE TABLE IF NOT EXISTS thread_map (thread_id INTEGER PRIMARY KEY, user_id TEXT NOT NULL)"),
      env.TG_O2O_DB.prepare("CREATE TABLE IF NOT EXISTS bot_msgs (user_id TEXT NOT NULL, msg_id INTEGER NOT NULL, created_at INTEGER DEFAULT (unixepoch()), PRIMARY KEY (user_id, msg_id))"),
      env.TG_O2O_DB.prepare("CREATE TABLE IF NOT EXISTS msg_map (group_id INTEGER NOT NULL, msg_id INTEGER NOT NULL, user_id TEXT NOT NULL, PRIMARY KEY (group_id, msg_id))"),
      env.TG_O2O_DB.prepare("CREATE TABLE IF NOT EXISTS msg_del (group_id INTEGER NOT NULL, group_msg_id INTEGER NOT NULL, visitor_msg_id INTEGER NOT NULL, created_at INTEGER DEFAULT (unixepoch()), PRIMARY KEY (group_id, group_msg_id))"),
      env.TG_O2O_DB.prepare("CREATE INDEX IF NOT EXISTS idx_thread_map_user ON thread_map(user_id)"),
      env.TG_O2O_DB.prepare("CREATE INDEX IF NOT EXISTS idx_bot_msgs_user ON bot_msgs(user_id)"),
    ]);
  } catch(e) { console.error('D1 init error:', e.message); }
}



async function d1GetUser(env, userId) {
  // Try D1 first
  const row = await d1First(env, 'SELECT * FROM users WHERE id = ?', [userId]);
  if (row) {
    row.nameHistory = JSON.parse(row.name_history || '[]');
    row.trusted = !!row.trusted;
    row.distrusted = !!row.distrusted;
    row.closed = !!row.closed;
    return row;
  }
  return null;
}

async function d1UpsertUser(env, userId, data) {
  const existing = await d1GetUser(env, userId);
  const now = Math.floor(Date.now() / 1000);
  const merged = existing || {
    id: userId, thread_id: null, title: '', first_name: '', last_name: '',
    username: '', name_history: '[]', state: 'new', ban_until: 0,
    trusted: 0, distrusted: 0, closed: 0, card_cid: 0, card_mid: 0, created_at: now
  };
  for (const k of Object.keys(data)) {
    if (k === 'nameHistory') merged.name_history = JSON.stringify(data[k]);
    else if (k in merged) merged[k] = data[k];
  }
  // D1 write
  const d1Sql = `INSERT INTO users (id,thread_id,title,first_name,last_name,username,name_history,state,ban_until,trusted,distrusted,closed,card_cid,card_mid,created_at,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(id) DO UPDATE SET
      thread_id=excluded.thread_id,
      title=COALESCE(excluded.title,users.title), first_name=COALESCE(excluded.first_name,users.first_name),
      last_name=COALESCE(excluded.last_name,users.last_name), username=COALESCE(excluded.username,users.username),
      name_history=COALESCE(excluded.name_history,users.name_history), state=COALESCE(excluded.state,users.state),
      ban_until=COALESCE(excluded.ban_until,users.ban_until), trusted=COALESCE(excluded.trusted,users.trusted),
      distrusted=COALESCE(excluded.distrusted,users.distrusted), closed=COALESCE(excluded.closed,users.closed),
      card_cid=COALESCE(excluded.card_cid,users.card_cid), card_mid=COALESCE(excluded.card_mid,users.card_mid),
      updated_at=excluded.updated_at`;
  const d1Params = [merged.id, merged.thread_id, merged.title, merged.first_name, merged.last_name,
    merged.username, merged.name_history, merged.state, merged.ban_until,
    merged.trusted ? 1 : 0, merged.distrusted ? 1 : 0, merged.closed ? 1 : 0,
    merged.card_cid || 0, merged.card_mid || 0, merged.created_at, now];
  await d1Run(env, d1Sql, d1Params);
  return merged;
}

// ============ 多 bot 配置系统 ============
function loadConfigs(env) {
  if (env.BOT_CONFIGS) {
    try {
      const c = JSON.parse(env.BOT_CONFIGS);
      if (Array.isArray(c) && c.length > 0) return c;
    } catch(e) { console.error("BOT_CONFIGS parse error:", e.message); }
  }
  const cfgs = [];
  for (let i = 1; ; i++) {
    const s = i === 1 ? '' : `_${i}`;
    const t = env[`ENV_BOT_TOKEN${s}`];
    if (!t) break;
    cfgs.push({
      token: t, ownerId: env[`ENV_OWNER_ID${s}`] || '',
      supergroupId: env[`ENV_SUPERGROUP_ID${s}`] || '',
      webhookSecret: env[`ENV_WEBHOOK_SECRET${s}`] || '',
      healthKey: env[`ENV_HEALTH_KEY${s}`] || '',
    });
  }
  return cfgs;
}

function getBotIndex(url) {
  const m = url.pathname.match(/(\d+)$/);
  if (m) return Math.max(0, parseInt(m[1]) - 1);
  return 0;
}

function getCfg(configs, idx, kv, d1Binding) {
  const c = configs[idx] || configs[0];
  return {
    bot: `bot${idx + 1}`,
    token: c.token, ownerId: c.ownerId,
    supergroupId: c.supergroupId, healthKey: c.healthKey || '',
    webhookSecret: c.webhookSecret || '',
    kv, d1: d1Binding,
    kvPrefix: `b${idx}:`,
  };
}

function k(cfg, key) { return cfg.kvPrefix + key; }
function pid(cfg, uid) { return cfg.kvPrefix + uid; }
function botSuffix(idx) { return idx > 0 ? String(idx + 1) : ''; }

// ============ TG API 工具 ============
async function tg(token, method, body) {
  for (let i = 0; i <= 2; i++) {
    try {
      const r = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
        method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)
      });
      const d = await r.json();
      if (d.ok || i === 2) return d;
      if (d.error_code === 429) {
        const wait = (d.parameters?.retry_after || 1) * 1000;
        await new Promise(r => setTimeout(r, wait)); continue;
      }
      return d;
    } catch(e) { if (i === 2) return {ok:false, description:e.message}; await new Promise(r => setTimeout(r, 1000)); }
  }
  return {ok:false, description:'retry exhausted'};
}

async function isBlocked(token, userId) {
  const r = await fetch(`https://api.telegram.org/bot${token}/sendChatAction`, {
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify({chat_id:userId,action:"typing"})
  });
  const d = await r.json();
  return !d.ok && (d.description||"").includes("blocked");
}

function buildTopicTitle(from) {
  const name = [from.first_name||"", from.last_name||""].join(" ").trim().substring(0,50);
  const u = from.username ? `@${from.username}` : "";
  return `${name} ${u} [${from.id}]`.trim().substring(0,128);
}

// ============ D1 用户操作 ============
async function getNameHistory(cfg, userId) {
  const u = await d1GetUser(cfg.d1, pid(cfg, userId));
  return u?.nameHistory || [];
}

async function saveNameChange(cfg, userId, from) {
  const prefixedId = pid(cfg, userId);
  const existing = await d1GetUser(cfg.d1, prefixedId);
  if (existing && existing.first_name === (from.first_name||'') && existing.last_name === (from.last_name||'') && existing.username === (from.username||'')) {
    if (existing.title !== buildTopicTitle(from)) {
      await d1UpsertUser(cfg.d1, prefixedId, { title: buildTopicTitle(from) });
    }
    return existing;
  }
  // 自动修正 first_name 含 @ 的旧 bug
  if (existing && from.first_name && !from.first_name.includes('@') && existing.first_name && existing.first_name.includes('@')) {
    await d1UpsertUser(cfg.d1, prefixedId, {
      first_name: from.first_name||'', last_name: from.last_name||'', username: from.username||'',
      title: buildTopicTitle(from)
    });
    const updated = await d1GetUser(cfg.d1, prefixedId);
    return updated;
  }
  // 自动修正 last_name 被清空
  if (existing && from.last_name && !existing.last_name && existing.first_name === from.first_name && existing.username === from.username) {
    await d1UpsertUser(cfg.d1, prefixedId, { last_name: from.last_name, title: buildTopicTitle(from) });
    const updated = await d1GetUser(cfg.d1, prefixedId);
    return updated;
  }
  let nameHistory = existing?.nameHistory || [];
  if (existing) {
    const oldName = existing.title ? existing.title.split(' [')[0] : '';
    nameHistory = [...nameHistory, {name: oldName, username: existing.username, time: new Date().toLocaleString('zh-CN')}].slice(-20);
  }
  const data = {
    first_name: from.first_name||'', last_name: from.last_name||'', username: from.username||'',
    title: buildTopicTitle(from), nameHistory
  };
  await d1UpsertUser(cfg.d1, prefixedId, data);
  return await d1GetUser(cfg.d1, prefixedId);
}

async function getTopic(cfg, userId, from) {
  const prefixedId = pid(cfg, userId);
  let existing = await d1GetUser(cfg.d1, prefixedId);
  if (existing?.thread_id) {
    if (from && (existing.last_name !== (from.last_name||'') || existing.username !== (from.username||''))) {
      await saveNameChange(cfg, userId, from);
      existing = await d1GetUser(cfg.d1, prefixedId) || existing;
      if (existing?.thread_id) {
        try { await tg(cfg.token, "editForumTopic", {
          chat_id: cfg.supergroupId, message_thread_id: existing.thread_id, name: existing.title.substring(0,128)
        }); } catch(e) {}
      }
      return existing;
    }
    return existing;
  }
  const title = buildTopicTitle(from);
  const res = await tg(cfg.token, "createForumTopic", { chat_id: cfg.supergroupId, name: title });
  if (!res.ok) throw new Error("创建话题失败: " + (res.description || 'unknown'));
  const threadId = res.result.message_thread_id;
  // 保存到 D1
  await d1UpsertUser(cfg.d1, prefixedId, { thread_id: threadId, title });
  await d1Run(cfg.d1, 'INSERT OR REPLACE INTO thread_map (thread_id, user_id) VALUES (?,?)', [threadId, prefixedId]).catch(e=>console.error("thread_map:",e.message));
  return await d1GetUser(cfg.d1, prefixedId);
}

async function uidByThread(cfg, tid) {
  const row = await d1First(cfg.d1, 'SELECT user_id FROM thread_map WHERE thread_id = ?', [tid]);
  if (!row) return null;
  const uid = row.user_id.replace(/^b\d+:/, '');
  return Number(uid);
}

async function uidByMsg(cfg, groupId, msgId) {
  const row = await d1First(cfg.d1, 'SELECT user_id FROM msg_map WHERE group_id = ? AND msg_id = ?', [groupId, msgId]);
  if (!row) return null;
  const uid = row.user_id.replace(/^b\d+:/, '');
  return Number(uid);
}

// 限流
async function checkRateLimit(kv, key) {
  if (!kv || typeof kv.get !== 'function') return true;
  try {
    const k = `rl:${key}`;
    const now = Math.floor(Date.now() / 1000);
    const windowKey = `u:${k}:${Math.floor(now / 2)}`;
    const prev = await kv.get(windowKey, {type:'json'});
    if (!prev) {
      await kv.put(windowKey, JSON.stringify({c:1}), {expirationTtl: 5});
      return true;
    }
    if (prev.c > 6) return false;
    prev.c++; await kv.put(windowKey, JSON.stringify(prev), {expirationTtl: 5});
    return true;
  } catch(e) { console.error('rate limit error:', e.message); return true; }
}

// ============ 资料卡 ============
async function ensureProfileTopic(cfg) {
  const key = k(cfg, 'profile_log_topic:' + cfg.supergroupId);
  let tid = await cfg.kv.get(key);
  if (tid) {
    // "general" = 使用 General 话题（不带 message_thread_id）
    if (tid === 'general') return 'general';
    return tid;
  }
  // 默认直接用 General 话题，不建新话题
  await cfg.kv.put(key, 'general');
  return 'general';
}

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
      {text: '🆕 重建话题', callback_data: 'rebuild_topic:' + userId},
      {text: '👤 查看', url: `tg://user?id=${userId}`},
    ],
  ]};
}

async function syncProfileCard(cfg, userId, from, statusOverride) {
  const prefixedId = pid(cfg, userId);
  const topicId = await ensureProfileTopic(cfg);
  if (!topicId) return;
  await saveNameChange(cfg, userId, from);
  const user = await d1GetUser(cfg.d1, prefixedId);
  // 新用户未在 D1 创建时仍然要发资料卡
  const u = user || { state: 'new', trusted: 0, distrusted: 0, ban_until: 0, nameHistory: [], card_cid: 0, card_mid: 0 };
  const isBanned = u.state === 'banned' || (u.ban_until && u.ban_until > Math.floor(Date.now()/1000));
  const isTrusted = !!u.trusted;
  const isDistrusted = !!u.distrusted;
  let banExpireStr = '';
  if (isBanned && u.ban_until) {
    const d = new Date(u.ban_until * 1000);
    banExpireStr = `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
  }
  const nameHistory = u.nameHistory || [];
  let status = statusOverride || (isBanned ? 'banned' : isTrusted ? 'trusted' : 'normal');
  const finalStatus = (status === 'normal' && isDistrusted) ? 'distrusted' : status;
  const text = profileCardText(userId, from, finalStatus, nameHistory, banExpireStr);
  const buttons = profileCardButtons(userId, isBanned, isTrusted);
  const cardCid = u?.card_cid;
  const cardMid = u?.card_mid;
  const msgPayload = topicId === 'general'
    ? {chat_id: cfg.supergroupId, text, reply_markup: buttons, parse_mode: 'HTML'}
    : {chat_id: cfg.supergroupId, message_thread_id: Number(topicId), text, reply_markup: buttons, parse_mode: 'HTML'};
  if (cardCid && cardMid) {
    const editRes = await tg(cfg.token, 'editMessageText', {
      chat_id: cardCid, message_id: cardMid, text,
      reply_markup: buttons, parse_mode: 'HTML',
    });
    if (!editRes.ok) {
      const res = await tg(cfg.token, 'sendMessage', msgPayload);
      if (res?.ok && res?.result?.message_id) {
        await d1UpsertUser(cfg.d1, prefixedId, { card_cid: Number(cfg.supergroupId), card_mid: res.result.message_id });
      }
    }
  } else {
    const res = await tg(cfg.token, 'sendMessage', msgPayload);
    if (res?.ok && res?.result?.message_id) {
      await d1UpsertUser(cfg.d1, prefixedId, { card_cid: Number(cfg.supergroupId), card_mid: res.result.message_id });
    }
  }
}

// ============ 验证流程 ============
async function sendTextVerify(cfg, ctx, userId, from) {
  const q = genTextQ(); const qid = shortId();
  // 中英文选项分成独立数组，保持索引一致
  const indices = [...Array(q.options.length).keys()];
  const shuffled = shuffle(indices);
  const opts = shuffled.map(i => q.options[i]);
  const optsEn = opts.map(en);
  await cfg.kv.put(k(cfg, `v:${qid}`), JSON.stringify({answer:q.answer,opts,uid:userId}), {expirationTtl:300});
  const buttons = [
    opts.map((o,i) => ({text:o, callback_data:`vt:${qid}:${i}`})),
    optsEn.map((o,i) => ({text:o, callback_data:`vt:${qid}:${i}`})),
  ];
  const res = await tg(cfg.token, "sendMessage", {
    chat_id: userId, text: `🤖 请回答以下问题 / Answer:\n\n${q.question}\n${eq(q.question)}`,
    reply_markup: {inline_keyboard: buttons}
  });
  const msgId = res?.ok && res?.result?.message_id ? res.result.message_id : 0;
  await cfg.kv.put(k(cfg, `verify:${userId}`), JSON.stringify({stage:"text",qid,warned:false,qids:[msgId]}), {expirationTtl:300});
  await syncProfileCard(cfg, userId, from, 'pending').catch(e => console.error("syncProfileCard:",e.message));
}

// ============ 消息转发 ============
async function sendMsg(token, chatId, msg, extra) {
  const b = {chat_id: chatId, ...extra};
  if (msg.text) return tg(token, "sendMessage", {...b, text: msg.text});
  if (msg.photo) return tg(token, "sendPhoto", {...b, photo: msg.photo[msg.photo.length-1].file_id, caption: msg.caption||""});
  if (msg.video) return tg(token, "sendVideo", {...b, video: msg.video.file_id, caption: msg.caption||""});
  if (msg.voice) return tg(token, "sendVoice", {...b, voice: msg.voice.file_id});
  if (msg.audio) return tg(token, "sendAudio", {...b, audio: msg.audio.file_id, caption: msg.caption||""});
  if (msg.document) return tg(token, "sendDocument", {...b, document: msg.document.file_id, caption: msg.caption||""});
  if (msg.sticker) return tg(token, "sendSticker", {...b, sticker: msg.sticker.file_id});
  if (msg.video_note) return tg(token, "sendVideoNote", {...b, video_note: msg.video_note.file_id});
  if (msg.animation) return tg(token, "sendAnimation", {...b, animation: msg.animation.file_id, caption: msg.caption||""});
  if (msg.location) return tg(token, "sendLocation", {...b, latitude: msg.location.latitude, longitude: msg.location.longitude});
  if (msg.contact) return tg(token, "sendContact", {...b, phone_number: msg.contact.phone_number, first_name: msg.contact.first_name});
  return null;
}

async function forwardToTopic(cfg, ctx, userId, from, msg) {
  try {
    const topic = await getTopic(cfg, userId, from);
    const sent = await sendMsg(cfg.token, cfg.supergroupId, msg, {message_thread_id: topic.thread_id});
    if (sent?.ok && sent?.result?.message_id) {
      // msg_map: 群消息ID → 用户ID
      await d1Run(cfg.d1, `INSERT OR REPLACE INTO msg_map (group_id, msg_id, user_id) VALUES (?,?,?)`,
        [Number(cfg.supergroupId), sent.result.message_id, pid(cfg, userId)]);
      // msg_del: 群消息ID → 访客原始消息ID
      try { await d1Run(cfg.d1, 'INSERT OR REPLACE INTO msg_del (group_id, group_msg_id, visitor_msg_id) VALUES (?,?,?)', [Number(cfg.supergroupId), sent.result.message_id, msg.message_id||0]); } catch(e) { console.error("msg_del error:", e.message); }

    } else {
      // 发消息失败 → 可能话题已删除，重建
      if (topic.thread_id) {
        await d1UpsertUser(cfg.d1, pid(cfg, userId), { thread_id: null });
        await d1Run(cfg.d1, 'DELETE FROM thread_map WHERE thread_id = ?', [topic.thread_id]).catch(e=>{});
      }
      const newTopic = await getTopic(cfg, userId, from);
      await sendMsg(cfg.token, cfg.supergroupId, msg, {message_thread_id: newTopic.thread_id});
    }
  } catch (e) {
    console.error("forwardToTopic:", e.message);
  }
}

async function replyToVisitor(cfg, ctx, userId, msg) {
  const prefixed = pid(cfg, userId);
  const sent = await sendMsg(cfg.token, userId, msg);
  if (sent?.ok && sent?.result?.message_id) {
    // bot_msgs: 记录发给访客的消息ID（用于 /close 批量撤回）
    await d1Run(cfg.d1, `INSERT OR REPLACE INTO bot_msgs (user_id, msg_id) VALUES (?,?)`,
      [prefixed, sent.result.message_id]);
    // msg_map: 记录管理员在群里的回复消息 → 用户ID
    await d1Run(cfg.d1, `INSERT OR REPLACE INTO msg_map (group_id, msg_id, user_id) VALUES (?,?,?)`,
      [Number(cfg.supergroupId), msg.message_id, prefixed]);
    // msg_del: 群消息ID → 访客端消息ID（用于 /del）
    try { await d1Run(cfg.d1, 'INSERT OR REPLACE INTO msg_del (group_id, group_msg_id, visitor_msg_id) VALUES (?,?,?)', [Number(cfg.supergroupId), msg.message_id, sent.result.message_id]); } catch(e) { console.error("msg_del error:", e.message); }

  } else if (sent && !sent.ok && (sent.description||'').includes('blocked')) {
    // 访客拉黑了 bot
    const user = await d1GetUser(cfg.d1, prefixed);
    if (user && !user.trusted) {
      await d1UpsertUser(cfg.d1, prefixed, { state: 'new', distrusted: 1 });
      const fakeFrom = { id: Number(userId), first_name: user.first_name||'访客', last_name: user.last_name||'', username: user.username };
      const topic = await getTopic(cfg, userId, fakeFrom);
      await tg(cfg.token, "sendMessage", {
        chat_id: cfg.supergroupId, message_thread_id: topic.thread_id,
        text: "⚠️ 该访客已断开连接，已标记失信，需重新验证\nVisitor disconnected. Marked as untrustworthy, re-verification required.",
      });
      await syncProfileCard(cfg, userId, fakeFrom, 'distrusted').catch(e=>console.error("card:",e.message));
    }
  }
}

async function notifyOwner(cfg, userId, from, text) {
  try {
    const topic = await getTopic(cfg, userId, from);
    const sent = await tg(cfg.token, "sendMessage", {
      chat_id: cfg.supergroupId, message_thread_id: topic.thread_id, text
    });
    if (sent?.ok && sent?.result?.message_id) {
      await d1Run(cfg.d1, `INSERT OR REPLACE INTO msg_map (group_id, msg_id, user_id) VALUES (?,?,?)`,
        [Number(cfg.supergroupId), sent.result.message_id, pid(cfg, userId)]);
    }
    await syncProfileCard(cfg, userId, from).catch(e => console.error("syncProfileCard:",e.message));
  } catch (e) {
    console.error("notifyOwner:", e.message);
    try { await tg(cfg.token, "sendMessage", {chat_id: cfg.ownerId, text: `[话题失败] ${text}`}); } catch(e2) {}
  }
}

function scheduleDelete(ctx, token, chatId, msgId) {
  const p = new Promise(r => setTimeout(async () => {
    try { await tg(token, "deleteMessage", {chat_id: chatId, message_id: msgId}); } catch(e) {}
    r();
  }, 30000));
  if (ctx?.waitUntil) ctx.waitUntil(p);
}

// ============ 管理员命令 ============
async function handleAdmin(cfg, ctx, targetUid, msg, text) {
  const parts = text.split(' ');
  const cmd = parts[0].toLowerCase();
  const threadId = msg.message_thread_id;
  const prefixedId = pid(cfg, targetUid);

  // /del：管理员回复消息时使用，撤回该访客的特定消息
  if (cmd === '/del') {
    const replyTo = msg.reply_to_message;
    if (!replyTo) {
      return tg(cfg.token, "sendMessage", {chat_id: cfg.supergroupId, message_thread_id: threadId, text: "请回复一条访客消息使用 /del / Reply to a visitor message"});
    }
    const groupMsgId = replyTo.message_id;
    // 删群里的消息
    try { await tg(cfg.token, "deleteMessage", {chat_id: Number(cfg.supergroupId), message_id: groupMsgId}); } catch(e) {}
    try { await tg(cfg.token, "deleteMessage", {chat_id: Number(cfg.supergroupId), message_id: msg.message_id}); } catch(e) {}
    // 查访客端消息
    let visitorMsgId;
    const delRow = await d1First(cfg.d1, 'SELECT visitor_msg_id FROM msg_del WHERE group_id = ? AND group_msg_id = ?', [Number(cfg.supergroupId), groupMsgId]);
    if (delRow) {
      visitorMsgId = delRow.visitor_msg_id;
    }
    if (visitorMsgId) {
      try {
        await tg(cfg.token, "deleteMessage", {chat_id: Number(targetUid), message_id: Number(visitorMsgId)});
        await tg(cfg.token, "sendMessage", {chat_id: cfg.supergroupId, message_thread_id: threadId, text: "✅ 已撤回对方消息"});
      } catch(e) {
        await tg(cfg.token, "sendMessage", {chat_id: cfg.supergroupId, message_thread_id: threadId, text: "⚠️ 无法撤回对方消息（可能超过48小时）"});
      }
    } else {
      await tg(cfg.token, "sendMessage", {chat_id: cfg.supergroupId, message_thread_id: threadId, text: "⚠️ 找不到对应的访客消息记录"});
    }
    return;
  }

  if (cmd === '/help') {
    await tg(cfg.token, "sendMessage", {chat_id: cfg.supergroupId, message_thread_id: threadId, text: `🤖 管理员命令 / Admin Commands

/delall - 撤回该访客全部消息（双方）
/del - 撤回单条消息（回复转发消息使用）
/recall <用户ID> - 按用户ID撤回消息
/reply <内容> - 引用回复转发消息
/broadcast <消息> - 广播给所有访客

资料卡按钮：封禁/解封、信任、刷新资料、重建话题
`});
    return;
  }
  if (cmd === '/close') { return; }

  if (cmd === '/delall') {
    // 撤回该访客所有消息（双方）
    let count = 0, gcount = 0;
    // 撤回 bot 发给访客的消息（管理员回复）
    const msgs = await d1All(cfg.d1, 'SELECT msg_id FROM bot_msgs WHERE user_id = ?', [prefixedId]);
    for (const row of msgs.results || []) {
      try { await tg(cfg.token, "deleteMessage", {chat_id: Number(targetUid), message_id: row.msg_id}); count++; } catch(e) {}
    }
    // 撤回群里的转发消息 + 访客原始消息
    const groupMsgs = await d1All(cfg.d1, 'SELECT msg_id FROM msg_map WHERE user_id = ?', [prefixedId]);
    for (const row of groupMsgs.results || []) {
      try { await tg(cfg.token, "deleteMessage", {chat_id: Number(cfg.supergroupId), message_id: row.msg_id}); gcount++; } catch(e) {}
      // 同步删访客端原始消息
      const delRow = await d1First(cfg.d1, 'SELECT visitor_msg_id FROM msg_del WHERE group_id = ? AND group_msg_id = ?', [Number(cfg.supergroupId), row.msg_id]);
      if (delRow?.visitor_msg_id) {
        try { await tg(cfg.token, "deleteMessage", {chat_id: Number(targetUid), message_id: delRow.visitor_msg_id}); count++; } catch(e) {}
      }
    }
    // 清理数据库（只删该用户的 msg_del）
    const allMsgIds = [...new Set([
      ...(msgs.results || []).map(r => r.msg_id),
      ...(groupMsgs.results || []).map(r => r.msg_id)
    ])];
    if (allMsgIds.length > 0) {
      const ph = allMsgIds.map(() => '?').join(',');
      await d1Run(cfg.d1, `DELETE FROM msg_del WHERE group_id = ? AND (group_msg_id IN (${ph}) OR visitor_msg_id IN (${ph}))`, [Number(cfg.supergroupId), ...allMsgIds, ...allMsgIds]);
    }
    await d1Run(cfg.d1, 'DELETE FROM bot_msgs WHERE user_id = ?', [prefixedId]);
    await d1Run(cfg.d1, 'DELETE FROM msg_map WHERE user_id = ?', [prefixedId]);
    await tg(cfg.token, "sendMessage", {chat_id: cfg.supergroupId, message_thread_id: threadId, text: `✅ 已撤回访客端 ${count} 条，话题端 ${gcount} 条消息`});
    return;
  }

  if (cmd === '/reply') {
    const replyTo = msg.reply_to_message;
    if (!replyTo) {
      return tg(cfg.token, "sendMessage", {chat_id: cfg.supergroupId, message_thread_id: threadId, text: "请回复一条访客消息使用 /reply <内容>"});
    }
    const replyText = parts.slice(1).join(' ').trim();
    if (!replyText) {
      return tg(cfg.token, "sendMessage", {chat_id: cfg.supergroupId, message_thread_id: threadId, text: "用法：回复访客消息并输入 /reply <回复内容>"});
    }
    // 查访客原始消息ID
    let replyToMsgId;
    const delRow = await d1First(cfg.d1, 'SELECT visitor_msg_id FROM msg_del WHERE group_id = ? AND group_msg_id = ?', [Number(cfg.supergroupId), replyTo.message_id]);
    if (delRow) {
      replyToMsgId = delRow.visitor_msg_id;
    }
    const sent = await tg(cfg.token, "sendMessage", {
      chat_id: Number(targetUid), text: replyText,
      ...(replyToMsgId ? {reply_to_message_id: replyToMsgId} : {}),
    });
    if (sent?.ok && sent?.result?.message_id) {
      await d1Run(cfg.d1, 'INSERT OR REPLACE INTO bot_msgs (user_id, msg_id) VALUES (?,?)', [prefixedId, sent.result.message_id]);
      await d1Run(cfg.d1, 'INSERT OR REPLACE INTO msg_del (group_id, group_msg_id, visitor_msg_id) VALUES (?,?,?)', [Number(cfg.supergroupId), msg.message_id, sent.result.message_id]).catch(e=>{});
    }
    return;
  }
  if (cmd === '/broadcast') {
    const broadcastMsg = parts.slice(1).join(' ');
    if (!broadcastMsg) {
      return tg(cfg.token, "sendMessage", {chat_id: cfg.supergroupId, message_thread_id: threadId, text: "用法：/broadcast <消息>\nUsage: /broadcast <message>"});
    }
    await tg(cfg.token, "sendMessage", {chat_id: cfg.supergroupId, message_thread_id: threadId, text: "⏳ 正在广播…"});
    const allUsers = await d1All(cfg.d1, "SELECT id FROM users WHERE state != 'banned'");
    let success = 0, fail = 0;
    for (const u of allUsers.results || []) {
      const uid = u.id.replace(/^b\d+:/, '');
      try {
        const r = await tg(cfg.token, "sendMessage", {chat_id: Number(uid), text: broadcastMsg});
        if (r?.ok) success++; else fail++;
      } catch(e) { fail++; }
    }
    await tg(cfg.token, "sendMessage", {chat_id: cfg.supergroupId, message_thread_id: threadId, text: `📢 广播完成：成功 ${success}，失败 ${fail}`});
    return;
  }
  if (cmd === '/recall') {
    const target = parts[1];
    if (!target) return tg(cfg.token, "sendMessage", {chat_id: cfg.supergroupId, message_thread_id: threadId, text: "用法：/recall <user_id>"});
    const targetPrefixed = pid(cfg, target);
    // 删访客端消息
    let deleted = 0, failed = 0;
    const msgs = await d1All(cfg.d1, 'SELECT msg_id FROM bot_msgs WHERE user_id = ?', [targetPrefixed]);
    for (const row of msgs.results || []) {
      try { await tg(cfg.token, "deleteMessage", {chat_id: Number(target), message_id: row.msg_id}); deleted++; } catch(e) { failed++; }
    }
    // 删群端+访客端（通过 msg_del）
    const groupMsgs = await d1All(cfg.d1, 'SELECT msg_id FROM msg_map WHERE user_id = ?', [targetPrefixed]);
    for (const row of groupMsgs.results || []) {
      try { await tg(cfg.token, "deleteMessage", {chat_id: Number(cfg.supergroupId), message_id: row.msg_id}); deleted++; } catch(e) { failed++; }
      // 同步删访客原始消息
      const dr = await d1First(cfg.d1, 'SELECT visitor_msg_id FROM msg_del WHERE group_id = ? AND group_msg_id = ?', [Number(cfg.supergroupId), row.msg_id]);
      if (dr?.visitor_msg_id) {
        try { await tg(cfg.token, "deleteMessage", {chat_id: Number(target), message_id: dr.visitor_msg_id}); deleted++; } catch(e) { failed++; }
      }
    }
    // 清理数据库（只删该用户的 msg_del）
    const allRecallIds = [...new Set([
      ...(msgs.results || []).map(r => r.msg_id),
      ...(groupMsgs.results || []).map(r => r.msg_id)
    ])];
    if (allRecallIds.length > 0) {
      const ph = allRecallIds.map(() => '?').join(',');
      await d1Run(cfg.d1, `DELETE FROM msg_del WHERE group_id = ? AND (group_msg_id IN (${ph}) OR visitor_msg_id IN (${ph}))`, [Number(cfg.supergroupId), ...allRecallIds, ...allRecallIds]);
    }
    await d1Run(cfg.d1, 'DELETE FROM bot_msgs WHERE user_id = ?', [targetPrefixed]);
    await d1Run(cfg.d1, 'DELETE FROM msg_map WHERE user_id = ?', [targetPrefixed]);
    await d1Run(cfg.d1, 'UPDATE users SET thread_id = NULL WHERE id = ?', [targetPrefixed]);
    await d1Run(cfg.d1, 'DELETE FROM thread_map WHERE user_id = ?', [targetPrefixed]);
    await tg(cfg.token, "sendMessage", {
      chat_id: cfg.supergroupId, message_thread_id: threadId,
      text: `✅ 撤回完成\n用户：<code>${target}</code>\n成功：${deleted} 条 / 失败：${failed} 条\n话题已重置，用户下次发消息将建新话题。`,
      parse_mode: 'HTML'
    });
  }
}
// ============ 主入口 ============
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const configs = loadConfigs(env);
      const idx = getBotIndex(url);
      if (configs.length === 0) {
        let parseHint = 'not set';
        if (env.BOT_CONFIGS) {
          try { const c = JSON.parse(env.BOT_CONFIGS); parseHint = `parsed: ${Array.isArray(c) ? 'array['+c.length+']' : typeof c}`; } catch(e) { parseHint = 'parse error: ' + e.message; }
        }
        return new Response(`No bot configured. BOT_CONFIGS=${parseHint}`, {status: 500});
      }
      const cfg = getCfg(configs, idx, env.KV, env.TG_O2O_DB);

      // D1 初始化（首次调用时建表）
      ctx.waitUntil(d1Init(env));

      // GET 路由
      if (request.method === "GET") {
        const p = url.pathname;

        if (p === "/" || p === "/index.html") {
          // 自动激活所有 bot 的 webhook
          const setupResults = [];
          let allOk = true;
          for (let i = 0; i < configs.length; i++) {
            const c = getCfg(configs, i, env.KV, env.TG_O2O_DB);
            const suffix = botSuffix(i);
            const whUrl = `${url.origin}/webhook${suffix}`;
            const sr = { bot: i + 1, name: '', whUrl, webhook: false, commandsOk: false, error: null };
            try {
              const params = { url: whUrl, max_connections: 50, allowed_updates: ["message","edited_message","callback_query","message_reaction"] };
              if (c.webhookSecret) params.secret_token = c.webhookSecret;
              const r1 = await fetch(`https://api.telegram.org/bot${c.token}/setWebhook`, {
                method:'POST', headers:{"Content-Type":"application/json"}, body:JSON.stringify(params)
              });
              const d1 = await r1.json();
              sr.webhook = d1.ok === true;
              if (!sr.webhook) allOk = false;
              // 获取 bot 名字
              const me = await fetch(`https://api.telegram.org/bot${c.token}/getMe`).then(r=>r.json());
              if (me.ok) sr.name = me.result.username || me.result.first_name || '';
              // 设置私聊命令
              const cmds1 = [
                {command:"start",description:"开始验证 / Start"},
                {command:"help",description:"帮助 / Help"},
                {command:"reply",description:"引用回复对方消息 / Quote reply"},
                {command:"status",description:"状态 / Status"},
              ];
              await fetch(`https://api.telegram.org/bot${c.token}/setMyCommands`, {
                method:"POST", headers:{"Content-Type":"application/json"},
                body:JSON.stringify({commands:cmds1, scope:{type:"all_private_chats"}})
              });
              // 设置群组命令
              const cmds2 = [
                {command:"delall",description:"撤回该访客全部消息"},
                {command:"del",description:"撤回单条消息（回复使用）"},
                {command:"recall",description:"按用户ID撤回"},
                {command:"reply",description:"引用回复对方消息"},
                {command:"broadcast",description:"广播消息给所有访客"},
                {command:"help",description:"管理员帮助"},
              ];
              const r2 = await fetch(`https://api.telegram.org/bot${c.token}/setMyCommands`, {
                method:"POST", headers:{"Content-Type":"application/json"},
                body:JSON.stringify({commands:cmds2, scope:{type:"all_group_chats"}})
              });
              const d2 = await r2.json();
              sr.commandsOk = d2.ok === true;
            } catch(e) { sr.error = e.message; allOk = false; }
            setupResults.push(sr);
          }
          return new Response(renderStatusPage(setupResults, allOk), {
            headers: {"Content-Type":"text/html;charset=utf-8"},
          });
        }

        if (p === "/fmdebug") {
          try {
            await env.KV.put("b0:fm:test_debug", "hello", {expirationTtl: 300});
            const r = await env.KV.get("b0:fm:test_debug");
            return new Response(JSON.stringify({ok:true, wrote:"fm:test_debug", read:r}), {headers:{"Content-Type":"application/json"}});
          } catch(e) { return new Response(JSON.stringify({ok:false, error:e.message}), {headers:{"Content-Type":"application/json"}}); }
        }

        if (p === "/debug") {
          const info = { d1_bound: !!env.TG_O2O_DB, kv_bound: !!env.KV, num_configs: configs.length };
          if (env.TG_O2O_DB) {
            try {
              const r = await env.TG_O2O_DB.prepare("SELECT id, state, thread_id FROM users LIMIT 10").all();
              info.users = r.results;
            } catch(e) { info.d1_error = e.message; }
          }
          return new Response(JSON.stringify(info, null, 2), {headers:{"Content-Type":"application/json"}});
        }

        if (p.startsWith("/health")) {
          const key = url.searchParams.get('key') || '';
          // healthKey 校验（如果设了就要匹配）
          const hk = cfg.healthKey;
          if (hk && key !== hk) {
            return new Response(JSON.stringify({status: 'error', bot: `${configs.length} bots`, error: 'invalid key'}), {headers: {"Content-Type":"application/json"}});
          }
          const results = [];
          for (let i = 0; i < configs.length; i++) {
            const c = getCfg(configs, i, env.KV, env.TG_O2O_DB);
            try {
              const r = await fetch(`https://api.telegram.org/bot${c.token}/getMe`);
              const d = await r.json();
              let ownerStatus = 'unknown';
              try {
                const chat = await fetch(`https://api.telegram.org/bot${c.token}/getChat?chat_id=${c.ownerId}`);
                const chatD = await chat.json();
                ownerStatus = chatD.ok ? chatD.result.first_name || 'ok' : chatD.description;
              } catch(e) { ownerStatus = e.message; }
              let groupStatus = 'unknown';
              try {
                const chat = await fetch(`https://api.telegram.org/bot${c.token}/getChat?chat_id=${c.supergroupId}`);
                const chatD = await chat.json();
                groupStatus = chatD.ok ? 'ok' : chatD.description;
              } catch(e) { groupStatus = e.message; }
              results.push({
                bot: i + 1, name: d.ok ? d.result.username : d.description,
                owner: ownerStatus, group: groupStatus, tokenOk: d.ok,
              });
            } catch(e) {
              results.push({bot: i + 1, error: e.message});
            }
          }
          const allOk = results.every(r => r.tokenOk !== false && r.group === 'ok');
          return new Response(JSON.stringify({
            status: allOk ? 'ok' : 'error', bot: `${results.length} bots`,
            count: results.length, results,
          }), {headers: {"Content-Type":"application/json"}});
        }
      }

      // /activate — 激活 webhook（GET 和 POST 都支持）
      if (url.pathname.startsWith("/activate")) {
        let token;
        if (request.method === "POST") {
          try { const body = await request.json(); token = body.token; } catch(e) {}
        }
        if (!token) token = url.searchParams.get('token') || cfg.token;
        if (!token) return new Response(JSON.stringify({ok:false, description:"No token available"}), {headers:{"Content-Type":"application/json"}});
        const suffix = botSuffix(idx);
        let setUrl = `https://api.telegram.org/bot${token}/setWebhook?url=${url.origin}/webhook${suffix}`;
        if (cfg.webhookSecret) setUrl += `&secret_token=${encodeURIComponent(cfg.webhookSecret)}`;
        const r = await fetch(setUrl);
        // 设置命令菜单
        try {
          const cmds = [
            {command:"start",description:"开始验证 / Start verification"},
            {command:"help",description:"帮助 / Help"},
            {command:"status",description:"查看状态 / Check status"},
          ];
          await fetch(`https://api.telegram.org/bot${token}/setMyCommands`, {
            method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({commands:cmds})
          });
        } catch(e) { console.error("setMyCommands:", e.message); }
        return new Response(await r.text(), {headers:{"Content-Type":"application/json"}});
      }

      // POST → webhook
      if (request.method !== "POST") return new Response("Method not allowed", {status: 405});

      // 设置命令菜单（第一次触发时）
      ctx.waitUntil((async () => {
        try {
          // 访客私聊命令
          const privateCmds = [
            {command:"start",description:"开始验证 / Start"},
            {command:"help",description:"帮助 / Help"},
            {command:"reply",description:"引用回复对方消息 / Quote reply"},
            {command:"status",description:"状态 / Status"},
          ];
          await fetch(`https://api.telegram.org/bot${cfg.token}/setMyCommands`, {
            method:"POST", headers:{"Content-Type":"application/json"},
            body:JSON.stringify({commands:privateCmds, scope:{type:"all_private_chats"}})
          });
          // 群组管理员命令
          const groupCmds = [
            {command:"delall",description:"撤回该访客全部消息"},
            {command:"del",description:"撤回单条消息（回复使用）"},
            {command:"recall",description:"按用户ID撤回"},
            {command:"reply",description:"引用回复对方消息"},
            {command:"broadcast",description:"广播消息给所有访客"},
            {command:"help",description:"管理员帮助"},
          ];
          await fetch(`https://api.telegram.org/bot${cfg.token}/setMyCommands`, {
            method:"POST", headers:{"Content-Type":"application/json"},
            body:JSON.stringify({commands:groupCmds, scope:{type:"all_group_chats"}})
          });
        } catch(e) {}
      })());

      // Secret token 校验
      if (cfg.webhookSecret && request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== cfg.webhookSecret) {
        return new Response("Unauthorized", {status: 401});
      }

      const update = await request.json();

      // 限流
      const uid = update.message?.from?.id || update.callback_query?.from?.id || update.edited_message?.from?.id;
      if (uid) {
        const allowed = await checkRateLimit(cfg.kv, `${cfg.kvPrefix}${uid}`);
        if (!allowed) return new Response("ok");
      }

      // 编辑消息
      if (update.edited_message) {
        const msg = update.edited_message, euid = msg.from.id;
        if (String(euid) === String(cfg.ownerId) && msg.chat && String(msg.chat.id) === String(cfg.supergroupId) && msg.message_thread_id) {
          const target = await uidByThread(cfg, msg.message_thread_id);
          if (target) await sendMsg(cfg.token, target, msg);
        } else if (String(euid) !== String(cfg.ownerId)) {
          const user = await d1GetUser(cfg.d1, pid(cfg, euid));
          if (user?.thread_id) await sendMsg(cfg.token, cfg.supergroupId, msg, {message_thread_id: user.thread_id});
        }
        return new Response("ok");
      }

      // 话题关闭 → 自动撤回
      if (update.message?.forum_topic_closed && String(update.message.chat.id) === String(cfg.supergroupId) && update.message.message_thread_id) {
        const tid = update.message.message_thread_id;
        const uidRow = await d1First(cfg.d1, 'SELECT user_id FROM thread_map WHERE thread_id = ?', [tid]);
        if (uidRow) {
          const uidNum = uidRow.user_id.replace(/^b\d+:/, '');
          const msgs = await d1All(cfg.d1, 'SELECT msg_id FROM bot_msgs WHERE user_id = ?', [uidRow.user_id]);
          for (const row of msgs.results || []) {
            try { await tg(cfg.token, "deleteMessage", {chat_id: Number(uidNum), message_id: row.msg_id}); } catch(e) {}
          }
          await d1Run(cfg.d1, 'DELETE FROM bot_msgs WHERE user_id = ?', [uidRow.user_id]);
          await d1Run(cfg.d1, 'DELETE FROM msg_map WHERE user_id = ?', [uidRow.user_id]);
          await d1Run(cfg.d1, 'DELETE FROM thread_map WHERE thread_id = ?', [tid]);
          await d1UpsertUser(cfg.d1, uidRow.user_id, { thread_id: null });
        }
        return new Response("ok");
      }

      // 表情回应
      if (update.message_reaction) {
        const mr = update.message_reaction;
        if (String(mr.chat.id) === String(cfg.supergroupId) && mr.message_thread_id) {
          const target = await uidByThread(cfg, mr.message_thread_id);
          if (target) {
            const emoji = (mr.new_reaction||[]).map(r => r.emoji||"").filter(Boolean).join("");
            if (emoji) await tg(cfg.token, "sendMessage", {chat_id: target, text: `👍 主人回应：${emoji}`});
          }
        }
        return new Response("ok");
      }

      // Callback query
      if (update.callback_query) {
        const q = update.callback_query, cuid = q.from.id, data = q.data;

        if (data.startsWith("vt:") || data.startsWith("ve:")) {
          const parts = data.split(":"), type = parts[0], qid = parts[1], optIdx = parseInt(parts[2]);
          const vdata = await cfg.kv.get(k(cfg, `v:${qid}`), {type:"json"});
          if (!vdata || vdata.uid !== cuid) return new Response(JSON.stringify({method:"answerCallbackQuery",callback_query_id:q.id,text:"验证已过期，请重发 /start"}), {headers:{"Content-Type":"application/json"}});
          const state = await cfg.kv.get(k(cfg, `verify:${cuid}`), {type:"json"});
          if (!state) return new Response(JSON.stringify({method:"answerCallbackQuery",callback_query_id:q.id,text:"验证已过期"}), {headers:{"Content-Type":"application/json"}});
          const editMid = q.message?.message_id;
          const selected = vdata.opts[optIdx];

          if (selected === vdata.answer) {
            // 正确
            if (editMid) {
              await tg(cfg.token, 'editMessageText', {
                chat_id: cuid, message_id: editMid, text: '✅ 验证通过！欢迎加入。\nVerification passed! Welcome.',
              });
            }
            await cfg.kv.delete(k(cfg, `verify:${cuid}`));
            await cfg.kv.delete(k(cfg, `v:${qid}`));
            await d1UpsertUser(cfg.d1, pid(cfg, cuid), { state: 'verified', distrusted: 0 });
            const topic = await getTopic(cfg, cuid, q.from);
            await tg(cfg.token, 'sendMessage', {
              chat_id: cfg.supergroupId, message_thread_id: topic.thread_id,
              text: `✅ 访客 ${escapeHtml(q.from.first_name||'未知')} (${cuid}) 验证通过`,
            });
            await syncProfileCard(cfg, cuid, q.from, 'verified').catch(e=>console.error("card:",e.message));
            return new Response(JSON.stringify({method:"answerCallbackQuery",callback_query_id:q.id,text:"✅ 验证通过！"}), {headers:{"Content-Type":"application/json"}});
          }

          if (type === "vt") {
            // 第一题答错 → emoji 题
            const c = genEmojiQ(); const qid2 = shortId();
            await cfg.kv.put(k(cfg, `v:${qid2}`), JSON.stringify({answer:c.answer,opts:c.options,uid:cuid}), {expirationTtl:300});
            const buttons = c.options.map((o,i) => ({text:o, callback_data:`ve:${qid2}:${i}`}));
            if (editMid) {
              await tg(cfg.token, 'editMessageText', {
                chat_id: cuid, message_id: editMid, text: `❌ 答错了 / Wrong, one more:\n\n${c.question}`,
                reply_markup: {inline_keyboard: [buttons]},
              });
            } else {
              // 编辑失败时兜底发新消息
              await tg(cfg.token, 'sendMessage', {
                chat_id: cuid, text: `❌ 答错了 / Wrong, one more:\n\n${c.question}`,
                reply_markup: {inline_keyboard: [buttons]},
              });
            }
            await cfg.kv.put(k(cfg, `verify:${cuid}`), JSON.stringify({stage:"emoji",qid:qid2,warned:false,qids:[editMid||0]}), {expirationTtl:300});
            return new Response(JSON.stringify({method:"answerCallbackQuery",callback_query_id:q.id}), {headers:{"Content-Type":"application/json"}});
          }

          // ve: 第二题答错 → 封禁
          const banExpiry = Math.floor(Date.now() / 1000) + 604800;
          await d1UpsertUser(cfg.d1, pid(cfg, cuid), { state: 'banned', ban_until: banExpiry });
          await cfg.kv.delete(k(cfg, `verify:${cuid}`));
          await cfg.kv.delete(k(cfg, `v:${qid}`));
          if (editMid) {
            await tg(cfg.token, 'editMessageText', {
              chat_id: cuid, message_id: editMid, text: `🚫 验证失败 / Verification failed\n你已被关小黑屋，${msToTime(604800000)}后自动解除。\nBanned for ${msToTime(604800000)}.`,
            });
          }
          await syncProfileCard(cfg, cuid, q.from, 'banned').catch(e=>console.error("card:",e.message));
          return new Response(JSON.stringify({method:"answerCallbackQuery",callback_query_id:q.id,text:"🚫 已被封禁",show_alert:true}), {headers:{"Content-Type":"application/json"}});
        }

        // 资料卡按钮操作
        const [action, targetUid] = data.split(':');
        if (['ban','unban','trust','untrust','refresh','rebuild_topic'].includes(action) && targetUid) {
          const prefixedTarget = pid(cfg, targetUid);
          if (action === 'ban') {
            await d1UpsertUser(cfg.d1, prefixedTarget, { state: 'banned', ban_until: Math.floor(Date.now()/1000) + 604800 });
          } else if (action === 'unban') {
            await d1UpsertUser(cfg.d1, prefixedTarget, { state: 'new', ban_until: 0, trusted: 0 });
          } else if (action === 'trust') {
            await d1UpsertUser(cfg.d1, prefixedTarget, { state: 'trusted', trusted: 1 });
          } else if (action === 'untrust') {
            await d1UpsertUser(cfg.d1, prefixedTarget, { trusted: 0, state: 'verified' });
          } else if (action === 'refresh') {
            const chatInfo = await tg(cfg.token, 'getChat', {chat_id: Number(targetUid)});
            if (!chatInfo.ok) {
              return new Response(JSON.stringify({method:"answerCallbackQuery",callback_query_id:q.id,text:"❌ 无法获取用户信息"}), {headers:{"Content-Type":"application/json"}});
            }
            const r = chatInfo.result;
            const freshFrom = {id:Number(targetUid), first_name:r.first_name||'', last_name:r.last_name||'', username:r.username||''};
            await saveNameChange(cfg, targetUid, freshFrom);
            const user = await d1GetUser(cfg.d1, prefixedTarget);
            if (user?.thread_id) {
              try { await tg(cfg.token, "editForumTopic", {chat_id:cfg.supergroupId, message_thread_id:user.thread_id, name:user.title?.substring(0,128)}); } catch(e) {}
            }
          } else if (action === 'rebuild_topic') {
            const user = await d1GetUser(cfg.d1, prefixedTarget);
            if (!user) return new Response(JSON.stringify({method:"answerCallbackQuery",callback_query_id:q.id,text:"❌ 访客不存在"}), {headers:{"Content-Type":"application/json"}});
            if (user.thread_id) {
              await d1UpsertUser(cfg.d1, prefixedTarget, { thread_id: null });
              await d1Run(cfg.d1, 'DELETE FROM thread_map WHERE thread_id = ?', [user.thread_id]).catch(e=>{});
            }
            const fakeFrom = {id:Number(targetUid), first_name: user.first_name||'用户', last_name: user.last_name||'', username: user.username};
            const topic = await getTopic(cfg, targetUid, fakeFrom);
            await tg(cfg.token, 'sendMessage', {
              chat_id: cfg.supergroupId, message_thread_id: topic.thread_id,
              text: `🆕 话题已重建`,
            });
          }

          const user = await d1GetUser(cfg.d1, prefixedTarget);
          const isBanned = user?.state === 'banned';
          const isTrusted = !!user?.trusted;
          const isDistrusted = !!user?.distrusted;
          let banExpireStr = '';
          if (isBanned && user?.ban_until) {
            const d = new Date(user.ban_until * 1000);
            banExpireStr = `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
          }
          const fakeFrom = user ? {id:Number(targetUid), first_name: user.first_name || (user.title||'').split(' [')[0]||'用户', last_name: user.last_name||'', username:user.username} : {id:Number(targetUid), first_name:'用户'};
          const nameHistory = user?.nameHistory || [];
          const st = isBanned ? 'banned' : isTrusted ? 'trusted' : 'normal';
          const text = profileCardText(targetUid, fakeFrom, isDistrusted ? 'distrusted' : st, nameHistory, banExpireStr);
          const btns = profileCardButtons(targetUid, isBanned, isTrusted);
          await tg(cfg.token, 'editMessageText', {
            chat_id: q.message.chat.id, message_id: q.message.message_id,
            text, reply_markup: btns, parse_mode: 'HTML',
          });
          await d1UpsertUser(cfg.d1, prefixedTarget, { card_cid: q.message.chat.id, card_mid: q.message.message_id });
          const labels = {ban:'🚫 已封禁',unban:'✅ 已解封',trust:'🌟 已信任',untrust:'❌ 已取消信任',refresh:'✅ 资料已刷新',rebuild_topic:'🆕 已重建'};
          return new Response(JSON.stringify({method:"answerCallbackQuery",callback_query_id:q.id,text:labels[action]||'✅'}), {headers:{"Content-Type":"application/json"}});
        }
        return new Response("ok");
      }

      // 消息处理
      if (update.message) {
        const msg = update.message, muid = msg.from.id, text = (msg.text||"").trim();

        // 管理员在超级群组发消息 → 回复访客
        if (msg.chat && String(msg.chat.id) === String(cfg.supergroupId) && msg.message_thread_id) {
          const target = await uidByThread(cfg, msg.message_thread_id) || (async ()=>{
            // 兜底：从 users 表直接查 thread_id
            const row = await d1First(cfg.d1, 'SELECT id FROM users WHERE thread_id = ?', [msg.message_thread_id]);
            if (!row) return null;
            // 同步写入 thread_map
            await d1Run(cfg.d1, 'INSERT OR REPLACE INTO thread_map (thread_id, user_id) VALUES (?,?)', [msg.message_thread_id, row.id]).catch(e=>{});
            return Number(row.id.replace(/^b\d+:/,''));
          })();
          if (!target) return new Response("ok");
          if (text.startsWith("/")) {
            await handleAdmin(cfg, ctx, target, msg, text);
            return new Response("ok");
          }
          const user = await d1GetUser(cfg.d1, pid(cfg, target));
          if (user?.closed) {
            await tg(cfg.token, "sendMessage", {chat_id:cfg.supergroupId, message_thread_id:msg.message_thread_id, text:"⚠️ 对话已关闭，请先 /open"});
            return new Response("ok");
          }
          await replyToVisitor(cfg, ctx, target, msg);
          if (msg.reply_to_message) {
            const origMsgId = msg.reply_to_message.message_id;
            const visitorUid = await uidByMsg(cfg, Number(cfg.supergroupId), origMsgId);
            if (visitorUid) {
              await cfg.kv.put(k(cfg, `mr:${visitorUid}:${msg.message_id}`), origMsgId, {expirationTtl:86400});
            }
          }
          return new Response("ok");
        }

        // 管理员私聊 → 忽略
        if (String(muid) === String(cfg.ownerId)) return new Response("ok");

        // 加载用户数据
        const userRow = await d1GetUser(cfg.d1, pid(cfg, muid));

        // /help 和 /status 优先处理（任何状态）
        if (text === "/help") {
          const helpText = `🤖 访客命令 / Visitor Commands

/start - 开始验证 / Start verification
/reply <内容> - 引用回复对方消息 / Quote reply
/help - 显示此帮助 / Show this help
/status - 查看状态 / Check status

💡 发送消息即可联系管理员
Send a message to contact the admin`;
          await tg(cfg.token, "sendMessage", {chat_id:muid, text:helpText});
          return new Response("ok");
        }
        if (text === "/status") {
          let status = userRow?.state === 'banned' ? '🚫 已封禁 / Banned' :
                       userRow?.trusted ? '🌟 信任用户 / Trusted' :
                       userRow?.state === 'new' ? '⏳ 未验证 / Unverified' :
                       userRow?.state === 'verified' ? '✅ 已验证 / Verified' : '❓ 未知 / Unknown';
          await tg(cfg.token, "sendMessage", {chat_id:muid, text:status});
          return new Response("ok");
        }

        // 访客 /reply：引用回复管理员消息
        if (text.startsWith("/reply ")) {
          const replyTo = msg.reply_to_message;
          if (!replyTo) {
            await tg(cfg.token, "sendMessage", {chat_id:muid, text:"请回复一条消息使用 /reply\nReply to a message with /reply"});
            return new Response("ok");
          }
          const replyContent = text.slice(7).trim();
          if (!replyContent) {
            await tg(cfg.token, "sendMessage", {chat_id:muid, text:"用法：回复消息并输入 /reply <内容>"});
            return new Response("ok");
          }
          // 查对应的话题端消息ID
          let groupMsgId;
          const delRow = await d1First(cfg.d1, 'SELECT group_msg_id FROM msg_del WHERE group_id = ? AND visitor_msg_id = ?', [Number(cfg.supergroupId), replyTo.message_id]);
          if (delRow) {
            groupMsgId = delRow.group_msg_id;
          }
          const topic = await getTopic(cfg, muid, msg.from);
          const sent = await tg(cfg.token, "sendMessage", {
            chat_id: cfg.supergroupId, message_thread_id: topic.thread_id, text: replyContent,
            ...(groupMsgId ? {reply_to_message_id: groupMsgId} : {}),
          });
          if (sent?.ok && sent?.result?.message_id) {
            await d1Run(cfg.d1, 'INSERT OR REPLACE INTO msg_map (group_id, msg_id, user_id) VALUES (?,?,?)', [Number(cfg.supergroupId), sent.result.message_id, pid(cfg, muid)]);
            // msg_del + KV 反向映射（方便管理员引用回复）
            try { await d1Run(cfg.d1, 'INSERT OR REPLACE INTO msg_del (group_id, group_msg_id, visitor_msg_id) VALUES (?,?,?)', [Number(cfg.supergroupId), sent.result.message_id, msg.message_id||0]); } catch(e) {}
          }
          return new Response("ok");
        }

        // 封禁检查
        if (userRow?.state === 'banned') {
          if (userRow.ban_until && userRow.ban_until < Math.floor(Date.now()/1000)) {
            // 已过期
            await d1UpsertUser(cfg.d1, pid(cfg, muid), { state: 'new', ban_until: 0 });
          } else {
            return new Response("ok");
          }
        }

        // 信任用户
        if (userRow?.trusted) {
          if (text === "/start") {
            await tg(cfg.token, "sendMessage", {chat_id:muid, text:"🌟 你是信任用户，无需验证，直接发消息即可。\nTrusted user, no verification needed."});
            return new Response("ok");
          }
          await forwardToTopic(cfg, ctx, muid, msg.from, msg);
          return new Response("ok");
        }

        // 失信 → 重验证
        if (userRow?.distrusted && text === "/start") {
          await d1UpsertUser(cfg.d1, pid(cfg, muid), { distrusted: 0 });
          await sendTextVerify(cfg, ctx, muid, msg.from);
          return new Response("ok");
        }

        // 已验证
        if (userRow?.state === 'verified') {
          if (text === "/start") {
            await tg(cfg.token, "sendMessage", {chat_id:muid, text:"✅ 你已通过验证，直接发消息即可。\nVerified, you can send messages now."});
            return new Response("ok");
          }
          const blocked = await isBlocked(cfg.token, muid);
          if (blocked) {
            // 访客拉黑了 bot
            if (!userRow.trusted) {
              await d1UpsertUser(cfg.d1, pid(cfg, muid), { state: 'new', distrusted: 1 });
              const topic = await getTopic(cfg, muid, msg.from);
              await tg(cfg.token, "sendMessage", {
                chat_id: cfg.supergroupId, message_thread_id: topic.thread_id,
                text: "⚠️ 访客已拉黑机器人，会话中断。已标记为失信。"
              });
              await syncProfileCard(cfg, muid, msg.from, 'distrusted').catch(e=>console.error("card:",e.message));
            }
            await tg(cfg.token, "sendMessage", {chat_id:muid, text:"⚠️ 请先取消拉黑再发送消息。\nPlease unblock the bot first."});
            return new Response("ok");
          }
          await forwardToTopic(cfg, ctx, muid, msg.from, msg);
          return new Response("ok");
        }

        // /start
        if (text.startsWith("/")) {
          if (text === "/start") {
            const vs = await cfg.kv.get(k(cfg, `verify:${muid}`), {type:"json"});
            if (vs) {
              const r = await tg(cfg.token, "sendMessage", {chat_id:muid, text:"⏳ 验证进行中，请回答上方的问题。\nVerification in progress, please answer above."});
              if (r?.ok && r?.result) scheduleDelete(ctx, cfg.token, muid, r.result.message_id);
            } else {
              await sendTextVerify(cfg, ctx, muid, msg.from);
            }
          }
          return new Response("ok");
        }

        // 验证中乱发消息
        const vs = await cfg.kv.get(k(cfg, `verify:${muid}`), {type:"json"});
        if (vs) {
          if (vs.warned) {
            // 第二次乱发 → 封禁
            await d1UpsertUser(cfg.d1, pid(cfg, muid), {
              state: 'banned', ban_until: Math.floor(Date.now()/1000) + 3600
            });
            await cfg.kv.delete(k(cfg, `verify:${muid}`));
            const banMid = vs.qids?.[0];
            if (banMid) {
              await tg(cfg.token, 'editMessageText', {
                chat_id: muid, message_id: banMid, text: '🚫 无视警告，你已被封禁1小时。\nBanned for 1 hour.',
              });
            }
            await syncProfileCard(cfg, muid, msg.from, 'banned').catch(e=>console.error("card:",e.message));
          } else {
            vs.warned = true;
            await cfg.kv.put(k(cfg, `verify:${muid}`), JSON.stringify(vs), {expirationTtl:300});
            const r = await tg(cfg.token, "sendMessage", {chat_id:muid, text:"⚠️ 请认真答题 / Please answer properly\n再次乱发消息将被封禁。\nFurther spam will result in a ban."});
            if (r?.ok && r?.result) scheduleDelete(ctx, cfg.token, muid, r.result.message_id);
          }
          return new Response("ok");
        }

        // 新用户 → 发验证
        await sendTextVerify(cfg, ctx, muid, msg.from);
      }

      return new Response("ok");
    } catch (e) {
      console.error("Unhandled error:", e);
      return new Response("ok");
    }
  }
};
