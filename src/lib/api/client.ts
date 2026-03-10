import { PUBLIC_API_BASE } from '$env/static/public';
import { get } from 'svelte/store';
import { locale } from '$lib/stores/locale';

export async function apiFetch<T>(path: string): Promise<T> {
  const lang = get(locale);
  const sep = path.includes('?') ? '&' : '?';
  const url = `${PUBLIC_API_BASE}${path}${sep}lang=${lang}`;

  const res = await fetch(url);

  if (res.status === 429) {
    const retryAfter = res.headers.get('Retry-After') ?? '60';
    throw new Error(`rate_limited:${retryAfter}`);
  }

  if (!res.ok) throw new Error(`API error: ${res.status} ${path}`);
  return res.json() as Promise<T>;
}
