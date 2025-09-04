import {
	CardService,
	CardUsageService,
	CardViewDto,
	FuelUsageCacheService,
	OrganizationService,
} from '@port/outbound';
import { Injectable } from '@nestjs/common';
import { CardTransaction } from '../domain';

@Injectable()
export class MyFuelBusinessFlowService {
	constructor(
		private readonly organizationService: OrganizationService,
		private readonly cardService: CardService,
		private readonly cardUsageService: CardUsageService,
		private readonly fuelUsageCacheService: FuelUsageCacheService
	) {}

	async processCardTransaction(trx: CardTransaction): Promise<boolean> {
		try {
			const cacheValidation = await this.cacheValidation(trx);

			if (cacheValidation === true) {
				await this.updateUsage(trx);
				return true;
			}

			if (cacheValidation === false) {
				return false;
			}

			console.log('[FuelFlow] Fallback to DB validation for trx:', trx);

			const dbValidation = await this.dbValidation(trx);
			if (dbValidation) {
				await this.updateUsage(trx);
				return true;
			}

			return false;
		} catch (err) {
			console.log('[FuelFlow] Transaction failed:', trx, err);
			return false;
		}
	}

	private async cacheValidation(
		trx: CardTransaction
	): Promise<boolean | 'no_cached'> {
		const cardLimits = await this.fuelUsageCacheService.getCardLimits(
			trx.cardCode
		);
		if (!cardLimits) return 'no_cached';

		const orgMonthlyLimit = await this.fuelUsageCacheService.getOrgLimits(
			cardLimits.orgId
		);
		if (orgMonthlyLimit === undefined) return 'no_cached';

		const cardDailyUsage = await this.fuelUsageCacheService.getDailyUsage(
			trx.cardCode,
			trx.date
		);
		const cardMonthlyUsage =
			await this.fuelUsageCacheService.getCardMonthlyUsage(
				trx.cardCode,
				trx.date
			);
		const orgMonthlyUsage = await this.fuelUsageCacheService.getOrgMonthlyUsage(
			cardLimits.orgId,
			trx.date
		);

		const allCached =
			cardDailyUsage !== undefined &&
			cardMonthlyUsage !== undefined &&
			orgMonthlyUsage !== undefined;

		if (!allCached) return 'no_cached';

		if (orgMonthlyUsage + trx.amount > orgMonthlyLimit) return false;
		if (cardMonthlyUsage + trx.amount > cardLimits.cardMonthlyLimit)
			return false;
		if (cardDailyUsage + trx.amount > cardLimits.cardDailyLimit) return false;

		return true;
	}

	private async dbValidation(trx: CardTransaction): Promise<boolean> {
		let card: CardViewDto;
		try {
			card = await this.cardService.getCardWithCode(trx.cardCode);
		} catch {
			return false;
		}
		if (!card.organization) return false;

		try {
			const orgUsage = await this.cardUsageService.getOrgCurrentMonthUsage(
				card.organization.id,
				trx.date
			);
			const cardMonthlyUsage = await this.cardUsageService.getCardMonthUsage(
				card.id,
				trx.date
			);
			const cardDailyUsage = await this.cardUsageService.getCardDateUsage(
				card.id,
				trx.date
			);

			if (orgUsage + trx.amount > card.organization.monthlyFuelLimit)
				return false;
			if (cardMonthlyUsage + trx.amount > card.monthlyFuelLimit) return false;
			if (cardDailyUsage + trx.amount > card.dailyFuelLimit) return false;

			return true;
		} catch {
			return false;
		}
	}

	private async updateUsage(trx: CardTransaction): Promise<void> {
		const card = await this.cardService.getCardWithCode(trx.cardCode);
		if (!card.organization) throw new Error('Card has no organization');

		await this.cardUsageService.create({
			cardId: card.id,
			usage: trx.amount,
			usageDate: trx.date.toISOString().slice(0, 10),
		});

		await this.fuelUsageCacheService.setCardLimits(card.cardCode, {
			orgId: card.organizationId,
			cardDailyLimit: card.dailyFuelLimit,
			cardMonthlyLimit: card.monthlyFuelLimit,
		});

		await this.fuelUsageCacheService.setOrgLimits(
			card.organizationId,
			card.organization.monthlyFuelLimit
		);

		await this.fuelUsageCacheService.incrementDailyUsage(
			trx.cardCode,
			trx.date,
			trx.amount
		);
		await this.fuelUsageCacheService.incrementCardMonthlyUsage(
			trx.cardCode,
			trx.date,
			trx.amount
		);
		await this.fuelUsageCacheService.incrementOrgMonthlyUsage(
			card.organization.id,
			trx.date,
			trx.amount
		);
	}
}
