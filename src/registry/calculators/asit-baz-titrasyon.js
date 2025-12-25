export default {
  id: "asit-baz-titrasyonu-strong",
  category: "Kimya",
  title: "Asit–Baz Titrasyonu pH Eğrisi (Güçlü Asit – Güçlü Baz)",
  createdAt: "2025-12-25",

  description:
    "Güçlü asit–güçlü baz titrasyonunda pH–hacim eğrisini ve eşdeğerlik noktasını hesaplar. HCl–NaOH gibi sistemler için uygundur.",

  seoTitle: "Asit–Baz Titrasyonu pH Eğrisi Hesaplama | Güçlü Asit Güçlü Baz",
  seoText: `
Asit–baz titrasyonu, çözeltideki asit veya baz derişimini belirlemek için
bilinen derişimde çözelti ile nötrleştirme işlemidir. Bu araç,
özellikle HCl – NaOH gibi güçlü asit–güçlü baz titrasyonlarında
pH–hacim eğrisini adım adım hesaplar.

Titrasyon 4 ana bölgeye ayrılır:

1) Başlangıç: çözeltide sadece asit vardır.
pH = -log[H+]

2) Eşdeğerlik öncesi: asit fazladır.
[H+] = (n_asit - n_baz) / toplam hacim

3) Eşdeğerlik noktası:
n_asit = n_baz
pH = 7 (25°C)

4) Eşdeğerlik sonrası: baz fazladır.
[OH-] = (n_baz - n_asit) / toplam hacim
pH = 14 - pOH

Bu araç, her hacim adımı için pH hesaplayarak
tam bir pH–hacim grafiği oluşturur.
Ayrıca eşdeğerlik hacmini ve kritik pH noktalarını gösterir.

Kullanım alanları:
• lise AYT kimya
• üniversite genel kimya
• analitik kimya giriş
• laboratuvar ön hesaplamaları
• eğitim ve pratik tekrar

Denge, nötralizasyon ve logaritma kavramlarının birleştiği bu konu,
asit–baz kimyasının temel taşlarından biridir.
  `.trim(),

  info: {
    title: "Güçlü Asit – Güçlü Baz Titrasyonu",
    items: [
      "Eşdeğerlik noktasında pH = 7 (25°C)",
      "HCl – NaOH gibi tam ayrışan sistemler için geçerlidir",
      "pH–hacim eğrisi otomatik çizilir",
      "Eşdeğerlik hacmi hesaplanır",
    ],
    disclaimer:
      "Teorik eğitim amaçlıdır. Zayıf asit–baz sistemleri için kullanmayınız.",
  },

  inputs: [
    { key: "Ca", label: "Asit derişimi (M)", type: "number", default: 0.1 },
    { key: "Va", label: "Asit hacmi (mL)", type: "number", default: 50 },
    { key: "Cb", label: "Baz derişimi (M)", type: "number", default: 0.1 },
    { key: "step", label: "Hacim adımı (mL)", type: "number", default: 1 },
  ],

  compute(v) {
    const Ca = num(v.Ca);
    const Va = num(v.Va) / 1000;
    const Cb = num(v.Cb);
    const step = Math.max(0.2, num(v.step));

    if (Ca <= 0 || Va <= 0 || Cb <= 0)
      return { hata: "Tüm değerler pozitif olmalıdır." };

    const nAsit = Ca * Va;

    const eqVol = (nAsit / Cb) * 1000;

    const rows = [];
    for (let Vb = 0; Vb <= eqVol * 2; Vb += step) {
      const Vbl = Vb / 1000;
      const nBaz = Cb * Vbl;
      const Vtop = Va + Vbl;

      let pH;

      if (nBaz < nAsit) {
        const h = (nAsit - nBaz) / Vtop;
        pH = -Math.log10(h);
      } else if (Math.abs(nBaz - nAsit) < 1e-12) {
        pH = 7;
      } else {
        const oh = (nBaz - nAsit) / Vtop;
        const pOH = -Math.log10(oh);
        pH = 14 - pOH;
      }

      rows.push({ Vb, pH });
    }

    const svg = plot(rows);

    return {
      "Eşdeğerlik hacmi (mL)": round2(eqVol),

      __plot: {
        svg,
        caption: "pH–hacim titrasyon eğrisi (güçlü asit–güçlü baz)",
      },
    };
  },
};

function num(x) {
  return Number(String(x ?? "").replace(",", "."));
}

function round2(x) {
  return Number(x.toFixed(2));
}

// basit svg grafik üretici
function plot(rows) {
  const W = 520;
  const H = 300;
  const pad = 36;

  const maxX = Math.max(...rows.map((r) => r.Vb));
  const minY = 0;
  const maxY = 14;

  const pts = rows
    .map((r) => {
      const x = pad + (r.Vb / maxX) * (W - pad * 2);
      const y = H - pad - ((r.pH - minY) / (maxY - minY)) * (H - pad * 2);
      return `${x},${y}`;
    })
    .join(" ");

  return `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="${W}" height="${H}" fill="white" />
  <polyline fill="none" stroke="#2563eb" stroke-width="2" points="${pts}" />
  <text x="10" y="18" font-size="12">pH - Hacim Titrasyon Eğrisi</text>
</svg>`;
}
