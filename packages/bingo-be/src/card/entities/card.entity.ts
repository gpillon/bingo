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

  @ManyToOne(() => User, (user) => user.cards, {
    eager: true,
    nullable: false,
  })
  owner: User;

  @ManyToOne(() => Game, (game) => game.cards, {
    eager: true,
    onDelete: 'CASCADE',
  })
  game: Game;

  @BeforeInsert()
  updateExtractionsInsert() {
    this.numbers = JSON.stringify(
      this.numbers ??
        (() => {
          class RandTools {
            dist_rand: number[] = [];
            // Inizializza l'array interno sequenzialmente con interi
            distRandInit(end, start = 0) {
              this.dist_rand = [];
              for (let i = start; i < end; i++) {
                this.dist_rand.push(i);
              }
            }

            // Ottiene casualmente un elemento dall'array e lo rimuove
            distRandNext() {
              return this.dist_rand.splice(
                Math.floor(Math.random() * this.dist_rand.length),
                1,
              )[0];
            }
          }

          const tools = new RandTools();
          const extract_pool = [];
          const card = [[], [], []];

          // Inizializzo un array per colonna
          for (let i = 0; i < 9; i++) {
            extract_pool[i] = new RandTools();
            extract_pool[i].distRandInit(i * 10 + 11, i * 10 + 1);
          }

          // Estrazione per ogni riga
          for (let i = 0; i < 9; i++) {
            card[0].push(extract_pool[i].distRandNext());
            card[1].push(extract_pool[i].distRandNext());
            card[2].push(extract_pool[i].distRandNext());
          }

          // Buco la prima riga
          tools.distRandInit(9);
          for (let i = 0; i < 4; i++) card[0][tools.distRandNext()] = -1;

          // Buco la seconda riga
          tools.distRandInit(9);
          for (let i = 0; i < 4; i++) card[1][tools.distRandNext()] = -1;

          // Buco la terza riga in funzione delle righe
          // precendenti (ogni colonna deve avere almeno un numero)
          tools.distRandInit(9);
          let buchi = 0;
          while (buchi < 4) {
            const hit = tools.distRandNext();

            if (card[0][hit] != -1 || card[1][hit] != -1) {
              card[2][hit] = -1;
              buchi++;
            }
          }

          // Sort numbers within each column
          for (let col = 0; col < 9; col++) {
            const numbers = [card[0][col], card[1][col], card[2][col]]
              .filter(n => n !== -1)
              .sort((a, b) => a - b);
            let numIndex = 0;
            for (let row = 0; row < 3; row++) {
              if (card[row][col] !== -1) {
                card[row][col] = numbers[numIndex++];
              }
            }
          }
          return card;
        })(),
    );
  }

  @AfterLoad()
  updateExtractionsAfterLoad() {
    this.numbers = JSON.parse(this.numbers) as any;
  }
}
