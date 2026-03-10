# 🎮 Micro Puppies — Agente de IA: Frontend (SvelteKit + TypeScript)

## Papel do Agente

Você é o agente responsável por construir e manter o **frontend do site institucional do estúdio indie Micro Puppies**. Sua única responsabilidade é o app SvelteKit em TypeScript.

> **Princípio absoluto:** O frontend nunca referencia assemblies ou arquivos do backend. Toda comunicação é via `apiFetch<T>()`, que injeta `?lang={locale}` automaticamente em cada requisição.

---

## Contexto do Projeto

Site institucional moderno de estúdio indie. Inspirado visualmente em [megacrit.com](https://www.megacrit.com/). Consome uma REST API em ASP.NET Core desacoplada.

**Stack:** HTML + CSS puro + TypeScript + Svelte 5 / SvelteKit

---

## Arquitetura do Frontend

```
frontend/
└── src/
    ├── lib/
    │   ├── api/
    │   │   ├── client.ts         ← apiFetch com lang e tratamento de 429
    │   │   ├── studio.ts         ← getStudioConfig()
    │   │   ├── games.ts          ← getAllGames(), getFeaturedGames(), getGame()
    │   │   └── posts.ts          ← getAllPosts(), getRecentPosts(), getPost()
    │   ├── components/
    │   │   ├── NavBar.svelte
    │   │   ├── Footer.svelte
    │   │   ├── LanguageSwitcher.svelte
    │   │   ├── GameCard.svelte
    │   │   ├── PostCard.svelte
    │   │   ├── StatusBadge.svelte
    │   │   ├── PlatformList.svelte
    │   │   ├── ImageGallery.svelte
    │   │   └── Skeleton.svelte
    │   ├── i18n/
    │   │   ├── index.ts          ← helper t() com interpolação
    │   │   ├── pt-BR.json
    │   │   └── en.json
    │   ├── stores/
    │   │   └── locale.ts         ← store reativo com detecção e persistência
    │   ├── styles/
    │   │   └── global.css        ← variáveis CSS (tokens), reset, tipografia
    │   └── types.ts              ← interfaces TypeScript
    └── routes/
        ├── +layout.svelte        ← aplica tema, NavBar, Footer
        ├── +page.svelte          ← Home com carrossel hero
        ├── games/
        │   ├── +page.svelte      ← Lista de jogos
        │   └── [slug]/
        │       └── +page.svelte  ← Página individual do jogo
        ├── news/
        │   ├── +page.svelte      ← Lista de posts
        │   └── [slug]/
        │       └── +page.svelte  ← Post individual
        ├── about/
        │   └── +page.svelte
        └── contact/
            └── +page.svelte
```

---

## Setup Inicial

```bash
npm create svelte@latest frontend
# Escolher: SvelteKit, TypeScript, sem linting extra
cd frontend
npm install
```

### Variável de Ambiente

```env
# frontend/.env
PUBLIC_API_BASE=http://localhost:5000
```

Em produção, substituir pelo domínio do backend deployado.

---

## CSS Global e Design Tokens

### `src/lib/styles/global.css`

```css
/* Fallback de tokens — sobrescritos dinamicamente pelo tema da API */
:root {
  --color-primary:  #FF6B6B;
  --color-accent:   #FFE66D;
  --color-bg:       #1A1A2E;
  --color-text:     #F5F5F5;
  --color-muted:    rgba(245, 245, 245, 0.45);
  --font-display:   'Bebas Neue', sans-serif;
  --font-body:      'DM Sans', sans-serif;
  --radius:         8px;
  --spacing-lg:     4rem;
  --spacing-md:     2rem;
  --spacing-sm:     1rem;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  line-height: 1.6;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  letter-spacing: 0.05em;
}

a { color: inherit; text-decoration: none; }

img { display: block; max-width: 100%; }

/* Foco visível em todos os elementos interativos */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}

/* Botões reutilizáveis */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.4rem;
  border-radius: var(--radius);
  font-family: var(--font-body);
  font-size: 0.95rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}
.btn-primary {
  background: var(--color-primary);
  color: #0f0f1a;
}
.btn-primary:hover { filter: brightness(1.1); }

.btn-ghost {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  color: var(--color-text);
}
.btn-ghost:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
```

> **Regra crítica:** Nunca hardcode cores, fontes ou espaçamentos. Use **sempre** `var(--color-*)`, `var(--font-*)`, `var(--spacing-*)`. O tema é controlado pelo backend via `studio.json`.

---

## Types TypeScript (`src/lib/types.ts`)

```typescript
export interface ThemeConfig {
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontDisplay: string;
  fontBody: string;
}

export interface StudioConfig {
  studioName: string;
  defaultLocale: string;
  supportedLocales: string[];
  tagline: string;
  description: string;
  socialLinks: Record<string, string>;
  contactEmail: string;
  newsletter: { enabled: boolean; provider: string; actionUrl: string };
  theme: ThemeConfig;
}

export interface PresskitInfo {
  available: boolean;
  downloadUrl: string;
  updatedAt: string;
}

export interface TrailerInfo {
  available: boolean;
  youtubeId: string;
  label: string;
}

export interface GameDto {
  slug: string;
  title: string;
  tagline: string;
  shortDescription: string;
  description: string;        // Markdown — renderizar com marked
  status: 'released' | 'early-access' | 'announced' | 'wip' | 'coming-soon';
  releaseDate: string;
  heroImage: string;          // URL — usar como background-image
  logoImage: string;
  coverImage: string;
  gallery: string[];
  tags: string[];
  platforms: string[];
  purchaseLinks: Record<string, string>;
  presskit: PresskitInfo;
  trailer: TrailerInfo;
  featured: boolean;
  order: number;
}

export interface PostDto {
  slug: string;
  title: string;
  publishedAt: string;
  coverImage: string;
  excerpt: string;
  body: string;               // Markdown — renderizar com marked
  tags: string[];
  relatedGame: string;
  published: boolean;
}
```

---

## Store de Idioma (`src/lib/stores/locale.ts`)

```typescript
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
```

---

## Camada de API (`src/lib/api/`)

### `client.ts` — apiFetch centralizado

```typescript
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
```

### `studio.ts`

```typescript
import { apiFetch } from './client';
import type { StudioConfig } from '$lib/types';

export const getStudioConfig = () =>
  apiFetch<StudioConfig>('/api/studio/config');
```

### `games.ts`

```typescript
import { apiFetch } from './client';
import type { GameDto } from '$lib/types';

export const getAllGames    = ()            => apiFetch<GameDto[]>('/api/games');
export const getFeaturedGames = ()         => apiFetch<GameDto[]>('/api/games/featured');
export const getGame       = (slug: string) => apiFetch<GameDto>(`/api/games/${slug}`);
```

### `posts.ts`

```typescript
import { apiFetch } from './client';
import type { PostDto } from '$lib/types';

export const getAllPosts    = ()             => apiFetch<PostDto[]>('/api/posts');
export const getRecentPosts = (n: number)   => apiFetch<PostDto[]>(`/api/posts/recent/${n}`);
export const getPost       = (slug: string)  => apiFetch<PostDto>(`/api/posts/${slug}`);
```

---

## Internacionalização — Strings de UI

### `src/lib/i18n/pt-BR.json`

```json
{
  "nav": { "games": "Jogos", "news": "Notícias", "about": "Sobre", "contact": "Contato" },
  "home": { "learnMore": "Saiba mais", "latestNews": "Últimas Notícias", "seeAll": "Ver todas", "ourGames": "Nossos Jogos" },
  "game": {
    "playOn": "Jogar no {platform}",
    "presskit": "Baixar Press Kit",
    "presskitUpdated": "Atualizado em {date}",
    "platforms": "Plataformas",
    "releaseDate": "Lançamento",
    "screenshots": "Screenshots"
  },
  "news": { "readMore": "Leia mais", "postedOn": "Publicado em {date}" },
  "errors": {
    "notFound": "Página não encontrada.",
    "apiError": "Erro ao carregar conteúdo. Tente novamente.",
    "rateLimited": "Muitas requisições. Aguarde {seconds} segundos."
  },
  "footer": { "rights": "Todos os direitos reservados.", "newsletter": "Inscreva-se na newsletter" }
}
```

### `src/lib/i18n/en.json`

```json
{
  "nav": { "games": "Games", "news": "News", "about": "About", "contact": "Contact" },
  "home": { "learnMore": "Learn more", "latestNews": "Latest News", "seeAll": "See all", "ourGames": "Our Games" },
  "game": {
    "playOn": "Play on {platform}",
    "presskit": "Download Press Kit",
    "presskitUpdated": "Updated on {date}",
    "platforms": "Platforms",
    "releaseDate": "Release Date",
    "screenshots": "Screenshots"
  },
  "news": { "readMore": "Read more", "postedOn": "Posted on {date}" },
  "errors": {
    "notFound": "Page not found.",
    "apiError": "Failed to load content. Please try again.",
    "rateLimited": "Too many requests. Wait {seconds} seconds."
  },
  "footer": { "rights": "All rights reserved.", "newsletter": "Subscribe to newsletter" }
}
```

### `src/lib/i18n/index.ts` — helper `t()`

```typescript
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
```

Uso nos componentes:

```svelte
<script lang="ts">
  import { t } from '$lib/i18n';
</script>

<a href="/games">{t('nav.games')}</a>
<button>{t('game.playOn', { platform: 'Steam' })}</button>
```

---

## Layout Raiz (`src/routes/+layout.svelte`)

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { locale } from '$lib/stores/locale';
  import { getStudioConfig } from '$lib/api/studio';
  import type { StudioConfig } from '$lib/types';
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import '../lib/styles/global.css';

  let config: StudioConfig | null = null;

  async function loadConfig() {
    config = await getStudioConfig();
    applyTheme(config.theme);
    if (typeof document !== 'undefined') {
      document.documentElement.lang = $locale;
    }
  }

  function applyTheme(theme: StudioConfig['theme']) {
    const root = document.documentElement;
    root.style.setProperty('--color-primary',  theme.primaryColor);
    root.style.setProperty('--color-accent',   theme.accentColor);
    root.style.setProperty('--color-bg',       theme.backgroundColor);
    root.style.setProperty('--color-text',     theme.textColor);
    root.style.setProperty('--font-display',   `'${theme.fontDisplay}', sans-serif`);
    root.style.setProperty('--font-body',      `'${theme.fontBody}', sans-serif`);
  }

  onMount(loadConfig);

  // Rebusca ao trocar idioma — apiFetch injeta o lang automaticamente
  $: if ($locale) loadConfig();
</script>

{#if config}
  <NavBar studio={config} />
  <main>
    <slot />
  </main>
  <Footer studio={config} />
{:else}
  <slot />
{/if}
```

---

## Carrossel Hero — Home (`src/routes/+page.svelte`)

A seção hero da home é um **carrossel fullscreen automático**. Cada slide representa um jogo com `featured: true` (ou todos os jogos, se nenhum for featured).

### Lógica do Carrossel (`<script lang="ts">`)

```typescript
import { onMount, onDestroy } from 'svelte';
import { getGames } from '$lib/api/games';
import { getRecentPosts } from '$lib/api/posts';
import type { GameDto, PostDto } from '$lib/types';
import StatusBadge from '$lib/components/StatusBadge.svelte';
import PlatformList from '$lib/components/PlatformList.svelte';
import GameCard from '$lib/components/GameCard.svelte';
import PostCard from '$lib/components/PostCard.svelte';

let games: GameDto[] = [];
let posts: PostDto[]  = [];
let current = 0;
let paused  = false;
let progress = 0;       // 0–1 — alimenta a barra de progresso
let rafId: number;
let startTime: number | null = null;
const DURATION = 6000;

onMount(async () => {
  const [allGames, recentPosts] = await Promise.all([
    getAllGames(),
    getRecentPosts(3)
  ]);
  const featured = allGames.filter(g => g.featured);
  games = (featured.length > 0 ? featured : allGames)
    .sort((a, b) => a.order - b.order);
  posts = recentPosts;
  rafId = requestAnimationFrame(tick);
});

onDestroy(() => { if (rafId) cancelAnimationFrame(rafId); });

function tick(ts: number) {
  if (!startTime) startTime = ts;
  if (!paused) {
    progress = Math.min((ts - startTime) / DURATION, 1);
  } else {
    startTime = ts - progress * DURATION;
  }
  if (progress >= 1) {
    goTo(current + 1);
    startTime = null;
    progress = 0;
  }
  rafId = requestAnimationFrame(tick);
}

function goTo(index: number, userTriggered = false) {
  current = ((index % games.length) + games.length) % games.length;
  if (userTriggered) { progress = 0; startTime = null; }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowRight') goTo(current + 1, true);
  if (e.key === 'ArrowLeft')  goTo(current - 1, true);
}

let touchStartX = 0;
function onTouchStart(e: TouchEvent) { touchStartX = e.touches[0].clientX; }
function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 50) goTo(dx < 0 ? current + 1 : current - 1, true);
}
```

### Markup do Carrossel

```svelte
<section
  class="hero"
  aria-label="Jogos em destaque"
  aria-roledescription="carrossel"
  on:keydown={handleKeydown}
  on:mouseenter={() => (paused = true)}
  on:mouseleave={() => (paused = false)}
  on:focusin={() =>  (paused = true)}
  on:focusout={() => (paused = false)}
  on:touchstart={onTouchStart}
  on:touchend={onTouchEnd}
