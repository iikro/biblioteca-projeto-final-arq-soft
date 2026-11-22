# Roteiro de Apresentação em Slides (20 Minutos) + Arguição

Este roteiro organiza a apresentação acadêmica do **Sistema de Gerenciamento de Biblioteca** em **10 slides**, totalizando exatamente **20 minutos** (expansão detalhada da Seção 5 do guia do projeto), seguido das respostas preparadas para a **arguição do professor** (Seção 6 + perguntas adicionais prováveis).

---

## Quadro-Resumo de Tempo (Total: 20 min)

| Slide | Tema | Tempo |
| :--- | :--- | :--- |
| Slide 1 | Capa | 1 min |
| Slide 2 | Domínio e Problema | 1 min 30 s |
| Slide 3 | Arquitetura Escolhida: Monolito em Camadas | 2 min |
| Slide 4 | Camadas Fechadas na Prática (Pastas e Imports) | 2 min |
| Slide 5 | DIP e Injeção Manual de Dependência (DI) | 3 min |
| Slide 6 | Fluxo Completo de uma Requisição | 2 min |
| Slide 7 | Regras de Negócio e Tratamento de Erros | 1 min 30 s |
| Slide 8 | Requisitos Técnicos e Containers Docker | 2 min |
| Slide 9 | Demonstração ao Vivo (`docker compose up --build` + Postman/Insomnia) | 4 min |
| Slide 10 | Conclusão e Próximos Passos | 1 min |
| **Total** | **10 slides** | **20 min** |

---

## Detalhamento Slide a Slide

### Slide 1: Capa
- **Tempo:** 1 min
- **Conteúdo na tela (bullets):**
  - **Título:** Sistema de Gerenciamento de Biblioteca
  - **Subtítulo:** Organização Escolhida: Arquitetura A — Monolito em Camadas Fechadas com DIP
  - **Tecnologias:** TypeScript, Node.js 24, Express 5, PostgreSQL 15, Docker Compose
  - **Autores:** `[Nome do Integrante 1]` e `[Nome do Integrante 2]` *(substituir pelos nomes da dupla)*
- **O que mostrar:**
  - Capa limpa com o título do trabalho e o diagrama resumido (`API + PostgreSQL`).
- **Notas de fala:**
  - *"Bom dia/boa noite, professor e colegas. Nós somos [Nome 1] e [Nome 2] e vamos apresentar o Sistema de Gerenciamento de Biblioteca, implementado seguindo a Arquitetura em Monolito em Camadas Fechadas, com foco rigoroso em separação de responsabilidades e Princípio da Inversão de Dependência (DIP)."*

---

### Slide 2: O Domínio e o Problema Resolvido
- **Tempo:** 1 min 30 s
- **Conteúdo na tela (bullets):**
  - Gerenciar leitores (`Usuario`), acervo (`Livro`) e retiradas (`Emprestimo`).
  - Garantir integridade sem depender de lógica manual no cliente:
    - Não cadastrar e-mail duplicado ou inválido.
    - Não emprestar livro inexistente ou já emprestado.
    - Atualizar automaticamente a disponibilidade do exemplar após o empréstimo.
  - Tamanho exato do escopo: **1 aplicação, 3 entidades, 5 rotas HTTP**.
- **O que mostrar:**
  - Print ou diagrama ER das 3 tabelas do arquivo `init.sql` (`usuarios`, `livros`, `emprestimos`) e a lista das 5 rotas.
- **Notas de fala:**
  - *"O domínio é simples para que o foco da disciplina — a arquitetura — fique transparente. Temos 3 entidades principais: Usuário, Livro e Empréstimo. O ponto central de negócio é garantir consistência: quando um empréstimo acontece, o livro deixa de estar disponível e uma segunda tentativa precisa ser barrada pela camada de serviço."*

---

