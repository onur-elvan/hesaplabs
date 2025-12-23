export default {
  id: "bilesik-faiz",
  title: "Bileşik Faiz Hesaplama",
  category: "Finans",
  description:
    "Anapara, faiz oranı ve dönem sayısına göre bileşik faiz hesaplar.",
  seoTitle: "Bileşik Faiz Hesaplama – Faiz Faize Nasıl Eklenir?",
  createdAt: "2025-10-24",

  seoText: `
Bileşik faiz hesaplama aracı, faizin her dönem anaparaya eklenmesiyle
oluşan toplam tutarı hesaplamanı sağlar.

Uzun vadeli yatırımlarda bileşik faiz, basit faize göre çok daha yüksek getiri sağlar.
Bu nedenle yatırım ve birikim planlamasında kritik öneme sahiptir.
`.trim(),

  info: {
    title: "Bileşik Faiz Avantajı",
    items: [
      "Faiz her dönem anaparaya eklenir.",
      "Uzun vadede büyük fark yaratır.",
      "Yatırım ve tasarruf hesaplarında kullanılır.",
    ],
  },

  inputs: [
    { key: "principal", label: "Anapara", type: "number", default: 0 },
    { key: "rate", label: "Faiz Oranı (%)", type: "number", default: 0 },
    {
      key: "periods",
      label: "Dönem Sayısı",
      type: "number",
      placeholder: "örn: 12",
      default: 12,
    },
  ],
  compute(v) {
    const p = Number(v.principal);
    const r = Number(v.rate) / 100;
    const n = Number(v.periods);

    if (!Number.isFinite(p) || p < 0) return { hata: "Anapara geçersiz" };
    if (!Number.isFinite(r) || r < 0) return { hata: "Faiz oranı geçersiz" };
    if (!Number.isFinite(n) || n < 0) return { hata: "Dönem sayısı geçersiz" };

    const toplam = p * Math.pow(1 + r, n);
    const faiz = toplam - p;

    return {
      anapara: p,
      oranYuzde: Number(v.rate),
      donem: n,
      faiz: faiz,
      toplam: toplam,
    };
  },
};
