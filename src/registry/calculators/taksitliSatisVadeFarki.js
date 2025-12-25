export default {
  id: "taksitli-satis-vade-farki",
  category: "Muhasebe",
  title: "Taksitli Satış Vade Farkı ve Etkin Faiz",
  createdAt: "2025-12-25",
  description:
    "Peşin fiyat ve taksit planına göre vade farkını, efektif faiz oranını ve toplam müşteri maliyetini hesaplar.",
  seoTitle:
    "Taksitli Satış Vade Farkı Hesaplama – Etkin Faiz Oranı ve Toplam Maliyet",
  seoText: `
Taksitli satış yaparken “Ne kadar vade farkı oluşuyor, efektif faiz oranım ne?” sorusunu bu araçla hesaplayabilirsin.

Bu araç ile:
- Peşin satış fiyatı ve taksit bilgilerine göre **toplam vade farkı** tutarını bulursun.
- Taksitli satışın peşin fiyata göre **etkin faiz oranını (periyot ve yıllık)** hesaplar.
- Müşteri için toplam ödenecek tutarı ve ortalama vade süresini görürsün.

Temel mantık:
- Peşin fiyat = mal/hizmetin nakit değeri.
- Taksit planı: her ay/yıl ödenecek eşit taksitler.
- Vade farkı = (Toplam taksitli tutar – peşin fiyat).
- Etkin faiz oranı, peşin fiyatın bir kredi gibi düşünülüp, taksitlerin bugünkü değerine eşit olacak şekilde bulunan faiz oranıdır (iç verim oranı mantığı).

Not: Sonuçlar, eşit taksitli ve düzenli periyotlu ödeme varsayımıyla yaklaşık hesaplanır. Gerçek sözleşme şartları ve vergisel etkiler değişiklik gösterebilir.
`.trim(),

  info: {
    title: "Taksitli Satışta Vade Farkı Nasıl Hesaplanır?",
    items: [
      "Peşin fiyat, aynı malın nakit / tek çekim satışındaki tutar olarak alınır.",
      "Taksitli satışta müşteri toplamda daha yüksek ödeme yapar, aradaki fark vade farkıdır.",
      "Vade farkı muhasebede finansman geliri gibi değerlendirilir; vergi ve KDV boyutu mevzuata göre değişebilir.",
      "Bu araç, eşit tutarlı taksitler için etkin faiz oranını yaklaşık olarak hesaplar (iç verim oranı benzeri bir yaklaşım).",
      "Ay sayısına göre yıllıklaştırılmış etkin faiz oranını da hesaplayarak, farklı teklifleri karşılaştırmana yardım eder.",
    ],
    disclaimer:
      "Sonuçlar bilgilendirme amaçlıdır. Resmî kayıtlar ve özel durumlar için mali müşavirine danışmanı öneririz.",
  },

  inputs: [
    {
      key: "cashPrice",
      label: "Peşin Satış Fiyatı (TL)",
      type: "number",
      placeholder: "Örn: 50.000",
      default: 50000,
    },
    {
      key: "installmentAmount",
      label: "Taksit Tutarı (TL)",
      type: "number",
      placeholder: "Örn: 5.000",
      default: 5000,
    },
    {
      key: "installmentCount",
      label: "Taksit Sayısı (adet)",
      type: "number",
      placeholder: "Örn: 12",
      default: 12,
    },
    {
      key: "periodType",
      label: "Taksit Periyodu",
      type: "select",
      default: "ay",
      options: [
        { label: "Aylık", value: "ay" },
        { label: "Yıllık", value: "yil" },
      ],
    },
    {
      key: "firstPaymentDelay",
      label: "İlk ödeme gecikmesi (periyot)",
      type: "number",
      placeholder: "Örn: 1 (ilk taksit 1 ay sonra)",
      default: 1,
      advanced: true,
    },
  ],

  compute(values) {
    function toNum(x) {
      if (x === null || x === undefined) return NaN;
      return Number(String(x).replace(",", ".").trim());
    }
    function round2(x) {
      return Math.round(x * 100) / 100;
    }

    const cashPrice = toNum(values.cashPrice);
    const taksit = toNum(values.installmentAmount);
    const n = toNum(values.installmentCount);
    const delay = toNum(values.firstPaymentDelay);
    const periodType = values.periodType === "yil" ? "yil" : "ay";

    if (!Number.isFinite(cashPrice) || cashPrice <= 0) {
      return { hata: "Peşin satış fiyatı pozitif bir sayı olmalı." };
    }
    if (!Number.isFinite(taksit) || taksit <= 0) {
      return { hata: "Taksit tutarı pozitif bir sayı olmalı." };
    }
    if (!Number.isFinite(n) || n <= 0 || !Number.isInteger(n)) {
      return { hata: "Taksit sayısı pozitif bir tam sayı olmalı." };
    }

    const delaySafe = Number.isFinite(delay) && delay >= 0 ? delay : 1; // 0 da kabul ama default 1

    const totalInstallments = taksit * n;
    const vadeFarki = totalInstallments - cashPrice;
    const vadeFarkiOran = (vadeFarki / cashPrice) * 100;

    // Ortalama vade: (delay + ... + delay+n-1) / n
    const avgPeriod = (2 * delaySafe + (n - 1)) / 2; // periyot cinsinden ortalama vade

    // Etkin faiz oranını binary search ile bul
    function presentValue(rate) {
      let pv = 0;
      for (let k = 0; k < n; k++) {
        const t = delaySafe + k; // 1. taksit delay periyot sonra
        pv += taksit / Math.pow(1 + rate, t);
      }
      return pv;
    }

    let perPeriodRate = null;
    // Eğer toplam taksitli tutar peşinden küçük/eşitse, faiz yok veya negatif
    if (totalInstallments <= cashPrice) {
      perPeriodRate = 0;
    } else {
      // Binary search: 0 ile yüksek bir oran arasında
      let low = 0;
      let high = 5; // per periyot %500'e kadar aralık (uç durumlar için)
      const target = cashPrice;
      const maxIter = 80;

      // Eğer high'ta bile PV > target ise (oran yetmiyorsa) oranı artır
      while (presentValue(high) > target && high < 100) {
        high *= 2;
      }

      for (let i = 0; i < maxIter; i++) {
        const mid = (low + high) / 2;
        const pv = presentValue(mid);

        if (pv > target) {
          // faiz düşük, artması lazım
          low = mid;
        } else {
          // faiz yüksek veya yeterli
          high = mid;
        }
      }

      perPeriodRate = (low + high) / 2;
    }

    let annualEffective = null;
    if (perPeriodRate !== null) {
      if (periodType === "ay") {
        annualEffective = Math.pow(1 + perPeriodRate, 12) - 1;
      } else {
        // zaten yıllık periyot
        annualEffective = perPeriodRate;
      }
    }

    // Ödeme planı tablosu (kısaltılmış, çok uzun olmasın diye ilk 12 satıra kadar)
    const maxRows = 12;
    const rows = [];
    for (let k = 0; k < Math.min(n, maxRows); k++) {
      const t = delaySafe + k;
      const tLabel = periodType === "ay" ? `${t}. ay` : `${t}. yıl`;

      const pvThis =
        perPeriodRate !== null ? taksit / Math.pow(1 + perPeriodRate, t) : null;

      rows.push([
        k + 1,
        tLabel,
        round2(taksit),
        pvThis != null ? round2(pvThis) : "-",
      ]);
    }

    const table = {
      headers: [
        "Taksit No",
        "Vade",
        "Taksit Tutarı (TL)",
        "Bugünkü Değer (TL)",
      ],
      rows,
      note:
        n > maxRows
          ? `Tabloda ilk ${maxRows} taksit gösterilmektedir. Toplam taksit sayısı: ${n}.`
          : "Tüm taksitler listelenmiştir.",
    };

    const periodLabel = periodType === "ay" ? "Aylık" : "Yıllık";

    return {
      "Peşin Satış Fiyatı (TL)": round2(cashPrice),
      "Taksit Tutarı (TL)": round2(taksit),
      "Taksit Sayısı": n,
      "Taksit Periyodu": periodLabel,
      "Toplam Taksitli Tutar (TL)": round2(totalInstallments),
      "Vade Farkı (TL)": round2(vadeFarki),
      "Vade Farkı Oranı (%)": round2(vadeFarkiOran),
      "Ortalama Vade (periyot)": round2(avgPeriod),
      "Periyot Bazında Etkin Faiz Oranı (%)":
        perPeriodRate != null ? round2(perPeriodRate * 100) : "Hesaplanamadı",
      "Yıllık Etkin Faiz Oranı (%)":
        annualEffective != null
          ? round2(annualEffective * 100)
          : "Hesaplanamadı",
      __table: table,
    };
  },
};
