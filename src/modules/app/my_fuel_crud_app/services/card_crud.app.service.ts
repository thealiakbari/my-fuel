import { Injectable } from '@nestjs/common';
import { CardService } from '@port/outbound/db';
import { CreateCardAppDto, UpdateCardAppDto } from '../domain';

@Injectable()
export class CardCrudAppService {
	constructor(private readonly cardService: CardService) {}

	create(dto: CreateCardAppDto) {
		return this.cardService.create(dto);
	}

	update(id: string, dto: UpdateCardAppDto) {
		return this.cardService.update(id, dto);
	}

	findAll() {
		return this.cardService.findAll();
	}

	findOne(id: string) {
		return this.cardService.findOne(id);
	}
}
