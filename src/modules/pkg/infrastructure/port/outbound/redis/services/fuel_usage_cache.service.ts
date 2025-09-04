import { Injectable } from '@nestjs/common';
import { Store } from '../../../../store';

export interface CardLimitSnapshot {
	cardMonthlyLimit: number;
	cardDailyLimit: number;
	orgId: string;
}

@Injectable()
export class FuelUsageCacheService {
	constructor(private store: Store) {}

	async getDailyUsage(cardCode: string, date: Date): Promise<number> {
		const key = this.dailyUsageKey(cardCode, date);
		const value = await this.store.get<number>(key);
		return value ?? 0;
	}

	async incrementDailyUsage(
		cardCode: string,
		date: Date,
		amount: number
	): Promise<number> {
		const key = this.dailyUsageKey(cardCode, date);
		const current = await this.getDailyUsage(cardCode, date);
		const updated = current + amount;
		await this.store.set(key, updated, 172800); // 2 days
		return updated;
	}

	// 🔹 Card Limits

	async setCardLimits(
		cardCode: string,
		limits: CardLimitSnapshot
	): Promise<void> {
		const key = this.cardLimitsKey(cardCode);
		await this.store.set(key, limits, 2592000); // 30 days
	}

	async getCardLimits(
		cardCode: string
	): Promise<CardLimitSnapshot | undefined> {
		const key = this.cardLimitsKey(cardCode);
		return await this.store.get<CardLimitSnapshot>(key);
	}

	// 🔹 Org Limits

	async setOrgLimits(orgId: string, monthlyFuelLimit: number): Promise<void> {
		const key = this.orgLimitsKey(orgId);
		await this.store.set(key, monthlyFuelLimit, 2592000); // 30 days
	}

	async getOrgLimits(orgId: string): Promise<number | undefined> {
		const key = this.orgLimitsKey(orgId);
		return await this.store.get<number>(key);
	}

	async getOrgMonthlyUsage(orgId: string, date: Date): Promise<number> {
		const key = this.orgMonthlyUsageKey(orgId, date);
		return (await this.store.get<number>(key)) ?? 0;
	}

	async incrementOrgMonthlyUsage(
		orgId: string,
		date: Date,
		amount: number
	): Promise<number> {
		const key = this.orgMonthlyUsageKey(orgId, date);
		const current = await this.getOrgMonthlyUsage(orgId, date);
		const updated = current + amount;
		await this.store.set(key, updated, 2678400); // ~31 days
		return updated;
	}

	async getCardMonthlyUsage(cardCode: string, date: Date): Promise<number> {
		const key = this.cardMonthlyUsageKey(cardCode, date);
		return (await this.store.get<number>(key)) ?? 0;
	}

	async incrementCardMonthlyUsage(
		cardCode: string,
		date: Date,
		amount: number
	): Promise<number> {
		const key = this.cardMonthlyUsageKey(cardCode, date);
		const current = await this.getCardMonthlyUsage(cardCode, date);
		const updated = current + amount;
		await this.store.set(key, updated, 2678400); // ~31 days
		return updated;
	}

	// Internal Key Composition

	private cardMonthlyUsageKey(cardCode: string, date: Date): string {
		const monthStr = date.toISOString().slice(0, 7); // YYYY-MM
		return `card:${cardCode}:usage:${monthStr}`;
	}

	private dailyUsageKey(cardCode: string, date: Date): string {
		const dateStr = date.toISOString().slice(0, 10); // YYYY-MM-DD
		return `card:${cardCode}:usage:${dateStr}`;
	}

	private cardLimitsKey(cardCode: string): string {
		return `card:${cardCode}:limits`;
	}

	private orgLimitsKey(orgId: string): string {
		return `org:${orgId}:limits`;
	}

	private orgMonthlyUsageKey(orgId: string, date: Date): string {
		const monthStr = date.toISOString().slice(0, 7); // YYYY-MM
		return `org:${orgId}:usage:${monthStr}`;
	}
}
