import { MyFuelBusinessFlowService } from '@business_flow';
import { Injectable } from '@nestjs/common';
import { CardTransactionAppDto } from '../domain';
import { dateFromStr } from '@infra';

@Injectable()
export class MyFuelAppService {
	constructor(private readonly myFuelBfService: MyFuelBusinessFlowService) {}

	async cardTransaction(trx: CardTransactionAppDto) {
		const date = this.resolveTransactionDate(trx.date);
		const approved = await this.myFuelBfService.processCardTransaction({
			amount: trx.amount,
			cardCode: trx.cardCode,
			date,
		});

		return approved ? 'success' : 'rejected';
	}

	private resolveTransactionDate(dateStr?: string): Date {
		return dateStr ? dateFromStr(dateStr) : new Date();
	}
}
