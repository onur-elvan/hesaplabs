export default {
  id: "part-time-maas",
  title: "Part-Time Maaş Hesaplama",
  seoTitle: "Part-Time Maaş Hesaplama – Saat/Gün Bazlı Aylık Kazanç",
  category: "Maaş & İş",
  description:
    "Saatlik ücret ve haftalık çalışma saatine göre aylık part-time kazancını hesapla.",
  inputs: [
    {
      key: "saatUcret",
      label: "Saatlik Ücret (₺)",
      type: "number",
      placeholder: "Örn: 200",
      default: 0,
    },
    {
      key: "haftaSaat",
      label: "Haftalık Çalışma Saati",
      type: "number",
      placeholder: "Örn: 20",
      default: 0,
    },
    {
      key: "ayHafta",
      label: "Ayda Hafta Sayısı",
      type: "select",
      default: "4.33",
      options: [
        { label: "4", value: "4" },
        { label: "4.33 (ortalama)", value: "4.33" },
        { label: "5", value: "5" },
      ],
    },
  ],
  seoText: `
Part-time maaş hesaplama aracı; saatlik ücretini ve haftalık çalışma saatini girerek aylık tahmini gelirini hesaplar.

İpucu: 4.33 ay başına ortalama hafta sayısıdır ve genelde en gerçekçi sonuçtur.
`.trim(),
  compute(v) {
    const saatUcret = Number(v.saatUcret || 0);
    const haftaSaat = Number(v.haftaSaat || 0);
    const ayHafta = Number(v.ayHafta || 4.33);

    if (![saatUcret, haftaSaat, ayHafta].every(Number.isFinite))
      return { Hata: "Değerler geçersiz." };

    const haftalik = saatUcret * haftaSaat;
    const aylik = haftalik * ayHafta;

    return {
      "Haftalık Kazanç (₺)": haftalik,
      "Aylık Tahmini Kazanç (₺)": aylik,
      "Aylık Hafta Katsayısı": ayHafta,
    };
  },
};
