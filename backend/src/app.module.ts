import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MealsModule } from './meals/meals.module';
import { AuthModule } from './auth/auth.module';
import { FoodsModule } from './foods/foods.module';
import { DietsModule } from './diets/diets.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [ScheduleModule.forRoot(), UsersModule, MealsModule, AuthModule, FoodsModule, DietsModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
