<script setup lang="ts">
// ============================================================
// pinia-shared.vue — Zweite Seite mit demselben Pinia Store
// Demonstriert: Geteilter State zwischen Seiten
// Der Suchbegriff und die Ergebnisse bleiben erhalten,
// wenn man zwischen /pinia und /pinia-shared navigiert!
// ============================================================

const store = useCocktailStore();

// Kein await store.ladeCocktails() hier!
// Die Daten wurden bereits auf /pinia geladen und bleiben im Store.
// Falls der User direkt auf diese Seite kommt, laden wir trotzdem:
if (!store.hatDaten && !store.loading) {
  await store.ladeCocktails();
}
</script>

<template>
  <main class="m-8">
    <h1 class="mb-2 text-4xl font-bold">Pinia Shared State</h1>
    <p class="mb-6 text-gray-500">
      Diese Seite zeigt den <strong>gleichen Store</strong> wie /pinia.
      Ändere den Suchbegriff hier oder dort — der State bleibt synchron!
    </p>

    <!-- Aktueller Store-State auf einen Blick -->
    <div class="mb-6 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 p-6">
      <h2 class="mb-3 text-lg font-semibold text-blue-800">
        Store-State (geteilt mit /pinia)
      </h2>

      <div class="grid grid-cols-2 gap-4">
        <div>
          <span class="text-sm text-gray-500">Suchbegriff:</span>
          <p class="text-xl font-bold text-blue-700">« {{ store.suchbegriff }} »</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Anzahl Ergebnisse:</span>
          <p class="text-xl font-bold text-blue-700">{{ store.anzahl }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Alkoholisch:</span>
          <p class="text-xl font-bold text-red-600">{{ store.alkoholische.length }}</p>
        </div>
        <div>
          <span class="text-sm text-gray-500">Alkoholfrei:</span>
          <p class="text-xl font-bold text-green-600">{{ store.alkoholfreie.length }}</p>
        </div>
      </div>
    </div>

    <!-- Suchbegriff auch hier änderbar -->
    <form class="mb-6 flex gap-2" @submit.prevent="store.ladeCocktails(store.suchbegriff)">
      <input
        v-model="store.suchbegriff"
        type="text"
        placeholder="Suchbegriff ändern…"
        class="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
      />
      <button
        type="submit"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Suchen
      </button>
    </form>

    <!-- Ladezustand / Fehler -->
    <p v-if="store.loading">Laden...</p>
    <p v-else-if="store.error" class="text-red-600">{{ store.error }}</p>

    <!-- Cocktail-Namen als kompakte Liste -->
    <section v-else-if="store.hatDaten">
      <h2 class="mb-3 text-lg font-semibold">Gefundene Cocktails</h2>
      <ul class="list-inside list-disc space-y-1">
        <li v-for="cocktail in store.cocktails" :key="cocktail.id">
          {{ cocktail.name }}
          <span class="text-sm text-gray-400">({{ cocktail.alcoholic }})</span>
        </li>
      </ul>
    </section>

    <!-- Navigation zwischen Pinia-Seiten (NuxtLink = client-side, State bleibt!) -->
    <div class="mt-8 rounded-xl border-2 border-dashed border-purple-300 bg-purple-50 p-4">
      <p class="mb-3 text-sm text-purple-700">
        Nutze diese Links (nicht die Browser-Adressleiste!), damit der State erhalten bleibt:
      </p>
      <div class="flex gap-4">
        <NuxtLink
          to="/pinia"
          class="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        >
          ← Zurück zu /pinia (gleicher Store!)
        </NuxtLink>
        <NuxtLink to="/" class="text-purple-600 underline hover:text-purple-800">
          ← Zurück zur Übersicht
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
