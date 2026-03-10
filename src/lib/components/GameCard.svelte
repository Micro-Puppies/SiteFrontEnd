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
