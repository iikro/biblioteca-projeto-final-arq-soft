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

# Rodar os 14 testes unitários (sem precisar de Docker ou banco ativo)
npm test

# Executar demonstração automatizada das 5 rotas com curl (com a API rodando)
./scripts/demo.sh
```

## Documentação Completa

- [Tutorial Completo de Construção, Comunicação e Execução](docs/TUTORIAL.md)
- [Roteiro de Apresentação em Slides e Arguição (20 min)](docs/ROTEIRO_APRESENTACAO.md)