### Slide 3: Arquitetura Escolhida — Monolito em Camadas
- **Tempo:** 2 min
- **Conteúdo na tela (bullets):**
  - **O que é:** Uma única unidade implantável (*deployable unit*) dividida logicamente em camadas horizontais por responsabilidade técnica.
  - **Regra cumprida:** **Camadas Fechadas** (*Closed Layers*).
  - **Direção única:** Requisição entra na Rota → Controller → Service → Interface → Repository → PostgreSQL.
  - **Benefício:** Simplicidade operacional sem abrir mão de baixo acoplamento e clareza arquitetural.
- **O que mostrar:**
  - Diagrama de blocos vertical de `comentarios/docs/TUTORIAL.md` (Seção 5):
    `Cliente HTTP -> Controllers (Presentation) -> Services (Business) -> Interfaces (DIP) <- Repositories (Persistence) -> PostgreSQL`.
- **Notas de fala:**
  - *"Escolhemos o Monolito em Camadas porque, para um sistema com 3 entidades, distribuir em microsserviços traria complexidade acidental de rede sem ganho real. O segredo para esse monolito não virar código espaguete é impor a regra das camadas fechadas: a requisição desce camada por camada, e nenhuma camada pula a vizinha."*

---

### Slide 4: Camadas Fechadas na Prática (Pastas e Regra de Import)
- **Tempo:** 2 min
- **Conteúdo na tela (bullets):**
  - `src/entities/`: Domínio puro (`Livro`, `Usuario`, `Emprestimo`) — não importa nada.
  - `src/interfaces/`: Contratos DIP/ISP — importam apenas `entities`.
  - `src/services/`: Regras de negócio — importam apenas `interfaces`, `entities` e `errors` (zero `pg`, zero `express`, zero `repositories`).
  - `src/repositories/`: SQL e `pg` — implementam `interfaces` e traduzem `snake_case` ↔ `camelCase`.
  - `src/controllers/`: HTTP (`Express`) — chamam apenas `services` (nunca `repositories`).
- **O que mostrar:**
  - Print da árvore de diretórios `src/` e o resultado vazio da checagem com `grep` mostrando que `services` e `controllers` nunca importam `repositories` ou `pg`.
- **Notas de fala:**
  - *"No papel todo diagrama é bonito, mas como garantimos que as camadas são realmente fechadas no código? Pela árvore de pastas e pelas importações. Um Controller só importa o Service. Um Service nunca importa `express` nem `pg`. Mesmo a tradução de nomes de colunas SQL como `id_usuario` para `idUsuario` fica isolada dentro de `EmprestimoRepository.paraEntidade`, protegendo o domínio."*

---

### Slide 5: DIP e Injeção Manual de Dependência (DI)
- **Tempo:** 3 min
- **Conteúdo na tela (bullets):**
  - **DIP (Dependency Inversion Principle):** O negócio (`Service`) depende da abstração (`Interface`), não do PostgreSQL.
  - **ISP (Interface Segregation Principle):** Cada interface expõe só o que os serviços precisam.
  - **Injeção Manual (`src/routes.ts`):** Único ponto (*Composition Root*) que conhece as classes concretas e conecta tudo no arranque da aplicação.
- **O que mostrar:**
  - Print lado a lado de três trechos reais:
    1. `src/interfaces/ILivroRepository.ts` (o contrato);
    2. Construtor de `src/services/LivroService.ts` (`constructor(private livroRepository: ILivroRepository)`);
    3. Bloco de montagem manual em `src/routes.ts` (`new LivroRepository()` → `new LivroService(livroRepo)` → `new LivroController(livroService)`).
- **Notas de fala:**
  - *"Este é o coração arquitetural do projeto. Olhem o construtor do `LivroService`: ele recebe `ILivroRepository`, que é apenas uma interface TypeScript. Ele não sabe que existe PostgreSQL. Quem decide qual banco usar é exclusivamente o arquivo `src/routes.ts`, onde fazemos a injeção manual de dependências. Isso dá controle explícito sem esconder nada atrás de frameworks mágicos, e garante pelo compilador TypeScript que o Service jamais dependa da implementação concreta."*

