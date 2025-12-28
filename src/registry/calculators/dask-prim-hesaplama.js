export default {
  id: "dask-prim-hesaplama-gelismis",
  category: "Sigorta",
  title: "DASK Prim Hesaplama Aracı",
  createdAt: "2025-12-28",
  description:
    "İl, ilçe, yapı tarzı ve bina yaşı gibi detaylı kriterlere göre DASK primini hesaplar.",
  seoTitle: "Detaylı DASK Prim Hesaplama 2025 - İl ve İlçe Bazlı Sorgulama",

  seoText:
    `Gelişmiş DASK hesaplama aracı ile Türkiye'nin her ili ve ilçesi için güncel sigorta primlerini öğrenin. 
Bina yaşı ve kat sayısı gibi detaylı parametrelerle en doğru poliçe tutarını analiz edin.`.trim(),

  info: {
    title: "DASK Primini Belirleyen Faktörler",
    items: [
      "Risk Bölgesi: Binanın bulunduğu mahallenin deprem risk katsayısı.",
      "Yapı Tarzı: Çelik/Betonarme yapılar en düşük, diğer yapılar daha yüksek primlidir.",
      "İnşa Yılı: 2000 öncesi ve sonrası binalar farklı risk gruplarındadır.",
      "Kat Sayısı: Toplam kat sayısı arttıkça risk primi değişkenlik gösterir.",
    ],
  },

  inputs: [
    {
      key: "yapiTipi",
      label: "Bina Yapı Tipi",
      type: "select",
      default: "betonarme",
      options: [
        { label: "Çelik / Betonarme Karkas", value: "betonarme" },
        { label: "Yığma Kagir", value: "yigma" },
        { label: "Diğer Yapılar", value: "diger" },
      ],
    },
    {
      key: "katSayisi",
      label: "Bina Toplam Kat Sayısı",
      type: "select",
      default: "1-3",
      options: [
        { label: "1 - 3 Kat", value: "1-3" },
        { label: "4 - 7 Kat", value: "4-7" },
        { label: "8 Kat ve Üzeri", value: "8+" },
      ],
    },
    {
      key: "insaYili",
      label: "İnşaat Ruhsat Yılı",
      type: "select",
      default: "2000-sonrasi",
      options: [
        { label: "2000 ve Öncesi", value: "2000-oncesi" },
        { label: "2001 - 2006 Arası", value: "2001-2006" },
        { label: "2007 ve Sonrası", value: "2007-sonrasi" },
      ],
    },
    { key: "il", label: "Bulunduğu İl", type: "text", default: "İstanbul" },
    { key: "ilce", label: "Bulunduğu İlçe", type: "text", default: "Kadıköy" },
    {
      key: "brutAlan",
      label: "Brüt Yüzölçümü (m²)",
      type: "number",
      default: 100,
    },
  ],

  compute(v) {
    const m2 = Number(v.brutAlan);
    if (!m2 || m2 <= 0)
      return { hata: "Lütfen geçerli bir metrekare giriniz." };

    // --- Dinamik Katsayı Mantığı ---
    // 2025 m2 Birim Maliyet (Zorunlu Sigorta Teminatı)
    const birimMaliyet = 6000;
    const azamiTeminat = m2 * birimMaliyet;

    // Yapı Tipi Katsayıları
    const katsayiYapi = { betonarme: 1.0, yigma: 1.25, diger: 1.5 };

    // Kat Sayısı Katsayıları
    const katsayiKat = { "1-3": 1.0, "4-7": 1.1, "8+": 1.25 };

    // İnşa Yılı Katsayıları (Eski binalar daha riskli)
    const katsayiYil = {
      "2000-oncesi": 1.3,
      "2001-2006": 1.15,
      "2007-sonrasi": 1.0,
    };

    // Şehir bazlı risk simülasyonu (Örn: İstanbul/Bingöl gibi riskli yerler)
    const riskliIller = [
      "İstanbul",
      "Bingöl",
      "Hatay",
      "Kocaeli",
      "Kahramanmaraş",
    ];
    const ilKatsayisi = riskliIller.includes(v.il) ? 1.4 : 1.0;

    // Hesaplama Formülü
    const bazPrimOrani = 0.0015; // Temsili taban oran
    let toplamPrim =
      azamiTeminat *
      bazPrimOrani *
      katsayiYapi[v.yapiTipi] *
      katsayiKat[v.katSayisi] *
      katsayiYil[v.insaYili] *
      ilKatsayisi;

    // Minimum prim tutarı kontrolü (2025 için temsili)
    if (toplamPrim < 250) toplamPrim = 250;

    return {
      "Poliçe Toplam Primi": toplamPrim.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      }),
      "Deprem Teminat Bedeli": azamiTeminat.toLocaleString("tr-TR", {
        style: "currency",
        currency: "TRY",
      }),
      "Birim Metrekare Değeri": birimMaliyet.toLocaleString("tr-TR") + " TL",
      "Konum Bilgisi": `${v.il} / ${v.ilce}`,
      __table: {
        headers: ["Kriter", "Seçilen Değer", "Risk Etkisi"],
        rows: [
          ["Yapı Tipi", v.yapiTipi.toUpperCase(), "Orta"],
          [
            "Kat Sayısı",
            v.katSayisi,
            v.katSayisi === "8+" ? "Yüksek" : "Düşük",
          ],
          [
            "İnşa Yılı",
            v.insaYili,
            v.insaYili === "2000-oncesi" ? "Kritik" : "Normal",
          ],
          [
            "Risk Bölgesi",
            v.il,
            riskliIller.includes(v.il) ? "1. Derece" : "Normal",
          ],
        ],
        note: "Bu hesaplama tahmini değerler sunar. Net prim için adres kodu (UAVT) ile yetkili acenteye başvurulmalıdır.",
      },
    };
  },
};
