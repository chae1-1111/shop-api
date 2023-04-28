import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export default function setUpSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Beauti Mall API Docs')
    .setDescription('Beauti Mall API description')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
}