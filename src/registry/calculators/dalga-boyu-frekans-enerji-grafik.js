export default {
  id: "dalga-boyu-frekans-enerji-grafik",
  title: "Dalga Boyu – Frekans – Enerji (Işık) + Grafik",
  seoTitle: "Dalga Boyu Frekans Enerji Hesaplama – E = hf, c = λf (Grafikli)",
  category: "Grafik Oluşturma",
  description:
    "Dalga boyu (λ) veya frekans (f) gir. Işığın frekansını ve foton enerjisini hesapla, grafikle göster.",
  seoText: `
Işık (elektromanyetik dalga) için temel bağıntı:
c = λ · f

- c: ışık hızı (yaklaşık 3.00×10^8 m/s)
- λ (lambda): dalga boyu (metre)
- f: frekans (Hz)

Foton enerjisi:
E = h · f
- h: Planck sabiti (6.626×10^-34 J·s)

Bu araç ne yapar?
1) Seçimine göre λ veya f’den diğerini bulur.
2) Enerjiyi Joule ve eV cinsinden verir.
3) Dalga boyu–frekans ilişkisini grafikte gösterir:
- Dalga boyu artarsa frekans azalır (ters orantı)

Not:
- Burada “vakum ışık hızı” alınır (yaklaşık).
- Ortam değişirse (su/cam) hız azalır; o durumda daha gelişmiş model gerekir.
`.trim(),

  inputs: [
    {
      key: "mode",
      label: "Ne gireceksin?",
      type: "select",
      default: "lambda",
      options: [
        { label: "Dalga boyu (λ)", value: "lambda" },
        { label: "Frekans (f)", value: "freq" },
      ],
    },
    {
      key: "lambdaNm",
      label: "Dalga Boyu (nm)",
      type: "number",
      placeholder: "Örn: 550 (yeşil ışık)",
      default: 550,
    },
    {
      key: "freqHz",
      label: "Frekans (Hz)",
      type: "number",
      placeholder: "Örn: 5.45e14",
      default: 5.45e14,
    },
    {
      key: "range",
      label: "Grafik aralığı (nm)",
      type: "select",
      default: "200-900",
      advanced: true,
      options: [
        { label: "200–900 (UV→Görünür→IR)", value: "200-900" },
        { label: "380–750 (Görünür)", value: "380-750" },
        { label: "1–2000 (Geniş)", value: "1-2000" },
      ],
    },
  ],

  compute(v) {
    const c = 299792458; // m/s
    const h = 6.62607015e-34; // J*s
    const eV = 1.602176634e-19; // J

    const mode = String(v.mode || "lambda");
    const lambdaNm = num(v.lambdaNm);
    const freqHz = num(v.freqHz);

    let lambdaM, f;

    if (mode === "lambda") {
      if (!(lambdaNm > 0))
        return { hata: "Dalga boyu (nm) 0'dan büyük olmalı." };
      lambdaM = lambdaNm * 1e-9;
      f = c / lambdaM;
    } else {
      if (!(freqHz > 0)) return { hata: "Frekans 0'dan büyük olmalı." };
      f = freqHz;
      lambdaM = c / f;
    }

    const energyJ = h * f;
    const energyEV = energyJ / eV;

    // plot: nm -> THz (frekans)
    const [rMin, rMax] = String(v.range || "200-900")
      .split("-")
      .map(num);
    const minNm = Math.max(0.001, rMin || 200);
    const maxNm = Math.max(minNm + 1, rMax || 900);

    const pts = [];
    const N = 180;
    for (let i = 0; i <= N; i++) {
      const nm = minNm + (i * (maxNm - minNm)) / N;
      const lm = nm * 1e-9;
      const ff = c / lm; // Hz
      const thz = ff / 1e12;
      pts.push([nm, thz]);
    }

    const svg = makePlot({
      title: "Dalga Boyu – Frekans Grafiği",
      xLabel: "Dalga Boyu λ (nm)",
      yLabel: "Frekans f (THz)",
      points: pts,
    });

    return {
      "λ (nm)": lambdaM * 1e9,
      "f (Hz)": f,
      "f (THz)": f / 1e12,
      "Enerji (J)": energyJ,
      "Enerji (eV)": energyEV,
      __plot: { svg, caption: "c = λf → λ arttıkça f azalır (ters orantı)." },
      __table: {
        headers: ["Büyüklük", "Değer"],
        rows: [
          ["Işık hızı c (m/s)", c],
          ["Planck sabiti h (J·s)", h],
          ["Dalga boyu λ (nm)", round3(lambdaM * 1e9)],
          ["Frekans f (THz)", round3(f / 1e12)],
          ["Enerji E (eV)", round4(energyEV)],
        ],
        note: "Enerji foton enerjisidir: E = h f",
      },
    };
  },
};

function makePlot({ title, xLabel, yLabel, points }) {
  // basit ama “kaliteli” plot (sinüs dosyasındaki gibi)
  const W = 820,
    H = 460,
    padL = 70,
    padR = 30,
    padT = 38,
    padB = 70;

  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);

  let minX = Math.min(...xs),
    maxX = Math.max(...xs);
  let minY = Math.min(...ys),
    maxY = Math.max(...ys);

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
