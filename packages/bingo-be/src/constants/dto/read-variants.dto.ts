import { IGameVariant, IGameVariantT } from '../../game/game.types';

type GameVariants = { [k in IGameVariant]: IGameVariantT };

export class ReadVariantsDto implements GameVariants {
  RedHat: IGameVariantT;
  RedHatIta: IGameVariantT;
  Italian: IGameVariantT;
  English: IGameVariantT;
  Napoletana: IGameVariantT;
  Romano: IGameVariantT;
  Milanese: IGameVariantT;
}
