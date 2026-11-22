import { Router } from 'express';
import { LivroRepository } from './repositories/LivroRepository';
import { UsuarioRepository } from './repositories/UsuarioRepository';
import { EmprestimoRepository } from './repositories/EmprestimoRepository';
import { LivroService } from './services/LivroService';
import { UsuarioService } from './services/UsuarioService';
import { EmprestimoService } from './services/EmprestimoService';
import { LivroController } from './controllers/LivroController';
import { UsuarioController } from './controllers/UsuarioController';
import { EmprestimoController } from './controllers/EmprestimoController';

const router = Router();

const livroRepo = new LivroRepository();
const usuarioRepo = new UsuarioRepository();
const emprestimoRepo = new EmprestimoRepository();

const livroService = new LivroService(livroRepo);
const usuarioService = new UsuarioService(usuarioRepo);
const emprestimoService = new EmprestimoService(emprestimoRepo, livroRepo, usuarioRepo);

const livroController = new LivroController(livroService);
const usuarioController = new UsuarioController(usuarioService);
const emprestimoController = new EmprestimoController(emprestimoService);

router.post('/usuarios', (req, res) => usuarioController.criar(req, res));
router.post('/livros', (req, res) => livroController.criar(req, res));
router.get('/livros', (req, res) => livroController.listar(req, res));
router.post('/emprestimos', (req, res) => emprestimoController.criar(req, res));
router.get('/emprestimos', (req, res) => emprestimoController.listar(req, res));

export { router };
