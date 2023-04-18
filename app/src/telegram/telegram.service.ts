import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { ITelegramConfig } from './telegram.interface';
import { getTelegramConfig } from 'src/config/telegram.config';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

@Injectable()
export class TelegramService {
    bot: Telegraf;
    options: ITelegramConfig;

    constructor(private readonly configService: ConfigService) {
        this.options = getTelegramConfig(configService);
        this.bot = new Telegraf(this.options.token);
    }

    async sendMessage(
        message: string,
        options?: ExtraReplyMessage,
        chatId: string = this.options.chatId,
    ) {
        await this.bot.telegram.sendMessage(chatId, message, {
            parse_mode: 'HTML',
            ...options,
        });
    }

    async sendPhoto(
        photo: string,
        message?: string,
        chatId: string = this.options.chatId,
    ) {
        await this.bot.telegram.sendPhoto(
            chatId,
            photo,
            message
                ? {
                      caption: message,
                  }
                : {},
        );
    }
}
