<script lang="ts">
  import { onMount } from 'svelte';
  import { getStudioConfig } from '$lib/api/studio';
  import type { StudioConfig } from '$lib/types';
  import { t } from '$lib/i18n';

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
</script>

<svelte:head>
  <title>{t('nav.contact')}</title>
</svelte:head>

<main class="page-container">
  <h1>{t('nav.contact')}</h1>

  {#if loading}
    <div class="skeleton" style="height: 400px; background: rgba(255,255,255,0.05);"></div>
  {:else if error}
    <div class="error-state">
      <p>{error}</p>
      <button class="btn btn-primary" on:click={() => location.reload()}>Tentar novamente</button>
    </div>
  {:else if config}
    <div class="contact-card">
      <h2>Get in Touch</h2>
      <p class="intro">Working with us or just saying hi? We'd love to hear from you.</p>

      <div class="contact-info">
        <div class="info-item">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
          <div>
            <strong>Email</strong>
            <a href="mailto:{config.contactEmail}">{config.contactEmail}</a>
          </div>
        </div>
      </div>

      <div class="social-links">
        <h3>Follow Us</h3>
        <div class="social-grid">
          {#each Object.entries(config.socialLinks || {}) as [network, url]}
            <a href={url} target="_blank" rel="noopener noreferrer" class="social-btn">
              {network}
            </a>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</main>

<style>
  .page-container { max-width: 800px; margin: 0 auto; padding: 4rem 2rem; min-height: 70vh; }
  h1 { font-size: 3rem; margin-bottom: 3rem; color: var(--color-primary); text-align: center; }
  
  .contact-card { background: rgba(255,255,255,0.02); padding: 4rem; border-radius: var(--radius); border: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 3rem; }
  h2 { font-family: var(--font-display); font-size: 2.5rem; margin: 0; color: var(--color-text); }
  .intro { font-size: 1.1rem; color: var(--color-muted); margin-top: -2.5rem; }

  .contact-info { margin-top: 1rem; }
  .info-item { display: flex; align-items: center; gap: 1.5rem; background: rgba(0,0,0,0.2); padding: 1.5rem 2rem; border-radius: var(--radius); border: 1px solid rgba(255,255,255,0.03); }
  .info-item svg { width: 32px; height: 32px; color: var(--color-primary); }
  .info-item strong { display: block; font-family: var(--font-display); font-size: 1.2rem; color: var(--color-text); letter-spacing: 0.05em; margin-bottom: 0.2rem; }
  .info-item a { font-size: 1.1rem; color: var(--color-muted); transition: color 0.2s; }
  .info-item a:hover { color: var(--color-primary); }

  .social-links h3 { font-family: var(--font-display); font-size: 1.5rem; color: var(--color-text); margin-bottom: 1.5rem; letter-spacing: 0.05em; }
  .social-grid { display: flex; gap: 1rem; flex-wrap: wrap; }
  .social-btn { display: inline-flex; align-items: center; justify-content: center; padding: 0.8rem 1.5rem; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius); color: var(--color-text); font-weight: 600; text-transform: capitalize; transition: all 0.2s ease; }
  .social-btn:hover { background: var(--color-primary); border-color: var(--color-primary); color: #0f0f1a; transform: translateY(-3px); }

  .error-state { text-align: center; margin-top: 4rem; color: var(--color-muted); font-size: 1.2rem; }

  @media (max-width: 640px) {
    .contact-card { padding: 2rem; }
    .info-item { flex-direction: column; text-align: center; }
  }
</style>
