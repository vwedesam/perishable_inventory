import app from './app';
import { env } from './config';
import { logger } from './middleware';
const cron = require('node-cron');
const { spawn } = require('child_process');

// Schedule the cleanup job to run every 60 minutes(1hr)
cron.schedule('0 */60 * * * *', () => {
  logger.info('Running cleanup job...');
  const cleanupProcess = spawn('npm', ['run', 'db:cleanup'], { stdio: 'inherit' });

  cleanupProcess.on('close', (code: any) => {
    if (code === 0) {
      logger.info('Cleanup job completed successfully.');
    } else {
      logger.error(`Cleanup job failed with exit code ${code}.`);
    }
  });
});

const server = app.listen(parseInt(env.PORT), () => {
  logger.info(`Server running on port: ${env.PORT}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received.');
  logger.info('Closing http server.');
  server.close((err) => {
    logger.info('Http server closed.');
    process.exit(err ? 1 : 0);
  });
});

process.on('uncaughtException', (ex) => {
  logger.error(`Uncaught Exception: ${ex.message}`, ex);
  process.exit(1); // Optionally, exit the process after logging the exception
});

// Log unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection:', reason);
  logger.error('Unhandled Rejection at:', promise);
});
