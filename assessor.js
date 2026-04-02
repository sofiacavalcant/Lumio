// assessor.js — chat com o assessor IA (Gemini)

const messagesEl = document.getElementById('chat-messages');
const inputEl    = document.getElementById('chat-input');

function addBubble(texto, tipo) {
  const wrap = document.createElement('div');
  wrap.style.alignSelf = tipo === 'ia' ? 'flex-start' : 'flex-end';

  if (tipo === 'ia') {
    wrap.innerHTML = `
      <div style="font-size:0.7rem;color:#9B9A94;margin-bottom:3px;">Assessor Lumio</div>
      <div class="chat__bubble chat__bubble--ia">${texto}</div>
    `;
  } else {
    wrap.innerHTML = `
      <div style="font-size:0.7rem;color:#9B9A94;margin-bottom:3px;text-align:right;">Você</div>
      <div class="chat__bubble chat__bubble--user">${texto}</div>
    `;
  }

  messagesEl.appendChild(wrap);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addLoading() {
  const el = document.createElement('div');
  el.id = 'loading-bubble';
  el.style.alignSelf = 'flex-start';
  el.innerHTML = `
    <div class="chat__bubble chat__bubble--ia" style="color:#AFA9EC;">
      Analisando...
    </div>
  `;
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function removeLoading() {
  const el = document.getElementById('loading-bubble');
  if (el) el.remove();
}

async function enviarMensagem() {
  const texto = inputEl.value.trim();
  if (!texto) return;

  addBubble(texto, 'user');
  inputEl.value = '';
  addLoading();

  try {
    // Integração com backend Node.js (que chama a Gemini API)
    const res = await fetch('/api/ia/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensagem: texto })
    });

    const data = await res.json();
    removeLoading();
    addBubble(data.resposta, 'ia');

  } catch {
    removeLoading();
    // Fallback enquanto o backend não está pronto
    addBubble(
      'No momento estou sem conexão com o servidor. Tente novamente em breve.',
      'ia'
    );
  }
}

// Enviar com Enter
inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') enviarMensagem();
});
