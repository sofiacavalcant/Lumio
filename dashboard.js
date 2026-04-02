// dashboard.js — lógica do dashboard Lumio

const categorias = ['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Outros'];
const valores    = [840, 460, 350, 260, 180];
const cores      = ['#534AB7', '#1D9E75', '#BA7517', '#D85A30', '#888780'];

// ===== GRÁFICO DE BARRAS =====
const ctxBarras = document.getElementById('chart-barras').getContext('2d');
new Chart(ctxBarras, {
  type: 'bar',
  data: {
    labels: categorias,
    datasets: [{
      label: 'R$',
      data: valores,
      backgroundColor: cores,
      borderRadius: 6,
      borderSkipped: false,
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: ctx => `R$ ${ctx.parsed.y.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: {
        grid: { color: 'rgba(0,0,0,0.06)' },
        border: { display: false },
        ticks: {
          callback: v => `R$ ${v}`
        }
      }
    }
  }
});

// ===== GRÁFICO DE PIZZA =====
const ctxPizza = document.getElementById('chart-pizza').getContext('2d');
new Chart(ctxPizza, {
  type: 'doughnut',
  data: {
    labels: categorias,
    datasets: [{
      data: valores,
      backgroundColor: cores,
      borderWidth: 2,
      borderColor: '#fff',
    }]
  },
  options: {
    responsive: true,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { size: 12 }, padding: 12 }
      },
      tooltip: {
        callbacks: {
          label: ctx => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct   = Math.round((ctx.parsed / total) * 100);
            return `${ctx.label}: R$ ${ctx.parsed.toLocaleString('pt-BR')} (${pct}%)`;
          }
        }
      }
    }
  }
});

// ===== CONSELHO DA IA =====
// (quando o backend estiver pronto, substituir por fetch('/api/ia/conselho'))
async function carregarConselho() {
  const el = document.getElementById('ia-conselho');

  // placeholder até integrar Gemini
  const conselhos = [
    'Seus gastos com alimentação representam 33% das despesas deste mês — acima da média recomendada de 25%. Considere revisar refeições fora de casa.',
    'Você está no caminho certo! Seu saldo positivo de R$ 1.240 é 18% maior que o mês passado. Continue assim.',
    'Atenção: seus gastos com lazer atingiram o limite definido. Evite novos gastos nessa categoria até o fim do mês.'
  ];

  el.textContent = conselhos[Math.floor(Math.random() * conselhos.length)];
}

carregarConselho();
