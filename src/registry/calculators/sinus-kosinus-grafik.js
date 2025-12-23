export default {
  id: "sinus-kosinus-grafik",
  title: "Sinüs / Kosinüs Grafiği (Genlik, Periyot, Faz, Dikey Kayma)",
  seoTitle: "Sinüs Kosinüs Grafiği Çizdirme – Genlik Periyot Faz Kayma",
  category: "Grafik Oluşturma",
  description:
    "Sinüs veya kosinüs seç. Genlik (A), periyot (T), faz (φ) ve dikey kayma (D) ile grafiği oluştur.",
  seoText: `
Trigonometrik fonksiyonlar dalga gibi davranır.

Genel form:
y = A · sin( 2π/T · (x - φ) ) + D
veya
y = A · cos( 2π/T · (x - φ) ) + D

Parametreler:
- A (genlik): tepe yüksekliği. |A| büyürse dalga büyür.
- T (periyot): dalganın bir turda kaç birimde tekrar ettiğini söyler.
- φ (faz kayması): grafiği sağa/sola kaydırır.
- D (dikey kayma): grafiği yukarı/aşağı taşır.

Önemli:
- sin/cos değerleri -1 ile +1 arasındadır.
- A ile çarpınca aralık [-A, +A] olur.
- D ekleyince tüm grafik yukarı/aşağı kayar.
`.trim(),
  inputs: [
    {
      key: "type",
      label: "Fonksiyon",
      type: "select",
      default: "sin",
      options: [
        { label: "Sinüs (sin)", value: "sin" },
        { label: "Kosinüs (cos)", value: "cos" },
      ],
    },
    { key: "A", label: "Genlik (A)", type: "number", default: 1 },
    { key: "T", label: "Periyot (T)", type: "number", default: 6.28318 }, // ~2π
    {
      key: "phi",
      label: "Faz Kayması (φ)",
      type: "number",
      default: 0,
      advanced: true,
    },
    {
      key: "D",
      label: "Dikey Kayma (D)",
      type: "number",
      default: 0,
      advanced: true,
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
  ],

  compute(v) {
    const type = String(v.type || "sin");
    const A = num(v.A);
    const T = num(v.T);
    const phi = num(v.phi);
    const D = num(v.D);
    let xMin = num(v.xMin);
    let xMax = num(v.xMax);

    if (
      !Number.isFinite(A) ||
      !Number.isFinite(T) ||
      !Number.isFinite(phi) ||
      !Number.isFinite(D)
    ) {
      return { hata: "A, T, φ, D sayısal olmalı." };
    }
    if (!(T > 0)) return { hata: "Periyot (T) 0'dan büyük olmalı." };
    if (!(xMin < xMax)) return { hata: "X Min < X Max olmalı." };

    const w = (2 * Math.PI) / T;
    const f = (x) => {
      const u = w * (x - phi);
      const base = type === "cos" ? Math.cos(u) : Math.sin(u);
      return A * base + D;
    };

    const n = 240;
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const x = xMin + (i * (xMax - xMin)) / n;
      const y = f(x);
      pts.push([x, y]);
    }

    const svg = makeSvg({
      title: type === "cos" ? "Kosinüs Grafiği" : "Sinüs Grafiği",
      xLabel: "x",
      yLabel: "y",
      points: pts,
    });

    // önemli noktalar: tepe/çukur/orta çizgi bilgisi
    const yMax = D + Math.abs(A);
    const yMin = D - Math.abs(A);

    return {
      Fonksiyon: type === "cos" ? "cos" : "sin",
      "Genlik (A)": A,
      "Periyot (T)": T,
      "Faz (φ)": phi,
      "Dikey Kayma (D)": D,
      "Maksimum Değer": yMax,
      "Minimum Değer": yMin,
      __plot: {
        svg,
        caption:
          "Genlik: dalga yüksekliği, Periyot: tekrar süresi, Faz: yatay kayma, D: dikey kayma.",
      },
      __table: {
        headers: ["x", "y"],
        rows: sampleRows(f, xMin, xMax, 9),
        note: "Örnek değerler tablosu",
      },
    };
  },
};

/* --- helper svg (kaliteli) --- */
function makeSvg({ title, xLabel, yLabel, points }) {
  // fonksiyon grafiği için yukarıdaki dosyadakiyle aynı kaliteyi kullanıyoruz
  return makeFunctionPlotSvg({ title, xLabel, yLabel, points });
}

