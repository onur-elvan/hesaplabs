export default {
  id: "xy-grafik",
  title: "Değerlerden Grafik Oluştur (X-Y)",
  seoTitle: "X-Y Grafik Çizdirme – Nokta Girerek Grafik Oluştur",
  category: "Grafik Oluşturma",
  description:
    "Elindeki (x,y) değer çiftlerini gir; tabloyu ve grafiği otomatik oluştur. Negatif değerler desteklenir.",
  seoText: `
Bu araç, elindeki X-Y veri çiftlerinden hızlıca grafik oluşturur.

Nasıl girilir?
- Her satır: x,y
- Ayırıcı: virgül (,) veya noktalı virgül (;)
- Ondalık için: 1.5 veya 1,5 yazabilirsin

Örnek:
-2, 3
0, 0
1,5; 2,25
3, -1

Notlar:
- Noktalar X’e göre otomatik sıralanır.
- Noktalar doğrusal olarak birleştirilir (parça parça doğru).
`.trim(),

  inputs: [
    {
      key: "pairs",
      label: "Noktalar (her satır: x,y)",
      type: "textarea",
      placeholder: "Örn:\n-2,3\n0,0\n1.5,2.25\n3,-1",
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
    const raw = String(v.pairs || "").trim();
    if (!raw) return { hata: "En az 2 nokta gir (x,y)." };

    // 1) Parse
    const lines = raw
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);

    const pts = [];
    for (const line of lines) {
      // Öncelik: ; varsa ayırıcı olarak onu kabul et (ondalık virgülle karışmasın)
      let parts = line.includes(";") ? line.split(";") : line.split(/[,\s]+/);

      parts = parts.map((p) => p.trim()).filter(Boolean);
      if (parts.length < 2) continue;

      const x = Number(String(parts[0]).replace(",", "."));
      const y = Number(String(parts[1]).replace(",", "."));

      if (Number.isFinite(x) && Number.isFinite(y)) pts.push([x, y]);
    }

    if (pts.length < 2) return { hata: "Geçerli en az 2 nokta gerekli." };

    // x'e göre sırala
    pts.sort((a, b) => a[0] - b[0]);

    // 2) SVG çizim (negatifler dahil düzgün ölçek)
    const W = 720,
      H = 420;
    const padL = 60,
      padR = 20,
      padT = 20,
      padB = 60;

    const xs = pts.map((p) => p[0]);
    const ys = pts.map((p) => p[1]);

    let minX = Math.min(...xs),
      maxX = Math.max(...xs);
    let minY = Math.min(...ys),
      maxY = Math.max(...ys);

    // tek değer gelirse ölçek aç
    if (minX === maxX) {
      minX -= 1;
      maxX += 1;
    }
    if (minY === maxY) {
      minY -= 1;
      maxY += 1;
    }

    // ufak padding
    const dx = (maxX - minX) * 0.08;
    const dy = (maxY - minY) * 0.08;
    minX -= dx;
    maxX += dx;
    minY -= dy;
    maxY += dy;

    const px = (x) => padL + ((x - minX) / (maxX - minX)) * (W - padL - padR);
    const py = (y) =>
      padT + (1 - (y - minY) / (maxY - minY)) * (H - padT - padB);

    const poly = pts
      .map(([x, y]) => `${px(x).toFixed(2)},${py(y).toFixed(2)}`)
      .join(" ");

    // 0 eksenleri içerideyse 0 çizgisi, değilse kenarda eksen
    const x0Inside = minX <= 0 && 0 <= maxX;
    const y0Inside = minY <= 0 && 0 <= maxY;

    const xAxisY = y0Inside ? py(0) : py(minY);
    const yAxisX = x0Inside ? px(0) : px(minX);

    const xLabel = String(v.xLabel || "X").trim();
    const yLabel = String(v.yLabel || "Y").trim();

    // grid çizgileri
    const gridV = Array.from({ length: 6 })
      .map((_, i) => {
        const gx = padL + (i * (W - padL - padR)) / 5;
        return `<line x1="${gx}" y1="${padT}" x2="${gx}" y2="${
          H - padB
        }" stroke="#eef2f7" />`;
      })
      .join("");

    const gridH = Array.from({ length: 6 })
      .map((_, i) => {
        const gy = padT + (i * (H - padT - padB)) / 5;
        return `<line x1="${padL}" y1="${gy}" x2="${
          W - padR
        }" y2="${gy}" stroke="#eef2f7" />`;
      })
      .join("");

    const svg = `
<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="${W}" height="${H}" fill="white"/>

  ${gridV}
  ${gridH}

  <!-- axes -->
  <line x1="${padL}" y1="${xAxisY}" x2="${
      W - padR
    }" y2="${xAxisY}" stroke="#94a3b8" stroke-width="1.2"/>
  <line x1="${yAxisX}" y1="${padT}" x2="${yAxisX}" y2="${
      H - padB
    }" stroke="#94a3b8" stroke-width="1.2"/>

  <!-- polyline -->
  <polyline points="${poly}" fill="none" stroke="#2563eb" stroke-width="2.6"/>

  <!-- points -->
  ${pts
    .map(([x, y]) => {
      const cx = px(x),
        cy = py(y);
      return `<circle cx="${cx}" cy="${cy}" r="4" fill="#2563eb" />`;
    })
    .join("")}

  <!-- labels -->
  <text x="${W / 2}" y="${
      H - 18
    }" text-anchor="middle" font-size="13" fill="#334155">${xLabel}</text>
  <text x="18" y="${H / 2}" text-anchor="middle" font-size="13" fill="#334155"
    transform="rotate(-90 18 ${H / 2})">${yLabel}</text>

  <!-- bounds -->
  <text x="${padL}" y="${
      H - padB + 20
    }" font-size="11" fill="#64748b">${minX.toFixed(2)}</text>
  <text x="${W - padR}" y="${
      H - padB + 20
    }" text-anchor="end" font-size="11" fill="#64748b">${maxX.toFixed(2)}</text>
  <text x="${padL - 8}" y="${
      padT + 12
    }" text-anchor="end" font-size="11" fill="#64748b">${maxY.toFixed(2)}</text>
  <text x="${padL - 8}" y="${
      H - padB
    }" text-anchor="end" font-size="11" fill="#64748b">${minY.toFixed(2)}</text>
</svg>
    `.trim();

    return {
      "Nokta Sayısı": pts.length,

      __plot: {
        svg,
        caption:
          "Noktalar X’e göre sıralanır ve doğrusal olarak birleştirilir.",
      },

      __table: {
        headers: ["X", "Y"],
        // CalculatorPage array-of-array destekliyor
        rows: pts.map(([x, y]) => [x, y]),
        note: "Tablo: girilen (x,y) noktaları (X’e göre sıralı).",
      },
    };
  },
};
