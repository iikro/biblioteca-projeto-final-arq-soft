import { Request, Response } from 'express';
import { EmprestimoService } from '../services/EmprestimoService';
import { tratarErro } from './tratarErro';

export class EmprestimoController {
  constructor(private emprestimoService: EmprestimoService) {}

  async criar(req: Request, res: Response): Promise<void> {
    try {
      const emprestimo = await this.emprestimoService.realizarEmprestimo(req.body ?? {});
      res.status(201).json(emprestimo);
    } catch (erro: unknown) {
      tratarErro(erro, res);
    }
  }

  async listar(_req: Request, res: Response): Promise<void> {
    try {
      const emprestimos = await this.emprestimoService.listarEmprestimos();
      res.json(emprestimos);
    } catch (erro: unknown) {
      tratarErro(erro, res);
    }
  }
}
