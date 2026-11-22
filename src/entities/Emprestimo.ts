export class Emprestimo {
  constructor(
    public id: number,
    public idUsuario: number,
    public idLivro: number,
    public dataEmprestimo: Date,
    public dataDevolucao: Date | null = null
  ) {}
}
