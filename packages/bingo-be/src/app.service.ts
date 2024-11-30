import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealtz(): string {
    return 'OK';
  }
}
