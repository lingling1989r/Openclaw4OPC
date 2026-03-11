const fs = require('fs');
const path = require('path');
const PptxGen = require('pptxgenjs');

const INPUT_MD = '龙虾框架分享-从基础应用到商业变现.md';
const OUTPUT_PPTX = path.join('assets', 'ppt', '龙虾框架分享-从基础应用到商业变现-米色风格-提纲版.pptx');

// 16:9 = 10" x 5.625"
const W = 10;
const H = 5.625;
const M = 0.62;

const theme = {
  bg: 'F6F1E7',
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
  fallback: 'Calibri',
};

function makeShadow() {
  return { type: 'outer', color: '000000', blur: 6, offset: 2, angle: 135, opacity: 0.12 };
}

function addBackground(pres, slide) {
  slide.background = { color: theme.bg };
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: 0,
    w: W,
    h: 0.12,
    fill: { color: theme.terracotta },
    line: { color: theme.terracotta },
  });
  slide.addShape(pres.ShapeType.rect, {
    x: 0,
    y: H - 0.12,
    w: W,
    h: 0.12,
    fill: { color: theme.sage },
    line: { color: theme.sage },
  });
}

function addHeader(slide, title, subtitle) {
  slide.addText(title, {
    x: M,
    y: 0.42,
    w: W - 2 * M,
    h: 0.6,
    fontFace: font.title,
    fontSize: 28,
    bold: true,
    color: theme.ink,
    margin: 0,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: M,
      y: 1.03,
      w: W - 2 * M,
      h: 0.35,
      fontFace: font.body,
      fontSize: 13,
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

function card(pres, slide, x, y, w, h, accent) {
  slide.addShape(pres.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    fill: { color: theme.card },
    line: { color: accent || theme.sand, width: 1.5 },
    shadow: makeShadow(),
  });
}

function bulletRuns(lines, indentLevel = 0) {
  return lines.map((t, idx) => ({
    text: t,
    options: { bullet: true, indentLevel, breakLine: idx !== lines.length - 1 },
  }));
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out.length ? out : [[]];
}

function parseCourseArchitectureCodeBlock(md) {
  const heading = '## 📋 课程架构总览';
  const idx = md.indexOf(heading);
  if (idx === -1) return null;
  const after = md.slice(idx);
  const start = after.indexOf('```');
  if (start === -1) return null;
  const rest = after.slice(start + 3);
  const end = rest.indexOf('```');
  if (end === -1) return null;
  return rest.slice(0, end).trim();
}

function parsePartOutline(codeText) {
  // Keep only high-level structure: Part + (一）/二） + 1./2. and Ch.xx markers.
  const lines = codeText.split(/\r?\n/).map(l => l.replace(/\t/g, '  '));
  const parts = [];
  let current = null;

  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;

    const part = t.match(/^(第[一二三四五六七八九十]+部分：.*)$/);
    if (part) {
      current = { title: part[1], items: [] };
      parts.push(current);
      continue;
    }

    if (!current) continue;

    // Filter out deep dash items
    if (
      /^（?Ch\./.test(t) ||
      /^[一二三四五六七八九十]+）/.test(t) ||
      /^\d+\./.test(t) ||
      /^附录/.test(t)
    ) {
      current.items.push(t);
    }
  }

  return parts;
}

function parseH2H3(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  for (const line of lines) {
    const m = line.match(/^(#{2,3})\s+(.*)$/);
    if (!m) continue;
    out.push({ level: m[1].length, text: m[2].trim() });
  }
  return out;
}

function extractThreeLayer(md) {
  const m = md.match(/建议用\s*\*\*3\s*层展示结构\*\*[\s\S]*?\n\s*1\.[\s\S]*?\n\s*2\.[\s\S]*?\n\s*3\.[\s\S]*?(\n|$)/);
  if (!m) return null;
  const block = m[0];
  const steps = [];
  for (const l of block.split(/\r?\n/)) {
    const t = l.trim();
    if (!/^\d\./.test(t)) continue;
    steps.push(t.replace(/^\d\.\s*/, '').trim());
  }
  return steps.length ? steps.slice(0, 3) : null;
}

const md = fs.readFileSync(INPUT_MD, 'utf8');
const arch = parseCourseArchitectureCodeBlock(md);
const parts = arch ? parsePartOutline(arch) : [];
const headings = parseH2H3(md)
  .filter(h => h.level <= 3)
  .filter(h => !/^附录A｜国内检索案例库/.test(h.text))
  .filter(h => !/^A\./.test(h.text));

const threeLayer = extractThreeLayer(md) || [
  '单点技能（1 分钟）：搜索/转写/生成',
  '小工作流（3 分钟）：输入→处理→输出（例如：转写→清理→摘要→发布）',
  '端到端交付（5 分钟）：真实任务从需求到交付（含失败边界）',
];

const pres = new PptxGen();
pres.layout = 'LAYOUT_16x9';
pres.author = 'OpenClaw';
pres.title = '龙虾框架分享（米色提纲版）';

// Slide 1: cover
{
  const s = pres.addSlide();
  addBackground(pres, s);

  s.addShape(pres.ShapeType.roundRect, {
    x: M,
    y: 1.25,
    w: W - 2 * M,
    h: 2.55,
    fill: { color: theme.card },
    line: { color: theme.terracotta, width: 2 },
    shadow: makeShadow(),
  });

  s.addText('龙虾框架分享', {
    x: M + 0.45,
    y: 1.5,
    w: W - 2 * M - 0.9,
    h: 0.8,
    fontFace: font.title,
    fontSize: 42,
    bold: true,
    color: theme.ink,
    margin: 0,
  });
  s.addText('从基础应用到商业变现（提纲版）', {
    x: M + 0.45,
    y: 2.25,
    w: W - 2 * M - 0.9,
    h: 0.4,
    fontFace: font.body,
    fontSize: 18,
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
  s.addText('原则：只放关键结构/抓手，细节口播', {
    x: M + 0.35,
    y: 4.35,
    w: W - 2 * M - 0.7,
    h: 0.45,
    fontFace: font.body,
    fontSize: 15,
    color: theme.ink,
    margin: 0,
  });

  addFooter(s, 'OpenClaw / 龙虾');
}

// Slide 2: course architecture (Part 1-7)
{
  const s = pres.addSlide();
  addBackground(pres, s);
  addHeader(s, '课程架构（放在目录前）', '分部分 → 章 → 节 → 小节');

  const cards = parts.length
    ? parts.map(p => p.title)
    : [
        '第一部分：学前须知（学员指南）',
        '第二部分：认知铺垫（Ch.01-02 + 案例）',
        '第三部分：学习准备阶段（部署/账号）',
        '第四部分：核心能力养成（Ch.03-05）',
        '第五部分：商业变现路径（Ch.06-08）',
        '第六部分：行业实战剧本（Ch.09-12）',
        '第七部分：收尾与转化（Ch.13）',
        '附录：国内案例库 + 参考资料',
      ];

  const cols = 2;
  const cardW = (W - 2 * M - 0.4) / cols;
  const cardH = 0.62;
  const gapX = 0.4;
  const startY = 1.55;

  cards.slice(0, 8).forEach((t, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = M + col * (cardW + gapX);
    const y = startY + row * (cardH + 0.22);
    const accent = [theme.terracotta, theme.navy, theme.sage][i % 3];
    card(pres, s, x, y, cardW, cardH, accent);
    s.addText(t, {
      x: x + 0.22,
      y: y + 0.14,
      w: cardW - 0.44,
      h: cardH - 0.2,
      fontFace: font.body,
      fontSize: 13,
      color: theme.ink,
      margin: 0,
    });
  });

  addFooter(s, '建议：这一页放在“课程目录”之前');
}

// Slide 3: three-layer demo structure
{
  const s = pres.addSlide();
  addBackground(pres, s);
  addHeader(s, '关键抓手：三层展示结构', '单点 → 小流 → 端到端交付');

  const x = M;
  const w = W - 2 * M;
  const baseY = 1.55;
  const cardH = 1.05;
  const gap = 0.22;

  const cards = [
    { n: '01', t: threeLayer[0], a: theme.terracotta },
    { n: '02', t: threeLayer[1], a: theme.navy },
    { n: '03', t: threeLayer[2], a: theme.sage },
  ];

  cards.forEach((c, i) => {
    const y = baseY + i * (cardH + gap);
    card(pres, s, x, y, w, cardH, c.a);
    s.addText(c.n, {
      x: x + 0.25,
      y: y + 0.22,
      w: 0.9,
      h: 0.6,
      fontFace: font.title,
      fontSize: 22,
      bold: true,
      color: c.a,
      margin: 0,
    });
    s.addText(c.t, {
      x: x + 1.2,
      y: y + 0.22,
      w: w - 1.45,
      h: 0.7,
      fontFace: font.body,
      fontSize: 18,
      color: theme.ink,
      margin: 0,
    });
  });

  addFooter(s, '建议：现场演示直接跑到第 3 层');
}

// Slide 4: Level 1-4 explanation
{
  const s = pres.addSlide();
  addBackground(pres, s);
  addHeader(s, '目录层级（Level 1 → Level 4）', '保证框架完整，但不堆细节');

  card(pres, s, M, 1.55, W - 2 * M, 3.3, theme.terracotta);

  const bullets = [
    'Level 1：部分（Part）— 课程节奏与阶段目标',
    'Level 2：章节（Chapter）— 讲清楚一个关键主题',
    'Level 3：小节（Section）— 结构化拆解（why/what/how/metric）',
    'Level 4：子点（Subpoint）— 示例/工具/注意事项（尽量不放 PPT）',
  ];

  s.addText(bulletRuns(bullets), {
    x: M + 0.55,
    y: 1.85,
    w: W - 2 * M - 1.1,
    h: 2.6,
    fontFace: font.body,
    fontSize: 18,
    color: theme.ink,
    valign: 'top',
    margin: 0,
    paraSpaceAfter: 10,
  });

  s.addShape(pres.ShapeType.rect, {
    x: M,
    y: 4.85,
    w: W - 2 * M,
    h: 0.55,
    fill: { color: theme.sand },
    line: { color: theme.sand },
  });
  s.addText('示例：第二部分→Ch.02→小节：三层展示结构→子点：Demo 脚本', {
    x: M + 0.35,
    y: 4.98,
    w: W - 2 * M - 0.7,
    h: 0.35,
    fontFace: font.body,
    fontSize: 12,
    color: theme.ink,
    margin: 0,
  });
}

// Slides: H2/H3 directory (titles only)
{
  const items = headings.map(h => {
    const lvl = h.level - 2; // 0 for H2, 1 for H3
    return { lvl, text: (h.level === 2 ? '章：' : '节：') + h.text };
  });

  const pages = chunk(items, 20);
  pages.forEach((page, idx) => {
    const s = pres.addSlide();
    addBackground(pres, s);
    addHeader(s, idx === 0 ? '课程目录（章/节标题）' : `课程目录（续${idx}）`, '只列标题，不放正文');

    card(pres, s, M, 1.55, W - 2 * M, 3.3, theme.navy);

    const runs = [];
    page.forEach((it, i) => {
      runs.push({
        text: it.text,
        options: {
          bullet: true,
          indentLevel: it.lvl,
          breakLine: i !== page.length - 1,
        },
      });
    });

    s.addText(runs, {
      x: M + 0.5,
      y: 1.82,
      w: W - 2 * M - 1.0,
      h: 3.05,
      fontFace: font.body,
      fontSize: 13,
      color: theme.ink,
      valign: 'top',
      margin: 0,
      paraSpaceAfter: 3,
    });

    addFooter(s, `目录页 ${idx + 1}/${pages.length}`);
  });
}

// Slides: one per Part (items list only)
{
  const maxLines = 14;
  parts.forEach((p, i) => {
    const accent = [theme.terracotta, theme.navy, theme.sage][i % 3];
    const pages = chunk(p.items, maxLines);

    pages.forEach((page, idx) => {
      const s = pres.addSlide();
      addBackground(pres, s);
      addHeader(s, idx === 0 ? p.title : `${p.title}（续${idx}）`, '只列本部分标题');

      card(pres, s, M, 1.55, W - 2 * M, 3.3, accent);
      s.addText(bulletRuns(page), {
        x: M + 0.55,
        y: 1.82,
        w: W - 2 * M - 1.1,
        h: 3.05,
        fontFace: font.body,
        fontSize: 14,
        color: theme.ink,
        valign: 'top',
        margin: 0,
        paraSpaceAfter: 4,
      });

      addFooter(s, p.title);
    });
  });
}

// Closing
{
  const s = pres.addSlide();
  addBackground(pres, s);
  addHeader(s, '收尾（行动路径）', '把框架变成可交付');

  card(pres, s, M, 1.55, W - 2 * M, 3.3, theme.sage);

  const bullets = [
    '先选 1 个场景：把输入/输出/验收写清楚',
    '按“三层展示结构”做 1 次 Demo',
    '沉淀成 SOP + Skill（可复制）',
    '高风险动作默认加人工确认',
  ];

  s.addText(bulletRuns(bullets), {
    x: M + 0.55,
    y: 1.85,
    w: W - 2 * M - 1.1,
    h: 3.0,
    fontFace: font.body,
    fontSize: 18,
    color: theme.ink,
    valign: 'top',
    margin: 0,
    paraSpaceAfter: 10,
  });

  addFooter(s, 'Q&A');
}

fs.mkdirSync(path.dirname(OUTPUT_PPTX), { recursive: true });
pres.writeFile({ fileName: OUTPUT_PPTX });
console.log('Generated:', OUTPUT_PPTX, '| Slides:', pres._slides.length);
