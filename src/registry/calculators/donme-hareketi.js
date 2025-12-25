export default {
  id: "donme-hareketi",
  category: "Fizik",
  title: "Dönme Hareketi – v, ω, f, rpm, Merkezcil İvme",
  createdAt: "2025-12-25",
  description:
    "Yarıçap ve bilinen bir büyüklükten (v, ω, frekans veya rpm), dönme hareketinin tüm temel büyüklüklerini ve merkezcil ivmeyi hesaplar.",
  seoTitle:
    "Dönme Hareketi Hesaplama – Çizgisel Hız, Açısal Hız, Frekans, Devir ve Merkezcil İvme",

  seoText: `
Bu araç, sabit açısal hızla dönen bir cismin temel büyüklükleri arasındaki dönüşümleri yapar.

Kullanılan ilişkiler:
- Çizgisel hız: v = ω·r
- Açısal hız: ω = 2π·f
- Frekans: f = 1 / T
- Devir/dakika: rpm = 60·f
- Merkezcil ivme: a_c = v² / r = ω²·r

Girilen yarıçap ve bilinen büyüklüğe göre:
- v, ω, f, T, rpm ve merkezcil ivmeyi hesaplar,
- Bir tam tur boyunca seçili zaman adımı ile t, θ ve (x, y) değerlerini tablo halinde verir (r > 0 ise).
`.trim(),

  info: {
    title: "Dönme Hareketi Nerede Karşımıza Çıkar?",
    items: [
      "Dönen tekerlekler, dişliler, motor şaftları gibi sistemlerde dönme hareketi temel modeldir.",
      "Dairesel yörüngede hareket eden uydular ve elektronlar için merkezcil ivme kavramı kritiktir.",
      "Merkezcil ivme her zaman dairenin merkezine doğrudur; çizgisel hız v ise daireye teğettir.",
    ],
    disclaimer:
      "Hesaplamalar düzgün ve sabit açısal hız varsayımıyla yapılır. Gerçek sistemlerde kayma, sürtünme, esneklik gibi etkiler sonucu değiştirebilir.",
  },

  inputs: [
    {
      key: "r",
      label: "Yarıçap r (m)",
      type: "number",
      default: 0.5,
      placeholder: "Örn: 0.5",
    },
    {
      key: "knownType",
      label: "Bilinen büyüklük",
      type: "select",
      default: "v",
      options: [
        { label: "Çizgisel hız v (m/s)", value: "v" },
        { label: "Açısal hız ω (rad/s)", value: "omega" },
        { label: "Frekans f (Hz)", value: "f" },
        { label: "Devir/dakika (rpm)", value: "rpm" },
      ],
    },
    {
      key: "knownValue",
      label: "Bilinen değer",
      type: "number",
      default: 2,
      placeholder: "Seçtiğin büyüklüğe göre sayı gir",
    },

    // Gelişmiş:
    {
      key: "dt",
      label: "Tablo zaman adımı Δt (s)",
      type: "number",
      default: 0.05,
      advanced: true,
      placeholder: "Örn: 0.05",
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
    const r = num(values.r);
    const knownType = values.knownType || "v";
    const knownValue = num(values.knownValue);
    let dt = num(values.dt);
    let precision = Math.floor(num(values.precision));

    if (!Number.isFinite(knownValue) || knownValue <= 0) {
      return { hata: "Bilinen değer pozitif bir sayı olmalı." };
    }
    if (!Number.isFinite(dt) || dt <= 0) dt = 0.05;
    if (!Number.isFinite(precision) || precision < 0) precision = 4;
    if (precision > 10) precision = 10;

    // Temel: v, ω, f, T, rpm
    let v = null;
    let omega = null;
    let f = null;
    let T = null;
    let rpm = null;

    if (knownType === "v") {
      v = knownValue;
      // r > 0 ise omega ve f çıkar
      if (r > 0) {
        omega = v / r;
        f = omega / (2 * Math.PI);
        T = 1 / f;
        rpm = f * 60;
      }
    } else if (knownType === "omega") {
      omega = knownValue;
      f = omega / (2 * Math.PI);
      T = 1 / f;
      rpm = f * 60;
      if (r > 0) {
        v = omega * r;
      }
    } else if (knownType === "f") {
      f = knownValue;
      T = 1 / f;
      omega = 2 * Math.PI * f;
      rpm = f * 60;
      if (r > 0) {
        v = omega * r;
      }
    } else if (knownType === "rpm") {
      rpm = knownValue;
      f = rpm / 60;
      T = 1 / f;
      omega = 2 * Math.PI * f;
      if (r > 0) v = omega * r;
    }

    // Bazı değerler tanımsız kalabilir, onları kontrol edelim
    const safe = (x) =>
      Number.isFinite(x) ? round(x, precision) : "Tanımsız (r = 0 olabilir)";

    // Merkezcil ivme
    let a_c = null;
    if (r > 0 && v !== null) {
      a_c = (v * v) / r;
    } else if (r > 0 && omega !== null) {
      a_c = omega * omega * r;
    }

    // Bir tam tur tablosu (r>0 ve f veya omega varsa)
    let table = null;
    if (r > 0 && (Number.isFinite(f) || Number.isFinite(omega))) {
      const omegaEff =
        Number.isFinite(omega) && omega > 0
          ? omega
          : Number.isFinite(f) && f > 0
          ? 2 * Math.PI * f
          : null;

      if (omegaEff && omegaEff > 0) {
        const TEff = (2 * Math.PI) / omegaEff; // bir tur
        const rows = [];
        const maxRows = 600;
        let t = 0;
        let count = 0;
        while (t <= TEff && count < maxRows) {
          const theta = omegaEff * t; // rad
          const x = r * Math.cos(theta);
          const y = r * Math.sin(theta);
          rows.push([
            round(t, precision),
            round(theta, precision),
            round((theta * 180) / Math.PI, precision),
            round(x, precision),
            round(y, precision),
          ]);
          t += dt;
          count++;
        }

        // Son satır (tam tur) garanti
        if (
          rows.length === 0 ||
          rows[rows.length - 1][0] !== round(TEff, precision)
        ) {
          const thetaE = omegaEff * TEff;
          const xE = r * Math.cos(thetaE);
          const yE = r * Math.sin(thetaE);
          rows.push([
            round(TEff, precision),
            round(thetaE, precision),
            round((thetaE * 180) / Math.PI, precision),
            round(xE, precision),
            round(yE, precision),
          ]);
        }

        table = {
          headers: ["t (s)", "θ (rad)", "θ (°)", "x (m)", "y (m)"],
          rows,
          note: `Tablo, yarıçap r = ${round(
            r,
            precision
          )} m için bir tam turu (T ≈ ${safe(TEff)} s) Δt = ${round(
            dt,
            precision
          )} s adımıyla örnekler.`,
        };
      }
    }

    return {
      "Yarıçap r (m)": round(r, precision),
      "Çizgisel hız v (m/s)": safe(v),
      "Açısal hız ω (rad/s)": safe(omega),
      "Frekans f (Hz)": safe(f),
      "Periyot T (s)": safe(T),
      "Devir/dakika rpm": safe(rpm),
      "Merkezcil ivme a_c (m/s²)": safe(a_c),
      __table: table || undefined,
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
