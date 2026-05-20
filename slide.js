const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "COMPASS";

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
slide.addText("COMPASS", {
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

// ── COLUMN 1: HOW IT WORKS (5-step flow) ─────────────────────────────────────
addCard(col1X, col1W, "HOW IT WORKS");

const stepColors = ["1e3a8a", "2563eb", "3b82f6", "16a34a", "15803d"];
const steps = [
  "Faculty submits syllabus",
  "6 Claude agents analyze in parallel",
  "Feedback Agent ranks findings",
  "Select recs → get revision steps",
  "Export targeted edits to .docx",
];

steps.forEach((step, i) => {
  const sy = cardY + 0.50 + i * 0.57;
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
    x: cx + 0.42, y: sy + 0.02, w: col1X + col1W - cx - 0.55, h: 0.32,
    fontSize: 11.5, color: "1a202c", fontFace: "Calibri", margin: 0, valign: "middle",
  });

  if (i < steps.length - 1) {
    slide.addShape(pres.shapes.LINE, {
      x: cx + 0.165, y: sy + 0.33, w: 0, h: 0.24,
      line: { color: "CBD5E1", width: 1, dashType: "dash" },
    });
  }
});

// ── COLUMN 2: 6 SPECIALIZED AGENTS ──────────────────────────────────────────
addCard(col2X, col2W, "6 SPECIALIZED AGENTS");

const agents = [
  "🔍  Transparency — peer benchmarking",
  "📊  Labor Market — job demand signals",
  "🎯  Competencies — live CTDL alignment",
  "🏛️  University Strategy — institutional goals",
  "✅  Assessment — AI-proof evaluation",
  "📋  Policy — compliance check",
];

slide.addText(
  agents.map((a, i) => ({ text: a, options: { breakLine: i < agents.length - 1 } })),
  {
    x: col2X + 0.17, y: cardY + 0.50, w: col2W - 0.25, h: 2.42,
    fontSize: 12, color: "374151", fontFace: "Calibri",
    paraSpaceAfter: 5, valign: "top", margin: 0,
  }
);

// Claude Haiku badge
slide.addShape(pres.shapes.RECTANGLE, {
  x: col2X + 0.17, y: cardY + 2.68, w: col2W - 0.25, h: 0.42,
  fill: { color: "EDE9FE" }, line: { color: "C4B5FD", width: 1 },
});
slide.addText("🤖  Powered by Claude Haiku\nAll 6 agents · graceful keyword fallback", {
  x: col2X + 0.22, y: cardY + 2.70, w: col2W - 0.35, h: 0.38,
  fontSize: 9.5, color: "5b21b6", fontFace: "Calibri", valign: "middle", margin: 0,
});

// Live data badge
slide.addShape(pres.shapes.RECTANGLE, {
  x: col2X + 0.17, y: cardY + 3.10, w: col2W - 0.25, h: 0.42,
  fill: { color: "EFF6FF" }, line: { color: "BFDBFE", width: 1 },
});
slide.addText("📡  Live data: Credential Registry (CTDL)\nFetched at startup · citations link to source", {
  x: col2X + 0.22, y: cardY + 3.12, w: col2W - 0.35, h: 0.38,
  fontSize: 9.5, color: "1e40af", fontFace: "Calibri", valign: "middle", margin: 0,
});

// ── COLUMN 3: SAMPLE OUTPUT + EXPORT ────────────────────────────────────────
addCard(col3X, col3W, "SAMPLE OUTPUT — ALGORITHMS COURSE");

const recs = [
  { badge: "HIGH", fill: "FEF2F2", badgeColor: "DC2626", border: "FECACA", text: "Add Graph Algorithms module" },
  { badge: "HIGH", fill: "FEF2F2", badgeColor: "DC2626", border: "FECACA", text: "Add AI use policy" },
  { badge: "MED",  fill: "FFFBEB", badgeColor: "D97706", border: "FDE68A", text: "Whiteboard coding defense" },
  { badge: "MED",  fill: "FFFBEB", badgeColor: "D97706", border: "FDE68A", text: "Parallel algorithms unit" },
  { badge: "LOW",  fill: "F0FDF4", badgeColor: "16A34A", border: "BBF7D0", text: "Competitive programming" },
];

recs.forEach((rec, i) => {
  const cy = cardY + 0.48 + i * 0.52;
  slide.addShape(pres.shapes.RECTANGLE, {
    x: col3X + 0.17, y: cy, w: col3W - 0.25, h: 0.44,
    fill: { color: rec.fill }, line: { color: rec.border, width: 1 },
  });
  slide.addShape(pres.shapes.RECTANGLE, {
    x: col3X + 0.22, y: cy + 0.10, w: 0.46, h: 0.22,
    fill: { color: rec.badgeColor }, line: { color: rec.badgeColor },
  });
  slide.addText(rec.badge, {
    x: col3X + 0.22, y: cy + 0.10, w: 0.46, h: 0.22,
    fontSize: 8, bold: true, color: "FFFFFF", fontFace: "Calibri",
    align: "center", valign: "middle", margin: 0,
  });
  slide.addText(rec.text, {
    x: col3X + 0.75, y: cy + 0.05, w: col3W - 0.92, h: 0.35,
    fontSize: 11, color: "1a202c", fontFace: "Calibri", valign: "middle", margin: 0,
  });
});

// Export bar at the bottom of col 3
const exportY = cardY + 3.10;
slide.addShape(pres.shapes.RECTANGLE, {
  x: col3X + 0.17, y: exportY, w: col3W - 0.25, h: 0.42,
  fill: { color: "F0FDF4" }, line: { color: "BBF7D0", width: 1 },
});
slide.addText("⬇  Select improvements → export to .docx\nFaculty edits in Word or Google Docs", {
  x: col3X + 0.22, y: exportY + 0.02, w: col3W - 0.35, h: 0.38,
  fontSize: 9.5, color: "14532d", fontFace: "Calibri", valign: "middle", margin: 0,
});

// ── FOOTER ───────────────────────────────────────────────────────────────────
slide.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 4.925, w: 10, h: 0.7,
  fill: { color: "1e3a8a" }, line: { color: "1e3a8a" },
});
slide.addText(
  "COMPASS  │  Pilot: CS Algorithms  │  Data: Credential Registry (CTDL)  │  Stack: FastAPI · React · Claude Haiku  │  Wharton/Gates Build-a-thon 2026",
  {
    x: 0.3, y: 4.93, w: 9.4, h: 0.66,
    fontSize: 11, color: "CADCFC", fontFace: "Calibri",
    align: "center", valign: "middle", margin: 0,
  }
);

pres.writeFile({ fileName: "C:\\text\\Build-a-thon\\demo\\COMPASS Demo Slide.pptx" })
  .then(() => console.log("Slide written."))
  .catch(e => { console.error(e); process.exit(1); });
