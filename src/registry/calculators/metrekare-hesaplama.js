export default {
  id: "metrekare-hesaplama",
  category: "Ev & Yaşam",
  title: "Metrekare (m²) Hesaplama Aracı",
  createdAt: "2025-12-28",
  description:
    "Zemin, duvar veya arazi gibi alanların metrekare ölçüsünü hesaplar.",
  seoTitle: "Metrekare Hesaplama - Alan (m2) Ölçme Aracı",

  seoText:
    `Metrekare hesaplama aracı ile oda, bahçe veya herhangi bir alanın büyüklüğünü kolayca bulun. 
En ve boy değerlerini girerek m² cinsinden toplam alanı hesaplayın.`.trim(),

  info: {
    title: "Metrekare Nasıl Hesaplanır?",
    items: [
      "Dikdörtgen alanlar için: En x Boy = Metrekare",
      "Üçgen alanlar için: (Taban x Yükseklik) / 2 = Metrekare",
      "Daire alanlar için: π x (Yarıçap)² = Metrekare",
    ],
  },

  inputs: [
    {
      key: "shape",
      label: "Alan Şekli",
      type: "select",
      default: "rectangle",
      options: [
        { label: "Dikdörtgen / Kare", value: "rectangle" },
        { label: "Üçgen", value: "triangle" },
        { label: "Daire", value: "circle" },
      ],
    },
    {
      key: "val1",
      label: "Boy / Taban / Yarıçap (mt)",
      type: "number",
      default: 5,
    },
    {
      key: "val2",
      label: "En / Yükseklik (mt) - Dairede Boş Bırakın",
      type: "number",
      default: 4,
    },
  ],

  compute(values) {
    const shape = values.shape;
    const v1 = Number(values.val1);
    const v2 = Number(values.val2);

    if (!isFinite(v1) || v1 <= 0) {
      return { hata: "Lütfen geçerli bir ölçü giriniz." };
    }

    let alan = 0;
    let aciklama = "";

    switch (shape) {
      case "rectangle":
        alan = v1 * (v2 || 0);
        aciklama = `${v1}m x ${v2}m dikdörtgen alan.`;
        break;
      case "triangle":
        alan = (v1 * (v2 || 0)) / 2;
        aciklama = `Tabanı ${v1}m, yüksekliği ${v2}m olan üçgen alan.`;
        break;
      case "circle":
        alan = Math.PI * Math.pow(v1, 2);
        aciklama = `Yarıçapı ${v1}m olan dairesel alan.`;
        break;
      default:
        return { hata: "Geçersiz şekil seçimi." };
    }

    return {
      "Toplam Alan": alan.toFixed(2) + " m²",
      "Hesaplama Türü": aciklama,
      "Gerekli Yaklaşık Malzeme":
        "Bu alan için yaklaşık " +
        Math.ceil(alan * 1.05) +
        " m² malzeme (fire payı dahil %5) gerekebilir.",
    };
  },
};
