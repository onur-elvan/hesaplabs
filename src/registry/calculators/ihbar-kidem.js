export default {
  id: "ihbar-kidem",
  title: "İhbar + Kıdem Tazminatı Hesaplama",
  seoTitle: "İhbar ve Kıdem Tazminatı Hesaplama – Yaklaşık Simülasyon",
  category: "Maaş & İş",
  description:
    "Brüt maaş ve çalışma süresine göre ihbar + kıdem tazminatını yaklaşık hesapla.",
  seoText: `
Bu hesaplama, ihbar ve kıdem tazminatını yaklaşık olarak simüle eder.

Önemli:
- Kıdem tazminatında “tavan”, yan haklar, fesih nedeni gibi detaylar sonucu değiştirir.
- İhbar süresi, kıdeme göre haftalar üzerinden hesaplanır.

Sonuçlar bilgilendirme amaçlıdır; resmi işlem için uzman/kurum doğrulaması önerilir.
`.trim(),
  inputs: [
    {
      key: "brut",
      label: "Aylık Brüt Maaş (₺)",
      type: "number",
      placeholder: "Örn: 60000",
      default: 0,
    },
    {
      key: "yil",
      label: "Çalışma Süresi (yıl)",
      type: "number",
      placeholder: "Örn: 3",
      default: 0,
    },
    {
      key: "ay",
      label: "Ek Ay (0-11)",
      type: "number",
      placeholder: "Örn: 6",
      default: 0,
      advanced: true,
    },
  ],
  compute(v) {
    const brut = Number(v.brut || 0);
    const yil = Number(v.yil || 0);
    const ay = Number(v.ay || 0);

    if (![brut, yil, ay].every(Number.isFinite))
      return { Hata: "Değerler geçersiz." };
    if (brut < 0 || yil < 0 || ay < 0 || ay > 11)
      return { Hata: "Süre değerleri hatalı." };

    const toplamYil = yil + ay / 12;

    // Kıdem: (yaklaşık) her yıl 1 brüt maaş
    const kidem = brut * toplamYil;

    // İhbar haftaları (yaygın tablo)
    // 0-0.5y: 2 hafta, 0.5-1.5y: 4 hafta, 1.5-3y: 6 hafta, 3y+: 8 hafta
    let ihbarHafta = 0;
    if (toplamYil < 0.5) ihbarHafta = 2;
    else if (toplamYil < 1.5) ihbarHafta = 4;
    else if (toplamYil < 3) ihbarHafta = 6;
    else ihbarHafta = 8;

    const gunlukBrut = brut / 30;
    const ihbarGun = ihbarHafta * 7;
    const ihbar = gunlukBrut * ihbarGun;

    const toplam = kidem + ihbar;

    return {
      "Kıdem (₺) ~": kidem,
      "İhbar (₺) ~": ihbar,
      "İhbar Süresi (hafta)": ihbarHafta,
      "Toplam (₺) ~": toplam,
      __table: {
        title: "Hesap Özeti",
        headers: ["Kalem", "Değer"],
        rows: [
          ["Toplam çalışma (yıl)", toplamYil.toFixed(2)],
          ["İhbar süresi (hafta)", ihbarHafta],
          ["İhbar süresi (gün)", ihbarGun],
          ["Kıdem ~ (₺)", kidem],
          ["İhbar ~ (₺)", ihbar],
          ["Toplam ~ (₺)", toplam],
        ],
      },
    };
  },
};
