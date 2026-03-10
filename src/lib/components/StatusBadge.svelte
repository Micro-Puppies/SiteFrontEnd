<script lang="ts">
  export let status: string;
  const labels: Record<string, string> = {
    'released': 'Lançado', 'early-access': 'Acesso Antecipado',
    'coming-soon': 'Em Breve', 'announced': 'Anunciado', 'wip': 'Em Desenvolvimento'
  };
</script>

<span class="status-badge status-{status}">{labels[status] ?? status}</span>

<style>
  .status-badge {
    display: inline-block; padding: 0.2em 0.7em;
    border-radius: 4px; font-size: 0.75rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.08em;
  }
  .status-released     { background: rgba(100,220,100,0.15); color: #64dc64; }
  .status-early-access { background: rgba(255,230,109,0.15); color: #FFE66D; }
  .status-coming-soon  { background: rgba(255,107,107,0.15); color: var(--color-primary); }
  .status-announced    { background: rgba(150,150,255,0.15); color: #9696ff; }
  .status-wip          { background: rgba(200,200,200,0.1);  color: var(--color-muted); }
</style>
