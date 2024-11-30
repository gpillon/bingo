import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { UsersService } from './auth/users.service';
import { AppModule } from './app.module';
import { CardService } from './card/card.service';
import { GameService } from './game/game.service';
import { IGameVariant } from './game/game.types';
async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usersService = app.get(UsersService);
  const gameService = app.get(GameService);
  const cardService = app.get(CardService);

  // Seed Users
  const users = [
    {
      username: 'admin',
      password: 'admin',
      role: 'admin',
      name: 'Admin',
      email: 'admin@admin.com',
    },
    {
      username: 'user1',
      password: 'password1',
      role: 'user',
      name: 'User 1',
      email: 'user1@user.com',
    },
    {
      username: 'user2',
      password: 'password2',
      role: 'user',
      name: 'User 2',
      email: 'user2@user.com',
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    const existingUser = await usersService.findOneByUsername(user.username);
    if (existingUser) {
      console.log(`User ${user.username} already exists`);
      continue;
    }
    await usersService.create({ ...user, password: hashedPassword });
  }

  const dbUsers = await usersService.findAll();

  console.log('Users seeded');

  for (let i = 0; i < 20; i++) {
    const variant =
      Object.values(IGameVariant)[
        Math.floor(Math.random() * Object.values(IGameVariant).length)
      ];

    await gameService.create({
      name: `Game ${i}`,
      description: `Description ${i}`,
      variant,
      owner: dbUsers[Math.floor(Math.random() * /*users.length*/ 1)],
      allowedUsers: dbUsers.filter(() => Math.random() < 0.8),
    });
  }

  console.log('Games seeded');
  // Seed Cards
  const games = await gameService.findAll();

  for (const game of games) {
    const cardsCount = game.maxCards; // 5 to 20 cards per game
    for (let i = 0; i < cardsCount; i++) {
      const currentDate = new Date();
      const twoMonthsAgo = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 2,
        currentDate.getDate(),
      );
      const date = new Date(
        twoMonthsAgo.getTime() +
          Math.random() * (currentDate.getTime() - twoMonthsAgo.getTime()),
      );
      await cardService.create({
        date,
        gameId: game.id,
        owner: dbUsers[Math.floor(Math.random() * users.length)],
      });
    }
  }

  console.log('Cards seeded');

  await app.close();
  console.log('Seeding completed');
}
seed();
