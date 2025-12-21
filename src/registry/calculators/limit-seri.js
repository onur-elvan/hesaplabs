export default {
  id: "limit-seri",
  category: "Matematik",
  title: "Limit & Seri (Sayısal Yaklaşım)",
  description:
    "Fonksiyon limiti, dizi limiti veya seri toplamını sayısal yöntemlerle (yakınsama kontrolü + hata uyarılarıyla) hesaplar.",
  seoTitle: "Limit ve Seri Hesaplama – Sayısal Yaklaşım ile",

  seoText: `
Limit ve seri hesaplama aracı, matematiksel fonksiyonların limit ve
seri değerlerini sayısal yöntemlerle yaklaşık olarak hesaplar.

Üniversite seviyesinde matematik çalışan öğrenciler için uygundur.
`.trim(),

  info: {
    title: "Desteklenen ifade örnekleri",
    items: [
      "Limit: f(x) = (sin(x))/x, a = 0  (yaklaşık 1)",
      "Dizi: a(n) = (1 + 1/n)^n  (yaklaşık e)",
      "Seri: a(n) = 1/n^2, n=1..∞  (yaklaşık π^2/6)",
      "Fonksiyonlar: sin, cos, tan, exp, ln, log, sqrt, abs",
      "Sabitler: pi, e  | Değişken: x (limit), n (dizi/seri)",
    ],
    disclaimer:
      "Sayısal yöntemler yaklaşık sonuç verir. Yakınsama yavaş olabilir veya bazı ifadeler sayısal olarak kararsız olabilir.",
  },

  inputs: [
    {
      key: "mode",
      label: "Mod",
      type: "select",
      default: "limit",
      options: [
        { label: "Limit (x → a)", value: "limit" },
        { label: "Dizi Limiti (n → ∞)", value: "sequence" },
        { label: "Seri Toplamı (∑ a(n))", value: "series" },
      ],
    },

    // Limit
    { key: "f", label: "Fonksiyon f(x)", type: "text", default: "sin(x)/x" },
    { key: "a", label: "Yaklaşım noktası a", type: "number", default: 0 },
    {
      key: "side",
      label: "Yaklaşım yönü",
      type: "select",
      default: "both",
      options: [
        { label: "İki taraf (sol+sağ)", value: "both" },
        { label: "Sol (x→a-)", value: "left" },
        { label: "Sağ (x→a+)", value: "right" },
      ],
      advanced: true,
    },
    {
      key: "steps",
      label: "Yaklaşım adımı sayısı",
      type: "number",
      default: 12,
      advanced: true,
      placeholder: "Örn: 10-16",
    },

    // Dizi / Seri
    { key: "an", label: "Terim a(n)", type: "text", default: "1/n^2" },
    {
      key: "n0",
      label: "Başlangıç n (dizi/seri)",
      type: "number",
      default: 1,
      advanced: true,
    },
    {
      key: "nMax",
      label: "Maksimum n (dizi/seri)",
      type: "number",
      default: 20000,
      advanced: true,
    },

    // Seri özel
    {
      key: "tol",
      label: "Yakınsama toleransı",
      type: "number",
      default: 1e-8,
      advanced: true,
      placeholder: "Örn: 1e-6 / 1e-8",
    },
    {
      key: "accel",
      label: "Hızlandırma (Aitken Δ²)",
      type: "select",
      default: "on",
      options: [
        { label: "Açık (önerilir)", value: "on" },
        { label: "Kapalı", value: "off" },
      ],
      advanced: true,
    },
  ],

  compute(v) {
    const mode = v.mode;

    try {
      if (mode === "limit") return computeLimit(v);
      if (mode === "sequence") return computeSequenceLimit(v);
      return computeSeries(v);
    } catch (e) {
      return { Hata: e?.message || String(e) };
    }
  },
};

