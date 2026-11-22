// ==============================================================================
// CAMADA: Persistencia (src/repositories)
// RESPONSABILIDADE: Implementar IUsuarioRepository executando SQL no PostgreSQL e traduzindo linhas para Usuario
// QUEM CHAMA ESTE ARQUIVO (de onde vem): src/routes.ts (instancia na composicao raiz) e Services via IUsuarioRepository
// O QUE ESTE ARQUIVO CHAMA (para onde vai): pool (PostgresDb.ts) para executar SQL e entidade Usuario
// BIBLIOTECAS: 'pg' indiretamente via PostgresDb.ts
// ==============================================================================

// Importa o contrato IUsuarioRepository da camada de Contratos para cumprir o DIP
import { IUsuarioRepository } from '../interfaces/IUsuarioRepository';
// Importa a entidade Usuario da camada de Dominio para retorno tipado aos servicos
import { Usuario } from '../entities/Usuario';
// Importa o pool de conexoes PostgreSQL da propria camada de Persistencia
import { pool } from './PostgresDb';

/** Formato bruto da linha retornada pelo PostgreSQL na tabela 'usuarios'. */
interface LinhaUsuario {
  // Coluna id (SERIAL) retornada como numero
  id: number;
  // Coluna nome (VARCHAR) retornada como string
  nome: string;
  // Coluna email (VARCHAR UNIQUE) retornada como string
  email: string;
// Encerra a definicao da interface local LinhaUsuario
}

/** Implementacao concreta de IUsuarioRepository utilizando PostgreSQL. */
export class UsuarioRepository implements IUsuarioRepository {
  /** Traduz uma linha SQL da tabela usuarios para uma instancia da entidade Usuario. */
  private paraEntidade(linha: LinhaUsuario): Usuario {
    // Cria e devolve a entidade de dominio Usuario a partir dos campos da tabela
    return new Usuario(linha.id, linha.nome, linha.email);
  // Encerra o metodo auxiliar de mapeamento
  }

  /** Insere um novo usuario no PostgreSQL e devolve a entidade criada com seu id. */
  async salvar(usuario: Omit<Usuario, 'id'>): Promise<Usuario> {
    // Query SQL parametrizada ($1, $2 previnem SQL injection) retornando o registro criado via RETURNING *
    const query = 'INSERT INTO usuarios (nome, email) VALUES ($1, $2) RETURNING *';
    // Array posicional com nome e email para substituir $1 e $2 com seguranca
    const values = [usuario.nome, usuario.email];
    // Executa a insercao no pool de conexoes PostgreSQL
    const res = await pool.query<LinhaUsuario>(query, values);
    // Converte a linha retornada para a entidade Usuario
    return this.paraEntidade(res.rows[0]);
  // Encerra o metodo salvar
  }

  /** Busca um usuario pelo seu identificador numerico; retorna null se nao existir. */
  async buscarPorId(id: number): Promise<Usuario | null> {
    // Query parametrizada ($1 previne SQL injection) filtrando pela chave primaria id
    const res = await pool.query<LinhaUsuario>('SELECT * FROM usuarios WHERE id = $1', [id]);
    // Obtem a primeira linha do resultado, se houver
    const linha = res.rows[0];
    // Devolve a entidade Usuario encontrada ou null quando nao localizada
    return linha ? this.paraEntidade(linha) : null;
  // Encerra o metodo buscarPorId
  }

  /** Busca um usuario pelo e-mail; usado para impedir cadastros duplicados. */
  async buscarPorEmail(email: string): Promise<Usuario | null> {
    // Query parametrizada ($1 previne SQL injection) filtrando pela coluna unica email
    const res = await pool.query<LinhaUsuario>('SELECT * FROM usuarios WHERE email = $1', [email]);
    // Obtem a primeira linha encontrada, caso o e-mail ja exista no banco
    const linha = res.rows[0];
    // Traduz para Usuario se encontrado ou retorna null se o e-mail estiver livre
    return linha ? this.paraEntidade(linha) : null;
  // Encerra o metodo buscarPorEmail
  }
// Encerra a classe UsuarioRepository
}
