import { Module } from '@nestjs/common';
//控制器，检测前端用户输入，一些控制逻辑
import { AppController } from './app.controller';
//数据库业务，一些复杂业务 CRUD service层
import { AppService } from './app.service';

@Module({
  imports: [],//依赖外界模块，如数据库模块，缓存模块等
  controllers: [AppController],//控制器 校验，简单逻辑
  providers: [AppService],//data service 复杂业务
})
export class AppModule {}
