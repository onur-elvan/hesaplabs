export default {
  id: "bilesik-faiz",
  title: "Bileşik Faiz Hesaplama",
  category: "Finans",
  description:
    "Anapara, faiz oranı ve dönem sayısına göre bileşik faiz hesaplar.",
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
