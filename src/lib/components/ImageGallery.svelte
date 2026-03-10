<script lang="ts">
  export let images: string[];
  export let altPrefix: string = "Screenshot";
</script>

<div class="image-gallery">
  <div class="gallery-scroll">
    {#each images as img, i}
      <img src={img} alt="{altPrefix} {i + 1}" loading="lazy" />
    {/each}
  </div>
</div>

<style>
  .image-gallery { width: 100%; margin: 2rem 0; overflow: hidden; }
  .gallery-scroll { display: flex; gap: 1rem; overflow-x: auto; scroll-snap-type: x mandatory; scrollbar-width: thin; padding-bottom: 1rem; }
  .gallery-scroll::-webkit-scrollbar { height: 8px; }
  .gallery-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.05); border-radius: 4px; }
  .gallery-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
  
  img { scroll-snap-align: start; flex: 0 0 80%; max-width: 600px; aspect-ratio: 16 / 9; object-fit: cover; border-radius: var(--radius); border: 1px solid rgba(255,255,255,0.1); }
  
  @media (min-width: 768px) {
    .gallery-scroll { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); overflow-x: visible; padding-bottom: 0; }
    img { max-width: 100%; flex: auto; }
  }
</style>
