// ==============================================================================
// CAMADA: Negocio / Services (src/services)
// RESPONSABILIDADE: Aplicar regras de validacao e unicidade de e-mail ao cadastrar usuarios
// QUEM CHAMA ESTE ARQUIVO (de onde vem): UsuarioController (Presentation) e routes.ts (instancia na composicao raiz)
// O QUE ESTE ARQUIVO CHAMA (para onde vai): Contrato IUsuarioRepository (DIP), entidade Usuario e RegraDeNegocioError
// BIBLIOTECAS: Nenhuma (nao conhece Express nem PostgreSQL/pg)
// ==============================================================================

// Importa apenas a INTERFACE IUsuarioRepository (DIP: desacopla a regra de negocio do Postgres)
import { IUsuarioRepository } from '../interfaces/IUsuarioRepository';
// Importa a entidade Usuario da camada de Dominio para tipar entrada e saida
import { Usuario } from '../entities/Usuario';
// Importa o erro de dominio para rejeitar dados invalidos ou e-mail duplicado
import { RegraDeNegocioError } from './errors/RegraDeNegocioError';

// Expressao regular simples para validar formato basico de e-mail (texto@dominio.extensao)
const PADRAO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Servico responsavel pelas regras de negocio de usuarios da biblioteca. */
export class UsuarioService {
  // Injecao de dependencia via construtor recebendo apenas o contrato IUsuarioRepository
  constructor(private usuarioRepository: IUsuarioRepository) {}

  /** Valida nome, formato do e-mail e duplicidade antes de persistir um novo usuario. */
  async cadastrarUsuario(dados: Partial<Omit<Usuario, 'id'>>): Promise<Usuario> {
    // Higieniza o nome removendo espacos extras se for string; caso contrario assume string vazia
    const nome = typeof dados.nome === 'string' ? dados.nome.trim() : '';
    // Higieniza e normaliza o e-mail para minusculas (evita duplicidade por diferenca de caixa)
    const email = typeof dados.email === 'string' ? dados.email.trim().toLowerCase() : '';

    // Regra de negocio 1: nome e e-mail sao campos obrigatorios
    if (!nome || !email) {
      // Lanca erro de negocio (sera traduzido para HTTP 400 pela camada de apresentacao)
      throw new RegraDeNegocioError('Nome e e-mail são obrigatórios.');
    // Encerra validacao de obrigatoriedade
    }

    // Regra de negocio 2: o e-mail informado precisa seguir um formato valido
    if (!PADRAO_EMAIL.test(email)) {
      // Lanca erro de negocio informando formato incorreto
      throw new RegraDeNegocioError('E-mail inválido.');
    // Encerra validacao de formato de e-mail
    }

    // Regra de negocio 3: consulta o repositorio pela interface para impedir e-mail ja cadastrado
    const usuarioExistente = await this.usuarioRepository.buscarPorEmail(email);
    // Se algum usuario ja possuir esse e-mail normalizado, interrompe o cadastro
    if (usuarioExistente) {
      // Lanca erro de negocio explicito antes mesmo de tentar gravar no banco
      throw new RegraDeNegocioError('E-mail já cadastrado.');
    // Encerra validacao de unicidade
    }

    // Delega a gravacao para o repositorio abstraido pela interface
    return await this.usuarioRepository.salvar({
      // Envia o nome ja tratado com trim
      nome,
      // Envia o e-mail normalizado em minusculas
      email,
    // Encerra o objeto passado ao metodo salvar
    });
  // Encerra o metodo cadastrarUsuario
  }
// Encerra a classe UsuarioService
}
