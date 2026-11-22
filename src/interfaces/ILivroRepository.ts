import { Livro } from '../entities/Livro';

export interface ILivroRepository {
  salvar(livro: Omit<Livro, 'id'>): Promise<Livro>;
  buscarTodos(): Promise<Livro[]>;
  buscarPorId(id: number): Promise<Livro | null>;
  atualizarDisponibilidade(id: number, disponivel: boolean): Promise<void>;
}
