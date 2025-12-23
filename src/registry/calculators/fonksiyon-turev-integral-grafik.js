export default {
  id: "fonksiyon-turev-integral-grafik",
  title: "Fonksiyon → Grafik + Türev + İntegral Alan (Gölgelendirmeli)",
  seoTitle:
    "Fonksiyon Grafiği Çizdirme + Türev + İntegral Alan Hesaplama (Gölgelendirme)",
  category: "Grafik Oluşturma",
  createdAt: "2025-12-24",
  description:
    "Fonksiyonu yaz, grafiği çiz. x0 noktasındaki türevi bul ve [a,b] aralığında integrali (alanı) gölgelendir.",
  seoText: `
Bu araç sana 3 şeyi aynı anda öğretir ve hesaplar:

1) Fonksiyon Grafiği
- f(x) fonksiyonunu seçtiğin aralıkta örnekleyip grafiğini çizer.
- Eksenler 0’ı içeriyorsa grafik “4 bölgeli” (I-II-III-IV) görünür.

2) Türev (x0 noktasında eğim)
- Türev, grafiğe çizilen teğetin eğimidir.
- Yaklaşık türev hesabı (merkezi fark):
  f'(x0) ≈ ( f(x0+h) - f(x0-h) ) / (2h)
- Burada h küçük bir sayı seçilir (otomatik).

3) İntegral / Alan (a–b arası gölgelendirme)
- ∫ f(x) dx, eğrinin x eksenine göre “işaretli alan”ıdır.
- f(x) x ekseninin üstündeyse alan +, altındaysa alan – katkı yapar.
- Sayısal integral (trapez yöntemi):
  Alan ≈ Σ (f(x_i) + f(x_{i+1})) / 2 × Δx

Kabul edilen yazım örnekleri:
- x^2 + 2x - 1
- sin(x), cos(x), tan(x)
- abs(x), sqrt(x)
- log(x) (doğal log), exp(x)
- pi, e

İpucu:
- Tanımsız noktalar varsa (ör: log(x) için x≤0), grafik o bölümü otomatik boş bırakır.
`.trim(),

  inputs: [
    {
      key: "expr",
      label: "Fonksiyon f(x)",
      type: "text",
      placeholder: "Örn: x^2 + 2x - 1  |  sin(x)  |  sqrt(x)",
      default: "x^2",
    },
    { key: "xMin", label: "X Min", type: "number", default: -10 },
    { key: "xMax", label: "X Max", type: "number", default: 10 },
    {
      key: "x0",
      label: "Türev noktası x0",
      type: "number",
      placeholder: "Örn: 1",
      default: 1,
      advanced: true,
    },
    {
      key: "a",
      label: "İntegral başlangıç (a)",
      type: "number",
      default: -2,
      advanced: true,
    },
    {
      key: "b",
      label: "İntegral bitiş (b)",
      type: "number",
      default: 2,
      advanced: true,
    },
    {
      key: "samples",
      label: "Örnekleme yoğunluğu",
      type: "select",
      default: "200",
      advanced: true,
      options: [
        { label: "120 (Hızlı)", value: "120" },
        { label: "200 (Dengeli)", value: "200" },
        { label: "350 (Daha Pürüzsüz)", value: "350" },
      ],
    },
  ],

  compute(v) {
    const expr = String(v.expr || "").trim();
    if (!expr) return { hata: "Fonksiyon boş olamaz." };

    let xMin = num(v.xMin);
    let xMax = num(v.xMax);
    if (!Number.isFinite(xMin)) xMin = -10;
    if (!Number.isFinite(xMax)) xMax = 10;
    if (xMin >= xMax) return { hata: "X Min < X Max olmalı." };

    const compiled = compileExpr(expr);
    if (!compiled.ok) return { hata: `Fonksiyon hatalı: ${compiled.err}` };
    const f = compiled.fn;

    const x0 = num(v.x0);
    let a = num(v.a);
    let b = num(v.b);

    const n = Math.max(60, Math.min(800, Math.floor(num(v.samples) || 200)));
    const pts = sampleFunction(f, xMin, xMax, n);

    if (pts.length < 2) {
      return {
        hata: "Grafik üretilemedi. (Tanımsız değer çok olabilir.) Aralığı değiştir veya fonksiyonu kontrol et.",
      };
    }

    // türev (x0)
    const h = Math.max((xMax - xMin) / (n * 2), 1e-4);
    const deriv = derivativeCentral(f, x0, h);

    // integral (a,b) normalize
    if (!Number.isFinite(a)) a = xMin;
    if (!Number.isFinite(b)) b = xMax;
    if (a === b) return { hata: "a ve b aynı olamaz." };
    if (a > b) [a, b] = [b, a];

    const integral = trapezoidIntegral(
      f,
      a,
      b,
      Math.max(80, Math.floor(n * 0.6))
    );

    // teğet çizgisi (tangent) için: y = f(x0) + f'(x0)(x-x0)
    const y0 = safeVal(f, x0);
    const tangent =
      Number.isFinite(y0) && Number.isFinite(deriv)
        ? { x0, y0, m: deriv }
        : null;

    const svg = makeFunctionPlotSvg({
      title: "Fonksiyon Grafiği",
      xLabel: "x",
      yLabel: "f(x)",
      points: pts,
      shade: { a, b }, // integral shading
      tangent,
    });

    // tablo (seçili aralıktan birkaç örnek)
    const tableRows = makeSampleTable(f, xMin, xMax, 9);

    return {
      Fonksiyon: expr,
      "Türev f'(x0)": deriv,
      x0: x0,
      "İntegral (∫ f(x) dx)": integral,
      "Aralık [a,b]": `[${a}, ${b}]`,
      __plot: {
        svg,
        caption:
          "Mavi: fonksiyon. Turuncu: teğet (varsa). Gölge: [a,b] arası işaretli alan (integral).",
      },
      __table: {
        headers: ["x", "f(x)"],
        rows: tableRows,
        note: "Bu tablo sadece örnek değerler verir. Hesaplamada daha sık örnekleme kullanılır.",
      },
    };
  },
};

