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
import DiziHesaplayici from "./dizi-hesaplayici.js";
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
import DikUcgenCozucu from "./dik-ucgen-cozucu.js";
import UcgenCozucu from "./ucgen-cozucu.js";
import KlimaBTU from "./klima-btu.js";
import iban from "./iban.js";
import netBrutMaas from "./net-brut-maas.js";
import maasArtisiNet from "./maas-artisi-net.js";
import saatlikAylikMaas from "./saatlik-aylik-maas.js";
import krediBasinaNot from "./kredi-basina-not.js";
import fizikHizYolZaman from "./fizik-hiz-yol-zaman.js";
import primliMaas from "./primli-maas.js";
import dalgaBoyuFrekansEnerjiGrafik from "./dalga-boyu-frekans-enerji-grafik.js";
import yillikIsverenMaliyeti from "./yillik-isveren-maliyeti.js";
import partTimeMaas from "./part-time-maas.js";
import ihbarKidem from "./ihbar-kidem.js";
import molHesaplama from "./mol-hesaplama.js";
import xyGrafik from "./xy-grafik.js";
import hizZamanGrafik from "./hiz-zaman-grafik.js";
import yuzdeDerisim from "./yuzde-derisim.js";
import molKutleDonusum from "./mol-kutle-donusum.js";
import parabolCiziciGrafik from "./parabol-cizici-grafik.js";
import phHesaplama from "./ph-hesaplama.js";
import sinusKosinusGrafik from "./sinus-kosinus-grafik.js";
import fonksiyonTurevIntegralGrafik from "./fonksiyon-turev-integral-grafik.js";
import hizZamanIvme from "./hiz-zaman-ivme.js";
import genelAlanTrapez from "./genel-alan-trapez.js";
import polinomKokBulmaGrafik from "./polinom-kok-bulma-grafik.js";
import parcalıFonksiyonGrafik from "./parcalı-fonksiyon-grafik.js";
import BasitHarmonikHareket from "./basit-harmonik-hareket.js";
import Carpisma1D from "./carpisma-1d.js";
import logaritmaGrafik from "./logaritma-grafik.js";
import mutlakDegerGrafik from "./mutlak-deger-grafik.js";
import DikeyAtisSerbestDusme from "./dikey-atis-serbest-dusme.js";
import DonmeHareketi from "./donme-hareketi.js";
import dogruGrafik from "./dogru-grafik.js";
import UsluLogHesaplayici from "./uslu-log-hesaplayici.js";
import MutlakDegerDenklemEsitsizlik from "./mutlak-deger-denklem-esitsizlik.js";
import EgikAtis from "./egik-atis.js";
import Momentum from "./momentum.js";
import IsGucZaman from "./is-guc-zaman.js";
import KuvvetKutleIvme from "./kuvvet-kutle-ivme.js";
// burada senin ekleyeceğin diğerleri de olacak:
// import stopaj from "./stopaj"; gibi

export const calculators = [
  kdv,
  hizZamanGrafik,
  UsluLogHesaplayici,
  BasitHarmonikHareket,
  DikeyAtisSerbestDusme,
  DonmeHareketi,
  Carpisma1D,
  IsGucZaman,
  EgikAtis,
  dogruGrafik,
  Momentum,
  logaritmaGrafik,
  mutlakDegerGrafik,
  MutlakDegerDenklemEsitsizlik,
  UcgenCozucu,
  parcalıFonksiyonGrafik,
  polinomKokBulmaGrafik,
  genelAlanTrapez,
  fonksiyonTurevIntegralGrafik,
  hizZamanIvme,
  sinusKosinusGrafik,
  parabolCiziciGrafik,
  KuvvetKutleIvme,
  dalgaBoyuFrekansEnerjiGrafik,
  molKutleDonusum,
  phHesaplama,
  yuzdeDerisim,
  xyGrafik,
  molHesaplama,
  ihbarKidem,
  partTimeMaas,
  primliMaas,
  yillikIsverenMaliyeti,
  LimitSeri,
  maasArtisiNet,
  saatlikAylikMaas,
  krediBasinaNot,
  fizikHizYolZaman,
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
  DikUcgenCozucu,
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
  DiziHesaplayici,
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
/** ------- Popular (En çok ziyaret edilenler) ------- */
const POP_KEY = "calculator_popularity_v1";

// { [id]: count }
export function getPopularityMap() {
  try {
    return JSON.parse(localStorage.getItem(POP_KEY) || "{}");
  } catch {
    return {};
  }
}

export function bumpPopularity(id) {
  const map = getPopularityMap();
  map[id] = (map[id] || 0) + 1;
  localStorage.setItem(POP_KEY, JSON.stringify(map));
  return map;
}

export function clearPopularity() {
  localStorage.removeItem(POP_KEY);
  return {};
}
