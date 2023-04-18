import { ConfigService } from '@nestjs/config';
import { ITelegramConfig } from 'src/telegram/telegram.interface';

export const getTelegramConfig = (
    configService: ConfigService,
): ITelegramConfig => {
    return {
        chatId: configService.get('TELEGRAM_CHAT_ID'),
        token: configService.get('TELEGRAM_BOT_TOKEN'),
    };
};
