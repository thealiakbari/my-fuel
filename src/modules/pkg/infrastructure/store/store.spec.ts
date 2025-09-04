import { Store } from './store';
import { LoggerService, LogLevel } from '../logger';
import { ConfigService } from '@nestjs/config';

const REDIS_HOST = '127.0.0.1';
const REDIS_PORT = 6380;
const REDIS_PASSWORD = '';
const REDIS_DB = 0;

// Helper function for sleep
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Store Tests', () => {
	let store: Store;
	const key = 'testKey';
	const value = { foo: 'bar' };
	const ttl = 1; // 1 seconds

	beforeAll(async () => {
		const redisConf = {
			host: REDIS_HOST,
			port: REDIS_PORT,
			password: REDIS_PASSWORD,
			db: REDIS_DB,
		};
		const confService = new ConfigService({
			LOGGER_LEVEL: LogLevel.TRACE,
		});
		const logService = new LoggerService(confService);
		const storeConf = {
			redisConfig: redisConf,
			loggerService: logService,
		};

		store = await Store.new(storeConf);
	});

	afterAll(async () => {
		await store.shutdown();
	});

	it('should successfully ping the Redis server', async () => {
		const response = await store.ping();
		expect(response).toBe('PONG');
	});

	it('should handle delete on a key that does not exist', async () => {
		const nonExistentKey = 'nonExistentKey';

		// Perform delete operation
		const deleteResult = await store.delete(nonExistentKey);

		// Expect the result to be false (or 0 in Redis) since the key does not exist
		expect(deleteResult).toBe(false);
	});

	it('should set, get, and delete a key-value pair', async () => {
		// Set the key-value pair
		await store.set(key, value, ttl);

		// Get the key-value pair
		const result = await store.get<typeof value>(key);
		expect(result).toEqual(value);

		// Delete the key
		const deleteResult = await store.delete(key);
		expect(deleteResult).toBe(true);

		// Verify that the key is deleted
		const resultAfterDelete = await store.get<typeof value>(key);
		expect(resultAfterDelete).toBeUndefined();
	});

	it('should correctly handle TTL expiration', async () => {
		const testKey = 'ttlTestKey';
		const testValue = { test: 'value' };

		// Set the key with a short TTL
		await store.set(testKey, testValue, ttl);

		// Sleep for TTL + a little extra time to ensure the key has expired
		await sleep((ttl + 1) * 1000); // Convert seconds to milliseconds

		// Attempt to get the key after TTL has expired
		const resultAfterTTL = await store.get<typeof testValue>(testKey);
		expect(resultAfterTTL).toBeUndefined();
	});
});
