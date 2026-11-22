import { RegraDeNegocioError } from './RegraDeNegocioError';

export class NaoEncontradoError extends RegraDeNegocioError {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = 'NaoEncontradoError';
  }
}
