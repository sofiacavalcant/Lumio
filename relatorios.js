// relatorios.js

const historico = [
  { mes: 'Março/2026',    receitas: 3800, despesas: 2560 },
  { mes: 'Fevereiro/2026',receitas: 3800, despesas: 2340 },
  { mes: 'Janeiro/2026',  receitas: 3800, despesas: 2100 },
];

function fmt(v) {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

// ===== GRÁFICO COMPARATIVO =====
const ctx = document.getElementById('chart-comparativo').getContext('2d');
new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [...historico].reverse().map(h => h.mes),
    datasets: [
      {
        label: 'Receitas',
        data: [...historico].reverse().map(h => h.receitas),
        backgroundColor: '#1D9E75',
        borderRadius: 6,
      },
      {
        label: 'Despesas',
        data: [...historico].reverse().map(h => h.despesas),
        backgroundColor: '#534AB7',
        borderRadius: 6,
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: ctx => `${ctx.dataset.label}: R$ ${ctx.parsed.y.toLocaleString('pt-BR')}`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: {
        grid: { color: 'rgba(0,0,0,0.06)' },
        border: { display: false },
        ticks: { callback: v => `R$ ${v.toLocaleString('pt-BR')}` }
      }
    }
  }
});

// ===== HISTÓRICO =====
const el = document.getElementById('historico');
el.innerHTML = historico.map((h, i) => {
  const saldo    = h.receitas - h.despesas;
  const anterior = historico[i + 1];
  let variacao   = '';
  if (anterior) {
    const diff = Math.round(((h.despesas - anterior.despesas) / anterior.despesas) * 100);
    variacao = diff > 0
      ? `<span style="color:#A32D2D;font-size:0.75rem;">▲ +${diff}% despesas</span>`
      : `<span style="color:#0F6E56;font-size:0.75rem;">▼ ${diff}% despesas</span>`;
  }

  return `
    <div class="report-row">
      <span class="report-row__month">${h.mes}</span>
      <div class="report-row__vals">
        <span>Receitas <b>${fmt(h.receitas)}</b></span>
        <span>Despesas <b>${fmt(h.despesas)}</b></span>
        <span>Saldo <b style="color:#0F6E56;">${fmt(saldo)}</b></span>
        ${variacao}
      </div>
      <button class="btn btn--outline btn--sm" onclick="baixarPDF('${h.mes}')">
        Baixar PDF
      </button>
    </div>
  `;
}).join('');

function exportarPDF() {
  // TODO: fetch('/api/relatorios/exportar?mes=2026-03')
  alert('Exportação de PDF será implementada com o backend.');
}

function baixarPDF(mes) {
  alert(`Baixar PDF de ${mes} — implementar com backend.`);
}
