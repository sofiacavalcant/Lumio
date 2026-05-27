import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, '../../lumio.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    nome      TEXT    NOT NULL,
    email     TEXT    UNIQUE NOT NULL,
    senha     TEXT    NOT NULL,
    criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS transacoes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id  INTEGER NOT NULL,
    tipo        TEXT    NOT NULL CHECK(tipo IN ('receita','despesa')),
    valor       REAL    NOT NULL CHECK(valor > 0),
    categoria   TEXT    NOT NULL,
    descricao   TEXT    DEFAULT '',
    data        TEXT    NOT NULL,
    criado_em   DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_transacoes_usuario ON transacoes(usuario_id);
  CREATE INDEX IF NOT EXISTS idx_transacoes_data    ON transacoes(data);
`);

export default db;
