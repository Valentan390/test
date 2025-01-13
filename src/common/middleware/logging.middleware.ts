import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, url } = req;
    const startTime = Date.now();

    res.on('finish', () => {
      const statusCode = res.statusCode;
      const responseTime = Date.now() - startTime;
      this.logger.log(`${method} ${url} ${statusCode} - ${responseTime}ms`);
    });

    next();
  }
}
