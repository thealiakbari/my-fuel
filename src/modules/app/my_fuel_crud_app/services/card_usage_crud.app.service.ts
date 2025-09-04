import { Injectable } from '@nestjs/common';
import { CardUsageService } from '@port/outbound/db';
import { CreateCardUsageAppDto, UpdateCardUsageAppDto } from '../domain';

@Injectable()
export class CardUsageCrudAppService {
	constructor(private readonly usageService: CardUsageService) {}

	create(dto: CreateCardUsageAppDto) {
		return this.usageService.create(dto);
	}

	update(id: string, dto: UpdateCardUsageAppDto) {
		return this.usageService.update(id, dto);
	}

	findAll() {
		return this.usageService.findAll();
	}

	findOne(id: string) {
		return this.usageService.findOne(id);
	}
}
