import PocketBase from 'pocketbase';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

export const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;
