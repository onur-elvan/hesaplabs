// src/services/ratesClient.js

/**
 * Netlify function üzerinden kur verisi çeker.
 * Prod ortamda:   /.netlify/functions/rates
 * Local ortamda: https://hesaplabs.netlify.app/.netlify/functions/rates
 *
 * Böylece localhost:5173 çalışırken HTML yerine JSON alırız.
 */
export async function fetchRates({ base = "USD", symbols = [] } = {}) {
  const symStr =
    Array.isArray(symbols) && symbols.length
      ? symbols.join(",")
      : "TRY,EUR,GBP";

  // Vite değişkeni: prod mu dev mi?
  const baseUrl = import.meta.env.PROD
    ? "/.netlify/functions"
    : "https://hesaplabs.netlify.app/.netlify/functions";

  const url = `${baseUrl}/rates?base=${encodeURIComponent(
    base
  )}&symbols=${encodeURIComponent(symStr)}`;

  const res = await fetch(url);

  // Burada HTML gelirse direkt yakalayalım:
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Sunucudan geçerli JSON yanıt alınamadı.");
  }

  if (!res.ok || !data.ok) {
    const msg = data?.error || `HTTP hata: ${res.status}`;
    throw new Error(msg);
  }

  return {
    ok: true,
    provider: data.provider,
    base: data.base,
    date: data.date,
    rates: data.rates || {},
  };
}
