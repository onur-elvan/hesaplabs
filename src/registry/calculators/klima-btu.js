export default {
  id: "klima-btu",
  title: "Klima BTU Hesaplama",
  category: "Ev & Yaşam",
  createdAt: "2025-12-24",
  description:
    "Oda büyüklüğü, cephe, kişi sayısı ve iklime göre ideal klima BTU değerini hesaplar.",

  seoTitle:
    "Klima BTU Hesaplama – Oda m²’ye Göre Doğru Klima Kapasitesi Hesaplama",

  seoText: `
Klima BTU hesaplama aracı ile bulunduğun odanın büyüklüğüne, kullanım koşullarına
ve iklim özelliklerine göre kaç BTU klima alman gerektiğini kolayca öğrenebilirsin.

Doğru BTU seçimi neden önemlidir?
- Düşük BTU → Oda yeterince soğumaz
- Yüksek BTU → Gereksiz elektrik tüketimi ve nem sorunları

Bu hesaplama:
- Oda metrekare (m²)
- Odanın güneş alma durumu (cephe)
- Odayı kullanan kişi sayısı
- Pencere sayısı
- Bölgenin iklim durumu

gibi faktörleri dikkate alır.

Sonuç olarak sana önerilen minimum klima BTU kapasitesi gösterilir.
`.trim(),

  info: {
    title: "BTU Seçim Rehberi",
    items: [
      "Küçük odalar için düşük BTU, büyük alanlar için yüksek BTU gerekir.",
      "Güneş alan odalarda BTU ihtiyacı artar.",
      "Kalabalık odalar daha yüksek kapasite ister.",
      "Yanlış BTU seçimi faturayı artırır.",
    ],
    disclaimer:
      "Bu hesaplama bilgilendirme amaçlıdır. Kesin seçim için uzman görüşü önerilir.",
  },

  inputs: [
    // Hızlı (temel)
    {
      key: "alan",
      label: "Oda Alanı (m²)",
      type: "number",
      default: 20,
      placeholder: "Örn: 20",
    },
    {
      key: "tavan",
      label: "Tavan Yüksekliği (m)",
      type: "number",
      default: 2.7,
      placeholder: "Örn: 2.7",
    },

    {
      key: "iklim",
      label: "Bölge İklimi",
      type: "select",
      default: "mild",
      options: [
        { label: "Serin/ılıman", value: "cool" },
        { label: "Ilıman", value: "mild" },
        { label: "Sıcak", value: "hot" },
        { label: "Çok sıcak/nemli", value: "very_hot" },
      ],
    },

    {
      key: "odaTipi",
      label: "Oda Tipi",
      type: "select",
      default: "living",
      options: [
        { label: "Yatak Odası", value: "bed" },
        { label: "Salon/Oturma Odası", value: "living" },
        { label: "Ofis/Çalışma Odası", value: "office" },
        { label: "Mutfak", value: "kitchen" },
      ],
    },

    { key: "kisi", label: "İçerideki Kişi Sayısı", type: "number", default: 2 },

    // Gelişmiş (opsiyonel)
    {
      key: "kat",
      label: "Kat Durumu",
      type: "select",
      default: "middle",
      advanced: true,
      options: [
        { label: "Ara kat", value: "middle" },
        { label: "En üst kat / çatıya yakın", value: "top" },
        { label: "Zemin kat", value: "ground" },
      ],
    },
    {
      key: "cepheYon",
      label: "Pencere Yönü",
      type: "select",
      default: "mixed",
      advanced: true,
      options: [
        { label: "Kuzey", value: "N" },
        { label: "Doğu", value: "E" },
        { label: "Güney", value: "S" },
        { label: "Batı", value: "W" },
        { label: "Karışık / Birden fazla", value: "mixed" },
      ],
    },
    {
      key: "guneslik",
      label: "Güneşlik/Perde (güneş kazancını azaltır)",
      type: "select",
      default: "some",
      advanced: true,
      options: [
        { label: "Yok", value: "none" },
        { label: "Var (kısmen)", value: "some" },
        { label: "Var (iyi koruma)", value: "good" },
      ],
    },
    {
      key: "pencereAlani",
      label: "Toplam Pencere Alanı (m²)",
      type: "number",
      default: 2.0,
      advanced: true,
      placeholder: "Örn: 2.0",
    },
    {
      key: "pencereTipi",
      label: "Pencere Tipi",
      type: "select",
      default: "double",
      advanced: true,
      options: [
        { label: "Tek cam / eski", value: "single" },
        { label: "Çift cam", value: "double" },
        { label: "Low-e / ısı yalıtımlı", value: "lowe" },
      ],
    },
    {
      key: "yalitim",
      label: "Yalıtım Durumu",
      type: "select",
      default: "average",
      advanced: true,
      options: [
        { label: "Zayıf", value: "poor" },
        { label: "Orta", value: "average" },
        { label: "İyi", value: "good" },
      ],
    },
    {
      key: "cihazWatt",
      label: "Cihaz Isı Yükü (W) (opsiyonel)",
      type: "number",
      advanced: true,
      placeholder: "Örn: 300 (TV+PC)",
    },
  ],

  compute(v) {
    const n = (x) => (x === "" || x == null ? null : Number(x));
    const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
    const roundTo = (x, step) => Math.round(x / step) * step;

    const alan = Number(v.alan);
    const tavan = Number(v.tavan);
    const kisi = clamp(Math.trunc(Number(v.kisi || 1)), 1, 30);

    if (!isFinite(alan) || alan <= 0)
      return { Hata: "Oda alanı pozitif olmalı." };
    if (!isFinite(tavan) || tavan <= 0)
      return { Hata: "Tavan yüksekliği pozitif olmalı." };

    // ---- 1) Temel hacim bazlı yaklaşım ----
    // Referans: Ilıman koşulda ~ 50-60 W/m³ soğutma ihtiyacı (kabaca)
    // BTU/h = Watt * 3.412
    const hacim = alan * tavan;

    // oda tipi katsayısı (mutfak daha yüksek)
    const roomMul =
      {
        bed: 0.95,
        living: 1.0,
        office: 1.05,
        kitchen: 1.2,
      }[v.odaTipi] ?? 1.0;

    // iklim katsayısı
    const climateMul =
      {
        cool: 0.9,
        mild: 1.0,
        hot: 1.15,
        very_hot: 1.3,
      }[v.iklim] ?? 1.0;

    // kat katsayısı
    const floorMul =
      {
        middle: 1.0,
        top: 1.12,
        ground: 1.03,
      }[v.kat] ?? 1.0;

    // yalıtım katsayısı
    const insMul =
      {
        poor: 1.12,
        average: 1.0,
        good: 0.9,
      }[v.yalitim] ?? 1.0;

    // Başlangıç Watt/m³
    let wPerM3 = 55; // ılıman referans
    wPerM3 *= roomMul * climateMul * floorMul * insMul;

    // ---- 2) Pencere güneş kazancı (daha komplike) ----
    const winArea = clamp(Number(v.pencereAlani || 0), 0, 50);

    const windowTypeMul =
      {
        single: 1.0,
        double: 0.7,
        lowe: 0.5,
      }[v.pencereTipi] ?? 0.7;

    const orientMul =
      {
        N: 0.85,
        E: 1.0,
        S: 1.12,
        W: 1.18,
        mixed: 1.08,
      }[v.cepheYon] ?? 1.08;

    const shadeMul =
      {
        none: 1.15,
        some: 1.0,
        good: 0.9,
      }[v.guneslik] ?? 1.0;

    // pencere ısı yükü (W) ~ alan * sabit * yön * gölgeleme * cam kalitesi
    // (bu bir tahmin; amaç daha iyi öneri)
    const windowWatt = winArea * 180 * orientMul * shadeMul * windowTypeMul;

    // ---- 3) İnsan + cihaz yükleri ----
    // kişi başı ~ 120W (oturan) soğutma yükü (kabaca)
    const peopleWatt = Math.max(0, kisi - 1) * 120;

    // cihaz watt (kullanıcı girerse)
    const devicesWatt = clamp(n(v.cihazWatt) ?? 0, 0, 5000);

    // ---- 4) Toplam Watt ve BTU/h ----
    const baseWatt = hacim * wPerM3;
    const totalWatt = baseWatt + windowWatt + peopleWatt + devicesWatt;
    const btu = totalWatt * 3.412;

    const btuRounded = roundTo(btu, 100);

    // ---- 5) Sınıf önerileri (ekonomi/önerilen/konfor) ----
    const classes = [9000, 12000, 18000, 24000, 30000, 36000, 48000];

    const pickClass = (val) => classes.find((x) => x >= val) ?? 48000;

    const econ = pickClass(btuRounded * 0.92); // biraz aşağı (riskli olabilir)
    const rec = pickClass(btuRounded); // önerilen
    const comfort = pickClass(btuRounded * 1.12); // konfor payı

    // ---- 6) Akıllı notlar ----
    let note = "Tahmini sonuç. En doğru sonuç için keşif önerilir.";
    const hotSun =
      v.iklim === "very_hot" || v.cepheYon === "W" || v.cepheYon === "S";
    const poorIns = v.yalitim === "poor" || v.kat === "top";
    if (hotSun && poorIns) {
      note =
        "Sıcak iklim + güneş + yalıtım/kat etkisi yüksek. Konfor seçeneği daha uygun olabilir.";
    } else if (
      v.yalitim === "good" &&
      (v.cepheYon === "N" || v.cepheYon === "E") &&
      v.guneslik !== "none"
    ) {
      note =
        "Yalıtım iyi ve güneş etkisi düşük. Önerilen sınıf yeterli olacaktır.";
    }

    return {
      "Oda Hacmi (m³)": roundTo(hacim, 0.1),
      "Pencere Isı Yükü (W)": roundTo(windowWatt, 1),
      "İnsan Isı Yükü (W)": roundTo(peopleWatt, 1),
      "Cihaz Isı Yükü (W)": roundTo(devicesWatt, 1),
      "Toplam Isı Yükü (W)": roundTo(totalWatt, 1),

      "Tahmini BTU/h": btuRounded,

      "Ekonomi Seçeneği": `${econ} BTU`,
      "Önerilen Seçenek": `${rec} BTU`,
      "Konfor Seçeneği": `${comfort} BTU`,

      Not: note,
    };
  },
};
