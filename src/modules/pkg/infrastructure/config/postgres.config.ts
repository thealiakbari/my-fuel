import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { inspect } from 'util';
import { SnakeNamingStrategy } from '@infra';

export function postgresConfigFactory(
	configService: ConfigService
): TypeOrmModuleOptions {
	const dbConf: TypeOrmModuleOptions = {
		type: 'postgres',
		host: configService.get<string>('DB_POSTGRES_HOST'),
		port: configService.get<number>('DB_POSTGRES_PORT'),
		username: configService.get<string>('DB_POSTGRES_USER'),
		password: configService.get<string>('DB_POSTGRES_PASSWORD'),
		database: configService.get<string>('DB_POSTGRES_DATABASE'),
		applicationName:
			configService.get<string>('SERVICE_NAME', 'SVC_NAME') +
			'_' +
			configService.get<string>('ENV_MODE', 'ENV_MODE'),
		schema:
			configService.get<string | undefined>('DB_POSTGRES_SCHEMA') || 'public',
		namingStrategy: new SnakeNamingStrategy(),
		logging: configService.get<boolean>('DB_POSTGRES_LOGGING', true),
		// These are mandatory now
		autoLoadEntities: configService.get<boolean>(
			'DB_POSTGRES_AUTO_LOAD_ENTITIES',
			true
		),
		migrationsRun: configService.get<boolean>(
			'DB_POSTGRES_MIGRATIONS_RUN',
			true
		),
		synchronize: configService.get<boolean>('DB_POSTGRES_SYNCHRONIZE', true),

		toRetry: (err: any) => {
			console.error('Connect to database failed', inspect(err, true, 10, true));
			return false;
		},
	};
	return dbConf;
}
