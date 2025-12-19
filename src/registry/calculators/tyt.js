export default {
  id: "tyt",
  category: "Eğitim",
  title: "TYT Puan Hesaplama",
  description: "TYT netleri ve OBP ile yaklaşık yerleştirme puanı hesaplar.",

  inputs: [
    // TYT
    { key: "tr_d", label: "Türkçe Doğru", type: "number" },
    { key: "tr_y", label: "Türkçe Yanlış", type: "number" },

    { key: "mat_d", label: "Matematik Doğru", type: "number" },
    { key: "mat_y", label: "Matematik Yanlış", type: "number" },

    { key: "sos_d", label: "Sosyal Doğru", type: "number" },
    { key: "sos_y", label: "Sosyal Yanlış", type: "number" },

    { key: "fen_d", label: "Fen Doğru", type: "number" },
    { key: "fen_y", label: "Fen Yanlış", type: "number" },

    // OBP
    {
      key: "obp",
      label: "OBP (0-100)",
      type: "number",
      placeholder: "Örn: 80",
      default: 0,
    },
  ],

  compute(v) {
    const net = (d, y) => (Number(d) || 0) - (Number(y) || 0) / 4;

    const tr = net(v.tr_d, v.tr_y);
    const mat = net(v.mat_d, v.mat_y);
    const sos = net(v.sos_d, v.sos_y);
    const fen = net(v.fen_d, v.fen_y);

    const totalNet = tr + mat + sos + fen;

    // ⚠️ Bu kısım hâlâ yaklaşık: TYT ham puanı (sadece netlere göre kaba)
    const tytHam = 100 + totalNet * 4;

    // OBP katkısı: OBP(0-100) -> diploma puanı(0-500) = OBP*5
    // yerleştirme katkısı = diploma * 0.12 = OBP*5*0.12 = OBP*0.6
    const obp = Math.max(0, Math.min(100, Number(v.obp) || 0));
    const obpKatki = obp * 0.6;

    const tytYer = tytHam + obpKatki;

    return {
      "Türkçe Net": tr,
      "Matematik Net": mat,
      "Sosyal Net": sos,
      "Fen Net": fen,
      "Toplam Net": totalNet,
      "TYT Ham Puan (yaklaşık)": tytHam,
      "OBP Katkısı": obpKatki,
      "TYT Yerleştirme Puanı (yaklaşık)": tytYer,
    };
  },
};
