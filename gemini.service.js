import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY não definida no arquivo .env');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL = 'gemini-1.5-flash';

const SYSTEM_PROMPT = `
Você é o Lumio, um assistente financeiro pessoal inteligente, direto e amigável.
Seu objetivo é ajudar o usuário a entender suas finanças, identificar padrões de gastos, 
sugerir formas de economizar e dar orientações financeiras práticas e personalizadas.

Regras:
- Responda SEMPRE em português brasileiro
- Use linguagem clara, acessível e objetiva
- Quando receber dados financeiros, analise-os antes de responder
- Não invente dados que não foram fornecidos pelo usuário
- Seja encorajador, mas honesto sobre a situação financeira
- Dê exemplos práticos sempre que possível
- Limite suas respostas a no máximo 4 parágrafos
`;

const sessoes = new Map();

const MAX_HISTORICO = 20;

function obterOuCriarSessao(sessionId) {
  if (!sessoes.has(sessionId)) {
    sessoes.set(sessionId, []);
  }
  return sessoes.get(sessionId);
}

function construirMensagem(pergunta, dadosFinanceiros) {
  if (!dadosFinanceiros) return pergunta;

  return `
[DADOS FINANCEIROS DO USUÁRIO]
- Receita total: R$ ${Number(dadosFinanceiros.receita).toFixed(2)}
- Despesa total: R$ ${Number(dadosFinanceiros.despesa).toFixed(2)}
- Saldo atual:   R$ ${Number(dadosFinanceiros.saldo).toFixed(2)}
- Gastos por categoria:
${dadosFinanceiros.categorias.map(c => `  • ${c.categoria}: R$ ${Number(c.total).toFixed(2)}`).join('\n')}

[PERGUNTA DO USUÁRIO]
${pergunta}
  `.trim();
}

export async function enviarMensagem(sessionId, pergunta, dadosFinanceiros = null) {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 1024,
    },
  });

  const historico = obterOuCriarSessao(sessionId);
  const mensagem = construirMensagem(pergunta, dadosFinanceiros);

  const chat = model.startChat({ history: historico });
  const resultado = await chat.sendMessage(mensagem);
  const resposta = resultado.response.text();

  historico.push({ role: 'user',  parts: [{ text: mensagem }] });
  historico.push({ role: 'model', parts: [{ text: resposta }] });

  if (historico.length > MAX_HISTORICO) {
    historico.splice(0, 2);
  }

  return resposta;
}

export function limparSessao(sessionId) {
  const existia = sessoes.has(sessionId);
  sessoes.delete(sessionId);
  return existia;
}

export function totalSessoes() {
  return sessoes.size;
}
