// reportRoutes.js
import express from 'express';
import { generateReport, getAllReports, downloadReport } from '../controllers/reportController.js';

const reportRouter = express.Router();

reportRouter.get('/generateReport', generateReport);
reportRouter.get('/getAllReports', getAllReports);
reportRouter.get('/download/:fileName', downloadReport); 

export default reportRouter;
