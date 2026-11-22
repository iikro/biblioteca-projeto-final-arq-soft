// ==============================================================================
// CAMADA: Testes Unitarios (tests/services)
// RESPONSABILIDADE: Validar todas as regras de negocio de EmprestimoService com repositorios em memoria
// QUEM CHAMA ESTE ARQUIVO (de onde vem): Runner nativo 'npm test' (tsx --test "tests/**/*.test.ts")
// O QUE ESTE ARQUIVO CHAMA (para onde vai): EmprestimoService, erros de dominio e os 3 repositorios em memoria
// BIBLIOTECAS: 'node:test' (describe, test) e 'node:assert/strict' (assercoes nativas do Node 24)
// ==============================================================================

// Importa as primitivas describe e test do runner nativo 'node:test'
import { describe, test } from 'node:test';
// Importa assercoes estritas do modulo nativo 'node:assert/strict'
import assert from 'node:assert/strict';
// Importa o servico EmprestimoService da camada de negocio para testar sem HTTP nem SQL
import { EmprestimoService } from '../../src/services/EmprestimoService';
// Importa o erro de validacao/regra de negocio da camada de servicos
import { RegraDeNegocioError } from '../../src/services/errors/RegraDeNegocioError';
// Importa o erro de recurso nao encontrado (subclasse de RegraDeNegocioError)
import { NaoEncontradoError } from '../../src/services/errors/NaoEncontradoError';
// Importa o duble em memoria de emprestimos (IEmprestimoRepository)
import { EmprestimoRepositoryEmMemoria } from '../fakes/EmprestimoRepositoryEmMemoria';
// Importa o duble em memoria de livros (ILivroRepository)
import { LivroRepositoryEmMemoria } from '../fakes/LivroRepositoryEmMemoria';
// Importa o duble em memoria de usuarios (IUsuarioRepository)
import { UsuarioRepositoryEmMemoria } from '../fakes/UsuarioRepositoryEmMemoria';

/** Funcao auxiliar local para criar os 3 fakes e a instancia de EmprestimoService limpa em cada teste. */
function criarCenario() {
  // Cria repositorio fake de emprestimos
  const emprestimoRepo = new EmprestimoRepositoryEmMemoria();
  // Cria repositorio fake de livros
  const livroRepo = new LivroRepositoryEmMemoria();
  // Cria repositorio fake de usuarios
  const usuarioRepo = new UsuarioRepositoryEmMemoria();
  // Injeta as tres abstracoes em memoria no servico real de emprestimos (DIP)
  const service = new EmprestimoService(emprestimoRepo, livroRepo, usuarioRepo);
  // Retorna o servico e os repositorios para preparar dados e conferir efeitos colaterais
  return { service, emprestimoRepo, livroRepo, usuarioRepo };
// Encerra a funcao auxiliar criarCenario
}

