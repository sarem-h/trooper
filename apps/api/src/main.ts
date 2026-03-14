import { validateEnvironment } from './env';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function resolveCorsOrigins() {
  return (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

async function bootstrap() {
  validateEnvironment();

  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks();
  
  // Enable CORS for the frontend
  app.enableCors({
    origin: resolveCorsOrigins(),
    credentials: true,
  });

  // Set global prefix for all routes
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
