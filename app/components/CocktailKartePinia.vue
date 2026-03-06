<script setup lang="ts">
// ============================================================
// CocktailKartePinia.vue
// Gleiche Darstellung wie CocktailKarte.vue,
// aber liest Daten direkt aus dem Pinia Store
// Demonstriert: Store in Komponente verwenden
// ============================================================

interface Props {
  name: string;
  category: string;
  glass: string;
  thumbnail: string;
  alcoholic: string;
}

const props = defineProps<Props>();
</script>

<template>
  <div class="mb-3 flex items-center gap-4 rounded-lg border border-gray-200 p-3">
    <img :src="props.thumbnail" :alt="props.name" class="h-16 w-16 rounded-md object-cover" />
    <div>
      <h3 class="font-bold">{{ props.name }}</h3>
      <p class="text-sm text-gray-500">{{ props.category }} · {{ props.glass }}</p>
      <span
        :class="[
          'mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-semibold',
          props.alcoholic === 'Alcoholic'
            ? 'bg-red-100 text-red-700'
            : 'bg-green-100 text-green-700',
        ]"
      >
        {{ props.alcoholic }}
      </span>
    </div>
  </div>
</template>
