export default {
  id: "logaritma-grafik",
  title: "Logaritma Grafiği (y = a·log_b(x-h) + k)",
  seoTitle: "Logaritma Grafiği Çizdirme – a log_b(x-h) + k",
  category: "Grafik Oluşturma",
  description:
    "Logaritma fonksiyonunun grafiğini çiz; tanım aralığını otomatik uygula.",
  seoText: `
Logaritma: y = a·log_b(x-h) + k
Tanım: (x-h) > 0  →  x > h

- b>0 ve b≠1 olmalı
- a ölçekler, k dikey kaydırır
`.trim(),
  inputs: [
    { key: "a", label: "a", type: "number", default: 1 },
    { key: "b", label: "Taban (b)", type: "number", default: 10 },
    { key: "h", label: "h (yatay kayma)", type: "number", default: 0 },
    { key: "k", label: "k (dikey kayma)", type: "number", default: 0 },
    {
      key: "xMax",
      label: "X Max",
      type: "number",
      default: 20,
      advanced: true,
    },
  ],

  compute(v) {
    const a = num(v.a),
      b = num(v.b),
      h = num(v.h),
      k = num(v.k);
    let xMax = num(v.xMax);
    if (
      !Number.isFinite(a) ||
      !Number.isFinite(b) ||
      !Number.isFinite(h) ||
      !Number.isFinite(k)
    )
      return { hata: "Parametreler sayı olmalı." };
    if (!(b > 0) || b === 1) return { hata: "Taban b > 0 ve b ≠ 1 olmalı." };
    if (!Number.isFinite(xMax) || xMax <= h + 0.01) xMax = h + 20;

    const xMin = h + 0.05; // tanım gereği
    const pts = [];
    const rows = [];
    const n = 80;

    for (let i = 0; i <= n; i++) {
      const x = xMin + (i * (xMax - xMin)) / n;
      const y = a * (Math.log(x - h) / Math.log(b)) + k;
      pts.push([round2(x), round2(y)]);
      if (i % 16 === 0) rows.push([round2(x), round2(y)]);
    }

    const svg = makeLinePlotSvg({
      title: "Logaritma Grafiği",
      xLabel: "x",
      yLabel: "y",
      points: pts,
    });

    return {
      "Tanım Aralığı": `x > ${h}`,
      Parametreler: `a=${a}, b=${b}, h=${h}, k=${k}`,
      __plot: { svg, caption: "x>h şartı otomatik uygulanır." },
      __table: { headers: ["x", "y"], rows, note: "Örnek noktalar" },
    };
  },
};

function num(x) {
  return Number(String(x ?? "").replace(",", "."));
}
function round2(x) {
  return Number(Number(x).toFixed(2));
}
function makeLinePlotSvg(o) {
  return _makeLinePlotSvg(o);
}
function _makeLinePlotSvg({ title, xLabel, yLabel, points }) {
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
