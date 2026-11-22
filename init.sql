CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE livros (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    disponivel BOOLEAN DEFAULT TRUE
);

CREATE TABLE emprestimos (
    id SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL REFERENCES usuarios(id),
    id_livro INT NOT NULL REFERENCES livros(id),
    data_emprestimo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_devolucao TIMESTAMP
);
