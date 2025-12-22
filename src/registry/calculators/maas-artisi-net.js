export default {
  id: "maas-artisi-net",
  title: "Maaş Artışı Sonrası Net Maaş",
  seoTitle: "Maaş Artışı Sonrası Net Maaş Hesaplama",
  category: "Maaş & İş",
  description:
    "Mevcut net maaşına yüzde zam girerek yeni net maaşı, artış tutarını ve toplam farkı anında hesapla.",
  inputs: [
    {
      key: "net",
      label: "Mevcut Net Maaş (₺)",
      type: "number",
      placeholder: "Örn: 35000",
    },
    {
      key: "zam",
      label: "Zam Oranı (%)",
      type: "number",
      placeholder: "Örn: 30",
    },
    {
      key: "yuvarla",
      label: "Yuvarlama",
      type: "select",
      options: [
        { label: "2 ondalık", value: "2" },
        { label: "Tam sayı", value: "0" },
      ],
      default: "2",
      advanced: true,
    },
  ],
  seoText: `Maaş artışı sonrası net maaş hesaplama aracı; mevcut net maaşınızı ve zam oranını girerek yeni net maaşı saniyeler içinde bulmanızı sağlar.

Neleri gösterir?
- Yeni net maaş
- Zam tutarı (₺)
- Yeni/Eski karşılaştırması

Not: Bu araç netten nete zam hesabı yapar. Resmi bordro/vergisel farklılıklar için işveren bordrosu esas alınmalıdır.`,
  compute(values) {
    const net = Number(values.net || 0);
    const zam = Number(values.zam || 0);
    const yeni = net * (1 + zam / 100);
    const fark = yeni - net;

    const digits = Number(values.yuvarla ?? 2);
    const round = (x) => Number(x.toFixed(digits));

    return {
      "Yeni Net Maaş (₺)": round(yeni),
      "Zam Tutarı (₺)": round(fark),
      "Zam Oranı (%)": round(zam),
    };
  },
};
