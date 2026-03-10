<script lang="ts">
  import { onMount } from 'svelte';
  import { getAllPosts } from '$lib/api/posts';
  import type { PostDto } from '$lib/types';
  import PostCard from '$lib/components/PostCard.svelte';
  import Skeleton from '$lib/components/Skeleton.svelte';
  import { t } from '$lib/i18n';

  let posts: PostDto[] = [];
  let loading = true;
  let error = '';

  onMount(async () => {
    try {
      const allPosts = await getAllPosts();
      posts = allPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    } catch (e: unknown) {
      if (e instanceof Error && e.message.startsWith('rate_limited:')) {
        const seconds = e.message.split(':')[1];
        error = t('errors.rateLimited', { seconds });
      } else {
        error = t('errors.apiError');
      }
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>{t('nav.news')}</title>
</svelte:head>

<main class="page-container">
  <h1>{t('nav.news')}</h1>

  {#if loading}
    <div class="posts-grid">
      <Skeleton /><Skeleton /><Skeleton />
    </div>
  {:else if error}
    <div class="error-state">
      <p>{error}</p>
      <button class="btn btn-primary" on:click={() => location.reload()}>Tentar novamente</button>
    </div>
  {:else if posts.length === 0}
    <p class="empty-state">Nenhum conteúdo disponível.</p>
  {:else}
    <div class="posts-grid">
      {#each posts as post}
        <PostCard {post} />
      {/each}
    </div>
  {/if}
</main>

<style>
  .page-container { max-width: 1280px; margin: 0 auto; padding: 4rem 2rem; min-height: 70vh; }
  h1 { font-size: 3rem; margin-bottom: 2rem; color: var(--color-primary); }
  .posts-grid { display: grid; gap: 2rem; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); }
  .error-state, .empty-state { text-align: center; margin-top: 4rem; color: var(--color-muted); font-size: 1.2rem; }
</style>
