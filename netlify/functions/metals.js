// netlify/functions/metals.js

export async function handler() {
  const apiKey = process.env.METALPRICE_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        message: "METALPRICE_API_KEY tanımlı değil.",
      }),
    };
  }

  const url =
    "https://api.metalpriceapi.com/v1/latest" +
    `?api_key=${apiKey}&base=USD&currencies=XAU,XAG`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          ok: false,
          message: `MetalpriceAPI HTTP hatası: ${res.status}`,
        }),
      };
    }

    const data = await res.json();

    if (!data || !data.rates) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          ok: false,
          message: "MetalpriceAPI geçersiz veri döndürdü.",
        }),
      };
    }

    // Frontend'e sade bir JSON dön
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        provider: "MetalpriceAPI",
        base: data.base,
        date: data.date,
        rates: data.rates, // XAU, XAG vs.
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        message: err.message || "Bilinmeyen hata",
      }),
    };
  }
}
