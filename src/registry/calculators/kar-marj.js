export default {
  id: "kar-marj",
  title: "Kâr Marjı / Kâr Oranı",
  category: "İşletme",
  description:
    "Maliyet ve satış fiyatına göre kâr tutarı ve oranlarını hesaplar.",
  inputs: [
    { key: "cost", label: "Maliyet", type: "number", default: 0 },
    { key: "price", label: "Satış Fiyatı", type: "number", default: 0 },
  ],
  compute(v) {
    const cost = Number(v.cost);
    const price = Number(v.price);
    const kar = price - cost;

    const karOrani = cost === 0 ? 0 : (kar / cost) * 100; // maliyete göre
    const karMarji = price === 0 ? 0 : (kar / price) * 100; // satışa göre

    return {
      maliyet: cost,
      satis: price,
      kar: kar,
      "Kar Orani Yüzde": karOrani,
      "Kar Marjı Yüzde": karMarji,
    };
  },
};
