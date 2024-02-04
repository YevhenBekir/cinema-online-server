import { ConfigService } from '@nestjs/config';
import { Telegram } from '../../telegram/telegram.interface';

const configService: ConfigService = new ConfigService();

export const getTelegramConfig = (): Telegram => ({
  userId: configService.get('TELEGRAM_USER_ID'),
  chatId: configService.get('TELEGRAM_CHAT_ID'),
  token: configService.get('TELEGRAM_TOKEN'),
});