// -------------------- LIMIT (x -> a) --------------------
function computeLimit(v) {
  const expr = (v.f || "").trim();
  const a = toNum(v.a);
  let steps = Math.trunc(toNum(v.steps) || 12);
  steps = clampInt(steps, 6, 25);
  const side = v.side || "both";

  if (!expr) return { Hata: "Fonksiyon f(x) boş olamaz." };
  if (!Number.isFinite(a)) return { Hata: "a geçerli bir sayı olmalı." };

  const f = compileExpression(expr, "x");

  // adaptif h dizisi: a ± 10^{-k}
  // ayrıca scale ile a'nın büyüklüğüne göre normalize
  const scale = Math.max(1, Math.abs(a));
  const hs = [];
  for (let k = 1; k <= steps; k++) hs.push(scale * Math.pow(10, -k));

  const rows = [];
  const leftVals = [];
  const rightVals = [];

  for (const h of hs) {
    const xl = a - h;
    const xr = a + h;

    let fl = null,
      fr = null;

    if (side === "left" || side === "both") fl = safeEval1(f, xl);
    if (side === "right" || side === "both") fr = safeEval1(f, xr);

    rows.push(
      `h=${fmt(h)} | xL=${fmt(xl)} f(xL)=${
        fl == null ? "-" : fmt(fl)
      } | xR=${fmt(xr)} f(xR)=${fr == null ? "-" : fmt(fr)}`
    );

    if (fl != null) leftVals.push(fl);
    if (fr != null) rightVals.push(fr);
  }

  // Son birkaç değere bakarak yakınsama
  const estimateLeft = estimateConvergence(leftVals);
  const estimateRight = estimateConvergence(rightVals);

  let final;
  let status;

  if (side === "left") {
    final = estimateLeft.value;
    status = estimateLeft.status;
  } else if (side === "right") {
    final = estimateRight.value;
    status = estimateRight.status;
  } else {
    // both: sol ve sağ birbirine yakın mı?
    const L = estimateLeft.value;
    const R = estimateRight.value;

    if (!Number.isFinite(L) || !Number.isFinite(R)) {
      final = Number.isFinite(L) ? L : R;
      status = "Güvenilmez: sol/sağ tarafta tanımsız değerler var.";
    } else {
      const diff = Math.abs(L - R);
      const tol = 1e-6 * Math.max(1, Math.abs(L), Math.abs(R));
      if (diff <= tol) {
        final = (L + R) / 2;
        status = `Yakınsıyor: sol/sağ uyumlu (|L-R|≈${fmt(diff)}).`;
      } else {
        final = NaN;
        status = `Muhtemelen limit yok: sol≈${fmt(L)} sağ≈${fmt(
          R
        )} (fark büyük).`;
      }
    }
  }

  return {
    Mod: "Limit (x→a)",
    "f(x)": expr,
    a: a,
    Yaklaşım: sideLabel(side),
    "Tahmini Limit": Number.isFinite(final) ? fmt(final) : "Belirsiz / yok",
    Durum: status,
    "Adımlar (özet)":
      rows.slice(0, 8).join("\n") +
      (rows.length > 8 ? "\n... (devamı için adım sayısını artır)" : ""),
    Not: "Bu yöntem sayısal yaklaşım kullanır. Yakında tanımsızlık/çıkarma hatası (cancellation) varsa sonuç kararsız olabilir.",
  };
}

function sideLabel(side) {
  return { both: "İki taraf", left: "Sol", right: "Sağ" }[side] || "İki taraf";
}

