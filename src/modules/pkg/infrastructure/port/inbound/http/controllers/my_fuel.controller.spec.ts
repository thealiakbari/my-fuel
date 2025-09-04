import { Test, TestingModule } from '@nestjs/testing';
import { MyFuelController } from './my_fuel.controller';
import { MyFuelAppService, CardTransactionAppDto } from '@app';
import { ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { inspect } from 'node:util';

describe('MyFuelController', () => {
	let app: INestApplication;
	let businessFlowService: MyFuelAppService;

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			controllers: [MyFuelController],
			providers: [
				{
					provide: MyFuelAppService,
					useValue: {
						cardTransaction: jest.fn(),
					},
				},
			],
		}).compile();

		businessFlowService = moduleRef.get(MyFuelAppService);

		app = moduleRef.createNestApplication();
		app.useGlobalPipes(
			new ValidationPipe({
				transform: true,
				skipMissingProperties: false,
				validationError: { target: false },
				stopAtFirstError: false,
			})
		);
		await app.init();
	});

	afterEach(async () => {
		await app.close();
	});

	it('should return accepted: true for valid transaction', async () => {
		(businessFlowService.cardTransaction as jest.Mock).mockResolvedValue(true);

		const payload: CardTransactionAppDto = {
			cardCode: 'ABC123',
			amount: 50,
			date: new Date().toISOString(),
		};

		const res = await request(app.getHttpServer())
			.post('/card-transaction')
			.send(payload)
			.expect(200);
		expect(res.body).toEqual('success');
		expect(businessFlowService.cardTransaction).toHaveBeenCalledWith(payload);
	});

	it('should return accepted: false if business logic rejects transaction', async () => {
		(businessFlowService.cardTransaction as jest.Mock).mockResolvedValue(false);

		const payload: CardTransactionAppDto = {
			cardCode: 'ABC123',
			amount: 9999,
			date: new Date().toISOString(),
		};

		const res = await request(app.getHttpServer())
			.post('/card-transaction')
			.send(payload)
			.expect(200);
		console.log(
			'#should return accepted: false if business logic rejects transaction',
			res.body,
			res.status
		);
		expect(res.body).toEqual('rejected');
	});

	it('should return 400 for invalid payload', async () => {
		const invalidPayload = {
			amount: 50,
			date: new Date().toISOString(),
		};

		const res = await request(app.getHttpServer())
			.post('/card-transaction')
			.send(invalidPayload)
			.expect(400);

		expect(res.body.message).toMatchObject(['cardCode must be a string']);
	});
});