/* -------------------- Matematik yardımcıları -------------------- */

function sampleFunction(f, xMin, xMax, n) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const x = xMin + (i * (xMax - xMin)) / n;
    const y = safeVal(f, x);
    if (Number.isFinite(y)) pts.push([x, y]);
    else pts.push([x, NaN]); // kırık çizgi için
  }
  // NaN araları plot içinde segmentlenir
  return pts;
}

function safeVal(f, x) {
  try {
    const y = f(x);
    return Number.isFinite(y) ? y : NaN;
  } catch {
    return NaN;
  }
}

function derivativeCentral(f, x0, h) {
  const y1 = safeVal(f, x0 + h);
  const y2 = safeVal(f, x0 - h);
  if (!Number.isFinite(y1) || !Number.isFinite(y2)) return NaN;
  return (y1 - y2) / (2 * h);
}

function trapezoidIntegral(f, a, b, n) {
  const dx = (b - a) / n;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const x1 = a + i * dx;
    const x2 = x1 + dx;
    const y1 = safeVal(f, x1);
    const y2 = safeVal(f, x2);
    if (!Number.isFinite(y1) || !Number.isFinite(y2)) continue; // tanımsız yerleri atla
    sum += ((y1 + y2) / 2) * dx;
  }
  return sum;
}

function makeSampleTable(f, xMin, xMax, k) {
  const rows = [];
  const step = (xMax - xMin) / (k - 1);
  for (let i = 0; i < k; i++) {
    const x = xMin + i * step;
    const y = safeVal(f, x);
    rows.push([round3(x), Number.isFinite(y) ? round3(y) : "tanımsız"]);
  }
  return rows;
}

/* -------------------- Expression parser -------------------- */
function compileExpr(expr) {
  const cleaned = expr.replace(/\s+/g, "").toLowerCase();

  // izinli karakterler (kaba güvenlik)
  if (!/^[0-9x+\-*/^().,a-z]*$/.test(cleaned)) {
    return { ok: false, err: "Geçersiz karakter var." };
  }

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
    .replaceAll("log", "Math.log")
    .replaceAll("^", "**");

  // implicit çarpma: 2x, x2, )( , x( gibi
  js = js
    .replace(/(\d)(x)/g, "$1*$2")
    .replace(/(x)(\d)/g, "$1*$2")
    .replace(/(\))(x)/g, "$1*$2")
    .replace(/(x)(\()/g, "$1*$2")
    .replace(/(\))(\()/g, "$1*$2");

  try {
    // eslint-disable-next-line no-new-func
    const fn = new Function("x", `return (${js});`);
    // hafif test
    fn(0.123);
    return { ok: true, fn };
  } catch (e) {
    return { ok: false, err: String(e.message || e) };
  }
}

