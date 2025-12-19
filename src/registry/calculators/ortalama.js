export default {
  id: "ortalama",
  title: "Ortalama (Aritmetik)",
  category: "Matematik",
  description: "Virgülle ayrılmış sayılara göre aritmetik ortalamayı hesaplar.",
  inputs: [
    {
      key: "numbers",
      label: "Sayılar (virgülle ayır)",
      type: "text",
      placeholder: "örn: 10, 20, 30",
      default: "",
    },
  ],
  compute(v) {
    const raw = String(v.numbers || "");
    const parts = raw
      .split(/[,;\s]+/g)
      .map((x) => x.trim())
      .filter(Boolean);

    const nums = parts
      .map((x) => Number(x.replace(",", ".")))
      .filter(Number.isFinite);

    if (nums.length === 0) return { hata: "Geçerli sayı girin" };

    const toplam = nums.reduce((a, b) => a + b, 0);
    const ortalama = toplam / nums.length;

    return {
      adet: nums.length,
      toplam,
      ortalama,
    };
  },
};
