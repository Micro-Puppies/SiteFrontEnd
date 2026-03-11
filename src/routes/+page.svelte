<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { getAllGames } from '$lib/api/games';
  import { getRecentPosts } from '$lib/api/posts';
  import type { GameDto, PostDto } from '$lib/types';
  import StatusBadge from '$lib/components/StatusBadge.svelte';
  import PlatformList from '$lib/components/PlatformList.svelte';
  import GameCard from '$lib/components/GameCard.svelte';
  import PostCard from '$lib/components/PostCard.svelte';
  import Skeleton from '$lib/components/Skeleton.svelte';
  import { t } from '$lib/i18n';

  let games: GameDto[] = [];
  let posts: PostDto[]  = [];
  let loading = true;
  let error = '';

  let current = 0;
  let paused  = false;
  let progress = 0;
  let rafId: number;
  let startTime: number | null = null;
  const DURATION = 6000;

  onMount(async () => {
    try {
      const [allGames, recentPosts] = await Promise.all([
        getAllGames(),
        getRecentPosts(3)
      ]);
      const featured = allGames.filter(g => g.featured);
      games = (featured.length > 0 ? featured : allGames).sort((a, b) => a.order - b.order);
      posts = recentPosts;
      if (games.length > 0) {
        rafId = requestAnimationFrame(tick);
      }
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
    if (games.length === 0) return;
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
</script>

<svelte:head>
  <title>Home</title>
</svelte:head>

{#if loading}
  <div class="skeleton" style="height: 100vh;"></div>
  <section class="section games-section">
    <div class="games-grid">
      <Skeleton /><Skeleton /><Skeleton />
    </div>
  </section>
{:else if error}
  <div class="error-state section">
    <p>{error}</p>
    <button class="btn btn-primary" on:click={() => location.reload()}>Tentar novamente</button>
  </div>
{:else}
  {#if games.length > 0}
    <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      class="hero"
      role="region"
      tabindex="0"
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
                {game.status === 'coming-soon' ? 'Ver detalhes' : t('home.learnMore')}
              </a>
              {#each Object.entries(game.purchaseLinks || {}).slice(0,1) as [label, url]}
                <a href={url} target="_blank" rel="noopener noreferrer" class="btn btn-ghost">
                  {label}
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
          <button class="dot" class:active={i === current} on:click={() => goTo(i, true)} aria-label="Ir para o slide {i + 1}"></button>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Seções abaixo do carrossel -->
  <section class="section games-section">
    <h2>{t('home.ourGames')}</h2>
    <div class="games-grid">
      {#each games as game}
        <GameCard {game} />
      {/each}
    </div>
  </section>

  <section class="section news-section">
    <h2>{t('home.latestNews')}</h2>
    <div class="posts-grid">
      {#each posts as post}
        <PostCard {post} />
      {/each}
    </div>
    <a href="/news" class="btn btn-ghost" style="margin-top: 2rem;">{t('home.seeAll')}</a>
  </section>
{/if}

<style>
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
  font-size: clamp(4rem, 10vw, 8rem);
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
.games-grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
.posts-grid { display: grid; gap: 1.5rem; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
h2 { font-size: 2.5rem; margin-bottom: 2rem; color: var(--color-text); }
.error-state { text-align: center; }

/* Responsive */
@media (max-width: 1024px) {
  .carousel-thumbs { display: none; }
  .carousel-dots   { display: flex; }
  .carousel-arrows { right: 1.5rem; }
}
@media (max-width: 640px) {
  .slide-content { padding: 0 1.5rem 5rem; }
  .carousel-arrows { display: none; }
  .carousel-ui { right: 1.5rem; bottom: 5rem; }
}
</style>
