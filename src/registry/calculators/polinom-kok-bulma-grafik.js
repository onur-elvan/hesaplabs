export default {
  id: "polinom-kok-bulma-grafik",
  title: "Polinom Grafiği + Kök Bulma (Gerçek Kökler)",
  seoTitle: "Polinom Grafiği Çizdirme ve Kök Bulma – Sayısal Yöntem",
  category: "Grafik Oluşturma",
  description:
    "Katsayıları gir (en büyük dereceden sabite). Polinom grafiğini çiz ve gerçek kökleri tarama + bisection ile bul.",
  seoText: `
Polinom: a_n x^n + ... + a_1 x + a_0

Bu araç:
- Grafiği çizer
- Seçtiğin aralıkta işaret değişimlerinden gerçek kökleri bulur (bisection)
Not: Karmaşık kökler gösterilmez.
`.trim(),
  inputs: [
    {
      key: "coeffs",
      label: "Katsayılar (en yüksek dereceden sabite, virgülle)",
      type: "text",
      placeholder: "Örn: 1, -3, -4  (x^2 - 3x - 4)",
      default: "1,-3,-4",
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
      key: "scanStep",
      label: "Tarama adımı",
      type: "select",
      default: "0.2",
      advanced: true,
      options: [
        { label: "0.1", value: "0.1" },
        { label: "0.2", value: "0.2" },
        { label: "0.5", value: "0.5" },
        { label: "1", value: "1" },
      ],
    },
  ],

  compute(v) {
    const coeffs = String(v.coeffs || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map(num);

    if (coeffs.length < 2 || coeffs.some((c) => !Number.isFinite(c))) {
      return { hata: "Katsayıları doğru formatta gir (örn: 1,-3,-4)." };
    }

    let xMin = num(v.xMin),
      xMax = num(v.xMax);
    const step = num(v.scanStep || 0.2);
    if (xMin >= xMax) return { hata: "X Min < X Max olmalı." };
    if (step <= 0) return { hata: "Tarama adımı 0'dan büyük olmalı." };

    const f = (x) => poly(coeffs, x);

    // plot points
    const pts = [];
    const n = 160;
    for (let i = 0; i <= n; i++) {
      const x = xMin + (i * (xMax - xMin)) / n;
      const y = f(x);
      if (Number.isFinite(y)) pts.push([round2(x), round2(y)]);
    }
    if (pts.length < 2)
      return { hata: "Grafik üretilemedi (çok büyük/NaN). Aralığı küçült." };

    // root scan
    const roots = [];
    let prevX = xMin;
    let prevY = f(prevX);

    for (let x = xMin + step; x <= xMax + 1e-9; x += step) {
      const y = f(x);

      if (Number.isFinite(prevY) && Number.isFinite(y)) {
        // exact near zero
        if (Math.abs(y) < 1e-8) addRoot(roots, x);
        // sign change
        if (prevY === 0) addRoot(roots, prevX);
        if (prevY * y < 0) {
          const r = bisect(f, prevX, x, 60);
          if (Number.isFinite(r)) addRoot(roots, r);
        }
      }

      prevX = x;
      prevY = y;
    }

    roots.sort((a, b) => a - b);

    const svg = makeLinePlotSvg({
      title: "Polinom Grafiği",
      xLabel: "x",
      yLabel: "y",
      points: pts,
    });

    return {
      Derece: coeffs.length - 1,
      "Bulunan Gerçek Kök Sayısı": roots.length,
      "Kökler (yaklaşık)": roots.length
        ? roots.map((r) => round4(r)).join(", ")
        : "Bulunamadı",
      __plot: {
        svg,
        caption: "Gerçek kökler işaret değişimi + bisection ile aranır.",
      },
      __table: {
        headers: ["Kök (x)"],
        rows: roots.map((r) => [round4(r)]),
        note: "Not: Karmaşık kökler listelenmez.",
      },
    };
  },
};

function poly(coeffs, x) {
  // Horner
  let y = 0;
  for (const a of coeffs) y = y * x + a;
  return y;
}
function bisect(f, a, b, it = 60) {
  let fa = f(a),
    fb = f(b);
  if (!Number.isFinite(fa) || !Number.isFinite(fb)) return NaN;
  if (fa === 0) return a;
  if (fb === 0) return b;
  if (fa * fb > 0) return NaN;

  let lo = a,
    hi = b;
  for (let i = 0; i < it; i++) {
    const mid = (lo + hi) / 2;
    const fm = f(mid);
    if (!Number.isFinite(fm)) return NaN;
    if (Math.abs(fm) < 1e-10) return mid;
    if (fa * fm < 0) {
      hi = mid;
      fb = fm;
    } else {
      lo = mid;
      fa = fm;
    }
  }
  return (lo + hi) / 2;
}
function addRoot(arr, x) {
  // yakın kökleri birleştir
  for (const r of arr) if (Math.abs(r - x) < 1e-3) return;
  arr.push(x);
}

function num(x) {
  return Number(String(x ?? "").replace(",", "."));
}
function round2(x) {
  return Number(Number(x).toFixed(2));
}
function round4(x) {
  return Number(Number(x).toFixed(4));
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
