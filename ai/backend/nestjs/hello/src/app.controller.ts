import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('/ 的控制器');
    //响应什么内容？交给service层
    //this -> module的实例对象
    return this.appService.getHello();  
  }
}
