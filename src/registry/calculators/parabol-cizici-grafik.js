export default {
  id: "parabol-cizici-grafik",
  title: "Parabol Çizici (y = ax² + bx + c) + Tepe Noktası + Kökler",
  seoTitle: "Parabol Grafiği Çizdirme – Tepe Noktası ve Kökler",
  category: "Grafik Oluşturma",
  description:
    "a, b, c gir. Parabolü çiz, tepe noktasını ve varsa gerçek kökleri hesapla.",
  seoText: `
Parabol: y = ax² + bx + c

1) Tepe Noktası (vertex)
- Parabolün dönüm noktasıdır.
- x_tepe = -b / (2a)
- y_tepe = f(x_tepe)

2) Kökler (x eksenini kestiği yerler)
- ax² + bx + c = 0 denkleminin çözümleridir.
- Diskriminant: Δ = b² - 4ac
  - Δ > 0 → 2 gerçek kök
  - Δ = 0 → 1 çift katlı kök
  - Δ < 0 → gerçek kök yok (kökler karmaşıktır)

3) Açılma yönü
- a > 0 → yukarı açılır (∪)
- a < 0 → aşağı açılır (∩)

Bu araç hem grafiği hem de bu bilgileri “ders gibi” çıkartır.
`.trim(),
  inputs: [
    { key: "a", label: "a", type: "number", default: 1 },
    { key: "b", label: "b", type: "number", default: 0 },
    { key: "c", label: "c", type: "number", default: 0 },
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
      b = num(v.b),
      c = num(v.c);
    let xMin = num(v.xMin),
      xMax = num(v.xMax);

    if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(c)) {
      return { hata: "a, b, c sayısal olmalı." };
    }
    if (a === 0)
      return { hata: "a = 0 olamaz (bu parabol değil, doğru olur)." };
    if (!(xMin < xMax)) return { hata: "X Min < X Max olmalı." };

    const f = (x) => a * x * x + b * x + c;

    // tepe
    const xv = -b / (2 * a);
    const yv = f(xv);

    // diskriminant
    const D = b * b - 4 * a * c;

    let rootsText = "Gerçek kök yok";
    let r1 = NaN,
      r2 = NaN;
    if (D > 0) {
      const s = Math.sqrt(D);
      r1 = (-b - s) / (2 * a);
      r2 = (-b + s) / (2 * a);
      rootsText = `${round4(r1)}, ${round4(r2)}`;
    } else if (D === 0) {
      r1 = -b / (2 * a);
      rootsText = `${round4(r1)} (çift katlı)`;
    }

    // points
    const n = 260;
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const x = xMin + (i * (xMax - xMin)) / n;
      pts.push([x, f(x)]);
    }

    // SVG (tepe ve kökleri işaretle)
    const svg = makeParabolaSvg({
      title: "Parabol Grafiği",
      xLabel: "x",
      yLabel: "y",
      points: pts,
      markers: [
        { x: xv, y: yv, label: "Tepe" },
        ...(Number.isFinite(r1) ? [{ x: r1, y: 0, label: "Kök" }] : []),
        ...(Number.isFinite(r2) && r2 !== r1
          ? [{ x: r2, y: 0, label: "Kök" }]
          : []),
      ],
    });

    return {
      Denklem: `y = ${a}x² + ${b}x + ${c}`,
      "Açılma Yönü": a > 0 ? "Yukarı (∪)" : "Aşağı (∩)",
      "Tepe Noktası": `(${round4(xv)}, ${round4(yv)})`,
      "Δ (Diskriminant)": D,
      Kökler: rootsText,
      __plot: {
        svg,
        caption: "Tepe noktası ve kökler (varsa) grafikte işaretlidir.",
      },
      __table: {
        headers: ["x", "y"],
        rows: sampleRows(f, xMin, xMax, 9),
        note: "Örnek değerler tablosu",
      },
    };
  },
};

/* ---- svg helper (işaretli) ---- */
function makeParabolaSvg({ title, xLabel, yLabel, points, markers }) {
  return makePlotSvg({ title, xLabel, yLabel, points, markers });
}

function makePlotSvg({ title, xLabel, yLabel, points, markers }) {
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

  const markerSvg = (markers || [])
    .filter((m) => Number.isFinite(m.x) && Number.isFinite(m.y))
    .map((m) => {
      const cx = px(m.x),
        cy = py(m.y);
      return `
        <circle cx="${cx}" cy="${cy}" r="5" fill="#f97316"/>
        <text x="${cx + 8}" y="${cy - 8}" font-size="12" fill="#0f172a">${esc(
        m.label || ""
      )}</text>
      `;
    })
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
  ${markerSvg}

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
