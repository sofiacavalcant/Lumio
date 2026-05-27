const SESSION_ID = crypto.randomUUID();

const elementos = {
  chatBox: document.getElementById('chat-box'),
  input: document.getElementById('input-mensagem'),
  btnEnviar: document.getElementById('btn-enviar'),
  btnLimpar: document.getElementById('btn-limpar'),
};

const USUARIO_ID = localStorage.getItem('lumio_usuario_id') || 1;

function criarBolha(texto, tipo) {
  const div = document.createElement('div');
  div.classList.add('mensagem', tipo);
  div.textContent = texto;
  return div;
}

function adicionarMensagem(texto, tipo) {
  elementos.chatBox.appendChild(criarBolha(texto, tipo));
  elementos.chatBox.scrollTop = elementos.chatBox.scrollHeight;
}

function adicionarLoader() {
  const div = document.createElement('div');
  div.classList.add('mensagem', 'bot', 'loader');
  div.id = 'lumio-loader';
  div.textContent = 'Lumio está analisando...';
  elementos.chatBox.appendChild(div);
  elementos.chatBox.scrollTop = elementos.chatBox.scrollHeight;
}

function removerLoader() {
  document.getElementById('lumio-loader')?.remove();
}

function setCarregando(estado) {
  elementos.btnEnviar.disabled = estado;
  elementos.input.disabled = estado;
}

async function buscarResumoFinanceiro() {
  try {
    const res = await fetch(`/api/transacoes/resumo?usuario_id=${USUARIO_ID}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function enviarMensagem() {
  const texto = elementos.input.value.trim();
  if (!texto) return;

  adicionarMensagem(texto, 'usuario');
  elementos.input.value = '';
  setCarregando(true);
  adicionarLoader();

  const dadosFinanceiros = await buscarResumoFinanceiro();

  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-session-id': SESSION_ID,
      },
      body: JSON.stringify({ mensagem: texto, dadosFinanceiros }),
    });

    const dados = await res.json();
    removerLoader();

    if (!res.ok) {
      adicionarMensagem(`Erro: ${dados.erro || 'Tente novamente.'}`, 'bot erro');
    } else {
      adicionarMensagem(dados.resposta, 'bot');
    }
  } catch {
    removerLoader();
    adicionarMensagem('Não foi possível conectar ao servidor. Verifique se ele está rodando.', 'bot erro');
  } finally {
    setCarregando(false);
    elementos.input.focus();
  }
}

async function limparConversa() {
  try {
    await fetch('/api/gemini/chat', {
      method: 'DELETE',
      headers: { 'x-session-id': SESSION_ID },
    });
  } catch {}

  elementos.chatBox.innerHTML = '';
  adicionarMensagem('Olá! Sou o Lumio, seu assessor financeiro inteligente. Como posso ajudar você hoje?', 'bot');
}

elementos.btnEnviar.addEventListener('click', enviarMensagem);

elementos.input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    enviarMensagem();
  }
});

elementos.btnLimpar?.addEventListener('click', limparConversa);

adicionarMensagem('Olá! Sou o Lumio, seu assessor financeiro inteligente. Como posso ajudar você hoje?', 'bot');
