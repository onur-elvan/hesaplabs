export default {
  id: "xy-alan-trapez",
  title: "Grafik Üzerinden Alan (Trapez) – X-Y Noktalar",
  seoTitle: "X-Y Noktalardan Alan Hesaplama – Trapez Yöntemi",
  category: "Grafik Oluşturma",
  createdAt: "2025-10-24",
  description:
    "X-Y noktalarını gir, grafiği çiz ve trapez yöntemiyle alanı (∫y dx) hesapla.",
  seoText: `
X-Y noktaları arasında doğrusal kabul yaparak trapez yöntemiyle alan bulunur:
Alan ≈ Σ (y1+y2)/2 × (x2-x1)

Not: Alan işaretli olabilir (negatif y alanı negatif katkı verir).
`.trim(),
  inputs: [
    {
      key: "pairs",
      label: "Noktalar (her satır: x,y)",
      type: "textarea",
      placeholder: "Örn:\n0,0\n1,2\n2,5\n3,4",
      default: "",
    },
    {
      key: "xLabel",
      label: "X Etiketi",
      type: "text",
      default: "x",
      advanced: true,
    },
    {
      key: "yLabel",
      label: "Y Etiketi",
      type: "text",
      default: "y",
      advanced: true,
    },
  ],
  compute(v) {
    const pts = parsePairs(v.pairs);
    if (pts.length < 2) return { hata: "Geçerli en az 2 nokta gerekli (x,y)." };
    pts.sort((a, b) => a[0] - b[0]);

    let area = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i],
        [x2, y2] = pts[i + 1];
      const dx = x2 - x1;
      if (dx <= 0) continue;
      area += ((y1 + y2) / 2) * dx;
    }

    const svg = makeLinePlotSvg({
      title: "X–Y Grafiği",
      xLabel: v.xLabel || "x",
      yLabel: v.yLabel || "y",
      points: pts.map(([x, y]) => [round2(x), round2(y)]),
    });

    return {
      "Alan (∫ y dx)": area,
      "Nokta Sayısı": pts.length,
      __plot: { svg, caption: "Trapez yöntemi (parçalı doğrusal yaklaşım)." },
      __table: {
        headers: ["x", "y"],
        rows: pts.map(([x, y]) => [x, y]),
        note: "Sıralanmış noktalar",
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

// plot helper (kısa)
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
      ([x, y]) => `<circle cx="${px(x)}" cy="${py(y)}" r="3.5" fill="#2563eb"/>`
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
