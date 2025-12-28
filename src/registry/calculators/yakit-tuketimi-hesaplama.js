export default {
  id: "yakit-tuketimi-hesaplama",
  category: "Günlük",
  title: "Yakıt Tüketimi Hesaplama Aracı",
  createdAt: "2025-12-28",
  description:
    "Ödenen tutar, gidilen mesafe ve yakıt fiyatına göre aracınızın yakıt tüketim performansını hesaplar.",
  seoTitle: "Yakıt Tüketimi Hesaplama - 100 km'de Kaç Litre Yakar?",

  seoText:
    `Yakıt tüketimi hesaplama aracı ile aracınızın kilometrede ne kadar yaktığını öğrenin. 
Güncel yakıt fiyatları ile yolculuk maliyetinizi ve ortalama tüketim değerlerinizi analiz edin.`.trim(),

  info: {
    title: "Yakıt Tasarrufu İçin İpuçları",
    items: [
      "Ani hızlanma ve sert frenlerden kaçınmak tüketimi %20'ye kadar düşürebilir.",
      "Lastik basınçlarının düşük olması yuvarlanma direncini ve yakıt tüketimini artırır.",
      "Araçtaki gereksiz yükleri boşaltmak ve klima kullanımını optimize etmek tasarruf sağlar.",
    ],
  },

  inputs: [
    {
      key: "islem",
      label: "İşlem Türü",
      type: "select",
      default: "ortalama-bul",
      options: [
        {
          label: "Ortalama yakıt tüketimini bul (TL/km)",
          value: "ortalama-bul",
        },
        { label: "Gidilebilecek mesafeyi öğren", value: "mesafe-ogren" },
        { label: "Ödenecek tutarı hesapla", value: "tutar-hesapla" },
      ],
    },
    {
      key: "odenenTutar",
      label: "Ödenen Tutar (TL)",
      type: "number",
      default: 1250.75,
    },
    { key: "mesafe", label: "Mesafe (km)", type: "number", default: 320.75 },
    {
      key: "litreHesapla",
      label: "Litre bazlı hesaplama yapılsın mı?",
      type: "select",
      default: "hayir",
      options: [
        { label: "Hayır, sadece TL bazlı", value: "hayir" },
        { label: "Evet, litre fiyatı gireceğim", value: "evet" },
      ],
    },
    {
      key: "yakitFiyati",
      label: "Yakıt Litre Fiyatı (TL/lt)",
      type: "number",
      default: 42.5,
      advanced: true,
    },
  ],

  compute(v) {
    const tutar = Number(v.odenenTutar);
    const mesafe = Number(v.mesafe);
    const fiyat = Number(v.yakitFiyati);
    const islem = v.islem;
    const litreModu = v.litreHesapla === "evet";

    if (tutar <= 0 || mesafe <= 0) {
      return {
        hata: "Lütfen tutar ve mesafe bilgilerini pozitif değerler olarak giriniz.",
      };
    }

    // Temel Hesaplamalar
    const kmMaliyet = tutar / mesafe; // TL/km
    const yuzKmMaliyet = kmMaliyet * 100; // 100 km'de kaç TL

    let sonucMetni = "";
    let ekBilgiler = {};

    if (islem === "ortalama-bul") {
      sonucMetni = `Kilometrede ortalama ${kmMaliyet.toFixed(
        2
      )} TL yakıyorsunuz.`;
    }

    if (litreModu && fiyat > 0) {
      const toplamLitre = tutar / fiyat;
      const yuzKmLitre = (toplamLitre / mesafe) * 100;
      ekBilgiler = {
        "Toplam Tüketilen Yakıt": toplamLitre.toFixed(2) + " Litre",
        "100 km'de Tüketim": yuzKmLitre.toFixed(2) + " Litre",
      };
    }

    return {
      "Kilometre Başı Maliyet": kmMaliyet.toFixed(2) + " TL",
      "100 km Maliyeti": yuzKmMaliyet.toFixed(2) + " TL",
      ...ekBilgiler,
      Özet: sonucMetni,
      __table: {
        headers: ["Parametre", "Sonuç"],
        rows: [
          ["Gidilen Mesafe", mesafe + " km"],
          ["Toplam Harcama", tutar.toLocaleString("tr-TR") + " TL"],
          ["Yol Maliyeti (1 km)", kmMaliyet.toFixed(2) + " TL"],
          ["Yol Maliyeti (100 km)", yuzKmMaliyet.toFixed(2) + " TL"],
        ],
        note: "Yakıt tüketimi yol durumu, sürüş stili ve araç yüküne göre farklılık gösterebilir.",
      },
    };
  },
};
