export default {
  id: "hiz-zaman-grafikten-ivme",
  title: "Hız–Zaman Grafiğinden İvme (Eğim)",
  seoTitle: "Hız Zaman Grafiğinden İvme Hesaplama – Eğim (Δv/Δt)",
  category: "Grafik Oluşturma",
  createdAt: "2025-12-24",
  description:
    "Zaman-hız noktalarını gir; her aralık için ivmeyi (Δv/Δt) hesapla ve grafiği çiz.",
  seoText: `
Hız–zaman grafiğinde eğim ivmeyi verir:
a = Δv / Δt

Bu araç:
- Noktaları sıralar
- Her segment için ivmeyi bulur
- Ortalama ivme + tablo üretir
`.trim(),
  inputs: [
    {
      key: "tv",
      label: "Noktalar (t,v) – her satır: t,v",
      type: "textarea",
      placeholder: "Örn:\n0,0\n2,4\n5,4\n8,0",
      default: "",
    },
    {
      key: "unitV",
      label: "Hız Birimi",
      type: "select",
      default: "m/s",
      advanced: true,
      options: [
        { label: "m/s", value: "m/s" },
        { label: "km/h", value: "km/h" },
      ],
    },
  ],

  compute(v) {
    const pts = parsePairs(v.tv);
    if (pts.length < 2) return { hata: "Geçerli en az 2 nokta gerekli (t,v)." };
    pts.sort((a, b) => a[0] - b[0]);

    const segRows = [];
    let aSum = 0,
      aCount = 0;
    let aMax = -Infinity,
      aMin = Infinity;

    for (let i = 0; i < pts.length - 1; i++) {
      const [t1, vv1] = pts[i];
      const [t2, vv2] = pts[i + 1];
      const dt = t2 - t1;
      if (dt <= 0) continue;
      const a = (vv2 - vv1) / dt;
      aSum += a;
      aCount++;
      aMax = Math.max(aMax, a);
      aMin = Math.min(aMin, a);
      segRows.push([
        round2(t1),
        round2(t2),
        round2(vv1),
        round2(vv2),
        round4(a),
      ]);
    }

    const avgA = aCount ? aSum / aCount : NaN;
    const overallA =
      (pts[pts.length - 1][1] - pts[0][1]) /
      (pts[pts.length - 1][0] - pts[0][0]);

    const svg = makeLinePlotSvg({
      title: "Hız–Zaman Grafiği",
      xLabel: "Zaman (t)",
      yLabel: `Hız (v) [${v.unitV || "m/s"}]`,
      points: pts.map(([t, vel]) => [round2(t), round2(vel)]),
    });

    return {
      "Segment Sayısı": segRows.length,
      "Ortalama İvme (segment)": avgA,
      "Genel İvme (ilk-son)": overallA,
      "Maks İvme": aMax,
      "Min İvme": aMin,
      __plot: { svg, caption: "İvme = eğim. Tablo: her aralık için Δv/Δt." },
      __table: {
        headers: ["t1", "t2", "v1", "v2", "a=Δv/Δt"],
        rows: segRows,
        note: "İvme birimi: (hız birimi) / s",
      },
    };
  },
};

function parsePairs(raw) {
  raw = String(raw || "").trim();
  if (!raw) return [];
  const lines = raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const pts = [];
  for (const line of lines) {
    const parts = line
      .replace(/\s+/g, " ")
      .split(/[,\s;]+/)
      .filter(Boolean);
    if (parts.length < 2) continue;
    const x = num(parts[0]),
      y = num(parts[1]);
    if (Number.isFinite(x) && Number.isFinite(y)) pts.push([x, y]);
  }
  return pts;
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
      ([x, y]) => `<circle cx="${px(x)}" cy="${py(y)}" r="3.6" fill="#2563eb"/>`
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
