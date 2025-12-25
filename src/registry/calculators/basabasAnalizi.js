export default {
  id: "basabas-analizi",
  category: "İşletme",
  title: "Başabaş Analizi – Sabit Gider, Değişken Gider, Kâr Marjı",
  createdAt: "2025-12-25",
  description:
    "Sabit gider, birim değişken gider ve birim satış fiyatından başabaş noktasını, güvenlik marjını ve kârı hesaplar.",
  seoTitle:
    "Başabaş Noktası Hesaplama – Sabit Gider, Değişken Gider ve Kâr Analizi",
  seoText: `
Başabaş analizi (break-even analysis), işletmenin **zarar etmeden ayakta kalması** için
kaç adet ürün / hizmet satması gerektiğini gösterir.

Bu hesaplayıcı ile:

- Sabit gider ve birim değişken giderleri girerek,
- Birim satış fiyatına göre **katkı payını** (contribution margin),
- **Başabaş satış adedi** ve **başabaş ciroyu**,
- Seçtiğin hedef satış adedinde beklenen **kâr / zarar tutarını**,
- Hedef satışa göre **güvenlik marjını** (margin of safety)

görebilirsin.

Özellikle:
- Fiyatlandırma yaparken,
- “Bu maliyetlerle kaç adet satmam lazım?” sorusuna cevap ararken,
- Kampanya / indirim öncesi kâr etkisini anlamak için kullanışlıdır.

Not: Bu araç, tek ürünlü (veya karma ürünleri tek ortalama ürün gibi gören) basit bir başabaş analizidir; vergi, çoklu ürün karması, kapasite kısıtları gibi ileri seviye konular dahil edilmemiştir.
`.trim(),

  info: {
    title: "Başabaş Noktası Ne İşe Yarar?",
    items: [
      "Başabaş noktası, toplam gelirin toplam maliyete eşit olduğu satış seviyesidir; kâr = 0’dır.",
      "Satışlar başabaş noktasının üzerindeyse işletme kârdadır, altındaysa zarardadır.",
      "Katkı payı = Birim Satış Fiyatı – Birim Değişken Gider; sabit giderlerin karşılanmasında kullanılır.",
      "Güvenlik marjı, hedef satış seviyesinin başabaş seviyesinin ne kadar üzerinde olduğunu gösterir (hem adet hem %).",
      "Bu analiz, kısa vadeli, sabit fiyatlı ve sabit maliyetli basit senaryolar için uygundur.",
    ],
    disclaimer:
      "Hesaplamalar genel bilgilendirme amaçlıdır. Gerçek hayatta vergi, finansman giderleri, stoklama maliyetleri, kur farkları ve çok ürünlü yapı gibi pek çok değişken devreye girer. Önemli kararlar öncesinde mali müşavir veya finans uzmanına danışmanız önerilir.",
  },

  inputs: [
    {
      key: "birimSatisFiyati",
      label: "Birim Satış Fiyatı (TL)",
      type: "number",
      placeholder: "Örn: 500",
      default: 500,
    },
    {
      key: "birimDegiskenGider",
      label: "Birim Değişken Gider (TL)",
      type: "number",
      placeholder: "Örn: 300",
      default: 300,
    },
    {
      key: "aylikSabitGider",
      label: "Aylık Sabit Gider Toplamı (TL)",
      type: "number",
      placeholder: "Örn: 120.000",
      default: 120000,
    },
    {
      key: "hedefSatisAdedi",
      label: "Hedef Satış Adedi (Ay)",
      type: "number",
      placeholder: "Örn: 400",
      default: 400,
    },

    // Gelişmiş alan
    {
      key: "vergiOrani",
      label: "Vergi Oranı (%) (opsiyonel, net kâr için)",
      type: "number",
      placeholder: "Örn: 20 (boş bırakabilirsin)",
      default: "",
      advanced: true,
    },
  ],

  compute(values) {
    function num(x) {
      if (x === null || x === undefined) return NaN;
      return Number(String(x).replace(",", ".").trim());
    }
    function round2(x) {
      return Math.round(x * 100) / 100;
    }

    const birimSatis = num(values.birimSatisFiyati);
    const birimDegisken = num(values.birimDegiskenGider);
    const sabitGider = num(values.aylikSabitGider);
    const hedefAdet = num(values.hedefSatisAdedi);
    const vergiOrani = num(values.vergiOrani);

    if (!Number.isFinite(birimSatis) || birimSatis <= 0) {
      return { hata: "Birim satış fiyatı pozitif bir sayı olmalı." };
    }
    if (!Number.isFinite(birimDegisken) || birimDegisken < 0) {
      return { hata: "Birim değişken gider 0 veya pozitif olmalı." };
    }
    if (!Number.isFinite(sabitGider) || sabitGider < 0) {
      return { hata: "Aylık sabit gider 0 veya pozitif olmalı." };
    }
    if (!Number.isFinite(hedefAdet) || hedefAdet <= 0) {
      return { hata: "Hedef satış adedi pozitif bir sayı olmalı." };
    }

    // Katkı payı
    const katkıPayi = birimSatis - birimDegisken;
    if (katkıPayi <= 0) {
      return {
        hata: "Birim satış fiyatı, birim değişken giderden büyük olmalı. Aksi durumda katkı payı negatif olur ve başabaş noktasına ulaşılamaz.",
      };
    }

    // Başabaş noktası
    const basabasAdet = sabitGider / katkıPayi;
    const basabasCiro = basabasAdet * birimSatis;

    // Hedef satışta kâr
    const hedefCiro = birimSatis * hedefAdet;
    const hedefToplamDegisken = birimDegisken * hedefAdet;
    const brütKar = hedefCiro - hedefToplamDegisken - sabitGider;

    let netKar = null;
    let efektifVergiOrani = null;
    if (Number.isFinite(vergiOrani) && vergiOrani > 0) {
      efektifVergiOrani = vergiOrani / 100;
      const vergiYuku = brütKar > 0 ? brütKar * efektifVergiOrani : 0;
      netKar = brütKar - vergiYuku;
    }

    // Güvenlik marjı
    const guvenlikMarjiAdet = hedefAdet - basabasAdet;
    const guvenlikMarjiOran =
      hedefAdet > 0 ? (guvenlikMarjiAdet / hedefAdet) * 100 : null;

    // Tablo
    const tableRows = [
      [
        "Katkı Payı (TL / birim)",
        round2(katkıPayi),
        "Birim satış fiyatı – birim değişken gider.",
      ],
      [
        "Başabaş Satış Adedi",
        round2(basabasAdet),
        "Bu satış adedinde toplam kâr = 0 olur.",
      ],
      [
        "Başabaş Ciro (TL)",
        round2(basabasCiro),
        "Başabaş satış adedi × birim satış fiyatı.",
      ],
      [
        "Hedef Ciro (TL)",
        round2(hedefCiro),
        "Hedef satış adedi × birim satış fiyatı.",
      ],
      [
        "Toplam Değişken Gider (TL)",
        round2(hedefToplamDegisken),
        "Hedef satış adedi × birim değişken gider.",
      ],
      [
        "Brüt Kâr (TL)",
        round2(brütKar),
        "Hedef ciro – değişken gider – sabit gider.",
      ],
      [
        "Güvenlik Marjı (Adet)",
        round2(guvenlikMarjiAdet),
        "Hedef satış ile başabaş satış arasındaki fark.",
      ],
      [
        "Güvenlik Marjı (%)",
        guvenlikMarjiOran !== null ? round2(guvenlikMarjiOran) : "-",
        "Hedef satışa göre ne kadar payın riskten korunaklı olduğunu gösterir.",
      ],
    ];

    const out = {
      "Birim Satış Fiyatı (TL)": round2(birimSatis),
      "Birim Değişken Gider (TL)": round2(birimDegisken),
      "Katkı Payı (TL/birim)": round2(katkıPayi),
      "Aylık Sabit Gider (TL)": round2(sabitGider),
      "Başabaş Satış Adedi (birim)": round2(basabasAdet),
      "Başabaş Ciro (TL)": round2(basabasCiro),
      "Hedef Satış Adedi (birim)": round2(hedefAdet),
      "Hedef Ciro (TL)": round2(hedefCiro),
      "Hedef Brüt Kâr (TL)": round2(brütKar),
      __table: {
        headers: ["Kalem", "Değer", "Açıklama"],
        rows: tableRows,
        note: "Bu tablo, tek ürünlü basit bir başabaş analizi içindir. Çok ürünlü işletmelerde ortalama katkı payı kullanılarak benzer mantıkla analiz yapılabilir.",
      },
    };

    if (netKar !== null) {
      out["Net Kâr (Vergi Sonrası, TL)"] = round2(netKar);
      out["Kullanılan Vergi Oranı (%)"] = round2(vergiOrani);
    }

    return out;
  },
};
