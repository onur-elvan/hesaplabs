export default {
  id: "net-brut-maas",
  title: "Net / Brüt Maaş Hesaplama",
  category: "Muhasebe",
  description:
    "2025 Türkiye bordro mantığıyla brütten nete / netten brüte maaş hesabı (tahmini).",

  seoTitle:
    "Net Brüt Maaş Hesaplama (2025) – Brütten Nete / Netten Brüte Bordro Hesabı",
  seoText: `
Net–brüt maaş hesaplama aracı ile brüt maaştan net maaşı (veya net maaşa göre brüt maaşı) tahmini olarak hesaplayabilirsin.
Hesaplama; SGK işçi payı (%14), işsizlik sigortası (%1), gelir vergisi (2025 ücret tarifesi) ve damga vergisini dikkate alır.

Daha doğru sonuç için “Yıl içi birikmiş vergi matrahı” alanına (varsa) bordrondaki kümülatif matrahı gir.
Böylece vergi dilimi değişimlerini daha gerçekçi yakalarsın.

Not: Sonuçlar bilgilendirme amaçlıdır. Kesin bordro; teşvik/istisna, ek ödeme, yan haklar ve işyeri uygulamalarına göre değişebilir.
`.trim(),

  info: {
    title: "Hızlı Rehber",
    items: [
      "Brütten nete: Brüt maaşı gir → Neti gör.",
      "Netten brüte: Net hedefini gir → Tahmini brütü bul.",
      "Gelişmiş: 'Yıl içi birikmiş vergi matrahı' girersen vergi dilimi daha doğru çıkar.",
    ],
    disclaimer: "Bu hesaplama tahminidir; resmi bordro yerine geçmez.",
  },

  inputs: [
    {
      key: "mode",
      label: "Hesap Tipi",
      type: "select",
      default: "gross_to_net",
      options: [
        { label: "Brütten Nete", value: "gross_to_net" },
        { label: "Netten Brüte", value: "net_to_gross" },
      ],
    },
    {
      key: "amount",
      label: "Tutar",
      type: "number",
      placeholder: "örn: 50000",
      default: 0,
    },
    {
      key: "month",
      label: "Ay",
      type: "select",
      default: "01",
      options: [
        { label: "Ocak", value: "01" },
        { label: "Şubat", value: "02" },
        { label: "Mart", value: "03" },
        { label: "Nisan", value: "04" },
        { label: "Mayıs", value: "05" },
        { label: "Haziran", value: "06" },
        { label: "Temmuz", value: "07" },
        { label: "Ağustos", value: "08" },
        { label: "Eylül", value: "09" },
        { label: "Ekim", value: "10" },
        { label: "Kasım", value: "11" },
        { label: "Aralık", value: "12" },
      ],
    },

    // Gelişmiş (opsiyonel)
    {
      key: "cumTaxBase",
      label: "Yıl içi birikmiş vergi matrahı (opsiyonel)",
      type: "number",
      placeholder: "örn: 180000",
      default: 0,
      advanced: true,
    },
    {
      key: "applyMinWageExemption",
      label: "Asgari ücret istisnasını uygula",
      type: "select",
      default: "yes",
      options: [
        { label: "Evet", value: "yes" },
        { label: "Hayır", value: "no" },
      ],
      advanced: true,
    },
  ],

  compute(v) {
    const mode = v.mode;
    const amount = Number(v.amount);
    const month = String(v.month || "01").padStart(2, "0");
    const cumTaxBase = Math.max(0, Number(v.cumTaxBase || 0));
    const applyEx = String(v.applyMinWageExemption || "yes") === "yes";

    if (!Number.isFinite(amount) || amount < 0)
      return { hata: "Tutar geçersiz" };

    if (mode === "gross_to_net") {
      return grossToNet(amount, month, cumTaxBase, applyEx);
    }

    // net_to_gross: binary search ile brüt bul
    return netToGross(amount, month, cumTaxBase, applyEx);
  },
};

/** 2025 parametreleri (tahmini bordro) */
const SGK_EMP = 0.14; // işçi
const UNEMP_EMP = 0.01; // işçi
const STAMP_RATE = 0.00759; // %0,759

