// ==============================================================================
// CAMADA: Composicao Raiz e Roteamento HTTP (src/routes.ts)
// RESPONSABILIDADE: Instanciar dependencias, realizar injecao manual (DI/DIP) e registrar as 5 rotas da API
// QUEM CHAMA ESTE ARQUIVO (de onde vem): src/index.ts registra este Router no aplicativo Express
// O QUE ESTE ARQUIVO CHAMA (para onde vai): Repositories (Persistencia), Services (Negocio) e Controllers (Apresentacao)
// BIBLIOTECAS: 'express' (Router)
// ==============================================================================

// Importa o construtor Router da biblioteca 'express' para agrupar os endpoints HTTP da biblioteca
import { Router } from 'express';
// Importa a implementacao concreta de livros no Postgres (UNICO lugar que conhece classes concretas de banco)
import { LivroRepository } from './repositories/LivroRepository';
// Importa a implementacao concreta de usuarios no Postgres (para trocar por MongoDB, bastaria mudar aqui)
import { UsuarioRepository } from './repositories/UsuarioRepository';
// Importa a implementacao concreta de emprestimos no Postgres
import { EmprestimoRepository } from './repositories/EmprestimoRepository';
// Importa a camada de negocio de livros que recebe ILivroRepository via construtor
import { LivroService } from './services/LivroService';
// Importa a camada de negocio de usuarios que recebe IUsuarioRepository via construtor
import { UsuarioService } from './services/UsuarioService';
// Importa a camada de negocio de emprestimos que coordena as tres interfaces de repositorio
import { EmprestimoService } from './services/EmprestimoService';
// Importa o controller HTTP responsavel por traduzir requisicoes/respostas de livros
import { LivroController } from './controllers/LivroController';
// Importa o controller HTTP responsavel por traduzir requisicoes/respostas de usuarios
import { UsuarioController } from './controllers/UsuarioController';
// Importa o controller HTTP responsavel por traduzir requisicoes/respostas de emprestimos
import { EmprestimoController } from './controllers/EmprestimoController';

// Cria a instancia do roteador Express que armazenara exatamente as 5 rotas especificadas
const router = Router();

// --- COMPOSICAO RAIZ E INJECAO MANUAL DE DEPENDENCIAS (DI + DIP) ---
// Este arquivo e o unico ponto da aplicacao que conhece as classes concretas do PostgreSQL.
// Se fosse necessario trocar PostgreSQL por MongoDB, bastaria instanciar LivroRepositoryMongo aqui sem tocar Services nem Controllers.

// Instancia os repositorios concretos da camada de persistencia (conectados ao PostgreSQL via Pool)
const livroRepo = new LivroRepository();
// Instancia o repositorio concreto de usuarios
const usuarioRepo = new UsuarioRepository();
// Instancia o repositorio concreto de emprestimos
const emprestimoRepo = new EmprestimoRepository();

// Injeta os repositorios concretos nos Services (que enxergam apenas as interfaces DIP)
const livroService = new LivroService(livroRepo);
// Injeta o repositorio de usuarios no UsuarioService atraves da interface IUsuarioRepository
const usuarioService = new UsuarioService(usuarioRepo);
// Injeta as tres dependencias abstratas necessarias para validar e registrar emprestimos
const emprestimoService = new EmprestimoService(emprestimoRepo, livroRepo, usuarioRepo);

// Injeta cada Service em seu respectivo Controller da camada de apresentacao
const livroController = new LivroController(livroService);
// Injeta UsuarioService em UsuarioController
const usuarioController = new UsuarioController(usuarioService);
// Injeta EmprestimoService em EmprestimoController
const emprestimoController = new EmprestimoController(emprestimoService);

// --- DEFINICAO DAS 5 ROTAS EXIGIDAS DA API ---
// Rota 1: cadastra um novo usuario leitor (Presentation -> UsuarioController.criar -> UsuarioService -> IUsuarioRepository)
router.post('/usuarios', (req, res) => usuarioController.criar(req, res));
// Rota 2: cadastra um novo livro no acervo (Presentation -> LivroController.criar -> LivroService -> ILivroRepository)
router.post('/livros', (req, res) => livroController.criar(req, res));
// Rota 3: lista todos os livros cadastrados e suas disponibilidades (Presentation -> LivroController.listar)
router.get('/livros', (req, res) => livroController.listar(req, res));
// Rota 4: registra o emprestimo de um livro disponivel para um usuario (Presentation -> EmprestimoController.criar)
router.post('/emprestimos', (req, res) => emprestimoController.criar(req, res));
// Rota 5: lista todos os emprestimos registrados no sistema (Presentation -> EmprestimoController.listar)
router.get('/emprestimos', (req, res) => emprestimoController.listar(req, res));

// Exporta o router configurado com todas as rotas e dependencias montadas para ser usado em src/index.ts
export { router };
