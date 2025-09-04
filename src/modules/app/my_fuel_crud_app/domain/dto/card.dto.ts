import { ApiProperty } from '@nestjs/swagger';
import {
	IsString,
	IsNumber,
	IsPositive,
	IsOptional,
	MaxLength,
	IsInt,
} from 'class-validator';

export class CreateCardAppDto {
	@ApiProperty({ required: true })
	@IsInt()
	organizationId: number;

	@ApiProperty({ required: true })
	@IsString()
	@MaxLength(50)
	cardCode: string;

	@ApiProperty({ required: true })
	@IsNumber()
	@IsPositive()
	monthlyFuelLimit: number;

	@ApiProperty({ required: true })
	@IsNumber()
	@IsPositive()
	dailyFuelLimit: number;
}

export class UpdateCardAppDto {
	@ApiProperty({ required: true })
	@IsOptional()
	@IsString()
	@MaxLength(50)
	cardCode?: string;

	@ApiProperty({ required: true })
	@IsOptional()
	@IsNumber()
	@IsPositive()
	monthlyFuelLimit?: number;

	@ApiProperty({ required: true })
	@IsOptional()
	@IsNumber()
	@IsPositive()
	dailyFuelLimit?: number;
}
