export default {
  id: "yuzde-derisim",
  title: "Yüzde Derişim Hesaplama",
  seoTitle: "Yüzde Derişim Hesaplama – % (m/m) ve % (m/V)",
  category: "Kimya",
  description: "Kütlece veya hacimce yüzde derişimi hesapla.",
  inputs: [
    {
      key: "tip",
      label: "Derişim Tipi",
      type: "select",
      default: "m/m",
      options: [
        { label: "% (m/m) – Kütlece", value: "m/m" },
        { label: "% (m/V) – Kütle/Hacim", value: "m/V" },
      ],
    },
    {
      key: "cozunen",
      label: "Çözünen miktarı (g)",
      type: "number",
      placeholder: "Örn: 10",
      default: 0,
    },
    {
      key: "toplam",
      label: "Toplam çözelti (g veya mL)",
      type: "number",
      placeholder: "Örn: 100",
      default: 0,
    },
  ],
  seoText: `
Yüzde derişim:
- % (m/m) = (çözünen kütlesi / çözelti kütlesi) × 100
- % (m/V) = (çözünen kütlesi / çözelti hacmi) × 100
`.trim(),
  compute(v) {
    const cozunen = Number(v.cozunen || 0);
    const toplam = Number(v.toplam || 0);

    if (!Number.isFinite(cozunen) || !Number.isFinite(toplam) || toplam <= 0) {
      return { Hata: "Değerler geçersiz (toplam > 0 olmalı)." };
    }

    const pct = (cozunen / toplam) * 100;

    return {
      "Yüzde Derişim (%)": pct,
      Formül: v.tip === "m/V" ? "% (m/V)" : "% (m/m)",
    };
  },
};
