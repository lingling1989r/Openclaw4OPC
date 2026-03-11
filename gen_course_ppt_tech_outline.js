const fs = require('fs');
const path = require('path');
const PptxGen = require('pptxgenjs');

const INPUT_MD = '龙虾框架分享-从基础应用到商业变现.md';
const OUTPUT_PPTX = path.join('assets', 'ppt', '龙虾框架分享-科技风-提纲版.pptx');

// Tech theme (dark)
const THEME = {
  bg: '0B1220',
  panel: '111B2E',
  panel2: '0F172A',
  text: 'E5E7EB',
  muted: '94A3B8',
  grid: '1F2A44',
  cyan: '22D3EE',
  purple: 'A78BFA',
  orange: 'FB923C',
  green: '34D399',
  red: 'F87171',
};

const FONT = {
  title: 'Calibri',
  body: 'Calibri',
};

const W = 10; // LAYOUT_16x9
const H = 5.625;
const M = 0.6;

function addBg(pptx, slide) {
  slide.background = { color: THEME.bg };
  // subtle grid
  for (let x = 0.2; x < W; x += 0.8) {
    slide.addShape(pptx.ShapeType.line, {
      x,
      y: 0,
      w: 0,
      h: H,
      line: { color: THEME.grid, width: 0.25, transparency: 65 },
    });
  }
  for (let y = 0.2; y < H; y += 0.7) {
    slide.addShape(pptx.ShapeType.line, {
      x: 0,
      y,
      w: W,
      h: 0,
      line: { color: THEME.grid, width: 0.25, transparency: 65 },
    });
  }
}

function addTopBar(pptx, slide, accent) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: W,
    h: 0.12,
    fill: { color: accent },
    line: { color: accent },
  });
}

function addTitle(slide, title, subtitle) {
  slide.addText(title, {
    x: M,
    y: 0.35,
    w: W - 2 * M,
    h: 0.6,
    fontFace: FONT.title,
    fontSize: 30,
    bold: true,
    color: THEME.text,
    margin: 0,
  });
  if (subtitle) {
    slide.addText(subtitle, {
      x: M,
      y: 1.0,
      w: W - 2 * M,
      h: 0.35,
      fontFace: FONT.body,
      fontSize: 14,
      color: THEME.muted,
      margin: 0,
    });
  }
}

function addFooter(slide, text) {
  slide.addText(text, {
    x: M,
    y: H - 0.35,
    w: W - 2 * M,
    h: 0.25,
    fontFace: FONT.body,
    fontSize: 10,
    color: THEME.muted,
    margin: 0,
  });
}

function addPanel(pptx, slide, x, y, w, h, accent) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    fill: { color: THEME.panel, transparency: 6 },
    line: { color: accent, width: 1.5, transparency: 10 },
  });
}

function bulletRuns(lines, indentLevel = 0) {
  return lines.map((t, idx) => ({
    text: t,
    options: {
      bullet: true,
      indentLevel,
      breakLine: idx !== lines.length - 1,
    },
  }));
}

function chunkByCount(items, maxPerSlide) {
  const out = [];
  for (let i = 0; i < items.length; i += maxPerSlide) out.push(items.slice(i, i + maxPerSlide));
  return out.length ? out : [[]];
}

