const length = { mm: 0.001, cm: 0.01, m: 1, km: 1000 };
const weight = { g: 0.001, kg: 1, lb: 0.45359237 };
const tempUnits = ["C", "F", "K"];

function toC(val, from) {
  if (from === "C") return val;
  if (from === "F") return (val - 32) * (5 / 9);
  if (from === "K") return val - 273.15;
  return val;
}
function fromC(valC, to) {
  if (to === "C") return valC;
  if (to === "F") return valC * (9 / 5) + 32;
  if (to === "K") return valC + 273.15;
  return valC;
}

export default {
  id: "birim-donusturucu",
  category: "Matematik",
  title: "Birim Dönüştürücü",
  description: "Uzunluk / Ağırlık / Sıcaklık birim dönüşümü yapar.",
  seoTitle: "Birim Dönüştürücü – Uzunluk, Ağırlık ve Hacim Çevirme",

  seoText: `
Birim dönüştürücü aracı ile farklı ölçü birimleri arasında
hızlı ve doğru dönüşüm yapabilirsin.

Eğitim, mühendislik ve günlük kullanım için uygundur.
`.trim(),

  inputs: [
    {
      key: "type",
      label: "Kategori",
      type: "select",
      default: "length",
      options: [
        { label: "Uzunluk", value: "length" },
        { label: "Ağırlık", value: "weight" },
        { label: "Sıcaklık", value: "temp" },
      ],
    },
    {
      key: "from",
      label: "Kaynak Birim",
      type: "select",
      default: "m",
      options: [
        // uzunluk
        { label: "mm", value: "mm" },
        { label: "cm", value: "cm" },
        { label: "m", value: "m" },
        { label: "km", value: "km" },
        // ağırlık
        { label: "g", value: "g" },
        { label: "kg", value: "kg" },
        { label: "lb", value: "lb" },
        // sıcaklık
        { label: "C", value: "C" },
        { label: "F", value: "F" },
        { label: "K", value: "K" },
      ],
    },
    {
      key: "to",
      label: "Hedef Birim",
      type: "select",
      default: "cm",
      options: [
        { label: "mm", value: "mm" },
        { label: "cm", value: "cm" },
        { label: "m", value: "m" },
        { label: "km", value: "km" },
        { label: "g", value: "g" },
        { label: "kg", value: "kg" },
        { label: "lb", value: "lb" },
        { label: "C", value: "C" },
        { label: "F", value: "F" },
        { label: "K", value: "K" },
      ],
    },
    { key: "amount", label: "Değer", type: "number", default: 100 },
  ],
  compute(values) {
    const type = values.type;
    const from = values.from;
    const to = values.to;
    const amount = Number(values.amount);

    if (!isFinite(amount)) return { hata: "Geçersiz sayı" };

    if (type === "length") {
      if (!(from in length) || !(to in length))
        return { hata: "Uzunluk birimleri seçilmeli (mm/cm/m/km)" };
      const meters = amount * length[from];
      const out = meters / length[to];
      return { sonuç: out, not: `${amount} ${from} = ${out} ${to}` };
    }

    if (type === "weight") {
      if (!(from in weight) || !(to in weight))
        return { hata: "Ağırlık birimleri seçilmeli (g/kg/lb)" };
      const kg = amount * weight[from];
      const out = kg / weight[to];
      return { sonuç: out, not: `${amount} ${from} = ${out} ${to}` };
    }

    if (type === "temp") {
      if (!tempUnits.includes(from) || !tempUnits.includes(to))
        return { hata: "Sıcaklık birimleri C/F/K olmalı" };
      const c = toC(amount, from);
      const out = fromC(c, to);
      return { sonuç: out, not: `${amount} ${from} = ${out} ${to}` };
    }

    return { hata: "Kategori seçimi hatalı" };
  },
};
