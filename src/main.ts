import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

//base document
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  const config = new DocumentBuilder()
    .setTitle('MS-users-service')
    .setDescription(
      'Microservice to manage user access to fancy applications provided by your awesome company.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.SERVER_PORT || 3000);

  const url = await app.getUrl();
  const logger = new Logger('App');
  logger.log(`Application is running on: ${url} .`);
  logger.log(`Try the application at the following page : ${url}/api .`);
}
bootstrap();
