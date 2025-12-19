export default {
  id: "takdir-tesekkur",
  category: "Eğitim",
  title: "Takdir Teşekkür Hesaplama",
  description:
    "Ortalamanıza göre Takdir/Teşekkür durumunu hesaplar (genel eşikler).",
  inputs: [
    {
      key: "ortalama",
      label: "Yıl Sonu Ortalama",
      type: "number",
      default: 80,
      placeholder: "0-100",
    },
  ],
  compute(values) {
    const ort = Number(values.ortalama ?? 0);
    if (Number.isNaN(ort)) return { Hata: "Lütfen sayısal değer gir." };
    if (ort < 0 || ort > 100) return { Hata: "Ortalama 0-100 arası olmalı." };

    // Genel kullanılan eşikler:
    // Teşekkür: 70.00 - 84.99
    // Takdir: 85.00 - 100.00
    let sonuc = "Belge yok";
    if (ort >= 85) sonuc = "Takdir";
    else if (ort >= 70) sonuc = "Teşekkür";

    return {
      Ortalama: ort,
      "Belge Durumu": sonuc,
      Not: "Eşikler okul yönetmeliğine göre değişebilir.",
    };
  },
};
