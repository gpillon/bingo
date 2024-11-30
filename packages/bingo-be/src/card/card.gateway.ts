import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { CardService } from './card.service';
import { QueryParamsDto } from './dto/query-params.dto';

@WebSocketGateway()
export class CardGateway {
  constructor(private readonly cardService: CardService) {}

  // @SubscribeMessage('createCard')
  // create(@MessageBody() createCardDto: CreateCardDto) {
  //   return this.cardService.create(createCardDto);
  // }

  @SubscribeMessage('findAllCard')
  findAll(@MessageBody() params: QueryParamsDto) {
    return this.cardService.findAll(params);
  }

  @SubscribeMessage('findOneCard')
  findOne(@MessageBody() id: number) {
    return this.cardService.findOne(id);
  }

  // @SubscribeMessage('updateCard')
  // update(@MessageBody() updateCardDto: UpdateCardDto) {
  //   return this.cardService.update(
  //     updateCardDto.id,
  //     updateCardDto,
  //   );
  // }

  @SubscribeMessage('removeCard')
  remove(@MessageBody() id: number) {
    return this.cardService.remove(id);
  }
}
