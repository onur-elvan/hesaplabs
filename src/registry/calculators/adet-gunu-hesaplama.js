export default {
  id: "adet-gunu-hesaplama",
  category: "Sağlık",
  title: "Adet Günü ve Yumurtlama Takvimi",
  createdAt: "2025-12-28",
  description:
    "Gelecek 12 ay için adet tarihlerini ve hamile kalma olasılığının yüksek olduğu günleri hesaplar.",
  seoTitle: "Adet Günü Hesaplama ve Yumurtlama Takvimi (Ovülasyon)",

  seoText: `Detaylı adet günü hesaplama aracı ile regl döngünüzü takip edin. 
Gelecek 1 yılın takvimini çıkarın ve yumurtlama dönemi (ovülasyon) tarihlerini öğrenerek planlama yapın.`.trim(),

  info: {
    title: "Hesaplama Yöntemi Hakkında",
    items: [
      "Son adet tarihinizin ilk gününü baz alır.",
      "Döngü süresi, bir adetin ilk gününden diğer adetin ilk gününe kadar geçen süredir.",
      "Yumurtlama genellikle sonraki adetten 14 gün önce gerçekleşir.",
    ],
  },

  inputs: [
    {
      key: "lastPeriodDate",
      label: "Son Adet Başlangıcı",
      type: "date",
      default: "2025-12-28",
    },
    {
      key: "cycleLength",
      label: "Döngü Süresi (Gün)",
      type: "number",
      default: 28,
    },
  ],

  compute(values) {
    const startDate = new Date(values.lastPeriodDate);
    const cycle = Number(values.cycleLength);

    if (isNaN(startDate.getTime()) || cycle < 21 || cycle > 45) {
      return {
        hata: "Lütfen geçerli bir tarih ve döngü süresi (21-45 gün) giriniz.",
      };
    }

    // HATA BURADAYDI: 'long' değerleri küçük harf olmalı
    const formatDate = (date) => {
      return date.toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
        weekday: "long",
      });
    };

    let periodDates = [];
    let ovulationDates = [];

    for (let i = 1; i <= 12; i++) {
      const nextRegl = new Date(startDate);
      nextRegl.setDate(startDate.getDate() + cycle * i);
      periodDates.push(`${i}. Regl Tarihi: ${formatDate(nextRegl)}`);

      const ovulation = new Date(nextRegl);
      ovulation.setDate(nextRegl.getDate() - 14);

      const fertileStart = new Date(ovulation);
      fertileStart.setDate(ovulation.getDate() - 4);
      const fertileEnd = new Date(ovulation);
      fertileEnd.setDate(ovulation.getDate() + 1);

      ovulationDates.push({
        tahmin: `${i}. Tahmini Yumurtlama: ${formatDate(ovulation)}`,
        aralik: `${i}. Hamile Kalınabilecek Dönem: ${formatDate(
          fertileStart
        )} - ${formatDate(fertileEnd)} arası`,
      });
    }

    return {
      "Gelecek 12 Ay Regl Takvimi": periodDates,
      "Yumurtlama ve Doğurganlık Dönemleri": ovulationDates,
      Not: "Bu takvim tahminidir. Stres, beslenme ve mevsimsel değişiklikler döngü tarihlerini etkileyebilir.",
    };
  },
};
