export default {
  id: "personel-maliyet-bordro",
  category: "Muhasebe",
  title: "Personel Toplam Maliyet ve Bordro Özeti (Gelişmiş)",
  createdAt: "2025-12-25",
  description:
    "Brüt maaşa göre net maaşı, işçi kesintilerini, işveren primlerini ve aylık/yıllık toplam işveren maliyetini hesaplar.",
  seoTitle:
    "Personel Maliyet Hesaplama – Brüt Maaş, Net Maaş ve İşveren Yükü (Bordro Özeti)",
  seoText: `
Bu araç ile tek ekranda bir personelin:

- Brüt maaşına göre **net eline geçen tutarını**,
- İşçiden kesilen **SGK primi, işsizlik primi, gelir vergisi ve damga vergisi** kalemlerini,
- İşverenin ödediği **SGK işveren primi** ve **işsizlik primi** tutarını,
- **Toplam işveren maliyetini** (aylık ve yıllık),
- Toplam vergi ve prim yükünün yüzdesini

yaklaşık olarak görebilirsin.

Varsayılan oranlar örnek amaçlıdır ve mevzuat birebir yansıtılmamıştır.
Gerçek işyeri uygulamalarında;
- Teşvikli SGK oranları,
- Gelir vergisi dilimleri,
- Asgari ücret sınırları,
- Ek yan haklar (yol, yemek, prim vb.)
gibi kalemler farklılık gösterebilir.

Bu yüzden, hesaplama sonuçları **bilgilendirme ve senaryo karşılaştırma** amacıyladır; resmî bordro, muhasebe kaydı veya beyan için mutlaka mali müşavir / insan kaynakları departmanı ile teyit alınmalıdır.
`.trim(),

  info: {
    title: "Personel Maliyeti Nasıl Hesaplanır?",
    items: [
      "Brüt maaş, personel ile sözleşmede yazan, kesintiler ve işveren primlerinin hesaplandığı ana tutardır.",
      "Net maaş, brütten işçi SGK primi, işsizlik primi, gelir vergisi ve damga vergisi düşüldükten sonra çalışanın eline geçen tutardır.",
      "İşveren maliyeti, brüt maaşa ek olarak işverenin ödediği SGK işveren primi ve işsizlik primi gibi yükleri de içerir.",
      "Toplam işveren maliyetinin yıllık hale getirilmesi, bütçe planlaması ve personel maliyet analizi için kullanışlıdır.",
      "Bu araç, oranları parametre olarak alır; istersen gelişmiş bölümden SGK ve vergi oranlarını kendine göre uyarlayabilirsin.",
    ],
    disclaimer:
      "Hesaplamalar sadeleştirilmiş örnek oranlarla yapılır. Güncel mevzuat ve özel teşvikler için mali müşavirine danışmanı öneririz.",
  },

  inputs: [
    {
      key: "brutMaas",
      label: "Aylık Brüt Maaş (TL)",
      type: "number",
      placeholder: "Örn: 50.000",
      default: 50000,
    },
    {
      key: "aySayisi",
      label: "Yıllık Hesaplama İçin Ay Sayısı",
      type: "number",
      placeholder: "Genellikle 12",
      default: 12,
    },

    // ----- Gelişmiş oranlar (kullanıcı isterse oynar) -----
    {
      key: "sgkIsciYuzde",
      label: "SGK İşçi Primi Oranı (%)",
      type: "number",
      default: 14,
      advanced: true,
    },
    {
      key: "issizlikIsciYuzde",
      label: "İşsizlik İşçi Primi Oranı (%)",
      type: "number",
      default: 1,
      advanced: true,
    },
    {
      key: "sgkIsverenYuzde",
      label: "SGK İşveren Primi Oranı (%)",
      type: "number",
      default: 20.5,
      advanced: true,
    },
    {
      key: "issizlikIsverenYuzde",
      label: "İşsizlik İşveren Primi Oranı (%)",
      type: "number",
      default: 2,
      advanced: true,
    },
    {
      key: "gelirVergisiYuzde",
      label: "Gelir Vergisi Oranı (%) (Basit varsayım)",
      type: "number",
      default: 15,
      advanced: true,
    },
    {
      key: "damgaVergisiYuzde",
      label: "Damga Vergisi Oranı (%)",
      type: "number",
      default: 0.759,
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

    const brut = num(values.brutMaas);
    const aySayisi = num(values.aySayisi);

    const sgkIsciY = num(values.sgkIsciYuzde);
    const issizlikIsciY = num(values.issizlikIsciYuzde);
    const sgkIsverenY = num(values.sgkIsverenYuzde);
    const issizlikIsverenY = num(values.issizlikIsverenYuzde);
    const gvY = num(values.gelirVergisiYuzde);
    const damgaY = num(values.damgaVergisiYuzde);

    if (!Number.isFinite(brut) || brut <= 0) {
      return { hata: "Aylık brüt maaş pozitif bir sayı olmalı." };
    }
    if (!Number.isFinite(aySayisi) || aySayisi <= 0) {
      return { hata: "Yıllık ay sayısı pozitif bir sayı olmalı (genelde 12)." };
    }

    // Oranları yüzde'den ondalığa çevir
    const sgkIsciR = sgkIsciY / 100;
    const issizlikIsciR = issizlikIsciY / 100;
    const sgkIsverenR = sgkIsverenY / 100;
    const issizlikIsverenR = issizlikIsverenY / 100;
    const gvR = gvY / 100;
    const damgaR = damgaY / 100;

    // --- İşçi kesintileri ---
    const sgkIsci = brut * sgkIsciR;
    const issizlikIsci = brut * issizlikIsciR;

    // Basit gelir vergisi matrahı (gerçekte daha karmaşık)
    const gvMatrah = brut - sgkIsci - issizlikIsci;
    const gelirVergisi = gvMatrah * gvR;
    const damgaVergisi = brut * damgaR;

    const netMaas = brut - sgkIsci - issizlikIsci - gelirVergisi - damgaVergisi;

    // --- İşveren yükleri ---
    const sgkIsveren = brut * sgkIsverenR;
    const issizlikIsveren = brut * issizlikIsverenR;

    const isverenToplamMaliyetAylik = brut + sgkIsveren + issizlikIsveren;

    const isverenToplamMaliyetYillik = isverenToplamMaliyetAylik * aySayisi;

    const netYillik = netMaas * aySayisi;

    // Toplam vergi & prim yükü (işçi + işveren)
    const toplamPrimVergiAylik =
      sgkIsci +
      issizlikIsci +
      gelirVergisi +
      damgaVergisi +
      sgkIsveren +
      issizlikIsveren;

    const toplamPrimVergiYillik = toplamPrimVergiAylik * aySayisi;

    const vergiYukOrani =
      (toplamPrimVergiAylik / isverenToplamMaliyetAylik) * 100;

    // Tablo: kalem kalem özet
    const rows = [
      ["Brüt Maaş", round2(brut), "TL", "Brüt ücret (sözleşme tutarı)"],
      [
        "SGK İşçi Primi",
        round2(sgkIsci),
        "TL",
        `Çalışan payı (oran: ${sgkIsciY.toString().replace(".", ",")}%)`,
      ],
      [
        "İşsizlik İşçi Primi",
        round2(issizlikIsci),
        "TL",
        `Çalışan payı (oran: ${issizlikIsciY.toString().replace(".", ",")}%)`,
      ],
      [
        "Gelir Vergisi",
        round2(gelirVergisi),
        "TL",
        `Basit oran varsayımı: %${gvY.toString().replace(".", ",")}`,
      ],
      [
        "Damga Vergisi",
        round2(damgaVergisi),
        "TL",
        `Brüt üzerinden yaklaşık oran: %${damgaY.toString().replace(".", ",")}`,
      ],
      ["Net Maaş", round2(netMaas), "TL", "Çalışanın eline geçen tutar"],
      [
        "SGK İşveren Primi",
        round2(sgkIsveren),
        "TL",
        `İşveren payı (oran: %${sgkIsverenY.toString().replace(".", ",")})`,
      ],
      [
        "İşsizlik İşveren Primi",
        round2(issizlikIsveren),
        "TL",
        `İşveren payı (oran: %${issizlikIsverenY
          .toString()
          .replace(".", ",")})`,
      ],
      [
        "İşveren Toplam Maliyeti (Aylık)",
        round2(isverenToplamMaliyetAylik),
        "TL",
        "Brüt + işveren primleri toplamı",
      ],
      [
        "Toplam Prim / Vergi Yükü (Aylık)",
        round2(toplamPrimVergiAylik),
        "TL",
        "İşçi + işveren primleri ve vergilerin toplamı",
      ],
    ];

    const table = {
      headers: ["Kalem", "Tutar", "Birim", "Not"],
      rows,
      note: "Bu tablo örnek oranlara göre hazırlanmıştır. Gerçek bordroda vergi dilimleri, istisnalar ve teşvikler farklılık gösterebilir.",
    };

    return {
      "Aylık Brüt Maaş (TL)": round2(brut),
      "Aylık Net Maaş (TL)": round2(netMaas),
      "Aylık İşveren Toplam Maliyeti (TL)": round2(isverenToplamMaliyetAylik),
      "Yıllık Net Maaş (TL)": round2(netYillik),
      "Yıllık İşveren Toplam Maliyeti (TL)": round2(isverenToplamMaliyetYillik),
      "Aylık Toplam Prim + Vergi Yükü (TL)": round2(toplamPrimVergiAylik),
      "Yıllık Toplam Prim + Vergi Yükü (TL)": round2(toplamPrimVergiYillik),
      "Toplam Yük / İşveren Maliyeti Oranı (%)": round2(vergiYukOrani),
      __table: table,
    };
  },
};
