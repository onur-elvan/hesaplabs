// src/services/popularityGlobal.js
import { supabase } from "../lib/supabaseClient";

const TABLE = "calculator_popularity";

/**
 * Bir hesaplayıcı görüntülendiğinde global sayacı 1 artır.
 * Hata olursa sadece console.warn yazar, kullanıcıya bir şey gösterme.
 */
export async function incrementGlobalPopularity(calcId) {
  if (!calcId) return;

  try {
    // 1) Var mı diye bak
    const { data: row, error: selectError } = await supabase
      .from(TABLE)
      .select("id, view_count")
      .eq("calc_id", calcId)
      .maybeSingle();

    if (selectError) {
      console.warn("[popularity] select error", selectError);
      return;
    }

    // 2) Yoksa: yeni satır ekle
    if (!row) {
      const { error: insertError } = await supabase
        .from(TABLE)
        .insert({ calc_id: calcId, view_count: 1 });

      if (insertError) {
        console.warn("[popularity] insert error", insertError);
      }
      return;
    }

    // 3) Varsa: view_count + 1
    const { error: updateError } = await supabase
      .from(TABLE)
      .update({ view_count: row.view_count + 1 })
      .eq("id", row.id);

    if (updateError) {
      console.warn("[popularity] update error", updateError);
    }
  } catch (err) {
    console.warn("[popularity] unexpected error", err);
  }
}

/**
 * Tüm hesaplayıcılar için global popülerlik map'i döner.
 * { "kdv": 123, "net-brut-maas": 87, ... }
 */
export async function fetchGlobalPopularity() {
  try {
    const { data, error } = await supabase
      .from(TABLE)
      .select("calc_id, view_count")
      .order("view_count", { ascending: false })
      .limit(50);

    if (error) {
      console.warn("[popularity] fetch error", error);
      return {};
    }

    const map = {};
    for (const row of data || []) {
      map[row.calc_id] = row.view_count;
    }
    return map;
  } catch (err) {
    console.warn("[popularity] unexpected fetch error", err);
    return {};
  }
}
