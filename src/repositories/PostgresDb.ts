// ==============================================================================
// CAMADA: Persistencia / Infraestrutura de Banco (src/repositories)
// RESPONSABILIDADE: Criar e exportar o Pool de conexoes reutilizaveis com o PostgreSQL
// QUEM CHAMA ESTE ARQUIVO (de onde vem): LivroRepository, UsuarioRepository e EmprestimoRepository
// O QUE ESTE ARQUIVO CHAMA (para onde vai): Conecta-se ao servidor PostgreSQL (container 'db' ou localhost:5433)
// BIBLIOTECAS: 'pg' (node-postgres, usado EXCLUSIVAMENTE na camada de persistencia)
// ==============================================================================

// Importa a classe Pool da biblioteca externa 'pg' (driver oficial PostgreSQL para Node.js) para gerenciar conexoes SQL
import { Pool } from 'pg';

/** Pool compartilhado de conexoes com o banco PostgreSQL usado pelos repositorios concretos. */
export const pool = new Pool({
  // Endereco do banco: no Docker recebe 'db' via DB_HOST; localmente usa 'localhost'
  host: process.env.DB_HOST || 'localhost',
  // Usuario de autenticacao no PostgreSQL (padrao 'admin', alinhado ao docker-compose.yml)
  user: process.env.DB_USER || 'admin',
  // Senha do banco de dados (padrao '123', alinhado ao docker-compose.yml)
  password: process.env.DB_PASSWORD || '123',
  // Nome do banco de dados criado pelo container Postgres ('biblioteca')
  database: process.env.DB_NAME || 'biblioteca',
  // Porta TCP: no Docker DB_PORT='5432'; fora do Docker usa '5433' para evitar conflito com Postgres local na 5432
  port: parseInt(process.env.DB_PORT || '5433', 10),
// Encerra o objeto de configuracao e a instanciacao do Pool
});
