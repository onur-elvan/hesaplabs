// netlify/functions/rates.js

const API_KEY = process.env.EXCHANGE_RATE_API_KEY;

// Küçük yardımcı: JSON response döndürme
function jsonResponse(statusCode, data) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*", // frontend'ten çağırabilmek için CORS
    },
    body: JSON.stringify(data),
  };
}

exports.handler = async (event) => {
  if (!API_KEY) {
    return jsonResponse(500, {
      ok: false,
      error: "Sunucu yapılandırılmamış: EXCHANGE_RATE_API_KEY eksik.",
    });
  }

  try {
    const params = event.queryStringParameters || {};

    // Örn: ?base=USD&symbols=TRY,EUR
    const base = (params.base || "USD").toUpperCase();
    const symbolsParam = params.symbols || ""; // "TRY,EUR"

    // ExchangeRate-API endpoint (latest rates)
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${base}`;

    const apiRes = await fetch(url);
    if (!apiRes.ok) {
      return jsonResponse(502, {
        ok: false,
        error: "Kur servisine ulaşılamadı.",
        detail: `status: ${apiRes.status}`,
      });
    }

    const data = await apiRes.json();

    if (data.result !== "success") {
      return jsonResponse(502, {
        ok: false,
        error: "Kur servisi başarısız cevap döndürdü.",
        detail: data["error-type"] || null,
      });
    }

    // data.conversion_rates = { USD: 1, TRY: 34.5, EUR: 0.92, ... }
    const allRates = data.conversion_rates || {};

    let rates = allRates;

    // symbols verildiyse sadece o kurları filtrele
    if (symbolsParam) {
      const wanted = symbolsParam
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean);

      rates = {};
      for (const code of wanted) {
        if (allRates[code] != null) {
          rates[code] = allRates[code];
        }
      }
    }

    // Frontend'e her zaman aynı formatı döndürelim:
    return jsonResponse(200, {
      ok: true,
      provider: "ExchangeRate-API",
      base: data.base_code,
      date: data.time_last_update_utc, // bilgilendirme amaçlı
      rates, // { TRY: 34.5, EUR: 0.92, ... }
    });
  } catch (err) {
    console.error("rates function error:", err);
    return jsonResponse(500, {
      ok: false,
      error: "Sunucu tarafında beklenmeyen hata oluştu.",
    });
  }
};
