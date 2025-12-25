// src/registry/calculators/dizi-hesaplayici.js

export default {
  id: "dizi-hesaplayici",
  category: "Matematik",
  title: "Aritmetik & Geometrik Dizi Hesaplayıcı",
  createdAt: "2025-12-25",
  description:
    "Aritmetik veya geometrik dizide ilk terim, ortak fark/oran ve terim sayısını girerek n’inci terimi ve toplamı hesaplar.",
  seoTitle:
    "Aritmetik ve Geometrik Dizi Hesaplama – n’inci Terim ve Toplam Formülleri",

  seoText: `
Bu araçla hem aritmetik dizi hem de geometrik dizi için n’inci terimi ve ilk n terimin toplamını kolayca hesaplayabilirsin.

Kullanılan temel formüller:

Aritmetik dizi:
- Genel terim: aₙ = a₁ + (n - 1) · d
- Toplam: Sₙ = n · (a₁ + aₙ) / 2

Geometrik dizi:
- Genel terim: aₙ = a₁ · rⁿ⁻¹
- Toplam (r ≠ 1): Sₙ = a₁ · (1 - rⁿ) / (1 - r)

Bu hesaplayıcı, girdiğin değerlere göre hem n’inci terimi hem de toplamı gösterir; ayrıca ilk 10 terimi tablo halinde listeler.
`.trim(),

  info: {
    title: "Dizi Hesaplamalarında Bilmen Gerekenler",
    items: [
      "Aritmetik dizide ardışık terimler arasındaki fark sabittir (ortak fark d).",
      "Geometrik dizide ardışık terimler arasındaki oran sabittir (ortak oran r).",
      "n bir pozitif tam sayı olmalı; n = 1 için dizi sadece ilk terimden oluşur.",
      "Geometrik dizide r = 1 ise toplam formülü özel hale gelir: Sₙ = n · a₁.",
    ],
    disclaimer:
      "Sonuçlar eğitim amaçlıdır. Kritik finansal/mühendislik kararları için mutlaka ek kontrol yap.",
  },

  inputs: [
    {
      key: "type",
      label: "Dizi tipi",
      type: "select",
      default: "aritmetik",
      options: [
        { value: "aritmetik", label: "Aritmetik dizi" },
        { value: "geometrik", label: "Geometrik dizi" },
      ],
    },
    {
      key: "a1",
      label: "İlk terim (a₁)",
      type: "number",
      default: 1,
      placeholder: "Örn: 3",
    },
    {
      key: "diffOrRatio",
      label: "Ortak fark / oran (d veya r)",
      type: "number",
      default: 2,
      placeholder: "Örn: 2",
    },
    {
      key: "n",
      label: "Terim sayısı (n)",
      type: "number",
      default: 5,
      placeholder: "Pozitif tam sayı",
    },
  ],

  compute(values) {
    const type = values.type || "aritmetik";
    const a1 = num(values.a1);
    const dOrR = num(values.diffOrRatio);
    const n = Math.floor(num(values.n));

    if (!isFinite(a1)) return { hata: "a₁ (ilk terim) sayısal olmalı." };
    if (!isFinite(dOrR)) {
      return { hata: "Ortak fark / oran sayısal olmalı." };
    }
    if (!Number.isFinite(n) || n <= 0) {
      return { hata: "n pozitif bir tam sayı olmalı." };
    }

    let an; // n’inci terim
    let Sn; // ilk n terimin toplamı
    const terms = [];

    if (type === "aritmetik") {
      // a_n = a1 + (n-1)d
      an = a1 + (n - 1) * dOrR;
      // S_n = n (a1 + an) / 2
      Sn = (n * (a1 + an)) / 2;

      // ilk 10 terim (veya n küçükse n terim)
      const limit = Math.min(n, 10);
      for (let k = 1; k <= limit; k++) {
        const ak = a1 + (k - 1) * dOrR;
        terms.push({ n: k, value: ak });
      }
    } else if (type === "geometrik") {
      const r = dOrR;

      // a_n = a1 · r^(n-1)
      an = a1 * Math.pow(r, n - 1);

      if (r === 1) {
        // özel durum
        Sn = a1 * n;
      } else {
        // S_n = a1 (1 - r^n) / (1 - r)
        Sn = (a1 * (1 - Math.pow(r, n))) / (1 - r);
      }

      const limit = Math.min(n, 10);
      for (let k = 1; k <= limit; k++) {
        const ak = a1 * Math.pow(r, k - 1);
        terms.push({ n: k, value: ak });
      }
    } else {
      return { hata: "Bilinmeyen dizi tipi." };
    }

    return {
      "Dizi tipi": type === "aritmetik" ? "Aritmetik dizi" : "Geometrik dizi",
      "İlk terim (a₁)": round(a1),
      "Ortak fark / oran": round(dOrR),
      "Terim sayısı (n)": n,
      "n’inci terim (aₙ)": round(an),
      "İlk n terimin toplamı (Sₙ)": round(Sn),

      __table: {
        headers: ["n", "aₙ"],
        rows: terms.map((t) => [t.n, round(t.value)]),
        note: "Tabloda en fazla ilk 10 terim gösterilir. Değerler 2 ondalık basamağa yuvarlanmıştır.",
      },
    };
  },
};

// Yardımcılar
function num(x) {
  if (x === null || x === undefined || x === "") return NaN;
  return Number(String(x).replace(",", "."));
}
function round(x) {
  if (!Number.isFinite(x)) return x;
  return Number(x.toFixed(2));
}
