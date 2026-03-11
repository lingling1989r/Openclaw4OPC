const fs = require('fs');
const path = require('path');
const PptxGen = require('pptxgenjs');

const INPUT_MD = '龙虾框架分享-从基础应用到商业变现.md';
const OUTPUT_PPTX = path.join('assets', 'ppt', '龙虾框架分享-科技风-结构提纲版.pptx');

// Tech theme (dark)
const THEME = {
  bg: '0B1220',
  panel: '0F172A',
  panel2: '111B2E',
  text: 'E5E7EB',
  muted: '94A3B8',
  grid: '1F2A44',
  cyan: '22D3EE',
  purple: 'A78BFA',
  orange: 'FB923C',
  green: '34D399',
  red: 'F87171',
  blue: '60A5FA',
};

const FONT = {
  title: 'Calibri',
  body: 'Calibri',
};

// LAYOUT_16x9: 10 x 5.625
const W = 10;
const H = 5.625;
const M = 0.62;

function addBg(pptx, slide) {
  slide.background = { color: THEME.bg };
  // subtle grid
  for (let x = 0.3; x < W; x += 0.9) {
    slide.addShape(pptx.ShapeType.line, {
      x,
      y: 0,
      w: 0,
      h: H,
      line: { color: THEME.grid, width: 0.25, transparency: 70 },
    });
  }
  for (let y = 0.35; y < H; y += 0.75) {
    slide.addShape(pptx.ShapeType.line, {
      x: 0,
      y,
      w: W,
      h: 0,
      line: { color: THEME.grid, width: 0.25, transparency: 70 },
    });
  }
}

function topBar(pptx, slide, accent) {
  slide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: W,
    h: 0.12,
    fill: { color: accent },
    line: { color: accent },
  });
}

function title(slide, t, sub) {
  slide.addText(t, {
    x: M,
    y: 0.35,
    w: W - 2 * M,
    h: 0.7,
    fontFace: FONT.title,
    fontSize: 30,
    bold: true,
    color: THEME.text,
    margin: 0,
  });
  if (sub) {
    slide.addText(sub, {
      x: M,
      y: 1.05,
      w: W - 2 * M,
      h: 0.35,
      fontFace: FONT.body,
      fontSize: 14,
      color: THEME.muted,
      margin: 0,
    });
  }
}

