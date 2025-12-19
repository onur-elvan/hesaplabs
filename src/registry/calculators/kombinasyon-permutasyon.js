function factBig(n) {
  n = BigInt(n);
  if (n < 0n) return null;
  let r = 1n;
  for (let i = 2n; i <= n; i++) r *= i;
  return r;
}

function nPr(n, r) {
  n = BigInt(n);
  r = BigInt(r);
  if (r < 0n || n < 0n || r > n) return null;
  let res = 1n;
  for (let i = 0n; i < r; i++) res *= n - i;
  return res;
}

function nCr(n, r) {
  n = BigInt(n);
  r = BigInt(r);
  if (r < 0n || n < 0n || r > n) return null;
  const rr = r > n - r ? n - r : r;
  let num = 1n,
    den = 1n;
  for (let i = 1n; i <= rr; i++) {
    num *= n - (rr - i);
    den *= i;
  }
  return num / den;
}

export default {
  id: "kombinasyon-permutasyon",
  category: "Matematik",
  title: "Permütasyon / Kombinasyon",
  description: "nPr, nCr ve n! değerlerini hesaplar (BigInt).",
  inputs: [
    { key: "n", label: "n", type: "number", default: 10 },
    { key: "r", label: "r", type: "number", default: 3 },
  ],
  compute(values) {
    const n = Math.trunc(Number(values.n));
    const r = Math.trunc(Number(values.r));
    if (!Number.isFinite(n) || !Number.isFinite(r))
      return { hata: "Geçersiz sayı" };
    if (n < 0 || r < 0) return { hata: "n ve r negatif olamaz" };
    if (r > n) return { hata: "r, n'den büyük olamaz" };

    const nf = factBig(n);
    const pr = nPr(n, r);
    const cr = nCr(n, r);

    return {
      "n!": String(nf),
      nPr: String(pr),
      nCr: String(cr),
      not: "Büyük değerlerde sonuçlar çok uzun olabilir.",
    };
  },
};
