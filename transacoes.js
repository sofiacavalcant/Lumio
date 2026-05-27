// transacoes.js — lógica da tela de transações

// Dados de exemplo (serão substituídos por fetch('/api/transacoes'))
let transacoes = [
  { id: 1, descricao: 'Salário ',  categoria: '—',           tipo: 'receita', valor: 3800, data: '2026-03-01' },
  { id: 2, descricao: 'Supermercado',   categoria: 'Alimentação', tipo: 'despesa', valor: 320,  data: '2026-03-05' },
  { id: 3, descricao: 'Uber',           categoria: 'Transporte',  tipo: 'despesa', valor: 47,   data: '2026-03-08' },
  { id: 4, descricao: 'Cinema + jantar',categoria: 'Lazer',       tipo: 'despesa', valor: 130,  data: '2026-03-12' },
  { id: 5, descricao: 'Farmácia',       categoria: 'Saúde',       tipo: 'despesa', valor: 85,   data: '2026-03-15' },
  { id: 6, descricao: 'Academia',       categoria: 'Saúde',       tipo: 'despesa', valor: 90,   data: '2026-03-18' },
  { id: 7, descricao: 'Restaurante',    categoria: 'Alimentação', tipo: 'despesa', valor: 95,   data: '2026-03-20' },
];

const POR_PAGINA = 5;
let paginaAtual = 1;

function formatarMoeda(v) {
  return `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
}

function formatarData(d) {
  const [y, m, dia] = d.split('-');
  return `${dia}/${m}/${y}`;
}

function filtrar() {
  paginaAtual = 1;
  renderizar();
}

function getFiltradas() {
  const mes  = document.getElementById('filtro-mes').value;
  const cat  = document.getElementById('filtro-categoria').value;
  const tipo = document.getElementById('filtro-tipo').value;

  return transacoes.filter(t => {
    const mesTok = t.data.slice(0, 7);
    if (mes  && mesTok !== mes)   return false;
    if (cat  && t.categoria !== cat) return false;
    if (tipo && t.tipo !== tipo)  return false;
    return true;
  });
}

function renderizar() {
  const lista   = getFiltradas();
  const total   = lista.length;
  const paginas = Math.ceil(total / POR_PAGINA);
  const slice   = lista.slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA);

  const tbody = document.getElementById('tbody');
  tbody.innerHTML = slice.map(t => `
    <tr>
      <td>${t.descricao}</td>
      <td>${t.categoria === '—' ? '—' : `<span class="badge badge--${t.tipo}">${t.categoria}</span>`}</td>
      <td>${formatarData(t.data)}</td>
      <td class="transactions-table__value transactions-table__value--${t.tipo}">
        ${t.tipo === 'receita' ? '+' : '−'}${formatarMoeda(t.valor)}
      </td>
      <td>
        <div style="display:flex;gap:6px;">
          <button class="btn btn--outline btn--sm" onclick="editarTransacao(${t.id})">Editar</button>
          <button class="btn btn--danger btn--sm" onclick="excluirTransacao(${t.id})">Excluir</button>
        </div>
      </td>
    </tr>
  `).join('') || '<tr><td colspan="5" style="text-align:center;color:#9B9A94;padding:2rem;">Nenhuma transação encontrada.</td></tr>';

  // Paginação
  const pag = document.getElementById('paginacao');
  pag.innerHTML = Array.from({ length: paginas }, (_, i) => `
    <button class="pagination__btn ${i + 1 === paginaAtual ? 'pagination__btn--active' : ''}"
      onclick="irPara(${i + 1})">${i + 1}</button>
  `).join('');
}

function irPara(p) {
  paginaAtual = p;
  renderizar();
}

function excluirTransacao(id) {
  if (!confirm('Deseja excluir esta transação?')) return;
  transacoes = transacoes.filter(t => t.id !== id);
  // TODO: fetch(`/api/transacoes/${id}`, { method: 'DELETE' })
  renderizar();
}

function editarTransacao(id) {
  // TODO: abrir modal preenchido com dados da transação
  alert(`Editar transação #${id} — implementar com backend`);
}

// ===== MODAL =====
function abrirModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.style.display = 'flex';
}

function fecharModal() {
  document.getElementById('modal-overlay').style.display = 'none';
  document.getElementById('form-transacao').reset();
}

document.getElementById('form-transacao').addEventListener('submit', function (e) {
  e.preventDefault();
  const data = new FormData(this);
  const nova = {
    id:        Date.now(),
    descricao: data.get('descricao'),
    categoria: data.get('categoria'),
    tipo:      data.get('tipo'),
    valor:     parseFloat(data.get('valor')),
    data:      data.get('data'),
  };
  transacoes.unshift(nova);
  // TODO: fetch('/api/transacoes', { method: 'POST', body: JSON.stringify(nova) })
  fecharModal();
  renderizar();
});

// Fecha modal clicando fora
document.getElementById('modal-overlay').addEventListener('click', function (e) {
  if (e.target === this) fecharModal();
});

// Init
renderizar();
