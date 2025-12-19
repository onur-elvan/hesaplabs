export default {
  id: "kpss",
  category: "Eğitim",
  title: "KPSS Puan Hesaplama (Net)",
  description:
    "Doğru/yanlış girerek netleri hesaplar. (Not: ÖSYM puanı için standartlaştırma gerekir; burada net odaklıdır.)",

  inputs: [
    {
      key: "puan_turu",
      label: "Puan Türü",
      type: "select",
      default: "lisans",
      options: [
        { label: "Lisans (P1 - P48)", value: "lisans" },
        { label: "Öğretmenlik (ÖABT)", value: "oabt" },
        { label: "Önlisans (P93)", value: "onlisans" },
        { label: "Ortaöğretim (P94)", value: "ortaogretim" },
        { label: "Din Hizmetleri (DHBT)", value: "dhbt" },
      ],
    },
    {
      key: "sinav_yili",
      label: "Sınav Yılı",
      type: "select",
      default: "2025",
      options: [
        { label: "2025", value: "2025" },
        { label: "2024", value: "2024" },
        { label: "2023", value: "2023" },
      ],
    },

    // Genel Yetenek / Genel Kültür
    { key: "gy_d", label: "Genel Yetenek Doğru (60)", type: "number" },
    { key: "gy_y", label: "Genel Yetenek Yanlış", type: "number" },

    { key: "gk_d", label: "Genel Kültür Doğru (60)", type: "number" },
    { key: "gk_y", label: "Genel Kültür Yanlış", type: "number" },

    // Alan (Lisans) - ekrandaki gibi
    { key: "hukuk_d", label: "Hukuk Doğru (40)", type: "number" },
    { key: "hukuk_y", label: "Hukuk Yanlış", type: "number" },

    { key: "iktisat_d", label: "İktisat Doğru (40)", type: "number" },
    { key: "iktisat_y", label: "İktisat Yanlış", type: "number" },

    { key: "isletme_d", label: "İşletme Doğru (40)", type: "number" },
    { key: "isletme_y", label: "İşletme Yanlış", type: "number" },

    { key: "maliye_d", label: "Maliye Doğru (40)", type: "number" },
    { key: "maliye_y", label: "Maliye Yanlış", type: "number" },

    { key: "muhasebe_d", label: "Muhasebe Doğru (40)", type: "number" },
    { key: "muhasebe_y", label: "Muhasebe Yanlış", type: "number" },

    { key: "calisma_d", label: "Çalışma Ekonomisi Doğru (40)", type: "number" },
    { key: "calisma_y", label: "Çalışma Ekonomisi Yanlış", type: "number" },

    { key: "istatistik_d", label: "İstatistik Doğru (40)", type: "number" },
    { key: "istatistik_y", label: "İstatistik Yanlış", type: "number" },

    { key: "kamu_d", label: "Kamu Yönetimi Doğru (40)", type: "number" },
    { key: "kamu_y", label: "Kamu Yönetimi Yanlış", type: "number" },

    {
      key: "uluslararasi_d",
      label: "Uluslararası İlişkiler Doğru (40)",
      type: "number",
    },
    {
      key: "uluslararasi_y",
      label: "Uluslararası İlişkiler Yanlış",
      type: "number",
    },

    // (İstersen sonra ÖABT / DHBT özel alanlarını da ekleriz)
  ],

  compute(v) {
    const num = (x) => (x === "" || x == null ? null : Number(x));
    const net = (d, y) => {
      const D = num(d);
      const Y = num(y);
      if (D == null && Y == null) return null; // ikisi de boşsa yok say
      return (D || 0) - (Y || 0) / 4;
    };

    const nets = {
      "Genel Yetenek Net": net(v.gy_d, v.gy_y),
      "Genel Kültür Net": net(v.gk_d, v.gk_y),

      "Hukuk Net": net(v.hukuk_d, v.hukuk_y),
      "İktisat Net": net(v.iktisat_d, v.iktisat_y),
      "İşletme Net": net(v.isletme_d, v.isletme_y),
      "Maliye Net": net(v.maliye_d, v.maliye_y),
      "Muhasebe Net": net(v.muhasebe_d, v.muhasebe_y),
      "Çalışma Ekonomisi Net": net(v.calisma_d, v.calisma_y),
      "İstatistik Net": net(v.istatistik_d, v.istatistik_y),
      "Kamu Yönetimi Net": net(v.kamu_d, v.kamu_y),
      "Uluslararası İlişkiler Net": net(v.uluslararasi_d, v.uluslararasi_y),
    };

    // Boş olmayan netleri topla
    const allNetValues = Object.values(nets).filter(
      (x) => typeof x === "number"
    );
    const toplamNet = allNetValues.reduce((a, b) => a + b, 0);

    // GY+GK toplamı ayrı (KPSS mantığında temel)
    const gy = nets["Genel Yetenek Net"];
    const gk = nets["Genel Kültür Net"];
    const gyGkToplam =
      (typeof gy === "number" ? gy : 0) + (typeof gk === "number" ? gk : 0);

    // Sadece bilgi amaçlı özet (puan iddiası yok)
    return {
      "Puan Türü": v.puan_turu,
      "Sınav Yılı": v.sinav_yili,

      ...nets,

      "GY+GK Toplam Net": gyGkToplam,
      "Toplam Net (dolu olanlar)": toplamNet,

      Not: "Bu hesaplayıcı netleri verir. Gerçek KPSS puanı (P1-P48/P93/P94 vb.) ÖSYM’nin standart puan (ortalama/sapma) ve yıl katsayılarıyla hesaplanır.",
    };
  },
};
