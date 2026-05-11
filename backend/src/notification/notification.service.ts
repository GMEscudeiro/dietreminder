import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma.service';
import { NotificationsGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private prisma: PrismaService,
    private readonly notificationsGateway: NotificationsGateway,
  ) { }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleMealNotifications() {
    const now = new Date();
    const targetTime = new Date(now.getTime() + 60 * 60 * 1000);

    // Use the day of the target time (in case it crosses midnight)
    const currentDay = targetTime.getDay(); 
    const dayToFilter = currentDay === 0 ? 7 : currentDay;

    // Create UTC windows for 1970-01-01 using LOCAL hours/minutes
    // This is because MealsService stores local time with a 'Z' suffix (literal time)
    const startWindow = new Date(Date.UTC(
      1970, 0, 1, 
      targetTime.getHours(), 
      targetTime.getMinutes(), 
      0, 0
    ));

    const endWindow = new Date(Date.UTC(
      1970, 0, 1, 
      targetTime.getHours(), 
      targetTime.getMinutes(), 
      59, 999
    ));

    this.logger.log(`Checking notifications for day ${dayToFilter} at ${targetTime.getHours()}:${targetTime.getMinutes()} local (${startWindow.toISOString()} in DB)`);

    const allMeals = await this.prisma.refeicoes.findMany({
      include: { dietas: true }
    });
    this.logger.log(`Total meals in DB: ${allMeals.length}`);
    allMeals.forEach(m => {
      this.logger.log(`Meal: ${m.nome}, Time: ${m.horario ? m.horario.toISOString() : 'null'}, Day: ${m.dia_da_semana}, Dieta Ativa: ${m.dietas?.Ativa}`);
    });

    const upcomingMeals = await this.prisma.refeicoes.findMany({
      where: {
        horario: {
          gte: startWindow,
          lte: endWindow,
        },
        OR: [
          { dia_da_semana: dayToFilter },
          { dia_da_semana: 0 },
        ],
        dietas: {
          Ativa: true,
        },
      },
      include: {
        dietas: {
          include: {
            usuarios: true,
          },
        },
      },
    });

    this.logger.log(`Found ${upcomingMeals.length} upcoming meals`);

    if (upcomingMeals.length > 0) {
      upcomingMeals.forEach((meal) => {
        if (meal.dietas && meal.dietas.userId) {
          const userId = meal.dietas.userId;
          const msg = `Sua refeição "${meal.nome}" será em 1 hora!`;
          this.notificationsGateway.sendMealAlert(userId, msg);
        }
      });
    }
  }
}
