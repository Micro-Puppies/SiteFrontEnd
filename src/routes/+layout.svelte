<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { navigating, page } from '$app/stores';
  import { locale } from '$lib/stores/locale';
  import { getStudioConfig } from '$lib/api/studio';
  import type { StudioConfig } from '$lib/types';
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import '../lib/styles/global.css';

  let config: StudioConfig | null = null;
  let loading = true;
  let error = false;

  async function loadConfig() {
    try {
      config = await getStudioConfig();
      applyTheme(config.theme);
      if (typeof document !== 'undefined') {
        document.documentElement.lang = $locale;
      }
    } catch(e) {
      error = true;
    } finally {
      loading = false;
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
  $: if ($locale) {
    if (typeof document !== 'undefined') document.documentElement.lang = $locale;
    loadConfig();
  }
</script>

{#if loading}
  <div class="skeleton-grid" style="padding: 2rem;">
    <div class="skeleton" style="height: 60px; margin-bottom: 2rem;"></div>
    <div class="skeleton" style="height: 50vh;"></div>
  </div>
{:else if error || !config}
  <main style="padding: 4rem; text-align: center;">
    <h1>Error loading app configuration</h1>
    <p>Please check your backend connection.</p>
    <button class="btn btn-primary" on:click={() => location.reload()}>Retry</button>
  </main>
{:else}
  <NavBar studio={config} />
  
  {#key $navigating?.to?.url.pathname}
    <main in:fade={{ duration: 150 }}>
      <slot />
    </main>
  {/key}

  <Footer studio={config} />
{/if}

<style>
  .skeleton {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: var(--radius);
    width: 100%;
  }
  @keyframes loading {
    to { background-position-x: -200%; }
  }
</style>
