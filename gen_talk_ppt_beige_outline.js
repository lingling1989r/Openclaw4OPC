const path = require('path');
const PptxGen = require('pptxgenjs');

const OUTPUT_PPTX = path.join('assets', 'ppt', '线下分享-傅盛龙虾3W-我用龙虾赚3W-米色风格-提纲版.pptx');

// LAYOUT_16x9 => 10" x 5.625"
const W = 10;
const H = 5.625;
const M = 0.7;

const theme = {
  bg: 'F6F1E7',       // cream
  card: 'FFFFFF',
  ink: '1F2937',
  muted: '6B7280',
  terracotta: 'B85042',
  sage: 'A7BEAE',
  navy: '2F3C7E',
  sand: 'E7E8D1',
};

const font = {
  title: 'PingFang SC',
  body: 'PingFang SC',
  fallbackTitle: 'Calibri',
  fallbackBody: 'Calibri',
};

function shadow() {
  return { type: 'outer', color: '000000', blur: 6, offset: 2, angle: 135, opacity: 0.12 };
}

function addBackground(slide) {
  slide.background = { color: theme.bg };

  // Minimal decorative corner blocks (avoid busy patterns)
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: 10,
    h: 0.12,
    fill: { color: theme.terracotta },
    line: { color: theme.terracotta },
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: H - 0.12,
    w: 10,
    h: 0.12,
    fill: { color: theme.sage },
    line: { color: theme.sage },
  });
}

function addHeader(slide, title, subtitle) {
  slide.addText(title, {
    x: M,
    y: 0.45,
    w: W - 2 * M,
    h: 0.55,
    fontFace: font.title,
    fontSize: 30,
    bold: true,
    color: theme.ink,
    margin: 0,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: M,
      y: 1.05,
      w: W - 2 * M,
      h: 0.35,
      fontFace: font.body,
      fontSize: 14,
      color: theme.muted,
      margin: 0,
    });
  }
}

function addFooter(slide, text) {
  slide.addText(text, {
    x: M,
    y: H - 0.45,
    w: W - 2 * M,
    h: 0.25,
    fontFace: font.body,
    fontSize: 10,
    color: theme.muted,
    margin: 0,
  });
}

function card(slide, x, y, w, h, accent) {
  slide.addShape(pres.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    fill: { color: theme.card },
    line: { color: accent || theme.sand, width: 1.5 },
    shadow: shadow(),
  });
}

function bulletRuns(lines) {
  return lines.map((t, idx) => ({
    text: t,
    options: { bullet: true, breakLine: idx !== lines.length - 1 },
  }));
}

function addBullets(slide, x, y, w, h, lines) {
  slide.addText(bulletRuns(lines), {
    x,
    y,
    w,
    h,
    fontFace: font.body,
    fontSize: 16,
    color: theme.ink,
    valign: 'top',
    margin: 0,
    paraSpaceAfter: 6,
  });
}

const pres = new PptxGen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'OpenClaw';
pres.title = '傅盛龙虾3W，我用龙虾赚3W（线下分享提纲）';

// Slide 1: Cover
{
  const s = pres.addSlide();
  addBackground(s);

  s.addShape(pres.ShapeType.roundRect, {
    x: M,
    y: 1.25,
    w: W - 2 * M,
    h: 2.55,
    fill: { color: theme.card },
    line: { color: theme.terracotta, width: 2 },
    shadow: shadow(),
  });

  s.addText('傅盛龙虾 3W，\n我用龙虾赚 3W', {
    x: M + 0.45,
    y: 1.45,
    w: W - 2 * M - 0.9,
    h: 1.35,
    fontFace: font.title,
    fontSize: 40,
    bold: true,
    color: theme.ink,
    margin: 0,
  });

  s.addText('宝妈利用龙虾实现移动办公及赚钱思路分享（提纲版）', {
    x: M + 0.45,
    y: 2.95,
    w: W - 2 * M - 0.9,
    h: 0.5,
    fontFace: font.body,
    fontSize: 16,
    color: theme.muted,
    margin: 0,
  });

  s.addShape(pres.ShapeType.rect, {
    x: M,
    y: 4.15,
    w: W - 2 * M,
    h: 0.9,
    fill: { color: theme.sand },
    line: { color: theme.sand },
  });
  s.addText('主讲：傲雪｜关键词：移动办公 · 交付 · 变现路径', {
    x: M + 0.35,
    y: 4.32,
    w: W - 2 * M - 0.7,
    h: 0.45,
    fontFace: font.body,
    fontSize: 14,
    color: theme.ink,
    margin: 0,
  });

  addFooter(s, 'OpenClaw / 龙虾');
}

