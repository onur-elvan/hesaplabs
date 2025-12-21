// src/composables/useSeo.js
import { watchEffect, isRef, unref } from "vue";

function ensureMeta(name, attr = "name") {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  return el;
}

function ensureLink(rel) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  return el;
}

function ensureScript(id) {
  let el = document.head.querySelector(`script#${id}`);
  if (!el) {
    el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    document.head.appendChild(el);
  }
  return el;
}

// Ref/Computed/Object içindeki ref'leri güvenle düz objeye çevirir
function deepUnwrap(input) {
  const v = isRef(input) ? unref(input) : input;

  if (Array.isArray(v)) return v.map(deepUnwrap);

  if (v && typeof v === "object") {
    const out = {};
    for (const [k, val] of Object.entries(v)) out[k] = deepUnwrap(val);
    return out;
  }

  return v;
}

export function useSeo(seoRef) {
  watchEffect(() => {
    const raw =
      typeof seoRef === "function" ? seoRef() : seoRef?.value || seoRef;

    const seo = deepUnwrap(raw);
    if (!seo) return;

    // Title
    if (seo.title) document.title = seo.title;

    // Basic metas
    if (seo.description)
      ensureMeta("description").setAttribute("content", seo.description);
    if (seo.robots) ensureMeta("robots").setAttribute("content", seo.robots);

    // Canonical
    if (seo.canonical)
      ensureLink("canonical").setAttribute("href", seo.canonical);

    // Open Graph
    if (seo.ogTitle)
      ensureMeta("og:title", "property").setAttribute("content", seo.ogTitle);
    if (seo.ogDescription)
      ensureMeta("og:description", "property").setAttribute(
        "content",
        seo.ogDescription
      );
    if (seo.ogUrl)
      ensureMeta("og:url", "property").setAttribute("content", seo.ogUrl);
    if (seo.ogType)
      ensureMeta("og:type", "property").setAttribute("content", seo.ogType);
    if (seo.ogSiteName)
      ensureMeta("og:site_name", "property").setAttribute(
        "content",
        seo.ogSiteName
      );
    if (seo.ogImage)
      ensureMeta("og:image", "property").setAttribute("content", seo.ogImage);

    // Twitter
    if (seo.twitterCard)
      ensureMeta("twitter:card").setAttribute("content", seo.twitterCard);
    if (seo.twitterTitle)
      ensureMeta("twitter:title").setAttribute("content", seo.twitterTitle);
    if (seo.twitterDescription)
      ensureMeta("twitter:description").setAttribute(
        "content",
        seo.twitterDescription
      );
    if (seo.twitterImage)
      ensureMeta("twitter:image").setAttribute("content", seo.twitterImage);

    /**
     * JSON-LD
     * - seo.schema: array veya object olarak eklenebilir (BreadcrumbList, SoftwareApplication vs.)
     * - seo.faq: varsa otomatik FAQPage ekler
     * - default: WebPage ekler
     */
    const graph = [];

    // 1) Dışarıdan verilmiş schema varsa ekle
    if (seo.schema) {
      if (Array.isArray(seo.schema)) graph.push(...seo.schema);
      else graph.push(seo.schema);
    }

    // 2) FAQ varsa ekle
    if (Array.isArray(seo.faq) && seo.faq.length) {
      graph.push({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        inLanguage: "tr-TR",
        mainEntity: seo.faq
          .filter((x) => x?.q && x?.a)
          .map((x) => ({
            "@type": "Question",
            name: x.q,
            acceptedAnswer: { "@type": "Answer", text: x.a },
          })),
      });
    }

    // 3) Default WebPage (yoksa ekle)
    graph.push({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: seo.title || seo.ogTitle,
      description: seo.description || seo.ogDescription,
      url: seo.canonical || seo.ogUrl,
      inLanguage: "tr-TR",
    });

    // Birden fazla JSON-LD bas
    const script = ensureScript("seo-jsonld");
    script.textContent = JSON.stringify(graph.length === 1 ? graph[0] : graph);
  });
}
