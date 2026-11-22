# Sistema de Gerenciamento de Biblioteca (`biblioteca-projeto-final-arq-soft`)

API REST para gerenciamento de usuários, livros e empréstimos construída com **Arquitetura Monolito em Camadas Fechadas**, aplicando o **Princípio da Inversão de Dependência (DIP)** e **Injeção Manual de Dependências (DI)** em TypeScript, Node.js 24, Express 5, PostgreSQL 15 e Docker.

## Arquitetura em Resumo

```text
Cliente HTTP -> routes.ts (DI) -> Controllers -> Services -> Interfaces (DIP) <- Repositories -> PostgreSQL
```

- **1 aplicação** (`src/index.ts`), **3 entidades** (`Usuario`, `Livro`, `Emprestimo`) e **5 rotas**:
  - `POST /usuarios`
  - `POST /livros`
  - `GET /livros`
  - `POST /emprestimos`
  - `GET /emprestimos`
- **Camadas fechadas**: `Controllers` falam apenas com `Services`; `Services` dependem apenas de `Interfaces` (nunca de `pg`, `Express` ou `Repositories`); apenas `src/routes.ts` instancia e injeta as classes concretas.

## Comandos Rápidos

```bash
# Subir API (porta 3000) e PostgreSQL (porta 5434 no host / 5432 interna) com Docker
docker compose up --build

# Ou definir outra porta externa para o PostgreSQL no host
DB_HOST_PORT=5433 docker compose up --build

# Rodar checagem de tipos TypeScript
npm run typecheck
```

## Documentação Completa

- O código original na raiz e em `src/` está limpo (sem comentários), enquanto a cópia integral **comentada linha a linha para estudo** está preservada na pasta [comentarios/](comentarios/).
- [Tutorial Completo de Construção, Comunicação e Execução](comentarios/docs/TUTORIAL.md)
- [Roteiro de Apresentação em Slides e Arguição (20 min)](comentarios/docs/ROTEIRO_APRESENTACAO.md)
