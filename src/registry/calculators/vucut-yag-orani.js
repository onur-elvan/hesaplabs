export default {
  id: "vucut-yag-orani",
  category: "Sağlık",
  title: "Vücut Yağ Oranı (US Navy)",
  description:
    "US Navy yöntemine göre yağ oranını hesaplar (bel, boyun, boy; kadınlarda kalça da gerekir).",
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
    { key: "heightCm", label: "Boy (cm)", type: "number", default: 175 },
    { key: "neckCm", label: "Boyun (cm)", type: "number", default: 38 },
    { key: "waistCm", label: "Bel (cm)", type: "number", default: 85 },
    {
      key: "hipCm",
      label: "Kalça (cm) (Kadınlar için)",
      type: "number",
      default: 100,
    },
  ],
  compute(values) {
    const sex = values.sex;
    const h = Number(values.heightCm);
    const neck = Number(values.neckCm);
    const waist = Number(values.waistCm);
    const hip = Number(values.hipCm);

    if (
      ![h, neck, waist].every((n) => isFinite(n)) ||
      h <= 0 ||
      neck <= 0 ||
      waist <= 0
    ) {
      return { hata: "Boy, boyun ve bel pozitif olmalı." };
    }

    // log10 fonksiyonu
    const log10 = (x) => Math.log(x) / Math.LN10;

    let bf = null;

    if (sex === "male") {
      const x = waist - neck;
      if (x <= 0)
        return { hata: "Bel - boyun pozitif olmalı (ölçüleri kontrol et)." };

      // US Navy (erkek)
      bf = 495 / (1.0324 - 0.19077 * log10(x) + 0.15456 * log10(h)) - 450;
    } else {
      // kadın
      if (!isFinite(hip) || hip <= 0)
        return { hata: "Kadınlar için kalça pozitif olmalı." };

      const x = waist + hip - neck;
      if (x <= 0)
        return {
          hata: "Bel + kalça - boyun pozitif olmalı (ölçüleri kontrol et).",
        };

      bf = 495 / (1.29579 - 0.35004 * log10(x) + 0.221 * log10(h)) - 450;
    }

    // basit kontrol
    if (!isFinite(bf))
      return { hata: "Hesaplama başarısız. Ölçüleri kontrol et." };

    // sınıflandırma (çok kaba)
    let sinif = "Bilinmiyor";
    if (sex === "male") {
      if (bf < 6) sinif = "Çok Düşük";
      else if (bf < 14) sinif = "Atletik";
      else if (bf < 18) sinif = "Fit";
      else if (bf < 25) sinif = "Ortalama";
      else sinif = "Yüksek";
    } else {
      if (bf < 14) sinif = "Çok Düşük";
      else if (bf < 21) sinif = "Atletik";
      else if (bf < 25) sinif = "Fit";
      else if (bf < 32) sinif = "Ortalama";
      else sinif = "Yüksek";
    }

    return {
      yağ_oranı_yüzde: bf,
      sınıf: sinif,
      not: "US Navy yöntemi yaklaşık sonuç verir.",
    };
  },
};
