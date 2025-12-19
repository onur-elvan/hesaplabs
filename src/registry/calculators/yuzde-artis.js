export default {
  id: "yuzde-artis",
  title: "Yüzde Artış / Azalış",
  category: "Matematik",
  description: "Bir değerin yüzde artış veya azalışını hesaplar.",
  inputs: [
    { key: "old", label: "Eski Değer", type: "number", default: 0 },
    { key: "new", label: "Yeni Değer", type: "number", default: 0 },
  ],
  compute(v) {
    const oldVal = Number(v.old);
    const newVal = Number(v.new);
    const diff = newVal - oldVal;
    const percent = oldVal === 0 ? 0 : (diff / oldVal) * 100;
    return {
      eski: oldVal,
      yeni: newVal,
      fark: diff,
      yuzde: percent,
    };
  },
};
