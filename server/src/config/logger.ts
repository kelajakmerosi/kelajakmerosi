import { randomUUID } from 'crypto';
import pino from 'pino';
import pinoHttp from 'pino-http';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie'],
    remove: true,
  },
});

const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => (req.headers['x-request-id'] as string) || randomUUID(),
  customProps: (req: any) => ({
    route: req.originalUrl,
    method: req.method,
    userId: req.user?.id,
  }),
  customLogLevel: (_req, res, err) => {
    if (err || res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
});

export { logger, httpLogger };
