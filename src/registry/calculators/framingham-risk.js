export default {
  id: "framingham-risk",
  category: "Sağlık",
  title: "Framingham Risk Skoru (10 Yıl)",
  description:
    "Yaş, kolesterol (Total/HDL), sistolik tansiyon, tedavi durumu ve sigaraya göre 10 yıllık koroner kalp hastalığı (CHD) riskini tahmini yüzde olarak hesaplar. (Bilgilendirme amaçlıdır.)",
  info: {
    title: "Kalp sağlığı için pratik öneriler",
    items: [
      "Sigara kullanıyorsan bırakmak, riski en hızlı düşüren adımlardan biridir.",
      "Haftada en az 150 dk orta tempolu yürüyüş/egzersiz hedefle.",
      "Tansiyonunu düzenli ölç: ev ölçümlerini bir deftere not et.",
      "Beslenmede: daha az işlenmiş gıda, daha çok sebze–baklagil–tam tahıl; doymuş yağ ve trans yağları azalt.",
      "Bel çevresi ve kilo kontrolü: küçük bir kilo kaybı bile tansiyon ve kolesterolü iyileştirebilir.",
      "Kolesterol ve kan şekeri (HbA1c) gibi değerlerini doktor önerisiyle takip et.",
      "Göğüs ağrısı, nefes darlığı, çarpıntı, ani güçsüzlük/konuşma bozukluğu gibi bulgularda acile başvur.",
    ],
    disclaimer:
      "Bu araç bilgilendirme amaçlıdır; tanı koymaz. Risk yüksek çıkarsa veya şikâyetin varsa bir sağlık profesyoneline danış.",
  },

  inputs: [
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
      key: "age",
      label: "Yaş",
      type: "number",
      placeholder: "Örn: 34",
      default: 35,
    },
    {
      key: "totalChol",
      label: "Total Kolesterol (mg/dL)",
      type: "number",
      placeholder: "Örn: 200",
      default: 200,
    },
    {
      key: "hdl",
      label: "HDL (mg/dL)",
      type: "number",
      placeholder: "Örn: 50",
      default: 50,
    },
    {
      key: "sbp",
      label: "Sistolik Tansiyon (mmHg)",
      type: "number",
      placeholder: "Örn: 120",
      default: 120,
    },
    {
      key: "bpTreated",
      label: "Tansiyon ilacı kullanıyor musun?",
      type: "select",
      default: "no",
      options: [
        { label: "Hayır", value: "no" },
        { label: "Evet", value: "yes" },
      ],
    },
    {
      key: "smoker",
      label: "Sigara kullanıyor musun?",
      type: "select",
      default: "no",
      options: [
        { label: "Hayır", value: "no" },
        { label: "Evet", value: "yes" },
      ],
    },
  ],

  compute(values) {
    const sex = values.sex;
    const age = toNum(values.age);
    const tc = toNum(values.totalChol);
    const hdl = toNum(values.hdl);
    const sbp = toNum(values.sbp);
    const treated = values.bpTreated === "yes";
    const smoker = values.smoker === "yes";

    // Basit validasyon
    const errs = [];
    if (!inRange(age, 20, 79)) errs.push("Yaş 20-79 aralığında olmalı.");
    if (!inRange(tc, 50, 600))
      errs.push("Total kolesterol değeri mantıklı aralıkta olmalı.");
    if (!inRange(hdl, 10, 200))
      errs.push("HDL değeri mantıklı aralıkta olmalı.");
    if (!inRange(sbp, 70, 250))
      errs.push("Sistolik tansiyon mantıklı aralıkta olmalı.");

    if (errs.length) return { Hata: errs.join(" ") };

    const points =
      agePoints(sex, age) +
      cholPoints(sex, age, tc) +
      hdlPoints(hdl) +
      sbpPoints(sex, sbp, treated) +
      smokePoints(sex, age, smoker);

    const risk = riskPercent(sex, points);

    return {
      "Toplam Puan": points,
      "10 Yıllık Risk (%)": riskLabel(risk),
      "Risk Seviyesi": band(risk),
      Not: "Bu sonuç bilgilendirme amaçlıdır; tıbbi teşhis yerine geçmez.",
    };
  },
};

// ---------- helpers ----------
function toNum(v) {
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}
function inRange(n, a, b) {
  return Number.isFinite(n) && n >= a && n <= b;
}

function ageBand(age) {
  if (age <= 34) return "20-34";
  if (age <= 39) return "35-39";
  if (age <= 44) return "40-44";
  if (age <= 49) return "45-49";
  if (age <= 54) return "50-54";
  if (age <= 59) return "55-59";
  if (age <= 64) return "60-64";
  if (age <= 69) return "65-69";
  if (age <= 74) return "70-74";
  return "75-79";
}
function cholBand(tc) {
  if (tc < 160) return "<160";
  if (tc <= 199) return "160-199";
  if (tc <= 239) return "200-239";
  if (tc <= 279) return "240-279";
  return ">=280";
}
function hdlPoints(hdl) {
  if (hdl >= 60) return -1;
  if (hdl >= 50) return 0;
  if (hdl >= 40) return 1;
  return 2;
}
function sbpBand(sbp) {
  if (sbp < 120) return "<120";
  if (sbp <= 129) return "120-129";
  if (sbp <= 139) return "130-139";
  if (sbp <= 159) return "140-159";
  return ">=160";
}

