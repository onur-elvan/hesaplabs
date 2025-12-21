export default {
  id: "bel-kalca-orani",
  category: "Sağlık",
  title: "Bel / Kalça Oranı (WHR)",
  description: "Bel çevresinin kalça çevresine oranını hesaplar (WHR).",
  seoTitle: "Bel Kalça Oranı Hesaplama – Vücut Yağ Dağılımı",

  seoText: `
Bel kalça oranı hesaplama aracı ile vücut yağ dağılımını analiz edebilirsin.
Bu oran, kalp-damar hastalıkları riskini değerlendirmede kullanılır.
`.trim(),

  info: {
    title: "Bel Kalça Oranı Ne Anlama Gelir?",
    items: [
      "Düşük oran daha sağlıklı kabul edilir.",
      "Yüksek oran kalp hastalığı riskini artırabilir.",
    ],
  },

  inputs: [
    { key: "waistCm", label: "Bel (cm)", type: "number", default: 85 },
    { key: "hipCm", label: "Kalça (cm)", type: "number", default: 100 },
    {
      key: "sex",
      label: "Cinsiyet",
      type: "select",
      default: "male",
      options: [
        { label: "Erkek", value: "male" },
        { label: "Kadın", value: "female" },
      ],
    },
  ],
  compute(values) {
    const waist = Number(values.waistCm);
    const hip = Number(values.hipCm);
    const sex = values.sex;

    if (!isFinite(waist) || !isFinite(hip) || waist <= 0 || hip <= 0) {
      return { hata: "Bel ve kalça pozitif olmalı." };
    }

    const whr = waist / hip;

    // Basit risk yorumu (yaygın kullanılan eşikler):
    // Kadın: >0.85 yüksek risk, Erkek: >0.90 yüksek risk
    const limit = sex === "female" ? 0.85 : 0.9;
    const risk = whr > limit ? "Yüksek Risk" : "Daha Düşük Risk";

    return {
      WHR: whr,
      eşik: limit,
      risk,
      not: "Eşikler genel kılavuz niteliğindedir.",
    };
  },
};
