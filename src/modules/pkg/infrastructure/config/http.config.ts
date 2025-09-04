import { ConfigService } from '@nestjs/config';

export interface HttpConfigs {
	port: number;
	hostname: string;
}

export function getHttpConfigs(config: ConfigService): HttpConfigs {
	return {
		port: config.get<number>('CORE_HTTP_PORT', 3000),
		hostname: config.get<string>('CORE_HTTP_HOSTNAME', 'localhost'),
	};
}
