import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Redirect } from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiExcludeEndpoint()
  @Redirect('/api')
  redir() {}

  @Get('/healtz')
  getHealtz(): string {
    return this.appService.getHealtz();
  }
}
