// ==============================================================================
// CAMADA: Persistencia (src/repositories)
// RESPONSABILIDADE: Implementar IEmprestimoRepository no PostgreSQL e traduzir snake_case para camelCase
// QUEM CHAMA ESTE ARQUIVO (de onde vem): src/routes.ts (instancia na composicao raiz) e EmprestimoService via interface
// O QUE ESTE ARQUIVO CHAMA (para onde vai): pool (PostgresDb.ts) para executar SQL e entidade Emprestimo
// BIBLIOTECAS: 'pg' indiretamente via PostgresDb.ts
// ==============================================================================

// Importa o contrato IEmprestimoRepository da camada de Contratos para cumprir o DIP
import { IEmprestimoRepository } from '../interfaces/IEmprestimoRepository';
// Importa a entidade Emprestimo da camada de Dominio para retorno tipado aos servicos
import { Emprestimo } from '../entities/Emprestimo';
// Importa o pool de conexoes PostgreSQL da propria camada de Persistencia
import { pool } from './PostgresDb';

/** Formato bruto da linha da tabela 'emprestimos' (colunas em snake_case do PostgreSQL). */
interface LinhaEmprestimo {
  // Coluna id (SERIAL) retornada como numero
  id: number;
  // Coluna id_usuario (INT FK) em snake_case no banco de dados
  id_usuario: number;
  // Coluna id_livro (INT FK) em snake_case no banco de dados
  id_livro: number;
  // Coluna data_emprestimo (TIMESTAMP) convertida para Date pelo driver pg
  data_emprestimo: Date;
  // Coluna data_devolucao (TIMESTAMP) convertida para Date ou null quando em aberto
  data_devolucao: Date | null;
// Encerra a definicao da interface local LinhaEmprestimo
}

/** Implementacao concreta de IEmprestimoRepository utilizando PostgreSQL. */
export class EmprestimoRepository implements IEmprestimoRepository {
  /** Traduz colunas snake_case do PostgreSQL para atributos camelCase da entidade Emprestimo. */
  private paraEntidade(linha: LinhaEmprestimo): Emprestimo {
    // Mapeia cada coluna SQL para o construtor da entidade (responsabilidade exclusiva da persistencia)
    return new Emprestimo(
      // Passa o id da linha SQL para Emprestimo.id
      linha.id,
      // Traduz snake_case id_usuario para camelCase idUsuario
      linha.id_usuario,
      // Traduz snake_case id_livro para camelCase idLivro
      linha.id_livro,
      // Traduz snake_case data_emprestimo para camelCase dataEmprestimo
      linha.data_emprestimo,
      // Traduz snake_case data_devolucao para camelCase dataDevolucao
      linha.data_devolucao
    // Encerra a chamada ao construtor de Emprestimo
    );
  // Encerra o metodo auxiliar de traducao
  }

  /** Registra um novo emprestimo no PostgreSQL deixando data_emprestimo por conta do DEFAULT do banco. */
  async salvar(dados: Pick<Emprestimo, 'idUsuario' | 'idLivro'>): Promise<Emprestimo> {
    // Query SQL parametrizada ($1, $2 previnem SQL injection) inserindo as FKs e retornando toda a linha criada
    const query = 'INSERT INTO emprestimos (id_usuario, id_livro) VALUES ($1, $2) RETURNING *';
    // Array de valores posicionais correspondentes a id_usuario ($1) e id_livro ($2)
    const values = [dados.idUsuario, dados.idLivro];
    // Executa a query de insercao no pool PostgreSQL
    const res = await pool.query<LinhaEmprestimo>(query, values);
    // Traduz a linha retornada pelo RETURNING * para a entidade Emprestimo em camelCase
    return this.paraEntidade(res.rows[0]);
  // Encerra o metodo salvar
  }

  /** Lista todos os emprestimos registrados ordenados pelo id crescente. */
  async buscarTodos(): Promise<Emprestimo[]> {
    // Executa SELECT ordenado por id para manter ordem cronologica consistente de registros
    const res = await pool.query<LinhaEmprestimo>('SELECT * FROM emprestimos ORDER BY id');
    // Converte todas as linhas em snake_case para instancias da entidade Emprestimo em camelCase
    return res.rows.map((linha) => this.paraEntidade(linha));
  // Encerra o metodo buscarTodos
  }
// Encerra a classe EmprestimoRepository
}