function footer(slide, text) {
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

function panel(pptx, slide, x, y, w, h, accent) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x,
    y,
    w,
    h,
    fill: { color: THEME.panel2, transparency: 6 },
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

function chunk(items, size) {
  const out = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out.length ? out : [[]];
}

function extractCodeBlock(md, headingText) {
  const idx = md.indexOf(headingText);
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
  // Extract “第一部分：...” lines as parts and their indented chapter lines.
  // We will rely on leading spaces for hierarchy.
  const lines = codeText.split(/\r?\n/);
  const parts = [];
  let current = null;

  for (const raw of lines) {
    const line = raw.replace(/\t/g, '  ');
    const trimmed = line.trim();
    if (!trimmed) continue;

    const partMatch = trimmed.match(/^(第[一二三四五六七八九十]+部分：.*)$/);
    if (partMatch) {
      current = { title: partMatch[1], items: [] };
      parts.push(current);
      continue;
    }

    if (current) {
      // keep only high-level items (章/节) for PPT; skip deep dash content
      if (/^（?Ch\.|^一）|^二）|^三）|^四）|^五）|^六）|^七）|^八）|^九）|^十）|^附录/.test(trimmed) || /^\d+\./.test(trimmed)) {
        current.items.push(trimmed);
      }
    }
  }

  return parts;
}

function extractThreeLayer(md) {
  const m = md.match(/建议用\s*\*\*3\s*层展示结构\*\*[\s\S]*?\n\s*1\.[\s\S]*?\n\s*2\.[\s\S]*?\n\s*3\.[\s\S]*?(\n|$)/);
  if (!m) return null;
  const block = m[0];
  const lines = block
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  const steps = [];
  for (const l of lines) {
    if (!/^\d\./.test(l)) continue;
    steps.push(l.replace(/^\d\.\s*/, '').trim());
  }
  return steps.length ? steps.slice(0, 3) : null;
}

function parseHeadings(md) {
  const lines = md.split(/\r?\n/);
  const headings = [];
  for (const line of lines) {
    const m = line.match(/^(#{2,4})\s+(.*)$/);
    if (!m) continue;
    headings.push({ level: m[1].length, text: m[2].trim() });
  }
  return headings;
}

const md = fs.readFileSync(INPUT_MD, 'utf8');
const arch = extractCodeBlock(md, '## 📋 课程架构总览');
const parts = arch ? parsePartOutline(arch) : [];
const headings = parseHeadings(md);
const threeLayer = extractThreeLayer(md) || [
  '单点技能（1 分钟）：搜索/转写/生成',
  '小工作流（3 分钟）：输入→处理→输出',
  '端到端交付（5 分钟）：真实任务从需求到交付（含失败边界）',
];

const pptx = new PptxGen();
pptx.layout = 'LAYOUT_16x9';
pptx.author = 'OpenClaw';
pptx.title = '龙虾框架分享（科技风·结构提纲版）';

// 1) Cover
{
  const s = pptx.addSlide();
  addBg(pptx, s);
  topBar(pptx, s, THEME.cyan);

  panel(pptx, s, M, 1.55, W - 2 * M, 2.7, THEME.purple);
  s.addText('龙虾框架分享', {
    x: M + 0.5,
    y: 1.78,
    w: W - 2 * M - 1.0,
    h: 0.8,
    fontFace: FONT.title,
    fontSize: 40,
    bold: true,
    color: THEME.text,
    margin: 0,
  });
  s.addText('从基础应用到商业变现（科技风·结构提纲版）', {
    x: M + 0.5,
    y: 2.58,
    w: W - 2 * M - 1.0,
    h: 0.4,
    fontFace: FONT.body,
    fontSize: 16,
    color: THEME.muted,
    margin: 0,
  });
  s.addText('PPT 只展示关键结构与抓手：不塞细节。', {
    x: M + 0.5,
    y: 3.05,
    w: W - 2 * M - 1.0,
    h: 0.35,
    fontFace: FONT.body,
    fontSize: 16,
    color: THEME.text,
    margin: 0,
  });
  footer(s, 'OpenClaw / 龙虾框架大课');
}

// 2) Course architecture map (Part 1-7)
{
  const s = pptx.addSlide();
  addBg(pptx, s);
  topBar(pptx, s, THEME.purple);
  title(s, '课程架构（放在目录前）', '参考你发的截图：分部分 → 章 → 节 → 小节');

  const cards = parts.length
    ? parts.map(p => p.title)
    : [
        '第一部分：学前须知（学员指南）',
        '第二部分：认知铺垫（Ch.01-02 + 真实案例）',
        '第三部分：学习准备阶段（部署/账号）',
        '第四部分：核心能力养成（Ch.03-05）',
        '第五部分：商业变现路径（Ch.06-08）',
        '第六部分：行业实战剧本（Ch.09-12）',
        '第七部分：收尾与转化（Ch.13）',
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
    const accent = [THEME.cyan, THEME.purple, THEME.orange, THEME.green, THEME.blue, THEME.red][i % 6];
    panel(pptx, s, x, y, cardW, cardH, accent);
    s.addText(t, {
      x: x + 0.25,
      y: y + 0.14,
      w: cardW - 0.5,
      h: cardH - 0.2,
      fontFace: FONT.body,
      fontSize: 13,
      color: THEME.text,
      margin: 0,
    });
  });

  footer(s, '建议：这一页放在“课程目录”之前');
}

// 3) Three-layer demo structure
{
  const s = pptx.addSlide();
  addBg(pptx, s);
  topBar(pptx, s, THEME.cyan);
  title(s, '关键抓手：三层展示结构', '让听众从“好酷”变成“我也能照着做”');

  const x = M;
  const w = W - 2 * M;
  const baseY = 1.55;
  const cardH = 1.05;
  const gap = 0.22;

  const cards = [
    { n: '01', t: threeLayer[0], a: THEME.cyan },
    { n: '02', t: threeLayer[1], a: THEME.purple },
    { n: '03', t: threeLayer[2], a: THEME.orange },
  ];

  cards.forEach((c, i) => {
    const y = baseY + i * (cardH + gap);
    panel(pptx, s, x, y, w, cardH, c.a);
    s.addText(c.n, {
      x: x + 0.25,
      y: y + 0.22,
      w: 0.9,
      h: 0.6,
      fontFace: FONT.title,
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
      fontFace: FONT.body,
      fontSize: 18,
      color: THEME.text,
      margin: 0,
    });
  });

  footer(s, '现场演示建议直接跑到第 3 层：端到端交付');
}

// 4) Level 1-4 definition
{
  const s = pptx.addSlide();
  addBg(pptx, s);
  topBar(pptx, s, THEME.orange);
  title(s, '目录层级（Level 1 → Level 4）', 'PPT 只做结构展示，细节用口播/讲稿');

  panel(pptx, s, M, 1.55, W - 2 * M, 3.55, THEME.orange);

  const bullets = [
    'Level 1：部分（Part）— 课程节奏与阶段目标',
    'Level 2：章节（Chapter）— 讲清楚一个关键主题',
    'Level 3：小节（Section）— 结构化拆解（why/what/how/metric）',
    'Level 4：子点（Subpoint）— 示例/工具/注意事项（尽量不塞进 PPT）',
  ];

  s.addText(bulletRuns(bullets), {
    x: M + 0.55,
    y: 1.85,
    w: W - 2 * M - 1.1,
    h: 2.6,
    fontFace: FONT.body,
    fontSize: 18,
    color: THEME.text,
    valign: 'top',
    margin: 0,
    paraSpaceAfter: 10,
  });

  s.addText('示例：第二部分（认知铺垫）→ Ch.02（能干什么）→ 小节：三层展示结构 → 子点：Demo 任务脚本', {
    x: M + 0.55,
    y: 4.35,
    w: W - 2 * M - 1.1,
    h: 0.6,
    fontFace: FONT.body,
    fontSize: 12,
    color: THEME.muted,
    margin: 0,
  });

  footer(s, '你给的反馈核心：把骨架讲清楚，不堆细节');
}

// 5) Chapters index (H2/H3 titles only), excluding deep appendix cases
{
  const filtered = headings
    .filter(h => h.level <= 3)
    .filter(h => !/^附录A｜国内检索案例库/.test(h.text))
    .filter(h => !/^A\./.test(h.text));

  const items = filtered.map(h => {
    const lvl = h.level - 2; // 0,1
    const prefix = h.level === 2 ? 'L2 ' : 'L3 ';
    return { lvl, text: prefix + h.text };
  });

  const pages = chunk(items, 22);

  pages.forEach((page, idx) => {
    const s = pptx.addSlide();
    addBg(pptx, s);
    topBar(pptx, s, THEME.blue);
    title(s, idx === 0 ? '课程目录（章节/小节）' : `课程目录（续${idx}）`, '只列标题，不放正文细节');

    panel(pptx, s, M, 1.55, W - 2 * M, 3.55, THEME.blue);

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
      x: M + 0.45,
      y: 1.82,
      w: W - 2 * M - 0.9,
      h: 3.1,
      fontFace: FONT.body,
      fontSize: 13,
      color: THEME.text,
      valign: 'top',
      margin: 0,
      paraSpaceAfter: 3,
    });

    footer(s, `目录页 ${idx + 1}/${pages.length}`);
  });
}

