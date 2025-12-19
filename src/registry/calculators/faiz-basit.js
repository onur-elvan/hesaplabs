export default {
  id: "basit-faiz",
  title: "Basit Faiz Hesaplama",
  category: "Finans",
  description: "Anapara, faiz oranı ve süreye göre basit faiz hesaplar.",
  inputs: [
    { key: "principal", label: "Anapara", type: "number", default: 0 },
    { key: "rate", label: "Faiz Oranı (%)", type: "number", default: 0 },
    { key: "time", label: "Süre (yıl)", type: "number", default: 1 },
  ],
  compute(v) {
    const p = Number(v.principal);
    const r = Number(v.rate) / 100;
    const t = Number(v.time);
    const faiz = p * r * t;
    return {
      anapara: p,
      faiz,
      toplam: p + faiz,
    };
  },
};
