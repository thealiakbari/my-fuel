import {
	IsString,
	IsNumber,
	IsPositive,
	MaxLength,
	IsOptional,
} from 'class-validator';
import { Organization } from '../entities';

export class CreateOrganizationDto {
	@IsString()
	@MaxLength(255)
	name: string;

	@IsNumber()
	@IsPositive()
	monthlyFuelLimit: number;
}

export class UpdateOrganizationDto {
	@IsOptional()
	@IsString()
	@MaxLength(255)
	name?: string;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	monthlyFuelLimit?: number;
}

export class OrganizationViewDto {
	id: string;
	name: string;
	monthlyFuelLimit: number;

	static fromEntity(entity: Organization): OrganizationViewDto {
		return {
			id: entity.id,
			name: entity.name,
			monthlyFuelLimit: Number(entity.monthlyFuelLimit),
		};
	}
}
