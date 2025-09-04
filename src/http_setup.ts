import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpModule, setupSwagger } from '@infra';
import { ValidationException } from './modules/pkg/infrastructure/types/errors';

export function httpSetup(app: INestApplication<unknown>): void {
	setupSwagger(app, [HttpModule], true);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			skipMissingProperties: false,
			validationError: { target: false },
			exceptionFactory: (errors) => new ValidationException(errors),
			stopAtFirstError: false,
		})
	);

	app.enableCors({
		allowedHeaders: [
			'DNT',
			'User-Agent',
			'X-Requested-With',
			'If-Modified-Since',
			'Cache-Control',
			'Content-Type',
			'Range',
			'Accept',
			'Authorization',
		],
		exposedHeaders: 'Authorization',
		origin: '*',
		methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'PUT'],
		credentials: true,
		maxAge: 1728000,
		preflightContinue: false,
		optionsSuccessStatus: 204,
	});
}
