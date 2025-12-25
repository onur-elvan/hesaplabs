export default {
  id: "dikey-atis-serbest-dusme",
  category: "Fizik",
  title: "Dikey Atış / Serbest Düşme Çözücü",
  createdAt: "2025-12-25",
  description:
    "Başlangıç yüksekliği, ilk hız ve yerçekiminden, dikey hareketin uçuş süresini, maksimum yüksekliğini ve zaman tablosunu hesaplar.",
  seoTitle:
    "Dikey Atış ve Serbest Düşme Hesaplama – Uçuş Süresi, Maksimum Yükseklik",

  seoText: `
Bu araç, tek boyutta (dikey) gerçekleştirilen hareketleri çözer:
- Serbest düşme (v₀ = 0),
- Aşağı doğru atış (v₀ < 0),
- Yukarı doğru atış (v₀ > 0).

Genel denklem:
  y(t) = h₀ + v₀·t − (1/2)·g·t²

Burada:
- h₀: başlangıç yüksekliği,
- v₀: başlangıç hızı (yukarı pozitif, aşağı negatif),
- g: yerçekimi ivmesi (pozitif alınır, örn: 9.81 m/s²).

Bu araç:
- Uygun kökü seçerek yere çarpma süresini (y=0) bulur,
- Maksimum yüksekliği ve oraya ulaşma süresini hesaplar (v₀ > 0 ise),
- 0 ile çarpma anı arasındaki t, y, v değerlerini tablo halinde gösterir.
`.trim(),

  info: {
    title: "Dikey Hareket İçin Notlar",
    items: [
      "Yukarı yönü pozitif kabul ediyoruz; bu durumda yerçekimi ivmesi −g olarak denkleme girer.",
      "Serbest düşmede başlangıç hızı v₀ = 0 alınır, sadece yerçekimi etkisi vardır.",
      "Yukarı atışta cisim önce yavaşlar, maksimum yüksekliğe geldiğinde hızı sıfır olur, sonra aşağı düşer.",
    ],
    disclaimer:
      "Hesaplamalar sürtünmesiz, tek boyutlu ve sabit yerçekimi ivmesi varsayımıyla yapılır. Gerçek hayatta hava direnci ve diğer etkiler sonucu değiştirebilir.",
  },

  inputs: [
    {
      key: "h0",
      label: "Başlangıç yüksekliği h₀ (m)",
      type: "number",
      default: 10,
      placeholder: "Örn: 10",
    },
    {
      key: "v0",
      label: "Başlangıç hızı v₀ (m/s, yukarı +, aşağı -)",
      type: "number",
      default: 0,
      placeholder: "Örn: 0 (serbest düşme) veya 15 (yukarı)",
    },
    {
      key: "g",
      label: "Yerçekimi ivmesi g (m/s²)",
      type: "number",
      default: 9.81,
      placeholder: "Örn: 9.81",
      advanced: true,
    },
    {
      key: "dt",
      label: "Zaman adımı Δt (s)",
      type: "number",
      default: 0.05,
      placeholder: "Örn: 0.05",
      advanced: true,
    },
    {
      key: "precision",
      label: "Ondalık basamak sayısı",
      type: "number",
      default: 4,
      placeholder: "Örn: 3 veya 4",
      advanced: true,
    },
  ],

  compute(values) {
    const h0 = num(values.h0);
    const v0 = num(values.v0);
    let g = num(values.g);
    let dt = num(values.dt);
    let precision = Math.floor(num(values.precision));

    if (!Number.isFinite(h0)) {
      return { hata: "Başlangıç yüksekliği h₀ geçerli bir sayı olmalı." };
    }
    if (!Number.isFinite(v0)) {
      return { hata: "Başlangıç hızı v₀ geçerli bir sayı olmalı." };
    }
    if (!Number.isFinite(g) || g <= 0) {
      g = 9.81;
    }
    if (!Number.isFinite(dt) || dt <= 0) dt = 0.05;
    if (!Number.isFinite(precision) || precision < 0) precision = 4;
    if (precision > 10) precision = 10;

    // y(t) = h0 + v0 t - 0.5 g t^2 ; y=0 için kök
    // a t² + b t + c = 0, a = -0.5 g, b = v0, c = h0
    const a = -0.5 * g;
    const b = v0;
    const c = h0;

    const D = b * b - 4 * a * c;

    if (D < 0) {
      return {
        hata: "Bu parametrelerle yere çarpma kökü bulunamadı (diskriminant < 0). h₀, v₀ ve g değerlerini kontrol et.",
      };
    }

    const sqrtD = Math.sqrt(D);
    const t1 = (-b + sqrtD) / (2 * a);
    const t2 = (-b - sqrtD) / (2 * a);

    // Pozitif kökü seç
    const candidates = [t1, t2].filter((t) => Number.isFinite(t) && t > 0);
    if (!candidates.length) {
      return {
        hata: "Yere çarpma süresi için pozitif kök bulunamadı. Parametreleri kontrol et.",
      };
    }
    let tImpact = Math.min(...candidates);

    if (!Number.isFinite(tImpact) || tImpact <= 0) {
      return {
        hata: "Yere çarpma süresi hesaplanamadı. Parametreleri kontrol et.",
      };
    }

    // Maksimum yükseklik (v0>0 ise)
    let tMax = null;
    let hMax = null;
    if (v0 > 0) {
      tMax = v0 / g;
      hMax = h0 + v0 * tMax - 0.5 * g * tMax * tMax;
    }

    // Çarpma anındaki hız
    const vImpact = v0 - g * tImpact;

    // Tablo (0'dan tImpact'e kadar)
    const rows = [];
    const maxRows = 800;
    let t = 0;
    let count = 0;
    while (t <= tImpact && count < maxRows) {
      const y = h0 + v0 * t - 0.5 * g * t * t;
      const v = v0 - g * t;
      rows.push([
        round(t, precision),
        round(y, precision),
        round(v, precision),
      ]);
      t += dt;
      count++;
    }

    // Son noktayı garanti altına al (numerik olarak kaçırmamak için)
    if (
      rows.length === 0 ||
      rows[rows.length - 1][0] !== round(tImpact, precision)
    ) {
      const yE = h0 + v0 * tImpact - 0.5 * g * tImpact * tImpact;
      const vE = v0 - g * tImpact;
      rows.push([
        round(tImpact, precision),
        round(yE, precision),
        round(vE, precision),
      ]);
    }

    const table = {
      headers: ["t (s)", "y (m)", "v (m/s)"],
      rows,
      note: `Tablo, t = 0 ile yere çarpma anı (t ≈ ${round(
        tImpact,
        precision
      )} s) arasını Δt = ${round(
        dt,
        precision
      )} s adımıyla örnekler. Yukarı yön pozitif, g = ${round(
        g,
        3
      )} m/s² alınmıştır.`,
    };

    return {
      "Başlangıç yüksekliği h₀ (m)": round(h0, precision),
      "Başlangıç hızı v₀ (m/s)": round(v0, precision),
      "Yerçekimi g (m/s²)": round(g, 3),

      "Yere çarpma süresi t_çarpma (s)": round(tImpact, precision),
      "Çarpma anı hızı v_çarpma (m/s)": round(vImpact, precision),

      ...(tMax !== null && hMax !== null
        ? {
            "Maksimum yüksekliğe çıkma süresi t_max (s)": round(
              tMax,
              precision
            ),
            "Maksimum yükseklik h_max (m)": round(hMax, precision),
          }
        : {}),

      __table: table,
    };
  },
};

// Yardımcı fonksiyonlar
function num(x) {
  if (x === null || x === undefined || x === "") return NaN;
  return Number(String(x).replace(",", "."));
}

function round(x, p) {
  if (!Number.isFinite(x)) return x;
  const f = Math.pow(10, p);
  return Math.round(x * f) / f;
}
