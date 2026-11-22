// ==============================================================================
// CAMADA: Contratos / Interfaces DIP (src/interfaces)
// RESPONSABILIDADE: Definir o contrato abstrato de persistencia de usuarios (DIP e ISP)
// QUEM CHAMA ESTE ARQUIVO (de onde vem): UsuarioService, EmprestimoService (dependem desta abstracao) e UsuarioRepository (implementa)
// O QUE ESTE ARQUIVO CHAMA (para onde vai): Importa apenas a entidade Usuario (camada de dominio)
// BIBLIOTECAS: Nenhuma (TypeScript puro)
// ==============================================================================

// Importa a entidade Usuario da camada de Dominio (src/entities) para tipar dados e retornos do contrato
import { Usuario } from '../entities/Usuario';

/**
 * Contrato DIP (Dependency Inversion Principle) para persistencia de usuarios.
 * Segue o ISP (Interface Segregation Principle) expondo somente operacoes necessarias aos servicos.
 */
export interface IUsuarioRepository {
  // Persiste um novo usuario sem 'id' (gerado pelo banco) e devolve o Usuario completo criado
  salvar(usuario: Omit<Usuario, 'id'>): Promise<Usuario>;
  // Busca um usuario pelo id numerico; devolve Usuario ou null se nao existir
  buscarPorId(id: number): Promise<Usuario | null>;
  // Busca um usuario pelo e-mail (em minusculas) para validar unicidade antes de cadastrar
  buscarPorEmail(email: string): Promise<Usuario | null>;
// Encerra a definicao da interface IUsuarioRepository
}
