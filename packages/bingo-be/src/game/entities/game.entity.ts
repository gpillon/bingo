import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Card } from '../../card/entities/card.entity';
import { IGameStatus, IGameVariant, VARIANTS } from '../game.types';
import { User } from '../../auth/user.entity';
import { GenerateExtractions } from '../../utlis/gen-numbers.funtion';
import { Price } from '../../price/entities/price.entity';

const DEFAULT_VARIANT = IGameVariant.NAPOLETANA;

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  name: string;

  @Column({ default: IGameStatus.CREATED })
  gameStatus: IGameStatus;

  @Column({ default: 1 })
  maxCards: number;

  @Column({ default: '', nullable: true })
  description: string;

  @Column({ default: '', nullable: true })
  image: string;

  @ManyToOne(() => Price, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'cinquinaPriceId' })
  cinquinaPrice: Price | null = null;

  @ManyToOne(() => Price, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'bingoPriceId' })
  bingoPrice: Price | null = null;

  @ManyToOne(() => Price, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'miniBingoPriceId' })
  miniBingoPrice: Price | null = null;

  @Column({ default: DEFAULT_VARIANT })
  variant: IGameVariant;

  @Column({ type: 'int', nullable: false, default: 0 })
  currentNumber: number;

  @Column({ default: new Date().toISOString() })
  createTs: string;

  @Column({ default: '', nullable: true })
  startTs: string;

  @OneToOne(() => Card, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'cinquinaCardId' })
  cinquinaCard: Card | null = null;

  @Column({ default: null, nullable: true })
  cinquinaNumber: number;

  @OneToOne(() => Card, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'bingoCardId' })
  bingoCard: Card | null = null;

  @Column({ default: null, nullable: true })
  bingoNumber: number;

  @OneToOne(() => Card, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'miniBingoCardId' })
  miniBingoCard: Card | null = null;

  @Column({ default: null, nullable: true })
  miniBingoNumber: number;

  @Column({ default: '', nullable: true })
  endTs: string;

  @ManyToOne(() => User, (user) => user.id, { eager: true, nullable: false })
  owner: User;

  @Column({
    type: 'text',
    nullable: false,
  })
  extractions: number[];

  @ManyToMany(() => User, (user) => user.games, { eager: true })
  @JoinTable()
  allowedUsers: User[];

  @OneToMany(() => Card, (card) => card.game, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  cards: Card[];

  extractedNumbers: number[];

  @AfterLoad()
  updateExtractions() {
    try {
      this.extractions = JSON.parse(this.extractions as unknown as string);
    } catch (error) {
      this.extractions = GenerateExtractions(
        VARIANTS[this.variant].min,
        VARIANTS[this.variant].max,
      );
      console.warn('Error updating extracted numbers:', error);
    }
    this.extractedNumbers = [...this.extractions.slice(0, this.currentNumber)];
    this.currentNumber = this.extractedNumbers.length;
  }

  @BeforeUpdate()
  updateExtractionsUpdate() {
    this.extractions = JSON.stringify(this.extractions) as any;
  }

  @BeforeInsert()
  updateExtractionsInsert() {
    this.variant = this.variant || DEFAULT_VARIANT;
    this.extractions = JSON.stringify(
      this.extractions ??
        GenerateExtractions(
          VARIANTS[this.variant].min,
          VARIANTS[this.variant].max,
        ),
    ) as any;
  }
}
