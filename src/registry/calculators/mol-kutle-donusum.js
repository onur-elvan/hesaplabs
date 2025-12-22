export default {
  id: "mol-kutle-donusum",
  title: "Mol – Kütle Dönüşümü",
  seoTitle: "Mol Kütle Dönüşümü – n = m/M ve m = n·M",
  category: "Kimya",
  description: "Mol sayısı, kütle ve mol kütlesi arasında dönüşüm yap.",
  inputs: [
    {
      key: "mode",
      label: "Dönüşüm",
      type: "select",
      default: "m_to_n",
      options: [
        { label: "Kütleden mol (m → n)", value: "m_to_n" },
        { label: "Molden kütle (n → m)", value: "n_to_m" },
      ],
    },
    {
      key: "m",
      label: "Kütle (g)",
      type: "number",
      placeholder: "Örn: 18",
      default: 0,
    },
    {
      key: "n",
      label: "Mol (mol)",
      type: "number",
      placeholder: "Örn: 2",
      default: 0,
    },
    {
      key: "M",
      label: "Mol Kütlesi (g/mol)",
      type: "number",
      placeholder: "Örn: 18",
      default: 0,
    },
  ],
  compute(v) {
    const m = Number(v.m || 0);
    const n = Number(v.n || 0);
    const M = Number(v.M || 0);
    if (!Number.isFinite(M) || M <= 0)
      return { Hata: "Mol kütlesi M > 0 olmalı." };

    if (v.mode === "m_to_n") {
      if (!Number.isFinite(m) || m < 0) return { Hata: "Kütle geçersiz." };
      const mol = m / M;
      return {
        "Mol (n)": mol,
        __table: {
          title: "Adım",
          headers: ["Formül", "Sonuç"],
          rows: [["n = m / M", `${m} / ${M} = ${mol}`]],
        },
      };
    }

    if (!Number.isFinite(n) || n < 0) return { Hata: "Mol geçersiz." };
    const kutle = n * M;
    return {
      "Kütle (m) (g)": kutle,
      __table: {
        title: "Adım",
        headers: ["Formül", "Sonuç"],
        rows: [["m = n · M", `${n} · ${M} = ${kutle}`]],
      },
    };
  },
};
