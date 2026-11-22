import { Request, Response } from 'express';
import { LivroService } from '../services/LivroService';
import { tratarErro } from './tratarErro';

export class LivroController {
  constructor(private livroService: LivroService) {}

  async criar(req: Request, res: Response): Promise<void> {
    try {
      const livro = await this.livroService.cadastrarLivro(req.body ?? {});
      res.status(201).json(livro);
    } catch (erro: unknown) {
      tratarErro(erro, res);
    }
  }

  async listar(_req: Request, res: Response): Promise<void> {
    try {
      const livros = await this.livroService.listarLivros();
      res.json(livros);
    } catch (erro: unknown) {
      tratarErro(erro, res);
    }
  }
}
