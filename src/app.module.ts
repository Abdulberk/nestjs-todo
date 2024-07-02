import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TodoModule } from './todo/todo.module';
import { LoggerModule, ConfigModule } from '@app/common';
import { DatabaseModule } from '@app/common/database/database.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule,
    UserModule,
    AuthModule,
    TodoModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
