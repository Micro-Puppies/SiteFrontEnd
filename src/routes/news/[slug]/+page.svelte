<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { getPost } from '$lib/api/posts';
  import type { PostDto } from '$lib/types';
  import { getStudioConfig } from '$lib/api/studio';
  import { t } from '$lib/i18n';
  import { marked } from 'marked';

  let post: PostDto | null = null;
  let studioName = '[Studio Name]';
  let error = '';
  let loading = true;

  onMount(async () => {
    try {
      const config = await getStudioConfig();
      studioName = config.studioName;
      post = await getPost($page.params.slug!);
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
  {#if post}
    <title>{post.title} — {studioName}</title>
    <meta name="description" content={post.excerpt} />
    <meta property="og:title"       content="{post.title} — {studioName}" />
    <meta property="og:description" content={post.excerpt} />
    <meta property="og:image"       content={post.coverImage} />
    <meta property="og:type"        content="article" />
    <meta name="twitter:card"       content="summary_large_image" />
  {/if}
</svelte:head>

<!-- Breadcrumb -->
<nav aria-label="Navegação estrutural" class="breadcrumb-nav">
  <ol class="breadcrumb">
    <li><a href="/">Início</a></li>
    <li><a href="/news">{t('nav.news')}</a></li>
    {#if post}<li aria-current="page">{post.title}</li>{/if}
  </ol>
</nav>

{#if loading}
  <div class="skeleton-hero" style="width: 100%; height: 40vh; background: rgba(255,255,255,0.05); margin-bottom: 2rem;"></div>
  <div class="page-container article-container">
    <div style="width: 100%; height: 400px; background: rgba(255,255,255,0.05);"></div>
  </div>
{:else if error}
  <main class="page-container" style="text-align: center; padding: 4rem;">
    <p class="error" style="font-size: 1.2rem; color: var(--color-primary);">{error}</p>
    <button class="btn btn-primary" on:click={() => location.reload()} style="margin-top: 1rem;">Tentar novamente</button>
  </main>
{:else if post}
  <article class="post-content">
    <header class="post-hero" style="background-image: url({post.coverImage})">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <time datetime={post.publishedAt}>{t('news.postedOn', { date: new Date(post.publishedAt).toLocaleDateString() })}</time>
        <h1 class="post-title">{post.title}</h1>
        <div class="tags">
          {#each post.tags as tag}<span class="tag">{tag}</span>{/each}
        </div>
      </div>
    </header>

    <div class="page-container article-container">
      <div class="markdown-content">
        {@html marked.parse(post.body)}
      </div>

      {#if post.relatedGame}
        <div class="related-game">
          <h3>Related Game: <a href="/games/{post.relatedGame}">{post.relatedGame}</a></h3>
        </div>
      {/if}
    </div>
  </article>
{/if}

<style>
  .breadcrumb-nav { max-width: 800px; margin: 0 auto; padding: 1rem 2rem; position: absolute; z-index: 10; width: 100%; left: 0; right: 0; }
  .breadcrumb { list-style: none; display: flex; gap: 0.5rem; margin: 0; padding: 0; font-size: 0.85rem; color: rgba(255,255,255,0.7); }
  .breadcrumb li { display: flex; align-items: center; gap: 0.5rem; }
  .breadcrumb li:not(:last-child)::after { content: '/'; color: rgba(255,255,255,0.3); }
  .breadcrumb a { transition: color 0.2s; }
  .breadcrumb a:hover { color: var(--color-primary); }

  .post-hero { position: relative; width: 100%; min-height: 40vh; display: flex; align-items: flex-end; padding: 4rem 2rem; background-size: cover; background-position: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--color-bg) 0%, rgba(26,26,46,0.5) 100%); }
  .hero-content { position: relative; z-index: 2; max-width: 800px; margin: 0 auto; width: 100%; display: flex; flex-direction: column; gap: 1rem; }
  time { font-size: 0.9rem; color: var(--color-primary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: -0.5rem; }
  .post-title { font-size: 3.5rem; color: white; margin: 0; line-height: 1.1; text-shadow: 0 4px 20px rgba(0,0,0,0.5); }
  
  .tags { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
  .tag { background: rgba(255,255,255,0.1); padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; }

  .page-container { max-width: 800px; margin: 0 auto; padding: 4rem 2rem; }
  .article-container { font-size: 1.1rem; line-height: 1.8; color: rgba(255,255,255,0.9); }

  .related-game { margin-top: 4rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); }
  .related-game a { color: var(--color-primary); text-decoration: none; }
  .related-game a:hover { text-decoration: underline; }

  /* MarkDown Styles */
  :global(.markdown-content h1, .markdown-content h2, .markdown-content h3) { color: var(--color-text); margin: 2rem 0 1rem; }
  :global(.markdown-content p) { margin-bottom: 1.5rem; }
  :global(.markdown-content img) { border-radius: var(--radius); border: 1px solid rgba(255,255,255,0.1); margin: 2rem 0; }
  :global(.markdown-content a) { color: var(--color-accent); text-decoration: underline; text-decoration-color: transparent; transition: text-decoration-color 0.2s; }
  :global(.markdown-content a:hover) { text-decoration-color: var(--color-accent); }
  :global(.markdown-content ul, .markdown-content ol) { margin-bottom: 1.5rem; padding-left: 1.5rem; }
  :global(.markdown-content li) { margin-bottom: 0.5rem; }
  :global(.markdown-content blockquote) { padding-left: 1.5rem; border-left: 4px solid var(--color-primary); color: var(--color-muted); font-style: italic; margin-bottom: 1.5rem; }

  @media (max-width: 640px) {
    .post-title { font-size: 2.5rem; }
  }
</style>