---

### Slide 6: Fluxo Completo de uma Requisição (`POST /emprestimos`)
- **Tempo:** 2 min
- **Conteúdo na tela (bullets):**
  - 1. `src/index.ts`: `express.json()` lê o corpo JSON.
  - 2. `src/routes.ts`: encaminha `POST /emprestimos` para `EmprestimoController.criar`.
  - 3. `EmprestimoController`: chama `EmprestimoService.realizarEmprestimo(req.body ?? {})`.
  - 4. `EmprestimoService`: valida IDs, busca usuário (`IUsuarioRepository`), busca livro (`ILivroRepository`), checa disponibilidade, grava empréstimo (`IEmprestimoRepository`) e marca livro como `disponivel = false`.
  - 5. `EmprestimoController`: devolve `201 Created` com JSON.
- **O que mostrar:**
  - O `sequenceDiagram` de `comentarios/docs/TUTORIAL.md` (Seção 8) mostrando a chamada percorrendo cada camada até o PostgreSQL e retornando.
- **Notas de fala:**
  - *"Acompanhando uma requisição real de empréstimo, vemos a fronteira clara de responsabilidades: o Controller só entende HTTP (`req`, `res`, status `201`). Toda a orquestração de regras fica no `EmprestimoService`, que conversa com três interfaces de repositório distintas antes de devolver a entidade pronta."*

---

### Slide 7: Regras de Negócio e Tratamento de Erros Desacoplado
- **Tempo:** 1 min 30 s
- **Conteúdo na tela (bullets):**
  - O Service **não sabe** o que é status `400`, `404` ou `500`.
  - Erros semânticos de domínio em `src/services/errors/`:
    - `RegraDeNegocioError` (dados faltando, e-mail duplicado, livro indisponível).
    - `NaoEncontradoError extends RegraDeNegocioError` (usuário ou livro inexistente).
  - `src/controllers/tratarErro.ts` traduz na camada de apresentação:
    - `NaoEncontradoError` → **HTTP 404**
    - `RegraDeNegocioError` → **HTTP 400**
    - Erros desconhecidos → log no servidor + **HTTP 500** genérico (sem vazar SQL).
- **O que mostrar:**
  - Print de `src/controllers/tratarErro.ts` destacando a verificação de `NaoEncontradoError` antes de `RegraDeNegocioError`.
- **Notas de fala:**
  - *"Um cuidado importante de camadas fechadas é não vazar códigos HTTP para dentro da regra de negócio. Por isso criamos `RegraDeNegocioError` e `NaoEncontradoError` na camada de serviços. Apenas na borda HTTP, em `tratarErro.ts`, decidimos que não encontrado vira 404 e regra violada vira 400."*

---

### Slide 8: Requisitos Técnicos e Infraestrutura Docker
- **Tempo:** 2 min
- **Conteúdo na tela (bullets):**
  - Código versionado no **GitHub** com histórico incremental de commits atômicos por camada.
  - Containers separados no `docker-compose.yml`:
    - `biblioteca_db`: `postgres:15-alpine` com `init.sql` e `healthcheck` TCP.
    - `biblioteca_api`: `node:24-alpine` com `tsx` e `depends_on: condition: service_healthy`.
  - **Porta configurável do banco:** `${DB_HOST_PORT:-5434}:5432` no host (evita conflito com Postgres local na `5432` e outro container na `5433`; internamente na rede Docker permanece `db:5432`).
  - **Escopo cumprido:** 1 aplicação, 3 entidades, 5 rotas.
- **O que mostrar:**
  - Print do `docker-compose.yml` e do `git log --oneline` mostrando a evolução do projeto camada por camada (inclusive o commit `fix` de resolução do conflito de porta).
