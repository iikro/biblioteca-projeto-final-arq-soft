// ==============================================================================
// CAMADA: Apresentacao / Controllers (src/controllers)
// RESPONSABILIDADE: Receber requisicoes HTTP de usuarios, acionar UsuarioService e devolver resposta JSON
// QUEM CHAMA ESTE ARQUIVO (de onde vem): src/routes.ts (rota POST /usuarios)
// O QUE ESTE ARQUIVO CHAMA (para onde vai): UsuarioService (Camada de Negocio) e tratarErro (nunca chama Repositories!)
// BIBLIOTECAS: 'express' (Request e Response)
// ==============================================================================

// Importa os tipos Request e Response da biblioteca 'express' (Camada de Apresentacao)
import { Request, Response } from 'express';
// Importa UsuarioService da camada de Negocio respeitando o isolamento das camadas fechadas
import { UsuarioService } from '../services/UsuarioService';
// Importa o tradutor centralizado de erros de dominio para respostas HTTP
import { tratarErro } from './tratarErro';

/** Controller HTTP responsavel pelo endpoint de cadastro de usuarios. */
export class UsuarioController {
  // Injecao do UsuarioService no Controller recebida a partir da composicao em routes.ts
  constructor(private usuarioService: UsuarioService) {}

  /** Trata POST /usuarios: repassa os dados ao UsuarioService e responde 201 Created. */
  async criar(req: Request, res: Response): Promise<void> {
    // Bloco try/catch captura erros de validacao/duplicidade (400) ou erros internos (500)
    try {
      // Passa req.body ?? {} porque no Express 5 o corpo ausente resulta em undefined
      const usuario = await this.usuarioService.cadastrarUsuario(req.body ?? {});
      // Retorna HTTP 201 (Created) com a entidade Usuario criada em JSON
      res.status(201).json(usuario);
    // Captura erros como 'unknown' para manter tipagem estrita sem usar 'any'
    } catch (erro: unknown) {
      // Converte RegraDeNegocioError em 400 e erros inesperados em 500
      tratarErro(erro, res);
    // Encerra o bloco try/catch
    }
  // Encerra o metodo criar
  }
// Encerra a classe UsuarioController
}
