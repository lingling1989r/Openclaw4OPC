const fs = require('fs');
const path = require('path');
const PptxGen = require('pptxgenjs');

const OUTPUT_PPTX = path.join('assets', 'ppt', '龙虾框架分享-科技风-金句精简版.pptx');

// ── Theme ──
const T = {
  bg: '0B1220', panel: '0F172A', text: 'E5E7EB', muted: '94A3B8', grid: '1F2A44',
  cyan: '22D3EE', purple: 'A78BFA', orange: 'FB923C', green: '34D399',
  red: 'F87171', blue: '60A5FA', yellow: 'FBBF24',
};
const FONT = { title: 'Calibri', body: 'Calibri' };
const W = 10, H = 5.625, M = 0.62;

// ── Helpers (each returns fresh objects to avoid PptxGenJS mutation issues) ──
function addBg(pptx, s) {
  s.background = { color: T.bg };
  for (let x = 0.3; x < W; x += 1.2)
    s.addShape(pptx.ShapeType.line, { x, y: 0, w: 0, h: H, line: { color: T.grid, width: 0.25, transparency: 75 } });
  for (let y = 0.35; y < H; y += 1.0)
    s.addShape(pptx.ShapeType.line, { x: 0, y, w: W, h: 0, line: { color: T.grid, width: 0.25, transparency: 75 } });
}
function topBar(pptx, s, accent) {
  s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: W, h: 0.1, fill: { color: accent }, line: { color: accent } });
}
function chTag(s, num, accent) {
  s.addShape('rect', { x: M, y: 0.35, w: 1.1, h: 0.42, fill: { color: accent } });
  s.addText(num, { x: M, y: 0.35, w: 1.1, h: 0.42, fontFace: FONT.title, fontSize: 14, bold: true, color: T.bg, align: 'center', valign: 'middle', margin: 0 });
}
function sTitle(s, t) {
  s.addText(t, { x: M + 1.3, y: 0.3, w: W - M - 1.3 - M, h: 0.55, fontFace: FONT.title, fontSize: 26, bold: true, color: T.text, margin: 0 });
}
function quote(pptx, s, q, accent, y) {
  y = y || 1.2;
  s.addShape(pptx.ShapeType.rect, { x: M + 0.1, y, w: 0.07, h: 0.85, fill: { color: accent } });
  s.addText(`"${q}"`, { x: M + 0.45, y, w: W - 2 * M - 0.7, h: 0.85, fontFace: FONT.body, fontSize: 20, italic: true, color: accent, valign: 'middle', margin: 0 });
}
function pts(s, items, y) {
  y = y || 2.4;
  const runs = items.map((p, i) => ({ text: p, options: { bullet: { code: '25CF' }, color: T.text, breakLine: i < items.length - 1 } }));
  s.addText(runs, { x: M + 0.3, y, w: W - 2 * M - 0.6, h: H - y - 0.6, fontFace: FONT.body, fontSize: 15, color: T.text, valign: 'top', margin: 0, paraSpaceAfter: 8 });
}
function ftr(s, t) {
  s.addText(t, { x: M, y: H - 0.35, w: W - 2 * M, h: 0.25, fontFace: FONT.body, fontSize: 10, color: T.muted, margin: 0 });
}

// ── Build ──
const pptx = new PptxGen();
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'OpenClaw';
pptx.title = '龙虾框架分享（金句精简版）';

// S1: Cover
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.cyan);
  s.addText('龙虾框架分享', { x: M, y: 1.2, w: W - 2 * M, h: 1.0, fontFace: FONT.title, fontSize: 44, bold: true, color: T.text, margin: 0 });
  s.addText('从基础应用到商业变现', { x: M, y: 2.2, w: W - 2 * M, h: 0.5, fontFace: FONT.body, fontSize: 20, color: T.muted, margin: 0 });
  s.addText('"Create more, consume less."', { x: M, y: 3.2, w: W - 2 * M, h: 0.5, fontFace: FONT.body, fontSize: 18, italic: true, color: T.cyan, margin: 0 });
  ftr(s, 'OpenClaw / 龙虾框架大课  ·  +V: aoxueluoluo');
})();

