// src/services/metalsClient.js

export async function fetchMetals() {
  const res = await fetch("/.netlify/functions/metals");

  let data;
  try {
    data = await res.json();
  } catch (e) {
    throw new Error("Metaller servisi geçersiz cevap döndürdü.");
  }

  if (!data || data.ok === false) {
    throw new Error(
      data?.message || "Metaller servisi geçersiz cevap döndürdü."
    );
  }

  return data;
}
