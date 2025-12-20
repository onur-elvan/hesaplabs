export default {
  id: "sayisal-kalkulus",
  category: "Matematik",
  title: "Sayısal Türev / İntegral (Adım Adım)",
  description:
    "Fonksiyonu (f(x)) gir; sayısal türev veya sayısal integral sonucu ve kullanılan yöntemin adımlarını gör.",
  info: {
    title: "Desteklenen ifade örnekleri",
    items: [
      "sin(x), cos(x), tan(x), exp(x), ln(x), log(x) (10 taban), sqrt(x), abs(x)",
      "Üs: x^2, (x+1)^(1/2)",
      "Sabitler: pi, e",
      "Örn: sin(x) + x^2/3 - ln(x+2)",
    ],
    disclaimer:
      "Sayısal yöntemler yaklaşık sonuç verir. Adım (h) ve bölme sayısı (n) sonuçları etkiler.",
  },
  seoTitle:
    "Sayısal Türev ve İntegral Hesaplama – Fonksiyon, Adım (h) ve Aralık ile Yaklaşık Sonuç",
  seoText: `
Bu araç sembolik (kapalı form) değil, sayısal (yaklaşık) yöntemlerle türev ve integral hesaplar.
Fonksiyonun karmaşık olduğu veya analitik çözümün zor olduğu durumlarda hızlı tahmin için idealdir.

Sayısal türev:
- Seçtiğin noktada fonksiyonun değişim hızını yaklaşık hesaplar
- İleri fark / geri fark / merkezi fark gibi yöntemler kullanılabilir (hesaplayıcı tasarımına göre)

Sayısal integral:
- Belirlediğin [a, b] aralığında alanı yaklaşık hesaplar
- Dikdörtgen, trapez (yamuk) veya Simpson yöntemi gibi yaklaşımlar kullanılabilir

Daha doğru sonuç için ipuçları:
- Adım (h) çok büyük olursa hata artar
- Adım (h) aşırı küçük olursa yuvarlama hataları büyüyebilir
- Trapez/Simpson genelde basit yöntemlerden daha isabetlidir

Not: Sayısal sonuçlar yaklaşık değerdir; hassas uygulamalarda adım sayısı ve yöntem seçimi dikkatle yapılmalıdır.
`.trim(),

  inputs: [
    {
      key: "expr",
      label: "Fonksiyon f(x)",
      type: "text",
      default: "sin(x) + x^2",
    },

    {
      key: "mode",
      label: "İşlem",
      type: "select",
      default: "derivative",
      options: [
        { label: "Türev (f'(x0))", value: "derivative" },
        { label: "İntegral (∫ f(x) dx)", value: "integral" },
      ],
    },

    // türev
    { key: "x0", label: "Türev noktası x0", type: "number", default: 1 },
    {
      key: "dMethod",
      label: "Türev yöntemi",
      type: "select",
      default: "central",
      options: [
        { label: "İleri fark", value: "forward" },
        { label: "Geri fark", value: "backward" },
        { label: "Merkez fark (önerilir)", value: "central" },
        { label: "5-nokta merkez (daha hassas)", value: "five" },
      ],
      advanced: true,
    },
    {
      key: "h",
      label: "Adım (h)",
      type: "number",
      default: 0.001,
      advanced: true,
    },

    // integral
    { key: "a", label: "Alt sınır a", type: "number", default: 0 },
    { key: "b", label: "Üst sınır b", type: "number", default: 3.14159 },
    {
      key: "iMethod",
      label: "İntegral yöntemi",
      type: "select",
      default: "simpson",
      options: [
        { label: "Trapez", value: "trapezoid" },
        { label: "Simpson (önerilir)", value: "simpson" },
      ],
      advanced: true,
    },
    {
      key: "n",
      label: "Bölme sayısı (n)",
      type: "number",
      default: 100,
      advanced: true,
      placeholder: "Simpson için çift olmalı",
    },
  ],

  compute(values) {
    const expr = (values.expr || "").trim();
    if (!expr) return { Hata: "Fonksiyon f(x) boş olamaz." };

    let fn;
    try {
      fn = compileExpression(expr); // güvenli parser
    } catch (e) {
      return { Hata: "İfade çözümlenemedi: " + (e?.message || String(e)) };
    }

    const mode = values.mode;

    if (mode === "derivative") {
      const x0 = toNum(values.x0);
      const h = clampPositive(toNum(values.h) || 0.001, 1e-10, 1e2);
      const m = values.dMethod || "central";

      if (!isFinite(x0)) return { Hata: "x0 geçerli bir sayı olmalı." };

      // f değerleri
      const steps = [];
      const f = (x) => safeEval(fn, x);

      let approx;

      if (m === "forward") {
        // f'(x0) ≈ (f(x0+h) - f(x0))/h
        const fx = f(x0);
        const fxh = f(x0 + h);
        approx = (fxh - fx) / h;

        steps.push(`İleri fark: f'(x0) ≈ (f(x0+h) - f(x0)) / h`);
        steps.push(`x0 = ${x0}, h = ${h}`);
        steps.push(`f(x0) = f(${x0}) = ${fx}`);
        steps.push(`f(x0+h) = f(${x0 + h}) = ${fxh}`);
        steps.push(`≈ (${fxh} - ${fx}) / ${h} = ${approx}`);
      } else if (m === "backward") {
        // f'(x0) ≈ (f(x0) - f(x0-h))/h
        const fx = f(x0);
        const fxh = f(x0 - h);
        approx = (fx - fxh) / h;

        steps.push(`Geri fark: f'(x0) ≈ (f(x0) - f(x0-h)) / h`);
        steps.push(`x0 = ${x0}, h = ${h}`);
        steps.push(`f(x0) = f(${x0}) = ${fx}`);
        steps.push(`f(x0-h) = f(${x0 - h}) = ${fxh}`);
        steps.push(`≈ (${fx} - ${fxh}) / ${h} = ${approx}`);
      } else if (m === "five") {
        // 5-point: f'(x0) ≈ (-f(x0+2h) + 8f(x0+h) - 8f(x0-h) + f(x0-2h)) / (12h)
        const f2p = f(x0 + 2 * h);
        const f1p = f(x0 + h);
        const f1m = f(x0 - h);
        const f2m = f(x0 - 2 * h);
        approx = (-f2p + 8 * f1p - 8 * f1m + f2m) / (12 * h);

        steps.push(
          `5-nokta merkez: f'(x0) ≈ (-f(x0+2h) + 8f(x0+h) - 8f(x0-h) + f(x0-2h)) / (12h)`
        );
        steps.push(`x0 = ${x0}, h = ${h}`);
        steps.push(`f(x0+2h)=f(${x0 + 2 * h})=${f2p}`);
        steps.push(`f(x0+h)=f(${x0 + h})=${f1p}`);
        steps.push(`f(x0-h)=f(${x0 - h})=${f1m}`);
        steps.push(`f(x0-2h)=f(${x0 - 2 * h})=${f2m}`);
        steps.push(
          `≈ (${-f2p} + ${8 * f1p} + ${-8 * f1m} + ${f2m}) / ${
            12 * h
          } = ${approx}`
        );
      } else {
        // central: f'(x0) ≈ (f(x0+h) - f(x0-h)) / (2h)
        const f1p = f(x0 + h);
        const f1m = f(x0 - h);
        approx = (f1p - f1m) / (2 * h);

        steps.push(`Merkez fark: f'(x0) ≈ (f(x0+h) - f(x0-h)) / (2h)`);
        steps.push(`x0 = ${x0}, h = ${h}`);
        steps.push(`f(x0+h)=f(${x0 + h})=${f1p}`);
        steps.push(`f(x0-h)=f(${x0 - h})=${f1m}`);
        steps.push(`≈ (${f1p} - ${f1m}) / ${2 * h} = ${approx}`);
      }

      const out = {
        Yöntem: methodNameDerivative(m),
        "f'(x0) (yaklaşık)": fmtNum(approx),
        Adımlar: steps.join("\n"),
        Not: "h çok büyükse hata artar, çok küçükse yuvarlama hatası artabilir. Genelde 1e-3 ile 1e-5 arası denenir.",
      };
      return out;
    }

    // integral
    const a = toNum(values.a);
    const b = toNum(values.b);
    if (!isFinite(a) || !isFinite(b))
      return { Hata: "a ve b geçerli sayı olmalı." };
    if (a === b) return { Sonuç: 0, Not: "a = b olduğundan integral 0." };

    const iMethod = values.iMethod || "simpson";
    let n = Math.trunc(toNum(values.n) || 100);
    n = clampInt(n, 2, 200000);

    const f = (x) => safeEval(fn, x);

    // Simpson için n çift olmalı
    const steps = [];
    const interval = b - a;
    const h = interval / n;

    if (iMethod === "simpson") {
      if (n % 2 === 1) n += 1; // otomatik düzelt
      const hh = (b - a) / n;

      let sumOdd = 0;
      let sumEven = 0;

      // adım adım için ilk birkaç terimi gösterelim
      const previewTerms = [];

      for (let i = 1; i < n; i++) {
        const x = a + i * hh;
        const fx = f(x);
        if (i % 2 === 0) sumEven += fx;
        else sumOdd += fx;

        if (i <= 6)
          previewTerms.push(
            `i=${i}, x=${fmtNum(x)}, f(x)=${fmtNum(fx)} (${
              i % 2 === 0 ? "çift→2*" : "tek→4*"
            })`
          );
      }

      const fa = f(a);
      const fb = f(b);
      const approx = (hh / 3) * (fa + fb + 4 * sumOdd + 2 * sumEven);

      steps.push(
        `Simpson (n çift): ∫[a,b] f(x) dx ≈ (h/3) [ f(a)+f(b) + 4∑(tek i) f(a+ih) + 2∑(çift i) f(a+ih) ]`
      );
      steps.push(`a=${a}, b=${b}, n=${n}, h=${fmtNum(hh)}`);
      steps.push(`f(a)=f(${a})=${fmtNum(fa)}`);
      steps.push(`f(b)=f(${b})=${fmtNum(fb)}`);
      steps.push(`İlk terimler:\n${previewTerms.join("\n")}`);
      steps.push(
        `Toplam(tek)=${fmtNum(sumOdd)}, Toplam(çift)=${fmtNum(sumEven)}`
      );
      steps.push(
        `≈ (${fmtNum(hh)}/3) * (${fmtNum(fa)} + ${fmtNum(fb)} + 4*${fmtNum(
          sumOdd
        )} + 2*${fmtNum(sumEven)}) = ${fmtNum(approx)}`
      );

      return {
        Yöntem: "Simpson",
        "Bölme sayısı (n)": n,
        "Adım (h)": fmtNum(hh),
        "İntegral (yaklaşık)": fmtNum(approx),
        Adımlar: steps.join("\n"),
        Not: "n büyüdükçe genelde doğruluk artar (çok büyük n’de performans düşer).",
      };
    }

    // Trapez
    const hh = h;
    let sum = 0;

    const previewTerms = [];
    for (let i = 1; i < n; i++) {
      const x = a + i * hh;
      const fx = f(x);
      sum += fx;
      if (i <= 6)
        previewTerms.push(`i=${i}, x=${fmtNum(x)}, f(x)=${fmtNum(fx)}`);
    }

    const fa = f(a);
    const fb = f(b);
    const approx = hh * (0.5 * fa + sum + 0.5 * fb);

    steps.push(
      `Trapez: ∫[a,b] f(x) dx ≈ h [ (f(a)+f(b))/2 + ∑_{i=1..n-1} f(a+ih) ]`
    );
    steps.push(`a=${a}, b=${b}, n=${n}, h=${fmtNum(hh)}`);
    steps.push(`f(a)=f(${a})=${fmtNum(fa)}`);
    steps.push(`f(b)=f(${b})=${fmtNum(fb)}`);
    steps.push(`İlk terimler:\n${previewTerms.join("\n")}`);
    steps.push(`Toplam(orta)=${fmtNum(sum)}`);
    steps.push(
      `≈ ${fmtNum(hh)} * (0.5*${fmtNum(fa)} + ${fmtNum(sum)} + 0.5*${fmtNum(
        fb
      )}) = ${fmtNum(approx)}`
    );

    return {
      Yöntem: "Trapez",
      "Bölme sayısı (n)": n,
      "Adım (h)": fmtNum(hh),
      "İntegral (yaklaşık)": fmtNum(approx),
      Adımlar: steps.join("\n"),
      Not: "Simpson genelde trapezden daha hassastır (pürüzsüz fonksiyonlarda).",
    };
  },
};

