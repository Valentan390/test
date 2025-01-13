import { Injectable, Logger } from '@nestjs/common';
import { createTransport, SendMailOptions } from 'nodemailer';
// import 'dotenv/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transport;

  constructor() {
    const { UKR_NET_PASSWORD, UKR_NET_FROM } = process.env;

    if (!UKR_NET_FROM || !UKR_NET_PASSWORD) {
      throw new Error(
        'Email configuration is missing in environment variables',
      );
    }

    this.transport = createTransport({
      host: 'smtp.ukr.net',
      port: 465,
      secure: true,
      auth: {
        user: UKR_NET_FROM,
        pass: UKR_NET_PASSWORD,
      },
    });
  }

  async sendEmail(data: SendMailOptions): Promise<void> {
    const { UKR_NET_FROM } = process.env;

    const email = { ...data, from: UKR_NET_FROM };

    try {
      const result = await this.transport.sendMail(email);
      this.logger.log(`Email sent successfully to ${data.to}`);
      this.logger.debug(`Email details: ${JSON.stringify(result)}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${data.to}`, error.stack);
      throw error;
    }
  }
}
