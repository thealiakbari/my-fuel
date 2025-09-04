import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToMany,
	Index,
} from 'typeorm';
import { Card } from './card.entity';
import { Unique } from 'typeorm';

@Entity({ name: 'organizations' })
@Unique('uq_org_name', ['name'])
export class Organization {
	@PrimaryGeneratedColumn('increment', { type: 'bigint' })
	id: string; // bigint in PG → string in TS to avoid precision loss

	@Index({ unique: true })
	@Column({ type: 'varchar', length: 255 })
	name: string;

	@Column({ type: 'numeric', precision: 12, scale: 2 })
	monthlyFuelLimit: number;

	@OneToMany(() => Card, (card: Card) => card.organization, {
		cascade: ['remove'],
	})
	cards: Card[];
}
