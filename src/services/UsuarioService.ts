import { IUsuarioRepository } from '../interfaces/IUsuarioRepository';
import { Usuario } from '../entities/Usuario';
import { RegraDeNegocioError } from './errors/RegraDeNegocioError';

const PADRAO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class UsuarioService {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async cadastrarUsuario(dados: Partial<Omit<Usuario, 'id'>>): Promise<Usuario> {
    const nome = typeof dados.nome === 'string' ? dados.nome.trim() : '';
    const email = typeof dados.email === 'string' ? dados.email.trim().toLowerCase() : '';

    if (!nome || !email) {
      throw new RegraDeNegocioError('Nome e e-mail são obrigatórios.');
    }

    if (!PADRAO_EMAIL.test(email)) {
      throw new RegraDeNegocioError('E-mail inválido.');
    }

    const usuarioExistente = await this.usuarioRepository.buscarPorEmail(email);
    if (usuarioExistente) {
      throw new RegraDeNegocioError('E-mail já cadastrado.');
    }

    return await this.usuarioRepository.salvar({
      nome,
      email,
    });
  }
}
