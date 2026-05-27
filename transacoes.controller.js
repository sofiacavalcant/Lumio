import db from '../config/database.js';

export function listar(req, res) {
  const { usuario_id = 1, tipo, categoria, data_inicio, data_fim } = req.query;

  let query = 'SELECT * FROM transacoes WHERE usuario_id = ?';
  const params = [usuario_id];

  if (tipo) {
    query += ' AND tipo = ?';
    params.push(tipo);
  }

  if (categoria) {
    query += ' AND categoria = ?';
    params.push(categoria);
  }

  if (data_inicio) {
    query += ' AND data >= ?';
    params.push(data_inicio);
  }

  if (data_fim) {
    query += ' AND data <= ?';
    params.push(data_fim);
  }

  query += ' ORDER BY data DESC, criado_em DESC';

  const transacoes = db.prepare(query).all(...params);
  res.json({ total: transacoes.length, transacoes });
}

export function buscarPorId(req, res) {
  const transacao = db
    .prepare('SELECT * FROM transacoes WHERE id = ? AND usuario_id = ?')
    .get(req.params.id, req.query.usuario_id || 1);

  if (!transacao) {
    return res.status(404).json({ erro: 'Transação não encontrada.' });
  }

  res.json(transacao);
}

export function criar(req, res) {
  const { usuario_id = 1, tipo, valor, categoria, descricao, data } = req.body;

  if (!tipo || !valor || !categoria || !data) {
    return res.status(400).json({
      erro: 'Campos obrigatórios ausentes.',
      obrigatorios: ['tipo', 'valor', 'categoria', 'data'],
    });
  }

  if (!['receita', 'despesa'].includes(tipo)) {
    return res.status(400).json({ erro: 'Tipo deve ser "receita" ou "despesa".' });
  }

  if (isNaN(valor) || Number(valor) <= 0) {
    return res.status(400).json({ erro: 'Valor deve ser um número positivo.' });
  }

  const stmt = db.prepare(`
    INSERT INTO transacoes (usuario_id, tipo, valor, categoria, descricao, data)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(usuario_id, tipo, Number(valor), categoria, descricao || '', data);

  const nova = db.prepare('SELECT * FROM transacoes WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(nova);
}

export function atualizar(req, res) {
  const { id } = req.params;
  const { tipo, valor, categoria, descricao, data } = req.body;

  const existente = db.prepare('SELECT id FROM transacoes WHERE id = ?').get(id);
  if (!existente) {
    return res.status(404).json({ erro: 'Transação não encontrada.' });
  }

  const stmt = db.prepare(`
    UPDATE transacoes SET tipo = ?, valor = ?, categoria = ?, descricao = ?, data = ?
    WHERE id = ?
  `);

  stmt.run(tipo, Number(valor), categoria, descricao || '', data, id);

  const atualizada = db.prepare('SELECT * FROM transacoes WHERE id = ?').get(id);
  res.json(atualizada);
}

export function remover(req, res) {
  const { id } = req.params;

  const existente = db.prepare('SELECT id FROM transacoes WHERE id = ?').get(id);
  if (!existente) {
    return res.status(404).json({ erro: 'Transação não encontrada.' });
  }

  db.prepare('DELETE FROM transacoes WHERE id = ?').run(id);
  res.status(200).json({ mensagem: 'Transação removida com sucesso.' });
}

export function resumo(req, res) {
  const { usuario_id = 1, mes, ano } = req.query;

  let filtroData = '';
  const params = [usuario_id];

  if (mes && ano) {
    filtroData = `AND strftime('%m', data) = ? AND strftime('%Y', data) = ?`;
    params.push(String(mes).padStart(2, '0'), String(ano));
  }

  const receita = db
    .prepare(`SELECT COALESCE(SUM(valor),0) AS total FROM transacoes WHERE usuario_id = ? AND tipo='receita' ${filtroData}`)
    .get(...params).total;

  const despesa = db
    .prepare(`SELECT COALESCE(SUM(valor),0) AS total FROM transacoes WHERE usuario_id = ? AND tipo='despesa' ${filtroData}`)
    .get(...params).total;

  const categorias = db
    .prepare(`
      SELECT categoria, SUM(valor) AS total, COUNT(*) AS quantidade
      FROM transacoes
      WHERE usuario_id = ? AND tipo = 'despesa' ${filtroData}
      GROUP BY categoria
      ORDER BY total DESC
    `)
    .all(...params);

  const ultimasTransacoes = db
    .prepare(`
      SELECT * FROM transacoes WHERE usuario_id = ?
      ORDER BY data DESC, criado_em DESC LIMIT 5
    `)
    .all(usuario_id);

  res.json({
    receita,
    despesa,
    saldo: receita - despesa,
    economia_percentual: receita > 0 ? (((receita - despesa) / receita) * 100).toFixed(1) : 0,
    categorias,
    ultimas_transacoes: ultimasTransacoes,
  });
}
