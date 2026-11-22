// ==============================================================================
// CAMADA: Contratos / Interfaces DIP (src/interfaces)
// RESPONSABILIDADE: Definir o contrato abstrato de persistencia de emprestimos (DIP e ISP)
// QUEM CHAMA ESTE ARQUIVO (de onde vem): EmprestimoService (depende desta abstracao), EmprestimoRepository e fake de teste (implementam)
// O QUE ESTE ARQUIVO CHAMA (para onde vai): Importa apenas a entidade Emprestimo (camada de dominio)
// BIBLIOTECAS: Nenhuma (TypeScript puro)
// ==============================================================================

// Importa a entidade Emprestimo da camada de Dominio (src/entities) para tipar entradas e retornos do contrato
import { Emprestimo } from '../entities/Emprestimo';

/**
 * Contrato DIP (Dependency Inversion Principle) para persistencia de emprestimos.
 * Segue o ISP (Interface Segregation Principle) definindo apenas salvar e listar conforme os casos de uso.
 */
export interface IEmprestimoRepository {
  // Registra um novo emprestimo recebendo apenas idUsuario e idLivro (id e datas sao definidos pela persistencia)
  salvar(dados: Pick<Emprestimo, 'idUsuario' | 'idLivro'>): Promise<Emprestimo>;
  // Lista todos os emprestimos registrados ordenados por identificador
  buscarTodos(): Promise<Emprestimo[]>;
// Encerra a definicao da interface IEmprestimoRepository
}
