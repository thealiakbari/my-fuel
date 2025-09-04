import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardUsage, Card } from '../entities';
import {
	CreateCardUsageDto,
	UpdateCardUsageDto,
	CardUsageViewDto,
} from '../dto';
import { dateToStr, thisMonthStartEnd } from '@infra/utils';

@Injectable()
export class CardUsageService {
	constructor(
		@InjectRepository(CardUsage)
		private readonly usageRepo: Repository<CardUsage>,
		@InjectRepository(Card)
		private readonly cardRepo: Repository<Card>
	) {}

	async create(dto: CreateCardUsageDto): Promise<CardUsageViewDto> {
		const card = await this.cardRepo.findOne({
			where: { id: String(dto.cardId) },
		});
		if (!card) throw new NotFoundException(`Card ${dto.cardId} not found`);

		const usage = this.usageRepo.create({
			...dto,
			card,
		});
		const saved = await this.usageRepo.save(usage);
		return CardUsageViewDto.fromEntity(saved);
	}

	async update(id: string, dto: UpdateCardUsageDto): Promise<CardUsageViewDto> {
		const usage = await this.usageRepo.findOne({
			where: { id },
			relations: ['card'],
		});
		if (!usage) throw new NotFoundException(`Card usage ${id} not found`);
		Object.assign(usage, dto);
		const saved = await this.usageRepo.save(usage);
		return CardUsageViewDto.fromEntity(saved);
	}

	async findAll(): Promise<CardUsageViewDto[]> {
		const list = await this.usageRepo.find({ relations: ['card'] });
		return list.map((entity) => CardUsageViewDto.fromEntity(entity));
	}

	async findOne(id: string): Promise<CardUsageViewDto> {
		const usage = await this.usageRepo.findOne({
			where: { id },
			relations: ['card'],
		});
		if (!usage) throw new NotFoundException(`Card usage ${id} not found`);
		return CardUsageViewDto.fromEntity(usage);
	}

	async getCardMonthUsage(cardId: string, date: Date): Promise<number> {
		const currentMonth = thisMonthStartEnd(date);
		const total = await this.usageRepo
			.createQueryBuilder('usage')
			.select('SUM(usage.usage)', 'total')
			.where('usage.card_id = :cardId', { cardId })
			.andWhere('usage.usageDate BETWEEN :from AND :to', {
				from: currentMonth.start,
				to: currentMonth.end,
			})
			.getRawOne<{ total: number }>();

		return Number(total?.total ?? 0);
	}

	async getCardDateUsage(cardId: string, date: Date): Promise<number> {
		const today = dateToStr(date);
		const total = await this.usageRepo
			.createQueryBuilder('usage')
			.select('SUM(usage.usage)', 'total')
			.where('usage.card_id = :cardId', { cardId })
			.andWhere('usage.usageDate = :today', { today })
			.getRawOne<{ total: number }>();

		return Number(total?.total ?? 0);
	}

	async getOrgCurrentMonthUsage(orgId: string, date: Date): Promise<number> {
		const currentMonth = thisMonthStartEnd(date);
		const result = await this.usageRepo
			.createQueryBuilder('usage')
			.select('SUM(usage.usage)', 'total')
			.innerJoin('usage.card', 'card')
			.innerJoin('card.organization', 'org')
			.where('org.id = :orgId', { orgId })
			.andWhere('usage.usageDate BETWEEN :from AND :to', {
				from: currentMonth.start,
				to: currentMonth.end,
			})
			.getRawOne<{ total: number }>();

		return Number(result?.total ?? 0);
	}
}
