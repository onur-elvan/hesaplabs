export default {
  id: "primli-maas",
  title: "Primli Maaş Hesaplama",
  seoTitle: "Primli Maaş Hesaplama – Sabit + Prim ile Toplam Kazanç",
  category: "Maaş & İş",
  description:
    "Sabit maaş + prim ile toplam kazancı hesapla. Prim oranı veya prim tutarıyla çalışır.",
  seoText: `
Primli maaş hesaplama aracı; sabit maaşına ek olarak prim (tutar ya da oran) girerek toplam kazancını hızlıca görmeni sağlar.

Ne işe yarar?
- Sabit maaş + prim = toplam kazanç
- Prim oranı (%) ile prim tutarını hesaplar
- Karşılaştırma (prim yok/prim var)

Not: Bu araç brüt/net vergi hesaplaması yapmaz; sadece gelir toplamını simüle eder.
`.trim(),
  inputs: [
    {
      key: "sabit",
      label: "Sabit Maaş (₺)",
      type: "number",
      placeholder: "Örn: 40000",
      default: 0,
    },
    {
      key: "primTipi",
      label: "Prim Tipi",
      type: "select",
      default: "oran",
      options: [
        { label: "Prim Oranı (%)", value: "oran" },
        { label: "Prim Tutarı (₺)", value: "tutar" },
      ],
    },
    {
      key: "primOran",
      label: "Prim Oranı (%)",
      type: "number",
      placeholder: "Örn: 15",
      default: 0,
    },
    {
      key: "primTutar",
      label: "Prim Tutarı (₺)",
      type: "number",
      placeholder: "Örn: 6000",
      default: 0,
    },
  ],
  compute(v) {
    const sabit = Number(v.sabit || 0);
    const primTipi = v.primTipi;
    const primOran = Number(v.primOran || 0);
    const primTutarInput = Number(v.primTutar || 0);

    if (!Number.isFinite(sabit) || sabit < 0)
      return { Hata: "Sabit maaş geçersiz." };

    let prim = 0;
    if (primTipi === "oran") {
      prim = sabit * (primOran / 100);
    } else {
      prim = primTutarInput;
    }

    const toplam = sabit + prim;

    return {
      "Sabit Maaş (₺)": sabit,
      "Prim (₺)": prim,
      "Toplam Kazanç (₺)": toplam,
      __table: {
        title: "Özet",
        headers: ["Kalem", "Tutar (₺)"],
        rows: [
          ["Sabit Maaş", sabit],
          ["Prim", prim],
          ["Toplam", toplam],
        ],
      },
    };
  },
};
