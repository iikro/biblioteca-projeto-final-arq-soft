// ==============================================================================
// CAMADA: Testes / Dubles em Memoria (tests/fakes)
// RESPONSABILIDADE: Implementar IUsuarioRepository em memoria para testar UsuarioService e EmprestimoService sem Postgres
// QUEM CHAMA ESTE ARQUIVO (de onde vem): Suites de teste em tests/services/UsuarioService.test.ts e EmprestimoService.test.ts
// O QUE ESTE ARQUIVO CHAMA (para onde vai): Implementa o contrato IUsuarioRepository e instancia a entidade Usuario
// BIBLIOTECAS: Nenhuma (TypeScript puro; prova pratica do DIP sem banco real)
// ==============================================================================

// Importa a interface IUsuarioRepository para assegurar fidelidade total ao contrato de producao
import { IUsuarioRepository } from '../../src/interfaces/IUsuarioRepository';
// Importa a entidade Usuario da camada de dominio
import { Usuario } from '../../src/entities/Usuario';

/** Implementacao em memoria (Fake) de IUsuarioRepository usada nos testes unitarios. */
export class UsuarioRepositoryEmMemoria implements IUsuarioRepository {
  // Lista interna simulando a tabela 'usuarios' do PostgreSQL na memoria RAM
  private usuarios: Usuario[] = [];
  // Contador sequencial simulando a coluna SERIAL PRIMARY KEY
  private proximoId = 1;

  /** Armazena um novo usuario em memoria e devolve a entidade Usuario com id preenchido. */
  async salvar(usuario: Omit<Usuario, 'id'>): Promise<Usuario> {
    // Instancia a entidade Usuario com id gerado e os campos validados pelo Service
    const novoUsuario = new Usuario(this.proximoId++, usuario.nome, usuario.email);
    // Insere o usuario na lista em memoria
    this.usuarios.push(novoUsuario);
    // Retorna copia do usuario salvo
    return new Usuario(novoUsuario.id, novoUsuario.nome, novoUsuario.email);
  // Encerra o metodo salvar
  }

  /** Busca um usuario pelo id em memoria; devolve null se nao existir. */
  async buscarPorId(id: number): Promise<Usuario | null> {
    // Procura o usuario com o identificador correspondente na lista
    const encontrado = this.usuarios.find((u) => u.id === id);
    // Retorna copia do Usuario encontrado ou null
    return encontrado ? new Usuario(encontrado.id, encontrado.nome, encontrado.email) : null;
  // Encerra o metodo buscarPorId
  }

  /** Busca um usuario em memoria pelo endereco de e-mail exato. */
  async buscarPorEmail(email: string): Promise<Usuario | null> {
    // Procura na lista algum usuario cujo e-mail coincida com o e-mail pesquisado
    const encontrado = this.usuarios.find((u) => u.email === email);
    // Retorna copia do Usuario encontrado ou null quando o e-mail estiver disponivel
    return encontrado ? new Usuario(encontrado.id, encontrado.nome, encontrado.email) : null;
  // Encerra o metodo buscarPorEmail
  }
// Encerra a classe UsuarioRepositoryEmMemoria
}
