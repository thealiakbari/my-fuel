import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Store as CMStore } from 'cache-manager';
import { inspect } from 'node:util';

@Injectable()
export class Store {
	private serviceName!: string;

	constructor(
		@Inject(CACHE_MANAGER)
		private readonly cacheManager: Cache,
		private readonly configService: ConfigService
	) {
		console.log('>>>> GOT IT ', inspect(cacheManager, true, 10, true));
		// @ ts-expect-error so
		// cacheManager.store.sores[0].opts.store.set('_________', 'ok');
		cacheManager.set('_________', 'ok');
		this.serviceName = this.configService.get<string>('SERVICE_NAME', '');
	}

	async get<T>(key: string): Promise<T | undefined> {
		try {
			const data = await this.cacheManager.get(`${this.serviceName}_${key}`);
			if (data === null) {
				return undefined;
			}

			return data as T;
		} catch (err) {
			console.error("Can't get key from redis", err, {
				key: `${this.serviceName}_${key}`,
			});
			throw err;
		}
	}

	async set<T>(key: string, value: T, ttl?: number): Promise<void> {
		try {
			await this.cacheManager.set(`${this.serviceName}_${key}`, value, ttl);
			console.debug('Set func redis', {
				[`${this.serviceName}_${key}`]: value,
			});
		} catch (err) {
			console.error("Can't set key on redis", err, {
				[`${this.serviceName}_${key}`]: value,
			});
			throw err;
		}
	}

	async delete(key: string): Promise<boolean> {
		try {
			await this.cacheManager.del(`${this.serviceName}_${key}`);
			return true;
		} catch (err) {
			console.error('delete key on redis faile', err, {
				key: `${this.serviceName}_${key}`,
			});
			throw new Error(`Failed to delete key from Redis: ${err}`);
		}
	}

	async ping(): Promise<boolean> {
		try {
			await this.cacheManager.store.keys('*');
			return true;
		} catch (err) {
			console.error('ping on redis faile', err);
			throw new Error(`Ping failed: ${err}`);
		}
	}

	get store(): CMStore {
		return this.cacheManager.store;
	}
}
