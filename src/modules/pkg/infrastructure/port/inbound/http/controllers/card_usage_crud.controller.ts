import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateCardUsageAppDto, UpdateCardUsageAppDto } from '@app';
import { CardUsageCrudAppService } from '@app';

@ApiTags('X-Card Uase Crud')
@Controller({ path: 'crud/usages' })
export class CardUsagesCrudController {
	constructor(private readonly usageService: CardUsageCrudAppService) {}

	@Post()
	createUsage(@Body() dto: CreateCardUsageAppDto) {
		return this.usageService.create(dto);
	}

	@Patch(':id')
	updateUsage(@Param('id') id: string, @Body() dto: UpdateCardUsageAppDto) {
		return this.usageService.update(id, dto);
	}

	@Get()
	getUsages() {
		return this.usageService.findAll();
	}

	@Get(':id')
	getUsage(@Param('id') id: string) {
		return this.usageService.findOne(id);
	}
}
