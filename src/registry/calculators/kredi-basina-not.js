export default {
  id: "kredi-basina-not",
  title: "Kredi Başına Not Ortalaması",
  seoTitle: "Kredi Başına Ağırlıklı Not Ortalaması Hesaplama",
  category: "Eğitim",
  description:
    "Ders notlarını ve kredilerini girerek ağırlıklı (kredi bazlı) not ortalamanı hesapla.",
  inputs: [
    {
      key: "dersler",
      label: "Dersler (not:kredi, virgülle)",
      type: "text",
      placeholder: "Örn: 85:4, 70:3, 90:2",
    },
    {
      key: "format",
      label: "Not Sistemi",
      type: "select",
      options: [
        { label: "0-100", value: "100" },
        { label: "0-4 (GPA)", value: "4" },
      ],
      default: "100",
      advanced: true,
    },
  ],
  seoText: `Kredi başına not ortalaması (ağırlıklı ortalama), her dersin kredisini dikkate alarak daha doğru bir dönem ortalaması verir.

Nasıl girilir?
- 85:4 → “85 not, 4 kredi”
- Birden fazla ders için: 85:4, 70:3, 90:2`,
  compute(values) {
    const raw = String(values.dersler || "").trim();
    if (!raw) return { Hata: "Lütfen dersleri örnekteki formatta gir." };

    const parts = raw
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean);

    let toplamAgirlik = 0;
    let toplamKredi = 0;

    const rows = [];
    for (const p of parts) {
      const [notStr, krediStr] = p.split(":").map((x) => x.trim());
      const n = Number(notStr);
      const k = Number(krediStr);
      if (!Number.isFinite(n) || !Number.isFinite(k) || k <= 0) continue;

      const agirlik = n * k;
      toplamAgirlik += agirlik;
      toplamKredi += k;
      rows.push([n, k, agirlik]);
    }

    if (toplamKredi === 0)
      return { Hata: "Geçerli ders bulunamadı. Örn: 85:4, 70:3" };

    const ort = toplamAgirlik / toplamKredi;

    return {
      "Ağırlıklı Ortalama": ort,
      "Toplam Kredi": toplamKredi,
      __table: {
        title: "Ders Bazında Hesap",
        headers: ["Not", "Kredi", "Not×Kredi"],
        rows,
        note: "Formül: (Σ Not×Kredi) / (Σ Kredi)",
      },
    };
  },
};
