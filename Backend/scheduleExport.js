import cron from 'node-cron';
import './exportToExcel';
cron.schedule('0 0 * * *', () => {
    console.log('Starting daily export to Excel...');
});

console.log('Scheduler is set up to run daily at midnight.');
