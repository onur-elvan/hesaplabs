import { watchEffect, unref } from "vue";

export function useSeo({ title, description, ogTitle, ogDescription }) {
  watchEffect(() => {
    const t = unref(title);
    const d = unref(description);
    const ot = unref(ogTitle) ?? t;
    const od = unref(ogDescription) ?? d;

    if (t) document.title = t;

    setMeta("description", d);
    setMeta("og:title", ot);
    setMeta("og:description", od);
  });
}

function setMeta(name, content) {
  if (!content) return;

  let el =
    document.querySelector(`meta[name="${name}"]`) ||
    document.querySelector(`meta[property="${name}"]`);

  if (!el) {
    el = document.createElement("meta");
    if (name.startsWith("og:")) el.setAttribute("property", name);
    else el.setAttribute("name", name);
    document.head.appendChild(el);
  }

  el.setAttribute("content", content);
}
