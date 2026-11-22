// ==============================================================================
// CAMADA: Apresentacao / Controllers (src/controllers)
// RESPONSABILIDADE: Receber requisicoes HTTP de livros, acionar LivroService e devolver JSON + status HTTP
// QUEM CHAMA ESTE ARQUIVO (de onde vem): src/routes.ts (rotas POST /livros e GET /livros)
// O QUE ESTE ARQUIVO CHAMA (para onde vai): LivroService (Camada de Negocio) e tratarErro (nunca chama Repositories!)
// BIBLIOTECAS: 'express' (Request e Response)
// ==============================================================================

// Importa Request e Response da biblioteca 'express' (exclusiva da camada de Apresentacao)
import { Request, Response } from 'express';
// Importa LivroService da camada de Negocio (regra das camadas fechadas: Controller so fala com Service)
import { LivroService } from '../services/LivroService';
// Importa o auxiliar de mapeamento de erros de dominio para codigos HTTP
import { tratarErro } from './tratarErro';

/** Controller HTTP responsavel pelos endpoints relacionados a livros. */
export class LivroController {
  // Injecao do Service no Controller via construtor (recebe a regra de negocio pronta de routes.ts)
  constructor(private livroService: LivroService) {}

  /** Trata POST /livros: envia req.body ao LivroService e responde 201 Created com o livro salvo. */
  async criar(req: Request, res: Response): Promise<void> {
    // Bloco try/catch garante que erros de validacao ou infraestrutura virem resposta HTTP tratada
    try {
      // No Express 5, req.body pode vir undefined sem corpo JSON; o fallback {} evita erro de leitura no Service
      const livro = await this.livroService.cadastrarLivro(req.body ?? {});
      // Responde com codigo HTTP 201 (Created) e o objeto Livro serializado em JSON
      res.status(201).json(livro);
    // Captura qualquer excecao tipada ou inesperada usando 'unknown' conforme tipagem estrita
    } catch (erro: unknown) {
      // Delega a traducao do erro (400 ou 500) ao auxiliar tratarErro
      tratarErro(erro, res);
    // Encerra o bloco try/catch
    }
  // Encerra o metodo criar
  }

  /** Trata GET /livros: solicita a listagem ao LivroService e responde 200 OK com o array de livros. */
  async listar(_req: Request, res: Response): Promise<void> {
    // Bloco try/catch protege a listagem contra falhas inesperadas de comunicacao com o banco
    try {
      // Busca todos os livros atraves da camada de servico (sem acessar o repositorio diretamente)
      const livros = await this.livroService.listarLivros();
      // Responde com status padrao 200 OK e a lista de livros em formato JSON
      res.json(livros);
    // Captura falhas inesperadas (como Postgres indisponivel) com tipagem segura 'unknown'
    } catch (erro: unknown) {
      // Delega o tratamento para devolver HTTP 500 padronizado
      tratarErro(erro, res);
    // Encerra o bloco try/catch
    }
  // Encerra o metodo listar
  }
// Encerra a classe LivroController
}
