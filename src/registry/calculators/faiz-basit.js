export default {
  id: "basit-faiz",
  title: "Basit Faiz Hesaplama",
  category: "Finans",
  description: "Anapara, faiz oranı ve süreye göre basit faiz hesaplar.",
  createdAt: "2025-10-24",
  seoTitle: "Basit Faiz Hesaplama – Anapara, Faiz Oranı ve Süreye Göre",

  seoText: `
Basit faiz hesaplama aracı ile anapara, faiz oranı ve süre bilgilerini girerek
elde edeceğin faiz tutarını ve toplam geri ödemeyi kolayca hesaplayabilirsin.

Basit faiz, faiz tutarının sadece anapara üzerinden hesaplandığı faiz türüdür.
Genellikle kısa vadeli yatırımlar ve borç hesaplamalarında kullanılır.
`.trim(),

  info: {
    title: "Basit Faiz Nedir?",
    items: [
      "Faiz yalnızca anapara üzerinden hesaplanır.",
      "Faiz faize eklenmez.",
      "Kısa vadeli işlemler için uygundur.",
    ],
  },

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