/* -------------------- SVG Grafik (Kaliteli) -------------------- */
/**
 * points: Array<[x, y]>  (y NaN olabilir: kırık çizgi)
 * shade: {a,b} => integral gölgesi
 * tangent: {x0,y0,m} => teğet çizgisi
 */
function makeFunctionPlotSvg({
  title,
  xLabel,
  yLabel,
  points,
  shade,
  tangent,
}) {
  const W = 820,
    H = 460,
    padL = 70,
    padR = 30,
    padT = 38,
    padB = 70;

  // valid y'ler
  const xs = points.map((p) => p[0]);
  const ysValid = points.map((p) => p[1]).filter((y) => Number.isFinite(y));
  let minX = Math.min(...xs),
    maxX = Math.max(...xs);

  let minY = ysValid.length ? Math.min(...ysValid) : -1;
  let maxY = ysValid.length ? Math.max(...ysValid) : 1;

  if (minX === maxX) {
    minX -= 1;
    maxX += 1;
  }
  if (minY === maxY) {
    minY -= 1;
    maxY += 1;
  }

  // padding
  const dx = (maxX - minX) * 0.08;
  const dy = (maxY - minY) * 0.12;
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

  // ticks (5-6 adet)
  const ticksX = niceTicks(minX, maxX, 6);
  const ticksY = niceTicks(minY, maxY, 6);

  const gridLines =
    ticksX
      .map((t) => {
        const x = px(t);
        return `<line x1="${x}" y1="${padT}" x2="${x}" y2="${
          H - padB
        }" stroke="#eef2f7"/>`;
      })
      .join("") +
    ticksY
      .map((t) => {
        const y = py(t);
        return `<line x1="${padL}" y1="${y}" x2="${
          W - padR
        }" y2="${y}" stroke="#eef2f7"/>`;
      })
      .join("");

  // segments (NaN kırıkları ayır)
  const segments = [];
  let cur = [];
  for (const [x, y] of points) {
    if (!Number.isFinite(y)) {
      if (cur.length >= 2) segments.push(cur);
      cur = [];
    } else {
      cur.push([x, y]);
    }
  }
  if (cur.length >= 2) segments.push(cur);

  const polylines = segments
    .map((seg) => {
      const poly = seg
        .map(([x, y]) => `${px(x).toFixed(2)},${py(y).toFixed(2)}`)
        .join(" ");
      return `<polyline points="${poly}" fill="none" stroke="#2563eb" stroke-width="2.6" />`;
    })
    .join("");

  // integral shading path
  let shadePath = "";
  if (shade && Number.isFinite(shade.a) && Number.isFinite(shade.b)) {
    const a = shade.a,
      b = shade.b;
    const aa = Math.max(minX, Math.min(maxX, a));
    const bb = Math.max(minX, Math.min(maxX, b));
    if (aa < bb) {
      const N = 140;
      const xs = [];
      for (let i = 0; i <= N; i++) xs.push(aa + (i * (bb - aa)) / N);

      const top = xs
        .map((x) => {
          const y = safeYFromSegments(points, x);
          if (!Number.isFinite(y)) return null;
          return [px(x), py(y)];
        })
        .filter(Boolean);

      // x-axis baseline
      const baseY = xAxisY;

      if (top.length >= 2) {
        const d = [
          `M ${top[0][0].toFixed(2)} ${baseY.toFixed(2)}`,
          `L ${top[0][0].toFixed(2)} ${top[0][1].toFixed(2)}`,
          ...top.slice(1).map((p) => `L ${p[0].toFixed(2)} ${p[1].toFixed(2)}`),
          `L ${top[top.length - 1][0].toFixed(2)} ${baseY.toFixed(2)}`,
          "Z",
        ].join(" ");
        shadePath = `<path d="${d}" fill="rgba(37,99,235,0.12)" stroke="none"/>`;
      }
    }
  }

  // tangent line
  let tangentSvg = "";
  if (
    tangent &&
    Number.isFinite(tangent.x0) &&
    Number.isFinite(tangent.y0) &&
    Number.isFinite(tangent.m)
  ) {
    // çizgi uçları: ekran x min/max
    const xA = minX,
      xB = maxX;
    const yA = tangent.y0 + tangent.m * (xA - tangent.x0);
    const yB = tangent.y0 + tangent.m * (xB - tangent.x0);
    tangentSvg = `
      <line x1="${px(xA)}" y1="${py(yA)}" x2="${px(xB)}" y2="${py(yB)}"
            stroke="#f97316" stroke-width="2" stroke-dasharray="6 4"/>
      <circle cx="${px(tangent.x0)}" cy="${py(
      tangent.y0
    )}" r="4.2" fill="#f97316"/>
    `;
  }

  // axis ticks labels
  const xTickLabels = ticksX
    .map((t) => {
      const x = px(t);
      return `
        <line x1="${x}" y1="${xAxisY}" x2="${x}" y2="${
        xAxisY + 6
      }" stroke="#94a3b8"/>
        <text x="${x}" y="${
        xAxisY + 22
      }" text-anchor="middle" font-size="12" fill="#475569">${fmtTick(t)}</text>
      `;
    })
    .join("");

  const yTickLabels = ticksY
    .map((t) => {
      const y = py(t);
      return `
        <line x1="${
          yAxisX - 6
        }" y1="${y}" x2="${yAxisX}" y2="${y}" stroke="#94a3b8"/>
        <text x="${yAxisX - 10}" y="${
        y + 4
      }" text-anchor="end" font-size="12" fill="#475569">${fmtTick(t)}</text>
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

  ${gridLines}

  <!-- axes -->
  <line x1="${padL}" y1="${xAxisY}" x2="${
    W - padR
  }" y2="${xAxisY}" stroke="#94a3b8"/>
  <line x1="${yAxisX}" y1="${padT}" x2="${yAxisX}" y2="${
    H - padB
  }" stroke="#94a3b8"/>

  <!-- arrows -->
  <path d="M ${W - padR} ${xAxisY} l -10 -5 l 0 10 Z" fill="#94a3b8"/>
  <path d="M ${yAxisX} ${padT} l -5 10 l 10 0 Z" fill="#94a3b8"/>

  ${xTickLabels}
  ${yTickLabels}

  <!-- shading (integral) -->
  ${shadePath}

  <!-- function -->
  ${polylines}

  <!-- tangent -->
  ${tangentSvg}

  <!-- labels -->
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
</svg>
`.trim();
}

// x'e karşı y bul (yakın komşu) – shading için
function safeYFromSegments(points, x) {
  // points: [x,y] y NaN olabilir
  // basit: en yakın iki nokta arasında lineer interp (NaN olmayan)
  let prev = null;
  for (const p of points) {
    const [xx, yy] = p;
    if (!Number.isFinite(yy)) {
      prev = null;
      continue;
    }
    if (xx >= x) {
      if (!prev) return yy;
      const [x1, y1] = prev;
      const [x2, y2] = [xx, yy];
      if (x2 === x1) return y2;
      const t = (x - x1) / (x2 - x1);
      return y1 + t * (y2 - y1);
    }
    prev = [xx, yy];
  }
  return NaN;
}

/* -------------------- ticks -------------------- */
function niceTicks(min, max, count) {
  const span = max - min;
  if (!Number.isFinite(span) || span <= 0) return [min, max];
  const rawStep = span / (count - 1);
  const step = niceStep(rawStep);
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;

  const ticks = [];
  for (let v = start; v <= end + 1e-9; v += step) ticks.push(v);

  // çok fazla ise kırp
  if (ticks.length > count + 3) {
    const k = Math.ceil(ticks.length / (count + 2));
    return ticks.filter((_, i) => i % k === 0);
  }
  return ticks;
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

/* -------------------- misc -------------------- */
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
