// src/data/codeTools.js
export const codeTools = [
  {
    slug: "json-formatter",
    name: "JSON Formatter & Validator",
    shortDescription: "JSON verini biçimlendir, doğrula ve hataları yakala.",
    category: "JSON",
    difficulty: "Kolay",
    keywords: [
      "json formatter",
      "json düzenleyici",
      "json doğrulama",
      "json beautify",
    ],
    metaTitle: "JSON Formatter & Validator | Kodlama Araçları | Hesaplabs",
    metaDescription:
      "JSON verilerini online olarak biçimlendiren, satır satır hataları gösteren JSON Formatter & Validator aracı. Geliştiriciler için hızlı ve ücretsiz.",
  },
  {
    slug: "base64-encoder-decoder",
    name: "Base64 Encode / Decode",
    shortDescription: "Metni Base64 formatına çevir veya geri çöz.",
    category: "Encode / Decode",
    difficulty: "Kolay",
    keywords: [
      "base64 encode",
      "base64 decode",
      "metin şifreleme",
      "string encode",
    ],
    metaTitle: "Base64 Encode / Decode Aracı | Hesaplabs",
    metaDescription:
      "Metinleri Base64 formatına dönüştüren ve geri çözen online Base64 encode / decode aracı. Tarayıcı üzerinde, güvenli ve hızlı.",
  },
  {
    slug: "url-encoder-decoder",
    name: "URL Encode / Decode",
    shortDescription: "URL içindeki özel karakterleri güvenli formata çevir.",
    category: "Encode / Decode",
    difficulty: "Kolay",
    keywords: [
      "url encode",
      "url decode",
      "url düzenleme",
      "web geliştirici aracı",
    ],
    metaTitle: "URL Encode / Decode Aracı | Hesaplabs",
    metaDescription:
      "Adres çubuklarında güvenle kullanılabilecek şekilde URL encode/decode işlemleri yap. Web geliştiriciler için pratik araç.",
  },
  {
    slug: "json-compare",
    name: "JSON Karşılaştırma (Diff) Aracı",
    shortDescription:
      "İki JSON'u yan yana biçimlendirip satır bazında farkları kırmızı ile vurgular.",
    category: "JSON Araçları",
    difficulty: "Orta",
    metaTitle: "JSON Karşılaştırma (Diff) Aracı | Hesaplabs",
    metaDescription:
      "İki JSON metnini yan yana karşılaştıran, farkları satır bazında renklendiren ücretsiz JSON diff aracı. Tüm işlemler tarayıcı içinde yapılır.",
  },
  {
    slug: "jwt-decoder",
    name: "JWT Decoder & İnceleyici",
    shortDescription:
      "JWT token’larını decode edip header ve payload içeriğini güvenli bir şekilde görüntüleyin.",
    category: "Güvenlik & Kimlik",
    difficulty: "Orta",
    metaTitle: "JWT Decoder | JSON Web Token Çözücü | Hesaplabs",
    metaDescription:
      "JSON Web Token (JWT) değerlerini tarayıcı içinde güvenle decode edin. Header ve payload kısımlarını okunabilir JSON formatında görüntüleyin. İmza doğrulaması yapmayan, sadece inceleme amaçlı JWT decode aracı.",
  },
  {
    slug: "uuid-generator",
    name: "UUID Generator (Rastgele ID Üretici)",
    category: "Geliştirici Araçları",
    difficulty: "Kolay",
    shortDescription:
      "Version 4 UUID üret; birden fazla rastgele ID oluştur, tek tıkla kopyala.",
    metaTitle: "UUID Generator | Rastgele UUID v4 Üretici | Hesaplabs",
    metaDescription:
      "Version 4 UUID üretmek için ücretsiz online UUID generator. Birden fazla benzersiz ID oluştur, küçük/büyük harf ve tireli/tresiz biçimleri seç, tek tıkla kopyala.",
    seoText: `
UUID (Universally Unique Identifier), sistemler arasında çakışma ihtimali çok düşük, 128 bitlik benzersiz kimlikler üretmek için kullanılan bir standarttır. En çok kullanılan sürüm olan UUID v4, kriptografik olarak güçlü rastgele sayılara dayanır.

Bu araç, özellikle şunlar için idealdir:

- Veritabanında benzersiz kayıt ID’leri üretmek (örneğin: kullanıcı_id, siparis_id, oturum_id).
- Mikro servisler arasında benzersiz istek kimlikleri (request ID) oluşturmak.
- Dosya isimleri, token benzeri yapılar veya izleme ID’leri üretmek.
- Geliştirme ortamında hızlıca test verisi oluşturmak.

UUID v4 yapısı genelde şöyle görünür:
xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx

- Toplam 32 hex karakter + 4 tane tire = 36 karakterlik bir string.
- 4. grup içindeki ilk karakter her zaman "4" olur (bu, version 4 olduğunu gösterir).
- 3. grup içindeki ilk bitler, varyant bilgisini taşır (genellikle “8”, “9”, “a” veya “b” ile başlar).

Bu UUID Generator aracı ile:

1) Kaç adet UUID üretmek istediğini seçebilirsin (örneğin: 1, 10, 100).
2) Tireli (standart) veya tiresiz (sadece 32 karakterlik) biçimi tercih edebilirsin.
3) Küçük harf veya BÜYÜK HARF formatını seçebilirsin.
4) Tüm üretilen UUID'leri tek tıkla panoya kopyalayıp, doğrudan koduna veya konfigürasyon dosyana yapıştırabilirsin.

Tüm işlemler tarayıcı içinde çalışır; sunucuya veri gönderilmez. Bu da hem hız hem de gizlilik açısından avantaj sağlar.
`.trim(),
  },
  {
    slug: "json-to-toon-converter",
    name: "JSON to TOON Converter",
    category: "JSON & Metin Araçları",
    difficulty: "Orta",
    shortDescription:
      "JSON verisini TOON formatına dönüştürerek LLM tarafında %30–60’a kadar token tasarrufu sağlar.",
    metaTitle: "JSON to TOON Converter | TOON Formatı | Hesaplabs",
    metaDescription:
      "JSON verilerini TOON (Token-Oriented Object Notation) formatına dönüştür. LLM isteklerinde daha az token kullan, maliyeti düşür, daha fazla veriyi aynı context’e sığdır.",
    // küçük info butonu için
    docsRoute: "/kodlama/json-to-toon-bilgi",
  },
];