// -------------------- SEQUENCE LIMIT (n -> ∞) --------------------
function computeSequenceLimit(v) {
  const expr = (v.an || "").trim();
  let n0 = Math.trunc(toNum(v.n0) || 1);
  let nMax = Math.trunc(toNum(v.nMax) || 20000);

  n0 = clampInt(n0, 1, 1e9);
  nMax = clampInt(nMax, Math.max(n0 + 10, 50), 2_000_000);

  if (!expr) return { Hata: "a(n) boş olamaz." };

  const an = compileExpression(expr, "n");

  // n değerlerini log-spaced seç: yakınsama davranışını daha iyi görür
  const samples = makeNSamples(n0, nMax, 24);

  const vals = [];
  const rows = [];

  for (const n of samples) {
    const y = safeEval1(an, n);
    vals.push(y);
    rows.push(`n=${n} -> a(n)=${fmt(y)}`);
  }

  const est = estimateConvergence(vals);

  return {
    Mod: "Dizi Limiti (n→∞)",
    "a(n)": expr,
    "n aralığı": `${n0} .. ${nMax}`,
    "Tahmini Limit": Number.isFinite(est.value)
      ? fmt(est.value)
      : "Belirsiz / yok",
    Durum: est.status,
    "Örnek değerler":
      rows.slice(0, 10).join("\n") + (rows.length > 10 ? "\n..." : ""),
    Not: "Dizinin limiti çok yavaş yakınsıyorsa nMax büyütmek gerekebilir. Salınım varsa limit olmayabilir.",
  };
}

function makeNSamples(n0, nMax, k) {
  const out = [];
  const logA = Math.log(n0);
  const logB = Math.log(nMax);
  for (let i = 0; i < k; i++) {
    const t = i / (k - 1);
    const n = Math.max(n0, Math.round(Math.exp(logA + t * (logB - logA))));
    if (!out.includes(n)) out.push(n);
  }
  return out;
}

