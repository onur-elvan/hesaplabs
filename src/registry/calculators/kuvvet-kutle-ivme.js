// src/registry/calculators/kuvvet-kutle-ivme.js

export default {
  id: "kuvvet-kutle-ivme",
  category: "Fizik",
  title: "Kuvvet – Kütle – İvme (F = m·a)",
  createdAt: "2025-12-25",
  description:
    "F = m·a bağıntısına göre kuvvet, kütle veya ivmeden bilinmeyeni hesaplar.",
  seoTitle: "Kuvvet Kütle İvme Hesaplama – F = m·a (Newton’un 2. Yasası)",

  seoText: `
Bu araç, Newton'un 2. yasası olan F = m·a bağıntısını kullanarak
kuvvet (F), kütle (m) veya ivme (a) niceliklerinden bilinmeyeni hesaplar.

Temel formül:
- F = m · a   (kuvvet)
- m = F / a   (kütle)
- a = F / m   (ivme)

Birimler:
- F (kuvvet): Newton (N)
- m (kütle): kilogram (kg)
- a (ivme): m/s²

Kullanım:
1) Hesaplamak istediğin niceliği seç (F, m veya a).
2) Diğer iki alanı doldur.
3) "Hesapla" butonuna bas, sonuçları ve kullanılan formülü adım adım gör.
`.trim(),

  info: {
    title: "Newton’un 2. Yasası – F = m·a",
    items: [
      "Kuvvet, kütle ile ivmenin çarpımına eşittir: F = m·a.",
      "Kütle sabitse, kuvvet arttıkça ivme de artar (doğru orantı).",
      "Aynı kuvvet altında kütle büyüdükçe ivme azalır (ters orantı).",
      "Birimler SI sisteminde: F [N], m [kg], a [m/s²].",
    ],
    disclaimer:
      "Bu araç yalnızca doğrusal, tek boyutlu ve net kuvvet için temel F = m·a hesabı yapar. Gerçek hayatta sürtünme, hava direnci gibi etkiler dikkate alınmamıştır.",
  },

  inputs: [
    {
      key: "target",
      label: "Hangi büyüklüğü hesaplamak istiyorsun?",
      type: "select",
      default: "F",
      options: [
        { value: "F", label: "Kuvvet F (N)" },
        { value: "m", label: "Kütle m (kg)" },
        { value: "a", label: "İvme a (m/s²)" },
      ],
    },
    {
      key: "F",
      label: "Kuvvet F (N)",
      type: "number",
      default: "",
      placeholder: "Örn: 20",
    },
    {
      key: "m",
      label: "Kütle m (kg)",
      type: "number",
      default: "",
      placeholder: "Örn: 5",
    },
    {
      key: "a",
      label: "İvme a (m/s²)",
      type: "number",
      default: "",
      placeholder: "Örn: 4",
    },
    {
      key: "precision",
      label: "Ondalık basamak sayısı",
      type: "number",
      default: 3,
      advanced: true,
      placeholder: "Örn: 2, 3, 4",
    },
  ],

  compute(values) {
    const target = values.target || "F";
    let F = num(values.F);
    let m = num(values.m);
    let a = num(values.a);

    let precision = Math.floor(num(values.precision));
    if (!Number.isFinite(precision) || precision < 0) precision = 3;
    if (precision > 10) precision = 10;

    const steps = [];

    steps.push("1) Temel bağıntı: F = m · a.");

    // Hedefe göre kontrol
    if (target === "F") {
      // F hesapla -> m ve a lazım
      if (!isFinite(m) || !isFinite(a)) {
        return {
          hata: "Kuvveti hesaplamak için kütle (m) ve ivme (a) değerlerini gir.",
        };
      }
      steps.push("2) Hesaplanacak büyüklük: Kuvvet F.");
      steps.push("   Formül: F = m · a.");
      const Fcalc = m * a;
      const Fr = round(Fcalc, precision);

      steps.push(`3) Hesap: F = ${m} · ${a} = ${Fcalc} (N).`);

      return buildResult({
        targetLabel: "Kuvvet F",
        formula: "F = m · a",
        result: Fr,
        unit: "N",
        raw: Fcalc,
        steps,
        extras: {
          "Kütle m": m,
          "İvme a": a,
        },
      });
    }

    if (target === "m") {
      // m hesapla -> F ve a lazım
      if (!isFinite(F) || !isFinite(a)) {
        return {
          hata: "Kütleyi hesaplamak için kuvvet (F) ve ivme (a) değerlerini gir.",
        };
      }
      if (a === 0) {
        return {
          hata: "İvme a = 0 iken m = F/a tanımsız olur. a sıfırdan farklı olmalı.",
        };
      }

      steps.push("2) Hesaplanacak büyüklük: Kütle m.");
      steps.push("   Formül: m = F / a.");
      const mcalc = F / a;
      const mr = round(mcalc, precision);

      steps.push(`3) Hesap: m = ${F} / ${a} = ${mcalc} (kg).`);

      return buildResult({
        targetLabel: "Kütle m",
        formula: "m = F / a",
        result: mr,
        unit: "kg",
        raw: mcalc,
        steps,
        extras: {
          "Kuvvet F": F,
          "İvme a": a,
        },
      });
    }

    // target === "a"
    if (!isFinite(F) || !isFinite(m)) {
      return {
        hata: "İvmeyi hesaplamak için kuvvet (F) ve kütle (m) değerlerini gir.",
      };
    }
    if (m === 0) {
      return {
        hata: "Kütle m = 0 fiziksel olarak mümkün değildir. m sıfırdan farklı olmalı.",
      };
    }

    steps.push("2) Hesaplanacak büyüklük: İvme a.");
    steps.push("   Formül: a = F / m.");
    const acalc = F / m;
    const ar = round(acalc, precision);

    steps.push(`3) Hesap: a = ${F} / ${m} = ${acalc} (m/s²).`);

    return buildResult({
      targetLabel: "İvme a",
      formula: "a = F / m",
      result: ar,
      unit: "m/s²",
      raw: acalc,
      steps,
      extras: {
        "Kuvvet F": F,
        "Kütle m": m,
      },
    });
  },
};

// --------------- yardımcı fonksiyonlar ---------------
function num(x) {
  if (x === null || x === undefined || x === "") return NaN;
  return Number(String(x).replace(",", "."));
}

function round(x, p) {
  if (!Number.isFinite(x)) return x;
  const f = Math.pow(10, p);
  return Math.round(x * f) / f;
}

function buildResult({
  targetLabel,
  formula,
  result,
  unit,
  raw,
  steps,
  extras,
}) {
  const table = {
    headers: ["Adım", "Açıklama"],
    rows: steps.map((s, i) => [i + 1, s]),
    note: "Adımlar, F = m·a bağıntısından sonuç nasıl elde edildiğini gösterir.",
  };

  return {
    "Hedef büyüklük": targetLabel,
    "Kullanılan formül": formula,
    Sonuç: result,
    "Sonuç (birimli)": `${result} ${unit}`,
    "Ham sonuç (yuvarlanmamış)": raw,
    ...extras,
    __table: table,
  };
}
