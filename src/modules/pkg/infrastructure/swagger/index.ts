import { INestApplication } from '@nestjs/common';
import {
	DocumentBuilder,
	SwaggerCustomOptions,
	SwaggerDocumentOptions,
	SwaggerModule,
} from '@nestjs/swagger';
import { Newable } from '../types/newable';
import { ConfigService } from '@nestjs/config';
import { titleCase } from '@infra';

const swaggerCustomCss = `
	.swagger-ui .opblock .opblock-summary-operation-id, .swagger-ui .opblock .opblock-summary-path, .swagger-ui .opblock .opblock-summary-path__deprecated {
		word-break: unset !important;
	}
`;

export function swaggerDocOption(): SwaggerDocumentOptions {
	return {
		//deepScanRoutes: true,
		operationIdFactory: (
			ctrlName: string,
			methodname: string,
			version: string
		): string => `${ctrlName}.${methodname}(v${version || 1.0})`,
	};
}

function tagSorter(l: string, r: string): number {
	if (l.startsWith('/') && r.startsWith('/')) {
		return l.localeCompare(r);
	}
	if (!l.startsWith('/') && !r.startsWith('/')) {
		return l.localeCompare(r);
	}
	if (!l.startsWith('/')) {
		return -1;
	}
	return 1;
}

function swaggerOptions(service: string): SwaggerCustomOptions {
	return {
		customCss: swaggerCustomCss,
		customSiteTitle: `${service} API Swagger`,
		swaggerOptions: {
			tagsSorter: tagSorter,
			persistAuthorization: true,
			docExpansion: 'none',
			layout: 'StandaloneLayout',
			displayOperationId: true,
			showExtensions: true,
		},
	};
}

export function setupSwagger(
	app: INestApplication,
	httpModules: Newable[],
	setupAuth: boolean
) {
	const config = app.get(ConfigService);
	const serviceName = titleCase(
		config.get<string>('SERVICE_NAME', 'service-name')
	);

	const swgSettings = new DocumentBuilder()
		.setTitle(`${serviceName} Api`)
		.setDescription(`${serviceName} API`)
		.setExternalDoc('Postman Collection', '/api-json')
		.setVersion('1.0');

	if (setupAuth) {
		swgSettings.addBearerAuth();
	}

	const userDocument = SwaggerModule.createDocument(app, swgSettings.build(), {
		include: httpModules,
		...swaggerDocOption(),
	});
	SwaggerModule.setup('api', app, userDocument, swaggerOptions(serviceName));
}
