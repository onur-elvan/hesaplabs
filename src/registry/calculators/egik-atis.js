// src/registry/calculators/egik-atis.js

export default {
  id: "egik-atis",
  category: "Fizik",
  title: "Eğik Atış Hareketi – Yörünge Hesaplama",
  createdAt: "2025-12-25",
  description:
    "Başlangıç hızı, açı ve yükseklikten eğik atış yörüngesini, uçuş süresini, menzili ve maksimum yüksekliği hesaplar.",
  seoTitle:
    "Eğik Atış Hesaplama – Uçuş Süresi, Menzil ve Maksimum Yükseklik (Fizik)",

  seoText: `
Eğik atış; bir cismin yerden veya belli bir yükseklikten, yatayla belirli bir açı yapacak şekilde atılmasıdır.
Standart modelde hava direnci ihmal edilir ve sadece yerçekimi ivmesi (g) etki eder.

Temel denklemler (2B, x-y düzlemi):

- Başlangıç hız bileşenleri:
  vₓ = v₀ · cos(θ)
  vᵧ₀ = v₀ · sin(θ)

- Konum denklemleri:
  x(t) = vₓ · t
  y(t) = y₀ + vᵧ₀ · t − ½ · g · t²

- Uçuş süresi (yere dönüş anı, y(t) = 0 için pozitif kök):
  t_f = (vᵧ₀ + √(vᵧ₀² + 2·g·y₀)) / g

- Maksimum yükseklik:
  t_tepe = vᵧ₀ / g
  y_max = y₀ + vᵧ₀² / (2·g)

Bu araç:
- v₀, θ ve y₀ girdilerinden uçuş süresi, menzil ve maksimum yüksekliği bulur,
- Belirli aralıklarla (Δt) yörüngeyi örnekleyip tablo halinde gösterir.
`.trim(),

  info: {
    title: "Eğik Atışta Nelere Dikkat Edilir?",
    items: [
      "Modelde hava direnci yok sayılır; bu yüzden gerçek hayatta menzil biraz daha kısa olabilir.",
      "Açı 0° olduğunda tamamen yatay atış, 90° olduğunda tamamen dikey atış olur.",
      "Başlangıç yüksekliği (y₀) sıfırdan büyükse, cisim yere daha geç düşer ve menzil artabilir.",
      "Aynı hız için, hava direnci yok sayıldığında maksimum menzil 45° civarında elde edilir (y₀ = 0 iken).",
    ],
    disclaimer:
      "Hesaplar ideal şartlar (vakum, sabit yerçekimi, düz zemin) için geçerlidir. Gerçek hayatta hava direnci, rüzgâr ve zemin yüksekliği sonucu etkileyebilir.",
  },

  inputs: [
    {
      key: "v0",
      label: "Başlangıç hızı v₀ (m/s)",
      type: "number",
      default: "",
      placeholder: "Örn: 20",
    },
    {
      key: "angleDeg",
      label: "Atış açısı θ (derece)",
      type: "number",
      default: 45,
      placeholder: "Örn: 30, 45, 60",
    },
    {
      key: "y0",
      label: "Başlangıç yüksekliği y₀ (m)",
      type: "number",
      default: 0,
      placeholder: "Örn: 0 (yerden) veya 5 (yüksekten)",
    },

    // Gelişmiş ayarlar
    {
      key: "g",
      label: "Yerçekimi ivmesi g (m/s²)",
      type: "number",
      default: 9.81,
      advanced: true,
      placeholder: "Örn: 9.81",
    },
    {
      key: "dt",
      label: "Örnekleme adımı Δt (s)",
      type: "number",
      default: 0.1,
      advanced: true,
      placeholder: "Örn: 0.1",
    },
    {
      key: "precision",
      label: "Ondalık basamak sayısı",
      type: "number",
      default: 3,
      advanced: true,
      placeholder: "Örn: 2 veya 3",
    },
  ],

  compute(values) {
    const v0 = num(values.v0);
    const angleDeg = num(values.angleDeg);
    const y0 = num(values.y0);
    let g = num(values.g);
    let dt = num(values.dt);
    let precision = Math.floor(num(values.precision));

    if (!Number.isFinite(v0) || v0 <= 0) {
      return { hata: "Başlangıç hızı v₀ pozitif bir sayı olmalı (m/s)." };
    }
    if (!Number.isFinite(angleDeg)) {
      return { hata: "Atış açısı θ geçerli bir sayı olmalı (derece)." };
    }
    if (!Number.isFinite(y0)) {
      return { hata: "Başlangıç yüksekliği y₀ geçerli bir sayı olmalı (m)." };
    }

    if (!Number.isFinite(g) || g <= 0) g = 9.81;
    if (!Number.isFinite(dt) || dt <= 0) dt = 0.1;
    if (!Number.isFinite(precision) || precision < 0) precision = 3;
    if (precision > 10) precision = 10;

    // Dereceden radyana
    const theta = (angleDeg * Math.PI) / 180;

    const vx = v0 * Math.cos(theta);
    const vy0 = v0 * Math.sin(theta);

    // y(t) = y0 + vy0 t - 1/2 g t^2 = 0 denkleminin pozitif kökünü bul
    // 0.5 g t^2 - vy0 t - y0 = 0 => a = 0.5 g, b = -vy0, c = -y0
    const a = 0.5 * g;
    const b = -vy0;
    const c = -y0;
    const D = b * b - 4 * a * c;

    if (D < 0) {
      return {
        hata: "Verilen değerlerle cisim yere ulaşmıyor gibi görünüyor (diskriminant < 0). y₀, v₀ ve açıyı kontrol et.",
      };
    }

    const sqrtD = Math.sqrt(D);
    const t1 = (-b + sqrtD) / (2 * a);
    const t2 = (-b - sqrtD) / (2 * a);
    // Pozitif ve daha büyük kökü uçuş süresi kabul edelim
    const candidates = [t1, t2].filter((t) => t > 0);
    if (!candidates.length) {
      return {
        hata: "Hesaplanan uçuş süreleri pozitif çıkmadı. Girdi değerlerini kontrol et.",
      };
    }

    const tFlight = Math.max(...candidates);
    const range = vx * tFlight;

    // Maksimum yükseklik (tepe)
    const tPeak = vy0 > 0 ? vy0 / g : 0;
    const yMax = vy0 > 0 ? y0 + (vy0 * vy0) / (2 * g) : y0; // Eğer açı 0 veya negatif ise tepe başlangıçta

    // Başlangıç ve yere çarpma anındaki hız büyüklükleri
    const speed0 = Math.sqrt(vx * vx + vy0 * vy0);
    const vyEnd = vy0 - g * tFlight;
    const speedEnd = Math.sqrt(vx * vx + vyEnd * vyEnd);

    // Yörünge tablosu (t, x, y, vx, vy)
    const rows = [];
    // Adım sayısını çok uçmasın diye sınırlayalım
    const maxRows = 200;
    let t = 0;
    let count = 0;

    while (t < tFlight && count < maxRows - 1) {
      const x = vx * t;
      const y = y0 + vy0 * t - 0.5 * g * t * t;
      const vy = vy0 - g * t;

      if (y >= 0) {
        rows.push([
          round(t, precision),
          round(x, precision),
          round(y, precision),
          round(vx, precision),
          round(vy, precision),
        ]);
      }

      t += dt;
      count++;
    }

    // Son noktayı (tam yere iniş anı) kesinlikle ekleyelim
    const xEnd = vx * tFlight;
    const yEnd = y0 + vy0 * tFlight - 0.5 * g * tFlight * tFlight;
    const vyAtEnd = vy0 - g * tFlight;

    rows.push([
      round(tFlight, precision),
      round(xEnd, precision),
      round(Math.max(yEnd, 0), precision),
      round(vx, precision),
      round(vyAtEnd, precision),
    ]);

    const table = {
      headers: ["t (s)", "x (m)", "y (m)", "vₓ (m/s)", "vᵧ (m/s)"],
      rows,
      note: `Yörünge, Δt = ${round(
        dt,
        precision
      )} s adımıyla örneklenmiştir. Son satır, yere iniş anını temsil eder (y ≈ 0).`,
    };

    return {
      "Başlangıç hızı v₀ (m/s)": round(v0, precision),
      "Açı θ (derece)": round(angleDeg, precision),
      "Başlangıç yüksekliği y₀ (m)": round(y0, precision),
      "Yerçekimi g (m/s²)": round(g, precision),

      "Yatay hız vₓ (m/s)": round(vx, precision),
      "Başlangıç düşey hız vᵧ₀ (m/s)": round(vy0, precision),

      "Uçuş süresi t_f (s)": round(tFlight, precision),
      "Menzil R (m)": round(range, precision),
      "Tepe zamanı t_tepe (s)": round(tPeak, precision),
      "Maksimum yükseklik y_max (m)": round(yMax, precision),

      "Başlangıç hız büyüklüğü |v₀| (m/s)": round(speed0, precision),
      "Yere çarpma anı hız büyüklüğü |v_f| (m/s)": round(speedEnd, precision),

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
