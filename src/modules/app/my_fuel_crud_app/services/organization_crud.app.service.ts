import { Injectable } from '@nestjs/common';
import { OrganizationService } from '@port/outbound/db';
import { CreateOrganizationAppDto, UpdateOrganizationAppDto } from '../domain';

@Injectable()
export class OrganizationCrudAppService {
	constructor(private readonly orgService: OrganizationService) {}

	create(dto: CreateOrganizationAppDto) {
		return this.orgService.create(dto);
	}

	update(id: string, dto: UpdateOrganizationAppDto) {
		return this.orgService.update(id, dto);
	}

	findAll() {
		return this.orgService.findAll();
	}

	findOne(id: string) {
		return this.orgService.findOne(id);
	}
}
