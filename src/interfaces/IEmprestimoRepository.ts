import { Emprestimo } from '../entities/Emprestimo';

export interface IEmprestimoRepository {
  salvar(dados: Pick<Emprestimo, 'idUsuario' | 'idLivro'>): Promise<Emprestimo>;
  buscarTodos(): Promise<Emprestimo[]>;
}
