export default {
  id: "karbonhidrat-ihtiyaci-ve-rehberi",
  category: "Sağlık",
  title: "Karbonhidrat İhtiyacı ve Beslenme Rehberi",
  createdAt: "2025-12-28",
  description:
    "Günlük karbonhidrat ihtiyacınızı hesaplar ve size özel tüketim stratejileri sunar.",
  seoTitle: "Karbonhidrat Hesaplama ve Beslenme Önerileri",

  seoText:
    `Karbonhidrat ihtiyacınızı hesaplayın ve sağlıklı beslenme rehberimizle hangi kaynakları seçmeniz gerektiğini öğrenin. 
Glisemik indeks, antrenman öncesi beslenme ve kaliteli karbonhidrat kaynakları hakkında detaylı analiz.`.trim(),

  info: {
    title: "Karbonhidrat Stratejisi Nasıl Olmalı?",
    items: [
      "Kompleks Karbonhidratlar: Tam tahıllar, baklagiller ve sebzeler tercih edilmelidir.",
      "Zamanlama: Karbonhidrat tüketimi fiziksel aktivitenin yoğun olduğu saatlere yayılmalıdır.",
      "Lif Oranı: Yüksek lifli gıdalar kan şekerini dengeler ve tokluk süresini uzatır.",
    ],
  },

  inputs: [
    { key: "weight", label: "Kilo (kg)", type: "number", default: 75 },
    { key: "height", label: "Boy (cm)", type: "number", default: 180 },
    { key: "age", label: "Yaş", type: "number", default: 28 },
    {
      key: "sex",
      label: "Cinsiyet",
      type: "select",
      default: "male",
      options: [
        { label: "Erkek", value: "male" },
        { label: "Kadın", value: "female" },
      ],
    },
    {
      key: "activity",
      label: "Haftalık Aktivite",
      type: "select",
      default: "1.55",
      options: [
        { label: "Az (Hareketsiz yaşam)", value: "1.2" },
        { label: "Orta (Haftada 3 gün spor)", value: "1.55" },
        { label: "Yüksek (Her gün ağır spor)", value: "1.9" },
      ],
    },
    {
      key: "goal",
      label: "Hedefiniz",
      type: "select",
      default: "maintain",
      options: [
        { label: "Kilo Vermek (Düşük Karbo)", value: "0.35" },
        { label: "Korumak (Dengeli)", value: "0.50" },
        { label: "Hacim Kazanmak (Yüksek Karbo)", value: "0.65" },
      ],
    },
  ],

  compute(values) {
    const w = Number(values.weight);
    const h = Number(values.height);
    const a = Number(values.age);
    const activity = Number(values.activity);
    const ratio = Number(values.goal);

    if (w <= 0 || h <= 0 || a <= 0)
      return { hata: "Lütfen geçerli değerler giriniz." };

    // BMR ve TDEE Hesaplama
    let bmr = 10 * w + 6.25 * h - 5 * a + (values.sex === "male" ? 5 : -161);
    const tdee = bmr * activity;
    const carbGrams = (tdee * ratio) / 4;

    // Sonuca Göre Kişiselleştirilmiş Öneriler Oluşturma
    let oneriler = [];
    if (ratio <= 0.4) {
      oneriler = [
        "Düşük karbonhidratlı beslenme modelindesiniz. Karbonhidratlarınızı nişastasız sebzelerden (brokoli, ıspanak) alın.",
        "Ketojenik veya Low-Carb yaklaşımları için sağlıklı yağ ve protein miktarını artırmayı unutmayın.",
        "Özellikle antrenmandan hemen sonra az miktarda meyve tüketerek glikojen depolarını koruyabilirsiniz.",
      ];
    } else if (ratio >= 0.6) {
      oneriler = [
        "Yüksek enerji ihtiyacınız var. Karbonhidrat kaynağı olarak yulaf, esmer pirinç ve tatlı patates gibi kompleks kaynakları seçin.",
        "Antrenman öncesi ve sonrası öğünlerinizde karbonhidrat miktarını en yüksek seviyede tutun.",
        "Basit şekerden uzak durarak, enerjinizi uzun süre koruyacak tam tahıllara yönelin.",
      ];
    } else {
      oneriler = [
        "Dengeli bir makro dağılımındasınız. Karbonhidrat, protein ve yağ dengesini koruyarak sürdürülebilir bir diyet yapabilirsiniz.",
        "Günlük lif alımınızı (meyve, sebze, baklagil) 25-30 gramın altına düşürmemeye özen gösterin.",
        "Öğünlerinizde karbonhidratı protein ile birleştirerek kan şekeri dalgalanmalarını önleyin.",
      ];
    }

    return {
      "Günlük Kalori Hedefi": Math.round(tdee) + " kcal",
      "Hedeflenen Karbonhidrat": Math.round(carbGrams) + " gram",
      "Karbonhidratın Enerji Payı": `%${ratio * 100}`,
      "Size Özel Öneriler": oneriler,
      __table: {
        headers: ["Kaynak Tipi", "Örnek Gıdalar", "Neden Seçilmeli?"],
        rows: [
          [
            "Kompleks",
            "Yulaf, Karabuğday, Mercimek",
            "Uzun süreli enerji ve yüksek lif sağlar.",
          ],
          [
            "Basit (Sınırlı)",
            "Bal, Meyve, Pekmez",
            "Hızlı enerji ihtiyacı (antrenman sonrası) için uygundur.",
          ],
          [
            "Lifli",
            "Yeşil yapraklı sebzeler, Kabak",
            "Sindirimi düzenler ve kalori yoğunluğu düşüktür.",
          ],
        ],
        note: "Öneriler genel bilgilendirme amaçlıdır. Bir uzmana danışınız.",
      },
    };
  },
};
