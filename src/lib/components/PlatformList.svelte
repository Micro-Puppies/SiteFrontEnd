<script lang="ts">
  export let platforms: string[];
</script>

<ul class="platform-list" aria-label="Plataformas">
  {#each platforms as platform}
    <li>{platform}</li>
  {/each}
</ul>

<style>
  .platform-list {
    display: flex; gap: 0.4rem; list-style: none;
  }
  li {
    font-size: 0.75rem; font-weight: 600;
    color: var(--color-muted);
    padding: 0.15em 0.5em;
    border: 1px solid var(--color-muted);
    border-radius: 4px;
    white-space: nowrap;
  }
</style>
