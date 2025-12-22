export default {
  id: "yillik-isveren-maliyeti",
  title: "Yıllık Toplam Maliyet (İşverene)",
  seoTitle: "İşverene Yıllık Maliyet Hesaplama – Maaş + SGK + Yan Haklar",
  category: "Maaş & İş",
  description:
    "Aylık brüt maaş, yan haklar ve işveren SGK oranı ile işverene yıllık toplam maliyeti hesapla.",
  seoText: `
İşverene yıllık maliyet (Total Cost of Employment), brüt maaşa ek olarak işveren SGK payı ve yan hakları da dahil ederek şirketin yıllık toplam giderini gösterir.

Neleri kapsar?
- Brüt maaşın yıllık toplamı
- İşveren SGK / işveren payı (oranla)
- Yan haklar (yemek, yol, özel sağlık, prim vb.)

Not: Oranlar sektör ve teşvik durumuna göre değişebilir. Resmi bordro için mali müşavir/İK doğrulaması önerilir.
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
      key: "yanHak",
      label: "Aylık Yan Haklar (₺)",
      type: "number",
      placeholder: "Örn: 5000",
      default: 0,
    },
    {
      key: "isverenOran",
      label: "İşveren Payı Oranı (%)",
      type: "number",
      placeholder: "Örn: 20.5",
      default: 20.5,
      advanced: true,
    },
    {
      key: "aySayisi",
      label: "Kaç Ay Üzerinden?",
      type: "select",
      default: 12,
      options: [
        { label: "12", value: 12 },
        { label: "13 (ikramiye dahil)", value: 13 },
        { label: "14", value: 14 },
      ],
      advanced: true,
    },
  ],
  compute(v) {
    const brut = Number(v.brut || 0);
    const yanHak = Number(v.yanHak || 0);
    const oran = Number(v.isverenOran ?? 20.5);
    const ay = Number(v.aySayisi ?? 12);

    if (![brut, yanHak, oran, ay].every(Number.isFinite))
      return { Hata: "Alanlardan biri geçersiz." };
    if (brut < 0 || yanHak < 0 || oran < 0 || ay <= 0)
      return { Hata: "Değerler 0 veya pozitif olmalı." };

    const aylikIsverenPay = brut * (oran / 100);
    const aylikToplam = brut + aylikIsverenPay + yanHak;

    const yillikBrut = brut * ay;
    const yillikIsverenPay = aylikIsverenPay * ay;
    const yillikYanHak = yanHak * ay;
    const yillikToplam = aylikToplam * ay;

    return {
      "Aylık Toplam (₺)": aylikToplam,
      "Yıllık Toplam (₺)": yillikToplam,
      __table: {
        title: "Detay Döküm",
        headers: ["Kalem", "Aylık (₺)", "Yıllık (₺)"],
        rows: [
          ["Brüt Maaş", brut, yillikBrut],
          ["İşveren Payı", aylikIsverenPay, yillikIsverenPay],
          ["Yan Haklar", yanHak, yillikYanHak],
          ["TOPLAM", aylikToplam, yillikToplam],
        ],
      },
    };
  },
};
