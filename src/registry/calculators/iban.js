export default {
  id: "iban",
  title: "IBAN Doğrulama",
  category: "Finans",
  description:
    "TR IBAN doğrulama (mod 97) yapar, formatlar ve IBAN’dan banka bilgisini gösterir.",

  seoTitle: "IBAN Doğrulama – TR IBAN Kontrol, Formatlama ve Banka Bulma",
  seoText: `
IBAN doğrulama aracı ile TR ile başlayan IBAN’ların doğruluğunu (MOD 97) kontrol edebilir,
boşlukları otomatik düzeltebilir ve IBAN’dan banka bilgisini görebilirsin.

IBAN doğrulama ne işe yarar?
- Hatalı IBAN’a para gönderme riskini azaltır
- IBAN formatını (boşluklarla) düzenler
- TR IBAN için banka kodundan banka adını gösterir

Not: Bu doğrulama matematiksel kontrol sağlar; hesabın aktifliği banka sisteminden doğrulanır.
`.trim(),

  info: {
    title: "Hızlı İpucu",
    items: [
      "IBAN'ı boşluklu/boşluksuz yapıştırabilirsin; sistem otomatik temizler.",
      "Doğrulama sonucu 'geçerli' ise IBAN formatı doğru demektir.",
    ],
  },

  inputs: [
    {
      key: "iban",
      label: "IBAN",
      type: "text",
      placeholder: "örn: TR12 3456 7890 1234 5678 9012 34",
      default: "",
    },
  ],

  compute(v) {
    const raw = String(v.iban || "").trim();
    const cleaned = raw.replace(/\s+/g, "").toUpperCase();

    if (!cleaned) return { hata: "IBAN giriniz" };
    if (!cleaned.startsWith("TR"))
      return { hata: "Şimdilik sadece TR IBAN destekleniyor" };
    if (cleaned.length !== 26) return { hata: "TR IBAN 26 karakter olmalı" };

    const formatted = cleaned.replace(/(.{4})/g, "$1 ").trim();

    // Banka kodu: TR + 2 check + 5 banka kodu
    const bankCode = cleaned.slice(4, 9);
    const bankName = bankNameByCode(bankCode) || "Bilinmiyor";

    const isValid = mod97IbanValid(cleaned);

    return {
      ibanTemiz: cleaned,
      ibanFormatli: formatted,
      bankaKodu: bankCode,
      banka: bankName,
      durum: isValid ? "Geçerli" : "Geçersiz",
    };
  },
};

function mod97IbanValid(iban) {
  // IBAN: first 4 moved to end
  const rearranged = iban.slice(4) + iban.slice(0, 4);

  // letters -> numbers (A=10 ... Z=35)
  let expanded = "";
  for (const ch of rearranged) {
    const code = ch.charCodeAt(0);
    if (code >= 48 && code <= 57) expanded += ch;
    else if (code >= 65 && code <= 90) expanded += String(code - 55);
    else return false;
  }

  // big int mod 97 via chunking
  let remainder = 0;
  for (let i = 0; i < expanded.length; i += 7) {
    const block = String(remainder) + expanded.slice(i, i + 7);
    remainder = Number(block) % 97;
  }
  return remainder === 1;
}

// Basit TR banka kod listesi (en yaygınlar)
function bankNameByCode(code) {
  const map = {
    "00010": "Türkiye Cumhuriyet Merkez Bankası",
    "00012": "Türkiye Halk Bankası",
    "00015": "Türkiye Vakıflar Bankası",
    "00046": "Akbank",
    "00062": "Garanti BBVA",
    "00064": "İş Bankası",
    "00067": "Yapı Kredi",
    "00111": "QNB Türkiye",
    "00134": "DenizBank",
    "00125": "ING Bank",
    "00203": "Albaraka Türk",
    "00205": "Kuveyt Türk",
    "00206": "Türkiye Finans",
    "00209": "Ziraat Katılım",
    "00210": "Vakıf Katılım",
    "00213": "Halk Katılım",
  };
  return map[code];
}