function parseHeadings(md) {
  const lines = md.split(/\r?\n/);
  const headings = [];
  for (const line of lines) {
    const m = line.match(/^(#{1,4})\s+(.*)$/);
    if (!m) continue;
    headings.push({ level: m[1].length, text: m[2].trim() });
  }
  return headings;
}

function groupH2(md) {
  const lines = md.split(/\r?\n/);
  const sections = [];
  let cur = null;
  for (const line of lines) {
    const m2 = line.match(/^##\s+(.*)$/);
    if (m2) {
      if (cur) sections.push(cur);
      cur = { title: m2[1].trim(), h3: [] };
      continue;
    }
    const m3 = line.match(/^###\s+(.*)$/);
    if (m3 && cur) cur.h3.push(m3[1].trim());
  }
  if (cur) sections.push(cur);
  return sections;
}

function extractThreeLayer(md) {
  // Locate the specific 3-layer block and return 3 bullet lines.
  const m = md.match(/建议用\s*\*\*3\s*层展示结构\*\*[\s\S]*?\n\s*1\.[\s\S]*?\n\s*2\.[\s\S]*?\n\s*3\.[\s\S]*?(\n|$)/);
  if (!m) return null;
  const block = m[0];
  const lines = block
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);
  const steps = [];
  for (const l of lines) {
    const s = l.replace(/^\d+\.|^\d+\)|^\s+/, '').trim();
    if (/^单点技能|^小工作流|^端到端交付/.test(s)) steps.push(s);
  }
  return steps.length ? steps.slice(0, 3) : null;
}

const md = fs.readFileSync(INPUT_MD, 'utf8');
const headings = parseHeadings(md);
const sections = groupH2(md);
const threeLayer = extractThreeLayer(md) || [
  '单点技能（1分钟）：搜索/转写/生成',
  '小工作流（3分钟）：输入→处理→输出',
  '端到端交付（5分钟）：真实任务从需求到交付',
];

const pptx = new PptxGen();
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'OpenClaw';
pptx.title = '龙虾框架分享（科技风提纲版）';

// 1) Cover
{
  const s = pptx.addSlide();
  addBg(pptx, s);
  addTopBar(pptx, s, THEME.cyan);

  // hero panel
  addPanel(pptx, s, M, 1.4, W - 2 * M, 2.6, THEME.purple);
  s.addText('龙虾框架分享', {
    x: M + 0.4,
    y: 1.65,
    w: W - 2 * M - 0.8,
    h: 0.7,
    fontFace: FONT.title,
    fontSize: 40,
    bold: true,
    color: THEME.text,
    margin: 0,
  });
  s.addText('从基础应用到商业变现（科技风·提纲版）', {
    x: M + 0.4,
    y: 2.35,
    w: W - 2 * M - 0.8,
    h: 0.4,
    fontFace: FONT.body,
    fontSize: 16,
    color: THEME.muted,
    margin: 0,
  });

  s.addText('目标：让听众“懂框架、会展示、能落地、能变现”', {
    x: M + 0.4,
    y: 2.95,
    w: W - 2 * M - 0.8,
    h: 0.4,
    fontFace: FONT.body,
    fontSize: 16,
    color: THEME.text,
    margin: 0,
  });

  addFooter(s, 'OpenClaw / 龙虾框架');
}

// 2) Key takeaways
{
  const s = pptx.addSlide();
  addBg(pptx, s);
  addTopBar(pptx, s, THEME.purple);
  addTitle(s, '关键结论（讲这一页就够）', '只讲可复用的关键点，不铺细节');

  addPanel(pptx, s, M, 1.55, W - 2 * M, 3.55, THEME.purple);

  const bullets = [
    '不要“演示功能”：要演示“交付结果”（输入/输出/验收）',
    '展示要用“三层结构”：单点 → 小工作流 → 端到端交付',
    '落地的最小闭环：Skill + SOP + 失败处理 + 安全边界',
    '变现从标准化开始：模板/陪跑/定制实施（逐级升级）',
  ];

  s.addText(bulletRuns(bullets), {
    x: M + 0.5,
    y: 1.85,
    w: W - 2 * M - 1.0,
    h: 3.0,
    fontFace: FONT.body,
    fontSize: 18,
    color: THEME.text,
    valign: 'top',
    margin: 0,
    paraSpaceAfter: 10,
  });

  addFooter(s, '讲完这一页，再按章节展开');
}

// 3) Three-layer demo structure
{
  const s = pptx.addSlide();
  addBg(pptx, s);
  addTopBar(pptx, s, THEME.cyan);
  addTitle(s, '三层展示结构（强烈建议照这个讲）', '把“酷炫”变成“可迁移到自己的工作流”');

  const x = M;
  const w = W - 2 * M;
  const baseY = 1.55;
  const cardH = 1.05;
  const gap = 0.2;

  const cards = [
    { n: '01', t: threeLayer[0], a: THEME.cyan },
    { n: '02', t: threeLayer[1], a: THEME.purple },
    { n: '03', t: threeLayer[2], a: THEME.orange },
  ];

  cards.forEach((c, i) => {
    const y = baseY + i * (cardH + gap);
    addPanel(pptx, s, x, y, w, cardH, c.a);
    s.addText(c.n, {
      x: x + 0.25,
      y: y + 0.2,
      w: 0.8,
      h: 0.6,
      fontFace: FONT.title,
      fontSize: 22,
      bold: true,
      color: c.a,
      margin: 0,
    });
    s.addText(c.t, {
      x: x + 1.1,
      y: y + 0.22,
      w: w - 1.35,
      h: 0.7,
      fontFace: FONT.body,
      fontSize: 18,
      color: THEME.text,
      margin: 0,
    });
  });

  addFooter(s, '提示：现场演示只跑到“端到端交付”');
}

// 4) Outline Level 1-4
{
  // Convert headings into bullet text with indent levels
  // Level mapping: #=L1, ##=L2, ###=L3, ####=L4
  const items = headings
    .filter(h => h.level >= 1 && h.level <= 4)
    .map(h => {
      const lvl = Math.max(0, h.level - 1); // 0..3
      const prefix = h.level === 1 ? 'L1 ' : h.level === 2 ? 'L2 ' : h.level === 3 ? 'L3 ' : 'L4 ';
      return { lvl, text: prefix + h.text };
    });

  const maxLines = 18;
  const pages = chunkByCount(items, maxLines);

  pages.forEach((page, idx) => {
    const s = pptx.addSlide();
    addBg(pptx, s);
    addTopBar(pptx, s, THEME.orange);
    addTitle(s, idx === 0 ? '章节结构（Level 1-4）' : `章节结构（续${idx}）`, '只展示目录层级，避免把细节塞进 PPT');

    addPanel(pptx, s, M, 1.55, W - 2 * M, 3.55, THEME.orange);

    // Build rich text runs with indent
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
      x: M + 0.4,
      y: 1.82,
      w: W - 2 * M - 0.8,
      h: 3.1,
      fontFace: FONT.body,
      fontSize: 14,
      color: THEME.text,
      valign: 'top',
      margin: 0,
      paraSpaceAfter: 4,
    });

    addFooter(s, `目录页 ${idx + 1}/${pages.length}`);
  });
}

