// ==============================================================================
// CAMADA: Testes / Dubles em Memoria (tests/fakes)
// RESPONSABILIDADE: Implementar ILivroRepository em memoria para testar LivroService e EmprestimoService sem Postgres
// QUEM CHAMA ESTE ARQUIVO (de onde vem): Suites de teste em tests/services/LivroService.test.ts e EmprestimoService.test.ts
// O QUE ESTE ARQUIVO CHAMA (para onde vai): Implementa o contrato ILivroRepository e instancia a entidade Livro
// BIBLIOTECAS: Nenhuma (TypeScript puro; prova pratica do DIP sem banco real)
// ==============================================================================

// Importa a interface ILivroRepository da aplicacao para garantir o mesmo contrato do Postgres
import { ILivroRepository } from '../../src/interfaces/ILivroRepository';
// Importa a entidade Livro do dominio para criar e retornar objetos reais nos testes
import { Livro } from '../../src/entities/Livro';

/** Implementacao em memoria (Fake) de ILivroRepository usada exclusivamente nos testes unitarios. */
export class LivroRepositoryEmMemoria implements ILivroRepository {
  // Armazena os livros em um array local na memoria RAM em vez de gravar no PostgreSQL
  private livros: Livro[] = [];
  // Simula o campo SERIAL PRIMARY KEY do banco gerando IDs sequenciais a partir de 1
  private proximoId = 1;

  /** Salva um livro em memoria atribuindo um id incremental e retorna a entidade criada. */
  async salvar(livro: Omit<Livro, 'id'>): Promise<Livro> {
    // Cria a entidade Livro com o proximo id disponivel e os dados recebidos do Service
    const novoLivro = new Livro(this.proximoId++, livro.titulo, livro.autor, livro.disponivel);
    // Adiciona o novo livro ao array em memoria
    this.livros.push(novoLivro);
    // Retorna uma copia para simular desacoplamento de referencia de banco
    return new Livro(novoLivro.id, novoLivro.titulo, novoLivro.autor, novoLivro.disponivel);
  // Encerra o metodo salvar
  }

  /** Retorna todos os livros armazenados em memoria ordenados pela insercao/id. */
  async buscarTodos(): Promise<Livro[]> {
    // Mapeia cada item para uma nova instancia preservando o estado atual em memoria
    return this.livros.map((l) => new Livro(l.id, l.titulo, l.autor, l.disponivel));
  // Encerra o metodo buscarTodos
  }

  /** Busca um livro em memoria pelo id; devolve null quando nao encontrado. */
  async buscarPorId(id: number): Promise<Livro | null> {
    // Procura o primeiro livro no array cujo id seja estritamente igual ao informado
    const encontrado = this.livros.find((l) => l.id === id);
    // Retorna uma instancia de Livro se encontrado ou null caso contrario
    return encontrado ? new Livro(encontrado.id, encontrado.titulo, encontrado.autor, encontrado.disponivel) : null;
  // Encerra o metodo buscarPorId
  }

  /** Atualiza a propriedade disponivel do livro localizado em memoria. */
  async atualizarDisponibilidade(id: number, disponivel: boolean): Promise<void> {
    // Localiza a referencia interna do livro no array em memoria
    const livro = this.livros.find((l) => l.id === id);
    // Se o livro existir, atualiza seu status de disponibilidade in-place
    if (livro) {
      // Grava o novo valor booleano de disponibilidade (ex.: false apos emprestimo)
      livro.disponivel = disponivel;
    // Encerra a verificacao de existencia
    }
  // Encerra o metodo atualizarDisponibilidade
  }
// Encerra a classe LivroRepositoryEmMemoria
}
