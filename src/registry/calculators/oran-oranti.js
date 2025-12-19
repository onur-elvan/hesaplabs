export default {
  id: "oran-oranti",
  category: "Matematik",
  title: "Oran – Orantı (3'lü kural)",
  description: "Doğru / ters orantı ile x değerini hesaplar.",
  inputs: [
    {
      key: "mode",
      label: "Orantı Tipi",
      type: "select",
      default: "direct",
      options: [
        { label: "Doğru Orantı", value: "direct" },
        { label: "Ters Orantı", value: "inverse" },
      ],
    },
    { key: "a", label: "a", type: "number", placeholder: "Örn: 5", default: 1 },
    {
      key: "b",
      label: "b",
      type: "number",
      placeholder: "Örn: 10",
      default: 0,
    },
    { key: "c", label: "c", type: "number", placeholder: "Örn: 8", default: 0 },
  ],
  compute(values) {
    const a = Number(values.a);
    const b = Number(values.b);
    const c = Number(values.c);
    const mode = values.mode;

    if (!isFinite(a) || !isFinite(b) || !isFinite(c))
      return { hata: "Geçersiz sayı" };
    if (a === 0 && mode === "direct")
      return { hata: "Doğru orantıda a = 0 olamaz" };
    if (c === 0 && mode === "inverse")
      return { hata: "Ters orantıda c = 0 olamaz" };

    // Varsayım:
    // Doğru: a → b ise c → x  => x = (b*c)/a
    // Ters : a*b = c*x      => x = (a*b)/c
    const x = mode === "direct" ? (b * c) / a : (a * b) / c;

    return {
      x,
      formül: mode === "direct" ? "x = (b·c) / a" : "x = (a·b) / c",
    };
  },
};
