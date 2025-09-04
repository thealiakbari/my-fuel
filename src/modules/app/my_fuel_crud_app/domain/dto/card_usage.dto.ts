import { ApiProperty } from '@nestjs/swagger';
import {
	IsNumber,
	IsPositive,
	IsDateString,
	IsOptional,
	IsInt,
} from 'class-validator';

export class CreateCardUsageAppDto {
	@ApiProperty({ required: true })
	@IsInt()
	cardId: string;

	@ApiProperty({ required: true })
	@IsNumber()
	@IsPositive()
	usage: number;

	@ApiProperty({ required: false })
	@IsDateString()
	@IsOptional()
	usageDate?: string;
}

export class UpdateCardUsageAppDto {
	@ApiProperty({ required: true })
	@IsInt()
	cardUsageId: number;

	@ApiProperty({ required: true })
	@IsOptional()
	@IsNumber()
	@IsPositive()
	usage?: number;

	@ApiProperty({ required: false })
	@IsOptional()
	@IsDateString()
	usageDate?: string;
}
