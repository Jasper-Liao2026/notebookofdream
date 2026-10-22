import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import {join} from 'path';
import {ServeStaticModule} from "@nestjs/serve-static";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath:join(process.cwd(),"public"),
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}