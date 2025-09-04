import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	ManyToOne,
	JoinColumn,
	Index,
} from 'typeorm';
import { Card } from './card.entity';

@Entity({ name: 'card_usages' })
@Index(['card', 'usageDate']) // Composite index for fast lookups by card & date
export class CardUsage {
	@PrimaryGeneratedColumn('increment', { type: 'bigint' })
	id: string;

	@Index()
	@ManyToOne(() => Card, (card) => card.usages, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'card_id' })
	card: Card;

	@Column({ type: 'numeric', precision: 12, scale: 2 })
	usage: number;

	@Index()
	@Column({ type: 'date', default: () => 'CURRENT_DATE' })
	usageDate: string;
}
