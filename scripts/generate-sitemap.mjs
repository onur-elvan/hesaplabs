import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE = "https://hesaplabs.com";

// calculators
const calculatorsPath = path.resolve(
  __dirname,
  "../src/registry/calculators/index.js"
);
const { calculators } = await import("file://" + calculatorsPath);

// code tools
const toolsPath = path.resolve(__dirname, "../src/registry/tools/index.js");
const { tools } = await import("file://" + toolsPath);

// 🔹 Statik sayfalar
const staticRoutes = [
  "/", // ana sayfa
  "/about/", // hakkında
  "/iletisim/", // iletişim
  "/iletisim-tesekkur/", // teşekkür
  "/kodlama-araclari/", // araç listesi
  "/kodlama/json-to-toon-bilgi/", // toon docs
  "/gizlilik-politikasi/", // gizlilik
  "/cerez-politikasi/", // çerez
];

// 🔹 Hesaplayıcılar
const calculatorRoutes = calculators.map((c) => `/c/${c.id}/`);

// 🔹 Kodlama araçları
const toolRoutes = tools.map((t) => `/kodlama/${t.slug}/`);

const urls = [...staticRoutes, ...calculatorRoutes, ...toolRoutes];

// 🔹 YYYY-MM-DD formatı
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
console.log("✅ Sitemap oluşturuldu. Toplam URL:", urls.length);
