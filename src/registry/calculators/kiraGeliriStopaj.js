export default {
  id: "kira-geliri-stopaj",
  category: "Muhasebe",
  title: "Kira Geliri – Stopaj, Net Kira ve Efektif Getiri",
  createdAt: "2025-12-25",
  description:
    "İşyeri / konut kira gelirinde stopaj, ev sahibinin eline geçen net kira ve taşınmaz değeri üzerinden yıllık net getiri oranını hesaplar.",
  seoTitle: "Kira Geliri Hesaplama – Stopaj, Net Kira ve Yıllık Getiri Oranı",
  seoText: `
Bu araç ile kira gelirini daha net görebilirsin:

- İşyeri kiralarında **stopaj tutarı** (kiracının devlete ödediği vergi),
- Ev sahibinin eline geçen **net kira**,
- Kiracının kasasından çıkan **toplam aylık ve yıllık tutar**,
- Taşınmazın tahmini değeri üzerinden **yıllık net getiri oranı (%)**

hesaplanır.

Basit senaryolar için kullanışlıdır:
- İşyeri–konut kira teklifi karşılaştırması,
- “Bu kira, bu taşınmaz değeri için mantıklı mı?” analizi,
- Farklı stopaj oranları ile senaryo çalışması.

Not:
- İşyeri kiralarında stopaj, kiracı tarafından devlete ödenen ve ev sahibinin net eline geçen tutarı azaltan bir vergidir.
- Konut kiralarında stopaj yoktur; bu araçta konut tipi seçildiğinde stopaj tutarı 0 kabul edilir.
- Gerçek hayatta, gelir vergisi beyanı, istisnalar, gider indirimi, KDV’ye tabi kiralamalar gibi pek çok detay bulunur. Bu araç, **sadece basitleştirilmiş kira–stopaj ilişkisini** gösterir.
`.trim(),

  info: {
    title: "Kira Geliri ve Stopaj Nasıl Hesaplanır?",
    items: [
      "Brüt kira, sözleşmede yazan aylık kira bedelidir (stopaj dahil).",
      "İşyeri kiralarında kiracı, brüt kira üzerinden stopaj hesaplar; stopajı devlete öder, kalan net tutarı ev sahibine aktarır.",
      "Bu durumda ev sahibi eline brüt kiradan daha düşük bir tutar (net kira) geçerken, kiracının kasasından çıkan toplam tutar yine brüt kiraya eşittir.",
      "Konut kiralarında stopaj yoktur; kiracı brüt tutarı ev sahibine öder, ev sahibinin eline geçen net tutar brüt ile aynıdır.",
      "Taşınmazın yaklaşık piyasa değeri girildiğinde, yıllık net kira / taşınmaz değeri oranından basit bir **net getiri oranı (%)** hesaplanır.",
    ],
    disclaimer:
      "Bu hesaplama, sadeleştirilmiş bir modeldir. Gerçek mevzuatta gelir vergisi beyanı, istisna tutarları, gider yazılabilen kalemler, KDV, bireysel / kurumsal kiracı farkı gibi pek çok detay bulunur. Resmî beyan ve muhasebe kayıtları için mali müşavirinize danışmanız gerekir.",
  },

  inputs: [
    {
      key: "kiraTuru",
      label: "Kira Türü",
      type: "select",
      default: "isYeri",
      options: [
        { label: "İşyeri (stopaj var)", value: "isYeri" },
        { label: "Konut (stopaj yok)", value: "konut" },
      ],
    },
    {
      key: "aylikBrutKira",
      label: "Aylık Brüt Kira (TL)",
      type: "number",
      placeholder: "Örn: 25.000",
      default: 25000,
    },
    {
      key: "aySayisi",
      label: "Yıllık Hesaplama İçin Ay Sayısı",
      type: "number",
      placeholder: "Genellikle 12",
      default: 12,
    },

    // Gelişmiş
    {
      key: "stopajYuzde",
      label: "Stopaj Oranı (%) (İşyeri için)",
      type: "number",
      default: 20,
      advanced: true,
    },
    {
      key: "tasinmazDegeri",
      label: "Taşınmazın Yaklaşık Değeri (TL)",
      type: "number",
      placeholder: "Örn: 3.000.000 (efektif getiri için)",
      default: "",
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

    const kiraTuru = values.kiraTuru || "isYeri";

    const aylikBrut = num(values.aylikBrutKira);
    const aySayisi = num(values.aySayisi);
    const stopajYuzde = num(values.stopajYuzde);
    const tasinmazDegeri = num(values.tasinmazDegeri);

    if (!Number.isFinite(aylikBrut) || aylikBrut <= 0) {
      return { hata: "Aylık brüt kira pozitif bir sayı olmalı." };
    }
    if (!Number.isFinite(aySayisi) || aySayisi <= 0) {
      return {
        hata: "Yıllık ay sayısı pozitif bir sayı olmalı (genellikle 12).",
      };
    }

    const isIsYeri = kiraTuru === "isYeri";

    // Konutta stopaj = 0 varsayıyoruz
    const effectiveStopajRate =
      isIsYeri && Number.isFinite(stopajYuzde) ? stopajYuzde / 100 : 0;

    // --- Aylık hesaplar ---
    const aylikStopaj = aylikBrut * effectiveStopajRate;
    const aylikNetEvSahibi = aylikBrut - aylikStopaj;

    // Kiracı açısından kasadan çıkan toplam = ev sahibine giden + stopaj
    const aylikKiraciToplamNakit = aylikBrut; // işyeri senaryosunda da toplam nakit  = brüt

    // --- Yıllık hesaplar ---
    const yillikBrut = aylikBrut * aySayisi;
    const yillikStopaj = aylikStopaj * aySayisi;
    const yillikNetEvSahibi = aylikNetEvSahibi * aySayisi;
    const yillikKiraciToplamNakit = aylikKiraciToplamNakit * aySayisi;

    // --- Efektif getiri oranı (ev sahibi açısından) ---
    let netGetiriOraniYillik = null;
    if (Number.isFinite(tasinmazDegeri) && tasinmazDegeri > 0) {
      netGetiriOraniYillik = (yillikNetEvSahibi / tasinmazDegeri) * 100;
    }

    // Tablo: kalem kalem özet
    const rows = [
      [
        "Brüt Kira",
        round2(aylikBrut),
        round2(yillikBrut),
        "Sözleşmede yazan aylık brüt kira (stopaj dahil).",
      ],
      [
        "Stopaj Tutarı",
        round2(aylikStopaj),
        round2(yillikStopaj),
        isIsYeri
          ? `Kiracının devlete ödediği vergi (oran: %${(stopajYuzde || 0)
              .toString()
              .replace(".", ",")}).`
          : "Konut kiralarında stopaj yoktur; burada 0 kabul edilmiştir.",
      ],
      [
        "Ev Sahibinin Eline Geçen Net Kira",
        round2(aylikNetEvSahibi),
        round2(yillikNetEvSahibi),
        "Stopajın düşülmesinden sonra ev sahibinin fiilen tahsil ettiği kira.",
      ],
      [
        "Kiracının Toplam Nakit Çıkışı",
        round2(aylikKiraciToplamNakit),
        round2(yillikKiraciToplamNakit),
        isIsYeri
          ? "İşyeri kiralarında kiracının kasasından çıkan toplam (ev sahibine net + devlete stopaj = brüt)."
          : "Konut kiralarında kiracı brüt tutarı doğrudan ev sahibine öder.",
      ],
    ];

    const table = {
      headers: ["Kalem", "Aylık (TL)", "Yıllık (TL)", "Açıklama"],
      rows,
      note: "Hesaplamalar sadeleştirilmiş örneklerdir. Gerçek beyannamelerde gelir vergisi istisnaları, gider indirimi, KDV, bireysel/kurumsal ayrımı gibi ek kurallar uygulanır.",
    };

    const result = {
      "Kira Türü": kiraTuru === "isYeri" ? "İşyeri" : "Konut",
      "Aylık Brüt Kira (TL)": round2(aylikBrut),
      "Aylık Stopaj Tutarı (TL)": round2(aylikStopaj),
      "Aylık Net Kira (Ev Sahibi) (TL)": round2(aylikNetEvSahibi),
      "Aylık Kiracı Toplam Nakit Çıkışı (TL)": round2(aylikKiraciToplamNakit),
      "Yıllık Net Kira (Ev Sahibi) (TL)": round2(yillikNetEvSahibi),
      "Yıllık Stopaj Toplamı (TL)": round2(yillikStopaj),
      "Yıllık Kiracı Toplam Nakit Çıkışı (TL)": round2(yillikKiraciToplamNakit),
      __table: table,
    };

    if (netGetiriOraniYillik !== null) {
      result["Taşınmaz Değeri (TL)"] = round2(tasinmazDegeri);
      result["Net Getiri Oranı (Yıllık, %)"] = round2(netGetiriOraniYillik);
    }

    return result;
  },
};
