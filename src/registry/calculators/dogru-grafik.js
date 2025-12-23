export default {
  id: "dogru-grafik",
  title: "Doğru Grafiği (y = mx + b)",
  seoTitle: "Doğru Grafiği Çizdirme – y = mx + b",
  category: "Grafik Oluşturma",
  description:
    "m ve b değerlerini gir, y = mx + b doğrusunu çiz ve tablo üret.",
  seoText: `
Doğru denklemi: y = m x + b

Bu araç:
- Doğru grafiğini çizer
- İstersen belirli aralıkta tablo oluşturur
`.trim(),
  inputs: [
    { key: "m", label: "Eğim (m)", type: "number", placeholder: "Örn: 2" },
    {
      key: "b",
      label: "Y-kesişim (b)",
      type: "number",
      placeholder: "Örn: -3",
    },
    {
      key: "xMin",
      label: "X Min",
      type: "number",
      default: -10,
      advanced: true,
    },
    {
      key: "xMax",
      label: "X Max",
      type: "number",
      default: 10,
      advanced: true,
    },
    {
      key: "step",
      label: "Tablo adımı",
      type: "select",
      default: "1",
      advanced: true,
      options: [
        { label: "0.5", value: "0.5" },
        { label: "1", value: "1" },
        { label: "2", value: "2" },
      ],
    },
  ],

  compute(v) {
    const m = num(v.m);
    const b = num(v.b);
    if (!Number.isFinite(m) || !Number.isFinite(b))
      return { hata: "m ve b sayı olmalı." };

    let xMin = num(v.xMin);
    let xMax = num(v.xMax);
    const step = num(v.step || 1);

    if (!Number.isFinite(xMin)) xMin = -10;
    if (!Number.isFinite(xMax)) xMax = 10;
    if (xMin >= xMax) return { hata: "X Min < X Max olmalı." };
    if (step <= 0) return { hata: "Adım 0'dan büyük olmalı." };

    const pts = [];
    const rows = [];
    for (let x = xMin; x <= xMax + 1e-9; x += step) {
      const y = m * x + b;
      const xx = round2(x);
      const yy = round2(y);
      pts.push([xx, yy]);
      rows.push([xx, yy]);
    }

    const svg = makeLinePlotSvg({
      title: "Doğru Grafiği",
      xLabel: "x",
      yLabel: "y",
      points: pts,
    });

    return {
      "Eğim (m)": m,
      "Y-kesişim (b)": b,
      "X aralığı": `${xMin} … ${xMax}`,
      __plot: { svg, caption: "y = mx + b" },
      __table: {
        headers: ["x", "y"],
        rows,
        note: "Tablo: seçilen aralıkta doğru üzerindeki noktalar",
      },
    };
  },
};

function num(x) {
  return Number(String(x ?? "").replace(",", "."));
}
function round2(x) {
  return Number(Number(x).toFixed(2));
}

function makeLinePlotSvg({ title, xLabel, yLabel, points }) {
  const W = 720,
    H = 420,
    padL = 60,
    padR = 20,
    padT = 30,
    padB = 55;
  const xs = points.map((p) => p[0]),
    ys = points.map((p) => p[1]);
  let minX = Math.min(...xs),
    maxX = Math.max(...xs);
  let minY = Math.min(...ys),
    maxY = Math.max(...ys);
  if (minX === maxX) {
    minX -= 1;
    maxX += 1;
  }
  if (minY === maxY) {
    minY -= 1;
    maxY += 1;
  }
  const dx = (maxX - minX) * 0.08,
    dy = (maxY - minY) * 0.08;
  minX -= dx;
  maxX += dx;
  minY -= dy;
  maxY += dy;

  const px = (x) => padL + ((x - minX) / (maxX - minX)) * (W - padL - padR);
  const py = (y) => padT + (1 - (y - minY) / (maxY - minY)) * (H - padT - padB);

  const poly = points
    .map(([x, y]) => `${px(x).toFixed(2)},${py(y).toFixed(2)}`)
    .join(" ");
  const x0Inside = minX <= 0 && 0 <= maxX;
  const y0Inside = minY <= 0 && 0 <= maxY;
  const xAxisY = y0Inside ? py(0) : py(minY);
  const yAxisX = x0Inside ? px(0) : px(minX);

  return `
<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="white"/>
  <text x="${
    W / 2
  }" y="18" text-anchor="middle" font-size="14" fill="#0f172a">${esc(
    title || ""
  )}</text>
  ${grid(W, H, padL, padR, padT, padB)}
  <line x1="${padL}" y1="${xAxisY}" x2="${
    W - padR
  }" y2="${xAxisY}" stroke="#94a3b8"/>
  <line x1="${yAxisX}" y1="${padT}" x2="${yAxisX}" y2="${
    H - padB
  }" stroke="#94a3b8"/>
  <polyline points="${poly}" fill="none" stroke="#2563eb" stroke-width="2.5"/>
  ${points
    .map(
      ([x, y]) => `<circle cx="${px(x)}" cy="${py(y)}" r="3.8" fill="#2563eb"/>`
    )
    .join("")}
  <text x="${W / 2}" y="${
    H - 15
  }" text-anchor="middle" font-size="13" fill="#334155">${esc(
    xLabel || ""
  )}</text>
  <text x="18" y="${
    H / 2
  }" text-anchor="middle" font-size="13" fill="#334155" transform="rotate(-90 18 ${
    H / 2
  })">${esc(yLabel || "")}</text>
</svg>`.trim();
}
function grid(W, H, padL, padR, padT, padB) {
  const v = Array.from({ length: 6 })
    .map((_, i) => {
      const x = padL + (i * (W - padL - padR)) / 5;
      return `<line x1="${x}" y1="${padT}" x2="${x}" y2="${
        H - padB
      }" stroke="#eef2f7"/>`;
    })
    .join("");
  const h = Array.from({ length: 6 })
    .map((_, i) => {
      const y = padT + (i * (H - padT - padB)) / 5;
      return `<line x1="${padL}" y1="${y}" x2="${
        W - padR
      }" y2="${y}" stroke="#eef2f7"/>`;
    })
    .join("");
  return v + h;
}
function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
