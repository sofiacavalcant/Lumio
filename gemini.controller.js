import { enviarMensagem, limparSessao } from '../services/gemini.service.js';

export async function chat(req, res, next) {
  try {
    const { mensagem, dadosFinanceiros } = req.body;
    const sessionId = req.headers['x-session-id'];

    if (!sessionId) {
      return res.status(400).json({ erro: 'Header x-session-id é obrigatório.' });
    }

    if (!mensagem || typeof mensagem !== 'string' || mensagem.trim().length === 0) {
      return res.status(400).json({ erro: 'O campo mensagem não pode ser vazio.' });
    }

    if (mensagem.trim().length > 1000) {
      return res.status(400).json({ erro: 'Mensagem muito longa. Máximo 1000 caracteres.' });
    }

    const resposta = await enviarMensagem(sessionId, mensagem.trim(), dadosFinanceiros ?? null);

    return res.status(200).json({ resposta });
  } catch (error) {
    next(error);
  }
}

export function resetarChat(req, res) {
  const sessionId = req.headers['x-session-id'];

  if (!sessionId) {
    return res.status(400).json({ erro: 'Header x-session-id é obrigatório.' });
  }

  limparSessao(sessionId);
  return res.status(200).json({ mensagem: 'Conversa reiniciada com sucesso.' });
}
