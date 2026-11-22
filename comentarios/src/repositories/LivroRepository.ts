// ==============================================================================
// CAMADA: Persistencia (src/repositories)
// RESPONSABILIDADE: Implementar ILivroRepository executando SQL no PostgreSQL e traduzindo linhas para Livro
// QUEM CHAMA ESTE ARQUIVO (de onde vem): src/routes.ts (instancia na composicao raiz) e Services via ILivroRepository
// O QUE ESTE ARQUIVO CHAMA (para onde vai): pool (PostgresDb.ts) para executar SQL e entidade Livro
// BIBLIOTECAS: 'pg' indiretamente via PostgresDb.ts
// ==============================================================================

// Importa a interface ILivroRepository da camada de Contratos para garantir a implementacao do DIP
import { ILivroRepository } from '../interfaces/ILivroRepository';
// Importa a entidade Livro da camada de Dominio para construir objetos tipados retornados aos servicos
import { Livro } from '../entities/Livro';
// Importa o pool de conexoes PostgreSQL da propria camada de Persistencia
import { pool } from './PostgresDb';

/** Formato bruto da linha retornada pelo PostgreSQL na tabela 'livros'. */
interface LinhaLivro {
  // Coluna id (SERIAL) retornada como numero pelo driver pg
  id: number;
  // Coluna titulo (VARCHAR) retornada como string
  titulo: string;
  // Coluna autor (VARCHAR) retornada como string
  autor: string;
  // Coluna disponivel (BOOLEAN) retornada como boolean
  disponivel: boolean;
// Encerra a definicao da interface local LinhaLivro
}

/** Implementacao concreta de ILivroRepository utilizando PostgreSQL. */
export class LivroRepository implements ILivroRepository {
  /** Converte uma linha SQL da tabela livros para uma instancia da entidade de dominio Livro. */
  private paraEntidade(linha: LinhaLivro): Livro {
    // Instancia e retorna a entidade Livro garantindo o encapsulamento dos dados vindos do banco
    return new Livro(linha.id, linha.titulo, linha.autor, linha.disponivel);
  // Encerra o metodo auxiliar de traducao
  }

  /** Insere um novo livro no PostgreSQL e retorna a entidade persistida com o id gerado. */
  async salvar(livro: Omit<Livro, 'id'>): Promise<Livro> {
    // Query SQL parametrizada ($1, $2, $3 previnem SQL injection) que devolve a linha inserida via RETURNING *
    const query = 'INSERT INTO livros (titulo, autor, disponivel) VALUES ($1, $2, $3) RETURNING *';
    // Array de valores vinculados posicionalmente aos placeholders $1, $2 e $3
    const values = [livro.titulo, livro.autor, livro.disponivel];
    // Envia a consulta parametrizada ao banco atraves do pool de conexoes
    const res = await pool.query<LinhaLivro>(query, values);
    // Traduz a primeira linha retornada (registro recem-criado) para a entidade Livro
    return this.paraEntidade(res.rows[0]);
  // Encerra o metodo salvar
  }

  /** Busca todos os livros cadastrados ordenados pelo id crescente. */
  async buscarTodos(): Promise<Livro[]> {
    // Executa SELECT ordenado por id para manter listagem previsivel e deterministica
    const res = await pool.query<LinhaLivro>('SELECT * FROM livros ORDER BY id');
    // Mapeia cada linha do banco para a entidade Livro usando o metodo auxiliar privado
    return res.rows.map((linha) => this.paraEntidade(linha));
  // Encerra o metodo buscarTodos
  }

  /** Procura um livro pelo id; retorna null quando nao houver registro correspondente. */
  async buscarPorId(id: number): Promise<Livro | null> {
    // Consulta parametrizada ($1 evita SQL injection) buscando exatamente o livro pelo id
    const res = await pool.query<LinhaLivro>('SELECT * FROM livros WHERE id = $1', [id]);
    // Extrai a primeira linha se encontrada ou undefined caso o resultado esteja vazio
    const linha = res.rows[0];
    // Converte para entidade Livro se existir, caso contrario devolve null conforme o contrato
    return linha ? this.paraEntidade(linha) : null;
  // Encerra o metodo buscarPorId
  }

  /** Atualiza a coluna disponivel de um livro especifico no PostgreSQL. */
  async atualizarDisponibilidade(id: number, disponivel: boolean): Promise<void> {
    // Executa UPDATE parametrizado ($1 e $2 previnem SQL injection) alterando apenas a disponibilidade
    await pool.query('UPDATE livros SET disponivel = $1 WHERE id = $2', [disponivel, id]);
  // Encerra o metodo atualizarDisponibilidade
  }
// Encerra a classe LivroRepository
}
