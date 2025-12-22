export default {
  id: "mol-hesaplama",
  title: "Mol Hesaplama",
  seoTitle: "Mol Hesaplama – n = m / M Formülü ile Hızlı Çözüm",
  category: "Kimya",
  description:
    "Kütle (g) ve mol kütlesi (g/mol) girerek mol sayısını hesapla. Adım adım tabloyla gör.",
  inputs: [
    {
      key: "kutle",
      label: "Kütle (g)",
      type: "number",
      placeholder: "Örn: 18",
      default: 0,
    },
    {
      key: "molKutle",
      label: "Mol Kütlesi (g/mol)",
      type: "number",
      placeholder: "Örn: 18",
      default: 0,
    },
  ],
  seoText: `
Mol hesaplama temel formül:
n = m / M

n: mol sayısı
m: kütle (g)
M: mol kütlesi (g/mol)

Bu araç, sonucu hızlı verir ve adım adım gösterir.
`.trim(),
  compute(v) {
    const m = Number(v.kutle || 0);
    const M = Number(v.molKutle || 0);

    if (!Number.isFinite(m) || !Number.isFinite(M) || M <= 0) {
      return { Hata: "Kütle ve mol kütlesi geçerli olmalı (M>0)." };
    }

    const n = m / M;

    return {
      "Mol (n)": n,
      __table: {
        title: "Adım Adım",
        headers: ["Adım", "İşlem"],
        rows: [
          ["1", "Formül: n = m / M"],
          ["2", `m = ${m} g, M = ${M} g/mol`],
          ["3", `n = ${m} / ${M} = ${n}`],
        ],
      },
    };
  },
};