function makeFunctionPlotSvg({ title, xLabel, yLabel, points }) {
  const W = 820,
    H = 460,
    padL = 70,
    padR = 30,
    padT = 38,
    padB = 70;

  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]).filter(Number.isFinite);

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
    dy = (maxY - minY) * 0.12;
  minX -= dx;
  maxX += dx;
  minY -= dy;
  maxY += dy;

  const px = (x) => padL + ((x - minX) / (maxX - minX)) * (W - padL - padR);
  const py = (y) => padT + (1 - (y - minY) / (maxY - minY)) * (H - padT - padB);

  const x0Inside = minX <= 0 && 0 <= maxX;
  const y0Inside = minY <= 0 && 0 <= maxY;
  const xAxisY = y0Inside ? py(0) : py(minY);
  const yAxisX = x0Inside ? px(0) : px(minX);

  const ticksX = niceTicks(minX, maxX, 6);
  const ticksY = niceTicks(minY, maxY, 6);

  const grid =
    ticksX
      .map(
        (t) =>
          `<line x1="${px(t)}" y1="${padT}" x2="${px(t)}" y2="${
            H - padB
          }" stroke="#eef2f7"/>`
      )
      .join("") +
    ticksY
      .map(
        (t) =>
          `<line x1="${padL}" y1="${py(t)}" x2="${W - padR}" y2="${py(
            t
          )}" stroke="#eef2f7"/>`
      )
      .join("");

  const poly = points
    .map(([x, y]) => `${px(x).toFixed(2)},${py(y).toFixed(2)}`)
    .join(" ");

  const xTicks = ticksX
    .map(
      (t) => `
    <line x1="${px(t)}" y1="${xAxisY}" x2="${px(t)}" y2="${
        xAxisY + 6
      }" stroke="#94a3b8"/>
    <text x="${px(t)}" y="${
        xAxisY + 22
      }" text-anchor="middle" font-size="12" fill="#475569">${fmtTick(t)}</text>
  `
    )
    .join("");

  const yTicks = ticksY
    .map(
      (t) => `
    <line x1="${yAxisX - 6}" y1="${py(t)}" x2="${yAxisX}" y2="${py(
        t
      )}" stroke="#94a3b8"/>
    <text x="${yAxisX - 10}" y="${
        py(t) + 4
      }" text-anchor="end" font-size="12" fill="#475569">${fmtTick(t)}</text>
  `
    )
    .join("");

  return `
<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="white"/>
  <text x="${
    W / 2
  }" y="22" text-anchor="middle" font-size="15" fill="#0f172a">${esc(
    title || ""
  )}</text>

  ${grid}

  <line x1="${padL}" y1="${xAxisY}" x2="${
    W - padR
  }" y2="${xAxisY}" stroke="#94a3b8"/>
  <line x1="${yAxisX}" y1="${padT}" x2="${yAxisX}" y2="${
    H - padB
  }" stroke="#94a3b8"/>

  <path d="M ${W - padR} ${xAxisY} l -10 -5 l 0 10 Z" fill="#94a3b8"/>
  <path d="M ${yAxisX} ${padT} l -5 10 l 10 0 Z" fill="#94a3b8"/>

  ${xTicks}
  ${yTicks}

  <polyline points="${poly}" fill="none" stroke="#2563eb" stroke-width="2.6"/>
  <text x="${W / 2}" y="${
    H - 18
  }" text-anchor="middle" font-size="13" fill="#334155">${esc(
    xLabel || ""
  )}</text>
  <text x="20" y="${
    H / 2
  }" text-anchor="middle" font-size="13" fill="#334155" transform="rotate(-90 20 ${
    H / 2
  })">${esc(yLabel || "")}</text>
</svg>`.trim();
}

function sampleRows(f, xMin, xMax, k) {
  const rows = [];
  const step = (xMax - xMin) / (k - 1);
  for (let i = 0; i < k; i++) {
    const x = xMin + i * step;
    rows.push([round3(x), round3(f(x))]);
  }
  return rows;
}

function niceTicks(min, max, count) {
  const span = max - min;
  const raw = span / (count - 1);
  const step = niceStep(raw);
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const t = [];
  for (let v = start; v <= end + 1e-9; v += step) t.push(v);
  if (t.length > count + 3) {
    const k = Math.ceil(t.length / (count + 2));
    return t.filter((_, i) => i % k === 0);
  }
  return t;
}
function niceStep(x) {
  const pow = Math.pow(10, Math.floor(Math.log10(x)));
  const n = x / pow;
  if (n < 1.5) return 1 * pow;
  if (n < 3) return 2 * pow;
  if (n < 7) return 5 * pow;
  return 10 * pow;
}
function fmtTick(x) {
  const ax = Math.abs(x);
  if (ax >= 1000) return String(Math.round(x));
  if (ax >= 10) return String(round2(x));
  if (ax >= 1) return String(round3(x));
  return String(round4(x));
}
function num(x) {
  return Number(String(x ?? "").replace(",", "."));
}
function round2(x) {
  return Number(Number(x).toFixed(2));
}
function round3(x) {
  return Number(Number(x).toFixed(3));
}
function round4(x) {
  return Number(Number(x).toFixed(4));
}
function esc(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
