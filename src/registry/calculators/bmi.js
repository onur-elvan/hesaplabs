export default {
  id: "bmi",
  category: "Sağlık",
  title: "Vücut Kitle İndeksi (BMI)",
  description: "Boy ve kiloya göre BMI hesaplar ve sınıflandırır.",
  inputs: [
    { key: "heightCm", label: "Boy (cm)", type: "number", default: 175 },
    { key: "weightKg", label: "Kilo (kg)", type: "number", default: 75 },
  ],
  compute(values) {
    const hCm = Number(values.heightCm);
    const w = Number(values.weightKg);
    if (!isFinite(hCm) || !isFinite(w) || hCm <= 0 || w <= 0) {
      return { hata: "Boy ve kilo pozitif olmalı." };
    }

    const h = hCm / 100;
    const bmi = w / (h * h);

    let sinif = "";
    if (bmi < 18.5) sinif = "Zayıf";
    else if (bmi < 25) sinif = "Normal";
    else if (bmi < 30) sinif = "Fazla Kilolu";
    else if (bmi < 35) sinif = "Obez (Sınıf 1)";
    else if (bmi < 40) sinif = "Obez (Sınıf 2)";
    else sinif = "Morbid Obez (Sınıf 3)";

    return {
      BMI: bmi,
      sınıf: sinif,
    };
  },
};