// -------------------- SERIES SUM (Σ a(n)) --------------------
function computeSeries(v) {
  const expr = (v.an || "").trim();
  let n0 = Math.trunc(toNum(v.n0) || 1);
  let nMax = Math.trunc(toNum(v.nMax) || 20000);
  const tol = clampPositive(toNum(v.tol) || 1e-8, 1e-14, 1e-2);
  const accelOn = (v.accel || "on") === "on";

  n0 = clampInt(n0, 1, 1e9);
  nMax = clampInt(nMax, Math.max(n0 + 50, 200), 2_000_000);

  if (!expr) return { Hata: "a(n) boş olamaz." };

  const an = compileExpression(expr, "n");

  // 1) Basit yakınsama kontrolü: terimler -> 0 mı?
  // İlk ve son birkaç terimi kıyaslayalım
  const t1 = safeEval1(an, n0);
  const t2 = safeEval1(an, n0 + 1);
  const tLast = safeEval1(an, nMax);

  // 2) Toplama: Kahan summation (floating error azaltır)
  let sum = 0;
  let c = 0; // Kahan correction
  const partials = []; // kısmi toplam örnekleri

  // Yakınsamayı tespit etmek için: art arda 5 kez değişim < tol
  let stableCount = 0;
  let lastShown = null;

  // Aitken Δ² için son 3 kısmi toplam tut
  const S = [];

  for (let n = n0; n <= nMax; n++) {
    const term = safeEval1(an, n);

    // Eğer term NaN/inf ise dur
    if (!Number.isFinite(term)) {
      return {
        Mod: "Seri Toplamı (∑ a(n))",
        "a(n)": expr,
        Durum: `n=${n} için terim tanımsız/sonsuz çıktı.`,
        Not: "Seri bu aralıkta değerlendirilemedi.",
      };
    }

    // Kahan
    const y = term - c;
    const t = sum + y;
    c = t - sum - y;
    sum = t;

    // örnek kısmi toplamları kaydet
    if (n === n0 || n === n0 + 1 || n === n0 + 2)
      partials.push(`S_${n}= ${fmt(sum)} (terim ${fmt(term)})`);
    if (n % Math.max(50, Math.floor((nMax - n0) / 10)) === 0)
      partials.push(`S_${n}= ${fmt(sum)}`);

    // yakınsama ölçümü
    if (lastShown != null) {
      const delta = Math.abs(sum - lastShown);
      if (delta < tol * Math.max(1, Math.abs(sum))) stableCount++;
      else stableCount = 0;
    }
    lastShown = sum;

    // Aitken hızlandırma
    if (accelOn) {
      S.push(sum);
      if (S.length > 3) S.shift();
      if (S.length === 3) {
        const a0 = S[0],
          a1 = S[1],
          a2 = S[2];
        const ait = aitken(a0, a1, a2);
        // Aitken geçerliyse yakınsama sayacına da katkı sağlasın
        if (Number.isFinite(ait)) {
          const deltaA = Math.abs(ait - a2);
          if (deltaA < tol * Math.max(1, Math.abs(ait))) stableCount++;
        }
      }
    }

    // yeterince stabil olduysa erken çık
    if (stableCount >= 5 && n > n0 + 20) {
      const aitVal = accelOn && S.length === 3 ? aitken(S[0], S[1], S[2]) : NaN;
      const best = Number.isFinite(aitVal) ? aitVal : sum;

      return {
        Mod: "Seri Toplamı (∑ a(n))",
        "a(n)": expr,
        "n aralığı": `${n0} .. ${n}`,
        "Yaklaşık Toplam": fmt(best),
        Durum: `Yakınsıyor (tolerans ${tol}).`,
        "Kısmi toplamlar":
          partials.slice(0, 12).join("\n") +
          (partials.length > 12 ? "\n..." : ""),
        Hızlandırma: accelOn ? "Aitken Δ² açık" : "Kapalı",
        Not: "Bu sonuç, seçilen tolerans ve n aralığına göre yaklaşık. Yakınsama yavaşsa nMax artırılabilir.",
      };
    }
  }

  // nMax’e kadar geldik; sonucu raporla
  const aitVal = accelOn && S.length === 3 ? aitken(S[0], S[1], S[2]) : NaN;
  const best = Number.isFinite(aitVal) ? aitVal : sum;

  // Divergence işaretleri: terimler sıfıra gitmiyor veya kısmi toplam büyüyor
  let status = "Belirsiz: nMax sınırına ulaşıldı.";
  const termToZero = Math.abs(tLast) < 1e-6 * Math.max(1, Math.abs(t1));
  if (!termToZero) status = "Muhtemelen ıraksıyor: a(n) → 0 görünmüyor.";
  if (Math.abs(best) > 1e12)
    status = "Muhtemelen ıraksıyor: kısmi toplam çok büyüdü.";

  return {
    Mod: "Seri Toplamı (∑ a(n))",
    "a(n)": expr,
    "n aralığı": `${n0} .. ${nMax}`,
    "Yaklaşık Toplam": fmt(best),
    Durum: status,
    "Kısmi toplamlar":
      partials.slice(0, 12).join("\n") + (partials.length > 12 ? "\n..." : ""),
    Hızlandırma: accelOn ? "Aitken Δ² açık" : "Kapalı",
    Not: "Serilerde yakınsama çok yavaş olabilir. Toleransı büyütmek veya nMax artırmak gerekebilir.",
  };
}

function aitken(s0, s1, s2) {
  // Aitken Δ²: s_hat = s0 - (Δs0)^2 / (Δ^2 s0)
  const d1 = s1 - s0;
  const d2 = s2 - 2 * s1 + s0;
  if (Math.abs(d2) < 1e-14) return NaN;
  return s0 - (d1 * d1) / d2;
}

