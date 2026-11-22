// ==============================================================================
// CAMADA: Testes / Dubles em Memoria (tests/fakes)
// RESPONSABILIDADE: Implementar IEmprestimoRepository em memoria para testar EmprestimoService sem Postgres
// QUEM CHAMA ESTE ARQUIVO (de onde vem): Suite de teste em tests/services/EmprestimoService.test.ts
// O QUE ESTE ARQUIVO CHAMA (para onde vai): Implementa IEmprestimoRepository e instancia a entidade Emprestimo
// BIBLIOTECAS: Nenhuma (TypeScript puro; prova pratica do DIP sem banco real)
// ==============================================================================

// Importa o contrato IEmprestimoRepository da camada de interfaces
import { IEmprestimoRepository } from '../../src/interfaces/IEmprestimoRepository';
// Importa a entidade Emprestimo da camada de dominio
import { Emprestimo } from '../../src/entities/Emprestimo';

/** Implementacao em memoria (Fake) de IEmprestimoRepository usada nos testes unitarios. */
export class EmprestimoRepositoryEmMemoria implements IEmprestimoRepository {
  // Armazena os registros de emprestimo em memoria simulando a tabela 'emprestimos'
  private emprestimos: Emprestimo[] = [];
  // Contador sequencial simulando SERIAL PRIMARY KEY do PostgreSQL
  private proximoId = 1;

  /** Registra um emprestimo em memoria gerando id, dataEmprestimo atual e dataDevolucao nula. */
  async salvar(dados: Pick<Emprestimo, 'idUsuario' | 'idLivro'>): Promise<Emprestimo> {
    // Cria a entidade Emprestimo simulando o DEFAULT CURRENT_TIMESTAMP do PostgreSQL
    const novoEmprestimo = new Emprestimo(
      // Atribui o proximo id sequencial
      this.proximoId++,
      // Associa o id do usuario solicitante
      dados.idUsuario,
      // Associa o id do livro retirado
      dados.idLivro,
      // Define a data/hora atual simulando o banco de dados
      new Date(),
      // Inicia sem data de devolucao (emprestimo em aberto)
      null
    // Encerra a instanciacao de Emprestimo
    );
    // Guarda o emprestimo no array em memoria
    this.emprestimos.push(novoEmprestimo);
    // Retorna o emprestimo criado
    return novoEmprestimo;
  // Encerra o metodo salvar
  }

  /** Retorna todos os emprestimos registrados em memoria em ordem de criacao. */
  async buscarTodos(): Promise<Emprestimo[]> {
    // Devolve uma copia rasa do array para evitar alteracoes externas acidentais
    return [...this.emprestimos];
  // Encerra o metodo buscarTodos
  }
// Encerra a classe EmprestimoRepositoryEmMemoria
}
