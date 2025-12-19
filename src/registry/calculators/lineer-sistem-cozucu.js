export default {
  id: "lineer-sistem-cozucu",
  category: "Matematik",
  title: "Lineer Denklem Sistemi Çözücü (2/3 Bilinmeyen)",
  description:
    "Ax=b sistemini (2 veya 3 bilinmeyen) Gauss eliminasyonu ile çözer. Tek çözüm / sonsuz / çözümsüz durumlarını ayırt eder.",
  inputs: [
    {
      key: "boyut",
      label: "Bilinmeyen Sayısı",
      type: "select",
      default: "2",
      options: [
        { label: "2 (x, y)", value: "2" },
        { label: "3 (x, y, z)", value: "3" },
      ],
    },

    // 2x2 veya 3x3 katsayılar + b
    { key: "a11", label: "a11", type: "number", default: 1 },
    { key: "a12", label: "a12", type: "number", default: 1 },
    { key: "a13", label: "a13 (3)", type: "number", default: 0 },
    { key: "b1", label: "b1", type: "number", default: 2 },

    { key: "a21", label: "a21", type: "number", default: 1 },
    { key: "a22", label: "a22", type: "number", default: -1 },
    { key: "a23", label: "a23 (3)", type: "number", default: 0 },
    { key: "b2", label: "b2", type: "number", default: 0 },

    { key: "a31", label: "a31 (3)", type: "number", default: 0 },
    { key: "a32", label: "a32 (3)", type: "number", default: 0 },
    { key: "a33", label: "a33 (3)", type: "number", default: 1 },
    { key: "b3", label: "b3 (3)", type: "number", default: 0 },
  ],

  compute(v) {
    const n = (x) => {
      const k = Number(String(x).replace(",", "."));
      return Number.isFinite(k) ? k : NaN;
    };
    const r4 = (x) => Math.round((x + Number.EPSILON) * 10000) / 10000;

    const dim = v.boyut === "3" ? 3 : 2;

    const A = [
      [n(v.a11), n(v.a12), n(v.a13), n(v.b1)],
      [n(v.a21), n(v.a22), n(v.a23), n(v.b2)],
      [n(v.a31), n(v.a32), n(v.a33), n(v.b3)],
    ];

    const M = [];
    for (let i = 0; i < dim; i++) M.push(A[i].slice(0, dim + 1));

    if (M.flat().some(Number.isNaN)) return { Hata: "Geçerli sayılar gir." };

    const res = solveGauss(M);

    if (res.type === "unique") {
      const out = { Durum: "Tek çözüm" };
      res.solution.forEach((val, idx) => {
        out[["x", "y", "z"][idx]] = r4(val);
      });
      out["Not"] = "Gauss eliminasyonu ile çözüldü.";
      return out;
    }

    if (res.type === "none") {
      return {
        Durum: "Çözümsüz",
        Not: "Çelişkili denklem çıktı (0 = k gibi).",
      };
    }

    return {
      Durum: "Sonsuz çözüm",
      Not: "Bağımlı denklemler çıktı (serbest değişken var).",
    };
  },
};

function solveGauss(M) {
  const n = M.length;
  const eps = 1e-12;
  const A = M.map((r) => r.slice());

  let row = 0;
  const pivots = [];

  for (let col = 0; col < n && row < n; col++) {
    // pivot bul
    let pivot = row;
    for (let r = row; r < n; r++) {
      if (Math.abs(A[r][col]) > Math.abs(A[pivot][col])) pivot = r;
    }
    if (Math.abs(A[pivot][col]) < eps) continue;

    // swap
    if (pivot !== row) [A[pivot], A[row]] = [A[row], A[pivot]];

    // normalize pivot row
    const pv = A[row][col];
    for (let j = col; j <= n; j++) A[row][j] /= pv;

    // eliminate below
    for (let r = row + 1; r < n; r++) {
      const f = A[r][col];
      for (let j = col; j <= n; j++) A[r][j] -= f * A[row][j];
    }

    pivots.push({ row, col });
    row++;
  }

  // tutarsızlık kontrolü: 0 0 0 | b (b != 0)
  for (let r = 0; r < n; r++) {
    let allZero = true;
    for (let c = 0; c < n; c++) if (Math.abs(A[r][c]) > eps) allZero = false;
    if (allZero && Math.abs(A[r][n]) > eps) return { type: "none" };
  }

  // pivot sayısı < değişken sayısı => sonsuz çözüm
  if (pivots.length < n) return { type: "infinite" };

  // back substitution
  const x = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let sum = A[i][n];
    for (let j = i + 1; j < n; j++) sum -= A[i][j] * x[j];
    x[i] = sum / A[i][i]; // A[i][i] 1'e yakın ama güvenli
  }

  return { type: "unique", solution: x };
}
