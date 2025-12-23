export default {
  id: "ales",
  category: "Eğitim",
  title: "ALES Puan (Tahmini) Hesaplama",
  createdAt: "2025-10-24",
  description:
    "Sayısal/Sözel doğru-yanlışlara göre netleri hesaplar ve ALES Sayısal/Sözel/EA için tahmini skor üretir. (Gerçek ALES puanı sınav istatistiklerine göre değişebilir.)",
  inputs: [
    {
      key: "sayDogru",
      label: "Sayısal Doğru",
      type: "number",
      default: 0,
      placeholder: "0-50",
    },
    {
      key: "sayYanlis",
      label: "Sayısal Yanlış",
      type: "number",
      default: 0,
      placeholder: "0-50",
    },
    {
      key: "sozDogru",
      label: "Sözel Doğru",
      type: "number",
      default: 0,
      placeholder: "0-50",
    },
    {
      key: "sozYanlis",
      label: "Sözel Yanlış",
      type: "number",
      default: 0,
      placeholder: "0-50",
    },
  ],

  compute(values) {
    const toNum = (v) => (v === "" || v == null ? 0 : Number(v));

    const sayD = toNum(values.sayDogru);
    const sayY = toNum(values.sayYanlis);
    const sozD = toNum(values.sozDogru);
    const sozY = toNum(values.sozYanlis);

    const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
    const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

    // ÖSYM mantığı: net = doğru - yanlış/4
    const sayNet = round2(sayD - sayY / 4);
    const sozNet = round2(sozD - sozY / 4);

    // Ağırlıklı netler (ALES puan türlerine benzer mantıkla)
    const agSay = round2(0.75 * sayNet + 0.25 * sozNet);
    const agSoz = round2(0.25 * sayNet + 0.75 * sozNet);
    const agEa = round2(0.5 * sayNet + 0.5 * sozNet);

    // “Tahmini” skor: 50 taban + ağırlıklı net * katsayı (tamamen yaklaşık)
    // Amaç: kullanıcıya hızlı kıyas/öngörü vermek.
    const est = (ag) => round2(clamp(50 + ag * 1.2, 0, 100));

    return {
      SAY_NET: sayNet,
      SOZ_NET: sozNet,
      "AĞIRLIKLI NET (Sayısal)": agSay,
      "AĞIRLIKLI NET (Sözel)": agSoz,
      "AĞIRLIKLI NET (EA)": agEa,
      "TAHMİNİ ALES Sayısal": est(agSay),
      "TAHMİNİ ALES Sözel": est(agSoz),
      "TAHMİNİ ALES EA": est(agEa),
      NOT: "Bu değerler tahminidir. Gerçek puan sınavın ortalama/standart sapmasına göre değişir.",
    };
  },
};
