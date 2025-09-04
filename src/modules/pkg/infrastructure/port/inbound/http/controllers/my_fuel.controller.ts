import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { MyFuelAppService, CardTransactionAppDto } from '@app';

@Controller()
export class MyFuelController {
	constructor(private readonly myFuelAppService: MyFuelAppService) {}

	@Post('card-transaction')
	@HttpCode(200)
	async cardTransaction(@Body() dto: CardTransactionAppDto): Promise<string> {
		const res = await this.myFuelAppService.cardTransaction(dto);
		return res;
	}
}
