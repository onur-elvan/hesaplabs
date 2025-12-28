<template>
  <main class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <h1 class="text-2xl sm:text-3xl font-semibold text-slate-900 mb-4">
      Bizimle İletişime Geçin
    </h1>

    <p class="text-slate-600 mb-8">
      Öneri, geri bildirim, hata bildirimi veya iş birliği için aşağıdaki formu
      kullanabilirsiniz. Mesajınız Netlify Forms üzerinden güvenli bir şekilde
      iletilir.
    </p>

    <!-- 🛡 Netlify Forms + JS submit -->
    <form
      name="iletisim"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      data-netlify-recaptcha="true"
      @submit.prevent="handleSubmit"
      class="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4"
    >
      <!-- Netlify'nin formu tanıyabilmesi için zorunlu -->
      <input type="hidden" name="form-name" value="iletisim" />

      <!-- Honeypot alan (bot tuzağı, gizli kalıyor) -->
      <p class="hidden">
        <label>
          Bot musun?
          <input name="bot-field" v-model="form.botField" />
        </label>
      </p>

      <div class="grid gap-4 sm:grid-cols-2">
        <!-- Ad -->
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-1">
            Adınız (isteğe bağlı)
          </label>
          <input
            name="name"
            type="text"
            v-model="form.name"
            class="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Adınızı buraya yazabilirsiniz"
          />
        </div>

        <!-- E-posta -->
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-1">
            E-posta adresiniz <span class="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            v-model="form.email"
            class="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="ornek@mail.com"
          />
        </div>

        <!-- Konu -->
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-1">
            Konu (isteğe bağlı)
          </label>
          <input
            name="subject"
            type="text"
            v-model="form.subject"
            class="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Örn: Hata bildirimi, öneri, iş birliği..."
          />
        </div>

        <!-- Mesaj -->
        <div class="sm:col-span-2">
          <label class="block text-sm font-medium text-slate-700 mb-1">
            Mesajınız <span class="text-red-500">*</span>
          </label>
          <textarea
            name="message"
            rows="6"
            required
            v-model="form.message"
            class="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
            placeholder="Bize iletmek istediğiniz her şeyi buraya yazabilirsiniz."
          ></textarea>
        </div>
      </div>

      <!-- 🧩 reCAPTCHA alanı (Netlify burada widget oluşturur) -->
      <div class="pt-2">
        <div data-netlify-recaptcha="true"></div>
      </div>

      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4"
      >
        <p class="text-xs text-slate-500">
          Bu form üzerinden gönderdiğiniz bilgiler yalnızca size geri dönüş
          yapmak için kullanılır.
        </p>

        <button
          type="submit"
          :disabled="isSubmitting"
          class="inline-flex items-center justify-center px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        >
          <span v-if="!isSubmitting">Gönder</span>
          <span v-else>Gönderiliyor...</span>
        </button>
      </div>
    </form>
  </main>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  name: "",
  email: "",
  subject: "",
  message: "",
  botField: "", // honeypot
});

const isSubmitting = ref(false);

function encode(data) {
  return Object.keys(data)
    .map(
      (key) =>
        encodeURIComponent(key) + "=" + encodeURIComponent(data[key] ?? "")
    )
    .join("&");
}

const handleSubmit = async (event) => {
  // Bot doldurduysa hiçbir şey yapma
  if (form.botField) return;

  isSubmitting.value = true;

  try {
    const formEl = event.target;

    await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": formEl.getAttribute("name"),
        ...form,
      }),
    });

    // 🟢 Başarılıysa Vue router ile teşekkür sayfasına git
    router.push("/iletisim-tesekkur");
  } catch (err) {
    console.error("Form gönderilirken hata:", err);
    alert("Mesajınız gönderilirken bir hata oluştu. Lütfen tekrar deneyin.");
  } finally {
    isSubmitting.value = false;
  }
};
</script>
