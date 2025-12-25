export default {
  id: "asit-baz-notralizasyon",
  category: "Kimya",
  title: "Asit – Baz Nötralizasyon Hesaplayıcı",
  createdAt: "2025-12-25",
  description:
    "Farklı derişim ve hacimdeki asit ve baz çözeltileri karıştırıldığında nötralizasyon durumunu, kalan derişimi ve pH değerini hesaplar.",
  seoTitle: "Asit Baz Nötralizasyon ve pH Hesaplama",
  seoText: `
Asit ve baz tepkimelerinde H⁺ ile OH⁻ iyonları birleşerek su oluşturur.
Bu araç, mol sayısı ve derişim üzerinden kalan iyon miktarını ve pH'ı hesaplar.

Kullanılan temel formüller:
n = M · V
pH = -log[H⁺]
pOH = -log[OH⁻]
pH + pOH = 14

Laboratuvar ve kimya eğitimi için pratiktir.
`.trim(),

  info: {
    title: "Nötralizasyon Nedir?",
    items: [
      "Asit H⁺, baz OH⁻ iyonu verir.",
      "Eşit mol H⁺ ve OH⁻ birleşirse nötr çözeltidir.",
      "Fazla iyon kalırsa çözelti asidik veya bazik olur.",
      "Toplam hacim: Vtoplam = Va + Vb",
    ],
    disclaimer:
      "Seyreltik ve sulu çözeltiler için geçerli varsayımlar kullanılmıştır.",
  },

  inputs: [
    { key: "Ma", label: "Asit derişimi Mₐ (M)", type: "number", default: 0.5 },
    { key: "Va", label: "Asit hacmi Vₐ (mL)", type: "number", default: 100 },
    { key: "Ha", label: "Asitteki H⁺ sayısı (a)", type: "number", default: 1 },

    { key: "Mb", label: "Baz derişimi Mᵦ (M)", type: "number", default: 0.5 },
    { key: "Vb", label: "Baz hacmi Vᵦ (mL)", type: "number", default: 100 },
    { key: "Ob", label: "Bazdaki OH⁻ sayısı (b)", type: "number", default: 1 },
  ],

  compute(values) {
    const Ma = num(values.Ma);
    const Va = num(values.Va) / 1000;
    const Ha = num(values.Ha);

    const Mb = num(values.Mb);
    const Vb = num(values.Vb) / 1000;
    const Ob = num(values.Ob);

    if (Ma < 0 || Mb < 0) return { hata: "Derişim negatif olamaz." };
    if (Va <= 0 || Vb <= 0) return { hata: "Hacimler pozitif olmalıdır." };
    if (Ha <= 0 || Ob <= 0) return { hata: "İyon sayısı en az 1 olmalıdır." };

    const nH = Ma * Va * Ha;
    const nOH = Mb * Vb * Ob;

    const Vtot = Va + Vb;

    let durum = "";
    let pH = null;
    let kalan = 0;
    let molarit = null;

    if (almost(nH, nOH)) {
      durum = "Nötr";
      pH = 7;
    } else if (nH > nOH) {
      durum = "Asidik";
      kalan = nH - nOH;
      molarit = kalan / Vtot;
      pH = -Math.log10(molarit);
    } else {
      durum = "Bazik";
      kalan = nOH - nH;
      molarit = kalan / Vtot;
      const pOH = -Math.log10(molarit);
      pH = 14 - pOH;
    }

    return {
      "Çözelti durumu": durum,
      "Toplam hacim (L)": round3(Vtot),
      pH: round2(pH),

      "Toplam H⁺ mol": round4(nH),
      "Toplam OH⁻ mol": round4(nOH),

      "Fazla iyon mol": molarit ? round4(kalan) : 0,
      "Fazla derişim (M)": molarit ? round4(molarit) : 0,

      Açıklama:
        "Asit ve bazın verdiği iyon mol sayıları karşılaştırılır. Fazla kalan iyon çözeltinin pH değerini belirler.",

      __table: {
        headers: ["Tür", "M (M)", "V (L)", "İyon Katsayısı", "Toplam mol"],
        rows: [
          ["Asit", Ma, Va, Ha, round4(nH)],
          ["Baz", Mb, Vb, Ob, round4(nOH)],
        ],
      },
    };
  },
};

function num(x) {
  return Number(String(x ?? "").replace(",", "."));
}

function almost(a, b) {
  return Math.abs(a - b) < 1e-9;
}

function round2(x) {
  return Number(x.toFixed(2));
}
function round3(x) {
  return Number(x.toFixed(3));
}
function round4(x) {
  return Number(x.toFixed(4));
}
