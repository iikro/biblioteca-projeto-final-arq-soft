import { Response } from 'express';
import { NaoEncontradoError } from '../services/errors/NaoEncontradoError';
import { RegraDeNegocioError } from '../services/errors/RegraDeNegocioError';

export function tratarErro(erro: unknown, res: Response): void {
  if (erro instanceof NaoEncontradoError) {
    res.status(404).json({ erro: erro.message });
    return;
  }

  if (erro instanceof RegraDeNegocioError) {
    res.status(400).json({ erro: erro.message });
    return;
  }

  console.error('Erro inesperado na API:', erro);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
}
