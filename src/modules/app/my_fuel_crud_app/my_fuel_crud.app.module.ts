import { Module } from '@nestjs/common';
import {
	CardCrudAppService,
	CardUsageCrudAppService,
	OrganizationCrudAppService,
} from './services';
import { DbModule } from '@port/outbound/db';

const services = [
	OrganizationCrudAppService,
	CardCrudAppService,
	CardUsageCrudAppService,
];

@Module({
	imports: [DbModule],
	exports: services,
	providers: services,
})
export class MyFuelCrudAppModule {}
