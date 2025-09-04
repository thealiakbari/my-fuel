import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	OneToMany,
	JoinColumn,
	Index,
	Unique,
} from 'typeorm';
import { Organization } from './organization.entity';
import { CardUsage } from './card_usage.entity';

@Entity({ name: 'cards' })
@Unique('uq_card_cardcode', ['cardCode'])
export class Card {
	@PrimaryGeneratedColumn('increment', { type: 'bigint' })
	id: string;

	@Index()
	@ManyToOne(() => Organization, (organization) => organization.cards, {
		onDelete: 'CASCADE',
	})
	@JoinColumn({ name: 'organization_id' })
	organization: Organization;

	@Column({ type: 'varchar', length: 50 })
	cardCode: string; // Provided by card writer hardware

	@Column({ type: 'numeric', precision: 12, scale: 2 })
	monthlyFuelLimit: number;

	@Column({ type: 'numeric', precision: 12, scale: 2 })
	dailyFuelLimit: number;

	@OneToMany(() => CardUsage, (usage) => usage.card, { cascade: ['remove'] })
	usages: CardUsage[];
}