// Agrupa todos os cenarios de teste unitario do EmprestimoService
describe('EmprestimoService', () => {
  // Caso 1: garante fluxo completo de sucesso e alteracao de disponibilidade do livro para false
  test('deve realizar emprestimo valido e marcar o livro como indisponivel', async () => {
    // Inicializa cenario limpo com fakes em memoria
    const { service, livroRepo, usuarioRepo } = criarCenario();
    // Prepara um usuario existente no repositorio fake
    const usuario = await usuarioRepo.salvar({ nome: 'Pedro', email: 'pedro@email.com' });
    // Prepara um livro disponivel no repositorio fake
    const livro = await livroRepo.salvar({ titulo: 'Refactoring', autor: 'Martin Fowler', disponivel: true });

    // Executa o caso de uso realizarEmprestimo
    const emprestimo = await service.realizarEmprestimo({
      // Passa o id do usuario criado
      idUsuario: usuario.id,
      // Passa o id do livro disponivel
      idLivro: livro.id,
    // Encerra payload do emprestimo
    });

    // Verifica que o emprestimo recebeu id 1
    assert.equal(emprestimo.id, 1);
    // Verifica vinculo correto com idUsuario
    assert.equal(emprestimo.idUsuario, usuario.id);
    // Verifica vinculo correto com idLivro
    assert.equal(emprestimo.idLivro, livro.id);
    // Verifica que dataEmprestimo foi preenchida como Date
    assert.ok(emprestimo.dataEmprestimo instanceof Date);
    // Verifica que dataDevolucao inicia como null
    assert.equal(emprestimo.dataDevolucao, null);

    // Consulta o livro novamente no repositorio para confirmar o efeito colateral da regra de negocio
    const livroAtualizado = await livroRepo.buscarPorId(livro.id);
    // Confirma que o livro foi marcado como indisponivel (disponivel === false)
    assert.equal(livroAtualizado?.disponivel, false);
  // Encerra o caso de teste 1
  });

  // Caso 2: garante NaoEncontradoError quando o usuario nao existir
  test('deve lancar NaoEncontradoError quando usuario nao existir', async () => {
    // Inicializa cenario com repositorio de usuarios vazio
    const { service, livroRepo } = criarCenario();
    // Cadastra apenas o livro para isolar a ausencia do usuario
    const livro = await livroRepo.salvar({ titulo: 'Clean Code', autor: 'Robert C. Martin', disponivel: true });

    // Verifica que lanca NaoEncontradoError com mensagem exata
    await assert.rejects(
      // Solicita emprestimo usando idUsuario inexistente
      () => service.realizarEmprestimo({ idUsuario: 999, idLivro: livro.id }),
      // Valida instancia de NaoEncontradoError e texto esperado
      (erro: unknown) =>
        erro instanceof NaoEncontradoError && erro.message === 'Usuário não encontrado.'
    // Encerra assercao assert.rejects
    );
  // Encerra o caso de teste 2
  });

  // Caso 3: garante NaoEncontradoError quando o livro nao existir
  test('deve lancar NaoEncontradoError quando livro nao existir', async () => {
    // Inicializa cenario com repositorio de livros vazio
    const { service, usuarioRepo } = criarCenario();
    // Cadastra apenas o usuario para isolar a ausencia do livro
    const usuario = await usuarioRepo.salvar({ nome: 'Lucas', email: 'lucas@email.com' });

    // Verifica que lanca NaoEncontradoError para livro inexistente
    await assert.rejects(
      // Solicita emprestimo com idLivro 9999 que nao existe
      () => service.realizarEmprestimo({ idUsuario: usuario.id, idLivro: 9999 }),
      // Confirma tipo NaoEncontradoError e mensagem padrao
      (erro: unknown) =>
        erro instanceof NaoEncontradoError && erro.message === 'Livro não encontrado.'
    // Encerra assercao assert.rejects
    );
  // Encerra o caso de teste 3
  });

  // Caso 4: garante bloqueio quando o livro ja estiver emprestado (disponivel=false)
  test('deve rejeitar emprestimo de livro ja emprestado com mensagem exata', async () => {
    // Inicializa cenario completo
    const { service, livroRepo, usuarioRepo } = criarCenario();
    // Cadastra usuario solicitante
    const usuario = await usuarioRepo.salvar({ nome: 'Julia', email: 'julia@email.com' });
    // Cadastra livro inicialmente disponivel
    const livro = await livroRepo.salvar({ titulo: 'Design Patterns', autor: 'GoF', disponivel: true });

    // Realiza o primeiro emprestimo com sucesso (passando o livro para disponivel=false)
    await service.realizarEmprestimo({ idUsuario: usuario.id, idLivro: livro.id });

    // Tenta emprestar o mesmo livro pela segunda vez e valida bloqueio
    await assert.rejects(
      // Dispara segunda requisicao de emprestimo para o livro ja ocupado
      () => service.realizarEmprestimo({ idUsuario: usuario.id, idLivro: livro.id }),
      // Confirma RegraDeNegocioError e mensagem exata do PDF/plano
      (erro: unknown) =>
        erro instanceof RegraDeNegocioError && erro.message === 'Livro já está emprestado.'
    // Encerra assercao assert.rejects
    );
  // Encerra o caso de teste 4
  });

  // Caso 5: garante rejeicao quando idUsuario ou idLivro nao forem inteiros positivos
  test('deve rejeitar ids invalidos com RegraDeNegocioError', async () => {
    // Inicializa cenario limpo
    const { service } = criarCenario();
    // Lista de payloads invalidos cobrindo zero, negativo, texto, decimal, booleano e ausente
    const entradasInvalidas = [
      // idUsuario zero
      { idUsuario: 0, idLivro: 1 },
      // idLivro negativo
      { idUsuario: 1, idLivro: -2 },
      // idUsuario textual nao numerico
      { idUsuario: 'abc', idLivro: 1 },
      // idLivro decimal
      { idUsuario: 1, idLivro: 1.5 },
      // idUsuario booleano (impede conversao de true para 1)
      { idUsuario: true, idLivro: 1 },
      // Campos omitidos
      {},
    // Encerra a lista de entradas invalidas
    ];

    // Itera sobre cada caso invalido verificando a mesma resposta de validacao
    for (const entrada of entradasInvalidas) {
      // Verifica que cada payload invalido rejeita com RegraDeNegocioError
      await assert.rejects(
        // Executa o servico com a entrada invalida atual
        () => service.realizarEmprestimo(entrada),
        // Valida classe e mensagem exata para IDs invalidos
        (erro: unknown) =>
          erro instanceof RegraDeNegocioError &&
          erro.message === 'idUsuario e idLivro devem ser números inteiros positivos.'
      // Encerra assert.rejects do item atual
      );
    // Encerra o loop for
    }
  // Encerra o caso de teste 5
  });

  // Caso 6: garante que listarEmprestimos retorna todos os registros salvos
  test('deve listar todos os emprestimos registrados', async () => {
    // Inicializa cenario completo
    const { service, livroRepo, usuarioRepo } = criarCenario();
    // Cria usuario para emprestimos
    const usuario = await usuarioRepo.salvar({ nome: 'Rafael', email: 'rafael@email.com' });
    // Cria dois livros disponiveis diferentes
    const livro1 = await livroRepo.salvar({ titulo: 'Livro A', autor: 'Autor A', disponivel: true });
    // Cria o segundo livro disponivel
    const livro2 = await livroRepo.salvar({ titulo: 'Livro B', autor: 'Autor B', disponivel: true });

    // Realiza dois emprestimos validos
    await service.realizarEmprestimo({ idUsuario: usuario.id, idLivro: livro1.id });
    // Realiza o segundo emprestimo
    await service.realizarEmprestimo({ idUsuario: usuario.id, idLivro: livro2.id });

    // Lista os emprestimos atraves do service
    const emprestimos = await service.listarEmprestimos();

    // Confirma que dois emprestimos foram listados
    assert.equal(emprestimos.length, 2);
    // Confirma os ids dos livros emprestados em ordem
    assert.equal(emprestimos[0].idLivro, livro1.id);
    // Confirma o segundo registro da listagem
    assert.equal(emprestimos[1].idLivro, livro2.id);
  // Encerra o caso de teste 6
  });
// Encerra a suite describe EmprestimoService
});
