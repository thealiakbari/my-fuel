import 'source-map-support/register';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { httpSetup } from './http_setup';
import { HttpConfigs, getHttpConfigs } from '@infra';
import * as pg from 'pg';

let httpConfigs: HttpConfigs;

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const config = app.get(ConfigService);

	pg.types.setTypeParser(1700, (v: any) => parseFloat(v as string));

	httpSetup(app);

	httpConfigs = getHttpConfigs(config);
	await app.listen(httpConfigs.port, httpConfigs.hostname);
}

void bootstrap().then(() => {
	console.log(
		`✅ Swagger Api is serving at: http://${httpConfigs.hostname}:${httpConfigs.port}/api`
	);
	console.log(
		`✅ Postman collection is serving at: http://${httpConfigs.hostname}:${httpConfigs.port}/api-json`
	);
});
