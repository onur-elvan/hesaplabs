// src/registry/calculators/dik-ucgen-cozucu.js

export default {
  id: "dik-ucgen-cozucu",
  category: "Matematik",
  title: "Dik Üçgen Çözücü (Pisagor & Trigonometrik Oranlar)",
  createdAt: "2025-12-25",
  description:
    "Dik üçgende iki kenar veya bir kenar + açı vererek diğer kenarları, alanı, çevreyi ve trigonometrik oranları hesaplar.",
  seoTitle: "Dik Üçgen Hesaplama – Pisagor ve Trigonometrik Oranlar",

  seoText: `
Dik üçgen çözücü ile Pisagor bağıntısını ve temel trigonometrik oranları otomatik hesaplayabilirsin.

Kullanılan temel formüller:
- Pisagor: c² = a² + b² (c hipotenüs)
- sin(α) = karşı / hipotenüs
- cos(α) = komşu / hipotenüs
- tan(α) = karşı / komşu

Bu araç, verdiğin kenar ve açı bilgisine göre eksik kenarları, alanı, çevreyi ve trigonometrik oranları adım adım gösterir.
Sonuçlar eğitim ve kişisel kullanım içindir; sınav / ölçme için mutlaka kendin de kontrol et.
`.trim(),

  info: {
    title: "Dik Üçgen Nasıl Çözülür?",
    items: [
      "Pisagor teoremi: c² = a² + b²; c her zaman dik açının karşısındaki hipotenüstür.",
      "Bir dik kenar ve hipotenüs biliniyorsa: diğer dik kenar b = √(c² - a²).",
      "Bir dik kenar ve bu kenarın yaptığı açı biliniyorsa trigonometrik oranlar (sin, cos, tan) ile diğer kenarlar bulunabilir.",
      "Alan: (a · b) / 2, çevre: a + b + c olarak hesaplanır.",
    ],
    disclaimer:
      "Hesaplamalar yuvarlatılmıştır. Kritik mühendislik hesabı yerine geçmez.",
  },

  inputs: [
    {
      key: "mode",
      label: "Veri tipi",
      type: "select",
      default: "legs",
      options: [
        { value: "legs", label: "İki dik kenar → hipotenüs (Pisagor)" },
        {
          value: "leg_hyp",
          label: "Bir dik kenar + hipotenüs → diğer dik kenar",
        },
        {
          value: "leg_angle",
          label: "Bir dik kenar + açı → diğer kenar ve hipotenüs",
        },
      ],
    },
    {
      key: "a",
      label: "a dik kenarı",
      type: "number",
      default: "",
      placeholder: "Örn: 3",
    },
    {
      key: "b",
      label: "b dik kenarı",
      type: "number",
      default: "",
      placeholder: "Örn: 4",
    },
    {
      key: "c",
      label: "c hipotenüs",
      type: "number",
      default: "",
      placeholder: "Örn: 5",
    },
    {
      key: "alphaDeg",
      label: "α açısı (derece, 0°–90° arası)",
      type: "number",
      default: "",
      placeholder: "Örn: 30",
    },
  ],

  compute(values) {
    const mode = values.mode || "legs";

    const aIn = toNum(values.a);
    const bIn = toNum(values.b);
    const cIn = toNum(values.c);
    const alphaIn = toNum(values.alphaDeg);

    let a = null;
    let b = null;
    let c = null;
    let alphaDeg = null;

    // --- Yardımcılar ---
    function ensurePos(x, name) {
      if (!(x > 0)) {
        throw new Error(`${name} pozitif olmalı.`);
      }
    }

    function checkRightTriangle(aa, bb, cc) {
      // c hipotenüs varsayımıyla, yaklaşık kontrol
      const left = aa * aa + bb * bb;
      const right = cc * cc;
      if (left <= 0 || right <= 0) return;
      const relErr = Math.abs(left - right) / right;
      if (relErr > 0.02) {
        // %2 hata payından büyükse uyarı
        return `Verilen kenarlar tam dik üçgen oluşturmuyor olabilir (c² ≈ a² + b² koşulu zayıf).`;
      }
      return "";
    }

    // --- Hesaplama ---
    try {
      if (mode === "legs") {
        // a, b → c
        ensurePos(aIn, "a");
        ensurePos(bIn, "b");
        a = aIn;
        b = bIn;
        c = Math.sqrt(a * a + b * b);
      } else if (mode === "leg_hyp") {
        // bir dik kenar + hipotenüs
        if (aIn > 0 && cIn > 0) {
          ensurePos(aIn, "a");
          ensurePos(cIn, "c");
          if (cIn <= aIn)
            throw new Error("c > a olmalı (hipotenüs en uzun kenardır).");
          a = aIn;
          c = cIn;
          b = Math.sqrt(c * c - a * a);
        } else if (bIn > 0 && cIn > 0) {
          ensurePos(bIn, "b");
          ensurePos(cIn, "c");
          if (cIn <= bIn)
            throw new Error("c > b olmalı (hipotenüs en uzun kenardır).");
          b = bIn;
          c = cIn;
          a = Math.sqrt(c * c - b * b);
        } else {
          throw new Error(
            "Bu mod için (a, c) veya (b, c) ikilisinden biri pozitif olmalı."
          );
        }
      } else if (mode === "leg_angle") {
        // bir dik kenar + açı
        if (!(alphaIn > 0 && alphaIn < 90)) {
          throw new Error("α açısı 0° ile 90° arasında olmalı.");
        }
        alphaDeg = alphaIn;
        const rad = (alphaDeg * Math.PI) / 180;

        if (aIn > 0) {
          // a = karşı kenar, α bu kenarın karşısı varsayalım
          ensurePos(aIn, "a");
          a = aIn;
          c = a / Math.sin(rad);
          b = Math.sqrt(Math.max(c * c - a * a, 0));
        } else if (bIn > 0) {
          // b = komşu kenar
          ensurePos(bIn, "b");
          b = bIn;
          c = b / Math.cos(rad);
          a = Math.sqrt(Math.max(c * c - b * b, 0));
        } else {
          throw new Error(
            "Bu mod için a veya b kenarından en az biri pozitif olmalı."
          );
        }
      } else {
        throw new Error("Bilinmeyen veri tipi.");
      }
    } catch (err) {
      return { hata: err.message };
    }

    // Nihai değerleri kontrol et
    if (!(a > 0 && b > 0 && c > 0)) {
      return {
        hata: "Geçerli bir dik üçgen elde edilemedi. Girişleri kontrol et.",
      };
    }

    // Açıyı da mümkünse kenarlardan hesapla (α: a kenarının karşısındaki açı)
    if (!(alphaDeg > 0)) {
      const sinA = a / c;
      if (sinA > 0 && sinA < 1) {
        alphaDeg = (Math.asin(sinA) * 180) / Math.PI;
      }
    }

    // Trig oranları (α açısına göre)
    let sinA = null,
      cosA = null,
      tanA = null;
    if (alphaDeg > 0 && alphaDeg < 90) {
      const rad = (alphaDeg * Math.PI) / 180;
      sinA = Math.sin(rad);
      cosA = Math.cos(rad);
      tanA = Math.tan(rad);
    } else {
      // açıyı kenarlardan yaklaştır
      sinA = a / c;
      cosA = b / c;
      tanA = a / b;
    }

    const area = 0.5 * a * b;
    const perimeter = a + b + c;

    const warning = checkRightTriangle(a, b, c);

    return {
      "a dik kenarı": round(a),
      "b dik kenarı": round(b),
      "c hipotenüs": round(c),
      "Alan (½·a·b)": round(area),
      "Çevre (a + b + c)": round(perimeter),
      "α açısı (derece)": alphaDeg ? round(alphaDeg) : "Hesaplanamadı",
      "sin(α)": round(sinA),
      "cos(α)": round(cosA),
      "tan(α)": round(tanA),
      ...(warning ? { Uyarı: warning } : {}),

      __table: {
        headers: ["Adım", "Açıklama"],
        rows: [
          [
            "1",
            mode === "legs"
              ? "Pisagor: c = √(a² + b²) formülü ile hipotenüs hesaplandı."
              : mode === "leg_hyp"
              ? "Pisagor: bilinmeyen dik kenar b = √(c² - a²) veya a = √(c² - b²) ile bulundu."
              : "Trigonometrik oranlar kullanılarak (sin, cos) diğer kenarlar ve hipotenüs hesaplandı.",
          ],
          ["2", "Alan = ½·a·b, çevre = a + b + c olarak hesaplandı."],
          [
            "3",
            "Açı α için sin(α) = a/c, cos(α) = b/c, tan(α) = a/b oranları listelendi.",
          ],
        ],
        note: "Dik üçgende c her zaman hipotenüstür. Sonuçlar 2 ondalık basamağa yuvarlanmıştır.",
      },
    };
  },
};

// Küçük yardımcılar (dosya içinde lokal)
function toNum(v) {
  if (v === null || v === undefined || v === "") return NaN;
  return Number(String(v).replace(",", "."));
}
function round(x) {
  if (!Number.isFinite(x)) return x;
  return Number(x.toFixed(2));
}
