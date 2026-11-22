import { IUsuarioRepository } from '../interfaces/IUsuarioRepository';
import { Usuario } from '../entities/Usuario';
import { pool } from './PostgresDb';

interface LinhaUsuario {
  id: number;
  nome: string;
  email: string;
}

export class UsuarioRepository implements IUsuarioRepository {
  private paraEntidade(linha: LinhaUsuario): Usuario {
    return new Usuario(linha.id, linha.nome, linha.email);
  }

  async salvar(usuario: Omit<Usuario, 'id'>): Promise<Usuario> {
    const query = 'INSERT INTO usuarios (nome, email) VALUES ($1, $2) RETURNING *';
    const values = [usuario.nome, usuario.email];
    const res = await pool.query<LinhaUsuario>(query, values);
    return this.paraEntidade(res.rows[0]);
  }

  async buscarPorId(id: number): Promise<Usuario | null> {
    const res = await pool.query<LinhaUsuario>('SELECT * FROM usuarios WHERE id = $1', [id]);
    const linha = res.rows[0];
    return linha ? this.paraEntidade(linha) : null;
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const res = await pool.query<LinhaUsuario>('SELECT * FROM usuarios WHERE email = $1', [email]);
    const linha = res.rows[0];
    return linha ? this.paraEntidade(linha) : null;
  }
}
