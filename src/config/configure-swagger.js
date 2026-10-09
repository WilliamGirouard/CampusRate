import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
export function configureSwagger(app) {
    const config = new DocumentBuilder()
        .setTitle('CampusRate API')
        .setDescription('REST API that let you review places on a Campus and browse them')
        .setVersion('1.0.0')
        .addTag('Places', 'Places management')
        .addTag('Reviews', 'Reviews management')
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, documentFactory, {
        jsonDocumentUrl: 'docs/openapi.json',
        customSiteTitle: 'CampusRate - Documentation',
    });
}
//# sourceMappingURL=configure-swagger.js.map