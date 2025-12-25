export default {
  id: "basit-harmonik-hareket",
  category: "Fizik",
  title: "Basit Harmonik Hareket (Yay–Kütle)",
  createdAt: "2025-12-25",
  description:
    "Yay sabiti, kütle ve genlikten basit harmonik hareketin periyodunu, frekansını ve x–v–a zaman tablosunu hesaplar.",
  seoTitle:
    "Basit Harmonik Hareket Hesaplama – Yay Kütle Sistemi, Periyot ve Frekans",

  seoText: `
Basit harmonik hareket (BHH), bir cismin denge konumundan uzaklaştıkça geri çağırıcı kuvvetin konuma orantılı olduğu durumlarda görülür.
Yay–kütle sistemi bu hareketin en klasik örneğidir.

Temel ilişkiler:

- Hooke Yasası: F = −k·x
- Dinamik denklem: m·x'' + k·x = 0
- Açısal frekans: ω = √(k/m)
- Periyot: T = 2π / ω
- Frekans: f = 1 / T
- Konum: x(t) = A·cos(ωt + φ)
- Hız: v(t) = −A·ω·sin(ωt + φ)
- İvme: a(t) = −A·ω²·cos(ωt + φ)

Bu araç, verilen m, k ve A için:
- Periyot, frekans ve açısal frekansı bulur,
- Maksimum hız ve ivmeyi hesaplar,
- Seçilen zaman adımıyla x(t), v(t), a(t) tablosu üretir.
`.trim(),

  info: {
    title: "Basit Harmonik Hareket Nerede Karşımıza Çıkar?",
    items: [
      "Zayıf genliklerdeki yay–kütle sistemleri, basit harmonik hareketi iyi modeller.",
      "Küçük açı varsayımı altında sarkaç hareketi de yaklaşık olarak BHH kabul edilebilir.",
      "BHH’de enerji potansiyel–kinetik arasında sürekli alışveriş yapar; toplam mekanik enerji sabittir.",
    ],
    disclaimer:
      "Buradaki model, sürtünmesiz ve lineer yay varsayımı ile geçerlidir. Gerçek sistemlerde sönüm ve doğrusal olmayan etkiler sonucu değiştirebilir.",
  },

  inputs: [
    {
      key: "m",
      label: "Kütle m (kg)",
      type: "number",
      default: "",
      placeholder: "Örn: 0.5",
    },
    {
      key: "k",
      label: "Yay sabiti k (N/m)",
      type: "number",
      default: "",
      placeholder: "Örn: 20",
    },
    {
      key: "A",
      label: "Genlik A (m)",
      type: "number",
      default: "",
      placeholder: "Örn: 0.1",
    },

    // Gelişmiş:
    {
      key: "phaseDeg",
      label: "Başlangıç fazı φ (derece)",
      type: "number",
      default: 0,
      advanced: true,
      placeholder: "Örn: 0 (cos ile başlasın)",
    },
    {
      key: "cycles",
      label: "Tabloda gösterilecek periyot sayısı",
      type: "number",
      default: 1,
      advanced: true,
      placeholder: "Örn: 1 veya 2",
    },
    {
      key: "dt",
      label: "Zaman adımı Δt (s)",
      type: "number",
      default: 0.02,
      advanced: true,
      placeholder: "Örn: 0.02",
    },
    {
      key: "precision",
      label: "Ondalık basamak sayısı",
      type: "number",
      default: 4,
      advanced: true,
      placeholder: "Örn: 3 veya 4",
    },
  ],

  compute(values) {
    const m = num(values.m);
    const k = num(values.k);
    const A = num(values.A);

    if (!Number.isFinite(m) || m <= 0) {
      return { hata: "Kütle m pozitif bir sayı olmalı (kg)." };
    }
    if (!Number.isFinite(k) || k <= 0) {
      return { hata: "Yay sabiti k pozitif bir sayı olmalı (N/m)." };
    }
    if (!Number.isFinite(A) || A <= 0) {
      return { hata: "Genlik A pozitif bir sayı olmalı (m)." };
    }

    let phaseDeg = num(values.phaseDeg);
    if (!Number.isFinite(phaseDeg)) phaseDeg = 0;

    let cycles = num(values.cycles);
    if (!Number.isFinite(cycles) || cycles <= 0) cycles = 1;

    let dt = num(values.dt);
    if (!Number.isFinite(dt) || dt <= 0) dt = 0.02;

    let precision = Math.floor(num(values.precision));
    if (!Number.isFinite(precision) || precision < 0) precision = 4;
    if (precision > 10) precision = 10;

    const omega = Math.sqrt(k / m); // rad/s
    const T = (2 * Math.PI) / omega;
    const f = 1 / T;

    const vmax = omega * A;
    const amax = omega * omega * A;

    const phi = (phaseDeg * Math.PI) / 180;

    // Tablo: t, x, v, a
    const rows = [];
    const tMax = cycles * T;
    const maxRows = 600;
    let t = 0;
    let count = 0;

    while (t <= tMax && count < maxRows) {
      const x = A * Math.cos(omega * t + phi);
      const v = -A * omega * Math.sin(omega * t + phi);
      const a = -A * omega * omega * Math.cos(omega * t + phi);

      rows.push([
        round(t, precision),
        round(x, precision),
        round(v, precision),
        round(a, precision),
      ]);

      t += dt;
      count++;
    }

    const table = {
      headers: ["t (s)", "x (m)", "v (m/s)", "a (m/s²)"],
      rows,
      note: `Tablo, basit harmonik hareket için ${round(
        cycles,
        2
      )} periyot boyunca Δt = ${round(
        dt,
        precision
      )} s adımıyla örneklenmiştir. Faz açısı φ = ${round(
        phaseDeg,
        2
      )}° olarak alınmıştır.`,
    };

    return {
      "Kütle m (kg)": round(m, precision),
      "Yay sabiti k (N/m)": round(k, precision),
      "Genlik A (m)": round(A, precision),

      "Açısal frekans ω (rad/s)": round(omega, precision),
      "Periyot T (s)": round(T, precision),
      "Frekans f (Hz)": round(f, precision),

      "Maksimum hız v_max (m/s)": round(vmax, precision),
      "Maksimum ivme a_max (m/s²)": round(amax, precision),

      "Başlangıç fazı φ (derece)": round(phaseDeg, 2),
      "Tabloya alınan periyot sayısı": round(cycles, 2),

      __table: table,
    };
  },
};

// Yardımcılar
function num(x) {
  if (x === null || x === undefined || x === "") return NaN;
  return Number(String(x).replace(",", "."));
}

function round(x, p) {
  if (!Number.isFinite(x)) return x;
  const f = Math.pow(10, p);
  return Math.round(x * f) / f;
}
