import { Injectable } from '@nestjs/common';
import { IGameVariant, IGameVariantT, VARIANTS } from '../game/game.types';

@Injectable()
export class ConstantsService {
  gameVariants(): { [k in IGameVariant]: IGameVariantT } {
    return {
      ...VARIANTS,
    };
  }
}
