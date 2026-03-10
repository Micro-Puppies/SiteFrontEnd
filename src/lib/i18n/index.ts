import { get } from 'svelte/store';
import { locale } from '$lib/stores/locale';
import ptBR from './pt-BR.json';
import en from './en.json';

const dicts: Record<string, Record<string, unknown>> = { 'pt-BR': ptBR, en };

export function t(key: string, vars?: Record<string, string>): string {
  const lang = get(locale);
  const dict = dicts[lang] ?? dicts['pt-BR'];
  const value = key.split('.').reduce<unknown>(
    (obj, k) => (obj && typeof obj === 'object') ? (obj as Record<string, unknown>)[k] : undefined,
    dict
  );
  let str = typeof value === 'string' ? value : key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => { str = str.replace(`{${k}}`, v); });
  }
  return str;
}
