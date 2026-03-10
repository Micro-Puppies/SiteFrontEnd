<script lang="ts">
  import { onMount } from 'svelte';
  import { getStudioConfig } from '$lib/api/studio';
  import type { StudioConfig } from '$lib/types';
  import { t } from '$lib/i18n';
  import { marked } from 'marked';

  let config: StudioConfig | null = null;
  let loading = true;
  let error = '';

  onMount(async () => {
    try {
      config = await getStudioConfig();
    } catch (e: unknown) {
      error = e instanceof Error ? e.message : t('errors.apiError');
    } finally {
      loading = false;
    }
  });

  const renderer = new marked.Renderer();
  renderer.link = ({ href, text }) => `<a target="_blank" rel="noopener noreferrer" href="${href}">${text}</a>`;
  marked.use({ renderer });
</script>

<svelte:head>
  <title>{t('nav.about')}</title>
</svelte:head>

<main class="page-container">
  <h1>{t('nav.about')}</h1>

  {#if loading}
    <div class="skeleton" style="height: 400px; background: rgba(255,255,255,0.05);"></div>
  {:else if error}
    <div class="error-state">
      <p>{error}</p>
      <button class="btn btn-primary" on:click={() => location.reload()}>Tentar novamente</button>
    </div>
  {:else if config}
    <div class="about-content">
      <h2 class="studio-name">{config.studioName}</h2>
      <p class="tagline">{config.tagline}</p>
      <div class="markdown-content">
        {@html marked.parse(config.description)}
      </div>
    </div>
  {/if}
</main>

<style>
  .page-container { max-width: 800px; margin: 0 auto; padding: 4rem 2rem; min-height: 70vh; }
  h1 { font-size: 3rem; margin-bottom: 3rem; color: var(--color-primary); text-align: center; }
  
  .about-content { background: rgba(255,255,255,0.02); padding: 3rem; border-radius: var(--radius); border: 1px solid rgba(255,255,255,0.05); }
  .studio-name { font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--color-text); }
  .tagline { font-size: 1.2rem; color: var(--color-muted); font-style: italic; margin-bottom: 2rem; padding-bottom: 2rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
  
  .error-state { text-align: center; margin-top: 4rem; color: var(--color-muted); font-size: 1.2rem; }

  /* MarkDown Styles */
  :global(.markdown-content h1, .markdown-content h2, .markdown-content h3) { color: var(--color-text); margin: 2rem 0 1rem; }
  :global(.markdown-content p) { margin-bottom: 1.5rem; line-height: 1.8; color: rgba(255,255,255,0.85); font-size: 1.05rem; }
  :global(.markdown-content a) { color: var(--color-accent); text-decoration: underline; text-decoration-color: transparent; transition: text-decoration-color 0.2s; }
  :global(.markdown-content a:hover) { text-decoration-color: var(--color-accent); }
  :global(.markdown-content ul, .markdown-content ol) { margin-bottom: 1.5rem; padding-left: 1.5rem; }
  :global(.markdown-content li) { margin-bottom: 0.5rem; line-height: 1.8; color: rgba(255,255,255,0.85); font-size: 1.05rem; }

  @media (max-width: 640px) {
    .about-content { padding: 2rem; }
  }
</style>