// ---------- point tables (NHLBI ATP III at-a-glance) ----------
function agePoints(sex, age) {
  const band = ageBand(age);
  const men = {
    "20-34": -9,
    "35-39": -4,
    "40-44": 0,
    "45-49": 3,
    "50-54": 6,
    "55-59": 8,
    "60-64": 10,
    "65-69": 11,
    "70-74": 12,
    "75-79": 13,
  };
  const women = {
    "20-34": -7,
    "35-39": -3,
    "40-44": 0,
    "45-49": 3,
    "50-54": 6,
    "55-59": 8,
    "60-64": 10,
    "65-69": 12,
    "70-74": 14,
    "75-79": 16,
  };
  return (sex === "male" ? men : women)[band];
}

function cholPoints(sex, age, tc) {
  // tablo yaş bandını 20-39 / 40-49 / 50-59 / 60-69 / 70-79 olarak kullanıyor
  const ageGroup =
    age <= 39
      ? "20-39"
      : age <= 49
      ? "40-49"
      : age <= 59
      ? "50-59"
      : age <= 69
      ? "60-69"
      : "70-79";
  const band = cholBand(tc);

  const men = {
    "<160": { "20-39": 0, "40-49": 0, "50-59": 0, "60-69": 0, "70-79": 0 },
    "160-199": { "20-39": 4, "40-49": 3, "50-59": 2, "60-69": 1, "70-79": 0 },
    "200-239": { "20-39": 7, "40-49": 5, "50-59": 3, "60-69": 1, "70-79": 0 },
    "240-279": { "20-39": 9, "40-49": 6, "50-59": 4, "60-69": 2, "70-79": 1 },
    ">=280": { "20-39": 11, "40-49": 8, "50-59": 5, "60-69": 3, "70-79": 1 },
  };

  const women = {
    "<160": { "20-39": 0, "40-49": 0, "50-59": 0, "60-69": 0, "70-79": 0 },
    "160-199": { "20-39": 4, "40-49": 3, "50-59": 2, "60-69": 1, "70-79": 1 },
    "200-239": { "20-39": 8, "40-49": 6, "50-59": 4, "60-69": 2, "70-79": 1 },
    "240-279": { "20-39": 11, "40-49": 8, "50-59": 5, "60-69": 3, "70-79": 2 },
    ">=280": { "20-39": 13, "40-49": 10, "50-59": 7, "60-69": 4, "70-79": 2 },
  };

  return (sex === "male" ? men : women)[band][ageGroup];
}

function smokePoints(sex, age, smoker) {
  if (!smoker) return 0;
  const ageGroup =
    age <= 39
      ? "20-39"
      : age <= 49
      ? "40-49"
      : age <= 59
      ? "50-59"
      : age <= 69
      ? "60-69"
      : "70-79";
  const men = { "20-39": 8, "40-49": 5, "50-59": 3, "60-69": 1, "70-79": 1 };
  const women = { "20-39": 9, "40-49": 7, "50-59": 4, "60-69": 2, "70-79": 1 };
  return (sex === "male" ? men : women)[ageGroup];
}

function sbpPoints(sex, sbp, treated) {
  const band = sbpBand(sbp);

  const menUntreated = {
    "<120": 0,
    "120-129": 0,
    "130-139": 1,
    "140-159": 1,
    ">=160": 2,
  };
  const menTreated = {
    "<120": 0,
    "120-129": 1,
    "130-139": 2,
    "140-159": 2,
    ">=160": 3,
  };

  const womenUntreated = {
    "<120": 0,
    "120-129": 1,
    "130-139": 2,
    "140-159": 3,
    ">=160": 4,
  };
  const womenTreated = {
    "<120": 0,
    "120-129": 3,
    "130-139": 4,
    "140-159": 5,
    ">=160": 6,
  };

  if (sex === "male") return (treated ? menTreated : menUntreated)[band];
  return (treated ? womenTreated : womenUntreated)[band];
}

function riskPercent(sex, points) {
  // Risk mapping (Point Total -> 10-year risk %)
  if (sex === "male") {
    if (points < 0) return 0.5; // "<1"
    const map = {
      0: 1,
      1: 1,
      2: 1,
      3: 1,
      4: 1,
      5: 2,
      6: 2,
      7: 3,
      8: 4,
      9: 5,
      10: 6,
      11: 8,
      12: 10,
      13: 12,
      14: 16,
      15: 20,
      16: 25,
    };
    if (points >= 17) return 30;
    return map[points] ?? 0.5;
  } else {
    // women
    if (points < 9) return 0.5; // "<1"
    const map = {
      9: 1,
      10: 1,
      11: 1,
      12: 1,
      13: 2,
      14: 2,
      15: 3,
      16: 4,
      17: 5,
      18: 6,
      19: 8,
      20: 11,
      21: 14,
      22: 17,
      23: 22,
      24: 27,
    };
    if (points >= 25) return 30;
    return map[points] ?? 0.5;
  }
}

function riskLabel(r) {
  if (r < 1) return "< 1";
  if (r >= 30) return "≥ 30";
  return String(r);
}
function band(r) {
  // basit UX etiketi (tamamen bilgilendirme)
  if (r < 5) return "Düşük";
  if (r < 10) return "Orta";
  if (r < 20) return "Yüksek";
  return "Çok yüksek";
}
