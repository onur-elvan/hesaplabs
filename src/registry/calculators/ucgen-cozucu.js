// src/registry/calculators/ucgen-cozucu.js

// Hangi modda hangi alanlar aktif?
export const triangleModeFields = {
  // 3 kenar
  SSS: ["a", "b", "c"],
  // 2 kenar + aradaki açı A (b, c, A)
  SAS: ["b", "c", "A"],
  // 2 açı + aradaki kenar b (A, C, b)
  ASA: ["A", "C", "b"],
  // 2 açı + 1 kenar (A, B, c)
  AAS: ["A", "B", "c"],
};

export default {
  id: "ucgen-cozucu",
  category: "Matematik",
  title: "Üçgen Çözücü (Kenar / Açı)",
  createdAt: "2025-12-24",
  description:
    "3 kenar (SSS), 2 kenar + aradaki açı (SAS), 2 açı + aradaki kenar (ASA) veya 2 açı + 1 kenar (AAS) verildiğinde tüm üçgeni çözer.",
  seoTitle:
    "Üçgen Çözücü – SSS, SAS, ASA, AAS ile Kenar ve Açı Hesaplama | Hesaplabs",
  seoText: `
Üçgen çözücü ile elindeki verilere göre (3 kenar, 2 kenar + aradaki açı, 2 açı + aradaki kenar ve 2 açı + 1 kenar) 
üçgenin tüm kenarlarını, açılarını, alanını ve çevresini hesaplayabilirsin. 
Her çözümde kosinüs ve sinüs teoremleri kullanılır ve geçersiz veri girişlerinde uyarı gösterilir.
`.trim(),

  // UI'ye yardımcı meta bilgi (disabled input mantığı için)
  modeFields: triangleModeFields,

  inputs: [
    {
      key: "mode",
      label: "Veri tipi",
      type: "select",
      default: "SSS",
      options: [
        { value: "SSS", label: "SSS – 3 kenar (a, b, c)" },
        { value: "SAS", label: "SAS – 2 kenar + aradaki açı A (b, c, A)" },
        { value: "ASA", label: "ASA – 2 açı + aradaki kenar b (A, C, b)" },
        { value: "AAS", label: "AAS – 2 açı + 1 kenar (A, B, c)" },
      ],
    },

    // Kenarlar
    {
      key: "a",
      label: "a kenarı (A açısının karşısı)",
      type: "number",
      placeholder: "Örn: 5",
    },
    {
      key: "b",
      label: "b kenarı (B açısının karşısı)",
      type: "number",
      placeholder: "Örn: 6",
    },
    {
      key: "c",
      label: "c kenarı (C açısının karşısı)",
      type: "number",
      placeholder: "Örn: 7",
    },

    // Açılar
    {
      key: "A",
      label: "A açısı (°)",
      type: "number",
      placeholder: "Örn: 40",
    },
    {
      key: "B",
      label: "B açısı (°)",
      type: "number",
      placeholder: "Örn: 60",
    },
    {
      key: "C",
      label: "C açısı (°)",
      type: "number",
      placeholder: "Örn: 80",
    },
  ],

  compute(v) {
    const mode = v.mode || "SSS";

    const a = num(v.a);
    const b = num(v.b);
    const c = num(v.c);
    const Adeg = num(v.A);
    const Bdeg = num(v.B);
    const Cdeg = num(v.C);

    let res;

    if (mode === "SSS") {
      // 3 kenar: a, b, c
      if (!isPos(a) || !isPos(b) || !isPos(c)) {
        return {
          hata: "SSS için a, b ve c kenarlarını pozitif girmen gerekir.",
        };
      }
      if (!triangleInequality(a, b, c)) {
        return {
          hata: "Bu kenarlarla üçgen oluşmaz (üçgen eşitsizliği sağlanmıyor).",
        };
      }

      // Kosinüs teoremi ile açıları bul
      const A = toDegSafe(
        Math.acos(clamp((b * b + c * c - a * a) / (2 * b * c), -1, 1))
      );
      const B = toDegSafe(
        Math.acos(clamp((a * a + c * c - b * b) / (2 * a * c), -1, 1))
      );
      const C = 180 - A - B;

      res = summarizeTriangle(a, b, c, A, B, C, "SSS – 3 kenar");
    } else if (mode === "SAS") {
      // 2 kenar + aradaki açı A (b, c, A)
      if (!isPos(b) || !isPos(c) || !isAngle(Adeg)) {
        return {
          hata: "SAS için b, c kenarları ve aradaki açı A (°) pozitif olmalıdır.",
        };
      }

      const A = Adeg;
      const Arad = toRad(A);

      // a² = b² + c² - 2bc cos A
      const a2 = b * b + c * c - 2 * b * c * Math.cos(Arad);
      if (a2 <= 0) {
        return { hata: "Bu değerlerle geçerli bir üçgen oluşmuyor." };
      }
      const aNew = Math.sqrt(a2);

      // Sinüs teoremi ile B ve C
      const sinA = Math.sin(Arad);
      const k = sinA / aNew; // sinA / a
      const sinB = clamp(k * b, -1, 1);
      const sinC = clamp(k * c, -1, 1);

      const B = toDegSafe(Math.asin(sinB));
      const C = 180 - A - B;

      res = summarizeTriangle(
        aNew,
        b,
        c,
        A,
        B,
        C,
        "SAS – 2 kenar + aradaki açı A (b, c, A)"
      );
    } else if (mode === "ASA") {
      // 2 açı + aradaki kenar b (A, C, b)
      if (!isAngle(Adeg) || !isAngle(Cdeg) || !isPos(b)) {
        return {
          hata: "ASA için A, C açıları (°) ve aradaki kenar b pozitif olmalıdır.",
        };
      }
      if (Adeg + Cdeg >= 180) {
        return {
          hata: "A + C < 180° olmalı (üçgenin iç açıları toplamı 180°).",
        };
      }

      const A = Adeg;
      const C = Cdeg;
      const B = 180 - A - C;

      const Arad = toRad(A);
      const Brad = toRad(B);
      const Crad = toRad(C);

      // Sinüs teoremi: a/sinA = b/sinB = c/sinC
      const aNew = (b * Math.sin(Arad)) / Math.sin(Brad);
      const cNew = (b * Math.sin(Crad)) / Math.sin(Brad);

      res = summarizeTriangle(
        aNew,
        b,
        cNew,
        A,
        B,
        C,
        "ASA – 2 açı + aradaki kenar b (A, C, b)"
      );
    } else if (mode === "AAS") {
      // 2 açı + 1 kenar (A, B, c)
      if (!isAngle(Adeg) || !isAngle(Bdeg) || !isPos(c)) {
        return {
          hata: "AAS için A, B açıları (°) ve c kenarı pozitif olmalıdır.",
        };
      }
      if (Adeg + Bdeg >= 180) {
        return {
          hata: "A + B < 180° olmalı (üçgenin iç açıları toplamı 180°).",
        };
      }

      const A = Adeg;
      const B = Bdeg;
      const C = 180 - A - B;

      const Arad = toRad(A);
      const Brad = toRad(B);
      const Crad = toRad(C);

      // Sinüs teoremi
      const aNew = (c * Math.sin(Arad)) / Math.sin(Crad);
      const bNew = (c * Math.sin(Brad)) / Math.sin(Crad);

      res = summarizeTriangle(
        aNew,
        bNew,
        c,
        A,
        B,
        C,
        "AAS – 2 açı + 1 kenar (A, B, c)"
      );
    } else {
      return { hata: "Geçersiz veri tipi (mode)." };
    }

    return res;
  },
};

