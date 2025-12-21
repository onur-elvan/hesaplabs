export default {
  id: "e-ticaret-karlilik",
  category: "İşletme",
  title: "E-Ticaret Karlılık Simülatörü",
  description:
    "Alış maliyeti, KDV, platform komisyonu, kargo/paketleme, reklam vb. kalemlerle kârlılığı ve zarar etmeme satış fiyatını hesaplar.",
  seoTitle:
    "E-Ticaret Karlılık Hesaplama – Komisyon, Kargo ve KDV Dahil Net Kazanç",
  seoText: `
E-ticaret karlılık hesaplama aracı,
bir ürünü satarken tüm maliyetleri hesaba katarak
gerçek net kazancını görmeni sağlar.

Hesaplamaya dahil edilenler:
- Ürün alış maliyeti
- KDV
- Platform komisyonu (Trendyol, Hepsiburada, Amazon vb.)
- Kargo ve paketleme giderleri
- Reklam ve pazarlama maliyetleri

Bu araç sayesinde:
- Ürünü en az kaça satman gerektiğini öğrenirsin
- Belirli bir satış fiyatında net karını görürsün
- Zarar etmeden satış stratejisi oluşturabilirsin

Özellikle e-ticarete yeni başlayanlar için kritik bir araçtır.

Not: Platform komisyon oranları zamanla değişebilir.
`.trim(),
  info: {
    title: "Neden Karlılık Hesaplaması Yapmalısın?",
    items: [
      "Zarar etmeyeceğin satış fiyatını görürsün.",
      "Komisyon ve giderleri netleştirir.",
      "Fiyat stratejisi oluşturmanı sağlar.",
    ],
  },

  inputs: [
    // Maliyetler
    {
      key: "alisFiyati",
      label: "Ürün Alış Fiyatı (TL)",
      type: "number",
      default: 200,
      placeholder: "Örn: 200",
    },
    {
      key: "alisKdvDahil",
      label: "Alış fiyatı KDV dahil mi?",
      type: "select",
      default: "no",
      options: [
        { label: "Hayır (KDV hariç)", value: "no" },
        { label: "Evet (KDV dahil)", value: "yes" },
      ],
    },

    // Satış / KDV
    {
      key: "kdvOrani",
      label: "Satış KDV Oranı (%)",
      type: "number",
      default: 20,
      placeholder: "Örn: 20",
    },
    {
      key: "satisFiyati",
      label: "Satış Fiyatı (müşterinin ödediği) (TL)",
      type: "number",
      default: 399,
      placeholder: "Örn: 399",
    },
    {
      key: "satisKdvDahil",
      label: "Satış fiyatı KDV dahil mi?",
      type: "select",
      default: "yes",
      options: [
        { label: "Evet (KDV dahil)", value: "yes" },
        { label: "Hayır (KDV hariç)", value: "no" },
      ],
    },

    // Platform / ödeme kesintileri
    {
      key: "platformPreset",
      label: "Platform (komisyon preset)",
      type: "select",
      default: "custom",
      options: [
        { label: "Özel (ben gireceğim)", value: "custom" },
        { label: "Trendyol (örnek)", value: "trendyol" },
        { label: "Hepsiburada (örnek)", value: "hb" },
        { label: "Amazon (örnek)", value: "amazon" },
        { label: "Etsy (örnek)", value: "etsy" },
      ],
    },
    {
      key: "komisyonYuzde",
      label: "Platform Komisyonu (%)",
      type: "number",
      default: 15,
      placeholder: "Örn: 15",
    },
    {
      key: "komisyonBaz",
      label: "Komisyon hangi tutardan kesiliyor?",
      type: "select",
      default: "gross",
      options: [
        { label: "KDV dahil satış (brüt)", value: "gross" },
        { label: "KDV hariç satış (net)", value: "net" },
      ],
    },
    {
      key: "odemeKesintisiYuzde",
      label: "Ödeme/Sanal POS Kesintisi (%) (opsiyonel)",
      type: "number",
      default: 0,
      placeholder: "Örn: 2.5",
    },
    {
      key: "odemeKesintiBaz",
      label: "Ödeme kesintisi baz tutar",
      type: "select",
      default: "gross",
      options: [
        { label: "KDV dahil satış (brüt)", value: "gross" },
        { label: "KDV hariç satış (net)", value: "net" },
      ],
    },

    // Operasyonel giderler
    {
      key: "kargoUcreti",
      label: "Kargo Ücreti (senin ödediğin) (TL)",
      type: "number",
      default: 0,
      placeholder: "Örn: 50",
    },
    {
      key: "paketleme",
      label: "Paketleme Maliyeti (TL)",
      type: "number",
      default: 0,
      placeholder: "Örn: 5",
    },
    {
      key: "reklam",
      label: "Reklam / Promosyon Bütçesi (TL)",
      type: "number",
      default: 0,
      placeholder: "Örn: 20",
    },
    {
      key: "diger",
      label: "Diğer Masraflar (TL)",
      type: "number",
      default: 0,
      placeholder: "Örn: 10",
    },
  ],

  compute(v) {
    const num = (x) => {
      if (x === "" || x == null) return 0;
      const n = Number(String(x).replace(",", "."));
      return Number.isFinite(n) ? n : NaN;
    };
    const round2 = (x) => Math.round((x + Number.EPSILON) * 100) / 100;
    const clamp = (x, a, b) => Math.min(b, Math.max(a, x));

    // Preset komisyonlar (yaklaşık / örnek)
    const presetRate = {
      trendyol: 15,
      hb: 12,
      amazon: 15,
      etsy: 6.5,
      custom: null,
    };

    const kdvOrani = clamp(num(v.kdvOrani), 0, 100);
    const kdvKatsayi = 1 + kdvOrani / 100;

    let komisyonYuzde = num(v.komisyonYuzde);
    if (v.platformPreset && v.platformPreset !== "custom") {
      const pr = presetRate[v.platformPreset];
      if (typeof pr === "number") komisyonYuzde = pr;
    }
    komisyonYuzde = clamp(komisyonYuzde, 0, 100);

    const odemeYuzde = clamp(num(v.odemeKesintisiYuzde), 0, 100);

    const alis = num(v.alisFiyati);
    const satisInput = num(v.satisFiyati);
    const kargo = num(v.kargoUcreti);
    const paket = num(v.paketleme);
    const reklam = num(v.reklam);
    const diger = num(v.diger);

    if (
      [
        alis,
        satisInput,
        kargo,
        paket,
        reklam,
        diger,
        komisyonYuzde,
        odemeYuzde,
        kdvOrani,
      ].some(Number.isNaN)
    ) {
      return { Hata: "Lütfen tüm alanlara geçerli sayılar gir." };
    }
    if (
      alis < 0 ||
      satisInput < 0 ||
      kargo < 0 ||
      paket < 0 ||
      reklam < 0 ||
      diger < 0
    ) {
      return { Hata: "Negatif değer giremezsin." };
    }

    // Alışı KDV hariçe normalize edelim (basitleştirme):
    // Eğer alış KDV dahilse ve indirilebilir varsayıyorsak, maliyeti KDV hariçe çeviriyoruz.
    const alisNet = v.alisKdvDahil === "yes" ? alis / kdvKatsayi : alis;

    // Satışı net/brüt normalize edelim
    const satisBrut =
      v.satisKdvDahil === "yes" ? satisInput : satisInput * kdvKatsayi;
    const satisNet = satisBrut / kdvKatsayi;

    const commRate = komisyonYuzde / 100;
    const payRate = odemeYuzde / 100;

    const commBase = v.komisyonBaz === "net" ? satisNet : satisBrut;
    const payBase = v.odemeKesintiBaz === "net" ? satisNet : satisBrut;

    const komisyonTl = commBase * commRate;
    const odemeTl = payBase * payRate;

    const toplamMaliyet = alisNet + kargo + paket + reklam + diger;
    const netKar = satisNet - toplamMaliyet - komisyonTl - odemeTl;

    const karMarji = satisNet > 0 ? (netKar / satisNet) * 100 : 0;

    // Break-even (zarar etmeme): netKar = 0 olacak brüt satış fiyatı
    // netKar = (S_brut/(1+kdv)) - toplamMaliyet - comm(S) - pay(S)
    // comm(S)=rate*(base), base gross or net
    // pay(S)=rate*(base)
    // Denom: 1/(1+kdv) - commRate*baseCoef - payRate*baseCoef
    // baseCoef: gross ise 1, net ise 1/(1+kdv)
    const commCoef = v.komisyonBaz === "net" ? 1 / kdvKatsayi : 1;
    const payCoef = v.odemeKesintiBaz === "net" ? 1 / kdvKatsayi : 1;

    const denom = 1 / kdvKatsayi - commRate * commCoef - payRate * payCoef;

    let breakevenBrut = null;
    let breakevenNet = null;
    if (denom > 0) {
      breakevenBrut = toplamMaliyet / denom;
      breakevenNet = breakevenBrut / kdvKatsayi;
    }

    const classes = [9000, 12000]; // (yok) placeholder, ignore

    return {
      "Satış (KDV hariç)": round2(satisNet),
      "Satış (KDV dahil)": round2(satisBrut),
      "KDV Oranı": `%${round2(kdvOrani)}`,
      "Platform Komisyonu (TL)": round2(komisyonTl),
      "Ödeme Kesintisi (TL)": round2(odemeTl),
      "Toplam Maliyet (KDV hariç varsayım)": round2(toplamMaliyet),
      "Net Kâr (TL)": round2(netKar),
      "Kâr Marjı (net satışa göre)": round2(karMarji) + "%",

      "Zarar Etmeme Satış (KDV hariç)":
        breakevenNet == null ? "Hesaplanamadı" : round2(breakevenNet),
      "Zarar Etmeme Satış (KDV dahil)":
        breakevenBrut == null ? "Hesaplanamadı" : round2(breakevenBrut),

      Not:
        breakevenBrut == null
          ? "Komisyon/ödeme oranları ve KDV kombinasyonu nedeniyle denklemin paydası ≤ 0 çıktı. Oranları kontrol et."
          : "Bu simülasyon tahminidir. Platform kesinti bazları/kargo tahsilatı/KDV uygulaması iş modeline göre değişebilir.",
    };
  },
};