// 5+) One slide per H2: show H3 list only (no details)
{
  let i = 0;
  for (const sec of sections) {
    const accent = [THEME.cyan, THEME.purple, THEME.orange, THEME.green, THEME.red][i % 5];
    i++;

    const s = pptx.addSlide();
    addBg(pptx, s);
    addTopBar(pptx, s, accent);
    addTitle(s, sec.title, '本章只给“你要讲哪些小标题”');

    addPanel(pptx, s, M, 1.55, W - 2 * M, 3.55, accent);

    const h3 = sec.h3.length ? sec.h3 : ['（本章无小标题，直接讲关键结论/案例）'];
    const list = h3.slice(0, 12); // keep tight

    // Split into two columns if needed
    const left = list.slice(0, Math.ceil(list.length / 2));
    const right = list.slice(Math.ceil(list.length / 2));

    s.addText(bulletRuns(left), {
      x: M + 0.35,
      y: 1.85,
      w: (W - 2 * M - 0.9) / 2,
      h: 3.0,
      fontFace: FONT.body,
      fontSize: 14,
      color: THEME.text,
      valign: 'top',
      margin: 0,
      paraSpaceAfter: 4,
    });

    if (right.length) {
      s.addText(bulletRuns(right), {
        x: M + 0.55 + (W - 2 * M - 0.9) / 2,
        y: 1.85,
        w: (W - 2 * M - 0.9) / 2,
        h: 3.0,
        fontFace: FONT.body,
        fontSize: 14,
        color: THEME.text,
        valign: 'top',
        margin: 0,
        paraSpaceAfter: 4,
      });
    }

    addFooter(s, '建议：口播补充细节，PPT只做结构与关键抓手');
  }
}

// Closing
{
  const s = pptx.addSlide();
  addBg(pptx, s);
  addTopBar(pptx, s, THEME.green);
  addTitle(s, '收尾（给行动与转化）', '让听众立刻知道下一步怎么做');

  addPanel(pptx, s, M, 1.55, W - 2 * M, 3.55, THEME.green);

  const bullets = [
    '选 1 个场景：把输入/输出/验收写清楚',
    '按“三层展示结构”做 1 次演示',
    '沉淀成 SOP + Skill 说明（可复制）',
    '需要团队/企业落地：按岗位拆 Multi-Agent，做 2 周最小闭环',
  ];

  s.addText(bulletRuns(bullets), {
    x: M + 0.5,
    y: 1.85,
    w: W - 2 * M - 1.0,
    h: 3.0,
    fontFace: FONT.body,
    fontSize: 18,
    color: THEME.text,
    valign: 'top',
    margin: 0,
    paraSpaceAfter: 10,
  });

  addFooter(s, 'Q&A');
}

fs.mkdirSync(path.dirname(OUTPUT_PPTX), { recursive: true });
pptx.writeFile({ fileName: OUTPUT_PPTX });
console.log('Generated:', OUTPUT_PPTX);
