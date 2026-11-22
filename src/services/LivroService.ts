import { ILivroRepository } from '../interfaces/ILivroRepository';
import { Livro } from '../entities/Livro';
import { RegraDeNegocioError } from './errors/RegraDeNegocioError';

export class LivroService {
  constructor(private livroRepository: ILivroRepository) {}

  async cadastrarLivro(dados: Partial<Omit<Livro, 'id'>>): Promise<Livro> {
    const titulo = typeof dados.titulo === 'string' ? dados.titulo.trim() : '';
    const autor = typeof dados.autor === 'string' ? dados.autor.trim() : '';

    if (!titulo || !autor) {
      throw new RegraDeNegocioError('Título e autor são obrigatórios.');
    }

    const disponivel = dados.disponivel ?? true;

    return await this.livroRepository.salvar({
      titulo,
      autor,
      disponivel,
    });
  }

  async listarLivros(): Promise<Livro[]> {
    return await this.livroRepository.buscarTodos();
  }
}
