export default {
  id: "ikinci-derece",
  category: "Matematik",
  title: "2. Derece Denklem Çözücü",
  description: "ax² + bx + c = 0 denkleminin köklerini hesaplar.",
  inputs: [
    { key: "a", label: "a", type: "number", default: 1 },
    { key: "b", label: "b", type: "number", default: 0 },
    { key: "c", label: "c", type: "number", default: 0 },
  ],
  compute(values) {
    const a = Number(values.a);
    const b = Number(values.b);
    const c = Number(values.c);
    if (!isFinite(a) || !isFinite(b) || !isFinite(c))
      return { hata: "Geçersiz sayı" };
    if (a === 0) return { hata: "a = 0 olamaz (bu 2. derece değil)" };

    const delta = b * b - 4 * a * c;

    const x0 = -b / (2 * a);
    const y0 = a * x0 * x0 + b * x0 + c;

    if (delta > 0) {
      const sqrtD = Math.sqrt(delta);
      const x1 = (-b + sqrtD) / (2 * a);
      const x2 = (-b - sqrtD) / (2 * a);
      return { delta, x1, x2, tepeX: x0, tepeY: y0 };
    }

    if (delta === 0) {
      const x = -b / (2 * a);
      return { delta, x, tepeX: x0, tepeY: y0 };
    }

    // karmaşık kök
    const real = -b / (2 * a);
    const imag = Math.sqrt(-delta) / (2 * a);
    return {
      delta,
      x1: `${real} + ${imag}i`,
      x2: `${real} - ${imag}i`,
      tepeX: x0,
      tepeY: y0,
    };
  },
};
