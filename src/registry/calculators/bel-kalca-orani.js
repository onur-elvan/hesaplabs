export default {
  id: "bel-kalca-orani",
  category: "Sağlık",
  title: "Bel / Kalça Oranı (WHR)",
  description: "Bel çevresinin kalça çevresine oranını hesaplar (WHR).",
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
