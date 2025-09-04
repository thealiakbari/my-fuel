import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';

import { CreateCardAppDto, UpdateCardAppDto } from '@app';
import { CardCrudAppService } from '@app';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('X-Card Crud')
@Controller('crud/cards')
export class CardCrudController {
	constructor(private readonly cardService: CardCrudAppService) {}

	@Post()
	createCard(@Body() dto: CreateCardAppDto) {
		return this.cardService.create(dto);
	}

	@Patch(':id')
	updateCard(@Param('id') id: string, @Body() dto: UpdateCardAppDto) {
		return this.cardService.update(id, dto);
	}

	@Get('cards')
	getCards() {
		return this.cardService.findAll();
	}

	@Get(':id')
	getCard(@Param('id') id: string) {
		return this.cardService.findOne(id);
	}
}
