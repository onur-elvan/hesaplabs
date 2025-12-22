export default {
  id: "hiz-zaman-grafik",
  title: "Hız–Zaman Grafiğinden Yol",
  seoTitle: "Hız Zaman Grafiğinden Yol Bulma – Trapez Yöntemi",
  category: "Fizik",
  description:
    "Zaman-hız noktalarını gir, grafiği çiz ve toplam yolu (alanı) trapez yöntemiyle hesapla.",
  seoText: `
Hız–zaman grafiğinde (v–t) eğrisinin altında kalan alan, alınan yolu verir.

Bu araç:
- Verdiğin (t, v) noktalarından grafiği çizer
- Trapez yöntemiyle toplam yolu (yaklaşık integral) hesaplar

Giriş formatı:
t, v
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
      key: "unitT",
      label: "Zaman Birimi (t)",
      type: "select",
      default: "s",
      options: [
        { label: "s (saniye)", value: "s" },
        { label: "dk (dakika)", value: "min" },
        { label: "saat", value: "h" },
      ],
      advanced: true,
    },
    {
      key: "unitV",
      label: "Hız Birimi (v)",
      type: "select",
      default: "m/s",
      options: [
        { label: "m/s", value: "m/s" },
        { label: "km/h", value: "km/h" },
        { label: "km/s", value: "km/s" },
      ],
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
      const parts = line.split(/[,\s]+/).filter(Boolean);
      if (parts.length < 2) continue;
      const t = Number(parts[0]);
      const vel = Number(parts[1]);
      if (Number.isFinite(t) && Number.isFinite(vel)) pts.push([t, vel]);
    }

    if (pts.length < 2) return { hata: "Geçerli en az 2 nokta gerekli." };

    // t'ye göre sırala
    pts.sort((a, b) => a[0] - b[0]);

    // Birim dönüşümleri
    const tUnit = v.unitT || "s";
    const vUnit = v.unitV || "m/s";

    const toSeconds = (t) => {
      if (tUnit === "min") return t * 60;
      if (tUnit === "h") return t * 3600;
      return t; // s
    };

    const toMS = (vel) => {
      if (vUnit === "km/h") return (vel * 1000) / 3600;
      if (vUnit === "km/s") return vel * 1000;
      return vel; // m/s
    };

    // Trapez alanı (SI bazında: m)
    let distanceM = 0;

    for (let i = 0; i < pts.length - 1; i++) {
      const [t1, v1] = pts[i];
      const [t2, v2] = pts[i + 1];

      const dt = toSeconds(t2) - toSeconds(t1);
      if (dt <= 0) continue;

      const v1ms = toMS(v1);
      const v2ms = toMS(v2);

      distanceM += ((v1ms + v2ms) / 2) * dt;
    }

    const distanceKm = distanceM / 1000;

    // SVG plot üret (points -> polyline)
    const makePlotSvg = ({ points, xLabel, yLabel }) => {
      // Grafik alanı
      const W = 760;
      const H = 360;
      const padL = 60;
      const padR = 20;
      const padT = 20;
      const padB = 50;

      // min/max
      let minX = points[0][0];
      let maxX = points[0][0];
      let minY = points[0][1];
      let maxY = points[0][1];

      for (const [x, y] of points) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }

      // aralık 0 olmasın
      if (minX === maxX) {
        minX -= 1;
        maxX += 1;
      }
      if (minY === maxY) {
        minY -= 1;
        maxY += 1;
      }

      // biraz margin
      const xPad = (maxX - minX) * 0.06;
      const yPad = (maxY - minY) * 0.1;
      minX -= xPad;
      maxX += xPad;
      minY -= yPad;
      maxY += yPad;

      const plotW = W - padL - padR;
      const plotH = H - padT - padB;

      const sx = (x) => padL + ((x - minX) / (maxX - minX)) * plotW;
      const sy = (y) => padT + (1 - (y - minY) / (maxY - minY)) * plotH;

      const poly = points
        .map(([x, y]) => `${sx(x).toFixed(2)},${sy(y).toFixed(2)}`)
        .join(" ");

      // basit tick (5)
      const ticks = 5;
      const xTicks = Array.from({ length: ticks + 1 }, (_, i) => {
        const x = minX + ((maxX - minX) * i) / ticks;
        return { x, px: sx(x) };
      });

      const yTicks = Array.from({ length: ticks + 1 }, (_, i) => {
        const y = minY + ((maxY - minY) * i) / ticks;
        return { y, py: sy(y) };
      });

      const esc = (s) =>
        String(s)
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#39;");

      return `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect x="0" y="0" width="${W}" height="${H}" fill="white"/>
  
  <!-- grid + ticks -->
  ${xTicks
    .map(
      (t) => `
    <line x1="${t.px}" y1="${padT}" x2="${t.px}" y2="${
        H - padB
      }" stroke="#e5e7eb" stroke-width="1"/>
    <text x="${t.px}" y="${
        H - padB + 18
      }" font-size="11" text-anchor="middle" fill="#6b7280">${esc(
        t.x.toFixed(2)
      )}</text>
  `
    )
    .join("")}

  ${yTicks
    .map(
      (t) => `
    <line x1="${padL}" y1="${t.py}" x2="${W - padR}" y2="${
        t.py
      }" stroke="#e5e7eb" stroke-width="1"/>
    <text x="${padL - 8}" y="${
        t.py + 4
      }" font-size="11" text-anchor="end" fill="#6b7280">${esc(
        t.y.toFixed(2)
      )}</text>
  `
    )
    .join("")}

  <!-- axes -->
  <line x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${
        H - padB
      }" stroke="#9ca3af" stroke-width="1.5"/>
  <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${
        H - padB
      }" stroke="#9ca3af" stroke-width="1.5"/>

  <!-- polyline -->
  <polyline points="${poly}" fill="none" stroke="#2563eb" stroke-width="2" />

  <!-- points -->
  ${points
    .map(
      ([x, y]) => `
    <circle cx="${sx(x)}" cy="${sy(y)}" r="3.5" fill="#2563eb"/>
  `
    )
    .join("")}

  <!-- labels -->
  <text x="${W / 2}" y="${
        H - 10
      }" font-size="12" text-anchor="middle" fill="#111827">${esc(
        xLabel
      )}</text>
  <text x="14" y="${
    H / 2
  }" font-size="12" text-anchor="middle" fill="#111827" transform="rotate(-90 14 ${
        H / 2
      })">${esc(yLabel)}</text>
