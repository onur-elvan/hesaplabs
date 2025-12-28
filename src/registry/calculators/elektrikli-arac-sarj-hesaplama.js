export default {
  id: "elektrikli-arac-sarj-hesaplama",
  category: "Günlük",
  title: "Elektrikli Araç Şarj Hesaplama Aracı",
  createdAt: "2025-12-28",
  description:
    "Batarya kapasitesi, şarj gücü ve menzil bilgilerine göre süre ve maliyet analizi yapar.",
  seoTitle: "Elektrikli Araç Şarj Süresi ve Maliyeti Hesaplama 2025",

  seoText:
    `Elektrikli araç şarj hesaplama aracı ile aracınızın ne kadar sürede dolacağını ve şarj maliyetini öğrenin. 
AC ve DC istasyonlardaki şarj hızlarını ve 100 km'deki ortalama güç tüketimini analiz edin.`.trim(),

  info: {
    title: "Şarj Süresini Etkileyen Faktörler",
    items: [
      "Şarj Gücü (kW): İstasyonun ve aracın desteklediği maksimum güç süreyi belirler.",
      "Batarya Kapasitesi (kWh): Aracınızın bataryasının toplam enerji depolama kapasitesidir.",
      "Sıcaklık: Çok düşük veya çok yüksek sıcaklıklar şarj hızını düşürebilir.",
    ],
  },

  inputs: [
    {
      key: "islem",
      label: "Yapılacak İşlem",
      type: "select",
      default: "sure",
      options: [
        { label: "Şarj Süresini Hesapla", value: "sure" },
        { label: "Şarj Ücretini Hesapla", value: "ucret" },
        { label: "Yolculuk Maliyetini Hesapla", value: "yolculuk" },
      ],
    },
    {
      key: "topBatarya",
      label: "Top. Batarya Kapasitesi (kWh)",
      type: "number",
      default: 77.45,
    },
    { key: "sarjGucu", label: "Şarj Gücü (kW)", type: "number", default: 22 },
    {
      key: "basSeviye",
      label: "Başlangıç Seviyesi (%)",
      type: "number",
      default: 20,
    },
    {
      key: "dolumSiniri",
      label: "Dolum Sınırı (%)",
      type: "number",
      default: 80,
    },
    {
      key: "birimFiyat",
      label: "Şarj Birim Fiyatı (TL/kWh)",
      type: "number",
      default: 8.5,
      advanced: true,
    },
    {
      key: "tuketim",
      label: "Ort. Tüketim (kWh/100km)",
      type: "number",
      default: 18,
      advanced: true,
    },
  ],

  compute(v) {
    const batarya = Number(v.topBatarya);
    const guc = Number(v.sarjGucu);
    const bas = Number(v.basSeviye);
    const son = Number(v.dolumSiniri);
    const fiyat = Number(v.birimFiyat);

    if (bas >= son)
      return { hata: "Başlangıç seviyesi dolum sınırından küçük olmalıdır." };
    if (guc <= 0 || batarya <= 0)
      return { hata: "Lütfen geçerli değerler giriniz." };

    // İhtiyaç duyulan enerji (kWh)
    const enerjiIhtiyaci = (batarya * (son - bas)) / 100;

    // Şarj Süresi (Saat)
    const sureSaat = enerjiIhtiyaci / guc;
    const saat = Math.floor(sureSaat);
    const dakika = Math.round((sureSaat - saat) * 60);

    // Maliyetler
    const toplamMaliyet = enerjiIhtiyaci * fiyat;

    return {
      "Gerekli Enerji": `${enerjiIhtiyaci.toFixed(2)} kWh`,
      "Tahmini Şarj Süresi": `${saat > 0 ? saat + " sa " : ""}${dakika} dk`,
      "Toplam Şarj Maliyeti": toplamMaliyet.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      }),
      "Birim Enerji Maliyeti": fiyat.toFixed(2) + " TL/kWh",
      __table: {
        headers: ["Parametre", "Değer"],
        rows: [
          ["Kapasite", batarya + " kWh"],
          ["Şarj Gücü", guc + " kW"],
          ["Dolum Aralığı", `%${bas} -> %${son}`],
          ["Maliyet", toplamMaliyet.toFixed(2) + " TL"],
        ],
        note: "Şarj hızı %80'den sonra batarya sağlığı için otomatik olarak düşebilir.",
      },
    };
  },
};
