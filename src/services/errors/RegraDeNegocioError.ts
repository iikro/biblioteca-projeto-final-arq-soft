// ==============================================================================
// CAMADA: Negocio / Erros de Dominio (src/services/errors)
// RESPONSABILIDADE: Representar violacoes de regras de negocio sem conhecer protocolo HTTP
// QUEM CHAMA ESTE ARQUIVO (de onde vem): Services (lancam) e Controllers/tratarErro (capturam)
// O QUE ESTE ARQUIVO CHAMA (para onde vai): Estende a classe nativa Error do JavaScript/TypeScript
// BIBLIOTECAS: Nenhuma (TypeScript puro, sem dependencia de Express)
// ==============================================================================

/** Erro lancado quando uma regra de negocio ou validacao de entrada e violada (mapeado para HTTP 400). */
export class RegraDeNegocioError extends Error {
  // Construtor recebe a mensagem descritiva do erro de negocio definida pelo Service
  constructor(mensagem: string) {
    // Repassa a mensagem para o construtor da classe base nativa Error
    super(mensagem);
    // Define o nome explicito da classe de erro para facilitar inspecao em logs e tratamento de erros
    this.name = 'RegraDeNegocioError';
  // Encerra o construtor da classe RegraDeNegocioError
  }
// Encerra a definicao da classe RegraDeNegocioError
}
