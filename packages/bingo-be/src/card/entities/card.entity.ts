import { Game } from '../../game/entities/game.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  BeforeInsert,
  AfterLoad,
} from 'typeorm';
import { GenerateExtractions } from '../../utlis/gen-numbers.funtion';
import { User } from '../../auth/user.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('datetime', { default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'text', nullable: false })
  numbers: string;

  @Column({ nullable: false })
  gameId: number;

  @ManyToOne(() => User, (user) => user.cards, {
    onDelete: 'CASCADE',
    eager: true,
    nullable: false,
  })
  owner: User;

  @ManyToOne(() => Game, (game) => game.cards, {
    onDelete: 'CASCADE',
    eager: true,
  })
  game: Game;

  @BeforeInsert()
  updateExtractionsInsert() {
    this.numbers = JSON.stringify(
      this.numbers ??
        GenerateExtractions(1, 90)
          .slice(0, 25)
          .sort((a, b) => a - b),
    ) as any;
  }
  @AfterLoad()
  updateExtractionsAfterLoad() {
    this.numbers = JSON.parse(this.numbers) as any;
  }
}