// S2: 课程总览
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.purple);
  chTag(s, '总览', T.purple); sTitle(s, '课程架构：七大部分');
  const pp = [
    { n: '一', t: '学前须知', a: T.cyan }, { n: '二', t: '认知铺垫', a: T.purple },
    { n: '三', t: '学习准备', a: T.orange }, { n: '四', t: '核心能力养成', a: T.green },
    { n: '五', t: '商业变现路径', a: T.yellow }, { n: '六', t: '行业实战剧本', a: T.blue },
    { n: '七', t: '收尾与转化', a: T.red },
  ];
  const cW = (W - 2 * M - 0.4) / 2, cH = 0.52;
  pp.forEach((p, i) => {
    const x = M + (i % 2) * (cW + 0.4), y = 1.2 + Math.floor(i / 2) * (cH + 0.1);
    s.addShape('rect', { x, y, w: cW, h: cH, fill: { color: T.panel }, line: { color: p.a, width: 1.5 } });
    s.addText(`第${p.n}部分：${p.t}`, { x: x + 0.2, y, w: cW - 0.4, h: cH, fontFace: FONT.body, fontSize: 14, color: T.text, valign: 'middle', margin: 0 });
  });
  ftr(s, '每个部分 = 一个阶段目标');
})();

// S3: Ch.00 学前须知
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.cyan);
  chTag(s, 'Ch.00', T.cyan); sTitle(s, '学前须知');
  quote(pptx, s, '先把输入模板写死，再谈自动化。', T.cyan);
  pts(s, [
    'ToC：用自动化省时间、稳定产出',
    '自媒体：选题→创作→配图→发布 做成流水线',
    'ToB：把AI接进飞书/文档/表格，可控效率系统',
    '每章 1个演示任务 + 1个学员作业',
  ]);
  ftr(s, '学前须知 · 课程定位与适合人群');
})();

// S4: Ch.01 龙虾是什么
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.purple);
  chTag(s, 'Ch.01', T.purple); sTitle(s, '龙虾是什么？');
  quote(pptx, s, '工具适应你，而不是你适应工具。', T.purple);
  pts(s, [
    '框架四件套：Channel → Gateway → Skills → Workspace',
    'Channel = 最后一公里，让你"用嘴巴干活"',
    '豆包是咨询台，Claude Code是保姆，OpenClaw是管家',
    '24.8万 Stars，3个月全球前20',
  ]);
  ftr(s, '第一章 · 认知跃迁');
})();

// S5: Ch.01 傅盛案例
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.purple);
  chTag(s, 'Ch.01', T.purple); sTitle(s, '傅盛案例：明线与暗线');
  quote(pptx, s, '每一个大佬都会给自己的产品夹带私货。', T.purple);
  pts(s, [
    '明线：8个AI员工 · 48小时139技能 · 50块成本',
    '暗线：讲故事 > 讲功能 · 现场演示 > 列参数',
    '初中生都能用 → 降低心理障碍',
    '引导加群 → 私域沉淀 → 续费率才是关键',
  ]);
  ftr(s, '第一章 · 案例拆解');
})();

// S6: Ch.01 认知框架
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.orange);
  chTag(s, 'Ch.01', T.orange); sTitle(s, '认知框架与边界');
  quote(pptx, s, '不做什么，比做什么更重要。', T.orange);
  pts(s, [
    '别人没跑过的领域，先让子弹飞一会儿',
    '理论可行 ≠ 实际能做；有人做过 ≠ 你能做',
    '盘需求，赢了一大半',
    '你吃不了前面的苦，就得吃后面的苦',
  ]);
  ftr(s, '第一章 · 认知与边界');
})();

// S7: Ch.01 四步走
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.green);
  chTag(s, 'Ch.01', T.green); sTitle(s, '四步走计划');
  quote(pptx, s, '工具怎么用，比工具本身更重要。', T.green);
  const steps = [
    { n: '01', t: '看案例', d: 'AI理论边界 vs 实际边界' },
    { n: '02', t: '盘需求', d: '填需求表，明确要什么' },
    { n: '03', t: '跑通案例', d: '每天一个Skill' },
    { n: '04', t: '一人公司', d: '多Agent规模化' },
  ];
  const sW = (W - 2 * M - 0.6) / 4;
  steps.forEach((st, i) => {
    const x = M + i * (sW + 0.2), y = 2.5;
    s.addShape('rect', { x, y, w: sW, h: 1.6, fill: { color: T.panel }, line: { color: T.green, width: 1 } });
    s.addText(st.n, { x, y: y + 0.12, w: sW, h: 0.4, fontFace: FONT.title, fontSize: 20, bold: true, color: T.green, align: 'center', margin: 0 });
    s.addText(st.t, { x, y: y + 0.5, w: sW, h: 0.35, fontFace: FONT.body, fontSize: 16, bold: true, color: T.text, align: 'center', margin: 0 });
    s.addText(st.d, { x: x + 0.08, y: y + 0.9, w: sW - 0.16, h: 0.55, fontFace: FONT.body, fontSize: 11, color: T.muted, align: 'center', margin: 0 });
  });
  ftr(s, '第一章 · 行动指引');
})();

