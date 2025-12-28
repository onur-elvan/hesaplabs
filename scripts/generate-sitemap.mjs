import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE = "https://hesaplabs.com";

// Registry dosyalarını içe aktarırken hata payını azaltmak için
const calculatorsPath = path.resolve(
  __dirname,
  "../src/registry/calculators/index.js"
);
const { calculators } = await import("file://" + calculatorsPath);

const toolsPath = path.resolve(__dirname, "../src/registry/tools/index.js");
const { tools } = await import("file://" + toolsPath);

// 1. DÜZELTME: Tüm URL'lerin sonuna "/" (slash) ekliyoruz.
// Google çoğu zaman slash olmayan URL'yi slashlı olana yönlendirir, bu da çakışma yaratır.
const staticRoutes = ["/", "/about/"];
const calculatorRoutes = calculators.map((c) => `/c/${c.id}/`);
const toolRoutes = tools.map((t) => `/kodlama/${t.slug}/`);

const urls = [...staticRoutes, ...calculatorRoutes, ...toolRoutes];

// 2. DÜZELTME: lastmod tarihini daha temiz bir formatta (YYYY-MM-DD) gönderelim.
const today = new Date().toISOString().split("T")[0];

const xml =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map(
      (url) => `
  <url>
    <loc>${SITE}${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === "/" ? "1.0" : "0.8"}</priority>
  </url>`
    )
    .join("") +
  `\n</urlset>`;

fs.writeFileSync("public/sitemap.xml", xml.trim());
console.log("✅ Sitemap düzeltildi ve oluşturuldu. URL sayısı:", urls.length);
