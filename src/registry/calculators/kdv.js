export default {
  id: "kdv",
  title: "KDV Hesaplama",
  category: "Muhasebe",
  description: "KDV dahil/hariç tutara göre KDV ve toplamı hesaplar.",
  seoTitle: "KDV Hesaplama – %1, %10 ve %20 KDV Dahil ve Hariç Hesaplama Aracı",
  seoText: `
KDV hesaplama aracı ile bir ürün veya hizmetin
KDV dahil ve KDV hariç tutarını saniyeler içinde hesaplayabilirsin.

Bu araç sayesinde:
- %1, %10 ve %20 KDV oranlarına göre hesaplama yapabilirsin
- KDV dahil fiyattan KDV tutarını ayırabilirsin
- KDV hariç fiyata KDV ekleyerek satış fiyatını görebilirsin

Kimler için uygundur?
- Esnaflar
- Muhasebeciler
- Öğrenciler
- E-ticaret ile uğraşanlar

Türkiye’de güncel KDV oranları esas alınarak hazırlanmıştır.

Not: Hesaplama sonuçları bilgilendirme amaçlıdır, resmi işlemler için muhasebe kayıtları esas alınmalıdır.
`.trim(),

  inputs: [
    {
      key: "amount",
      label: "Tutar",
      type: "number",
      placeholder: "örn: 50000",
      default: 0,
    },
    {
      key: "rate",
      label: "KDV Oranı",
      type: "select",
      default: 20,
      options: [
        { label: "%1", value: 1 },
        { label: "%10", value: 10 },
        { label: "%20", value: 20 },
      ],
    },
    {
      key: "mode",
      label: "Tutar Tipi",
      type: "select",
      default: "haric",
      options: [
        { label: "KDV Hariç (net)", value: "haric" },
        { label: "KDV Dahil (brüt)", value: "dahil" },
      ],
    },
  ],

  compute(v) {
    const amount = Number(v.amount);
    const ratePercent = Number(v.rate); // 10, 20...
    const rate = ratePercent / 100;
    const mode = v.mode;

    if (!Number.isFinite(amount) || amount < 0) {
      return { hata: "Tutar geçersiz" };
    }
    if (!Number.isFinite(ratePercent) || ratePercent < 0) {
      return { hata: "KDV oranı geçersiz" };
    }

    // KDV hariç girildiyse:
    if (mode === "haric") {
      const kdvTutar = amount * rate;
      const toplam = amount + kdvTutar;

      return {
        net: amount,
        kdvOrani: ratePercent, // % olarak
        kdvTutari: kdvTutar,
        toplam: toplam,
      };
    }

    // KDV dahil girildiyse:
    const net = amount / (1 + rate);
    const kdvTutar = amount - net;

    return {
      brut: amount,
      kdvOrani: ratePercent, // % olarak
      net: net,
      kdvTutari: kdvTutar,
    };
  },
};
