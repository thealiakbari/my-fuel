import { MyFuelBusinessFlowModule } from '@business_flow';
import { Module } from '@nestjs/common';
import { MyFuelAppService } from './services';

const services = [MyFuelAppService];

@Module({
	imports: [MyFuelBusinessFlowModule],
	providers: services,
	exports: services,
})
export class MyFuelAppModule {}
