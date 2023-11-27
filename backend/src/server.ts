import { Server } from 'http';
import app from './app';
import config from './config';
import mongoose from 'mongoose';

let server: Server;
async function bootstrap() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log('Database is connected successfully');

    server = app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (err) {
    console.log(`Failed to connect database`, err);
  }

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        console.log('Server closed');
      });
    }
    process.exit(1);
  };

  const unexpectedErrorHandler = (error: unknown) => {
    console.log(error);
    exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', unexpectedErrorHandler);

  process.on('SIGTERM', () => {
    console.log('SIGTERM received');
    if (server) {
      server.close();
    }
  });
}

bootstrap();
