export default {
  id: "ders-notu",
  category: "Eğitim",
  title: "Ders Notu Hesaplama",
  description:
    "Yazılı, proje ve ders etkinlik/katılım notlarının ortalamasını hesaplar. Boş bırakılan alanlar hesaba katılmaz.",
  inputs: [
    // Yazılılar
    {
      key: "y1",
      label: "1. Yazılı Sınav",
      type: "number",
      placeholder: "Örn: 76,5",
    },
    {
      key: "y2",
      label: "2. Yazılı Sınav",
      type: "number",
      placeholder: "Örn: 76,5",
    },
    {
      key: "y3",
      label: "3. Yazılı Sınav",
      type: "number",
      placeholder: "Örn: 76,5",
    },
    {
      key: "y4",
      label: "4. Yazılı Sınav",
      type: "number",
      placeholder: "Örn: 76,5",
    },

    // Projeler
    {
      key: "p1",
      label: "1. Proje Görevi",
      type: "number",
      placeholder: "Örn: 76,5",
    },
    {
      key: "p2",
      label: "2. Proje Görevi",
      type: "number",
      placeholder: "Örn: 76,5",
    },

    // Etkinlik/Katılım
    {
      key: "k1",
      label: "1. Ders Etkinlik/Katılım",
      type: "number",
      placeholder: "Örn: 76,5",
    },
    {
      key: "k2",
      label: "2. Ders Etkinlik/Katılım",
      type: "number",
      placeholder: "Örn: 76,5",
    },
    {
      key: "k3",
      label: "3. Ders Etkinlik/Katılım",
      type: "number",
      placeholder: "Örn: 76,5",
    },
    {
      key: "k4",
      label: "4. Ders Etkinlik/Katılım",
      type: "number",
      placeholder: "Örn: 76,5",
    },
    {
      key: "k5",
      label: "5. Ders Etkinlik/Katılım",
      type: "number",
      placeholder: "Örn: 76,5",
    },
  ],

  compute(values) {
    // "76,5" gibi virgüllü girişleri de destekleyelim
    const parseTR = (v) => {
      if (v === "" || v === null || v === undefined) return null;
      const s = String(v).trim();
      if (!s) return null;
      const n = Number(s.replace(",", "."));
      return Number.isFinite(n) ? n : NaN;
    };

    const keys = [
      "y1",
      "y2",
      "y3",
      "y4",
      "p1",
      "p2",
      "k1",
      "k2",
      "k3",
      "k4",
      "k5",
    ];
    const nums = [];

    for (const k of keys) {
      const n = parseTR(values[k]);
      if (n === null) continue; // boşsa geç
      if (Number.isNaN(n)) return { Hata: `"${k}" alanı sayı olmalı.` };
      if (n < 0 || n > 100) return { Hata: "Notlar 0-100 arası olmalı." };
      nums.push(n);
    }

    if (!nums.length) {
      return { Hata: "En az 1 not girmen gerekiyor." };
    }

    const toplam = nums.reduce((a, b) => a + b, 0);
    const adet = nums.length;
    const ortalama = toplam / adet;

    return {
      "Girilen Not Sayısı": adet,
      "Toplam Puan": toplam,
      Ortalama: ortalama,
      Not: "Boş bırakılan alanlar ortalamaya dahil edilmez.",
    };
  },
};
