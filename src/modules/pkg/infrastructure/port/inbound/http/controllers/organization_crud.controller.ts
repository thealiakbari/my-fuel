import { Controller, Get, Post, Patch, Param, Body } from '@nestjs/common';

import { CreateOrganizationAppDto, UpdateOrganizationAppDto } from '@app';
import {
	CardCrudAppService,
	CardUsageCrudAppService,
	OrganizationCrudAppService,
} from '@app';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('X-Organization Crud')
@Controller({ path: 'crud/organizations' })
export class OrganizationCrudController {
	constructor(
		private readonly orgService: OrganizationCrudAppService,
		private readonly cardService: CardCrudAppService,
		private readonly usageService: CardUsageCrudAppService
	) {}

	@Post()
	createOrganization(@Body() dto: CreateOrganizationAppDto) {
		return this.orgService.create(dto);
	}

	@Patch(':id')
	updateOrganization(
		@Param('id') id: string,
		@Body() dto: UpdateOrganizationAppDto
	) {
		return this.orgService.update(id, dto);
	}

	@Get()
	getOrganizations() {
		return this.orgService.findAll();
	}

	@Get(':id')
	getOrganization(@Param('id') id: string) {
		return this.orgService.findOne(id);
	}
}
