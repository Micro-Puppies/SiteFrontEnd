import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const SUPPORTED_LOCALES = ['pt-BR', 'en'] as const;
export type Locale = typeof SUPPORTED_LOCALES[number];

function detectInitialLocale(): Locale {
  if (!browser) return 'pt-BR';
  const saved = localStorage.getItem('mp_locale') as Locale | null;
  if (saved && SUPPORTED_LOCALES.includes(saved)) return saved;
  const browserLang = navigator.language;
  return SUPPORTED_LOCALES.find(l =>
    browserLang.startsWith(l.split('-')[0])
  ) ?? 'pt-BR';
}

export const locale = writable<Locale>(detectInitialLocale());

// Persiste a preferência ao trocar
if (browser) {
  locale.subscribe(lang => localStorage.setItem('mp_locale', lang));
}
