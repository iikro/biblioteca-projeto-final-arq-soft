// ==============================================================================
// CAMADA: Apresentacao / Controllers (src/controllers)
// RESPONSABILIDADE: Receber requisicoes HTTP de emprestimos, acionar EmprestimoService e responder JSON
// QUEM CHAMA ESTE ARQUIVO (de onde vem): src/routes.ts (rotas POST /emprestimos e GET /emprestimos)
// O QUE ESTE ARQUIVO CHAMA (para onde vai): EmprestimoService (Camada de Negocio) e tratarErro (nunca chama Repositories!)
// BIBLIOTECAS: 'express' (Request e Response)
// ==============================================================================

// Importa Request e Response da biblioteca 'express' (Camada de Apresentacao)
import { Request, Response } from 'express';
// Importa EmprestimoService da camada de Negocio (camada fechada: Controller nunca acessa Repository)
import { EmprestimoService } from '../services/EmprestimoService';
// Importa o tratador de erros que converte NaoEncontradoError em 404 e RegraDeNegocioError em 400
import { tratarErro } from './tratarErro';

/** Controller HTTP responsavel pelos endpoints de emprestimos. */
export class EmprestimoController {
  // Injecao do EmprestimoService no Controller realizada por routes.ts
  constructor(private emprestimoService: EmprestimoService) {}

  /** Trata POST /emprestimos: cria um emprestimo via EmprestimoService e responde 201 Created. */
  async criar(req: Request, res: Response): Promise<void> {
    // Bloco try/catch garante resposta HTTP adequada para IDs invalidos (400), ausentes (404) ou livro ocupado (400)
    try {
      // Usa fallback {} caso req.body venha undefined no Express 5 quando nenhum JSON e enviado
      const emprestimo = await this.emprestimoService.realizarEmprestimo(req.body ?? {});
      // Devolve HTTP 201 (Created) com o registro completo do emprestimo criado
      res.status(201).json(emprestimo);
    // Captura qualquer excecao tipada como 'unknown'
    } catch (erro: unknown) {
      // Mapeia NaoEncontradoError -> 404, RegraDeNegocioError -> 400 e outros erros -> 500
      tratarErro(erro, res);
    // Encerra o bloco try/catch
    }
  // Encerra o metodo criar
  }

  /** Trata GET /emprestimos: consulta todos os emprestimos no EmprestimoService e responde 200 OK. */
  async listar(_req: Request, res: Response): Promise<void> {
    // Bloco try/catch protege a rota de listagem contra falhas inesperadas de banco
    try {
      // Chama o servico para recuperar os emprestimos registrados
      const emprestimos = await this.emprestimoService.listarEmprestimos();
      // Retorna HTTP 200 OK com o array de emprestimos em JSON
      res.json(emprestimos);
    // Captura eventuais falhas inesperadas com tipagem segura 'unknown'
    } catch (erro: unknown) {
      // Delega a formatacao de erro HTTP 500 para o utilitario tratarErro
      tratarErro(erro, res);
    // Encerra o bloco try/catch
    }
  // Encerra o metodo listar
  }
// Encerra a classe EmprestimoController
}
