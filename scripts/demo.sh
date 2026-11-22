#!/usr/bin/env bash
# ==============================================================================
# CAMADA: Automacao e Demonstracao (scripts/demo.sh)
# RESPONSABILIDADE: Exercitar as 5 rotas da API e validar as regras de negocio via curl
# QUEM CHAMA ESTE ARQUIVO (de onde vem): Desenvolvedor ou apresentador no terminal (./scripts/demo.sh)
# O QUE ESTE ARQUIVO CHAMA (para onde vai): API HTTP em http://localhost:3000 (que consulta Postgres na porta interna 5432 / host 5434)
# BIBLIOTECAS: bash, curl, date e sed (utilitarios padrao Unix/macOS)
# ==============================================================================

# Encerra imediatamente o script se algum comando falhar ou se alguma variavel obrigatoria falhar
set -euo pipefail

# Define a URL base onde a API Express esta escutando (container biblioteca_api na porta 3000; banco exposto no host em 5434)
BASE=http://localhost:3000

# Gera um e-mail unico usando timestamp Unix para permitir executar o script varias vezes sem erro de duplicidade
EMAIL_UNICO="aluno$(date +%s)@email.com"

# Exibe cabecalho visual para o primeiro passo da demonstracao (POST /usuarios)
echo "=== 1. Criando usuario ($EMAIL_UNICO) [esperado: HTTP 201] ==="
# Envia requisicao POST /usuarios com JSON e captura corpo + codigo HTTP na ultima linha
RESP_USUARIO=$(curl -s -w "\nHTTP %{http_code}\n" -X POST "$BASE/usuarios" -H "Content-Type: application/json" -d "{\"nome\":\"Aluno Demo\",\"email\":\"$EMAIL_UNICO\"}")
# Imprime na tela a resposta completa (JSON retornado + HTTP status)
echo "$RESP_USUARIO"
# Extrai o campo numerico "id" da primeira linha JSON usando sed para reutilizar no emprestimo
USUARIO_ID=$(echo "$RESP_USUARIO" | head -n1 | sed -E 's/.*"id":([0-9]+).*/\1/')

# Exibe cabecalho visual para o segundo passo (POST /livros)
echo "=== 2. Criando livro [esperado: HTTP 201 com disponivel=true] ==="
# Envia requisicao POST /livros cadastrando um exemplar disponivel e captura resposta + status
RESP_LIVRO=$(curl -s -w "\nHTTP %{http_code}\n" -X POST "$BASE/livros" -H "Content-Type: application/json" -d '{"titulo":"Clean Architecture","autor":"Robert C. Martin"}')
# Imprime o JSON do livro criado e o codigo HTTP
echo "$RESP_LIVRO"
# Extrai o "id" numerico do livro criado usando expressao regular no sed
LIVRO_ID=$(echo "$RESP_LIVRO" | head -n1 | sed -E 's/.*"id":([0-9]+).*/\1/')

# Exibe cabecalho visual para o terceiro passo (GET /livros)
echo "=== 3. Listando livros [esperado: HTTP 200] ==="
# Consulta todos os livros cadastrados mostrando que o livro recem-criado tem disponivel: true
curl -s -w "\nHTTP %{http_code}\n" "$BASE/livros"

# Exibe cabecalho visual para o quarto passo (POST /emprestimos valido)
echo "=== 4. Realizando emprestimo (usuario=$USUARIO_ID, livro=$LIVRO_ID) [esperado: HTTP 201] ==="
# Envia requisicao POST /emprestimos vinculando o usuario e o livro criados acima
curl -s -w "\nHTTP %{http_code}\n" -X POST "$BASE/emprestimos" -H "Content-Type: application/json" -d "{\"idUsuario\":$USUARIO_ID,\"idLivro\":$LIVRO_ID}"

# Exibe cabecalho visual para o quinto passo (tentativa de emprestimo duplicado)
echo "=== 5. Tentando emprestar o MESMO livro novamente [esperado: HTTP 400] ==="
# Tenta emprestar novamente o livro ja ocupado para demonstrar a validacao de negocio do EmprestimoService
curl -s -w "\nHTTP %{http_code}\n" -X POST "$BASE/emprestimos" -H "Content-Type: application/json" -d "{\"idUsuario\":$USUARIO_ID,\"idLivro\":$LIVRO_ID}"

# Exibe cabecalho visual para o sexto passo (GET /emprestimos)
echo "=== 6. Listando emprestimos registrados [esperado: HTTP 200] ==="
# Consulta a lista de emprestimos confirmando que apenas o primeiro emprestimo foi persistido
curl -s -w "\nHTTP %{http_code}\n" "$BASE/emprestimos"

# Exibe cabecalho visual para o setimo passo (GET /livros apos emprestimo)
echo "=== 7. Listando livros novamente [esperado: HTTP 200 com disponivel=false] ==="
# Consulta o acervo novamente mostrando que o livro emprestado agora aparece com disponivel: false
curl -s -w "\nHTTP %{http_code}\n" "$BASE/livros"