// -------------------- convergence estimator (robust-ish) --------------------
function estimateConvergence(vals) {
  const clean = vals.filter((x) => Number.isFinite(x));
  if (clean.length < 6)
    return { value: clean[clean.length - 1] ?? NaN, status: "Yetersiz veri." };

  // son 5 değer
  const last = clean.slice(-5);
  const v = last[last.length - 1];

  // salınım kontrolü: işaret değişimi veya büyük zigzag
  let zigzag = 0;
  for (let i = 2; i < last.length; i++) {
    const d1 = last[i - 1] - last[i - 2];
    const d2 = last[i] - last[i - 1];
    if (d1 * d2 < 0) zigzag++;
  }

  // yakınsama: ardışık farklar küçülüyor mu?
  const diffs = [];
  for (let i = 1; i < last.length; i++)
    diffs.push(Math.abs(last[i] - last[i - 1]));
  const maxDiff = Math.max(...diffs);
  const minDiff = Math.min(...diffs);

  const rel = maxDiff / Math.max(1, Math.abs(v));

  if (zigzag >= 2 && rel > 1e-4) {
    return {
      value: v,
      status: "Salınım var: limit olmayabilir veya çok yavaş yakınsıyor.",
    };
  }
  if (rel < 1e-6 && minDiff <= maxDiff) {
    return {
      value: v,
      status: "Yakınsıyor (son adımlarda değişim çok küçük).",
    };
  }
  if (rel < 1e-4) {
    return {
      value: v,
      status: "Muhtemelen yakınsıyor (daha fazla adım gerekebilir).",
    };
  }
  return {
    value: v,
    status: "Belirsiz: değişim büyük, daha fazla örnek gerekebilir.",
  };
}

// -------------------- utils --------------------
function toNum(v) {
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}
function clampInt(x, a, b) {
  if (!Number.isFinite(x)) return a;
  return Math.min(b, Math.max(a, x));
}
function clampPositive(x, a, b) {
  if (!Number.isFinite(x)) return a;
  return Math.min(b, Math.max(a, x));
}
function fmt(x) {
  if (!Number.isFinite(x)) return String(x);
  const ax = Math.abs(x);
  if ((ax !== 0 && ax < 1e-8) || ax >= 1e8) return x.toExponential(8);
  return Math.round((x + Number.EPSILON) * 1e10) / 1e10;
}
function safeEval1(fn, t) {
  const y = fn(t);
  if (!Number.isFinite(y))
    throw new Error("İfade bu noktada tanımsız/sonsuz: " + t);
  return y;
}

// -------------------- expression compiler (NO eval) --------------------
// Destek: + - * / ^, parantez, unary -, fonksiyonlar: sin cos tan exp ln log sqrt abs
// Sabitler: pi, e, değişken: x veya n
function compileExpression(input, variableName) {
  const tokens = tokenize(input);
  const rpn = toRPN(tokens);
  return (t) => evalRPN(rpn, variableName, t);
}

function tokenize(s) {
  const out = [];
  const str = s.replace(/\s+/g, "");
  let i = 0;

  const isDigit = (c) => c >= "0" && c <= "9";
  const isAlpha = (c) =>
    (c >= "a" && c <= "z") || (c >= "A" && c <= "Z") || c === "_";

  while (i < str.length) {
    const c = str[i];

    if (isDigit(c) || (c === "." && isDigit(str[i + 1]))) {
      let j = i + 1;
      while (j < str.length && (isDigit(str[j]) || str[j] === ".")) j++;
      const num = Number(str.slice(i, j));
      if (!Number.isFinite(num)) throw new Error("Sayı okunamadı");
      out.push({ type: "num", value: num });
      i = j;
      continue;
    }

    if (isAlpha(c)) {
      let j = i + 1;
      while (j < str.length && (isAlpha(str[j]) || isDigit(str[j]))) j++;
      out.push({ type: "id", value: str.slice(i, j) });
      i = j;
      continue;
    }

    if ("+-*/^()".includes(c)) {
      out.push({ type: "op", value: c });
      i++;
      continue;
    }

    throw new Error("Geçersiz karakter: " + c);
  }

  return out;
}

