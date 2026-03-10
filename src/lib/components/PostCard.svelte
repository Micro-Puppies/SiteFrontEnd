<script lang="ts">
  import type { PostDto } from '$lib/types';
  import { t } from '$lib/i18n';
  export let post: PostDto;
</script>

<article class="post-card">
  <div class="card-image-wrapper">
    <img src={post.coverImage} alt={post.title} loading="lazy" />
  </div>
  <div class="card-body">
    <time datetime={post.publishedAt}>{t('news.postedOn', { date: new Date(post.publishedAt).toLocaleDateString() })}</time>
    <h3>{post.title}</h3>
    <p>{post.excerpt}</p>
    <a href="/news/{post.slug}" class="read-more">{t('news.readMore')} &rarr;</a>
  </div>
</article>

<style>
  .post-card { display: flex; flex-direction: column; gap: 1rem; }
  .card-image-wrapper { width: 100%; aspect-ratio: 16 / 9; overflow: hidden; border-radius: var(--radius); }
  .card-image-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
  .post-card:hover .card-image-wrapper img { transform: scale(1.04); }
  .card-body { display: flex; flex-direction: column; gap: 0.5rem; }
  time { font-size: 0.8rem; color: var(--color-primary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
  h3 { font-size: 1.3rem; margin: 0; line-height: 1.2; }
  p { font-size: 0.95rem; color: var(--color-muted); display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
  .read-more { font-weight: 700; font-size: 0.9rem; color: var(--color-text); margin-top: 0.5rem; display: inline-flex; align-items: center; gap: 0.3rem; transition: color 0.2s; }
  .read-more:hover { color: var(--color-primary); }
</style>