</svg>
      `.trim();
    };

    const xLabel = `Zaman (t) [${
      tUnit === "s" ? "s" : tUnit === "min" ? "dk" : "saat"
    }]`;
    const yLabel = `Hız (v) [${vUnit}]`;

    const plotSvg = makePlotSvg({
      points: pts,
      xLabel,
      yLabel,
    });

    return {
      "Toplam Yol (m)": distanceM,
      "Toplam Yol (km)": distanceKm,
      "Nokta Sayısı": pts.length,

      __plot: {
        svg: plotSvg,
        caption:
          "Alan (∫v dt) trapez yöntemiyle yaklaşık hesaplanır. Noktalar arasında doğrusal kabul edilir.",
      },

      __table: {
        headers: ["Bilgi", "Değer"],
        rows: [
          { Bilgi: "Yöntem", Değer: "Trapez (parçalı doğrusal)" },
          { Bilgi: "Zaman birimi", Değer: xLabel },
          { Bilgi: "Hız birimi", Değer: yLabel },
          { Bilgi: "Toplam yol", Değer: `${distanceM.toFixed(2)} m` },
          { Bilgi: "Toplam yol", Değer: `${distanceKm.toFixed(4)} km` },
        ],
        note: "Eğer hız negatifse alan negatif katkı yapar (yönlü yer değiştirme gibi). Mutlak yol için hızın mutlak değerini kullanmak gerekir.",
      },
    };
  },
};
