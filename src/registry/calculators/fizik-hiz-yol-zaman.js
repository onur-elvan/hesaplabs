export default {
  id: "fizik-hiz-yol-zaman",
  title: "Hız – Yol – Zaman Hesaplama",
  seoTitle: "Hız Yol Zaman Hesaplama + Tablo ve Grafik",
  category: "Fizik",
  createdAt: "2025-10-24",
  description:
    "Sabit hızla hareket eden cismin yol, zaman ve hız ilişkisini hesapla. İstersen tablo ve hız-zaman grafiğiyle gör.",
  seoText: `Hız–yol–zaman ilişkisi sabit hızlı hareketin temel konusudur.
Formül: Yol = Hız × Zaman

Bu araç:
- Toplam yolu hesaplar
- Adım adım tablo oluşturur
- Hız–zaman grafiği çizer (sabit hız → yatay doğru)
`.trim(),
  inputs: [
    { key: "hiz", label: "Hız (m/s)", type: "number", placeholder: "Örn: 12" },
    {
      key: "zaman",
      label: "Zaman (s)",
      type: "number",
      placeholder: "Örn: 10",
    },
    {
      key: "adim",
      label: "Tablo adımı (s)",
      type: "select",
      options: [
        { label: "1", value: "1" },
        { label: "0.5", value: "0.5" },
        { label: "2", value: "2" },
      ],
      default: "1",
      advanced: true,
    },
  ],

  compute(values) {
    const v = Number(values.hiz || 0);
    const t = Number(values.zaman || 0);
    const step = Number(values.adim || 1);

    if (!Number.isFinite(v) || v < 0) return { hata: "Hız geçersiz." };
    if (!Number.isFinite(t) || t <= 0)
      return { hata: "Zaman 0'dan büyük olmalı." };
    if (!Number.isFinite(step) || step <= 0)
      return { hata: "Adım 0'dan büyük olmalı." };

    const yol = v * t;

    // tablo (array-of-array)
    const rows = [];
    for (let time = 0; time <= t + 1e-9; time += step) {
      const s = v * time;
      rows.push([
        Number(time.toFixed(2)),
        Number(v.toFixed(2)),
        Number(s.toFixed(2)),
      ]);
    }

    // hız-zaman grafiği: yatay doğru (points: [x,y])
    const pts = rows.map((r) => [r[0], r[1]]);

    // Basit SVG plot üret
    const makePlotSvg = ({ points, xLabel, yLabel }) => {
      const W = 760;
      const H = 360;
      const padL = 60;
      const padR = 20;
      const padT = 20;
      const padB = 50;

      // min/max
      let minX = points[0][0],
        maxX = points[0][0],
        minY = points[0][1],
        maxY = points[0][1];

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

      // margin
      const xPad = (maxX - minX) * 0.06;
      const yPad = (maxY - minY) * 0.2;
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

  <line x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${
        H - padB
      }" stroke="#9ca3af" stroke-width="1.5"/>
  <line x1="${padL}" y1="${padT}" x2="${padL}" y2="${
        H - padB
      }" stroke="#9ca3af" stroke-width="1.5"/>

  <polyline points="${poly}" fill="none" stroke="#2563eb" stroke-width="2" />

  ${points
    .map(
      ([x, y]) => `
    <circle cx="${sx(x)}" cy="${sy(y)}" r="3.5" fill="#2563eb"/>
  `
    )
    .join("")}

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

    const plotSvg = makePlotSvg({
      points: pts,
      xLabel: "Zaman (s)",
      yLabel: "Hız (m/s)",
    });

    return {
      "Toplam Yol (m)": yol,
      "Hız (m/s)": v,
      "Zaman (s)": t,

      __table: {
        headers: ["Zaman (s)", "Hız (m/s)", "Alınan Yol (m)"],
        rows,
        note: "Sabit hızda hız-zaman grafiği yatay doğrudur. Grafikte alan, alınan yolu temsil eder.",
      },

      __plot: {
        svg: plotSvg,
        caption: "Sabit hız → v(t) sabit, bu yüzden grafik yatay bir doğrudur.",
      },
    };
  },
};
