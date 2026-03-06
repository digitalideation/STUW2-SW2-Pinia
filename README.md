# STUW2-SW2 — Pinia Storage

Dieses Projekt ist eine Lernumgebung für **Pinia Storage in Nuxt 4**.
Es enthält eine Demo-App (Cocktail-Suche) und begleitende Dokumentation.

---

## Projekt starten

```bash
npm install
npm run dev
```

Die App läuft auf `http://localhost:3000`.

---

## Projektstruktur

```
app/
  components/        → Vue-Komponenten (z.B. CocktailKartePinia.vue)
  stores/            → Pinia Stores (z.B. cocktails.ts)
  pages/             → Seiten (index.vue, pinia.vue, pinia-shared.vue)
```

---

## Dokumentation

| Datei                              | Inhalt                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------------ |
| [`pinia-store.md`](pinia-store.md) | Pinia State Management: Installation, State, Getters, Actions — am Cocktail-Beispiel |
