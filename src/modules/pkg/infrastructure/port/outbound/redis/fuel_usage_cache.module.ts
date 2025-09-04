import { Module } from '@nestjs/common';
import { FuelUsageCacheService } from './services';
import { RedisModule } from '../../../store';

const services = [FuelUsageCacheService];

@Module({
	imports: [RedisModule],
	providers: services,
	exports: services,
})
export class FuelUsageCacheModule {}
