// ==============================================================================
// CAMADA: Negocio / Services (src/services)
// RESPONSABILIDADE: Aplicar as regras de negocio de cadastro e listagem de livros
// QUEM CHAMA ESTE ARQUIVO (de onde vem): LivroController (Presentation) e routes.ts (instancia na composicao raiz)
// O QUE ESTE ARQUIVO CHAMA (para onde vai): Contrato ILivroRepository (DIP), entidade Livro e RegraDeNegocioError
// BIBLIOTECAS: Nenhuma (nao conhece Express nem PostgreSQL/pg)
// ==============================================================================

// Importa apenas a INTERFACE do repositorio (DIP: Service nao conhece Postgres nem LivroRepository)
import { ILivroRepository } from '../interfaces/ILivroRepository';
// Importa a entidade Livro da camada de Dominio para tipagem dos dados manipulados
import { Livro } from '../entities/Livro';
// Importa o erro tipado da camada de Negocio para sinalizar dados obrigatorios ausentes
import { RegraDeNegocioError } from './errors/RegraDeNegocioError';

/** Servico responsavel pelas regras de negocio relacionadas a livros. */
export class LivroService {
  // Injecao de dependencia via construtor: recebe a abstracao ILivroRepository e nao a implementacao concreta
  constructor(private livroRepository: ILivroRepository) {}

  /** Valida os campos obrigatorios e cadastra um novo livro com disponibilidade padrao true. */
  async cadastrarLivro(dados: Partial<Omit<Livro, 'id'>>): Promise<Livro> {
    // Extrai e remove espacos do titulo apenas se for string; caso contrario assume string vazia
    const titulo = typeof dados.titulo === 'string' ? dados.titulo.trim() : '';
    // Extrai e remove espacos do autor apenas se for string; caso contrario assume string vazia
    const autor = typeof dados.autor === 'string' ? dados.autor.trim() : '';

    // Regra de negocio: titulo e autor nao podem ser vazios ou ausentes
    if (!titulo || !autor) {
      // Lanca erro de dominio tipado (Controller traduzira para HTTP 400 sem o Service saber de HTTP)
      throw new RegraDeNegocioError('Título e autor são obrigatórios.');
    // Encerra a verificacao dos campos obrigatorios
    }

    // Define explicitamente boolean porque undefined enviado ao driver pg vira NULL e ignora o DEFAULT do SQL
    const disponivel = dados.disponivel ?? true;

    // Delega a persistencia para a interface injetada sem saber qual banco esta por tras
    return await this.livroRepository.salvar({
      // Envia o titulo ja higienizado (sem espacos extras nas pontas)
      titulo,
      // Envia o autor ja higienizado
      autor,
      // Envia a flag booleana garantida (true por padrao)
      disponivel,
    // Encerra o objeto de dados enviado ao metodo salvar do repositorio
    });
  // Encerra o metodo cadastrarLivro
  }

  /** Retorna a lista de todos os livros cadastrados no acervo. */
  async listarLivros(): Promise<Livro[]> {
    // Delega a consulta diretamente para a interface do repositorio (camadas fechadas)
    return await this.livroRepository.buscarTodos();
  // Encerra o metodo listarLivros
  }
// Encerra a classe LivroService
}
