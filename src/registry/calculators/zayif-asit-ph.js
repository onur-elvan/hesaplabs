export default {
  id: "zayif-asit-ph",
  category: "Kimya",
  title: "Zayıf Asit pH Hesaplayıcı (Ka — ICE Tablosu)",
  createdAt: "2025-12-25",
  description:
    "Ka ve molar derişimden zayıf asit çözeltilerinin pH değerini ICE tablosu ve denge çözümüyle hesaplar.",

  seoTitle: "Zayıf Asit pH Hesaplama | Ka — ICE Tablosu ile pH Bulma Aracı",
  seoText: `
Bu hesaplayıcı, zayıf asit çözeltilerinin pH hesaplamasını adım adım yapan
profesyonel bir araçtır. Hesaplama, ICE tablosu ve asit ayrışma dengesi
kullanılarak yapılır:

HA ⇌ H⁺ + A⁻

Denge denklemi:

Ka = ([H⁺][A⁻]) / [HA]

Bu araç önce Ka ve derişim değerlerinden ikinci dereceden denklemi kurar,
ardından matematiksel çözümle [H⁺] değerini bulur ve pH hesaplar:

pH = -log[H⁺]

Ayrıca 5% approximation (zayıf asit varsayımı) geçerli mi kontrol edilir
ve sonuçta hangi yöntemin kullanıldığı belirtilir.

Bu araç özellikle:
• lise AYT kimya
• üniversite genel kimya
• laboratuvar hesaplamaları
• tampon çözeltilerin ön analizi
için son derece faydalıdır.

Not: Hesaplamalar seyreltik sulu çözeltiler ve 25°C için idealleştirilmiştir.
  `.trim(),

  info: {
    title: "Zayıf Asit pH Hesaplama — ICE Tablosu",
    items: [
      "Zayıf asitler suda kısmen ayrışır.",
      "pH, Ka ve başlangıç derişiminden hesaplanır.",
      "Denge denklemi bir ikinci dereceden denklem oluşturur.",
      "5% kuralı otomatik olarak kontrol edilir.",
    ],
    disclaimer:
      "Teorik eğitim amaçlıdır. Çok derişik çözeltiler ve iyonik bağlaşım dikkate alınmaz.",
  },

  inputs: [
    {
      key: "Ka",
      label: "Ka (asit ayrışma sabiti)",
      type: "number",
      default: 1.8e-5,
    },
    {
      key: "C",
      label: "Başlangıç derişimi [HA] (M)",
      type: "number",
      default: 0.1,
    },
  ],

  compute(v) {
    const Ka = num(v.Ka);
    const C = num(v.C);

    if (Ka <= 0) return { hata: "Ka değeri pozitif olmalıdır." };
    if (C <= 0) return { hata: "Derişim pozitif olmalıdır." };

    // İkinci dereceden çözüm
    // x² + Ka x − KaC = 0
    const a = 1;
    const b = Ka;
    const c = -Ka * C;

    const disc = b * b - 4 * a * c;
    if (disc < 0) return { hata: "Negatif diskriminant oluştu." };

    const x = (-b + Math.sqrt(disc)) / (2 * a); // [H+]

    const pH = -Math.log10(x);

    // Yaklaşım kontrolü (x << C ?)
    const percent = (x / C) * 100;
    const approxOk = percent < 5;

    return {
      "[H⁺] (denge)": sci(x),
      pH: round2(pH),
      "Ayrışma yüzdesi (%)": round3(percent),
      "Yaklaşım geçerli mi?": approxOk ? "Evet (x < %5)" : "Hayır",

      __table: {
        headers: ["Terim", "Değer"],
        rows: [
          ["Ka", Ka],
          ["Başlangıç derişimi (M)", C],
          ["[H⁺] (M)", x],
          ["pH", pH],
        ],
        note: "Denge denkleminden ikinci dereceden çözüm uygulanmıştır.",
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

function sci(x) {
  return Number.parseFloat(x).toExponential(3);
}
