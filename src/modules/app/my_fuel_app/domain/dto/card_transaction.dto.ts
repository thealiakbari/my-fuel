import { ApiProperty } from '@nestjs/swagger';
import {
	IsDateString,
	IsISO8601,
	IsNumber,
	IsOptional,
	IsString,
} from 'class-validator';

export class CardTransactionAppDto {
	@ApiProperty({ required: true })
	@IsString()
	cardCode: string;

	@ApiProperty({ required: true })
	@IsNumber()
	amount: number;

	@ApiProperty({ required: false })
	@IsISO8601()
	@IsOptional()
	date?: string;
}
