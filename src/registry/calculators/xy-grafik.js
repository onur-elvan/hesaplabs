export default {
  id: "xy-grafik",
  title: "Değerlerden Grafik Oluştur (X-Y)",
  seoTitle: "X-Y Grafik Çizdirme – Nokta Girerek Grafik Oluştur",
  category: "Fizik",
  description:
    "Elindeki değer çiftlerini (x,y) gir ve otomatik grafik oluştur. İstediğin kadar nokta ekleyebilirsin.",
  seoText: `
Bu araç, elindeki X-Y veri çiftlerinden hızlıca grafik oluşturur.

Nasıl girilir?
- Her satır: x,y
- Örnek:
0, 0
1, 2
2, 5
3, 4

Not: Noktalar X'e göre otomatik sıralanır.
`.trim(),
  inputs: [
    {
      key: "pairs",
      label: "Noktalar (her satır: x,y)",
      type: "textarea",
      placeholder: "Örn:\n0,0\n1,2\n2,5\n3,4",
      default: "",
      rows: 8,
    },
    {
      key: "xLabel",
      label: "X Etiketi",
      type: "text",
      placeholder: "Örn: Zaman (s)",
      default: "X",
      advanced: true,
    },
    {
      key: "yLabel",
      label: "Y Etiketi",
      type: "text",
      placeholder: "Örn: Hız (m/s)",
      default: "Y",
      advanced: true,
    },
  ],

  compute(v) {
    // --- helpers ---
    const toNum = (s) => {
      // "0,5" -> 0.5 desteği
      const n = Number(String(s).trim().replace(",", "."));
      return Number.isFinite(n) ? n : null;
    };

    const parsePairs = (raw) => {
      const lines = String(raw || "")
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);

      const pts = [];
      for (const line of lines) {
        // "x,y" veya "x y" veya "x;y"
        const parts = line.split(/[,\s;]+/).filter(Boolean);
        if (parts.length < 2) continue;

        const x = toNum(parts[0]);
        const y = toNum(parts[1]);
        if (x == null || y == null) continue;

        pts.push({ x, y });
      }

      // x'e göre sırala
      pts.sort((a, b) => a.x - b.x);
      return pts;
    };

    const buildSvg = (points, xLabel, yLabel) => {
      const W = 700,
        H = 260;
      const padL = 54,
        padR = 18,
        padT = 18,
        padB = 44;

      const xs = points.map((p) => p.x);
      const ys = points.map((p) => p.y);

      let minX = Math.min(...xs),
        maxX = Math.max(...xs);
      let minY = Math.min(...ys),
        maxY = Math.max(...ys);

      // tek değer gelirse ölçek bozulmasın
      if (minX === maxX) {
        minX -= 1;
        maxX += 1;
      }
      if (minY === maxY) {
        minY -= 1;
        maxY += 1;
      }

      const xToPx = (x) =>
        padL + ((x - minX) / (maxX - minX)) * (W - padL - padR);
      const yToPx = (y) =>
        padT + (1 - (y - minY) / (maxY - minY)) * (H - padT - padB);

      const linePts = points
        .map((p) => `${xToPx(p.x).toFixed(2)},${yToPx(p.y).toFixed(2)}`)
        .join(" ");

      const xAxisY = H - padB;
      const yAxisX = padL;

      // ticks
      const ticks = 5;
      const tickEls = [];

      for (let i = 0; i <= ticks; i++) {
        const tx = minX + (i / ticks) * (maxX - minX);
        const px = xToPx(tx);
        tickEls.push(`
          <line x1="${px}" y1="${xAxisY}" x2="${px}" y2="${
          xAxisY + 6
        }" stroke="#888" stroke-width="1"/>
          <text x="${px}" y="${
          xAxisY + 18
        }" font-size="11" text-anchor="middle" fill="#555">${tx.toFixed(
          2
        )}</text>
        `);
      }

      for (let i = 0; i <= ticks; i++) {
        const ty = minY + (i / ticks) * (maxY - minY);
        const py = yToPx(ty);
        tickEls.push(`
          <line x1="${
            yAxisX - 6
          }" y1="${py}" x2="${yAxisX}" y2="${py}" stroke="#888" stroke-width="1"/>
          <text x="${yAxisX - 10}" y="${
          py + 4
        }" font-size="11" text-anchor="end" fill="#555">${ty.toFixed(2)}</text>
        `);
      }

      return `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect x="0" y="0" width="${W}" height="${H}" fill="#fff"/>

  <line x1="${padL}" y1="${xAxisY}" x2="${
        W - padR
      }" y2="${xAxisY}" stroke="#222" stroke-width="1.5"/>
  <line x1="${yAxisX}" y1="${padT}" x2="${yAxisX}" y2="${
        H - padB
      }" stroke="#222" stroke-width="1.5"/>

  ${tickEls.join("\n")}

  <polyline fill="none" stroke="#2563eb" stroke-width="2.5" points="${linePts}"/>
  ${points
    .map(
      (p) =>
        `<circle cx="${xToPx(p.x)}" cy="${yToPx(p.y)}" r="3.5" fill="#2563eb"/>`
    )
    .join("\n")}

  <text x="${(padL + (W - padR)) / 2}" y="${
        H - 10
      }" font-size="12" text-anchor="middle" fill="#111">${xLabel}</text>
  <text x="16" y="${
    (padT + (H - padB)) / 2
  }" font-size="12" text-anchor="middle" fill="#111"
        transform="rotate(-90 16 ${(padT + (H - padB)) / 2})">${yLabel}</text>
</svg>`.trim();
    };

    // --- main ---
    const raw = (v.pairs || "").trim();
    if (!raw) return { hata: "En az 2 nokta gir (x,y)." };

    const pts = parsePairs(raw);
    if (pts.length < 2) return { hata: "Geçerli en az 2 nokta gerekli." };

    const xLabel = (v.xLabel || "X").trim();
    const yLabel = (v.yLabel || "Y").trim();

    const svg = buildSvg(pts, xLabel, yLabel);

    return {
      "Nokta Sayısı": pts.length,

      // ✅ CalculatorPage bunu bekliyor:
      __plot: {
        svg,
        caption: `${xLabel} - ${yLabel} grafiği (Noktalar X’e göre sıralandı)`,
      },

      // ✅ Tablo da otomatik görünsün:
      __table: {
        headers: ["x", "y"],
        rows: pts.map((p) => ({ x: p.x, y: p.y })),
        note: "Noktalar X’e göre sıralandı.",
      },
    };
  },
};
