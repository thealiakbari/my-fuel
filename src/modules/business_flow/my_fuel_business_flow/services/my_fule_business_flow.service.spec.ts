import { Test, TestingModule } from '@nestjs/testing';
import { MyFuelBusinessFlowService } from './my_fule_business_flow.service';
import {
	CardService,
	FuelUsageCacheService,
	CardUsageService,
	OrganizationService,
} from '@port/outbound';

describe('MyFuelBusinessFlowService', () => {
	let service: MyFuelBusinessFlowService;
	let fuelUsageCacheService: FuelUsageCacheService;
	let cardService: CardService;
	let cardUsageService: CardUsageService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MyFuelBusinessFlowService,
				{
					provide: CardService,
					useValue: { getCardWithCode: jest.fn() },
				},
				{
					provide: FuelUsageCacheService,
					useValue: {
						getCardLimits: jest.fn(),
						getOrgLimits: jest.fn(),
						getDailyUsage: jest.fn(),
						incrementDailyUsage: jest.fn(),
						incrementCardMonthlyUsage: jest.fn(),
						incrementOrgMonthlyUsage: jest.fn(),
						getCardMonthlyUsage: jest.fn(),
						getOrgMonthlyUsage: jest.fn(),
					},
				},
				{
					provide: CardUsageService,
					useValue: {
						getOrgCurrentMonthUsage: jest.fn(),
						getCardMonthUsage: jest.fn(),
						getCardDateUsage: jest.fn(),
						create: jest.fn(),
					},
				},
				{
					provide: OrganizationService,
					useValue: { deductBalance: jest.fn() },
				},
			],
		}).compile();

		service = module.get(MyFuelBusinessFlowService);
		cardService = module.get(CardService);
		fuelUsageCacheService = module.get(FuelUsageCacheService);
		cardUsageService = module.get(CardUsageService);
	});

	it('should return true if all limits are valid', async () => {
		const trx = { cardCode: 'ABC123', amount: 50, date: new Date() };

		jest.spyOn(fuelUsageCacheService, 'getCardLimits').mockResolvedValue({
			cardDailyLimit: 100,
			cardMonthlyLimit: 500,
			orgId: 'ORG1',
		});

		jest.spyOn(fuelUsageCacheService, 'getOrgLimits').mockResolvedValue(1000);
		jest.spyOn(fuelUsageCacheService, 'getDailyUsage').mockResolvedValue(20);
		jest
			.spyOn(fuelUsageCacheService, 'getCardMonthlyUsage')
			.mockResolvedValue(200);
		jest
			.spyOn(fuelUsageCacheService, 'getOrgMonthlyUsage')
			.mockResolvedValue(400);

		const result = await service['cacheValidation'](trx);
		expect(result).toBe(true);
	});

	it('should process transaction and update usage if cache validation passes', async () => {
		const trx = { cardCode: 'ABC123', amount: 50, date: new Date() };

		jest.spyOn(service as any, 'cacheValidation').mockResolvedValue(true);
		jest.spyOn(service as any, 'updateUsage').mockResolvedValue(undefined);

		const result = await service.processCardTransaction(trx);
		expect(result).toBe(true);
	});

	it('should fallback to DB validation if cache returns no_cached', async () => {
		const trx = { cardCode: 'ABC123', amount: 50, date: new Date() };

		jest
			.spyOn(service as any, 'cacheValidation')
			.mockResolvedValue('no_cached');
		jest.spyOn(service as any, 'dbValidation').mockResolvedValue(true);
		jest.spyOn(service as any, 'updateUsage').mockResolvedValue(undefined);

		const result = await service.processCardTransaction(trx);
		expect(result).toBe(true);
	});

	it('should reject transaction if limits exceeded', async () => {
		const trx = { cardCode: 'ABC123', amount: 9999, date: new Date() };

		jest.spyOn(service as any, 'cacheValidation').mockResolvedValue(false);

		const result = await service.processCardTransaction(trx);
		expect(result).toBe(false);
	});

	it('should update usage in DB and Redis', async () => {
		const trx = { cardCode: 'ABC123', amount: 50, date: new Date() };
		const card = { id: 'card1', organization: { id: 'org1' } };

		jest.spyOn(cardService, 'getCardWithCode').mockResolvedValue(card);
		jest.spyOn(cardUsageService, 'create').mockResolvedValue(undefined);
		jest
			.spyOn(fuelUsageCacheService, 'incrementDailyUsage')
			.mockResolvedValue(70);
		jest
			.spyOn(fuelUsageCacheService, 'incrementCardMonthlyUsage')
			.mockResolvedValue(250);
		jest
			.spyOn(fuelUsageCacheService, 'incrementOrgMonthlyUsage')
			.mockResolvedValue(450);

		await service['updateUsage'](trx);

		expect(cardUsageService.create).toHaveBeenCalledWith({
			cardId: 'card1',
			usage: 50,
			usageDate: trx.date.toISOString().slice(0, 10),
		});

		expect(fuelUsageCacheService.incrementDailyUsage).toHaveBeenCalledWith(
			'ABC123',
			trx.date,
			50
		);
		expect(
			fuelUsageCacheService.incrementCardMonthlyUsage
		).toHaveBeenCalledWith('ABC123', trx.date, 50);
		expect(fuelUsageCacheService.incrementOrgMonthlyUsage).toHaveBeenCalledWith(
			'org1',
			trx.date,
			50
		);
	});
});
