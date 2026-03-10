<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { getGame } from '$lib/api/games';
  import type { GameDto, StudioConfig } from '$lib/types';
  import { getStudioConfig } from '$lib/api/studio';
  import { t } from '$lib/i18n';
  import { marked } from 'marked';
  import ImageGallery from '$lib/components/ImageGallery.svelte';

  let game: GameDto | null = null;
  let studioName = '[Studio Name]';
  let error = '';
  let loading = true;

  onMount(async () => {
    try {
      const config = await getStudioConfig();
      studioName = config.studioName;
      game = await getGame($page.params.slug!);
    } catch (e: unknown) {
      if (e instanceof Error && e.message.startsWith('rate_limited:')) {
        const seconds = e.message.split(':')[1];
        error = t('errors.rateLimited', { seconds });
      } else {
        error = e instanceof Error ? e.message : t('errors.apiError');
      }
    } finally {
      loading = false;
    }
  });

  const renderer = new marked.Renderer();
  renderer.link = ({ href, text }) => `<a target="_blank" rel="noopener noreferrer" href="${href}">${text}</a>`;
  marked.use({ renderer });
</script>

<svelte:head>
  {#if game}
    <title>{game.title} — {studioName}</title>
    <meta name="description" content={game.shortDescription} />
    <meta property="og:title"       content="{game.title} — {studioName}" />
    <meta property="og:description" content={game.shortDescription} />
    <meta property="og:image"       content={game.coverImage} />
    <meta property="og:type"        content="website" />
    <meta name="twitter:card"       content="summary_large_image" />
  {/if}
</svelte:head>

<!-- Breadcrumb (SEO + acessibilidade) -->
<nav aria-label="Navegação estrutural" class="breadcrumb-nav">
  <ol class="breadcrumb">
    <li><a href="/">Início</a></li>
    <li><a href="/games">{t('nav.games')}</a></li>
    {#if game}<li aria-current="page">{game.title}</li>{/if}
  </ol>
</nav>

{#if loading}
  <div class="skeleton-hero" style="width: 100%; height: 50vh; background: rgba(255,255,255,0.05); margin-bottom: 2rem;"></div>
  <div class="page-container">
    <div style="width: 100%; height: 400px; background: rgba(255,255,255,0.05);"></div>
  </div>
{:else if error}
  <main class="page-container" style="text-align: center; padding: 4rem;">
    <p class="error" style="font-size: 1.2rem; color: var(--color-primary);">{error}</p>
    <button class="btn btn-primary" on:click={() => location.reload()} style="margin-top: 1rem;">Tentar novamente</button>
  </main>
{:else if game}
  <!-- Hero com heroImage -->
  <section class="game-hero" style="background-image: url({game.heroImage})">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      {#if game.logoImage}
        <img src={game.logoImage} alt={game.title} class="game-logo" fetchpriority="high" />
      {:else}
        <h1 class="game-title">{game.title}</h1>
      {/if}
      <p class="game-tagline">{game.tagline}</p>
      <div class="purchase-links">
        {#each Object.entries(game.purchaseLinks || {}) as [platform, url]}
          <a href={url} target="_blank" rel="noopener noreferrer" class="btn btn-primary">
            {t('game.playOn', { platform })}
          </a>
        {/each}
      </div>
    </div>
  </section>

  <div class="page-container game-body">
    <!-- Descrição + metadados -->
    <div class="game-content-layout">
      <section class="game-description markdown-content">
        {@html marked.parse(game.description)}
      </section>
      
      <aside class="game-meta">
        <div class="meta-item">
          <strong>Status</strong>
          <p>{game.status}</p>
        </div>
        <div class="meta-item">
          <strong>{t('game.releaseDate')}</strong>
          <p>{game.releaseDate}</p>
        </div>
        <div class="meta-item">
          <strong>{t('game.platforms')}</strong>
          <p>{game.platforms.join(', ')}</p>
        </div>
        <div class="tags">
          {#each game.tags as tag}<span class="tag">{tag}</span>{/each}
        </div>
        {#if game.presskit.available}
          <div class="presskit-link">
            <a href={game.presskit.downloadUrl} class="btn btn-ghost">
              {t('game.presskit')}
            </a>
            <small>{t('game.presskitUpdated', { date: new Date(game.presskit.updatedAt).toLocaleDateString() })}</small>
          </div>
        {/if}
      </aside>
    </div>

    <!-- Galeria -->
    {#if game.gallery && game.gallery.length > 0}
      <section class="game-gallery" aria-label="Screenshots">
        <h2>{t('game.screenshots')}</h2>
        <ImageGallery images={game.gallery} altPrefix={game.title} />
      </section>
    {/if}

    <!-- Trailer — SEMPRE usar youtube-nocookie.com -->
    {#if game.trailer.available}
      <section class="game-trailer">
        <h2>{game.trailer.label || 'Trailer'}</h2>
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
  </div>
{/if}

<style>
  .breadcrumb-nav { max-width: 1280px; margin: 0 auto; padding: 1rem 2rem; position: absolute; z-index: 10; width: 100%; }
  .breadcrumb { list-style: none; display: flex; gap: 0.5rem; margin: 0; padding: 0; font-size: 0.85rem; color: rgba(255,255,255,0.7); }
  .breadcrumb li { display: flex; align-items: center; gap: 0.5rem; }
  .breadcrumb li:not(:last-child)::after { content: '/'; color: rgba(255,255,255,0.3); }
  .breadcrumb a { transition: color 0.2s; }
  .breadcrumb a:hover { color: var(--color-primary); }

  .game-hero { position: relative; width: 100%; min-height: 50vh; display: flex; align-items: flex-end; padding: 4rem 2rem; background-size: cover; background-position: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--color-bg) 0%, rgba(26,26,46,0.3) 100%); }
  .hero-content { position: relative; z-index: 2; max-width: 1280px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 1.5rem; }
  .game-logo { max-width: 400px; max-height: 150px; object-fit: contain; object-position: left bottom; }
  .game-title { font-size: 4rem; color: white; margin: 0; text-shadow: 0 4px 20px rgba(0,0,0,0.5); }
  .game-tagline { font-size: 1.4rem; color: rgba(255,255,255,0.8); max-width: 600px; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
  .purchase-links { display: flex; gap: 1rem; flex-wrap: wrap; }

  .page-container { max-width: 1280px; margin: 0 auto; padding: 4rem 2rem; }
  
  .game-content-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 4rem; margin-bottom: 4rem; }
  .game-description { font-size: 1.05rem; line-height: 1.8; color: rgba(255,255,255,0.85); }
  
  .game-meta { background: rgba(255,255,255,0.03); padding: 2rem; border-radius: var(--radius); border: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 1.5rem; height: fit-content; }
  .meta-item strong { display: block; font-family: var(--font-display); font-size: 1.2rem; color: var(--color-primary); letter-spacing: 0.05em; margin-bottom: 0.2rem; }
  .meta-item p { margin: 0; font-size: 0.95rem; }
  
  .tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .tag { background: rgba(255,255,255,0.1); padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; }
  
  .presskit-link { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); }
  .presskit-link small { color: var(--color-muted); font-size: 0.8rem; }

  .game-gallery, .game-trailer { margin-top: 4rem; }
  h2 { font-size: 2.2rem; margin-bottom: 2rem; color: var(--color-primary); }

  .video-wrapper { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: var(--radius); border: 1px solid rgba(255,255,255,0.1); }
  .video-wrapper iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }

  /* MarkDown Styles */
  :global(.markdown-content h1, .markdown-content h2, .markdown-content h3) { color: var(--color-primary); margin: 2rem 0 1rem; }
  :global(.markdown-content p) { margin-bottom: 1.5rem; }
  :global(.markdown-content a) { color: var(--color-accent); text-decoration: underline; text-decoration-color: transparent; transition: text-decoration-color 0.2s; }
  :global(.markdown-content a:hover) { text-decoration-color: var(--color-accent); }
  :global(.markdown-content ul, .markdown-content ol) { margin-bottom: 1.5rem; padding-left: 1.5rem; }
  :global(.markdown-content li) { margin-bottom: 0.5rem; }

  @media (max-width: 900px) {
    .game-content-layout { grid-template-columns: 1fr; gap: 2.5rem; }
    .game-hero { min-height: 40vh; padding-top: 6rem; }
  }
</style>
