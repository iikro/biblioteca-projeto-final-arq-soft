// ==============================================================================
// CAMADA: Contratos / Interfaces DIP (src/interfaces)
// RESPONSABILIDADE: Definir o contrato abstrato de persistencia de livros (DIP e ISP)
// QUEM CHAMA ESTE ARQUIVO (de onde vem): LivroService, EmprestimoService (dependem desta abstracao) e LivroRepository (implementa)
// O QUE ESTE ARQUIVO CHAMA (para onde vai): Importa apenas a entidade Livro (camada de dominio)
// BIBLIOTECAS: Nenhuma (TypeScript puro)
// ==============================================================================

// Importa a entidade Livro da camada de Dominio (src/entities) para tipar entradas e retornos do contrato
import { Livro } from '../entities/Livro';

/**
 * Contrato DIP (Dependency Inversion Principle) para persistencia de livros.
 * Aplica tambem ISP (Interface Segregation Principle), expondo apenas os metodos exigidos pelas regras de negocio.
 */
export interface ILivroRepository {
  // Persiste um novo livro sem o campo 'id' (gerado pelo banco) e retorna o Livro completo salvo
  salvar(livro: Omit<Livro, 'id'>): Promise<Livro>;
  // Retorna todos os livros cadastrados no acervo
  buscarTodos(): Promise<Livro[]>;
  // Busca um livro pelo identificador; retorna o Livro encontrado ou null caso nao exista
  buscarPorId(id: number): Promise<Livro | null>;
  // Atualiza o status de disponibilidade (true = livre, false = emprestado) do livro informado
  atualizarDisponibilidade(id: number, disponivel: boolean): Promise<void>;
// Encerra a definicao da interface ILivroRepository
}
