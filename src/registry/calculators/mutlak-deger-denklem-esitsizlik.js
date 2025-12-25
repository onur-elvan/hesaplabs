// src/registry/calculators/mutlak-deger-denklem-esitsizlik.js

export default {
  id: "mutlak-deger-denklem-esitsizlik",
  category: "Matematik",
  title: "Mutlak Değer Denklem / Eşitsizlik",
  createdAt: "2025-12-25",
  description:
    "|a·x + b| = c ve |a·x + b| ≤, <, ≥, > c türü soruları adım adım çözer.",
  seoTitle:
    "Mutlak Değer Denklem ve Eşitsizlik Çözücü – |ax + b| = c, |ax + b| ≤ c",

  seoText: `
Bu araç, mutlak değerli temel denklemleri ve birinci dereceden eşitsizlikleri çözer.

Genel form:
- Denklem: |a·x + b| = c
- Eşitsizlik: |a·x + b| ≤ c, |a·x + b| < c, |a·x + b| ≥ c, |a·x + b| > c

Temel kurallar:
- |t| = c denkleminde c < 0 ise çözüm yoktur (boş küme).
- |t| = c, c ≥ 0 için t = c veya t = -c olarak iki denklem yazılır.
- |t| ≤ c için -c ≤ t ≤ c (kapalı aralık)
- |t| < c için -c < t < c (açık aralık)
- |t| ≥ c için t ≤ -c veya t ≥ c (iki yarı aralık)
- |t| > c için t < -c veya t > c

Burada t = a·x + b alınarak, x için çözüm adım adım gösterilir.
`.trim(),

  info: {
    title: "Mutlak Değerde Denklem ve Eşitsizlik Mantığı",
    items: [
      "|t| ifadesi, t sayısının 0'a olan uzaklığını gösterir; sonuç her zaman ≥ 0'dır.",
      "|t| = c denkleminde, c negatifse çözüm yoktur (boş küme).",
      "|t| = c, c ≥ 0 ise t = c veya t = -c olarak iki ayrı denklem yazılır.",
      "|t| ≤ c için t aralığa sıkıştırılır: -c ≤ t ≤ c.",
      "Eşitsizliklerde a katsayısına göre bölme yapılırken, a < 0 ise işaret yönü değişir.",
    ],
    disclaimer:
      "Bu araç, birinci dereceden mutlak değer denklemleri ve eşitsizlikleri için tasarlanmıştır. Daha karmaşık ifadeler için adımları dikkatlice incele.",
  },

  inputs: [
    {
      key: "mode",
      label: "Tür",
      type: "select",
      default: "denklem",
      options: [
        { value: "denklem", label: "Denklem: |a·x + b| = c" },
        { value: "esitsizlik", label: "Eşitsizlik: |a·x + b| (… ) c" },
      ],
    },
    {
      key: "a",
      label: "a katsayısı",
      type: "number",
      default: 1,
      placeholder: "Örn: 1, -2...",
    },
    {
      key: "b",
      label: "b sabiti",
      type: "number",
      default: 0,
      placeholder: "Örn: 3, -5...",
    },
    {
      key: "c",
      label: "c değeri",
      type: "number",
      default: 4,
      placeholder: "Örn: 4, 10...",
    },
    {
      key: "ineqType",
      label: "Eşitsizlik türü (sadece eşitsizlik modunda)",
      type: "select",
      default: "<=",
      options: [
        { value: "<=", label: "|a·x + b| ≤ c" },
        { value: "<", label: "|a·x + b| < c" },
        { value: ">=", label: "|a·x + b| ≥ c" },
        { value: ">", label: "|a·x + b| > c" },
      ],
    },
    {
      key: "precision",
      label: "Ondalık basamak sayısı",
      type: "number",
      default: 4,
      advanced: true,
      placeholder: "Örn: 3, 4, 6",
    },
  ],

  compute(values) {
    const mode = values.mode || "denklem";
    const a = num(values.a);
    const b = num(values.b);
    const c = num(values.c);
    const ineqType = values.ineqType || "<=";

    let precision = Math.floor(num(values.precision));
    if (!Number.isFinite(precision) || precision < 0) precision = 4;
    if (precision > 10) precision = 10;

    if (!isFinite(a)) return { hata: "a katsayısı geçerli bir sayı olmalı." };
    if (!isFinite(b)) return { hata: "b sabiti geçerli bir sayı olmalı." };
    if (!isFinite(c)) return { hata: "c değeri geçerli bir sayı olmalı." };

    const steps = [];
    const absExpr = `|${a}·x + ${b}|`;
    const signOfA = a > 0 ? "pozitif" : a < 0 ? "negatif" : "sıfır";

    if (mode === "denklem") {
      // ------------------------ DENKLEM: |a·x + b| = c ------------------------
      steps.push(`1) Verilen denklem: ${absExpr} = ${c}.`);
      if (c < 0) {
        steps.push(
          "2) Mutlak değer her zaman 0 veya pozitif olduğundan, c < 0 ise çözüm yoktur."
        );
        return buildResult({
          typeLabel: "Denklem: |a·x + b| = c",
          absExpr,
          equationStr: `${absExpr} = ${c}`,
          solutionText: "Çözüm kümesi: ∅ (boş küme)",
          solutionSymbolic: "∅",
          extra: { steps },
        });
      }

      if (a === 0) {
        // |b| = c durumu
        const left = Math.abs(b);
        steps.push(`2) a = 0 olduğundan, ifade |a·x + b| = |${b}| = ${left}.`);
        if (approxEqual(left, c)) {
          steps.push(
            `3) |${b}| = ${left} = ${c} olduğundan, her x için denklem sağlanır.`
          );
          return buildResult({
            typeLabel: "Denklem: |a·x + b| = c",
            absExpr,
            equationStr: `${absExpr} = ${c}`,
            solutionText:
              "Çözüm kümesi: Tüm reel sayılar (ℝ). Denklem x'e bağlı değildir.",
            solutionSymbolic: "ℝ",
            extra: { steps },
          });
        } else {
          steps.push(
            `3) |${b}| = ${left} ≠ ${c} olduğundan, hiçbir x için denklem sağlanmaz.`
          );
          return buildResult({
            typeLabel: "Denklem: |a·x + b| = c",
            absExpr,
            equationStr: `${absExpr} = ${c}`,
            solutionText: "Çözüm kümesi: ∅ (boş küme).",
            solutionSymbolic: "∅",
            extra: { steps },
          });
        }
      }

      // a ≠ 0, c ≥ 0
      steps.push("2) c ≥ 0 ve a ≠ 0 olduğundan, iki denklem yazılır:");
      steps.push(`   (i)   a·x + b =  c  →  ${a}·x + ${b} = ${c}`);
      steps.push(`   (ii)  a·x + b = -c  →  ${a}·x + ${b} = ${-c}`);

      const x1 = (c - b) / a;
      const x2 = (-c - b) / a;

      steps.push(
        `3) (i) için: ${a}·x = ${c} - ${b}  →  x = ( ${c} - ${b} ) / ${a} = ${x1}.`
      );
      steps.push(
        `4) (ii) için: ${a}·x = ${-c} - ${b}  →  x = ( ${-c} - ${b} ) / ${a} = ${x2}.`
      );

      const x1r = round(x1, precision);
      const x2r = round(x2, precision);

      let solutionText;
      let solutionSymbolic;
      if (approxEqual(x1, x2)) {
        solutionText = `Tek çözüm: x ≈ ${x1r}. (c = 0 olduğunda iki çözüm çakışır.)`;
        solutionSymbolic = `{ ${x1r} }`;
      } else {
        solutionText = `İki çözüm: x₁ ≈ ${x1r}, x₂ ≈ ${x2r}.`;
        solutionSymbolic = `{ ${x1r}, ${x2r} }`;
      }

      return buildResult({
        typeLabel: "Denklem: |a·x + b| = c",
        absExpr,
        equationStr: `${absExpr} = ${c}`,
        solutionText,
        solutionSymbolic,
        extra: {
          steps,
          extraFields: {
            "x₁ (tam)": x1,
            "x₂ (tam)": x2,
            [`x₁ (≈ ${precision} ondalık)`]: x1r,
            [`x₂ (≈ ${precision} ondalık)`]: x2r,
          },
        },
      });
    }

    // ------------------------ EŞİTSİZLİK: |a·x + b| (… ) c ------------------------
    const ineqStr = `|${a}·x + ${b}| ${ineqType} ${c}`;
    steps.push(`1) Verilen eşitsizlik: ${ineqStr}.`);

    // c < 0 durumu
    if (c < 0) {
      steps.push(
        "2) |a·x + b| ≥ 0 olduğundan, c < 0 iken bazı eşitsizliklerde çözüm olmayabilir veya tüm reel sayılar olabilir."
      );

      if (ineqType === "<=" || ineqType === "<") {
        steps.push(
          `3) |t| ≤ c veya |t| < c için c < 0 olduğunda, hiçbir t gerçek sayısı bu koşulu sağlayamaz.`
        );
        return buildResult({
          typeLabel: `Eşitsizlik: ${ineqStr}`,
          absExpr,
          equationStr: ineqStr,
          solutionText: "Çözüm kümesi: ∅ (boş küme).",
          solutionSymbolic: "∅",
          extra: { steps },
        });
      } else {
        steps.push(
          `3) |t| ≥ c veya |t| > c için c < 0 olduğunda, her gerçek t bu koşulu sağlar (|t| her zaman ≥ 0).`
        );
        return buildResult({
          typeLabel: `Eşitsizlik: ${ineqStr}`,
          absExpr,
          equationStr: ineqStr,
          solutionText:
            "Çözüm kümesi: Tüm reel sayılar (ℝ). Eşitsizlik her x için doğrudur.",
          solutionSymbolic: "ℝ",
          extra: { steps },
        });
      }
    }

    // a = 0 ise: ifade |b| sabit
    if (a === 0) {
      const val = Math.abs(b);
      steps.push(`2) a = 0 olduğundan, |a·x + b| = |${b}| = ${val} sabittir.`);
      steps.push(
        `3) Eşitsizlik, |${b}| ${ineqType} ${c} yani ${val} ${ineqType} ${c} haline gelir.`
      );

      const cond = compare(val, c, ineqType);
      if (cond) {
        steps.push(
          "4) Bu koşul sağlandığı için eşitsizlik her x için doğrudur (x'e bağlı değil)."
        );
        return buildResult({
          typeLabel: `Eşitsizlik: ${ineqStr}`,
          absExpr,
          equationStr: ineqStr,
          solutionText:
            "Çözüm kümesi: Tüm reel sayılar (ℝ). Eşitsizlik x'e bağlı değildir.",
          solutionSymbolic: "ℝ",
          extra: { steps },
        });
      } else {
        steps.push(
          "4) Bu koşul sağlanmadığı için, hiçbir x değeri eşitsizliği sağlayamaz."
        );
        return buildResult({
          typeLabel: `Eşitsizlik: ${ineqStr}`,
          absExpr,
          equationStr: ineqStr,
          solutionText: "Çözüm kümesi: ∅ (boş küme).",
          solutionSymbolic: "∅",
          extra: { steps },
        });
      }
    }

    // a ≠ 0, c ≥ 0
    steps.push(
      `2) a ≠ 0 ve c ≥ 0 olduğundan, t = a·x + b alınıp mutlak değer tanımına göre parçalanır. (a ${signOfA})`
    );

    let intervalText = "";
    let intervalSymbolic = "";
    let extraFields = {};

    if (ineqType === "<=" || ineqType === "<") {
      // -c ≤ a·x + b ≤ c (veya <)
      const inclusive = ineqType === "<=";
      steps.push(
        `3) |t| ${ineqType} c → -c ${ineqType} t ${ineqType} c, burada t = a·x + b.`
      );
      steps.push(`   Yani: -${c} ${ineqType} ${a}·x + ${b} ${ineqType} ${c}.`);

      // alt ve üst sınırlar
      const left = (-c - b) / a;
      const right = (c - b) / a;

      let xMin = Math.min(left, right);
      let xMax = Math.max(left, right);

      const xMinR = round(xMin, precision);
      const xMaxR = round(xMax, precision);

      steps.push(
        `4) a ${signOfA} olduğu için, eşitsizlikler çözüldüğünde x ${
          a > 0 ? "artış yönü korunur." : "bölme sırasında yön değişir."
        }`
      );
      steps.push(`   Alt sınır: x ≈ ${xMinR}, Üst sınır: x ≈ ${xMaxR}.`);

      intervalText = inclusive
        ? `Kapalı aralık: x, yaklaşık olarak [${xMinR}, ${xMaxR}] aralığındadır.`
        : `Açık aralık: x, yaklaşık olarak (${xMinR}, ${xMaxR}) aralığındadır.`;

      intervalSymbolic = inclusive
        ? `[${xMinR}, ${xMaxR}]`
        : `(${xMinR}, ${xMaxR})`;

      extraFields = {
        "Alt sınır (tam)": xMin,
        "Üst sınır (tam)": xMax,
        [`Alt sınır (≈ ${precision} ondalık)`]: xMinR,
        [`Üst sınır (≈ ${precision} ondalık)`]: xMaxR,
      };
    } else {
      // >= veya >  →  t ≤ -c veya t ≥ c
      const strict = ineqType === ">";
      steps.push(
        `3) |t| ${ineqType} c → t ${ineqType} c veya t ${ineqType} -c kombinasyonu yerine; standart dönüşüm:`
      );
      steps.push(
        `   |t| ≥ c → t ≤ -c veya t ≥ c,  |t| > c → t < -c veya t > c.`
      );
      steps.push(`   Burada t = a·x + b.`);

      // t ≤ -c veya t ≥ c (veya <, >)
      // a·x + b ≤ -c  veya  a·x + b ≥ c
      // x sınırları:
      const leftBorder = (-c - b) / a; // eşitsizliğe göre yön değişebilir ama sınırlar nokta olarak bu
      const rightBorder = (c - b) / a;

      const x1 = Math.min(leftBorder, rightBorder);
      const x2 = Math.max(leftBorder, rightBorder);

      const x1R = round(x1, precision);
      const x2R = round(x2, precision);

      steps.push(
        `4) Sınır noktaları: x ≈ ${x1R} ve x ≈ ${x2R} elde edilir (eşik değerler).`
      );

      intervalText = strict
        ? `x, yaklaşık olarak (-∞, ${x1R}) ∪ (${x2R}, ∞) aralığındadır.`
        : `x, yaklaşık olarak (-∞, ${x1R}] ∪ [${x2R}, ∞) aralığındadır.`;

      intervalSymbolic = strict
        ? `(-∞, ${x1R}) ∪ (${x2R}, ∞)`
        : `(-∞, ${x1R}] ∪ [${x2R}, ∞)`;

      extraFields = {
        "Sol sınır (tam)": x1,
        "Sağ sınır (tam)": x2,
        [`Sol sınır (≈ ${precision} ondalık)`]: x1R,
        [`Sağ sınır (≈ ${precision} ondalık)`]: x2R,
      };
    }

    return buildResult({
      typeLabel: `Eşitsizlik: ${ineqStr}`,
      absExpr,
      equationStr: ineqStr,
      solutionText: intervalText,
      solutionSymbolic: intervalSymbolic,
      extra: { steps, extraFields },
    });
  },
};

