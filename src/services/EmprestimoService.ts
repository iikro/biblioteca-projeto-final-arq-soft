import { IEmprestimoRepository } from '../interfaces/IEmprestimoRepository';
import { ILivroRepository } from '../interfaces/ILivroRepository';
import { IUsuarioRepository } from '../interfaces/IUsuarioRepository';
import { Emprestimo } from '../entities/Emprestimo';
import { RegraDeNegocioError } from './errors/RegraDeNegocioError';
import { NaoEncontradoError } from './errors/NaoEncontradoError';

export interface DadosRealizarEmprestimo {
  idUsuario?: unknown;
  idLivro?: unknown;
}

export class EmprestimoService {
  constructor(
    private emprestimoRepository: IEmprestimoRepository,
    private livroRepository: ILivroRepository,
    private usuarioRepository: IUsuarioRepository
  ) {}

  async realizarEmprestimo(dados: DadosRealizarEmprestimo): Promise<Emprestimo> {
    const idUsuario = typeof dados.idUsuario === 'boolean' ? NaN : Number(dados.idUsuario);
    const idLivro = typeof dados.idLivro === 'boolean' ? NaN : Number(dados.idLivro);

    if (!Number.isInteger(idUsuario) || idUsuario <= 0 || !Number.isInteger(idLivro) || idLivro <= 0) {
      throw new RegraDeNegocioError('idUsuario e idLivro devem ser números inteiros positivos.');
    }

    const usuario = await this.usuarioRepository.buscarPorId(idUsuario);
    if (!usuario) {
      throw new NaoEncontradoError('Usuário não encontrado.');
    }

    const livro = await this.livroRepository.buscarPorId(idLivro);
    if (!livro) {
      throw new NaoEncontradoError('Livro não encontrado.');
    }

    if (!livro.disponivel) {
      throw new RegraDeNegocioError('Livro já está emprestado.');
    }

    const emprestimo = await this.emprestimoRepository.salvar({
      idUsuario,
      idLivro,
    });

    await this.livroRepository.atualizarDisponibilidade(idLivro, false);

    return emprestimo;
  }

  async listarEmprestimos(): Promise<Emprestimo[]> {
    return await this.emprestimoRepository.buscarTodos();
  }
}
