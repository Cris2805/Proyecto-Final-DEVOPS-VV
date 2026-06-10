import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log(`TaskFlow API ejecutandose en http://localhost:${PORT}`);
});
