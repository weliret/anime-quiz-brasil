import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    };

    // Log com cores
    const statusColor =
      res.statusCode >= 400 ? '\x1b[31m' : res.statusCode >= 300 ? '\x1b[33m' : '\x1b[32m';
    console.log(
      `${statusColor}${res.statusCode}\x1b[0m ${req.method} ${req.path} - ${duration}ms`
    );

    // Em produção, enviar para serviço de logging (ex: Sentry, CloudWatch)
    if (process.env.NODE_ENV === 'production' && res.statusCode >= 500) {
      console.error('Production Error Log:', log);
    }
  });

  next();
};