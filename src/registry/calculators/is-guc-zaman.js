// src/registry/calculators/is-guc-zaman.js

export default {
  id: "is-guc-zaman",
  category: "Fizik",
  title: "İş – Güç – Zaman Hesaplama (P = W / t)",
  createdAt: "2025-12-25",
  description:
    "P = W / t bağıntısına göre iş, güç veya zamandan bilinmeyeni hesaplar.",
  seoTitle: "İş Güç Zaman Hesaplama – P = W/t (Fizik Hesaplayıcı)",

  seoText: `
Bu araç, temel fizik bağıntısı olan P = W / t ilişkisini kullanarak
iş (enerji), güç veya zamandan bilinmeyeni hesaplar.

Tanımlar:
- İş (W): Bir kuvvetin, bir mesafe boyunca yaptığı enerji aktarımıdır. Birimi Joule (J).
- Güç (P): Birim zamanda yapılan iştir. Birimi Watt (W).
- Zaman (t): İşin gerçekleştiği süredir. Birimi saniye (s).

Temel formüller:
- P = W / t   (güç)
- W = P · t   (iş)
- t = W / P   (zaman)

Birimler (SI):
- W (iş / enerji): Joule [J]
- P (güç): Watt [W]
- t (zaman): saniye [s]

Not: Büyük enerji değerleri için sonuç ek olarak kWh cinsinden de gösterilir.
`.trim(),

  info: {
    title: "İş – Güç – Zaman İlişkisi",
    items: [
      "Güç, birim zamanda yapılan iş miktarıdır: P = W / t.",
      "Aynı zamanda W = P · t ve t = W / P ilişkileri de buradan türetilir.",
      "Ev aletlerinde görülen 'Watt' değeri, cihazın birim zamanda ne kadar enerji tüketebileceğini gösterir.",
      "1 kWh = 3.6 × 10⁶ J yaklaşık olarak 3.600.000 Joule enerjiye karşılık gelir.",
    ],
    disclaimer:
      "Bu araç ortalama güç hesabı yapar. Gerçek hayatta güç zamanla değişebilir; burada sabit güç varsayılmıştır.",
  },

  inputs: [
    {
      key: "target",
      label: "Hangi büyüklüğü hesaplamak istiyorsun?",
      type: "select",
      default: "P",
      options: [
        { value: "P", label: "Güç P (W)" },
        { value: "W", label: "İş / Enerji W (J)" },
        { value: "t", label: "Zaman t (s)" },
      ],
    },
    {
      key: "W",
      label: "İş / Enerji W (Joule)",
      type: "number",
      default: "",
      placeholder: "Örn: 1200",
    },
    {
      key: "P",
      label: "Güç P (Watt)",
      type: "number",
      default: "",
      placeholder: "Örn: 60",
    },
    {
      key: "t",
      label: "Zaman t (saniye)",
      type: "number",
      default: "",
      placeholder: "Örn: 20",
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
    const target = values.target || "P";

    let W = num(values.W); // Joule
    let P = num(values.P); // Watt
    let t = num(values.t); // saniye

    let precision = Math.floor(num(values.precision));
    if (!Number.isFinite(precision) || precision < 0) precision = 3;
    if (precision > 10) precision = 10;

    const steps = [];
    steps.push("1) Temel bağıntımız: P = W / t.");

    if (target === "P") {
      // Güç hesapla -> W ve t lazım
      if (!isFinite(W) || !isFinite(t)) {
        return {
          hata: "Gücü hesaplamak için iş/enerji (W) ve zaman (t) değerlerini gir.",
        };
      }
      if (t === 0) {
        return {
          hata: "Zaman t = 0 olamaz. t sıfırdan farklı olmalı.",
        };
      }

      steps.push("2) Hesaplanacak büyüklük: Güç P.");
      steps.push("   Formül: P = W / t.");
      const Pcalc = W / t;
      const Pr = round(Pcalc, precision);
      steps.push(`3) Hesap: P = ${W} / ${t} = ${Pcalc} (W).`);

      return buildResult({
        targetLabel: "Güç P",
        formula: "P = W / t",
        result: Pr,
        unit: "W",
        raw: Pcalc,
        steps,
        extras: {
          "İş / Enerji W": W,
          "Zaman t": t,
        },
      });
    }

    if (target === "W") {
      // İş hesapla -> P ve t lazım
      if (!isFinite(P) || !isFinite(t)) {
        return {
          hata: "İşi/enerjiyi hesaplamak için güç (P) ve zaman (t) değerlerini gir.",
        };
      }
      steps.push("2) Hesaplanacak büyüklük: İş / Enerji W.");
      steps.push("   Formül: W = P · t.");
      const Wcalc = P * t;
      const Wr = round(Wcalc, precision);
      steps.push(`3) Hesap: W = ${P} · ${t} = ${Wcalc} (J).`);

      const kWh = Wcalc / 3_600_000; // 1 kWh = 3.6e6 J
      const kWhRounded = round(kWh, Math.min(precision, 4));

      return buildResult({
        targetLabel: "İş / Enerji W",
        formula: "W = P · t",
        result: Wr,
        unit: "J",
        raw: Wcalc,
        steps,
        extras: {
          "Güç P": P,
          "Zaman t": t,
          "Enerji (yaklaşık) [kWh]": kWhRounded,
        },
      });
    }

    // target === "t"
    if (!isFinite(W) || !isFinite(P)) {
      return {
        hata: "Zamanı hesaplamak için iş/enerji (W) ve güç (P) değerlerini gir.",
      };
    }
    if (P === 0) {
      return {
        hata: "Güç P = 0 iken t = W/P tanımsız olur. P sıfırdan farklı olmalı.",
      };
    }

    steps.push("2) Hesaplanacak büyüklük: Zaman t.");
    steps.push("   Formül: t = W / P.");
    const tcalc = W / P;
    const tr = round(tcalc, precision);
    steps.push(`3) Hesap: t = ${W} / ${P} = ${tcalc} (s).`);

    const minutes = tcalc / 60;
    const hours = tcalc / 3600;

    return buildResult({
      targetLabel: "Zaman t",
      formula: "t = W / P",
      result: tr,
      unit: "s",
      raw: tcalc,
      steps,
      extras: {
        "İş / Enerji W": W,
        "Güç P": P,
        "Zaman (dakika)": round(minutes, Math.min(precision, 4)),
        "Zaman (saat)": round(hours, Math.min(precision, 4)),
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
    note: "Adımlar, P = W / t bağıntısından sonuç nasıl elde edildiğini gösterir.",
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
