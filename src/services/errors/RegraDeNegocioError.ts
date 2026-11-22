export class RegraDeNegocioError extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = 'RegraDeNegocioError';
  }
}
