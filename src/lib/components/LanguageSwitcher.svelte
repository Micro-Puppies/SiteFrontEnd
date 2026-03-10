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
