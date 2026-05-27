import crypto from 'crypto';
import db from '../config/database.js';

function hashSenha(senha) {
  return crypto.createHash('sha256').update(senha + process.env.GEMINI_API_KEY).digest('hex');
}

function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function registrar(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      erro: 'Campos obrigatórios ausentes.',
      obrigatorios: ['nome', 'email', 'senha'],
    });
  }

  if (!validarEmail(email)) {
    return res.status(400).json({ erro: 'Email inválido.' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ erro: 'Senha deve ter no mínimo 6 caracteres.' });
  }

  const existente = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email.toLowerCase());
  if (existente) {
    return res.status(409).json({ erro: 'Email já cadastrado.' });
  }

  const result = db
    .prepare('INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)')
    .run(nome.trim(), email.toLowerCase(), hashSenha(senha));

  res.status(201).json({
    id: result.lastInsertRowid,
    nome: nome.trim(),
    email: email.toLowerCase(),
  });
}

export function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
  }

  const usuario = db
    .prepare('SELECT * FROM usuarios WHERE email = ? AND senha = ?')
    .get(email.toLowerCase(), hashSenha(senha));

  if (!usuario) {
    return res.status(401).json({ erro: 'Email ou senha incorretos.' });
  }

  res.json({
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
  });
}
