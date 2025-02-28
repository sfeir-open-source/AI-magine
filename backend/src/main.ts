import { NestFactory } from '@nestjs/core';
import { config } from 'dotenv';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

config();

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