// 2025 ÜCRET gelir vergisi tarifesi (GİB PDF’de ücret parantezi)
const TAX_BRACKETS_WAGE_2025 = [
  { upTo: 158000, rate: 0.15 },
  { upTo: 330000, rate: 0.2 },
  { upTo: 1200000, rate: 0.27 },
  { upTo: 4300000, rate: 0.35 },
  { upTo: Infinity, rate: 0.4 },
];

// 2025 asgari ücret istisnaları (GV ay bazlı, DV sabit) — bordro pratik kullanım
function minWageTaxExemptions(month) {
  // Gelir Vergisi istisnası (TL) – 2025 için:
  // Ocak–Temmuz: 3315,70 | Ağustos: 4257,57 | Eylül–Aralık: 4420,93
  const gv =
    month >= "01" && month <= "07"
      ? 3315.7
      : month === "08"
      ? 4257.57
      : 4420.93;

  // Damga vergisi istisnası (TL) – 2025 için pratik değer (yaygın kullanım)
  const dv = 197.38;

  return { gv, dv };
}

function progressiveTax(base, brackets) {
  let tax = 0;
  let prev = 0;

  for (const b of brackets) {
    const cap = b.upTo;
    if (base <= prev) break;
    const taxable = Math.min(base, cap) - prev;
    tax += taxable * b.rate;
    prev = cap;
  }
  return tax;
}

function grossToNet(gross, month, cumTaxBase, applyEx) {
  const sgk = gross * SGK_EMP;
  const unemp = gross * UNEMP_EMP;
  const taxBase = Math.max(0, gross - sgk - unemp);

  // Gelir vergisi: kümülatif matrah mantığıyla marjinal vergi
  const taxBefore = progressiveTax(
    cumTaxBase + taxBase,
    TAX_BRACKETS_WAGE_2025
  );
  const taxBeforePrev = progressiveTax(cumTaxBase, TAX_BRACKETS_WAGE_2025);
  let incomeTax = Math.max(0, taxBefore - taxBeforePrev);

  // Damga vergisi: brüt * oran
  let stampTax = gross * STAMP_RATE;

  if (applyEx) {
    const ex = minWageTaxExemptions(month);
    incomeTax = Math.max(0, incomeTax - ex.gv);
    stampTax = Math.max(0, stampTax - ex.dv);
  }

  const net = gross - sgk - unemp - incomeTax - stampTax;

  return {
    brut: gross,
    net,
    sgkIsci: sgk,
    issizlikIsci: unemp,
    gelirVergisi: incomeTax,
    damgaVergisi: stampTax,
    gelirVergisiMatrahi: taxBase,
    toplamKesinti: sgk + unemp + incomeTax + stampTax,
    not: "Tahmini sonuçtur. Kesin bordro; teşvik/istisna, ek ödeme ve işyeri uygulamalarına göre değişebilir.",
  };
}

function netToGross(netTarget, month, cumTaxBase, applyEx) {
  // Brüt aralığı (güvenli)
  let lo = 0;
  let hi = Math.max(50000, netTarget * 2.5 + 10000);

  // hi yeterli değilse büyüt
  for (let i = 0; i < 20; i++) {
    const r = grossToNet(hi, month, cumTaxBase, applyEx);
    if (r.net >= netTarget) break;
    hi *= 1.5;
  }

  // binary search
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const r = grossToNet(mid, month, cumTaxBase, applyEx);
    if (r.net >= netTarget) hi = mid;
    else lo = mid;
  }

  const final = grossToNet(hi, month, cumTaxBase, applyEx);
  return {
    hedefNet: netTarget,
    tahminiBrut: final.brut,
    net: final.net,
    sgkIsci: final.sgkIsci,
    issizlikIsci: final.issizlikIsci,
    gelirVergisi: final.gelirVergisi,
    damgaVergisi: final.damgaVergisi,
    gelirVergisiMatrahi: final.gelirVergisiMatrahi,
    toplamKesinti: final.toplamKesinti,
    not: final.not,
  };
}
