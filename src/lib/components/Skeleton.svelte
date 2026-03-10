<div class="skeleton"></div>

<style>
  .skeleton {
    background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.05) 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: var(--radius);
    width: 100%;
    height: 100%;
    min-height: 200px;
  }
  @keyframes loading {
    to { background-position-x: -200%; }
  }
</style>
