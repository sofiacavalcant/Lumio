const GEMINI_ERRORS = {
  API_KEY_INVALID: 'Chave da API Gemini inválida. Verifique o arquivo .env.',
  RESOURCE_EXHAUSTED: 'Cota da API Gemini esgotada. Tente mais tarde.',
  QUOTA_EXCEEDED: 'Limite de uso da API Gemini atingido.',
  PERMISSION_DENIED: 'Sem permissão para usar a API Gemini. Verifique sua chave.',
};

export default function errorHandler(err, req, res, next) {
  const isDev = process.env.NODE_ENV === 'development';

  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} — ${err.message}`);

  for (const [key, mensagem] of Object.entries(GEMINI_ERRORS)) {
    if (err.message?.includes(key) || err.message?.includes(key.toLowerCase())) {
      return res.status(503).json({ erro: mensagem });
    }
  }

  if (err.message?.includes('API key')) {
    return res.status(401).json({ erro: GEMINI_ERRORS.API_KEY_INVALID });
  }

  if (err.status === 429) {
    return res.status(429).json({ erro: 'Muitas requisições. Tente novamente em instantes.' });
  }

  return res.status(500).json({
    erro: 'Erro interno do servidor.',
    ...(isDev && { detalhe: err.message, stack: err.stack }),
  });
}
