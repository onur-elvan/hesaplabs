export default {
  id: "hiz-zaman-grafikten-yol",
  title: "Hız–Zaman Grafiğinden Yol (Alan)",
  seoTitle: "Hız Zaman Grafiğinden Yol Hesaplama – Trapez Yöntemi",
  category: "Grafik Oluşturma",
  createdAt: "2025-12-24",
  description:
    "Zaman–hız noktalarını gir, hız-zaman grafiğini çiz ve alan (trapez) yöntemiyle toplam yolu hesapla.",
  seoText: `
Hız–zaman grafiğinin altında kalan alan, alınan yolu verir.
Bu araç; verdiğin (t, v) noktalarını grafiğe döker ve trapez yöntemiyle toplam yolu hesaplar.

Giriş formatı (her satır): t, v
Örnek:
0, 0
2, 4
5, 4
8, 0
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
      key: "xLabel",
      label: "X Etiketi",
      type: "text",
      default: "Zaman (s)",
      advanced: true,
    },
    {
      key: "unitV",
      label: "Hız Birimi",
      type: "select",
      default: "m/s",
      options: [
        { label: "m/s", value: "m/s" },
        { label: "km/h", value: "km/h" },
        { label: "km/s", value: "km/s" },
      ],
      advanced: true,
    },
    {
      key: "yLabel",
      label: "Y Etiketi",
      type: "text",
      default: "Hız",
      advanced: true,
    },
  ],

  compute(v) {
    const raw = (v.tv || "").trim();
    if (!raw) return { hata: "En az 2 nokta gir (t,v)." };

    const lines = raw
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const pts = [];
    for (const line of lines) {
      const parts = line
        .replace(/\s+/g, " ")
        .split(/[,\s;]+/)
        .map((p) => p.trim())
        .filter(Boolean);

      if (parts.length < 2) continue;

      const t = Number(String(parts[0]).replace(",", "."));
      const vel = Number(String(parts[1]).replace(",", "."));
      if (Number.isFinite(t) && Number.isFinite(vel)) pts.push([t, vel]);
    }

    if (pts.length < 2) return { hata: "Geçerli en az 2 nokta gerekli." };

    // t'ye göre sırala
    pts.sort((a, b) => a[0] - b[0]);

    // trapez alan
    let area = 0;
    for (let i = 0; i < pts.length - 1; i++) {
      const [t1, v1] = pts[i];
      const [t2, v2] = pts[i + 1];
      const dt = t2 - t1;
      if (dt <= 0) continue;
      area += ((v1 + v2) / 2) * dt;
    }

    const svg = makeLinePlotSvg({
      title: "Hız–Zaman Grafiği",
      xLabel: v.xLabel || "Zaman (s)",
      yLabel: `${v.yLabel || "Hız"} (${v.unitV || "m/s"})`,
      points: pts,
    });

    return {
      "Toplam Yol (alan)": area,
      "Nokta Sayısı": pts.length,
      __plot: {
        svg,
        caption:
          "Trapez (parçalı doğrusal) yöntemi kullanılır. Alan = (v1+v2)/2 × Δt.",
      },
      __table: {
        headers: ["t", "v"],
        rows: pts.map(([t, vel]) => [t, vel]),
        note: "Tablo: sıralanmış (t,v) noktaları",
      },
    };
  },
};

// ---- ortak SVG yardımcı (dosya içinde) ----
function makeLinePlotSvg({ title, xLabel, yLabel, points }) {
  const W = 720,
    H = 420;
  const padL = 60,
    padR = 20,
    padT = 30,
    padB = 55;

  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);

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

  const dx = (maxX - minX) * 0.08;
  const dy = (maxY - minY) * 0.08;
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

  const gridV = Array.from({ length: 6 })
    .map((_, i) => {
      const gx = padL + (i * (W - padL - padR)) / 5;
      return `<line x1="${gx}" y1="${padT}" x2="${gx}" y2="${
        H - padB
      }" stroke="#eef2f7"/>`;
    })
    .join("");

  const gridH = Array.from({ length: 6 })
    .map((_, i) => {
      const gy = padT + (i * (H - padT - padB)) / 5;
      return `<line x1="${padL}" y1="${gy}" x2="${
        W - padR
      }" y2="${gy}" stroke="#eef2f7"/>`;
    })
    .join("");

  const ptsCircles = points
    .map(([x, y]) => {
      const cx = px(x),
        cy = py(y);
      return `<circle cx="${cx}" cy="${cy}" r="4" fill="#2563eb"/>`;
    })
    .join("");

  return `
<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="${W}" height="${H}" fill="white"/>
  <text x="${
    W / 2
  }" y="18" text-anchor="middle" font-size="14" fill="#0f172a">${escapeXml(
    title || ""
  )}</text>

  ${gridV}
  ${gridH}

  <line x1="${padL}" y1="${xAxisY}" x2="${
    W - padR
  }" y2="${xAxisY}" stroke="#94a3b8"/>
  <line x1="${yAxisX}" y1="${padT}" x2="${yAxisX}" y2="${
    H - padB
  }" stroke="#94a3b8"/>

  <polyline points="${poly}" fill="none" stroke="#2563eb" stroke-width="2.5"/>
  ${ptsCircles}

  <text x="${W / 2}" y="${
    H - 15
  }" text-anchor="middle" font-size="13" fill="#334155">${escapeXml(
    xLabel || ""
  )}</text>
  <text x="18" y="${H / 2}" text-anchor="middle" font-size="13" fill="#334155"
        transform="rotate(-90 18 ${H / 2})">${escapeXml(yLabel || "")}</text>

  <text x="${padL}" y="${
    H - padB + 18
  }" font-size="11" fill="#64748b">${minX.toFixed(2)}</text>
  <text x="${W - padR}" y="${
    H - padB + 18
  }" text-anchor="end" font-size="11" fill="#64748b">${maxX.toFixed(2)}</text>
  <text x="${padL - 6}" y="${
    padT + 10
  }" text-anchor="end" font-size="11" fill="#64748b">${maxY.toFixed(2)}</text>
  <text x="${padL - 6}" y="${
    H - padB
  }" text-anchor="end" font-size="11" fill="#64748b">${minY.toFixed(2)}</text>
</svg>`.trim();
}

function escapeXml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
