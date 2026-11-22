// ==============================================================================
// CAMADA: Inicializacao do Servidor HTTP (src/index.ts)
// RESPONSABILIDADE: Configurar o aplicativo Express, registrar middlewares/rotas e iniciar a escuta na porta HTTP
// QUEM CHAMA ESTE ARQUIVO (de onde vem): Script 'npm run dev' (tsx watch src/index.ts) local ou dentro do Docker
// O QUE ESTE ARQUIVO CHAMA (para onde vai): Express e router exportado por src/routes.ts
// BIBLIOTECAS: 'express' (servidor web Node.js)
// ==============================================================================

// Importa a funcao principal do framework 'express' para criar o servidor HTTP
import express from 'express';
// Importa o roteador configurado com todas as camadas ja montadas e injetadas manualmente
import { router } from './routes';

// Instancia a aplicacao Express que processara todas as requisicoes HTTP recebidas
const app = express();

// Registra o middleware nativo do Express para interpretar corpos JSON (preenchendo req.body nos POSTs)
app.use(express.json());
// Conecta as 5 rotas definidas em src/routes.ts na raiz '/' da aplicacao Express
app.use(router);

// Define a porta HTTP lendo da variavel de ambiente PORT (se existir) ou utilizando 3000 por padrao
const PORTA = Number(process.env.PORT) || 3000;

// Inicia o servidor HTTP escutando na porta configurada e exibe log de confirmacao no console
app.listen(PORTA, () => {
  // Log exibido tanto localmente quanto em 'docker compose logs api' confirmando que a API subiu
  console.log(`Servidor rodando na porta ${PORTA}`);
// Encerra a funcao callback executada apos o bind da porta
});
