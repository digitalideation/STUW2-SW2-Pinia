# Pinia — State Management in Nuxt

Pinia ist der **offizielle State Manager** für Vue 3 und Nuxt.
In diesem Tutorial lernen wir, was Pinia ist, warum man es braucht und wie man es einsetzt — am Beispiel unserer Cocktail-App.

---

## Inhalt

1. [Warum Pinia?](#1-warum-pinia)
2. [Installation](#2-installation)
3. [Konzept: Store, State, Getters, Actions](#3-konzept-store-state-getters-actions)
4. [Vergleich: Composable vs. Pinia Store](#4-vergleich-composable-vs-pinia-store)
5. [Unser Cocktail-Store Schritt für Schritt](#5-unser-cocktail-store-schritt-für-schritt)
6. [Store in einer Seite verwenden](#6-store-in-einer-seite-verwenden)
7. [Getters im Detail](#7-getters-im-detail)
8. [Actions im Detail](#8-actions-im-detail)
9. [Shared State in Aktion](#9-shared-state-in-aktion)
10. [Wann Composable, wann Pinia?](#10-wann-composable-wann-pinia)

---

## 1. Warum Pinia?

### Das Problem

In unserer `typescript.vue` verwenden wir das Composable `useCocktails()`:

```ts
const { cocktails, loading, error, ladeCocktails } = useCocktails();
```

Das funktioniert gut für **eine** Seite. Aber was passiert, wenn:

- **Mehrere Komponenten** auf dieselben Cocktail-Daten zugreifen müssen?
- Eine **Detail-Seite** den aktuell gewählten Cocktail braucht?
- Du den **Suchbegriff beibehalten** willst, wenn der User zwischen Seiten navigiert?

Mit einem Composable wird der State bei jedem Aufruf **neu erstellt** — jede Komponente hat ihre eigene Kopie. Die Daten sind nicht geteilt.

### Die Lösung: Pinia

Pinia bietet einen **zentralen Store**, auf den alle Komponenten zugreifen:

```
┌──────────────────────────────────────────────┐
│                 Pinia Store                   │
│                                               │
│   State:    cocktails, loading, error         │
│   Getters:  anzahl, alkoholische, ...         │
│   Actions:  ladeCocktails(), zuruecksetzen()  │
│                                               │
└──────────┬────────────┬───────────────────────┘
           │            │
     ┌─────▼────┐  ┌────▼─────┐
     │ Seite A  │  │ Seite B  │   ← gleiche Daten!
     └──────────┘  └──────────┘
```

**Vorteile:**

- **Geteilter State**: Alle Komponenten sehen die gleichen Daten
- **Reaktiv**: Änderungen im Store aktualisieren automatisch alle Komponenten
- **DevTools**: Pinia integriert sich in die Vue DevTools (State inspizieren, Time-Travel-Debugging)
- **TypeScript**: Volle Typsicherheit out-of-the-box
- **SSR-kompatibel**: Funktioniert mit Nuxt Server-Side Rendering

---

## 2. Installation

### Schritt 1: Paket installieren

```bash
npm install @pinia/nuxt
```

> `@pinia/nuxt` installiert automatisch `pinia` als Dependency — kein separates `npm install pinia` nötig.

### Schritt 2: Nuxt-Modul registrieren

In `nuxt.config.ts` das Modul eintragen:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@pinia/nuxt"],
  // ... restliche Config
});
```

### Schritt 3: Stores-Ordner anlegen

```bash
mkdir app/stores
```

Nuxt importiert Stores aus `app/stores/` **automatisch** — kein manueller Import nötig.

**Fertig!** Pinia ist einsatzbereit.

---

## 3. Konzept: Store, State, Getters, Actions

Ein Pinia Store hat drei Kernteile:

| Teil        | Was ist das?                   | Vergleich in Vue         |
| ----------- | ------------------------------ | ------------------------ |
| **State**   | Die reaktiven Daten            | `ref()` / `reactive()`   |
| **Getters** | Berechnete Werte aus dem State | `computed()`             |
| **Actions** | Methoden, die den State ändern | Funktionen im `<script>` |

### Visualisierung

```
        ┌───────────────────────────────────────┐
        │              Pinia Store              │
        │                                       │
        │  ┌─────────────────────────────────┐  │
        │  │  STATE (reaktive Daten)         │  │
        │  │  · cocktails: Cocktail[]        │  │
        │  │  · loading: boolean             │  │
        │  │  · error: string | null         │  │
        │  └──────────┬──────────────────────┘  │
        │             │                         │
        │  ┌──────────▼──────────────────────┐  │
        │  │  GETTERS (berechnete Werte)     │  │
        │  │  · anzahl → cocktails.length    │  │
        │  │  · alkoholische → filter(...)   │  │
        │  └─────────────────────────────────┘  │
        │                                       │
        │  ┌─────────────────────────────────┐  │
        │  │  ACTIONS (Methoden)             │  │
        │  │  · ladeCocktails()              │  │
        │  │  · zuruecksetzen()              │  │
        │  └─────────────────────────────────┘  │
        └───────────────────────────────────────┘
```

---

## 4. Vergleich: Composable vs. Pinia Store

Hier ist derselbe Cocktail-Code als **Composable** und als **Pinia Store** nebeneinander:

### Composable (`app/composables/useCocktails.ts`)

```ts
export function useCocktails() {
  // State → ref()
  const cocktails = ref<Cocktail[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Action → normale Funktion
  async function ladeCocktails(suchbegriff: string) {
    loading.value = true;
    // ... API-Aufruf ...
  }

  // Alles manuell returnen
  return { cocktails, loading, error, ladeCocktails };
}
```

### Pinia Store (`app/stores/cocktails.ts`)

```ts
export const useCocktailStore = defineStore("cocktails", {
  // State → Objekt-Funktion
  state: () => ({
    cocktails: [] as Cocktail[],
    loading: false,
    error: null as string | null,
  }),

  // Getters → berechnete Werte (gibt's im Composable nicht automatisch)
  getters: {
    anzahl: (state) => state.cocktails.length,
  },

  // Actions → Methoden mit `this`
  actions: {
    async ladeCocktails(suchbegriff: string) {
      this.loading = true;
      // ... API-Aufruf ...
    },
  },
});
```

### Wichtige Unterschiede

| Aspekt            | Composable                     | Pinia Store                    |
| ----------------- | ------------------------------ | ------------------------------ |
| State definieren  | `ref()` / `reactive()`         | `state: () => ({ ... })`       |
| State lesen       | `variable.value`               | `this.variable` (in Actions)   |
| State in Template | `variable` (auto-unwrap)       | `store.variable`               |
| Getters           | Manuell mit `computed()`       | Eingebaut als `getters: {}`    |
| Async Actions     | Normale `async function`       | `actions: { async fn() {} }`   |
| Geteilt?          | Nein (neue Instanz pro Aufruf) | Ja (Singleton, global geteilt) |
| DevTools          | Nicht sichtbar                 | Voll integriert                |

---

## 5. Unser Cocktail-Store Schritt für Schritt

Datei: `app/stores/cocktails.ts`

### 5.1 Imports und Typen

```ts
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
```

Die Typen sind identisch mit dem Composable — wir verwenden die gleichen Interfaces.

### 5.2 Store definieren

```ts
export const useCocktailStore = defineStore("cocktails", {
  //                                        ^^^^^^^^^^
  //                        eindeutiger Name — wird in DevTools angezeigt
```

`defineStore()` bekommt:

1. Einen **eindeutigen String** als ID (hier `"cocktails"`)
2. Ein **Options-Objekt** mit `state`, `getters`, `actions`

### 5.3 State

```ts
state: () => ({
  cocktails: [] as Cocktail[],
  loading: false,
  error: null as string | null,
  suchbegriff: "margarita",
}),
```

**Wichtig:**

- `state` ist eine **Funktion**, die ein Objekt zurückgibt (ähnlich wie `data()` in der Options API)
- TypeScript braucht manchmal Hilfe: `[] as Cocktail[]` oder `null as string | null`
- Der Suchbegriff ist jetzt **Teil des Stores** — er bleibt beim Seitenwechsel erhalten

### 5.4 Getters

```ts
getters: {
  anzahl: (state): number => state.cocktails.length,

  alkoholische: (state): Cocktail[] =>
    state.cocktails.filter((c) => c.alcoholic === "Alcoholic"),

  alkoholfreie: (state): Cocktail[] =>
    state.cocktails.filter((c) => c.alcoholic !== "Alcoholic"),

  hatDaten: (state): boolean => state.cocktails.length > 0,
},
```

Getters sind wie `computed()` — sie werden **gecached** und nur neu berechnet, wenn sich der zugrundeliegende State ändert.

### 5.5 Actions

```ts
actions: {
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
```

**Wichtig zu Actions:**

- Zugriff auf State mit `this` (nicht `.value`!)
- Können `async` sein (API-Calls etc.)
- Können andere Actions aufrufen (`this.andereAction()`)
- Werden direkt am Store-Objekt aufgerufen: `store.ladeCocktails()`

---

## 6. Store in einer Seite verwenden

Datei: `app/pages/pinia.vue`

### Store initialisieren

```vue
<script setup lang="ts">
// Nuxt importiert automatisch aus app/stores/
const store = useCocktailStore();

// Action aufrufen
await store.ladeCocktails();
</script>
```

**Das war's!** Kein Import nötig — Nuxt erkennt den Store automatisch.

### State im Template nutzen

```vue
<template>
  <!-- State direkt lesen -->
  <p v-if="store.loading">Laden...</p>
  <p v-else-if="store.error">{{ store.error }}</p>

  <!-- v-model auf Store-State -->
  <input v-model="store.suchbegriff" type="text" />

  <!-- Action aufrufen -->
  <button @click="store.ladeCocktails(store.suchbegriff)">Suchen</button>
  <button @click="store.zuruecksetzen()">Zurücksetzen</button>

  <!-- Getters verwenden -->
  <span>{{ store.anzahl }} Ergebnisse</span>
  <span>{{ store.alkoholische.length }} Alkoholisch</span>
  <span>{{ store.alkoholfreie.length }} Alkoholfrei</span>

  <!-- Über State iterieren -->
  <CocktailKartePinia
    v-for="cocktail in store.cocktails"
    :key="cocktail.id"
    :name="cocktail.name"
    :category="cocktail.category"
    :glass="cocktail.glass"
    :thumbnail="cocktail.thumbnail"
    :alcoholic="cocktail.alcoholic"
  />
</template>
```

### Zusammenfassung: Zugriff auf den Store

| Was             | Syntax im Template               | Syntax im Script              |
| --------------- | -------------------------------- | ----------------------------- |
| State lesen     | `store.cocktails`                | `store.cocktails`             |
| State schreiben | `v-model="store.suchbegriff"`    | `store.suchbegriff = "gin"`   |
| Getter lesen    | `store.anzahl`                   | `store.anzahl`                |
| Action aufrufen | `@click="store.ladeCocktails()"` | `await store.ladeCocktails()` |

---

## 7. Getters im Detail

Getters sind **berechnete Werte** — wie `computed()`, aber im Store.

### Einfacher Getter

```ts
getters: {
  anzahl: (state): number => state.cocktails.length,
}
```

Verwendung: `store.anzahl` — **ohne** Klammern (ist ein Property, keine Funktion).

### Getter mit Filter

```ts
getters: {
  alkoholische: (state): Cocktail[] =>
    state.cocktails.filter((c) => c.alcoholic === "Alcoholic"),
}
```

### Getter, der anderen Getter nutzt

```ts
getters: {
  anzahl: (state) => state.cocktails.length,

  // `this` gibt Zugriff auf andere Getters
  zusammenfassung(): string {
    return `${this.anzahl} Cocktails gefunden`;
  },
}
```

> **Achtung:** Wenn ein Getter `this` nutzt, muss er als **normale Funktion** (nicht Arrow-Funktion) geschrieben werden, und den Rückgabetyp explizit angeben.

### Warum Getters statt direkt berechnen?

```vue
<!-- ❌ Ohne Getter: Logik im Template -->
<span>{{ store.cocktails.filter(c => c.alcoholic === 'Alcoholic').length }}</span>

<!-- ✅ Mit Getter: Sauber und gecached -->
<span>{{ store.alkoholische.length }}</span>
```

Getters werden **gecached** — der Filter wird nur neu berechnet, wenn sich `cocktails` ändert. Im Template würde der Filter bei jedem Render neu laufen.

---

## 8. Actions im Detail

Actions sind **Methoden**, die den State verändern.

### Synchrone Action

```ts
actions: {
  zuruecksetzen(): void {
    this.cocktails = [];
    this.suchbegriff = "margarita";
    this.error = null;
  },
}
```

### Asynchrone Action (API-Call)

```ts
actions: {
  async ladeCocktails(suchbegriff?: string): Promise<void> {
    this.loading = true;
    try {
      const data = await $fetch<CocktailApiResponse>(url);
      this.cocktails = (data.drinks ?? []).map(this.mapCocktail);
    } catch {
      this.error = "Fehler beim Laden";
    } finally {
      this.loading = false;
    }
  },
}
```

### Wichtige Regeln

1. **`this` statt `.value`**: In Actions greifst du mit `this.loading` auf den State zu (nicht `loading.value`)
2. **Können async sein**: Perfekt für API-Calls
3. **Können andere Actions aufrufen**: `this.zuruecksetzen()`
4. **Werden direkt aufgerufen**: `store.ladeCocktails()` — nicht `store.actions.ladeCocktails()`

---

## 9. Shared State in Aktion

Der grösste Vorteil von Pinia gegenüber Composables: **der State wird zwischen Seiten geteilt**.

### Das Experiment

1. Öffne `/pinia` und suche nach z.B. "gin"
2. Klicke auf **"Zur Shared-State Demo"** → du landest auf `/pinia-shared`
3. Der Suchbegriff "gin" und alle Ergebnisse sind **noch da**!
4. Ändere den Suchbegriff auf `/pinia-shared` zu "vodka" und suche
5. Gehe zurück zu `/pinia` → "vodka" und die neuen Ergebnisse sind sichtbar

### Warum funktioniert das?

Beide Seiten rufen `useCocktailStore()` auf — und bekommen **dieselbe Instanz**:

```
     useCocktailStore()          useCocktailStore()
           │                           │
           └──────────┬────────────────┘
                      │
              ┌───────▼────────┐
              │  Pinia Store   │
              │                │
              │  suchbegriff   │  ← gleicher Wert auf beiden Seiten!
              │  cocktails     │
              │  loading       │
              └────────────────┘
```

### Der Code: Zweite Seite (`app/pages/pinia-shared.vue`)

```vue
<script setup lang="ts">
const store = useCocktailStore();

// Daten nur laden, falls der User direkt auf diese Seite kommt
if (!store.hatDaten && !store.loading) {
  await store.ladeCocktails();
}
</script>

<template>
  <!-- Gleicher Store, gleiche Daten! -->
  <p>Aktueller Suchbegriff: {{ store.suchbegriff }}</p>
  <p>{{ store.anzahl }} Ergebnisse geladen</p>

  <input v-model="store.suchbegriff" />
  <button @click="store.ladeCocktails(store.suchbegriff)">Suchen</button>
</template>
```

**Zum Vergleich:** Würde man `useCocktails()` (Composable) auf zwei Seiten verwenden, hätte jede Seite ihre **eigene Kopie** — der Suchbegriff würde beim Seitenwechsel verloren gehen.

---

## 10. Wann Composable, wann Pinia?

| Situation                                                  | Empfehlung  |
| ---------------------------------------------------------- | ----------- |
| Lokale Logik für eine Komponente                           | Composable  |
| State muss zwischen Seiten/Komponenten geteilt werden      | Pinia Store |
| Du brauchst DevTools-Integration                           | Pinia Store |
| Einfache wiederverwendbare Logik (z.B. `useMousePosition`) | Composable  |
| Globaler App-State (User, Warenkorb, Theme)                | Pinia Store |
| API-Daten die nur auf einer Seite gebraucht werden         | Composable  |

### Faustregel

> **Composable** = lokale, wiederverwendbare Logik
> **Pinia Store** = globaler, geteilter State

Beide Ansätze schliessen sich nicht aus — du kannst beides in einem Projekt verwenden!

---

## Ausprobieren

1. Starte die App: `npm run dev`
2. Öffne `http://localhost:3000` → Übersichtsseite mit Themenauswahl
3. Wähle "Pinia Store" oder gehe direkt zu `http://localhost:3000/pinia`
4. Vergleiche den Code:
   - Composable: `app/composables/useCocktails.ts` + `app/pages/typescript.vue`
   - Pinia Store: `app/stores/cocktails.ts` + `app/pages/pinia.vue`
5. **Shared State testen:** Suche auf `/pinia` nach etwas, dann klicke auf "Zur Shared-State Demo" → der Suchbegriff und die Ergebnisse sind auf `/pinia-shared` noch vorhanden!
6. Öffne die Vue DevTools (F12 → Vue → Pinia) und beobachte den Store-State live
