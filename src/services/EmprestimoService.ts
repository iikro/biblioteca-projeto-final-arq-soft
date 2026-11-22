// ==============================================================================
// CAMADA: Negocio / Services (src/services)
// RESPONSABILIDADE: Orquestrar validacoes e execucao de emprestimos de livros para usuarios
// QUEM CHAMA ESTE ARQUIVO (de onde vem): EmprestimoController (Presentation), routes.ts (instancia) e testes unitarios
// O QUE ESTE ARQUIVO CHAMA (para onde vai): Interfaces IEmprestimoRepository, ILivroRepository, IUsuarioRepository e erros
// BIBLIOTECAS: Nenhuma (nao conhece Express nem PostgreSQL/pg)
// ==============================================================================

// Importa a interface de persistencia de emprestimos (DIP)
import { IEmprestimoRepository } from '../interfaces/IEmprestimoRepository';
// Importa a interface de persistencia de livros para verificar existencia e atualizar disponibilidade (DIP)
import { ILivroRepository } from '../interfaces/ILivroRepository';
// Importa a interface de persistencia de usuarios para validar que o leitor existe (DIP)
import { IUsuarioRepository } from '../interfaces/IUsuarioRepository';
// Importa a entidade Emprestimo para tipagem do retorno
import { Emprestimo } from '../entities/Emprestimo';
// Importa erro de validacao de regra de negocio (mapeado para HTTP 400 pelo controller)
import { RegraDeNegocioError } from './errors/RegraDeNegocioError';
// Importa erro de entidade nao encontrada (mapeado para HTTP 404 pelo controller)
import { NaoEncontradoError } from './errors/NaoEncontradoError';

/** Contrato de entrada aceito pelo caso de uso de realizar emprestimo. */
export interface DadosRealizarEmprestimo {
  // Identificador do usuario recebido de forma nao confiavel da camada externa (validado no servico)
  idUsuario?: unknown;
  // Identificador do livro recebido de forma nao confiavel da camada externa (validado no servico)
  idLivro?: unknown;
// Encerra a definicao da interface de entrada
}

/** Servico responsavel pelas regras de negocio de emprestimos da biblioteca. */
export class EmprestimoService {
  // Injecao de dependencia via construtor: recebe tres interfaces (DIP) em vez de classes concretas do Postgres
  constructor(
    // Contrato para gravar e listar emprestimos
    private emprestimoRepository: IEmprestimoRepository,
    // Contrato para consultar o livro e marcar disponivel = false apos o emprestimo
    private livroRepository: ILivroRepository,
    // Contrato para confirmar que o usuario solicitante existe
    private usuarioRepository: IUsuarioRepository
  // Corpo vazio pois os modificadores 'private' criam e atribuem as dependencias automaticamente
  ) {}

  /** Valida usuario, livro e disponibilidade, registra o emprestimo e marca o livro como indisponivel. */
  async realizarEmprestimo(dados: DadosRealizarEmprestimo): Promise<Emprestimo> {
    // Converte idUsuario para numero, bloqueando booleanos pois Number(true) viraria 1 indevidamente
    const idUsuario = typeof dados.idUsuario === 'boolean' ? NaN : Number(dados.idUsuario);
    // Converte idLivro para numero, bloqueando booleanos pela mesma razao
    const idLivro = typeof dados.idLivro === 'boolean' ? NaN : Number(dados.idLivro);

    // Regra 1: ambos os identificadores devem ser numeros inteiros positivos maiores que zero
    if (!Number.isInteger(idUsuario) || idUsuario <= 0 || !Number.isInteger(idLivro) || idLivro <= 0) {
      // Lanca erro de regra de negocio caso algum id seja ausente, texto, decimal, zero ou negativo
      throw new RegraDeNegocioError('idUsuario e idLivro devem ser números inteiros positivos.');
    // Encerra validacao sintatica dos identificadores
    }

    // Regra 2: verifica na interface de usuarios se o leitor informado existe
    const usuario = await this.usuarioRepository.buscarPorId(idUsuario);
    // Se nao existir usuario com esse id, interrompe com erro especifico de nao encontrado
    if (!usuario) {
      // Controller traduzira NaoEncontradoError para HTTP 404
      throw new NaoEncontradoError('Usuário não encontrado.');
    // Encerra verificacao de existencia do usuario
    }

    // Regra 3: verifica na interface de livros se a obra informada existe
    const livro = await this.livroRepository.buscarPorId(idLivro);
    // Se o livro nao existir no acervo, interrompe com erro de nao encontrado
    if (!livro) {
      // Controller traduzira NaoEncontradoError para HTTP 404
      throw new NaoEncontradoError('Livro não encontrado.');
    // Encerra verificacao de existencia do livro
    }

    // Regra 4: o livro so pode ser emprestado se estiver disponivel (disponivel === true)
    if (!livro.disponivel) {
      // Lanca erro de regra de negocio impedindo emprestimo duplicado do mesmo exemplar
      throw new RegraDeNegocioError('Livro já está emprestado.');
    // Encerra verificacao de disponibilidade
    }

    // Passo 1 de escrita: grava o registro do emprestimo atraves do contrato IEmprestimoRepository
    const emprestimo = await this.emprestimoRepository.salvar({
      // Passa o id numerico validado do usuario
      idUsuario,
      // Passa o id numerico validado do livro
      idLivro,
    // Encerra objeto enviado ao metodo salvar
    });

    // Passo 2 de escrita: atualiza a disponibilidade do livro para false via ILivroRepository
    // Limitacao conhecida: as duas operacoes nao rodam dentro de transacao SQL unica (mantido simples pelo escopo didatico)
    await this.livroRepository.atualizarDisponibilidade(idLivro, false);

    // Devolve o objeto Emprestimo recem-criado para a camada de apresentacao
    return emprestimo;
  // Encerra o metodo realizarEmprestimo
  }

  /** Retorna todos os emprestimos registrados no sistema. */
  async listarEmprestimos(): Promise<Emprestimo[]> {
    // Delega a leitura integralmente para o contrato IEmprestimoRepository
    return await this.emprestimoRepository.buscarTodos();
  // Encerra o metodo listarEmprestimos
  }
// Encerra a classe EmprestimoService
}
