# Lumio — Assessor Financeiro Inteligente

Projeto desenvolvido para a disciplina **Desenvolvimento de Aplicações Web II**  
Instituto Federal da Paraíba — Campus Campina Grande

---

## Tecnologias

| Tecnologia | Uso |
|---|---|
| HTML | Estrutura das páginas |
| CSS / SASS | Estilização e componentes |
| Bootstrap | Responsividade (a integrar) |
| JavaScript | Interatividade do frontend |
| Node.js | Backend e API REST |
| SQLite | Banco de dados |
| Gemini API | Inteligência artificial |

---

## Estrutura do projeto

```
lumio/
├── src/
│   ├── pages/          # Páginas HTML
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── transacoes.html
│   │   ├── assessor.html
│   │   └── relatorios.html
│   ├── sass/           # Estilos SASS
│   │   ├── _variables.scss
│   │   ├── _base.scss
│   │   ├── _components.scss
│   │   └── main.scss
│   └── js/             # Scripts do frontend
│       ├── dashboard.js
│       ├── transacoes.js
│       ├── assessor.js
│       └── relatorios.js
├── public/             # Arquivos compilados (gerados)
├── server/             # Backend Node.js (a desenvolver)
└── README.md
```

---

## Como rodar (frontend estático)

Por enquanto o projeto roda sem backend — abra os arquivos HTML direto no navegador ou use a extensão **Live Server** no VS Code.

```bash
# Compilar SASS (requer Node.js)
npm install -g sass
sass --watch src/sass/main.scss:public/main.css
```

---

## Partes do projeto

| Parte | Entrega | Status |
|---|---|---|
| Parte 1 — Documento de Visão | 04/03 | ✅ Entregue |
| Parte 2 — Modelagem | 08/04 | ✅ Entregue |
| Parte 3 — Protótipos | 13/05 | 🔄 Em andamento |
| Parte 4 — Codificação | 10/06 | ⏳ Pendente |
