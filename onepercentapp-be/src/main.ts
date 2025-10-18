import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger, ValidationPipe} from '@nestjs/common';
import * as bodyParser from 'body-parser';
const fileUpload = require('express-fileupload');
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {ResponseFormatInterceptor} from "./common/interceptors/response-format.interceptor";
import {ValidationExceptionPipe} from "./common/pipes/validation-exeption.pipe";
import { useContainer } from 'class-validator';
import * as multer from 'multer';
import {NestExpressApplication} from "@nestjs/platform-express";
import {join} from "path";

/**
 * Print the start logo
 */
function printStartLogo(){
  const logger = new Logger('Main');

  logger.debug("             ,:::://///,:::-.");
  logger.debug("           /:''/////// ``:::`;/|/");
  logger.debug("          /'   ||||||     :://'`\\");
  logger.debug("        .' ,   ||||||     `/(  e \\");
  logger.debug("  -===~__-'__X_`````_____/~`-._ `.");
  logger.debug("             ~~        ~~       `~-'");
  logger.log(process.env.API_NAME + " - Armadillo Amarillo S.L. (C)");
  logger.log("App listening on port " + process.env.API_PORT + "...");
}

async function bootstrap() {
  // Create app
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Global pipes
  app.useGlobalPipes(new ValidationExceptionPipe());
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // <-- Necesario para que funcione @Type()
    whitelist: true, // Recomendado para ignorar campos no esperados
  }));

  // Interceptors
  app.useGlobalInterceptors(new ResponseFormatInterceptor());

  // Files limits
  app.use(bodyParser.json({ limit: '5000mb' }));
  app.use(bodyParser.urlencoded({ limit: '5000mb', extended: true }));

  // CORS
  app.enableCors();
  // app.enableCors({
  //   origin: ['https://midominio.com', 'https://otrodominio.com'], // Dominios permitidos
  //   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
  //   allowedHeaders: ['Content-Type', 'Authorization'], // Headers permitidos
  //   credentials: true, // Permitir envío de cookies o autenticación
  // });

  // HTML Views
  // Configuración del motor de vistas
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // Ruta a tus plantillas .hbs
  app.setViewEngine('hbs'); // Muy importante

  // Swagger
  const config = new DocumentBuilder()
      .setTitle('API Documentation: '+process.env.API_NAME)
      .setDescription('The API Swagger documentation for '+process.env.API_NAME)
      .setVersion('1.0')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Run server
  await app.listen(process.env.API_PORT ?? 3000);

  // Print system logo
  printStartLogo();

}
bootstrap();
