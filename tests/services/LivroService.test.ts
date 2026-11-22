// ==============================================================================
// CAMADA: Testes Unitarios (tests/services)
// RESPONSABILIDADE: Validar as regras de negocio do LivroService usando repositorio em memoria (sem Postgres)
// QUEM CHAMA ESTE ARQUIVO (de onde vem): Runner nativo 'npm test' (tsx --test "tests/**/*.test.ts")
// O QUE ESTE ARQUIVO CHAMA (para onde vai): LivroService, RegraDeNegocioError e LivroRepositoryEmMemoria
// BIBLIOTECAS: 'node:test' (describe, test) e 'node:assert/strict' (assercoes nativas do Node 24)
// ==============================================================================

// Importa funcoes de organizacao e definicao de casos de teste do runner nativo do Node.js
import { describe, test } from 'node:test';
// Importa o modulo de assercoes estritas nativo do Node.js para validar retornos e excecoes
import assert from 'node:assert/strict';
// Importa o servico real da camada de negocio que sera testado isoladamente
import { LivroService } from '../../src/services/LivroService';
// Importa o erro de dominio esperado quando campos obrigatorios estiverem ausentes
import { RegraDeNegocioError } from '../../src/services/errors/RegraDeNegocioError';
// Importa o duble em memoria que implementa ILivroRepository (prova o funcionamento do DIP)
import { LivroRepositoryEmMemoria } from '../fakes/LivroRepositoryEmMemoria';

// Agrupa todos os cenarios de teste unitario do LivroService
describe('LivroService', () => {
  // Caso 1: garante que um livro valido e salvo com disponivel=true por padrao
  test('deve cadastrar um livro valido com disponivel=true por padrao', async () => {
    // Instancia o repositorio em memoria sem precisar de banco PostgreSQL ativo
    const livroRepo = new LivroRepositoryEmMemoria();
    // Injeta o repositorio em memoria no Service (mesma interface usada em producao)
    const livroService = new LivroService(livroRepo);

    // Executa o caso de uso de cadastro informando apenas titulo e autor
    const livro = await livroService.cadastrarLivro({
      // Titulo valido para cadastro
      titulo: 'Arquitetura Limpa',
      // Autor valido para cadastro
      autor: 'Robert C. Martin',
    // Encerra o payload de cadastro
    });

    // Verifica que o repositorio em memoria atribuiu o primeiro id sequencial
    assert.equal(livro.id, 1);
    // Verifica que o titulo foi salvo corretamente
    assert.equal(livro.titulo, 'Arquitetura Limpa');
    // Verifica que o autor foi salvo corretamente
    assert.equal(livro.autor, 'Robert C. Martin');
    // Verifica que o livro nasce disponivel=true por padrao quando nao informado
    assert.equal(livro.disponivel, true);
  // Encerra o caso de teste 1
  });

  // Caso 2: garante rejeicao quando o titulo nao for informado ou estiver vazio
  test('deve rejeitar cadastro sem titulo com RegraDeNegocioError', async () => {
    // Cria instancia isolada do repositorio em memoria para este teste
    const livroRepo = new LivroRepositoryEmMemoria();
    // Injeta no LivroService
    const livroService = new LivroService(livroRepo);

    // Verifica que a Promise rejeita com RegraDeNegocioError e mensagem esperada
    await assert.rejects(
      // Dispara tentativa invalida passando titulo composto apenas por espacos
      () => livroService.cadastrarLivro({ titulo: '   ', autor: 'Martin Fowler' }),
      // Valida classe de erro e texto exato retornado pela regra de negocio
      (erro: unknown) =>
        erro instanceof RegraDeNegocioError && erro.message === 'Título e autor são obrigatórios.'
    // Encerra assercao assert.rejects
    );
  // Encerra o caso de teste 2
  });

  // Caso 3: garante rejeicao quando o autor nao for informado
  test('deve rejeitar cadastro sem autor com RegraDeNegocioError', async () => {
    // Cria instancia isolada do repositorio em memoria
    const livroRepo = new LivroRepositoryEmMemoria();
    // Injeta no LivroService
    const livroService = new LivroService(livroRepo);

    // Verifica que a Promise rejeita quando apenas o titulo e informado
    await assert.rejects(
      // Dispara tentativa invalida omitindo o autor
      () => livroService.cadastrarLivro({ titulo: 'Domain-Driven Design' }),
      // Confirma o tipo RegraDeNegocioError e a mensagem padrao
      (erro: unknown) =>
        erro instanceof RegraDeNegocioError && erro.message === 'Título e autor são obrigatórios.'
    // Encerra assercao assert.rejects
    );
  // Encerra o caso de teste 3
  });

  // Caso 4: garante que listarLivros devolve todos os livros cadastrados
  test('deve listar todos os livros cadastrados', async () => {
    // Cria instancia isolada do repositorio em memoria
    const livroRepo = new LivroRepositoryEmMemoria();
    // Injeta no LivroService
    const livroService = new LivroService(livroRepo);

    // Cadastra o primeiro livro no repositorio em memoria
    await livroService.cadastrarLivro({ titulo: 'Livro Um', autor: 'Autor A' });
    // Cadastra o segundo livro marcando explicitamente disponivel=false
    await livroService.cadastrarLivro({ titulo: 'Livro Dois', autor: 'Autor B', disponivel: false });

    // Chama o metodo de listagem do servico
    const livros = await livroService.listarLivros();

    // Confirma que exatamente dois livros foram retornados
    assert.equal(livros.length, 2);
    // Confirma os dados do primeiro livro listado
    assert.equal(livros[0].titulo, 'Livro Um');
    // Confirma que a disponibilidade explicita do segundo livro foi preservada
    assert.equal(livros[1].disponivel, false);
  // Encerra o caso de teste 4
  });
// Encerra a suite describe LivroService
});
