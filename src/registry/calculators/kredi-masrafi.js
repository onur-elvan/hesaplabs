export default {
  id: "kredi-dosya-masrafi",
  category: "Finans",
  title: "Kredi Dosya Masrafı Hesaplama",
  createdAt: "2025-12-28",
  description:
    "Kredi tutarına göre bankaların alabileceği maksimum dosya masrafını hesaplar.",
  seoTitle: "Kredi Dosya Masrafı Hesaplama 2025 - Yasal Sınır Hesapla",

  seoText:
    `Kredi dosya masrafı hesaplama aracı ile bankaların kredi kullandırırken talep ettiği masrafları öğrenin. 
Yasal olarak kredi tutarının binde 5'ini geçemeyen bu masraf kalemini hızlıca analiz edin.`.trim(),

  info: {
    title: "Dosya Masrafı Hakkında Bilmeniz Gerekenler",
    items: [
      "Yasal sınır, kredi tutarının %0.5'i (binde 5) kadardır.",
      "Dosya masrafı üzerinden genellikle %15 oranında BSMV alınır.",
      "Bankalar bu masrafı 'Kredi Tahsis Ücreti' adı altında tahsil eder.",
    ],
  },

  inputs: [
    {
      key: "loanAmount",
      label: "Kredi Tutarı (TL)",
      type: "number",
      default: 100000,
    },
    {
      key: "includeBsmv",
      label: "BSMV Dahil Edilsin mi? (%15)",
      type: "select",
      default: "yes",
      options: [
        { label: "Evet", value: "yes" },
        { label: "Hayır", value: "no" },
      ],
    },
  ],

  compute(values) {
    const krediTutari = Number(values.loanAmount);
    const bsmvDahil = values.includeBsmv === "yes";

    if (!isFinite(krediTutari) || krediTutari <= 0) {
      return { hata: "Lütfen geçerli bir kredi tutarı giriniz." };
    }

    // Yasal sınır: Kredi tutarının binde 5'i
    const masrafOrani = 0.005;
    const temelMasraf = krediTutari * masrafOrani;

    let toplamTahsilat = temelMasraf;
    let bsmvTutari = 0;

    if (bsmvDahil) {
      bsmvTutari = temelMasraf * 0.15;
      toplamTahsilat = temelMasraf + bsmvTutari;
    }

    return {
      "Net Dosya Masrafı": temelMasraf.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      }),
      "BSMV Tutarı": bsmvTutari.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      }),
      "Toplam Masraf": toplamTahsilat.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      }),
      "Yasal Oran": "%0.5 (Binde 5)",
      Not: "Bu tutar, bankanın sizden talep edebileceği maksimum tahsis ücretidir.",
    };
  },
};