// Slide 2: My situation
{
  const s = pres.addSlide();
  addBackground(s);
  addHeader(s, '01｜我是谁 & 我当时的处境', '从“失业宝妈”到“可移动办公的交付者”');

  card(s, M, 1.55, W - 2 * M, 3.3, theme.terracotta);

  s.addText('一句话：我失业在家，想缓解家庭经济压力。', {
    x: M + 0.4,
    y: 1.8,
    w: W - 2 * M - 0.8,
    h: 0.4,
    fontFace: font.body,
    fontSize: 18,
    color: theme.ink,
    margin: 0,
  });

  // stat cards
  const cx = M + 0.4;
  const cy = 2.4;
  const cw = (W - 2 * M - 0.8 - 0.4) / 2;
  const ch = 1.05;

  card(s, cx, cy, cw, ch, theme.sage);
  s.addText('50+ 万', {
    x: cx + 0.25,
    y: cy + 0.18,
    w: cw - 0.5,
    h: 0.45,
    fontFace: font.title,
    fontSize: 34,
    bold: true,
    color: theme.terracotta,
    margin: 0,
  });
  s.addText('外债讨不回来（烂账）', {
    x: cx + 0.25,
    y: cy + 0.65,
    w: cw - 0.5,
    h: 0.35,
    fontFace: font.body,
    fontSize: 14,
    color: theme.ink,
    margin: 0,
  });

  card(s, cx + cw + 0.4, cy, cw, ch, theme.sage);
  s.addText('三连击', {
    x: cx + cw + 0.65,
    y: cy + 0.18,
    w: cw - 0.5,
    h: 0.45,
    fontFace: font.title,
    fontSize: 28,
    bold: true,
    color: theme.navy,
    margin: 0,
  });
  s.addText('离职 / 被骗 / 低现金流', {
    x: cx + cw + 0.65,
    y: cy + 0.65,
    w: cw - 0.5,
    h: 0.35,
    fontFace: font.body,
    fontSize: 14,
    color: theme.ink,
    margin: 0,
  });

  s.addText('但结论很简单：伤心不解决问题，要找事做。', {
    x: M + 0.4,
    y: 3.7,
    w: W - 2 * M - 0.8,
    h: 0.4,
    fontFace: font.body,
    fontSize: 18,
    color: theme.ink,
    margin: 0,
  });

  addFooter(s, '目标：找到能“移动办公 + 可交付 + 可变现”的路径');
}

// Slide 3: Why mobile office
{
  const s = pres.addSlide();
  addBackground(s);
  addHeader(s, '02｜我为什么需要“移动办公”', '核心是安全感：带娃也能持续产出');

  card(s, M, 1.55, W - 2 * M, 3.3, theme.sage);

  addBullets(s, M + 0.55, 1.85, W - 2 * M - 1.1, 2.6, [
    '我喜欢当“数字游民”：常在外溜达，也带娃溜达',
    '我希望工作不绑定固定地点/固定电脑',
    '之前也想拉伙伴一起做，但大家都有自己的事，一直没成',
  ]);

  s.addShape(pres.ShapeType.rect, {
    x: M,
    y: 4.95,
    w: W - 2 * M,
    h: 0.55,
    fill: { color: theme.sand },
    line: { color: theme.sand },
  });
  s.addText('一句话需求：随时随地把“需求 → 交付物”跑出来。', {
    x: M + 0.35,
    y: 5.08,
    w: W - 2 * M - 0.7,
    h: 0.35,
    fontFace: font.body,
    fontSize: 16,
    bold: true,
    color: theme.ink,
    margin: 0,
  });
}

