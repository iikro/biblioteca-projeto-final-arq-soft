// ==============================================================================
// CAMADA: Negocio / Erros de Dominio (src/services/errors)
// RESPONSABILIDADE: Representar erro de recurso nao encontrado no dominio sem conhecer HTTP 404
// QUEM CHAMA ESTE ARQUIVO (de onde vem): EmprestimoService (lanca) e tratarErro (mapeia para 404)
// O QUE ESTE ARQUIVO CHAMA (para onde vai): Estende RegraDeNegocioError dentro da propria camada de servicos
// BIBLIOTECAS: Nenhuma (TypeScript puro, sem dependencia de Express)
// ==============================================================================

// Importa RegraDeNegocioError da propria camada de erros de negocio para manter hierarquia de dominio
import { RegraDeNegocioError } from './RegraDeNegocioError';

/** Erro lancado quando uma entidade obrigatoria (usuario ou livro) nao e localizada (mapeado para HTTP 404). */
export class NaoEncontradoError extends RegraDeNegocioError {
  // Construtor recebe a mensagem indicando qual entidade nao foi localizada
  constructor(mensagem: string) {
    // Repassa a mensagem para a superclasse RegraDeNegocioError
    super(mensagem);
    // Define o nome especifico deste erro para diferenciar de validacoes comuns (400 vs 404)
    this.name = 'NaoEncontradoError';
  // Encerra o construtor da classe NaoEncontradoError
  }
// Encerra a definicao da classe NaoEncontradoError
}
