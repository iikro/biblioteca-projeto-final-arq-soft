import { IEmprestimoRepository } from '../interfaces/IEmprestimoRepository';
import { Emprestimo } from '../entities/Emprestimo';
import { pool } from './PostgresDb';

interface LinhaEmprestimo {
  id: number;
  id_usuario: number;
  id_livro: number;
  data_emprestimo: Date;
  data_devolucao: Date | null;
}

export class EmprestimoRepository implements IEmprestimoRepository {
  private paraEntidade(linha: LinhaEmprestimo): Emprestimo {
    return new Emprestimo(
      linha.id,
      linha.id_usuario,
      linha.id_livro,
      linha.data_emprestimo,
      linha.data_devolucao
    );
  }

  async salvar(dados: Pick<Emprestimo, 'idUsuario' | 'idLivro'>): Promise<Emprestimo> {
    const query = 'INSERT INTO emprestimos (id_usuario, id_livro) VALUES ($1, $2) RETURNING *';
    const values = [dados.idUsuario, dados.idLivro];
    const res = await pool.query<LinhaEmprestimo>(query, values);
    return this.paraEntidade(res.rows[0]);
  }

  async buscarTodos(): Promise<Emprestimo[]> {
    const res = await pool.query<LinhaEmprestimo>('SELECT * FROM emprestimos ORDER BY id');
    return res.rows.map((linha) => this.paraEntidade(linha));
  }
}