// Slide 4: Why OpenClaw (Channel last mile)
{
  const s = pres.addSlide();
  addBackground(s);
  addHeader(s, '03｜龙虾解决了什么关键问题？', 'Channel = 最后一公里：把“人”接到“执行”');

  card(s, M, 1.55, W - 2 * M, 3.3, theme.navy);

  s.addText('关键感受：Channel 解决了“最后一公里”的路线问题。', {
    x: M + 0.45,
    y: 1.8,
    w: W - 2 * M - 0.9,
    h: 0.45,
    fontFace: font.body,
    fontSize: 18,
    bold: true,
    color: theme.ink,
    margin: 0,
  });

  // simple flow diagram
  const y = 2.55;
  const boxH = 0.7;
  const gap = 0.3;
  const boxW = (W - 2 * M - 2 * gap) / 3;

  const boxes = [
    { t: '手机/IM\n（随时发需求）', a: theme.terracotta },
    { t: '龙虾/Agent\n（执行与调度）', a: theme.navy },
    { t: '交付物\n（文章/账号/流程）', a: theme.sage },
  ];

  boxes.forEach((b, i) => {
    const x = M + i * (boxW + gap);
    s.addShape(pres.ShapeType.roundRect, {
      x,
      y,
      w: boxW,
      h: boxH,
      fill: { color: theme.card },
      line: { color: b.a, width: 2 },
      shadow: shadow(),
    });
    s.addText(b.t, {
      x,
      y: y + 0.12,
      w: boxW,
      h: boxH - 0.2,
      fontFace: font.body,
      fontSize: 14,
      color: theme.ink,
      align: 'center',
      valign: 'middle',
      margin: 0,
    });
    if (i < 2) {
      s.addShape(pres.ShapeType.rightArrow, {
        x: x + boxW - 0.05,
        y: y + 0.22,
        w: gap + 0.1,
        h: 0.26,
        fill: { color: theme.muted, transparency: 35 },
        line: { color: theme.muted, transparency: 35 },
      });
    }
  });

  s.addText('我当时的想法：这不是“技术多难”，而是终于有人把路打通了。', {
    x: M + 0.45,
    y: 3.55,
    w: W - 2 * M - 0.9,
    h: 0.5,
    fontFace: font.body,
    fontSize: 16,
    color: theme.ink,
    margin: 0,
  });

  addFooter(s, '关键词：入口（Channel）→ 执行（Agent）→ 结果（交付物）');
}

// Slide 5: 1-week sprint achievements
{
  const s = pres.addSlide();
  addBackground(s);
  addHeader(s, '04｜我怎么“冰龙虾”的（1 周冲刺）', '每天干到凌晨两点：但跑出了端到端结果');

  card(s, M, 1.55, W - 2 * M, 3.3, theme.terracotta);

  s.addText('时间投入：一周（高强度）', {
    x: M + 0.45,
    y: 1.8,
    w: W - 2 * M - 0.9,
    h: 0.4,
    fontFace: font.body,
    fontSize: 16,
    color: theme.muted,
    margin: 0,
  });

  // checklist
  s.addText('这一周跑通的 3 个结果：', {
    x: M + 0.45,
    y: 2.25,
    w: W - 2 * M - 0.9,
    h: 0.35,
    fontFace: font.body,
    fontSize: 18,
    bold: true,
    color: theme.ink,
    margin: 0,
  });

  addBullets(s, M + 0.65, 2.65, W - 2 * M - 1.3, 1.9, [
    '自动发布公众号（从写到发）',
    '自动产出小红书内容（从写到配）',
    '开始像“管家”一样处理各种任务（能交付）',
  ]);

  s.addShape(pres.ShapeType.rect, {
    x: M,
    y: 4.95,
    w: W - 2 * M,
    h: 0.55,
    fill: { color: theme.sand },
    line: { color: theme.sand },
  });
  s.addText('关键词：别只玩功能，要跑“端到端交付”。', {
    x: M + 0.35,
    y: 5.08,
    w: W - 2 * M - 0.7,
    h: 0.35,
    fontFace: font.body,
    fontSize: 16,
    bold: true,
    color: theme.ink,
    margin: 0,
  });
}

