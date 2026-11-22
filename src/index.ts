import express from 'express';
import { router } from './routes';

const app = express();

app.use(express.json());
app.use(router);

const PORTA = Number(process.env.PORT) || 3000;

app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});
