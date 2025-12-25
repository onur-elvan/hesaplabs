export default {
  id: "cozelti-karistirma",
  category: "Kimya",
  title: "Çözelti Karıştırma — Yeni Derişim Hesaplama",
  createdAt: "2025-12-25",
  description:
    "Aynı çözüneni içeren iki çözeltinin karıştırılmasıyla oluşan yeni çözeltinin derişimini hesaplar.",
  seoTitle: "Çözelti Karıştırma Derişim Hesaplama — Kimya",
  seoText: `
İki çözelti karıştırıldığında çözünen madde miktarları toplanır.
Toplam çözünen mol sayısı, toplam hacme bölünerek yeni derişim bulunur.

Formül:
C_yeni = (C1·V1 + C2·V2) / (V1 + V2)

Bu araç, laboratuvar çözelti hazırlama ve kimya eğitimi için hızlı ve pratik bir hesaplama sunar.
`.trim(),

  info: {
    title: "Çözelti Karıştırma Nedir?",
    items: [
      "Aynı çözüneni içeren iki çözeltinin birleştirilmesiyle yeni bir çözelti oluşur.",
      "Toplam çözünen mol miktarı korunur: n_toplam = n1 + n2.",
      "Yeni derişim, toplam molün toplam hacme bölünmesiyle bulunur.",
      "Hacimlerin toplanabilir olduğu varsayılır (çoğu seyreltik çözelti için geçerlidir).",
    ],
    disclaimer:
      "Bu işlem sadece aynı çözünen maddelerin karıştırılması için geçerlidir.",
  },

  inputs: [
    {
      key: "c1",
      label: "1. çözelti derişimi C₁ (M)",
      type: "number",
      default: 0.5,
    },
    {
      key: "v1",
      label: "1. çözelti hacmi V₁ (mL)",
      type: "number",
      default: 100,
    },
    {
      key: "c2",
      label: "2. çözelti derişimi C₂ (M)",
      type: "number",
      default: 1.0,
    },
    {
      key: "v2",
      label: "2. çözelti hacmi V₂ (mL)",
      type: "number",
      default: 200,
    },
  ],

  compute(values) {
    const c1 = num(values.c1);
    const c2 = num(values.c2);
    const v1 = num(values.v1);
    const v2 = num(values.v2);

    if (c1 < 0 || c2 < 0) return { hata: "Derişim negatif olamaz." };
    if (v1 <= 0 || v2 <= 0) return { hata: "Hacimler pozitif olmalıdır." };

    const n1 = c1 * v1;
    const n2 = c2 * v2;

    const totalMol = n1 + n2;
    const totalVol = v1 + v2;

    const cNew = totalMol / totalVol;

    return {
      "Yeni derişim C": round3(cNew),
      "Toplam hacim": round2(totalVol),
      "Toplam çözünen mol": round3(totalMol),

      Açıklama:
        "Yeni derişim formülü: C = (C₁·V₁ + C₂·V₂) / (V₁ + V₂). Toplam çözünen mol sabittir.",

      __table: {
        headers: ["Bileşen", "Derişim (M)", "Hacim (mL)", "Mol (M·mL)"],
        rows: [
          ["1. çözelti", c1, v1, round3(n1)],
          ["2. çözelti", c2, v2, round3(n2)],
          ["TOPLAM", "-", totalVol, round3(totalMol)],
        ],
      },
    };
  },
};

function num(x) {
  return Number(String(x ?? "").replace(",", "."));
}

function round2(x) {
  return Number(x.toFixed(2));
}

function round3(x) {
  return Number(x.toFixed(3));
}
