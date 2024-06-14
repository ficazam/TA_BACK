import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Message } from 'firebase-admin/messaging';
import { appMessaging } from 'src/firebase/firebase';

@Injectable()
export class NotificationService {
  constructor() {}

  public async sendNewOrderNotifications(notificationTokens: string[]) {
    try {
      const notification = {
        title: 'New Order',
        body: 'A new order has been placed!',
      };

      const messages: Message[] = [];
      notificationTokens.forEach((token) => {
        messages.push({
          token,
          notification,
        });
      });

      await appMessaging.sendEach(messages);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Disallowed.');
    }
  }

  public async sendOrderUpdatedNotifications(notificationToken: string) {
    try {
      const notification = {
        title: 'Order Updated',
        body: 'Your order has been updated.',
      };

      const message: Message = {
        token: notificationToken,
        notification,
      };

      await appMessaging.send(message);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Disallowed.');
    }
  }
}
