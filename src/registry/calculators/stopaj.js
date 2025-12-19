export default {
  id: "stopaj",
  title: "Stopaj Hesaplama",
  category: "Muhasebe",
  description:
    "Brüt tutar ve stopaj oranına göre stopaj ve net tutarı hesaplar.",
  inputs: [
    { key: "gross", label: "Brüt Tutar", type: "number", default: 0 },
    {
      key: "rate",
      label: "Stopaj Oranı (%)",
      type: "number",
      placeholder: "örn: 20",
      default: 20,
    },
  ],
  compute(v) {
    const gross = Number(v.gross);
    const rate = Number(v.rate) / 100;

    const stopaj = gross * rate;
    const net = gross - stopaj;

    return {
      brut: gross,
      stopajOraniYuzde: Number(v.rate),
      stopajTutari: stopaj,
      net: net,
    };
  },
};
