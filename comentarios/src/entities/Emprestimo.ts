// ==============================================================================
// CAMADA: Dominio / Entidades (src/entities)
// RESPONSABILIDADE: Representar o registro de um Emprestimo vinculando Usuario e Livro
// QUEM CHAMA ESTE ARQUIVO (de onde vem): Interfaces, Repositories e Services
// O QUE ESTE ARQUIVO CHAMA (para onde vai): Nenhuma dependencia externa (nucleo puro do dominio)
// BIBLIOTECAS: Nenhuma (TypeScript puro)
// ==============================================================================

/** Representa um emprestimo de um livro feito por um usuario da biblioteca. */
export class Emprestimo {
  // Construtor usando parameter properties para definir e inicializar todos os campos do emprestimo
  constructor(
    // Identificador unico do registro de emprestimo no banco de dados
    public id: number,
    // Identificador do usuario que retirou o livro (referencia Usuario.id em camelCase no dominio)
    public idUsuario: number,
    // Identificador do livro emprestado (referencia Livro.id em camelCase no dominio)
    public idLivro: number,
    // Data e hora em que o emprestimo foi efetuado (objeto Date convertido pelo driver pg)
    public dataEmprestimo: Date,
    // Data e hora da devolucao do livro; null indica que o emprestimo ainda esta em aberto
    public dataDevolucao: Date | null = null
  // Corpo vazio porque os modificadores 'public' ja executam a atribuicao automatica na instancia
  ) {}
// Encerra a definicao da classe Emprestimo
}