- **Notas de fala:**
  - *"Todo o código está no GitHub com commits incrementais por camada. No Docker Compose, separamos a API e o banco em containers distintos. Um detalhe real de engenharia: como a porta 5432 já rodava um Postgres local e a 5433 outro container na máquina, deixamos a porta do host configurável em `DB_HOST_PORT` com padrão 5434, enquanto a comunicação interna entre containers segue na 5432."*

---

### Slide 9: Demonstração ao Vivo (Docker + Postman / Insomnia)
- **Tempo:** 4 min
- **Conteúdo na tela (bullets):**
  - Subida do ambiente no terminal: `docker compose up --build`.
  - Verificar logs: `biblioteca_db` `healthy` e `Servidor rodando na porta 3000`.
  - Chamar as rotas no Postman/Insomnia (payloads prontos em `comentarios/docs/TUTORIAL.md`):
    1. `POST /usuarios` → **201 Created**.
    2. `POST /livros` → **201 Created** (`disponivel: true`).
    3. `GET /livros` → **200 OK**.
    4. `POST /emprestimos` → **201 Created** (empréstimo válido).
    5. Repetir o mesmo `POST /emprestimos` → **400 Bad Request**: `{"erro":"Livro já está emprestado."}`.
    6. `GET /emprestimos` e `GET /livros` → confirmar que o livro passou para `disponivel: false`.
- **O que mostrar:**
  - Terminal rodando `docker compose up --build` + Postman/Insomnia executando cada chamada ao vivo.
- **Notas de fala:**
  - *"Vamos agora para a demonstração ao vivo. Subindo com `docker compose up --build`, observamos o healthcheck do banco passar primeiro e só depois a API iniciar na porta 3000. No Postman, criamos um usuário, criamos um livro, listamos o acervo e realizamos o empréstimo. Ao tentar emprestar o mesmo livro novamente, o `EmprestimoService` bloqueia com HTTP 400 e a mensagem `'Livro já está emprestado.'`, e na nova listagem o livro já aparece com `disponivel: false`."*

---

### Slide 10: Conclusão e Evolução
- **Tempo:** 1 min
- **Conteúdo na tela (bullets):**
  - Arquitetura em **Camadas Fechadas** garantiu código previsível, fácil de ler e manter.
  - **DIP + DI manual** isolaram a regra de negócio da infraestrutura e facilitam evolução futura.
  - **Próximos passos naturais:** transação SQL no empréstimo, rota de devolução e paginação.
- **O que mostrar:**
  - Resumo visual: `Organizado em camadas` + `Desacoplado via DIP` + `Portável via Docker`.
- **Notas de fala:**
  - *"Concluindo, entregamos um sistema com código original limpo e versão comentada linha a linha em `comentarios/`, estruturado em camadas fechadas, onde cada arquivo tem uma responsabilidade única e respeita o fluxo de cima para baixo. Ficamos à disposição para as perguntas da arguição."*

---

## Preparação para a Arguição (Perguntas do Professor)

### Pergunta 1 (do Guia): *"O que acontece se eu quiser trocar o PostgreSQL pelo MongoDB?"*
- **Resposta objetiva:**
  *"Como aplicamos o Princípio da Inversão de Dependência (DIP), a camada de negócio (`LivroService`, `UsuarioService` e `EmprestimoService`) e os `Controllers` não conhecem o PostgreSQL nem a biblioteca `pg` — eles dependem apenas das interfaces em `src/interfaces/`. Para migrar para o MongoDB, nós apenas criaríamos novas classes concretas (por exemplo, `LivroRepositoryMongo implements ILivroRepository`) dentro da camada de persistência e trocaríamos a instanciação na composição raiz em `src/routes.ts`. Nenhuma linha dos Services ou dos Controllers precisaria ser alterada."*

