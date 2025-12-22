export default {
  id: "ph-hesaplama",
  title: "pH Hesaplama",
  seoTitle: "pH Hesaplama – [H+] veya [OH-] ile pH/pOH",
  category: "Kimya",
  description: "H+ veya OH- derişiminden pH/pOH hesapla.",
  inputs: [
    {
      key: "mode",
      label: "Girdi",
      type: "select",
      default: "H",
      options: [
        { label: "[H+] (mol/L) girdim", value: "H" },
        { label: "[OH-] (mol/L) girdim", value: "OH" },
      ],
    },
    {
      key: "c",
      label: "Derişim (mol/L)",
      type: "number",
      placeholder: "Örn: 1e-3",
      default: 0.001,
    },
  ],
  seoText: `
pH = -log10[H+]
pOH = -log10[OH-]
25°C için: pH + pOH ≈ 14
`.trim(),
  compute(v) {
    const c = Number(v.c);
    if (!Number.isFinite(c) || c <= 0) return { Hata: "Derişim > 0 olmalı." };

    const log10 = (x) => Math.log(x) / Math.LN10;

    if (v.mode === "H") {
      const pH = -log10(c);
      const pOH = 14 - pH;
      return { pH, pOH, Yorum: pH < 7 ? "Asidik" : pH > 7 ? "Bazik" : "Nötr" };
    }

    const pOH = -log10(c);
    const pH = 14 - pOH;
    return { pH, pOH, Yorum: pH < 7 ? "Asidik" : pH > 7 ? "Bazik" : "Nötr" };
  },
};