>
  {#each games as game, i}
    <div
      class="slide"
      class:active={i === current}
      role="group"
      aria-roledescription="slide"
      aria-label="{i + 1} de {games.length}: {game.title}"
    >
      <div class="slide-bg" style="background-image: url('{game.heroImage}')"></div>

      <div class="slide-content">
        <div class="slide-eyebrow">
          <StatusBadge status={game.status} />
          <PlatformList platforms={game.platforms} />
        </div>
        <h1 class="slide-title">{game.title}</h1>
        <p class="slide-tagline">"{game.tagline}"</p>
        <div class="slide-cta">
          <a href="/games/{game.slug}" class="btn btn-primary">
            {game.status === 'coming-soon' ? 'Ver detalhes' : 'Saiba mais'}
          </a>
          {#each game.purchaseLinks.slice?.(0,1) ?? [] as link}
            <a href={link.url} target="_blank" rel="noopener" class="btn btn-ghost">
              {link.label}
            </a>
          {/each}
        </div>
      </div>
    </div>
  {/each}

  <!-- Setas de navegação -->
  <div class="carousel-arrows" aria-label="Controles do carrossel">
    <button class="carousel-arrow" on:click={() => goTo(current - 1, true)} aria-label="Slide anterior">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
    <button class="carousel-arrow" on:click={() => goTo(current + 1, true)} aria-label="Próximo slide">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  </div>

  <!-- UI desktop: miniaturas + contador + barra de progresso -->
  <div class="carousel-ui" aria-hidden="true">
    <div class="carousel-counter">
      <strong>{String(current + 1).padStart(2, '0')}</strong> / {String(games.length).padStart(2, '0')}
    </div>
    <div class="carousel-thumbs" role="tablist">
      {#each games as game, i}
        <button
          class="thumb" class:active={i === current}
          role="tab" aria-selected={i === current} aria-label={game.title}
          on:click={() => goTo(i, true)}
        >
          <img src={game.coverImage} alt="" />
        </button>
      {/each}
    </div>
    <div class="carousel-progress">
      <div class="carousel-progress-bar" style="transform: scaleX({progress}); transform-origin: left;"></div>
    </div>
  </div>

  <!-- Bolinhas (mobile) -->
  <div class="carousel-dots" aria-hidden="true">
    {#each games as _, i}
      <button class="dot" class:active={i === current} on:click={() => goTo(i, true)}></button>
    {/each}
  </div>
</section>

<!-- Seções abaixo do carrossel -->
<section class="section games-section">
  <h2>Nossos Jogos</h2>
  <div class="games-grid">
    {#each games as game}
      <GameCard {game} />
    {/each}
  </div>
</section>

<section class="section news-section">
  <h2>Últimas Notícias</h2>
  <div class="posts-grid">
    {#each posts as post}
      <PostCard {post} />
    {/each}
  </div>
  <a href="/news" class="btn btn-ghost">Ver todas</a>
</section>
```

### CSS do Carrossel (adicionar ao `<style>` de `+page.svelte`)

```css
/* ── Hero / Carrossel ───────────────────────────────────────── */
.hero {
  position: relative;
  width: 100%;
  height: 100svh;
  min-height: 600px;
  overflow: hidden;
}

.slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 0.9s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}
.slide.active { opacity: 1; pointer-events: all; z-index: 1; }

/* Ken Burns na imagem de fundo */
.slide-bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transform: scale(1.06);
  transition: transform 8s linear;
  will-change: transform;
}
.slide.active .slide-bg { transform: scale(1.0); }
.slide-bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(to top, rgba(15,15,26,1) 0%, rgba(15,15,26,0.65) 35%, rgba(15,15,26,0.15) 65%),
    linear-gradient(to right, rgba(15,15,26,0.55) 0%, transparent 55%);
}

/* Conteúdo com animação de entrada */
.slide-content {
  position: absolute;
  inset: 0; z-index: 2;
  display: flex; flex-direction: column; justify-content: flex-end;
  max-width: 1280px; margin: 0 auto; left: 0; right: 0;
  padding: 0 3rem 5.5rem;
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.7s 0.3s ease, transform 0.7s 0.3s ease;
}
.slide.active .slide-content { opacity: 1; transform: translateY(0); }

.slide-eyebrow { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }

.slide-title {
  font-family: var(--font-display);
  font-size: clamp(5rem, 13vw, 11rem);
  line-height: 0.88; letter-spacing: 0.02em;
  text-shadow: 0 4px 60px rgba(0,0,0,0.8);
  margin-bottom: 1rem;
}

.slide-tagline {
  font-size: clamp(1rem, 1.8vw, 1.2rem);
  color: rgba(240,240,248,0.65);
  font-weight: 300; font-style: italic;
  max-width: 480px; margin-bottom: 1.8rem;
}

.slide-cta { display: flex; gap: 1rem; flex-wrap: wrap; }

/* Setas */
.carousel-arrows {
  position: absolute; top: 50%; right: 3rem; z-index: 10;
  transform: translateY(-50%);
  display: flex; flex-direction: column; gap: 0.5rem;
}
.carousel-arrow {
  width: 42px; height: 42px; border-radius: 50%;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  color: var(--color-text);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(6px); cursor: pointer;
  transition: all 0.2s ease;
}
.carousel-arrow:hover { background: rgba(255,107,107,0.2); border-color: var(--color-primary); }
.carousel-arrow svg { width: 16px; height: 16px; }

/* UI desktop */
.carousel-ui {
  position: absolute; bottom: 2.5rem; right: 3rem; z-index: 10;
  display: flex; flex-direction: column; align-items: flex-end; gap: 1rem;
}
.carousel-counter { font-family: var(--font-display); font-size: 0.9rem; letter-spacing: 0.08em; color: rgba(240,240,248,0.5); }
.carousel-counter strong { color: var(--color-text); font-size: 1.1rem; }

.carousel-thumbs { display: flex; gap: 0.6rem; }
.thumb {
  position: relative; width: 64px; height: 36px;
  border-radius: 5px; overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
  cursor: pointer; opacity: 0.45;
  transition: all 0.25s ease;
}
.thumb img { width: 100%; height: 100%; object-fit: cover; }
.thumb.active, .thumb:hover { opacity: 1; border-color: var(--color-primary); }
.thumb.active::before {
  content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 2px; z-index: 1;
  background: var(--color-primary);
}

.carousel-progress { width: 160px; height: 2px; background: rgba(255,255,255,0.1); border-radius: 1px; overflow: hidden; }
.carousel-progress-bar { height: 100%; background: var(--color-primary); border-radius: 1px; will-change: transform; }

/* Bolinhas (mobile) */
.carousel-dots {
  position: absolute; bottom: 1.5rem; left: 50%;
  transform: translateX(-50%); z-index: 10;
  display: none; gap: 0.5rem;
}
.dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(255,255,255,0.3); border: none; cursor: pointer; transition: all 0.25s; }
.dot.active { background: var(--color-primary); width: 20px; border-radius: 3px; }

/* Seções abaixo do hero */
.section { max-width: 1280px; margin: 0 auto; padding: var(--spacing-lg) var(--spacing-md); }
.games-grid { display: grid; gap: 1.5rem; grid-template-columns: 1fr; }
.posts-grid { display: grid; gap: 1.5rem; grid-template-columns: 1fr; }

/* Responsive */
@media (max-width: 1024px) {
  .carousel-thumbs { display: none; }
  .carousel-dots   { display: flex; }
  .carousel-arrows { right: 1.5rem; }
  .games-grid { grid-template-columns: repeat(2, 1fr); }
  .posts-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .slide-content { padding: 0 1.5rem 5rem; }
  .carousel-arrows { display: none; }
  .carousel-ui { right: 1.5rem; bottom: 5rem; }
  .games-grid { grid-template-columns: 1fr; }
  .posts-grid { grid-template-columns: 1fr; }
}
```

---

## Página Individual do Jogo (`/games/[slug]`)

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { getGame } from '$lib/api/games';
  import type { GameDto } from '$lib/types';

  let game: GameDto | null = null;
  let error = '';

  onMount(async () => {
    try {
      game = await getGame($page.params.slug);
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : 'Erro desconhecido.';
    }
  });
</script>

<svelte:head>
  {#if game}
    <title>{game.title} — Micro Puppies</title>
    <meta name="description" content={game.shortDescription} />
    <meta property="og:title"       content="{game.title} — Micro Puppies" />
    <meta property="og:description" content={game.shortDescription} />
    <meta property="og:image"       content={game.coverImage} />
    <meta property="og:type"        content="website" />
    <meta name="twitter:card"       content="summary_large_image" />
  {/if}
</svelte:head>

<!-- Breadcrumb (SEO + acessibilidade) -->
<nav aria-label="Navegação estrutural">
  <ol class="breadcrumb">
    <li><a href="/">Início</a></li>
    <li><a href="/games">Jogos</a></li>
    {#if game}<li aria-current="page">{game.title}</li>{/if}
  </ol>
</nav>

{#if game}
  <!-- Hero com heroImage -->
  <section class="game-hero" style="background-image: url({game.heroImage})">
    <img src={game.logoImage} alt={game.title} class="game-logo" fetchpriority="high" />
    <p class="game-tagline">{game.tagline}</p>
    <div class="purchase-links">
      {#each Object.entries(game.purchaseLinks) as [platform, url]}
        <a href={url} target="_blank" rel="noopener noreferrer" class="btn btn-primary">
          Jogar no {platform}
        </a>
      {/each}
    </div>
  </section>

  <!-- Descrição + metadados -->
  <div class="game-body">
    <section class="game-description">
      {@html game.description}  <!-- Markdown já convertido pelo backend ou usar marked -->
    </section>
    <aside class="game-meta">
      <p><strong>Status:</strong> {game.status}</p>
      <p><strong>Lançamento:</strong> {game.releaseDate}</p>
      <p><strong>Plataformas:</strong> {game.platforms.join(', ')}</p>
      <div class="tags">
        {#each game.tags as tag}<span class="tag">{tag}</span>{/each}
      </div>
      {#if game.presskit.available}
        <a href={game.presskit.downloadUrl} class="btn btn-ghost">
          Baixar Press Kit
        </a>
      {/if}
    </aside>
  </div>

  <!-- Galeria -->
  {#if game.gallery.length > 0}
    <section class="game-gallery" aria-label="Screenshots">
      <h2>Screenshots</h2>
      <div class="gallery-grid">
        {#each game.gallery as img}
          <img src={img} alt="Screenshot de {game.title}" loading="lazy" />
        {/each}
      </div>
    </section>
  {/if}

  <!-- Trailer — SEMPRE usar youtube-nocookie.com -->
  {#if game.trailer.available}
    <section class="game-trailer">
      <h2>{game.trailer.label}</h2>
      <div class="video-wrapper">
        <iframe
          src="https://www.youtube-nocookie.com/embed/{game.trailer.youtubeId}?rel=0&modestbranding=1"
          title="{game.trailer.label} — {game.title}"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
    </section>
  {/if}
{:else if error}
  <p class="error">{error}</p>
{:else}
  <!-- Skeleton screen enquanto carrega -->
  <div class="skeleton skeleton-hero"></div>
{/if}
```

---

## Componentes Reutilizáveis

### `StatusBadge.svelte`

```svelte
<script lang="ts">
  export let status: string;
  const labels: Record<string, string> = {
    'released': 'Lançado', 'early-access': 'Acesso Antecipado',
    'coming-soon': 'Em Breve', 'announced': 'Anunciado', 'wip': 'Em Desenvolvimento'
  };
</script>

<span class="status-badge status-{status}">{labels[status] ?? status}</span>

<style>
  .status-badge {
    display: inline-block; padding: 0.2em 0.7em;
    border-radius: 4px; font-size: 0.75rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .status-released     { background: rgba(100,220,100,0.15); color: #64dc64; }
  .status-early-access { background: rgba(255,230,109,0.15); color: #FFE66D; }
  .status-coming-soon  { background: rgba(255,107,107,0.15); color: var(--color-primary); }
  .status-announced    { background: rgba(150,150,255,0.15); color: #9696ff; }
  .status-wip          { background: rgba(200,200,200,0.1);  color: var(--color-muted); }
</style>
```

### `PlatformList.svelte`

```svelte
<script lang="ts">
  export let platforms: string[];
</script>

<ul class="platform-list" aria-label="Plataformas">
  {#each platforms as platform}
    <li>{platform}</li>
  {/each}
</ul>

<style>
  .platform-list {
    display: flex; gap: 0.4rem; list-style: none;
  }
  li {
    font-size: 0.75rem; font-weight: 600;
    color: var(--color-muted);
    padding: 0.15em 0.5em;
    border: 1px solid var(--color-muted);
    border-radius: 4px;
  }
</style>
```

### `GameCard.svelte`

```svelte
<script lang="ts">
  import type { GameDto } from '$lib/types';
  export let game: GameDto;
</script>

<article class="game-card">
  <a href="/games/{game.slug}">
    <div class="card-image-wrapper">
      <img src={game.coverImage} alt={game.title} loading="lazy" />
    </div>
    <div class="card-body">
      <h3>{game.title}</h3>
      <p>{game.shortDescription}</p>
    </div>
  </a>
</article>

<style>
  .game-card { border-radius: var(--radius); overflow: hidden; transition: transform 0.2s ease; }
  .game-card:hover { transform: translateY(-4px); }
  .card-image-wrapper { width: 100%; aspect-ratio: 16 / 9; overflow: hidden; }
  .card-image-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
  .game-card:hover .card-image-wrapper img { transform: scale(1.04); }
  .card-body { padding: 1rem; }
  h3 { font-family: var(--font-display); font-size: 1.4rem; margin-bottom: 0.4rem; }
  p  { font-size: 0.9rem; color: var(--color-muted); }
</style>
```

### `LanguageSwitcher.svelte`

```svelte
<script lang="ts">
  import { locale, SUPPORTED_LOCALES } from '$lib/stores/locale';
  const labels: Record<string, string> = { 'pt-BR': 'PT', 'en': 'EN' };
</script>

<div class="lang-switcher" role="group" aria-label="Selecionar idioma">
  {#each SUPPORTED_LOCALES as lang}
    <button
      class:active={$locale === lang}
      on:click={() => locale.set(lang)}
      aria-pressed={$locale === lang}
      aria-label={lang}
    >
      {labels[lang]}
    </button>
  {/each}
</div>

<style>
  .lang-switcher { display: flex; gap: 0.25rem; }
  button {
    background: transparent; border: 1px solid var(--color-muted);
    color: var(--color-muted); padding: 0.2rem 0.5rem;
    border-radius: var(--radius); font-size: 0.75rem; cursor: pointer;
    transition: all 0.15s ease;
  }
  button.active, button:hover { border-color: var(--color-primary); color: var(--color-primary); }
</style>
```

---

## Transições de Página

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import { fade } from 'svelte/transition';
  import { navigating } from '$app/stores';
</script>

{#key $navigating?.to?.url.pathname}
  <div in:fade={{ duration: 150 }}>
    <slot />
  </div>
{/key}
```

---

## Tratamento de Erros e Estados de Loading

### Padrão obrigatório para toda página que faz fetch:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';

  let data = null;
  let loading = true;
  let error = '';

  onMount(async () => {
    try {
      data = await apiFetch('/api/...');
    } catch (e: unknown) {
      if (e instanceof Error && e.message.startsWith('rate_limited:')) {
        const seconds = e.message.split(':')[1];
        error = t('errors.rateLimited', { seconds });
      } else {
        error = t('errors.apiError');
      }
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <div class="skeleton-grid">
    {#each Array(3) as _}
      <div class="skeleton"></div>
    {/each}
  </div>
{:else if error}
  <div class="error-state">
    <p>{error}</p>
    <button on:click={() => location.reload()}>Tentar novamente</button>
  </div>
{:else if !data || data.length === 0}
  <p class="empty-state">Nenhum conteúdo disponível.</p>
{:else}
  <!-- renderizar dados -->
{/if}
```

---

## Responsividade

Breakpoints padrão do projeto:

| Breakpoint | Valor | Comportamento |
|------------|-------|---------------|
| Mobile | `< 640px` | 1 coluna, sem setas no carrossel |
| Tablet | `640px–1024px` | 2 colunas, miniaturas do carrossel ocultadas |
| Desktop | `> 1024px` | 3 colunas, UI completa do carrossel |

Regras:
- **Menu mobile:** NavBar colapsa com botão hambúrguer (`aria-expanded`, `aria-controls`)
- **Hero em mobile:** `min-height: 60svh` para não empurrar conteúdo
- **Galeria em mobile:** scroll horizontal com `scroll-snap-type: x mandatory`
- **Cards:** proporção 16:9 com `aspect-ratio` — nunca distorce a imagem

---

## Acessibilidade — Requisitos Obrigatórios

- `loading="lazy"` em todas as imagens **fora** do hero
- `fetchpriority="high"` na primeira imagem do hero
- `alt` descritivo em todas as imagens (`alt=""` apenas em imagens decorativas)
- `:focus-visible` visível em todos os elementos interativos
- `document.documentElement.lang` atualizado ao trocar idioma
- `afterNavigate` movendo foco para o `<h1>` a cada mudança de rota
- `aria-roledescription="carrossel"` no container do carrossel
- `aria-roledescription="slide"` + `aria-label="N de Total: Título"` em cada slide
- Trailer com atributo `title` descritivo no `<iframe>`
- Breadcrumb com `aria-label="Navegação estrutural"` e `aria-current="page"` no item atual

---

## Regras Absolutas

1. **Nunca chamar `fetch` diretamente** — sempre via `apiFetch<T>()`
2. **Nunca hardcode cores, fontes ou espaçamentos no CSS** — sempre `var(--color-*)`, `var(--font-*)`, `var(--spacing-*)`
3. **Nunca usar `youtube.com` em iframes** — sempre `youtube-nocookie.com`
4. **Nunca misturar strings de UI com conteúdo da API** — strings de UI ficam em `src/lib/i18n/`, conteúdo vem do backend
5. **Sempre implementar skeleton screen, erro e estado vazio** para toda fetch
6. **Tratar status 429** — exibir `t('errors.rateLimited', { seconds })`, nunca quebrar a tela
7. **Markdown do campo `body` (posts) e `description` (jogos)** deve ser convertido com `marked` ou similar antes de `{@html}`
8. **Não modificar `studio.json` ou qualquer arquivo do backend** — toda customização de identidade visual vem pela API

---

## Checklist de Implementação

### Infraestrutura
- [ ] Projeto SvelteKit criado com TypeScript
- [ ] `PUBLIC_API_BASE` configurado via `.env`
- [ ] CSS global com tokens em `src/lib/styles/global.css`
- [ ] Store de idioma com detecção e persistência (`locale.ts`)
- [ ] `apiFetch` com injeção de `lang` e tratamento de 429
- [ ] Camada de API implementada (`studio.ts`, `games.ts`, `posts.ts`)
- [ ] Types definidos em `src/lib/types.ts`
- [ ] Dicionários de UI (`pt-BR.json`, `en.json`) e helper `t()`

### Layout e Componentes
- [ ] `+layout.svelte` buscando config e aplicando tema
- [ ] `NavBar` com `LanguageSwitcher` e menu mobile (`aria-expanded`)
- [ ] `Footer` com redes sociais
- [ ] `GameCard`, `PostCard`, `StatusBadge`, `PlatformList`
- [ ] `ImageGallery` com scroll horizontal em mobile
- [ ] `Skeleton` reutilizável para estados de loading
- [ ] Transição de fade entre páginas

### Páginas
- [ ] Home com carrossel hero (featured) + grid de jogos + últimas notícias
- [ ] `/games` — lista de todos os jogos
- [ ] `/games/[slug]` — hero, descrição, galeria, trailer, presskit, breadcrumb
- [ ] `/news` — lista de posts
- [ ] `/news/[slug]` — post completo com breadcrumb
- [ ] `/about`
- [ ] `/contact`

### Qualidade
- [ ] Skeleton em todos os carregamentos
- [ ] Estado de erro com mensagem amigável e retry
- [ ] Estado vazio para listas sem conteúdo
- [ ] `loading="lazy"` em imagens fora do hero
- [ ] Meta tags Open Graph em todas as páginas
- [ ] Foco visível em todos os elementos interativos
- [ ] `document.documentElement.lang` atualizado ao trocar idioma
- [ ] Site responsivo: mobile (< 640px) / tablet (640–1024px) / desktop (> 1024px)
- [ ] Sem erros de TypeScript nem warnings de acessibilidade no console

---

## Deploy

```bash
npm run build
```

Hospedar em: **Vercel**, **Netlify**, **Cloudflare Pages**.

Configurar `PUBLIC_API_BASE` como variável de ambiente de produção apontando para o domínio do backend deployado.
