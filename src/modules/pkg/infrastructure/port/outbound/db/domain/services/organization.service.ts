import {
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities';
import {
	CreateOrganizationDto,
	UpdateOrganizationDto,
	OrganizationViewDto,
} from '../dto';
import { isDuplicateError } from '@infra/utils';

@Injectable()
export class OrganizationService {
	constructor(
		@InjectRepository(Organization)
		private readonly orgRepo: Repository<Organization>
	) {}

	async create(dto: CreateOrganizationDto): Promise<OrganizationViewDto> {
		try {
			const org = this.orgRepo.create(dto);
			const saved = await this.orgRepo.save(org);
			return OrganizationViewDto.fromEntity(saved);
		} catch (err) {
			if (
				isDuplicateError(err) &&
				err.code === '23505' &&
				err.constraint === 'uq_org_name'
			) {
				throw new ConflictException(
					`Organization name "${dto.name}" already exists`
				);
			}
			throw err;
		}
	}

	async update(
		id: string,
		dto: UpdateOrganizationDto
	): Promise<OrganizationViewDto> {
		const org = await this.orgRepo.findOne({ where: { id } });
		if (!org) throw new NotFoundException(`Organization ${id} not found`);
		Object.assign(org, dto);
		const saved = await this.orgRepo.save(org);
		return OrganizationViewDto.fromEntity(saved);
	}

	async findAll(): Promise<OrganizationViewDto[]> {
		const list = await this.orgRepo.find();
		return list.map((entity) => OrganizationViewDto.fromEntity(entity));
	}

	async findOne(id: string): Promise<OrganizationViewDto> {
		const org = await this.orgRepo.findOne({ where: { id } });
		if (!org) throw new NotFoundException(`Organization ${id} not found`);
		return OrganizationViewDto.fromEntity(org);
	}
}