/* ----------------- Helper fonksiyonlar ------------------ */

function num(x) {
  if (x === null || x === undefined || x === "") return NaN;
  return Number(String(x).replace(",", "."));
}

function isPos(x) {
  return Number.isFinite(x) && x > 0;
}

function isAngle(x) {
  return Number.isFinite(x) && x > 0 && x < 180;
}

function toRad(d) {
  return (d * Math.PI) / 180;
}

function toDegSafe(r) {
  return (r * 180) / Math.PI;
}

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function triangleInequality(a, b, c) {
  return a + b > c && a + c > b && b + c > a;
}

// Ortak özet: kenarlar, açılar, çevre, alan, yükseklikler
function summarizeTriangle(a, b, c, A, B, C, modeLabel) {
  if (!triangleInequality(a, b, c)) {
    return { hata: "Hesaplanan kenarlarla üçgen eşitsizliği sağlanmıyor." };
  }

  const p = a + b + c;
  const s = p / 2;
  const area = Math.sqrt(Math.max(s * (s - a) * (s - b) * (s - c), 0));

  const ha = (2 * area) / a;
  const hb = (2 * area) / b;
  const hc = (2 * area) / c;

  return {
    "Kullanılan veri tipi": modeLabel,

    "a kenarı": round(a),
    "b kenarı": round(b),
    "c kenarı": round(c),

    "A açısı (°)": round(A),
    "B açısı (°)": round(B),
    "C açısı (°)": round(C),

    Çevre: round(p),
    Alan: round(area),

    "h_a (a'ya ait yükseklik)": round(ha),
    "h_b (b'ye ait yükseklik)": round(hb),
    "h_c (c'ye ait yükseklik)": round(hc),

    not: "Hesaplamalarda kosinüs ve sinüs teoremleri kullanılır. Açılar derece cinsindendir.",
  };
}

function round(x) {
  return Number.isFinite(x) ? Number(x.toFixed(3)) : x;
}
