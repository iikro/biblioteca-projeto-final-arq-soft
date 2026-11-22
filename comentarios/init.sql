-- ==============================================================================
-- CAMADA: Infraestrutura de Banco de Dados (Raiz do Projeto)
-- RESPONSABILIDADE: Criar as tabelas relacionais iniciais do sistema no PostgreSQL
-- QUEM CHAMA ESTE ARQUIVO (de onde vem): Container PostgreSQL (/docker-entrypoint-initdb.d/init.sql) na 1a execucao
-- O QUE ESTE ARQUIVO CHAMA (para onde vai): Cria as tabelas 'usuarios', 'livros' e 'emprestimos' consultadas pelos Repositories
-- BIBLIOTECAS: PostgreSQL 15 SQL DDL (Data Definition Language)
-- ==============================================================================

-- Cria a tabela 'usuarios' correspondente a entidade Usuario do dominio
CREATE TABLE usuarios (
    -- Chave primaria autoincremental gerada automaticamente pelo PostgreSQL (mapeia para Usuario.id)
    id SERIAL PRIMARY KEY,
    -- Nome completo do leitor/usuario com limite de 100 caracteres, preenchimento obrigatorio (NOT NULL)
    nome VARCHAR(100) NOT NULL,
    -- Endereco de e-mail unico (UNIQUE) e obrigatorio (NOT NULL), usado para evitar cadastros duplicados
    email VARCHAR(100) UNIQUE NOT NULL
-- Encerra a definicao da tabela usuarios
);

-- Cria a tabela 'livros' correspondente a entidade Livro do dominio
CREATE TABLE livros (
    -- Chave primaria autoincremental gerada pelo PostgreSQL (mapeia para Livro.id)
    id SERIAL PRIMARY KEY,
    -- Titulo da obra com limite de 200 caracteres, campo obrigatorio (NOT NULL)
    titulo VARCHAR(200) NOT NULL,
    -- Nome do autor da obra com limite de 100 caracteres, campo obrigatorio (NOT NULL)
    autor VARCHAR(100) NOT NULL,
    -- Flag booleana de disponibilidade para emprestimo; inicia como TRUE por padrao ao cadastrar
    disponivel BOOLEAN DEFAULT TRUE
-- Encerra a definicao da tabela livros
);

-- Cria a tabela 'emprestimos' correspondente a entidade Emprestimo (relaciona usuarios e livros)
CREATE TABLE emprestimos (
    -- Chave primaria autoincremental do registro de emprestimo (mapeia para Emprestimo.id)
    id SERIAL PRIMARY KEY,
    -- Chave estrangeira obrigatoria (NOT NULL) referenciando usuarios(id); todo emprestimo pertence a um usuario
    id_usuario INT NOT NULL REFERENCES usuarios(id),
    -- Chave estrangeira obrigatoria (NOT NULL) referenciando livros(id); todo emprestimo referencia um livro
    id_livro INT NOT NULL REFERENCES livros(id),
    -- Data e hora exata da retirada, preenchida automaticamente pelo banco com o horario atual (CURRENT_TIMESTAMP)
    data_emprestimo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Data e hora da devolucao; permanece NULL enquanto o livro nao for devolvido
    data_devolucao TIMESTAMP
-- Encerra a definicao da tabela emprestimos
);
