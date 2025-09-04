import {
	Injectable,
	NotFoundException,
	ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization, Card } from '../entities';
import { CreateCardDto, UpdateCardDto, CardViewDto } from '../dto';
import { isDuplicateError } from '@infra/utils';

@Injectable()
export class CardService {
	constructor(
		@InjectRepository(Card)
		private readonly cardRepo: Repository<Card>,
		@InjectRepository(Organization)
		private readonly orgRepo: Repository<Organization>
	) {}

	async create(dto: CreateCardDto): Promise<CardViewDto> {
		const organization = await this.orgRepo.findOne({
			where: { id: String(dto.organizationId) },
		});
		if (!organization)
			throw new NotFoundException(
				`Organization ${dto.organizationId} not found`
			);

		try {
			const card = this.cardRepo.create({
				...dto,
				organization,
			});
			const saved = await this.cardRepo.save(card);
			return CardViewDto.fromEntity(saved);
		} catch (err: any) {
			if (
				isDuplicateError(err) &&
				err.code === '23505' &&
				err.constraint === 'UQ_card_cardCode'
			) {
				throw new ConflictException(
					`Card code "${dto.cardCode}" already exists`
				);
			}
			throw err;
		}
	}

	async update(id: string, dto: UpdateCardDto): Promise<CardViewDto> {
		const card = await this.cardRepo.findOne({ where: { id } });
		if (!card) throw new NotFoundException(`Card ${id} not found`);
		Object.assign(card, dto);
		try {
			const saved = await this.cardRepo.save(card);
			return CardViewDto.fromEntity(saved);
		} catch (err: any) {
			if (
				isDuplicateError(err) &&
				err.code === '23505' &&
				err.constraint === 'UQ_card_cardCode'
			) {
				throw new ConflictException(
					`Card code "${dto.cardCode}" already exists`
				);
			}
			throw err;
		}
	}

	async findAll(): Promise<CardViewDto[]> {
		const list = await this.cardRepo.find({ relations: ['organization'] });
		return list.map((entity) => CardViewDto.fromEntity(entity));
	}

	async findOne(id: string): Promise<CardViewDto> {
		const card = await this.cardRepo.findOne({
			where: { id },
			relations: ['organization'],
		});
		if (!card) throw new NotFoundException(`Card ${id} not found`);
		return CardViewDto.fromEntity(card);
	}

	async getCardWithCode(cardCode: string): Promise<CardViewDto> {
		const card = await this.cardRepo.findOne({
			where: { cardCode },
			relations: ['organization'],
		});
		if (!card) throw new NotFoundException(`Card ${cardCode} not found`);
		return CardViewDto.fromEntity(card);
	}
}
