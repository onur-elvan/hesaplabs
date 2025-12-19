export default {
  id: "su-ihtiyaci",
  category: "Sağlık",
  title: "Günlük Su İhtiyacı",
  description: "Kilo bazlı yaklaşık günlük su ihtiyacını hesaplar.",
  inputs: [
    { key: "weightKg", label: "Kilo (kg)", type: "number", default: 75 },
    {
      key: "mlPerKg",
      label: "ml / kg",
      type: "select",
      default: "35",
      options: [
        { label: "30 ml/kg (düşük)", value: "30" },
        { label: "35 ml/kg (orta)", value: "35" },
        { label: "40 ml/kg (yüksek)", value: "40" },
      ],
    },
  ],
  compute(values) {
    const w = Number(values.weightKg);
    const mlPerKg = Number(values.mlPerKg);
    if (!isFinite(w) || !isFinite(mlPerKg) || w <= 0) {
      return { hata: "Kilo pozitif olmalı." };
    }

    const ml = w * mlPerKg;
    const litre = ml / 1000;

    return {
      ml_gün: ml,
      litre_gün: litre,
      not: "Bu yaklaşık bir hesaplamadır.",
    };
  },
};
