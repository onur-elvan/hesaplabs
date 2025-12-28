export default {
  id: "kredi-karti-ek-taksit",
  category: "Finans",
  title: "Kredi Kartı Ek Taksit Hesaplama",
  createdAt: "2025-12-28",
  description:
    "Peşin harcamalarınızı taksitlendirdiğinizde oluşacak aylık ödeme ve toplam maliyeti hesaplar.",
  seoTitle: "Kredi Kartı Sonradan Taksitlendirme Hesaplama - 2025",

  seoText:
    `Kredi kartı ek taksit hesaplama aracı ile peşin alışverişlerinizi taksitlendirmenin maliyetini öğrenin. 
Güncel faiz oranları ve vergi (KKDF, BSMV) dahil net taksit tutarını hesaplayın.`.trim(),

  info: {
    title: "Ek Taksit Hakkında Bilmeniz Gerekenler",
    items: [
      "Faiz oranı, bankanızın belirlediği 'Alışveriş Faizi' üzerinden hesaplanır.",
      "Faiz tutarı üzerine %15 KKDF ve %15 BSMV (Toplam %30 vergi) eklenir.",
      "Taksitlendirme işlemi genellikle hesap kesim tarihinden önce yapılmalıdır.",
    ],
  },

  inputs: [
    {
      key: "spentAmount",
      label: "Harcama Tutarı (TL)",
      type: "number",
      default: 5000,
    },
    { key: "installments", label: "Taksit Sayısı", type: "number", default: 6 },
    {
      key: "monthlyInterest",
      label: "Aylık Faiz Oranı (%)",
      type: "number",
      default: 5.0,
    },
  ],

  compute(values) {
    const tutar = Number(values.spentAmount);
    const taksit = Number(values.installments);
    const faizOrani = Number(values.monthlyInterest) / 100;

    if (!isFinite(tutar) || !isFinite(taksit) || tutar <= 0 || taksit <= 1) {
      return {
        hata: "Lütfen geçerli bir tutar ve 1'den büyük bir taksit sayısı giriniz.",
      };
    }

    // Vergi oranları (KKDF %15, BSMV %15 -> Toplam %30 vergi yükü faiz üzerine biner)
    const vergiOrani = 1.3;
    const brutFaiz = faizOrani * vergiOrani;

    // Taksit Hesaplama Formülü (Anüite): T = [P * i * (1+i)^n] / [(1+i)^n - 1]
    const ustKisim = tutar * brutFaiz * Math.pow(1 + brutFaiz, taksit);
    const altKisim = Math.pow(1 + brutFaiz, taksit) - 1;
    const aylikTaksit = ustKisim / altKisim;

    const toplamGeriOdeme = aylikTaksit * taksit;
    const toplamMaliyet = toplamGeriOdeme - tutar;

    return {
      "Aylık Taksit Tutarı": aylikTaksit.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      }),
      "Toplam Geri Ödeme": toplamGeriOdeme.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      }),
      "Toplam Faiz + Vergi Maliyeti": toplamMaliyet.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      }),
      "Uygulanan Brüt Faiz": `%${(brutFaiz * 100).toFixed(2)} (Vergiler Dahil)`,
    };
  },
};
