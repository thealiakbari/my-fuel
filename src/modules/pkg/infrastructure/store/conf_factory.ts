import { CacheOptions } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { inspect } from 'util';

export async function caheConfigFactory(
	cfg: ConfigService
): Promise<CacheOptions> {
	try {
		const redis = await redisStore({
			socket: {
				host: cfg.get<string>('DB_REDIS_HOST'),
				port: cfg.get<number>('DB_REDIS_PORT'),
			},
			password: cfg.get<string>('DB_REDIS_PASSWORD'),
			database: cfg.get<number>('DB_REDIS_DB'),
		});

		console.debug('Connected to REDIS');
		await redis.set('sdfsdf', 'sssss', undefined, undefined);
		console.debug(
			'Connected to REDIS',
			await redis.get('sdfsdf', undefined, undefined)
		);
		return {
			stores: [redis],
		};
	} catch (err) {
		console.error('Connect to REDIS failed', inspect(err, true, 10, true));
		throw err;
	}
}

// import * as redisStore from 'cache-manager-redis-store';

// export function caheConfigFactory(configService: ConfigService): CacheOptions {
// 	return {
// 		store: redisStore,
// 		host: configService.get<string>('DB_REDIS_HOST'),
// 		port: configService.get<number>('DB_REDIS_PORT'),
// 		password: configService.get<string>('DB_REDIS_PASSWORD'),
// 		db: configService.get<number>('DB_REDIS_DB', 0),
// 		ttl: 600, // optional default TTL
// 	};
// }
