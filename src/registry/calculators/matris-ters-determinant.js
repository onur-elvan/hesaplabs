export default {
  id: "matris-ters-determinant",
  category: "Matematik",
  title: "Matris Determinant & Ters (2x2 / 3x3)",
  description:
    "2x2 veya 3x3 matrisin determinantını ve (varsa) tersini hesaplar. (Gauss-Jordan yöntemi)",
  inputs: [
    {
      key: "boyut",
      label: "Boyut",
      type: "select",
      default: "2",
      options: [
        { label: "2x2", value: "2" },
        { label: "3x3", value: "3" },
      ],
    },
    {
      key: "a11",
      label: "a11",
      type: "number",
      default: 1,
    },
    { key: "a12", label: "a12", type: "number", default: 2 },
    { key: "a13", label: "a13 (3x3)", type: "number", default: 0 },

    { key: "a21", label: "a21", type: "number", default: 3 },
    { key: "a22", label: "a22", type: "number", default: 4 },
    { key: "a23", label: "a23 (3x3)", type: "number", default: 0 },

    { key: "a31", label: "a31 (3x3)", type: "number", default: 0 },
    { key: "a32", label: "a32 (3x3)", type: "number", default: 0 },
    { key: "a33", label: "a33 (3x3)", type: "number", default: 1 },
  ],

  compute(v) {
    const n = (x) => {
      const k = Number(String(x).replace(",", "."));
      return Number.isFinite(k) ? k : NaN;
    };
    const r3 = (x) => Math.round((x + Number.EPSILON) * 1000) / 1000;

    const dim = v.boyut === "3" ? 3 : 2;

    // matrisi oluştur
    const A = [
      [n(v.a11), n(v.a12), n(v.a13)],
      [n(v.a21), n(v.a22), n(v.a23)],
      [n(v.a31), n(v.a32), n(v.a33)],
    ];

    // 2x2 ise 3. sütun/satırı yok say
    const M = [];
    for (let i = 0; i < dim; i++) {
      M.push(A[i].slice(0, dim));
    }

    if (M.flat().some(Number.isNaN)) return { Hata: "Geçerli sayılar gir." };

    const det = determinant(M);
    const detR = r3(det);

    // ters: Gauss-Jordan
    let inv = null;
    if (Math.abs(det) > 1e-12) {
      inv = inverseGaussJordan(M);
    }

    const out = {
      Determinant: detR,
      "Ters Var mı?": inv ? "Evet" : "Hayır (det=0)",
    };

    if (inv) {
      // ters matrisi string olarak göster (UI kartlarında güzel dursun)
      out["Ters Matris"] = formatMatrix(inv.map((row) => row.map(r3)));
    }

    return out;
  },
};

function determinant(M) {
  const n = M.length;
  if (n === 2) {
    return M[0][0] * M[1][1] - M[0][1] * M[1][0];
  }
  // 3x3
  const a = M[0][0],
    b = M[0][1],
    c = M[0][2];
  const d = M[1][0],
    e = M[1][1],
    f = M[1][2];
  const g = M[2][0],
    h = M[2][1],
    i = M[2][2];
  return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

function inverseGaussJordan(M) {
  const n = M.length;
  // augmented matrix [M | I]
  const A = M.map((row, i) => [
    ...row,
    ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  ]);

  for (let col = 0; col < n; col++) {
    // pivot seç
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(A[r][col]) > Math.abs(A[pivot][col])) pivot = r;
    }
    if (Math.abs(A[pivot][col]) < 1e-12) return null;

    // satır değiştir
    if (pivot !== col) {
      const tmp = A[col];
      A[col] = A[pivot];
      A[pivot] = tmp;
    }

    // pivot satırını 1 yap
    const pv = A[col][col];
    for (let j = 0; j < 2 * n; j++) A[col][j] /= pv;

    // diğer satırlardan pivotu yok et
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = A[r][col];
      for (let j = 0; j < 2 * n; j++) {
        A[r][j] -= factor * A[col][j];
      }
    }
  }

  // sağ taraf ters matris
  return A.map((row) => row.slice(n));
}

function formatMatrix(M) {
  // UI kartında tek string olarak gösterelim
  return M.map((row) => `[ ${row.join(" , ")} ]`).join("\n");
}
