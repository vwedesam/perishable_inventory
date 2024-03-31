import { env } from '../config';
const os = require('os');
const { createLogger, format, transports } = require('winston');
require('winston-syslog');

export const logger = createLogger({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.json(),
  defaultMeta: { service: 'perishable_inventory_server' },
  exitOnError: false
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.simple(),
    }),
  );
  logger.add(new transports.File({ filename: 'logs/error.log', level: 'error' }));
  logger.add(new transports.File({ filename: 'logs/status.log' }));
  logger.exceptions.handle(new transports.File({ filename: 'logs/exceptions.log' }));

}else{
  // log to papertrail
  const options = {
    app_name: "perishable_inventory_server",
    host: 'logs3.papertrailapp.com',
    port: 52516,
    localhost: os.hostname(),
    eol: '\n',
  };

  logger.add(new transports.Syslog(options));
  logger.exceptions.handle(new transports.Syslog(options));

}
