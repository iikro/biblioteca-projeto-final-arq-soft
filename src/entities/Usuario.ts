// ==============================================================================
// CAMADA: Dominio / Entidades (src/entities)
// RESPONSABILIDADE: Representar a estrutura e os dados de um Usuario leitor da biblioteca
// QUEM CHAMA ESTE ARQUIVO (de onde vem): Interfaces, Repositories e Services
// O QUE ESTE ARQUIVO CHAMA (para onde vai): Nenhuma dependencia externa (nucleo puro do dominio)
// BIBLIOTECAS: Nenhuma (TypeScript puro)
// ==============================================================================

/** Representa um usuario habilitado a realizar emprestimos na biblioteca. */
export class Usuario {
  // Construtor usando parameter properties do TypeScript para criar e inicializar as propriedades
  constructor(
    // Identificador unico do usuario gerado automaticamente pelo banco de dados
    public id: number,
    // Nome completo do leitor cadastrado na biblioteca
    public nome: string,
    // Endereco de e-mail unico usado para identificar o usuario sem duplicidade
    public email: string
  // Corpo vazio porque os modificadores 'public' ja atribuem os valores ao 'this'
  ) {}
// Encerra a definicao da classe Usuario
}
