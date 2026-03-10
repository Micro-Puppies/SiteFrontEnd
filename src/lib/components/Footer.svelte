<script lang="ts">
  import type { StudioConfig } from '$lib/types';
  import { t } from '$lib/i18n';
  export let studio: StudioConfig;
</script>

<footer class="footer">
  <div class="footer-container">
    <div class="footer-brand">
      <div class="logo">{studio.studioName}</div>
      <p class="tagline">{studio.tagline}</p>
      {#if studio.newsletter.enabled}
        <form class="newsletter" action={studio.newsletter.actionUrl} method="POST" target="_blank">
          <label for="newsletter-email" class="sr-only">{t('footer.newsletter')}</label>
          <input type="email" id="newsletter-email" name="email" placeholder="Email address..." required />
          <button type="submit" class="btn btn-primary">Subscribe</button>
        </form>
      {/if}
    </div>
    <div class="footer-links">
      <div class="link-group">
        <h4>Menu</h4>
        <ul>
          <li><a href="/games">{t('nav.games')}</a></li>
          <li><a href="/news">{t('nav.news')}</a></li>
          <li><a href="/about">{t('nav.about')}</a></li>
          <li><a href="/contact">{t('nav.contact')}</a></li>
        </ul>
      </div>
      <div class="link-group">
        <h4>Social</h4>
        <ul>
          {#each Object.entries(studio.socialLinks || {}) as [network, url]}
            <li><a href={url} target="_blank" rel="noopener noreferrer">{network}</a></li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; {new Date().getFullYear()} {studio.studioName}. {t('footer.rights')}</p>
  </div>
</footer>

<style>
  .footer { background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.05); padding-top: 4rem; margin-top: 4rem; }
  .footer-container { max-width: 1280px; margin: 0 auto; padding: 0 2rem; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; }
  .logo { font-family: var(--font-display); font-size: 2rem; color: var(--color-primary); margin-bottom: 0.5rem; }
  .tagline { color: var(--color-muted); font-size: 1rem; margin-bottom: 2rem; }
  .newsletter { display: flex; gap: 0.5rem; max-width: 400px; }
  .newsletter input { flex: 1; padding: 0.65rem 1rem; border-radius: var(--radius); border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); color: var(--color-text); font-family: var(--font-body); }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0; }
  
  .footer-links { display: flex; gap: 4rem; justify-content: flex-end; }
  .link-group h4 { font-family: var(--font-body); font-size: 1.1rem; margin-bottom: 1.5rem; letter-spacing: normal; }
  .link-group ul { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.8rem; }
  .link-group a { color: var(--color-muted); font-size: 0.95rem; transition: color 0.2s; }
  .link-group a:hover { color: var(--color-primary); }

  .footer-bottom { border-top: 1px solid rgba(255,255,255,0.05); text-align: center; padding: 1.5rem; margin-top: 4rem; color: var(--color-muted); font-size: 0.85rem; }

  @media (max-width: 768px) {
    .footer-container { grid-template-columns: 1fr; gap: 3rem; }
    .footer-links { justify-content: flex-start; gap: 3rem; flex-wrap: wrap; }
  }
</style>
