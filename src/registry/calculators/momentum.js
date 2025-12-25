// src/registry/calculators/momentum.js

export default {
  id: "momentum",
  category: "Fizik",
  title: "Momentum Hesaplama (p = m · v)",
  createdAt: "2025-12-25",
  description:
    "Kütle ve hızdan momentum p = m·v ile momentum ve kinetik enerjiyi hesaplar.",
  seoTitle: "Momentum Hesaplama – p = m·v (Fizik Hesaplayıcı)",

  seoText: `
Momentum (impuls değil, çizgisel momentum), bir cismin kütlesi ve hızının çarpımıdır:

p = m · v

Burada:
- p: momentum (kg·m/s),
- m: kütle (kg),
- v: hız (m/s).

Yorum:
- Büyük kütle veya büyük hız → daha büyük momentum.
- Negatif hız, yön bilgisini gösterir (eksi işaret “ters yön” anlamına gelir).
- Momentum, çarpışma ve itme problemlerinde enerji kadar önemli bir büyüklüktür.

Bu araç:
- Kütle ve hızdan momentum p'yi hesaplar,
- Aynı zamanda ½·m·v² formülü ile kinetik enerjiyi de (Ek) verir.
`.trim(),

  info: {
    title: "Momentum Nedir?",
    items: [
      "Momentum p = m · v ile tanımlanır (m: kütle, v: hız).",
      "Birim: kg·m/s (SI birim sistemi).",
      "Newton’un ikinci ve üçüncü yasalarında, çarpışmalar ve itmeler incelenirken momentum korunumu sıkça kullanılır.",
      "İki cisim çarpıştığında, dış kuvvet yoksa toplam momentum korunur.",
    ],
    disclaimer:
      "Bu araç doğrusal (çizgisel) momentum hesabı yapar ve tek boyutlu hareket varsayar. Gerçek problemlerde yön, sürtünme ve diğer kuvvetler sonucu etkileyebilir.",
  },

  inputs: [
    {
      key: "m",
      label: "Kütle m (kg)",
      type: "number",
      default: "",
      placeholder: "Örn: 2.5",
    },
    {
      key: "v",
      label: "Hız v (m/s)",
      type: "number",
      default: "",
      placeholder: "Örn: 12 (sağa doğru) veya -5 (sola doğru)",
    },
    {
      key: "precision",
      label: "Ondalık basamak sayısı",
      type: "number",
      default: 3,
      placeholder: "Örn: 2, 3, 4",
      advanced: true,
    },
  ],

  compute(values) {
    const m = num(values.m);
    const v = num(values.v);
    let precision = Math.floor(num(values.precision));

    if (!Number.isFinite(precision) || precision < 0) precision = 3;
    if (precision > 10) precision = 10;

    if (!Number.isFinite(m) || m <= 0) {
      return { hata: "Kütle (m) pozitif bir sayı olmalı (kg cinsinden)." };
    }
    if (!Number.isFinite(v)) {
      return { hata: "Hız (v) sayısal bir değer olmalı (m/s cinsinden)." };
    }

    // Hesaplar
    const p = m * v; // momentum
    const Ek = 0.5 * m * v * v; // kinetik enerji (J)

    const pRounded = round(p, precision);
    const EkRounded = round(Ek, precision);

    const steps = [];

    steps.push("1) Momentum tanımı: p = m · v.");
    steps.push(`   Burada m = ${m} kg, v = ${v} m/s.`);
    steps.push(`2) Hesap: p = ${m} · ${v} = ${p} kg·m/s.`);
    steps.push("3) Kinetik enerji tanımı: Ek = ½ · m · v².");
    steps.push(
      `   Ek = 0.5 · ${m} · (${v})² = ${Ek} J (Joule cinsinden enerji).`
    );

    const directionNote =
      v > 0
        ? "Hız pozitif olduğu için momentum yönü pozitif doğrultudadır."
        : v < 0
        ? "Hız negatif olduğu için momentum yönü negatif doğrultudadır (ters yön)."
        : "Hız v = 0 olduğunda cisim duruyordur ve momentum sıfırdır.";

    const table = {
      headers: ["Adım", "Açıklama"],
      rows: steps.map((s, i) => [i + 1, s]),
      note: "Adımlar, p = m·v ve Ek = ½·m·v² formüllerinin nasıl uygulandığını gösterir.",
    };

    return {
      "Kütle m": m,
      "Hız v": v,
      "Momentum p (kg·m/s)": pRounded,
      "Momentumun mutlak değeri |p|": round(Math.abs(p), precision),
      "Kinetik Enerji Ek (J)": EkRounded,
      "Kullanılan momentum formülü": "p = m · v",
      "Kullanılan enerji formülü": "Ek = ½ · m · v²",
      "Yön yorumu": directionNote,
      __table: table,
    };
  },
};

// Yardımcılar
function num(x) {
  if (x === null || x === undefined || x === "") return NaN;
  return Number(String(x).replace(",", "."));
}

function round(x, p) {
  if (!Number.isFinite(x)) return x;
  const f = Math.pow(10, p);
  return Math.round(x * f) / f;
}