// -------------------- formatting & safety --------------------
function fmtNum(x) {
  if (!Number.isFinite(x)) return String(x);
  // çok büyük/çok küçük sayılarda bilimsel gösterim
  const ax = Math.abs(x);
  if ((ax !== 0 && ax < 1e-6) || ax >= 1e6) return x.toExponential(6);
  return Math.round((x + Number.EPSILON) * 1e8) / 1e8;
}
function toNum(v) {
  const n = Number(String(v).replace(",", "."));
  return Number.isFinite(n) ? n : NaN;
}
function clampPositive(x, a, b) {
  if (!Number.isFinite(x)) return a;
  return Math.min(b, Math.max(a, x));
}
function clampInt(x, a, b) {
  if (!Number.isFinite(x)) return a;
  return Math.min(b, Math.max(a, x));
}
function methodNameDerivative(m) {
  return (
    {
      forward: "İleri fark",
      backward: "Geri fark",
      central: "Merkez fark",
      five: "5-nokta merkez",
    }[m] || "Merkez fark"
  );
}
function safeEval(fn, x) {
  const y = fn(x);
  if (!Number.isFinite(y))
    throw new Error("f(x) tanımsız / sonsuz çıktı (x=" + x + ")");
  return y;
}

// -------------------- expression compiler (NO eval) --------------------
// Destek: + - * / ^, parantez, unary -, fonksiyonlar: sin cos tan exp ln log sqrt abs
// Sabitler: pi, e, değişken: x
function compileExpression(input) {
  const tokens = tokenize(input);
  const rpn = toRPN(tokens);
  return (x) => evalRPN(rpn, x);
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

    // number
    if (isDigit(c) || (c === "." && isDigit(str[i + 1]))) {
      let j = i + 1;
      while (j < str.length && (isDigit(str[j]) || str[j] === ".")) j++;
      const num = Number(str.slice(i, j));
      if (!Number.isFinite(num)) throw new Error("Sayı okunamadı");
      out.push({ type: "num", value: num });
      i = j;
      continue;
    }

    // identifier (x, pi, sin, ...)
    if (isAlpha(c)) {
      let j = i + 1;
      while (j < str.length && (isAlpha(str[j]) || isDigit(str[j]))) j++;
      const name = str.slice(i, j);
      out.push({ type: "id", value: name });
      i = j;
      continue;
    }

    // operators / parens / comma
    if ("+-*/^()".includes(c)) {
      out.push({ type: "op", value: c });
      i++;
      continue;
    }

    throw new Error("Geçersiz karakter: " + c);
  }

  return out;
}

