import { Test, TestingModule } from '@nestjs/testing';
import { MyFuelBusinessFlowService } from '@business_flow';
import {
	CardService,
	CardUsageService,
	FuelUsageCacheService,
	OrganizationService,
	CardViewDto,
} from '@port/outbound';

describe('MyFuelBusinessFlowService', () => {
	let service: MyFuelBusinessFlowService;
	let cardService: jest.Mocked<CardService>;
	let cardUsageService: jest.Mocked<CardUsageService>;
	let fuelUsageCacheService: jest.Mocked<FuelUsageCacheService>;

	const trx = {
		cardCode: 'CARD-123',
		amount: 50,
		date: new Date('2025-09-05'),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				MyFuelBusinessFlowService,
				{
					provide: CardService,
					useValue: {
						getCardWithCode: jest.fn(),
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
					provide: FuelUsageCacheService,
					useValue: {
						getCardLimits: jest.fn(),
						getOrgLimits: jest.fn(),
						getDailyUsage: jest.fn(),
						getCardMonthlyUsage: jest.fn(),
						getOrgMonthlyUsage: jest.fn(),
						setCardLimits: jest.fn(),
						setOrgLimits: jest.fn(),
						incrementDailyUsage: jest.fn(),
						incrementCardMonthlyUsage: jest.fn(),
						incrementOrgMonthlyUsage: jest.fn(),
					},
				},
				{
					provide: OrganizationService,
					useValue: {},
				},
			],
		}).compile();

		service = module.get(MyFuelBusinessFlowService);
		cardService = module.get(CardService);
		cardUsageService = module.get(CardUsageService);
		fuelUsageCacheService = module.get(FuelUsageCacheService);
	});

	it('✅ should return true if cache validation passes', async () => {
		fuelUsageCacheService.getCardLimits.mockResolvedValue({
			orgId: 'ORG-1',
			cardDailyLimit: 200,
			cardMonthlyLimit: 500,
		});
		fuelUsageCacheService.getOrgLimits.mockResolvedValue(1000);
		fuelUsageCacheService.getDailyUsage.mockResolvedValue(50);
		fuelUsageCacheService.getCardMonthlyUsage.mockResolvedValue(100);
		fuelUsageCacheService.getOrgMonthlyUsage.mockResolvedValue(200);

		cardService.getCardWithCode.mockResolvedValue({
			id: 'card1',
			cardCode: trx.cardCode,
			dailyFuelLimit: 200,
			monthlyFuelLimit: 500,
			organizationId: 'ORG-1',
			organization: { id: 'ORG-1', monthlyFuelLimit: 1000 },
		} as unknown as CardViewDto);

		const result = await service.processCardTransaction(trx);
		expect(result).toBe(true);
		// eslint-disable-next-line @typescript-eslint/unbound-method
		expect(cardUsageService.create).toHaveBeenCalled();
	});

	it('✅ should fallback to DB validation if cache is missing', async () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		fuelUsageCacheService.getCardLimits.mockResolvedValue(null); // no cache → fallback

		cardService.getCardWithCode.mockResolvedValue({
			id: 'card1',
			cardCode: trx.cardCode,
			dailyFuelLimit: 200,
			monthlyFuelLimit: 500,
			organizationId: 'ORG-1',
			organization: { id: 'ORG-1', monthlyFuelLimit: 1000 },
		} as unknown as CardViewDto);

		cardUsageService.getOrgCurrentMonthUsage.mockResolvedValue(100);
		cardUsageService.getCardMonthUsage.mockResolvedValue(50);
		cardUsageService.getCardDateUsage.mockResolvedValue(20);

		const result = await service.processCardTransaction(trx);
		expect(result).toBe(true);
		// eslint-disable-next-line @typescript-eslint/unbound-method
		expect(cardUsageService.create).toHaveBeenCalled();
	});

	it('❌ should return false if both cache and DB validation fail', async () => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		fuelUsageCacheService.getCardLimits.mockResolvedValue(null);

		cardService.getCardWithCode.mockRejectedValue(new Error('not found'));

		const result = await service.processCardTransaction(trx);
		expect(result).toBe(false);
		// eslint-disable-next-line @typescript-eslint/unbound-method
		expect(cardUsageService.create).not.toHaveBeenCalled();
	});

	it('❌ should return false if org monthly limit exceeded in cache', async () => {
		fuelUsageCacheService.getCardLimits.mockResolvedValue({
			orgId: 'ORG-1',
			cardDailyLimit: 200,
			cardMonthlyLimit: 500,
		});
		fuelUsageCacheService.getOrgLimits.mockResolvedValue(100);
		fuelUsageCacheService.getDailyUsage.mockResolvedValue(50);
		fuelUsageCacheService.getCardMonthlyUsage.mockResolvedValue(100);
		fuelUsageCacheService.getOrgMonthlyUsage.mockResolvedValue(90);

		const result = await service.processCardTransaction(trx);
		expect(result).toBe(false);
	});
});
