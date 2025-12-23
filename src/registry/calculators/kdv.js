export default {
  id: "kdv",
  title: "KDV Hesaplama",
  category: "Muhasebe",
  description: "KDV dahil/hariç tutara göre KDV ve toplamı hesaplar.",
  createdAt: "2025-10-24",

  // ✅ Daha doğal ve güçlü başlık
  seoTitle: "KDV Hesaplama: %1, %10, %20 KDV Dahil/Hariç Hesaplama (Net-Brüt)",

  // ✅ Snippet + kullanıcı odaklı SEO metni
  seoText: `
KDV hesaplama aracı ile KDV hariç (net) veya KDV dahil (brüt) tutar üzerinden KDV tutarını ve toplam fiyatı saniyeler içinde hesaplayabilirsin.

KDV nasıl hesaplanır?
- KDV hariç fiyat → KDV = Net × (Oran/100), Toplam = Net + KDV
- KDV dahil fiyat → Net = Brüt / (1 + Oran/100), KDV = Brüt − Net

Bu araçta Türkiye’de yaygın kullanılan %1, %10 ve %20 KDV oranlarıyla hesaplama yapabilirsin.
E-ticaret ürün fiyatı, fatura kalemi, hizmet bedeli veya muhasebe ödevi gibi durumlarda hızlıca net/brüt ayrımı yapmak için uygundur.

Not: Sonuçlar bilgilendirme amaçlıdır. Resmi işlemler için muhasebe kayıtları ve güncel mevzuat esas alınmalıdır.
`.trim(),

  // ✅ Sayfa içinde mavi bilgilendirme kutusu (isteğe bağlı ama SEO + UX için çok iyi)
  info: {
    title: "Hızlı Rehber",
    items: [
      "Net (KDV hariç) girersen: KDV tutarı ve KDV dahil toplamı görürsün.",
      "Brüt (KDV dahil) girersen: Net tutarı ve içindeki KDV’yi ayırır.",
      "Oranı seç: %1, %10 veya %20.",
    ],
    disclaimer:
      "Bilgilendirme amaçlıdır. Resmi işlemlerde muhasebe kayıtları esas alınmalıdır.",
  },

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
      const kdvTutari = amount * rate;
      const toplam = amount + kdvTutari;

      return {
        net: amount,
        kdvOrani: ratePercent,
        kdvTutari,
        toplam,
      };
    }

    // KDV dahil girildiyse:
    const net = amount / (1 + rate);
    const kdvTutari = amount - net;

    return {
      brut: amount,
      kdvOrani: ratePercent,
      net,
      kdvTutari,
      toplam: amount, // ✅ kullanıcı sonucu listesinde "toplam" görmek istiyor genelde
    };
  },
};