// ---------------- Yardımcılar ----------------
function num(x) {
  if (x === null || x === undefined || x === "") return NaN;
  return Number(String(x).replace(",", "."));
}

function round(x, p) {
  if (!Number.isFinite(x)) return x;
  const f = Math.pow(10, p);
  return Math.round(x * f) / f;
}

function approxEqual(a, b, eps = 1e-9) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  return Math.abs(a - b) <= eps;
}

function compare(left, right, op) {
  switch (op) {
    case "<=":
      return left <= right;
    case "<":
      return left < right;
    case ">=":
      return left >= right;
    case ">":
      return left > right;
    default:
      return false;
  }
}

function buildResult({
  typeLabel,
  absExpr,
  equationStr,
  solutionText,
  solutionSymbolic,
  extra = {},
}) {
  const { steps = [], extraFields = {} } = extra;

  const base = {
    "İşlem tipi": typeLabel,
    "Mutlak değer ifadesi": absExpr,
    "Denklem / Eşitsizlik": equationStr,
    "Çözüm kümesi (sözlü)": solutionText,
    "Çözüm kümesi (sembolik)": solutionSymbolic,
  };

  const table =
    steps.length > 0
      ? {
          headers: ["Adım", "Açıklama"],
          rows: steps.map((s, i) => [i + 1, s]),
          note: "Her adım, mutlak değerli denklem/ eşitsizliğin nasıl çözüldüğünü gösterir.",
        }
      : null;

  return {
    ...base,
    ...extraFields,
    ...(table ? { __table: table } : {}),
  };
}
