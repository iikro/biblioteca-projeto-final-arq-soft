import { Usuario } from '../entities/Usuario';

export interface IUsuarioRepository {
  salvar(usuario: Omit<Usuario, 'id'>): Promise<Usuario>;
  buscarPorId(id: number): Promise<Usuario | null>;
  buscarPorEmail(email: string): Promise<Usuario | null>;
}
