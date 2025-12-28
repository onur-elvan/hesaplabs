export default {
  id: "ulkeler-arasi-saat-farki-genis",
  category: "Günlük",
  title: "Gelişmiş Ülkeler Arası Saat Farkı",
  createdAt: "2025-12-28",
  description:
    "Dünya genelindeki 30'dan fazla ülke ve şehir arasındaki saat farkını hesaplar.",
  seoTitle: "Dünya Saatleri ve Ülkeler Arası Saat Farkı Hesaplama 2025",

  seoText:
    `Genişletilmiş dünya saatleri aracı ile Amerika'dan Japonya'ya, Avrupa'dan Avustralya'ya kadar tüm dünya ülkeleriyle aranızdaki saat farkını öğrenin.`.trim(),

  info: {
    title: "Dünya Saat Dilimleri Hakkında",
    items: [
      "Türkiye tüm yıl boyunca GMT+3 (İstanbul) saat dilimini kullanır.",
      "Amerika ve Avustralya gibi büyük ülkelerde birden fazla saat dilimi bulunur.",
      "Hesaplamalar standart (kış saati) zaman dilimleri baz alınarak yapılmıştır.",
    ],
  },

  inputs: [
    {
      key: "baseCountry",
      label: "Referans Noktası (Bulunduğunuz Yer)",
      type: "select",
      default: "3",
      options: [
        { label: "Türkiye (GMT+3)", value: "3" },
        { label: "İngiltere - Londra (GMT+0)", value: "0" },
        { label: "Almanya/Fransa/İtalya (GMT+1)", value: "1" },
        { label: "Yunanistan/Mısır (GMT+2)", value: "2" },
        { label: "Rusya - Moskova (GMT+3)", value: "3" },
        { label: "BAE - Dubai (GMT+4)", value: "4" },
        { label: "Hindistan (GMT+5.5)", value: "5.5" },
        { label: "Çin - Pekin (GMT+8)", value: "8" },
        { label: "Japonya - Tokyo (GMT+9)", value: "9" },
        { label: "Avustralya - Sidney (GMT+11)", value: "11" },
        { label: "ABD - Doğu / NY (GMT-5)", value: "-5" },
        { label: "ABD - Merkezi / Chicago (GMT-6)", value: "-6" },
        { label: "ABD - Dağ / Denver (GMT-7)", value: "-7" },
        { label: "ABD - Pasifik / LA (GMT-8)", value: "-8" },
        { label: "Brezilya - Brasilia (GMT-3)", value: "-3" },
      ],
    },
    {
      key: "targetCountry",
      label: "Hedef Ülke / Şehir",
      type: "select",
      default: "0",
      options: [
        { label: "ABD - Doğu / NY (GMT-5)", value: "-5" },
        { label: "ABD - Pasifik / LA (GMT-8)", value: "-8" },
        { label: "Almanya - Berlin (GMT+1)", value: "1" },
        { label: "Avustralya - Sidney (GMT+11)", value: "11" },
        { label: "Azerbaycan - Bakü (GMT+4)", value: "4" },
        { label: "Brezilya - Sao Paulo (GMT-3)", value: "-3" },
        { label: "Çin - Pekin (GMT+8)", value: "8" },
        { label: "Fransa - Paris (GMT+1)", value: "1" },
        { label: "Güney Kore - Seul (GMT+9)", value: "9" },
        { label: "Güney Afrika (GMT+2)", value: "2" },
        { label: "Hindistan - Yeni Delhi (GMT+5.5)", value: "5.5" },
        { label: "Hollanda - Amsterdam (GMT+1)", value: "1" },
        { label: "İngiltere - Londra (GMT+0)", value: "0" },
        { label: "İspanya - Madrid (GMT+1)", value: "1" },
        { label: "İsviçre - Zürih (GMT+1)", value: "1" },
        { label: "İtalya - Roma (GMT+1)", value: "1" },
        { label: "Japonya - Tokyo (GMT+9)", value: "9" },
        { label: "Kanada - Toronto (GMT-5)", value: "-5" },
        { label: "Kanada - Vancouver (GMT-8)", value: "-8" },
        { label: "Katar - Doha (GMT+3)", value: "3" },
        { label: "Meksika (GMT-6)", value: "-6" },
        { label: "Mısır - Kahire (GMT+2)", value: "2" },
        { label: "Norveç - Oslo (GMT+1)", value: "1" },
        { label: "Rusya - Moskova (GMT+3)", value: "3" },
        { label: "Suudi Arabistan (GMT+3)", value: "3" },
        { label: "Tayland - Bangkok (GMT+7)", value: "7" },
        { label: "Türkiye (GMT+3)", value: "3" },
        { label: "Ukrayna - Kiev (GMT+2)", value: "2" },
        { label: "Yunanistan - Atina (GMT+2)", value: "2" },
      ],
    },
    {
      key: "localTime",
      label: "Referans Saat",
      type: "text",
      default: "12:00",
    },
  ],

  compute(values) {
    const baseUtc = Number(values.baseCountry);
    const targetUtc = Number(values.targetCountry);
    const [hours, minutes] = values.localTime.split(":").map(Number);

    if (
      isNaN(hours) ||
      isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
    ) {
      return { hata: "Geçerli bir saat giriniz (HH:MM)." };
    }

    const diff = targetUtc - baseUtc;
    let targetTotalMinutes = hours * 60 + minutes + diff * 60;

    // Gün aşımı kontrolü
    let dayChange = 0;
    if (targetTotalMinutes >= 1440) {
      dayChange = 1;
      targetTotalMinutes -= 1440;
    } else if (targetTotalMinutes < 0) {
      dayChange = -1;
      targetTotalMinutes += 1440;
    }

    const targetH = Math.floor(targetTotalMinutes / 60);
    const targetM = targetTotalMinutes % 60;
    const format = (h, m) =>
      `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;

    return {
      "Net Saat Farkı": (diff > 0 ? "+" : "") + diff + " Saat",
      "Hedef Yerel Saat": format(targetH, targetM),
      "Gün Farkı":
        dayChange === 1
          ? "1 Gün İleri (Yarın)"
          : dayChange === -1
          ? "1 Gün Geri (Dün)"
          : "Aynı Gün",
      __table: {
        headers: ["Bölge", "Saat Dilimi", "Yerel Saat"],
        rows: [
          [
            "Referans",
            `UTC${baseUtc >= 0 ? "+" : ""}${baseUtc}`,
            format(hours, minutes),
          ],
          [
            "Hedef",
            `UTC${targetUtc >= 0 ? "+" : ""}${targetUtc}`,
            format(targetH, targetM),
          ],
        ],
      },
    };
  },
};