// Shunting-yard
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
      if (name === "x" || name === "pi" || name === "e") {
        output.push({ type: "id", value: name });
      } else if (funcs.has(name)) {
        stack.push({ type: "func", value: name });
      } else {
        throw new Error("Bilinmeyen isim: " + t.value);
      }
      prev = t;
      continue;
    }

    // operators and parentheses
    const v = t.value;

    if (v === "(") {
      stack.push(t);
      prev = t;
      continue;
    }

    if (v === ")") {
      while (stack.length && stack[stack.length - 1].value !== "(") {
        output.push(stack.pop());
      }
      if (!stack.length) throw new Error("Parantez hatası");
      stack.pop(); // '('

      // function call
      if (stack.length && stack[stack.length - 1].type === "func") {
        output.push(stack.pop());
      }

      prev = t;
      continue;
    }

    // unary minus detection
    let op = v;
    if (
      op === "-" &&
      (!prev ||
        (prev.type === "op" && prev.value !== ")") ||
        prev.value === "(")
    ) {
      op = "u-";
    }

    if ("+-*/^".includes(v) || op === "u-") {
      while (
        stack.length &&
        (stack[stack.length - 1].type === "op" ||
          stack[stack.length - 1].type === "func") &&
        stack[stack.length - 1].value !== "("
      ) {
        const top = stack[stack.length - 1];
        const topOp = top.type === "func" ? "func" : top.value;

        if (top.type === "func") {
          output.push(stack.pop());
          continue;
        }

        const pTop = prec[top.value];
        const pCur = prec[op];
        if (pTop > pCur || (pTop === pCur && !rightAssoc[op])) {
          output.push(stack.pop());
        } else {
          break;
        }
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

function evalRPN(rpn, x) {
  const stack = [];
  for (const t of rpn) {
    if (t.type === "num") {
      stack.push(t.value);
      continue;
    }
    if (t.type === "id") {
      if (t.value === "x") stack.push(x);
      else if (t.value === "pi") stack.push(Math.PI);
      else if (t.value === "e") stack.push(Math.E);
      else throw new Error("Bilinmeyen değişken: " + t.value);
      continue;
    }
    if (t.type === "func") {
      const a = stack.pop();
      stack.push(applyFunc(t.value, a));
      continue;
    }
    if (t.type === "op") {
      if (t.value === "u-") {
        const a = stack.pop();
        stack.push(-a);
        continue;
      }
      const b = stack.pop();
      const a = stack.pop();
      stack.push(applyOp(t.value, a, b));
      continue;
    }
    throw new Error("RPN hata");
  }
  if (stack.length !== 1) throw new Error("İfade çözümlenemedi (stack)");
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
