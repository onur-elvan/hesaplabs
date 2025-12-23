function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}

export default {
  id: "ebob-ekok",
  category: "Matematik",
  title: "EBOB – EKOK",
  description: "İki sayının EBOB ve EKOK değerlerini hesaplar.",
  seoTitle: "EBOB ve EKOK Hesaplama – En Büyük ve En Küçük Ortak Kat",
  createdAt: "2025-10-24",

  seoText: `
EBOB ve EKOK hesaplama aracı ile iki veya daha fazla sayının
en büyük ortak bölenini ve en küçük ortak katını kolayca bulabilirsin.

İlköğretim ve ortaöğretim matematik konularında sıkça kullanılır.
`.trim(),

  inputs: [
    { key: "x", label: "1. Sayı", type: "number", default: 12 },
    { key: "y", label: "2. Sayı", type: "number", default: 18 },
  ],
  compute(values) {
    const x = Math.trunc(Number(values.x));
    const y = Math.trunc(Number(values.y));
    if (!isFinite(x) || !isFinite(y)) return { hata: "Geçersiz sayı" };
    if (x === 0 && y === 0) return { hata: "İki sayı da 0 olamaz" };

    const ebob = gcd(x, y);
    const ekok = x === 0 || y === 0 ? 0 : Math.abs((x * y) / ebob);

    return { EBOB: ebob, EKOK: ekok };
  },
};