// S8: Ch.02 龙虾能干什么
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.cyan);
  chTag(s, 'Ch.02', T.cyan); sTitle(s, '龙虾能干什么？');
  quote(pptx, s, '不要演示功能，要演示交付结果。', T.cyan);
  const layers = [
    { n: '① 单点技能', d: '1分钟：搜索 / 转写 / 生成', a: T.cyan },
    { n: '② 小工作流', d: '3分钟：输入→处理→输出', a: T.purple },
    { n: '③ 端到端交付', d: '5分钟：真实任务从需求到交付', a: T.orange },
  ];
  layers.forEach((l, i) => {
    const y = 2.4 + i * 0.9;
    s.addShape('rect', { x: M + 0.1, y, w: 0.06, h: 0.65, fill: { color: l.a } });
    s.addText(l.n, { x: M + 0.45, y, w: 3.5, h: 0.35, fontFace: FONT.body, fontSize: 16, bold: true, color: l.a, margin: 0 });
    s.addText(l.d, { x: M + 0.45, y: y + 0.32, w: W - 2 * M - 1, h: 0.3, fontFace: FONT.body, fontSize: 14, color: T.text, margin: 0 });
  });
  ftr(s, '第二章 · 三层展示结构');
})();

// S9: Ch.02 Skill系统
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.cyan);
  chTag(s, 'Ch.02', T.cyan); sTitle(s, 'Skill = AI的岗前培训');
  quote(pptx, s, '没有培训的新员工 = 没有Skill的AI。', T.cyan);
  pts(s, [
    'Skill = 可版本化、可安装、可分发的标准件',
    'ClawHub = AI时代的App Store',
    '省钱：培训一次，终身可用',
    '标准：像SOP一样稳定输出',
  ]);
  ftr(s, '第二章 · Skill系统');
})();

// S10: Ch.03 需求梳理
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.orange);
  chTag(s, 'Ch.03', T.orange); sTitle(s, '需求梳理');
  quote(pptx, s, '梳理完需求后去找团队，报价都能砍半价。', T.orange);
  pts(s, [
    '先盘宏观（行业需求），再盘微观（个人工作流）',
    '不变的是行业需求，变的是产品形态',
    '你的岗位价值 vs 你的差异化价值',
    '"Create more, consume less" — 人人都是creator',
  ]);
  ftr(s, '第三章 · 从需求出发');
})();

// S11: Ch.04 AI员工模式
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.green);
  chTag(s, 'Ch.04', T.green); sTitle(s, 'AI是员工，不是外包');
  quote(pptx, s, 'AI是长期协作的数字员工，不是一次性外包。', T.green);
  pts(s, [
    '大SOP（人机协作）：什么时候人做？什么时候机器做？',
    '小SOP（机器内部）：只约定输入+输出，中间AI自己处理',
    '适合：重复性工作 · 信息整理 · 内容生成 · 数据分析',
    '不适合：核心决策 · 情感沟通 · 需要信任关系的合作',
  ]);
  ftr(s, '第四章 · 员工模式');
})();

