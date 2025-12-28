export default {
  id: "arsa-payi-hesaplama",
  category: "Gayrimenkul",
  title: "Arsa Payı Hesaplama Aracı",
  createdAt: "2025-12-28",
  description:
    "Hisse ve yüzölçümü bilgilerine göre arsa payı, metrekare karşılığı veya aidat dağılımını hesaplar.",
  seoTitle: "Arsa Payı Hesaplama - Metrekare ve Aidat Payı Sorgulama",

  seoText:
    `Arsa payı hesaplama aracı ile tapudaki hissenizin kaç metrekareye denk geldiğini öğrenin. 
Apartman giderlerinin arsa payına göre dağılımını ve bağımsız bölüm paylarını kolayca analiz edin.`.trim(),

  info: {
    title: "Arsa Payı Nedir?",
    items: [
      "Arsa payı, bağımsız bölümlere (daire, dükkan) tahsis edilen ortak mülkiyet payıdır.",
      "Kat mülkiyeti kanununa göre aidat ve gider dağılımında temel alınabilir.",
      "Kentsel dönüşüm süreçlerinde hak sahipliği belirlenirken arsa payı kritik rol oynar.",
    ],
  },

  inputs: [
    {
      key: "islemTipi",
      label: "Yapılacak İşlem",
      type: "select",
      default: "m2-hesapla",
      options: [
        {
          label: "Hisse ve yüzölçümü ile metrekare hesaplama",
          value: "m2-hesapla",
        },
        {
          label: "Hisse ve toplam gider ile aidat hesaplama",
          value: "gider-hesapla",
        },
      ],
    },
    { key: "pay", label: "Arsa Payı (Pay)", type: "number", default: 18 },
    { key: "payda", label: "Arsa Payı (Payda)", type: "number", default: 1256 },
    {
      key: "toplamDeger",
      label: "Arsa Yüzölçümü (m²) veya Toplam Gider (TL)",
      type: "number",
      default: 1320.76,
    },
  ],

  compute(v) {
    const pay = Number(v.pay);
    const payda = Number(v.payda);
    const toplamDeger = Number(v.toplamDeger);
    const tip = v.islemTipi;

    if (!pay || !payda || payda <= 0 || pay > payda) {
      return {
        hata: "Lütfen geçerli bir pay/payda oranı giriniz (Pay, paydadan büyük olamaz).",
      };
    }
    if (!toplamDeger || toplamDeger <= 0) {
      return {
        hata: "Lütfen geçerli bir yüzölçümü veya gider tutarı giriniz.",
      };
    }

    // Hesaplama: (Toplam Değer / Payda) * Pay
    const sonuc = (toplamDeger / payda) * pay;
    const hisseOrani = (pay / payda) * 100;

    const birimLabel = tip === "m2-hesapla" ? "m²" : "TL";
    const sonucLabel =
      tip === "m2-hesapla"
        ? "Hisseye Düşen Alan"
        : "Hisseye Düşen Gider (Aidat)";

    return {
      "Hisse Oranı": `%${hisseOrani.toFixed(4)}`,
      [sonucLabel]: `${sonuc.toFixed(2)} ${birimLabel}`,
      "Birim Başı Değer": `${(toplamDeger / payda).toFixed(
        4
      )} ${birimLabel}/Pay`,
      __table: {
        headers: ["Açıklama", "Değer"],
        rows: [
          ["Tapu Arsa Payı", `${pay} / ${payda}`],
          [
            tip === "m2-hesapla"
              ? "Toplam Arsa Alanı"
              : "Toplam Apartman Gideri",
            `${toplamDeger.toLocaleString("tr-TR")} ${birimLabel}`,
          ],
          ["Hissenin Yüzdelik Karşılığı", `% ${hisseOrani.toFixed(4)}`],
          ["Net Sonuç", `${sonuc.toFixed(2)} ${birimLabel}`],
        ],
        note: "Hesaplama tapu kayıtlarındaki arsa payı ve payda oranına göre yapılmıştır.",
      },
    };
  },
};
