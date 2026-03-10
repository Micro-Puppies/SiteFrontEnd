<script lang="ts">
  import type { StudioConfig } from '$lib/types';
  import { t } from '$lib/i18n';
  import LanguageSwitcher from './LanguageSwitcher.svelte';

  export let studio: StudioConfig;

  let menuOpen = false;
  function toggleMenu() { menuOpen = !menuOpen; }
</script>

<header class="navbar">
  <div class="navbar-container">
    <a href="/" class="logo" aria-label="{studio.studioName} Home">
      {studio.studioName}
    </a>

    <button class="hamburger" aria-expanded={menuOpen} aria-controls="nav-menu" aria-label="Menu" on:click={toggleMenu}>
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>

    <nav id="nav-menu" class="nav-links" class:open={menuOpen}>
      <ul>
        <li><a href="/games" on:click={() => menuOpen = false}>{t('nav.games')}</a></li>
        <li><a href="/news" on:click={() => menuOpen = false}>{t('nav.news')}</a></li>
        <li><a href="/about" on:click={() => menuOpen = false}>{t('nav.about')}</a></li>
        <li><a href="/contact" on:click={() => menuOpen = false}>{t('nav.contact')}</a></li>
      </ul>
      <div class="nav-utils">
        <LanguageSwitcher />
      </div>
    </nav>
  </div>
</header>

<style>
  .navbar { position: sticky; top: 0; left: 0; right: 0; z-index: 100; background: rgba(26, 26, 46, 0.85); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255,255,255,0.05); }
  .navbar-container { max-width: 1280px; margin: 0 auto; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; }
  .logo { font-family: var(--font-display); font-size: 1.8rem; font-weight: bold; letter-spacing: 0.1em; color: var(--color-primary); }
  .hamburger { display: none; flex-direction: column; gap: 5px; background: none; border: none; cursor: pointer; padding: 0.5rem; }
  .hamburger .bar { width: 25px; height: 2px; background-color: var(--color-text); transition: all 0.3s; }
  
  .nav-links { display: flex; align-items: center; gap: 2rem; }
  .nav-links ul { display: flex; list-style: none; gap: 1.5rem; margin: 0; padding: 0; }
  .nav-links a { font-weight: 600; font-size: 0.95rem; color: var(--color-text); transition: color 0.2s; }
  .nav-links a:hover { color: var(--color-primary); }
  .nav-utils { display: flex; align-items: center; gap: 1rem; }

  @media (max-width: 768px) {
    .hamburger { display: flex; }
    .nav-links { position: absolute; top: 100%; left: 0; right: 0; background: var(--color-bg); flex-direction: column; padding: 2rem; gap: 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); clip-path: polygon(0 0, 100% 0, 100% 0, 0 0); transition: clip-path 0.3s ease-in-out; }
    .nav-links.open { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
    .nav-links ul { flex-direction: column; align-items: center; gap: 2rem; }
    .nav-links a { font-size: 1.2rem; }
    .hamburger[aria-expanded="true"] .bar:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamburger[aria-expanded="true"] .bar:nth-child(2) { opacity: 0; }
    .hamburger[aria-expanded="true"] .bar:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  }
</style>
