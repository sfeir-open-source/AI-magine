import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

config({
  override: true,
});

if (!process.env.EMAIL_ENCRYPTION_KEY)
  throw new Error('Missing EMAIL_ENCRYPTION_KEY env var');
if (!process.env.EMAIL_ENCRYPTION_IV)
  throw new Error('Missing EMAIL_ENCRYPTION_IV env var');
if (process.env.IMAGEN_ENABLED && !process.env.IMAGEN_GCP_PROJECT_ID)
  throw new Error('Missing IMAGEN_GCP_PROJECT_ID env var');
if (process.env.IMAGEN_ENABLED && !process.env.IMAGEN_REGION)
  throw new Error('Missing IMAGEN_REGION env var');
if (process.env.FIRESTORE_ENABLED && !process.env.FIRESTORE_GCP_PROJECT_ID)
  throw new Error('Missing FIRESTORE_GCP_PROJECT_ID env var');

(async function bootstrap() {
  const app = (await NestFactory.create(AppModule)) as NestExpressApplication;

  const PORT = parseInt(process.env.PORT || '3000');
  const HOST = process.env.HOST || 'localhost';
  const SWAGGER_BASE_PATH = process.env.SWAGGER_BASE_PATH || '/docs';

  app.enableCors({
    origin: (process.env.CORS_ALLOWED_ORIGINS || '').split(','),
  });

  const config = new DocumentBuilder()
    .setTitle('SFEIR - AI-magine')
    .setDescription('SFEIR - AI-magine API description')
    .setVersion(process.env.npm_package_version || '1.0')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config, {});
  SwaggerModule.setup(SWAGGER_BASE_PATH, app, documentFactory, {
    customSiteTitle: 'API - SFEIR - AI-magine',
    customfavIcon: '/static/favicon.ico',
  });

  await app.listen(PORT, HOST);
  console.log(`Server started at  http://${HOST}:${PORT}`);
})();
