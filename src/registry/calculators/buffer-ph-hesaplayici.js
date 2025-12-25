export default {
  id: "tampon-buffer-ph",
  category: "Kimya",
  title: "Tampon (Buffer) Çözelti pH Hesaplayıcı",
  createdAt: "2025-12-25",
  description:
    "Zayıf asit ve eşlenik bazdan oluşan tampon çözeltilerin pH değerini Henderson–Hasselbalch denklemine göre hesaplar.",

  seoTitle: "Tampon Çözelti pH Hesaplama | Henderson–Hasselbalch",
  seoText: `
Tampon çözeltiler pH değişimine direnç gösteren sistemlerdir.
Bu araç, zayıf asit–eşlenik baz çiftleri için pH'ı Henderson–Hasselbalch denklemine göre hesaplar:

pH = pKa + log([A-]/[HA])

Kimya dersleri ve laboratuvar hesaplamaları için uygundur.
`.trim(),

  info: {
    title: "Henderson–Hasselbalch Denklemi",
    items: [
      "Tampon çözelti: zayıf asit + eşlenik baz içerir.",
      "pH = pKa + log([A-]/[HA])",
      "En güçlü tamponlama [A-] = [HA] iken oluşur.",
      "pH ≈ pKa olduğunda sistem en stabildir.",
    ],
    disclaimer:
      "Seyreltik sulu çözeltiler ve klasik tampon varsayımları geçerlidir.",
  },

  inputs: [
    { key: "pKa", label: "pKa değeri", type: "number", default: 4.76 },
    {
      key: "acid",
      label: "Zayıf asit derişimi [HA] (M)",
      type: "number",
      default: 0.1,
    },
    {
      key: "base",
      label: "Eşlenik baz derişimi [A⁻] (M)",
      type: "number",
      default: 0.1,
    },
  ],

  compute(values) {
    const pKa = num(values.pKa);
    const HA = num(values.acid);
    const A = num(values.base);

    if (HA <= 0 || A <= 0) return { hata: "Derişimler pozitif olmalıdır." };

    const ratio = A / HA;
    const pH = pKa + Math.log10(ratio);

    return {
      "pH değeri": round2(pH),
      "Baz / Asit oranı": round3(ratio),

      Açıklama:
        "pH değeri Henderson–Hasselbalch denklemine göre hesaplandı: pH = pKa + log([A-]/[HA])",

      __table: {
        headers: ["Bileşen", "Derişim (M)"],
        rows: [
          ["Zayıf asit (HA)", HA],
          ["Eşlenik baz (A⁻)", A],
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