// Slide 6: Monetization focus
{
  const s = pres.addSlide();
  addBackground(s);
  addHeader(s, '05｜今天的核心：怎么赚钱？', '赚钱也能练：关键是找到“龙虾的那个点”');

  card(s, M, 1.55, W - 2 * M, 3.3, theme.sage);

  s.addText('大家最关心的问题：怎么赚钱？', {
    x: M + 0.45,
    y: 1.85,
    w: W - 2 * M - 0.9,
    h: 0.4,
    fontFace: font.body,
    fontSize: 18,
    bold: true,
    color: theme.ink,
    margin: 0,
  });

  addBullets(s, M + 0.65, 2.35, W - 2 * M - 1.3, 1.6, [
    '赚钱不是玄学，是一种“找需求 + 做交付”的技能',
    '先找到龙虾在你业务里的“关键杠杆点”',
    '不讲背 Skill：今天只讲赚钱思路',
  ]);

  s.addShape(pres.ShapeType.roundRect, {
    x: M + 0.45,
    y: 4.2,
    w: W - 2 * M - 0.9,
    h: 0.6,
    fill: { color: theme.sand },
    line: { color: theme.sand },
  });
  s.addText('延伸：想学更细的训练方法，可关注 8848 Studio（后续可另开分享）。', {
    x: M + 0.65,
    y: 4.34,
    w: W - 2 * M - 1.3,
    h: 0.35,
    fontFace: font.body,
    fontSize: 13,
    color: theme.ink,
    margin: 0,
  });

  addFooter(s, '本场目标：把变现思路讲清楚');
}

// Slide 7: Mindset (borrow trend + find demand)
{
  const s = pres.addSlide();
  addBackground(s);
  addHeader(s, '06｜赚钱思路：先借大势，再找需求', '每个新事物出现，都会带来新的诉求');

  card(s, M, 1.55, W - 2 * M, 3.3, theme.navy);

  const leftX = M + 0.45;
  const y = 1.85;
  const colW = (W - 2 * M - 0.9 - 0.4) / 2;

  card(s, leftX, y, colW, 2.7, theme.terracotta);
  s.addText('① 借大势\n（破除心魔）', {
    x: leftX + 0.25,
    y: y + 0.2,
    w: colW - 0.5,
    h: 0.6,
    fontFace: font.title,
    fontSize: 18,
    bold: true,
    color: theme.terracotta,
    margin: 0,
  });
  addBullets(s, leftX + 0.25, y + 0.85, colW - 0.5, 1.8, [
    '别固步自封守旧业务',
    '新趋势 = 新机会',
    '尤其老板最容易卡在“只推自家产品”',
  ]);

  const rightX = leftX + colW + 0.4;
  card(s, rightX, y, colW, 2.7, theme.sage);
  s.addText('② 找需求\n（从诉求出发）', {
    x: rightX + 0.25,
    y: y + 0.2,
    w: colW - 0.5,
    h: 0.6,
    fontFace: font.title,
    fontSize: 18,
    bold: true,
    color: theme.sage,
    margin: 0,
  });
  addBullets(s, rightX + 0.25, y + 0.85, colW - 0.5, 1.8, [
    '新事物必然带来新诉求',
    '先抓高频痛点',
    '把痛点变成可交付结果',
  ]);

  addFooter(s, '从需求出发，你就不会只“卖功能”');
}

// Slide 8: Combine with your experience
{
  const s = pres.addSlide();
  addBackground(s);
  addHeader(s, '07｜第二步：结合你的过往经验', '人人都能赚钱，但赚的不一样');

  card(s, M, 1.55, W - 2 * M, 3.3, theme.sage);

  s.addText('核心结论：决定你赚什么钱的，是你自己。', {
    x: M + 0.45,
    y: 1.85,
    w: W - 2 * M - 0.9,
    h: 0.45,
    fontFace: font.body,
    fontSize: 18,
    bold: true,
    color: theme.ink,
    margin: 0,
  });

  // 3 questions
  const qX = M + 0.45;
  const qY = 2.55;
  const qW = W - 2 * M - 0.9;
  const qH = 0.75;
  const qGap = 0.22;
  const qs = [
    { t: '你最擅长交付什么结果？（不是能力，是结果）', a: theme.terracotta },
    { t: '你有什么资源/渠道/圈子？（谁愿意为你买单）', a: theme.navy },
    { t: '你能把什么做成可复制的 SOP/Skill？（可规模化）', a: theme.sage },
  ];

  qs.forEach((q, i) => {
    const y = qY + i * (qH + qGap);
    card(s, qX, y, qW, qH, q.a);
    s.addShape(pres.ShapeType.rect, {
      x: qX,
      y,
      w: 0.1,
      h: qH,
      fill: { color: q.a },
      line: { color: q.a },
    });
    s.addText(q.t, {
      x: qX + 0.22,
      y: y + 0.18,
      w: qW - 0.35,
      h: qH - 0.2,
      fontFace: font.body,
      fontSize: 15,
      color: theme.ink,
      margin: 0,
    });
  });

  addFooter(s, '把“龙虾能力”挂到你的优势上，才能赚钱');
}

