export default {
  id: "seyahat-butcesi-hesaplama",
  category: "Günlük",
  title: "Seyahat Bütçesi Hesaplama",
  createdAt: "2025-12-28",
  description:
    "Tatil planınız için ulaşım, konaklama ve günlük giderleri hesaplayarak toplam maliyeti çıkarır.",
  seoTitle: "Seyahat Bütçesi ve Tatil Maliyeti Hesaplama 2025",

  seoText: `Seyahat bütçesi hesaplama aracı ile tatilinizi planlayın. 
Konaklama, ulaşım ve günlük harcamalarınızı girerek toplam tatil maliyetinizi ve kişi başı harcamanızı hemen öğrenin.`.trim(),

  info: {
    title: "Seyahat Bütçesi Nasıl Planlanır?",
    items: [
      "Sabit Giderler: Uçak bileti, vize ücreti gibi tek seferlik ödemelerdir.",
      "Değişken Giderler: Konaklama, yemek ve eğlence gibi gün sayısına bağlı harcamalardır.",
      "Beklenmedik Durumlar: Toplam bütçenizin %10'u kadar acil durum payı ayırmanız önerilir.",
    ],
  },

  inputs: [
    {
      key: "duration",
      label: "Seyahat Süresi (Gün)",
      type: "number",
      default: 7,
    },
    { key: "personCount", label: "Kişi Sayısı", type: "number", default: 2 },
    {
      key: "transportation",
      label: "Toplam Ulaşım (Bilet vb. - Toplam)",
      type: "number",
      default: 5000,
    },
    {
      key: "accommodationPerNight",
      label: "Gecelik Konaklama (Oda Fiyatı)",
      type: "number",
      default: 2000,
    },
    {
      key: "dailyFoodPerPerson",
      label: "Kişi Başı Günlük Yemek/Eğlence",
      type: "number",
      default: 1000,
    },
    {
      key: "extraCosts",
      label: "Diğer Ekstra Masraflar (Toplam)",
      type: "number",
      default: 1500,
    },
  ],

  compute(values) {
    const gun = Number(values.duration);
    const kisi = Number(values.personCount);
    const ulasim = Number(values.transportation);
    const konaklama =
      Number(values.accommodationPerNight) * (gun > 1 ? gun - 1 : 1); // Gece sayısı
    const yemek = Number(values.dailyFoodPerPerson) * gun * kisi;
    const ekstra = Number(values.extraCosts);

    if (!isFinite(gun) || gun <= 0 || kisi <= 0) {
      return { hata: "Lütfen gün ve kişi sayısını geçerli giriniz." };
    }

    const toplamButce = ulasim + konaklama + yemek + ekstra;
    const kisiBasiToplam = toplamButce / kisi;
    const gunlukKisiBasi = kisiBasiToplam / gun;

    return {
      "Toplam Seyahat Bütçesi": toplamButce.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      }),
      "Kişi Başı Toplam Maliyet": kisiBasiToplam.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      }),
      "Kişi Başı Günlük Ortalama": gunlukKisiBasi.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      }),
      __table: {
        headers: ["Harcama Kalemi", "Tutar (TL)", "Yüzde (%)"],
        rows: [
          [
            "Ulaşım (Bilet/Yakıt)",
            ulasim.toLocaleString("tr-TR"),
            `%${((ulasim / toplamButce) * 100).toFixed(1)}`,
          ],
          [
            "Konaklama",
            konaklama.toLocaleString("tr-TR"),
            `%${((konaklama / toplamButce) * 100).toFixed(1)}`,
          ],
          [
            "Yemek ve Eğlence",
            yemek.toLocaleString("tr-TR"),
            `%${((yemek / toplamButce) * 100).toFixed(1)}`,
          ],
          [
            "Ekstra Giderler",
            ekstra.toLocaleString("tr-TR"),
            `%${((ekstra / toplamButce) * 100).toFixed(1)}`,
          ],
        ],
        note: "Konaklama, (Gün Sayısı - 1) gece üzerinden hesaplanmıştır.",
      },
    };
  },
};
