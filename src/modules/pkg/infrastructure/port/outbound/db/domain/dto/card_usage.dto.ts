import {
	IsNumber,
	IsPositive,
	IsDateString,
	IsInt,
	IsOptional,
} from 'class-validator';
import { CardUsage } from '../entities';

export class CreateCardUsageDto {
	@IsInt()
	cardId: string; // FK

	@IsNumber()
	@IsPositive()
	usage: number;

	@IsDateString()
	@IsOptional()
	usageDate?: string; // YYYY-MM-DD
}

export class UpdateCardUsageDto {
	@IsInt()
	cardUsageId: number;

	@IsOptional()
	@IsNumber()
	@IsPositive()
	usage?: number;

	@IsOptional()
	@IsDateString()
	usageDate?: string;
}

export class CardUsageViewDto {
	id: string;
	cardId: string;
	usage: number;
	usageDate: string;

	static fromEntity(entity: CardUsage): CardUsageViewDto {
		return {
			id: entity.id,
			cardId: entity.card?.id ?? '',
			usage: Number(entity.usage),
			usageDate: entity.usageDate,
		};
	}
}
