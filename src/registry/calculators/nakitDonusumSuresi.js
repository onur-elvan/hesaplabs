export default {
  id: "nakit-donusum-suresi",
  category: "İşletme",
  title: "Nakit Dönüşüm Süresi – Stok, Alacak ve Borç Gün Sayısı",
  createdAt: "2025-12-25",
  description:
    "Stokta bekleme süresi, alacak tahsil süresi, borç ödeme süresi ve nakit dönüşüm süresini (CCC) hesaplar.",
  seoTitle:
    "Nakit Dönüşüm Süresi Hesaplama – Stok Devir Hızı, Alacak ve Borç Günleri",
  seoText: `
Nakit dönüşüm süresi (Cash Conversion Cycle – CCC), işletmenin yaptığı nakit çıkışının
tekrar kasaya geri dönmesine kadar geçen ortalama süreyi gösterir.

Bu araç ile:

- **Stokta bekleme süresi** (Days Inventory Outstanding – DIO),
- **Alacak tahsil süresi** (Days Sales Outstanding – DSO),
- **Borç ödeme süresi** (Days Payables Outstanding – DPO),
- ve bunlardan türeyen **Nakit dönüşüm süresini (CCC)**

hesaplayabilirsin.

Kullanım için yıllık verileri girmek idealdir:
- Satılan malın maliyeti (SMM / COGS),
- Yıllık net satışlar,
- Ortalama stok, ticari alacak ve ticari borç tutarları.

Yorum:
- CCC **kısaldıkça**, işletme nakde daha hızlı erişiyor demektir.
- Negatif CCC (çoğu zaman perakende devlerinde görülür), şirketin tedarikçilere ödemeyi müşterilerden tahsil ettikten sonra yaptığı anlamına gelir.
`.trim(),

  info: {
    title: "Nakit Dönüşüm Süresi Nasıl Yorumlanır?",
    items: [
      "Stokta bekleme süresi (DIO), stokların ortalama kaç gün rafta beklediğini gösterir.",
      "Alacak tahsil süresi (DSO), satış yaptıktan sonra ortalama kaç günde tahsilat yapıldığını gösterir.",
      "Borç ödeme süresi (DPO), tedarikçilere ortalama kaç günde ödeme yapıldığını gösterir.",
      "Nakit dönüşüm süresi (CCC) = DIO + DSO – DPO formülüyle hesaplanır.",
      "CCC ne kadar kısa (hatta negatif) ise, işletme o kadar verimli ve az nakit bağlayarak çalışıyor demektir.",
    ],
    disclaimer:
      "Bu hesaplama, bilanço kalemlerinden türetilen basitleştirilmiş finansal oranlara dayanır. Farklı sektörler ve iş modelleri için ideal CCC değeri değişebilir. Analizi tek başına değil, diğer finansal oranlar ile birlikte değerlendirmek gerekir.",
  },

  inputs: [
    {
      key: "smmYillik",
      label: "Yıllık Satılan Malın Maliyeti – SMM (TL)",
      type: "number",
      placeholder: "Örn: 5.000.000",
      default: 5000000,
    },
    {
      key: "satisNetYillik",
      label: "Yıllık Net Satışlar (TL)",
      type: "number",
      placeholder: "Örn: 7.500.000",
      default: 7500000,
    },
    {
      key: "ortalamaStok",
      label: "Ortalama Stok Tutarı (TL)",
      type: "number",
      placeholder: "Örn: 1.000.000",
      default: 1000000,
    },
    {
      key: "ortalamaAlacak",
      label: "Ortalama Ticari Alacaklar (TL)",
      type: "number",
      placeholder: "Örn: 900.000",
      default: 900000,
    },
    {
      key: "ortalamaBorc",
      label: "Ortalama Ticari Borçlar (TL)",
      type: "number",
      placeholder: "Örn: 800.000",
      default: 800000,
    },

    // Gelişmiş
    {
      key: "gunSayisi",
      label: "Yıldaki Gün Sayısı",
      type: "number",
      default: 365,
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

    const smm = num(values.smmYillik);
    const satisNet = num(values.satisNetYillik);
    const ortStok = num(values.ortalamaStok);
    const ortAlacak = num(values.ortalamaAlacak);
    const ortBorc = num(values.ortalamaBorc);
    const gun = num(values.gunSayisi);

    if (!Number.isFinite(smm) || smm <= 0) {
      return {
        hata: "Yıllık satılan malın maliyeti (SMM) pozitif bir sayı olmalı.",
      };
    }
    if (!Number.isFinite(satisNet) || satisNet <= 0) {
      return {
        hata: "Yıllık net satışlar pozitif bir sayı olmalı.",
      };
    }
    if (!Number.isFinite(ortStok) || ortStok < 0) {
      return {
        hata: "Ortalama stok 0 veya pozitif bir sayı olmalı.",
      };
    }
    if (!Number.isFinite(ortAlacak) || ortAlacak < 0) {
      return {
        hata: "Ortalama ticari alacak 0 veya pozitif bir sayı olmalı.",
      };
    }
    if (!Number.isFinite(ortBorc) || ortBorc < 0) {
      return {
        hata: "Ortalama ticari borç 0 veya pozitif bir sayı olmalı.",
      };
    }
    if (!Number.isFinite(gun) || gun <= 0) {
      return { hata: "Yıldaki gün sayısı pozitif bir sayı olmalı." };
    }

    // Stokta bekleme süresi (DIO)
    // DIO = (Ortalama Stok / SMM) × Gün
    const dio = (ortStok / smm) * gun;

    // Alacak tahsil süresi (DSO)
    // DSO = (Ortalama Alacak / Net Satış) × Gün
    const dso = (ortAlacak / satisNet) * gun;

    // Borç ödeme süresi (DPO)
    // DPO = (Ortalama Borç / SMM) × Gün
    const dpo = (ortBorc / smm) * gun;

    // Nakit dönüşüm süresi (CCC)
    // CCC = DIO + DSO – DPO
    const ccc = dio + dso - dpo;

    const rows = [
      [
        "Stokta Bekleme Süresi (DIO)",
        round2(dio),
        "Ortalama stok / satılan malın maliyeti × gün sayısı.",
      ],
      [
        "Alacak Tahsil Süresi (DSO)",
        round2(dso),
        "Ortalama ticari alacak / yıllık net satışlar × gün sayısı.",
      ],
      [
        "Borç Ödeme Süresi (DPO)",
        round2(dpo),
        "Ortalama ticari borç / satılan malın maliyeti × gün sayısı.",
      ],
      [
        "Nakit Dönüşüm Süresi (CCC)",
        round2(ccc),
        "DIO + DSO – DPO. Nakit çıkışının yeniden kasaya dönme süresi.",
      ],
    ];

    return {
      "Yıllık SMM (TL)": round2(smm),
      "Yıllık Net Satışlar (TL)": round2(satisNet),
      "Ortalama Stok (TL)": round2(ortStok),
      "Ortalama Ticari Alacak (TL)": round2(ortAlacak),
      "Ortalama Ticari Borç (TL)": round2(ortBorc),
      "Stokta Bekleme Süresi – DIO (gün)": round2(dio),
      "Alacak Tahsil Süresi – DSO (gün)": round2(dso),
      "Borç Ödeme Süresi – DPO (gün)": round2(dpo),
      "Nakit Dönüşüm Süresi – CCC (gün)": round2(ccc),
      __table: {
        headers: ["Oran", "Değer (gün)", "Açıklama"],
        rows,
        note: "CCC değeri sektörler arasında karşılaştırılamaz; en anlamlı yorum, aynı işletmenin yıllar içindeki trendi ve benzer rakiplerle kıyas yapıldığında ortaya çıkar.",
      },
    };
  },
};