// S12: Ch.04 双S SOP
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.green);
  chTag(s, 'Ch.04', T.green); sTitle(s, '双S SOP理论');
  quote(pptx, s, '中间流程哪怕给不到都没关系，AI会自己处理。', T.green);
  const cW = (W - 2 * M - 0.5) / 2, cY = 2.5;
  s.addShape('rect', { x: M, y: cY, w: cW, h: 2.0, fill: { color: T.panel }, line: { color: T.green, width: 1 } });
  s.addText('大SOP · 人机协作', { x: M + 0.2, y: cY + 0.1, w: cW - 0.4, h: 0.4, fontFace: FONT.body, fontSize: 15, bold: true, color: T.green, margin: 0 });
  s.addText('机器抓取→人审核→机器分发→人处理反馈', { x: M + 0.2, y: cY + 0.6, w: cW - 0.4, h: 1.2, fontFace: FONT.body, fontSize: 13, color: T.text, margin: 0 });
  const x2 = M + cW + 0.5;
  s.addShape('rect', { x: x2, y: cY, w: cW, h: 2.0, fill: { color: T.panel }, line: { color: T.orange, width: 1 } });
  s.addText('小SOP · 机器内部', { x: x2 + 0.2, y: cY + 0.1, w: cW - 0.4, h: 0.4, fontFace: FONT.body, fontSize: 15, bold: true, color: T.orange, margin: 0 });
  s.addText('输入：需要什么材料？\n输出：期望产出什么？\n验证：跑通+可用', { x: x2 + 0.2, y: cY + 0.6, w: cW - 0.4, h: 1.2, fontFace: FONT.body, fontSize: 13, color: T.text, margin: 0 });
  ftr(s, '第四章 · SOP设计');
})();

// S13: Ch.05 超级个体到一人公司
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.blue);
  chTag(s, 'Ch.05', T.blue); sTitle(s, '从超级个体到一人公司');
  quote(pptx, s, '多Agent的隔离，是组织成立的前提。', T.blue);
  pts(s, [
    '一个Agent = 独立workspace + 独立state + 独立sessions',
    '三套组织模板：按业务线 / 按能力栈 / 混合型',
    '外包→员工→组织，从临时需求到长期可管理',
    '养龙虾路线图：稳定复现→组合技能→交付结果→规模化',
  ]);
  ftr(s, '第五章 · 组织变革');
})();

// S14: Ch.06 Skill怎么挣钱
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.yellow);
  chTag(s, 'Ch.06', T.yellow); sTitle(s, 'Skill 怎么挣钱？');
  quote(pptx, s, 'Skill天然可版本化/分发/复用 — 标准件就具备商品化基础。', T.yellow);
  pts(s, [
    '6种变现：代练 / 技能包 / 订阅 / 交付外包 / 训练营 / SaaS化',
    '先赚时间窗口的钱，再赚长期的钱',
    '从"代练"到"产品化"：手动→标准化→可复制',
    '用户愿意为"节省的时间"买单',
  ]);
  ftr(s, '第六章 · 商业变现');
})();

// S15: Ch.07 SaaS突围
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.cyan);
  chTag(s, 'Ch.07', T.cyan); sTitle(s, 'SaaS 如何与龙虾结合？');
  quote(pptx, s, 'Channel是破局点 — 先借势已有渠道，再做自己的入口。', T.cyan);
  pts(s, [
    '5种结合（从轻到重）：Skill接入→工作流中间站→多渠道前台→自动化执行器→一体化',
    'Gateway = 可编排的控制平面',
    '用户在聊天里更高频触达 = 留存放大器',
  ]);
  ftr(s, '第七章 · SaaS突围');
})();

// S16: Ch.08 企业落地
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.red);
  chTag(s, 'Ch.08', T.red); sTitle(s, '企业为什么要更早抓紧龙虾？');
  quote(pptx, s, '一个入口+一个场景+一个指标 = 企业第一波AI胜利。', T.red);
  pts(s, [
    '本质：先抢"入口"和"流程主导权"',
    '最小闭环2周做出来：选入口→选场景→看指标',
    '安全边界：默认安全 + security audit',
    '多Agent = 多岗位：SalesOps / SupportOps / GrowthOps',
  ]);
  ftr(s, '第八章 · 企业落地');
})();

// S17: Ch.09 SaaS实战
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.blue);
  chTag(s, 'Ch.09', T.blue); sTitle(s, 'SaaS 企业实战剧本');
  quote(pptx, s, '别用空话，用指标。', T.blue);
  pts(s, [
    '剧本A：线索分拣+跟进提醒（SalesOps）',
    '剧本B：客服工单分流-草拟-总结（SupportOps）',
    '剧本C：运营日报/周报自动化（GrowthOps）',
    '指标：首响时间 · 线索分拣耗时 · 工单总结覆盖率',
  ]);
  ftr(s, '第九章 · SaaS实战');
})();

