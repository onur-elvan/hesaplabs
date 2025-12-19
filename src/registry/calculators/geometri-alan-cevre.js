export default {
  id: "geometri-alan-cevre",
  category: "Matematik",
  title: "Geometri (Alan / Çevre)",
  description: "Seçilen şeklin alan ve çevresini hesaplar.",
  inputs: [
    {
      key: "shape",
      label: "Şekil",
      type: "select",
      default: "circle",
      options: [
        { label: "Daire", value: "circle" },
        { label: "Dikdörtgen", value: "rect" },
        { label: "Üçgen (taban + yükseklik)", value: "tri" },
      ],
    },
    { key: "r", label: "Yarıçap (r)", type: "number", default: 5 },
    { key: "w", label: "Genişlik (w)", type: "number", default: 10 },
    { key: "h", label: "Yükseklik (h)", type: "number", default: 6 },
    { key: "base", label: "Taban", type: "number", default: 8 },
    { key: "height", label: "Üçgen Yükseklik", type: "number", default: 5 },
  ],
  compute(values) {
    const shape = values.shape;

    const r = Number(values.r);
    const w = Number(values.w);
    const h = Number(values.h);
    const base = Number(values.base);
    const height = Number(values.height);

    if (shape === "circle") {
      if (!isFinite(r) || r <= 0) return { hata: "r pozitif olmalı" };
      const alan = Math.PI * r * r;
      const cevre = 2 * Math.PI * r;
      return { alan, çevre: cevre };
    }

    if (shape === "rect") {
      if (!isFinite(w) || !isFinite(h) || w <= 0 || h <= 0)
        return { hata: "w ve h pozitif olmalı" };
      return { alan: w * h, çevre: 2 * (w + h) };
    }

    if (shape === "tri") {
      if (!isFinite(base) || !isFinite(height) || base <= 0 || height <= 0)
        return { hata: "taban ve yükseklik pozitif olmalı" };
      const alan = (base * height) / 2;
      return {
        alan,
        not: "Çevre için kenarlar gerektiği için sadece alan verildi.",
      };
    }

    return { hata: "Şekil seçimi hatalı" };
  },
};
