import { defineStore } from "pinia";

interface Cocktail {
  id: string;
  name: string;
  alcoholic: AlcoholStatus;
  category: string;
  glass: string;
  thumbnail: string;
}

type AlcoholStatus = "Alcoholic" | "Non Alcoholic" | "Optional Alcohol";

interface CocktailApiResponse {
  drinks: CocktailRaw[] | null;
}

interface CocktailRaw {
  idDrink: string;
  strDrink: string;
  strAlcoholic: string;
  strCategory: string;
  strGlass: string;
  strDrinkThumb: string;
}

export const useCocktailStore = defineStore("cocktails", {
  state: () => ({
    cocktails: [] as Cocktail[],
    loading: false,
    error: null as string | null,
    suchbegriff: "margarita",
  }),

  getters: {
    anzahl: (state): number => state.cocktails.length,

    alkoholische: (state): Cocktail[] =>
      state.cocktails.filter((c) => c.alcoholic === "Alcoholic"),

    alkoholfreie: (state): Cocktail[] =>
      state.cocktails.filter((c) => c.alcoholic !== "Alcoholic"),

    hatDaten: (state): boolean => state.cocktails.length > 0,
  },

  actions: {
    mapCocktail(raw: CocktailRaw): Cocktail {
      return {
        id: raw.idDrink,
        name: raw.strDrink,
        alcoholic: raw.strAlcoholic as AlcoholStatus,
        category: raw.strCategory,
        glass: raw.strGlass,
        thumbnail: raw.strDrinkThumb,
      };
    },

    async ladeCocktails(suchbegriff?: string): Promise<void> {
      if (suchbegriff !== undefined) {
        this.suchbegriff = suchbegriff;
      }

      this.loading = true;
      this.error = null;

      try {
        const data = await $fetch<CocktailApiResponse>(
          `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${this.suchbegriff}`,
        );

        this.cocktails = (data.drinks ?? []).map(this.mapCocktail);
      } catch {
        this.error = "API-Fehler: Cocktails konnten nicht geladen werden.";
      } finally {
        this.loading = false;
      }
    },

    zuruecksetzen(): void {
      this.cocktails = [];
      this.suchbegriff = "margarita";
      this.error = null;
    },
  },
});
