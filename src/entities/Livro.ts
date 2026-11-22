// ==============================================================================
// CAMADA: Dominio / Entidades (src/entities)
// RESPONSABILIDADE: Representar a estrutura e os dados centrais de um Livro no sistema
// QUEM CHAMA ESTE ARQUIVO (de onde vem): Interfaces, Repositories, Services e testes
// O QUE ESTE ARQUIVO CHAMA (para onde vai): Nenhuma dependencia externa (nucleo puro do dominio)
// BIBLIOTECAS: Nenhuma (TypeScript puro)
// ==============================================================================

/** Representa um exemplar de livro cadastrado no acervo da biblioteca. */
export class Livro {
  // Construtor com parameter properties do TypeScript que declaram e atribuem os atributos automaticamente
  constructor(
    // Identificador unico do livro gerado pelo banco de dados (SERIAL PRIMARY KEY)
    public id: number,
    // Titulo completo da obra literaria (ex.: "Clean Architecture")
    public titulo: string,
    // Nome do autor ou autora da obra (ex.: "Robert C. Martin")
    public autor: string,
    // Indica se o livro esta livre para ser emprestado; inicia como true por padrao
    public disponivel: boolean = true
  // Corpo vazio pois os modificadores 'public' no construtor ja criam e preenchem os campos na instancia
  ) {}
// Encerra a definicao da classe Livro
}
