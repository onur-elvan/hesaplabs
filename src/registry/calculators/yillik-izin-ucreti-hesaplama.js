export default {
  id: "yillik-izin-ucreti-hesaplama",
  category: "Muhasebe",
  title: "Yıllık İzin Ücreti Hesaplama Aracı",
  createdAt: "2025-12-28",
  description:
    "İşten ayrılma durumunda hak kazanılan ancak kullanılmayan yıllık izin sürelerinin ücret karşılığını hesaplar.",
  seoTitle: "Yıllık İzin Ücreti Hesaplama 2025 - Brüt ve Net Maaş",

  seoText:
    `Yıllık izin ücreti hesaplama aracı ile kullanılmayan izinlerinizin parasal karşılığını öğrenin. 
İşe başlama ve ayrılma tarihlerine göre hak edilen toplam izin gün sayısını ve tazminat tutarını analiz edin.`.trim(),

  info: {
    title: "Yıllık İzin Hakkı Hakkında Bilgiler",
    items: [
      "1 - 5 yıl arası çalışanlara: En az 14 gün,",
      "5 - 15 yıl arası çalışanlara: En az 20 gün,",
      "15 yıl ve üzeri çalışanlara: En az 26 gün izin verilir.",
      "18 yaşından küçük ve 50 yaşından büyük çalışanlara 20 günden az izin verilemez.",
    ],
  },

  inputs: [
    {
      key: "dogumTarihi",
      label: "Doğum Tarihi",
      type: "date",
      default: "1990-01-01",
    },
    {
      key: "baslangicTarihi",
      label: "İşe Başlama Tarihi (Deneme dahil)",
      type: "date",
      default: "2020-01-01",
    },
    {
      key: "ayrilmaTarihi",
      label: "İşten Ayrılma Tarihi",
      type: "date",
      default: "2025-12-28",
    },
    {
      key: "kullanilanIzin",
      label: "Kullanılan İzin Süresi (Gün)",
      type: "number",
      default: 0,
    },
    {
      key: "hesaplamaSekli",
      label: "Hesaplama Şekli",
      type: "select",
      default: "net",
      options: [
        { label: "Net maaş ile hesapla", value: "net" },
        { label: "Brüt maaş ile hesapla", value: "brut" },
      ],
    },
    {
      key: "aylikMaas",
      label: "Aylık Maaş (TL)",
      type: "number",
      default: 45000,
    },
  ],

  compute(v) {
    const baslangic = new Date(v.baslangicTarihi);
    const ayrilma = new Date(v.ayrilmaTarihi);
    const dogum = new Date(v.dogumTarihi);
    const aylikMaas = Number(v.aylikMaas);
    const kullanilan = Number(v.kullanilanIzin);

    if (isNaN(baslangic) || isNaN(ayrilma) || ayrilma <= baslangic) {
      return {
        hata: "Lütfen geçerli işe başlama ve ayrılma tarihleri giriniz.",
      };
    }

    // Çalışma süresi (Yıl bazında)
    const calismaSuresiYil =
      (ayrilma - baslangic) / (1000 * 60 * 60 * 24 * 365.25);
    const tamYil = Math.floor(calismaSuresiYil);

    // Yaş kontrolü (İzin hakkı alt sınırı için)
    const yas = (ayrilma - dogum) / (1000 * 60 * 60 * 24 * 365.25);

    if (tamYil < 1) {
      return {
        Sonuç: "İzin Hakkı Oluşmadı",
        Not: "1 yılı doldurmayan çalışanların yasal yıllık ücretli izin hakkı bulunmamaktadır.",
      };
    }

    // Yasal izin günlerini belirleme (Kademeli)
    let toplamHakEdilen = 0;
    for (let i = 1; i <= tamYil; i++) {
      let yillikHak = 14;
      if (i > 5) yillikHak = 20;
      if (i > 15) yillikHak = 26;

      // 18 yaş altı veya 50 yaş üstü koruması
      if (yas < 18 || yas > 50) {
        if (yillikHak < 20) yillikHak = 20;
      }
      toplamHakEdilen += yillikHak;
    }

    const kalanIzin = toplamHakEdilen - kullanilan;
    const gunlukMaas = aylikMaas / 30;
    const toplamUcret = Math.max(0, kalanIzin * gunlukMaas);

    return {
      "Toplam Çalışma Süresi": `${tamYil} Yıl`,
      "Toplam Hak Edilen İzin": `${toplamHakEdilen} Gün`,
      "Kalan İzin Süresi": `${kalanIzin} Gün`,
      "Ödenecek İzin Ücreti": toplamUcret.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      }),
      "Günlük Maaş Karşılığı": gunlukMaas.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      }),
      __table: {
        headers: ["Açıklama", "Değer"],
        rows: [
          [
            "Hesaplama Tipi",
            v.hesaplamaSekli === "net"
              ? "Net Maaş Üzerinden"
              : "Brüt Maaş Üzerinden",
          ],
          ["Hak Edilen Toplam", `${toplamHakEdilen} Gün`],
          ["Kullanılan", `${kullanilan} Gün`],
          ["Ücreti Ödenecek", `${kalanIzin} Gün`],
        ],
        note: "Yıllık izin ücretinden yasal olarak gelir vergisi ve damga vergisi kesintisi yapılmaktadır.",
      },
    };
  },
};
