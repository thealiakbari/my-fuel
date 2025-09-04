import { Module } from '@nestjs/common';
import { DbModule, FuelUsageCacheModule } from '@port/outbound';
import { MyFuelBusinessFlowService } from './services';

const services = [MyFuelBusinessFlowService];

@Module({
	imports: [DbModule, FuelUsageCacheModule],
	providers: services,
	exports: services,
})
export class MyFuelBusinessFlowModule {}
