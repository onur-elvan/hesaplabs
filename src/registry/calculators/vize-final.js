export default {
  id: "vize-final",
  category: "Eğitim",
  title: "Vize Final Ortalama Hesaplama",
  description: "Vize ve final notuna göre dönem ortalamasını hesaplar.",
  seoTitle: "Vize Final Not Hesaplama – Geçme Notu ve Ortalama Hesaplama",
  seoText: `
Vize final not hesaplama aracı,
vize ve final sınav notlarını ve ağırlık oranlarını kullanarak
ders ortalamanı ve geçip geçmediğini hesaplar.

Bu hesaplayıcı ile:
- Vize ve final katkı oranlarını belirleyebilirsin
- Finalden kaç alman gerektiğini görebilirsin
- Dönem sonu not ortalamanı öğrenebilirsin

Öğrenciler için:
- Sınav öncesi strateji belirleme
- Not hedefi koyma
- Ders geçme ihtimalini önceden görme

Not: Üniversite ve okul sistemlerine göre oranlar değişebilir.
`.trim(),

  inputs: [
    {
      key: "vize",
      label: "Vize Notu",
      type: "number",
      default: 50,
      placeholder: "0-100",
    },
    {
      key: "final",
      label: "Final Notu",
      type: "number",
      default: 50,
      placeholder: "0-100",
    },
    {
      key: "vizeOran",
      label: "Vize Ağırlığı (%)",
      type: "number",
      default: 40,
      placeholder: "Örn: 40",
    },
    {
      key: "finalOran",
      label: "Final Ağırlığı (%)",
      type: "number",
      default: 60,
      placeholder: "Örn: 60",
    },
  ],
  compute(values) {
    const vize = Number(values.vize ?? 0);
    const fin = Number(values.final ?? 0);
    const vizeOran = Number(values.vizeOran ?? 0);
    const finalOran = Number(values.finalOran ?? 0);

    if ([vize, fin, vizeOran, finalOran].some((n) => Number.isNaN(n))) {
      return { Hata: "Lütfen sayısal değer gir." };
    }
    if (vize < 0 || vize > 100 || fin < 0 || fin > 100) {
      return { Hata: "Notlar 0-100 arası olmalı." };
    }
    if (vizeOran < 0 || finalOran < 0) {
      return { Hata: "Ağırlıklar negatif olamaz." };
    }
    if (vizeOran + finalOran !== 100) {
      return { Hata: "Vize + Final ağırlığı toplamı 100 olmalı." };
    }

    const ort = (vize * vizeOran) / 100 + (fin * finalOran) / 100;

    return {
      "Vize Notu": vize,
      "Final Notu": fin,
      "Vize Ağırlığı": `%${vizeOran}`,
      "Final Ağırlığı": `%${finalOran}`,
      Ortalama: ort,
    };
  },
};
