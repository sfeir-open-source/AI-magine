import {
  utilities as nestWinstonModuleUtilities,
  WinstonModuleOptions,
} from 'nest-winston';
import * as winston from 'winston';

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      nestWinstonModuleUtilities.format.nestLike(
        process.env.npm_package_name || 'APP_NAME',
        {
          colors: true,
          prettyPrint: true,
        }
      )
    ),
  }),
];

transports.push(
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  })
);

transports.push(
  new winston.transports.File({
    filename: 'logs/info.log',
    level: 'info',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  })
);

export const loggerConfig: WinstonModuleOptions = {
  transports,
  level: 'info',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
};