// 6) One slide per Part (from code block): show only “items”
{
  const maxLines = 14;
  (parts.length ? parts : []).forEach((p, i) => {
    const accent = [THEME.cyan, THEME.purple, THEME.orange, THEME.green, THEME.blue, THEME.red][i % 6];
    const items = p.items.slice(0, 18);
    const pages = chunk(items, maxLines);

    pages.forEach((page, idx) => {
      const s = pptx.addSlide();
      addBg(pptx, s);
      topBar(pptx, s, accent);
      title(s, idx === 0 ? p.title : `${p.title}（续${idx}）`, '只列本部分的章/节标题');

      panel(pptx, s, M, 1.55, W - 2 * M, 3.55, accent);

      s.addText(bulletRuns(page), {
        x: M + 0.55,
        y: 1.82,
        w: W - 2 * M - 1.1,
        h: 3.1,
        fontFace: FONT.body,
        fontSize: 14,
        color: THEME.text,
        valign: 'top',
        margin: 0,
        paraSpaceAfter: 4,
      });

      footer(s, p.title);
    });
  });
}

// Closing
{
  const s = pptx.addSlide();
  addBg(pptx, s);
  topBar(pptx, s, THEME.green);
  title(s, '收尾（给行动路径）', '让听众知道下一步怎么做');

  panel(pptx, s, M, 1.55, W - 2 * M, 3.55, THEME.green);

  const bullets = [
    '用“三层展示结构”做一次 Demo（单点 → 小工作流 → 端到端）',
    '沉淀：把输入/输出/验收写进文件（SOP/模板）',
    '做安全边界：账号/权限/自动发布默认加人工确认',
    '需要团队落地：按岗位拆 Multi-Agent，2 周做最小闭环',
  ];

  s.addText(bulletRuns(bullets), {
    x: M + 0.55,
    y: 1.82,
    w: W - 2 * M - 1.1,
    h: 3.1,
    fontFace: FONT.body,
    fontSize: 18,
    color: THEME.text,
    valign: 'top',
    margin: 0,
    paraSpaceAfter: 10,
  });

  footer(s, 'Q&A');
}

fs.mkdirSync(path.dirname(OUTPUT_PPTX), { recursive: true });
pptx.writeFile({ fileName: OUTPUT_PPTX });
console.log('Generated:', OUTPUT_PPTX, '| Slides:', pptx._slides.length);
