<template>
  <main class="m-8 max-w-2xl">
    <h1 class="mb-2 text-4xl font-bold">STUW2 – SW2</h1>
    <p class="mb-8 text-gray-500">Wähle ein Thema aus:</p>

    <div class="grid gap-4">
      <NuxtLink
        to="/pinia"
        class="group rounded-xl border border-gray-200 p-6 transition hover:border-purple-400 hover:shadow-md"
      >
        <h2
          class="mb-1 text-xl font-semibold text-gray-800 group-hover:text-purple-600"
        >
          Pinia Store
        </h2>
        <p class="text-sm text-gray-500">
          Cocktail-Suche mit Pinia — State, Getters, Actions und globaler
          State-Management.
        </p>
      </NuxtLink>

      <NuxtLink
        to="/pinia-shared"
        class="group rounded-xl border border-gray-200 p-6 transition hover:border-green-400 hover:shadow-md"
      >
        <h2
          class="mb-1 text-xl font-semibold text-gray-800 group-hover:text-green-600"
        >
          Pinia Shared State
        </h2>
        <p class="text-sm text-gray-500">
          Zeigt, wie Pinia den State zwischen Seiten teilt — Suchbegriff bleibt
          beim Navigieren erhalten.
        </p>
      </NuxtLink>
    </div>
  </main>
</template>
