function parseList(text) {
  if (!text) return [];
  return String(text)
    .replace(/\s+/g, " ")
    .split(/[,;\s]+/g)
    .map((x) => x.replace(",", "."))
    .filter(Boolean)
    .map(Number)
    .filter((n) => Number.isFinite(n));
}

function median(arr) {
  const a = [...arr].sort((x, y) => x - y);
  const n = a.length;
  if (n === 0) return 0;
  const mid = Math.floor(n / 2);
  return n % 2 ? a[mid] : (a[mid - 1] + a[mid]) / 2;
}

export default {
  id: "istatistik",
  category: "Matematik",
  title: "İstatistik (Ortalama, Medyan, Std. Sapma)",
  description: "Sayı listesinden temel istatistikleri hesaplar.",
  seoTitle: "İstatistik Hesaplama – Ortalama, Medyan, Mod ve Dağılım",

  seoText: `
İstatistik hesaplama aracı ile sayı dizilerinin ortalama, medyan, mod ve
temel dağılım ölçülerini hızlıca hesaplayabilirsin.

Öğrenciler, öğretmenler ve veri analizi yapanlar için pratik bir araçtır.
`.trim(),

  inputs: [
    {
      key: "list",
      label: "Sayı Listesi",
      type: "text",
      placeholder: "Örn: 10, 12, 15 18 20",
      default: "10, 12, 15, 18, 20",
    },
  ],
  compute(values) {
    const nums = parseList(values.list);
    if (nums.length === 0) return { hata: "Liste boş veya geçersiz" };

    const n = nums.length;
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / n;

    const med = median(nums);

    // varyans (popülasyon)
    const varPop = nums.reduce((acc, x) => acc + (x - mean) ** 2, 0) / n;
    const stdPop = Math.sqrt(varPop);

    // örneklem (n-1)
    const varSample =
      n > 1 ? nums.reduce((acc, x) => acc + (x - mean) ** 2, 0) / (n - 1) : 0;
    const stdSample = Math.sqrt(varSample);

    return {
      adet: n,
      toplam: sum,
      ortalama: mean,
      medyan: med,
      varyans_pop: varPop,
      std_pop: stdPop,
      varyans_orneklem: varSample,
      std_orneklem: stdSample,
    };
  },
};
