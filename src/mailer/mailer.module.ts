import { MailerModule as TruthMailerModule } from "@nestjs-modules/mailer";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { join } from "path";
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
    imports: [
        TruthMailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                transport: {
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: config.get<string>('GMAIL_USER'),
                        pass: config.get<string>('GMAIL_PASS')
                    }
                },
                defaults: {
                    from: '"Geogram" <igorich085@gmail.com>'
                },
                template: {
                    dir: join(__dirname, "../../../mail_templates"),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true
                    }
                }
            }),
        })
    ],
    exports: [TruthMailerModule]
})
export class MailerModule {}