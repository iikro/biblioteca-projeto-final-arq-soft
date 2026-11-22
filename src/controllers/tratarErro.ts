// ==============================================================================
// CAMADA: Apresentacao / Utilitario de Controllers (src/controllers)
// RESPONSABILIDADE: Traduzir erros da camada de negocio para status codes HTTP sem vazar detalhes internos
// QUEM CHAMA ESTE ARQUIVO (de onde vem): LivroController, UsuarioController e EmprestimoController nos blocos catch
// O QUE ESTE ARQUIVO CHAMA (para onde vai): Inspeciona NaoEncontradoError, RegraDeNegocioError e responde via Express Response
// BIBLIOTECAS: 'express' (apenas tipo Response)
// ==============================================================================

// Importa o tipo Response do framework 'express' (Camada de Apresentacao) para enviar respostas HTTP JSON
import { Response } from 'express';
// Importa o erro de recurso nao encontrado (Camada de Negocio) para mapear para HTTP 404
import { NaoEncontradoError } from '../services/errors/NaoEncontradoError';
// Importa o erro de regra de negocio (Camada de Negocio) para mapear para HTTP 400
import { RegraDeNegocioError } from '../services/errors/RegraDeNegocioError';

/** Converte qualquer erro capturado pelos controllers em uma resposta HTTP JSON padronizada. */
export function tratarErro(erro: unknown, res: Response): void {
  // Verifica NaoEncontradoError PRIMEIRO porque ele estende RegraDeNegocioError (ordem do mais especifico para o generico)
  if (erro instanceof NaoEncontradoError) {
    // Responde status 404 Not Found com a mensagem de dominio amigavel no formato { erro }
    res.status(404).json({ erro: erro.message });
    // Encerra a execucao da funcao para nao enviar outra resposta HTTP
    return;
  // Encerra o tratamento de NaoEncontradoError
  }

  // Verifica se o erro e uma violacao generica de regra de negocio (validacao, duplicidade, indisponibilidade)
  if (erro instanceof RegraDeNegocioError) {
    // Responde status 400 Bad Request com a mensagem explicativa da regra violada
    res.status(400).json({ erro: erro.message });
    // Encerra a funcao apos responder ao cliente
    return;
  // Encerra o tratamento de RegraDeNegocioError
  }

  // Registra no terminal/container apenas erros inesperados (ex.: queda do Postgres ou bug) para diagnostico
  console.error('Erro inesperado na API:', erro);
  // Responde status 500 Internal Server Error sem expor stack trace ou detalhes do banco ao cliente
  res.status(500).json({ erro: 'Erro interno do servidor.' });
// Encerra a funcao tratarErro
}
