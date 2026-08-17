// nestjs 按需加载 大型框架的性能优化、模块化的思考
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // 实例化一个 后端nestjs 应用
  // 工厂模式
  // nest 可以开发的后端服务太多了
  // 首页 由AppModule 这个模块来控制 Module 是一个整体，后端最常见的MVC模式
  // M Model 数据库抽象
  // C Controller 控制器
  // V view 视图层 html

  const app = await NestFactory.create(AppModule);
  // 启动web http 服务，默认端口3000
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