function toRPN(tokens) {
  const output = [];
  const stack = [];

  const funcs = new Set([
    "sin",
    "cos",
    "tan",
    "exp",
    "ln",
    "log",
    "sqrt",
    "abs",
  ]);
  const prec = { "+": 1, "-": 1, "*": 2, "/": 2, "^": 3, "u-": 4 };
  const rightAssoc = { "^": true, "u-": true };

  let prev = null;

  for (const t of tokens) {
    if (t.type === "num") {
      output.push(t);
      prev = t;
      continue;
    }

    if (t.type === "id") {
      const name = t.value.toLowerCase();
      if (name === "x" || name === "n" || name === "pi" || name === "e") {
        output.push({ type: "id", value: name });
      } else if (funcs.has(name)) {
        stack.push({ type: "func", value: name });
      } else {
        throw new Error("Bilinmeyen isim: " + t.value);
      }
      prev = t;
      continue;
    }

    const v = t.value;

    if (v === "(") {
      stack.push(t);
      prev = t;
      continue;
    }

    if (v === ")") {
      while (stack.length && stack[stack.length - 1].value !== "(")
        output.push(stack.pop());
      if (!stack.length) throw new Error("Parantez hatası");
      stack.pop();
      if (stack.length && stack[stack.length - 1].type === "func")
        output.push(stack.pop());
      prev = t;
      continue;
    }

    let op = v;
    if (
      op === "-" &&
      (!prev ||
        (prev.type === "op" && prev.value !== ")") ||
        prev.value === "(")
    )
      op = "u-";

    if ("+-*/^".includes(v) || op === "u-") {
      while (
        stack.length &&
        (stack[stack.length - 1].type === "op" ||
          stack[stack.length - 1].type === "func") &&
        stack[stack.length - 1].value !== "("
      ) {
        const top = stack[stack.length - 1];
        if (top.type === "func") {
          output.push(stack.pop());
          continue;
        }
        const pTop = prec[top.value];
        const pCur = prec[op];
        if (pTop > pCur || (pTop === pCur && !rightAssoc[op]))
          output.push(stack.pop());
        else break;
      }
      stack.push({ type: "op", value: op });
      prev = t;
      continue;
    }

    throw new Error("Operatör hatası: " + v);
  }

  while (stack.length) {
    const x = stack.pop();
    if (x.value === "(" || x.value === ")") throw new Error("Parantez hatası");
    output.push(x);
  }
  return output;
}

function evalRPN(rpn, variableName, t) {
  const stack = [];
  for (const tok of rpn) {
    if (tok.type === "num") stack.push(tok.value);
    else if (tok.type === "id") {
      const name = tok.value;
      if (name === "pi") stack.push(Math.PI);
      else if (name === "e") stack.push(Math.E);
      else if (name === "x" || name === "n") {
        if (name !== variableName) {
          // diğer değişken kullanılmasın
          throw new Error(
            `İfade sadece "${variableName}" değişkenini kullanmalı.`
          );
        }
        stack.push(t);
      } else throw new Error("Bilinmeyen değişken: " + name);
    } else if (tok.type === "func") {
      const a = stack.pop();
      stack.push(applyFunc(tok.value, a));
    } else if (tok.type === "op") {
      if (tok.value === "u-") {
        const a = stack.pop();
        stack.push(-a);
      } else {
        const b = stack.pop();
        const a = stack.pop();
        stack.push(applyOp(tok.value, a, b));
      }
    } else {
      throw new Error("RPN hata");
    }
  }
  if (stack.length !== 1) throw new Error("İfade çözümlenemedi");
  return stack[0];
}

function applyFunc(name, a) {
  switch (name) {
    case "sin":
      return Math.sin(a);
    case "cos":
      return Math.cos(a);
    case "tan":
      return Math.tan(a);
    case "exp":
      return Math.exp(a);
    case "ln":
      return Math.log(a);
    case "log":
      return Math.log10(a);
    case "sqrt":
      return Math.sqrt(a);
    case "abs":
      return Math.abs(a);
    default:
      throw new Error("Bilinmeyen fonksiyon: " + name);
  }
}
function applyOp(op, a, b) {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return a / b;
    case "^":
      return Math.pow(a, b);
    default:
      throw new Error("Bilinmeyen operatör: " + op);
  }
}
