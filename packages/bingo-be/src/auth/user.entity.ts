import { Card } from '../card/entities/card.entity';
import { Game } from '../game/entities/game.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  name: string;

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @OneToMany(() => Game, (game) => game.owner, {
    nullable: false,
  })
  gamesOwner?: Game[];

  @ManyToMany(() => Game, (game) => game.allowedUsers)
  games?: Game[];

  @OneToMany(() => Card, (card) => card.owner)
  cards?: Card[];

  // Add other user properties as needed
}
