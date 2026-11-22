// ==============================================================================
// CAMADA: Testes Unitarios (tests/services)
// RESPONSABILIDADE: Validar regras de negocio do UsuarioService usando repositorio em memoria (sem Postgres)
// QUEM CHAMA ESTE ARQUIVO (de onde vem): Runner nativo 'npm test' (tsx --test "tests/**/*.test.ts")
// O QUE ESTE ARQUIVO CHAMA (para onde vai): UsuarioService, RegraDeNegocioError e UsuarioRepositoryEmMemoria
// BIBLIOTECAS: 'node:test' (describe, test) e 'node:assert/strict' (assercoes nativas do Node 24)
// ==============================================================================

// Importa as funcoes describe e test da biblioteca padrao 'node:test'
import { describe, test } from 'node:test';
// Importa o modulo 'node:assert/strict' para verificacoes estritas de igualdade e excecoes
import assert from 'node:assert/strict';
// Importa a classe UsuarioService da camada de negocio que sera testada
import { UsuarioService } from '../../src/services/UsuarioService';
// Importa o erro de dominio esperado em falhas de validacao ou duplicidade
import { RegraDeNegocioError } from '../../src/services/errors/RegraDeNegocioError';
// Importa o repositorio fake em memoria implementando IUsuarioRepository (DIP)
import { UsuarioRepositoryEmMemoria } from '../fakes/UsuarioRepositoryEmMemoria';

// Agrupa todos os testes unitarios de regras de negocio de UsuarioService
describe('UsuarioService', () => {
  // Caso 1: garante cadastro valido com normalizacao do e-mail (trim e minusculas)
  test('deve cadastrar um usuario valido normalizando nome e e-mail', async () => {
    // Cria o repositorio em memoria isolado para o teste
    const usuarioRepo = new UsuarioRepositoryEmMemoria();
    // Injeta o fake no UsuarioService
    const usuarioService = new UsuarioService(usuarioRepo);

    // Chama cadastrarUsuario enviando espacos extras e letras maiusculas no e-mail
    const usuario = await usuarioService.cadastrarUsuario({
      // Nome com espacos extras nas bordas
      nome: '  Maria Silva  ',
      // E-mail com letras maiusculas e espacos para testar higienizacao
      email: '  MARIA@Email.COM  ',
    // Encerra objeto de entrada
    });

    // Verifica id sequencial gerado em memoria
    assert.equal(usuario.id, 1);
    // Verifica remocao de espacos no nome
    assert.equal(usuario.nome, 'Maria Silva');
    // Verifica normalizacao do e-mail para minusculas sem espacos
    assert.equal(usuario.email, 'maria@email.com');
  // Encerra o caso de teste 1
  });

  // Caso 2: garante erro quando nome ou e-mail estiverem ausentes
  test('deve rejeitar cadastro sem nome ou sem e-mail', async () => {
    // Cria instancia isolada do repositorio em memoria
    const usuarioRepo = new UsuarioRepositoryEmMemoria();
    // Injeta no UsuarioService
    const usuarioService = new UsuarioService(usuarioRepo);

    // Valida rejeicao quando nome esta vazio
    await assert.rejects(
      // Dispara cadastro sem nome preenchido
      () => usuarioService.cadastrarUsuario({ nome: '', email: 'teste@email.com' }),
      // Confirma RegraDeNegocioError e mensagem de obrigatoriedade
      (erro: unknown) =>
        erro instanceof RegraDeNegocioError && erro.message === 'Nome e e-mail são obrigatórios.'
    // Encerra assercao para nome ausente
    );

    // Valida rejeicao quando e-mail esta ausente
    await assert.rejects(
      // Dispara cadastro apenas com nome
      () => usuarioService.cadastrarUsuario({ nome: 'Joao' }),
      // Confirma RegraDeNegocioError e mensagem de obrigatoriedade
      (erro: unknown) =>
        erro instanceof RegraDeNegocioError && erro.message === 'Nome e e-mail são obrigatórios.'
    // Encerra assercao para e-mail ausente
    );
  // Encerra o caso de teste 2
  });

  // Caso 3: garante erro quando o formato de e-mail for invalido
  test('deve rejeitar e-mail em formato invalido', async () => {
    // Cria instancia isolada do repositorio em memoria
    const usuarioRepo = new UsuarioRepositoryEmMemoria();
    // Injeta no UsuarioService
    const usuarioService = new UsuarioService(usuarioRepo);

    // Verifica que e-mail sem '@' ou sem dominio e rejeitado com RegraDeNegocioError
    await assert.rejects(
      // Envia e-mail malformado
      () => usuarioService.cadastrarUsuario({ nome: 'Carlos', email: 'email-invalido' }),
      // Confirma erro e mensagem de formato invalido
      (erro: unknown) =>
        erro instanceof RegraDeNegocioError && erro.message === 'E-mail inválido.'
    // Encerra assercao assert.rejects
    );
  // Encerra o caso de teste 3
  });

  // Caso 4: garante erro quando tentar cadastrar um e-mail ja existente (mesmo com caixa diferente)
  test('deve rejeitar cadastro com e-mail duplicado', async () => {
    // Cria instancia isolada do repositorio em memoria
    const usuarioRepo = new UsuarioRepositoryEmMemoria();
    // Injeta no UsuarioService
    const usuarioService = new UsuarioService(usuarioRepo);

    // Cadastra o primeiro usuario com sucesso
    await usuarioService.cadastrarUsuario({ nome: 'Ana', email: 'ana@biblioteca.com' });

    // Tenta cadastrar outro usuario usando o mesmo e-mail em maiusculas
    await assert.rejects(
      // Dispara segunda tentativa com e-mail duplicado
      () => usuarioService.cadastrarUsuario({ nome: 'Outra Ana', email: 'ANA@biblioteca.com' }),
      // Verifica que a regra de unicidade bloqueou com a mensagem exata
      (erro: unknown) =>
        erro instanceof RegraDeNegocioError && erro.message === 'E-mail já cadastrado.'
    // Encerra assercao assert.rejects
    );
  // Encerra o caso de teste 4
  });
// Encerra a suite describe UsuarioService
});
