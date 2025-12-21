import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE = "https://hesaplabs.com";

// calculators listesini import et
const calculatorsPath = path.resolve(
  __dirname,
  "../src/registry/calculators/index.js"
);
const { calculators } = await import("file://" + calculatorsPath);

const staticRoutes = [
  "/", // ana sayfa
  "/about", // hakkında
];

const calculatorRoutes = calculators.map((c) => `/c/${c.id}`);

const urls = [...staticRoutes, ...calculatorRoutes];

const today = new Date().toISOString();

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
  </url>
`
    )
    .join("") +
  `</urlset>`;

fs.writeFileSync("public/sitemap.xml", xml.trim());
console.log("✅ Sitemap oluşturuldu. URL sayısı:", urls.length);
