import { Module } from '@nestjs/common';
import { MyFuelAppModule, MyFuelCrudAppModule } from '@app';
import {
	MyFuelController,
	OrganizationCrudController,
	CardCrudController,
	CardUsagesCrudController,
} from './controllers';

@Module({
	imports: [MyFuelCrudAppModule, MyFuelAppModule],
	controllers: [
		MyFuelController,
		OrganizationCrudController,
		CardCrudController,
		CardUsagesCrudController,
	],
})
export class HttpModule {}
