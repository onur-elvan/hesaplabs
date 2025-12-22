export default {
  id: "saatlik-aylik-maas",
  title: "Saatlik → Aylık Maaş Dönüşümü",
  seoTitle: "Saatlik Ücretten Aylık Maaş Hesaplama",
  category: "Maaş & İş",
  description:
    "Saatlik ücreti, haftalık çalışma saatini ve ayda kaç hafta çalıştığını girerek aylık kazancını hesapla.",
  inputs: [
    {
      key: "saatUcret",
      label: "Saatlik Ücret (₺)",
      type: "number",
      placeholder: "Örn: 250",
    },
    {
      key: "haftaSaat",
      label: "Haftalık Çalışma Saati",
      type: "number",
      placeholder: "Örn: 45",
    },
    {
      key: "ayHafta",
      label: "Ayda Kaç Hafta?",
      type: "select",
      options: [
        { label: "4", value: "4" },
        { label: "4.33 (ortalama)", value: "4.33" },
        { label: "5", value: "5" },
      ],
      default: "4.33",
    },
  ],
  seoText: `Saatlik ücretten aylık maaş dönüşümü; freelance, part-time ve saat bazlı çalışanlar için aylık gelir tahmini sağlar.

İpucu:
- “4.33” ay başına ortalama hafta sayısıdır ve daha gerçekçi sonuç verir.`,
  compute(values) {
    const saatUcret = Number(values.saatUcret || 0);
    const haftaSaat = Number(values.haftaSaat || 0);
    const ayHafta = Number(values.ayHafta || 4.33);

    const haftalik = saatUcret * haftaSaat;
    const aylik = haftalik * ayHafta;

    return {
      "Haftalık Kazanç (₺)": haftalik,
      "Aylık Tahmini Kazanç (₺)": aylik,
      "Seçilen Ay/Hafta": ayHafta,
    };
  },
};
