import { ILivroRepository } from '../interfaces/ILivroRepository';
import { Livro } from '../entities/Livro';
import { pool } from './PostgresDb';

interface LinhaLivro {
  id: number;
  titulo: string;
  autor: string;
  disponivel: boolean;
}

export class LivroRepository implements ILivroRepository {
  private paraEntidade(linha: LinhaLivro): Livro {
    return new Livro(linha.id, linha.titulo, linha.autor, linha.disponivel);
  }

  async salvar(livro: Omit<Livro, 'id'>): Promise<Livro> {
    const query = 'INSERT INTO livros (titulo, autor, disponivel) VALUES ($1, $2, $3) RETURNING *';
    const values = [livro.titulo, livro.autor, livro.disponivel];
    const res = await pool.query<LinhaLivro>(query, values);
    return this.paraEntidade(res.rows[0]);
  }

  async buscarTodos(): Promise<Livro[]> {
    const res = await pool.query<LinhaLivro>('SELECT * FROM livros ORDER BY id');
    return res.rows.map((linha) => this.paraEntidade(linha));
  }

  async buscarPorId(id: number): Promise<Livro | null> {
    const res = await pool.query<LinhaLivro>('SELECT * FROM livros WHERE id = $1', [id]);
    const linha = res.rows[0];
    return linha ? this.paraEntidade(linha) : null;
  }

  async atualizarDisponibilidade(id: number, disponivel: boolean): Promise<void> {
    await pool.query('UPDATE livros SET disponivel = $1 WHERE id = $2', [disponivel, id]);
  }
}
