// routes/wastageRoute.js
import express from 'express';
import { getWastageData, addWastageData, clearWastageData } from '../controllers/wastageController.js';

const wastageRouter = express.Router();

wastageRouter.get('/getWastageData', getWastageData);
wastageRouter.post('/addWastageData', addWastageData);
wastageRouter.delete('/clearWastageData', clearWastageData);

export default wastageRouter;
