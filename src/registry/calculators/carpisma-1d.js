export default {
  id: "carpisma-1d",
  category: "Fizik",
  title: "1 Boyutlu Çarpışma – Esnek / Tam Esnek Olmayan",
  createdAt: "2025-12-25",
  description:
    "İki cismin kütle ve başlangıç hızlarından, 1 boyutta esnek veya tam esnek olmayan çarpışma sonrası hızları ve enerji değişimini hesaplar.",
  seoTitle:
    "1 Boyutlu Çarpışma Hesaplama – Esnek ve Tam Esnek Olmayan Çarpışmalar",

  seoText: `
Bu araç, tek boyutta (aynı doğru üzerinde) hareket eden iki cismin çarpışmasını analiz eder.
Hem esnek (enerjinin korunduğu) hem de tam esnek olmayan (cisimlerin yapışarak birlikte hareket ettiği) çarpışmaları destekler.

Tanımlar:

- Başlangıç değerleri:
  m₁, v₁: 1. cismin kütlesi ve hızı
  m₂, v₂: 2. cismin kütlesi ve hızı

- Esnek çarpışmada korunan büyüklükler:
  • Toplam momentum: p = m₁v₁ + m₂v₂
  • Toplam mekanik enerji: E = ½m₁v₁² + ½m₂v₂²

- Tam esnek olmayan çarpışmada:
  • Momentum korunur,
  • Cisimler çarpışma sonrası aynı hızla (v') birlikte hareket eder,
  • Mekanik enerjinin bir kısmı ısı, ses vb. olarak kaybolur.

Bu araç:
- Seçilen çarpışma tipine göre v₁' ve v₂' son hızlarını bulur,
- Başlangıç ve son momentum/enerji değerlerini hesaplar,
- Enerji kaybını ve momentum hatasını (sayısal yuvarlama) raporlar.
`.trim(),

  info: {
    title: "Çarpışma Tipleri Hakkında",
    items: [
      "Esnek çarpışmada hem momentum hem de mekanik enerji korunur.",
      "Tam esnek olmayan çarpışmada cisimler yapışır ve birlikte hareket eder; momentum korunurken mekanik enerji azalır.",
      "Gerçek hayattaki çarpışmalar genelde bu iki uç durumun arasında yer alır.",
    ],
    disclaimer:
      "Model, tek boyutlu ve dış kuvvetlerin ihmal edildiği ideal çarpışmaları baz alır. Gerçek sistemlerde enerji kayıpları ve 3B etkiler sonucu değiştirebilir.",
  },

  inputs: [
    {
      key: "m1",
      label: "1. cismin kütlesi m₁ (kg)",
      type: "number",
      default: "",
      placeholder: "Örn: 1",
    },
    {
      key: "v1",
      label: "1. cismin başlangıç hızı v₁ (m/s)",
      type: "number",
      default: "",
      placeholder: "Örn: 2",
    },
    {
      key: "m2",
      label: "2. cismin kütlesi m₂ (kg)",
      type: "number",
      default: "",
      placeholder: "Örn: 0.5",
    },
    {
      key: "v2",
      label: "2. cismin başlangıç hızı v₂ (m/s)",
      type: "number",
      default: "",
      placeholder: "Örn: -1 (ters yönde)",
    },
    {
      key: "collisionType",
      label: "Çarpışma tipi",
      type: "select",
      default: "elastic",
      options: [
        { label: "Esnek (enerji korunur)", value: "elastic" },
        {
          label: "Tam esnek olmayan (birlikte hareket)",
          value: "inelastic",
        },
      ],
    },

    // Gelişmiş:
    {
      key: "precision",
      label: "Ondalık basamak sayısı",
      type: "number",
      default: 4,
      advanced: true,
      placeholder: "Örn: 3 veya 4",
    },
  ],

  compute(values) {
    const m1 = num(values.m1);
    const v1 = num(values.v1);
    const m2 = num(values.m2);
    const v2 = num(values.v2);
    const type = values.collisionType || "elastic";

    if (!Number.isFinite(m1) || m1 <= 0) {
      return { hata: "m₁ pozitif bir sayı olmalı (kg)." };
    }
    if (!Number.isFinite(m2) || m2 <= 0) {
      return { hata: "m₂ pozitif bir sayı olmalı (kg)." };
    }
    if (!Number.isFinite(v1)) {
      return { hata: "v₁ geçerli bir sayı olmalı (m/s)." };
    }
    if (!Number.isFinite(v2)) {
      return { hata: "v₂ geçerli bir sayı olmalı (m/s)." };
    }

    let precision = Math.floor(num(values.precision));
    if (!Number.isFinite(precision) || precision < 0) precision = 4;
    if (precision > 10) precision = 10;

    // Başlangıç momentum ve enerji
    const p0 = m1 * v1 + m2 * v2;
    const E01 = 0.5 * m1 * v1 * v1;
    const E02 = 0.5 * m2 * v2 * v2;
    const E0 = E01 + E02;

    let v1p, v2p;
    let collisionLabel;

    if (type === "inelastic") {
      // Tam esnek olmayan: birlikte hareket, ortak hız v'
      const vp = (m1 * v1 + m2 * v2) / (m1 + m2);
      v1p = vp;
      v2p = vp;
      collisionLabel = "Tam esnek olmayan (yapışık çarpışma)";
    } else {
      // Esnek çarpışma: momentum ve enerji korunur
      // Formüller (1D):
      // v1' = [(m1 - m2)/(m1 + m2)] v1 + [2m2/(m1 + m2)] v2
      // v2' = [2m1/(m1 + m2)] v1 + [(m2 - m1)/(m1 + m2)] v2
      const denom = m1 + m2;
      v1p = ((m1 - m2) / denom) * v1 + ((2 * m2) / denom) * v2;
      v2p = ((2 * m1) / denom) * v1 + ((m2 - m1) / denom) * v2;
      collisionLabel = "Esnek çarpışma";
    }

    // Son momentum ve enerji
    const p1 = m1 * v1p + m2 * v2p;
    const E11 = 0.5 * m1 * v1p * v1p;
    const E12 = 0.5 * m2 * v2p * v2p;
    const E1 = E11 + E12;

    const deltaP = Math.abs(p1 - p0);
    const deltaE = E1 - E0; // genelde inelastic için negatif

    const table = {
      headers: ["Cisim", "m (kg)", "v₀ (m/s)", "v' (m/s)", "E₀ (J)", "E' (J)"],
      rows: [
        [
          "1. cisim",
          round(m1, precision),
          round(v1, precision),
          round(v1p, precision),
          round(E01, precision),
          round(E11, precision),
        ],
        [
          "2. cisim",
          round(m2, precision),
          round(v2, precision),
          round(v2p, precision),
          round(E02, precision),
          round(E12, precision),
        ],
      ],
      note: `Tabloda, çarpışma öncesi (v₀, E₀) ve çarpışma sonrası (v', E') değerleri gösterilmiştir. Toplam momentum ve enerji özet değerleri ayrıca raporlanır.`,
    };

    return {
      "Çarpışma tipi": collisionLabel,
      "m₁ (kg)": round(m1, precision),
      "v₁ (m/s)": round(v1, precision),
      "m₂ (kg)": round(m2, precision),
      "v₂ (m/s)": round(v2, precision),

      "Başlangıç toplam momentum p₀ (kg·m/s)": round(p0, precision),
      "Başlangıç toplam enerji E₀ (J)": round(E0, precision),

      "Son hız v₁' (m/s)": round(v1p, precision),
      "Son hız v₂' (m/s)": round(v2p, precision),

      "Son toplam momentum p₁ (kg·m/s)": round(p1, precision),
      "Son toplam enerji E₁ (J)": round(E1, precision),

      "Momentum farkı |Δp| (kg·m/s)": round(deltaP, precision),
      "Enerji farkı ΔE = E₁ − E₀ (J)": round(deltaE, precision),

      __table: table,
    };
  },
};

// Yardımcılar
function num(x) {
  if (x === null || x === undefined || x === "") return NaN;
  return Number(String(x).replace(",", "."));
}

function round(x, p) {
  if (!Number.isFinite(x)) return x;
  const f = Math.pow(10, p);
  return Math.round(x * f) / f;
}