### Pergunta 2 (do Guia): *"Como vocês adicionariam uma nova rota para 'Devolução' de livro?"*
- **Resposta em 5 passos (de baixo para cima nas camadas):**
  1. **Interface (`src/interfaces/IEmprestimoRepository.ts`):** adicionaria os métodos necessários (ex.: `buscarPorId(id: number): Promise<Emprestimo | null>` e `registrarDevolucao(id: number, dataDevolucao: Date): Promise<Emprestimo>`).
  2. **Repositório (`src/repositories/EmprestimoRepository.ts`):** implementaria a consulta por `id` e o `UPDATE emprestimos SET data_devolucao = $1 WHERE id = $2 RETURNING *`.
  3. **Serviço (`src/services/EmprestimoService.ts`):** criaria o método de negócio `devolverLivro(idEmprestimo)` validando se o empréstimo existe (`NaoEncontradoError`), se já não foi devolvido (`RegraDeNegocioError`), registrando a `dataDevolucao` (eventualmente calculando multa por atraso) e chamando `livroRepository.atualizarDisponibilidade(emprestimo.idLivro, true)`.
  4. **Controller (`src/controllers/EmprestimoController.ts`):** criaria o método `devolver(req, res)` chamando `emprestimoService.devolverLivro(...)` dentro de `try/catch` com `tratarErro`.
  5. **Rotas (`src/routes.ts`):** registraria `router.post('/emprestimos/:id/devolucao', (req, res) => emprestimoController.devolver(req, res))`.

### Pergunta 3: *"Por que vocês usaram camadas fechadas e não camadas abertas?"*
- **Resposta:**
  *"Em camadas abertas, um Controller poderia chamar diretamente o Repository para operações simples como `GET /livros`. Isso reduz código inicial, mas quebra o limite arquitetural: regras futuras (como paginação, filtros ou ocultação de campos) acabam duplicadas nos controllers ou misturadas com HTTP. Com camadas fechadas, toda requisição passa pelo Service, mantendo um ponto único e consistente de controle e validação."*

### Pergunta 4: *"Se as camadas são fechadas, por que `src/routes.ts` importa Controllers, Services e Repositories ao mesmo tempo?"*
- **Resposta:**
  *"Porque `src/routes.ts` atua como a **Composição Raiz (Composition Root)** da aplicação — o ponto mais externo de inicialização onde o grafo de objetos é montado. As classes de negócio (`Services`) e apresentação (`Controllers`) continuam completamente isoladas entre si; quem injeta as implementações concretas nas interfaces na hora em que o servidor sobe é exclusivamente `routes.ts`."*

### Pergunta 5: *"Como vocês têm certeza de que o DIP está realmente funcionando no código?"*
- **Resposta:**
  *"Temos três garantias objetivas diretamente no código: primeiro, a auditoria estática de imports (`grep`) confirma zero referências a `pg` ou `src/repositories` dentro de `src/services/` e `src/controllers/`; segundo, a checagem de tipos do TypeScript (`npm run typecheck` com `strict: true`) garante que os Services recebem apenas as interfaces em `src/interfaces/` (`ILivroRepository`, `IUsuarioRepository`, `IEmprestimoRepository`), recusando qualquer método específico do banco que não esteja no contrato; e terceiro, toda a ligação concreta fica isolada em um único ponto na Composição Raiz (`src/routes.ts`), permitindo substituir qualquer implementação de repositório sem tocar nos Services."*

### Pergunta 6: *"O que acontece se o container do PostgreSQL cair no meio de uma requisição, e por que usar Monolito em vez de Microsserviços aqui?"*
- **Resposta:**
  *"Se o PostgreSQL cair, o `pool.query` lança um erro de conexão, que sobe até o bloco `catch` do Controller e entra no `tratarErro`. Como não é um erro de domínio (`RegraDeNegocioError`), o `tratarErro` registra o erro completo no log do servidor via `console.error` e devolve HTTP `500` com `{"erro": "Erro interno do servidor."}`, sem expor detalhes internos do banco ao cliente. Quanto à escolha arquitetural, um Monolito em Camadas é ideal para equipes pequenas e domínio coeso (3 entidades fortemente relacionadas), evitando latência de rede, consistência eventual e sobrecarga de deploy que microsserviços trariam sem necessidade."*
