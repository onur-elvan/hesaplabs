export default {
  id: "bmr-tdee",
  category: "Sağlık",
  title: "Bazal Metabolizma (BMR) + Günlük Kalori (TDEE)",
  description: "Mifflin-St Jeor ile BMR ve aktiviteye göre TDEE hesaplar.",
  createdAt: "2025-10-24",
  inputs: [
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
    { key: "age", label: "Yaş", type: "number", default: 30 },
    { key: "heightCm", label: "Boy (cm)", type: "number", default: 175 },
    { key: "weightKg", label: "Kilo (kg)", type: "number", default: 75 },
    {
      key: "activity",
      label: "Aktivite Seviyesi",
      type: "select",
      default: "1.55",
      options: [
        { label: "Hareketsiz (1.2)", value: "1.2" },
        { label: "Az aktif (1.375)", value: "1.375" },
        { label: "Orta aktif (1.55)", value: "1.55" },
        { label: "Çok aktif (1.725)", value: "1.725" },
        { label: "Aşırı aktif (1.9)", value: "1.9" },
      ],
    },
  ],
  compute(values) {
    const sex = values.sex;
    const age = Number(values.age);
    const h = Number(values.heightCm);
    const w = Number(values.weightKg);
    const act = Number(values.activity);

    if (
      ![age, h, w, act].every((n) => isFinite(n)) ||
      age <= 0 ||
      h <= 0 ||
      w <= 0
    ) {
      return { hata: "Yaş/boy/kilo pozitif olmalı." };
    }

    // Mifflin-St Jeor
    const base = 10 * w + 6.25 * h - 5 * age;
    const bmr = sex === "male" ? base + 5 : base - 161;

    const tdee = bmr * act;

    return {
      BMR_kcal_gün: bmr,
      TDEE_kcal_gün: tdee,
      not: "BMR: dinlenme kalorisi, TDEE: günlük tahmini ihtiyaç.",
    };
  },
};
