import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MealsModule } from './meals/meals.module';
import { AuthModule } from './auth/auth.module';
import { FoodsModule } from './foods/foods.module';
import { DietsModule } from './diets/diets.module';

@Module({
  imports: [UsersModule, MealsModule, AuthModule, FoodsModule, DietsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
