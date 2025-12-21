import kdv from "./kdv.js";
import faizBasit from "./faiz-basit.js";
import faizBilesik from "./faiz-bilesik.js";
import yuzdeArtis from "./yuzde-artis.js";
import tarihFark from "./tarih-fark.js";
import zamIndirim from "./zam-indirim.js";
import ortalama from "./ortalama.js";
import karMarj from "./kar-marj.js";
import stopaj from "./stopaj.js";
import damga from "./damga.js";
import OranOranti from "./oran-oranti.js";
import EbobEkok from "./ebob-ekok.js";
import IkinciDerece from "./ikinci-derece.js";
import Istatistik from "./istatistik.js";
import GeometriAlanCevre from "./geometri-alan-cevre.js";
import Hacim from "./hacim.js";
import KombPerm from "./kombinasyon-permutasyon.js";
import BirimDonusturucu from "./birim-donusturucu.js";
import BMI from "./bmi.js";
import BMRTDEE from "./bmr-tdee.js";
import SuIhtiyaci from "./su-ihtiyaci.js";
import BelKalcaOrani from "./bel-kalca-orani.js";
import VucutYagOrani from "./vucut-yag-orani.js";
import vizeFinal from "./vize-final.js";
import takdirTesekkur from "./takdir-tesekkur.js";
import dersNotu from "./ders-notu.js";
import kpss from "./kpss.js";
import tyt from "./tyt.js";
import ales from "./ales.js";
import SayisalKalkulus from "./sayisal-kalkulus.js";
import LimitSeri from "./limit-seri.js";
import MatrisTersDet from "./matris-ters-determinant.js";
import LineerSistem from "./lineer-sistem-cozucu.js";
import framinghamRisk from "./framingham-risk.js";
import ETicaretKarlilik from "./e-ticaret-karlilik.js";
import KlimaBTU from "./klima-btu.js";
import iban from "./iban.js";
import netBrutMaas from "./net-brut-maas.js";

// burada senin ekleyeceğin diğerleri de olacak:
// import stopaj from "./stopaj"; gibi

export const calculators = [
  kdv,
  LimitSeri,
  iban,
  faizBasit,
  faizBilesik,
  MatrisTersDet,
  LineerSistem,
  SayisalKalkulus,
  netBrutMaas,
  framinghamRisk,
  ETicaretKarlilik,
  KlimaBTU,
  yuzdeArtis,
  tarihFark,
  zamIndirim,
  ales,
  ortalama,
  karMarj,
  stopaj,
  damga,
  OranOranti,
  EbobEkok,
  IkinciDerece,
  Istatistik,
  tyt,
  GeometriAlanCevre,
  Hacim,
  KombPerm,
  BirimDonusturucu,
  SuIhtiyaci,
  BMI,
  BMRTDEE,
  BelKalcaOrani,
  VucutYagOrani,
  vizeFinal,
  takdirTesekkur,
  dersNotu,
  kpss,
];

export function findCalculatorById(id) {
  return calculators.find((c) => c.id === id) || null;
}

/** ------- Recent (Son Kullanılanlar) ------- */
const RECENT_KEY = "recent_calculators_v1";

export function getRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

export function addRecent(id) {
  const list = getRecent().filter((x) => x !== id);
  list.unshift(id);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 10)));
}

/** ------- Favorites (Favoriler) ------- */
/** ------- Favorites (Favoriler) ------- */
const FAV_KEY = "favorite_calculators_v1";

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleFavorite(id) {
  const set = new Set(getFavorites());
  if (set.has(id)) set.delete(id);
  else set.add(id);
  localStorage.setItem(FAV_KEY, JSON.stringify([...set]));
  return [...set];
}

// ✅ Son kullanılanları tamamen sıfırla
export function clearRecent() {
  localStorage.removeItem(RECENT_KEY);
  return [];
}

// ✅ Favorileri tamamen sıfırla
export function clearFavorites() {
  localStorage.removeItem(FAV_KEY);
  return [];
}
