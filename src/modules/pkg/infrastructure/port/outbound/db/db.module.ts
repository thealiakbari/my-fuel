import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization, Card, CardUsage } from './domain/entities';
import {
	CardService,
	CardUsageService,
	OrganizationService,
} from './domain/services';

const services = [OrganizationService, CardService, CardUsageService];

@Module({
	imports: [TypeOrmModule.forFeature([Organization, Card, CardUsage])],
	exports: services,
	providers: services,
})
export class DbModule {}
