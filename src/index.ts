// import "reflect-metadata";
import app from './app';
import { env } from './config';
import { logger } from './middleware';
const cron = require('node-cron');
const { spawn } = require('child_process');

// Schedule the cleanup job to run every 5 minutes
cron.schedule('0 */5 * * * *', () => {
  console.log('Running cleanup job...');
  const cleanupProcess = spawn('npm', ['run', 'db:cleanup'], { stdio: 'inherit' });

  cleanupProcess.on('close', (code: any) => {
    if (code === 0) {
      console.log('Cleanup job completed successfully.');
    } else {
      console.error(`Cleanup job failed with exit code ${code}.`);
    }
  });
});

const server = app.listen(parseInt(env.PORT), () => {
  logger.log('info', `Server is running on Port: ${env.PORT}`);
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received.');
  logger.info('Closing http server.');
  server.close((err) => {
    logger.info('Http server closed.');
    process.exit(err ? 1 : 0);
  });
});
