import {
	IsString,
	IsNumber,
	IsPositive,
	MaxLength,
	IsOptional,
	IsInt,
} from 'class-validator';
import { Card } from '../entities';
import { OrganizationViewDto } from './organization.dto';

export class CreateCardDto {
	@IsInt()
	organizationId: number; // FK

	@IsString()
	@MaxLength(50)
	cardCode: string;

	@IsNumber()
	@IsPositive()
	monthlyFuelLimit: number;

	@IsNumber()
	@IsPositive()
	dailyFuelLimit: number;
}

export class UpdateCardDto {
	@IsOptional()
	@IsString()
	@MaxLength(50)
	cardCode?: string;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	monthlyFuelLimit?: number;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	dailyFuelLimit?: number;
}

export class CardViewDto {
	id: string;
	organizationId: string;
	organization?: OrganizationViewDto;
	cardCode: string;
	monthlyFuelLimit: number;
	dailyFuelLimit: number;

	static fromEntity(entity: Card): CardViewDto {
		return {
			id: entity.id,
			organizationId: entity.organization?.id ?? '',
			organization: entity.organization
				? OrganizationViewDto.fromEntity(entity.organization)
				: undefined,
			cardCode: entity.cardCode,
			monthlyFuelLimit: entity.monthlyFuelLimit,
			dailyFuelLimit: entity.dailyFuelLimit,
		};
	}
}
