<script setup lang="ts">
// ============================================================
// pinia.vue — Cocktail-Suche mit Pinia Store
// Demonstriert: Store verwenden, Getters anzeigen, Actions aufrufen
// Vergleich: typescript.vue nutzt Composable, diese Seite nutzt Pinia
// ============================================================

const store = useCocktailStore();

await store.ladeCocktails();
</script>

<template>
  <main class="m-8">
    <h1 class="mb-2 text-4xl font-bold">Pinia Demo – CocktailDB</h1>
    <p class="mb-6 text-gray-500">
      Gleiche App wie auf der Startseite, aber mit Pinia Store statt Composable
    </p>

    <!-- Suchformular -->
    <form
      class="mb-6 flex gap-2"
      @submit.prevent="store.ladeCocktails(store.suchbegriff)"
    >
      <input
        v-model="store.suchbegriff"
        type="text"
        placeholder="Cocktail suchen…"
        class="rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
      />
      <button
        type="submit"
        class="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Suchen
      </button>
      <button
        type="button"
        class="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
        @click="store.zuruecksetzen()"
      >
        Zurücksetzen
      </button>
    </form>

    <!-- Getter-Anzeige: Statistiken -->
    <div v-if="store.hatDaten" class="mb-6 flex gap-4">
      <span
        class="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
      >
        {{ store.anzahl }} Ergebnisse
      </span>
      <span
        class="rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700"
      >
        {{ store.alkoholische.length }} Alkoholisch
      </span>
      <span
        class="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700"
      >
        {{ store.alkoholfreie.length }} Alkoholfrei
      </span>
    </div>

    <!-- Ladezustand / Fehler -->
    <p v-if="store.loading">Laden...</p>
    <p v-else-if="store.error" class="text-red-600">{{ store.error }}</p>

    <!-- Cocktail-Liste -->
    <section v-else>
      <CocktailKartePinia
        v-for="cocktail in store.cocktails"
        :key="cocktail.id"
        :name="cocktail.name"
        :category="cocktail.category"
        :glass="cocktail.glass"
        :thumbnail="cocktail.thumbnail"
        :alcoholic="cocktail.alcoholic"
      />
    </section>

    <!-- Navigation zwischen Pinia-Seiten (NuxtLink = client-side, State bleibt!) -->
    <div
      class="mt-8 rounded-xl border-2 border-dashed border-purple-300 bg-purple-50 p-4"
    >
      <p class="mb-3 text-sm text-purple-700">
        Nutze diese Links (nicht die Browser-Adressleiste!), damit der State
        erhalten bleibt:
      </p>
      <div class="flex gap-4">
        <NuxtLink
          to="/pinia-shared"
          class="rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
        >
          Zur Shared-State Demo →
        </NuxtLink>
        <NuxtLink
          to="/"
          class="text-purple-600 underline hover:text-purple-800"
        >
          ← Zurück zur Übersicht
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
