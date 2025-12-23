export default {
  id: "mutlak-deger-grafik",
  title: "Mutlak Değer Grafiği (y = a|x-h| + k)",
  seoTitle: "Mutlak Değer Grafiği Çizdirme – a|x-h|+k",
  category: "Grafik Oluşturma",
  description:
    "a, h, k değerlerini gir; V şeklindeki mutlak değer grafiğini çiz.",
  seoText: `
Mutlak değer grafiği genelde V şeklindedir:
y = a|x-h| + k

- (h, k) tepe noktasıdır.
- a büyüdükçe grafik daralır, a<0 ise aşağı bakar.
`.trim(),
  inputs: [
    { key: "a", label: "a", type: "number", default: 1 },
    { key: "h", label: "h (yatay kayma)", type: "number", default: 0 },
    { key: "k", label: "k (dikey kayma)", type: "number", default: 0 },
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
  ],
  compute(v) {
    const a = num(v.a),
      h = num(v.h),
      k = num(v.k);
    let xMin = num(v.xMin),
      xMax = num(v.xMax);
    if (xMin >= xMax) return { hata: "X Min < X Max olmalı." };

    const pts = [];
    const rows = [];
    const step = (xMax - xMin) / 60;

    for (let x = xMin; x <= xMax + 1e-9; x += step) {
      const y = a * Math.abs(x - h) + k;
      pts.push([round2(x), round2(y)]);
    }

    // küçük tablo
    const sample = [h - 2, h - 1, h, h + 1, h + 2].filter(
      (x) => x >= xMin && x <= xMax
    );
    for (const x of sample)
      rows.push([round2(x), round2(a * Math.abs(x - h) + k)]);

    const svg = makeLinePlotSvg({
      title: "Mutlak Değer Grafiği",
      xLabel: "x",
      yLabel: "y",
      points: pts,
    });

    return {
      "Tepe Noktası": `(${h}, ${k})`,
      Parametreler: `a=${a}, h=${h}, k=${k}`,
      __plot: { svg, caption: "y = a|x-h| + k" },
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

// aynı helper
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
