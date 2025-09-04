import { ApiProperty } from '@nestjs/swagger';
import {
	IsString,
	IsNumber,
	IsPositive,
	IsOptional,
	MaxLength,
} from 'class-validator';

export class CreateOrganizationAppDto {
	@ApiProperty({ required: true })
	@IsString()
	@MaxLength(255)
	name: string;

	@ApiProperty({ required: true })
	@IsNumber()
	@IsPositive()
	monthlyFuelLimit: number;
}

export class UpdateOrganizationAppDto {
	@ApiProperty({ required: true })
	@IsOptional()
	@IsString()
	@MaxLength(255)
	name?: string;

	@ApiProperty({ required: true })
	@IsOptional()
	@IsNumber()
	@IsPositive()
	monthlyFuelLimit?: number;
}
