import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

async function startServer() {
  await connectDB();
  app.listen(env.PORT, () => {
    console.info(`Server listening on port ${env.PORT} in ${env.NODE_ENV} mode`);
  });
}

startServer();
