export default {
  id: "zam-indirim",
  title: "Zam / İndirim Hesaplama",
  category: "Günlük",
  description:
    "Eski ve yeni fiyata göre artış/azalış tutarı ve oranını hesaplar.",
  inputs: [
    { key: "old", label: "Eski Fiyat", type: "number", default: 0 },
    { key: "new", label: "Yeni Fiyat", type: "number", default: 0 },
  ],
  compute(v) {
    const oldVal = Number(v.old);
    const newVal = Number(v.new);
    const fark = newVal - oldVal;
    const oran = oldVal === 0 ? 0 : (fark / oldVal) * 100;

    return {
      eski: oldVal,
      yeni: newVal,
      fark: fark,
      oranYuzde: oran,
      durum: fark >= 0 ? "Zam" : "İndirim",
    };
  },
};
