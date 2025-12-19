export default {
  id: "damga-vergisi",
  title: "Damga Vergisi Hesaplama",
  category: "Muhasebe",
  description: "Tutar ve oran (binde) ile damga vergisini hesaplar.",
  inputs: [
    { key: "amount", label: "Tutar", type: "number", default: 0 },
    {
      key: "perMille",
      label: "Oran (binde)",
      type: "number",
      placeholder: "örn: 9.48",
      default: 9.48,
    },
  ],
  compute(v) {
    const amount = Number(v.amount);
    const perMille = Number(v.perMille);

    const vergi = amount * (perMille / 1000);

    return {
      tutar: amount,
      oranBinde: perMille,
      damgaVergisi: vergi,
    };
  },
};
