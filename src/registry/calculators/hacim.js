export default {
  id: "hacim",
  category: "Matematik",
  title: "Hacim Hesaplama (Küre / Silindir / Kutu)",
  description: "Seçilen cismin hacmini ve (uygunsa) yüzey alanını hesaplar.",
  inputs: [
    {
      key: "solid",
      label: "Cisim",
      type: "select",
      default: "cylinder",
      options: [
        { label: "Silindir", value: "cylinder" },
        { label: "Küre", value: "sphere" },
        { label: "Dikdörtgenler Prizması (Kutu)", value: "box" },
      ],
    },
    { key: "r", label: "Yarıçap (r)", type: "number", default: 5 },
    { key: "h", label: "Yükseklik (h)", type: "number", default: 10 },
    { key: "a", label: "Kenar a", type: "number", default: 10 },
    { key: "b", label: "Kenar b", type: "number", default: 6 },
    { key: "c", label: "Kenar c", type: "number", default: 4 },
  ],
  compute(values) {
    const solid = values.solid;
    const r = Number(values.r);
    const h = Number(values.h);
    const a = Number(values.a);
    const b = Number(values.b);
    const c = Number(values.c);

    if (solid === "cylinder") {
      if (!isFinite(r) || !isFinite(h) || r <= 0 || h <= 0)
        return { hata: "r ve h pozitif olmalı" };
      const hacim = Math.PI * r * r * h;
      const yuzey = 2 * Math.PI * r * (r + h);
      return { hacim, yüzeyAlanı: yuzey };
    }

    if (solid === "sphere") {
      if (!isFinite(r) || r <= 0) return { hata: "r pozitif olmalı" };
      const hacim = (4 / 3) * Math.PI * r ** 3;
      const yuzey = 4 * Math.PI * r ** 2;
      return { hacim, yüzeyAlanı: yuzey };
    }

    if (solid === "box") {
      if (
        !isFinite(a) ||
        !isFinite(b) ||
        !isFinite(c) ||
        a <= 0 ||
        b <= 0 ||
        c <= 0
      )
        return { hata: "a,b,c pozitif olmalı" };
      const hacim = a * b * c;
      const yuzey = 2 * (a * b + a * c + b * c);
      return { hacim, yüzeyAlanı: yuzey };
    }

    return { hata: "Cisim seçimi hatalı" };
  },
};
