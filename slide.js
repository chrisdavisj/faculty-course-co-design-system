const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "Faculty Course Co-Design System";

const slide = pres.addSlide();
slide.background = { color: "F0F4F8" };

const makeShadow = () => ({
  type: "outer", blur: 8, offset: 2, angle: 135, color: "000000", opacity: 0.09,
});

// ── HEADER BAR ──────────────────────────────────────────────────────────────
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 1.05,
  fill: { color: "1e3a8a" }, line: { color: "1e3a8a" },
});
slide.addText("Faculty Course Co-Design System", {
  x: 0.4, y: 0.07, w: 9.2, h: 0.52,
  fontSize: 26, bold: true, color: "FFFFFF", fontFace: "Calibri", margin: 0,
});
slide.addText("AI-powered curriculum alignment for higher education faculty", {
  x: 0.4, y: 0.62, w: 9.2, h: 0.35,
  fontSize: 13, color: "CADCFC", fontFace: "Calibri", margin: 0,
});

// ── LAYOUT CONSTANTS ─────────────────────────────────────────────────────────
const cardY = 1.15;
const cardH = 3.65;
const col1X = 0.2,  col1W = 2.9;
const col2X = 3.4,  col2W = 3.05;
const col3X = 6.75, col3W = 3.05;

function addCard(x, w, label) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y: cardY, w, h: cardH,
    fill: { color: "FFFFFF" }, shadow: makeShadow(), line: { color: "E2E8F0", width: 1 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y: cardY, w: 0.07, h: cardH,
    fill: { color: "1e3a8a" }, line: { color: "1e3a8a" },
  });
  slide.addText(label, {
    x: x + 0.17, y: cardY + 0.12, w: w - 0.25, h: 0.28,
    fontSize: 9, bold: true, color: "1e3a8a", fontFace: "Calibri",
    charSpacing: 1, margin: 0,
  });
}

// ── COLUMN 1: HOW IT WORKS ───────────────────────────────────────────────────
addCard(col1X, col1W, "HOW IT WORKS");

const stepColors = ["1e3a8a", "2563eb", "3b82f6", "60a5fa"];
const steps = [
  "Faculty uploads syllabus",
  "6 AI agents analyze in parallel",
  "Feedback Agent prioritizes findings",
  "Faculty reviews inline suggestions",
];

steps.forEach((step, i) => {
  const sy = cardY + 0.58 + i * 0.72;
  const cx = col1X + 0.18;

  slide.addShape(pres.shapes.OVAL, {
    x: cx, y: sy, w: 0.33, h: 0.33,
    fill: { color: stepColors[i] }, line: { color: stepColors[i] },
  });
  slide.addText(String(i + 1), {
    x: cx, y: sy, w: 0.33, h: 0.33,
    fontSize: 11, bold: true, color: "FFFFFF", fontFace: "Calibri",
    align: "center", valign: "middle", margin: 0,
  });
  slide.addText(step, {
    x: cx + 0.42, y: sy + 0.02, w: col1X + col1W - cx - 0.55, h: 0.3,
    fontSize: 12, color: "1a202c", fontFace: "Calibri", margin: 0, valign: "middle",
  });

  if (i < steps.length - 1) {
    slide.addShape(pres.shapes.LINE, {
      x: cx + 0.165, y: sy + 0.33, w: 0, h: 0.39,
      line: { color: "CBD5E1", width: 1, dashType: "dash" },
    });
  }
});

// ── COLUMN 2: 6 SPECIALIZED AGENTS ──────────────────────────────────────────
addCard(col2X, col2W, "6 SPECIALIZED AGENTS");

const agents = [
  "🔍  Transparency — peer benchmarking",
  "📊  Labor Market — job demand signals",
  "🎯  Competencies — ACM/credential alignment",
  "🏛️  University Strategy — institutional goals",
  "✅  Assessment — AI-proof evaluation design",
  "📋  Policy — compliance check",
];

slide.addText(
  agents.map((a, i) => ({ text: a, options: { breakLine: i < agents.length - 1 } })),
  {
    x: col2X + 0.17, y: cardY + 0.52, w: col2W - 0.25, h: 3.0,
    fontSize: 12.5, color: "374151", fontFace: "Calibri",
    paraSpaceAfter: 6, valign: "top", margin: 0,
  }
);

// ── COLUMN 3: SAMPLE OUTPUT ──────────────────────────────────────────────────
addCard(col3X, col3W, "SAMPLE OUTPUT — ALGORITHMS COURSE");

const recs = [
  { badge: "HIGH", fill: "FEF2F2", badgeColor: "DC2626", border: "FECACA", text: "Add Graph Algorithms module" },
  { badge: "HIGH", fill: "FEF2F2", badgeColor: "DC2626", border: "FECACA", text: "Add AI use policy" },
  { badge: "MED",  fill: "FFFBEB", badgeColor: "D97706", border: "FDE68A", text: "Whiteboard coding defense" },
  { badge: "MED",  fill: "FFFBEB", badgeColor: "D97706", border: "FDE68A", text: "Parallel algorithms unit" },
  { badge: "LOW",  fill: "F0FDF4", badgeColor: "16A34A", border: "BBF7D0", text: "Competitive programming project" },
];

recs.forEach((rec, i) => {
  const cy = cardY + 0.52 + i * 0.61;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: col3X + 0.17, y: cy, w: col3W - 0.25, h: 0.5,
    fill: { color: rec.fill }, line: { color: rec.border, width: 1 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: col3X + 0.22, y: cy + 0.1, w: 0.46, h: 0.22,
    fill: { color: rec.badgeColor }, line: { color: rec.badgeColor },
  });
  slide.addText(rec.badge, {
    x: col3X + 0.22, y: cy + 0.1, w: 0.46, h: 0.22,
    fontSize: 8, bold: true, color: "FFFFFF", fontFace: "Calibri",
    align: "center", valign: "middle", margin: 0,
  });
  slide.addText(rec.text, {
    x: col3X + 0.75, y: cy + 0.06, w: col3W - 0.9, h: 0.38,
    fontSize: 11.5, color: "1a202c", fontFace: "Calibri", valign: "middle", margin: 0,
  });
});

// ── FOOTER ───────────────────────────────────────────────────────────────────
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 4.925, w: 10, h: 0.7,
  fill: { color: "1e3a8a" }, line: { color: "1e3a8a" },
});
slide.addText(
  "Pilot: CS Algorithms course  │  Stack: FastAPI + React + Claude API  │  Build-a-thon 2026",
  {
    x: 0.3, y: 4.93, w: 9.4, h: 0.66,
    fontSize: 11, color: "CADCFC", fontFace: "Calibri",
    align: "center", valign: "middle", margin: 0,
  }
);

pres.writeFile({ fileName: "C:\\text\\Build-a-thon\\demo\\Faculty Co-Design Demo Slide.pptx" })
  .then(() => console.log("Slide written."))
  .catch(e => { console.error(e); process.exit(1); });
