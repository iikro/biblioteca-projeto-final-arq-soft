import { Request, Response } from 'express';
import { UsuarioService } from '../services/UsuarioService';
import { tratarErro } from './tratarErro';

export class UsuarioController {
  constructor(private usuarioService: UsuarioService) {}

  async criar(req: Request, res: Response): Promise<void> {
    try {
      const usuario = await this.usuarioService.cadastrarUsuario(req.body ?? {});
      res.status(201).json(usuario);
    } catch (erro: unknown) {
      tratarErro(erro, res);
    }
  }
}
