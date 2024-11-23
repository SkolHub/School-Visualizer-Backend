import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';

function initSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('SchoolHub visualizer API')
    .setDescription(
      'The API endpoints and descriptions of the SchoolHub Visualizer API'
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  initSwagger(app);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}

void bootstrap();