// S18: Ch.10 外贸电商
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.orange);
  chTag(s, 'Ch.10', T.orange); sTitle(s, '外贸电商：询盘到订单');
  quote(pptx, s, '晚2小时可能就丢单。', T.orange);
  pts(s, [
    '高价值环节：询盘响应速度 · 多语言沟通 · 报价跟进',
    '工作流：询盘结构化→报价草拟→跟进节奏',
    '关键指标：首响时间 · Quote TAT · Follow-up完成率',
    'Cron job设置24h/72h自动follow-up',
  ]);
  ftr(s, '第十章 · 外贸电商');
})();

// S19: Ch.11 独立站品牌
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.green);
  chTag(s, 'Ch.11', T.green); sTitle(s, '独立站品牌：一体化运营');
  quote(pptx, s, '独立站最适合用多Agent分工跑流水线。', T.green);
  pts(s, [
    '三大烧钱点：广告素材迭代 · 内容与SEO · 客服人力',
    '剧本A：广告素材与文案工厂（GrowthOps+CreativeOps）',
    '剧本B：客服知识库+回复宏（SupportOps）',
    '剧本C：周度复盘自动化（cron job固定生成）',
  ]);
  ftr(s, '第十一章 · 独立站品牌');
})();

// S20: Ch.12 MCN机构
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.purple);
  chTag(s, 'Ch.12', T.purple); sTitle(s, 'MCN机构：龙虾流水线');
  quote(pptx, s, 'MCN的瓶颈不是创意，是周转率。', T.purple);
  pts(s, [
    '一个MCN = 一个多Agent小团队',
    'Producer Agent → Script Agent → Editing Agent → Ops Agent',
    '选题→脚本→制作→分发，全链路自动化',
    '关键指标：内容周转率 · 爆款命中率 · 多平台覆盖',
  ]);
  ftr(s, '第十二章 · MCN实战');
})();

// S21: Ch.13 如何变现
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.yellow);
  chTag(s, 'Ch.13', T.yellow); sTitle(s, '如何变现？');
  quote(pptx, s, '变现从标准化开始：模板 / 陪跑 / 定制实施。', T.yellow);
  pts(s, [
    '三类用户画像：ToC个人 · 自媒体/自由职业 · ToB企业/SaaS',
    '定价锚点：省时间 / 提升质量 / 节省工程时间 / 新增入口',
    'Skill包售卖 → 订阅更新 → 陪跑服务 → 企业定制',
  ]);
  ftr(s, '第十三章 · 变现路径');
})();

// S22: 国内案例精选
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.cyan);
  chTag(s, '附录', T.cyan); sTitle(s, '国内案例精选');
  quote(pptx, s, '案例才是核心竞争力。', T.cyan);
  pts(s, [
    'ToC：麦当劳营养师+自动领券 · AI选股系统 · 云服务器+飞书直连',
    '自媒体：小红书全自动 — 热点→文案→封面→发布',
    'ToB：飞书云文档/权限/导出 — 把机器人变成文档操作员',
    '⚠️ 平台治理AI托管类账号，仅作技术分享',
  ]);
  ftr(s, '附录A · 国内检索案例库');
})();

// S23: Closing
(() => {
  const s = pptx.addSlide(); addBg(pptx, s); topBar(pptx, s, T.green);
  s.addText('先完成，再完美。', { x: M, y: 1.0, w: W - 2 * M, h: 1.2, fontFace: FONT.title, fontSize: 38, bold: true, italic: true, color: T.green, align: 'center', valign: 'middle', margin: 0 });
  s.addText('看案例 → 盘需求 → 找方向 → 建方案', { x: M, y: 2.5, w: W - 2 * M, h: 0.5, fontFace: FONT.body, fontSize: 20, color: T.text, align: 'center', margin: 0 });
  s.addText('加入我们，一起探索AI商业化', { x: M, y: 3.3, w: W - 2 * M, h: 0.4, fontFace: FONT.body, fontSize: 16, color: T.muted, align: 'center', margin: 0 });
  s.addText('+V: aoxueluoluo（备注：大龙虾）', { x: M, y: 4.0, w: W - 2 * M, h: 0.4, fontFace: FONT.body, fontSize: 18, bold: true, color: T.cyan, align: 'center', margin: 0 });
  ftr(s, 'OpenClaw / 龙虾框架大课');
})();

// ── Write ──
fs.mkdirSync(path.dirname(OUTPUT_PPTX), { recursive: true });
pptx.writeFile({ fileName: OUTPUT_PPTX })
  .then(() => console.log('Generated:', OUTPUT_PPTX, '| Slides:', pptx._slides.length))
  .catch(e => console.error(e));