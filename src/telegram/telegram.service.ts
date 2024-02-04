import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

import { Telegram } from './telegram.interface';
import { getTelegramConfig } from '../common/config/telegram.config';

@Injectable()
export class TelegramService {
  bot: Telegraf;
  options: Telegram;

  constructor() {
    this.options = getTelegramConfig();
    this.bot = new Telegraf(this.options.token);
  }

  async sendMessage(
    message: string,
    options?: ExtraReplyMessage,
    chatId: string = this.options.chatId,
  ): Promise<void> {
    // TODO: create functional for auto-send message for all
    const userId: string = this.options.userId;

    if (userId) {
      await this.bot.telegram.sendMessage(userId, message, {
        // If message will have HTML - HTML will be parsed
        parse_mode: 'HTML',
        ...options,
      });
    } else {
      console.log('User not found !');
    }
  }

  async sendPhoto(image: string, message?: string, chatId: string = this.options.chatId): Promise<void> {
    // TODO: create functional for auto-send image for all
    const userId: string = this.options.userId;

    if (userId) {
      await this.bot.telegram.sendPhoto(
        userId,
        image,
        message
          ? {
              caption: message,
            }
          : {},
      );
    } else {
      console.log('User not found !');
    }
  }
}
