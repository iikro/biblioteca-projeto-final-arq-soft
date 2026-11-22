# ==============================================================================
# CAMADA: Infraestrutura de Containerizacao (Raiz do Projeto)
# RESPONSABILIDADE: Definir a imagem Docker que executa a API TypeScript/Express
# QUEM CHAMA ESTE ARQUIVO (de onde vem): Docker Compose (diretiva build: .) ou 'docker build'
# O QUE ESTE ARQUIVO CHAMA (para onde vai): Instala dependencias npm e executa 'npm run dev' (src/index.ts)
# BIBLIOTECAS: Imagem oficial Node.js 24 LTS baseada em Linux Alpine
# ==============================================================================

# Usa a imagem oficial leve do Node.js 24 LTS (Alpine), substituindo o Node 18 ja descontinuado (EOL)
FROM node:24-alpine

# Define o diretorio de trabalho padrao dentro do container Linux onde o codigo sera copiado e executado
WORKDIR /app

# Copia package.json e package-lock.json primeiro para aproveitar o cache de camadas do Docker no npm install
COPY package*.json ./

# Instala as dependencias dentro do container Linux (incluindo binarios nativos Linux do esbuild para o tsx)
RUN npm install

# Copia o restante do codigo-fonte (respeitando o .dockerignore para nao sobrescrever node_modules)
COPY . .

# Documenta que o container da aplicacao escuta conexoes HTTP na porta 3000 (usada pelo Express)
EXPOSE 3000

# Comando padrao ao iniciar o container: roda o script "dev" do package.json (tsx watch src/index.ts)
CMD ["npm", "run", "dev"]
