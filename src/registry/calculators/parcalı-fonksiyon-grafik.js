export default {
  id: "parcali-fonksiyon-grafik",
  title: "Parçalı Fonksiyon Grafiği (Kırılma Noktalı)",
  seoTitle: "Parçalı Fonksiyon Grafiği Çizdirme – Sol/Sağ İfade",
  category: "Grafik Oluşturma",
  description:
    "Kırılma noktası c seç. x≤c için bir ifade, x>c için başka ifade gir. Grafik otomatik çizilir.",
  seoText: `
Parçalı fonksiyon örneği:
x ≤ c için: f(x)=x^2
x > c için: f(x)=2x+1

Bu araç, iki parçalı fonksiyonun grafiğini çizer.
`.trim(),
  inputs: [
    { key: "c", label: "Kırılma noktası (c)", type: "number", default: 0 },
    {
      key: "left",
      label: "Sol ifade (x ≤ c)",
      type: "text",
      placeholder: "Örn: x^2",
      default: "x^2",
    },
    {
      key: "right",
      label: "Sağ ifade (x > c)",
      type: "text",
      placeholder: "Örn: 2x+1",
      default: "2x+1",
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
    const c = num(v.c);
    const leftExpr = String(v.left || "").trim();
    const rightExpr = String(v.right || "").trim();
    let xMin = num(v.xMin),
      xMax = num(v.xMax);
    if (xMin >= xMax) return { hata: "X Min < X Max olmalı." };
    if (!leftExpr || !rightExpr)
      return { hata: "Sol ve sağ ifadeler boş olamaz." };

    const fL = compileExpr(leftExpr);
    const fR = compileExpr(rightExpr);
    if (!fL.ok) return { hata: `Sol ifade hatalı: ${fL.err}` };
    if (!fR.ok) return { hata: `Sağ ifade hatalı: ${fR.err}` };

    const pts = [];
    const rows = [];
    const n = 120;

    for (let i = 0; i <= n; i++) {
      const x = xMin + (i * (xMax - xMin)) / n;
      const y = x <= c ? fL.fn(x) : fR.fn(x);
      if (!Number.isFinite(y)) continue;
      pts.push([round2(x), round2(y)]);
      if (i % 24 === 0)
        rows.push([round2(x), round2(y), x <= c ? "sol" : "sağ"]);
    }

    if (pts.length < 2)
      return {
        hata: "Grafik üretilemedi (tanımsız değerler). Aralığı değiştir.",
      };

    const svg = makeLinePlotSvg({
      title: "Parçalı Fonksiyon",
      xLabel: "x",
      yLabel: "y",
      points: pts,
    });

    return {
      "Kırılma Noktası": c,
      "Sol (x≤c)": leftExpr,
      "Sağ (x>c)": rightExpr,
      __plot: { svg, caption: "İki parçalı fonksiyon (x≤c ve x>c)." },
      __table: { headers: ["x", "y", "parça"], rows, note: "Örnek noktalar" },
    };
  },
};

// --- expression (güvenli/sade) ---
function compileExpr(expr) {
  // izinli karakterler: sayı, x, + - * / ^ ( ) . boşluk, ve math fonksiyon isimleri
  const cleaned = expr.replace(/\s+/g, "").toLowerCase();

  // çok kaba güvenlik: sadece bu karakterler
  if (!/^[0-9x+\-*/^().,a-z]*$/.test(cleaned)) {
    return { ok: false, err: "Geçersiz karakter var." };
  }

  // desteklenen fonksiyonlar
  // sin,cos,tan,abs,sqrt,log,ln,exp,pow
  // pi,e
  let js = cleaned
    .replaceAll("pi", "Math.PI")
    .replaceAll("e", "Math.E")
    .replaceAll("sin", "Math.sin")
    .replaceAll("cos", "Math.cos")
    .replaceAll("tan", "Math.tan")
    .replaceAll("abs", "Math.abs")
    .replaceAll("sqrt", "Math.sqrt")
    .replaceAll("exp", "Math.exp")
    .replaceAll("ln", "Math.log")
    .replaceAll("log", "Math.log") // doğal log
    .replaceAll("^", "**");

  // implicit çarpma (2x, x2) basit destek:
  js = js
    .replace(/(\d)(x)/g, "$1*$2")
    .replace(/(x)(\d)/g, "$1*$2")
    .replace(/(\))(x)/g, "$1*$2")
    .replace(/(x)(\()/g, "$1*$2")
    .replace(/(\))(\()/g, "$1*$2");

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("x", `return (${js});`);
    // test
    const t = fn(0.123);
    if (!Number.isFinite(t) && t !== 0) {
      // yine de ok, bazı ifadeler 0'da tanımsız olabilir
    }
    return { ok: true, fn };
  } catch (e) {
    return { ok: false, err: String(e.message || e) };
  }
}

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
