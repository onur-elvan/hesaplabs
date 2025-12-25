export default {
  id: "serbest-meslek-makbuzu",
  category: "Muhasebe",
  title: "Serbest Meslek Makbuzu Hesaplama",
  createdAt: "2025-12-25",
  description:
    "Serbest meslek makbuzu için brüt/net tutar, KDV ve stopaj hesaplar; net tahsilat ve toplam maliyeti gösterir.",
  seoTitle:
    "Serbest Meslek Makbuzu Hesaplama – KDV ve Stopaj ile Brüt / Net Hesapla",
  seoText: `
Serbest meslek makbuzu keserken “Brüt ne yazacağım, net elime ne geçecek?” sorusunu tek ekrandan çözebilirsin.

Bu araç ile:
- Brüt tutardan, KDV ve stopaj hesaplayarak **net tahsilatı** bulabilirsin.
- Eline geçmesini istediğin **net tutardan geriye gidip brüt** tutarı hesaplayabilirsin.
- Müşterinin toplam maliyetini, kesilen stopajı ve tahakkuk eden KDV'yi görebilirsin.

Temel mantık:
- Brüt tutar = serbest meslek kazancı (GVK md.65 kapsamı)
- KDV = Brüt × KDV oranı
- Stopaj = Brüt × stopaj oranı
- Net tahsilat = Brüt + KDV – Stopaj

Netten brüte giderken:
Net = Brüt × (1 + KDV oranı – stopaj oranı)  ⇒  Brüt = Net / (1 + KDV – stopaj)

Not: Kullanılan oranlar genel örnekleme içindir. Mesleğe, sözleşmeye veya mevzuata göre oranlar değişebilir; kendi durumuna uygun oranları seçmeni öneririz.
`.trim(),

  info: {
    title: "Serbest Meslek Makbuzu Nasıl Hesaplanır?",
    items: [
      "Brüt tutar, serbest meslek kazancının vergilendirme öncesi tutarıdır.",
      "KDV, brüt tutar üzerinden hesaplanır ve tahsil edilir; devlete beyan edilir.",
      "Stopaj (tevkifat), brüt tutar üzerinden karşı tarafça kesilir ve vergi dairesine ödenir.",
      "Net tahsilat = Brüt + KDV – Stopaj formülüyle bulunur.",
      "Bu araç hem brüte göre hem de nete göre hesaplama yaparak, teklif hazırlarken veya makbuz düzenlerken işini kolaylaştırır.",
    ],
    disclaimer:
      "Sonuçlar genel bilgilendirme amaçlıdır. Resmî beyannameler ve özel durumlar için mali müşavirine danışmanı öneririz.",
  },

  inputs: [
    {
      key: "mode",
      label: "Hesaplama tipi",
      type: "select",
      default: "brut",
      options: [
        { label: "Brütten hesapla (brüt → net)", value: "brut" },
        { label: "Netten hesapla (net → brüt)", value: "net" },
      ],
    },
    {
      key: "brut",
      label: "Brüt Tutar (TL)",
      type: "number",
      placeholder: "Örn: 10.000",
      default: 10000,
    },
    {
      key: "net",
      label: "Net Tahsilat (TL)",
      type: "number",
      placeholder: "Netten brüt bulmak için gir (örn: 8.500)",
      default: "",
    },
    {
      key: "kdv",
      label: "KDV Oranı (%)",
      type: "number",
      placeholder: "Örn: 20",
      default: 20,
    },
    {
      key: "stopaj",
      label: "Stopaj Oranı (%)",
      type: "number",
      placeholder: "Örn: 20",
      default: 20,
    },
    {
      key: "odemeSayisi",
      label: "Ödeme sayısı (adet / ay)",
      type: "number",
      placeholder: "Örn: 1 (tek seferlik), 12 (yıl boyu)",
      default: 1,
      advanced: true,
    },
  ],

  compute(values) {
    function toNum(x) {
      if (x === null || x === undefined) return NaN;
      return Number(String(x).replace(",", ".").trim());
    }
    function round2(x) {
      return Math.round(x * 100) / 100;
    }

    const mode = values.mode === "net" ? "net" : "brut";

    const kdvOran = toNum(values.kdv);
    const stopajOran = toNum(values.stopaj);
    const odemeSayisiRaw = toNum(values.odemeSayisi);

    if (!Number.isFinite(kdvOran) || kdvOran < 0) {
      return { hata: "KDV oranı geçerli bir sayı olmalı (0 veya üzeri)." };
    }
    if (!Number.isFinite(stopajOran) || stopajOran < 0) {
      return {
        hata: "Stopaj oranı geçerli bir sayı olmalı (0 veya üzeri).",
      };
    }

    const kdvRate = kdvOran / 100;
    const stopajRate = stopajOran / 100;

    let odemeSayisi =
      Number.isFinite(odemeSayisiRaw) && odemeSayisiRaw > 0
        ? odemeSayisiRaw
        : 1;

    let brut; // hesaplanan/ kullanılan brüt
    let net; // hesaplanan net tahsilat

    if (mode === "brut") {
      const brutInput = toNum(values.brut);
      if (!Number.isFinite(brutInput) || brutInput <= 0) {
        return { hata: "Brüt tutar pozitif bir sayı olmalı." };
      }
      brut = brutInput;
      const kdv = brut * kdvRate;
      const stopaj = brut * stopajRate;
      net = brut + kdv - stopaj;
    } else {
      // netten brüte
      const netInput = toNum(values.net);
      if (!Number.isFinite(netInput) || netInput <= 0) {
        return { hata: "Net tahsilat pozitif bir sayı olmalı." };
      }

      const katsayi = 1 + kdvRate - stopajRate;

      if (katsayi <= 0) {
        return {
          hata: "Seçilen KDV ve stopaj oranlarıyla netten brüte hesaplama yapılamıyor. (1 + KDV – Stopaj > 0 olmalı.)",
        };
      }

      brut = netInput / katsayi;
      net = netInput;
    }

    // Ortak hesaplar
    const kdvTutar = brut * kdvRate;
    const stopajTutar = brut * stopajRate;
    const tahakkukToplam = brut + kdvTutar; // müşterinin fatura/makbuz toplamı
    const musteriToplamMaliyet = tahakkukToplam; // stopaj müşterinin cebinden çıkmaz ama gider yazılır
    const toplamVergiYuku = kdvTutar + stopajTutar;

    // Çoklu ödeme (adet/ay) için toplamlar
    const brutToplam = brut * odemeSayisi;
    const netToplam = net * odemeSayisi;
    const kdvToplam = kdvTutar * odemeSayisi;
    const stopajToplam = stopajTutar * odemeSayisi;
    const tahakkukToplamGenel = tahakkukToplam * odemeSayisi;
    const vergiYukuToplam = toplamVergiYuku * odemeSayisi;

    // Açıklayıcı tablo
    const modeLabel =
      mode === "brut"
        ? "Brütten hesaplama (brüt → net)"
        : "Netten hesaplama (net → brüt)";

    const table = {
      headers: [
        "Kalem",
        "Tek sefer (TL)",
        `${odemeSayisi} x Ödeme Toplamı (TL)`,
      ],
      rows: [
        ["Brüt tutar", round2(brut), round2(brutToplam)],
        [`KDV (${round2(kdvOran)}%)`, round2(kdvTutar), round2(kdvToplam)],
        [
          `Stopaj (${round2(stopajOran)}%)`,
          round2(stopajTutar),
          round2(stopajToplam),
        ],
        ["Net tahsilat", round2(net), round2(netToplam)],
        [
          "Müşterinin toplam maliyeti (Brüt + KDV)",
          round2(musteriToplamMaliyet),
          round2(tahakkukToplamGenel),
        ],
        [
          "Toplam vergi yükü (KDV + stopaj)",
          round2(toplamVergiYuku),
          round2(vergiYukuToplam),
        ],
      ],
      note: "Stopaj, hizmeti alan tarafından kesilip vergi dairesine ödenen tutardır. Bu tabloda stopaj, serbest meslek erbabı açısından 'vergi yükü'nün bir parçası olarak gösterilmiştir.",
    };

    return {
      "Hesaplama tipi": modeLabel,
      "Brüt Tutar (TL)": round2(brut),
      "Net Tahsilat (TL)": round2(net),
      "KDV Oranı (%)": round2(kdvOran),
      "KDV Tutarı (TL)": round2(kdvTutar),
      "Stopaj Oranı (%)": round2(stopajOran),
      "Stopaj Tutarı (TL)": round2(stopajTutar),
      "Müşteri Toplam Maliyeti (TL)": round2(musteriToplamMaliyet),
      "Toplam Vergi Yükü (KDV + Stopaj) (TL)": round2(toplamVergiYuku),
      "Ödeme Sayısı": odemeSayisi,
      "Brüt Toplam (Tüm ödemeler)": round2(brutToplam),
      "Net Tahsilat Toplamı": round2(netToplam),
      "Toplam KDV": round2(kdvToplam),
      "Toplam Stopaj": round2(stopajToplam),
      "Toplam Müşteri Maliyeti": round2(tahakkukToplamGenel),
      __table: table,
    };
  },
};