// Slide 9: Three routes
{
  const s = pres.addSlide();
  addBackground(s);
  addHeader(s, '08｜三条变现路线（从第一波钱到可持续）', '先赚到第一波钱，再追求持续收益');

  const y = 1.65;
  const cardW = (W - 2 * M - 0.6) / 3;
  const cardH = 3.35;

  const routes = [
    {
      n: '路线 1',
      title: '安装部署（量大）',
      accent: theme.terracotta,
      bullets: ['大痛点：很多人装不起来', '客单不一定高，但需求量大', '适合赚第一波钱'],
    },
    {
      n: '路线 2',
      title: 'Skill 变现（小圈子）',
      accent: theme.navy,
      bullets: ['装 Skill 免费，但业务不愿公开', '成熟 Skill 可以直接卖', '适合做高价值交付'],
    },
    {
      n: '路线 3',
      title: '产品化/广场化（持续）',
      accent: theme.sage,
      bullets: ['从“手停脚停”到可复用产品', '推广 Skill / 上架广场', '一套持续产生收益'],
    },
  ];

  routes.forEach((r, i) => {
    const x = M + i * (cardW + 0.3);
    card(s, x, y, cardW, cardH, r.accent);

    s.addText(r.n, {
      x: x + 0.25,
      y: y + 0.2,
      w: cardW - 0.5,
      h: 0.3,
      fontFace: font.body,
      fontSize: 12,
      color: theme.muted,
      margin: 0,
    });

    s.addText(r.title, {
      x: x + 0.25,
      y: y + 0.52,
      w: cardW - 0.5,
      h: 0.5,
      fontFace: font.title,
      fontSize: 18,
      bold: true,
      color: theme.ink,
      margin: 0,
    });

    s.addShape(pres.ShapeType.rect, {
      x: x + 0.25,
      y: y + 1.05,
      w: cardW - 0.5,
      h: 0.06,
      fill: { color: r.accent },
      line: { color: r.accent },
    });

    addBullets(s, x + 0.25, y + 1.25, cardW - 0.5, 1.9, r.bullets);
  });

  addFooter(s, '建议：先从路线 1 跑通交付，再升级到路线 2/3');
}

// Slide 10: Closing
{
  const s = pres.addSlide();
  addBackground(s);
  addHeader(s, '09｜一句话总结', '四句带走：借势、需求、结合自己、走向可持续');

  card(s, M, 1.55, W - 2 * M, 3.3, theme.terracotta);

  const items = [
    '借大势：别守着旧业务不肯放',
    '找需求：新事物带来新诉求',
    '结合自己：你决定你赚什么钱',
    '从 1 到 3：先赚第一波钱，再走向可持续',
  ];

  s.addText(bulletRuns(items), {
    x: M + 0.65,
    y: 1.95,
    w: W - 2 * M - 1.3,
    h: 2.4,
    fontFace: font.body,
    fontSize: 22,
    color: theme.ink,
    valign: 'top',
    margin: 0,
    paraSpaceAfter: 12,
  });

  s.addShape(pres.ShapeType.rect, {
    x: M,
    y: 4.95,
    w: W - 2 * M,
    h: 0.55,
    fill: { color: theme.sand },
    line: { color: theme.sand },
  });
  s.addText('Q&A｜需要的话我可以补一份“现场口播版”讲稿。', {
    x: M + 0.35,
    y: 5.08,
    w: W - 2 * M - 0.7,
    h: 0.35,
    fontFace: font.body,
    fontSize: 14,
    color: theme.ink,
    margin: 0,
  });

  addFooter(s, '谢谢');
}

pres.writeFile({ fileName: OUTPUT_PPTX });
console.log('Generated:', OUTPUT_PPTX);
