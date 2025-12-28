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

// tools (kodlama araçları)
const toolsPath = path.resolve(__dirname, "../src/registry/tools/index.js");
const { tools } = await import("file://" + toolsPath);

// sabit sayfalar
const staticRoutes = ["/", "/about"];

// hesaplayıcı URL’leri
const calculatorRoutes = calculators.map((c) => `/c/${c.id}`);

// kodlama aracı URL’leri
const toolRoutes = tools.map((t) => `/kodlama/${t.slug}`);

const urls = [...staticRoutes, ...calculatorRoutes, ...toolRoutes];

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
