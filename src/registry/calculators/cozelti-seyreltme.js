export default {
  id: "cozelti-seyreltme",
  category: "Kimya",
  title: "Çözelti Seyreltme (M₁·V₁ = M₂·V₂)",
  createdAt: "2025-12-25",
  description:
    "Stok (derişik) bir çözeltiden, istenen derişim ve hacimde seyreltilmiş çözelti hazırlamak için gereken stok hacmini ve eklenecek su miktarını hesaplar.",
  seoTitle: "Çözelti Seyreltme Hesaplama – M1V1 = M2V2",
  seoText: `
Çözelti seyreltme, derişik (stok) bir çözeltinin üzerine çözücü (genellikle su) ekleyerek derişimini düşürme işlemidir.
Bu işlemde çözünen madde miktarı değişmez, sadece hacim artar. Bu yüzden M1·V1 = M2·V2 (veya C1·V1 = C2·V2) bağıntısı kullanılır.

Bu araç ile:
- Elindeki stok çözeltinin derişimini (M1) ve hedef derişimi (M2) girersin.
- Hazırlamak istediğin son hacmi (V2) belirlersin.
- Araç, stoktan kaç mL alman gerektiğini (V1) ve üzerine ne kadar çözücü (su) ekleyeceğini hesaplar.

Notlar:
- Hacim birimlerini tutarlı kullan (hepsi mL veya hepsi L olmalı).
- Hedef derişim (M2), stok derişimden (M1) büyük olamaz; seyreltme işlemi daha seyrek çözelti hazırlar.
- Derişim birimi mol/L, g/L veya % (w/v) olabilir; önemli olan giriş ve çıkışta aynı birimi kullanmandır.
`.trim(),

  info: {
    title: "Çözelti Seyreltme Ne İşe Yarar?",
    items: [
      "Labaratuvarda derişik stok çözeltilerden hızlıca çalışma çözeltileri hazırlamayı sağlar.",
      "M1·V1 = M2·V2 bağıntısında çözünen madde miktarı (n = M·V) sabit tutulur.",
      "Hacim birimlerinin (mL veya L) tutarlı olması, derişim biriminin giriş–çıkışta aynı olması gerekir.",
      "Hedef derişimin stok derişimden büyük olması, seyreltme değil deriştirme anlamına gelir; bu durumda işlem geçersizdir.",
    ],
    disclaimer:
      "Bu hesaplama eğitim ve laboratuvar planlama amaçlıdır. Gerçek deneylerde hassas ölçümler için balonjoje, pipet, büret gibi uygun cam malzemeler kullanılmalıdır.",
  },

  inputs: [
    {
      key: "c1",
      label: "Stok derişim C₁",
      type: "number",
      placeholder: "Örn: 1 (M veya %)",
      default: 1,
    },
    {
      key: "c2",
      label: "Hedef derişim C₂",
      type: "number",
      placeholder: "Örn: 0.1 (M veya %)",
      default: 0.1,
    },
    {
      key: "v2",
      label: "Hedef hacim V₂ (mL)",
      type: "number",
      placeholder: "Örn: 250",
      default: 250,
    },
    {
      key: "concUnit",
      label: "Derişim birimi",
      type: "select",
      default: "M",
      advanced: true,
      options: [
        { label: "mol/L (M)", value: "M" },
        { label: "% (w/v)", value: "percent" },
        { label: "g/L", value: "gL" },
      ],
    },
    {
      key: "volUnit",
      label: "Hacim birimi",
      type: "select",
      default: "mL",
      advanced: true,
      options: [
        { label: "mL", value: "mL" },
        { label: "L", value: "L" },
      ],
    },
  ],

  compute(values) {
    const c1 = num(values.c1);
    const c2 = num(values.c2);
    const v2 = num(values.v2);
    const concUnit = values.concUnit || "M";
    const volUnit = values.volUnit || "mL";

    // Temel kontroller
    if (!isFinite(c1) || c1 <= 0) {
      return { hata: "Stok derişim (C₁) pozitif bir sayı olmalıdır." };
    }
    if (!isFinite(c2) || c2 <= 0) {
      return { hata: "Hedef derişim (C₂) pozitif bir sayı olmalıdır." };
    }
    if (!isFinite(v2) || v2 <= 0) {
      return { hata: "Hedef hacim (V₂) pozitif bir sayı olmalıdır." };
    }

    // Seyreltme mantığı: C2, C1'den büyük olamaz
    if (c2 > c1) {
      return {
        hata: "Hedef derişim (C₂), stok derişimden (C₁) büyük olamaz. Bu işlem seyreltme değil, deriştirme olur.",
      };
    }

    // M1·V1 = M2·V2  =>  V1 = (M2·V2) / M1
    const v1 = (c2 * v2) / c1;
    const water = v2 - v1;

    const v1Rounded = round2(v1);
    const waterRounded = round2(water);
    const dilutionFactor = c1 / c2; // seyreltme katsayısı (ör: 10 kat)

    // Açıklama metni
    const explanation = [
      "Formül: C₁·V₁ = C₂·V₂ (çözünen madde miktarı sabit tutulur).",
      `Gerekli stok hacmi: V₁ = (C₂·V₂) / C₁ = (${c2} × ${v2}) / ${c1} ≈ ${v1Rounded} ${volUnit}.`,
      `Eklenecek çözücü (su) hacmi: V_su = V₂ − V₁ = ${v2} − ${v1Rounded} ≈ ${waterRounded} ${volUnit}.`,
      `Seyreltme katsayısı: C₁ / C₂ ≈ ${round2(
        dilutionFactor
      )} (yaklaşık ${round2(dilutionFactor)} kat seyreltme).`,
    ].join("\n");

    return {
      "Gerekli stok hacmi V₁": v1Rounded,
      "Eklenecek çözücü (su) hacmi": waterRounded,
      "Stok derişim C₁": c1,
      "Hedef derişim C₂": c2,
      "Hedef hacim V₂": v2,
      "Seyreltme katsayısı (C₁ / C₂)": round2(dilutionFactor),
      "Derişim birimi":
        concUnit === "M"
          ? "mol/L (M)"
          : concUnit === "percent"
          ? "% (w/v)"
          : "g/L",
      "Hacim birimi": volUnit,
      Açıklama: explanation,

      __table: {
        headers: ["Adım", "Açıklama", "Değer"],
        rows: [
          [
            "1",
            "Başlangıç (stok) derişim C₁",
            `${c1} ${concUnit === "M" ? "mol/L" : concUnit}`,
          ],
          [
            "2",
            "Hedef derişim C₂",
            `${c2} ${concUnit === "M" ? "mol/L" : concUnit}`,
          ],
          ["3", "Hedef hacim V₂", `${v2} ${volUnit}`],
          [
            "4",
            "Gerekli stok hacmi V₁ = (C₂·V₂)/C₁",
            `${v1Rounded} ${volUnit}`,
          ],
          [
            "5",
            "Eklenecek çözücü (su) hacmi V_su = V₂ − V₁",
            `${waterRounded} ${volUnit}`,
          ],
        ],
        note: "Hacim birimlerini (mL veya L) tutarlı kullanmalısın. Derişim birimi olarak mol/L, g/L veya % (w/v) kullanabilirsin; formül oransal çalışır.",
      },
    };
  },
};

function num(x) {
  if (x == null) return NaN;
  return Number(String(x).replace(",", "."));
}

function round2(x) {
  return Number(Number(x).toFixed(2));
}
