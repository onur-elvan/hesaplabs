// src/registry/calculators/uslu-log-hesaplayici.js

export default {
  id: "uslu-log-hesaplayici",
  category: "Matematik",
  title: "Üslü & Logaritma Hesaplayıcı",
  createdAt: "2025-12-25",
  description:
    "Üslü sayı, kök ve logaritma işlemlerini (a^b, b√a, log_a(b)) hesaplar ve adım adım gösterir.",
  seoTitle:
    "Üslü Sayı ve Logaritma Hesaplama – a^b, Kök Alma, logₐ(b) Hesaplayıcı",

  seoText: `
Bu araç ile üslü sayı, kök ve logaritma işlemlerini tek ekrandan yapabilirsin.

Desteklenen işlemler:
- Üslü sayı: a^b (örnek: 2^10, 10^3, 1.05^12)
- Kök alma: b√a (örnek: √9, ³√8, ⁴√16)
- Logaritma: logₐ(b) (örnek: log₂(8), log₁₀(1000), ln(e^3) ≈ 3)

Kullanılan temel formüller:
- Üslü sayı: a^b
- Kök alma: b√a = a^(1/b)
- Logaritma: logₐ(b) = ln(b) / ln(a)  (taban değişim formülü)

Sonuçlar yanında kısa açıklama ve gerekirse yaklaşık değer gösterilir.
`.trim(),

  info: {
    title: "Üslü Sayı ve Logaritma Hızlı Özet",
    items: [
      "a^b ifadesinde a taban, b ise üst (üs) olarak adlandırılır.",
      "b√a, üslü gösterimle a^(1/b) şeklinde yazılabilir.",
      "logₐ(b), 'a tabanında b'nin logaritması' demektir ve a^x = b denklemindeki x'i verir.",
      "Logaritma için a > 0, a ≠ 1 ve b > 0 olmalıdır.",
    ],
    disclaimer:
      "Bu araç yaklaşık sayıları ondalık olarak yuvarlar. Matematiksel çalışmalarında sonuç hassasiyetini ihtiyacına göre kontrol et.",
  },

  inputs: [
    {
      key: "mode",
      label: "İşlem tipi",
      type: "select",
      default: "power",
      options: [
        { value: "power", label: "Üslü sayı (a^b)" },
        { value: "root", label: "Kök alma (b√a)" },
        { value: "log", label: "Logaritma (logₐ(b))" },
      ],
    },
    {
      key: "a",
      label: "Taban / İçerik (a)",
      type: "number",
      default: 2,
      placeholder: "Örn: 2, 9, 10...",
    },
    {
      key: "b",
      label: "Üs / Derece / Logaritma argümanı (b)",
      type: "number",
      default: 3,
      placeholder: "Örn: 3, 2, 8...",
    },
    {
      key: "precision",
      label: "Ondalık basamak sayısı",
      type: "number",
      default: 6,
      advanced: true,
      placeholder: "Örn: 4, 6, 8",
    },
  ],

  compute(values) {
    const mode = values.mode || "power";
    const a = num(values.a);
    const b = num(values.b);
    let precision = Math.floor(num(values.precision));
    if (!Number.isFinite(precision) || precision < 0) precision = 6;
    if (precision > 12) precision = 12;

    if (!isFinite(a)) return { hata: "a sayısı geçerli olmalı." };
    if (!isFinite(b)) return { hata: "b sayısı geçerli olmalı." };

    const steps = [];
    let result;
    let exactExpr = "";
    let typeLabel = "";

    if (mode === "power") {
      // Üslü sayı a^b
      typeLabel = "Üslü sayı (a^b)";
      result = Math.pow(a, b);

      steps.push(`1) İşlem tipi: üslü sayı, a^b.`);
      steps.push(`2) a = ${a}, b = ${b}.`);
      steps.push(`3) Sonuç: ${a}^${b} = ${result}.`);

      exactExpr = `${a}^${b}`;
    } else if (mode === "root") {
      // Kök alma: b√a = a^(1/b)
      typeLabel = "Kök alma (b√a)";

      if (b === 0) {
        return { hata: "Kök derecesi (b) 0 olamaz." };
      }
      if (a < 0 && Math.abs(b % 2) !== 1) {
        return {
          hata: "Negatif sayının çift dereceli kökü gerçek sayı değildir (bu hesaplayıcı sadece reel sayılarla çalışır).",
        };
      }

      const exponent = 1 / b;
      result = Math.pow(a, exponent);

      steps.push(`1) İşlem tipi: kök alma, b√a.`);
      steps.push(`2) a = ${a}, b = ${b}.`);
      steps.push(`3) b√a = a^(1/b) = ${a}^(1/${b}).`);
      steps.push(`4) Sonuç: ${b}√${a} ≈ ${result}.`);

      exactExpr = `${b}√${a}`;
    } else if (mode === "log") {
      // log_a(b) = ln(b) / ln(a)
      typeLabel = "Logaritma (logₐ(b))";

      if (a <= 0 || a === 1) {
        return {
          hata: "Logaritma için taban a > 0 ve a ≠ 1 olmalı.",
        };
      }
      if (b <= 0) {
        return {
          hata: "Logaritma için argüman (b) pozitif olmalı (b > 0).",
        };
      }

      const lnA = Math.log(a);
      const lnB = Math.log(b);
      result = lnB / lnA;

      steps.push(`1) İşlem tipi: logaritma, logₐ(b).`);
      steps.push(`2) a = ${a}, b = ${b}.`);
      steps.push(
        `3) Taban değişim formülü kullanılır: logₐ(b) = ln(b) / ln(a).`
      );
      steps.push(`4) ln(b) = ln(${b}) ≈ ${lnB}.`);
      steps.push(`5) ln(a) = ln(${a}) ≈ ${lnA}.`);
      steps.push(`6) Sonuç: log_${a}(${b}) ≈ ${result}.`);

      exactExpr = `log_${a}(${b})`;
    } else {
      return { hata: "Bilinmeyen işlem tipi." };
    }

    const approx =
      Number.isFinite(result) && !Number.isInteger(result)
        ? Number(result.toFixed(precision))
        : result;

    return {
      "İşlem tipi": typeLabel,
      a,
      b,
      İfade: exactExpr,
      "Sonuç (ham)": result,
      [`Sonuç (≈ ${precision} ondalık)`]: approx,
      Açıklama: steps.join("\n"),

      __table: {
        headers: ["Adım", "Açıklama"],
        rows: steps.map((s, i) => [i + 1, s]),
        note: "Adımlar, işlemin nasıl yapıldığını anlatmak için metin olarak listelenmiştir.",
      },
    };
  },
};

// Yardımcılar
function num(x) {
  if (x === null || x === undefined || x === "") return NaN;
  return Number(String(x).replace(",", "."));
}
