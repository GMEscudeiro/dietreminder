import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationsGateway } from './notification.gateway';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [],
  providers: [NotificationService, NotificationsGateway, PrismaService],
  exports: [NotificationService, NotificationsGateway],
})
export class NotificationModule { }
