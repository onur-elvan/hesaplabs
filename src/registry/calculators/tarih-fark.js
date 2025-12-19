export default {
  id: "tarih-fark",
  title: "Tarih Farkı (Kaç Gün?)",
  category: "Günlük",
  description: "İki tarih arasındaki gün farkını hesaplar.",
  inputs: [
    { key: "start", label: "Başlangıç Tarihi", type: "date" },
    { key: "end", label: "Bitiş Tarihi", type: "date" },
  ],
  compute(v) {
    const start = new Date(v.start);
    const end = new Date(v.end);
    const diffMs = end - start;
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return {
      gun: days,
    };
  },
};
